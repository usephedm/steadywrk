import { cn } from "./lib/utils";

const AMBER = "#E07800";

interface LogoProps {
	className?: string;
	showText?: boolean;
	monochrome?: boolean;
}

export function LogoMark({ className, monochrome }: { className?: string; monochrome?: boolean }) {
	const fill = monochrome ? "currentColor" : AMBER;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 48 40"
			fill="none"
			className={className}
			role="img"
			aria-label="SteadyWrk"
		>
			<title>SteadyWrk</title>
			{/* Top chevron (single continuous zigzag) */}
			<path d="M4 18 L14 8 L24 18 L34 8 L44 18 L40 22 L34 16 L24 22 L14 16 L8 22Z" fill={fill} />
			{/* Bottom chevron (single continuous zigzag) */}
			<path d="M4 30 L14 20 L24 30 L34 20 L44 30 L40 34 L34 28 L24 34 L14 28 L8 34Z" fill={fill} />
		</svg>
	);
}

export function Logo({ className, showText = true, monochrome }: LogoProps) {
	return (
		<div className={cn("flex items-center gap-2.5", className)}>
			<LogoMark className="h-7 w-auto" monochrome={monochrome} />
			{showText && (
				<span className="text-lg font-extrabold tracking-[0.08em] text-white">STEADYWRK</span>
			)}
		</div>
	);
}
