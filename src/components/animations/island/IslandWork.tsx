// src/components/IslandWork.tsx
import * as THREE from 'three'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Float,
  OrbitControls,
  ContactShadows
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { a, useSpring } from '@react-spring/three'

import PersonSitting from './PersonSitting'
import CircleLagoon from './CircleLagoon'
import TurtleVoxel from './TurtleVoxel'
import TurtleSwimmer from './TurtleSwimmer'
import NightSky from './NightSky'
import Moon from './Moon'
import HorizonGround from './HorizonGround'
import DayNightToggle from '../DayNightToggle'
import DaySky from './DaySky'
import SpeechBubble from './SpeechBubble'

import site from '../../../../content/site.json';

type IslandWorkProps = {
  height?: number
  scale?: number
  controls?: boolean
  autoRotate?: boolean
}

/** Fondo con lerp (sin react-spring) para evitar problemas de versión */
function SceneBackground({ isDay }: { isDay: boolean }) {
  const { scene } = useThree()
  const current = useRef<THREE.Color>(new THREE.Color('#070b14'))
  const target = useMemo(
    () => new THREE.Color(isDay ? '#9edbff' : '#070b14'),
    [isDay]
  )
  useEffect(() => {
    if (!(scene.background instanceof THREE.Color)) {
      scene.background = current.current.clone()
    }
  }, [scene])
  useFrame(() => {
    current.current.lerp(target, 0.08)
    scene.background = current.current
  })
  return null
}

/* ---------- Helpers geométricos ---------- */
function useLeafGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.quadraticCurveTo(0.28, 0.15, 0.12, 0.72)
    shape.quadraticCurveTo(0.06, 0.98, 0.0, 1.28)
    shape.quadraticCurveTo(-0.06, 0.98, -0.12, 0.72)
    shape.quadraticCurveTo(-0.28, 0.15, 0, 0)
    const geo = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: 0.012,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelThickness: 0.008,
      bevelSize: 0.006,
    })
    geo.computeBoundingBox()
    geo.computeVertexNormals()
    const bb = geo.boundingBox!
    const minY = bb.min.y, maxY = bb.max.y
    const pos = geo.attributes.position as THREE.BufferAttribute
    const v = new THREE.Vector3()
    const droop = 0.35
    const serr = 0.012
    const freq = 14
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const t = (v.y - minY) / (maxY - minY)
      const bend = -droop * t * t
      v.z += bend
      const taper = THREE.MathUtils.lerp(1.0, 0.6, t)
      v.x *= taper
      const sign = Math.sign(v.x) || 1
      v.x += sign * Math.sin(t * Math.PI * freq) * serr * (1.0 - t)
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])
}

function useTrunkGeometry() {
  return useMemo(() => {
    const pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.03, 0.22, 0.01),
      new THREE.Vector3(0.06, 0.52, 0.03),
      new THREE.Vector3(0.04, 0.9, 0.01),
      new THREE.Vector3(0, 1.18, 0),
    ]
    const curve = new THREE.CatmullRomCurve3(pts)
    const g = new THREE.TubeGeometry(curve, 120, 0.045, 10, false)
    const pos = g.attributes.position as THREE.BufferAttribute
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const ring = Math.sin(v.y * 18) * 0.004
      const r = 1.0 + ring
      pos.setXYZ(i, v.x * r, v.y, v.z * r)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])
}

