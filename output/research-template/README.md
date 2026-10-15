# IDRL 科研汇报模板 v4

当前使用 idrl-research-template-v4.pptx；同名 PDF 为免安装字体的版式审核预览，index.html 提供完整 16 页画廊。v2 / v3 保留作历史参考。

参照 idrl-foundation-review.pdf，采用品牌页眉、清晰的标题 / 导语、深浅面板、重点色块和可读留白。封面 / 章节 / 结束页用深 navy；证据页保持明亮，任务结果和鲁棒性页附合成数据差值。

- 16 页内容顺序保持：封面、结构、章节、问题、相关工作、方法、公式、设置、主结果、学习曲线、消融、鲁棒性、定性分析、结论、资源、讨论。
- 保留 4 张原生表格、3 张原生图表及数据工作簿；方法流程与文本可编辑。
- 所有数值与差值均为合成示例，不代表团队成果。差值从 illustrative-data.json 的同一份数据计算。
- 方括号与“插入实验图像”为有意保留的模板内容，使用时替换。
- 公式为可编辑文本，不是原生数学公式对象。当前仍按页面复制使用，没有交付自定义母版 / POTX。

打开 PPT 前安装 assets/brand/fonts/ 的 InterVariable.ttf、NotoSansCJKsc-Regular.otf、NotoSansCJKsc-Bold.otf。字体未嵌入 PPT；PDF 由最终幻灯片 PNG 合成，用于视觉审核，不是矢量印刷稿。

通过 npm run deck:check / deck:build 重建；已存在的输出不会覆盖，下一版设置 IDRL_DECK_REVISION=v5。环境说明见 docs/design/asset-build.md。每次使用独立构建目录，避免覆盖旧校验收据。

当前包结构、字体、图表工作簿引用与重新导入检查通过，16 页最终渲染已逐页视觉检查。validation-current.json 为自动生成的技术摘要；validation-v4.json 记录本轮视觉检查。没有在本轮 PowerPoint / Google Slides 本体逐项编辑验证。
