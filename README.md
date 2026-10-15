# IDRL · 智能设计与鲁棒学习

Intelligent Design and Robust Learning 的视觉识别与 UI 参考体系，为团队官网、科研工具和内部应用提供一致的设计约定与可复制源码。

## 其他应用从这里开始

1. 阅读 [DESIGN.md](DESIGN.md) 与 [CONTEXT.md](CONTEXT.md)：品牌规则与名称。
2. 阅读 [接入与重构指南](docs/design/adoption.md)：接入深度、迁移步骤、验收清单及可直接交给 agent 的任务书。
3. 参考 [组件能力清单](docs/design/component-inventory.md)、[AppShell 接入](docs/design/app-shell-integration.md)、[shadcn 映射](docs/design/shadcn-mapping.md)。
4. 运行 `npm run vi:check`，再运行 `npm run vi:export` 获得带来源 commit、依赖和 SHA-256 的独立源码快照。运行示例见 [examples/adoption](examples/adoption/README.md)。

已有 shadcn 应用优先接 token / logo；需要工作台时再复制框架与组件。保留原业务、API、权限、路由和框架，不直接覆盖全局 CSS，不复制展示站模拟数据。中文动态内容使用官方回退栈，不使用展示站专用子集。

## 当前交付与边界

| 交付 | 入口 | 状态 |
| --- | --- | --- |
| Logo、品牌三蓝色、字体与语义主题 | [assets/brand](assets/brand/README.md) | 视觉基础已审核；token 0.2.1 |
| 设计契约与接入资产索引 | [DESIGN.md](DESIGN.md)、[reuse-manifest.json](assets/brand/reuse-manifest.json) | 现行规范，支持自动一致性检查 |
| 官网、工作台、助手、组件、日志 | src/pages/ | 可运行展示；真实业务均为本地模拟 |
| 应用框架与 UI 控件 | [能力清单](docs/design/component-inventory.md) | 源码复用，尚非完整组件库 |
| 科研汇报模板 | [PPT v4](output/research-template/idrl-research-template-v4.pptx)、[PDF](output/research-template/idrl-research-template-v4.pdf) | 16 页分层设计；原生表格 / 图表可编辑；字体未嵌入 |
| 科研图表规范 | [scientific-charts.md](docs/design/scientific-charts.md) | 样式与合成示例；不代表真实研究结果 |

UI 最终视觉、完整屏幕阅读器及跨浏览器人工验收尚未全部完成。没有已发布 npm 包、registry、Storybook、认证、业务后端或服务端表格。v2 / v3 PPT 与历史报告保留作参考，当前材料以 reuse-manifest 为准。

## 本地运行

使用满足 package-lock 所锁定 Vite 版本要求的 Node.js 与 npm：

```sh
npm ci
npm run dev
```

| 路由 | 内容 |
| --- | --- |
| /#website | 官网品牌与动效示例 |
| /#workspace | 表格、筛选、创建与导出 |
| /#assistant | 流式、停止、确认、失败重试及报告下载 |
| /#components | 公共组件预览及接入文档 |
| /#foundation | 五页历史品牌审核稿、放大查看与 PDF 预览下载 |
| /#changelog | 本设计系统已提交更新 |
| /examples/adoption/ | 不依赖展示站页面的接入验证示例 |

## 验证与重建

```sh
npm run vi:check
npm run build
npm run vi:example:build
npm run test:vi
npm run test:assets
npm test
```

vi:check 仅额外需要 Python 标准库；可自动发现 .venv-assets 或设置 IDRL_PYTHON。字体 / 文档资产回归与品牌 / PPT 重建环境见 [asset-build.md](docs/design/asset-build.md)。浏览器测试默认使用本机 Edge，其他环境设置 BROWSER_CHANNEL 或配置 Playwright Chromium；截图在 output/ui/。

## 维护与同步

- tokens.json 是唯一变量源；修改后运行 scripts/build-tokens.py，再做 vi:check。CSS 与 shadcn aliases 均自动生成。
- 颜色数值变化升级 token 版本；组件 / 文档更新按 commit 同步，不混用 package 版本或 PPT 修订号。
- src/ui.css 是可复用公共样式入口；src/fonts.css、styles.css / design-refresh.css 只服务展示站，不进入 UI 接入快照。
- 新资产在 assets/brand/logo/；logo/ 是历史源文件。字体与许可保留在 assets/brand/fonts/。
- 历史验证见 docs/design/phase-2-validation.md；当前一致性检查范围见 [本轮报告](docs/design/reuse-consistency-2026-10-15.md)。

所有页面为设计审核示例：无外部模型、认证、训练服务或持久化业务数据；工作台离页 / 刷新即恢复演示记录。React Bits / GSAP 官网适配与演示导航默认不进入 UI 接入快照。
