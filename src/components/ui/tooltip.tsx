import * as Primitive from '@radix-ui/react-tooltip'
import type { ReactElement } from 'react'
export function Tooltip({ label, children, side = 'right', enabled = true }: { label: string; children: ReactElement; side?: 'top' | 'right' | 'bottom' | 'left'; enabled?: boolean }) {
  if (!enabled) return children
  return <Primitive.Provider delayDuration={250}><Primitive.Root><Primitive.Trigger asChild>{children}</Primitive.Trigger><Primitive.Portal><Primitive.Content className="ui-tooltip" side={side} sideOffset={8} collisionPadding={12}>{label}<Primitive.Arrow className="ui-tooltip-arrow" /></Primitive.Content></Primitive.Portal></Primitive.Root></Primitive.Provider>
}
