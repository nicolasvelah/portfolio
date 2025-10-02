// Moon.tsx
import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

export default function Moon({
  position = [0, 0, 0],
  radius = 1,
  textureUrl = '/images/texture-moon-2.jpg', // cámbialo por tu ruta
}: {
  position?: [number, number, number]
  radius?: number
  textureUrl?: string
}) {
  const tex = useLoader(THREE.TextureLoader, textureUrl)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8

  // Luz de “borde” muy sutil para volumen (no afecta la textura)
  const rimLight = useMemo(() => (
    <directionalLight
      position={[position[0] - 2, position[1] + 1, position[2] + 2]}
      intensity={0.35}
      color="#cfe3ff"
    />
  ), [position])

  return (
    <group position={position}>
      {rimLight}
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          map={tex}
          toneMapped={false}  // evita que el tonemapping te la “aplane”
          fog={false}         // la niebla no la atenúa
        />
      </mesh>
    </group>
  )
}
