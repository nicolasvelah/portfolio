// DaySky.tsx
import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Sky, Clouds, Cloud } from '@react-three/drei'

function Sun({
  position = [10, 8, -5] as [number, number, number],
  radius = 0.6,
}) {
  // halo como sprite aditivo
  const spriteMat = useMemo(() => {
    const tex = new THREE.CanvasTexture(makeRadialGradient(256))
    tex.colorSpace = THREE.SRGBColorSpace
    return new THREE.SpriteMaterial({
      map: tex,
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  return (
    <group position={position}>
      {/* Esfera solar */}
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial color="#fff6b3" toneMapped={false} />
      </mesh>
      {/* Halo */}
      <sprite material={spriteMat} scale={[4, 4, 1]} />
    </group>
  )
}

// genera un gradiente radial suave para el halo
function makeRadialGradient(size: number) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  g.addColorStop(0, 'rgba(255, 246, 179, 0.9)')
  g.addColorStop(0.4, 'rgba(255, 220, 120, 0.35)')
  g.addColorStop(1, 'rgba(255, 200, 80, 0.0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return c
}

export default function DaySky({
  sunPosition = [10, 2, -5] as [number, number, number],
}: { sunPosition?: [number, number, number] }) {
  return (
    <>
      {/* Cielo celeste (ajustes para azul claro) */}
      <Sky
        distance={450000}
        sunPosition={sunPosition}
        // parámetros para un celeste más vivo
        turbidity={1.8}
        rayleigh={2.0}
        mieCoefficient={0.003}
        mieDirectionalG={0.8}
        inclination={0.1}   // altura “matinal”
        azimuth={0.25}
      />

      {/* Sol visible + luz direccional alineada */}
      <Sun position={sunPosition} />
      <directionalLight
        position={sunPosition}
        intensity={1.1}
        color="#00eccc"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight intensity={0.35} color="#bcdfff" />

      {/* Nubes suaves (eleva Y para no “tocar” el horizonte/piso) */}
      <Clouds limit={400} range={40}>
        <Cloud seed={1} position={[-9, 5, 0]} bounds={[4, 2, 4]} volume={1} opacity={0.15} />
        <Cloud seed={2} position={[-9, 5, 0]} bounds={[4, 2, 4]} volume={1} opacity={0.12} />
        <Cloud seed={3} position={[-9, 5, 0]} bounds={[4, 2, 4]} volume={1} opacity={0.12} />
      </Clouds>
    </>
  )
}
