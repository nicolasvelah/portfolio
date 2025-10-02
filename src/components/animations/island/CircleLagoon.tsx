// src/components/CircleLagoon.tsx
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'

type Props = {
  radius?: number
  y?: number
  color?: string
  mirror?: number
  mixStrength?: number
  blur?: [number, number]
  speed?: number      // velocidad de “oleaje” sutil
  tiles?: number      // densidad del normal map procedural
  irregularity?: number // 0..1 cuánto “no circular” (0 = círculo perfecto)
  seed?: number         // semilla para variar la forma
}

function useNormalTex(size = 256, tiles = 6) {
  return useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = size
    cvs.height = size
    const ctx = cvs.getContext('2d')!

    const img = ctx.createImageData(size, size)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = (x / size) * Math.PI * 2 * tiles
        const v = (y / size) * Math.PI * 2 * tiles
        const nx = Math.sin(u) * 0.12
        const ny = Math.sin(v + Math.sin(u * 0.7)) * 0.10
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
        const p = (y * size + x) * 4
        img.data[p + 0] = (nx * 0.5 + 0.5) * 255
        img.data[p + 1] = (ny * 0.5 + 0.5) * 255
        img.data[p + 2] = (nz * 0.5 + 0.5) * 255
        img.data[p + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)

    const tex = new THREE.CanvasTexture(cvs)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(tiles, tiles)
    tex.needsUpdate = true
    tex.colorSpace = THREE.NoColorSpace
    return tex
  }, [size, tiles])
}

function useDeformedCircle(radius: number, segments = 128, irregularity = 0.15, seed = 0) {
  return useMemo(() => {
    const geo = new THREE.CircleGeometry(radius, segments)
    const pos = geo.attributes.position as THREE.BufferAttribute

    // Deformamos SOLO el borde (los vértices con r ≈ radius)
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const r = Math.hypot(x, y)

      // tolerancia de borde
      if (Math.abs(r - radius) < 1e-3) {
        const ang = Math.atan2(y, x)
        // mezcla de senos para entradas suaves tipo playita
        const n =
          Math.sin(ang * 2.0 + seed) * 0.40 +
          Math.sin(ang * 3.0 + seed * 1.3) * 0.35 +
          Math.sin(ang * 5.0 - seed * 0.7) * 0.25

        // amplitud máxima ~ 10% del radio * irregularity
        const delta = (radius * 0.10) * irregularity * n
        const newR = r + delta
        const nx = Math.cos(ang) * newR
        const ny = Math.sin(ang) * newR
        pos.setXY(i, nx, ny)
      }
    }

    pos.needsUpdate = true
    geo.computeVertexNormals()
    // UVs del CircleGeometry ya son polares (0..1), sirven bien para el normal map
    return geo
  }, [radius, segments, irregularity, seed])
}

export default function CircleLagoon({
  radius = 3.2,
  y = -0.05,
  color = '#2581bd',
  mirror = 0.55,
  mixStrength = 6,
  blur = [300, 80],
  speed = 0.15,
  tiles = 6,
  irregularity = 0.15,   // <--- ajusta 0..0.3 aprox
  seed = 0.0,            // <--- cambia para otra silueta
}: Props) {
  const normalTex = useNormalTex(256, tiles)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const geo = useDeformedCircle(radius, 200, irregularity, seed)

  useFrame((_, dt) => {
    if (matRef.current && matRef.current.normalMap) {
      const t = (matRef.current.normalMap as THREE.Texture)
      t.offset.x += dt * speed * 0.05
      t.offset.y += dt * speed * 0.03
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow geometry={geo}>
      <MeshReflectorMaterial
        mirror={mirror}
        mixStrength={mixStrength}
        mixBlur={1}
        blur={blur}
        resolution={1024}
        depthScale={0.4}
        minDepthThreshold={0.2}
        maxDepthThreshold={1.4}
        roughness={0.35}
        metalness={0.1}
        color={color}
        normalMap={normalTex}
        normalScale={new THREE.Vector2(0.6, 0.6)}
        ref={matRef as any}
      />
    </mesh>
  )
}
