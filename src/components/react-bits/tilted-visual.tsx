// Adapted from React Bits TiltedCard pointer-to-rotation mapping.
// Source and license: README.md / LICENSE.md.
import { useEffect, useRef, type ReactNode } from 'react'

export function TiltedVisual({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = matchMedia('(hover: hover) and (pointer: fine)')
    const reset = () => {
      element.style.removeProperty('--tilt-x')
      element.style.removeProperty('--tilt-y')
      element.style.removeProperty('--tilt-scale')
      element.dataset.tilt = 'idle'
    }
    const move = (event: PointerEvent) => {
      if (preference.matches || !pointer.matches || event.pointerType !== 'mouse') return
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
      const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)
      element.style.setProperty('--tilt-x', `${-y * 10}deg`)
      element.style.setProperty('--tilt-y', `${x * 14}deg`)
      element.style.setProperty('--tilt-scale', '1.06')
      element.dataset.tilt = 'active'
    }
    reset()
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', reset)
    preference.addEventListener('change', reset)
    pointer.addEventListener('change', reset)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', reset)
      preference.removeEventListener('change', reset)
      pointer.removeEventListener('change', reset)
      reset()
    }
  }, [])
  return <div ref={ref} className="tilted-visual" data-motion="tilted-visual"><div className="tilted-visual-inner">{children}</div></div>
}
