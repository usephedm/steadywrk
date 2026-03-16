const AMBER = "#EB7C00";

const ROLES = [
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

const STATS = [
	{ value: "3", unit: "Custom MCP Servers", detail: "Dispatch Oracle, Hawkeye, LeadForge" },
	{ value: "AI", unit: "Multi-Agent Stack", detail: "Claude, Codex, Gemini orchestrated" },
	{ value: "0", unit: "Middlemen", detail: "Direct tech-to-client dispatch" },
	{ value: "24/7", unit: "Autonomous Ops", detail: "AI never sleeps" },
];

function Logo({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 48 40"
			fill="none"
			className={className}
			role="img"
			aria-label="STEADYWRK logo"
		>
			<title>STEADYWRK</title>
			<path d="M4 30L14 20L24 30L20 34L14 28L8 34Z" fill={AMBER} />
			<path d="M24 30L34 20L44 30L40 34L34 28L28 34Z" fill={AMBER} />
			<path d="M4 18L14 8L24 18L20 22L14 16L8 22Z" fill={AMBER} />
			<path d="M24 18L34 8L44 18L40 22L34 16L28 22Z" fill={AMBER} />
		</svg>
	);
}

function Nav() {
	return (
		<nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0A0A0A]/90 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<a href="/" className="flex items-center gap-2.5">
					<Logo className="h-7 w-auto" />
					<span className="text-lg font-extrabold tracking-[0.08em] text-white">STEADYWRK</span>
				</a>
				<div className="hidden items-center gap-8 text-sm text-[#888] md:flex">
					<a href="#solutions" className="transition hover:text-white">
						Solutions
					</a>
					<a href="#roles" className="transition hover:text-white">
						Careers
					</a>
					<a href="#stack" className="transition hover:text-white">
						Docs
					</a>
					<a href="#pricing" className="transition hover:text-white">
						Pricing
					</a>
				</div>
				<a
					href="#apply"
					className="rounded-lg px-5 py-2 text-sm font-semibold text-[#0A0A0A] transition hover:brightness-110"
					style={{ backgroundColor: AMBER }}
				>
					Apply Now
				</a>
			</div>
		</nav>
	);
}

function Hero() {
	return (
		<section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16 text-center">
			<div
				className="absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse at center, rgba(235,124,0,0.08) 0%, transparent 70%)",
				}}
			/>
			<div className="relative">
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#111] px-4 py-1.5 text-xs text-[#888]">
					<span
						className="h-1.5 w-1.5 animate-pulse rounded-full"
						style={{ backgroundColor: AMBER }}
					/>
					Now recruiting in all US markets
				</div>
				<h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1.1] tracking-tight md:text-7xl">
					The dispatch protocol
					<br />
					<span style={{ color: AMBER }}>that never sleeps.</span>
				</h1>
				<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#888] md:text-xl">
					AI-orchestrated field service dispatch. We connect businesses to independent technicians
					through an autonomous matching engine. No call centers. No middlemen. Just work.
				</p>
				<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
					<a
						href="#apply"
						className="rounded-lg px-8 py-3.5 text-base font-bold text-[#0A0A0A] transition hover:brightness-110"
						style={{
							backgroundColor: AMBER,
							boxShadow: "0 0 30px rgba(235,124,0,0.2)",
						}}
					>
						Join the Network
					</a>
					<a
						href="#solutions"
						className="rounded-lg border border-[#1a1a1a] px-8 py-3.5 text-base font-medium text-[#888] transition hover:border-[#333] hover:text-white"
					>
						See How It Works
					</a>
				</div>
			</div>
		</section>
	);
}

