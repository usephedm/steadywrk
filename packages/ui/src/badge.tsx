import type { HTMLAttributes } from "react";
import { cn } from "./lib/utils";

type BadgeVariant = "default" | "amber" | "outline" | "success" | "warning" | "muted";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
	default: "bg-dark-400 text-white",
	amber: "bg-amber/10 text-amber border-amber/20",
	outline: "border border-dark-300 text-dark-700",
	success: "bg-green-500/10 text-green-400 border-green-500/20",
	warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
	muted: "bg-dark-200 text-dark-700",
};

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
	return (
		<span
			data-slot="badge"
			className={cn(
				"inline-flex items-center rounded-full border border-transparent px-3 py-1 text-xs font-medium",
				variantStyles[variant],
				className,
			)}
			{...props}
		/>
	);
}
