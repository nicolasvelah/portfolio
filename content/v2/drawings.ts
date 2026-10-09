// Curaduría de ilustración personal (notes/diseño), firmada como "El Junta".
// Assets en public/media: d-<slug>@1x.webp / @2x.webp (npm run media).

export interface Drawing {
  slug: string
  title: string
  medium: string
  alt: string
  /** proporción ancho/alto del original, para reservar el espacio (CLS 0) */
  ratio: number
  /** rotación y desplazamiento vertical del "print" en la pared */
  tilt: number
  drop: number
  /** profundidad del parallax interno */
  par: number
}

export const drawings: Drawing[] = [
  {
    slug: 'cadaveres',
    title: 'Cadáveres',
    medium: 'Linocut',
    alt: 'Black-and-white linocut: a figure hanging upside down over a table, a cat, cards on the floor, and the word "Cadáveres" carved down the side.',
    ratio: 1352 / 1158,
    tilt: -2,
    drop: 10,
    par: 0.6,
  },
  {
    slug: 'lion-mask',
    title: 'Guardian lion',
    medium: 'Vector illustration',
    alt: 'A green guardian-lion mask with an orange mane and purple swirls, over a quote: "La verdadera inteligencia puede disipar todas las mentiras e ilusiones."',
    ratio: 681 / 951,
    tilt: 1.5,
    drop: -16,
    par: 1,
  },
  {
    slug: 'spotlight',
    title: 'The act',
    medium: 'Ink silhouette',
    alt: 'Ink silhouette: a spotlight on a stage, a hand lifting a top hat above a microphone stand.',
    ratio: 554 / 568,
    tilt: -1,
    drop: 22,
    par: 0.8,
  },
  {
    slug: 'poster-alertas',
    title: 'Canción que activa las alertas',
    medium: 'Poster series',
    alt: 'Purple poster: a child in a blue sweater walking a red toy dog up a slope.',
    ratio: 452 / 640,
    tilt: 2,
    drop: -6,
    par: 1.1,
  },
  {
    slug: 'andean-mask',
    title: 'Andean mask',
    medium: 'Vector illustration',
    alt: 'Andean-style mask with fangs, round eyes, red ear pendants and a long green tongue.',
    ratio: 824 / 640,
    tilt: -1.5,
    drop: 14,
    par: 0.7,
  },
  {
    slug: 'poster-doblar',
    title: 'Para doblar el cuerpo',
    medium: 'Poster series',
    alt: 'Purple poster: a horned devil hugging a giant anatomical heart.',
    ratio: 452 / 640,
    tilt: 1,
    drop: -14,
    par: 1,
  },
  {
    slug: 'poster-doblar-2',
    title: 'Para doblar el cuerpo II',
    medium: 'Poster series',
    alt: 'Poster: a hand and a green blade cutting across a yellow sun and a red shape.',
    ratio: 452 / 640,
    tilt: -2,
    drop: 8,
    par: 0.9,
  },
  {
    slug: 'wordmark',
    title: 'El Junta',
    medium: 'Hand lettering',
    alt: 'Hand-lettered wordmark "El Junta" in ragged brush strokes, with a hooded figure leaning on the final letter.',
    ratio: 700 / 418,
    tilt: 1.5,
    drop: -10,
    par: 0.5,
  },
]
