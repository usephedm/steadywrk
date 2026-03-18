"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type Variants, motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "./lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── useScrollInView (Lenis-compatible replacement for motion/react useInView) ── */

export function useScrollInView(
	ref: React.RefObject<HTMLElement | null>,
	options?: { once?: boolean },
) {
	const [isInView, setIsInView] = useState(false);

	useEffect(() => {
		if (!ref.current) return;

		const trigger = ScrollTrigger.create({
			trigger: ref.current,
			start: "top 95%",
			end: "bottom 5%",
			onEnter: () => setIsInView(true),
			onEnterBack: () => {
				if (!options?.once) setIsInView(true);
			},
			onLeave: () => {
				if (!options?.once) setIsInView(false);
			},
			onLeaveBack: () => {
				if (!options?.once) setIsInView(false);
			},
		});

		return () => {
			trigger.kill();
		};
	}, [ref, options?.once]);

	return isInView;
}

/* ─── FadeIn ─────────────────────────────────────────── */

interface FadeInProps {
	children: ReactNode;
	className?: string;
	delay?: number;
	duration?: number;
	direction?: "up" | "down" | "left" | "right" | "none";
	distance?: number;
	once?: boolean;
}

export function FadeIn({
	children,
	delay = 0,
	duration = 0.5,
	direction = "up",
	distance = 24,
	once = true,
	className,
}: FadeInProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useScrollInView(ref, { once });

	const directionMap = {
		up: { y: distance },
		down: { y: -distance },
		left: { x: distance },
		right: { x: -distance },
		none: {},
	};

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, ...directionMap[direction] }}
			animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionMap[direction] }}
			transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/* ─── Stagger ────────────────────────────────────────── */

interface StaggerProps {
	children: ReactNode;
	className?: string;
	staggerDelay?: number;
	delay?: number;
}

const containerVariants: Variants = {
	hidden: {},
	visible: (custom: { staggerDelay: number; delay: number }) => ({
		transition: {
			staggerChildren: custom.staggerDelay,
			delayChildren: custom.delay,
		},
	}),
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
	},
};

export function Stagger({ children, className, staggerDelay = 0.1, delay = 0 }: StaggerProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useScrollInView(ref, { once: true });

	return (
		<motion.div
			ref={ref}
			variants={containerVariants}
			initial="hidden"
			animate={isInView ? "visible" : "hidden"}
			custom={{ staggerDelay, delay }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<motion.div variants={itemVariants} className={className}>
			{children}
		</motion.div>
	);
}

/* ─── GlowOrb ────────────────────────────────────────── */

export function GlowOrb({ className }: { className?: string }) {
	return (
		<motion.div
			className={cn("pointer-events-none absolute rounded-full bg-amber/8 blur-[120px]", className)}
			animate={{
				scale: [1, 1.2, 1],
				opacity: [0.3, 0.6, 0.3],
			}}
			transition={{
				duration: 4,
				repeat: Number.POSITIVE_INFINITY,
				ease: "easeInOut",
			}}
		/>
	);
}

/* ─── CountUp ────────────────────────────────────────── */

export function CountUp({
	value,
	className,
}: {
	value: string;
	className?: string;
}) {
	const countRef = useRef<HTMLSpanElement>(null);
	const isInView = useScrollInView(countRef as React.RefObject<HTMLElement | null>, { once: true });

	return (
		<motion.span
			ref={countRef}
			className={className}
			initial={{ opacity: 0, scale: 0.5 }}
			animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
			transition={{ type: "spring", stiffness: 200, damping: 15 }}
		>
			{value}
		</motion.span>
	);
}

/* ─── TextReveal ─────────────────────────────────────── */

interface TextRevealProps {
	children: ReactNode;
	className?: string;
	delay?: number;
	stagger?: number;
	type?: "chars" | "words" | "lines";
}

export function TextReveal({ children, className, delay = 0 }: TextRevealProps) {
	const ref = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!ref.current) return;

			gsap.fromTo(
				ref.current,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					delay,
					duration: 0.6,
					ease: "power2.out",
					scrollTrigger: {
						trigger: ref.current,
						start: "top 85%",
						toggleActions: "play none none none",
					},
				},
			);
		},
		{ scope: ref },
	);

	return (
		<div ref={ref} className={cn("inline-block", className)}>
			{children}
		</div>
	);
}

