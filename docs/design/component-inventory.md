# 可复用组件与能力边界

更新于 2026-10-15。这是当前源码清单，不是未来计划；依赖版本见根 package.json / lockfile。

| 能力 | 源码 | 依赖 / 样式 | 范围与限制 |
| --- | --- | --- | --- |
| 品牌节点 | `src/components/brand.tsx` | 4 个 logo SVG、基础 CSS | data-theme 切换或 dark 显式指定；不提供路由 |
| 应用框架 | `src/components/app-shell.tsx` | app-shell-config、types、Button、Tooltip、Sheet、Breadcrumb、app-shell.css 及基础样式 | 显式 config，分组单层导航；无认证、权限、多层菜单 |
| 操作 | `src/components/ui/button.tsx` | Radix Slot、CVA、utils、基础 CSS | 原生属性 / ref、asChild；loading 由宿主提供 |
| 状态 | `src/components/ui/badge.tsx` | 基础 CSS | neutral / success / warning / danger / info；须有文字 |
| 输入与字段 | `src/components/ui/field.tsx` | field.css、utils | Input / Select / Textarea / FormField；不内置校验库或保存 |
| 选择控件 | `src/components/ui/choice.tsx` | choice.css、utils | Checkbox / Switch；Switch 受控，不参与 FormData |
| 数据表 | `src/components/ui/data-table.tsx` | data-table.css、Button、Select、Translate、Lucide | 本地集合排序 / 分页 / 空态；无远程分页、虚拟化、列显隐、行选择 |
| 对话框 | `src/components/ui/dialog.tsx` | Radix Dialog、Lucide、基础 CSS | 受控、说明与焦点恢复；业务确认由调用者完成 |
| 抽屉 | `src/components/ui/sheet.tsx` | Radix Dialog、Button、Lucide、app-shell.css | 受控、触发器与焦点恢复 |
| 提示 | `src/components/ui/tooltip.tsx` | Radix Tooltip、app-shell.css | label / side / enabled；单一可接收 ref 的触发元素 |
| 面包屑 | `src/components/ui/breadcrumb.tsx` | Lucide、app-shell.css | 最后一项当前页，其他项标准链接 |

`src/lib/utils.ts` 的 cn 依赖 clsx、tailwind-merge。公共类型为 `src/lib/types.ts` / `app-shell-config.ts`。组件除各自导入的 CSS 外仍依赖全局基础规则，不能只复制 TSX。接入包提供 styles.css / design-refresh.css 完整参考快照，含全局 reset、表格、示例页面选择器，**不得直接覆盖已有 globals.css**。已有组件体系优先接 token / logo，再迁移选定样式。

## 示例与产品代码

| 来源 | 使用方式 |
| --- | --- |
| `src/pages/foundation.tsx` | 历史品牌审核画廊与 PDF；不作为实时 VI 手册，默认接入包不包含 |
| `src/pages/workspace.tsx` | 筛选、创建 / 导出交互参考；替换演示数据，保留目标 API |
| `src/pages/assistant.tsx` | AI 状态与确认模式；不是模型 SDK、真实工具或后端 |
| `src/pages/components.tsx` | 组件交互与状态预览 |
| `src/pages/changelog.tsx` / `src/lib/releases.ts` | 日志模板与本仓库历史；下游维护独立记录 |
| `src/lib/app-navigation.tsx` | 本仓库导航，默认包不包含；下游自行配置 |
| `src/components/react-bits/` | 当前官网适配，默认包不包含；许可见该目录 |
| `output/design-concepts/` / `output/ui/` | 视觉参考或历史截图，不能当实现或当前功能证明 |

完整组件库、registry、Storybook、服务器表格、认证与业务后端未交付。框架详例见 [app-shell-integration.md](app-shell-integration.md)。
