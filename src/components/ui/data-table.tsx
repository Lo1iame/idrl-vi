import { useId, useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { Select } from './field'
import type { Translate } from '../../lib/types'
import './data-table.css'

export type DataColumn<T> = {
  id: string
  header: string
  cell: (row: T) => ReactNode
  sortValue?: (row: T) => string | number | null
  numeric?: boolean
}

/** Client-side table for small local collections. Pass the complete filtered data set. */
export function DataTable<T>({ rows, columns, rowKey, caption, empty, t }: {
  rows: readonly T[]
  columns: readonly DataColumn<T>[]
  rowKey: (row: T) => string
  caption: string
  empty: ReactNode
  t: Translate
}) {
  const id = useId()
  const [sort, setSort] = useState<{ id: string; descending: boolean } | null>(null)
  const [size, setSize] = useState(5)
  const [pagination, setPagination] = useState({ rows, page: 0 })
  // A new filtered collection starts at page one, including when records are added.
  if (pagination.rows !== rows) setPagination({ rows, page: 0 })
  const pageCount = Math.max(1, Math.ceil(rows.length / size))
  const page = pagination.rows === rows ? Math.min(pagination.page, pageCount - 1) : 0
  const sorted = useMemo(() => {
    const accessor = columns.find(column => column.id === sort?.id)?.sortValue
    if (!accessor || !sort) return rows
    return [...rows].sort((a, b) => {
      const left = accessor(a), right = accessor(b)
      // Missing measurements always follow measured values, in either direction.
      if (left === null) return right === null ? 0 : 1
      if (right === null) return -1
      const result = typeof left === 'number' && typeof right === 'number'
        ? left - right : String(left).localeCompare(String(right), 'zh-CN', { numeric: true })
      return sort.descending ? -result : result
    })
  }, [rows, columns, sort])
  function changeSort(columnId: string) {
    setSort(previous => ({ id: columnId, descending: previous?.id === columnId ? !previous.descending : false }))
    setPagination({ rows, page: 0 })
  }
  return <div className="data-table">
    <div className="table-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table><caption className="sr-only">{caption}</caption>
        <thead><tr>{columns.map(column => <th key={column.id} scope="col" className={column.numeric ? 'numeric' : undefined}
          aria-sort={column.sortValue ? sort?.id === column.id ? sort.descending ? 'descending' : 'ascending' : 'none' : undefined}>
          {column.sortValue ? <button type="button" className="table-sort" onClick={() => changeSort(column.id)}>{column.header}
            {sort?.id !== column.id ? <ArrowUpDown size={14}/> : sort.descending ? <ArrowDown size={14}/> : <ArrowUp size={14}/>}
          </button> : column.header || <span className="sr-only">{t('操作', 'Actions')}</span>}
        </th>)}</tr></thead>
        <tbody>{sorted.slice(page * size, (page + 1) * size).map(row => <tr key={rowKey(row)}>{columns.map(column =>
          <td key={column.id} className={column.numeric ? 'numeric' : undefined}>{column.cell(row)}</td>)}</tr>)}</tbody>
      </table>
    </div>
    {!rows.length && empty}
    <div className="data-table-pagination">
      <span role="status" aria-label={t('表格分页状态', 'Table pagination status')}>{rows.length ? t(`${page * size + 1}–${Math.min((page + 1) * size, rows.length)} / 共 ${rows.length} 条`, `${page * size + 1}–${Math.min((page + 1) * size, rows.length)} of ${rows.length} records`) : t('共 0 条', '0 records')}</span>
      <div className="data-table-size"><label htmlFor={id}>{t('每页', 'Rows per page')}</label><Select id={id} value={size} onChange={event => { setSize(Number(event.target.value)); setPagination({ rows, page: 0 }) }}>{[5, 10, 20].map(value => <option key={value} value={value}>{value}</option>)}</Select></div>
      <div className="data-table-pages">
        <Button variant="secondary" size="icon" aria-label={t('上一页', 'Previous page')} disabled={page === 0} onClick={() => setPagination({ rows, page: page - 1 })}><ChevronLeft size={16}/></Button>
        <span>{t(`第 ${page + 1} / ${pageCount} 页`, `Page ${page + 1} of ${pageCount}`)}</span>
        <Button variant="secondary" size="icon" aria-label={t('下一页', 'Next page')} disabled={page + 1 >= pageCount} onClick={() => setPagination({ rows, page: page + 1 })}><ChevronRight size={16}/></Button>
      </div>
    </div>
  </div>
}
