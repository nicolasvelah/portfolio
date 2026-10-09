import { useCallback, useEffect, useRef, type FocusEvent } from 'react'
import { clamp, lerp, subscribe, type FrameState } from './frame'

interface Options {
  /** número de piezas en el track */
  n: number
  /** pausa por pieza: cada una reposa la mitad de su tramo (Selected work). Sin dwell: deslizamiento continuo. */
  dwell?: boolean
  /** recorrido del parallax interno de los [data-par], en px */
  parallax?: number
  /** se llama cada frame visible con el progreso suavizado 0..1 */
  onProgress?: (wp: number, s: FrameState) => void
}

/**
 * Track horizontal fijado: una sección alta con un contenedor sticky de 100svh;
 * el scroll vertical se traduce a translateX del track (handoff Paper City §3).
 */
export function usePinnedTrack<S extends HTMLElement, T extends HTMLElement>({ n, dwell = false, parallax = 140, onProgress }: Options) {
  const sectionRef = useRef<S>(null)
  const trackRef = useRef<T>(null)
  const items = useRef<HTMLElement[]>([])
  const progress = useRef(onProgress)
  progress.current = onProgress

  useEffect(() => {
    let wp = 0
    return subscribe((s) => {
      const sec = sectionRef.current
      const track = trackRef.current
      if (!sec || !track) return false
      const r = sec.getBoundingClientRect()
      if (r.bottom < -s.H || r.top > s.H * 2) return false
      const raw = clamp(-r.top / (r.height - s.H), 0, 1)
      let p = raw
      if (dwell && n > 1) {
        const seg = raw * (n - 1)
        const k = Math.min(Math.floor(seg), n - 2)
        const f = clamp((seg - k - 0.25) / 0.5, 0, 1)
        p = (k + f * f * (3 - 2 * f)) / (n - 1)
      }
      wp = lerp(wp, p, s.reduced ? 1 : 0.1)
      const max = Math.max(0, track.scrollWidth - s.W)
      track.style.transform = `translate3d(${-wp * max}px,0,0)`
      progress.current?.(wp, s)

      if (r.top < s.H && r.bottom > 0) {
        // Parallax interno según la distancia de cada pieza al centro del viewport
        if (!s.reduced) {
          track.querySelectorAll<HTMLElement>('[data-par]').forEach((el) => {
            const b = el.parentElement!.getBoundingClientRect()
            const off = (b.left + b.width / 2 - s.W / 2) / s.W
            el.style.transform = `translate3d(${off * Number(el.dataset.par || 0.5) * -parallax}px,${Math.sin(off * 3) * 10}px,0)`
          })
        }
        // En táctil no hay hover: la pieza centrada pasa a color
        if (!s.fine) {
          items.current.forEach((c) => {
            const b = c.getBoundingClientRect()
            c.classList.toggle('is-centered', Math.abs(b.left + b.width / 2 - s.W / 2) < s.W * 0.25)
          })
        }
      }
      return Math.abs(wp - p) > 0.0005
    })
  }, [n, dwell, parallax])

  /** Si el foco (Tab) entra a una pieza fuera de vista, lleva la página al punto donde esa pieza se ve. */
  const onFocusCapture = useCallback(
    (e: FocusEvent) => {
      const sec = sectionRef.current
      const track = trackRef.current
      const i = items.current.findIndex((c) => c?.contains(e.target as Node))
      if (!sec || !track || i < 0) return
      const H = window.innerHeight
      let frac: number
      if (dwell) frac = n > 1 ? i / (n - 1) : 0
      else {
        // Continuo: fracción en la que el centro de la pieza llega al centro del viewport
        const max = Math.max(1, track.scrollWidth - window.innerWidth)
        const el = items.current[i]
        frac = clamp((el.offsetLeft + el.offsetWidth / 2 - window.innerWidth / 2) / max, 0, 1)
      }
      const target = sec.offsetTop + frac * (sec.offsetHeight - H)
      // Frame siguiente para ganarle al scroll automático del foco; 'instant' ignora scroll-behavior: smooth
      requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - target) > 4) window.scrollTo({ top: target, behavior: 'instant' })
      })
    },
    [n, dwell],
  )

  const itemRef = (i: number) => (el: HTMLElement | null) => {
    if (el) items.current[i] = el
  }

  return { sectionRef, trackRef, itemRef, onFocusCapture }
}
