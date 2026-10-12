/// <reference types="node" />
import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { test } from 'node:test';

import { createRegistrationService, type PasswordTools } from '../src/features/auth/registration';
import { createSessionService, restoreSession } from '../src/features/auth/session';
import { validateSignup } from '../src/features/auth/validation';
import { AUTH_KEYS, createAuthStorage, parseSession, parseUsers, type KeyValueStorage } from '../src/storage/auth-storage';
import type { SignupInput } from '../src/types/auth';

const input: SignupInput = { name: '  Cuenta de prueba  ', email: '  DEMO@example.test ', password: ' demo12345 ', confirmation: ' demo12345 ' };
const passwords: PasswordTools = {
  createId: () => `user-${randomUUID()}`,
  createSalt: async () => randomBytes(16).toString('hex'),
  hash: async (password, salt) => createHash('sha256').update(`${salt}:${password}`).digest('hex'),
};
function setup() {
  const data = new Map<string, string>();
  let failKey: string | null = null;
  let commitBeforeFailure = false;
  let writes = 0;
  const store: KeyValueStorage = {
    removeItem: async key => {
      if (key === failKey) { failKey = null; if (commitBeforeFailure) data.delete(key); throw new Error('Controlled removal failure'); }
      data.delete(key);
    },
    getItem: async key => data.get(key) ?? null,
    setItem: async (key, value) => {
      writes++;
      if (key === failKey) {
        failKey = null;
        if (commitBeforeFailure) data.set(key, value);
        throw new Error('Controlled write failure');
      }
      data.set(key, value);
    },
  };
  const repository = createAuthStorage(store);
  return { data, repository, register: createRegistrationService(repository, passwords),
    failNext: (key: string, committed = false) => { failKey = key; commitBeforeFailure = committed; },
    writes: () => writes,
  };
}

