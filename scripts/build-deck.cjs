const { fork } = require('node:child_process');
const fs = require('node:fs');
const { createHash } = require('node:crypto');
const path = require('node:path');
const { root, presentationEnvironment } = require('./asset-runtime.cjs');
try {
  const { node } = presentationEnvironment();
  // Keep native rendering resources out of the CLI host. On Windows this
  // runtime can fail during teardown even after every output has been saved.
  const worker = fork(path.join(__dirname, 'build-research-deck.mjs'), [], { execPath: node, cwd: root, stdio: ['ignore', 'inherit', 'inherit', 'ipc'], windowsHide: true });
  let completed = false;
  const timeout = setTimeout(() => { console.error('Presentation build timed out.'); process.exitCode = 1; worker.kill(); }, 600000);
  worker.on('message', message => {
    if (message?.kind !== 'complete') return;
    try {
      const sha = createHash('sha256').update(fs.readFileSync(message.finalPath)).digest('hex');
      if (sha !== message.sha256) throw new Error('Final PPTX checksum does not match its validation receipt.');
      completed = true;
      console.log(JSON.stringify({ finalPath: message.finalPath, receiptPath: message.receiptPath, slideCount: message.slideCount, nativeTables: message.nativeTables, nativeCharts: message.nativeCharts }));
    } catch (error) { console.error(error.message); process.exitCode = 1; }
    finally { clearTimeout(timeout); worker.kill(); }
  });
  worker.on('error', error => { console.error(error.message); process.exitCode = 1; clearTimeout(timeout); worker.kill(); });
  worker.on('exit', (code, signal) => {
    clearTimeout(timeout);
    if (!completed) { console.error(`Presentation worker exited before completion (${code ?? signal}).`); process.exitCode = 1; }
  });
} catch (error) { console.error(error.message); process.exitCode = 1; }
