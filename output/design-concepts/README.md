# IDRL 研究助手视觉方向稿

> 历史方向稿：图中的生成式 logo 不是可分发品牌资产。2026-10-12 深色 logo 已统一改用浅蓝色块；当前实施与审核请使用 `assets/brand/logo/`、`output/brand/` 和 `output/ui/`，不要从本目录图片裁切或复用 logo。

使用 taste-skill:imagegen-frontend-web 与内置 imagegen 生成。两张独立横向应用状态稿；它们是布局参考，尚未替换当前可运行前端。

- `assistant-idle-v1.png`：研究入口，突出居中的问题输入框，收紧导航与上下文。
- `assistant-approval-v1.png`：操作确认，突出来源、操作对象、影响和确认按钮。

品牌沿用 navy #203663、blue #236db9、cyan #56c0e5，Inter / Noto Sans CJK SC。图中文字与 logo 为生成效果，正式实现继续使用仓库的矢量 logo、真实字体与可访问组件。

## 首页提示词

Create ONE horizontal 16:9 high-fidelity desktop web application design reference, 1920x1080 composition. This is a single IDRL research assistant workspace screen in its idle state, not a marketing landing page, not a collage, no browser/device frame. Reference image is the existing application for brand identity and functional content ONLY; redesign its composition substantially. Keep the exact geometric cyan/blue/navy IDRL logo from reference in the top-left, never add Laboratory. Team name 智能设计与鲁棒学习. Refined Swiss rational typography, Inter for Latin, Noto Sans CJK SC for Chinese. Navy #203663 text, blue #236db9 primary action, cyan #56c0e5 small accents, cool white #f5f8fc canvas and white main surface, thin #dce4ef separators. Very polished contemporary AI-native research software, confident restraint, crisp vector-like UI, readable real Chinese labels, no gradients, no glow, no decorative charts, no stock photos.
Composition: slim 216px light-grey left navigation, generous white unboxed central canvas about 1100px wide, narrow quiet right sources rail separated by one vertical divider. No extra design-demo route bar from the screenshot. Left nav exact logo at top, team selector 'IDRL Research', blue-accent active row '研究助手', other rows '实验工作台' and '设计组件', understated bottom '本地演示'. Topbar 64px with small breadcrumb '研究助手', right compact '示例空间' and theme/language icon controls.
Central focal group placed just above vertical center: a modest cyan geometric brand symbol, 42px elegant medium weight title '从一个好问题开始。', short 16px support '连接实验记录，梳理证据与下一步。'. Immediately below it a beautiful wide 640px prompt composer, 150px tall, 12px radius, subtle cool shadow, fine visible border, 18px placeholder '提出一个研究问题…'. Bottom composer row small '本地模拟 · 未连接 AI 模型' and compact blue upward-arrow submit button. Beneath composer exactly TWO quiet text suggestion actions with small line icons: '比较最近的示例实验结果' and '整理下一步检查项', aligned horizontally or stacked elegantly without boxes. Generous negative space around this actionable center, no redundant hero heading above.
Right rail titled '上下文', a restrained source file row 'demo-experiments' and '5 条示例记录', compact rows '已完成 03' and '运行中 / 失败 01 / 01', a small secondary settings region '演示场景' with labeled select '工具执行结果' value '成功'. Footer note '操作前确认，结果可检查。'. Sidebar and context use clear readable 14-16px labels. Main white canvas is the dominant visual, precise alignment, deliberate spacing, product-grade accessibility and highly codeable layout. One single screen, beautifully finished, all visible copy useful.

## 确认状态提示词

undefined

