"use client";

import { Badge, Card, FadeIn, Stagger, StaggerItem, TiltCard } from "@steadywrk/ui";
import { ROLES } from "../../lib/data";

export function Careers() {
	return (
		<section id="careers" className="border-t border-dark-300/50 py-24 md:py-32">
			<div className="mx-auto max-w-7xl px-6">
				<FadeIn>
					<div className="text-center">
						<Badge variant="amber" className="mb-4">
							Join Us
						</Badge>
						<h2 className="text-3xl font-bold md:text-5xl">
							We're building the team.{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								Are you in?
							</span>
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-dark-700">
							SteadyWrk is a protocol, not a corporation. We need operators who think like founders.
						</p>
					</div>
				</FadeIn>

				<Stagger className="mt-16 grid gap-6 md:grid-cols-3" staggerDelay={0.12}>
					{ROLES.map((role) => (
						<StaggerItem key={role.title}>
							<TiltCard>
								<Card hover className="group h-full p-8">
									<Badge variant="amber">{role.tag}</Badge>
									<h3 className="mt-4 text-xl font-bold">{role.title}</h3>
									<p className="mt-1 text-sm text-amber/70">{role.subtitle}</p>
									<p className="mt-4 text-sm leading-relaxed text-dark-700">{role.description}</p>
									<a
										href="#apply"
										className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-amber transition-all duration-200 group-hover:gap-2.5"
									>
										Apply <span aria-hidden="true">&rarr;</span>
									</a>
								</Card>
							</TiltCard>
						</StaggerItem>
					))}
				</Stagger>
			</div>
		</section>
	);
}
