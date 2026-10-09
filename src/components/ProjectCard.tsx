import { forwardRef } from 'react'
import type { TrackProject } from '../content'
import { PhoneFrame, StackFrames, WideFrame } from './DeviceFrame'

const ProjectCard = forwardRef<HTMLElement, { p: TrackProject }>(function ProjectCard({ p }, ref) {
  return (
    <article
      ref={ref}
      data-hover
      aria-labelledby={`card-${p.slug}`}
      className={`grid h-[min(68svh,640px)] w-[min(86vw,1080px)] flex-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] auto-rows-[minmax(0,1fr)] overflow-hidden rounded-lg bg-surface shadow-lg duo`}
    >
      <div className="flex min-h-0 flex-col justify-between gap-3.5 p-[clamp(20px,3vw,44px)]">
        <div className="flex items-center justify-between gap-2.5">
          <span className="font-display text-xl text-accent-700">{p.num}</span>
          <span className="status">{p.status}</span>
        </div>
        <div>
          <h3 id={`card-${p.slug}`} className="mb-3 font-display font-normal leading-none text-[clamp(28px,3.4vw,54px)]">
            {p.title}
          </h3>
          <p className="m-0 max-w-[440px] text-pretty leading-[1.45] text-[clamp(15px,1.3vw,19px)]">{p.angle}</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold text-neutral-700 [@media(max-height:700px)]:hidden">{p.role}</span>
          <div className="flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative m-2.5 flex min-h-0 items-center justify-center overflow-hidden rounded-inset bg-accent-500">
        {p.media.kind === 'phones' && (
          <div className="flex h-full w-full items-center justify-center gap-[4%] px-[4%] py-[6%]">
            {p.media.shots.map((s) => (
              <PhoneFrame key={s.name} shot={s} />
            ))}
          </div>
        )}
        {p.media.kind === 'wide' && <WideFrame name={p.media.name} alt={p.media.alt} />}
        {p.media.kind === 'stack' && (
          <>
            <StackFrames shots={p.media.shots} />
            <p className="absolute bottom-2 left-0 right-0 text-center text-[11px] font-semibold text-accent-900">{p.media.note}</p>
          </>
        )}
      </div>
    </article>
  )
})

export default ProjectCard
