import { useRef } from 'react'
import { projects } from '../content'
import { usePinnedTrack } from '../lib/usePinnedTrack'
import ProjectCard from '../components/ProjectCard'

const pad = (n: number) => String(n).padStart(2, '0')

export default function WorkTrack() {
  const countRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const n = projects.length

  const { sectionRef, trackRef, itemRef, onFocusCapture } = usePinnedTrack<HTMLElement, HTMLDivElement>({
    n,
    dwell: true,
    onProgress: (wp) => {
      if (countRef.current) countRef.current.textContent = pad(Math.round(wp * (n - 1)) + 1)
      if (barRef.current) barRef.current.style.transform = `scaleX(${wp})`
    },
  })

  return (
    <section ref={sectionRef} id="work" aria-labelledby="work-title" className="relative bg-bg" style={{ height: `${120 + n * 80}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-[clamp(18px,3vh,32px)] [overflow:clip]">
        <div className="gutter flex items-end justify-between gap-5">
          <h2 id="work-title" className="h2 m-0">
            Selected work
          </h2>
          <div className="flex items-center gap-3.5 text-sm font-bold" aria-hidden>
            <span ref={countRef} className="font-display text-[22px] tabular-nums">
              01
            </span>
            <div className="h-2 w-[clamp(70px,12vw,180px)] overflow-hidden rounded-full bg-neutral-300">
              <div ref={barRef} className="h-full origin-left scale-x-0 rounded-full bg-accent" />
            </div>
            <span>{pad(n)}</span>
          </div>
        </div>
        <div ref={trackRef} onFocusCapture={onFocusCapture} className="gutter flex w-max gap-[clamp(18px,3vw,48px)] will-change-transform">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} p={p} ref={itemRef(i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
