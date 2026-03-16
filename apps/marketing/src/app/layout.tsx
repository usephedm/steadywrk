import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "SteadyWrk — Field Service Dispatch",
	description: "The AI-human bridge for field service dispatch and subcontracting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
