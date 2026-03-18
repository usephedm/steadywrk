import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#0A0A0A",
				fontFamily: "system-ui, sans-serif",
			}}
		>
			{/* Logo */}
			<svg
				width="120"
				height="100"
				viewBox="0 0 48 40"
				fill="none"
				role="img"
				aria-label="SteadyWrk logo"
			>
				<path
					d="M4 18 L14 8 L24 18 L34 8 L44 18 L40 22 L34 16 L24 22 L14 16 L8 22Z"
					fill="#F59E0B"
				/>
				<path
					d="M4 30 L14 20 L24 30 L34 20 L44 30 L40 34 L34 28 L24 34 L14 28 L8 34Z"
					fill="#F59E0B"
				/>
			</svg>

			{/* Title */}
			<div
				style={{
					marginTop: 24,
					fontSize: 64,
					fontWeight: 900,
					letterSpacing: "0.08em",
					color: "white",
				}}
			>
				STEADYWRK
			</div>

			{/* Tagline */}
			<div
				style={{
					marginTop: 16,
					fontSize: 28,
					color: "#F59E0B",
					fontWeight: 700,
				}}
			>
				Learn AI. Work with AI. Get Hired.
			</div>

			{/* Sub-tagline */}
			<div
				style={{
					marginTop: 12,
					fontSize: 18,
					color: "#888888",
				}}
			>
				Jordan's First AI Coworking Company
			</div>

			{/* Bottom bar */}
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: 4,
					background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
				}}
			/>
		</div>,
		{
			width: 1200,
			height: 630,
		},
	);
}
