const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { presentationSkill } = require('../scripts/asset-runtime.cjs');

test('skill discovery skips incomplete versions and selects the newest complete install', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'idrl-skill-'));
  const originalHome = process.env.CODEX_HOME, originalSkill = process.env.IDRL_PRESENTATIONS_SKILL;
  try {
    process.env.CODEX_HOME = directory;
    delete process.env.IDRL_PRESENTATIONS_SKILL;
    for (const version of ['9.0', '10.0', '11.0']) {
      const tools = path.join(directory, 'plugins/cache/openai-primary-runtime/presentations', version, 'skills/presentations/container_tools');
      fs.mkdirSync(tools, { recursive: true });
      if (version === '11.0') continue;
      for (const file of ['artifact_tool_utils.mjs', 'inspect_presentation_package_integrity.py', 'inspect_presentation_layout_geometry.py', 'render_slides.py', 'mark_artifact_operation_started.mjs']) fs.writeFileSync(path.join(tools, file), '');
    }
    assert.equal(presentationSkill(), path.join(directory, 'plugins/cache/openai-primary-runtime/presentations/10.0/skills/presentations'));
    process.env.IDRL_PRESENTATIONS_SKILL = path.join(directory, 'missing');
    assert.throws(() => presentationSkill(), /IDRL_PRESENTATIONS_SKILL: missing/);
  } finally {
    if (originalHome === undefined) delete process.env.CODEX_HOME; else process.env.CODEX_HOME = originalHome;
    if (originalSkill === undefined) delete process.env.IDRL_PRESENTATIONS_SKILL; else process.env.IDRL_PRESENTATIONS_SKILL = originalSkill;
    const resolved = fs.realpathSync(directory);
    assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('idrl-skill-'));
    fs.rmSync(resolved, { recursive: true });
  }
});

test('invalid explicit runtime fails preflight with a useful error before building', () => {
  const result = spawnSync(process.execPath, ['scripts/asset-runtime.cjs', 'deck'], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8', env: { ...process.env, IDRL_RUNTIME: path.join(os.tmpdir(), 'idrl-nonexistent-runtime') } });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /IDRL_RUNTIME/);
  assert.match(result.stderr, /missing/);
});
