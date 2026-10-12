const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, filename);
};
const { calculateBearing, calculateRelativeAngle, normalizeDegrees } = require('../src/features/compass/orientation.ts');
const origin = { latitude: 0, longitude: 0 };
const close = (actual, expected) => {
  assert.equal(typeof actual, 'number');
  assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
};
for (const [latitude, longitude, expected] of [[1, 0, 0], [0, 1, 90], [-1, 0, 180], [0, -1, 270]]) {
  close(calculateBearing(origin, { latitude, longitude }), expected);
}
// Analytic spherical case: initial course east although destination is south.
close(calculateBearing({ latitude: 45, longitude: 0 },
  { latitude: 0, longitude: 90 }), 90);
close(calculateBearing({ latitude: 0, longitude: 179 }, { latitude: 0, longitude: -179 }), 90);
close(calculateBearing({ latitude: 0, longitude: -179 }, { latitude: 0, longitude: 179 }), 270);
assert.equal(calculateBearing(origin, origin), null);
assert.equal(calculateBearing(origin, { latitude: 0, longitude: 0.000001 }), null);
assert.equal(calculateBearing(origin, { latitude: 0, longitude: 0.001 }, 120), null);
close(calculateBearing(origin, { latitude: 0, longitude: 0.001 }, 100), 90);
assert.equal(calculateBearing(origin, { latitude: 0, longitude: 180 }), null);
assert.equal(calculateBearing({ latitude: 90, longitude: 0 }, { latitude: 90, longitude: 180 }), null);
for (const invalid of [NaN, Infinity, -Infinity, 91, -91]) {
  assert.throws(() => calculateBearing({ latitude: invalid, longitude: 0 }, origin), RangeError);
  assert.throws(() => calculateBearing(origin, { latitude: invalid, longitude: 0 }), RangeError);
}
for (const invalid of [NaN, Infinity, -Infinity, 181, -181]) {
  assert.throws(() => calculateBearing(origin, { latitude: 0, longitude: invalid }), RangeError);
  assert.throws(() => calculateBearing({ latitude: 0, longitude: invalid }, origin), RangeError);
}
for (const invalid of [-1, NaN, Infinity]) {
  assert.throws(() => calculateBearing(origin, origin, invalid), RangeError);
}
for (const [bearing, heading, expected] of [[0, 359, 1], [359, 0, -1], [90, 0, 90],
  [0, 90, -90], [180, 0, -180], [-1, 0, -1], [719, 0, -1], [450, 90, 0]]) {
  close(calculateRelativeAngle(bearing, heading), expected);
}
for (const [input, expected] of [[-360, 0], [720, 0], [-90, 270], [450, 90]]) {
  assert.equal(normalizeDegrees(input), expected);
}
for (const invalid of [NaN, Infinity, -Infinity]) {
  assert.throws(() => normalizeDegrees(invalid), RangeError);
  assert.throws(() => calculateRelativeAngle(invalid, 0), RangeError);
}
for (const invalid of [-1, 360, NaN, Infinity]) {
  assert.throws(() => calculateRelativeAngle(0, invalid), RangeError);
}
// Across all quadrants, relative rotations stay bounded and reconstruct bearing.
for (let bearing = 0; bearing < 360; bearing += 15) {
  for (let heading = 0; heading < 360; heading += 15) {
    const relative = calculateRelativeAngle(bearing, heading);
    assert.ok(relative >= -180 && relative < 180);
    close(normalizeDegrees(relative + heading), bearing);
  }
}
console.log('Orientación: cardinales, rumbo esférico, antimeridiano, cercanía/precisión, antípodas, validación y giro relativo: OK');
