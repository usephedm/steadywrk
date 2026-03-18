"use client";

import {
	Badge,
	Card,
	CardDescription,
	CardTitle,
	FadeIn,
	Stagger,
	StaggerItem,
	TiltCard,
} from "@steadywrk/ui";
import { ROLES } from "../../lib/data";
import { jobPostingSchema } from "../../lib/schemas";
import { JsonLd } from "../json-ld";

function parseSalary(s: string): { min: number; max: number } | undefined {
	const nums = s.match(/[\d,]+/g)?.map((n) => Number(n.replace(",", "")));
	if (nums && nums.length >= 2 && nums[0] !== undefined && nums[1] !== undefined)
		return { min: nums[0], max: nums[1] };
	return undefined;
}

export function Careers() {
	return (
		<section id="careers" className="border-t border-dark-300/50 py-24 md:py-32">
			{ROLES.map((role) => (
				<JsonLd
					key={`ld-${role.title}`}
					data={jobPostingSchema({
						title: role.title,
						description: role.desc,
						salary: parseSalary(role.salary),
						isRemote: /remote/i.test(role.badge),
					})}
				/>
			))}

			<div className="mx-auto max-w-7xl px-6">
				<FadeIn>
					<div className="text-center">
						<Badge variant="amber" className="mb-4">
							Open Roles
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
							Work with AI from{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								Amman.
							</span>
						</h2>
						<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-dark-700">
							Every role at SteadyWrk is AI-augmented. You'll work alongside AI tools daily — not as
							a gimmick, but as your actual workflow. Remote-friendly across Jordan and MENA.
						</p>
					</div>
				</FadeIn>

				<Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
					{ROLES.map((role) => (
						<StaggerItem key={role.title}>
							<TiltCard>
								<Card hover className="group relative flex h-full flex-col p-8">
									<span className="absolute right-4 top-4 rounded-full border border-amber/20 bg-amber/10 px-3 py-0.5 text-xs font-medium text-amber">
										{role.badge}
									</span>

									<span className="text-xs font-semibold uppercase tracking-wider text-dark-600">
										{role.trade}
									</span>

									<CardTitle className="mt-2">{role.title}</CardTitle>

									<CardDescription className="mt-3 flex-1">{role.desc}</CardDescription>

									<p className="mt-5 text-sm font-semibold text-amber/80">{role.salary}</p>

									<a
										href={role.href}
										className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-amber transition-all duration-200 group-hover:gap-3"
									>
										Apply <span aria-hidden="true">&rarr;</span>
									</a>
								</Card>
							</TiltCard>
						</StaggerItem>
					))}
				</Stagger>

				<FadeIn>
					<div className="mx-auto mt-20 max-w-3xl rounded-xl border border-amber/20 bg-amber/5 p-8 text-center shadow-[0_0_60px_rgba(245,158,11,0.06)] md:p-12">
						<h3 className="text-2xl font-bold md:text-3xl">
							New to AI?{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								Start with the bootcamp.
							</span>
						</h3>
						<p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-dark-700">
							Our 1-month AI bootcamp takes you from zero to job-ready. No prior tech experience
							needed. We teach you the tools, the workflows, and the professional skills. You bring
							the hunger. Based in Jordan or MENA? This is built for you.
						</p>
						<a
							href="#apply"
							className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber px-8 py-3 text-sm font-bold text-dark-100 transition-all duration-200 hover:gap-3 hover:bg-amber-400"
						>
							Apply for the Bootcamp <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</FadeIn>
			</div>
		</section>
	);
}
