"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import { type ReactNode, useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

function LenisScrollSync() {
	const lenisRef = useRef<unknown>(null);

	useEffect(() => {
		// Wait for Lenis to initialize via ReactLenis root
		const checkLenis = () => {
			// biome-ignore lint/suspicious/noExplicitAny: accessing global Lenis instance
			const lenis = (window as unknown as Record<string, any>).__lenis;
			if (lenis) {
				lenisRef.current = lenis;
				lenis.on("scroll", ScrollTrigger.update);

				const tick = (time: number) => {
					lenis.raf(time * 1000);
				};
				gsap.ticker.add(tick);
				gsap.ticker.lagSmoothing(0);

				return () => {
					gsap.ticker.remove(tick);
				};
			}
		};

		// Try immediately, then with a small delay
		const cleanup = checkLenis();
		if (!cleanup) {
			const timer = setTimeout(checkLenis, 100);
			return () => clearTimeout(timer);
		}
		return cleanup;
	}, []);

	return null;
}

export function LenisProvider({ children }: { children: ReactNode }) {
	return (
		<ReactLenis
			root
			options={{
				duration: 1.2,
				easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
				touchMultiplier: 2,
			}}
		>
			<LenisScrollSync />
			{children}
		</ReactLenis>
	);
}
