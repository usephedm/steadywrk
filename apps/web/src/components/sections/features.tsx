"use client";

import { useGSAP } from "@gsap/react";
import { Badge, Card, FadeIn, GlowOrb } from "@steadywrk/ui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { FEATURES } from "../../lib/data";
import { TerminalTyping } from "./terminal-typing";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Features() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!sectionRef.current) return;

			// Background gradient shift: move radial gradient from left to right as user scrolls
			gsap.fromTo(
				sectionRef.current,
				{ "--gradient-x": "0%" },
				{
					"--gradient-x": "100%",
					ease: "none",
					scrollTrigger: {
						trigger: sectionRef.current,
						start: "top bottom",
						end: "bottom top",
						scrub: 1,
					},
				},
			);

			// Stagger reveal on feature cards
			if (cardsRef.current) {
				const cards = cardsRef.current.querySelectorAll(".feature-card");
				gsap.fromTo(
					cards,
					{ y: 40, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						stagger: 0.08,
						ease: "power2.out",
						duration: 0.5,
						scrollTrigger: {
							trigger: cardsRef.current,
							start: "top 80%",
							end: "top 30%",
							toggleActions: "play none none none",
						},
					},
				);
			}
		},
		{ scope: sectionRef },
	);

	return (
		<section
			id="features"
			ref={sectionRef}
			className="relative border-t border-dark-300/50 py-24 md:py-32"
			style={
				{
					background:
						"radial-gradient(ellipse 600px 400px at var(--gradient-x, 0%) 50%, rgba(224,120,0,0.04), transparent)",
				} as React.CSSProperties
			}
		>
			<GlowOrb className="h-[400px] w-[400px] top-1/2 right-0 translate-x-1/2 -translate-y-1/2" />

			<div className="mx-auto max-w-7xl px-6">
				<FadeIn>
					<div className="text-center">
						<Badge variant="amber" className="mb-4">
							Platform
						</Badge>
						<h2 className="text-3xl font-bold md:text-5xl">
							Built different.{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								Literally.
							</span>
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-dark-700">
							MCP-native architecture. Multi-agent AI orchestration. Every dispatch decision is made
							by an autonomous system that learns and improves.
						</p>
					</div>
				</FadeIn>

				<div ref={cardsRef} className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{FEATURES.map((f) => (
						<div key={f.title} className="feature-card" style={{ opacity: 0 }}>
							<Card hover className="group h-full p-6">
								<div className="mb-3 h-1 w-8 rounded-full bg-amber/40 transition-all duration-300 group-hover:w-12 group-hover:bg-amber group-hover:shadow-[0_0_12px_rgba(224,120,0,0.3)]" />
								<h3 className="text-base font-bold">{f.title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-dark-700">{f.desc}</p>
							</Card>
						</div>
					))}
				</div>

				<FadeIn delay={0.3} className="mt-12">
					<TerminalTyping />
				</FadeIn>
			</div>
		</section>
	);
}
