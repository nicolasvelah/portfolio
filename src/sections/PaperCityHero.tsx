import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { site } from '../content'
import { asset, media } from '../lib/media'
import { clamp, subscribe } from '../lib/frame'
import { startCrowd } from '../hero/crowd'

// Edificios CSS del handoff: [flex, alto %, cúpula]. Proporciones exactas del prototipo.
type Building = [number, number, boolean]
const BACK: Building[] = [[1.2, 44, false], [0.8, 70, true], [1.4, 52, false], [0.7, 86, true], [1.1, 40, false], [1, 62, false], [0.9, 78, true], [1.3, 48, false], [0.8, 66, true]]
const MID: Building[] = [[1, 60, true], [1.5, 42, false], [0.8, 88, false], [1.2, 54, true], [1, 72, false], [1.4, 38, false], [0.9, 80, true], [1.1, 50, false]]
const FRONT: Building[] = [[1.3, 70, false], [0.9, 100, true], [1.6, 56, false], [1, 84, false], [1.2, 62, true], [0.8, 94, false], [1.5, 48, false]]

function Skyline({ buildings, color, gap, shadow }: { buildings: Building[]; color: string; gap: string; shadow: string }) {
  return (
    <div className="flex h-full items-end" style={{ gap }}>
      {buildings.map(([flex, hgt, dome], i) => (
        <div
          key={i}
          style={{ flex, height: `${hgt}%`, background: color, boxShadow: shadow, borderRadius: dome ? '999px 999px 0 0' : '28px 28px 0 0' }}
        />
      ))}
    </div>
  )
}

/** Capa con profundidad de parallax. El transform lo escribe el bucle compartido. */
function Layer({ d, className, style, children, register }: {
  d: number
  className: string
  style?: CSSProperties
  children?: ReactNode
  register: (el: HTMLElement | null, d: number) => void
}) {
  return (
    <div ref={(el) => register(el, d)} aria-hidden className={`absolute origin-bottom will-change-transform ${className}`} style={style}>
      {children}
    </div>
  )
}

