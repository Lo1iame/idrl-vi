import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { DataTable } from '../../src/components/ui/data-table'
import '../../src/ui.css'
const initial = Array.from({length:12},(_,index)=>({id:`row-${index+1}`,score:index+1}))
function Fixture() {
  const [records,setRecords]=useState(initial),[filter,setFilter]=useState('all'),[dark,setDark]=useState(false)
  // Deliberately allocate equivalent arrays and objects on every parent render.
  const rows=records.filter(row=>filter!=='none' || row.score<0).map(row=>({...row}))
  return <main className="idrl-ui">
    <button onClick={()=>{setDark(!dark);document.documentElement.dataset.theme=dark?'light':'dark'}}>切换主题</button>
    <button onClick={()=>setRecords(records.map(row=>({...row,score:row.score+100})))}>更新数值</button>
    <button onClick={()=>setRecords([...records,{id:`added-${records.length}`,score:99}])}>新增记录</button>
    <button onClick={()=>setRecords(records.slice(1))}>删除记录</button>
    <button onClick={()=>setRecords([...records].reverse())}>重排记录</button>
    <label htmlFor="filter">筛选</label><select id="filter" value={filter} onChange={event=>setFilter(event.target.value)}><option value="all">全部</option><option value="equivalent">等价筛选</option><option value="none">无匹配</option></select>
    <DataTable rows={rows} filterKey={filter} rowKey={row=>row.id} columns={[{id:'id',header:'记录',cell:row=>row.id},{id:'score',header:'数值',cell:row=>row.score,sortValue:row=>row.score}]} caption="分页语义表格" empty={<p>没有记录</p>} t={zh=>zh}/>
  </main>
}
createRoot(document.getElementById('root')!).render(<Fixture/> )
