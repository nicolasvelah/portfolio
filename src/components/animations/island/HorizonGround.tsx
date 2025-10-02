// src/components/HorizonGround.tsx
import React, { useMemo } from 'react'
import * as THREE from 'three'

type Props = {
  radius?: number   // qué tan grande es el suelo (en unidades de mundo)
  y?: number        // altura del piso
  color?: string
  roughness?: number
  metalness?: number
}

export default function HorizonGround({
  radius = 200,
  y = -0.1,
  color = '#0a0f1a',         // azul noche muy oscuro
  roughness = 0.95,
  metalness = 0.02,
}: Props) {
  // círculo grande (más ligero que un plano enorme con muchos segmentos)
  const geo = useMemo(() => new THREE.CircleGeometry(radius, 64), [radius])

  return (
    <mesh
      geometry={geo}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, y, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  )
}
