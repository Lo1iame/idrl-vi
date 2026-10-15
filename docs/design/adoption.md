# 将现有应用重构为 IDRL UI

适用于已有官网、科研工具与内部应用。保留真实业务与信息架构，统一品牌、主题、布局和交互，不要求更换框架。先读根 [DESIGN.md](../../DESIGN.md) 与 [CONTEXT.md](../../CONTEXT.md)。

## 选择接入深度

| 目标应用 | 建议方式 | 复制范围 |
| --- | --- | --- |
| 已有 shadcn / Tailwind v4 | 保留现有组件，接语义 token / logo，再校准尺寸与状态 | tokens-values.css、shadcn-aliases.css、Inter WOFF2、logo、授权 |
| React 工作台 | 在主题之上复用 AppShell、字段、表格源码 | 上述资产 + 选定组件及递归依赖，参考接入包 |
| Vue / Svelte / 其他框架 | 用原框架实现等效布局与交互 | tokens、logo、字体；不直接搬 React TSX |
| 官网 | 按真实信息设计页面，动效独立评估 | 品牌资产和官网参考 |

## 1. 固定来源，盘点应用

在本仓库执行：

```sh
npm ci
npm run vi:check
npm run vi:export
```

vi:check 需要 Python 3.10+，自动发现 .venv-assets，也可设置 IDRL_PYTHON；检查只用 Python 标准库。导出到 `output/adoption-kit/` 内的独立目录，打印实际路径，不覆盖旧快照。manifest 记录源 commit、是否存在未提交内容、token 版本、依赖与逐文件 SHA-256。这是可移交源码 / 资产快照，不是 npm 安装包或跨框架保证。

目标应用先盘点页面 / 路由、权限、API、业务校验、主题 / 国际化、组件 / CSS，保留基线截图与测试。建立 docs/idrl-adoption.md，记录来源、复制范围、本地差异和验证。如果 sourceDirty=true，提交源仓库后重新导出可获得纯提交快照。

## 2. 先接主题与字体

保留资产相对路径，按以下顺序加载：

```css
@import './brand/tokens-values.css';
@import './brand/shadcn-aliases.css'; /* shadcn 场景 */

@font-face {
  font-family: Inter;
  src: url('./brand/fonts/InterVariable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
body { font-family: var(--font-sans); }
```

保留 Tailwind 入口，把 VI 导入 / 映射放在原主题层之后，替换冲突定义，不保留两套同名主题。CSS @import 必须在普通规则之前。根元素统一 data-theme="light|dark"；已有 .dark 的主题管理器同步该属性，首屏初始化也同步，避免闪烁与 logo 错配。保留用户偏好与存储优先级。

动态中文默认走官方回退栈；接入包不带本项目中文子集。需要跨设备固定字形时另行部署完整字体 / 分片并评估体积；静态内容可为自身文案生成子集。不要将展示站子集当全中文字库。

shadcn / Tailwind v4 详见 [shadcn-mapping.md](shadcn-mapping.md)。token 接入不会自动校准圆角、字号、状态和信息层次。

浏览器标签图标引用 assets/brand/logo/favicon.svg：透明底，按浏览器深浅配色自动适配；不跟随应用内主题按钮。favicon-tile.svg 只用于需要固定底色的应用图标。若旧标签仍显示方底，确认 link 引用后重新打开标签，以排除旧 favicon 缓存。

## 3. 接框架与组件

接入包保留 src/、assets/ 相对路径；公共组件不依赖 @ 别名。AppShell 显式传入自有 config；`examples/adoption/app.tsx` 是实际参与类型检查的示例。API 见 [组件清单](component-inventory.md) 与 [框架接入](app-shell-integration.md)。

已有样式系统不要全量导入 styles.css / design-refresh.css，它们含全局标签与官网布局。按组件迁移样式，或先在隔离验证页使用完整参考样式确认外观，再隔离。`examples/adoption/reference.css` 仅用于新页面试接，中文默认回退。

顺序：导航框架 → 按钮 / 字段 / 状态 → 表格 / 弹窗 → 内容布局 → AI 状态 → 可选动效。先完成一个含表单、列表、详情的代表页面，再推广。标准 a 链接可接原路由，保留可访问属性与抽屉关闭行为。

Next.js App Router 中交互组件放入 client boundary，验证 hydration、字体路径和路由；当前源码不是经过 SSR 验证的包。远程表格、权限、模型调用仍用目标应用真实实现，不用本项目模拟逻辑替代。

## 4. 逐页验收

- [ ] API、权限、路由、校验、导出范围与持久化行为保持一致。
- [ ] 名称正确；深浅背景使用对应 logo；无滤镜、变形、旧名称。
- [ ] 深浅主题均用语义 token，包括状态文字、焦点、边界和图例。
- [ ] 中英文 / 长名称 / 动态中文无裁切缺字，字体请求失败时可读。
- [ ] 320 / 390 / 768 / 1024 / 1440px 无整页溢出；仅数据容器可局部滚动。
- [ ] 轨道、抽屉、Esc、Tab、当前导航、焦点恢复、存储失败均可用。
- [ ] 默认 / 禁用 / 加载 / 空 / 失败 / 成功均覆盖；危险 / AI 操作明确确认。
- [ ] 减少动画时内容直接可见，工具页无无关循环与重型动效。
- [ ] 目标应用构建、业务测试和迁移风险检查通过；保留同数据前后截图。

本仓库 npm test 不能证明下游业务通过；未验证浏览器、屏幕阅读器、SSR 列为剩余项。

## 5. 后续同步

token 数值修改在本仓库 JSON 完成，升 token 版本并重生成；组件 / 文档变化记录源 commit，不虚增 token 版本。下游比对 manifest 与 diff，保留本地适配，不直接覆盖业务。

目标应用维护 idrl-source.json：sourceCommit、tokenVersion、copiedFiles、localAdaptations、validatedAt。历史图稿标明历史；当前科研材料以 reuse-manifest 与 validation-current.json 为准。

## 可交给应用 agent 的任务书

```text
基于提供的 IDRL VI 仓库 / 接入快照重构当前应用 UI。
先读 DESIGN.md、CONTEXT.md、docs/design/adoption.md、component-inventory.md。
记录 source commit / tokenVersion；sourceDirty=true 时注明未提交快照。
盘点页面、路由、权限、API、主题、字体、样式和测试，保存代表性基线。
保留原框架、真实业务、API、校验、持久化及导航语义，接入 IDRL tokens 和专用 logo。
已有 shadcn 优先适配主题；需要工作台时显式配置 AppShell，不复制演示导航与数据。
动态中文不导入展示站子集；不覆盖 globals.css。
先做一个代表页面，验证主题、响应式、键盘、状态和业务，再推广。
执行目标应用构建和业务测试，补迁移风险检查，交付前后截图和 docs/idrl-adoption.md。
不得将未发布的 npm 包、registry、Storybook、服务器表格当可用能力。
```
