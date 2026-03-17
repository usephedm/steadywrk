import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@steadywrk/ui", "@steadywrk/shared"],
	serverExternalPackages: ["three"],
	experimental: {
		viewTransition: true,
	},
};

export default nextConfig;
