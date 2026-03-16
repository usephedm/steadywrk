export interface DispatchRequest {
	id: string;
	serviceType: string;
	location: { lat: number; lng: number };
	urgency: "low" | "medium" | "high" | "emergency";
	requiredSkills: string[];
	budget?: number;
}

export interface DispatchMatch {
	contractorId: string;
	score: number;
	estimatedArrival: number;
	rate: number;
}
