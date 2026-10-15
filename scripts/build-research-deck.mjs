// Run from a private build directory linked to the bundled runtime node_modules.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import assetRuntime from './asset-runtime.cjs';
import { presentationPalette } from './presentation-palette.mjs';
const { root, presentationEnvironment } = assetRuntime;
if (!process.send) throw new Error('Run npm run deck:build; this module is the isolated rendering worker.');
const { runtime, skill, python } = presentationEnvironment();
const revision = process.env.IDRL_DECK_REVISION || 'v4';
if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(revision)) throw new Error('IDRL_DECK_REVISION must contain only letters, numbers and hyphens.');
const out = process.env.IDRL_DECK_OUTPUT_DIR ? path.resolve(process.env.IDRL_DECK_OUTPUT_DIR) : path.join(root,'output/research-template');
const finalPath = path.join(out, `idrl-research-template-${revision}.pptx`);
try { await fs.access(finalPath); throw new Error(`Output already exists: ${finalPath}. Set IDRL_DECK_REVISION to a new revision; existing decks are preserved.`); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const { Presentation, PresentationFile, FileBlob } = await import(pathToFileURL(path.join(runtime, 'node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs')).href);
const { finalizePresentation, applyPresentationChartFont } = await import(pathToFileURL(path.join(skill, 'container_tools/artifact_tool_utils.mjs')).href);
const revisionDir = path.join(root, '.scratch/presentation-build', revision);
await fs.mkdir(revisionDir,{recursive:true});
const tmp = await fs.mkdtemp(path.join(revisionDir,'run-'));
const previewDir = path.join(tmp, 'preview');
await fs.mkdir(out, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });
const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const tokens = JSON.parse(await fs.readFile(process.env.IDRL_TOKEN_FILE || path.join(root,'assets/brand/tokens.json'),'utf8'));
const C = presentationPalette(tokens);
const font = 'Noto Sans CJK SC';
p.theme.defaultFont = font;
const sectionOf = ['OPENING','OVERVIEW','QUESTION','QUESTION','POSITIONING','METHOD','OBJECTIVE','PROTOCOL','RESULTS','LEARNING','ABLATION','ROBUSTNESS','QUALITATIVE','CONCLUSION','RESOURCES','DISCUSSION'];
function text(s,t,x,y,w,h,size=28,color=C.ink,bold=false,latin=false) {
  const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  a.text=t; a.text.insets=0;
  a.text.style={typeface:latin?'Inter':font,fontSize:size,color,bold}; return a;
}
function rect(s,x,y,w,h,fill,line='none',radius=0) {
  return s.shapes.add({geometry:radius?'roundRect':'rect',borderRadius:radius,position:{left:x,top:y,width:w,height:h},fill,line:{fill:line,width:line==='none'?0:1}});
}
function panel(s,x,y,w,h,fill=C.pale) { return rect(s,x,y,w,h,fill,fill===C.pale?C.rule:'none',12); }
async function logo(s,dark=false) {
  s.images.add({blob:new Uint8Array(await fs.readFile(path.join(root,'output/brand',dark?'lockup-idrl-reverse.png':'lockup-idrl.png'))),contentType:'image/png',alt:'IDRL',fit:'contain',position:{left:64,top:32,width:148,height:45}});
}
const motif=(await fs.readFile(path.join(root,'assets/brand/logo/symbol-white.svg'),'utf8')).replaceAll('#ffffff','#344b75');
function watermark(s,x=786,y=236,w=430,h=244) {
  s.images.add({svg:motif,alt:'IDRL decorative geometry',fit:'contain',position:{left:x,top:y,width:w,height:h}});
}
async function slide(title='',sub='',dark=false) {
  const s=p.slides.add(); s.background.fill=dark?C.navy:C.white;
  const n=p.slides.items.length, label=sectionOf[n-1];
  await logo(s,dark);
  text(s,`${label}  /  ${String(n).padStart(2,'0')}`,916,49,300,26,16,dark?C.cool:C.muted,true,true);
  rect(s,64,102,1152,1,dark?'#405780':C.rule);
  if(title) text(s,title,64,134,1152,72,48,dark?C.white:C.ink,true);
  if(sub) text(s,sub,64,214,1152,38,22,dark?C.cool:C.muted);
  text(s,'IDRL / RESEARCH TEMPLATE',64,676,900,24,14,dark?C.cool:C.muted,false,true);
  text(s,`${String(n).padStart(2,'0')} / 16`,1130,676,86,24,14,dark?C.cool:C.muted,false,true);
  return s;
}
function foot(s,t){text(s,t,64,636,1152,30,17,C.muted);}
function table(s,values,{x=64,y=280,w=1152,h=values.length*64,widths,highlight=false,size=22}={}) {
  const a=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,values,...(widths?{columnWidths:widths}:{})});
  a.borders.assign({fill:C.rule,width:1,style:'solid'});
  for(let r=0;r<values.length;r++) for(let c=0;c<values[0].length;c++) {
    const last=highlight&&r===values.length-1;
    const cell=a.getCell(r,c);cell.fill=r===0?C.navy:last?C.blue:r%2?C.white:C.pale;
    cell.text.style={typeface:font,fontSize:size,color:r===0||last?C.white:C.ink,bold:r===0||last};
  }
  return a;
}
const demo = {categories:['Task A','Task B','Task C'],baseline:[71,65,59],proposed:[78,74,69],steps:['0','20','40','60','80','100'],lossBase:[1.6,1.12,.85,.71,.63,.58],lossNew:[1.6,.95,.63,.47,.39,.34],noise:['0.00','0.05','0.10','0.15','0.20'],robustBase:[84,78,67,53,39],robustNew:[85,82,77,69,60]};
await fs.writeFile(path.join(out,'illustrative-data.json'),JSON.stringify({notice:'Synthetic illustrative data only; not IDRL research results.',...demo},null,2));
function chart(s,type,categories,a,b,yTitle,max,{x=64,y=274,w=832,h=330}={}) {
  const series=[{name:'Baseline',values:a,fill:C.navy,line:{fill:C.navy,width:3,style:'dashed'},marker:{symbol:'square',size:8,fill:C.navy}},{name:'Proposed',values:b,fill:C.blue,line:{fill:C.blue,width:3,style:'solid'},marker:{symbol:'circle',size:8,fill:C.blue}}];
  const ch=s.charts.add(type,{position:{left:x,top:y,width:w,height:h},categories,series,hasLegend:true,legend:{position:'bottom',textStyle:{fontSize:20,fill:C.ink}},barOptions:{direction:'column',grouping:'clustered',gapWidth:100},lineOptions:{smooth:false},xAxis:{textStyle:{fontSize:19,fill:C.muted}},yAxis:{title:yTitle,min:0,max,numberFormatCode:max===100?'0':'0.0',textStyle:{fontSize:19,fill:C.muted},majorGridlines:{fill:C.rule,width:1,style:'solid'}},chartFill:C.white,plotAreaFill:C.white,dataLabels:{showValue:type==='bar',position:'outEnd',textStyle:{fontSize:19,fill:C.ink}}});
  applyPresentationChartFont(ch,{fontFamily:'Inter'});return ch;
}

