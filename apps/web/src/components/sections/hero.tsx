"use client";

import { useGSAP } from "@gsap/react";
import { Button, GlowOrb, LogoMark, ParallaxLayer, TextReveal } from "@steadywrk/ui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ParticleField } from "../effects/particle-field";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HeroScene = dynamic(
	() => import("../three/hero-scene").then((m) => ({ default: m.HeroScene })),
	{ ssr: false },
);

function useIsDesktop() {
	const [desktop, setDesktop] = useState(false);
	useEffect(() => {
		setDesktop(window.matchMedia("(hover: hover) and (min-width: 768px)").matches);
	}, []);
	return desktop;
}

export function Hero() {
	const ref = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});
	const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
	const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
	const isDesktop = useIsDesktop();

	useGSAP(
		() => {
			if (!contentRef.current) return;

			const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

			// Logo scales in
			tl.fromTo(
				".hero-logo",
				{ scale: 2.5, opacity: 0 },
				{ scale: 1, opacity: 1, duration: 0.6, ease: "cubic-bezier(0.25,0.4,0.25,1)" },
			);

			// Badge slides down
			tl.fromTo(
				".hero-badge",
				{ y: -20, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.3 },
				"+=0.1",
			);

			// Headline fades in (TextReveal handles char split internally)
			tl.fromTo(".hero-headline", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "+=0.1");

			// Subheadline fades
			tl.fromTo(
				".hero-subheadline",
				{ y: 15, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.4 },
				"+=0.2",
			);

			// CTAs slide up
			tl.fromTo(".hero-ctas", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, "-=0.1");

			// Trust indicators
			tl.fromTo(".hero-trust", { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, "-=0.1");
		},
		{ scope: contentRef },
	);

	return (
		<section
			ref={ref}
			className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pt-16"
		>
			{/* 3D scene or particle fallback */}
			{isDesktop ? <HeroScene /> : <ParticleField />}

			{/* Background glow */}
			<GlowOrb className="h-[600px] w-[600px] -top-40 left-1/2 -translate-x-1/2" />
			<GlowOrb className="h-[300px] w-[300px] top-1/2 -left-20" />

			{/* Grid pattern */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			<motion.div ref={contentRef} style={{ y, opacity }} className="relative z-10 text-center">
				{/* Logo reveal */}
				<div className="hero-logo mb-6 flex justify-center" style={{ opacity: 0 }}>
					<LogoMark className="h-16 w-auto md:h-20" />
				</div>

				{/* Status badge */}
				<div
					className="hero-badge mb-8 inline-flex items-center gap-2 rounded-full border border-dark-300 bg-dark-200/80 px-4 py-2 text-xs backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
					style={{ opacity: 0 }}
				>
					<span className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
					</span>
					<span className="text-dark-700">Now recruiting in all US markets</span>
				</div>

				{/* Headline */}
				<div className="hero-headline" style={{ opacity: 0 }}>
					<h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
						<TextReveal delay={0.9} stagger={0.025}>
							The dispatch protocol
						</TextReveal>
						<br />
						<span className="bg-gradient-to-r from-amber-400 via-amber to-amber-600 bg-clip-text text-transparent">
							<TextReveal delay={1.4} stagger={0.03}>
								that never sleeps.
							</TextReveal>
						</span>
					</h1>
				</div>

				{/* Subheadline */}
				<div className="hero-subheadline" style={{ opacity: 0 }}>
					<p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-dark-700 sm:text-lg md:text-xl">
						AI-orchestrated field service dispatch. We connect businesses to independent technicians
						through an autonomous matching engine.{" "}
						<span className="text-dark-800">No call centers. No middlemen. Just work.</span>
					</p>
				</div>

				{/* CTAs */}
				<div className="hero-ctas" style={{ opacity: 0 }}>
					<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
						<a href="#apply">
							<Button size="lg">
								Join the Network
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="h-4 w-4"
									aria-hidden="true"
									role="img"
								>
									<path
										fillRule="evenodd"
										d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
										clipRule="evenodd"
									/>
								</svg>
							</Button>
						</a>
						<a href="#solutions">
							<Button variant="outline" size="lg">
								See How It Works
							</Button>
						</a>
					</div>
				</div>

				{/* Trust indicators */}
				<ParallaxLayer speed={0.2}>
					<div
						className="hero-trust mt-16 flex flex-wrap items-center justify-center gap-6 text-xs text-dark-600"
						style={{ opacity: 0 }}
					>
						{["MCP-Native", "Multi-Agent AI", "Zero Franchise Fees"].map((label) => (
							<span key={label} className="flex items-center gap-1.5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="h-3.5 w-3.5 text-green-500"
									aria-hidden="true"
									role="img"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
										clipRule="evenodd"
									/>
								</svg>
								{label}
							</span>
						))}
					</div>
				</ParallaxLayer>
			</motion.div>

			{/* Scroll indicator */}
			<motion.div
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
				animate={{ y: [0, 8, 0] }}
				transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					className="h-5 w-5 text-dark-600"
					aria-hidden="true"
					role="img"
				>
					<path d="M12 5v14M19 12l-7 7-7-7" />
				</svg>
			</motion.div>
		</section>
	);
}
