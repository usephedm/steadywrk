"use client";

import { useGSAP } from "@gsap/react";
import { Badge, Button, Card, FadeIn, MagneticButton, TiltCard } from "@steadywrk/ui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { PRICING } from "../../lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function PricingSection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!cardsRef.current) return;

			const cards = cardsRef.current.querySelectorAll(".pricing-card");
			gsap.fromTo(
				cards,
				{ y: 50, opacity: 0, scale: 0.95 },
				{
					y: 0,
					opacity: 1,
					scale: 1,
					stagger: 0.12,
					ease: "power2.out",
					scrollTrigger: {
						trigger: cardsRef.current,
						start: "top 80%",
						end: "top 40%",
						scrub: 1,
					},
				},
			);
		},
		{ scope: sectionRef },
	);

	return (
		<section id="pricing" ref={sectionRef} className="border-t border-dark-300/50 py-24 md:py-32">
			<div className="mx-auto max-w-7xl px-6">
				<FadeIn>
					<div className="text-center">
						<Badge variant="amber" className="mb-4">
							Pricing
						</Badge>
						<h2 className="text-3xl font-bold md:text-5xl">
							Simple pricing.{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								Honest value.
							</span>
						</h2>
					</div>
				</FadeIn>

				<div ref={cardsRef} className="mt-16 grid gap-6 md:grid-cols-3">
					{PRICING.map((plan) => (
						<div key={plan.name} className="pricing-card" style={{ opacity: 0 }}>
							<TiltCard>
								<Card
									hover
									className={`relative h-full p-8 ${
										plan.highlighted ? "border-amber/50 shadow-[0_0_40px_rgba(224,120,0,0.08)]" : ""
									}`}
								>
									{/* Animated border for Pro card */}
									{plan.highlighted && (
										<>
											<div className="absolute -top-3 left-1/2 -translate-x-1/2">
												<Badge variant="amber">Most Popular</Badge>
											</div>
											<div
												className="pointer-events-none absolute inset-0 rounded-xl opacity-30"
												style={{
													background:
														"conic-gradient(from var(--angle, 0deg), transparent 60%, #E07800 100%)",
													mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
													maskComposite: "exclude",
													padding: "1px",
													animation: "rotate-border 4s linear infinite",
												}}
											/>
										</>
									)}
									<div className="mb-6">
										<h3 className="text-lg font-bold">{plan.name}</h3>
										<p className="mt-1 text-sm text-dark-700">{plan.desc}</p>
									</div>
									<div className="mb-6">
										<span className="text-4xl font-black">{plan.price}</span>
										{plan.period && <span className="text-sm text-dark-700">{plan.period}</span>}
									</div>
									<ul className="mb-8 space-y-3">
										{plan.features.map((f) => (
											<li key={f} className="flex items-center gap-2 text-sm text-dark-800">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20"
													fill="currentColor"
													className="h-4 w-4 shrink-0 text-amber"
													aria-hidden="true"
													role="img"
												>
													<path
														fillRule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clipRule="evenodd"
													/>
												</svg>
												{f}
											</li>
										))}
									</ul>
									<MagneticButton>
										<Button variant={plan.highlighted ? "primary" : "secondary"} className="w-full">
											{plan.cta}
										</Button>
									</MagneticButton>
								</Card>
							</TiltCard>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
