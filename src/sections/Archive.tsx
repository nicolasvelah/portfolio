import { archive, work, type ArchiveEntry } from '../content'
import { Rich, clean, isEmpty } from '../lib/Rich'

// El trabajo "más enviado" que no entra al track se lista aquí, con el mismo formato.
const shipped: ArchiveEntry[] = work.cards
  .filter((c) => c.slug !== 'aerialoop')
  .map((c) => ({ year: c.year, title: c.title, type: 'Web platform', status: c.status, oneLiner: c.oneLiner }))

export default function Archive() {
  // Más reciente primero; el orden se toma del primer año del rango ("2015 – 2018" → 2015)
  const entries = [...shipped, ...archive.entries].sort((a, b) => clean(b.year).localeCompare(clean(a.year)))
  return (
    <section id="archive" aria-labelledby="archive-title" className="bg-surface pb-[clamp(110px,18vh,200px)] pt-[clamp(80px,14vh,160px)]">
      <div className="gutter">
        <div className="mb-[clamp(28px,5vh,52px)] flex flex-wrap items-end justify-between gap-4">
          <h2 id="archive-title" className="h2">
            {archive.title}
          </h2>
          <p className="max-w-[420px] text-pretty text-neutral-700">{archive.intro}</p>
        </div>
        <ul className="overflow-hidden rounded-lg bg-neutral-100 shadow-sm">
          {entries.map((e) => (
            <li key={e.title} className="grid gap-1 border-b border-neutral-200 px-[clamp(18px,2.4vw,32px)] py-4 last:border-0 sm:grid-cols-[7rem_minmax(0,1fr)_10rem_6.5rem] sm:items-baseline sm:gap-6">
              <span className="font-display text-accent-700">{isEmpty(e.year) ? '—' : <Rich text={e.year} />}</span>
              <div>
                <p className="font-semibold">{e.title}</p>
                <p className="mt-0.5 text-sm text-neutral-700">
                  <Rich text={e.oneLiner} />
                </p>
              </div>
              <span className="text-sm text-neutral-700">{e.type}</span>
              <span className="sm:text-right">
                {isEmpty(e.status) ? (
                  <Rich text={e.status} />
                ) : (
                  <span className={clean(e.status) === 'Shipped' ? 'status' : 'chip'}>{clean(e.status)}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
