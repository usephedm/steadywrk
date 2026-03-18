import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#0A0A0A",
				borderRadius: 6,
			}}
		>
			<svg
				width="24"
				height="20"
				viewBox="0 0 48 40"
				fill="none"
				role="img"
				aria-label="SteadyWrk icon"
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
		</div>,
		{ ...size },
	);
}
