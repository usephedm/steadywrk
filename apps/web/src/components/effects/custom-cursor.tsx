"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
	const cursorRef = useRef<HTMLDivElement>(null);
	const pos = useRef({ x: 0, y: 0 });
	const target = useRef({ x: 0, y: 0 });
	const [hovering, setHovering] = useState(false);
	const [visible, setVisible] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const canHover = window.matchMedia("(hover: hover)").matches;
		setIsDesktop(canHover);
		if (!canHover) return;

		const handleMove = (e: PointerEvent) => {
			target.current = { x: e.clientX, y: e.clientY };
			setVisible(true);
		};

		const handleOver = (e: PointerEvent) => {
			const el = e.target as HTMLElement;
			if (el.closest("a, button, [role=button], input, textarea, select, [data-magnetic]")) {
				setHovering(true);
			}
		};

		const handleOut = () => setHovering(false);
		const handleLeave = () => setVisible(false);
		const handleEnter = () => setVisible(true);

		window.addEventListener("pointermove", handleMove);
		window.addEventListener("pointerover", handleOver);
		window.addEventListener("pointerout", handleOut);
		document.addEventListener("mouseleave", handleLeave);
		document.addEventListener("mouseenter", handleEnter);

		let raf: number;
		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

		const animate = () => {
			pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
			pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

			if (cursorRef.current) {
				cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
			}
			raf = requestAnimationFrame(animate);
		};
		raf = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("pointermove", handleMove);
			window.removeEventListener("pointerover", handleOver);
			window.removeEventListener("pointerout", handleOut);
			document.removeEventListener("mouseleave", handleLeave);
			document.removeEventListener("mouseenter", handleEnter);
		};
	}, []);

	if (!isDesktop) return null;

	return (
		<div
			ref={cursorRef}
			className="pointer-events-none fixed top-0 left-0 z-[10000]"
			style={{
				width: hovering ? 40 : 20,
				height: hovering ? 40 : 20,
				opacity: visible ? 1 : 0,
				borderRadius: "50%",
				background: "radial-gradient(circle, rgba(224,120,0,0.6) 0%, rgba(224,120,0,0) 70%)",
				filter: "blur(1px)",
				transition: "width 0.2s ease-out, height 0.2s ease-out, opacity 0.2s ease-out",
			}}
			aria-hidden="true"
		/>
	);
}
