import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "./lib/utils";

const baseInput =
	"w-full rounded-lg border border-dark-300 bg-dark-200 px-4 py-3 text-sm text-white placeholder-dark-600 outline-none transition-all duration-200 focus:border-amber focus:ring-1 focus:ring-amber/30";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
	return <input data-slot="input" className={cn(baseInput, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return (
		<textarea data-slot="textarea" className={cn(baseInput, "resize-none", className)} {...props} />
	);
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select data-slot="select" className={cn(baseInput, "appearance-none", className)} {...props} />
	);
}
