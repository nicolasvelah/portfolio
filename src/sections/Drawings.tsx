import { useEffect, useRef } from 'react'
import { drawings } from '../../content/v2/drawings'
import { media } from '../lib/media'
import { usePinnedTrack } from '../lib/usePinnedTrack'

const pad = (n: number) => String(n).padStart(2, '0')

/** Galería de noche: los dibujos cuelgan en una pared de tinta y se recorren con el scroll. */
export default function Drawings() {
  const countRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const n = drawings.length

  const { sectionRef, trackRef, itemRef, onFocusCapture } = usePinnedTrack<HTMLElement, HTMLUListElement>({
    n,
    parallax: 24,
    onProgress: (wp) => {
      if (countRef.current) countRef.current.textContent = pad(Math.round(wp * (n - 1)) + 1)
      if (barRef.current) barRef.current.style.transform = `scaleX(${wp})`
    },
  })

  // Alto de la sección = recorrido horizontal real + un viewport: el scroll avanza 1:1 con la pared
  useEffect(() => {
    const sec = sectionRef.current
    const track = trackRef.current
    if (!sec || !track) return
    const fit = () => {
      const travel = Math.max(0, track.scrollWidth - window.innerWidth)
      sec.style.height = `${travel + window.innerHeight * 1.15}px`
    }
    const ro = new ResizeObserver(fit)
    ro.observe(track)
    window.addEventListener('resize', fit)
    fit()
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [sectionRef, trackRef])

  return (
    <section
      ref={sectionRef}
      id="drawings"
      aria-labelledby="drawings-title"
      className="relative z-[1] -mt-10 rounded-cap bg-ink text-bg"
      style={{ height: '300vh' }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-[clamp(20px,4vh,44px)] pb-4 pt-[clamp(72px,11vh,104px)] [overflow:clip]">
        {/* Luz de galería desde arriba */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgb(246_160_107/0.16),transparent_70%)]" />

        <div className="gutter relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="kicker text-accent-300">Off the clock</p>
            <h2 id="drawings-title" className="h2 mt-3">
              Drawings & prints
            </h2>
            <p className="mt-3 max-w-[460px] text-pretty text-neutral-400">
              Linocut, ink and vector, signed El Junta. Where the composition I learned with scissors still lives.
            </p>
          </div>
          <div className="flex items-center gap-3.5 text-sm font-bold text-neutral-400" aria-hidden>
            <span ref={countRef} className="font-display text-[22px] tabular-nums text-bg">
              01
            </span>
            <div className="h-2 w-[clamp(70px,12vw,180px)] overflow-hidden rounded-full bg-neutral-800">
              <div ref={barRef} className="h-full origin-left scale-x-0 rounded-full bg-accent-300" />
            </div>
            <span>{pad(n)}</span>
          </div>
        </div>

        <ul
          ref={trackRef}
          onFocusCapture={onFocusCapture}
          aria-label="Drawings gallery"
          className="gutter relative flex w-max items-center gap-[clamp(28px,5vw,88px)] py-6 will-change-transform"
        >
          {drawings.map((d, i) => {
            const h = 'clamp(200px, 44svh, 440px)'
            // Ancho explícito por proporción: un bloque con width:auto ignora aspect-ratio y se estiraría al pie de foto
            const w = `calc(${h} * ${d.ratio.toFixed(4)})`
            return (
              <li key={d.slug} ref={itemRef(i)} className="flex-none" style={{ transform: `rotate(${d.tilt}deg) translateY(${d.drop}px)` }}>
                <figure
                  data-hover
                  tabIndex={0}
                  aria-label={`${d.title}, ${d.medium.toLowerCase()}`}
                  className="duo group relative m-0 w-min rounded-[6px] bg-neutral-100 p-[clamp(8px,1vw,14px)] pb-0 shadow-frame transition-transform duration-500 ease-paper hover:-translate-y-1.5 focus-visible:-translate-y-1.5"
                >
                  {/* Cinta de papel */}
                  <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-3deg] bg-accent-200/70 shadow-sm" />
                  <div className="overflow-hidden rounded-[3px] bg-neutral-200" style={{ height: h, width: w }}>
                    <div data-par={d.par} className="h-full w-full scale-[1.12] will-change-transform">
                      <img
                        src={media(`d-${d.slug}@1x.webp`)}
                        srcSet={`${media(`d-${d.slug}@1x.webp`)} 1x, ${media(`d-${d.slug}@2x.webp`)} 2x`}
                        alt={d.alt}
                        loading="lazy"
                        decoding="async"
                        className="block h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 py-[clamp(10px,1.4vh,16px)] text-ink">
                    <span className="font-display text-[clamp(15px,1.3vw,19px)] leading-tight">{d.title}</span>
                    <span className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-700">{d.medium}</span>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
