// src/components/HeadMinecraft.tsx
import React from 'react'
import * as THREE from 'three'
import ChacanaBadge from '../chacana/ChacanaBadge'

type HeadMinecraftProps = {
  position?: [number, number, number]
  scale?: number
  skinColor?: string
  eyeColor?: string
  earColor?: string
  mouth?: boolean

  // extras
  hat?: boolean
  hatColor?: string
  brimColor?: string
  hair?: boolean
  hairColor?: string
  beard?: boolean
  beardColor?: string
  chacanaColorA?: string
  chacanaColorB?: string
}


export default function HeadMinecraft({
  position = [0, 0.24, 0.03],
  scale = 1,
  skinColor = '#f1c27d',
  eyeColor = '#111111',
  earColor = '#e7b97b',
  mouth = false,

  hat = true,
  hatColor = '#111827',
  brimColor = '#0f172a',
  hair = true,
  hairColor = '#2b2b2b',
  beard = true,
  beardColor = '#2b2b2b',
  chacanaColorA = '#E5007A',
  chacanaColorB = '#7A1FA0',
}: HeadMinecraftProps) {
  // medidas base
  const s = 0.12 * scale            // lado de la cabeza
  const half = s / 2
  const eye = 0.018 * scale
  const eyeZ = half + 0.0015        // pequeño offset para evitar z-fighting
  const eyeY = 0.015 * scale
  const eyeX = 0.028 * scale

  const earW = 0.022 * scale
  const earH = 0.028 * scale
  const earD = 0.02  * scale
  const earX = half + earW / 2 - 0.002

  const mouthW = 0.036 * scale
  const mouthH = 0.008 * scale
  const mouthY = -0.02 * scale

  // gorra
  const capHeight = 0.045 * scale
  const capInset = 0.002 * scale
  const brimDepth = 0.06 * scale
  const brimThickness = 0.01 * scale
  const brimOffsetZ = half + brimDepth / 2 - 0.003 * scale
  const capY = half - capHeight / 2 + 0.002 // posada encima de la cabeza

  // pelo
  const hairThick = 0.012 * scale
  const sideHairW = 0.022 * scale
  const sideHairH = 0.055 * scale
  const backHairW = s * 0.98
  const backHairH = 0.06 * scale
  const hairY = 0.0

  // barba (bloques simples tipo voxel)
  const beardThick = 0.008 * scale
  const beardW = 0.09 * scale
  const beardH = 0.04 * scale
  const beardZ = half + beardThick / 2 - 0.0005

  return (
    <group position={position} castShadow>
      {/* Cabeza base */}
      <mesh castShadow>
        <boxGeometry args={[s, s, s]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Orejas */}
      <mesh position={[-earX, 0, 0]} castShadow>
        <boxGeometry args={[earW, earH, earD]} />
        <meshStandardMaterial color={earColor} roughness={0.7} />
      </mesh>
      <mesh position={[earX, 0, 0]} castShadow>
        <boxGeometry args={[earW, earH, earD]} />
        <meshStandardMaterial color={earColor} roughness={0.7} />
      </mesh>

      {/* Ojos */}
      <mesh position={[-eyeX, eyeY, eyeZ]} castShadow>
        <planeGeometry args={[eye, eye]} />
        <meshStandardMaterial color={eyeColor} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[eyeX, eyeY, eyeZ]} castShadow>
        <planeGeometry args={[eye, eye]} />
        <meshStandardMaterial color={eyeColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Boca opcional */}
      {mouth && (
        <mesh position={[0, mouthY, eyeZ]}>
          <planeGeometry args={[mouthW, mouthH]} />
          <meshStandardMaterial color={'#3a2c24'} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Pelo */}
      {hair && (
        <group>
          {/* laterales */}
          <mesh position={[-(half - sideHairW / 2 - capInset), hairY, 0]} castShadow>
            <boxGeometry args={[sideHairW, sideHairH, s * 0.9]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          <mesh position={[half - sideHairW / 2 - capInset, hairY, 0]} castShadow>
            <boxGeometry args={[sideHairW, sideHairH, s * 0.9]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          {/* nuca */}
          <mesh position={[0, -(sideHairH / 2) + 0.005 * scale, -half + hairThick / 2 + 0.001]} castShadow>
            <boxGeometry args={[backHairW, backHairH, hairThick]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          {/* flequillo sutil */}
          <mesh position={[0, 0.02 * scale, half - hairThick / 2 - 0.002]} castShadow>
            <boxGeometry args={[s * 0.7, hairThick, hairThick]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* Barba */}
      {beard && (
        <group>
          {/* bigote+perilla */}
          <mesh position={[0, mouthY - beardH / 2 - 0.004 * scale, beardZ]} castShadow>
            <boxGeometry args={[beardW * 0.9, beardH, beardThick]} />
            <meshStandardMaterial color={beardColor} roughness={0.85} />
          </mesh>
          {/* mejillas (laterales) */}
          <mesh position={[-beardW * 0.55, mouthY - beardH / 4, beardZ]} castShadow>
            <boxGeometry args={[beardW * 0.25, beardH * 0.7, beardThick]} />
            <meshStandardMaterial color={beardColor} roughness={0.85} />
          </mesh>
          <mesh position={[beardW * 0.55, mouthY - beardH / 4, beardZ]} castShadow>
            <boxGeometry args={[beardW * 0.25, beardH * 0.7, beardThick]} />
            <meshStandardMaterial color={beardColor} roughness={0.85} />
          </mesh>
        </group>
      )}

      {/* Gorra */}
      {hat && (
        <group>
          {/* copa (ligeramente más ancha que la cabeza, y un poco más baja atrás) */}
          <mesh position={[0, capY, 0]} castShadow>
            <boxGeometry args={[s + 0.004 * scale, capHeight, s + 0.004 * scale]} />
            <meshStandardMaterial color={hatColor} roughness={0.7} metalness={0.1} />
          </mesh>

          {/* visera */}
          <mesh position={[0, capY - capHeight / 2 + 0.002 * scale, brimOffsetZ]} castShadow>
            <boxGeometry args={[s * 0.8, brimThickness, brimDepth]} />
            <meshStandardMaterial color={brimColor} roughness={0.6} metalness={0.15} />
          </mesh>

          {/* Chacana frontal (en pixeles) */}
          <group position={[0, capY + capHeight * 0.1, half + 0.001]} rotation={[0, 0, 0]} scale={1}>
            <ChacanaBadge size={0.022 * scale} depth={0.002 * scale} colorA={chacanaColorA} colorB={chacanaColorB} />
          </group>
        </group>
      )}
    </group>
  )
}
