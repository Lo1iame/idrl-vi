export type LocalizedText = { zh: string; en: string }
export type Release = { version: string; date: string; title: LocalizedText; commit?: string; changes: { type:'added'|'improved'|'fixed'; text:LocalizedText }[] }

// Published history only. Add the new release after its changes are committed.
export const releases:Release[] = [
  {version:'0.2.1',date:'2026-10-14',commit:'745beb042a49d5000be9233fde6c7160f14c0581',title:{zh:'官网品牌动效与接入修复',en:'Brand motion and integration fixes'},changes:[
    {type:'added',text:{zh:'加入可重播标志动画、响应式网格反馈、分区入场与工具使用引导。',en:'Added replayable logo assembly, reactive grid feedback, section entry, and tool guidance.'}},
    {type:'fixed',text:{zh:'修复字体变量默认值、深色状态文字及中文字体子集的输入校验。',en:'Fixed font variable fallbacks, dark status text, and font subset input validation.'}},
    {type:'improved',text:{zh:'补充减少动画、键盘操作与手机布局验证。',en:'Expanded checks for reduced motion, keyboard interaction, and mobile layout.'}},
  ]},
  {version:'0.2.0',date:'2026-10-13',commit:'4cfe18b52f3737fda7893ff9efa7963a213c3328',title:{zh:'首次应用接入反馈',en:'Feedback from the first application adoption'},changes:[
    {type:'added',text:{zh:'加入深浅主题图表类别色、深色底适配色及状态文字变体。',en:'Added chart colors, dark-background brand adaptation, and status text variants.'}},
    {type:'added',text:{zh:'提供 favicon 方块资产及 shadcn / Tailwind 映射说明。',en:'Provided the favicon tile and shadcn / Tailwind mapping guidance.'}},
  ]},
  {version:'0.1.0',date:'2026-10-12',commit:'681321a684eaf370292fe5c081d4d0b7fb3e3ee3',title:{zh:'IDRL 视觉识别与界面基础',en:'IDRL identity and interface foundations'},changes:[
    {type:'added',text:{zh:'建立品牌标志、字体、主题变量及 DESIGN.md 设计约定。',en:'Established logos, typography, theme tokens, and the DESIGN.md contract.'}},
    {type:'added',text:{zh:'提供官网、实验工作台、研究助手、组件示例及科研汇报模板。',en:'Provided website, workbench, assistant, component examples, and a research presentation template.'}},
  ]},
]
