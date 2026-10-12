const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
// Compile the actual pure modules in memory; no React Native/Expo mocks needed.
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, filename);
};
const { defaultDestinations } = require('../src/data/defaultDestinations.ts');
const { selectVisibleDestinations, selectVisibleDestination } = require('../src/features/destinations/selectors.ts');
const rows = [...fs.readFileSync('PLACES.md', 'utf8').matchAll(/\| \d+ \| (seed-\d+) \| ([^|]+) \| ([-\d.]+) \| ([-\d.]+) \|/g)];
assert.equal(defaultDestinations.length, 20);
assert.equal(new Set(defaultDestinations.map(d => d.id)).size, 20);
assert.ok(Object.isFrozen(defaultDestinations));
defaultDestinations.forEach((d, i) => {
  assert.deepEqual([d.id, d.name, d.latitude, d.longitude], [rows[i][1], rows[i][2].trim(), Number(rows[i][3]), Number(rows[i][4])]);
  assert.ok(d.description.trim());
  assert.equal(d.source, 'seed');
  assert.ok(Object.isFrozen(d));
  assert.ok(Number.isFinite(d.latitude) && Math.abs(d.latitude) <= 90);
  assert.ok(Number.isFinite(d.longitude) && Math.abs(d.longitude) <= 180);
});
const custom = Object.freeze([
  Object.freeze({ ...defaultDestinations[0], id: 'custom-first', source: 'custom', ownerId: 'A' }),
  Object.freeze({ ...defaultDestinations[0], id: 'custom-other', source: 'custom', ownerId: 'B' }),
  Object.freeze({ ...defaultDestinations[0], id: 'custom-last', source: 'custom', ownerId: 'A' }),
]);
assert.deepEqual(selectVisibleDestinations(null, custom), []);
assert.deepEqual(selectVisibleDestinations('A', custom).map(d => d.id), [...defaultDestinations.map(d => d.id), 'custom-first', 'custom-last']);
assert.deepEqual(selectVisibleDestinations('B', custom).slice(20).map(d => d.id), ['custom-other']);
assert.deepEqual(selectVisibleDestinations('C', custom), defaultDestinations);
assert.deepEqual(selectVisibleDestinations('A', []), defaultDestinations);
// Route lookup uses the same visibility rule as the list, including direct links.
assert.equal(selectVisibleDestination('A', custom, 'seed-01'), defaultDestinations[0]);
assert.equal(selectVisibleDestination('A', custom, 'custom-first'), custom[0]);
assert.equal(selectVisibleDestination('B', custom, 'custom-other'), custom[1]);
assert.equal(selectVisibleDestination('A', custom, 'custom-other'), null);
assert.equal(selectVisibleDestination('B', custom, 'custom-first'), null);
assert.equal(selectVisibleDestination(null, custom, 'seed-01'), null);
for (const id of [undefined, [], ['seed-01'], ['seed-01', 'seed-02'], '', ' seed-01 ', 'seed-99', 'custom-missing', 'navigation-preview', '../seed-01']) {
  assert.equal(selectVisibleDestination('A', custom, id), null);
}
console.log('Catálogo: 20 seeds coincidentes con PLACES, inmutabilidad, rangos, aislamiento A/B/anónimo y orden estable: OK');
console.log('Detalles: resolución seed/custom propio, rechazo ajeno/anónimo, IDs inválidos/ausentes/múltiples/desconocidos: OK');
