"use client";

import { Badge, FadeIn, useScrollInView } from "@steadywrk/ui";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const CITIES = [
	{ name: "New York", x: 78, y: 28 },
	{ name: "Los Angeles", x: 12, y: 42 },
	{ name: "Chicago", x: 60, y: 26 },
	{ name: "Houston", x: 48, y: 58 },
	{ name: "Phoenix", x: 22, y: 48 },
	{ name: "Miami", x: 78, y: 62 },
	{ name: "Seattle", x: 12, y: 12 },
	{ name: "Denver", x: 32, y: 32 },
	{ name: "Atlanta", x: 70, y: 48 },
	{ name: "Dallas", x: 45, y: 52 },
];

const ROUTES = [
	{ from: 0, to: 2 },
	{ from: 2, to: 7 },
	{ from: 7, to: 1 },
	{ from: 3, to: 9 },
	{ from: 5, to: 8 },
	{ from: 6, to: 1 },
];

export function MapSection() {
	const ref = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const isInView = useScrollInView(ref, { once: true });

	useEffect(() => {
		if (!isInView || !svgRef.current) return;

		const dots = svgRef.current.querySelectorAll(".map-dot");
		const lines = svgRef.current.querySelectorAll(".route-line");

		// Pulse dots
		dots.forEach((dot, i) => {
			gsap.fromTo(
				dot,
				{ scale: 0, opacity: 0, transformOrigin: "center" },
				{ scale: 1, opacity: 1, duration: 0.5, delay: i * 0.1, ease: "back.out(2)" },
			);

			gsap.to(dot, {
				scale: 1.3,
				opacity: 0.6,
				duration: 1.5,
				delay: 1 + i * 0.2,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
		});

		// Animate route lines with dash offset
		lines.forEach((line, i) => {
			const el = line as SVGLineElement;
			const length = Math.hypot(
				Number.parseFloat(el.getAttribute("x2") ?? "0") -
					Number.parseFloat(el.getAttribute("x1") ?? "0"),
				Number.parseFloat(el.getAttribute("y2") ?? "0") -
					Number.parseFloat(el.getAttribute("y1") ?? "0"),
			);
			gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
			gsap.to(el, {
				strokeDashoffset: 0,
				duration: 1.5,
				delay: 0.5 + i * 0.3,
				ease: "power2.out",
			});
		});
	}, [isInView]);

	return (
		<section ref={ref} className="border-t border-dark-300/50 py-24 md:py-32">
			<div className="mx-auto max-w-7xl px-6">
				<FadeIn>
					<div className="text-center">
						<Badge variant="amber" className="mb-4">
							Coverage
						</Badge>
						<h2 className="text-3xl font-bold md:text-5xl">
							Nationwide.{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								Expanding fast.
							</span>
						</h2>
					</div>
				</FadeIn>

				<FadeIn delay={0.2} className="mt-12">
					<div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-dark-300 bg-dark-200 p-8 shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)]">
						<svg
							ref={svgRef}
							viewBox="0 0 100 70"
							className="w-full"
							aria-label="US coverage map"
							role="img"
						>
							{/* Route lines */}
							{ROUTES.map((route) => {
								const fromCity = CITIES[route.from];
								const toCity = CITIES[route.to];
								if (!fromCity || !toCity) return null;
								return (
									<line
										key={`${route.from}-${route.to}`}
										className="route-line"
										x1={fromCity.x}
										y1={fromCity.y}
										x2={toCity.x}
										y2={toCity.y}
										stroke="#E07800"
										strokeWidth="0.3"
										opacity="0.4"
									/>
								);
							})}
							{/* City dots */}
							{CITIES.map((city, _i) => (
								<g key={city.name}>
									<circle className="map-dot" cx={city.x} cy={city.y} r="1.2" fill="#E07800" />
									<text
										x={city.x}
										y={city.y - 2.5}
										textAnchor="middle"
										fill="#888"
										fontSize="2"
										fontFamily="monospace"
									>
										{city.name}
									</text>
								</g>
							))}
						</svg>
					</div>
				</FadeIn>
			</div>
		</section>
	);
}
