import { useState, useEffect } from 'react';
import site from '../../../content/site.json';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState('');

  // Actualiza el “activo” según el hash actual (al navegar por anclas)
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#home');
    onHashChange();
    //window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const linkBase =
    'block px-3 py-2 rounded-md text-sm font-medium transition-colors';
  const linkInactive =
    'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
  const linkActive =
    'text-white bg-nv-ink'; // usa tu color de marca (defínelo en tailwind.config)

  const NavLink = ({ href, children }) => (
    <a
      href={href}
      className={`${linkBase} ${hash === href ? linkActive : linkInactive}`}
      onClick={() => setOpen(false)}
    >
      {children}
    </a>
  );

  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <a href="#home" className="flex items-center gap-3">
            {/* Si tienes isotipo, colócalo aquí */}
            {/* <img src="/logo-chacana-solid.svg" alt="Nico Vela" className="h-7 w-7" /> */}
            <div className="flex flex-col leading-tight font-lekton">
              <span className="text-base font-semibold text-nv-ink">
                {site.name}
              </span>
              <span className="text-xs text-slate-500">
                {site.role}
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="#home">{site.menu.home}</NavLink>
            <NavLink href="#projects">{site.menu.projects}</NavLink>
            <NavLink href="#contact">{site.menu.contact}</NavLink>
          </nav>

          {/* Actions (opcional: links a redes) */}
          <div className="hidden md:flex items-center gap-2">
            {site.links?.github && (
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-nv-ink text-sm"
              >
                GitHub
              </a>
            )}
            {site.links?.linkedin && (
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-nv-ink text-sm"
              >
                LinkedIn
              </a>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-slate-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg
              className="h-6 w-6 text-slate-800"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              {open ? (
                <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth="2" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav (collapsible) */}
        {open && (
          <nav className="md:hidden pb-4 space-y-1">
            <NavLink href="#home">{site.menu.home}</NavLink>
            <NavLink href="#about">{site.menu.about}</NavLink>
            <NavLink href="#projects">{site.menu.projects}</NavLink>
            <NavLink href="#contact">{site.menu.contact}</NavLink>

            <div className="pt-2 flex gap-3">
              {site.links?.github && (
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-nv-ink text-sm"
                >
                  GitHub
                </a>
              )}
              {site.links?.linkedin && (
                <a
                  href={site.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-nv-ink text-sm"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
