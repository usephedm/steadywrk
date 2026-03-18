export const organizationSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "SteadyWrk",
	legalName: "Kayan Ventures Jordan LLC",
	url: "https://steadywrk.com",
	logo: "https://steadywrk.com/icon",
	contactPoint: {
		"@type": "ContactPoint",
		email: "careers@steadywrk.com",
		contactType: "recruiting",
		availableLanguage: ["English", "Arabic"],
	},
	address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
};

export const softwareSchema = {
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: "SteadyWrk",
	applicationCategory: "BusinessApplication",
	operatingSystem: "Web",
	description:
		"AI-powered field service dispatch platform with multi-agent orchestration, H3 geospatial matching, and autonomous technician scheduling.",
	url: "https://steadywrk.com",
	offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
			sameAs: "https://steadywrk.com",
			logo: "https://steadywrk.com/icon",
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
