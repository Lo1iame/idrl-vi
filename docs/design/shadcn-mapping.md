# IDRL tokens → shadcn/ui + Tailwind CSS v4 映射

状态：v0.1（从 idrl-portal v0.11.0 的实际落地中提炼，作为 IDRL registry 的第一块参考实现）。适用于「React + Tailwind CSS v4 + shadcn/ui 源码」形态的应用；官网等非 shadcn 场景直接用 `tokens-values.css`。

## 原则

1. `assets/brand/tokens.json` 是唯一数值来源；应用侧只做**映射**，不发明新值。
2. 深色主题用 VI 的独立深色语义值（`.dark` 类或 `[data-theme="dark"]`），不做整体颜色反转。
3. 深色底 logo 一律用 `-reverse` 专用资产（建议封装组件在 CSS 层切换），禁止滤镜变白。

## 语义变量映射（globals.css `:root` / `.dark`）

| shadcn 变量 | VI token | 说明 |
| --- | --- | --- |
| `--background` / `--foreground` | `background` / `foreground` | |
| `--card`、`--popover`（+ `-foreground`） | `surface` / `foreground` | |
| `--primary` / `--primary-foreground` | `primary` / `primaryForeground` | |
| `--secondary`、`--muted` | `surfaceSubtle` | |
| `--accent` / `--accent-foreground` | `accent` / `accentForeground` | |
| `--destructive`（+ `-foreground`） | `destructive`（深色文字用 `background` 值） | |
| `--border` | `border` | |
| `--input` | `controlBorder` | 需要独立辨认的控件边界 |
| `--ring` | `focus` | |
| `--chart-1..5` | `chart1..5` | 图表类别色，按序使用 |
| `--sidebar-*` | 见下 | 侧栏：surface 底、surfaceSubtle 激活、激活文字用 primary |

另需补充 shadcn 没有的变量：`--primary-hover`（`primaryHover`）、`--success` / `--warning`（功能色），并在 `@theme inline` 中暴露为 `text-success` 等工具类；品牌三主色以 `--color-brand-navy/blue/cyan` 暴露，仅用于图形装饰。

## 圆角

Tailwind v4 `@theme inline`：

```css
--radius-md: var(--radius);        /* 控件 6px：Button/Input/Select = rounded-md */
--radius-xl: 0.75rem;              /* 卡片 12px：Card = rounded-xl */
/* 弹窗 16px = Tailwind 默认 rounded-2xl（1rem），Dialog/AlertDialog 手动改用 */
```

## 字体

```css
--font-sans: var(--font-inter, 'Inter'), 'Noto Sans CJK SC', 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Consolas, 'Courier New', monospace;
```

英文/数字用自托管 Inter（`next/font/local` 或 `@font-face` 加载 InterVariable.woff2）。Next.js 使用已定义的 `--font-inter`；普通 `@font-face` 接入使用变量默认值 `Inter`，无需定义 Next.js 字体变量。中文见 DESIGN.md「字体」的回退栈与子集策略。

## 状态徽章配方（已过对比度审计）

```
底：状态基色 15% 叠加所在 surface（bg-[color-mix(in_srgb,var(--success)_15%,var(--surface))]）
文字：两种主题均用 --primary-text / --success-text / --warning-text / --destructive-text
      浅色为加深变体；深色已定义为对应基色。下游映射必须包含这些变量的两种主题值。
描边（可选）：状态基色 30%
```

徽章必须带文字标签，不能只靠颜色。警告横幅同源：`border: 状态色 30%`、`background: 状态色 5%`、标题文字用当前主题的 `*Text` 变体。tokens v0.2.1 补齐深色变体，禁止沿用浅色 `warningText` 到深色横幅。

## 考勤/人员状态 → 功能色

present→success、absent→destructive、trip→primary、leave→warning。同一状态全应用同色；SVG 展示属性（fill/stroke attribute）不支持 `var()`，需经 `style` 或 CSS 类传递。
