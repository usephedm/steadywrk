"use client";

import { LogoMark, MagneticButton } from "@steadywrk/ui";
import { motion } from "motion/react";

export function Footer() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer className="border-t border-dark-300/50 py-12">
			<div className="mx-auto max-w-7xl px-6">
				<div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
					<div className="flex items-center gap-2.5">
						<motion.div
							animate={{ scale: [1, 1.05, 1] }}
							transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
						>
							<LogoMark className="h-7 w-auto" />
						</motion.div>
						<span className="text-lg font-extrabold tracking-[0.08em] text-white">STEADYWRK</span>
					</div>
					<div className="flex items-center gap-6 text-sm text-dark-600">
						{["Solutions", "Features", "Pricing", "Careers"].map((item) => (
							<MagneticButton key={item} strength={0.15}>
								<a href={`#${item.toLowerCase()}`} className="transition hover:text-white">
									{item}
								</a>
							</MagneticButton>
						))}
					</div>
				</div>
				<div className="mt-8 flex flex-col items-center gap-2 text-center text-xs text-dark-600 md:flex-row md:justify-between">
					<p>AI-orchestrated dispatch. Built by Kayan Ventures.</p>
					<div className="flex items-center gap-4">
						<p>&copy; {new Date().getFullYear()} SteadyWrk. All rights reserved.</p>
						<button
							type="button"
							onClick={scrollToTop}
							className="flex h-8 w-8 items-center justify-center rounded-full border border-dark-300 text-dark-600 transition hover:border-amber hover:text-amber"
							aria-label="Back to top"
						>
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
									d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
