// src/components/TurtleVoxel.tsx
import React, { useRef } from 'react'
import type { JSX } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type TurtleVoxelProps = JSX.IntrinsicElements["group"] & {
  scale?: number
  shellColor?: string
  skinColor?: string
  undersideColor?: string
  animate?: boolean    // gentle bob + leg paddle
}

export default function TurtleVoxel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  shellColor = '#2c7a4b',
  skinColor = '#8fbf7a',
  undersideColor = '#c9a66b',
  animate = true,
  ...rest
}: TurtleVoxelProps) {
  const g = useRef<THREE.Group>(null)
  const t = useRef(0)

  useFrame((_, dt) => {
    if (!animate || !g.current) return
    t.current += dt
    // gentle bob
    g.current.position.y = (Array.isArray(position) ? position[1] : 0) + Math.sin(t.current * 1.5) * 0.01 * scale
    // legs paddle: rotate child groups if exist
    g.current.children.forEach((child, i) => {
      // legs are added later as indices 2..5 (heuristic)
      if (i >= 2 && i <= 5) {
        ;(child as THREE.Object3D).rotation.x = Math.sin(t.current * 4 + i) * 0.25
      }
    })
  })

  const S = 1 * scale
  return (
    <group ref={g} position={position} rotation={rotation} {...rest}>
      {/* Shell (slightly arched using a box + scaleY) */}
      <group >
        <mesh castShadow receiveShadow position={[0, 0.12 * S, 0]}>
            <boxGeometry args={[0.7 * S, 0.18 * S, 0.9 * S]} />
            <meshStandardMaterial color={shellColor} roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.2 * S, 0]}>
            <boxGeometry args={[0.6 * S, 0.18 * S, 0.8 * S]} />
            <meshStandardMaterial color={shellColor} roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.3 * S, 0]}>
            <boxGeometry args={[0.4 * S, 0.18 * S, 0.6 * S]} />
            <meshStandardMaterial color={shellColor} roughness={0.8} />
        </mesh>

        {/* Underside (plastron) */}
        <mesh castShadow receiveShadow position={[0, 0.03 * S, 0]}>
            <boxGeometry args={[0.68 * S, 0.06 * S, 0.86 * S]} />
            <meshStandardMaterial color={undersideColor} roughness={0.9} />
        </mesh>
      </group>

      {/* Head */}
      <group position={[0, 0.10 * S, 0.52 * S]}>
        <mesh castShadow>
          <boxGeometry args={[0.18 * S, 0.18 * S, 0.22 * S]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.07 * S, 0.03 * S, 0.07 * S]}>
          <boxGeometry args={[0.03 * S, 0.03 * S, 0.01 * S]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.07 * S, 0.03 * S, 0.07 * S]}>
          <boxGeometry args={[0.03 * S, 0.03 * S, 0.01 * S]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {/* Legs (front-left, front-right, back-left, back-right) */}
      <group position={[-0.28 * S, 0.02 * S, 0.28 * S]}>
        <mesh castShadow>
          <boxGeometry args={[0.14 * S, 0.08 * S, 0.24 * S]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>
      <group position={[0.28 * S, 0.02 * S, 0.28 * S]}>
        <mesh castShadow>
          <boxGeometry args={[0.14 * S, 0.08 * S, 0.24 * S]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>
      <group position={[-0.28 * S, 0.02 * S, -0.28 * S]}>
        <mesh castShadow>
          <boxGeometry args={[0.14 * S, 0.08 * S, 0.24 * S]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>
      <group position={[0.28 * S, 0.02 * S, -0.28 * S]}>
        <mesh castShadow>
          <boxGeometry args={[0.14 * S, 0.08 * S, 0.24 * S]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Tail */}
      <mesh position={[0, 0.06 * S, -0.52 * S]}>
        <boxGeometry args={[0.06 * S, 0.06 * S, 0.12 * S]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
    </group>
  )
}
