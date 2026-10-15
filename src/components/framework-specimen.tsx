import '../pages/changelog.css'
import { useRef, useState } from 'react'
import { Info, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from './ui/button'
import { Tooltip } from './ui/tooltip'
import { Sheet } from './ui/sheet'
import { Breadcrumb } from './ui/breadcrumb'
import type { Translate } from '../lib/types'

export function FrameworkSpecimen({t}:{t:Translate}) {
  const [open,setOpen]=useState(false)
  const [collapsed,setCollapsed]=useState(false)
  const trigger=useRef<HTMLButtonElement>(null)
  return <section className="specimen"><h2>{t('导航与应用框架','Navigation & app shell')}</h2><p className="muted">{t('侧栏、焦点提示、抽屉和路径导航共享主题与键盘规则。','Sidebar controls, tooltips, drawers, and breadcrumbs share theme and keyboard rules.')}</p>
    <div className="shell-demo-actions">
      <Tooltip label={t('演示折叠控件，不修改实际侧栏偏好','Demo control; does not change the application sidebar')} side="top"><Button variant="secondary" aria-expanded={!collapsed} onClick={()=>setCollapsed(value=>!value)}>{collapsed?<PanelLeftOpen size={18}/>:<PanelLeftClose size={18}/>} {collapsed?t('展开示例','Expand example'):t('折叠示例','Collapse example')}</Button></Tooltip>
      <Tooltip label={t('悬停或键盘聚焦显示，Esc 关闭','Hover or focus to show; Escape closes')} side="top"><Button variant="ghost" size="icon" aria-label={t('查看提示示例','View tooltip example')}><Info size={20}/></Button></Tooltip>
      <Sheet open={open} onOpenChange={setOpen} title={t('抽屉示例','Sheet example')} description={t('独立浮层，可用于导航或检查详细信息。关闭后焦点返回触发按钮。','A modal surface for navigation or inspecting details. Closing restores focus to the trigger.')} closeLabel={t('关闭抽屉示例','Close sheet example')} restoreFocus={trigger} trigger={<Button ref={trigger} variant="secondary">{t('打开抽屉示例','Open sheet example')}</Button>}>
        <p>{t('Tab 与 Shift+Tab 在抽屉内移动，Esc 关闭。','Tab and Shift+Tab stay within the sheet; Escape closes it.')}</p>
        <div className="shell-demo-actions"><Button onClick={()=>setOpen(false)}>{t('完成示例','Finish example')}</Button></div>
      </Sheet>
    </div>
    <Breadcrumb label={t('面包屑示例','Breadcrumb example')} items={[{label:'IDRL',href:'#website'},{label:t('设计组件','Design components')}]}/>
    <p className="field-help">{collapsed?t('示例已折叠；实际侧栏通过页面顶部按钮控制。','Example collapsed. Use the header button to control the real sidebar.'):t('示例已展开；使用 Tab 体验各控件的焦点状态。','Example expanded. Use Tab to explore focus states.')}</p>
    <pre className="shell-usage-code"><code>{`<AppShell\n  config={appConfig}\n  active="experiments"\n  t={t}\n  breadcrumbs={breadcrumbs}\n  headerActions={<ProjectActions />}\n>\n  <Experiments />\n</AppShell>`}</code></pre>
  </section>
}