test('required fields, email, eight characters, matching confirmation', () => {
  assert.deepEqual(Object.keys(validateSignup({ name: ' ', email: '', password: '', confirmation: '' })), ['name', 'email', 'password', 'confirmation']);
  assert.ok(validateSignup({ ...input, email: 'a@b', password: '1234567', confirmation: '1234567' }).email);
  assert.ok(validateSignup({ ...input, password: '1234567', confirmation: '1234567' }).password);
  assert.ok(validateSignup({ ...input, confirmation: 'different' }).confirmation);
  assert.deepEqual(validateSignup({ ...input, password: '12345678', confirmation: '12345678' }), {});
});
test('success persists normalized user and session, only salt/verifier, password preserved exactly', async () => {
  const s = setup();
  const result = await s.register(input);
  assert.equal(result.status, 'success');
  assert.equal(s.writes(), 2);
  const users = await s.repository.readUsers();
  assert.equal(users.length, 1);
  const user = users[0];
  assert.equal(user.email, 'demo@example.test');
  assert.equal(user.name, 'Cuenta de prueba');
  assert.match(user.passwordSalt, /^[a-f0-9]{32}$/);
  assert.equal(user.passwordVerifier, await passwords.hash(input.password, user.passwordSalt));
  assert.notEqual(user.passwordVerifier, await passwords.hash(input.password.trim(), user.passwordSalt));
  assert.deepEqual(Object.keys(user).sort(), ['email', 'id', 'name', 'passwordSalt', 'passwordVerifier']);
  assert.equal(s.data.get(AUTH_KEYS.users)?.includes(input.password), false);
  assert.deepEqual(await s.repository.readSession(users), { userId: user.id });
  // New service/repository reads the same persisted records after simulated restart.
  assert.equal(parseUsers(s.data.get(AUTH_KEYS.users) ?? null)[0].id, user.id);
});
test('duplicate email rejected despite different case/outer whitespace; no additional writes', async () => {
  const s = setup();
  await s.register(input);
  const result = await s.register({ ...input, email: 'DEMO@EXAMPLE.TEST' });
  assert.equal(result.status, 'invalid');
  if (result.status === 'invalid') assert.ok(result.errors.email);
  assert.equal(s.writes(), 2);
});
test('user write failure before commit: no session/success, retry creates one account', async () => {
  const s = setup(); s.failNext(AUTH_KEYS.users);
  assert.equal((await s.register(input)).status, 'error');
  assert.equal(s.data.size, 0);
  assert.equal((await s.register(input)).status, 'success');
  assert.equal((await s.repository.readUsers()).length, 1);
});
test('user write rejected after commit: retry recognizes pending ID without duplicating', async () => {
  const s = setup(); s.failNext(AUTH_KEYS.users, true);
  assert.equal((await s.register(input)).status, 'error');
  const originalId = (await s.repository.readUsers())[0].id;
  assert.equal(s.data.has(AUTH_KEYS.session), false);
  assert.equal((await s.register(input)).status, 'success');
  assert.equal((await s.repository.readUsers())[0].id, originalId);
  assert.equal((await s.repository.readUsers()).length, 1);
});
test('session failure: account saved notice, retry only session; wrong password cannot resume', async () => {
  const s = setup(); s.failNext(AUTH_KEYS.session);
  const result = await s.register(input);
  assert.equal(result.status, 'account-saved');
  const user = (await s.repository.readUsers())[0];
  assert.equal((await s.register({ ...input, password: 'wrong1234', confirmation: 'wrong1234' })).status, 'invalid');
  assert.equal(s.writes(), 2);
  assert.equal((await s.register(input)).status, 'success');
  assert.equal(s.writes(), 3);
  assert.equal((await s.repository.readUsers())[0].id, user.id);
});
test('session rejected after commit: no false success, safe retry', async () => {
  const s = setup(); s.failNext(AUTH_KEYS.session, true);
  assert.equal((await s.register(input)).status, 'account-saved');
  assert.equal((await s.register(input)).status, 'success');
  assert.equal((await s.repository.readUsers()).length, 1);
});
test('invalid JSON/data and duplicates are preserved, not overwritten', async () => {
  for (const bad of ['{', '{}', '[{"password":"plaintext"}]']) {
    const s = setup(); s.data.set(AUTH_KEYS.users, bad);
    assert.equal((await s.register(input)).status, 'error');
    assert.equal(s.data.get(AUTH_KEYS.users), bad);
    assert.equal(s.writes(), 0);
  }
  const s = setup(); await s.register(input);
  const raw = JSON.stringify([...(await s.repository.readUsers()), ...(await s.repository.readUsers())]);
  assert.throws(() => parseUsers(raw));
  s.data.set(AUTH_KEYS.session, '{');
  assert.equal((await s.register({ ...input, email: 'other@example.test' })).status, 'error');
  assert.equal(s.writes(), 2);
});
test('missing data and orphaned session return no session; invalid session rejected', () => {
  assert.deepEqual(parseUsers(null), []);
  assert.equal(parseSession(null, []), null);
  assert.equal(parseSession('{"userId":"user-missing"}', []), null);
  assert.throws(() => parseSession('{"userId":42}', []));
});
test('concurrent submissions cannot create duplicate accounts', async () => {
  const s = setup();
  const results = await Promise.all([s.register(input), s.register(input)]);
  assert.equal(results.filter(result => result.status === 'success').length, 1);
  assert.equal((await s.repository.readUsers()).length, 1);
});
test('new registrations preserve existing accounts and use independent salts/IDs', async () => {
  const s = setup(); await s.register(input);
  await s.register({ ...input, email: 'second@example.test' });
  const users = await s.repository.readUsers();
  assert.equal(users.length, 2);
  assert.notEqual(users[0].id, users[1].id);
  assert.notEqual(users[0].passwordSalt, users[1].passwordSalt);
});

