const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, filename);
const { createCompassController, isReliableHeading } = require('../src/features/compass/heading.ts');
const { calculateBearing, calculateRelativeAngle } = require('../src/features/compass/orientation.ts');
const position = { latitude: 0, longitude: 0, accuracy: 5 };
const granted = { granted: true, canAskAgain: true };
const flush = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve; let reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
function setup(overrides = {}, timeout = 1000) {
  const states = []; const callbacks = {}; const removed = []; const calls = [];
  const adapter = {
    getPermission: async () => granted, requestPermission: async () => granted,
    servicesEnabled: async () => true, getPosition: async () => ({ coords: position }),
    watchHeading: async (receive, error) => { calls.push('heading'); callbacks.heading = receive; callbacks.headingError = error; return { remove: () => removed.push('heading') }; },
    watchPosition: async (receive, error) => { calls.push('position'); callbacks.position = receive; callbacks.positionError = error; return { remove: () => removed.push('position') }; },
    ...overrides,
  };
  return { states, callbacks, removed, calls, controller: createCompassController(adapter, state => states.push(state), timeout) };
}
(async () => {
  for (const accuracy of [0, 1, 2, 3, 4, NaN]) {
    for (const trueHeading of [-1, 0, 359.9, 360, NaN, Infinity]) {
      assert.equal(isReliableHeading({ accuracy, trueHeading }), [2, 3].includes(accuracy) && trueHeading >= 0 && trueHeading < 360);
    }
  }
  const s = setup(); assert.deepEqual(s.calls, []);
  await s.controller.start(); await flush(); assert.deepEqual(s.calls, ['heading', 'position']);
  assert.equal(s.states.at(-1).heading, null);
  for (const value of [0, 90, 180, 270, 359]) {
    s.callbacks.heading({ trueHeading: value, accuracy: 3 });
    const state = s.states.at(-1); assert.equal(state.heading, value);
    const bearing = calculateBearing(state.position, { latitude: 1, longitude: 0 }, state.position.accuracy);
    assert.equal(calculateRelativeAngle(bearing, value), ((360 - value + 180) % 360) - 180);
  }
  s.callbacks.heading({ trueHeading: -1, magHeading: 90, accuracy: 3 }); assert.equal(s.states.at(-1).heading, null);
  s.callbacks.heading({ trueHeading: 90, accuracy: 1 }); assert.equal(s.states.at(-1).heading, null);
  s.callbacks.heading({ trueHeading: 90, accuracy: 2 }); assert.equal(s.states.at(-1).heading, 90);
  s.callbacks.position({ latitude: 1, longitude: 0, accuracy: 20 });
  assert.equal(calculateBearing(s.states.at(-1).position, { latitude: 1, longitude: 0 }, 20), null);
  await s.controller.start(); assert.equal(s.calls.length, 2); // duplicate start blocked
  s.controller.stop(); assert.deepEqual(s.removed, ['heading', 'position']);
  const count = s.states.length; s.callbacks.heading({ trueHeading: 180, accuracy: 3 });
  s.callbacks.positionError(); assert.equal(s.states.length, count);
  for (let i = 0; i < 3; i++) { await s.controller.start(); await flush(); s.controller.stop(); }
  assert.equal(s.removed.length, 8);
  for (const method of ['watchHeading', 'watchPosition']) {
    const pending = deferred(); const test = setup({ [method]: () => pending.promise });
    await test.controller.start(); await flush(); test.controller.stop(false); const length = test.states.length;
    pending.resolve({ remove: () => test.removed.push('late') }); await flush();
    assert.ok(test.removed.includes('late')); assert.equal(test.states.length, length);
  }
  // A late handle from the old destination must not enter the new attempt.
  const pending = deferred(); let attempts = 0;
  const race = setup({ watchHeading: async () => ++attempts === 1 ? pending.promise : { remove: () => race.removed.push('new') } });
  await race.controller.start(); await flush(); race.controller.stop(false);
  await race.controller.start(); await flush(); pending.resolve({ remove: () => race.removed.push('old') }); await flush();
  assert.deepEqual(race.removed, ['old']); race.controller.stop(); assert.deepEqual(race.removed, ['old', 'new', 'position']);
  for (const method of ['watchHeading', 'watchPosition']) {
    const test = setup({ [method]: async () => { throw Error('native'); } });
    await test.controller.start(); await flush(); assert.equal(test.states.at(-1).status, 'error');
    if (method === 'watchPosition') assert.deepEqual(test.removed, ['heading']);
  }
  for (const callback of ['headingError', 'positionError']) {
    const test = setup(); await test.controller.start(); await flush(); test.callbacks[callback]();
    assert.equal(test.states.at(-1).status, 'error'); assert.equal(test.removed.length, 2);
  }
  for (const invalid of [{ accuracy: NaN }, { accuracy: -1 }, { latitude: 91 }, { longitude: Infinity }]) {
    const test = setup(); await test.controller.start(); await flush(); test.callbacks.position({ ...position, ...invalid });
    assert.equal(test.states.at(-1).status, 'error'); assert.equal(test.removed.length, 2);
  }
  const absent = setup({}, 5); await absent.controller.start(); await new Promise(r => setTimeout(r, 20));
  assert.equal(absent.states.at(-1).status, 'error'); assert.equal(absent.removed.length, 2);
  const stale = setup({}, 5); await stale.controller.start(); await flush(); stale.callbacks.heading({ trueHeading: 90, accuracy: 3 });
  await new Promise(r => setTimeout(r, 20)); assert.equal(stale.states.at(-1).status, 'error'); assert.equal(stale.removed.length, 2);
  for (const method of ['getPermission', 'getPosition']) {
    const pending = deferred(); const test = setup({ [method]: () => pending.promise });
    void test.controller.start(); await flush(); test.controller.stop(false);
    pending.resolve(method === 'getPosition' ? { coords: position } : granted); await flush(); assert.deepEqual(test.calls, []);
  }
  const denied = setup({ getPermission: async () => ({ granted: false, canAskAgain: false }) });
  await denied.controller.start(); assert.equal(denied.states.at(-1).status, 'error'); assert.deepEqual(denied.calls, []);
  const off = setup({ servicesEnabled: async () => false }); await off.controller.start(); assert.deepEqual(off.calls, []);
  console.log('Heading: calidad/norte verdadero, giros, GPS/cercanía, errores, timeout, repetidos, callbacks y handles tardíos: OK (adaptador controlado, sin sensores físicos)');
})().catch(error => { console.error(error); process.exitCode = 1; });
