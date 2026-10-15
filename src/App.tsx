import { useEffect, useState } from 'react'
import { Sun, Moon, Languages } from 'lucide-react'
import { Button } from './components/ui/button'
import { Components } from './pages/components'
import { AppToolsContext } from './components/app-shell'
import { Workspace } from './pages/workspace'
import { Assistant } from './pages/assistant'
import { Website } from './pages/website'
import { Changelog } from './pages/changelog'
import { Foundation } from './pages/foundation'
import type { Translate } from './lib/types'
export type View='website'|'workspace'|'assistant'|'components'|'changelog'|'foundation'
const views:View[]=['website','workspace','assistant','components','changelog','foundation']
const readView=():View=>views.includes(location.hash.slice(1) as View)?location.hash.slice(1) as View:'website'
function readPreference(key:string,fallback:string){try{return localStorage.getItem(key)||fallback}catch{return fallback}}
export default function App(){
 const [view,setView]=useState(readView),[theme,setTheme]=useState(()=>readPreference('idrl-theme','light')),[lang,setLang]=useState(()=>readPreference('idrl-lang','zh'))
 const t:Translate=(zh,en)=>lang==='zh'?zh:en
 useEffect(()=>{const update=()=>setView(readView());window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update)},[])
 useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.lang=lang==='zh'?'zh-CN':'en';try{localStorage.setItem('idrl-theme',theme);localStorage.setItem('idrl-lang',lang)}catch{}},[theme,lang])
 useEffect(()=>{document.title=`IDRL · ${t('品牌界面示例','Brand interface examples')}`},[lang])
 useEffect(()=>{window.scrollTo(0,0)},[view])
 return <AppToolsContext.Provider value={<div className="review-tools"><Button variant="ghost" size="icon" aria-label={t('切换语言','Switch language')} onClick={()=>setLang(lang==='zh'?'en':'zh')}><Languages size={17}/></Button><Button variant="ghost" size="icon" aria-label={theme==='light'?t('切换深色主题','Switch to dark theme'):t('切换浅色主题','Switch to light theme')} onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?<Moon size={17}/>:<Sun size={17}/>}</Button></div>}><a href="#main" className="skip-link" onClick={e=>{e.preventDefault();document.getElementById('main')?.focus();document.getElementById('main')?.scrollIntoView()}}>{t('跳至主要内容','Skip to content')}</a>
 <main id="main" tabIndex={-1}>{view==='website'?<Website t={t}/>:view==='workspace'?<Workspace t={t}/>:view==='assistant'?<Assistant t={t}/>:view==='changelog'?<Changelog t={t}/>:view==='foundation'?<Foundation t={t}/>:<Components t={t}/>}</main></AppToolsContext.Provider>
}
