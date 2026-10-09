import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { parse } from 'yaml'

const TODO = /\s*\[TODO:[^\]]*\]/g

/** Quita las notas internas del contenido: campos `_privados` y marcadores [TODO: …]. */
function sanitize(value) {
  if (typeof value === 'string') return value.replace(TODO, '').trim()
  if (Array.isArray(value)) return value.map(sanitize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !k.startsWith('_'))
        .map(([k, v]) => [k, sanitize(v)]),
    )
  }
  return value
}

// content/**/*.md → { frontmatter, body } en tiempo de build (el parser YAML no llega al cliente).
// En producción, el contenido de content/v2 (md y json) se publica sin notas internas;
// en desarrollo se conservan para que los TODO se vean en la página.
function content(isBuild) {
  const isContent = (id) => id.includes('/content/v2/')
  return {
    name: 'content',
    enforce: 'pre',
    load(id) {
      if (!isBuild || !isContent(id) || !id.endsWith('.json')) return null
      return JSON.stringify(sanitize(JSON.parse(readFileSync(id, 'utf8'))))
    },
    transform(code, id) {
      if (!id.endsWith('.md')) return null
      const match = code.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
      let frontmatter = match ? parse(match[1]) : {}
      let body = match ? match[2] : code
      if (isBuild && isContent(id)) {
        frontmatter = sanitize(frontmatter)
        body = body.replace(TODO, '')
      }
      return { code: `export default ${JSON.stringify({ frontmatter, body })}`, map: null }
    },
  }
}

export default defineConfig(({ command }) => ({
  base: '/portfolio/',
  plugins: [content(command === 'build'), react()],
}))
