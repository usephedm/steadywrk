import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
	const base = "px-4 py-2 rounded-lg font-medium transition-colors";
	const variants = {
		primary: "bg-[#F59E0B] text-[#0A0A0A] hover:bg-[#D97706]",
		secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
		ghost: "text-gray-400 hover:text-white hover:bg-white/5",
	};

	return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
