// ServicesPage.en.tsx
import React, { useMemo, useState } from "react";
import servicesData from "../../content/services.en.json";
// Opcional: toma email/calendly desde site.json si lo usas
// import site from "../../content/site.json";

type Services = typeof servicesData;
type Service = Services["services"][number];

// Scroll suave SIN usar hash (evita conflicto con el router)
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ServicesPage() {
  const services = servicesData.services as Service[];
  const toc = useMemo(() => services.map((s) => ({ id: s.id, title: s.title })), [services]);

  const [copied, setCopied] = useState(false);

  // Si quieres leer esto desde site.json, descomenta la import y estas líneas:
  // const email = (site as any)?.email as string | undefined;
  // const calendly = (site as any)?.links?.calendly as string | undefined;

  const email = undefined;     // <- pon tu email o lee desde site.json
  const calendly = undefined;  // <- pon tu calendly o lee desde site.json

  const copyEmail = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 text-zinc-200">
      {/* SEO: OfferCatalog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: "Consulting & Design Services",
            itemListElement: services.map((s, i) => ({
              "@type": "OfferCatalog",
              position: i + 1,
              name: s.title,
              description: s.summary,
            })),
          }),
        }}
      />

      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
          <p className="mt-2 text-zinc-400 max-w-2xl">
            Architecture, integrations, cloud, frontend modernization, AI-assisted DevOps, and training.
          </p>
        </div>
        <div className="flex gap-2">
          {email && (
            <button
              onClick={copyEmail}
              className="rounded-2xl bg-zinc-800/70 px-4 py-2 text-sm hover:bg-zinc-700 transition"
            >
              {copied ? "Email copied ✓" : "Copy email"}
            </button>
          )}
          {calendly && (
            <a
              href={calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-zinc-800/70 px-4 py-2 text-sm hover:bg-zinc-700 transition"
            >
              Book a call
            </a>
          )}
        </div>
      </header>

      {/* TOC: una sola fila, con scroll horizontal; botones (no <a href="#...">) */}
      <nav className="mb-6 relative">
        <ul
          className="
            hide-scrollbar flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap
            px-1 py-1 rounded-xl border border-zinc-800/60 bg-zinc-900/40
          "
        >
          {toc.map((item) => (
            <li key={item.id} className="min-w-fit">
              <button
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="rounded-full border border-zinc-800/50 bg-zinc-800/30
                           px-3 py-1 text-xs text-zinc-300 hover:border-zinc-700 hover:bg-zinc-700/40 transition"
                aria-label={`Go to ${item.title}`}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>

        {/* Ocultar scrollbar en WebKit */}
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
        {/* Fades laterales (decorativo) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0b0f16] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0b0f16] to-transparent" />
      </nav>

      {/* Grid de servicios: 2 columnas en sm, 3 en xl; múltiples filas */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 scroll-mt-24"
          >
            <h2 className="text-xl font-medium text-zinc-100">{s.title}</h2>
            {s.tagline ? <p className="text-sm text-zinc-400 mt-1">{s.tagline}</p> : null}
            {s.summary ? <p className="text-sm text-zinc-300 mt-3">{s.summary}</p> : null}

            <div className="mt-4 grid gap-4">
              <Card title="Deliverables">
                <ul className="list-disc pl-5 text-sm text-zinc-300">
                  {s.deliverables?.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </Card>

              <Card title="Ideal for">
                <p className="text-sm text-zinc-300">{s.idealFor}</p>
                {s.tech?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.tech.slice(0, 8).map((t) => (
                      <span key={t} className="text-[11px] rounded-md bg-zinc-800/60 px-2 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Card>

              {s.outcomes?.length ? (
                <Card title="Expected outcomes">
                  <ul className="mt-2 list-disc pl-5 text-sm text-zinc-300">
                    {s.outcomes.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-xs text-zinc-500">
        Need a tailored blend of services? We can start with a small audit and expand from there.
      </p>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
      <div className="text-[11px] uppercase tracking-widest text-zinc-500">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
