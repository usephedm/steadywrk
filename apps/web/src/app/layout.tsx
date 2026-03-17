import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "../components/effects/custom-cursor";
import { GrainOverlay } from "../components/effects/grain-overlay";
import { LenisProvider } from "../components/providers/lenis-provider";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

const jetbrains = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://steadywrk.com"),
	title: "SteadyWrk — AI-Powered Field Service Dispatch",
	description:
		"The dispatch protocol that connects businesses to subcontracted field services. AI-orchestrated, MCP-native. Zero middlemen.",
	openGraph: {
		title: "SteadyWrk — AI-Powered Field Service Dispatch",
		description:
			"The dispatch protocol that connects businesses to subcontracted field services. AI-orchestrated, MCP-native.",
		siteName: "SteadyWrk",
		type: "website",
		images: [{ url: "/api/og", width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		title: "SteadyWrk — AI-Powered Field Service Dispatch",
		description: "AI-orchestrated dispatch. Zero middlemen. Just work.",
		images: ["/api/og"],
	},
};

export const viewport: Viewport = {
	themeColor: "#0A0A0A",
	colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
			<body className="bg-dark text-white antialiased font-sans">
				<LenisProvider>{children}</LenisProvider>
				<GrainOverlay />
				<CustomCursor />
			</body>
		</html>
	);
}
