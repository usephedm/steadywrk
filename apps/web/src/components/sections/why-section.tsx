"use client";

import { Badge, Card, FadeIn, GlowOrb } from "@steadywrk/ui";

const WHY_US = [
	{
		title: "This isn't a course. It's a job.",
		desc: "We don't just teach you AI and wish you luck. You train with us, then you work with us. Real clients, real projects, real paycheck.",
	},
	{
		title: "No wasta. No degree. Just you.",
		desc: "We don't care about your family name or your university. We care about your work ethic and your willingness to learn.",
	},
	{
		title: "AI makes one person worth five.",
		desc: "A person with the right AI tools can outperform a team without them. We teach you to be that person.",
	},
	{
		title: "Get ahead while it's early.",
		desc: "Every company will need AI-skilled operators. The ones who learn now will lead later. Don't wait until everyone catches up.",
	},
];

export function WhySection() {
	return (
		<section className="relative border-t border-dark-300/50 py-24 md:py-32">
			<GlowOrb className="h-[400px] w-[400px] top-1/3 left-0 -translate-x-1/2" />

			<div className="mx-auto max-w-7xl px-6">
				<FadeIn>
					<div className="text-center">
						<Badge variant="amber" className="mb-4">
							Why SteadyWrk
						</Badge>
						<h2 className="text-3xl font-bold md:text-5xl">
							Not a bootcamp.{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								A career.
							</span>
						</h2>
					</div>
				</FadeIn>

				<div className="mt-16 grid gap-6 sm:grid-cols-2">
					{WHY_US.map((item, i) => (
						<FadeIn key={item.title} delay={i * 0.1}>
							<Card hover className="h-full p-8">
								<h3 className="text-lg font-bold">{item.title}</h3>
								<p className="mt-3 text-sm leading-relaxed text-dark-700">{item.desc}</p>
							</Card>
						</FadeIn>
					))}
				</div>

				{/* Founder credibility */}
				<FadeIn delay={0.3}>
					<div className="mt-16 rounded-xl border border-dark-300 bg-dark-200/50 p-8 md:p-10">
						<div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
							<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber/10 text-2xl font-bold text-amber">
								V
							</div>
							<div>
								<p className="text-sm leading-relaxed text-dark-800">
									&ldquo;I built SteadyWrk because I&apos;ve seen what one person with AI tools can do —
									and I know Jordan is full of people with the hunger to learn it. We&apos;re starting small
									on purpose. Cohort #1 is about proving the model works, not scaling fast.&rdquo;
								</p>
								<p className="mt-3 text-sm font-semibold">
									V — Founder, SteadyWrk
								</p>
								<p className="text-xs text-dark-600">
									Kayan Ventures Jordan LLC · Amman, Jordan
								</p>
							</div>
						</div>
					</div>
				</FadeIn>
			</div>
		</section>
	);
}
