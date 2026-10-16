# 品牌与汇报模板重建

2026-10-15。Node 依赖由 package-lock.json 锁定；品牌构建所需 Python 包由 requirements-assets.txt 锁定。Windows 当前默认使用已安装的 Edge，其他平台使用 Playwright Chromium。此轮实际验证平台为 Windows。

## 品牌环境

准备 Python 3.10+ 和 Node 后，在仓库根目录运行：

```powershell
npm ci
python -m venv .venv-assets
.venv-assets/Scripts/python.exe -m pip install -r requirements-assets.txt
npm run brand:check
npm run brand:build
```

macOS / Linux 的虚拟环境 Python 路径为 `.venv-assets/bin/python`，并先运行 `npx playwright install chromium`。如果使用 Codex bundled Python 创建虚拟环境，将第一条 Python 命令中的 python 替换为当前 workspace dependencies 查询返回的 Python 绝对路径。不要依赖 Windows Store 的 python 别名。

Python 查找顺序：显式 IDRL_PYTHON / PYTHON_BIN → 项目 .venv-assets → 当前用户的 Codex bundled Python → 系统 python3 / python。显式覆盖不可用时直接失败，避免悄悄使用另一套环境。支持通过 BROWSER_CHANNEL 指定已安装的浏览器。

`brand:check` 只做环境检查。`brand:build` 依次生成 SVG、token CSS / 对比度报告、科研图表样式和透明 logo PNG（含 favicon-tile.png）。单独运行 `node scripts/render-brand.cjs` 只重新渲染 logo PNG。历史视觉基础审核稿默认保留；仅在明确修订历史稿时使用 `node scripts/render-brand.cjs --review` 重建审核页 PNG / PDF。

字体原文件已随仓库保存；build-brand.py 仅在原文件缺失时按 sources.json 的来源下载。界面新增文案仍需另运行 `scripts/build-web-fonts.py`，本命令不自动覆盖 UI 字体子集。科研 Matplotlib 图表是另一个构建入口，需要其自身的 numpy / matplotlib 环境，已锁定在 requirements-assets.txt 中。

## PPT 环境

```powershell
npm run deck:check
npm run deck:build
```

需要当前 Codex bundled artifact-tool、Python（含 PIL / pypdf / reportlab）和 presentations 技能。脚本从当前用户的 runtime 目录及 CODEX_HOME 下的技能缓存发现安装，按版本排序选择文件完整的 presentations 技能，不固定个人用户名或某个旧技能版本。

迁移时可设置：

- `IDRL_RUNTIME`：workspace dependencies 返回的 dependencies 根目录，含 node 与 python 子目录。
- `IDRL_PRESENTATIONS_SKILL`：明确指定 presentations 技能目录；覆盖路径不完整时直接报错。
- `IDRL_PYTHON` / `PYTHON_BIN`：自备且满足导出要求的 Python；不设置时 PPT 使用 bundled Python。
- `RUNTIME_NODE_MODULES`：显式覆盖 artifact-tool 的依赖目录；默认来自 IDRL_RUNTIME。

`deck:check` 不生成文件。`deck:build` 使用 bundled Node 的独立渲染 worker，完成 PPTX 导出、结构 / 原生对象 / 字体校验、最终文件重新导入及全部预览渲染后，才发送带 SHA-256 的完成结果。父进程核对校验和再回收 worker，避开当前 Windows 原生图形运行时的退出阶段崩溃；没有收到完成结果、校验不匹配或超时均返回失败。不要直接运行 build-research-deck.mjs，它是 worker 入口。

默认输出 `output/research-template/idrl-research-template-v4.pptx`；已有文件会在生成前拒绝覆盖。后续修订使用新的文件名：

```powershell
$env:IDRL_DECK_REVISION = 'v5'
npm run deck:build
Remove-Item Env:IDRL_DECK_REVISION
```

最终 PPTX 校验后才更新画廊链接及预览；校验收据保留在 `.scratch/presentation-build/<修订>/run-*/validation.json`。v2 / v3 保留作历史参考。v4 参照品牌审核稿建立分层版式，仍用小尺寸 IDRL 字标作为页眉，并在封面 / 结束页保留可读的完整名称。

## 回归检查

```powershell
npm run test:assets
.venv-assets/Scripts/python.exe -m unittest discover -s tests -p "test_*.py"
npm run build
npm test
```

资产检查包括技能缓存选择与显式覆盖失败；Python 检查包含字体输入以及当前画廊 PPT 的 16 页、4 张表格、3 张图表 / 工作簿和页眉 logo 尺寸约束。自动结构检查不代表已在本轮 PowerPoint / Google Slides 中逐项编辑，也不替代印刷打样。

## v4 的 PDF 与检查摘要

构建器从最终 PPTX 重新导入并渲染预览，再通过 export-deck-preview.py 合成为同名 PDF，供免安装字体的版式审核。PDF 为栅格预览，不是可编辑或矢量印刷版本。当前版本校验摘要自动写入 output/research-template/validation-current.json；每次构建使用独立 run-* 临时目录，保留历史收据并避免缓存冲突。

## UI 接入的一致性检查

npm run vi:check 仅需 Python 标准库，会调用 build-tokens.py --check，核对生成 CSS、shadcn aliases、对比度报告、当前资产索引、PPT 校验和、现行文档链接与源码导出依赖。更新 token 后先运行 scripts/build-tokens.py；不需重建品牌或 PPT。npm run vi:export 生成独立接入快照，默认不包含科研二进制材料。

默认浏览器 favicon 为透明自适应 favicon.svg；favicon-tile.svg 保留为固定底色应用图标。只更新这两个图标可运行 `.venv-assets/Scripts/python.exe scripts/build-favicon.py`（标准库）；brand:build 也会重建。静态 PNG 不携带 SVG 媒体查询能力。

## 配色来源与隔离验证

当前 logo、PPT 调色板、Matplotlib 图表和导出样式都读取 `assets/brand/tokens.json`。字体、版式与仅用于特定媒介的装饰色仍由各自生成器定义。修改 token 不会自动改写历史审核稿或已发布的 PPT；新版资产需重新构建和检查。

- `build-brand.py --check` 校验当前 SVG；`--tokens <文件> --output <目录>` 可隔离生成配色变体。
- `brand-styles.py --check` 校验生成的 `idrl.mplstyle`，不要直接编辑该文件。
- `build-scientific-charts.py --tokens <文件> --output <目录>` 隔离生成科研图表示例。
- PPT 调色板支持 `IDRL_TOKEN_FILE`，输出支持 `IDRL_DECK_OUTPUT_DIR`；页眉仍引用当前已生成的 logo PNG，更新品牌色时需先重建品牌资产。通过 `npm run deck:build` 运行，已有文件仍拒绝覆盖。
- `vi:check:ui` / `vi:export` 只检查 UI 接入输入；`vi:check` 保留全仓库审计，`vi:verify -- <目录>` 验证导出副本字节。

## 架构调整验证（2026-10-16）

主应用与独立接入示例构建通过；52 项浏览器测试、6 项接入快照测试、3 项资源运行时 / PPT 配色测试及 10 项 Python 测试通过。完整品牌构建前后历史审核稿哈希不变；logo 配色变体测试确认几何路径不变。科研图表在临时目录导出 4 组、每组 3 种格式；PPT 在临时目录完成 16 页重导入渲染及结构校验（4 张原生表格、3 张原生图表），没有替换现行 v4。此验证不包含 PowerPoint / Google Slides 实机编辑验收。
