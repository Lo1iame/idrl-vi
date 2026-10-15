import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, mkdtempSync, copyFileSync, writeFileSync, realpathSync } from 'node:fs'
import { resolve, relative, dirname, join, isAbsolute, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import runtime from './asset-runtime.cjs'

export const root = fileURLToPath(new URL('..', import.meta.url))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const readJson = path => JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''))
function inside(base, name) {
  const path = resolve(base, name), rel = relative(base, path)
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error(`Invalid repository path: ${name}`)
  if (existsSync(path)) {
    const real = relative(realpathSync(base), realpathSync(path))
    if (real === '..' || real.startsWith(`..${sep}`) || isAbsolute(real)) throw new Error(`Path escapes repository: ${name}`)
  }
  return path
}
function generatedUiCheck(sourceRoot) {
  const python = runtime.pythonExecutable()
  for (const args of [
    ['build-tokens.py', '--root', sourceRoot, '--ui-only', '--check'],
    ['build-favicon.py', '--logo-dir', join(sourceRoot,'assets/brand/logo'), '--tokens', join(sourceRoot,'assets/brand/tokens.json'), '--check'],
  ]) {
    const result = spawnSync(python, [join(root,'scripts',args[0]), ...args.slice(1)], {cwd:sourceRoot,encoding:'utf8',windowsHide:true})
    if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stdout + result.stderr)
  }
}

/** Owns source validation, dependency closure, provenance and immutable snapshot writes. */
export function createAdoptionKit({sourceRoot = root, outputRoot = join(sourceRoot,'output/adoption-kit')} = {}) {
  sourceRoot = resolve(sourceRoot)
  const safe = name => inside(sourceRoot,name)
  const read = name => readFileSync(safe(name),'utf8').replace(/^\uFEFF/,'')
  const json = name => JSON.parse(read(name))
  const manifest = () => json('assets/brand/reuse-manifest.json')
  function walk(directory) {
    return readdirSync(safe(directory)).flatMap(name => {
      const file = `${directory}/${name}`
      return statSync(safe(file)).isDirectory() ? walk(file) : [file]
    })
  }
  function files(plan = manifest()) {
    return [...new Set([...plan.export.files, ...plan.export.directories.flatMap(walk)])].sort()
  }
  function inspect() {
    const plan = manifest(), tokens = json(plan.tokens)
    if (plan.tokenVersion !== tokens.version) throw new Error('Manifest token version differs from tokens.json')
    for (const key of ['contract','glossary','adoptionGuide','componentInventory','tokens','tokenCss','shadcnAliases','logoDirectory','favicon','applicationIcon','uiStyles']) {
      if (!plan[key] || !existsSync(safe(plan[key]))) throw new Error(`Missing ${key}: ${plan[key]}`)
    }
    if (JSON.stringify(Object.keys(tokens.light).sort()) !== JSON.stringify(Object.keys(tokens.dark).sort())) throw new Error('Light/dark semantic token keys differ')
    const names = files(plan), included = new Set(names.map(safe))
    for (const name of names) if (!existsSync(safe(name))) throw new Error(`Missing export input: ${name}`)
    for (const name of names.filter(name => /\.(tsx?|css)$/.test(name))) {
      const content = read(name)
      const refs = [...content.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g), ...content.matchAll(/(?:url\(\s*|@import\s*)['"](\.[^'"]+)['"]/g)]
      for (const [, ref] of refs) {
        const target = resolve(dirname(safe(name)),ref.split('?')[0])
        if (![target, ...['.ts','.tsx','.css'].map(ext=>target+ext)].some(path=>included.has(path))) throw new Error(`Export dependency missing: ${name} -> ${ref}`)
      }
    }
    generatedUiCheck(sourceRoot)
    return {plan,names}
  }
  function exportSnapshot() {
    const {plan,names} = inspect()
    const git = (...args) => {
      const result = spawnSync('git',args,{cwd:sourceRoot,encoding:'utf8',windowsHide:true})
      if (result.status !== 0) throw new Error(result.stderr || 'Git source metadata unavailable')
      return result.stdout.trim()
    }
    const sourceCommit = git('rev-parse','HEAD'), sourceDirty = Boolean(git('status','--porcelain'))
    const entries = names.map(name=>({path:name,sha256:hash(readFileSync(safe(name)))}))
    mkdirSync(outputRoot,{recursive:true})
    const output = mkdtempSync(join(outputRoot,`idrl-${plan.tokenVersion.replace(/[^a-zA-Z0-9.-]/g,'_')}-${sourceCommit.slice(0,7)}-`))
    for (const entry of entries) {
      const dest = inside(output,entry.path)
      mkdirSync(dirname(dest),{recursive:true}); copyFileSync(safe(entry.path),dest)
    }
    const pkg = json('package.json')
    writeFileSync(join(output,'manifest.json'),JSON.stringify({schemaVersion:1,sourceRepository:'https://github.com/zweien/idrl-vi',sourceCommit,sourceDirty,tokenVersion:plan.tokenVersion,createdAt:new Date().toISOString(),status:'source-copy',dependencies:pkg.dependencies,devDependencies:pkg.devDependencies,files:entries,excluded:['showcase Chinese font subsets','demo pages/data/navigation','React Bits adapters','GSAP source integration','PPT/PDF historical artifacts']},null,2)+'\n')
    writeFileSync(join(output,'README.md'),'# IDRL UI 接入快照\n\n先读 DESIGN.md、CONTEXT.md 与 docs/design/adoption.md。\n\n来源、工作区状态及逐文件校验和见 manifest.json。本包只提供源码参考，不是 npm 发布。\n\n可运行步骤见 examples/adoption/README.md。公共样式入口为 src/ui.css；宿主负责页面背景、字体文件与文档 reset。\n\nreuse-manifest.json 的科研材料路径指向源仓库，这些材料没有放入 UI 接入快照。\n')
    verifySnapshot(output)
    console.log(`Adoption snapshot: ${output}\nSource: ${sourceCommit}; uncommitted changes: ${sourceDirty}`)
    return output
  }
  return {files,check:()=>inspect().plan,export:exportSnapshot}
}

export function verifySnapshot(directory) {
  const snapshotRoot = resolve(directory), receipt = readJson(join(snapshotRoot,'manifest.json'))
  const seen = new Set()
  for (const entry of receipt.files) {
    const path = inside(snapshotRoot,entry.path)
    if (seen.has(path)) throw new Error(`Duplicate snapshot entry: ${entry.path}`)
    seen.add(path)
    if (!existsSync(path) || hash(readFileSync(path)) !== entry.sha256) throw new Error(`Snapshot checksum mismatch: ${entry.path}`)
  }
  return receipt
}
