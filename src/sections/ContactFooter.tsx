import { useState } from 'react'
import { site } from '../content'
import { Rich } from '../lib/Rich'
import { asset } from '../lib/media'

export default function ContactFooter() {
  const { contact, hero } = site
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  const links = [
    { label: 'CV ↓', href: asset(contact.cv), download: true },
    { label: 'LinkedIn', href: contact.linkedin },
    { label: 'GitHub', href: contact.github },
  ]

  return (
    <footer id="contact" className="gutter relative -mt-10 rounded-cap bg-ink pb-9 pt-[clamp(90px,16vh,180px)] text-bg">
      <h2 data-reveal className="m-0 max-w-[1100px] font-display font-normal leading-[0.95] text-[clamp(44px,8vw,132px)]">
        {contact.line}
      </h2>
      <div className="mt-10 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          aria-label={copied ? 'Email copied' : `Copy email address ${contact.email}`}
          className="rounded-full bg-accent px-[26px] py-4 font-display text-lg text-ink transition-colors hover:bg-accent-400"
        >
          {copied ? 'Copied ✓' : contact.email}
        </button>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            {...(l.download ? { download: true } : { target: '_blank', rel: 'noreferrer' })}
            className="rounded-full bg-neutral-900 px-[22px] py-4 font-semibold text-bg transition-colors hover:bg-neutral-800"
          >
            {l.label}
          </a>
        ))}
      </div>
      <div className="mt-[clamp(60px,12vh,120px)] flex flex-wrap justify-between gap-3 text-[13px] text-neutral-400">
        <span>{contact.locationLine}</span>
        <span>
          {hero.colophon.scene} <Rich text={hero.colophon.credit} />
        </span>
      </div>
    </footer>
  )
}
