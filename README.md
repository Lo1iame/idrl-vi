# IDRL · 智能设计与鲁棒学习

Intelligent Design and Robust Learning 的视觉识别与 UI 设计体系。

## 当前交付

- 已审核的视觉基础：logo 中英文组合、品牌三蓝色、字体、间距、深浅主题变量。
- 已按视觉稿更新的可运行界面：官网、实验工作台、研究助手、基础组件。
- 官网首屏与研究区域已加入 React Bits AnimatedContent 和 TiltedCard 适配动效，以及可重播 IDRL 标志组装与精细网格背景；支持减少动画偏好、键盘焦点和移动端降级，GSAP 按需加载。
- 组件页包含表单校验、确认弹窗、色值复制、密度切换和键盘页签；官网可将问题草稿带到研究助手。
- Agent 设计契约：DESIGN.md；名称术语：CONTEXT.md。
- 科研汇报模板：`output/research-template/idrl-research-template-v2.pptx`，16 页可编辑页面；预览入口为同目录 `index.html`。
- 科研图表规范：`docs/design/scientific-charts.md`；Matplotlib 样式位于 `assets/brand/charts/`，示例导出位于 `output/scientific-charts/`。

## 本地运行

使用符合 Vite 要求的 Node.js（建议当前支持的 LTS）。

```sh
npm ci
npm run dev
```

在开发服务器打开以下路由：

| 路由 | 内容 |
| --- | --- |
| `/#website` | 官网概念与品牌表达 |
| `/#workspace` | 演示实验、筛选、表单与导出 |
| `/#assistant` | 流式输出、确认、模拟工具与报告下载 |
| `/#components` | 当前共用的基础组件 |

```sh
npm run build
npm test
```

字体子集脚本的回归检查（需要 fontTools 和 Brotli）：

```sh
python tests/test_font_build.py
```

该检查在临时目录生成字体，验证错误输入不会覆盖现有子集，以及 JavaScript / JSX 文案能正确纳入子集。

测试默认使用本机 Edge。其他环境可设置 BROWSER_CHANNEL 为已安装的 Chrome，或安装 Playwright Chromium 并调整配置。截图输出到 output/ui/。

## 内容与资产

- `logo/`：历史源文件，保留原样。新材料使用 `assets/brand/logo/`。
- `assets/brand/tokens.json`：变量源；用 `scripts/build-tokens.py` 生成 CSS。
- `assets/brand/fonts/`：原始字体、Web 字体和 OFL 授权。用 `scripts/build-web-fonts.py` 更新当前文案的中文子集。
- `docs/design/`：设计简报、基础视觉预览与数值对比度报告。
- `src/components/`：可复制的基础组件和布局；当前尚非完整组件库。
- `output/brand/`：第一阶段 logo PNG 和五页视觉审核 PDF。

这些页面用于设计审核。实验数据和 AI 流程均为本地模拟；官网研究内容为示例，不表示已验证的团队成果。无模型调用、认证、业务后台或持久存储。工作台记录在离开页面或刷新后重置。

第一阶段已通过审核，第二阶段页面待审核。科研 PPT 与图表规范已交付首版，待审核；后续继续交付完整组件、registry、Storybook、海报与社交模板。

