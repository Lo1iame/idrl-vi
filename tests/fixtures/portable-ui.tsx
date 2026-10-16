import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../../src/ui.css'
import { Brand } from '../../src/components/brand'
import { Button } from '../../src/components/ui/button'
import { Badge } from '../../src/components/ui/badge'
import { Dialog } from '../../src/components/ui/dialog'
import { FormField, Input } from '../../src/components/ui/field'
import { Checkbox, Switch } from '../../src/components/ui/choice'
import { DataTable } from '../../src/components/ui/data-table'
const t = (zh: string) => zh
function Fixture() {
  const [open,setOpen] = useState(false), [enabled,setEnabled] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  return <>
    <section id="host" aria-label="宿主原有内容"><h2>宿主标题</h2><p>原有段落</p><button>原有按钮</button><table><tbody><tr><td>原有单元格</td></tr></tbody></table></section>
    <main className="idrl-ui" style={{background:'var(--surface)'}} aria-label="独立 UI"><Brand/><Button ref={trigger} onClick={()=>setOpen(true)}>打开弹窗</Button><Button size="sm">小按钮</Button><Button size="icon" aria-label="图标按钮">+</Button><Badge tone="info">状态</Badge>
      <FormField label="独立输入">{props=><Input {...props}/>}</FormField>
      <Checkbox label="接收更新"/><Switch label="启用提示" checked={enabled} onCheckedChange={setEnabled}/>
      <DataTable rows={[{id:'one'},{id:'two'}]} rowKey={row=>row.id} columns={[{id:'id',header:'编号',cell:row=>row.id,sortValue:row=>row.id}]} caption="独立表格" t={t} empty={<p>暂无数据</p>}/>
      <Dialog open={open} onOpenChange={setOpen} title="独立弹窗" description="由公共样式提供排版。" returnFocusRef={trigger}><Button onClick={()=>setOpen(false)}>完成</Button></Dialog>
    </main>
  </>
}
createRoot(document.getElementById('root')!).render(<Fixture/> )
