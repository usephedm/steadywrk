'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';

/* ────────────────────────────────────────────────
   STEADYWRK Logo Totem — Double-chevron 3D mark
   Two interlocking chevron shapes in warm gold
   Slow ambient rotation + mouse parallax
   ──────────────────────────────────────────────── */

function ChevronShape({ yOffset, scale: s }: { yOffset: number; scale: number }) {
  const angle = Math.PI / 5;
  const armLen = 1.1 * s;

  return (
    <group position={[0, yOffset, 0]}>
      {/* Left arm */}
      <mesh
        position={[
          -armLen * 0.5 * Math.cos(angle),
          armLen * 0.5 * Math.sin(angle),
          0,
        ]}
        rotation={[0, 0, angle]}
      >
        <boxGeometry args={[armLen, 0.18 * s, 0.25 * s]} />
        <meshStandardMaterial
          color="#E58A0F"
          metalness={0.6}
          roughness={0.35}
          envMapIntensity={0.8}
        />
      </mesh>
      {/* Right arm */}
      <mesh
        position={[
          armLen * 0.5 * Math.cos(angle),
          armLen * 0.5 * Math.sin(angle),
          0,
        ]}
        rotation={[0, 0, -angle]}
      >
        <boxGeometry args={[armLen, 0.18 * s, 0.25 * s]} />
        <meshStandardMaterial
          color="#E58A0F"
          metalness={0.6}
          roughness={0.35}
          envMapIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

function TotemMesh({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const handlePointerMove = useCallback((e: PointerEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [handlePointerMove]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    // Ambient Y-axis rotation
    groupRef.current.rotation.y += 0.003;

    // Mouse parallax tilt
    const targetRotX = mouseRef.current.y * 0.15;
    const targetRotZ = mouseRef.current.x * -0.08;
    groupRef.current.rotation.x +=
      (targetRotX - groupRef.current.rotation.x) * 2 * delta;
    groupRef.current.rotation.z +=
      (targetRotZ - groupRef.current.rotation.z) * 2 * delta;

    // Scroll-based scale down + fade
    const s = 1 - scrollProgress * 0.3;
    groupRef.current.scale.setScalar(Math.max(s, 0.5));
  });

  const scale = Math.min(viewport.width / 6, 1.2);

  return (
    <group ref={groupRef} scale={scale}>
      {/* Upper chevron */}
      <ChevronShape yOffset={0.35} scale={1} />
      {/* Lower chevron */}
      <ChevronShape yOffset={-0.35} scale={1} />
    </group>
  );
}

interface LogoTotem3DProps {
  className?: string;
  scrollProgress?: number;
}

export function LogoTotem3D({ className, scrollProgress = 0 }: LogoTotem3DProps) {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className={className}>
      <Canvas
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <PerformanceMonitor
            onDecline={() => setDpr(1)}
            onIncline={() =>
              setDpr(Math.min(window.devicePixelRatio, 2))
            }
          >
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.2}
              color="#FFF8F0"
            />
            <directionalLight
              position={[-3, -2, 4]}
              intensity={0.3}
              color="#F5C563"
            />
            <pointLight position={[0, 0, 3]} intensity={0.5} color="#E58A0F" />
            <TotemMesh scrollProgress={scrollProgress} />
          </PerformanceMonitor>
        </Suspense>
      </Canvas>
    </div>
  );
}
