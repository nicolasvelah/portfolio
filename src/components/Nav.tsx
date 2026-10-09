import { site } from '../content'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#craft', label: 'Craft' },
]

export default function Nav() {
  return (
    <nav aria-label="Main" className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-[clamp(18px,4vw,56px)] py-[clamp(14px,2vw,24px)]">
      <a href="#top" className="whitespace-nowrap rounded-full bg-neutral-100/80 px-4 py-2 font-display text-[clamp(18px,1.8vw,24px)] text-ink no-underline shadow-md backdrop-blur-[10px]">
        {site.name}
      </a>
      <div className="flex items-center gap-1.5 rounded-full bg-neutral-100/80 p-1.5 shadow-md backdrop-blur-[10px]">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="rounded-full px-2.5 py-2 text-sm sm:px-3.5 font-semibold text-ink transition-colors hover:bg-accent-200">
            {l.label}
          </a>
        ))}
        <a href="#contact" className="rounded-full bg-ink px-3 py-2 text-sm sm:px-4 font-semibold text-bg transition-colors hover:bg-accent-700">
          Contact
        </a>
      </div>
    </nav>
  )
}
