# IDRL 科研汇报模板 v3

打开 `idrl-research-template-v3-final.pptx`，复制所需页面并替换内容。浏览 `index.html` 可预览全部 16 页。

先安装 `assets/brand/fonts/` 中的 Inter 与 Noto Sans CJK SC。模板保持原 logo 比例，使用已确认品牌色和中英文名称。

页面顺序：封面、结构、章节、问题、相关工作、方法流程、公式、实验设置、主结果、学习曲线、消融、鲁棒性、定性分析、结论、参考资源、讨论。

- 文字、4 张表格及方法流程均可编辑。
- 3 张图表附带数据工作簿；在 PowerPoint 中使用“编辑数据”替换数值。
- 图表为合成示例，`illustrative-data.json` 提供完整数据；替换前不能当作真实成果使用。
- 方括号与“插入实验图像”是有意保留的模板内容，发布前替换。
- 公式为文本示例，复杂公式建议在 PowerPoint 内插入数学公式。
- 当前按页面复制使用，尚未交付自定义母版或 POTX。

页眉使用小尺寸 IDRL 字标，完整名称在封面 / 结束页以可读尺寸呈现。v2 保留作历史版本。

使用 `npm run deck:check` 和 `npm run deck:build`，完整环境准备与修订输出约定见 `docs/design/asset-build.md`。已存在的输出不会覆盖；后续设置 IDRL_DECK_REVISION 为新修订名。

本轮验证：16 页、4 张原生表格、3 张原生图表及工作簿数据引用通过校验，最终文件已重新导入、渲染并逐页检查。未在本轮 PowerPoint / Google Slides 中执行打开与逐项编辑测试。校验收据位于 `.scratch/presentation-build/v3-final/validation.json`；可提交的摘要见本目录 validation-v3.json。
