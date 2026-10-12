# 科研图表示例

所有数值都是合成示例，不代表真实实验结果。

- `task-comparison`：多任务柱图。
- `learning-curve`：训练损失曲线。
- `robustness`：扰动强度曲线。
- `repeat-uncertainty`：原始重复点、均值与样本标准差，n=5。

每种图提供 SVG、PDF 与 300 dpi PNG。SVG 保留文字，编辑环境需安装 Inter；PDF 嵌入字体子集。数据来自 `../research-template/illustrative-data.json` 和本目录 `repeat-runs.json`。

复现：在含 NumPy、Matplotlib 的 Python 环境中运行 `python scripts/build-scientific-charts.py`。本次使用独立 `.scratch/chart-venv`，Matplotlib 3.11.2；绘图脚本会从仓库注册字体，无需修改系统字体。

视觉与统计表达规则见 `docs/design/scientific-charts.md`。已检查四张 PNG 的排版、图例映射与数据；未依据示例推导任何真实科研结论。
