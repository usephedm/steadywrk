"use client";

import { useGSAP } from "@gsap/react";
import { Badge, Card, CardDescription, CardTitle, FadeIn, TiltCard } from "@steadywrk/ui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { PROGRAM_STEPS } from "../../lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Icon({ d, className }: { d: string; className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className ?? "h-5 w-5"}
			aria-hidden="true"
			role="img"
		>
			<path d={d} />
		</svg>
	);
}

export function Program() {
	const lineRef = useRef<SVGPathElement>(null);
	const sectionRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!lineRef.current || !sectionRef.current) return;

			const path = lineRef.current;
			const length = path.getTotalLength();
			gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

			gsap.to(path, {
				strokeDashoffset: 0,
				duration: 1.5,
				ease: "power2.out",
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 60%",
					end: "bottom 40%",
					toggleActions: "play none none none",
				},
			});

			if (cardsRef.current) {
				const cards = cardsRef.current.querySelectorAll(".step-card");
				gsap.fromTo(
					cards,
					{ y: 60, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						stagger: 0.15,
						ease: "power2.out",
						duration: 0.6,
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
			id="program"
			ref={sectionRef}
			className="relative border-t border-dark-300/50 py-24 md:py-32"
		>
			<div className="mx-auto max-w-7xl px-6">
				<FadeIn>
					<div className="text-center">
						<Badge variant="amber" className="mb-4">
							How It Works
						</Badge>
						<h2 className="text-3xl font-bold md:text-5xl">
							Three steps to your{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								AI career.
							</span>
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-dark-700">
							No gatekeeping. No prerequisites. Apply, train, and start working — all within your
							first month.
						</p>
					</div>
				</FadeIn>

				<svg
					className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-0.5 w-full md:block"
					aria-hidden="true"
				>
					<path
						ref={lineRef}
						d="M 200 1 L 600 1 L 1000 1"
						stroke="#F59E0B"
						strokeWidth="2"
						fill="none"
						opacity="0.3"
					/>
				</svg>

				<div ref={cardsRef} className="mt-16 grid gap-6 md:grid-cols-3">
					{PROGRAM_STEPS.map((step) => (
						<div key={step.num} className="step-card" style={{ opacity: 0 }}>
							<TiltCard>
								<Card hover className="group relative h-full overflow-hidden p-8">
									<div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-amber/5 transition-all duration-500 group-hover:bg-amber/10 group-hover:scale-150" />
									<div className="relative">
										<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10">
											<Icon d={step.icon} className="h-5 w-5 text-amber" />
										</div>
										<span className="font-mono text-xs text-amber">{step.num}</span>
										<CardTitle className="mt-2">{step.title}</CardTitle>
										<CardDescription className="mt-3">{step.desc}</CardDescription>
									</div>
								</Card>
							</TiltCard>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
