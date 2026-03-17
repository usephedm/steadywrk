"use client";

import { Button, LogoMark, MagneticButton } from "@steadywrk/ui";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = ["Solutions", "Features", "Pricing", "Careers"];

export function Nav() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [active, setActive] = useState("");
	const [blurAmount, setBlurAmount] = useState(0);
	const navRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			const y = window.scrollY;
			setScrolled(y > 50);
			// Smooth blur ramp: 0px at scroll 0, 20px at scroll 100+
			setBlurAmount(Math.min(y / 100, 1) * 20);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActive(entry.target.id);
					}
				}
			},
			{ threshold: 0.3, rootMargin: "-80px 0px -50% 0px" },
		);

		for (const item of NAV_ITEMS) {
			const el = document.getElementById(item.toLowerCase());
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<motion.nav
			ref={navRef}
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
						<MagneticButton key={item} strength={0.2}>
							<a
								href={`#${item.toLowerCase()}`}
								className={`relative transition-colors duration-200 hover:text-white ${
									active === item.toLowerCase() ? "text-white" : ""
								}`}
							>
								{item}
								{active === item.toLowerCase() && (
									<motion.span
										layoutId="nav-indicator"
										className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber"
										transition={{ type: "spring", stiffness: 300, damping: 30 }}
									/>
								)}
							</a>
						</MagneticButton>
					))}
				</div>

				<div className="flex items-center gap-3">
					<MagneticButton className="hidden sm:block">
						<a href="#apply">
							<Button size="sm">Apply Now</Button>
						</a>
					</MagneticButton>
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
							{/* biome-ignore lint/a11y/useValidAnchor: anchor wraps a button for navigation */}
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
