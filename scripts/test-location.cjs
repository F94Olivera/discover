const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, filename);
const { createLocationController } = require('../src/features/compass/location.ts');
const coords = { latitude: -34.6, longitude: -58.4, accuracy: 12 };
const granted = { granted: true, canAskAgain: true };
const deferred = () => { let resolve; let reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; };
const flush = () => new Promise(resolve => setImmediate(resolve));
function setup(overrides = {}, timeout = 1000) {
  const calls = []; const states = [];
  const adapter = {
    getPermission: async () => { calls.push('permission'); return granted; },
    requestPermission: async () => { calls.push('request'); return granted; },
    servicesEnabled: async () => { calls.push('services'); return true; },
    getPosition: async () => { calls.push('position'); return { coords }; }, ...overrides,
  };
  return { calls, states, controller: createLocationController(adapter, state => states.push(state), timeout) };
}
(async () => {
  const ok = setup(); assert.deepEqual(ok.calls, []); assert.deepEqual(ok.states, []);
  await ok.controller.start(); assert.deepEqual(ok.calls, ['permission','services','position']);
  assert.deepEqual(ok.states.map(s=>s.status), ['requesting','locating','ready']);
  assert.deepEqual(ok.states.at(-1).position, coords);
  ok.controller.stop(); assert.equal(ok.states.at(-1).status,'idle');
  const ask = setup({ getPermission: async () => ({ granted:false, canAskAgain:true }) });
  await ask.controller.start(); assert.equal(ask.calls[0], 'request'); assert.equal(ask.states.at(-1).status, 'ready');
  for (const canAskAgain of [true,false]) {
    const denied = { granted:false, canAskAgain };
    const s = setup({ getPermission: async () => denied, requestPermission: async () => denied });
    await s.controller.start(); assert.equal(s.states.at(-1).settings,!canAskAgain);
    assert.equal(s.states.at(-1).status,'error'); assert.deepEqual(s.calls,[]);
  }
  const off = setup({ servicesEnabled: async () => false }); await off.controller.start();
  assert.equal(off.states.at(-1).settings,true); assert.ok(!off.calls.includes('position'));
  for (const invalid of [{latitude:91},{longitude:-181},{latitude:NaN},{longitude:Infinity},{accuracy:null},{accuracy:-1},{accuracy:NaN}]) {
    const s = setup({getPosition:async()=>({coords:{...coords,...invalid}})}); await s.controller.start();
    assert.equal(s.states.at(-1).status,'error');
  }
  for (const method of ['getPermission','requestPermission','servicesEnabled','getPosition']) {
    const s = setup({getPermission:async()=>({granted:false,canAskAgain:true}),[method]:async()=>{throw Error('native');}});
    await s.controller.start(); assert.equal(s.states.at(-1).status,'error');
  }
  for (const method of ['getPermission','requestPermission','servicesEnabled','getPosition']) {
    const pending = deferred();
    const s = setup({getPermission:async()=>({granted:false,canAskAgain:true}), [method]:()=>pending.promise});
    const first = s.controller.start(); await flush(); const count = s.states.length;
    await s.controller.start(); assert.equal(s.states.length,count); // repeated start blocked
    s.controller.stop(false); pending.resolve(method==='getPosition'?{coords}:method==='servicesEnabled'?true:granted);
    await first; assert.equal(s.states.length,count); // no late publication on departure
    s.controller.stop(); assert.equal(s.states.at(-1).status,'idle');
  }
  const late = deferred(); let attempts=0;
  const timeout = setup({getPosition:()=> ++attempts===1 ? late.promise : Promise.resolve({coords})},5);
  const first = timeout.controller.start(); await new Promise(r=>setTimeout(r,20));
  assert.equal(timeout.states.at(-1).status,'error'); assert.match(timeout.states.at(-1).message,/tardó/);
  await timeout.controller.start(); assert.equal(timeout.states.at(-1).status,'ready');
  const count=timeout.states.length; late.reject(Error('late')); await first;
  assert.equal(timeout.states.length,count); timeout.controller.stop(false);
  // Stop clears the timeout even when the native position promise remains pending.
  const stopped = setup({getPosition:()=>new Promise(()=>{})},5);
  void stopped.controller.start(); await flush(); stopped.controller.stop();
  await new Promise(r=>setTimeout(r,20)); assert.equal(stopped.states.at(-1).status,'idle');
  console.log('Ubicación: permiso bajo demanda, rechazo/bloqueo, servicios, validación, errores, timeout/reintento, cancelación y resultados tardíos: OK');
})().catch(error => { console.error(error); process.exitCode=1; });
