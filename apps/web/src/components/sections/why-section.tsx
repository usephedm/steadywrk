"use client";

import { Badge, Card, FadeIn, GlowOrb, Stagger, StaggerItem, TiltCard } from "@steadywrk/ui";
import { WHY_US } from "../../lib/data";

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
							This isn't a course.{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								It's a career launch.
							</span>
						</h2>
					</div>
				</FadeIn>

				<Stagger className="mt-16 grid gap-6 sm:grid-cols-2" staggerDelay={0.12}>
					{WHY_US.map((item) => (
						<StaggerItem key={item.title}>
							<TiltCard>
								<Card hover className="h-full p-8">
									<h3 className="text-lg font-bold">{item.title}</h3>
									<p className="mt-3 text-sm leading-relaxed text-dark-700">{item.desc}</p>
								</Card>
							</TiltCard>
						</StaggerItem>
					))}
				</Stagger>
			</div>
		</section>
	);
}
