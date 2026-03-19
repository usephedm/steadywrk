"use client";

import { Button, FadeIn, GlowOrb, Input, Select, Textarea } from "@steadywrk/ui";
import { useState } from "react";

export function Apply() {
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmitting(true);
		setError("");

		const form = e.currentTarget;
		const data = Object.fromEntries(new FormData(form));

		try {
			const res = await fetch("/api/apply", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				throw new Error("Submission failed. Try again or message us on WhatsApp.");
			}

			setSubmitted(true);
			form.reset();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
		} finally {
			setSubmitting(false);
		}
	};

	if (submitted) {
		return (
			<section id="apply" className="relative border-t border-dark-300/50 py-24 md:py-32">
				<GlowOrb className="h-[500px] w-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
				<div className="relative mx-auto max-w-2xl px-6 text-center">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-6">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8 text-green-400" aria-hidden="true" role="img">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
						</svg>
					</div>
					<h2 className="text-3xl font-bold md:text-4xl">Application received.</h2>
					<p className="mt-4 text-dark-700">
						We review every application within 48 hours. You&apos;ll hear from us on WhatsApp or email.
					</p>
					<a
						href="https://wa.me/962776085874"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300 transition"
					>
						Message us on WhatsApp if you have questions
						<span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</section>
		);
	}

	return (
		<section id="apply" className="relative border-t border-dark-300/50 py-24 md:py-32">
			<GlowOrb className="h-[500px] w-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

			<div className="relative mx-auto max-w-2xl px-6">
				<FadeIn>
					<div className="text-center">
						<h2 className="text-3xl font-bold md:text-5xl">
							Ready to{" "}
							<span className="bg-gradient-to-r from-amber-400 to-amber bg-clip-text text-transparent">
								join the team?
							</span>
						</h2>
						<p className="mt-4 text-dark-700">
							60 seconds. No CV required. Tell us who you are and why you want in.
							We review every application within 48 hours.
						</p>
					</div>
				</FadeIn>

				<FadeIn delay={0.2}>
					<form
						className="mt-10 space-y-4"
						onSubmit={handleSubmit}
					>
						<div className="grid gap-4 sm:grid-cols-2">
							<Input
								type="text"
								name="name"
								placeholder="Full name"
								required
							/>
							<Input
								type="email"
								name="email"
								placeholder="Email"
								required
							/>
						</div>
						<Input
							type="tel"
							name="phone"
							placeholder="WhatsApp number (e.g. +962 7XX XXX XXX)"
						/>
						<div className="grid gap-4 sm:grid-cols-2">
							<Select name="track" required>
								<option value="">What interests you most?</option>
								<option value="ai-operations">AI Operations (run workflows, manage AI agents)</option>
								<option value="ai-developer">AI-Assisted Development (build software with AI)</option>
								<option value="ai-content-growth">AI Content &amp; Growth (marketing, SEO, social)</option>
								<option value="not-sure">Not sure yet — I want to learn</option>
							</Select>
							<Select name="location" required>
								<option value="">Where are you based?</option>
								<option value="amman">Amman</option>
								<option value="jordan-other">Other city in Jordan</option>
								<option value="mena">MENA region</option>
								<option value="international">International</option>
							</Select>
						</div>
						<Textarea
							name="message"
							rows={3}
							placeholder="Why do you want to work with AI? (2-3 sentences is fine)"
						/>

						{error && (
							<p className="text-sm text-red-400 text-center">{error}</p>
						)}

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

					<div className="mt-8 flex flex-col items-center gap-3">
						<p className="text-sm text-dark-600">
							Prefer to chat first?
						</p>
						<a
							href="https://wa.me/962776085874?text=Hi%2C%20I%27m%20interested%20in%20the%20SteadyWrk%20bootcamp"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-400 transition hover:bg-green-500/20"
						>
							<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true" role="img">
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
							</svg>
							Message us on WhatsApp
						</a>
					</div>
				</FadeIn>
			</div>
		</section>
	);
}
