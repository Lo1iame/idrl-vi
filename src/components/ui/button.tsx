import './primitives.css'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/utils'
export const buttonVariants = cva('button', {
  variants: { variant: {default:'button-primary',secondary:'button-secondary',ghost:'button-ghost',destructive:'button-destructive'},size:{default:'',sm:'button-sm',icon:'button-icon'} },
  defaultVariants: {variant:'default',size:'default'},
})
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean; ref?: Ref<HTMLButtonElement> }
export function Button({className,variant,size,asChild=false,type='button',...props}:ButtonProps) {
  const Comp=asChild?Slot:'button'
  return <Comp {...(!asChild?{type}:{})} className={cn(buttonVariants({variant,size}),className)} {...props}/>
}
