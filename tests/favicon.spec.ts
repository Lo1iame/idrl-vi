import { test, expect } from '@playwright/test'
import sharp from 'sharp'

test('favicon uses a transparent square and adapts navy paths to browser color scheme',async({page,request})=>{
  await page.goto('/#changelog')
  const href=await page.locator('link[rel="icon"]').getAttribute('href')
  expect(href).toBe('/assets/brand/logo/favicon.svg')
  const response=await request.get(href!)
  expect(response.ok()).toBe(true)
  const svg=await response.text()
  expect(svg).toContain('viewBox="0 0 64 64"')
  expect(svg).not.toContain('<rect')
  const url=response.url()
  await page.setContent(`<html><body style="margin:0"><img alt="IDRL favicon" src="${url}" width="64" height="64"></body></html>`)
  await page.getByRole('img',{name:'IDRL favicon'}).evaluate((img:HTMLImageElement)=>img.decode())
  for(const [scheme,color] of [['light',[32,54,99]],['dark',[143,184,220]]] as const) {
    await page.emulateMedia({colorScheme:scheme})
    const png=await page.getByRole('img',{name:'IDRL favicon'}).screenshot({omitBackground:true})
    const {data,info}=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true})
    expect(info.width).toBe(64);expect(info.height).toBe(64)
    expect(data[3]).toBe(0)
    let colored=0
    for(let i=0;i<data.length;i+=4) if(data[i]===color[0]&&data[i+1]===color[1]&&data[i+2]===color[2]&&data[i+3]===255)colored++
    expect(colored).toBeGreaterThan(5)
    await sharp(png).resize(512,512,{kernel:'nearest'}).toFile(`output/ui/favicon-${scheme}.png`)
  }
})