/* ---------- Palmera pequeña ---------- */
function SmallPalm({ autoRotate = false }: { autoRotate?: boolean }) {
  const leafGeo = useLeafGeometry()
  const trunkGeo = useTrunkGeometry()
  const group = useRef<THREE.Group>(null)
  const trunkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#6f4c2d', roughness: 0.65, metalness: 0.15 }),
    []
  )
  const leafMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: '#1fbf83',
      roughness: 0.5,
      metalness: 0.35,
      sheen: 1.0,
      sheenColor: new THREE.Color('#86ffd6'),
    }),
    []
  )
  useFrame((_, dt) => {
    if (autoRotate && group.current) group.current.rotation.y += dt * 0.35
  })
  const leaves = useMemo(() => {
    const arr: { y: number; rotY: number; tilt: number; scale: number }[] = []
    const n = 6
    for (let i = 0; i < n; i++) {
      arr.push({
        y: 1.2,
        rotY: (i / n) * Math.PI * 2,
        tilt: THREE.MathUtils.degToRad(18 + i % 3),
        scale: 0.7 + (i % 2) * 0.08,
      })
    }
    return arr
  }, [])
  const R = -0.05
  return (
    <group ref={group} position={[0.22, 0, 0]} scale={0.9}>
      <mesh geometry={trunkGeo} material={trunkMat} castShadow receiveShadow />
      <group position={[0, 1.2, 0]}>
        {leaves.map((l, idx) => {
          const x = Math.sin(l.rotY) * R
          const z = Math.cos(l.rotY) * R
          const extraDrop = THREE.MathUtils.degToRad(40 + (idx % 3) * 6)
          return (
            <group key={idx} position={[x, 0, z]} rotation={[0, l.rotY, 0]}>
              <group rotation={[THREE.MathUtils.degToRad(-48) - extraDrop, 0, l.tilt]} scale={[l.scale, l.scale, l.scale]}>
                <mesh geometry={leafGeo} material={leafMat} castShadow />
                <mesh position={[0, 0, 0.009]}>
                  <boxGeometry args={[0.019, 0.5 * l.scale, 0.009]} />
                  <meshStandardMaterial color="#bba35b" metalness={0.2} roughness={0.6} />
                </mesh>
              </group>
            </group>
          )
        })}
        <mesh position={[0.05, -0.06, 0.03]} castShadow>
          <sphereGeometry args={[0.065, 18, 18]} />
          <meshStandardMaterial color={'#b08a4b'} metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[-0.04, -0.02, -0.02]} castShadow>
          <sphereGeometry args={[0.049, 18, 18]} />
          <meshStandardMaterial color={'#b08a4b'} metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

/* ---------- Isla, agua y escena ---------- */
function Island({ autoRotate = true }: { autoRotate?: boolean }) {
  const island = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (autoRotate && island.current) island.current.rotation.y += dt * 0.15
  })
  const R = 0.42
  const SEG = 32
  const DOME_FLATTEN = 0.85
  const hemiGeo = useMemo(() => {
    const g = new THREE.SphereGeometry(R, SEG, SEG, 0, Math.PI * 2, 0, Math.PI / 2)
    g.scale(1, DOME_FLATTEN, 1)
    const pos = g.attributes.position as THREE.BufferAttribute
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const t = THREE.MathUtils.clamp((v.y - 0) / (R * DOME_FLATTEN), 0, 1)
      const n = (Math.random() - 0.5) * 0.006 * (1 - t * 0.6)
      v.multiplyScalar(1 + n)
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <group>
      <CircleLagoon
        radius={2.4}
        y={0}
        color="#44aaed"
        mirror={0.45}
        mixStrength={5}
        blur={[240, 70]}
        speed={0.12}
        tiles={6}
        irregularity={2}
        seed={1.7}
      />

      <group position={[0, 0, 0]} rotation={[0, Math.PI / 1.1, 0]}>
        <group position={[0, 0, 0]}>
          <mesh ref={island} castShadow receiveShadow>
            <primitive object={hemiGeo} attach="geometry" />
            <meshStandardMaterial color={'#e9cfa2'} roughness={0.8} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[R, SEG]} />
            <meshStandardMaterial color={'#e7c79a'} roughness={0.85} metalness={0.03} />
          </mesh>
        </group>

        <mesh position={[0.20, 0.35, -0]} castShadow>
          <icosahedronGeometry args={[0.06, 0]} />
          <meshStandardMaterial color={'#c8b899'} roughness={0.9} />
        </mesh>
        <mesh position={[0.05, 0.35, 0.08]} castShadow>
          <icosahedronGeometry args={[0.045, 0]} />
          <meshStandardMaterial color={'#c8b899'} roughness={0.9} />
        </mesh>

        <group position={[0.02, 0.20, -0.02]}>
          <SmallPalm />
        </group>

        <PersonSitting
          position={[0.23, 0.35, -0.01]}
          rotationY={Math.PI / -2.3}
          screenColor="#8BE9FD"
          screenIntensity={1.7}
        />

        <TurtleSwimmer
          waterY={0}
          lagoonRadius={2}
          islandRadius={0.42}
          innerMargin={0.28}
          margin={0.20}
          speed={0.15}
          bob={0.03}
          noiseAmp={0.16}
          noiseFreq={0.25}
        >
          <TurtleVoxel scale={0.22} />
        </TurtleSwimmer>
      </group>
    </group>
  )
}

