"use client";

import { Badge, Card, CardDescription, CardTitle, FadeIn, TiltCard } from "@steadywrk/ui";

const STEPS = [
	{
		num: "01",
		title: "Apply in 60 seconds",
		desc: "No CV. No wasta. Just tell us who you are and why you want to work with AI. We read every application within 48 hours.",
		icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
	},
	{
		num: "02",
		title: "1-month paid training",
		desc: "Intensive hands-on bootcamp. Claude, ChatGPT, Cursor, prompt engineering, AI workflows — you'll learn the tools that make one person worth a team of five.",
		icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
	},
	{
		num: "03",
		title: "Join the team, work on real projects",
		desc: "Graduate and you're on the SteadyWrk team. Real clients, real projects, real pay. AI-powered operations, digital marketing, development — remote from Jordan.",
		icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
	},
];

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
	return (
		<section id="program" className="relative border-t border-dark-300/50 py-24 md:py-32">
			<div className="mx-auto max-w-7xl px-6">
				<FadeIn>
					<div className="text-center">
						<Badge variant="amber" className="mb-4">
							How It Works
						</Badge>
						<h2 className="text-3xl font-bold md:text-5xl">
							Apply. Train.{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								Work.
							</span>
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-dark-700">
							No gatekeeping. No prerequisites. You apply, we train you, and you start working on real projects — all within your first month.
						</p>
					</div>
				</FadeIn>

				<div className="mt-16 grid gap-6 md:grid-cols-3">
					{STEPS.map((step) => (
						<FadeIn key={step.num} delay={Number(step.num) * 0.1}>
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
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}
