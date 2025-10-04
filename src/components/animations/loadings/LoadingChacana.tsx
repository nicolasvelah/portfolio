import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

/**
 * LoadingChacana
 * A full-bleed loading component featuring a glowing, gently rotating Andean Chacana.
 *
 * Usage:
 * <div className="w-full h-[300px]">
 *   <LoadingChacana label="Cargando portafolio…" />
 * </div>
 *
 * Notes:
 * - This component uses @react-three/fiber (R3F) and @react-three/postprocessing.
 * - All styles use Tailwind utility classes; adjust container size via parent.
 */
export default function LoadingChacana({
  label = "Loading…",
  glowColor = "#49d1ff",
  baseColor = "#1a1a1a",
  background = "#030712",
}: {
  label?: string;
  glowColor?: string; // Emissive highlight color
  baseColor?: string; // Mesh base color
  background?: string; // Canvas background color
}) {
  return (
    <div className="relative h-full w-full select-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true }}>
        <color attach="background" args={[background]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 6, 8]} intensity={0.6} />
        <directionalLight position={[-6, -4, -3]} intensity={0.3} />

        <Chacana glowColor={glowColor} baseColor={baseColor} />

        {/* Soft bloom for neon-like glow */}
        <EffectComposer multisampling={4}> 
          <Bloom intensity={1.2} luminanceThreshold={0.15} luminanceSmoothing={0.2} radius={0.9} />
        </EffectComposer>
      </Canvas>

      {/* Centered label */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="mt-40 text-center">
          <div className="text-zinc-200/80 text-sm tracking-widest uppercase">{label}</div>
        </div>
      </div>
    </div>
  );
}

function Chacana({ glowColor, baseColor }: { glowColor: string; baseColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  // Build a 2D Chacana (stepped cross) and extrude to 3D
  const geometry = useMemo(() => {
    // Chacana as an 8-step outline path (unit grid where arms are width=3, overall size=7)
    // Coordinates walk clockwise around the stepped cross.
    const s = 1; // scale step
    const pts: [number, number][] = [
      [-3,  1], [-1, 1], [-1, 3], [ 1, 3], [ 1, 1], [ 3, 1], [ 3, -1], [ 1, -1],
      [ 1, -3], [-1, -3], [-1, -1], [-3, -1],
    ];

    const shape = new THREE.Shape();
    shape.moveTo(pts[0][0] * s, pts[0][1] * s);
    for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0] * s, pts[i][1] * s);
    shape.closePath();

    // Optional central hole (a small square) to echo traditional chacana designs
    const hole = new THREE.Path();
    const h = 0.75; // half-size of the central cutout
    hole.moveTo(-h, -h);
    hole.lineTo(h, -h);
    hole.lineTo(h, h);
    hole.lineTo(-h, h);
    hole.closePath();
    shape.holes.push(hole);

    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: 0.7,
      bevelEnabled: true,
      bevelThickness: 0.18,
      bevelSize: 0.18,
      bevelSegments: 3,
    });

    // Center geometry
    extrude.center();

    return extrude;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.45; // gentle spin
      meshRef.current.rotation.x = Math.sin(t * 0.35) * 0.15;
      meshRef.current.position.y = Math.sin(t * 0.8) * 0.08; // subtle float
    }
    if (materialRef.current) {
      // Pulse emissive intensity for a breathing glow
      const pulse = 0.7 + Math.sin(t * 2.2) * 0.3;
      (materialRef.current as any).emissiveIntensity = pulse;
      // Slight hue shift (optional): you can comment this out if you prefer a fixed color
      const col = new THREE.Color(glowColor).offsetHSL(Math.sin(t * 0.1) * 0.02, 0, 0);
      materialRef.current.emissive = col;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        ref={materialRef}
        color={baseColor}
        metalness={0.2}
        roughness={0.35}
        emissive={new THREE.Color(glowColor)}
        emissiveIntensity={1}
      />
    </mesh>
  );
}

// Tailwind tip: Give the parent container a fixed height to make the canvas visible.
// Example wrapper:
// <div className="h-[360px] w-full">
//   <LoadingChacana />
// </div>
