"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { useRef } from "react";
import { STATS, TRUST_BADGES } from "../../lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function AnimatedNumber({ value, className }: { value: string; className?: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const numericValue = Number.parseInt(value, 10);
	const isNumeric = !Number.isNaN(numericValue);

	useGSAP(
		() => {
			if (!ref.current || !isNumeric) return;

			const obj = { value: 0 };
			gsap.to(obj, {
				value: numericValue,
				duration: 2,
				ease: "power2.out",
				snap: { value: 1 },
				scrollTrigger: {
					trigger: ref.current,
					start: "top 85%",
					toggleActions: "play none none none",
				},
				onUpdate: () => {
					if (ref.current) ref.current.textContent = String(Math.round(obj.value));
				},
			});
		},
		{ scope: ref },
	);

	return (
		<span ref={ref} className={className}>
			{isNumeric ? "0" : value}
		</span>
	);
}

export function StatsSection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const statsRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!statsRef.current) return;

			const items = statsRef.current.querySelectorAll(".stat-item");
			gsap.fromTo(
				items,
				{ y: 30, opacity: 0, scale: 0.9 },
				{
					y: 0,
					opacity: 1,
					scale: 1,
					stagger: 0.1,
					ease: "power2.out",
					scrollTrigger: {
						trigger: statsRef.current,
						start: "top 85%",
						toggleActions: "play none none none",
					},
				},
			);
		},
		{ scope: sectionRef },
	);

	return (
		<section ref={sectionRef} className="border-t border-dark-300/50 py-20 overflow-hidden">
			<div ref={statsRef} className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
				{STATS.map((stat) => (
					<div key={stat.label} className="stat-item text-center" style={{ opacity: 0 }}>
						<AnimatedNumber
							value={stat.value}
							className="block text-3xl font-black text-amber md:text-4xl"
						/>
						<div className="mt-1 text-sm font-semibold">{stat.label}</div>
						<div className="mt-1 text-xs text-dark-600">{stat.detail}</div>
					</div>
				))}
			</div>

			<div className="mt-12 overflow-hidden">
				<motion.div
					className="flex gap-8 whitespace-nowrap text-xs text-dark-600"
					animate={{ x: ["0%", "-50%"] }}
					transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
				>
					{["set-a", "set-b"].map((setId) => (
						<div key={setId} className="flex gap-8">
							{TRUST_BADGES.map((badge) => (
								<span
									key={badge}
									className="flex items-center gap-2 px-4 py-2 rounded-full border border-dark-300/50 bg-dark-200/50"
								>
									<span className="h-1.5 w-1.5 rounded-full bg-amber/50" />
									{badge}
								</span>
							))}
						</div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
