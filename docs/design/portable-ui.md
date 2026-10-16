# 独立公共样式

2026-10-15。用于 React 源码接入；保持现有 IDRL 视觉，未发布 npm 包。

## 消费约定

- `src/ui.css` 为公共入口，提供 token、Brand、UI 控件和应用框架的样式，不包含展示站布局、中文字体子集或 Tailwind preflight。
- TSX 模块导入其所属 CSS，CSS 再引用 `ui-base.css`；保留相对路径与递归依赖。使用完整接入快照时无需手工挑选展示站规则。
- `idrl-ui` 为显式采用 IDRL 内容排版的范围；AppShell、DataTable、Dialog、Sheet 已添加。范围外普通元素保持宿主默认值。
- 宿主负责 html/body reset、字体文件加载、主题属性与背景。背景和文字使用同一主题的 surface / foreground。主题变量本身仍按现行契约作用于根元素。
- 这是普通 CSS 隔离，不是 Shadow DOM；`.button`、`.badge` 等公共类名属于 IDRL 控件，宿主使用同名类或高优先级规则时需要检查冲突。
- 展示站专有内容保留于 styles.css / design-refresh.css 和页面样式；更新日志、框架展示示例的样式位于 pages/changelog.css，不随公共模块导出。

## 所属模块

| 规则 | 文件 |
| --- | --- |
| 作用域内排版、焦点、盒模型 | src/ui-base.css |
| Button、Badge、Dialog | src/components/ui/primitives.css |
| Brand | src/components/brand.css |
| 表单、选择控件、DataTable | 各自 field.css / choice.css / data-table.css |
| Sheet、Tooltip、Breadcrumb | 各自 sheet.css / tooltip.css / breadcrumb.css |
| AppShell 导航、轨道、响应式框架 | src/app-shell.css |

## 验证证据

- 新增独立消费 fixture 和两项深浅主题测试：不加载展示站 CSS，检查控件尺寸、主题 logo、焦点、弹窗、可访问性，并断言宿主标题、段落、表格和 body 默认值不变。
- 既有接入页面与 AppShell 测试改用公共入口，覆盖轨道、移动抽屉、键盘、存储隔离与断点。
- 2026-10-16 全量 Playwright：52 项通过；主应用构建、接入示例构建、vi:check 与 6 项 test:vi 通过。
- 五个现有页面在 390 / 900 / 1440px 下对比按钮、品牌、框架和表格的关键 computed styles，未发现差异。此项为抽样属性对比，不等同于全页面逐像素一致。
- 实际导出的快照独立执行类型检查和生产构建成功；使用已安装依赖的 node_modules junction，没有重新进行网络安装。示例构建已去掉 Tailwind 插件。
- 人工检查深色接入页和移动抽屉截图。现有完整回归更新 output/ui 截图；SSR、其他浏览器和目标应用业务仍由接入方验收。
