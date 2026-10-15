import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AppShell } from '../../src/components/app-shell'
import { idrlAppConfig } from '../../src/lib/app-navigation'
import '../../src/styles.css'
import '../../src/design-refresh.css'
const t=(zh:string,_en:string)=>zh
function Fixture(){
  const [id,setId]=useState('app-a')
  const config={...idrlAppConfig(t),id,name:id,description:'隔离测试'}
  return <AppShell config={config} t={t} active="workspace" headerActions={<button onClick={()=>setId(value=>value==='app-a'?'app-b':'app-a')}>切换测试应用</button>}><h1>独立配置</h1></AppShell>
}
createRoot(document.getElementById('root')!).render(<Fixture/> )
