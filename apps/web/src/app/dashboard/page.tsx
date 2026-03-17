"use client";

import { Button, Card, FadeIn, Stagger, StaggerItem } from "@steadywrk/ui";
import gsap from "gsap";
import { AnimatePresence, motion } from "motion/react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

/* ─── Mock Data ────────────────────────────────────────── */

const STATS = [
	{
		label: "Active Jobs",
		value: 24,
		display: "24",
		change: "+3",
		icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
	},
	{
		label: "Techs Online",
		value: 12,
		display: "12",
		change: "+2",
		icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
	},
	{
		label: "Completion Rate",
		value: 96,
		display: "96%",
		change: "+1.2%",
		icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
	},
	{
		label: "Revenue (MTD)",
		value: 18400,
		display: "$18.4k",
		change: "+12%",
		icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
	},
];

const JOBS = [
	{
		id: "SW-1042",
		type: "HVAC Repair",
		client: "Meridian Office Park",
		tech: "Marcus T.",
		status: "in_progress",
		urgency: "high",
		eta: "15 min",
	},
	{
		id: "SW-1041",
		type: "Plumbing",
		client: "Sunrise Apartments",
		tech: "Jake R.",
		status: "dispatched",
		urgency: "medium",
		eta: "32 min",
	},
	{
		id: "SW-1040",
		type: "Electrical",
		client: "Downtown Dental",
		tech: "Sarah K.",
		status: "in_progress",
		urgency: "low",
		eta: "On site",
	},
	{
		id: "SW-1039",
		type: "General Maintenance",
		client: "West Side Mall",
		tech: "Unassigned",
		status: "pending",
		urgency: "medium",
		eta: "—",
	},
	{
		id: "SW-1038",
		type: "Landscaping",
		client: "Cedar Ridge HOA",
		tech: "Mike D.",
		status: "completed",
		urgency: "low",
		eta: "Done",
	},
];

const ACTIVITY = [
	{ time: "2 min ago", text: "Marcus T. arrived at Meridian Office Park", type: "arrival" },
	{ time: "8 min ago", text: "Dispatch Oracle matched Jake R. to SW-1041", type: "match" },
	{ time: "15 min ago", text: "New work order SW-1042 created via API", type: "new" },
	{ time: "24 min ago", text: "Sarah K. completed inspection at Downtown Dental", type: "update" },
	{ time: "31 min ago", text: "Hawkeye flagged low tech coverage in Zone 4", type: "alert" },
];

/* ─── Helpers ──────────────────────────────────────────── */

function StIcon({ d }: { d: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="h-5 w-5"
			aria-hidden="true"
			role="img"
		>
			<path strokeLinecap="round" strokeLinejoin="round" d={d} />
		</svg>
	);
}

const statusColors: Record<string, string> = {
	in_progress: "text-blue-400 bg-blue-500/10",
	dispatched: "text-amber bg-amber/10",
	pending: "text-dark-700 bg-dark-400",
	completed: "text-green-400 bg-green-500/10",
};

const statusLabels: Record<string, string> = {
	in_progress: "In Progress",
	dispatched: "Dispatched",
	pending: "Pending",
	completed: "Completed",
};

const urgencyColors: Record<string, string> = {
	high: "text-red-400",
	medium: "text-yellow-400",
	low: "text-green-400",
};

const activityIcons: Record<string, string> = {
	arrival: "text-green-400",
	match: "text-amber",
	new: "text-blue-400",
	update: "text-purple-400",
	alert: "text-red-400",
};

/* ─── CountUp Card ────────────────────────────────────── */

function StatCountUp({ value, display }: { value: number; display: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true });
	const [shown, setShown] = useState(display);
	const isNumeric = !Number.isNaN(value) && value > 0 && !display.includes("$");

	useEffect(() => {
		if (!isInView || !isNumeric) return;

		const duration = 1200;
		const start = performance.now();

		const animate = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			const eased = 1 - (1 - progress) ** 3;
			const current = Math.round(eased * value);

			if (display.includes("%")) {
				setShown(`${current}%`);
			} else {
				setShown(String(current));
			}

			if (progress < 1) requestAnimationFrame(animate);
		};
		requestAnimationFrame(animate);
	}, [isInView, value, display, isNumeric]);

	return (
		<div ref={ref} className="text-2xl font-black">
			{shown}
		</div>
	);
}

