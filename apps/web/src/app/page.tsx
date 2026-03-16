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

function Nav() {
	return (
		<nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0A0A0A]/90 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<a href="/" className="text-xl font-bold tracking-tight">
					Steady<span className="text-[#F59E0B]">Wrk</span>
				</a>
				<div className="hidden items-center gap-8 text-sm text-[#888] md:flex">
					<a href="#how" className="transition hover:text-white">
						How It Works
					</a>
					<a href="#roles" className="transition hover:text-white">
						Open Roles
					</a>
					<a href="#stack" className="transition hover:text-white">
						Our Stack
					</a>
				</div>
				<a
					href="#apply"
					className="rounded-lg bg-[#F59E0B] px-5 py-2 text-sm font-semibold text-[#0A0A0A] transition hover:bg-[#fbbf24]"
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
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)]" />
			<div className="relative">
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#111] px-4 py-1.5 text-xs text-[#888]">
					<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F59E0B]" />
					Now recruiting in all US markets
				</div>
				<h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1.1] tracking-tight md:text-7xl">
					The dispatch protocol
					<br />
					<span className="text-[#F59E0B]">that never sleeps.</span>
				</h1>
				<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#888] md:text-xl">
					AI-orchestrated field service dispatch. We connect businesses to independent technicians
					through an autonomous matching engine. No call centers. No middlemen. Just work.
				</p>
				<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
					<a
						href="#apply"
						className="rounded-lg bg-[#F59E0B] px-8 py-3.5 text-base font-bold text-[#0A0A0A] transition hover:bg-[#fbbf24] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
					>
						Join the Network
					</a>
					<a
						href="#how"
						className="rounded-lg border border-[#1a1a1a] px-8 py-3.5 text-base font-medium text-[#888] transition hover:border-[#333] hover:text-white"
					>
						See How It Works
					</a>
				</div>
			</div>
		</section>
	);
}

function HowItWorks() {
	return (
		<section id="how" className="border-t border-[#1a1a1a] py-24">
			<div className="mx-auto max-w-6xl px-6">
				<h2 className="text-center text-3xl font-bold md:text-4xl">
					Three steps. <span className="text-[#F59E0B]">Zero friction.</span>
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
							className="rounded-xl border border-[#1a1a1a] bg-[#111] p-8 transition hover:border-[#F59E0B]/30"
						>
							<span className="font-mono text-sm text-[#F59E0B]">{item.step}</span>
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
						<div className="text-3xl font-black text-[#F59E0B] md:text-4xl">{stat.value}</div>
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
					We&apos;re building the team. <span className="text-[#F59E0B]">Are you in?</span>
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-center text-[#888]">
					SteadyWrk is a protocol, not a corporation. We need operators who think like founders.
				</p>
				<div className="mt-16 grid gap-6 md:grid-cols-3">
					{ROLES.map((role) => (
						<div
							key={role.title}
							className="group rounded-xl border border-[#1a1a1a] bg-[#111] p-8 transition hover:border-[#F59E0B]/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.05)]"
						>
							<span className="inline-block rounded-full bg-[#F59E0B]/10 px-3 py-1 text-xs font-medium text-[#F59E0B]">
								{role.tag}
							</span>
							<h3 className="mt-4 text-xl font-bold">{role.title}</h3>
							<p className="mt-1 text-sm text-[#F59E0B]/70">{role.subtitle}</p>
							<p className="mt-4 text-sm leading-relaxed text-[#888]">{role.description}</p>
							<a
								href="#apply"
								className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[#F59E0B] transition group-hover:gap-2"
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

function Stack() {
	return (
		<section id="stack" className="border-t border-[#1a1a1a] py-24">
			<div className="mx-auto max-w-4xl px-6 text-center">
				<h2 className="text-3xl font-bold md:text-4xl">
					Built different. <span className="text-[#F59E0B]">Literally.</span>
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-[#888]">
					MCP-native architecture. Multi-agent AI orchestration. Every dispatch decision is made by
					an autonomous system that learns and improves.
				</p>
				<div className="mt-12 rounded-xl border border-[#1a1a1a] bg-[#111] p-8 text-left font-mono text-sm leading-relaxed">
					<div className="text-[#888]">{"// steadywrk dispatch protocol"}</div>
					<div>
						<span className="text-[#F59E0B]">agents</span>
						{": [claude-opus, codex-gpt5, gemini-ultra]"}
					</div>
					<div>
						<span className="text-[#F59E0B]">mcps</span>
						{": [dispatch-oracle, hawkeye, leadforge]"}
					</div>
					<div>
						<span className="text-[#F59E0B]">stack</span>
						{": next.js + supabase + cloudflare workers"}
					</div>
					<div>
						<span className="text-[#F59E0B]">matching</span>
						{": h3-geo + reputation + margin-calc"}
					</div>
					<div>
						<span className="text-[#F59E0B]">comms</span>
						{": voice-ai + sms-dispatch + auto-schedule"}
					</div>
					<div>
						<span className="text-[#F59E0B]">status</span>
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
					Ready to <span className="text-[#F59E0B]">work steady?</span>
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
							className="rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition focus:border-[#F59E0B]"
						/>
						<input
							type="email"
							name="email"
							placeholder="Email"
							required
							className="rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition focus:border-[#F59E0B]"
						/>
					</div>
					<input
						type="tel"
						name="phone"
						placeholder="Phone number"
						className="rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition focus:border-[#F59E0B]"
					/>
					<select
						name="role"
						required
						className="rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3 text-sm text-[#555] outline-none transition focus:border-[#F59E0B]"
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
						className="rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition focus:border-[#F59E0B]"
					/>
					<button
						type="submit"
						className="mt-2 rounded-lg bg-[#F59E0B] py-3.5 text-base font-bold text-[#0A0A0A] transition hover:bg-[#fbbf24] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
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
				<div className="text-sm font-bold">
					Steady<span className="text-[#F59E0B]">Wrk</span>
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
			<HowItWorks />
			<Stats />
			<Roles />
			<Stack />
			<Apply />
			<Footer />
		</>
	);
}
