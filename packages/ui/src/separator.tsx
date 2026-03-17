import type { HTMLAttributes } from "react";
import { cn } from "./lib/utils";

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
}

export function Separator({ orientation = "horizontal", className, ...props }: SeparatorProps) {
	return (
		<div
			data-slot="separator"
			role="separator"
			tabIndex={-1}
			className={cn(
				"shrink-0 bg-dark-300",
				orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
				className,
			)}
			{...props}
		/>
	);
}