/* ─── Map Dots with GSAP ──────────────────────────────── */

function DashboardMap() {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: true });

	useEffect(() => {
		if (!isInView || !svgRef.current) return;

		const dots = svgRef.current.querySelectorAll(".tech-dot");
		const routes = svgRef.current.querySelectorAll(".route-line");

		// Animate dots in
		dots.forEach((dot, i) => {
			gsap.fromTo(
				dot,
				{ scale: 0, transformOrigin: "center" },
				{ scale: 1, duration: 0.4, delay: i * 0.1, ease: "back.out(2)" },
			);
		});

		// Animate route lines
		routes.forEach((line, i) => {
			const el = line as SVGLineElement;
			const len = Math.hypot(
				Number.parseFloat(el.getAttribute("x2") ?? "0") -
					Number.parseFloat(el.getAttribute("x1") ?? "0"),
				Number.parseFloat(el.getAttribute("y2") ?? "0") -
					Number.parseFloat(el.getAttribute("y1") ?? "0"),
			);
			gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
			gsap.to(el, { strokeDashoffset: 0, duration: 1.5, delay: 0.3 + i * 0.2, ease: "power2.out" });
		});

		// Wandering motion on dots
		for (const dot of dots) {
			gsap.to(dot, {
				x: () => (Math.random() - 0.5) * 8,
				y: () => (Math.random() - 0.5) * 8,
				duration: 3,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: Math.random() * 2,
			});
		}
	}, [isInView]);

	const techDots = [
		{ x: 120, y: 80, color: "#22c55e", label: "Marcus T." },
		{ x: 280, y: 140, color: "#E07800", label: "Jake R." },
		{ x: 420, y: 70, color: "#3b82f6", label: "Sarah K." },
		{ x: 200, y: 180, color: "#22c55e", label: "Mike D." },
		{ x: 360, y: 120, color: "#E07800", label: "En Route" },
		{ x: 480, y: 170, color: "#22c55e", label: "Online" },
		{ x: 100, y: 150, color: "#3b82f6", label: "On Site" },
	];

	const routeLines = [
		{ x1: 280, y1: 140, x2: 120, y2: 80 },
		{ x1: 360, y1: 120, x2: 420, y2: 70 },
		{ x1: 200, y1: 180, x2: 280, y2: 140 },
	];

	return (
		<div ref={containerRef} className="relative h-80 bg-dark-100">
			<div
				className="absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>
			<svg
				ref={svgRef}
				className="absolute inset-0 h-full w-full"
				viewBox="0 0 600 240"
				aria-hidden="true"
				role="img"
			>
				{routeLines.map((r) => (
					<line
						key={`${r.x1}-${r.y1}-${r.x2}-${r.y2}`}
						className="route-line"
						x1={r.x1}
						y1={r.y1}
						x2={r.x2}
						y2={r.y2}
						stroke="#E07800"
						strokeWidth="1"
						opacity="0.3"
					/>
				))}
				{techDots.map((dot) => (
					<g key={dot.label} className="tech-dot">
						<circle cx={dot.x} cy={dot.y} r="8" fill={dot.color} opacity="0.15" />
						<circle cx={dot.x} cy={dot.y} r="4" fill={dot.color} />
						<text
							x={dot.x}
							y={dot.y - 12}
							textAnchor="middle"
							fill="#888"
							fontSize="10"
							fontFamily="monospace"
						>
							{dot.label}
						</text>
					</g>
				))}
			</svg>
			<span className="absolute bottom-4 right-4 text-xs text-dark-600">
				Live · Mapbox GL coming soon
			</span>
		</div>
	);
}