// 01 — A navy cover with the same original geometry and quiet hierarchy as the VI board.
let s=await slide('','',true);
watermark(s,790,232,426,242);
text(s,'研究报告标题',64,224,700,110,72,C.white,true);
text(s,'在这里写一句清晰的研究主张',64,348,710,60,32,C.cool);
rect(s,64,442,48,5,C.cyan);
text(s,'智能设计与鲁棒学习',64,486,730,44,28,C.white,true);
text(s,'Intelligent Design and Robust Learning',64,538,750,36,22,C.cool,false,true);
text(s,'汇报人姓名  ·  学术交流 / 组会  ·  YYYY.MM',64,608,1100,34,22,C.cool);

// 02 — A three-part report map, with stronger color reserved for the main narrative.
s=await slide('从研究问题到证据','汇报结构 · 按研究内容替换以下标题');
const agenda=[['01','问题与假设','研究对象、现有不足，\n以及可检验的假设。',C.navy,C.white],['02','方法与实验','核心机制、公平对照，\n以及复现条件。',C.blue,C.white],['03','证据与边界','主要结果、失效条件，\n以及下一步验证。',C.pale,C.navy]];
agenda.forEach(([n,title,body,bg,fg],i)=>{const x=64+i*392;panel(s,x,282,368,296,bg);text(s,n,x+28,304,300,70,54,fg,true,true);text(s,title,x+28,396,312,48,30,fg,true);text(s,body,x+28,462,312,86,23,fg);});
foot(s,'问题定义 → 方法验证 → 证据边界：让研究主张与证据逐项对应。');

// 03 — Chapter divider, not another content page.
s=await slide('','',true);watermark(s,900,236,310,176);
text(s,'01',64,190,200,144,112,C.soft,true,true);
text(s,'问题与假设',292,254,800,100,68,C.white,true);
text(s,'用一个明确的问题，串起方法与证据。',292,374,900,58,28,C.cool);
rect(s,292,490,52,5,C.cyan);
text(s,'研究背景  /  关键缺口  /  可检验假设',292,528,900,42,22,C.cool);

