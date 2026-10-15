# IDRL Design

现行设计契约，更新于 2026-10-15。视觉基础 v0.1 已审核；UI 为源码复用阶段，尚未整体通过最终视觉与无障碍人工验收。token 版本 **0.2.1** 与 package 版本、PPT 修订号分别管理。本次整理未改变品牌数值。

## 事实来源与阅读顺序

1. 名称以 [CONTEXT.md](CONTEXT.md) 为准；本文定义跨应用规则。
2. 颜色、字体栈、间距、圆角、字号和基础动效以 [tokens.json](assets/brand/tokens.json) 为唯一来源。生成 CSS 不手改；运行 `scripts/build-tokens.py --check` 检查漂移。
3. 下游从 [接入与重构指南](docs/design/adoption.md) 开始；实际能力与限制见 [组件清单](docs/design/component-inventory.md)。
4. 当前资产与版本见 [reuse-manifest.json](assets/brand/reuse-manifest.json)。历史审计、验证及审核稿保留当时事实，不作为当前能力清单。
5. 规范与实现冲突须记录并修正，不默默将示例特殊布局提升为全局标准。

## 品牌名称与内容

- 中文：**智能设计与鲁棒学习**；英文：**Intelligent Design and Robust Learning**；缩写：**IDRL**。
- 新名称、logo、标题、页脚不得在完整名称后添加 Laboratory 或“实验室”。可使用 IDRL Portal / Workbench 等产品词。
- 语气严谨、探索、开放。示例数据、合成图表、模拟 AI 状态须明确标识；发布前替换为已确认资料，不虚构研究成果与执行成功。
- 展示站的业务文案、演示导航、训练记录和模拟服务不属于通用 VI。

## Logo 与辅助图形

- 仅使用 `assets/brand/logo/`；`logo/` 为保留原样的历史来源。
- 浅底用彩色；深底用 symbol-color-reverse.svg、lockup-idrl-reverse.svg 或 lockup-bilingual-reverse.svg。原 navy 图块映射为 brand.navyOnDark（#8fb8dc），文字保持白色；禁止滤镜整体变白。
- Brand 默认随 data-theme 切换；固定 navy 面板显式 dark。背景而非整页主题决定使用哪个版本。
- 导航用横向字标，对外用双语组合，封面用上下组合。仅图形用于完整身份已出现的场合；浏览器 favicon 使用透明、正方形画布的 favicon.svg，内部按 prefers-color-scheme 切换原 navy 图块为 navyOnDark，不增加底色；它跟随浏览器系统配色，不跟随页面主题按钮。favicon-tile.svg 仅用于需要固定底色的应用图标 / 快捷方式，不再作为默认浏览器 favicon。
- 保留原几何，不拉伸、旋转、加描边、自行重绘字标；不把 logo 当操作图标。
- 图形净空至少为高度 1/4；建议最小宽屏幕 32px、印刷 10mm。完整名称最小文字至少屏幕 12px、印刷 7pt；SVG 内部留白不代替外部净空。
- 辅助图形延续既有斜向与六边形语言。research-form.webp 为 AI 生成的品牌概念图，不是 logo 或研究结果。

## 语义颜色与主题

- 品牌 navy #203663、blue #236db9、cyan #56c0e5 为审核后的数字值，不是印刷 CMYK / ICC 标准。
- 页面用 background，内容用 surface / surfaceSubtle，文字用 foreground / mutedForeground，操作用 primary / primaryForeground，分隔用 border，控件边界用 controlBorder，焦点用 focus。
- 状态用 success / warning / destructive 并配文字或图标；cyan 不用于白底小号正文及白字按钮。
- 徽章：基色 15% 混合所在 surface，文字用对应 *Text。横幅可用 5% 底、30% 边界及 *Text。深浅主题均映射状态文字，禁止在深底继承浅色文字值。
- 原生主题协议为根元素 data-theme="light|dark"。系统偏好由宿主解析为属性；已有 .dark 的应用同步 data-theme，详见 shadcn 接入文档。不整体反色。
- 图表用 chart1…5，叠加线型、标记或标签；多于三组优先分面。类别色不作连续量色标。
- contrast-report.json 只覆盖所列色对，不代表整个应用获得 WCAG 认证。

## 字体、排版与布局

- 英文 / 数字 Inter，中文 Noto Sans CJK SC；官方回退栈为 font.sans。代码 font.mono，数字与表格 tabular-nums。
- 自托管 Inter WOFF2。动态中文默认用系统回退，不导入本项目文案专用子集；静态应用用 build-web-fonts.py --crawl-dir / --text-file 为自身文案生成子集。保留 OFL 授权。
- 正文 16px / 1.6，工具 14px / 1.5–1.6；辅助文字至少 12px。正文 400，强调 700；长名称自然换行。
- 4px 间距基础，常用 8 / 12 / 16 / 24 / 32 / 48 / 64；控件 / 卡片 / 弹窗圆角 6 / 12 / 16px。
- 官网编辑式排版、大标题与留白：参考内容净宽 1280px、外宽 1376px、桌面两侧 48px、手机 24px。应用可铺满，桌面内容留白 24–40px、手机 16px。这是场景预设，不要求所有页面同宽。
- 指标可用连续摘要区；卡片用于独立任务与内容分组。不在高密度内容后叠纹样，不增加无意义编号、装饰坐标或多层容器。

