import React, { useMemo } from 'react'
import * as THREE from 'three'

export type ChacanaBadgeProps = {
  size?: number
  depth?: number
  colorA?: string
  colorB?: string
  rotation?: [number, number, number]
  position?: [number, number, number]
}

const DEFAULT_PATTERN = [
  '.AAA.',
  'AAAAA',
  'AABAA',
  'AAAAA',
  '.AAA.',
]

export default function ChacanaBadge({
  size = 0.018,
  depth = 0.002,
  colorA = '#E5007A', // fucsia
  colorB = '#7A1FA0', // morado
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}: ChacanaBadgeProps) {
  const { pixels } = useMemo(() => {
    const pattern = DEFAULT_PATTERN
    const cell = size / pattern.length
    const z = depth / 2

    const pxs: JSX.Element[] = []
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[y].length; x++) {
        const ch = pattern[y][x]
        if (ch === '.') continue
        const color = ch === 'A' ? colorA : colorB
        const px = (x - pattern.length / 2 + 0.5) * cell
        const py = (pattern.length / 2 - y - 0.5) * cell
        pxs.push(
          <mesh key={`${x}-${y}`} position={[px, py, z]}>
            <boxGeometry args={[cell * 0.95, cell * 0.95, depth]} />
            <meshStandardMaterial color={color} metalness={0.2} roughness={0.6} />
          </mesh>
        )
      }
    }
    return { pixels: pxs }
  }, [size, depth, colorA, colorB])

  return (
    <group position={position} rotation={rotation}>
      {pixels}
    </group>
  )
}
