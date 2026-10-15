# IDRL tokens → shadcn / Tailwind v4

当前 token 版本见 assets/brand/tokens.json；本文件描述映射，不宣称提供 shadcn registry 或安装包。既有应用保持自己的组件，用 IDRL 主题替换旧颜色定义。

## 生成文件与顺序

1. 引入 tokens-values.css（无字体请求）。
2. 引入 shadcn-aliases.css（由 scripts/build-tokens.py 生成，不手改）。
3. 保留原应用 @theme inline，补齐以下映射，删除冲突的旧 :root / .dark 值。
4. 主题管理器在 html 上同步 data-theme="light|dark"；若保留 .dark，则同时设置两者，首屏初始化也同步。仅 .dark 不会启用本 VI 的深色 tokens 与 Brand。

所有 @import 放在普通 CSS 规则前。支持同一页面局部 data-theme 边界，aliases 在主题边界重新声明，避免继承时解析为父主题颜色。

| shadcn 变量 | 来源 |
| --- | --- |
| background / foreground / primary / primary-foreground / accent / accent-foreground / border | 同名 VI CSS 变量 |
| card / popover，及其 foreground | surface / foreground |
| secondary / muted，及其 foreground | surfaceSubtle / foreground 或 mutedForeground |
| destructive / destructive-foreground | destructive / primaryForeground |
| input / ring | controlBorder / focus |
| chart-1…5 | chart1…5 |
| sidebar / sidebar-foreground | surface / foreground |
| sidebar-primary / foreground | primary / primaryForeground |
| sidebar-accent / foreground | surfaceSubtle / primaryText |
| sidebar-border / ring | border / focus |
| radius | radiusControl（6px） |

基色、状态文字、primary-hover 等变量已由 tokens-values.css 提供，无须在应用重写 HEX。destructive-foreground 使用当前主题 primaryForeground：浅色为白，深色为深底色。

## Tailwind v4 参考映射

把所需项合并到既有 @theme inline，不复制出第二套竞争定义：

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-success-text: var(--success-text);
  --color-warning-text: var(--warning-text);
  --color-destructive-text: var(--destructive-text);
  --color-primary-text: var(--primary-text);
  --color-brand-navy: var(--brand-navy);
  --color-brand-blue: var(--brand-blue);
  --color-brand-cyan: var(--brand-cyan);
  --radius-md: var(--radius-control);
  --radius-xl: var(--radius-card);
  --radius-2xl: var(--radius-dialog);
}
```

控件 rounded-md，卡片 rounded-xl，弹窗 rounded-2xl；原有 shadcn 其他尺寸公式按需求核对，不假设所有组件自动更新。字体通过 body { font-family: var(--font-sans) } 接入；Next.js 自托管字体可设置自有字体变量后使用 token 的中文回退序列。不要声明 --font-sans: var(--font-sans) 这种循环。

## 状态与 SVG

徽章底为状态基色 15% 混合 surface，文字使用当前主题 *Text；横幅用 5% 底、30% 边界、*Text 标题。颜色必须配文字 / 图标。类别色只用于图表系列，不作文字语义色。

SVG 的 fill / stroke 可以引用 CSS 变量；继承与主题作用域需正确，优先统一使用 style / CSS 类。此前“展示属性不支持 var()”的说明不准确，已更正。

[完整接入步骤](adoption.md) · [设计契约](../../DESIGN.md)
