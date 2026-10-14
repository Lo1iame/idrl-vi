// Adapted from React Bits AnimatedContent. See README.md and LICENSE.md.
import { useEffect, useRef, type HTMLAttributes } from 'react'
import type { gsap as GSAP } from 'gsap'

type AnimatedContentProps = HTMLAttributes<HTMLDivElement> & {
  distance?: number
  delay?: number
  duration?: number
  initialOpacity?: number
}

export function AnimatedContent({ distance = 18, delay = 0, duration = .55, initialOpacity = 1, children, ...props }: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let disposed = false
    let cleanup = () => {}
    void import('gsap').then(({ gsap }) => {
      if (disposed) return
      const preference = matchMedia('(prefers-reduced-motion: reduce)')
      const mobile = matchMedia('(max-width: 767px)')
      let observer: IntersectionObserver | undefined
      let timeline: ReturnType<typeof GSAP.timeline> | undefined
      let entered = false
      const show = () => {
        observer?.disconnect()
        timeline?.kill()
        gsap.set(element, { clearProps: 'transform,opacity,willChange' })
        element.dataset.motionState = 'visible'
      }
      const enter = () => {
        if (entered) return
        entered = true
        observer?.disconnect()
        element.dataset.motionState = 'entering'
        timeline = gsap.timeline({ delay: mobile.matches ? 0 : delay, onComplete: show })
        timeline.to(element, { y: 0, opacity: 1, duration: mobile.matches ? Math.min(duration, .3) : duration, ease: 'power3.out' })
      }
      const configure = () => {
        show()
        entered = false
        if (preference.matches || element.contains(document.activeElement) || !('IntersectionObserver' in window)) return
        // Content stays readable before entry and without JavaScript; never hide focus targets.
        gsap.set(element, { y: mobile.matches ? Math.min(distance, 8) : distance, opacity: initialOpacity, willChange: 'transform,opacity' })
        element.dataset.motionState = 'pending'
        observer = new IntersectionObserver(entries => {
          if (entries.some(entry => entry.isIntersecting)) enter()
        }, { threshold: .08 })
        observer.observe(element)
      }
      configure()
      const onFocus = () => { entered = true; show() }
      // Preference changes clear both GSAP inline styles and pending scroll observers.
      preference.addEventListener('change', configure)
      element.addEventListener('focusin', onFocus)
      cleanup = () => {
        preference.removeEventListener('change', configure)
        element.removeEventListener('focusin', onFocus)
        show()
      }
    }).catch(() => { if (!disposed) element.dataset.motionState = 'visible' })
    return () => { disposed = true; cleanup() }
  }, [distance, delay, duration, initialOpacity])

  return <div ref={ref} data-motion="animated-content" {...props}>{children}</div>
}
