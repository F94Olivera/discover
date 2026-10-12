const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, filename);
const { createDeleteDestinationService, recoverDeletion, DELETION_KEY } = require('../src/features/destinations/deletion.ts');
const { DESTINATIONS_KEY, parseDestinations } = require('../src/features/destinations/creation.ts');
const { FAVORITES_KEY, parseFavorites } = require('../src/features/favorites/favorites.ts');
const { selectVisibleDestination } = require('../src/features/destinations/selectors.ts');
const users = ['user-A', 'user-B'];
const own = { id: 'custom-one', source: 'custom', ownerId: 'user-A', name: 'Prueba', description: 'Prueba', latitude: 0, longitude: 0 };
const other = { ...own, id: 'custom-other', ownerId: 'user-B' };
function fixture(favorite = true) {
  const data = new Map([[DESTINATIONS_KEY, JSON.stringify([own, other])], [FAVORITES_KEY, JSON.stringify([{ userId: 'user-B', destinationId: 'seed-01' }, ...(favorite ? [{ userId: 'user-A', destinationId: own.id }] : [])])]]);
  let writes = 0, failure = 0, after = false;
  const storage = { getItem: async key => data.get(key) ?? null, setItem: async (key, value) => {
    writes++; if (writes === failure && !after) throw Error('write');
    data.set(key, value); if (writes === failure && after) throw Error('write');
  }, removeItem: async key => {
    writes++; if (writes === failure && !after) throw Error('remove');
    data.delete(key); if (writes === failure && after) throw Error('remove');
  } };
  return { data, storage, save: createDeleteDestinationService(storage), fail: (n, committed) => { failure = n; after = committed; }, writes: () => writes };
}
function restored(f) {
  const destinations = parseDestinations(f.data.get(DESTINATIONS_KEY));
  const favorites = parseFavorites(f.data.get(FAVORITES_KEY), users, destinations);
  assert.deepEqual(destinations, [other]);
  assert.deepEqual(favorites, [{ userId: 'user-B', destinationId: 'seed-01' }]);
  assert.equal(selectVisibleDestination('user-A', destinations, own.id), null);
  assert.ok(!f.data.has(DELETION_KEY));
}
async function main() {
  for (const favorite of [false, true]) {
    const f = fixture(favorite), before = new Map(f.data);
    // Cancel has no domain action and therefore no storage changes.
    assert.deepEqual(f.data, before);
    assert.equal((await f.save('user-A', own.id, users)).status, 'success');
    await recoverDeletion(f.storage, users); restored(f);
  }
  for (const [user, id] of [[null, own.id], ['user-B', own.id], ['user-A', 'seed-01'], ['user-A', 'custom-missing'], ['user-missing', own.id]]) {
    const f = fixture(), before = new Map(f.data);
    assert.equal((await f.save(user, id, users)).status, 'error');
    assert.equal(f.writes(), 0); assert.deepEqual(f.data, before);
  }
  // Journal, favorites, destinations and journal cleanup: fail before/after each.
  for (let stage = 1; stage <= 4; stage++) for (const after of [false, true]) {
    const f = fixture(); f.fail(stage, after);
    const result = await f.save('user-A', own.id, users);
    assert.equal(result.status, 'error'); assert.equal(result.recoveryRequired, true);
    if (f.data.has(DELETION_KEY)) {
      const count = f.writes();
      assert.equal((await f.save('user-A', own.id, users)).recoveryRequired, true);
      assert.equal(f.writes(), count);
    }
    f.fail(0, false);
    await recoverDeletion(f.storage, users); // fresh launch/retry before hydration
    if (stage === 1 && !after) assert.equal((await f.save('user-A', own.id, users)).status, 'success');
    restored(f);
  }
  const invalid = fixture(); invalid.data.set(DELETION_KEY, '{}'); const snapshot = new Map(invalid.data);
  await assert.rejects(recoverDeletion(invalid.storage, users)); assert.deepEqual(invalid.data, snapshot);
  const badFavorites = fixture(); badFavorites.data.set(FAVORITES_KEY, '{');
  assert.equal((await badFavorites.save('user-A', own.id, users)).status, 'error'); assert.equal(badFavorites.writes(), 0);
  const readFail = createDeleteDestinationService({ getItem: async () => { throw Error('read'); } });
  assert.equal((await readFail('user-A', own.id, users)).status, 'error');
  const concurrent = fixture(); let release;
  const save = createDeleteDestinationService({ ...concurrent.storage, getItem: key => key === DELETION_KEY ? new Promise(resolve => { release = () => resolve(null); }) : concurrent.storage.getItem(key) });
  const pending = save('user-A', 'seed-01', users);
  assert.equal((await save('user-A', own.id, users)).status, 'error'); release(); assert.equal((await pending).status, 'error');
  console.log('Eliminación: propiedad, seeds, favorito/no favorito, restauración, limpieza, ocho fallos parciales, recuperación, datos inválidos y concurrencia: OK');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
