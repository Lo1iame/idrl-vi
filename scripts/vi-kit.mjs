import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import runtime from './asset-runtime.cjs'
import { root, createAdoptionKit, verifySnapshot } from './adoption-kit.mjs'
export { root, createAdoptionKit, verifySnapshot }
export const kitFiles = manifest => createAdoptionKit().files(manifest)
export const exportKit = options => createAdoptionKit(options).export()
export const checkUi = options => createAdoptionKit(options).check()

// Full-repository audit composes UI validation with research materials and normative links.
export function check({sourceRoot = root} = {}) {
  const manifest = checkUi({sourceRoot})
  for (const key of ['presentation','presentationPreview','presentationValidation','foundationPreview']) {
    if (!existsSync(resolve(sourceRoot,manifest[key]))) throw new Error(`Missing ${key}: ${manifest[key]}`)
  }
  const deck = JSON.parse(readFileSync(resolve(sourceRoot,manifest.presentationValidation),'utf8'))
  if (!manifest.presentation.endsWith(`/${deck.file}`) || !manifest.presentationPreview.endsWith(`/${deck.pdf}`)) throw new Error('Current deck links disagree with validation-current.json')
  if (createHash('sha256').update(readFileSync(resolve(sourceRoot,manifest.presentation))).digest('hex') !== deck.sha256) throw new Error('Current deck checksum differs from validation receipt')
  for (const file of ['README.md',manifest.contract,manifest.adoptionGuide,manifest.componentInventory,'docs/design/shadcn-mapping.md','docs/design/app-shell-integration.md']) {
    for (const [,url] of readFileSync(resolve(sourceRoot,file),'utf8').matchAll(/\]\(([^\s)]+)\)/g)) {
      if (/^(?:https?:|#)/.test(url)) continue
      if (!existsSync(resolve(dirname(resolve(sourceRoot,file)),url.split('#')[0]))) throw new Error(`Broken link in ${file}: ${url}`)
    }
  }
  const result = spawnSync(runtime.pythonExecutable(),[join(root,'scripts/build-tokens.py'),'--root',sourceRoot,'--check'],{cwd:sourceRoot,encoding:'utf8',windowsHide:true})
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stdout+result.stderr)
  console.log(result.stdout.trim())
  const style = spawnSync(runtime.pythonExecutable(),[join(root,'scripts/brand-styles.py'),'--tokens',join(sourceRoot,'assets/brand/tokens.json'),'--output',join(sourceRoot,'assets/brand/charts/idrl.mplstyle'),'--check'],{cwd:sourceRoot,encoding:'utf8',windowsHide:true})
  if (style.error || style.status !== 0) throw new Error(style.error?.message || style.stdout+style.stderr)
  console.log(`VI contract, current assets and ${createAdoptionKit({sourceRoot}).files(manifest).length} export inputs verified`)
  return manifest
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv[2] === 'check') check()
    else if (process.argv[2] === 'check-ui') {checkUi();console.log('UI adoption inputs verified')}
    else if (process.argv[2] === 'export') exportKit()
    else if (process.argv[2] === 'verify' && process.argv[3]) {verifySnapshot(process.argv[3]);console.log('Snapshot checksums verified')}
    else throw new Error('Usage: node scripts/vi-kit.mjs check|check-ui|export|verify <snapshot>')
  } catch (error) {console.error(error.message);process.exitCode=1}
}
