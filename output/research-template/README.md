# IDRL 科研汇报模板 v2

打开 `idrl-research-template-v2.pptx`，复制所需页面并替换内容。浏览 `index.html` 可预览全部 16 页。

先安装 `assets/brand/fonts/` 中的 Inter 与 Noto Sans CJK SC。模板保持原 logo 比例，使用已确认品牌色和中英文名称。

页面顺序：封面、结构、章节、问题、相关工作、方法流程、公式、实验设置、主结果、学习曲线、消融、鲁棒性、定性分析、结论、参考资源、讨论。

- 文字、4 张表格及方法流程均可编辑。
- 3 张图表附带数据工作簿；在 PowerPoint 中使用“编辑数据”替换数值。
- 图表为合成示例，`illustrative-data.json` 提供完整数据；替换前不能当作真实成果使用。
- 方括号与“插入实验图像”是有意保留的模板内容，发布前替换。
- 公式为文本示例，复杂公式建议在 PowerPoint 内插入数学公式。
- 当前按页面复制使用，尚未交付自定义母版或 POTX。

生成源为 `scripts/build-research-deck.mjs`，使用 Codex bundled artifact-tool。指定 `IDRL_RUNTIME`、`IDRL_PRESENTATIONS_SKILL` 和 `RUNTIME_NODE_MODULES` 可迁移运行环境。新修订需修改最终文件名，finalizer 不覆盖现有版本。

验证：16 页均已重新导入并渲染检查；结构、字体策略、4 张原生表格、3 张原生图表及工作簿数据引用检查通过。本机 PowerPoint 已通过打开、另存测试副本和重新打开 16 页检查；尚未验证逐项编辑图表数据，也未验证 Google Slides。完整校验记录位于 `.scratch/presentation-build/validation-v2.json`。


