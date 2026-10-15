import { useId, type ComponentProps } from 'react'
import { cn } from '../../lib/utils'
import './choice.css'

export function Checkbox({ label, description, id, className, ...props }: Omit<ComponentProps<'input'>, 'type' | 'children'> & { label: string; description?: string }) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const describedBy = [props['aria-describedby'], description ? `${controlId}-description` : ''].filter(Boolean).join(' ') || undefined
  return <div className={cn('ui-choice', className)}>
    <input {...props} id={controlId} type="checkbox" aria-describedby={describedBy}/>
    <div><label htmlFor={controlId}>{label}</label>{description && <p id={`${controlId}-description`}>{description}</p>}</div>
  </div>
}

export function Switch({ checked, onCheckedChange, label, description, disabled = false, id }: {
  checked: boolean; onCheckedChange: (checked: boolean) => void; label: string; description?: string; disabled?: boolean; id?: string
}) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  return <div className="ui-choice ui-switch-row">
    <div><label htmlFor={controlId}>{label}</label>{description && <p id={`${controlId}-description`}>{description}</p>}</div>
    <button id={controlId} type="button" role="switch" aria-checked={checked} aria-label={label}
      aria-describedby={description ? `${controlId}-description` : undefined} disabled={disabled}
      className="ui-switch" onClick={() => onCheckedChange(!checked)}><span/></button>
  </div>
}
