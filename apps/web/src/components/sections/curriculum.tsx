"use client";

import { Badge, Card, FadeIn, GlowOrb } from "@steadywrk/ui";

const CURRICULUM = [
	{
		title: "Prompt Engineering",
		desc: "Master the art of communicating with AI. Write system prompts, chain-of-thought reasoning, and structured outputs that produce professional-grade results.",
	},
	{
		title: "AI-Assisted Coding",
		desc: "Build software with Claude Code, Cursor, and Copilot. You don't need to be a programmer — you need to direct AI to build what you imagine.",
	},
	{
		title: "AI Operations & Workflows",
		desc: "Design end-to-end business workflows powered by AI. Automate repetitive tasks, build pipelines, and learn to orchestrate multiple AI agents.",
	},
	{
		title: "Digital Marketing with AI",
		desc: "Create content, run campaigns, and analyze data using AI tools. SEO, copywriting, social media — all supercharged with AI assistance.",
	},
	{
		title: "Client Communication",
		desc: "Work with international clients. Professional communication, project management, and delivering results on time — the skills that get you paid.",
	},
	{
		title: "AI Tools Mastery",
		desc: "Claude, ChatGPT, Gemini, Cursor, v0, Notion AI, and 15+ more tools. You'll graduate knowing which tool to use for every task.",
	},
];

export function Curriculum() {
	return (
		<section
			id="curriculum"
			className="relative border-t border-dark-300/50 py-24 md:py-32"
		>
			<GlowOrb className="h-[400px] w-[400px] top-1/2 right-0 translate-x-1/2 -translate-y-1/2" />

			<div className="mx-auto max-w-7xl px-6">
				<FadeIn>
					<div className="text-center">
						<Badge variant="amber" className="mb-4">
							What You&apos;ll Learn
						</Badge>
						<h2 className="text-3xl font-bold md:text-5xl">
							Skills that{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								actually pay.
							</span>
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-dark-700">
							Our bootcamp covers the full AI toolkit — from prompt engineering to client delivery.
							Everything you need to become an AI-powered professional.
						</p>
					</div>
				</FadeIn>

				<div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{CURRICULUM.map((f, i) => (
						<FadeIn key={f.title} delay={i * 0.08}>
							<Card hover className="group h-full p-6">
								<div className="mb-3 h-1 w-8 rounded-full bg-amber/40 transition-all duration-300 group-hover:w-12 group-hover:bg-amber group-hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]" />
								<h3 className="text-base font-bold">{f.title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-dark-700">{f.desc}</p>
							</Card>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}
