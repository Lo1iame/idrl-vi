const { execFileSync } = require('node:child_process');
const path = require('node:path');
const { root, pythonExecutable } = require('./asset-runtime.cjs');

try {
  const python = pythonExecutable(['fontTools', 'brotli', 'pypdf', 'reportlab']);
  for (const script of ['build-brand.py', 'build-tokens.py', 'brand-styles.py']) {
    execFileSync(python, [path.join(__dirname, script)], { cwd: root, stdio: 'inherit', windowsHide: true });
  }
  execFileSync(process.execPath, [path.join(__dirname, 'render-brand.cjs')], { cwd: root, stdio: 'inherit', windowsHide: true, env: { ...process.env, IDRL_PYTHON: python } });
} catch (error) { console.error(error.message); process.exitCode = 1; }
