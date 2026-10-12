const { execFileSync } = require('node:child_process');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const output = mkdtempSync(path.join(tmpdir(), 'expoTP-auth-'));
try {
  execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), '--ignoreConfig', '--target', 'ES2022', '--module', 'commonjs', '--moduleResolution', 'node', '--ignoreDeprecations', '6.0', '--esModuleInterop', '--strict', '--skipLibCheck', '--outDir', output, 'tests/auth.test.ts'], { stdio: 'inherit' });
  execFileSync(process.execPath, ['--test', path.join(output, 'tests/auth.test.js')], { stdio: 'inherit' });
} finally {
  rmSync(output, { recursive: true, force: true });
}
