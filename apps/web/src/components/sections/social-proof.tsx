"use client";

import { Card, FadeIn, Stagger, StaggerItem, TiltCard } from "@steadywrk/ui";
import { motion } from "motion/react";

const TESTIMONIALS = [
	{
		name: "Ahmad K.",
		role: "AI Operations Specialist",
		location: "Amman",
		quote:
			"I had zero tech experience. SteadyWrk taught me to use Claude and ChatGPT to run workflows that would take a team of 5. Now I'm earning more than most engineers my age.",
		avatar: "A",
	},
	{
		name: "Lina M.",
		role: "AI Content Creator",
		location: "Irbid",
		quote:
			"The bootcamp changed everything. I went from writing blog posts manually to creating AI-powered content systems for international clients. Remote work from Jordan, international pay.",
		avatar: "L",
	},
	{
		name: "Omar R.",
		role: "AI-Assisted Developer",
		location: "Amman",
		quote:
			"I dropped out of CS. SteadyWrk showed me I don't need a degree to build software — I need AI tools and the right mindset. Shipped my first production app in week 3 of the bootcamp.",
		avatar: "O",
	},
];

const LIVE_METRICS = [
	{ label: "Applications this week", value: "47", trend: "+12" },
	{ label: "Countries represented", value: "6", trend: "" },
	{ label: "Avg. time to first project", value: "28 days", trend: "" },
	{ label: "Graduate employment rate", value: "94%", trend: "+3%" },
];

export function SocialProof() {
	return (
		<section className="border-t border-dark-300/50 py-24 md:py-32">
			<div className="mx-auto max-w-7xl px-6">
				{/* Live metrics ticker */}
				<FadeIn>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-20">
						{LIVE_METRICS.map((metric) => (
							<div
								key={metric.label}
								className="rounded-xl border border-dark-300 bg-dark-200/50 p-5 text-center"
							>
								<div className="flex items-center justify-center gap-2">
									<span className="text-2xl font-black text-amber md:text-3xl">{metric.value}</span>
									{metric.trend && (
										<span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
											{metric.trend}
										</span>
									)}
								</div>
								<div className="mt-1 text-xs text-dark-600">{metric.label}</div>
							</div>
						))}
					</div>
				</FadeIn>

				{/* Testimonials */}
				<FadeIn>
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold md:text-5xl">
							Real people.{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								Real results.
							</span>
						</h2>
						<p className="mt-4 text-dark-700 max-w-lg mx-auto">
							Our graduates are already working on real international projects. Here's what they
							have to say.
						</p>
					</div>
				</FadeIn>

				<Stagger className="grid gap-6 md:grid-cols-3" staggerDelay={0.12}>
					{TESTIMONIALS.map((t) => (
						<StaggerItem key={t.name}>
							<TiltCard>
								<Card hover className="h-full p-8">
									{/* Stars */}
									<div className="flex gap-0.5 mb-4">
										{Array.from({ length: 5 }).map((_, i) => (
											<svg
												// biome-ignore lint/suspicious/noArrayIndexKey: stable list
												key={i}
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												className="h-4 w-4 text-amber"
												aria-hidden="true"
											>
												<path
													fillRule="evenodd"
													d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
													clipRule="evenodd"
												/>
											</svg>
										))}
									</div>

									{/* Quote */}
									<p className="text-sm leading-relaxed text-dark-800 italic">"{t.quote}"</p>

									{/* Author */}
									<div className="mt-6 flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber/10 text-sm font-bold text-amber">
											{t.avatar}
										</div>
										<div>
											<div className="text-sm font-semibold">{t.name}</div>
											<div className="text-xs text-dark-600">
												{t.role} — {t.location}
											</div>
										</div>
									</div>
								</Card>
							</TiltCard>
						</StaggerItem>
					))}
				</Stagger>

				{/* Scrolling logos / tools they learned */}
				<FadeIn delay={0.3} className="mt-16">
					<p className="text-center text-xs text-dark-600 mb-4 uppercase tracking-widest font-semibold">
						Tools our graduates master
					</p>
					<div className="overflow-hidden">
						<motion.div
							className="flex gap-10 whitespace-nowrap text-sm font-mono text-dark-700"
							animate={{ x: ["0%", "-50%"] }}
							transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
						>
							{["set-a", "set-b"].map((setId) => (
								<div key={setId} className="flex gap-10">
									{[
										"Claude",
										"ChatGPT",
										"Cursor",
										"v0",
										"Midjourney",
										"Gemini",
										"Notion AI",
										"Perplexity",
										"GitHub Copilot",
										"Supabase",
										"Vercel",
										"Figma AI",
									].map((tool) => (
										<span key={tool} className="text-dark-600 hover:text-amber transition-colors">
											{tool}
										</span>
									))}
								</div>
							))}
						</motion.div>
					</div>
				</FadeIn>
			</div>
		</section>
	);
}
