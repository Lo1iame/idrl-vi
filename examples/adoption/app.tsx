import { useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { AppShell, type AppShellConfig } from '../../src/components/app-shell'
import { Brand } from '../../src/components/brand'
import { Button } from '../../src/components/ui/button'
import { FormField, Input } from '../../src/components/ui/field'
import { Badge } from '../../src/components/ui/badge'
import type { Translate } from '../../src/lib/types'

const t: Translate = (zh) => zh
const config: AppShellConfig = {
  id: 'idrl-adoption-example', name: 'IDRL Tools', homeHref: '#projects',
  logo: <Brand/>, compactLogo: <Brand compact/>,
  groups: [{id:'tools', label:'工具', items:[{id:'projects',label:'项目',href:'#projects',icon:FlaskConical}]}],
}

export function AdoptionExample() {
  const [name,setName] = useState('')
  const [message,setMessage] = useState('')
  const [dark,setDark] = useState(false)
  return <AppShell config={config} active="projects" t={t} headerActions={<Button variant="ghost" onClick={()=>{
    const next=!dark; setDark(next); document.documentElement.dataset.theme=next?'dark':'light'
  }}>{dark?'浅色':'深色'}</Button>}>
    <main id="main" style={{padding:24,maxWidth:800}}>
      <h1>项目</h1><p className="muted">接入验证示例，不连接业务服务。</p>
      <form style={{display:'grid',gap:24,marginTop:24}} onSubmit={event=>{event.preventDefault();setMessage(`预览名称：${name}`)}}>
        <FormField label="名称" required>{field=><Input {...field} value={name} onChange={event=>setName(event.target.value)}/>}</FormField>
        <div><Button type="submit">预览</Button></div>
        <div role="status">{message&&<Badge tone="info">{message}</Badge>}</div>
      </form>
    </main>
  </AppShell>
}