// 04 — Background and gap support a visually dominant hypothesis.
s=await slide('我们要解决什么问题？','把背景、缺口与可检验假设分开表述');
[['01 / 研究背景','[对象] 在 [场景] 中受到\n[约束] 的影响。'],['02 / 关键缺口','现有方法在 [条件] 下存在\n[可测量问题]。']].forEach(([title,body],i)=>{const x=64+i*588;panel(s,x,280,564,166);text(s,title,x+24,300,516,40,25,C.blue,true);text(s,body,x+24,352,516,74,25);});
panel(s,64,470,1152,138,C.navy);
text(s,'03 / 研究假设',88,494,282,42,27,C.white,true);
text(s,'通过 [机制]，改善 [指标]，\n并满足 [约束]。',406,492,782,92,29,C.white);

// 05 — One native table with a clearly distinguished final method row.
s=await slide('相关工作与研究定位','填写真实文献；在方法名称后添加对应引用编号');
table(s,[['方法 / 文献','主要假设','适用条件','尚未解决'],['[方法 A, 1]','[假设]','[条件]','[局限]'],['[方法 B, 2]','[假设]','[条件]','[局限]'],['本研究','[新增机制]','[验证范围]','[开放问题]']],{y:282,h:256,highlight:true});
panel(s,64,564,1152,56);text(s,'定位依据：对照假设、适用条件与局限，避免只比较最终数值。',86,578,1108,32,21,C.navy);
foot(s,'引用格式：[1] 作者. 论文标题. 会议 / 期刊, 年份. DOI / URL.');

// 06 — Native editable flow blocks with one emphasized mechanism.
s=await slide('方法：从输入到可验证输出','流程图中的模块与文字均可编辑');
const nodes=[['输入','数据 / 约束'],['表征','编码 / 结构'],['优化','目标 / 学习'],['输出','设计 / 预测']];
nodes.forEach((n,i)=>{const x=64+i*294,active=i===2;panel(s,x,298,270,188,active?C.navy:C.pale);text(s,`0${i+1}`,x+24,318,218,34,20,active?C.soft:C.blue,true,true);text(s,n[0],x+24,365,218,48,34,active?C.white:C.navy,true);text(s,n[1],x+24,429,218,36,22,active?C.cool:C.muted);if(i<3)text(s,'→',x+271,365,24,46,26,C.blue);});
panel(s,64,526,1152,84,C.navy);text(s,'核心机制',88,548,198,44,28,C.white,true);text(s,'[说明决定性设计，以及它对应的实验验证。]',310,548,878,44,25,C.white);

// 07 — The objective and symbol dictionary form two distinct reading levels.
s=await slide('目标函数与符号约定','替换为实际数学表达式；此处为可编辑文本示例');
panel(s,64,282,480,320,C.navy);text(s,'优化目标',92,306,424,40,25,C.cool,true);
text(s,'L = Ltask\n  + λ Lrobust',92,376,424,142,47,C.white,true,true);
text(s,'主任务  +  鲁棒性约束',92,550,424,32,22,C.cool);
table(s,[['符号','含义','报告要求'],['Ltask','主任务损失','定义计算方式\n与归一化'],['Lrobust','鲁棒约束项','说明扰动集合\n与适用条件'],['λ','权重系数','报告取值\n与选择依据']],{x:568,y:282,w:648,h:320,widths:[118,208,322],size:21});
foot(s,'符号定义应与实现、配置和实验记录保持一致。');

// 08 — A protocol table plus a separate pre-report checklist.
s=await slide('实验设置与复现条件','让读者理解比较是否公平、结果能否复现');
table(s,[['项目','需要填写的信息'],['数据与划分','[数据来源、许可、样本量、\n训练 / 验证 / 测试划分]'],['对照与预算','[基线版本、调参预算、训练步数、\n公平性约束]'],['运行环境','[硬件、依赖版本、随机种子、运行次数]'],['评价与不确定性','[指标方向、单位、聚合方式、误差条定义]']],{y:282,w:800,h:320,widths:[210,590],size:21});
panel(s,888,282,328,320,C.navy);text(s,'报告前核对',912,306,280,42,27,C.white,true);
['数据版本','独立运行次数','计算预算与约束'].forEach((t,i)=>{rect(s,912,374+i*62,5,25,C.cyan);text(s,t,932,370+i*62,256,38,24,C.white);});
foot(s,'复现入口：[代码仓库 / commit]  ·  [配置文件]  ·  [数据版本]');

