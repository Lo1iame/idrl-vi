import { createContext, useContext, type ReactNode } from 'react'
export const AppToolsContext = createContext<ReactNode>(null)
import { ChevronRight, FlaskConical, PanelsTopLeft, Sparkles } from 'lucide-react'
import { Brand } from './brand'
import { Badge } from './ui/badge'
import type { Translate } from '../lib/types'
export function AppShell({t,active,children}:{t:Translate;active:'workspace'|'assistant'|'components';children:ReactNode}) {
 const tools=useContext(AppToolsContext)
 const title=active==='workspace'?t('实验工作台','Experiments'):active==='assistant'?t('研究助手','Research assistant'):t('设计组件','Design components')
 return <div className="app-layout"><aside className="sidebar"><a className="sidebar-brand" href="#website"><Brand/></a><div className="space-label"><span className="space-avatar">I</span><div><strong>IDRL Research</strong><span>{t('团队空间 · 演示','Team space · Demo')}</span></div></div><p className="nav-label">{t('工作空间','WORKSPACE')}</p><nav aria-label={t('工作空间导航','Workspace navigation')}><a href="#workspace" aria-current={active==='workspace'?'page':undefined}><FlaskConical size={18}/>{t('实验工作台','Experiments')}</a><a href="#assistant" aria-current={active==='assistant'?'page':undefined}><Sparkles size={18}/>{t('研究助手','Research assistant')}</a><a href="#components" aria-current={active==='components'?'page':undefined}><PanelsTopLeft size={18}/>{t('设计组件','Design components')}</a></nav><div className="sidebar-foot"><span className="mini-status"/>{t('本地演示环境','Local demo environment')}<p>{t('数据为示例，无外部服务连接。','Sample data. No external services.')}</p></div></aside><div className="app-body"><div className="app-topline"><span>IDRL Research <ChevronRight size={13}/> {title}</span><div className="app-tools"><Badge tone="info">{t('示例空间','Demo space')}</Badge>{tools}</div></div><nav className="mobile-app-nav" aria-label={t('应用页面','Application pages')}>{[['website',t('官网','Website')],['workspace',t('工作台','Workspace')],['assistant',t('研究助手','Assistant')],['components',t('设计组件','Components')]].map(([id,label])=><a key={id} href={`#${id}`} aria-current={active===id?'page':undefined}>{label}</a>)}</nav>{children}</div></div>
}
