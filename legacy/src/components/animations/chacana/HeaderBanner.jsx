import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'

/** Mapa de “cajas” para formar una Chacana escalonada */
function useChacanaBoxes(size = 1) {
  // Patrón 7x7 (1 = bloque, 0 = vacío)
  const pattern = [
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
  ]
  const N = pattern.length
  const cell = size / N
  const positions = []
  for (let i=0;i<N;i++){
    for (let j=0;j<N;j++){
      if (pattern[i][j] === 1) {
        const x = (j - N/2 + 0.5) * cell
        const y = (N/2 - i - 0.5) * cell
        positions.push([x, y, 0])
      }
    }
  }
  return { positions, cell }
}

function Chacana3D({ palette = ['#E5007A', '#FF3EA5', '#7A1FA0', '#FF8A00', '#FFD54A'] }) {
  const group = useRef()
  const { positions, cell } = useChacanaBoxes(1.8)
  const geom = useMemo(() => new THREE.BoxGeometry(cell*0.95, cell*0.95, cell*0.35), [cell])
  const materials = useMemo(
    () => palette.map(c => new THREE.MeshStandardMaterial({ color: new THREE.Color(c), metalness: 0.2, roughness: 0.35 })),
    [palette]
  )

  useFrame((state, delta) => {
    if (!group.current) return
    // rotación sutil continua
    group.current.rotation.z += delta * 0.15
  })

  return (
    <group ref={group}>
      {positions.map((p, idx) => {
        // gradiente radial de color
        const [x, y] = p
        const d = Math.hypot(x, y)
        const t = THREE.MathUtils.clamp(d / 0.9, 0, 1)
        const ci = Math.min(palette.length - 1, Math.floor((1 - t) * (palette.length)))
        const m = materials[ci]
        return (
          <mesh key={idx} position={p} geometry={geom} material={m} castShadow receiveShadow>
            {/* brillo sutil por caja */}
            <meshStandardMaterial color={palette[ci]} metalness={0.3} roughness={0.35} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function HeaderBanner({
  height = 240,
  parallax = true,
  palette = ['#E5007A', '#FF3EA5', '#7A1FA0', '#FF8A00', '#FFD54A'],
}) {
  const wrapRef = useRef(null)
  const mouse = useRef({x:0,y:0})
  return (
    <div
      ref={wrapRef}
      style={{ width: '100%', height, position: 'relative' }}
      onMouseMove={(e) => {
        if (!parallax) return
        const r = e.currentTarget.getBoundingClientRect()
        mouse.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
        mouse.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        shadows
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)} // transparente
      >
        {/* Luz ambiente y direccional */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[2, 3, 4]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Parallax suave del grupo completo */}
        <ParallaxGroup mouse={mouse}>
          <Float speed={0.9} rotationIntensity={0.15} floatIntensity={0.2}>
            <Chacana3D palette={palette} />
          </Float>
        </ParallaxGroup>
      </Canvas>
    </div>
  )
}

function ParallaxGroup({ mouse, children }) {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current || !mouse.current) return
    // lerp hacia el objetivo del mouse
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, mouse.current.y * 0.25, 0.06)
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.current.x * 0.25, 0.06)
  })
  return <group ref={ref}>{children}</group>
}
