import type { ButtonHTMLAttributes } from "react";
import { cn } from "./lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary:
		"bg-amber text-dark font-bold hover:bg-amber-600 active:bg-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]",
	secondary:
		"bg-dark-200 text-white border border-dark-300 hover:bg-dark-400 hover:border-dark-500",
	ghost: "text-dark-700 hover:text-white hover:bg-white/5",
	outline:
		"border border-dark-300 text-dark-700 hover:border-amber/50 hover:text-amber bg-transparent",
	destructive: "bg-red-600 text-white hover:bg-red-700",
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: "h-8 px-3 text-xs rounded-md gap-1.5",
	md: "h-10 px-5 text-sm rounded-lg gap-2",
	lg: "h-12 px-8 text-base rounded-lg gap-2.5",
	icon: "h-10 w-10 rounded-lg items-center justify-center",
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
	return (
		<button
			data-slot="button"
			className={cn(
				"inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
				variantStyles[variant],
				sizeStyles[size],
				className,
			)}
			{...props}
		/>
	);
}
