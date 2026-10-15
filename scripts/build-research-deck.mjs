// Run from a private build directory linked to the bundled runtime node_modules.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assetRuntime from './asset-runtime.cjs';
const { root, presentationEnvironment } = assetRuntime;
if (!process.send) throw new Error('Run npm run deck:build; this module is the isolated rendering worker.');
const { runtime, skill, python } = presentationEnvironment();
const revision = process.env.IDRL_DECK_REVISION || 'v3-final';
if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(revision)) throw new Error('IDRL_DECK_REVISION must contain only letters, numbers and hyphens.');
const finalPath = path.join(root, 'output/research-template', `idrl-research-template-${revision}.pptx`);
try { await fs.access(finalPath); throw new Error(`Output already exists: ${finalPath}. Set IDRL_DECK_REVISION to a new revision; existing decks are preserved.`); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const { Presentation, PresentationFile, FileBlob } = await import(pathToFileURL(path.join(runtime, 'node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs')).href);
const { finalizePresentation, applyPresentationChartFont } = await import(pathToFileURL(path.join(skill, 'container_tools/artifact_tool_utils.mjs')).href);
const out = path.join(root, 'output/research-template');
const tmp = path.join(root, '.scratch/presentation-build', revision);
const previewDir = path.join(tmp, 'preview');
await fs.mkdir(out, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });
const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const C = { navy:'#203663', blue:'#236db9', cyan:'#56c0e5', ink:'#182a43', muted:'#52637a', rule:'#dce4ef', pale:'#edf3fa', white:'#ffffff' };
const font = 'Noto Sans CJK SC';
p.theme.defaultFont = font;
function text(s,t,x,y,w,h,size=28,color=C.ink,bold=false,latin=false) {
  const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  a.text=t; a.text.style={typeface:latin?'Inter':font,fontSize:size,color,bold}; return a;
}
function rect(s,x,y,w,h,fill) { return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}}); }
async function logo(s,reverse=false,x=1060,y=45,w=148,h=60) {
  s.images.add({blob:new Uint8Array(await fs.readFile(path.join(root,'output/brand',reverse?'lockup-idrl-reverse.png':'lockup-idrl.png'))),contentType:'image/png',alt:'IDRL',fit:'contain',position:{left:x,top:y,width:w,height:h}});
}
async function slide(title,sub='',dark=false) {
  const s=p.slides.add(); s.background.fill=dark?C.navy:C.white;
  if(title) text(s,title,72,62,950,76,44,dark?C.white:C.navy,true);
  if(sub) text(s,sub,74,143,1110,48,22,dark?'#b8d9ee':C.muted);
  await logo(s,dark);
  text(s,String(p.slides.items.length).padStart(2,'0'),1155,659,55,26,16,dark?'#b8d9ee':C.muted,false,true);
  return s;
}
function foot(s,t){text(s,t,74,620,1100,38,17,C.muted);}
function row(s,n,title,detail,y){text(s,n,76,y,85,66,40,C.blue,true,true);text(s,title,183,y,940,48,30,C.navy,true);text(s,detail,185,y+53,930,50,23,C.muted);}
function table(s,values,y=235,widths){
  const a=s.tables.add({rows:values.length,columns:values[0].length,left:74,top:y,width:1132,height:values.length* sixty(),values,...(widths?{columnWidths:widths}:{})});
  a.borders.assign({fill:C.rule,width:1,style:'solid'});
  for(let r=0;r<values.length;r++) for(let c=0;c<values[0].length;c++) {const cell=a.getCell(r,c);cell.fill=r===0?C.navy:r%2?C.white:C.pale;cell.text.style={typeface:font,fontSize:22,color:r===0?C.white:C.ink,bold:r===0};}
  return a;
}
function sixty(){return 60;}
const demo = {categories:['Task A','Task B','Task C'],baseline:[71,65,59],proposed:[78,74,69],steps:['0','20','40','60','80','100'],lossBase:[1.6,1.12,.85,.71,.63,.58],lossNew:[1.6,.95,.63,.47,.39,.34],noise:['0.00','0.05','0.10','0.15','0.20'],robustBase:[84,78,67,53,39],robustNew:[85,82,77,69,60]};
await fs.writeFile(path.join(out,'illustrative-data.json'),JSON.stringify({notice:'Synthetic illustrative data only; not IDRL research results.',...demo},null,2));
function chart(s,type,categories,a,b,yTitle,max){
  const series=[{name:'Baseline',values:a,fill:C.navy,line:{fill:C.navy,width:3,style:'dashed'},marker:{symbol:'square',size:8,fill:C.navy}},{name:'Proposed',values:b,fill:C.blue,line:{fill:C.blue,width:3,style:'solid'},marker:{symbol:'circle',size:8,fill:C.blue}}];
  const ch=s.charts.add(type,{position:{left:76,top:225,width:1100,height:370},categories,series,hasLegend:true,legend:{position:'bottom',textStyle:{fontSize:20,fill:C.ink}},barOptions:{direction:'column',grouping:'clustered',gapWidth:100},lineOptions:{smooth:false},xAxis:{textStyle:{fontSize:19,fill:C.muted}},yAxis:{title:yTitle,min:0,max,numberFormatCode:max===100?'0':'0.0',textStyle:{fontSize:18,fill:C.muted},majorGridlines:{fill:C.rule,width:1,style:'solid'}},chartFill:C.white,plotAreaFill:C.white,dataLabels:{showValue:type==='bar',position:'outEnd',textStyle:{fontSize:18,fill:C.ink}}});
  applyPresentationChartFont(ch,{fontFamily:'Inter'}); return ch;
}
let s=await slide('');
text(s,'研究报告标题',73,226,1000,110,66,C.navy,true);
text(s,'在这里写一句清晰的研究主张',76,351,1050,58,30,C.muted);
text(s,'汇报人姓名  ·  学术交流 / 组会  ·  YYYY.MM',76,546,1100,48,23,C.muted);
text(s,'Intelligent Design and Robust Learning',76,606,1080,35,21,C.blue,false,true);
s=await slide('从研究问题到证据','汇报结构 · 按研究内容替换以下标题');
row(s,'01','问题与假设','研究对象、现有不足，以及可检验的假设',229);
row(s,'02','方法与实验','核心机制、公平对照和复现条件',365);
row(s,'03','证据与边界','主要结果、失效条件与下一步验证',501);
s=await slide('', '',true);
text(s,'01 / RESEARCH QUESTION',76,217,1100,40,24,'#9bdcf2',false,true);
text(s,'问题与假设',72,288,1110,98,66,C.white,true);
text(s,'用一个明确的问题，串起方法与证据。',77,430,1100,66,30,'#dce4ef');
s=await slide('我们要解决什么问题？','把背景、缺口与可检验假设分开表述');
row(s,'01','研究背景','[对象] 在 [场景] 中受到 [约束] 的影响。',225);
row(s,'02','关键缺口','现有方法在 [条件] 下存在 [可测量问题]。',357);
row(s,'03','研究假设','通过 [机制]，可以改善 [指标]，且满足 [约束]。',489);
s=await slide('相关工作与研究定位','填写真实文献；在方法名称后添加对应引用编号');
table(s,[['方法 / 文献','主要假设','适用条件','尚未解决'],['[方法 A, 1]','[假设]','[条件]','[局限]'],['[方法 B, 2]','[假设]','[条件]','[局限]'],['本研究','[新增机制]','[验证范围]','[开放问题]']],235);
foot(s,'引用格式：[1] 作者. 论文标题. 会议 / 期刊, 年份. DOI / URL.');
s=await slide('方法：从输入到可验证输出','流程图中的模块与文字均可编辑');
const nodes=[['输入','数据 / 约束'],['表征','编码 / 结构'],['优化','目标 / 学习'],['输出','设计 / 预测']];
nodes.forEach((n,i)=>{const x=76+i*294;rect(s,x,294,245,158,i===2?C.navy:C.pale);text(s,n[0],x+23,316,202,47,32,i===2?C.white:C.navy,true);text(s,n[1],x+23,378,202,36,22,i===2?'#dce4ef':C.muted);if(i<3)text(s,'→',x+252,341,41,55,31,C.blue);});
text(s,'核心机制',78,511,190,44,26,C.blue,true);text(s,'[说明一个决定性设计，并指出它对应的实验验证。]',275,509,915,78,25,C.ink);
s=await slide('目标函数与符号约定','替换为实际数学表达式；此处为可编辑文本示例');
text(s,'L = Ltask + λ Lrobust',100,270,1090,100,54,C.navy,true,true);
table(s,[['符号','含义','报告要求'],['Ltask','主任务损失','定义计算方式与归一化'],['Lrobust','鲁棒性约束项','说明扰动集合与适用条件'],['λ','权重系数','报告取值与选择依据']],398);
s=await slide('实验设置与复现条件','让读者理解比较是否公平、结果能否复现');
table(s,[['项目','需要填写的信息'],['数据与划分','[数据来源、许可、样本量、训练 / 验证 / 测试划分]'],['对照与预算','[基线版本、调参预算、训练步数、公平性约束]'],['运行环境','[硬件、依赖版本、随机种子、运行次数]'],['评价与不确定性','[指标方向、单位、聚合方式、误差条定义]']],218,[265,867]);
foot(s,'复现入口：[代码仓库 / commit]  ·  [配置文件]  ·  [数据版本]');
s=await slide('主要结果：任务间对比','准确率（%）↑ · 示例数据，不代表真实研究结论');
chart(s,'bar',demo.categories,demo.baseline,demo.proposed,'Accuracy (%)',100);
foot(s,'示例为单组展示值，无重复实验；正式报告须补充运行次数及不确定性。');
s=await slide('训练过程：收敛趋势','横轴：训练轮次 · 纵轴：损失 ↓ · 示例数据');
chart(s,'line',demo.steps,demo.lossBase,demo.lossNew,'Loss',2);
foot(s,'保持相同训练预算与评价频率；比较曲线时同时报告最终性能和成本。');
s=await slide('消融实验：机制贡献','示例数值 · 保持其余配置一致，逐项改变组件');
table(s,[['配置','组件 A','组件 B','指标 ↑'],['Baseline','—','—','71.0'],['+ A','启用','—','74.0'],['+ B','—','启用','73.0'],['完整方法','启用','启用','78.0']],220);
foot(s,'此页仅演示排版；不能由这些示例数值推断真实因果关系或显著性。');
s=await slide('鲁棒性：性能随扰动的变化','横轴：归一化扰动强度 · 纵轴：准确率（%）↑ · 示例数据');
chart(s,'line',demo.noise,demo.robustBase,demo.robustNew,'Accuracy (%)',100);
foot(s,'正式报告须定义扰动类型、强度单位、攻击预算和评价协议。');
s=await slide('定性分析：把证据放在同一尺度','替换为真实样本，保留一致裁剪、尺度和色标');
['输入样本','对照方法','本研究'].forEach((t,i)=>{const x=76+i*388;text(s,t,x,228,354,45,28,C.navy,true);rect(s,x,299,354,242,C.pale);text(s,'插入实验图像',x+43,393,277,49,27,C.muted);});
foot(s,'图注：[样本来源 / 编号]  ·  [选择规则]  ·  [指出可见差异及失败案例]');
s=await slide('结论、边界与下一步','将已有证据与待验证假设明确区分');
row(s,'01','主要发现','[用一句话写出证据支持的结论及适用范围。]',225);
row(s,'02','当前局限','[数据、计算成本、假设或失败条件。]',357);
row(s,'03','下一步验证','[提出一个可执行的实验及其判断标准。]',489);
s=await slide('参考文献与复现资源','仅列本次汇报实际引用的资料');
text(s,'[1] 作者. 论文标题. 会议 / 期刊, 年份. DOI / URL.\n\n[2] 作者. 数据集或软件名称. 版本, 年份. URL.\n\n代码：[仓库地址与 commit]\n数据：[版本与访问说明]\n联系：[团队认可的邮箱或主页]',76,230,1110,346,27,C.ink);
s=await slide('', '',true);
text(s,'讨论与交流',72,255,1100,103,68,C.white,true);
text(s,'智能设计与鲁棒学习',77,406,1100,58,30,'#dce4ef');
text(s,'Intelligent Design and Robust Learning',77,481,1100,45,24,'#9bdcf2',false,true);
for (const sl of p.slides.items) sl.speakerNotes.text='IDRL 科研汇报模板。方括号为待替换内容；所有数值为合成示例，不代表团队成果。';
await (await PresentationFile.exportPptx(p)).save(path.join(tmp,'candidate.pptx'));
const result=await finalizePresentation({workspaceDir:root,candidatePath:path.join(tmp,'candidate.pptx'),finalPath,pythonExecutable:python,explicitTotalSlideCount:16,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit',...[5,7,8,11].flatMap(n=>['--require-native-table-slide',String(n)])],requiredNativeTableOwnerSlides:[5,7,8,11],requiredNativeChartOwnerSlides:[9,10,12],materializeLiteralChartWorkbooks:true,fontPolicy:{basis:'design',families:['Inter',font]},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation.json')});
const finalized = await PresentationFile.importPptx(await FileBlob.load(finalPath));
for (let i=0;i<finalized.slides.items.length;i++) {
  const preview = await finalized.export({slide:finalized.slides.items[i],format:'png',scale:1});
  await fs.writeFile(path.join(previewDir,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await preview.arrayBuffer()));
}
for (const name of await fs.readdir(previewDir)) await fs.copyFile(path.join(previewDir,name),path.join(out,name));
const indexPath = path.join(out, 'index.html');
const index = await fs.readFile(indexPath, 'utf8');
await fs.writeFile(indexPath, index.replace(/idrl-research-template-[a-zA-Z0-9-]+\.pptx/g, path.basename(finalPath)));
// Signal completion only after the finalizer and all preview writes succeed.
// The parent verifies the checksum, then terminates this native rendering worker.
process.send({ kind: 'complete', finalPath, sha256: result.finalSha256, receiptPath: result.receiptPath, slideCount: result.packageIntegrity.slide_count, nativeTables: result.nativeTableArithmetic.native_table_count, nativeCharts: result.nativeChartValidation.detectedChartCount });
await new Promise(() => { setInterval(() => {}, 60000); });
