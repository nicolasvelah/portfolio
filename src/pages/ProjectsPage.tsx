import projects from "../../content/projects.json";

type Project = (typeof projects)["projects"][number];

export default function ProjectsPage() {
  const groups = groupByCategory(projects.projects);
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 text-zinc-200">
      <h1 className="text-3xl font-semibold mb-6">Projects</h1>

      {Object.entries(groups).map(([cat, list]) => (
        <section key={cat} className="mb-10">
          <h2 className="text-xl font-medium mb-3 capitalize">{cat}</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {list.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

function getCover(p: Project): string | null {
  const anyP = p as any;
  return anyP?.cover ?? (Array.isArray(anyP?.images) ? anyP.images[0] : null) ?? null;
}

function ProjectCard({ p }: { p: Project }) {
  const cover = getCover(p);

  return (
    <li className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 overflow-hidden">
      {/* Cover si existe */}
      {cover ? (
        <figure className="mb-3 overflow-hidden rounded-lg aspect-[16/9] bg-zinc-800/60">
          <img
            src={cover}
            alt={`${p.title} cover`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={(e) => {
              // Si falla la URL, ocultamos la imagen para no romper el layout
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </figure>
      ) : null}

      <div className="text-sm text-zinc-400">
        {p.organization}
        {p.client ? ` · ${p.client}` : ""}
      </div>
      <h3 className="text-lg text-zinc-100 mt-1">{p.title}</h3>
      <div className="mt-1 text-xs text-zinc-500">
        {p.role?.join(" · ")}
        {p.period?.start
          ? ` · ${p.period.start}${
              p.period.ongoing ? " – present" : p.period.end ? ` – ${p.period.end}` : ""
            }`
          : ""}
      </div>
      <ul className="mt-3 list-disc pl-5 text-sm text-zinc-300">
        {p.highlights?.slice(0, 3).map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        {p.stack?.slice(0, 5).map((t) => (
          <span key={t} className="text-[11px] rounded-md bg-zinc-800/60 px-2 py-1">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-3 text-xs">
        {p.links?.site && (
          <a className="underline" href={p.links.site} target="_blank" rel="noreferrer">
            Site
          </a>
        )}
        {p.links?.repo && (
          <a className="underline" href={p.links.repo} target="_blank" rel="noreferrer">
            Repo
          </a>
        )}
        {p.links?.caseStudy && (
          <a className="underline" href={p.links.caseStudy} target="_blank" rel="noreferrer">
            Case study
          </a>
        )}
      </div>
    </li>
  );
}

function groupByCategory(list: Project[]) {
  return list.reduce((acc: Record<string, Project[]>, p) => {
    acc[p.category] ||= [];
    acc[p.category].push(p);
    return acc;
  }, {});
}
