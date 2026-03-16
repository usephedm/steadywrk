// CondomX core domain types

export enum TradeType {
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  HVAC = 'HVAC',
  GENERAL = 'GENERAL',
  CARPENTRY = 'CARPENTRY',
  PAINTING = 'PAINTING',
  LOCKSMITH = 'LOCKSMITH',
  ROOFING = 'ROOFING',
  FLOORING = 'FLOORING',
}

export enum Urgency {
  EMERGENCY = 'EMERGENCY',
  URGENT = 'URGENT',
  STANDARD = 'STANDARD',
  FLEXIBLE = 'FLEXIBLE',
}

export enum WorkOrderStatus {
  NEW = 'NEW',
  EVALUATING = 'EVALUATING',
  ACCEPTED = 'ACCEPTED',
  MATCHING = 'MATCHING',
  OUTREACH = 'OUTREACH',
  DISPATCHING = 'DISPATCHING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETING = 'COMPLETING',
  INVOICING = 'INVOICING',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
  ESCALATED = 'ESCALATED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
}

export enum DispatchStatus {
  PENDING = 'PENDING',
  CONTACTED = 'CONTACTED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SITE = 'ON_SITE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum OutreachMethod {
  SMS = 'SMS',
  VOICE = 'VOICE',
  BOTH = 'BOTH',
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
  h3Index: string;
}

export interface WorkOrder {
  id: string;
  dmgProId: string;
  accountId: string;
  title: string;
  description: string;
  tradeType: TradeType;
  urgency: Urgency;
  status: WorkOrderStatus;
  location: Location;
  clientName: string;
  siteType: string;
  estimatedPay: number;
  actualPay: number | null;
  createdAt: string;
  updatedAt: string;
  acceptedAt: string | null;
  dispatchedAt: string | null;
  completedAt: string | null;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  trades: TradeType[];
  h3Index: string;
  timezone: string;
  accountId: string;
  compositeScore: number;
  reliabilityScore: number;
  qualityScore: number;
  responsivenessScore: number;
  complianceScore: number;
  completedJobs: number;
  noShowCount: number;
  lastContactedAt: string | null;
  consentGivenAt: string | null;
  optedOut: boolean;
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  dmgProUsername: string;
  personaName: string;
  personaPhone: string;
  companyName: string;
  phoneNumbers: string[];
  active: boolean;
  createdAt: string;
}

export interface Dispatch {
  id: string;
  workOrderId: string;
  technicianId: string;
  accountId: string;
  status: DispatchStatus;
  outreachMethod: OutreachMethod;
  attempts: number;
  acceptedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  payAmount: number;
  platformCost: number;
  margin: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  accountId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  agentId: string;
}

export type ConsentType = 'sms' | 'voice' | 'recording' | 'ai_interaction';

export interface ConsentRecord {
  id: string;
  techId: string;
  consentType: ConsentType;
  method: string;
  timestamp: string;
  ipAddress: string | null;
}

export interface OptOutRecord {
  id: string;
  techId: string;
  source: string;
  rawMessage: string;
  timestamp: string;
}

export interface AuditFilters {
  entityId?: string;
  accountId?: string;
  action?: string;
  since?: Date;
  until?: Date;
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, HealthCheck>;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latencyMs: number;
  details: string;
}
