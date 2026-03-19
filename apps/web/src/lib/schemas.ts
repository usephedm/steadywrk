export const organizationSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "SteadyWrk",
	legalName: "Kayan Ventures Jordan LLC",
	url: "https://steadywrk.app",
	logo: "https://steadywrk.app/icon",
	description:
		"Jordan's first AI workforce company. We train talent to work alongside AI, then deploy them on real international projects.",
	contactPoint: {
		"@type": "ContactPoint",
		email: "apply@steadywrk.app",
		contactType: "recruiting",
		availableLanguage: ["English", "Arabic"],
	},
	address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
	areaServed: [
		{ "@type": "Country", name: "Jordan" },
		{ "@type": "Place", name: "MENA Region" },
	],
};

export const trainingProgramSchema = {
	"@context": "https://schema.org",
	"@type": "EducationalOrganization",
	name: "SteadyWrk AI Bootcamp",
	description:
		"1-month intensive paid AI training bootcamp. Learn prompt engineering, AI-assisted coding, digital marketing with AI, and AI operations. No experience required. Graduates join the SteadyWrk team.",
	url: "https://steadywrk.app",
	address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
	areaServed: [
		{ "@type": "Country", name: "Jordan" },
		{ "@type": "Place", name: "MENA Region" },
	],
};
