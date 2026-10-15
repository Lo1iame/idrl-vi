# IDRL 应用框架接入

2026-10-15，现行源码接入。完整入口见 [adoption.md](adoption.md)，能力边界见 [component-inventory.md](component-inventory.md)。提供源码和页面模板，当前在 Vite / React 应用验证；不表示已经发布 npm 包或经过所有 SSR 框架验证。

## 文件与依赖

- `src/components/app-shell.tsx`：应用骨架。
- `src/lib/app-shell-config.ts`：独立配置类型；`src/lib/app-navigation.tsx` 仅为本展示站配置工厂，默认接入快照不包含它。AppShell 必须显式接收 config，下游创建自己的配置。
- `src/app-shell.css`：导航、Tooltip、Sheet、Breadcrumb 及日志样式。
- `src/components/ui/{button,tooltip,sheet,breadcrumb}.tsx`：公共交互组件。
- 框架依赖 React、Lucide、Radix Dialog / Tooltip；Button 另用 Radix Slot、class-variance-authority 和项目 `cn` 工具。依赖版本以 package-lock.json 为准。
- 复制时带上品牌变量、字体与 Brand 组件及递归 CSS 依赖。公共入口为 src/ui.css；AppShell 自带 idrl-ui 排版范围，不依赖展示站 styles.css / design-refresh.css。宿主保留自己的文档 reset 与页面背景；详见接入指南。

## 配置与调用

```tsx
import { AppShell, type AppShellConfig } from '@/components/app-shell'
import { Brand } from '@/components/brand'
import { FlaskConical, History } from 'lucide-react'

const appConfig: AppShellConfig = {
  id: 'idrl-project-tools', // 稳定且独立，避免与其他应用共用偏好
  name: 'IDRL Workbench',
  logo: <Brand />,
  compactLogo: <Brand compact />,
  homeHref: '/about', // 替换为自己应用中真实存在的地址
  groups: [{
    id: 'research', label: '研究',
    items: [
      { id: 'experiments', label: '实验', href: '/experiments', icon: FlaskConical },
      { id: 'changelog', label: '更新日志', href: '/changelog', icon: History },
    ],
  }],
}

<AppShell
  config={appConfig}
  active="experiments"
  t={t}
  breadcrumbs={[{ label: '项目', href: '/projects' }, { label: '实验' }]}
  headerActions={<ProjectActions />}
>
  <Experiments />
</AppShell>
```

以上为接入形态，`t`、`ProjectActions`、`Experiments` 由下游应用提供；路径按真实路由调整。公共框架渲染标准链接，不要求调用方采用某个路由库；本演示仍用 hash 导航。`active` 必须匹配配置中的导航项 ID。

`description`、`status`、`footer` 为可选节点。全局主题 / 语言控件也可经 `AppToolsContext` 注入；顶部操作应自行选择适合手机的紧凑形式，避免放入过长按钮组。

## 响应式与焦点

| 视口 | 默认导航 | 偏好 |
| --- | --- | --- |
| ≥1024px | 240px 展开，可切换为 72px 图标轨道 | localStorage，按 appConfig.id 隔离 |
| 768–1023px | 图标轨道，可临时展开 | 当前组件状态，不写桌面偏好 |
| <768px | 顶部菜单按钮 + 模态抽屉 | 默认关闭，不写桌面偏好 |

- Tooltip 用于图标轨道名称，链接本身始终有 accessible name；Esc 可关闭提示。
- 手机抽屉约束焦点，支持 Esc 和遮罩关闭；正常关闭后焦点回到触发按钮。选择页面后关闭；跨到桌面解除模态状态和背景指针锁定。
- 存储不可用时仍可折叠，偏好只保留在当前组件状态中。
- 暂仅支持分组单层导航。不要用空链接模拟尚未实现的菜单。

## 组件与更新日志

- `Tooltip`：label、children（单个可接收 props / ref 的触发元素）、side、enabled。
- `Sheet`：受控 open / onOpenChange、title、description、closeLabel、trigger 和 children；可提供 restoreFocus 按钮 ref。
- `Breadcrumb`：items 中每项有 label 和可选 href；最后一项为当前页文本。
- 更新日志模板为 `src/pages/changelog.tsx`，接受 entries、repositoryUrl、config 和 t。数据类型 `Release` 位于 `src/lib/releases.ts`，条目含 version、ISO 日期、本地化标题、分类变更及可选 commit。
- 记录按最新在前维护；新增条目前核对 Git 提交，不虚构版本。下游传入自己的 entries / repositoryUrl；不得将其他产品动态写入本仓库的日志。
- 首批历史日志沿用 tokens 的 0.1.0 / 0.2.0 / 0.2.1；0.2.2 记录截至 f0d4b14 已提交的框架、控件、审计修复和 PPT v4。日志标签不等于 token 版本、独立组件包发布或 GitHub Release。

## 数据表格接入

`src/components/ui/data-table.tsx` 与同目录 CSS 可以连同 Button、field、utils、Translate 和品牌 tokens 复制到下游应用；React / Lucide 使用项目已有依赖。

```tsx
const columns: DataColumn<Experiment>[] = [
  { id: 'name', header: '名称', cell: row => row.name, sortValue: row => row.name },
  { id: 'score', header: '得分', cell: row => row.score ?? '—', sortValue: row => row.score, numeric: true },
]
// 搜索和业务筛选保留在页面层；useMemo 仅用于性能优化。
<DataTable rows={filteredRows} columns={columns} rowKey={row => row.id}
  filterKey={JSON.stringify([query, status])} caption="实验记录" t={t} empty={<p>没有匹配的记录</p>} />
```

这段代码展示接入形态，Experiment、filteredRows、query、status 和 t 由应用提供。每行 ID 必须唯一。表格自行管理排序和分页；行 ID 集合 / 顺序、filterKey、排序和每页条数变更会返回第一页。等价数组及相同行 ID 的数值更新保留页码；filterKey 应编码所有筛选条件，包括筛选变化后仍返回相同记录的情况。导出应使用 filteredRows 全集合，不从可见 DOM 抽取当前页。远程分页应另行实现服务端排序 / 筛选契约。

## 表单接入

```tsx
<FormField id="description" label="说明" required description="最多 160 字符" error={errors.description}>
  {field => <Textarea {...field} maxLength={160} value={description}
    onChange={event => setDescription(event.target.value)} />}
</FormField>
<Checkbox label="包含随机种子" checked={includeSeed}
  onChange={event => setIncludeSeed(event.target.checked)} />
<Switch label="附带方法说明" checked={showMethod} onCheckedChange={setShowMethod} />
```

调用方提供受控状态、校验与提交逻辑；FormField 的属性必须展开到原生控件。复制 field.tsx / field.css 与 choice.tsx / choice.css，并带上 utils 与 tokens。自定义 aria-describedby 时应合并字段提供的 ID。Switch 不产生原生表单字段，提交时从 checked 状态读取；需要 FormData 的选项可使用带 name 的 Checkbox。

## 验收命令

```sh
npm run build
npm test
```

`tests/app-shell.spec.ts` 使用独立配置夹具验证应用间偏好隔离，并覆盖导航断点、关闭 / 焦点、存储降级及日志的主题 / 语言 / 溢出。自动检查不替代完整屏幕阅读器和跨浏览器人工验收。
