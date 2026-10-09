import type { PhoneShot, StackShot } from '../content'
import { media } from '../lib/media'

const srcSet = (name: string, w1: number, w2: number) =>
  `${media(`w-${name}@1x.webp`)} ${w1}w, ${media(`w-${name}@2x.webp`)} ${w2}w`

/** Teléfono: marco 9:18, radio 20, borde de 5px en tinta. El wrapper recibe el parallax interno. */
export function PhoneFrame({ shot }: { shot: PhoneShot }) {
  return (
    <div data-par={shot.par} className="w-[28%] max-h-full will-change-transform">
      <div
        className="relative aspect-[9/18] overflow-hidden rounded-[20px] border-[5px] border-ink bg-ink shadow-frame"
        style={{ transform: shot.tf }}
      >
        <img
          src={media(`w-${shot.name}@1x.webp`)}
          srcSet={srcSet(shot.name, 300, 414)}
          sizes="(min-width: 1080px) 160px, 22vw"
          alt={shot.alt}
          loading="lazy"
          decoding="async"
          width={300}
          height={600}
          className="block h-full w-full object-cover object-top"
        />
      </div>
    </div>
  )
}

/** Composición superpuesta: pantallas anchas apiladas, cada una con su rotación y profundidad. */
export function StackFrames({ shots }: { shots: StackShot[] }) {
  return (
    <div className="relative h-full w-full">
      {shots.map((s) => (
        <div key={s.name} data-par={s.par} className="absolute will-change-transform" style={s.pos}>
          <div className="overflow-hidden rounded-md bg-ink shadow-frame" style={{ transform: s.tf }}>
            <img
              src={media(`w-${s.name}@1x.webp`)}
              srcSet={`${media(`w-${s.name}@1x.webp`)} 1x, ${media(`w-${s.name}@2x.webp`)} 2x`}
              alt={s.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Pantalla ancha: 92% × 84%, rotada −2°. */
export function WideFrame({ name, alt }: { name: string; alt: string }) {
  return (
    <div data-par={0.5} className="h-[84%] w-[92%] will-change-transform">
      <div className="h-full w-full -rotate-2 overflow-hidden rounded-md bg-ink shadow-frame">
        <img
          src={media(`w-${name}@1x.webp`)}
          srcSet={srcSet(name, 800, 1440)}
          sizes="(min-width: 1080px) 520px, 80vw"
          alt={alt}
          loading="lazy"
          decoding="async"
          width={800}
          height={500}
          className="block h-full w-full object-cover object-left-top"
        />
      </div>
    </div>
  )
}
