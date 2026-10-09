// TurtleSwimmer.tsx (versión smooth sin saltos)
import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type Props = React.JSX.IntrinsicElements["group"] & {
  waterY?: number
  lagoonRadius?: number   // radio del agua (exterior)
  margin?: number         // margen exterior
  islandRadius?: number   // radio de la isla (interior)
  innerMargin?: number    // margen interior sobre la isla
  speed?: number          // velocidad angular base
  bob?: number            // “sube/baja” leve
  noiseAmp?: number       // variación de radio (0..)
  noiseFreq?: number      // velocidad del ruido
}

export default function TurtleSwimmer({
  position = [0,0,0],
  waterY = 0,
  lagoonRadius = 2.0,
  margin = 0.18,
  islandRadius = 0.42,
  innerMargin = 0.25,
  speed = 0.35,
  bob = 0.035,
  noiseAmp = 0.18,       // amplitud de variación radial
  noiseFreq = 0.25,      // frecuencia del ruido
  children,
  ...rest
}: Props) {
  const root = useRef<THREE.Group>(null)

  // límites del anillo donde debe moverse
  const minR = Math.max(0.05, islandRadius + innerMargin)
  const maxR = Math.max(minR + 0.05, lagoonRadius * (1 - margin))
  const baseR = (minR + maxR) * 0.5
  const halfBand = (maxR - minR) * 0.5

  // estado polar continuo
  const thetaRef = useRef(Math.random() * Math.PI * 2)
  const rRef = useRef(baseR)
  const vrRef = useRef(0) // velocidad radial

  useFrame((_, dt) => {
    if (!root.current) return
    const theta = thetaRef.current
    let r = rRef.current
    let vr = vrRef.current

    // 1) Avance angular (constante)
    const omega = (speed / Math.max(0.0001, lagoonRadius)) * 2.2
    const thetaNext = theta + omega * dt

    // 2) Objetivo radial con ruido LENTO (no se clampa posición)
    const tNoise = performance.now() * 0.001 * noiseFreq
    const noise = Math.sin(tNoise) * noiseAmp
    const rTarget = THREE.MathUtils.clamp(baseR + noise, minR + 0.05, maxR - 0.05)

    // 3) “Resorte” hacia rTarget + barrera suave cerca de los bordes
    //    r'' = k*(rTarget - r) - d*vr + borde
    const k = 4.5  // rigidez
    const d = 2.6  // amortiguación
    let borderForce = 0
    const edge = 0.15 * (maxR - minR) // zona de influencia de borde

    if (r < minR + edge) {
      const t = (r - minR) / edge // 0..1
      borderForce += (1 - Math.max(0, Math.min(1, t))) * 8.0 // empuja hacia afuera
    } else if (r > maxR - edge) {
      const t = (maxR - r) / edge // 0..1
      borderForce -= (1 - Math.max(0, Math.min(1, t))) * 8.0 // empuja hacia adentro
    }

    const ar = k * (rTarget - r) - d * vr + borderForce
    vr += ar * dt
    r += vr * dt

    // 4) Limitar r suavemente (sin clamp brusco)
    if (r < minR) { r = minR; vr = Math.max(0, vr) }     // si tocó, no permitir seguir entrando
    if (r > maxR) { r = maxR; vr = Math.min(0, vr) }     // idem hacia fuera

    // 5) Posición y orientación
    const x = r * Math.cos(thetaNext)
    const z = r * Math.sin(thetaNext)
    const y = waterY + 0.015 + Math.sin(thetaNext * 2.0) * bob

    root.current.position.set(
      (Array.isArray(position) ? position[0] : 0) + x,
      y,
      (Array.isArray(position) ? position[2] : 0) + z
    )

    // Tangente (derivada) para yaw
    const dx = -r * Math.sin(thetaNext)                      // derivada de x
    const dz =  r * Math.cos(thetaNext)                      // derivada de z
    const yaw = Math.atan2(dx, dz)
    root.current.rotation.set(0, yaw, 0)

    // guardar estado
    thetaRef.current = thetaNext
    rRef.current = r
    vrRef.current = vr
  })

  return (
    <group ref={root} position={position} {...rest}>
      {children}
    </group>
  )
}
