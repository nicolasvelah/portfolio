import { lab } from '../content'
import { Rich } from '../lib/Rich'

// Fragmento real de et.sass (2015): el bucle que generaba las utilidades de espaciado.
const ET_SNIPPET = `$range-paddings-margins: 310
$interval-paddings-margins: 5

@for $i from 0 through $range-paddings-margins
  @if $i % $interval-paddings-margins == 0
    .pa-hor-#{$i}
      padding-left: 0px + $i
      padding-right: 0px + $i`

export default function Lab() {
  return (
    <section id="lab" aria-labelledby="lab-title" className="gutter bg-bg pb-[clamp(80px,14vh,160px)]">
      <div className="mb-[clamp(28px,5vh,52px)] flex flex-wrap items-end justify-between gap-4">
        <h2 id="lab-title" className="h2">
          {lab.title}
        </h2>
        <p className="max-w-[420px] text-pretty text-neutral-700">{lab.intro}</p>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(14px,2vw,24px)]">
        {lab.items.map((item) => (
          <li key={item.slug} data-reveal className="flex min-w-0 flex-col rounded-lg bg-surface p-[clamp(22px,3vw,36px)]">
            <div className="flex items-center justify-between gap-3">
              <span className="font-display text-xl text-accent-700">{item.year}</span>
              <span className="status">{item.status}</span>
            </div>
            <h3 className="mt-5 font-display text-[clamp(22px,2vw,30px)] font-normal leading-[1.05]">{item.title}</h3>
            <p className="mt-3 leading-relaxed">
              <Rich text={item.oneLiner} />
            </p>
            {item.slug === 'et-css' && (
              <pre aria-label="ET-CSS source excerpt, 2015" className="mt-5 overflow-x-auto rounded-md bg-ink p-4 font-mono text-[11px] leading-relaxed text-sage-200">
                {ET_SNIPPET}
              </pre>
            )}
            {item.slug === 'how-the-hero-was-made' && item.detail && (
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                <Rich text={item.detail} />
              </p>
            )}
            {item.scores && (
              <div className="mt-5">
                <dl className="grid grid-cols-4 gap-2 text-center">
                  {item.scores.items.map((sc) => (
                    <div key={sc.label} className="flex flex-col-reverse rounded-md bg-neutral-100 px-1 py-2.5">
                      <dt className="mt-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.06em] text-neutral-700">{sc.label}</dt>
                      <dd className="font-display text-[22px] leading-none text-sage-800">
                        {sc.mobile}
                        {sc.desktop !== sc.mobile && <span className="mt-1 block font-sans text-[10px] text-neutral-700">desktop {sc.desktop}</span>}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-xs text-neutral-700">{item.scores.note}</p>
              </div>
            )}
            {item.link && (
              <a
                href={item.link.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-fit items-center gap-1.5 font-semibold text-accent-700 underline decoration-accent-300 underline-offset-4 hover:text-accent-800"
              >
                {item.link.label} <span aria-hidden>↗</span>
              </a>
            )}
            <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
              {item.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
