const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');

function requireFiles(directory, files, label) {
  const missing = files.filter(file => !fs.existsSync(path.join(directory, file)));
  if (missing.length) throw new Error(`${label}: missing ${missing.join(', ')} in ${directory}`);
  return directory;
}

function runtimeDirectory() {
  const directory = process.env.IDRL_RUNTIME || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies');
  return requireFiles(directory, ['node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs', 'python/python.exe'].filter(file => process.platform === 'win32' || file !== 'python/python.exe'), 'Set IDRL_RUNTIME to the installed Codex dependencies directory');
}

function presentationSkill() {
  const files = ['artifact_tool_utils.mjs', 'inspect_presentation_package_integrity.py', 'inspect_presentation_layout_geometry.py', 'render_slides.py', 'mark_artifact_operation_started.mjs'].map(file => `container_tools/${file}`);
  if (process.env.IDRL_PRESENTATIONS_SKILL) return requireFiles(path.resolve(process.env.IDRL_PRESENTATIONS_SKILL), files, 'IDRL_PRESENTATIONS_SKILL');
  const cache = path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'plugins/cache/openai-primary-runtime/presentations');
  const versions = fs.existsSync(cache) ? fs.readdirSync(cache).sort((a, b) => b.localeCompare(a, 'en', { numeric: true })) : [];
  for (const version of versions) {
    const directory = path.join(cache, version, 'skills/presentations');
    if (files.every(file => fs.existsSync(path.join(directory, file)))) return directory;
  }
  throw new Error('No complete presentations skill found. Install the Codex presentations skill or set IDRL_PRESENTATIONS_SKILL to its directory.');
}

function pythonExecutable(modules = []) {
  const override = process.env.IDRL_PYTHON || process.env.PYTHON_BIN;
  const venv = path.join(root, '.venv-assets', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
  const bundled = path.join(process.env.IDRL_RUNTIME || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies'), process.platform === 'win32' ? 'python/python.exe' : 'python/bin/python3');
  const candidates = override ? [override] : [venv, bundled, 'python3', 'python'];
  for (const candidate of candidates) {
    const result = spawnSync(candidate, ['-c', modules.length ? `import ${modules.join(', ')}` : 'import sys'], { encoding: 'utf8', timeout: 10000, windowsHide: true });
    if (!result.error && result.status === 0) return candidate;
  }
  throw new Error(`Python dependencies unavailable${override ? ` at ${override}` : ''}. Create .venv-assets and install requirements-assets.txt, or set IDRL_PYTHON to a prepared Python executable. Required: ${modules.join(', ') || 'Python 3'}.`);
}

function presentationEnvironment() {
  const runtime = runtimeDirectory();
  const skill = presentationSkill();
  process.env.RUNTIME_NODE_MODULES ||= path.join(runtime, 'node/node_modules');
  requireFiles(process.env.RUNTIME_NODE_MODULES, ['@oai/artifact-tool/dist/artifact_tool.mjs'], 'RUNTIME_NODE_MODULES');
  const python = process.env.IDRL_PYTHON || process.env.PYTHON_BIN || path.join(runtime, process.platform === 'win32' ? 'python/python.exe' : 'python/bin/python3');
  const node = path.join(runtime, process.platform === 'win32' ? 'node/bin/node.exe' : 'node/bin/node');
  requireFiles(runtime, [path.relative(runtime, node)], 'Bundled Node runtime');
  const check = spawnSync(python, ['-c', 'import PIL, pypdf'], { encoding: 'utf8', timeout: 10000, windowsHide: true });
  if (check.error || check.status !== 0) throw new Error('Presentation Python must provide PIL and pypdf. Check IDRL_RUNTIME / IDRL_PYTHON.');
  return { runtime, skill, python, node };
}

module.exports = { root, pythonExecutable, presentationEnvironment, presentationSkill };

if (require.main === module) {
  try {
    const result = process.argv[2] === 'deck' ? presentationEnvironment() : { python: pythonExecutable(['fontTools', 'brotli', 'pypdf', 'reportlab']) };
    console.log(JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
