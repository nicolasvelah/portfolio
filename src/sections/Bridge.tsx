import { useEffect, useRef } from 'react'
import { site } from '../content'
import { clamp, subscribe } from '../lib/frame'

export default function Bridge() {
  const ref = useRef<HTMLElement>(null)
  const left = useRef<HTMLDivElement>(null)
  const right = useRef<HTMLDivElement>(null)
  const { bridgeCards, bridge } = site.skills
  // Las frases 2 y 3 del handoff eran placeholder: se usan las reales del contenido
  const lines = [bridge[0], bridge[1], bridge[2]]

  useEffect(() => {
    return subscribe((s) => {
      const el = ref.current
      if (!el || !left.current || !right.current) return
      if (s.reduced) {
        left.current.style.transform = right.current.style.transform = 'none'
        return
      }
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > s.H * 1.5) return
      const p = clamp((s.H - r.top) / (s.H * 0.85), 0, 1)
      const e = 1 - Math.pow(1 - p, 3)
      left.current.style.transform = `translate3d(${(1 - e) * -16}vw,${(1 - e) * 40}px,0) rotate(${(1 - e) * -5}deg)`
      right.current.style.transform = `translate3d(${(1 - e) * 16}vw,${(1 - e) * 40}px,0) rotate(${(1 - e) * 5}deg)`
    })
  }, [])

  return (
    <section ref={ref} id="craft" aria-labelledby="craft-title" className="gutter overflow-hidden bg-surface py-[clamp(80px,14vh,160px)]">
      <h2 id="craft-title" className="h2 mb-[clamp(36px,6vh,64px)]">
        Design <span className="text-accent-600">×</span> Engineering
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-stretch gap-[clamp(14px,2vw,24px)]">
        <div ref={left} className="rounded-lg bg-neutral-100 p-[clamp(22px,3vw,40px)] shadow-md will-change-transform">
          <h3 className="kicker mb-[18px] text-sage-700">Design</h3>
          <ul className="flex flex-col gap-2.5 font-display leading-[1.15] text-[clamp(20px,1.9vw,28px)]">
            {bridgeCards.design.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center gap-4 rounded-lg bg-accent p-[clamp(22px,3vw,40px)] text-ink">
          <h3 className="kicker">The bridge</h3>
          {lines.map((l) => (
            <p key={l} className="m-0 font-semibold leading-[1.4] text-[clamp(16px,1.35vw,20px)]">
              {l}
            </p>
          ))}
        </div>
        <div ref={right} className="rounded-lg bg-ink p-[clamp(22px,3vw,40px)] text-bg shadow-md will-change-transform">
          <h3 className="kicker mb-[18px] text-sage-300">Engineering</h3>
          <ul className="flex flex-col gap-2.5 font-display leading-[1.15] text-[clamp(20px,1.9vw,28px)]">
            {bridgeCards.engineering.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
      <div
        data-reveal
        className="mt-[clamp(14px,2vw,24px)] flex flex-wrap items-center gap-x-[22px] gap-y-2 rounded-lg bg-sage-200 px-7 py-4 text-[15px] font-semibold text-sage-900 sm:rounded-full"
      >
        <span className="font-display text-lg font-normal">{site.skills.aiNative.title}</span>
        {bridgeCards.aiTools.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </section>
  )
}
