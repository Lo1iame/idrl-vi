# IDRL Design

状态：视觉基础 v0.1 已于 2026-10-12 通过审核；第二阶段可运行界面示例 v0.2 待审核。tokens v0.2.0（2026-10-13）新增图表类别色、深色底 navy 适配色与浅色状态文字变体，依据首个真实落地应用（idrl-portal v0.11.0）的接入反馈补充。

## 开始前

1. 阅读本文、`CONTEXT.md` 和 `docs/design/brand-brief.md`。
2. 使用 `assets/brand/tokens.json` 的语义变量；CSS 为 `assets/brand/tokens.css`。
3. Logo 仅使用 `assets/brand/logo/` 的新组合。`logo/` 为历史源文件，名称包含旧文字，不直接用于新材料。
4. 当前提供官网、数据工作台、AI 交互及基础组件的可运行示例。完整组件库、registry 和 Storybook 尚未实现；不得把规划中的组件写成可安装依赖。

## 名称与语气

- 中文：智能设计与鲁棒学习。
- 英文：Intelligent Design and Robust Learning。
- 缩写：IDRL。任何新 logo、页面标题、页脚及宣传名称都不得附加 Laboratory（含中文的「实验室」展开，如「智能数据研究实验室」）；「IDRL + Portal/Workbench 等通用产品词」可以使用。
- 语气严谨、探索、开放。研究成果、实验状态和 AI 执行结果描述必须具体，不虚构指标。

## Logo

- 新资产从 AI 源文件第一页的真实 Bézier 路径提取，保留核心图形和原有几何 IDRL 字标；新中英文组合文字转为路径。
- 横向组合用于页眉和横幅；双语组合用于对外介绍；上下组合用于封面。仅图形用于已出现完整名称的导航与头像。
- 白／浅背景用彩色版本。深海军蓝背景用 `lockup-bilingual-reverse.svg`；图形原深蓝色块映射为低饱和浅蓝 `#8fb8dc`（已 token 化为 `brand.navyOnDark`，深色底图表等非 logo 场景同样使用此值），文字保持白色，避免局部纯白抢夺视觉焦点。单色用 navy 或 white 图形。
- favicon / 应用图标一律使用 `assets/brand/logo/favicon-tile.svg`（navy 方块 + reverse 图形）：裸 reverse SVG 为透明底，白色字母在浅色浏览器标签栏不可见，裸彩色 SVG 的 navy 色块在深色标签栏不可见。PNG 各尺寸由应用按需栅格化（参考 idrl-portal 的 `scripts/generate-favicons.mjs`）。
- 不拉伸、不旋转、不加描边、不自行拼出缩写字标，不把品牌图形当操作图标。
- 图形左右的净空至少为图形高度的 1/4。建议图形最小宽度 32px、印刷 10mm；小于此尺寸需另做简化符号及实测。
- 完整名称组合的最小宽度以其中最小文字不低于屏幕 12px、印刷 7pt 为约束。SVG 自带留白不能替代外部净空。

## 颜色与主题

- 品牌 navy `#203663`、blue `#236db9`、cyan `#56c0e5` 为已审核的数字端统一值；不声称与旧 PNG 或 CMYK 值完全等同。
- 主操作使用 `primary` / `primaryForeground`。普通文字使用 `foreground`，辅助文字使用 `mutedForeground`。
- Cyan 用于图形、装饰和浅色强调底，不用于白底小号正文或白字按钮。
- 错误、警告、成功分别使用 `destructive`、`warning`、`success`，配文字和图标，不能只靠颜色表达。
- **状态徽章配方**（对比度已审计）：底 = 状态基色 15% 叠加所在 surface，文字 = 浅色主题用 `primaryText` / `successText` / `warningText` / `destructiveText`（加深变体），深色主题直接用基色（深色基色本身够亮）。基色作小号文字叠在同色 tint 底上在浅色主题不满足 4.5:1，禁止。警告横幅同源：30% 描边、5% 底、`*Text` 标题。
- **图表类别色**：`chart1..5`（浅：blue → navy → cyan → success → warning；深色用各自的深色适配值，navy 深色用 `navyOnDark`）。多于三组优先分面；系列区分仍须叠加线型/标记/标签。类别色不作连续量色标。
- 分隔线用 `border`；需要独立辨认的输入框边界用 `controlBorder`。
- 深色主题有独立语义值，不直接反转颜色。图表系列要加线型、标记或标签。
- `contrast-report.json` 仅证明所列色对的数值通过；完整组件仍需键盘、焦点、结构、动态状态等验收。
- 旧方案 CMYK 值仅作为印刷历史参考。最终印刷须指定 ICC 配置、打样，不能机械地将 HEX 换算成标准 CMYK。

## 字体、布局与视觉密度

