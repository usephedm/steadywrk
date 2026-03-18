"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import { type ReactNode, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

function LenisScrollSync() {
	useLenis(() => {
		// Fires on every Lenis scroll frame — keeps ScrollTrigger in sync
		ScrollTrigger.update();
	});

	useEffect(() => {
		// Sync GSAP ticker with Lenis so raf-driven animations stay smooth
		const update = (_time: number) => {
			// GSAP ticker gives time in seconds, Lenis expects ms
		};
		gsap.ticker.add(update);
		gsap.ticker.lagSmoothing(0);

		return () => {
			gsap.ticker.remove(update);
		};
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
				syncTouch: true,
			}}
		>
			<LenisScrollSync />
			{children}
		</ReactLenis>
	);
}
