import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { root, kitFiles, exportKit } from '../scripts/vi-kit.mjs'

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
