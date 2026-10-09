import { media } from '../lib/media'

/** Grano de papel: tile estático de 220px (equivale al feTurbulence del prototipo, sin costo de filtro). */
export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.22] mix-blend-multiply"
      style={{ backgroundImage: `url(${media('grain.webp')})`, backgroundSize: '220px 220px' }}
    />
  )
}
