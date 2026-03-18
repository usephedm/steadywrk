"use client";

import dynamic from "next/dynamic";
import { Apply } from "../components/sections/apply";
import { Careers } from "../components/sections/careers";
import { Countdown } from "../components/sections/countdown";
import { Curriculum } from "../components/sections/curriculum";
import { Footer } from "../components/sections/footer";
import { Nav } from "../components/sections/nav";
import { Program } from "../components/sections/program";
import { SocialProof } from "../components/sections/social-proof";
import { StatsSection } from "../components/sections/stats";
import { TerminalTyping } from "../components/sections/terminal-typing";
import { WhySection } from "../components/sections/why-section";

const Hero = dynamic(
	() => import("../components/sections/hero").then((m) => ({ default: m.Hero })),
	{ ssr: false },
);

export default function Home() {
	return (
		<>
			<Nav />
			<Hero />
			<StatsSection />
			<Program />
			<TerminalTyping />
			<Curriculum />
			<SocialProof />
			<WhySection />
			<Careers />
			<Apply />
			<Countdown />
			<Footer />
		</>
	);
}