function Solutions() {
	return (
		<section id="solutions" className="border-t border-[#1a1a1a] py-24">
			<div className="mx-auto max-w-6xl px-6">
				<h2 className="text-center text-3xl font-bold md:text-4xl">
					Three steps. <span style={{ color: AMBER }}>Zero friction.</span>
				</h2>
				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{[
						{
							step: "01",
							title: "Work order lands",
							desc: "A business submits a service request. Our AI instantly classifies trade type, urgency, and location.",
						},
						{
							step: "02",
							title: "AI matches & dispatches",
							desc: "The dispatch engine scores nearby technicians on availability, skill match, and reputation. Best fit gets the job.",
						},
						{
							step: "03",
							title: "Tech arrives, work done",
							desc: "No phone tag. No scheduling chaos. The tech accepts via SMS, shows up, completes the job. Payment is automated.",
						},
					].map((item) => (
						<div
							key={item.step}
							className="rounded-xl border border-[#1a1a1a] bg-[#111] p-8 transition hover:border-[#EB7C00]/30"
						>
							<span className="font-mono text-sm" style={{ color: AMBER }}>
								{item.step}
							</span>
							<h3 className="mt-3 text-xl font-bold">{item.title}</h3>
							<p className="mt-3 text-sm leading-relaxed text-[#888]">{item.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function Stats() {
	return (
		<section className="border-t border-[#1a1a1a] py-20">
			<div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
				{STATS.map((stat) => (
					<div key={stat.unit} className="text-center">
						<div className="text-3xl font-black md:text-4xl" style={{ color: AMBER }}>
							{stat.value}
						</div>
						<div className="mt-1 text-sm font-semibold">{stat.unit}</div>
						<div className="mt-1 text-xs text-[#888]">{stat.detail}</div>
					</div>
				))}
			</div>
		</section>
	);
}

function Roles() {
	return (
		<section id="roles" className="border-t border-[#1a1a1a] py-24">
			<div className="mx-auto max-w-6xl px-6">
				<h2 className="text-center text-3xl font-bold md:text-4xl">
					We&apos;re building the team. <span style={{ color: AMBER }}>Are you in?</span>
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-center text-[#888]">
					STEADYWRK is a protocol, not a corporation. We need operators who think like founders.
				</p>
				<div className="mt-16 grid gap-6 md:grid-cols-3">
					{ROLES.map((role) => (
						<div
							key={role.title}
							className="group rounded-xl border border-[#1a1a1a] bg-[#111] p-8 transition hover:border-[#EB7C00]/40 hover:shadow-[0_0_40px_rgba(235,124,0,0.05)]"
						>
							<span
								className="inline-block rounded-full px-3 py-1 text-xs font-medium"
								style={{ backgroundColor: "rgba(235,124,0,0.1)", color: AMBER }}
							>
								{role.tag}
							</span>
							<h3 className="mt-4 text-xl font-bold">{role.title}</h3>
							<p className="mt-1 text-sm" style={{ color: "rgba(235,124,0,0.7)" }}>
								{role.subtitle}
							</p>
							<p className="mt-4 text-sm leading-relaxed text-[#888]">{role.description}</p>
							<a
								href="#apply"
								className="mt-6 inline-flex items-center gap-1 text-sm font-medium transition group-hover:gap-2"
								style={{ color: AMBER }}
							>
								Apply <span aria-hidden="true">&rarr;</span>
							</a>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function StackSection() {
	return (
		<section id="stack" className="border-t border-[#1a1a1a] py-24">
			<div className="mx-auto max-w-4xl px-6 text-center">
				<h2 className="text-3xl font-bold md:text-4xl">
					Built different. <span style={{ color: AMBER }}>Literally.</span>
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-[#888]">
					MCP-native architecture. Multi-agent AI orchestration. Every dispatch decision is made by
					an autonomous system that learns and improves.
				</p>
				<div className="mt-12 rounded-xl border border-[#1a1a1a] bg-[#111] p-8 text-left font-mono text-sm leading-relaxed">
					<div className="text-[#888]">{"// steadywrk dispatch protocol"}</div>
					<div>
						<span style={{ color: AMBER }}>agents</span>
						{": [claude-opus, codex-gpt5, gemini-ultra]"}
					</div>
					<div>
						<span style={{ color: AMBER }}>mcps</span>
						{": [dispatch-oracle, hawkeye, leadforge]"}
					</div>
					<div>
						<span style={{ color: AMBER }}>stack</span>
						{": next.js + supabase + cloudflare workers"}
					</div>
					<div>
						<span style={{ color: AMBER }}>matching</span>
						{": h3-geo + reputation + margin-calc"}
					</div>
					<div>
						<span style={{ color: AMBER }}>comms</span>
						{": voice-ai + sms-dispatch + auto-schedule"}
					</div>
					<div>
						<span style={{ color: AMBER }}>status</span>
						{": "}
						<span className="text-green-400">operational</span>
					</div>
				</div>
			</div>
		</section>
	);
}

function Apply() {
	return (
		<section id="apply" className="border-t border-[#1a1a1a] py-24">
			<div className="mx-auto max-w-2xl px-6 text-center">
				<h2 className="text-3xl font-bold md:text-4xl">
					Ready to <span style={{ color: AMBER }}>work steady?</span>
				</h2>
				<p className="mt-4 text-[#888]">
					Drop your info. We&apos;ll reach out if there&apos;s a fit. No fluff, no 12-step
					application. Just you and the work.
				</p>
				<form
					className="mt-10 flex flex-col gap-4"
					action="https://formspree.io/f/placeholder"
					method="POST"
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<input
							type="text"
							name="name"
							placeholder="Full name"
							required
							className="rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition focus:border-[#EB7C00]"
						/>
						<input
							type="email"
							name="email"
							placeholder="Email"
							required
							className="rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition focus:border-[#EB7C00]"
						/>
					</div>
					<input
						type="tel"
						name="phone"
						placeholder="Phone number"
						className="rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition focus:border-[#EB7C00]"
					/>
					<select
						name="role"
						required
						className="rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3 text-sm text-[#555] outline-none transition focus:border-[#EB7C00]"
					>
						<option value="">What role fits you?</option>
						<option value="technician">Field Technician</option>
						<option value="dispatch">Dispatch Operator</option>
						<option value="growth">Growth Partner</option>
						<option value="other">Something Else</option>
					</select>
					<textarea
						name="message"
						rows={3}
						placeholder="Tell us about yourself in 2-3 sentences (optional)"
						className="rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition focus:border-[#EB7C00]"
					/>
					<button
						type="submit"
						className="mt-2 rounded-lg py-3.5 text-base font-bold text-[#0A0A0A] transition hover:brightness-110"
						style={{ backgroundColor: AMBER }}
					>
						Submit Application
					</button>
				</form>
			</div>
		</section>
	);
}

function Footer() {
	return (
		<footer className="border-t border-[#1a1a1a] py-12">
			<div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-xs text-[#555]">
				<div className="flex items-center gap-2">
					<Logo className="h-5 w-auto" />
					<span className="text-sm font-extrabold tracking-[0.08em] text-white">STEADYWRK</span>
				</div>
				<p>AI-orchestrated dispatch. Built by Kayan Ventures.</p>
				<p>NEXFIX LLC &middot; Boulder, CO</p>
			</div>
		</footer>
	);
}

export default function Home() {
	return (
		<>
			<Nav />
			<Hero />
			<Solutions />
			<Stats />
			<Roles />
			<StackSection />
			<Apply />
			<Footer />
		</>
	);
}
