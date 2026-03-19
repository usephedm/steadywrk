import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "../components/json-ld";
import { organizationSchema, trainingProgramSchema } from "../lib/schemas";

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
	metadataBase: new URL("https://steadywrk.app"),
	title: "SteadyWrk — We Train You. We Hire You.",
	description:
		"Jordan's first AI workforce company. 1-month paid bootcamp to master AI tools, then join the team and work on real international projects. No experience required. Apply now.",
	keywords: [
		"AI jobs Jordan",
		"AI training Amman",
		"AI bootcamp Jordan",
		"learn AI Jordan",
		"AI coworking",
		"tech jobs Amman",
		"remote work Jordan",
		"AI careers MENA",
		"prompt engineering training",
		"work with AI",
		"SteadyWrk",
		"وظائف ذكاء اصطناعي الأردن",
		"تدريب AI عمان",
		"فرص عمل عن بعد الأردن",
	],
	robots: {
		index: true,
		follow: true,
		"max-image-preview": "large",
	},
	openGraph: {
		title: "SteadyWrk — We Train You. We Hire You.",
		description:
			"Jordan's first AI workforce company. Paid bootcamp. Real projects. No degree required.",
		siteName: "SteadyWrk",
		type: "website",
		locale: "en_US",
		alternateLocale: "ar_JO",
		images: [{ url: "/api/og", width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		title: "SteadyWrk — We Train You. We Hire You.",
		description:
			"1-month paid AI bootcamp in Jordan. No experience needed. Master 20+ AI tools, then join the team and work on real projects.",
		images: ["/api/og"],
	},
	alternates: {
		canonical: "https://steadywrk.app",
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
				<JsonLd data={organizationSchema} />
				<JsonLd data={trainingProgramSchema} />
				{children}
			</body>
		</html>
	);
}
