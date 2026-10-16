export type LocalizedText = { zh: string; en: string }
export type Release = { version: string; date: string; title: LocalizedText; commit?: string; changes: { type:'added'|'improved'|'fixed'; text:LocalizedText }[] }

// Published history only. Add the new release after its changes are committed.
export const releases:Release[] = [
  {version:'0.3.0',date:'2026-10-16',commit:'3ee8473cfb69a609a38ef19bab1a5ff828fc7e6d',title:{zh:'独立 UI 接入与统一品牌资产构建',en:'Standalone UI adoption and unified brand asset builds'},changes:[
    {type:'added',text:{zh:'提供独立公共样式入口和接入示例，无需加载展示站样式；补充深浅主题与宿主样式隔离验证。',en:'Added a standalone public stylesheet and adoption example without showcase styles, with light/dark theme and host-style isolation checks.'}},
    {type:'improved',text:{zh:'分离 UI 接入校验与全仓库资产审计，导出快照支持依赖闭包检查和逐文件 SHA-256 校验。',en:'Separated UI adoption validation from repository-wide asset auditing, with dependency closure and per-file SHA-256 checks for exported snapshots.'}},
    {type:'improved',text:{zh:'Logo、PPT 调色板及科研图表统一读取品牌 token；默认构建保留历史视觉基础审核稿。品牌基础画廊已提供官网入口、放大查看和 PDF 下载。',en:'Unified logo, presentation palette and scientific chart colors around brand tokens while preserving historical review boards by default. The foundation gallery offers a homepage entry, enlarged views and PDF downloads.'}},
    {type:'fixed',text:{zh:'数据表不再因等价数组或单元格更新跳回首页；筛选变化、记录增删及重排按明确规则重置分页。',en:'Equivalent arrays and cell updates now preserve table pagination; filter, membership and ordering changes reset it explicitly.'}},
  ]},
  {version:'0.2.2',date:'2026-10-15',commit:'f0d4b14461d7349538cc53c69445ae267ffd2a6c',title:{zh:'应用框架、共享控件与分层汇报',en:'Application shell, shared controls and layered presentations'},changes:[
    {type:'added',text:{zh:'提供可配置应用框架、响应式侧栏、更新日志、客户端数据表格及共享表单选择控件。',en:'Added a configurable application shell, responsive navigation, changelog, local data tables and shared form controls.'}},
    {type:'improved',text:{zh:'科研模板更新至 v4，增加分层版式和 PDF 审核预览，保留原生表格与图表编辑性。',en:'Updated the research deck to v4 with layered layouts and a PDF review, preserving native tables and charts.'}},
    {type:'fixed',text:{zh:'修复表格排序提交表单、详情焦点恢复、窄屏布局与资产构建流程。',en:'Fixed table buttons submitting forms, detail focus restoration, narrow layouts and asset builds.'}},
  ]},
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
