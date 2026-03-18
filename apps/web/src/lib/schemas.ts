export const organizationSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "SteadyWrk",
	legalName: "Kayan Ventures Jordan LLC",
	url: "https://steadywrk.app",
	logo: "https://steadywrk.app/icon",
	description:
		"Jordan's first AI coworking company. We train talent to work alongside AI, then deploy them on real international projects.",
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
		"1-month intensive AI training bootcamp. Learn prompt engineering, AI-assisted coding, digital marketing with AI, and AI operations. No experience required.",
	url: "https://steadywrk.app",
	address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
	areaServed: [
		{ "@type": "Country", name: "Jordan" },
		{ "@type": "Place", name: "MENA Region" },
	],
};

export function jobPostingSchema(job: {
	title: string;
	description: string;
	salary?: { min: number; max: number };
	isRemote: boolean;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "JobPosting",
		title: job.title,
		description: job.description,
		datePosted: "2026-03-18",
		validThrough: "2026-12-31",
		hiringOrganization: {
			"@type": "Organization",
			name: "SteadyWrk",
			sameAs: "https://steadywrk.app",
			logo: "https://steadywrk.app/icon",
		},
		jobLocation: {
			"@type": "Place",
			address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
		},
		jobLocationType: job.isRemote ? "TELECOMMUTE" : undefined,
		employmentType: "FULL_TIME",
		...(job.salary && {
			baseSalary: {
				"@type": "MonetaryAmount",
				currency: "JOD",
				value: {
					"@type": "QuantitativeValue",
					minValue: job.salary.min,
					maxValue: job.salary.max,
					unitText: "MONTH",
				},
			},
		}),
	};
}
