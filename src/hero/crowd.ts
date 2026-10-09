// Multitud en linograbado caminando sobre la colina del hero (canvas 2D, un sprite atlas).
// Las capas de papel son DOM; aquí solo viven los personajes. Pausa fuera de pantalla,
// cuadro fijo con prefers-reduced-motion, y tocar a alguien lo hace saltar.

type Frame = [x: number, y: number, w: number, h: number]

interface Walker {
  frame: Frame
  x: number
  dir: 1 | -1
  speed: number
  depth: number // 0 = atrás, 1 = adelante
  phase: number
  jumpY: number
  jumpV: number
}

const GRAVITY = 2200

/** Fracción del alto del canvas donde "pisan" los personajes (el resto lo tapa la colina). */
const BASELINE = 0.9

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export function startCrowd(canvas: HTMLCanvasElement, base: string, onReady: () => void): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let disposed = false
  let raf = 0
  let visible = true
  let running = false
  let w = 0
  let h = 0
  let last = 0
  let frames: Frame[] = []
  let atlas: HTMLImageElement | null = null
  let walkers: Walker[] = []

  const figureHeight = () => Math.max(70, Math.min(h * 0.44, 132))

  const spawn = (initial: boolean): Walker => {
    const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
    const depth = Math.random()
    const frame = frames[Math.floor(Math.random() * frames.length)]
    const fw = (frame[2] / frame[3]) * figureHeight()
    return {
      frame,
      dir,
      depth,
      speed: 24 + depth * 34 + Math.random() * 10,
      x: initial ? Math.random() * (w + fw) - fw / 2 : dir === 1 ? -fw - Math.random() * 120 : w + Math.random() * 120,
      phase: Math.random() * Math.PI * 2,
      jumpY: 0,
      jumpV: 0,
    }
  }

  const populate = () => {
    if (!frames.length) return
    const target = Math.max(5, Math.min(20, Math.round(w / 78)))
    while (walkers.length < target) walkers.push(spawn(true))
    walkers.length = target
    walkers.sort((a, b) => a.depth - b.depth)
  }

  const box = (p: Walker) => {
    const scale = 0.76 + p.depth * 0.3
    const fh = figureHeight() * scale
    const fw = (p.frame[2] / p.frame[3]) * fh
    const bob = Math.abs(Math.sin(p.phase)) * 3 * scale
    // Los de atrás pisan un poco más arriba: profundidad sobre la colina
    const y = h * BASELINE - fh - (1 - p.depth) * h * 0.08 - bob - p.jumpY + fh * 0.08
    return { x: p.x, y, fw, fh }
  }

  const draw = () => {
    ctx.clearRect(0, 0, w, h)
    if (!atlas) return
    for (const p of walkers) {
      const { x, y, fw, fh } = box(p)
      ctx.save()
      ctx.translate(x + fw / 2, y + fh)
      ctx.rotate(Math.sin(p.phase) * 0.025)
      if (p.dir === -1) ctx.scale(-1, 1)
      ctx.drawImage(atlas, p.frame[0], p.frame[1], p.frame[2], p.frame[3], -fw / 2, -fh, fw, fh)
      ctx.restore()
    }
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    populate()
    if (!running) draw()
  }

  const step = (dt: number) => {
    for (let i = 0; i < walkers.length; i++) {
      const p = walkers[i]
      p.x += p.dir * p.speed * dt
      p.phase += dt * (p.speed / 9)
      if (p.jumpV !== 0 || p.jumpY > 0) {
        p.jumpV -= GRAVITY * dt
        p.jumpY = Math.max(0, p.jumpY + p.jumpV * dt)
        if (p.jumpY === 0) p.jumpV = 0
      }
      const { fw } = box(p)
      if ((p.dir === 1 && p.x > w + 20) || (p.dir === -1 && p.x < -fw - 20)) {
        walkers[i] = spawn(false)
        walkers.sort((a, b) => a.depth - b.depth)
      }
    }
  }

  const loop = (now: number) => {
    step(Math.min((now - last) / 1000, 0.05))
    last = now
    draw()
    raf = requestAnimationFrame(loop)
  }
  const play = () => {
    if (reduced || running || disposed || !visible || document.hidden || !frames.length) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(loop)
  }
  const pause = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  const hit = (ev: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    const px = ev.clientX - r.left
    const py = ev.clientY - r.top
    for (let i = walkers.length - 1; i >= 0; i--) {
      const b = box(walkers[i])
      if (px >= b.x && px <= b.x + b.fw && py >= b.y && py <= b.y + b.fh) return walkers[i]
    }
    return null
  }
  const onDown = (ev: PointerEvent) => {
    if (reduced) return
    const p = hit(ev)
    if (p && p.jumpY === 0) p.jumpV = 520 + p.depth * 160
  }
  const onMove = (ev: PointerEvent) => {
    if (!reduced) canvas.toggleAttribute('data-hover', !!hit(ev))
  }

  const ro = new ResizeObserver(resize)
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible) play()
    else pause()
  })
  const onVisibility = () => (document.hidden ? pause() : play())
  ro.observe(canvas)
  io.observe(canvas)
  document.addEventListener('visibilitychange', onVisibility)
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)

  Promise.all([
    loadImage(`${base}crowd-atlas.webp`),
    fetch(`${base}crowd-atlas.json`).then((r) => r.json() as Promise<{ frames: Frame[] }>),
  ])
    .then(([img, meta]) => {
      if (disposed) return
      atlas = img
      frames = meta.frames
      resize()
      onReady()
      play()
    })
    .catch(() => onReady())

  return () => {
    disposed = true
    pause()
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointermove', onMove)
  }
}
