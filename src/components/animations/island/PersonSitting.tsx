// PersonSitting.tsx
import * as THREE from 'three'
import React from 'react'
import HeadMinecraft from './HeadMinecraft'
import ChacanaBadge from '../chacana/ChacanaBadge'

type PersonSittingProps = {
  position?: [number, number, number]
  rotationY?: number
  scale?: number
  screenColor?: string
  screenIntensity?: number
}

export default function PersonSitting({
  position = [-0.08, 0.06, 0.0],   // cerca del suelo (hemisferio)
  rotationY = Math.PI / 30,         // mirando un poco hacia la palmera
  scale = 0.9,
  screenColor = '#6EE7FF',         // cian suave
  screenIntensity = 1.5,           // brillo de la pantalla
}: PersonSittingProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* MUSLOS (horizontales) */}
      <mesh position={[-0.035, 0.055, 0.055]} castShadow>
        {/* x=ancho, y=grosor, z=longitud */}
        <boxGeometry args={[0.06, 0.035, 0.12]} />
        <meshStandardMaterial color={'#06df02'} roughness={0.6} />
      </mesh>
      <mesh position={[0.035, 0.055, 0.055]} castShadow>
        <boxGeometry args={[0.06, 0.035, 0.12]} />
        <meshStandardMaterial color={'#06df02'} roughness={0.6} />
      </mesh>

      {/* PANTORRILLAS (verticales) */}
      <mesh position={[-0.035, 0.0, 0.096]} castShadow>
        <boxGeometry args={[0.05, 0.11, 0.04]} />
        <meshStandardMaterial color={'#f1c27d'} />
      </mesh>
      <mesh position={[0.035, 0.0, 0.096]} castShadow>
        <boxGeometry args={[0.05, 0.11, 0.04]} />
        <meshStandardMaterial color={'#f1c27d'} />
      </mesh>

      {/* TORSO (ligeramente inclinado hacia la pantalla) */}
      <group position={[0, 0.13, 0.02]} rotation={[-0.15, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.13, 0.07]} />
          <meshStandardMaterial color={'#3994a4ff'} />
        </mesh>
        <ChacanaBadge
          size={0.05}
          depth={0.002 * scale}
          colorA="#00d2e5"
          colorB="#ff530a"
          position={[0, 0.02, 0.04]}
        />
      </group>

      {/* CUELLO*/}
      <group position={[0, 0.20, 0.01]} rotation={[0.02, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.05, 0.02, 0.07]} />
          <meshStandardMaterial color={'#f1c27d'} />
        </mesh>
      </group>

      {/* CABEZA */}
      <HeadMinecraft
        position={[0, 0.27, 0.03]}
        scale={1}
        skinColor="#f1c27d"
        earColor="#e7b97b"
        eyeColor="#141414"
        mouth
      />

      {/* Brazos (verticales) */}
      <mesh position={[-0.08, 0.15, 0.031]} rotation={[-0.8, 0, 0]} castShadow>
        <boxGeometry args={[0.037, 0.09, 0.04]} />
        <meshStandardMaterial color={'#f1c27d'} />
      </mesh>
      <mesh position={[0.08, 0.15, 0.031]} rotation={[-0.8, 0, 0]} castShadow>
        <boxGeometry args={[0.037, 0.09, 0.04]} />
        <meshStandardMaterial color={'#f1c27d'} />
      </mesh>

      {/* Manos  (sujetando la laptop) */}
      <mesh position={[-0.076, 0.117, 0.080]} rotation={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.04, 0.029, 0.063]} />
        <meshStandardMaterial color={'#f1c27d'} />
      </mesh>
      <mesh position={[0.076, 0.117, 0.085]} rotation={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.04, 0.029, 0.063]} />
        <meshStandardMaterial color={'#f1c27d'} />
      </mesh>

      {/* LAPTOP sobre muslos */}
      <group position={[0, 0.08, 0.09]} rotation={[-0.25, 0, 0]}>
        {/* base/teclado */}
        <mesh castShadow>
          <boxGeometry args={[0.14, 0.006, 0.09]} />
          <meshStandardMaterial color={'#202833'} metalness={0.6} roughness={0.4} />
        </mesh>

        {/* pantalla */}        
        <group position={[0, 0.045, 0.06]} rotation={[Math.PI / 1.5, 0, 0]}>
          {/* tapa */}
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.006, 0.09]} />
            <meshStandardMaterial color={'#2a3a4a'} metalness={0.7} roughness={0.35} />
            <ChacanaBadge
              size={0.05}
              depth={0.002 * scale}
              colorA="#00d2e5"
              colorB="#ff530a"
              position={[0, 0.004, 0.003]}
              rotation={[Math.PI / 1.99, 0, 0]}
            />
          </mesh>
          {/* display con glow */}
          <mesh position={[0, -0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.13, 0.08]} />
            <meshStandardMaterial
              color={'#0b1220'}
              emissive={new THREE.Color(screenColor)}
              emissiveIntensity={screenIntensity}
              roughness={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}