/* ─── TextScramble ───────────────────────────────────── */

interface TextScrambleProps {
	children: string;
	className?: string;
	duration?: number;
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export function TextScramble({ children, className, duration = 1.5 }: TextScrambleProps) {
	const ref = useRef<HTMLDivElement>(null);
	const originalText = children;

	useGSAP(
		() => {
			if (!ref.current) return;

			const el = ref.current;
			const length = originalText.length;
			const progress = { value: 0 };

			el.textContent = originalText.replace(
				/\S/g,
				() => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? "?",
			);

			gsap.to(progress, {
				value: 1,
				duration,
				ease: "none",
				scrollTrigger: {
					trigger: el,
					start: "top 85%",
					toggleActions: "play none none none",
				},
				onUpdate() {
					const revealed = Math.floor(progress.value * length);
					let result = "";
					for (let i = 0; i < length; i++) {
						if (originalText[i] === " ") {
							result += " ";
						} else if (i < revealed) {
							result += originalText[i];
						} else {
							result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
						}
					}
					el.textContent = result;
				},
				onComplete() {
					el.textContent = originalText;
				},
			});
		},
		{ scope: ref },
	);

	return (
		<div ref={ref} className={cn("inline-block", className)}>
			{originalText}
		</div>
	);
}

/* ─── TiltCard ───────────────────────────────────────── */

interface TiltCardProps {
	children: ReactNode;
	className?: string;
	tiltAmount?: number;
}

export function TiltCard({ children, className, tiltAmount = 8 }: TiltCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [transform, setTransform] = useState("");
	const [highlight, setHighlight] = useState("");

	const handleMove = (e: React.PointerEvent) => {
		if (!ref.current) return;
		const rect = ref.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;

		setTransform(
			`perspective(800px) rotateY(${x * tiltAmount}deg) rotateX(${-y * tiltAmount}deg) scale3d(1.02, 1.02, 1.02)`,
		);
		setHighlight(
			`radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(245,158,11,0.06), transparent 60%)`,
		);
	};

	const handleLeave = () => {
		setTransform("");
		setHighlight("");
	};

	return (
		<div
			ref={ref}
			onPointerMove={handleMove}
			onPointerLeave={handleLeave}
			className={cn("transition-transform duration-200 ease-out", className)}
			style={{
				transform: transform || "perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)",
				backgroundImage: highlight || undefined,
			}}
		>
			{children}
		</div>
	);
}

/* ─── ParallaxLayer ──────────────────────────────────── */

interface ParallaxLayerProps {
	children: ReactNode;
	className?: string;
	speed?: number;
}

export function ParallaxLayer({ children, className, speed = 0.5 }: ParallaxLayerProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});
	const y = useTransform(scrollYProgress, [0, 1], [`${speed * -50}px`, `${speed * 50}px`]);

	return (
		<motion.div ref={ref} style={{ y }} className={className}>
			{children}
		</motion.div>
	);
}

/* ─── MagneticButton ─────────────────────────────────── */

interface MagneticButtonProps {
	children: ReactNode;
	className?: string;
	strength?: number;
}

export function MagneticButton({ children, className, strength = 0.3 }: MagneticButtonProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleMove = (e: React.PointerEvent) => {
		if (!ref.current) return;
		const rect = ref.current.getBoundingClientRect();
		const x = (e.clientX - rect.left - rect.width / 2) * strength;
		const y = (e.clientY - rect.top - rect.height / 2) * strength;
		setPosition({ x, y });
	};

	const handleLeave = () => setPosition({ x: 0, y: 0 });

	return (
		<motion.div
			ref={ref}
			data-magnetic
			onPointerMove={handleMove}
			onPointerLeave={handleLeave}
			animate={{ x: position.x, y: position.y }}
			transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
