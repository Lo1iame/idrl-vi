import { useEffect, useRef } from 'react'
import lightLogo from '../../assets/brand/logo/symbol-color.svg?raw'
import darkLogo from '../../assets/brand/logo/symbol-color-reverse.svg?raw'

// Wrap original paths to animate their positions without changing source geometry.
const pieces = (svg: string) => svg.replace(/<path\b[^>]*\/>/g, path => `<g class="brand-logo-piece">${path}</g>`)
const lightMarkup = pieces(lightLogo)
const darkMarkup = pieces(darkLogo)
const offsets = [[-95,90],[0,130],[-130,-35],[-35,-130],[120,45],[100,-100]]

export function BrandLogoMotion({ label, hint }: { label: string; hint: string }) {
  const ref = useRef<HTMLButtonElement>(null)
  const replay = useRef(() => {})
  useEffect(() => {
    const button = ref.current
    if (!button) return
    let disposed = false
    let cleanup = () => {}
    void import('gsap').then(({ gsap }) => {
      if (disposed) return
      const preference = matchMedia('(prefers-reduced-motion: reduce)')
      const mobile = matchMedia('(max-width: 767px)')
      const parts = Array.from(button.querySelectorAll('.brand-logo-piece'))
      let timeline: ReturnType<typeof gsap.timeline> | undefined
      const show = () => {
        timeline?.kill()
        gsap.set(parts, { clearProps: 'transform,opacity,willChange' })
        button.dataset.logoState = 'ready'
        button.setAttribute('aria-busy', 'false')
      }
      const play = () => {
        show()
        if (preference.matches) return
        button.dataset.logoState = 'assembling'
        button.setAttribute('aria-busy', 'true')
        button.dispatchEvent(new CustomEvent('idrl-logo-replay', { bubbles: true }))
        timeline = gsap.timeline({ onComplete: show })
        parts.forEach((part, index) => {
          const slot = index % 6
          const [x,y] = offsets[slot]
          const amplitude = mobile.matches ? .45 : 1
          timeline!.fromTo(part, { x: x * amplitude, y: y * amplitude, opacity: .08, willChange: 'transform,opacity' },
            { x: 0, y: 0, opacity: 1, duration: mobile.matches ? .5 : 1.15, ease: 'back.out(1.25)' }, slot * (mobile.matches ? .045 : .105))
        })
      }
      replay.current = play
      play()
      preference.addEventListener('change', show)
      cleanup = () => { preference.removeEventListener('change', show); replay.current = () => {}; show() }
    }).catch(() => { if (!disposed) button.dataset.logoState = 'ready' })
    return () => { disposed = true; cleanup() }
  }, [])
  return <div className="brand-logo-stage">
    <button ref={ref} type="button" className="brand-logo-replay" aria-label={label} onClick={() => replay.current()}>
      <span className="brand-theme-light" aria-hidden="true" dangerouslySetInnerHTML={{__html: lightMarkup}} />
      <span className="brand-theme-dark" aria-hidden="true" dangerouslySetInnerHTML={{__html: darkMarkup}} />
    </button>
    <span className="brand-logo-hint" aria-hidden="true">{hint}</span>
  </div>
}
