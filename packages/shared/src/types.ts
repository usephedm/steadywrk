export interface User {
	id: string;
	email: string;
	name: string;
	role: "business" | "contractor" | "admin";
	createdAt: Date;
}

export type ServiceCategory =
	| "plumbing"
	| "electrical"
	| "hvac"
	| "landscaping"
	| "cleaning"
	| "general_maintenance"
	| "digital_marketing"
	| "web_development";
