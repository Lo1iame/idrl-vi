import './breadcrumb.css'
import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'
export type BreadcrumbItem = { label: string; href?: string }
export function Breadcrumb({ items, label = 'Breadcrumb' }: { items: BreadcrumbItem[]; label?: string }) {
  return <nav className="ui-breadcrumb" aria-label={label}><ol>{items.map((item,index) => <Fragment key={`${index}-${item.label}`}>
    {index>0 && <li aria-hidden="true" className="breadcrumb-divider"><ChevronRight size={14}/></li>}
    <li>{index===items.length-1 ? <span aria-current="page">{item.label}</span> : item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}</li>
  </Fragment>)}</ol></nav>
}
