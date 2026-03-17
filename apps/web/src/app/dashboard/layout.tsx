"use client";

import { LogoMark, cn } from "@steadywrk/ui";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const NAV_ITEMS = [
	{
		label: "Dashboard",
		href: "/dashboard",
		icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
	},
	{
		label: "Jobs",
		href: "/dashboard/jobs",
		icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
	},
	{
		label: "Technicians",
		href: "/dashboard/technicians",
		icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
	},
	{
		label: "Dispatch",
		href: "/dashboard/dispatch",
		icon: "M13 10V3L4 14h7v7l9-11h-7z",
	},
	{
		label: "Analytics",
		href: "/dashboard/analytics",
		icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
	},
	{
		label: "Settings",
		href: "/dashboard/settings",
		icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
	},
];

function NavIcon({ d, className }: { d: string; className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className={className ?? "h-5 w-5"}
			aria-hidden="true"
			role="img"
		>
			<path strokeLinecap="round" strokeLinejoin="round" d={d} />
		</svg>
	);
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
	return (
		<motion.aside
			layout
			className={cn(
				"fixed left-0 top-0 z-40 flex h-full flex-col border-r border-dark-300 bg-dark",
			)}
			animate={{ width: collapsed ? 64 : 240 }}
			transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
		>
			{/* Logo */}
			<div className="flex h-16 items-center justify-between border-b border-dark-300 px-4">
				<a href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
					<LogoMark className="h-7 w-auto shrink-0" />
					<AnimatePresence>
						{!collapsed && (
							<motion.span
								initial={{ opacity: 0, width: 0 }}
								animate={{ opacity: 1, width: "auto" }}
								exit={{ opacity: 0, width: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden text-sm font-extrabold tracking-[0.08em] whitespace-nowrap"
							>
								STEADYWRK
							</motion.span>
						)}
					</AnimatePresence>
				</a>
				<button
					type="button"
					onClick={onToggle}
					className="hidden rounded-md p-1 text-dark-600 transition hover:bg-dark-200 hover:text-white lg:block"
					aria-label="Toggle sidebar"
				>
					<NavIcon d={collapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"} className="h-4 w-4" />
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 space-y-1 p-3">
				{NAV_ITEMS.map((item) => {
					const active = item.href === "/dashboard";
					return (
						<a
							key={item.label}
							href={item.href}
							className={cn(
								"group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
								active
									? "bg-amber/10 text-amber"
									: "text-dark-700 hover:bg-dark-200 hover:text-white",
								collapsed && "justify-center px-2",
							)}
							title={collapsed ? item.label : undefined}
						>
							{/* Active indicator */}
							{active && (
								<motion.div
									layoutId="sidebar-active"
									className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-amber"
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								/>
							)}
							<motion.div
								whileHover={{ scale: 1.1 }}
								transition={{ type: "spring", stiffness: 400, damping: 20 }}
							>
								<NavIcon d={item.icon} className="h-5 w-5 shrink-0" />
							</motion.div>
							<AnimatePresence>
								{!collapsed && (
									<motion.span
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: "auto" }}
										exit={{ opacity: 0, width: 0 }}
										transition={{ duration: 0.2 }}
										className="overflow-hidden whitespace-nowrap"
									>
										{item.label}
									</motion.span>
								)}
							</AnimatePresence>
						</a>
					);
				})}
			</nav>

			{/* User */}
			<div className="border-t border-dark-300 p-3">
				<div
					className={cn(
						"flex items-center gap-3 rounded-lg px-3 py-2.5",
						collapsed && "justify-center px-2",
					)}
				>
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/20 text-xs font-bold text-amber">
						V
					</div>
					<AnimatePresence>
						{!collapsed && (
							<motion.div
								initial={{ opacity: 0, width: 0 }}
								animate={{ opacity: 1, width: "auto" }}
								exit={{ opacity: 0, width: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden"
							>
								<div className="truncate text-sm font-medium">V</div>
								<div className="truncate text-xs text-dark-600">Admin</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</motion.aside>
	);
}

function Topbar({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
	return (
		<motion.header
			layout
			className="fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-dark-300 bg-dark/80 px-6 backdrop-blur-xl"
			animate={{ left: sidebarCollapsed ? 64 : 240 }}
			transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
		>
			<div className="flex items-center gap-4">
				<h1 className="text-lg font-bold">Dashboard</h1>
				<span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs text-green-400">
					<span className="h-1.5 w-1.5 rounded-full bg-green-400" />
					All systems operational
				</span>
			</div>

			<div className="flex items-center gap-3">
				<div className="hidden items-center gap-2 rounded-lg border border-dark-300 bg-dark-200 px-3 py-2 text-sm text-dark-600 sm:flex">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						className="h-4 w-4"
						aria-hidden="true"
						role="img"
					>
						<path
							fillRule="evenodd"
							d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
							clipRule="evenodd"
						/>
					</svg>
					<span>Search...</span>
					<kbd className="rounded bg-dark-300 px-1.5 py-0.5 text-[10px] text-dark-600">⌘K</kbd>
				</div>

				<button
					type="button"
					className="relative rounded-lg p-2 text-dark-600 transition hover:bg-dark-200 hover:text-white"
					aria-label="Notifications"
				>
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
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
						/>
					</svg>
					<span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber" />
				</button>
			</div>
		</motion.header>
	);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="min-h-screen bg-dark">
			<Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
			<Topbar sidebarCollapsed={collapsed} />
			<motion.main
				animate={{ paddingLeft: collapsed ? 64 : 240 }}
				transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
				className="pt-16"
			>
				<div className="p-6">{children}</div>
			</motion.main>
		</div>
	);
}
