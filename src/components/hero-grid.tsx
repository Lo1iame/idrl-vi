import { useEffect, useRef } from 'react'

export function HeroGrid() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const grid = ref.current
    const hero = grid?.closest('.identity-hero')
    if (!grid || !hero) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = matchMedia('(hover: hover) and (pointer: fine)')
    const ring = grid.querySelector<HTMLElement>('.hero-grid-pulse')!
    let frame = 0
    let pulse: Animation | undefined
    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      grid.dataset.gridState = 'idle'
      pulse?.cancel()
    }
    const move = (event: Event) => {
      const p = event as PointerEvent
      if (preference.matches || !pointer.matches || p.pointerType !== 'mouse') return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = grid.getBoundingClientRect()
        grid.style.setProperty('--grid-x', `${p.clientX - rect.left}px`)
        grid.style.setProperty('--grid-y', `${p.clientY - rect.top}px`)
        grid.dataset.gridState = 'tracking'
        frame = 0
      })
    }
    const replay = (event: Event) => {
      if (preference.matches || !pointer.matches) return
      const button = event.target as HTMLElement
      const a = button.getBoundingClientRect()
      const b = grid.getBoundingClientRect()
      grid.style.setProperty('--pulse-x', `${a.left + a.width / 2 - b.left}px`)
      grid.style.setProperty('--pulse-y', `${a.top + a.height / 2 - b.top}px`)
      pulse?.cancel()
      pulse = ring.animate([
        { transform: 'scale(.15)', opacity: 0 },
        { opacity: .65, offset: .18 },
        { transform: 'scale(3.3)', opacity: 0 },
      ], { duration: 1700, easing: 'cubic-bezier(.15,.7,.25,1)' })
    }
    reset()
    hero.addEventListener('pointermove', move, { passive: true })
    hero.addEventListener('pointerleave', reset)
    hero.addEventListener('idrl-logo-replay', replay)
    preference.addEventListener('change', reset)
    pointer.addEventListener('change', reset)
    return () => {
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', reset)
      hero.removeEventListener('idrl-logo-replay', replay)
      preference.removeEventListener('change', reset)
      pointer.removeEventListener('change', reset)
      reset()
    }
  }, [])
  return <div ref={ref} className="hero-grid-response" aria-hidden="true" data-grid-state="idle">
    <div className="hero-grid-spotlight" />
    <div className="hero-grid-pulse" />
  </div>
}