export default function PaperCityHero() {
  const heroRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const layers = useRef(new Map<HTMLElement, number>())
  const [scans, setScans] = useState(true)
  const [crowdReady, setCrowdReady] = useState(false)

  const register = (el: HTMLElement | null, d: number) => {
    if (el) layers.current.set(el, d)
  }

  useEffect(() => {
    return subscribe((s) => {
      const hp = clamp(s.sy / s.H, 0, 1.2)
      if (hp >= 1.2) return false // hero fuera de pantalla: nada que escribir, el bucle puede dormir
      if (s.reduced) return false // sin parallax, deriva ni desplazamiento del texto
      layers.current.forEach((d, el) => {
        const drift = d > 0.2 && d < 0.4 ? Math.sin(s.t / 240 + d * 10) * 18 : 0
        el.style.transform = `translate3d(${-s.mx * d * 70 + drift}px,${hp * d * -140 - s.my * d * 26}px,0) scale(${1 + hp * d * 0.38})`
      })
      const t = textRef.current
      if (t) {
        t.style.transform = `translate3d(0,${-hp * s.H * 0.3}px,0)`
        t.style.opacity = String(clamp(1 - hp * 1.4, 0, 1))
      }
      return true // las nubes derivan mientras el hero está a la vista
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // La multitud nunca compite con el LCP (el H1): arranca cuando el navegador está libre
    let stop = () => {}
    const start = () => (stop = startCrowd(canvas, media(''), () => setCrowdReady(true)))
    const hasIdle = typeof window.requestIdleCallback === 'function'
    const id = hasIdle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 400)
    return () => {
      if (hasIdle) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
      stop()
    }
  }, [])

  // Los escaneos llenan todo su alto; se escalan para respetar la silueta del handoff
  const scanLayer = (file: string, size = 100): CSSProperties => ({
    backgroundImage: `url(${media(file)})`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: `auto ${size}%`,
    backgroundPosition: 'left bottom',
  })

  return (
    <header ref={heroRef} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-bg">
      {/* Detecta si los escaneos cargan; si no, queda el skyline CSS del handoff */}
      <img src={media('pc-back.webp')} alt="" hidden onError={() => setScans(false)} />

      <Layer register={register} d={0.08} className="right-[12%] top-[13%] max-sm:right-[6%] max-sm:top-[50%] aspect-square w-[clamp(150px,26vmin,320px)] rounded-full bg-accent-400 shadow-lg" />
      <Layer register={register} d={0.25} className="right-[30%] top-[22%] h-[clamp(34px,4vw,56px)] w-[clamp(120px,16vw,240px)] rounded-full bg-neutral-100 shadow-[0_8px_18px_rgb(46_43_37/0.14)]" />
      <Layer register={register} d={0.32} className="right-[4%] top-[34%] h-[clamp(28px,3vw,44px)] w-[clamp(90px,11vw,170px)] rounded-full bg-neutral-100 shadow-[0_8px_18px_rgb(46_43_37/0.14)]" />

      <Layer
        register={register}
        d={0.2}
        className="bottom-0 left-[-6%] right-[-6%] h-[58%]"
        style={scans ? scanLayer('pc-back.webp', 66) : undefined}
      >
        {!scans && <Skyline buildings={BACK} color="#ccdbb2" gap="1.2%" shadow="0 -6px 14px rgb(46 43 37 / .16)" />}
      </Layer>
      <Layer
        register={register}
        d={0.5}
        className="bottom-0 left-[-8%] right-[-8%] h-[40%]"
        style={scans ? scanLayer('pc-mid.webp', 88) : undefined}
      >
        {!scans && <Skyline buildings={MID} color="#ffc6a5" gap="1.6%" shadow="0 -8px 16px rgb(46 43 37 / .2)" />}
      </Layer>
      <Layer register={register} d={0.9} className="bottom-0 left-[-10%] right-[-10%] h-[24%]">
        <Skyline buildings={FRONT} color="#b2622d" gap="2%" shadow="0 -10px 18px rgb(46 43 37 / .26)" />
      </Layer>

      {/* Multitud entre el skyline frontal y la colina: la colina tapa el corte de los grabados */}
      <Layer register={register} d={1.1} className="inset-x-0 bottom-0 h-[34%]">
        <canvas
          ref={canvasRef}
          className={`h-full w-full touch-manipulation transition-opacity duration-1000 ${crowdReady ? 'opacity-100' : 'opacity-0'}`}
        />
      </Layer>
      {/* Colina + faldón: al subir con el scroll, el faldón tapa la base de las capas y empalma con el manifiesto (mismo sage-700) */}
      <Layer register={register} d={1.3} className="bottom-[-4%] left-[-12%] right-[-12%] h-[12%]">
        <div className="h-full bg-sage-700" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
        <div className="absolute inset-x-0 top-[calc(100%-1px)] h-[60svh] bg-sage-700" />
      </Layer>

      <div ref={textRef} className="gutter relative z-[5] max-w-[1200px] pt-[clamp(96px,16vh,170px)] will-change-transform">
        <p className="kicker intro-fade mb-[18px] text-sage-700" style={{ animationDelay: '650ms' }}>
          {site.hero.kicker}
        </p>
        <h1 className="m-0 text-balance font-display font-normal leading-[0.94] tracking-[-0.02em] text-[clamp(46px,8.6vw,148px)]">
          {site.hero.h1Lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span className={`intro-line ${i === 1 ? 'text-accent-600' : ''}`} style={{ animationDelay: `${150 + i * 110}ms` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className="intro-fade mt-6 max-w-[520px] text-pretty text-[clamp(16px,1.3vw,19px)] leading-normal" style={{ animationDelay: '770ms' }}>
          {site.hero.lede}
        </p>
        <div className="intro-fade mt-7 flex flex-wrap gap-2.5" style={{ animationDelay: '890ms' }}>
          {site.hero.ctas.map((c) =>
            c.variant === 'primary' ? (
              <a key={c.label} href={c.href} className="pill bg-accent text-ink hover:bg-accent-600 hover:text-neutral-100">
                {c.label}
              </a>
            ) : (
              <a key={c.label} href={asset(c.href)} download={c.download || undefined} className="pill bg-neutral-100 text-ink hover:bg-accent-200">
                {c.label}
              </a>
            ),
          )}
        </div>
      </div>
    </header>
  )
}
