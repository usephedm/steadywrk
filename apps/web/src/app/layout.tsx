import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "SteadyWrk — AI-Powered Field Service Dispatch",
	description:
		"The dispatch protocol that connects businesses to subcontracted field services. AI-orchestrated, MCP-native. Apply to join the network.",
	openGraph: {
		title: "SteadyWrk — AI-Powered Field Service Dispatch",
		description: "The dispatch protocol that connects businesses to subcontracted field services.",
		siteName: "SteadyWrk",
		type: "website",
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="scroll-smooth">
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="bg-[#0A0A0A] text-white antialiased font-sans">{children}</body>
		</html>
	);
}
