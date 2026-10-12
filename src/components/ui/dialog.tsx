import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
export function Dialog({open,onOpenChange,title,description,children,returnFocusId}:{open:boolean;onOpenChange:(value:boolean)=>void;title:string;description:string;children:ReactNode;returnFocusId?:string}) {
 return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}><DialogPrimitive.Portal><DialogPrimitive.Overlay className="dialog-overlay"/><DialogPrimitive.Content className="dialog" onCloseAutoFocus={e=>{if(returnFocusId){e.preventDefault();document.getElementById(returnFocusId)?.focus()}}}><DialogPrimitive.Title className="dialog-title">{title}</DialogPrimitive.Title><DialogPrimitive.Description className="muted">{description}</DialogPrimitive.Description><DialogPrimitive.Close className="dialog-close button button-ghost button-icon" aria-label={document.documentElement.lang==='en'?'Close dialog':'关闭弹窗'}><X size={18}/></DialogPrimitive.Close>{children}</DialogPrimitive.Content></DialogPrimitive.Portal></DialogPrimitive.Root>
}
