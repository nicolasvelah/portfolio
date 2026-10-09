// Genera public/cv.pdf desde .claude/docs/cv.md con la tipografía y paleta del sitio.
// Uso: npm run cv   (requiere Google Chrome instalado)
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { marked } from 'marked'

const root = resolve(import.meta.dirname, '..')
const md = readFileSync(join(root, '.claude/docs/cv.md'), 'utf8')
const fonts = join(root, 'public/fonts')
const out = join(root, 'public/cv.pdf')

const CHROME = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p))
if (!CHROME) throw new Error('Chrome no encontrado: define CHROME=/ruta/al/binario')

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Nicolás Vela — CV</title>
<style>
@font-face{font-family:Caprasimo;src:url('file://${fonts}/caprasimo-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:Figtree;font-weight:400;src:url('file://${fonts}/figtree-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:Figtree;font-weight:600;src:url('file://${fonts}/figtree-latin-600-normal.woff2') format('woff2')}
@font-face{font-family:Figtree;font-weight:700;src:url('file://${fonts}/figtree-latin-700-normal.woff2') format('woff2')}
@page{size:A4;margin:13mm 15mm 14mm}
*{box-sizing:border-box}
body{margin:0;font:400 9.1pt/1.45 Figtree,system-ui,sans-serif;color:#201e1d;-webkit-print-color-adjust:exact;print-color-adjust:exact}
a{color:#8c491a;text-decoration:none}
h1{font:400 30pt/1 Caprasimo,serif;margin:0 0 4pt;letter-spacing:-.01em}
h1+p{margin:0;font-weight:700;color:#b2622d;font-size:11pt}
h1+p+p{margin:2pt 0 0;color:#645c50}
h1+p+p+p,h1+p+p+p+p{margin:2pt 0 0;color:#645c50}
hr{border:0;border-top:1.5pt solid #c67139;margin:10pt 0 6pt}
h2{font:400 13.5pt/1.1 Caprasimo,serif;color:#56633f;margin:11pt 0 5pt;break-after:avoid}
h3{font:700 10.4pt/1.3 Figtree;margin:11pt 0 1pt;break-after:avoid}
h3+p em{color:#82796a;font-style:normal;font-weight:600;font-size:8.8pt;letter-spacing:.04em;text-transform:uppercase}
h3+p{margin:0 0 4pt;break-after:avoid}
p{margin:0 0 6pt}
ul{margin:2pt 0 6pt;padding-left:12pt}
li{margin:0 0 2pt}
li::marker{color:#c67139}
strong{font-weight:700}
table{width:100%;border-collapse:collapse;margin:4pt 0 8pt;font-size:8.9pt;break-inside:auto}
th{text-align:left;font-weight:700;color:#56633f;border-bottom:1pt solid #ccdbb2;padding:3pt 6pt 3pt 0}
td{vertical-align:top;border-bottom:.5pt solid #eee7db;padding:3.5pt 6pt 3.5pt 0}
tr{break-inside:avoid}
td:first-child{white-space:nowrap;color:#474238;width:1%}
</style></head><body>${marked.parse(md, { breaks: true })}</body></html>`

const dir = mkdtempSync(join(tmpdir(), 'cv-'))
const file = join(dir, 'cv.html')
writeFileSync(file, html)
// Chrome headless escribe el PDF pero a veces no termina solo: esperamos a que el archivo
// exista y deje de crecer, y entonces lo cerramos.
rmSync(out, { force: true })
const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--allow-file-access-from-files',
  `--user-data-dir=${join(dir, 'profile')}`,
  `--print-to-pdf=${out}`,
  `file://${file}`,
], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let last = -1
for (let i = 0; i < 120; i++) {
  await sleep(250)
  const size = existsSync(out) ? statSync(out).size : -1
  if (size > 0 && size === last) break
  last = size
}
chrome.kill()
if (!existsSync(out)) throw new Error('Chrome no generó el PDF')
console.log(`✓ ${out} (${Math.round(statSync(out).size / 1024)} KB)`)
