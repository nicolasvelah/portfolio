import { useMemo, useState } from 'react'

// Recreación con datos de muestra del "Time Log" de AI-TimeTracker. Nada de esto es real.
interface Entry { id: number; desc: string; project: string; minutes: number }

const POOL: Omit<Entry, 'id'>[] = [
  { desc: 'Design review — tokens v2', project: 'Atlas', minutes: 90 },
  { desc: 'Pipeline: preview deploys', project: 'Atlas', minutes: 120 },
  { desc: 'Pairing on role guards', project: 'Harbor', minutes: 60 },
  { desc: 'Client discovery call', project: 'Juniper', minutes: 45 },
  { desc: 'Weekly planning', project: 'Internal', minutes: 30 },
  { desc: 'Accessibility pass on forms', project: 'Harbor', minutes: 75 },
  { desc: 'Code review', project: 'Atlas', minutes: 60 },
]
const DAY = 8 * 60
const WEEK = [
  { d: 'Mon', h: 8 },
  { d: 'Tue', h: 8 },
  { d: 'Wed', h: 7.5 },
  { d: 'Thu', h: null },
  { d: 'Fri', h: null },
]
const fmt = (m: number) => `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}`

export default function TimeLogDemo() {
  const [entries, setEntries] = useState<Entry[]>(() => POOL.slice(0, 3).map((e, i) => ({ ...e, id: i })))
  const [submitted, setSubmitted] = useState(false)
  const total = useMemo(() => entries.reduce((s, e) => s + e.minutes, 0), [entries])
  const remaining = Math.max(0, DAY - total)
  const full = remaining === 0

  const add = () => {
    const next = POOL[entries.length % POOL.length]
    const minutes = Math.min(next.minutes, remaining)
    if (minutes > 0) setEntries((es) => [...es, { ...next, minutes, id: Date.now() }])
  }
  const edit = (id: number, desc: string) => setEntries((es) => es.map((e) => (e.id === id ? { ...e, desc } : e)))
  const remove = (id: number) => {
    setSubmitted(false)
    setEntries((es) => es.filter((e) => e.id !== id))
  }

  return (
    <div className="p-4 text-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">Thursday · Time log</p>
        <p className={`font-mono text-xs ${full ? 'text-accent-700' : 'text-neutral-700'}`} aria-live="polite">
          {full ? '8h logged' : `${fmt(remaining)} remaining of 8h`}
        </p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200" aria-hidden>
        <div className="h-full rounded-full bg-ink transition-[width] duration-500 ease-out" style={{ width: `${(total / DAY) * 100}%` }} />
      </div>

      <ul className="mt-4 divide-y divide-neutral-300 border-y border-neutral-300">
        {entries.map((e) => (
          <li key={e.id} className="group flex items-center gap-3 py-2">
            <input
              value={e.desc}
              onChange={(ev) => edit(e.id, ev.target.value)}
              aria-label="Entry description"
              className="min-w-0 flex-1 rounded bg-transparent px-1 py-0.5 outline-none transition-colors hover:bg-neutral-200 focus:bg-neutral-200"
            />
            <span className="chip hidden !bg-neutral-200 sm:inline-flex">{e.project}</span>
            <span className="w-14 text-right font-mono text-xs text-neutral-800">{fmt(e.minutes)}</span>
            <button
              type="button"
              onClick={() => remove(e.id)}
              aria-label={`Remove ${e.desc}`}
              className="grid h-6 w-6 place-items-center rounded-full text-neutral-700 transition-colors hover:bg-accent-100 hover:text-accent-700"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={add}
        disabled={full}
        className="mt-2 font-mono text-xs text-neutral-800 transition-colors hover:text-accent-700 disabled:cursor-not-allowed disabled:text-neutral-500"
      >
        + Add another entry
      </button>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <ol className="flex gap-1.5" aria-label="This week">
          {WEEK.map((d) => {
            const h = d.d === 'Thu' ? total / 60 : d.h
            return (
              <li
                key={d.d}
                className={`flex w-11 flex-col items-center rounded-md border py-1 ${
                  d.d === 'Thu' ? 'border-ink bg-neutral-100' : 'border-neutral-300'
                }`}
              >
                <span className="font-mono text-[0.625rem] text-neutral-700">{d.d}</span>
                <span className="text-xs font-medium">{h === null ? '—' : `${+h.toFixed(1)}h`}</span>
              </li>
            )
          })}
        </ol>
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={!full || submitted}
          className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-bg transition-colors hover:bg-accent-600 disabled:bg-ink/20 disabled:text-neutral-700"
        >
          {submitted ? 'Submitted ✓' : 'Submit week'}
        </button>
      </div>
    </div>
  )
}
