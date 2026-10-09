import { useEffect, useRef } from 'react'
import { site } from '../content'
import { clamp, subscribe } from '../lib/frame'

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const words = useRef<HTMLSpanElement[]>([])
  const { text, highlight } = site.manifesto
  const hlStart = text.indexOf(highlight)

  // Palabras con su posición en el texto, para saber cuáles van resaltadas
  const tokens: { w: string; hl: boolean }[] = []
  let pos = 0
  for (const w of text.split(' ')) {
    const at = text.indexOf(w, pos)
    tokens.push({ w, hl: hlStart >= 0 && at >= hlStart && at < hlStart + highlight.length })
    pos = at + w.length
  }

  useEffect(() => {
    return subscribe((s) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.bottom < -s.H || r.top > s.H * 2) return
      const n = words.current.length
      const p = s.reduced ? 1 : clamp((s.H * 0.8 - r.top) / (r.height * 0.9), 0, 1)
      const c = p * n
      words.current.forEach((w, i) => {
        const v = clamp(c - i, 0, 1)
        w.style.opacity = String(0.14 + v * 0.86)
        w.style.transform = `translateY(${(1 - v) * 10}px)`
      })
    })
  }, [])

  return (
    <section ref={ref} aria-label="Manifesto" className="gutter bg-sage-700 py-[clamp(90px,18vh,200px)] text-sage-100">
      <p className="m-0 flex max-w-[1300px] flex-wrap gap-x-[0.26em] font-display leading-[1.08] tracking-[-0.015em] text-[clamp(30px,4.8vw,78px)]">
        <span className="sr-only">{text}</span>
        {tokens.map((t, i) => (
          <span
            key={i}
            aria-hidden
            ref={(el) => {
              if (el) words.current[i] = el
            }}
            className={`will-change-[opacity,transform] ${t.hl ? 'text-accent-300' : ''}`}
          >
            {t.w}
          </span>
        ))}
      </p>
    </section>
  )
}
