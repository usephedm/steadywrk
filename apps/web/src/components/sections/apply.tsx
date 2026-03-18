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
								start your AI career?
							</span>
						</h2>
						<p className="mt-4 text-dark-700">
							60 seconds. No CV required. Tell us who you are and why you want to work with AI. We
							review every application within 48 hours.
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
								className={`transition-shadow duration-300 rounded-lg ${focusedField === "name" ? "shadow-[0_0_16px_rgba(245,158,11,0.15)]" : ""}`}
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
								className={`transition-shadow duration-300 rounded-lg ${focusedField === "email" ? "shadow-[0_0_16px_rgba(245,158,11,0.15)]" : ""}`}
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
							className={`transition-shadow duration-300 rounded-lg ${focusedField === "phone" ? "shadow-[0_0_16px_rgba(245,158,11,0.15)]" : ""}`}
						>
							<Input
								type="tel"
								name="phone"
								placeholder="Phone number (WhatsApp preferred)"
								onFocus={() => setFocusedField("phone")}
								onBlur={() => setFocusedField(null)}
							/>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<Select name="track" required>
								<option value="">What track interests you?</option>
								<option value="bootcamp-trainee">Bootcamp Trainee (No experience)</option>
								<option value="ai-operations">AI Operations Specialist</option>
								<option value="ai-developer">AI-Assisted Developer</option>
								<option value="ai-content-growth">AI Content & Growth</option>
								<option value="client-success">Client Success Manager</option>
								<option value="sales-dev">Sales Development Rep</option>
							</Select>
							<Select name="location" required>
								<option value="">Where are you based?</option>
								<option value="amman">Amman, Jordan</option>
								<option value="jordan-other">Other city in Jordan</option>
								<option value="mena">MENA region</option>
								<option value="international">International</option>
							</Select>
						</div>
						<div
							className={`transition-shadow duration-300 rounded-lg ${focusedField === "message" ? "shadow-[0_0_16px_rgba(245,158,11,0.15)]" : ""}`}
						>
							<Textarea
								name="message"
								rows={3}
								placeholder="Why do you want to work with AI? (2-3 sentences)"
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

					<p className="mt-6 text-center text-sm text-dark-600">
						Based in Jordan? Even better. We're building our core team in Amman. All applications
						reviewed within 48 hours.
					</p>
				</FadeIn>
			</div>
		</section>
	);
}
