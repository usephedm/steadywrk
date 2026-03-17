"use client";

import { Float, PointMaterial, Points, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import type * as THREE from "three";

function FloatingShape({
	position,
	size,
	speed,
}: { position: [number, number, number]; size: number; speed: number }) {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((_, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.x += delta * speed * 0.2;
			meshRef.current.rotation.y += delta * speed * 0.15;
		}
	});

	return (
		<Float speed={speed} rotationIntensity={0.4} floatIntensity={0.6}>
			<mesh ref={meshRef} position={position}>
				<icosahedronGeometry args={[size, 1]} />
				<meshStandardMaterial
					color="#E07800"
					emissive="#E07800"
					emissiveIntensity={1.5}
					wireframe
					transparent
					opacity={0.15}
				/>
			</mesh>
		</Float>
	);
}

function AmbientParticles() {
	const pointsRef = useRef<THREE.Group>(null);

	const positions = useMemo(() => {
		const pos = new Float32Array(500 * 3);
		for (let i = 0; i < 500; i++) {
			const r = 15 * Math.cbrt(Math.random());
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
			pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
			pos[i * 3 + 2] = r * Math.cos(phi);
		}
		return pos;
	}, []);

	useFrame((_, delta) => {
		if (pointsRef.current) {
			pointsRef.current.rotation.y += delta * 0.02;
			pointsRef.current.rotation.x += delta * 0.01;
		}
	});

	return (
		<group ref={pointsRef}>
			<Points positions={positions} stride={3} frustumCulled={false}>
				<PointMaterial
					color="#E07800"
					size={0.02}
					transparent
					opacity={0.4}
					sizeAttenuation
					depthWrite={false}
				/>
			</Points>
		</group>
	);
}

function MouseParallax() {
	const { camera } = useThree();
	const mouse = useRef({ x: 0, y: 0 });

	useMemo(() => {
		if (typeof window === "undefined") return;
		const handler = (e: MouseEvent) => {
			mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
			mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
		};
		window.addEventListener("mousemove", handler);
		return () => window.removeEventListener("mousemove", handler);
	}, []);

	useFrame(() => {
		camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.03;
		camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.03;
		camera.lookAt(0, 0, 0);
	});

	return null;
}

export function HeroScene() {
	return (
		<Canvas
			dpr={[1, 1.5]}
			camera={{ position: [0, 0, 8], fov: 60 }}
			style={{ position: "absolute", inset: 0 }}
			gl={{ antialias: false, alpha: true }}
		>
			<ambientLight intensity={0.2} />
			<pointLight position={[0, 0, 2]} color="#E07800" intensity={0.3} />
			<Stars radius={50} depth={80} count={3000} factor={4} saturation={0} fade speed={0.5} />
			<FloatingShape position={[-3, 2, -2]} size={0.8} speed={1.2} />
			<FloatingShape position={[3.5, -1.5, -3]} size={1} speed={0.8} />
			<FloatingShape position={[0, 3, -4]} size={0.6} speed={1.5} />
			<FloatingShape position={[-2, -2.5, -1]} size={0.5} speed={1} />
			<FloatingShape position={[4, 1, -5]} size={1.2} speed={0.6} />
			<AmbientParticles />
			<MouseParallax />
			<EffectComposer>
				<Bloom intensity={0.5} luminanceThreshold={0.8} luminanceSmoothing={0.9} />
				<Noise opacity={0.02} />
			</EffectComposer>
		</Canvas>
	);
}
