import React, { useMemo, useState } from "react";
import site from "../../content/site.json";

/**
 * ContactPage (site.json-driven, English)
 * A clean contact page without a form. It pulls data from /content/site.json
 * (name, role, email, website, location, links.*) and renders quick actions
 * plus JSON-LD for SEO.
 *
 * Expected site.json (flexible – only the fields you have are required):
 * {
 *   "name": "Nicolás Vela",
 *   "role": "Full‑Stack Engineer · UI/UX",
 *   "email": "hola@nicolasvela.dev",
 *   "website": "https://nicolasvela.dev",
 *   "location": "Ecuador",
 *   "links": {
 *     "phone": "+593...",
 *     "github": "https://github.com/...",
 *     "linkedin": "https://www.linkedin.com/in/...",
 *     "instagram": "https://instagram.com/...",
 *     "x": "https://twitter.com/...",
 *     "twitter": "https://twitter.com/...",
 *     "youtube": "https://youtube.com/@...",
 *     "telegram": "https://t.me/...",
 *     "whatsapp": "https://wa.me/593...",
 *     "facebook": "https://facebook.com/...",
 *     "tiktok": "https://www.tiktok.com/@...",
 *     "threads": "https://www.threads.net/@...",
 *     "calendly": "https://calendly.com/..."
 *   }
 * }
 */
export default function ContactPage() {
  type Links = Partial<Record<
    | "phone" | "github" | "linkedin" | "instagram" | "x" | "twitter"
    | "youtube" | "telegram" | "whatsapp" | "facebook" | "tiktok" | "threads" | "calendly",
    string
  >>;

  const links: Links = (site as any)?.links || {};

  const profile = {
    name: (site as any)?.name || "Nicolás Vela",
    role: (site as any)?.stack || "Full‑Stack Engineer · UI/UX",
    email: (site as any)?.email || "hola@nicolasvela.dev",
    phone: links.phone,
    location: (site as any)?.location || "Ecuador",
    website: (site as any)?.website || "https://nicolasvelah.github.io/portfolio/",
  } as const;

  // Build socials from available links only
  const socials = useMemo(() => {
    const candidates: { label: string; href: string | undefined }[] = [
      { label: "GitHub", href: links.github },
      { label: "LinkedIn", href: links.linkedin },
      { label: "Instagram", href: links.instagram },
      { label: "X (Twitter)", href: links.x || links.twitter },
      { label: "YouTube", href: links.youtube },
      { label: "Telegram", href: links.telegram },
      { label: "WhatsApp", href: links.whatsapp },
      { label: "Facebook", href: links.facebook },
      { label: "TikTok", href: links.tiktok },
      { label: "Threads", href: links.threads },
    ];
    return candidates.filter(s => !!s.href) as { label: string; href: string }[];
  }, [links.github, links.linkedin, links.instagram, links.x, links.twitter, links.youtube, links.telegram, links.whatsapp, links.facebook, links.tiktok, links.threads]);

  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error("Clipboard error", e);
    }
  };

  const mailto = () => {
    const subject = encodeURIComponent("Contact from your portfolio");
    const body = encodeURIComponent("Hi Nico,\n\nI'm reaching out because…");
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const downloadVCard = () => {
    // minimal vCard 3.0
    const vcf = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.name}`,
      `TITLE:${profile.role}`,
      `EMAIL;TYPE=WORK:${profile.email}`,
      profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : "",
      profile.website ? `URL:${profile.website}` : "",
      `ADR;TYPE=WORK:;;${profile.location};;;;`,
      "END:VCARD",
    ].filter(Boolean).join("\n");

    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const calendlyHref = links.calendly;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-zinc-200">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            jobTitle: profile.role,
            email: `mailto:${profile.email}`,
            telephone: profile.phone || undefined,
            url: profile.website || undefined,
            address: { "@type": "PostalAddress", addressCountry: profile.location },
            sameAs: socials.map(s => s.href),
          }),
        }}
      />

      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Let’s connect</h1>
        <p className="mt-2 text-zinc-400">No forms. Just links. Ping me via your favorite network or email.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={mailto} className="rounded-2xl bg-zinc-800/70 px-4 py-2 text-sm hover:bg-zinc-700 transition">Open email</button>
          <button onClick={copyEmail} className="rounded-2xl bg-zinc-800/70 px-4 py-2 text-sm hover:bg-zinc-700 transition">{copied ? "Email copied ✓" : "Copy email"}</button>
          <button onClick={downloadVCard} className="rounded-2xl bg-zinc-800/70 px-4 py-2 text-sm hover:bg-zinc-700 transition">Add to contacts (.vcf)</button>
          {calendlyHref && (
            <a href={calendlyHref} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-zinc-800/70 px-4 py-2 text-sm hover:bg-zinc-700 transition">Book a call</a>
          )}
        </div>
      </section>

      {/* Basics */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard label="Name" value={profile.name} />
        <InfoCard label="Role" value={profile.role} />
        <InfoCard label="Email" value={profile.email} copyable onCopy={copyEmail} />
        {profile.phone && <InfoCard label="Phone" value={profile.phone} />}
        {profile.website && (<InfoCard label="Website" value={profile.website} href={profile.website} />)}
        <InfoCard label="Location" value={profile.location} />
      </section>

      {/* Socials */}
      <section>
        <h2 className="mb-3 text-lg font-medium text-zinc-300">Social</h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3 hover:border-zinc-700 hover:bg-zinc-900/70 transition"
              >
                <span className="text-sm text-zinc-200">{s.label}</span>
                <span className="text-xs text-zinc-400 group-hover:text-zinc-300">{shorten(s.href)}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function InfoCard({ label, value, href, copyable, onCopy }: { label: string; value: string; href?: string; copyable?: boolean; onCopy?: () => void }) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
      <div className="text-[11px] uppercase tracking-widest text-zinc-500">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-zinc-200 hover:underline">{value}</a>
        ) : (
          <span className="text-zinc-200">{value}</span>
        )}
        {copyable && (
          <button onClick={onCopy} className="ml-auto rounded-md bg-zinc-800/70 px-2 py-1 text-[11px] hover:bg-zinc-700 transition">Copy</button>
        )}
      </div>
    </div>
  );
}

function shorten(url: string) {
  try {
    const u = new URL(url);
    return `${u.hostname.replace("www.", "")}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}
