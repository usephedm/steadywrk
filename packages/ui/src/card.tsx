import type { HTMLAttributes } from "react";
import { cn } from "./lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	hover?: boolean;
	glow?: boolean;
}

export function Card({ className, hover, glow, ...props }: CardProps) {
	return (
		<div
			data-slot="card"
			className={cn(
				"rounded-xl border border-dark-300 bg-dark-200 p-6",
				hover &&
					"transition-all duration-300 hover:border-amber/30 hover:shadow-[0_0_40px_rgba(224,120,0,0.05)]",
				glow && "animate-glow",
				className,
			)}
			{...props}
		/>
	);
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div data-slot="card-header" className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
	return <h3 data-slot="card-title" className={cn("text-xl font-bold", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			data-slot="card-description"
			className={cn("text-sm leading-relaxed text-dark-700", className)}
			{...props}
		/>
	);
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div data-slot="card-content" className={cn("", className)} {...props} />;
}
