// Assets web ya redactados (generados con `npm run media` desde notes/curated).
// El contenido de content/v2 apunta a los originales sin redactar; el sitio solo usa estos.
export const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`

export const asset = (path: string) =>
  path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('#')
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