/* ---------- Componente principal: Canvas ---------- */
export default function IslandWork({
  height = 420,
  scale = 1,
  controls = false,
  autoRotate = false,
}: IslandWorkProps) {
  const [isDay, setIsDay] = useState(false)

  // SPRINGS para Sol/Luna (posiciones finales exactas solicitadas)
  const { sunPos, sunIntensity, moonPos, moonIntensity, ambDay, ambNight } = useSpring({
    sunPos:  isDay ? [-1000, 30, 300] : [-1000, -200, 300], // Sol sube/baja
    sunIntensity: isDay ? 0.45 : 0.0,
    moonPos: isDay ? [-5, -50, -2.5] : [-5, 3, -2.5],        // Luna baja/sube
    moonIntensity: isDay ? 0.0 : 1.15,
    ambDay: isDay ? 0.1 : 0,   // luz ambiente de día
    ambNight: isDay ? 0 : 0.4, // luz ambiente de noche
    config: { tension: 120, friction: 20 }
  })

  // Colores escénicos según estado
  const fogColor     = isDay ? '#9edbff' : '#141007'
  const groundColor  = isDay ? '#98ffbc' : '#202023'
  const lagoonColor  = '#44aaed' // puedes diferenciar si quieres
  const sunForSky: [number, number, number] = isDay ? [-1000, 30, 300] : [0, 0, 0]

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <DayNightToggle isDay={isDay} onChange={setIsDay} />

      <Canvas
        camera={{ position: [7, 1.4, 0], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        {/* Fondo animado (lerp) */}
        <SceneBackground isDay={isDay} />

        {/* Niebla */}
        <fog attach="fog" args={[fogColor, isDay ? 5 : 14, isDay ? 50 : 40]} />

        {/* Cielo */}
        {isDay ? (
          <DaySky sunPosition={sunForSky} />
        ) : (
          <>
            <NightSky />
            {/* Luna animada hacia su posición final [-5, 3, -2.5] */}
            <a.group position={moonPos as any}>
              <Moon />
            </a.group>
          </>
        )}

        {/* Luces: Sol (direccional animado) y luz de Luna (direccional animada) */}
        {/* Ambiente día */}
        <a.ambientLight intensity={ambDay as any} />
        {/* Ambiente noche */}
        <a.ambientLight intensity={ambNight as any} />

        {/* Sol */}
        <a.directionalLight
          position={sunPos as any}
          intensity={sunIntensity as any}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          color="#fff6c4"
        />

        {/* Luz de Luna */}
        <a.directionalLight
          position={[3, 4, 2.5]} // luz desde un lado
          intensity={moonIntensity as any}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          color="#bcd3ff"
        />

        {/* Suelo/Horizonte */}
        <HorizonGround radius={240} y={-0.08} color={groundColor} />

        {/* Agua */}
        <CircleLagoon
          radius={2}
          y={0}
          color={lagoonColor}
          mirror={isDay ? 0.35 : 0.55}
          mixStrength={isDay ? 4 : 6}
          blur={isDay ? [180, 40] : [300, 90]}
          speed={isDay ? 0.2 : 0.3}
          tiles={isDay ? 8 : 10}
        />

        {/* Sombras de contacto */}
        <ContactShadows
          position={[0, -0.051, 0]}
          opacity={isDay ? 0.28 : 0.35}
          scale={6}
          blur={2.0}
          far={3}
        />

        {/* Bloom */}
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={isDay ? 0.2 : 0.38}
            luminanceThreshold={isDay ? 0.8 : 0.62}
            luminanceSmoothing={0.22}
          />
        </EffectComposer>

        {/* HDRI diferente (opcional) */}
        <Environment preset={isDay ? 'sunset' : 'night'} environmentIntensity={isDay ? 0.7 : 0.6} />

        {/* Isla */}
        <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.06}>
          <group scale={scale}>
            <Island autoRotate={autoRotate} />

            {/* Burbuja encima de la persona 
            <mesh  rotation={[0, 7.5, 0]}>
              <SpeechBubble
                text={site.hero.headline} // "Hi, I’m a full-stack developer and software designer. I love creating!"
                position={[1.6, 0.5, -0.3 ]}
                bgColor="#ffffff"
                borderColor="#E5007A"
                textColor="#111111"
                maxWidth={340}
                typeSpeed={14}
                caret={true}
                distanceFactor={3.3}    // más pequeño a mayor valor, ajusta a gusto
                enterAnim={true}
                bgAlpha={0.88}
              />
            </mesh>*/}
          </group>
        </Float>

        {controls && (
          <OrbitControls
            enablePan={false}
            maxPolarAngle={Math.PI * 0.55}
            target={[0, 0.7, 0]}
          />
        )}
      </Canvas>
    </div>
  )
}
