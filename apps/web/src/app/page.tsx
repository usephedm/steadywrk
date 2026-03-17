"use client";

import dynamic from "next/dynamic";
import { Apply } from "../components/sections/apply";
import { Careers } from "../components/sections/careers";
import { Features } from "../components/sections/features";
import { Footer } from "../components/sections/footer";
import { MapSection } from "../components/sections/map-section";
import { Nav } from "../components/sections/nav";
import { PricingSection } from "../components/sections/pricing";
import { Solutions } from "../components/sections/solutions";
import { StatsSection } from "../components/sections/stats";

const Hero = dynamic(
	() => import("../components/sections/hero").then((m) => ({ default: m.Hero })),
	{ ssr: false },
);

export default function Home() {
	return (
		<>
			<Nav />
			<Hero />
			<Solutions />
			<StatsSection />
			<Features />
			<MapSection />
			<PricingSection />
			<Careers />
			<Apply />
			<Footer />
		</>
	);
}
