export interface WorkflowStep {
	id: string;
	name: string;
	status: "pending" | "in_progress" | "completed" | "failed";
	assignedTo?: string;
	completedAt?: Date;
}

export interface SubcontractWorkflow {
	id: string;
	dispatchId: string;
	steps: WorkflowStep[];
	createdAt: Date;
	completedAt?: Date;
}
