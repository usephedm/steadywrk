"use client";

import { Button, GlowOrb, LogoMark } from "@steadywrk/ui";
import { motion } from "motion/react";

export function Hero() {
	return (
		<section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pt-16">
			<GlowOrb className="h-[600px] w-[600px] -top-40 left-1/2 -translate-x-1/2" />

			{/* Grid background */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="relative z-10 text-center"
			>
				<div className="mb-6 flex justify-center">
					<LogoMark className="h-16 w-auto md:h-20" />
				</div>

				<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-dark-300 bg-dark-200/80 px-4 py-2 text-xs backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
					<span className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
					</span>
					<span className="text-dark-700">Cohort #1 — Applications open</span>
				</div>

				<h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
					We train you.
					<br />
					<span className="bg-gradient-to-r from-amber-400 via-amber to-amber-600 bg-clip-text text-transparent">
						We hire you.
					</span>
				</h1>

				{/* Arabic subheadline */}
				<p className="mx-auto mt-4 text-lg text-dark-600 font-semibold" dir="rtl" lang="ar">
					ندرّبك على الذكاء الاصطناعي. نوظّفك. من الأردن للعالم.
				</p>

				<p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-dark-700 sm:text-lg md:text-xl">
					SteadyWrk is building Jordan&apos;s first AI workforce. One-month paid training on 20+ AI tools,
					then you join the team and work on real international projects.{" "}
					<span className="text-dark-800">
						No degree. No experience. No wasta. Just hunger.
					</span>
				</p>

				<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
					<a href="#apply">
						<Button size="lg">
							Apply Now
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="h-4 w-4"
								aria-hidden="true"
								role="img"
							>
								<path
									fillRule="evenodd"
									d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
									clipRule="evenodd"
								/>
							</svg>
						</Button>
					</a>
					<a href="#program">
						<Button variant="outline" size="lg">
							How It Works
						</Button>
					</a>
				</div>

				<div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-dark-600">
					{["Paid Training", "No Degree Required", "Remote from Jordan", "Real International Projects"].map((label) => (
						<span key={label} className="flex items-center gap-1.5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="h-3.5 w-3.5 text-green-500"
								aria-hidden="true"
								role="img"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
									clipRule="evenodd"
								/>
							</svg>
							{label}
						</span>
					))}
				</div>
			</motion.div>

			<motion.div
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
				animate={{ y: [0, 8, 0] }}
				transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					className="h-5 w-5 text-dark-600"
					aria-hidden="true"
					role="img"
				>
					<path d="M12 5v14M19 12l-7 7-7-7" />
				</svg>
			</motion.div>
		</section>
	);
}
