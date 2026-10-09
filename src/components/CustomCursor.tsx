import { useEffect, useRef } from 'react'
import { lerp, subscribe } from '../lib/frame'

/**
 * Círculo terracota en multiply que sigue al puntero. Solo con (pointer: fine).
 * Un aro crema sin blend lo acompaña: invisible sobre papel, visible sobre secciones en tinta,
 * donde el multiply solo dejaría un punto casi negro.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    let cx = -100
    let cy = -100
    let big = 0
    const unsub = subscribe((s) => {
      const els = [dot.current, ring.current]
      if (!els[0] || !els[1]) return false
      if (!s.fine) {
        els.forEach((el) => (el!.style.display = 'none'))
        document.documentElement.classList.remove('has-cursor')
        return false
      }
      const k = s.reduced ? 1 : 0.22
      cx = lerp(cx, s.px, k)
      cy = lerp(cy, s.py, k)
      big = lerp(big, s.overTarget ? 1 : 0, s.reduced ? 1 : 0.15)
      const tf = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%) scale(${1 + big * 2.4})`
      els.forEach((el) => {
        el!.style.display = 'block'
        el!.style.transform = tf
      })
      return Math.abs(cx - s.px) > 0.3 || Math.abs(cy - s.py) > 0.3 || Math.abs(big - (s.overTarget ? 1 : 0)) > 0.01
    })
    return () => {
      unsub()
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-3.5 w-3.5 rounded-full bg-accent mix-blend-multiply will-change-transform"
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-3.5 w-3.5 rounded-full border border-bg/50 will-change-transform"
      />
    </>
  )
}
