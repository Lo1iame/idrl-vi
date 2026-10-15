import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, mkdtempSync, copyFileSync, writeFileSync } from 'node:fs'
import { resolve, relative, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import runtime from './asset-runtime.cjs'

export const root = fileURLToPath(new URL('..',import.meta.url))
const read = name => readFileSync(resolve(root,name),'utf8').replace(/^\uFEFF/,'')
const json = name => JSON.parse(read(name))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const safe = name => {
  const path=resolve(root,name), rel=relative(root,path)
  if(rel.startsWith('..') || resolve(path)===resolve(root)) throw new Error(`Invalid repository path: ${name}`)
  return path
}
function walk(directory) {
  return readdirSync(safe(directory)).flatMap(name=>{
    const file=`${directory}/${name}`
    return statSync(safe(file)).isDirectory()?walk(file):[file]
  })
}
export function kitFiles(manifest=json('assets/brand/reuse-manifest.json')) {
  return [...new Set([...manifest.export.files,...manifest.export.directories.flatMap(walk)])].sort()
}
export function check() {
  const manifest=json('assets/brand/reuse-manifest.json'), tokens=json(manifest.tokens)
  if(manifest.tokenVersion!==tokens.version) throw new Error('Manifest token version differs from tokens.json')
  for(const key of ['contract','glossary','adoptionGuide','componentInventory','tokens','tokenCss','shadcnAliases','logoDirectory','favicon','applicationIcon','presentation','presentationPreview','presentationValidation','foundationPreview']) {
    if(!existsSync(safe(manifest[key]))) throw new Error(`Missing ${key}: ${manifest[key]}`)
  }
  const deck=json(manifest.presentationValidation)
  if(!manifest.presentation.endsWith(`/${deck.file}`)||!manifest.presentationPreview.endsWith(`/${deck.pdf}`)) throw new Error('Current deck links disagree with validation-current.json')
  if(hash(readFileSync(safe(manifest.presentation)))!==deck.sha256) throw new Error('Current deck checksum differs from validation receipt')
  if(JSON.stringify(Object.keys(tokens.light).sort())!==JSON.stringify(Object.keys(tokens.dark).sort())) throw new Error('Light/dark semantic token keys differ')
  for(const file of kitFiles(manifest)) if(!existsSync(safe(file))) throw new Error(`Missing export input: ${file}`)
  // Current normative documents only. Historical reports intentionally retain past versions.
  for(const file of ['README.md',manifest.contract,manifest.adoptionGuide,manifest.componentInventory,'docs/design/shadcn-mapping.md','docs/design/app-shell-integration.md']) {
    for(const [,url] of read(file).matchAll(/\]\(([^\s)]+)\)/g)) {
      if(/^(?:https?:|#)/.test(url)) continue
      const path=resolve(dirname(safe(file)),url.split('#')[0])
      if(!existsSync(path)) throw new Error(`Broken link in ${file}: ${url}`)
    }
  }
  for(const file of kitFiles(manifest).filter(file=>/\.(tsx?|css)$/.test(file))) {
    const content=read(file)
    // Validate static relative module / CSS / asset references without relying on the original app's resolver.
    const refs=[...content.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g), ...content.matchAll(/(?:url\(\s*|@import\s*)['"](\.[^'"]+)['"]/g)]
    for(const [,ref] of refs) {
      const target=resolve(dirname(safe(file)),ref.split('?')[0])
      const candidates=[target,...['.ts','.tsx','.css'].map(ext=>target+ext)]
      if(!candidates.some(path=>kitFiles(manifest).some(name=>safe(name)===path))) throw new Error(`Export dependency missing: ${file} -> ${ref}`)
    }
  }
  const result=spawnSync(runtime.pythonExecutable(),['scripts/build-tokens.py','--check'],{cwd:root,encoding:'utf8',windowsHide:true})
  if(result.error||result.status!==0) throw new Error(result.error?.message||result.stdout+result.stderr)
  console.log(result.stdout.trim())
  const icons=spawnSync(runtime.pythonExecutable(),['scripts/build-favicon.py','--check'],{cwd:root,encoding:'utf8',windowsHide:true})
  if(icons.error||icons.status!==0) throw new Error(icons.error?.message||icons.stdout+icons.stderr)
  console.log(icons.stdout.trim())
  console.log(`VI contract, current assets and ${kitFiles(manifest).length} export inputs verified`)
  return manifest
}
export function exportKit() {
  const manifest=check()
  const git=(...args)=>{
    const result=spawnSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true})
    if(result.status!==0) throw new Error(result.stderr||'Git source metadata unavailable')
    return result.stdout.trim()
  }
  const sourceCommit=git('rev-parse','HEAD'), sourceDirty=Boolean(git('status','--porcelain'))
  const parent=resolve(root,'output/adoption-kit'); mkdirSync(parent,{recursive:true})
  const output=mkdtempSync(join(parent,`idrl-${manifest.tokenVersion}-${sourceCommit.slice(0,7)}-`))
  const files=kitFiles(manifest).map(name=>{
    const dest=join(output,name);mkdirSync(dirname(dest),{recursive:true});copyFileSync(safe(name),dest)
    return {path:name,sha256:hash(readFileSync(dest))}
  })
  const pkg=json('package.json')
  writeFileSync(join(output,'manifest.json'),JSON.stringify({schemaVersion:1,sourceRepository:'https://github.com/zweien/idrl-vi',sourceCommit,sourceDirty,tokenVersion:manifest.tokenVersion,createdAt:new Date().toISOString(),status:'source-copy',dependencies:pkg.dependencies,devDependencies:pkg.devDependencies,files,excluded:['showcase Chinese font subsets','demo pages/data/navigation','React Bits adapters','GSAP source integration','PPT/PDF historical artifacts']},null,2)+'\n')
  writeFileSync(join(output,'README.md'),'# IDRL UI 接入快照\n\n先读 DESIGN.md、CONTEXT.md 与 docs/design/adoption.md。\n\n来源、工作区状态及逐文件校验和见 manifest.json。本包只提供源码参考，不是 npm 发布。\n\n可运行步骤见 examples/adoption/README.md。保留目录结构，切勿将参考全局 CSS 直接覆盖到既有应用。\n\nreuse-manifest.json 的科研材料路径指向源仓库，这些材料没有放入 UI 接入快照。\n')
  console.log(`Adoption snapshot: ${output}`)
  console.log(`Source: ${sourceCommit}; uncommitted changes: ${sourceDirty}`)
  return output
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    if(process.argv[2]==='check') check()
    else if(process.argv[2]==='export') exportKit()
    else throw new Error('Usage: node scripts/vi-kit.mjs check|export')
  } catch(error) {console.error(error.message);process.exitCode=1}
}
