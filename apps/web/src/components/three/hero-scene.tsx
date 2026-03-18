"use client";

import { Float, PointMaterial, Points, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import type * as THREE from "three";

function FloatingShape({
	position,
	size,
	speed,
}: { position: [number, number, number]; size: number; speed: number }) {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.x += delta * speed * 0.2;
			meshRef.current.rotation.y += delta * speed * 0.15;
			// Pulse emissive intensity with time
			const mat = meshRef.current.material as THREE.MeshStandardMaterial;
			mat.emissiveIntensity = 1.2 + Math.sin(state.clock.elapsedTime * speed) * 0.5;
		}
	});

	return (
		<Float speed={speed} rotationIntensity={0.4} floatIntensity={0.6}>
			<mesh ref={meshRef} position={position}>
				<icosahedronGeometry args={[size, 1]} />
				<meshStandardMaterial
					color="#EB7C00"
					emissive="#EB7C00"
					emissiveIntensity={1.5}
					wireframe
					transparent
					opacity={0.15}
				/>
			</mesh>
		</Float>
	);
}

/** Neural network-style connections between particles */
function NeuralNetwork() {
	const groupRef = useRef<THREE.Group>(null);
	const nodesRef = useRef<THREE.Points>(null);

	const { nodePositions, linePositions } = useMemo(() => {
		const nodeCount = 30;
		const nodes = new Float32Array(nodeCount * 3);
		const lines: number[] = [];

		for (let i = 0; i < nodeCount; i++) {
			nodes[i * 3] = (Math.random() - 0.5) * 12;
			nodes[i * 3 + 1] = (Math.random() - 0.5) * 8;
			nodes[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3;
		}

		// Connect nearby nodes
		for (let i = 0; i < nodeCount; i++) {
			for (let j = i + 1; j < nodeCount; j++) {
				const ix = i * 3;
				const jx = j * 3;
				const dx = (nodes[ix] ?? 0) - (nodes[jx] ?? 0);
				const dy = (nodes[ix + 1] ?? 0) - (nodes[jx + 1] ?? 0);
				const dz = (nodes[ix + 2] ?? 0) - (nodes[jx + 2] ?? 0);
				const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
				if (dist < 5) {
					lines.push(
						nodes[ix] ?? 0,
						nodes[ix + 1] ?? 0,
						nodes[ix + 2] ?? 0,
						nodes[jx] ?? 0,
						nodes[jx + 1] ?? 0,
						nodes[jx + 2] ?? 0,
					);
				}
			}
		}

		return { nodePositions: nodes, linePositions: new Float32Array(lines) };
	}, []);

	useFrame((state, delta) => {
		if (groupRef.current) {
			groupRef.current.rotation.y += delta * 0.015;
			groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
		}
	});

	return (
		<group ref={groupRef}>
			<Points ref={nodesRef} positions={nodePositions} stride={3} frustumCulled={false}>
				<PointMaterial
					color="#EB7C00"
					size={0.06}
					transparent
					opacity={0.6}
					sizeAttenuation
					depthWrite={false}
				/>
			</Points>
			<lineSegments>
				<bufferGeometry>
					<bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
				</bufferGeometry>
				<lineBasicMaterial color="#EB7C00" transparent opacity={0.08} />
			</lineSegments>
		</group>
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
					color="#EB7C00"
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
			<pointLight position={[0, 0, 2]} color="#EB7C00" intensity={0.3} />
			<pointLight position={[5, 3, -5]} color="#EB7C00" intensity={0.15} />
			<Stars radius={50} depth={80} count={3000} factor={4} saturation={0} fade speed={0.5} />
			<FloatingShape position={[-3, 2, -2]} size={0.8} speed={1.2} />
			<FloatingShape position={[3.5, -1.5, -3]} size={1} speed={0.8} />
			<FloatingShape position={[0, 3, -4]} size={0.6} speed={1.5} />
			<FloatingShape position={[-2, -2.5, -1]} size={0.5} speed={1} />
			<FloatingShape position={[4, 1, -5]} size={1.2} speed={0.6} />
			<NeuralNetwork />
			<AmbientParticles />
			<MouseParallax />
			<EffectComposer>
				<Bloom intensity={0.6} luminanceThreshold={0.7} luminanceSmoothing={0.9} />
				<Noise opacity={0.02} />
				<Vignette darkness={0.5} offset={0.3} />
			</EffectComposer>
		</Canvas>
	);
}
