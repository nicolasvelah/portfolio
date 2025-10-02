// src/components/CanvasBackground.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'

/**
 * Genera puntos dentro de una Chacana “pixelada” (escalonada 3x3).
 * El tamaño base es 1x1 unidades normalizadas; luego escalamos.
 */
function useChacanaPoints({
  grid = 90,          // densidad (más alto = más puntos)
  size = 1.0,         // tamaño base de la figura
  jitter = 0.015,     // aleatoriedad para no verse rígido
  colors = ['#E5007A', '#FF3EA5', '#7A1FA0', '#FF8A00', '#FFD54A'], // fucsias andinos
}) {
  return useMemo(() => {
    const positions = []
    const colorsArr = []

    // Definición en “pixels” de una chacana 7x7 (1 = relleno)
    // patrón escalonado con centro sólido
    const pattern = [
      [0,0,1,1,1,0,0],
      [0,1,1,1,1,1,0],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1], // fila central
      [1,1,1,1,1,1,1],
      [0,1,1,1,1,1,0],
      [0,0,1,1,1,0,0],
    ]
    const N = pattern.length
    const cell = size / N // tamaño por celda

    const colorObjs = colors.map(c => new THREE.Color(c))

    // Itera la grilla, si la celda es 1, se crean varios puntos dentro (sub-sampling)
    const sub = Math.max(1, Math.floor(grid / N))
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (pattern[i][j] !== 1) continue
        for (let si = 0; si < sub; si++) {
          for (let sj = 0; sj < sub; sj++) {
            const x = (j + (sj + 0.5) / sub - N/2) * cell
            const y = (N/2 - (i + (si + 0.5) / sub)) * cell
            const z = (Math.random() - 0.5) * 0.08 // leve profundidad
            positions.push(
              x + (Math.random() - 0.5) * jitter,
              y + (Math.random() - 0.5) * jitter,
              z
            )
            // gradiente suave por distancia al centro
            const d = Math.sqrt(x*x + y*y)
            const t = THREE.MathUtils.clamp(d / (size * 0.5), 0, 1)
            const c1 = colorObjs[Math.floor((1 - t) * (colorObjs.length - 1))]
            colorsArr.push(c1.r, c1.g, c1.b)
          }
        }
      }
    }

    const pos = new Float32Array(positions)
    const col = new Float32Array(colorsArr)
    return { pos, col, count: positions.length / 3 }
  }, [grid, size, jitter, colors])
}

function ChacanaPoints({ mouseRef }) {
  const { pos, col, count } = useChacanaPoints({ grid: 84, size: 1.2 })
  const geo = useMemo(() => new THREE.BufferGeometry(), [])
  const mat = useMemo(
    () => new THREE.PointsMaterial({
      size: 0.012,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    }),
    []
  )
  const pointsRef = useRef()

  useMemo(() => {
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    geo.computeBoundingSphere()
  }, [geo, pos, col])

  useFrame((state, delta) => {
    // rotación suave
    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.06
      // parallax con el mouse
      const m = mouseRef.current
      if (m) {
        pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, m.y * 0.2, 0.06)
        pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, m.x * 0.2, 0.06)
      }
    }
  })

  return <points ref={pointsRef} geometry={geo} material={mat} />
}

export default function CanvasBackground({
  className = 'bg-canvas',
  dpr = [1, 2]
}) {
  // mouse state para parallax
  const mouseRef = useRef({ x: 0, y: 0 })

  return (
    <div
      className={className}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
        mouseRef.current = { x, y }
      }}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 2.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0) // transparente
        }}
      >
        {/* Suave flotación del conjunto */}
        <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.3}>
          <ChacanaPoints mouseRef={mouseRef} />
        </Float>
      </Canvas>
    </div>
  )
}
