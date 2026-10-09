// Un único requestAnimationFrame para toda la página (handoff: "One rAF loop drives everything").
// Cada sección se suscribe y escribe solo transform/opacity en sus refs: React nunca re-renderiza por scroll.
// El bucle se duerme cuando nada se mueve (scroll y puntero asentados, ningún suscriptor animando)
// y despierta con scroll, puntero o resize.

export interface FrameState {
  /** scroll suavizado (lerp .1; sin lerp con reduced-motion) */
  sy: number
  /** puntero normalizado −0.5..0.5, suavizado (lerp .06) */
  mx: number
  my: number
  /** puntero en px, sin suavizar (para el cursor) */
  px: number
  py: number
  /** el puntero está sobre a / button / [data-hover] */
  overTarget: boolean
  /** frames desde el inicio */
  t: number
  W: number
  H: number
  reduced: boolean
  fine: boolean
}

/** Devuelve true mientras siga animando por su cuenta (deriva, lerps propios sin asentar). */
type Sub = (s: FrameState) => boolean | void

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

const subs = new Set<Sub>()
let raf = 0
let started = false
let tx = 0
let ty = 0

const state: FrameState = {
  sy: typeof window === 'undefined' ? 0 : window.scrollY,
  mx: 0,
  my: 0,
  px: -100,
  py: -100,
  overTarget: false,
  t: 0,
  W: 0,
  H: 0,
  reduced: false,
  fine: false,
}

function onPointer(e: PointerEvent) {
  tx = e.clientX / window.innerWidth - 0.5
  ty = e.clientY / window.innerHeight - 0.5
  state.px = e.clientX
  state.py = e.clientY
  const el = e.target as Element | null
  state.overTarget = !!el?.closest?.('a, button, [data-hover], input, label')
  wake()
}

function tick() {
  raf = 0
  state.t += 1
  state.W = window.innerWidth
  state.H = window.innerHeight
  state.sy = lerp(state.sy, window.scrollY, state.reduced ? 1 : 0.1)
  state.mx = lerp(state.mx, tx, 0.06)
  state.my = lerp(state.my, ty, 0.06)
  let busy = false
  subs.forEach((fn) => {
    if (fn(state)) busy = true
  })
  const settled =
    Math.abs(window.scrollY - state.sy) < 0.1 && Math.abs(tx - state.mx) < 0.0005 && Math.abs(ty - state.my) < 0.0005
  if (busy || !settled) raf = requestAnimationFrame(tick)
}

function wake() {
  if (!raf && subs.size) raf = requestAnimationFrame(tick)
}

function start() {
  if (started) return
  started = true
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
  const fine = window.matchMedia('(pointer: fine)')
  state.reduced = rm.matches
  state.fine = fine.matches
  rm.addEventListener('change', (e) => ((state.reduced = e.matches), wake()))
  fine.addEventListener('change', (e) => ((state.fine = e.matches), wake()))
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('scroll', wake, { passive: true })
  window.addEventListener('resize', wake, { passive: true })
}

/** Suscribe una función al frame compartido. Devuelve la función para desuscribir. */
export function subscribe(fn: Sub): () => void {
  subs.add(fn)
  start()
  wake()
  return () => {
    subs.delete(fn)
  }
}

/** Fuerza al menos un frame (p. ej. tras cambiar algo que no es scroll ni puntero). */
export const requestFrame = wake
