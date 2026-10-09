import { site } from '../content'
import { Rich } from '../lib/Rich'

export default function Experience() {
  const { experience, experienceBefore, education, certifications } = site
  return (
    <section id="experience" aria-labelledby="exp-title" className="gutter relative z-[2] -mt-10 rounded-cap bg-bg py-[clamp(80px,14vh,160px)]">
      <div className="mb-[clamp(28px,5vh,52px)] flex flex-wrap items-end justify-between gap-4">
        <h2 id="exp-title" className="h2">
          Experience
        </h2>
        <p className="max-w-[420px] text-pretty text-neutral-700">Teams led, processes rebuilt, products shipped. Twenty years, short version.</p>
      </div>

      <ol className="grid gap-[clamp(10px,1.4vw,16px)]">
        {experience.map((job) => (
          <li
            key={job.company}
            data-reveal
            className="grid gap-4 rounded-lg bg-neutral-100 p-[clamp(20px,2.6vw,36px)] shadow-sm md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1.5fr)] md:gap-8"
          >
            <p className="kicker pt-1.5 text-sage-700">{job.years}</p>
            <div>
              <h3 className="font-display text-[clamp(24px,2.4vw,34px)] font-normal leading-none">{job.company}</h3>
              <p className="mt-2 text-sm font-semibold text-neutral-700">{job.role}</p>
            </div>
            <ul className="space-y-2 leading-relaxed">
              {job.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span aria-hidden className="mt-[0.6em] h-2 w-2 flex-none rounded-full bg-accent" />
                  <span>
                    <Rich text={h} />
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li data-reveal className="grid gap-4 rounded-lg border-2 border-dashed border-neutral-300 p-[clamp(20px,2.6vw,36px)] md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8">
          <p className="kicker pt-1 text-sage-700">{experienceBefore.years}</p>
          <p className="leading-relaxed text-neutral-800">
            <Rich text={experienceBefore.line} />
          </p>
        </li>
      </ol>

      <div className="mt-[clamp(10px,1.4vw,16px)] grid gap-[clamp(10px,1.4vw,16px)] md:grid-cols-2">
        <div data-reveal className="rounded-lg bg-sage-700 p-[clamp(20px,2.6vw,36px)] text-sage-100">
          <p className="kicker text-sage-300">Education</p>
          <p className="mt-3 font-display text-[clamp(22px,2vw,30px)] leading-tight">{education.degree}</p>
          <p className="mt-2 text-sm">
            {education.school} · {education.years}
          </p>
          <p className="mt-1 text-sm text-sage-300">{education.note}</p>
        </div>
        <div data-reveal className="rounded-lg bg-surface p-[clamp(20px,2.6vw,36px)]">
          <p className="kicker text-sage-700">Certifications</p>
          <ul className="mt-3 space-y-2 text-sm">
            {certifications.map((c) => (
              <li key={c.name} className="flex justify-between gap-4 border-b border-neutral-300 pb-2 last:border-0">
                <span className="font-semibold">
                  <Rich text={c.name} />
                  {c.status !== 'Earned' && <span className="ml-2 font-normal text-neutral-700">({c.status.toLowerCase()})</span>}
                </span>
                <span className="tabular-nums text-neutral-700">{c.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
