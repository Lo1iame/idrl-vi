# IDRL 视觉基础资产 v0.1

本目录的第一阶段视觉基础已于 2026-10-12 通过审核。设计使用规则见根目录 DESIGN.md。

## Logo

| 文件 | 用途 |
| --- | --- |
| `symbol-color.svg` | 浅色背景彩色图形 |
| `symbol-color-reverse.svg` | 深色背景彩色图形 |
| `symbol-navy.svg` / `symbol-white.svg` | 单色图形 |
| `lockup-idrl.svg` | 图形 + 原有 IDRL 几何字标 |
| `lockup-zh.svg` | 中文横向组合 |
| `lockup-en.svg` | 英文横向组合 |
| `lockup-bilingual.svg` | 双语横向组合 |
| `lockup-bilingual-reverse.svg` | 双语深色背景组合 |
| `lockup-stacked.svg` | 图形、IDRL、中文及英文上下组合 |
| `favicon-tile.svg` | 品牌 favicon / 应用图标方块（navy 底 + reverse 图形）。裸 reverse SVG 为透明底，白色字母在浅色浏览器标签栏不可见，故 favicon 一律使用此 tile；PNG 各尺寸由应用按需栅格化 |

全部 SVG 文字为轮廓，无外部字体依赖。新组合不包含 Laboratory。
图形与 IDRL 字标由历史 AI 文件第一页提取，保留 Bézier 曲线；数字颜色使用当前统一提案，未作印刷 ICC 匹配。
PNG 为透明背景，位于 `output/brand/`。深色底版本需要搭配深色底查看。

## 字体与变量

- `fonts/`：Inter Variable、Noto Sans CJK SC Regular/Bold、原始 OFL 授权和下载来源。
- `tokens.json`：唯一变量源；`tokens.css` 为含完整字体的生成结果，`tokens-values.css` 为 Web 使用的纯变量版本。不要仅修改 CSS。v0.2.0 新增图表类别色（`chart1..5`）、深色底 navy 适配色（`navyOnDark`）与浅色状态加深文字变体（`*Text`，供 15% 色底徽章使用）。
- Logo 中文字样使用 Noto Sans CJK SC Bold，英文使用 Inter 默认字重；英文界面标题可用 700。
- 字体与 SVG 均可离线使用，审核页面不请求外部 CDN。Web 示例采用 WOFF2 及当前文案的中文子集；新增文案运行 scripts/build-web-fonts.py。完整 OTF 保留用于设计导出，子集之外的中文依赖平台字体回退。

## 重建审核稿

Python 依赖：pypdf、fonttools、reportlab。Node 依赖：playwright、sharp；需要可用 Chromium，或通过 BROWSER_CHANNEL 指定已安装的 msedge。

```text
python scripts/build-brand.py
python scripts/build-tokens.py
node scripts/render-brand.cjs
```

运行环境可用 PYTHON_BIN 指定 Python，NODE_PATH 指定依赖位置。首次重建 logo 会从 sources.json 中列出的官方地址下载字体。下载后的原始字体及授权已随目录保留。

审核 PDF 从高分辨率页面图像打包，确保与视觉预览一致；属于屏幕审核稿，不作为最终印刷矢量规范。SVG 才是当前 logo 矢量资产。