- 英文和数字用 Inter，中文用 Noto Sans CJK SC；字体文件与 OFL 授权位于 `assets/brand/fonts/`。代码用平台等宽字体。
- **应用回退栈（官方写法）**：`Inter, 'Noto Sans CJK SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif`。本地装有 Noto Sans CJK SC 时优先命中，否则回退系统黑体——各平台字形有轻微差异，属可接受范围。
- 中文 webfont 子集只覆盖构建时传入的文案。静态内容应用用 `scripts/build-web-fonts.py --crawl-dir <应用源码目录>`（或 `--text-file`）生成自身子集；**动态内容应用（用户名、数据库文案等）不要用子集**，直接走回退栈，后续需要时再引入 unicode-range 分片方案。
- 正文 16px / 1.6，内部工具可用 14px / 1.5；标签 14px，辅助文字至少 12px。正文用 400，强调用 700。
- 数字指标与表格使用 tabular-nums。长英文名称允许换行，不强行压窄字体。
- Web 示例采用 Inter WOFF2 和当前文案的中文 WOFF2 子集；新增文案后运行 `scripts/build-web-fonts.py`（支持 `--crawl-dir` / `--text-file` 传入应用自身文案）。原始字体保留用于 logo、PPT 与印刷资产。
- 采用 4px 基础间距，常用 8、12、16、24、32、48、64。控件圆角 6px、卡片 12px、弹窗 16px。
- 官网／宣传材料：大留白、明确标题层级、局部放大几何图形。内部应用：中性背景、紧凑但清楚的内容层次、少量品牌强调。
- 不在高密度内容后叠加图形纹样。几何辅助图形从既有 logo 斜向与六边形语言延展，避免另造无关符号。
- 界面默认内容最大宽 1280px、左右留白 24px；手机 16px。工作台可铺满宽度；数据表手机可局部横向滚动。

## 组件与 AI 交互契约

### 2026-10-12 前端审美重构

- 官网采用科研品牌的现代排版：大标题、非对称图文、独立展示的原始矢量图形。研究方向用有层次的列表，不使用三张等宽功能卡片。
- 取消无意义的编号、坐标、装饰网格与重复眉题。保留真实的导航、说明和演示标识，不虚构研究成果。
- 工作台指标以一个连续摘要区呈现；卡片仅用于图表、记录表和独立操作。主要表格和对话正文使用 14px，辅助说明至少 12px。
- AI 助手以对话为主画布，来源与模拟控制作为轻量侧栏；输入区和待确认操作保持清晰边界。已有流式、停止、失败、确认与下载流程必须保留。
- 本次继续使用已确认的 Inter / Noto Sans CJK SC 和品牌颜色。沿用 Lucide 作为已安装的图标体系，不额外混入其他图标库。
- 品牌辅助图 `assets/brand/images/research-form.webp` 为 AI 生成的蓝色折叠平面概念图，不替代 logo，也不表示实际研究成果。生成说明见同目录 README。
- 审美布局规则位于 `src/design-refresh.css`，基础控件状态位于 `src/styles.css`；颜色仍来自已有语义 tokens。手机在 768px 以下折叠官网图文，应用布局在 1024px 以下通过顶部完整页面导航切换功能。
- 官网界面最大宽度 1376px（内容净宽 1280px、两侧 48px）；手机两侧 24px。应用与组件页面手机两侧 16px。

- 技术方向：React、TypeScript、Tailwind、shadcn 源码体系；配套 IDRL registry 和 Storybook。版本在组件阶段锁定。
- 用语义变量，不在页面里复制品牌 HEX；优先复用组件，新增变体需补文档和状态示例。
- 官网需要 SEO／SSR 时使用 Next.js；内部应用与科研工具默认 Vite。共享组件不依赖 Next.js 服务端能力。
- 控件必须有可访问名称、键盘操作、清晰焦点、禁用态；表单必须有标签、帮助文字和明确错误。
- 主按钮一屏主区域通常仅一个；次要操作用次级按钮或文字链接。图标按钮需 accessible name。
- 覆盖默认、hover、focus、disabled，以及适用的 loading、empty、error、success 状态。
- AI 消息区分用户、助手、工具；执行状态区分待运行、运行中、等待确认、成功、失败、取消。
- 流式输出允许停止；工具调用与来源可展开；待确认操作必须展示对象、动作和后果。
- 不将请求已发送显示为任务已成功，不把模型推测显示为已验证事实。示例数据必须标明为示例。
- 加载／状态变化不得仅依赖动画；遵守 prefers-reduced-motion，状态更新提供适当的辅助技术通知。

## 检查与交付

- 目标为适用的 WCAG 2.2 AA，功能阶段验证键盘、屏幕阅读器、深浅主题、中英文、手机布局。
- 先完成 logo／视觉基础审核，再制作官网、数据工作台、AI 交互示例，最后扩展组件、PPT、海报、社交模板及最终规范。
- 本阶段预览为 `docs/design/foundation.html`；PDF 与 PNG 在 `output/brand/`。它们是视觉审核稿，不是组件实现或完整 VI 手册。
- 运行 `scripts/build-brand.py` 重建矢量资产；`scripts/build-tokens.py` 生成 CSS 和对比度报告；`scripts/render-brand.cjs` 导出审核稿。

## 落地应用与 token 同步