## 应用框架与组件

- 默认 React / TypeScript 源码接入，依赖以 package-lock.json 为准；展示站 Vite + Tailwind v4。不要求现有应用换框架；Next.js / SSR 须验证客户端边界与路由。
- AppShell **必须显式传 AppShellConfig**：应用 ID、身份、真实链接、导航分组由宿主提供。公共组件不引入演示配置；类型位于 src/lib/app-shell-config.ts。
- ≥1024px 为 240px 展开栏，可折为 72px；768–1023px 默认轨道、临时展开；<768px 模态抽屉。桌面偏好按应用 ID 隔离，其他断点不覆盖。
- 轨道保留可访问名称、当前项与 Tooltip；抽屉支持焦点约束、Esc / 遮罩关闭、焦点恢复和跨断点清理。
- Button：default / secondary / ghost / destructive，default / sm / icon；链接用 asChild，图标提供名称。一屏主任务通常一个主操作。
- FormField 提供 label / description / error / required，将 render prop 展开到唯一原生控件。提交后给具体错误并聚焦首个错误；保留业务校验。
- Checkbox 是原生 input；Switch 是受控 button，不自动进入 FormData。Textarea 可纵向调整。
- DataTable 仅处理小规模完整本地集合排序 / 分页；页面持有筛选，rows 用 useMemo 稳定引用，rowKey 唯一。缺失值 null 始终置后；导出完整筛选集合。远程表格保留服务端排序 / 筛选 / 分页。
- Dialog / Sheet 基于 Radix；受控 Dialog 提供实际入口 ref / ID 恢复焦点；排序按钮 type="button"。
- 控件需要可访问名称、键盘、焦点、禁用态及适用的 loading / empty / error / success；公共组件没有自动提供所有业务请求状态。
- 当前**没有已发布 npm 包、registry、Storybook 或完整组件库**；shadcn 映射不表示支持 shadcn CLI 安装。

## AI 与动效

- 区分用户、助手、工具；状态区分待运行、运行中、等待确认、成功、失败、取消。流式可停止，来源 / 工具详情可展开，确认须展示对象、动作、后果。
- 请求已发不等于成功，模型推测不等于事实；重构保留真实 API、权限和错误处理。
- 内部工具用简短状态过渡。官网可用单次入场、细网格和 logo 重播；组装约 1.7 秒，结束恢复原始路径。手机降低幅度，触屏关闭倾斜 / 指针跟随。
- 减少动画或加载失败时直接显示内容；焦点进入结束包裹动画；卸载释放观察器、时间线和 requestAnimationFrame。正文可读性不依赖动画完成。
- React Bits 适配限当前官网集成，附原始许可；默认接入包排除该目录与 GSAP 动效集成代码，不将重型官网效果搬进工具页。

## 科研材料

- 当前模板 output/research-template/idrl-research-template-v4.pptx：16:9、16 页、4 个原生表格、3 个图表及工作簿；v2 / v3 为历史版本。
- 层次参照基础审核 PDF：页眉 / 分隔线、标题 / 导语、内容面板、页脚；封面 / 章节 / 结束可用 navy，图表内容页保持明亮。强调须对应数据。
- 同名 PDF 为栅格审核版；PPT 可编辑但未嵌入 Inter / Noto Sans CJK SC，需安装字体。不是 POTX 母版，公式是文本示例。
- 图表规范见 [scientific-charts.md](docs/design/scientific-charts.md)，样式在 assets/brand/charts/；印刷另做 ICC 配置与打样。

## 同步与验收

- 下游记录来源 commit、token 版本、复制文件和本地适配。品牌值不私改，业务扩展用应用命名空间；更新先 diff，不覆盖业务。
- npm run vi:check 检查生成文件与复用清单；npm run vi:export 输出带 SHA-256 与依赖清单的源码快照，不是安装包。
- npm run build 验证构建，npm test 验证交互，npm run test:assets 与 Python 回归验证资产；重建见 [asset-build.md](docs/design/asset-build.md)。
- 至少检查中英文、深浅主题、320 / 390 / 768 / 1024 / 1440px、导航、键盘 / 焦点、减少动画、长文案、业务异常、数据导出；保留同数据前后截图及测试证据。
- 自动 axe / 对比度检查不代替屏幕阅读器和跨浏览器人工验收。历史记录保留在 docs/design/，本轮证据见接入一致性报告。

## 品牌基础展示

- /#foundation 提供五页 v0.1 审核稿画廊与 PDF 预览下载，入口在侧栏、官网首屏操作区和页脚。标注为历史材料，不把原稿中的阶段计划、数量或日期当成当前事实。
- 原稿保持原始语言和配色；界面可中英文 / 深浅主题切换。现行 DESIGN.md、设计组件与应用接入指南始终可访问。
- 展示约定见 [brand-foundation-page.md](docs/design/brand-foundation-page.md)；默认 UI 接入快照不包含该页面与审核二进制材料。
