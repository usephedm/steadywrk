"use client";

import { Button, FadeIn, GlowOrb, Input, Select, Textarea } from "@steadywrk/ui";
import { useState } from "react";

export function Apply() {
	const [submitting, setSubmitting] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmitting(true);
		const form = e.currentTarget;
		try {
			await fetch(form.action, {
				method: "POST",
				body: new FormData(form),
				headers: { Accept: "application/json" },
			});
			form.reset();
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section id="apply" className="relative border-t border-dark-300/50 py-24 md:py-32">
			<GlowOrb className="h-[500px] w-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

			<div className="relative mx-auto max-w-2xl px-6">
				<FadeIn>
					<div className="text-center">
						<h2 className="text-3xl font-bold md:text-5xl">
							Ready to{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								work steady?
							</span>
						</h2>
						<p className="mt-4 text-dark-700">
							Drop your info. We'll reach out if there's a fit. No fluff, no 12-step application.
							Just you and the work.
						</p>
					</div>
				</FadeIn>

				<FadeIn delay={0.2}>
					<form
						className="mt-10 space-y-4"
						action="https://formspree.io/f/placeholder"
						method="POST"
						onSubmit={handleSubmit}
					>
						<div className="grid gap-4 sm:grid-cols-2">
							<div
								className={`transition-shadow duration-300 rounded-lg ${focusedField === "name" ? "shadow-[0_0_16px_rgba(224,120,0,0.15)]" : ""}`}
							>
								<Input
									type="text"
									name="name"
									placeholder="Full name"
									required
									onFocus={() => setFocusedField("name")}
									onBlur={() => setFocusedField(null)}
								/>
							</div>
							<div
								className={`transition-shadow duration-300 rounded-lg ${focusedField === "email" ? "shadow-[0_0_16px_rgba(224,120,0,0.15)]" : ""}`}
							>
								<Input
									type="email"
									name="email"
									placeholder="Email"
									required
									onFocus={() => setFocusedField("email")}
									onBlur={() => setFocusedField(null)}
								/>
							</div>
						</div>
						<div
							className={`transition-shadow duration-300 rounded-lg ${focusedField === "phone" ? "shadow-[0_0_16px_rgba(224,120,0,0.15)]" : ""}`}
						>
							<Input
								type="tel"
								name="phone"
								placeholder="Phone number"
								onFocus={() => setFocusedField("phone")}
								onBlur={() => setFocusedField(null)}
							/>
						</div>
						<Select name="role" required>
							<option value="">What role fits you?</option>
							<option value="technician">Field Technician</option>
							<option value="dispatch">Dispatch Operator</option>
							<option value="growth">Growth Partner</option>
							<option value="other">Something Else</option>
						</Select>
						<div
							className={`transition-shadow duration-300 rounded-lg ${focusedField === "message" ? "shadow-[0_0_16px_rgba(224,120,0,0.15)]" : ""}`}
						>
							<Textarea
								name="message"
								rows={3}
								placeholder="Tell us about yourself in 2-3 sentences (optional)"
								onFocus={() => setFocusedField("message")}
								onBlur={() => setFocusedField(null)}
							/>
						</div>
						<Button type="submit" className="w-full" size="lg" disabled={submitting}>
							{submitting ? (
								<span className="flex items-center gap-2">
									<svg
										className="h-4 w-4 animate-spin"
										viewBox="0 0 24 24"
										fill="none"
										aria-hidden="true"
										role="img"
									>
										<circle
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											className="opacity-25"
										/>
										<path
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
											fill="currentColor"
											className="opacity-75"
										/>
									</svg>
									Submitting...
								</span>
							) : (
								"Submit Application"
							)}
						</Button>
					</form>
				</FadeIn>
			</div>
		</section>
	);
}
