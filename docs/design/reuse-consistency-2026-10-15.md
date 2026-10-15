# UI 复用一致性整理

日期：2026-10-15。本文件记录本轮实际范围；以命令结果和已核对内容为证据，不表示最终人工验收完成。

## 已修正

- DESIGN.md 从历史追加记录整理为单一现行契约：去除旧 PPT 当前引用、互相竞争的布局宽度和已实现组件的未来时描述。
- README 建立下游入口；新 adoption / component-inventory 提供分级接入、能力边界、迁移步骤、agent 任务书及验收。
- tokens.json 数值与版本保持 0.2.1；新增自动生成 shadcn aliases，生成检查覆盖 CSS 与对比度报告。
- AppShell 显式接收配置，类型独立，公共框架不再导入展示站导航。现有页面显式使用本仓库配置。
- 展示站中文子集移至 fonts.css，接入快照不含子集；独立示例使用自托管 Inter 与中文回退。
- 组件页色值读取 token JSON，并提供接入指南链接。
- 当前资产索引与源码快照增加版本、源 commit、工作区状态、依赖、逐文件校验和；检查导出依赖闭包与现行文档链接。
- shadcn 文档更正 SVG var() 描述，明确 data-theme 同步、状态文字和 destructive foreground，避免下游重复抄写颜色。

## 验证

- npm run vi:check：59 个导出输入、现行文档链接、PPT 校验和及 token 生成结果一致；87 组对比度通过。
- npm run build、npm run vi:example:build：类型检查与生产构建通过。
- 独立快照验证：将导出目录复制至新的 .scratch/adoption-isolated-*，仅以 junction 共用已锁定的 node_modules，执行该快照的 TypeScript 与 Vite 构建均通过；不是一次全新联网依赖安装，也未连接业务后端。
- npm run test:vi：2 项通过，覆盖快照来源 / 哈希 / 排除项以及主题别名目标。
- npm run test:assets：2 项通过；Python unittest：8 项通过。
- npm test：42 项全部通过（Windows Edge，54.3 秒），含新增 2 项接入页交互与响应式验收；shadcn aliases 在深浅及局部主题边界解析正确，两种主题通过所选 axe 规则。
- 人工查看接入示例深浅主题桌面截图；完整回归同时刷新现有页面、组件与日志截图。截图在 output/ui/。
- 展示站中文子集根据更新文案重新生成；接入快照仍不包含这些子集。
- 日志新增 0.2.2 源码阶段记录，仅汇总截至 f0d4b14 的已提交功能；不将本轮未提交整理写为已发布，也不改变 token 0.2.1。
- git diff --check：通过。

## 边界

默认导出不含业务页面、模拟数据、展示站导航、React Bits、中文子集和 PPT / PDF；索引中的科研材料仍指向源仓库。

styles.css / design-refresh.css 仍是全局参考样式，并非已隔离的组件主题；下游需按组件接入，避免覆盖原 globals.css。Next.js SSR、目标应用业务、完整屏幕阅读器和跨浏览器人工验收不由本轮代替。未创建 npm 发布、registry 或 Storybook。

历史 phase-2-validation 和审计记录保留原日期 / 版本，不回写成当前证据。当前规范以 DESIGN.md / reuse-manifest / component-inventory 为准。
