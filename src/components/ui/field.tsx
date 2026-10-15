import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/utils'
import './field.css'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn('ui-input', className)} {...props} />
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn('ui-input', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn('ui-input ui-textarea', className)} {...props} />
}

type FieldControlProps = {
  id: string
  required: boolean
  'aria-invalid': boolean
  'aria-describedby': string | undefined
}

/** Spread the supplied attributes on a single native input, select or textarea. */
export function FormField({ id, label, required = false, description, error, children }: {
  id?: string
  label: string
  required?: boolean
  description?: ReactNode
  error?: string
  children: (props: FieldControlProps) => ReactNode
}) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const helpId = `${controlId}-help`, errorId = `${controlId}-error`
  const describedBy = [description ? helpId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
  return <div className="field-group">
    <label htmlFor={controlId}>{label}{required && <span aria-hidden="true" className="field-required"/>}</label>
    {children({ id: controlId, required, 'aria-invalid': !!error, 'aria-describedby': describedBy })}
    {description && <p id={helpId} className="field-help">{description}</p>}
    {error && <p id={errorId} className="field-error">{error}</p>}
  </div>
}
