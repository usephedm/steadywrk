export const STEPS = [
	{
		num: "01",
		title: "Work order lands",
		desc: "A business submits a service request. Our AI instantly classifies trade type, urgency, and location.",
		icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
	},
	{
		num: "02",
		title: "AI matches & dispatches",
		desc: "The dispatch engine scores nearby technicians on availability, skill match, and reputation. Best fit gets the job.",
		icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
	},
	{
		num: "03",
		title: "Tech arrives, work done",
		desc: "No phone tag. No scheduling chaos. The tech accepts via SMS, shows up, completes the job. Payment automated.",
		icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
	},
];

export const ROLES = [
	{
		title: "Field Technicians",
		subtitle: "HVAC, Plumbing, Electrical, General Maintenance",
		description:
			"Solo operators and independent techs. You bring the skills, we bring the jobs. No franchise fees, no middlemen.",
		tag: "Earning $40-120/hr",
	},
	{
		title: "Dispatch Operators",
		subtitle: "Remote, AI-Assisted",
		description:
			"Manage job flow across regions using our AI dispatch engine. Real-time matching, automated scheduling, intelligent routing.",
		tag: "Remote-first",
	},
	{
		title: "Growth Partners",
		subtitle: "Marketing, Sales, Business Development",
		description:
			"Help us expand into new markets. We give you the tools, the data, and the platform. You open the doors.",
		tag: "Commission + equity",
	},
];

export const STATS = [
	{ value: "3", label: "Custom MCPs", detail: "Dispatch Oracle, Hawkeye, LeadForge" },
	{ value: "AI", label: "Multi-Agent", detail: "Claude, Codex, Gemini orchestrated" },
	{ value: "0", label: "Middlemen", detail: "Direct tech-to-client dispatch" },
	{ value: "24/7", label: "Autonomous", detail: "AI never sleeps" },
];

export const FEATURES = [
	{
		title: "AI Dispatch Engine",
		desc: "H3 geospatial matching, reputation scoring, and margin-optimized routing — all autonomous.",
	},
	{
		title: "MCP-Native Architecture",
		desc: "Three custom Model Context Protocol servers on Cloudflare Workers. The AI doesn't just assist — it operates.",
	},
	{
		title: "Voice AI + SMS Dispatch",
		desc: "Automated scheduling, voice confirmations, real-time SMS updates. The tech knows before the phone rings.",
	},
	{
		title: "Multi-Agent Orchestration",
		desc: "Claude Opus for strategy, Codex for execution, Gemini for research. Each agent does what it's best at.",
	},
	{
		title: "Real-Time Dashboard",
		desc: "Live job tracking, technician locations, completion rates, revenue metrics. Everything at a glance.",
	},
	{
		title: "Zero-Friction Payments",
		desc: "Stripe-powered automated invoicing, contractor payouts, and margin tracking. No chasing checks.",
	},
];

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
