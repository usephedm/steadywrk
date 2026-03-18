"use client";

import { Badge, FadeIn, GlowOrb } from "@steadywrk/ui";
import { useEffect, useState } from "react";

/** Next cohort start — update this date for each new cohort */
const NEXT_COHORT = new Date("2026-04-15T09:00:00+03:00");
const COHORT_NAME = "Cohort #1";
const TOTAL_SPOTS = 20;
const SPOTS_FILLED = 7;

function useCountdown(target: Date) {
	const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

	useEffect(() => {
		const tick = () => {
			const now = new Date();
			const diff = Math.max(0, target.getTime() - now.getTime());
			setTimeLeft({
				days: Math.floor(diff / (1000 * 60 * 60 * 24)),
				hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((diff / (1000 * 60)) % 60),
				seconds: Math.floor((diff / 1000) % 60),
			});
		};
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [target]);

	return timeLeft;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
	return (
		<div className="flex flex-col items-center">
			<div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-dark-300 bg-dark-200/80 font-mono text-2xl font-black text-amber shadow-[0_0_20px_rgba(245,158,11,0.08)] sm:h-20 sm:w-20 sm:text-3xl">
				{String(value).padStart(2, "0")}
			</div>
			<span className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-dark-600">
				{label}
			</span>
		</div>
	);
}

export function Countdown() {
	const { days, hours, minutes, seconds } = useCountdown(NEXT_COHORT);
	const spotsLeft = TOTAL_SPOTS - SPOTS_FILLED;
	const fillPercent = (SPOTS_FILLED / TOTAL_SPOTS) * 100;

	return (
		<section className="relative border-t border-dark-300/50 py-20 md:py-28 overflow-hidden">
			<GlowOrb className="h-[400px] w-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

			<div className="relative mx-auto max-w-4xl px-6 text-center">
				<FadeIn>
					<Badge variant="amber" className="mb-4">
						{COHORT_NAME} — Applications Open
					</Badge>
					<h2 className="text-3xl font-bold md:text-5xl">Next bootcamp starts in</h2>

					{/* Countdown */}
					<div className="mt-8 flex items-center justify-center gap-3 sm:gap-5">
						<TimeUnit value={days} label="Days" />
						<span className="text-2xl font-bold text-dark-500 -mt-6">:</span>
						<TimeUnit value={hours} label="Hours" />
						<span className="text-2xl font-bold text-dark-500 -mt-6">:</span>
						<TimeUnit value={minutes} label="Min" />
						<span className="text-2xl font-bold text-dark-500 -mt-6">:</span>
						<TimeUnit value={seconds} label="Sec" />
					</div>

					{/* Spots progress bar */}
					<div className="mx-auto mt-10 max-w-sm">
						<div className="flex items-center justify-between text-xs text-dark-700 mb-2">
							<span>
								<span className="text-amber font-bold">{spotsLeft}</span> spots remaining
							</span>
							<span>
								{SPOTS_FILLED}/{TOTAL_SPOTS} filled
							</span>
						</div>
						<div className="h-2 w-full rounded-full bg-dark-300 overflow-hidden">
							<div
								className="h-full rounded-full bg-gradient-to-r from-amber to-amber-400 transition-all duration-1000"
								style={{ width: `${fillPercent}%` }}
							/>
						</div>
					</div>

					<a
						href="#apply"
						className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber px-8 py-3.5 text-sm font-bold text-dark-100 transition-all duration-200 hover:gap-3 hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
					>
						Secure Your Spot <span aria-hidden="true">&rarr;</span>
					</a>
				</FadeIn>
			</div>
		</section>
	);
}
