import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "SteadyWrk — AI-Powered Dispatch",
	description: "AI-human bridge platform for field service dispatch and subcontracting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="bg-[#0A0A0A] text-white antialiased">{children}</body>
		</html>
	);
}
