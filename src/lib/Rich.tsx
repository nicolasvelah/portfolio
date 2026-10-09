import { Fragment } from 'react'

const TODO = /\[TODO:[^\]]*\]/g
const SHOW_TODOS = import.meta.env.DEV

/** Quita los marcadores [TODO: …] (producción) y espacios sobrantes. */
export function clean(text: string): string {
  return text.replace(TODO, '').replace(/\s{2,}/g, ' ').trim()
}

/** true si el texto no tiene nada publicable fuera de los TODO. */
export function isEmpty(text: string | undefined | null): boolean {
  return !text || clean(text) === ''
}

/**
 * Texto de contenido con **negritas** y marcadores [TODO: …].
 * En desarrollo los TODO se ven como una etiqueta discreta (hover = detalle);
 * en el build de producción desaparecen.
 */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[TODO:[^\]]*\]|\*\*[^*]+\*\*)/g).filter(Boolean)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[TODO:')) {
          if (!SHOW_TODOS) return null
          return (
            <span
              key={i}
              title={part.slice(7, -1).trim()}
              className="mx-1 inline-flex cursor-help items-center rounded-sm border border-dashed border-accent-400 bg-accent-100 px-1.5 align-middle font-mono text-[0.625rem] uppercase tracking-wider text-neutral-800"
            >
              todo
            </span>
          )
        }
        if (part.startsWith('**')) return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
