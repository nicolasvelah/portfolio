// src/components/ui/SpeechBubble.tsx
import React, { useEffect, useMemo, useState, CSSProperties } from 'react'
import { Html } from '@react-three/drei'

type SpeechBubbleProps = {
  position?: [number, number, number]
  text: string
  // Estilo
  bgColor?: string         // hex o css color (para fondo)
  bgAlpha?: number         // 0..1 transparencia del fondo
  borderColor?: string
  textColor?: string
  maxWidth?: number
  // Tipografía / tamaño
  fontSize?: number        // px
  padding?: string         // CSS padding
  scale?: number           // multiplicador
  // Cola (triángulo, lado izquierdo)
  tailSize?: number        // px
  tailOffsetY?: number     // px (+ baja la cola)
  // Comportamiento
  distanceFactor?: number  // ↑ más grande = burbuja se ve más pequeña
  typeSpeed?: number       // ms/caracter; 0 = sin animación
  caret?: boolean
  enterAnim?: boolean
}

function useTypewriter(text: string, speed = 22) {
  const [out, setOut] = useState('')
  useEffect(() => {
    if (speed <= 0) { setOut(text); return }
    let i = 0
    setOut('')
    const id = setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return out
}

function hexToRgba(hexOrName: string, alpha = 1) {
  // Si no es hex, intenta devolver tal cual con alpha vía rgba(var)
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexOrName)) {
    // fallback: usa el color tal cual con opacity via CSS; para simplicidad retornamos color opaco
    return hexOrName
  }
  let c = hexOrName.substring(1)
  if (c.length === 3) {
    c = c.split('').map((ch) => ch + ch).join('')
  }
  const num = parseInt(c, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function SpeechBubble({
  position = [0, 1, 0],
  text,
  bgColor = '#ffffff',
  bgAlpha = 0.9,          // <-- transparencia del fondo
  borderColor = '#E5007A',
  textColor = '#111111',
  maxWidth = 240,
  fontSize = 12,
  padding = '6px 8px',
  scale = 0.9,
  tailSize = 8,           // tamaño del triángulo
  tailOffsetY = 0,        // desplaza el triángulo verticalmente
  distanceFactor = 14,    // ↑ sube este valor para que se vea más pequeña
  typeSpeed = 18,
  caret = true,
  enterAnim = true,
}: SpeechBubbleProps) {
  const typed = useTypewriter(text, typeSpeed)
  const bgRgba = useMemo(() => hexToRgba(bgColor, bgAlpha), [bgColor, bgAlpha])

  const containerClass = useMemo(
    () => `nv-bubble ${enterAnim ? 'nv-bubble--enter' : ''}`,
    [enterAnim]
  )

  const styleVars: CSSProperties = {
    // variables CSS para usar dentro del <style>
    ['--nv-bg' as any]: bgRgba,
    ['--nv-border' as any]: borderColor,
    ['--nv-fontSize' as any]: `${fontSize}px`,
    ['--nv-padding' as any]: padding,
    ['--nv-maxWidth' as any]: `${maxWidth}px`,
    ['--nv-scale' as any]: scale,
    ['--nv-tail' as any]: `${tailSize}px`,
    ['--nv-tailOffsetY' as any]: `${tailOffsetY}px`,
    ['--nv-text' as any]: textColor,
  }

  return (
    <Html
      position={position}
      transform
      distanceFactor={distanceFactor}
      occlude={false}
      zIndexRange={[10, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <style>{`
        .nv-bubble {
          position: relative;
          max-width: var(--nv-maxWidth);
          background: var(--nv-bg);
          color: var(--nv-text);
          border: 2px solid var(--nv-border);
          border-radius: 12px;
          padding: var(--nv-padding);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: var(--nv-fontSize);
          line-height: 1.35;
          box-shadow: 0 8px 30px rgba(229,0,122,0.12), 0 2px 10px rgba(0,0,0,0.12);
          transform-origin: bottom left;
          background-clip: padding-box;
          will-change: transform, opacity;
          transform: scale(var(--nv-scale));
          backdrop-filter: saturate(180%) blur(2px);
        }

        .nv-bubble--enter {
          animation: nv-bubble-in 260ms cubic-bezier(.2,.8,.2,1) both;
        }
        @keyframes nv-bubble-in {
          0%   { transform: scale(calc(var(--nv-scale) * 0.86)); opacity: 0; }
          100% { transform: scale(var(--nv-scale));             opacity: 1; }
        }

        /* Cola izquierda - capa de borde */
        .nv-bubble::before {
          content: "";
          position: absolute;
          top: calc(50% + var(--nv-tailOffsetY));
          left: calc(-1px - var(--nv-tail) - 2px);
          transform: translateY(-50%);
          border-top: var(--nv-tail) solid transparent;
          border-bottom: var(--nv-tail) solid transparent;
          border-right: calc(var(--nv-tail) + 2px) solid var(--nv-border);
          filter: drop-shadow(0 0 0 var(--nv-border));
        }

        /* Cola izquierda - capa de relleno */
        .nv-bubble::after {
          content: "";
          position: absolute;
          top: calc(50% + var(--nv-tailOffsetY));
          left: calc(-1px - var(--nv-tail));
          transform: translateY(-50%);
          border-top: var(--nv-tail) solid transparent;
          border-bottom: var(--nv-tail) solid transparent;
          border-right: var(--nv-tail) solid var(--nv-bg);
        }

        .nv-caret {
          display: inline-block;
          width: 8px;
          margin-left: 4px;
          border-right: 2px solid var(--nv-text);
          animation: nv-caret-blink 1s steps(2) infinite;
          vertical-align: text-bottom;
          height: 1.1em;
        }
        @keyframes nv-caret-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>

      <div className={containerClass} style={styleVars}>
        <span>{typed}</span>
        {caret && <span className="nv-caret" />}
      </div>
    </Html>
  )
}
