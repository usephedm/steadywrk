import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_REQUESTS = 3;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const timestamps = requestLog.get(ip) ?? [];
	const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
	requestLog.set(ip, recent);

	if (recent.length >= MAX_REQUESTS) return true;
	recent.push(now);
	return false;
}

function sanitize(value: unknown): string {
	if (typeof value !== "string") return "";
	return value.trim().slice(0, 1000);
}

const VALID_TRACKS = ["ai-operations", "ai-developer", "ai-content-growth", "not-sure"];
const VALID_LOCATIONS = ["amman", "jordan-other", "mena", "international"];

export async function POST(request: Request) {
	try {
		const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

		if (isRateLimited(ip)) {
			return NextResponse.json(
				{ error: "Too many requests. Please try again in a minute." },
				{ status: 429 },
			);
		}

		const body = await request.json();

		const name = sanitize(body.name);
		const email = sanitize(body.email);
		const phone = sanitize(body.phone);
		const track = sanitize(body.track);
		const location = sanitize(body.location);
		const message = sanitize(body.message);

		// Validate required fields
		if (!name || !email || !track || !location) {
			return NextResponse.json(
				{ error: "Please fill in all required fields." },
				{ status: 400 },
			);
		}

		// Basic email validation
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
		}

		// Validate enums
		if (!VALID_TRACKS.includes(track)) {
			return NextResponse.json({ error: "Invalid track selection." }, { status: 400 });
		}
		if (!VALID_LOCATIONS.includes(location)) {
			return NextResponse.json({ error: "Invalid location selection." }, { status: 400 });
		}

		const application = {
			name,
			email,
			phone: phone || "Not provided",
			track,
			location,
			message: message || "No message",
			submitted_at: new Date().toISOString(),
			ip,
		};

		// TODO: Replace with Supabase insert when ready:
		// const { error } = await supabase.from("applications").insert(application);

		// For now, store in-memory and log (applications will persist via Vercel logs)
		console.info("[APPLICATION]", JSON.stringify(application));

		// Send notification email via Formspree as a backup
		// Replace YOUR_FORM_ID with your real Formspree form ID
		const formspreeId = process.env.FORMSPREE_ID;
		if (formspreeId) {
			await fetch(`https://formspree.io/f/${formspreeId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					_subject: `New SteadyWrk Application: ${name}`,
					...application,
				}),
			}).catch(() => {
				// Non-blocking — application is still logged
			});
		}

		return NextResponse.json({ success: true, message: "Application received." });
	} catch {
		return NextResponse.json(
			{ error: "Something went wrong. Please try again." },
			{ status: 500 },
		);
	}
}