- **idrl-portal**（智能设计与鲁棒学习门户，Next.js 16 + Tailwind v4 + shadcn/ui）：v0.11.0 起完整采用本 VI，是该规范的首个真实落地案例。其 `app/globals.css` 的「tokens.json → shadcn 变量」映射已提炼为 `docs/design/shadcn-mapping.md`，作为 IDRL registry 的第一块参考实现。
- **token 同步**：下游应用复制 `assets/brand/tokens.json` 与 `tokens-values.css` 作为快照（如 portal 的 `public/brand/`）。本仓库 token 变更后升版本号并在 DESIGN.md 状态行注明；下游通过 diff 快照同步。下游不得修改快照数值，确有缺口先回本仓库补 token。

## 可运行示例与 Agent 接入

### 设计稿落地与交互增强

- 2026-10-12：将 `output/design-concepts/` 参考稿落实为可运行页面。官网使用居中首屏、深蓝理念区、研究图文、可输入的助手预览和收尾入口；不把生成的整页图片当页面实现。
- 官网 `ResearchLauncher` 通过 sessionStorage 传递问题草稿到助手；只填入输入框，由用户发送。页面功能不依赖外部模型。
- 三个应用页面共用 AppShell，主题与语言工具位于应用顶栏；手机提供完整页面导航。官网在页眉提供主题与语言切换。
- 组件页提供预览／规范页签、可确认弹窗、颜色复制、表单校验与密度切换。页签支持左右方向键和 Home / End；表单提交后聚焦第一个错误字段。
- `src/components/ui/field.tsx` 提供 Input、Select，透传原生属性与 ref。字段标签、必填语义、aria-invalid 和错误描述由调用方明确提供。错误在用户提交后展示。
- 组件页配置仅保留在当前挂载页面的 React 状态；表单提交与确认均为本地演示。复制失败时呈现可手动复制的色值。
- 研究助手采用单一对话画布，来源可展开查看固定记录；保留工具确认、停止、失败重试与下载流程。得分摘要来自已有演示数据。
- 组件使用规范通过 Vite 的资产 URL 引用 DESIGN.md，生产构建同样包含该文件。

- 启动：`npm ci`，然后 `npm run dev`。构建：`npm run build`。交互验证：`npm test`（本机使用 Edge；其他环境通过 BROWSER_CHANNEL 指定可用浏览器，或调整 Playwright 配置）。
- 路径：`/#website` 官网概念、`/#workspace` 实验工作台、`/#assistant` 研究助手、`/#components` 基础组件展示。
- 组件源码：`src/components/ui/button.tsx`、`badge.tsx`、`dialog.tsx`；应用框架为 `src/components/app-shell.tsx`。技术依赖已在 package-lock.json 锁定。
- Button 支持 default、secondary、ghost、destructive 变体及 sm、icon 尺寸；使用 asChild 可保留链接语义。图标按钮必须提供 aria-label。
- Dialog 基于 Radix 管理焦点与 Esc 关闭；没有使用 Radix Trigger 的受控调用需提供 returnFocusId，或由调用页面显式恢复焦点。
- 页面使用 `tokens-values.css` 和 Web 字体；视觉基础稿使用包含完整字体的 `tokens.css`。两份 CSS 均由 tokens.json 生成，禁止直接改生成文件。
- 工作台记录只存在于页面会话，导航离开该页或刷新会恢复固定演示数据。导出仅包含当前筛选结果。
- 研究助手读取固定 demo-data，演示流式输出、停止、操作确认、工具成功／失败、重试和报告下载。没有连接真实模型、训练任务、用户身份或存储。
- 所有示例内容须保留标识；官网研究方向与文案是设计示例，真实发布前需用已确认资料替换。
- 自动检查覆盖核心交互、浏览器主题／语言偏好、手机页面溢出和两种主题下的 axe 规则；不替代完整屏幕阅读器与最终 WCAG 人工验收。
- 第二阶段视觉截图位于 `output/ui/`。审核通过后扩展完整组件、registry、Storybook 及 VI 应用模板。

## 科研汇报与图表

- 深色界面必须引用专用 reverse logo，禁止通过 brightness / invert 滤镜将彩色 logo 整体变白；IDRL 字标使用 `lockup-idrl-reverse.svg`。

- 复用 `output/research-template/idrl-research-template-v2.pptx` 的 16:9 页面；按需复制页面，保留原生图表和表格的编辑性。
- 图表遵循 `docs/design/scientific-charts.md`；可复用样式为 `assets/brand/charts/idrl.mplstyle`。
- 原始数据、图例映射、轴单位和不确定性定义优先于装饰；不能根据模板中的合成数据撰写研究结论。
- PPT 当前为可复制页面模板，尚非自定义母版 / POTX；公式为文本示例。所有示例标记在替换为真实资料前必须保留。

## 官方参考

- Inter 字体与许可：https://github.com/rsms/inter
- Noto CJK 字体与许可：https://github.com/notofonts/noto-cjk
- shadcn registry：https://ui.shadcn.com/docs/registry/getting-started
- shadcn MCP：https://ui.shadcn.com/docs/mcp
- Tailwind theme variables：https://tailwindcss.com/docs/theme

