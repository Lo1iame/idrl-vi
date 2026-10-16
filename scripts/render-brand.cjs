const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const {pathToFileURL}=require('node:url');
const {execFileSync}=require('node:child_process');
const {pythonExecutable}=require('./asset-runtime.cjs');
const root=path.resolve(__dirname,'..');
(async()=>{
 const out=path.join(root,'output/brand'); await fs.mkdir(out,{recursive:true});
 if (process.argv.includes('--review')) {
 const python=pythonExecutable(['reportlab']);
 const channel=process.env.BROWSER_CHANNEL||(process.platform==='win32'?'msedge':undefined);
 const browser=await chromium.launch({headless:true,...(channel?{channel}:{})});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:960},deviceScaleFactor:2});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.join(root,'docs/design/foundation.html')).href);
  await page.evaluate(()=>document.fonts.ready);
  const missing=await page.evaluate(()=>Array.from(document.images).filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
  if(missing.length||errors.length)throw new Error(JSON.stringify({missing,errors}));
  await page.addStyleTag({content:'@media screen{.page{margin:0}}'});
  for(const [i,id] of ['brand','logo','color','type','system'].entries()){
   const shot=await browser.newPage({viewport:{width:1440,height:960},deviceScaleFactor:2});
   await shot.goto(pathToFileURL(path.join(root,'docs/design/foundation.html')).href);
   await shot.evaluate(id=>{document.querySelectorAll('.page').forEach(p=>{if(p.id!==id)p.remove()});window.scrollTo(0,0)},id);
   await shot.addStyleTag({content:'.page{margin:0!important}'});
   await shot.evaluate(()=>document.fonts.ready);
   await shot.screenshot({path:path.join(out,`foundation-${i+1}.png`),fullPage:true});
   await shot.close();
  }
  await page.evaluate(()=>{document.querySelectorAll('.page').forEach(p=>p.style.display='');window.scrollTo(0,0)});
  const overflows=await page.evaluate(()=>Array.from(document.querySelectorAll('.page')).filter(p=>p.scrollHeight>p.clientHeight || (p.id!=='brand'&&p.scrollWidth>p.clientWidth)).map(p=>p.id));
  if(overflows.length)throw new Error('Page overflow: '+overflows.join(','));
  execFileSync(python,[path.join(root,'scripts/export-review.py')],{stdio:'inherit',windowsHide:true});
 } finally {await browser.close()}
 }
  const logos=path.join(root,'assets/brand/logo');
  for(const name of (await fs.readdir(logos)).filter(x=>x.endsWith('.svg'))){
   await sharp(path.join(logos,name),{density:216}).resize({width:name.startsWith('symbol')?1024:2400}).png().toFile(path.join(out,name.replace('.svg','.png')));
  }
  console.log(process.argv.includes('--review')?'Rendered historical review pages, PDF, and logo PNGs.':'Rendered current logo PNGs; historical foundation review preserved.');
})().catch(e=>{console.error(e);process.exit(1)});