/* ─── Page ─────────────────────────────────────────────── */

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			{/* Stats Row */}
			<Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
				{STATS.map((stat) => (
					<StaggerItem key={stat.label}>
						<Card className="p-5">
							<div className="flex items-center justify-between">
								<div className="rounded-lg bg-amber/10 p-2 text-amber">
									<StIcon d={stat.icon} />
								</div>
								<span className="flex items-center gap-1 text-xs font-medium text-green-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										className="h-3 w-3"
										aria-hidden="true"
										role="img"
									>
										<path
											fillRule="evenodd"
											d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.93l-3.043.815a.75.75 0 01-.53-.919z"
											clipRule="evenodd"
										/>
									</svg>
									{stat.change}
								</span>
							</div>
							<div className="mt-3">
								<StatCountUp value={stat.value} display={stat.display} />
								<div className="text-xs text-dark-700">{stat.label}</div>
							</div>
						</Card>
					</StaggerItem>
				))}
			</Stagger>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Job Queue */}
				<FadeIn className="lg:col-span-2" delay={0.2}>
					<Card className="overflow-hidden p-0">
						<div className="flex items-center justify-between border-b border-dark-300 px-6 py-4">
							<div>
								<h2 className="font-bold">Job Queue</h2>
								<p className="text-xs text-dark-600">Real-time dispatch feed</p>
							</div>
							<Button variant="outline" size="sm">
								View All
							</Button>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead>
									<tr className="border-b border-dark-300 text-xs text-dark-600">
										<th className="px-6 py-3 font-medium">ID</th>
										<th className="px-6 py-3 font-medium">Type</th>
										<th className="px-6 py-3 font-medium">Client</th>
										<th className="px-6 py-3 font-medium">Tech</th>
										<th className="px-6 py-3 font-medium">Status</th>
										<th className="px-6 py-3 font-medium">ETA</th>
									</tr>
								</thead>
								<tbody>
									{JOBS.map((job, i) => (
										<motion.tr
											key={job.id}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.3 + i * 0.06 }}
											className="group border-b border-dark-300/50 transition hover:bg-dark-200/50"
										>
											<td className="relative px-6 py-3.5 font-mono text-xs text-amber">
												{/* Amber left border on hover */}
												<span className="absolute left-0 top-0 h-full w-0.5 bg-amber opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
												{job.id}
											</td>
											<td className="px-6 py-3.5">
												<div className="flex items-center gap-2">
													<span
														className={`h-1.5 w-1.5 rounded-full ${urgencyColors[job.urgency]}`}
														style={{ backgroundColor: "currentColor" }}
													/>
													{job.type}
												</div>
											</td>
											<td className="px-6 py-3.5 text-dark-800">{job.client}</td>
											<td className="px-6 py-3.5 text-dark-700">{job.tech}</td>
											<td className="px-6 py-3.5">
												<span
													className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[job.status]}`}
												>
													{statusLabels[job.status]}
												</span>
											</td>
											<td className="px-6 py-3.5 text-dark-600">{job.eta}</td>
										</motion.tr>
									))}
								</tbody>
							</table>
						</div>
					</Card>
				</FadeIn>

				{/* Activity Feed */}
				<FadeIn delay={0.3}>
					<Card className="p-0">
						<div className="border-b border-dark-300 px-6 py-4">
							<h2 className="font-bold">Activity</h2>
							<p className="text-xs text-dark-600">Live system events</p>
						</div>
						<div className="divide-y divide-dark-300/50">
							<AnimatePresence>
								{ACTIVITY.map((a, i) => (
									<motion.div
										key={`${a.time}-${a.type}`}
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ delay: 0.4 + i * 0.08 }}
										className="flex gap-3 px-6 py-3.5"
									>
										<div
											className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${activityIcons[a.type]}`}
											style={{ backgroundColor: "currentColor" }}
										/>
										<div className="min-w-0">
											<p className="text-sm text-dark-800 leading-snug">{a.text}</p>
											<p className="mt-0.5 text-xs text-dark-600">{a.time}</p>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</Card>
				</FadeIn>
			</div>

			{/* Map */}
			<FadeIn delay={0.4}>
				<Card className="relative overflow-hidden p-0">
					<div className="flex items-center justify-between border-b border-dark-300 px-6 py-4">
						<div>
							<h2 className="font-bold">Dispatch Map</h2>
							<p className="text-xs text-dark-600">Live technician locations &amp; active zones</p>
						</div>
						<div className="flex items-center gap-4 text-xs text-dark-600">
							<span className="flex items-center gap-1.5">
								<span className="h-2 w-2 rounded-full bg-green-400" />
								Online (12)
							</span>
							<span className="flex items-center gap-1.5">
								<span className="h-2 w-2 rounded-full bg-amber" />
								En Route (5)
							</span>
							<span className="flex items-center gap-1.5">
								<span className="h-2 w-2 rounded-full bg-blue-400" />
								On Site (7)
							</span>
						</div>
					</div>
					<DashboardMap />
				</Card>
			</FadeIn>
		</div>
	);
}