test('read failure leaves data untouched and can be retried', async () => {
  const s = setup();
  let failRead = true;
  const repository = { ...s.repository, readUsers: async () => {
    if (failRead) throw new Error('Controlled read failure');
    return s.repository.readUsers();
  } };
  const register = createRegistrationService(repository, passwords);
  assert.equal((await register(input)).status, 'error');
  assert.equal(s.writes(), 0);
  failRead = false;
  assert.equal((await register(input)).status, 'success');
});
test('known saved account retains partial-success notice when retry read fails', async () => {
  const s = setup();
  let failRead = false;
  const repository = { ...s.repository, readUsers: async () => {
    if (failRead) throw new Error('Controlled retry read failure');
    return s.repository.readUsers();
  } };
  const register = createRegistrationService(repository, passwords);
  s.failNext(AUTH_KEYS.session);
  assert.equal((await register(input)).status, 'account-saved');
  failRead = true;
  assert.equal((await register(input)).status, 'account-saved');
  failRead = false;
  assert.equal((await register(input)).status, 'success');
  assert.equal((await s.repository.readUsers()).length, 1);
});


test('login validates required fields and rejects wrong/missing accounts generically', async () => {
  const s = setup(); await s.register(input);
  const service = createSessionService(s.repository, passwords);
  assert.equal((await service.signIn({ email: '', password: '' })).status, 'invalid');
  const wrong = await service.signIn({ email: input.email, password: 'wrong' });
  assert.deepEqual(wrong, await service.signIn({ email: 'missing@example.test', password: input.password }));
  assert.equal(s.writes(), 2);
});
test('login persists normalized credentials, preserves exact password and restores on restart', async () => {
  const s = setup(); await s.register(input);
  const service = createSessionService(s.repository, passwords);
  await service.signOut();
  assert.equal((await restoreSession(s.repository)).session, null);
  assert.equal((await service.signIn({ email: input.email, password: input.password.trim() })).status, 'error');
  const result = await service.signIn(input);
  assert.equal(result.status, 'success');
  const restored = await restoreSession(createAuthStorage({
    getItem: async key => s.data.get(key) ?? null,
    setItem: async () => { throw new Error('Restoration must not write'); },
    removeItem: async () => { throw new Error('Restoration must not delete'); },
  }));
  if (result.status === 'success') assert.deepEqual(restored, { user: result.user, session: result.session });
});
test('session write/removal failures report error and allow retry, including rejection after commit', async () => {
  for (const committed of [false, true]) {
    const s = setup(); await s.register(input);
    const service = createSessionService(s.repository, passwords);
    await service.signOut();
    s.failNext(AUTH_KEYS.session, committed);
    assert.equal((await service.signIn(input)).status, 'error');
    assert.equal((await service.signIn(input)).status, 'success');
    s.failNext(AUTH_KEYS.session, committed);
    assert.equal((await service.signOut()).status, 'error');
    assert.equal((await service.signOut()).status, 'success');
    assert.equal((await restoreSession(s.repository)).session, null);
  }
});
test('logout removes only session and leaves accounts, destinations and favorites byte-for-byte', async () => {
  const s = setup(); await s.register(input);
  s.data.set('tourism.destinations.v1', 'custom-data');
  s.data.set('tourism.favorites.v1', 'favorite-data');
  const before = new Map(s.data); before.delete(AUTH_KEYS.session);
  assert.equal((await createSessionService(s.repository, passwords).signOut()).status, 'success');
  assert.deepEqual(s.data, before);
});
test('restoration accepts absent/orphaned session and preserves malformed/read-failure data', async () => {
  const s = setup();
  assert.deepEqual(await restoreSession(s.repository), { user: null, session: null });
  s.data.set(AUTH_KEYS.session, '{"userId":"user-missing"}');
  assert.deepEqual(await restoreSession(s.repository), { user: null, session: null });
  assert.ok(s.data.has(AUTH_KEYS.session));
  for (const key of [AUTH_KEYS.users, AUTH_KEYS.session]) {
    const isolated = setup(); isolated.data.set(key, '{');
    await assert.rejects(restoreSession(isolated.repository));
    assert.equal((await createSessionService(isolated.repository, passwords).signIn(input)).status, 'error');
    assert.equal(isolated.data.get(key), '{');
    assert.equal(isolated.writes(), 0);
  }
  let failing = true;
  const repository = { ...s.repository, readUsers: async () => { if (failing) throw new Error('Read failed'); return s.repository.readUsers(); } };
  await assert.rejects(restoreSession(repository));
  failing = false;
  assert.equal((await restoreSession(repository)).session, null);
});
