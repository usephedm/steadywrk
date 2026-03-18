/* ─── SteadyWrk Data Layer ─── */

export const SITE_CONFIG = {
	name: "SteadyWrk",
	description:
		"AI-orchestrated field service dispatch. We connect businesses to independent technicians through an autonomous matching engine.",
	url: "https://steadywrk.com",
	ogImage: "/api/og",
	company: "Kayan Ventures Jordan LLC",
	location: "Amman, Jordan",
	email: "careers@steadywrk.com",
};

/* ─── How It Works ─── */

export const STEPS = [
	{
		num: "01",
		title: "Work order hits the engine",
		desc: "A business submits a service request via API, dashboard, or phone call. Our AI classifies trade, urgency, SLA tier, and H3 hex-cell in under 200ms.",
		icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
	},
	{
		num: "02",
		title: "Multi-agent dispatch fires",
		desc: "Three MCP servers score every available technician — proximity, skill match, margin impact, and real-time availability. The best fit gets auto-dispatched.",
		icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
	},
	{
		num: "03",
		title: "Job done, payment instant",
		desc: "Tech confirms via SMS, completes the work, uploads proof. Stripe handles invoicing and payout automatically. Zero phone tag, zero paperwork.",
		icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
	},
];

/* ─── Open Roles (Jordan-based) ─── */

export const ROLES = [
	{
		title: "AI Engineer",
		badge: "Remote · Amman",
		trade: "Engineering",
		desc: "Build the autonomous dispatch engine that replaces call centers. You'll work with Claude, GPT, and Gemini to orchestrate multi-agent systems that make real decisions in real-time.",
		salary: "JOD 1,500–3,000/mo",
		href: "#apply",
	},
	{
		title: "Prompt Engineer",
		badge: "Remote · Amman",
		trade: "AI Operations",
		desc: "Design the intelligence layer. Craft system prompts, build MCP tool schemas, and optimize AI decision-making for dispatch, pricing, and technician matching.",
		salary: "JOD 1,000–2,500/mo",
		href: "#apply",
	},
	{
		title: "Dispatch Operator",
		badge: "Remote-first",
		trade: "Operations",
		desc: "Run the AI-assisted war room. Monitor live dispatches across US markets, handle edge cases, and train the system to get smarter with every job.",
		salary: "JOD 600–1,200/mo",
		href: "#apply",
	},
	{
		title: "Executive Assistant",
		badge: "Amman · On-site",
		trade: "Leadership Support",
		desc: "Be the force multiplier for the founder. Manage communications, coordinate across teams, and keep the machine running while we scale from 0 to 100.",
		salary: "JOD 500–1,000/mo",
		href: "#apply",
	},
	{
		title: "Operations Manager",
		badge: "Amman · Hybrid",
		trade: "Operations",
		desc: "Own the operational backbone. Build processes, manage vendor relationships, handle logistics, and ensure every dispatch flows like clockwork.",
		salary: "JOD 1,200–2,500/mo",
		href: "#apply",
	},
	{
		title: "Cold Caller / Sales Dev",
		badge: "Remote · Commission",
		trade: "Growth",
		desc: "Open doors in the US market. You'll call property managers, HVAC companies, and service businesses to bring them onto the SteadyWrk platform. Base + uncapped commission.",
		salary: "JOD 400–800/mo + commission",
		href: "#apply",
	},
];

/* ─── Stats Bar ─── */

export const STATS = [
	{ value: "3", label: "Custom MCPs", detail: "Dispatch Oracle, Hawkeye, LeadForge" },
	{ value: "AI", label: "Multi-Agent", detail: "Claude, Codex, Gemini orchestrated" },
	{ value: "0", label: "Middlemen", detail: "Direct tech-to-client dispatch" },
	{ value: "24/7", label: "Autonomous", detail: "AI never sleeps" },
];

/* ─── Features ─── */

export const FEATURES = [
	{
		title: "AI Dispatch Engine",
		desc: "H3 geospatial indexing, reputation scoring, and margin-optimized routing. Every dispatch decision is autonomous and auditable.",
	},
	{
		title: "MCP-Native Architecture",
		desc: "Three custom Model Context Protocol servers on Cloudflare Workers. The AI doesn't just assist — it operates the entire dispatch pipeline.",
	},
	{
		title: "Voice AI + SMS Dispatch",
		desc: "Inbound calls handled by AI, outbound confirmations via SMS. Technicians get dispatched before the customer hangs up.",
	},
	{
		title: "Multi-Agent Orchestration",
		desc: "Claude for strategy, Codex for execution, Gemini for research. Each agent owns its lane — no single point of failure.",
	},
	{
		title: "Real-Time Command Center",
		desc: "Live job tracking, technician GPS, completion velocity, revenue per hex-cell. Operational intelligence at a glance.",
	},
	{
		title: "Instant Stripe Payments",
		desc: "Automated invoicing on job completion, contractor payouts on net-terms, and margin tracking per dispatch. No chasing checks.",
	},
];

/* ─── Pricing ─── */

export const PRICING = [
	{
		name: "Starter",
		price: "$0",
		period: "forever",
		desc: "For independent techs getting started",
		features: ["Up to 10 jobs/month", "Basic AI matching", "SMS notifications", "Mobile access"],
		cta: "Start Free",
		highlighted: false,
	},
	{
		name: "Pro",
		price: "$79",
		period: "/month",
		desc: "For growing service businesses",
		features: [
			"Unlimited jobs",
			"Advanced AI dispatch",
			"Voice AI scheduling",
			"Priority support",
			"Custom workflows",
			"Analytics dashboard",
		],
		cta: "Start Trial",
		highlighted: true,
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "",
		desc: "For multi-location operations",
		features: [
			"Everything in Pro",
			"Dedicated MCP instance",
			"Custom integrations",
			"White-label option",
			"SLA guarantee",
			"Onboarding concierge",
		],
		cta: "Contact Us",
		highlighted: false,
	},
];

/* ─── Trust Badges ─── */

export const TRUST_BADGES = [
	"MCP-Native",
	"AI-Orchestrated",
	"Zero Middlemen",
	"24/7 Autonomous",
	"Cloudflare Workers",
	"Multi-Agent",
	"H3 Geospatial",
	"Stripe Payments",
];
