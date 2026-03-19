import { Apply } from "../components/sections/apply";
import { Countdown } from "../components/sections/countdown";
import { Curriculum } from "../components/sections/curriculum";
import { Footer } from "../components/sections/footer";
import { Hero } from "../components/sections/hero";
import { Nav } from "../components/sections/nav";
import { Program } from "../components/sections/program";
import { WhatsAppFloat } from "../components/sections/whatsapp-float";
import { WhySection } from "../components/sections/why-section";

export default function Home() {
	return (
		<>
			<Nav />
			<Hero />
			<Program />
			<Curriculum />
			<WhySection />
			<Countdown />
			<Apply />
			<Footer />
			<WhatsAppFloat />
		</>
	);
}
