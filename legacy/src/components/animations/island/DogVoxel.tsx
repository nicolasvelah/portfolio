// src/components/DogVoxel.tsx
import React, { useRef } from 'react'
import type { JSX } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type DogVoxelProps = JSX.IntrinsicElements['group'] & {
  scale?: number
  bodyColor?: string
  earColor?: string
  muzzleColor?: string
  eyeColor?: string
  animate?: boolean     // head bob + tail wag
}

export default function DogVoxel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  bodyColor = '#caa27a',
  earColor = '#8a6747',
  muzzleColor = '#e8d0b0',
  eyeColor = '#111111',
  animate = true,
  ...rest
}: DogVoxelProps) {
  const root = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const tailRef = useRef<THREE.Mesh>(null)
  const t = useRef(0)

  useFrame((_, dt) => {
    if (!animate) return
    t.current += dt
    if (headRef.current) {
      headRef.current.position.y = 0.28 * scale + Math.sin(t.current * 3) * 0.01 * scale
    }
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t.current * 8) * 0.4
    }
  })

  const S = 1 * scale

  return (
    <group ref={root} position={position} rotation={rotation} {...rest}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0.22 * S, 0]}>
        <boxGeometry args={[0.55 * S, 0.28 * S, 0.30 * S]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.20 * S, 0.10 * S, 0.12 * S]} castShadow>
        <boxGeometry args={[0.10 * S, 0.20 * S, 0.10 * S]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.20 * S, 0.10 * S, 0.12 * S]} castShadow>
        <boxGeometry args={[0.10 * S, 0.20 * S, 0.10 * S]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[-0.20 * S, 0.10 * S, -0.12 * S]} castShadow>
        <boxGeometry args={[0.10 * S, 0.20 * S, 0.10 * S]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.20 * S, 0.10 * S, -0.12 * S]} castShadow>
        <boxGeometry args={[0.10 * S, 0.20 * S, 0.10 * S]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Neck */}
      <mesh position={[0.24 * S, 0.28 * S, 0]}>
        <boxGeometry args={[0.10 * S, 0.12 * S, 0.10 * S]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Head group (bob animation) */}
      <group ref={headRef} position={[0.36 * S, 0.28 * S, 0]}>
        {/* Head cube */}
        <mesh castShadow>
          <boxGeometry args={[0.22 * S, 0.22 * S, 0.22 * S]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.10 * S, 0.14 * S, 0]} castShadow>
          <boxGeometry args={[0.06 * S, 0.10 * S, 0.06 * S]} />
          <meshStandardMaterial color={earColor} />
        </mesh>
        <mesh position={[0.10 * S, 0.14 * S, 0]} castShadow>
          <boxGeometry args={[0.06 * S, 0.10 * S, 0.06 * S]} />
          <meshStandardMaterial color={earColor} />
        </mesh>

        {/* Muzzle */}
        <mesh position={[0.13 * S, -0.02 * S, 0]} castShadow>
          <boxGeometry args={[0.12 * S, 0.10 * S, 0.16 * S]} />
          <meshStandardMaterial color={muzzleColor} />
        </mesh>

        {/* Nose */}
        <mesh position={[0.20 * S, -0.02 * S, 0]}>
          <boxGeometry args={[0.04 * S, 0.04 * S, 0.06 * S]} />
          <meshStandardMaterial color={'#222'} />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.05 * S, 0.04 * S, 0.08 * S]}>
          <boxGeometry args={[0.03 * S, 0.03 * S, 0.01 * S]} />
          <meshStandardMaterial color={eyeColor} />
        </mesh>
        <mesh position={[0.05 * S, 0.04 * S, -0.08 * S]}>
          <boxGeometry args={[0.03 * S, 0.03 * S, 0.01 * S]} />
          <meshStandardMaterial color={eyeColor} />
        </mesh>
      </group>

      {/* Tail (wag animation) */}
      <mesh ref={tailRef} position={[-0.30 * S, 0.28 * S, 0]} castShadow>
        <boxGeometry args={[0.16 * S, 0.06 * S, 0.06 * S]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
    </group>
  )
}
