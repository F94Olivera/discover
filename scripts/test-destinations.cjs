const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, filename);
const { validateDestination, parseDestinations, createDestinationService, DESTINATIONS_KEY } = require('../src/features/destinations/creation.ts');
const { selectEditableDestination, selectVisibleDestinations, selectVisibleDestination } = require('../src/features/destinations/selectors.ts');
const { createUpdateDestinationService } = require('../src/features/destinations/update.ts');
const input = { name: ' Prueba ', description: ' Descripción ', latitude: '-34,6037', longitude: '-58.3816' };
async function main() {
  assert.deepEqual(validateDestination(input).fields, { name: 'Prueba', description: 'Descripción', latitude: -34.6037, longitude: -58.3816 });
  for (const raw of ['', ' ', 'abc', 'NaN', 'Infinity', '1e999', '0x10', '12foo', '1,2,3']) {
    assert.ok(validateDestination({ ...input, latitude: raw }).errors.latitude);
    assert.ok(validateDestination({ ...input, longitude: raw }).errors.longitude);
  }
  for (const [latitude, longitude] of [['0','0'], ['-90','-180'], ['90','180']]) assert.deepEqual(validateDestination({ ...input, latitude, longitude }).errors, {});
  assert.ok(validateDestination({ ...input, name: ' ', description: '', latitude: '90.1', longitude: '-180.1' }).errors.name);
  assert.equal(Object.keys(validateDestination({ ...input, name: ' ', description: '', latitude: '90.1', longitude: '-180.1' }).errors).length, 4);
  let raw = null, writes = 0, failure = null, counter = 0;
  const storage = { getItem: async () => raw, setItem: async (key, value) => {
    assert.equal(key, DESTINATIONS_KEY); writes++;
    if (failure === 'before') throw Error('write');
    raw = value;
    if (failure === 'after') throw Error('write');
  }, removeItem: async () => { throw Error('Unexpected delete'); } };
  const create = createDestinationService(storage, () => String(++counter));
  assert.equal((await create(null, input, 'one')).status, 'error');
  assert.equal((await create('user-A', { ...input, name: '' }, 'one')).status, 'invalid');
  assert.equal(writes, 0);
  failure = 'before'; assert.equal((await create('user-A', input, 'one')).status, 'error'); assert.equal(raw, null);
  failure = null; let result = await create('user-A', input, 'one'); assert.equal(result.status, 'success'); assert.equal(result.destinations.length, 1); assert.equal(result.destinations[0].id, 'custom-1');
  // Restart uses the actual serialized data, with no seed storage.
  const restored = parseDestinations(raw);
  assert.equal(restored.length, 1); assert.equal(restored[0].ownerId, 'user-A');
  assert.equal(selectVisibleDestinations('user-A', restored).length, 21);
  assert.equal(selectVisibleDestinations('user-B', restored).length, 20);
  assert.equal(selectVisibleDestination('user-B', restored, 'custom-1'), null);
  assert.equal(selectVisibleDestination('user-A', restored, 'custom-1').name, 'Prueba');
  failure = 'after'; assert.equal((await create('user-A', input, 'two')).status, 'error');
  failure = null; result = await create('user-A', { ...input, name: 'Corregido' }, 'two'); assert.equal(result.destinations.length, 2); assert.equal(result.destinations[1].name, 'Corregido');
  failure = 'after'; await create('user-A', input, 'three'); failure = null;
  result = await create('user-A', input, 'new-form'); assert.equal(result.destinations.length, 4); // No reusing a canceled attempt.
  const prior = raw; raw = '{invalid'; const previousWrites = writes;
  assert.equal((await create('user-A', input, 'four')).status, 'error'); assert.equal(raw, '{invalid'); assert.equal(writes, previousWrites); raw = prior;
  for (const bad of ['{}', '[{}]', JSON.stringify([...restored, restored[0]]), JSON.stringify([{ ...restored[0], latitude: null }]), JSON.stringify([{ ...restored[0], source: 'seed' }]), JSON.stringify([{ ...restored[0], ownerId: '' }])]) assert.throws(() => parseDestinations(bad));
  assert.deepEqual(parseDestinations(null), []);
  const readFailure = createDestinationService({ ...storage, getItem: async () => { throw Error('read'); } }, () => 'test');
  assert.equal((await readFailure('user-A', input, 'five')).status, 'error'); assert.equal(writes, previousWrites);
  let release; const slowStorage = { ...storage, getItem: () => new Promise(resolve => { release = () => resolve(raw); }) };
  const slow = createDestinationService(slowStorage, () => 'slow');
  const first = slow('user-A', input, 'slow'); assert.equal((await slow('user-A', input, 'slow')).status, 'error'); release(); assert.equal((await first).status, 'success');
  raw = prior;
  const update = createUpdateDestinationService(storage);
  const beforeEdit = parseDestinations(raw);
  const target = beforeEdit[0];
  assert.equal(selectEditableDestination('user-A', beforeEdit, target.id).id, target.id);
  for (const id of ['seed-01', 'custom-missing', [target.id], undefined, 'bad']) assert.equal(selectEditableDestination('user-A', beforeEdit, id), null);
  assert.equal(selectEditableDestination('user-B', beforeEdit, target.id), null);
  assert.equal(selectEditableDestination(null, beforeEdit, target.id), null);
  const blockedWrites = writes;
  for (const [userId, id] of [[null, target.id], ['user-B', target.id], ['user-A', 'seed-01'], ['user-A', 'custom-missing']]) {
    assert.equal((await update(userId, id, input)).status, 'error');
  }
  assert.equal(writes, blockedWrites);
  assert.equal((await update('user-A', target.id, { ...input, name: '' })).status, 'invalid');
  failure = 'before';
  assert.equal((await update('user-A', target.id, { ...input, name: 'Editado' })).status, 'error');
  assert.deepEqual(parseDestinations(raw), beforeEdit);
  failure = null;
  result = await update('user-A', target.id, { ...input, name: 'Editado', description: 'Nueva descripción', latitude: '0', longitude: '180' });
  assert.equal(result.status, 'success');
  assert.deepEqual(result.destinations.map(d => d.id), beforeEdit.map(d => d.id));
  assert.equal(result.destinations[0].ownerId, target.ownerId);
  assert.deepEqual(result.destinations.slice(1), beforeEdit.slice(1));
  assert.equal(selectVisibleDestination('user-A', parseDestinations(raw), target.id).name, 'Editado');
  assert.equal(selectVisibleDestinations('user-A', parseDestinations(raw))[20].name, 'Editado');
  failure = 'after';
  assert.equal((await update('user-A', target.id, { ...input, name: 'Reintento' })).status, 'error');
  failure = null;
  result = await update('user-A', target.id, { ...input, name: 'Reintento corregido' });
  assert.equal(result.destinations.length, beforeEdit.length);
  assert.equal(parseDestinations(raw)[0].name, 'Reintento corregido');
  const validRaw = raw; raw = '{invalid';
  assert.equal((await update('user-A', target.id, input)).status, 'error');
  assert.equal(raw, '{invalid'); raw = validRaw;
  console.log('Edición: permisos de dominio, validación compartida, identidad/propiedad/orden, estado previo ante fallo, retry antes/después de commit y restauración/lista/detalles: OK');
  console.log('Destinos: validación decimal/rangos/0/límites, guardado, restauración, aislamiento, errores de lectura/escritura antes y después de commit, retry sin duplicados, nueva instancia, JSON inválido y concurrencia: OK');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
