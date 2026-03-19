"use client";

import { Button, LogoMark } from "@steadywrk/ui";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const NAV_ITEMS = ["Program", "Curriculum"];

export function Nav() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [blurAmount, setBlurAmount] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const y = window.scrollY;
			setScrolled(y > 50);
			setBlurAmount(Math.min(y / 100, 1) * 20);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<motion.nav
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
				scrolled ? "border-dark-300/50 bg-dark/90" : "border-transparent bg-transparent"
			}`}
			style={{
				backdropFilter: `blur(${blurAmount}px)`,
				WebkitBackdropFilter: `blur(${blurAmount}px)`,
			}}
		>
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
				<a href="/" className="flex items-center gap-2.5">
					<LogoMark className="h-7 w-auto" />
					<span className="text-lg font-extrabold tracking-[0.08em]">STEADYWRK</span>
				</a>

				<div className="hidden items-center gap-8 text-sm text-dark-700 md:flex">
					{NAV_ITEMS.map((item) => (
						<a
							key={item}
							href={`#${item.toLowerCase()}`}
							className="transition-colors duration-200 hover:text-white"
						>
							{item}
						</a>
					))}
				</div>

				<div className="flex items-center gap-3">
					<a href="#apply" className="hidden sm:block">
						<Button size="sm">Apply Now</Button>
					</a>
					<button
						type="button"
						onClick={() => setOpen(!open)}
						className="flex h-10 w-10 items-center justify-center rounded-lg text-dark-700 hover:text-white md:hidden"
						aria-label="Toggle menu"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							className="h-5 w-5"
							aria-hidden="true"
							role="img"
						>
							{open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
						</svg>
					</button>
				</div>
			</div>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="overflow-hidden border-t border-dark-300/50 bg-dark/95 backdrop-blur-xl md:hidden"
					>
						<div className="flex flex-col gap-1 p-4">
							{NAV_ITEMS.map((item) => (
								<a
									key={item}
									href={`#${item.toLowerCase()}`}
									onClick={() => setOpen(false)}
									className="rounded-lg px-4 py-3 text-sm text-dark-700 transition hover:bg-dark-200 hover:text-white"
								>
									{item}
								</a>
							))}
							<a href="#apply" onClick={() => setOpen(false)}>
								<Button className="mt-2 w-full">Apply Now</Button>
							</a>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.nav>
	);
}
