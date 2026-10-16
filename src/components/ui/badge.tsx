import './primitives.css'
import type { ReactNode } from 'react'
export type Tone='neutral'|'success'|'warning'|'danger'|'info'
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:Tone}) {return <span className={`badge badge-${tone}`}><span className="badge-dot"/>{children}</span>}
