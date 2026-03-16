import type { ServiceCategory } from "./types";

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
	"plumbing",
	"electrical",
	"hvac",
	"landscaping",
	"cleaning",
	"general_maintenance",
	"digital_marketing",
	"web_development",
] as const;
