// NightSky.tsx
import React from 'react'
import { Stars } from '@react-three/drei'

export default function NightSky() {
  return (
    // Se dibuja primero
    <group renderOrder={-10}>
      <Stars
        radius={80}
        depth={40}
        count={6000}
        factor={3}
        saturation={0}
        fade
        // no escribe ni testea z -> no “ensucia” el z-buffer
        // y todo lo que venga después lo cubrirá
        // @ts-ignore: pass-through to material
        material-depthWrite={false}
        // @ts-ignore
        material-depthTest={false}
        // @ts-ignore (opcional, si usas bloom y quieres que “brillen”)
        material-transparent={true}
      />
    </group>
  )
}
