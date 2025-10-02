// src/components/WaterSurface.tsx
import * as THREE from 'three'
import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Water } from 'three-stdlib'

type Props = {
  size?: number
  y?: number
  color?: string
  distortionScale?: number
  sunDir?: [number, number, number]
  opacity?: number
  tiles?: number            // repetición del normal map
  speed?: number           // velocidad de animación
}

/** Genera un normal map (RGB) a partir de una altura procedural tileable */
function useProceduralWaterNormals(res = 256, tiles = 4) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = res
    canvas.height = res
    const ctx = canvas.getContext('2d')!

    // Altura h(x,y): combinación de senos tileables
    const H = new Float32Array(res * res)
    const freq = tiles // nro de olas por lado
    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        const u = (x / res) * Math.PI * 2 * freq
        const v = (y / res) * Math.PI * 2 * freq
        // mezcla de sinusoides (tileables) + un armónico
        const h =
          Math.sin(u) * 0.5 +
          Math.sin(v + Math.sin(u * 0.5)) * 0.35 +
          Math.sin(u * 0.5 + v * 1.3) * 0.15
        H[y * res + x] = h
      }
    }

    // Calcula gradiente y empaqueta normal (nx, ny, nz) -> RGB 0..255
    const img = ctx.createImageData(res, res)
    const scale = 1.0 // fuerza de normal; sube para crestas más marcadas
    const idx = (x: number, y: number) => ((y + res) % res) * res + ((x + res) % res)

    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        // derivadas centrales (tileables)
        const dhdx = (H[idx(x + 1, y)] - H[idx(x - 1, y)]) * scale
        const dhdy = (H[idx(x, y + 1)] - H[idx(x, y - 1)]) * scale

        // normal no normalizada ( -dhdx, -dhdy, 1 )
        const nx = -dhdx
        const ny = -dhdy
        const nz = 1.0
        const invLen = 1.0 / Math.hypot(nx, ny, nz)

        const r = (nx * invLen * 0.5 + 0.5) * 255
        const g = (ny * invLen * 0.5 + 0.5) * 255
        const b = (nz * invLen * 0.5 + 0.5) * 255

        const p = (y * res + x) * 4
        img.data[p + 0] = r
        img.data[p + 1] = g
        img.data[p + 2] = b
        img.data[p + 3] = 255
      }
    }

    ctx.putImageData(img, 0, 0)

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(tiles, tiles)
    tex.needsUpdate = true
    // Importante para normales:
    tex.encoding = THREE.LinearEncoding
    return tex
  }, [res, tiles])
}

export default function WaterSurface({
  size = 6.4,
  y = -0.05,
  color = '#2581bd',        // tu azul
  distortionScale = 2.2,    // más bajo para más “realista”
  sunDir = [3, 4, 2.5],
  opacity = 0.98,
  tiles = 4,
  speed = 1.0,
}: Props) {
  const waterNormals = useProceduralWaterNormals(256, tiles)

  const water = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(size, size)
    const w = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(...sunDir).normalize(),
      sunColor: 0xffffff,
      waterColor: new THREE.Color(color),
      distortionScale, // amplitud de “olas”
      fog: false,
      format: THREE.RGBAFormat,
      alpha: opacity,  // transparencia del agua
    })
    w.rotation.x = -Math.PI / 2
    w.position.set(0, y, 0)

    // Afinado de uniformes útiles
    const uniforms = (w.material as any).uniforms
    uniforms['size'].value = 1.0            // escala interna del shader
    uniforms['alpha'].value = opacity
    return w
  }, [size, y, color, distortionScale, waterNormals, sunDir, opacity])

  useFrame((_, dt) => {
    // anima el tiempo del shader = movimiento de olas
    ;(water.material as any).uniforms['time'].value += dt * speed
  })

  return <primitive object={water} />
}