// 09 — Native evidence on the left, derived differences on the right; all synthetic.
s=await slide('主要结果：任务间对比','准确率（%）↑ · 示例数据，不代表真实研究结论');
chart(s,'bar',demo.categories,demo.baseline,demo.proposed,'Accuracy (%)',100);
panel(s,936,282,280,320,C.navy);text(s,'示例差值',960,306,232,38,26,C.white,true);text(s,'Proposed − Baseline / 百分点',960,350,232,50,17,C.cool);
demo.categories.forEach((name,i)=>{text(s,name,960,410+i*58,116,32,22,C.cool,false,true);text(s,`+${demo.proposed[i]-demo.baseline[i]}`,1090,400+i*58,102,52,38,C.white,true,true);});
foot(s,'示例为单组展示值；正式报告须补充运行次数、预算及不确定性。');

// 10 — A broad chart surface and two short interpretation notes.
s=await slide('训练过程：收敛趋势','横轴：训练轮次 · 纵轴：损失 ↓ · 示例数据');
panel(s,64,272,1152,326);chart(s,'line',demo.steps,demo.lossBase,demo.lossNew,'Loss',2,{x:80,y:282,w:1120,h:300});
text(s,'控制条件',64,620,120,34,21,C.blue,true);text(s,'相同训练预算与评价频率',192,620,460,34,21,C.muted);
text(s,'同时报告',704,620,120,34,21,C.blue,true);text(s,'最终性能与计算成本',832,620,384,34,21,C.muted);

// 11 — A full-width native table, with only the full-method row emphasized.
s=await slide('消融实验：机制贡献','示例数值 · 保持其余配置一致，逐项改变组件');
table(s,[['配置','组件 A','组件 B','指标 ↑'],['Baseline','—','—','71.0'],['+ A','启用','—','74.0'],['+ B','—','启用','73.0'],['完整方法','启用','启用','78.0']],{y:282,h:320,highlight:true});
foot(s,'此页仅演示排版；不能据此推断真实因果关系或显著性。');

// 12 — Endpoint difference adds a second reading level without inventing a finding.
s=await slide('鲁棒性：性能随扰动的变化','横轴：归一化扰动强度 · 纵轴：准确率（%）↑ · 示例数据');
chart(s,'line',demo.noise,demo.robustBase,demo.robustNew,'Accuracy (%)',100);
panel(s,936,282,280,320,C.navy);text(s,'末端对比 / 示例',960,306,232,38,23,C.cool,true);
text(s,String(demo.robustNew.at(-1)-demo.robustBase.at(-1)),960,370,232,100,78,C.white,true,true);
text(s,'个百分点',960,470,232,42,26,C.white,true);
text(s,'强度 0.20 下\nProposed − Baseline',960,532,232,58,20,C.cool);
foot(s,'正式报告须定义扰动类型、强度单位、攻击预算和评价协议。');

// 13 — Keep real samples replaceable, with the proposed method clearly framed.
s=await slide('定性分析：把证据放在同一尺度','替换为真实样本，保持尺度、裁剪规则与色标一致');
['输入样本','对照方法','本研究'].forEach((title,i)=>{const x=64+i*392,active=i===2;panel(s,x,282,368,290,active?C.navy:C.pale);text(s,title,x+24,304,320,42,27,active?C.white:C.navy,true);rect(s,x+24,364,320,1,active?'#405780':C.rule);text(s,'插入实验图像',x+24,434,320,48,28,active?C.cool:C.muted);});
foot(s,'图注：[样本来源 / 编号] · [选择规则] · [可见差异及失败案例]');

// 14 — Finding dominates; limits and next checks remain visibly distinct.
s=await slide('结论、边界与下一步','将已有证据与待验证假设明确区分');
panel(s,64,282,600,320,C.navy);text(s,'01 / 主要发现',92,306,544,44,28,C.cool,true);
text(s,'[用一句话写出证据支持的结论，\n及其适用范围。]',92,398,544,126,31,C.white,true);
[['02 / 当前局限','[数据、成本、假设或失败条件。]'],['03 / 下一步验证','[一个可执行的实验及判断标准。]']].forEach(([title,body],i)=>{const y=282+i*172;panel(s,688,y,528,148);text(s,title,712,y+20,480,40,25,C.blue,true);text(s,body,712,y+78,480,48,23);});

