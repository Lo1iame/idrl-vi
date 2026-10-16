import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, mkdtempSync, mkdirSync, copyFileSync, writeFileSync, unlinkSync, rmSync, realpathSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { root, kitFiles, exportKit, createAdoptionKit, verifySnapshot, check } from '../scripts/vi-kit.mjs'

function withSource(run) {
  const sourceRoot=mkdtempSync(join(tmpdir(),'idrl-kit-test-'))
  try {
    for(const file of kitFiles()) {
      const dest=join(sourceRoot,file);mkdirSync(dirname(dest),{recursive:true});copyFileSync(join(root,file),dest)
    }
    execFileSync('git',['init','--quiet'],{cwd:sourceRoot,windowsHide:true})
    execFileSync('git',['-c','user.name=Kit Test','-c','user.email=kit@example.invalid','commit','--allow-empty','--quiet','-m','fixture'],{cwd:sourceRoot,windowsHide:true})
    run(sourceRoot,createAdoptionKit({sourceRoot}))
  } finally {
    const resolved=realpathSync(sourceRoot)
    assert.equal(dirname(resolved),realpathSync(tmpdir()))
    assert.ok(basename(resolved).startsWith('idrl-kit-test-'))
    rmSync(resolved,{recursive:true})
  }
}

test('UI-only source exports without research artifacts; full audit still rejects their absence',()=>withSource((sourceRoot,kit)=>{
  assert.ok(!existsSync(join(sourceRoot,'output/research-template')))
  assert.throws(()=>check({sourceRoot}),/Missing presentation:/)
  const first=kit.export(), receipt=readFileSync(join(first,'manifest.json'),'utf8')
  const second=kit.export()
  assert.notEqual(first,second)
  assert.equal(readFileSync(join(first,'manifest.json'),'utf8'),receipt)
  verifySnapshot(first);verifySnapshot(second)
  writeFileSync(join(first,'src/ui.css'),'tampered')
  assert.throws(()=>verifySnapshot(first),/Snapshot checksum mismatch: src\/ui.css/)
}))

test('UI validation rejects missing dependencies before creating an output',()=>withSource((sourceRoot,kit)=>{
  unlinkSync(join(sourceRoot,'src/components/ui/primitives.css'))
  assert.throws(()=>kit.export(),/Export dependency missing/)
  assert.ok(!existsSync(join(sourceRoot,'output/adoption-kit')))
}))

test('UI validation rejects token version drift and stale generated CSS',()=>withSource((sourceRoot,kit)=>{
  const path=join(sourceRoot,'assets/brand/reuse-manifest.json'), original=readFileSync(path,'utf8')
  const manifest=JSON.parse(original);manifest.tokenVersion='invalid'
  writeFileSync(path,JSON.stringify(manifest))
  assert.throws(()=>kit.check(),/token version differs/)
  writeFileSync(path,original)
  writeFileSync(join(sourceRoot,'assets/brand/tokens-values.css'),'stale')
  assert.throws(()=>kit.check(),/Stale generated files/)
}))

test('UI validation rejects paths outside its source',()=>withSource((sourceRoot,kit)=>{
  const path=join(sourceRoot,'assets/brand/reuse-manifest.json'), manifest=JSON.parse(readFileSync(path,'utf8'))
  manifest.export.files.push('../outside.txt');writeFileSync(path,JSON.stringify(manifest))
  assert.throws(()=>kit.check(),/Invalid repository path/)
}))

test('adoption snapshot contains its dependency closure and verifiable source hashes',()=>{
  const output=exportKit()
  const manifest=JSON.parse(readFileSync(join(output,'manifest.json'),'utf8'))
  assert.match(manifest.sourceCommit,/^[a-f0-9]{40}$/)
  assert.equal(typeof manifest.sourceDirty,'boolean')
  assert.equal(manifest.tokenVersion,JSON.parse(readFileSync(join(root,'assets/brand/tokens.json'),'utf8')).version)
  assert.deepEqual(manifest.files.map(file=>file.path),kitFiles())
  for(const file of manifest.files) {
    const digest=createHash('sha256').update(readFileSync(join(output,file.path))).digest('hex')
    assert.equal(digest,file.sha256,file.path)
  }
  assert.ok(existsSync(join(output,'examples/adoption/main.tsx')))
  assert.ok(existsSync(join(output,'src/ui.css')))
  assert.ok(!manifest.files.some(file=>['src/styles.css','src/design-refresh.css'].includes(file.path)))
  assert.ok(!manifest.files.some(file=>/react-bits|demo-data|app-navigation|fonts\.css|CJKsc-.*-web/.test(file.path)))
  assert.ok(!readFileSync(join(output,'src/components/app-shell.tsx'),'utf8').includes('idrlAppConfig'))
})

test('shadcn aliases cover sidebar, charts and contrast-sensitive destructive foreground without cycles',()=>{
  const css=readFileSync(join(root,'assets/brand/shadcn-aliases.css'),'utf8')
  const tokens=JSON.parse(readFileSync(join(root,'assets/brand/tokens.json'),'utf8'))
  const kebab=key=>key.replace(/[A-Z]/g,c=>`-${c.toLowerCase()}`)
  const known=new Set([...Object.keys(tokens.light).map(kebab),...Object.keys(tokens.radius).map(key=>`radius-${key}`)])
  for(const [,name,target] of css.matchAll(/--([\w-]+): var\(--([\w-]+)\)/g)) {
    assert.notEqual(name,target)
    assert.ok(known.has(target),`Unknown token ${target}`)
  }
  for(const name of ['sidebar-ring','chart-5','destructive-foreground']) assert.ok(css.includes(`--${name}:`))
  assert.ok(css.includes('[data-theme="dark"]'))
})
