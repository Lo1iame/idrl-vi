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

`brand:check` 只做环境检查。`brand:build` 依次生成 SVG、token CSS / 对比度报告、审核页 PNG / PDF 和透明 logo PNG（含 favicon-tile.png）。单独运行 `node scripts/render-brand.cjs` 只重新渲染审核稿和 PNG，不重建 SVG / token。

字体原文件已随仓库保存；build-brand.py 仅在原文件缺失时按 sources.json 的来源下载。界面新增文案仍需另运行 `scripts/build-web-fonts.py`，本命令不自动覆盖 UI 字体子集。科研 Matplotlib 图表是另一个构建入口，需要其自身的 numpy / matplotlib 环境，不包含在此最小依赖文件中。

## PPT 环境

```powershell
npm run deck:check
npm run deck:build
```

需要当前 Codex bundled artifact-tool、Python（含 PIL / pypdf）和 presentations 技能。脚本从当前用户的 runtime 目录及 CODEX_HOME 下的技能缓存发现安装，按版本排序选择文件完整的 presentations 技能，不固定个人用户名或某个旧技能版本。

迁移时可设置：

- `IDRL_RUNTIME`：workspace dependencies 返回的 dependencies 根目录，含 node 与 python 子目录。
- `IDRL_PRESENTATIONS_SKILL`：明确指定 presentations 技能目录；覆盖路径不完整时直接报错。
- `IDRL_PYTHON` / `PYTHON_BIN`：自备且满足导出要求的 Python；不设置时 PPT 使用 bundled Python。
- `RUNTIME_NODE_MODULES`：显式覆盖 artifact-tool 的依赖目录；默认来自 IDRL_RUNTIME。

`deck:check` 不生成文件。`deck:build` 使用 bundled Node 的独立渲染 worker，完成 PPTX 导出、结构 / 原生对象 / 字体校验、最终文件重新导入及全部预览渲染后，才发送带 SHA-256 的完成结果。父进程核对校验和再回收 worker，避开当前 Windows 原生图形运行时的退出阶段崩溃；没有收到完成结果、校验不匹配或超时均返回失败。不要直接运行 build-research-deck.mjs，它是 worker 入口。

默认输出 `output/research-template/idrl-research-template-v3-final.pptx`；已有文件会在生成前拒绝覆盖。后续修订使用新的文件名：

```powershell
$env:IDRL_DECK_REVISION = 'v4'
npm run deck:build
Remove-Item Env:IDRL_DECK_REVISION
```

最终 PPTX 校验后才更新画廊链接及预览；校验收据保留在 `.scratch/presentation-build/<修订>/validation.json`。v2 保留作历史参考。此轮 v3 改用小尺寸 IDRL 字标作为页眉，完整英文名称在封面、完整中英文名称在结束页保持可读尺寸。

## 回归检查

```powershell
npm run test:assets
.venv-assets/Scripts/python.exe -m unittest discover -s tests -p "test_*.py"
npm run build
npm test
```

资产检查包括技能缓存选择与显式覆盖失败；Python 检查包含字体输入以及当前画廊 PPT 的 16 页、4 张表格、3 张图表 / 工作簿和页眉 logo 尺寸约束。自动结构检查不代表已在本轮 PowerPoint / Google Slides 中逐项编辑，也不替代印刷打样。
