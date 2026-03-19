"use client";

import { LogoMark } from "@steadywrk/ui";

export function Footer() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer className="border-t border-dark-300/50 py-12">
			<div className="mx-auto max-w-7xl px-6">
				<div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
					<div className="flex items-center gap-2.5">
						<LogoMark className="h-7 w-auto" />
						<span className="text-lg font-extrabold tracking-[0.08em] text-white">STEADYWRK</span>
					</div>
					<div className="flex items-center gap-6 text-sm text-dark-600">
						<a href="#program" className="transition hover:text-white">Program</a>
						<a href="#curriculum" className="transition hover:text-white">Curriculum</a>
						<a href="#apply" className="transition hover:text-white">Apply</a>
						<a
							href="https://wa.me/962776085874"
							target="_blank"
							rel="noopener noreferrer"
							className="transition hover:text-green-400"
						>
							WhatsApp
						</a>
					</div>
				</div>
				<div className="mt-8 flex flex-col items-center gap-2 text-center text-xs text-dark-600 md:flex-row md:justify-between">
					<p>
						Built in Amman, Jordan by{" "}
						<span className="text-dark-700">Kayan Ventures Jordan LLC</span>.
					</p>
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
