// Inyecta el HTML renderizado en el servidor dentro de dist/index.html.
// Crawlers, previews de enlaces y herramientas de reclutamiento ven el texto completo sin ejecutar JS.
// Se ejecuta después de `vite build` y `vite build --ssr` (ver npm run build).
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const indexPath = join(root, 'dist/index.html')
const ssrDir = join(root, 'dist-ssr')

const { render } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)
const appHtml = render()
const template = readFileSync(indexPath, 'utf8')
if (!template.includes('<div id="root"></div>')) throw new Error('No encontré <div id="root"></div> en dist/index.html')

// Sin JS, los bloques con reveal deben verse igual
const noscript = '<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>'
const html = template
  .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  .replace('</head>', `    ${noscript}\n  </head>`)

writeFileSync(indexPath, html)
rmSync(ssrDir, { recursive: true, force: true })
console.log(`✓ prerender: ${Math.round(appHtml.length / 1024)} KB de HTML en dist/index.html`)
