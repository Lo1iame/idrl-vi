import * as Primitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode, RefObject } from 'react'
export function Sheet({ open, onOpenChange, title, description, children, closeLabel, trigger, restoreFocus }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; children: ReactNode; closeLabel: string; trigger: ReactNode; restoreFocus?: RefObject<HTMLButtonElement | null>
}) {
  return <Primitive.Root open={open} onOpenChange={onOpenChange}><Primitive.Trigger asChild>{trigger}</Primitive.Trigger><Primitive.Portal><Primitive.Overlay className="sheet-overlay"/><Primitive.Content className="ui-sheet" onCloseAutoFocus={event => {
    const target=restoreFocus?.current
    if(target && target.getClientRects().length){event.preventDefault();target.focus()}
  }}><div className="sheet-heading"><Primitive.Title>{title}</Primitive.Title><Primitive.Close className="button button-ghost button-icon" aria-label={closeLabel}><X size={19}/></Primitive.Close></div><Primitive.Description className="sheet-description">{description}</Primitive.Description>{children}</Primitive.Content></Primitive.Portal></Primitive.Root>
}
