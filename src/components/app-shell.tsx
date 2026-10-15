import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from './ui/button'
import { Tooltip } from './ui/tooltip'
import { Sheet } from './ui/sheet'
import { Breadcrumb, type BreadcrumbItem } from './ui/breadcrumb'
import type { AppShellConfig } from '../lib/app-shell-config'
import type { Translate } from '../lib/types'
import '../app-shell.css'
export const AppToolsContext = createContext<ReactNode>(null)
export type { AppShellConfig } from '../lib/app-shell-config'

function useMedia(query: string) {
  const [matches,setMatches]=useState(()=>typeof window!=='undefined'&&matchMedia(query).matches)
  useEffect(()=>{const media=matchMedia(query);const update=()=>setMatches(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[query])
  return matches
}
const preferenceKey=(id:string)=>`idrl-sidebar:${id}:collapsed`
function readCollapsed(id:string){try{return localStorage.getItem(preferenceKey(id))==='true'}catch{return false}}

export function AppShell({ t,active,children,config,breadcrumbs,headerActions }: {
  t:Translate; active:string; children:ReactNode; config:AppShellConfig; breadcrumbs?:BreadcrumbItem[]; headerActions?:ReactNode
}) {
  const tools=useContext(AppToolsContext)
  const mobile=useMedia('(max-width: 767px)')
  const desktop=useMedia('(min-width: 1024px)')
  const [saved,setSaved]=useState(()=>readCollapsed(config.id))
  const [tabletExpanded,setTabletExpanded]=useState(false)
  const [drawer,setDrawer]=useState(false)
  const toggleRef=useRef<HTMLButtonElement>(null)
  const sidebarId=useId()
  const collapsed=desktop?saved:!tabletExpanded
  const current=config.groups.flatMap(group=>group.items).find(item=>item.id===active)
  useEffect(()=>{setSaved(readCollapsed(config.id));setTabletExpanded(false)},[config.id])
  useEffect(()=>{if(!mobile)setDrawer(false)},[mobile])
  useEffect(()=>{setDrawer(false)},[active])
  function toggle(){
    if(!desktop){setTabletExpanded(value=>!value);return}
    const next=!saved;setSaved(next)
    try{localStorage.setItem(preferenceKey(config.id),String(next))}catch{/* Layout stays usable when storage is unavailable. */}
  }
  function navigation(rail:boolean){return <nav className="shell-navigation" aria-label={t('工作空间导航','Workspace navigation')}>
    {config.groups.map(group=><div className="shell-nav-group" key={group.id}>
      <p className={rail?'nav-label sr-only':'nav-label'}>{group.label}</p>
      {group.items.map(item=><Tooltip key={item.id} label={item.label} enabled={rail}>
        <a href={item.href} aria-label={item.label} aria-current={active===item.id?'page':undefined} onClick={()=>setDrawer(false)}>
          <item.icon size={19} aria-hidden="true"/><span className={rail?'sr-only':'shell-nav-label'}>{item.label}</span>
        </a>
      </Tooltip>)}
    </div>)}
  </nav>}
  return <div className="idrl-ui app-layout shell-layout" data-sidebar={mobile?'mobile':collapsed?'rail':'expanded'}>
    {!mobile && <aside className="sidebar shell-sidebar" id={sidebarId} aria-label={t('应用侧边栏','Application sidebar')}>
      <a className="sidebar-brand" href={config.homeHref} aria-label={config.name}>{collapsed?config.compactLogo:config.logo}</a>
      {!collapsed&&<div className="space-label"><div><strong>{config.name}</strong>{config.description&&<span>{config.description}</span>}</div></div>}
      {navigation(collapsed)}
      {!collapsed&&config.footer&&<div className="sidebar-foot">{config.footer}</div>}
    </aside>}
    <div className="app-body">
      <header className="app-topline shell-topline">
        <div className="shell-heading">
          {mobile?<Sheet open={drawer} onOpenChange={setDrawer} title={config.name} description={t('选择页面，或按 Esc 关闭导航。','Choose a page, or press Escape to close navigation.')} closeLabel={t('关闭导航','Close navigation')} restoreFocus={toggleRef} trigger={<Button ref={toggleRef} variant="ghost" size="icon" aria-label={t('打开导航','Open navigation')}><Menu size={20}/></Button>}>
            <a className="sheet-brand" href={config.homeHref} onClick={()=>setDrawer(false)} aria-label={t('返回官网','Back to website')}>{config.logo}</a>
            {navigation(false)}
          </Sheet>:<Tooltip label={collapsed?t('展开侧边栏','Expand sidebar'):t('折叠侧边栏','Collapse sidebar')} side="bottom">
            <Button ref={toggleRef} variant="ghost" size="icon" onClick={toggle} aria-label={collapsed?t('展开侧边栏','Expand sidebar'):t('折叠侧边栏','Collapse sidebar')} aria-expanded={!collapsed} aria-controls={sidebarId}>{collapsed?<PanelLeftOpen size={20}/>:<PanelLeftClose size={20}/>}</Button>
          </Tooltip>}
          <Breadcrumb label={t('页面路径','Page path')} items={breadcrumbs??[{label:config.name},{label:current?.label??active}]}/>
        </div>
        <div className="app-tools">{config.status}{headerActions}{tools}</div>
      </header>
      {children}
    </div>
  </div>
}