// 15 — Literature and reproducibility links have different visual roles.
s=await slide('参考文献与复现资源','仅列本次汇报实际引用的资料');
panel(s,64,282,720,320);text(s,'参考文献',88,306,672,42,27,C.navy,true);
text(s,'[1] 作者. 论文标题. 会议 / 期刊,\n     年份. DOI / URL.\n\n[2] 作者. 数据集或软件名称.\n     版本, 年份. URL.',88,372,672,206,23);
panel(s,808,282,408,320,C.navy);text(s,'复现与联系',832,306,360,42,27,C.white,true);
[['代码','[仓库地址与 commit]'],['数据','[版本与访问说明]'],['联系','[团队认可的邮箱或主页]']].forEach(([label,value],i)=>{text(s,label,832,372+i*70,360,30,22,C.cool,true);text(s,value,832,404+i*70,360,30,21,C.white);});

// 16 — Brand closing, echoing the foundation PDF rather than a blank final slide.
s=await slide('','',true);watermark(s,824,222,392,223);
text(s,'讨论与交流',64,234,740,110,76,C.white,true);
rect(s,64,382,48,5,C.cyan);
text(s,'智能设计与鲁棒学习',64,426,760,48,30,C.white,true);
text(s,'Intelligent Design and Robust Learning',64,486,790,40,23,C.cool,false,true);
rect(s,64,566,1152,1,'#405780');
[['严谨','清晰结构 · 精确表达'],['探索','连接方法 · 持续迭代'],['开放','共享语言 · 协作创造']].forEach(([title,body],i)=>{const x=64+i*392;text(s,title,x,588,368,36,25,C.white,true);text(s,body,x,628,368,28,18,C.cool);});
for (const sl of p.slides.items) sl.speakerNotes.text='IDRL 科研汇报模板。方括号为待替换内容；所有数值为合成示例，不代表团队成果。';
await (await PresentationFile.exportPptx(p)).save(path.join(tmp,'candidate.pptx'));
const result=await finalizePresentation({workspaceDir:root,candidatePath:path.join(tmp,'candidate.pptx'),finalPath,pythonExecutable:python,explicitTotalSlideCount:16,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit',...[5,7,8,11].flatMap(n=>['--require-native-table-slide',String(n)])],requiredNativeTableOwnerSlides:[5,7,8,11],requiredNativeChartOwnerSlides:[9,10,12],materializeLiteralChartWorkbooks:true,fontPolicy:{basis:'design',families:['Inter',font]},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation.json')});
const finalized = await PresentationFile.importPptx(await FileBlob.load(finalPath));
for (let i=0;i<finalized.slides.items.length;i++) {
  const preview = await finalized.export({slide:finalized.slides.items[i],format:'png',scale:2});
  await fs.writeFile(path.join(previewDir,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await preview.arrayBuffer()));
}
const pdfPath = finalPath.replace(/\.pptx$/, '.pdf');
execFileSync(python, [path.join(root,'scripts/export-deck-preview.py'),'--slides-dir',previewDir,'--output',pdfPath], {stdio:'inherit',windowsHide:true});
for (const name of await fs.readdir(previewDir)) await fs.copyFile(path.join(previewDir,name),path.join(out,name));
const indexPath = path.join(out, 'index.html');
const index = await fs.readFile(path.join(root,'output/research-template/index.html'), 'utf8');
await fs.writeFile(indexPath, index.replace(/idrl-research-template-[a-zA-Z0-9-]+\.(pptx|pdf)/g, (_,extension) => path.basename(finalPath).replace(/\.pptx$/, `.${extension}`)));
const summary = { file:path.basename(finalPath), sha256:result.finalSha256, slides:result.packageIntegrity.slide_count, nativeTables:result.nativeTableArithmetic.native_table_count, nativeCharts:result.nativeChartValidation.detectedChartCount, embeddedWorkbooks:result.chartDataPackaging.converted_chart_count, packageIntegrity:result.packageIntegrity.status, fontPolicyPassed:result.fontSelection.passed, artifactToolImportPassed:result.firstPartyImport.passed, finalDeckRenderedPages:finalized.slides.items.length, nativePowerPointEditTestThisRevision:false, pdf:path.basename(pdfPath), pdfRepresentation:'Raster review from finalized slide previews', previewScale:2 };
await fs.writeFile(path.join(out,'validation-current.json'),JSON.stringify(summary,null,2)+'\n');
// Signal completion only after the finalizer and all preview writes succeed.
// The parent verifies the checksum, then terminates this native rendering worker.
process.send({ kind: 'complete', finalPath, sha256: result.finalSha256, receiptPath: result.receiptPath, slideCount: result.packageIntegrity.slide_count, nativeTables: result.nativeTableArithmetic.native_table_count, nativeCharts: result.nativeChartValidation.detectedChartCount });
await new Promise(() => { setInterval(() => {}, 60000); });
