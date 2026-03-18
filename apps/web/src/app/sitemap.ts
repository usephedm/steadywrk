import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const base = "https://steadywrk.com";
	return [
		{ url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
		{
			url: `${base}/dashboard`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
	];
}
