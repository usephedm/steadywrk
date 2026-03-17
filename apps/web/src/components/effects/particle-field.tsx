"use client";

import { useEffect, useRef } from "react";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	alpha: number;
}

export function ParticleField({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let raf: number;
		const particles: Particle[] = [];
		const count = 60;

		const resize = () => {
			canvas.width = canvas.offsetWidth * devicePixelRatio;
			canvas.height = canvas.offsetHeight * devicePixelRatio;
			ctx.scale(devicePixelRatio, devicePixelRatio);
		};
		resize();
		window.addEventListener("resize", resize);

		for (let i = 0; i < count; i++) {
			particles.push({
				x: Math.random() * canvas.offsetWidth,
				y: Math.random() * canvas.offsetHeight,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				size: Math.random() * 2 + 0.5,
				alpha: Math.random() * 0.5 + 0.1,
			});
		}

		const animate = () => {
			ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;

				if (p.x < 0) p.x = canvas.offsetWidth;
				if (p.x > canvas.offsetWidth) p.x = 0;
				if (p.y < 0) p.y = canvas.offsetHeight;
				if (p.y > canvas.offsetHeight) p.y = 0;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(224, 120, 0, ${p.alpha})`;
				ctx.fill();
			}

			raf = requestAnimationFrame(animate);
		};
		raf = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, []);

	return <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full ${className ?? ""}`} />;
}
