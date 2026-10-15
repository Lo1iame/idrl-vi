import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { DataTable, type DataColumn } from './ui/data-table'
import { Input, Select } from './ui/field'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import type { Translate } from '../lib/types'

const records = [
  { id: 'RUN-001', name: 'Representation baseline', method: 'Baseline', score: 92.4 },
  { id: 'RUN-002', name: 'Adaptive ablation', method: 'Adaptive', score: 94.8 },
  { id: 'RUN-003', name: 'Perturbation study', method: 'Robust', score: null },
  { id: 'RUN-004', name: 'Stress test', method: 'Robust', score: 93.1 },
  { id: 'RUN-005', name: 'Design pilot', method: 'Adaptive', score: 90.2 },
  { id: 'RUN-006', name: 'Seed comparison', method: 'Baseline', score: 89.6 },
  { id: 'RUN-007', name: 'Robustness sweep', method: 'Robust', score: 95.3 },
]

export function DataSpecimen({ t }: { t: Translate }) {
  const [query, setQuery] = useState('')
  const [method, setMethod] = useState('all')
  const rows = useMemo(() => records.filter(row => (method === 'all' || row.method === method) && `${row.id} ${row.name}`.toLowerCase().includes(query.trim().toLowerCase())), [query, method])
  const columns: DataColumn<typeof records[number]>[] = [
    { id: 'name', header: t('示例记录', 'Demo record'), sortValue: row => row.name, cell: row => <>{row.name}<span className="record-id">{row.id}</span></> },
    { id: 'method', header: t('方法', 'Method'), sortValue: row => row.method, cell: row => row.method },
    { id: 'score', header: t('得分', 'Score'), numeric: true, sortValue: row => row.score, cell: row => row.score?.toFixed(1) ?? <Badge tone="info">{t('待测量', 'Pending')}</Badge> },
  ]
  return <section className="specimen data-specimen" aria-label={t('数据表格示例', 'Data table example')}>
    <h2>{t('数据表格与筛选', 'Data tables & filters')}</h2>
    <p className="muted">{t('7 条独立示例数据。点击列标题排序；搜索和筛选会返回第一页，缺失得分始终排在末尾。', '7 independent demo records. Sort by column headers; filtering returns to page one. Missing scores always appear last.')}</p>
    <div className="table-controls">
      <Input aria-label={t('搜索表格示例', 'Search table example')} placeholder={t('搜索示例名称或编号', 'Search demo name or ID')} value={query} onChange={event => setQuery(event.target.value)}/>
      <Select aria-label={t('筛选示例方法', 'Filter demo method')} value={method} onChange={event => setMethod(event.target.value)}>
        <option value="all">{t('全部方法', 'All methods')}</option>{['Baseline', 'Adaptive', 'Robust'].map(value => <option key={value}>{value}</option>)}
      </Select>
    </div>
    <DataTable filterKey={JSON.stringify([query.trim().toLowerCase(),method])} rows={rows} columns={columns} rowKey={row => row.id} caption={t('组件表格演示，所有数据均为示例', 'Component table demo. All data is illustrative.')} t={t}
      empty={<div className="empty-state"><Search size={24}/><h3>{t('没有匹配的记录', 'No matching records')}</h3><Button variant="secondary" onClick={() => { setQuery(''); setMethod('all') }}>{t('重置筛选', 'Reset filters')}</Button></div>}/>
  </section>
}
