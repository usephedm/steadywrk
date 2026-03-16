// CondomX H3 Geospatial Indexing + Urgency Tiers + BullMQ Dispatch Flows
//
// P1.5: Dispatch Brain Enhancements
// - H3 geospatial indexing for technician/job matching
// - Urgency tier classification (EMERGENCY, URGENT, STANDARD, FLEXIBLE)
// - BullMQ job flows for dispatch orchestration

import { latLngToCell, gridDisk, cellToLatLng, greatCircleDistance, UNITS } from 'h3-js';
import { Queue, Worker, type Job } from 'bullmq';
import type { WorkOrder, Technician } from '../core/types.js';
import { createLogger } from '../infra/logger.js';

const log = createLogger('brain:h3-geo');

// ---------------------------------------------------------------------------
// H3 Geospatial Indexing
// ---------------------------------------------------------------------------

const H3_RESOLUTION = 7; // ~5.16 km² per hex - good for city-level matching
const H3_LOOKUP_CACHE = new Map<string, string>(); // phoneNumber -> h3Index

export interface GeoIndexConfig {
  resolution: number;
  searchRadius: number; // kilometers
  maxResults: number;
}

const DEFAULT_GEO_CONFIG: GeoIndexConfig = {
  resolution: H3_RESOLUTION,
  searchRadius: 50, // 50km radius for technician search
  maxResults: 20,
};

/**
 * Get H3 index for a location
 */
export function getH3Index(lat: number, lng: number, resolution = H3_RESOLUTION): string {
  const cacheKey = `${lat}:${lng}:${resolution}`;
  const cached = H3_LOOKUP_CACHE.get(cacheKey);
  if (cached) return cached;

  const h3Index = latLngToCell(lat, lng, resolution);
  H3_LOOKUP_CACHE.set(cacheKey, h3Index);
  return h3Index;
}

/**
 * Find neighboring H3 cells within search radius
 */
export function getNeighboringCells(h3Index: string, radiusKm: number): string[] {
  // Calculate k-ring size based on radius
  // Each ring adds ~5km at resolution 7
  const k = Math.ceil(radiusKm / 5);
  return gridDisk(h3Index, k);
}

/**
 * Calculate distance between two H3 cells
 */
export function getCellDistance(cell1: string, cell2: string): number {
  const [lat1, lng1] = cellToLatLng(cell1);
  const [lat2, lng2] = cellToLatLng(cell2);
  return greatCircleDistance([lat1, lng1], [lat2, lng2], UNITS.km);
}

/**
 * Find technicians near a work order using H3 indexing
 */
export function findNearbyTechnicians(
  workOrder: WorkOrder,
  technicians: Technician[],
  config: GeoIndexConfig = DEFAULT_GEO_CONFIG,
): Technician[] {
  // Get work order H3 cell
  const woCell = getH3Index(workOrder.location.lat, workOrder.location.lng);

  // Get neighboring cells
  const neighborCells = getNeighboringCells(woCell, config.searchRadius);

  // Find technicians in neighboring cells
  const nearbyTechs = technicians.filter(tech => {
    const techCell = getH3Index(
      cellToLatLng(tech.h3Index)[0],
      cellToLatLng(tech.h3Index)[1],
    );
    return neighborCells.includes(techCell);
  });

  // Sort by distance and limit results
  return nearbyTechs
    .sort((a, b) => {
      const distA = getCellDistance(woCell, getH3Index(
        cellToLatLng(a.h3Index)[0],
        cellToLatLng(a.h3Index)[1],
      ));
      const distB = getCellDistance(woCell, getH3Index(
        cellToLatLng(b.h3Index)[0],
        cellToLatLng(b.h3Index)[1],
      ));
      return distA - distB;
    })
    .slice(0, config.maxResults);
}

// ---------------------------------------------------------------------------
// Urgency Tier Classification
// ---------------------------------------------------------------------------

export enum UrgencyTier {
  EMERGENCY = 'EMERGENCY', // <1 hour response
  URGENT = 'URGENT',       // <4 hour response
  STANDARD = 'STANDARD',   // <24 hour response
  FLEXIBLE = 'FLEXIBLE',   // <72 hour response
}

export interface UrgencyConfig {
  emegencyKeywords: string[];
  urgentKeywords: string[];
  standardKeywords: string[];
  responseTimeHours: Record<UrgencyTier, number>;
  maxOutreachAttempts: Record<UrgencyTier, number>;
  parallelOutreachCount: Record<UrgencyTier, number>;
}

const DEFAULT_URGENCY_CONFIG: UrgencyConfig = {
  emegencyKeywords: ['emergency', 'burst', 'flood', 'danger', 'hazard', 'critical', 'immediate'],
  urgentKeywords: ['urgent', 'asap', 'today', 'broken', 'not working', 'leak'],
  standardKeywords: ['repair', 'maintenance', 'install', 'replace', 'fix'],
  responseTimeHours: {
    [UrgencyTier.EMERGENCY]: 1,
    [UrgencyTier.URGENT]: 4,
    [UrgencyTier.STANDARD]: 24,
    [UrgencyTier.FLEXIBLE]: 72,
  },
  maxOutreachAttempts: {
    [UrgencyTier.EMERGENCY]: 10,
    [UrgencyTier.URGENT]: 5,
    [UrgencyTier.STANDARD]: 3,
    [UrgencyTier.FLEXIBLE]: 2,
  },
  parallelOutreachCount: {
    [UrgencyTier.EMERGENCY]: 5, // Contact 5 techs simultaneously
    [UrgencyTier.URGENT]: 3,
    [UrgencyTier.STANDARD]: 2,
    [UrgencyTier.FLEXIBLE]: 1,
  },
};

/**
 * Classify work order urgency tier based on description and metadata
 */
export function classifyUrgencyTier(
  description: string,
  _tradeType?: string,
  config: UrgencyConfig = DEFAULT_URGENCY_CONFIG,
): UrgencyTier {
  const lowerDesc = description.toLowerCase();

  // Check emergency keywords
  if (config.emegencyKeywords.some(k => lowerDesc.includes(k))) {
    return UrgencyTier.EMERGENCY;
  }

  // Check urgent keywords
  if (config.urgentKeywords.some(k => lowerDesc.includes(k))) {
    return UrgencyTier.URGENT;
  }

  // Check standard keywords
  if (config.standardKeywords.some(k => lowerDesc.includes(k))) {
    return UrgencyTier.STANDARD;
  }

  // Default to flexible
  return UrgencyTier.FLEXIBLE;
}

/**
 * Get urgency configuration for a tier
 */
export function getUrgencyConfig(tier: UrgencyTier, config: UrgencyConfig): {
  responseTimeHours: number;
  maxAttempts: number;
  parallelCount: number;
} {
  return {
    responseTimeHours: config.responseTimeHours[tier],
    maxAttempts: config.maxOutreachAttempts[tier],
    parallelCount: config.parallelOutreachCount[tier],
  };
}

// ---------------------------------------------------------------------------
// BullMQ Dispatch Job Flows
// ---------------------------------------------------------------------------

export interface DispatchJobData {
  workOrderId: string;
  workOrder: WorkOrder;
  urgencyTier: UrgencyTier;
  technicianIds: string[];
  currentAttempt: number;
  maxAttempts: number;
  parallelCount: number;
}

export interface DispatchJobResult {
  success: boolean;
  technicianId?: string;
  reason?: string;
  attempts: number;
}

const DISPATCH_QUEUE_NAME = 'dispatch-orchestration';
const REDIS_CONNECTION = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

let dispatchQueue: Queue<DispatchJobData> | null = null;
let dispatchWorker: Worker<DispatchJobData, DispatchJobResult> | null = null;

/**
 * Initialize dispatch queue and worker
 */
export function initDispatchQueue(): { queue: Queue; worker: Worker } {
  if (dispatchQueue && dispatchWorker) {
    return { queue: dispatchQueue, worker: dispatchWorker };
  }

  dispatchQueue = new Queue<DispatchJobData>(DISPATCH_QUEUE_NAME, {
    connection: REDIS_CONNECTION,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    },
  });

  dispatchWorker = new Worker<DispatchJobData, DispatchJobResult>(
    DISPATCH_QUEUE_NAME,
    async (job: Job<DispatchJobData>) => {
      return await processDispatchJob(job.data);
    },
    {
      connection: REDIS_CONNECTION,
      concurrency: 10, // Process 10 dispatches in parallel
    },
  );

  dispatchWorker.on('completed', (job, result) => {
    log.info(`Dispatch job ${job.id} completed: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  });

  dispatchWorker.on('failed', (job, err) => {
    log.error(`Dispatch job ${job?.id} failed: ${err.message}`);
  });

  log.info('Dispatch queue initialized');
  return { queue: dispatchQueue, worker: dispatchWorker };
}

/**
 * Process a single dispatch job
 */
async function processDispatchJob(data: DispatchJobData): Promise<DispatchJobResult> {
  log.info(`Processing dispatch for WO ${data.workOrderId}, attempt ${data.currentAttempt}/${data.maxAttempts}`);

  // Check if max attempts reached
  if (data.currentAttempt >= data.maxAttempts) {
    return {
      success: false,
      reason: 'Max outreach attempts reached',
      attempts: data.currentAttempt,
    };
  }

  // Get technicians to contact in parallel
  const techniciansToContact = data.technicianIds.slice(
    (data.currentAttempt - 1) * data.parallelCount,
    data.currentAttempt * data.parallelCount,
  );

  if (techniciansToContact.length === 0) {
    return {
      success: false,
      reason: 'No more technicians to contact',
      attempts: data.currentAttempt,
    };
  }

  // Contact technicians in parallel (SMS + voice based on urgency)
  const contactPromises = techniciansToContact.map(techId =>
    contactTechnician(techId, data.workOrder, data.urgencyTier),
  );

  const results = await Promise.all(contactPromises);
  const acceptedTech = results.find(r => r.accepted);

  if (acceptedTech) {
    return {
      success: true,
      technicianId: acceptedTech.technicianId,
      attempts: data.currentAttempt,
    };
  }

  // No acceptance, schedule next attempt
  if (data.currentAttempt < data.maxAttempts) {
    await dispatchQueue?.add(
      `dispatch-${data.workOrderId}-attempt-${data.currentAttempt + 1}`,
      {
        ...data,
        currentAttempt: data.currentAttempt + 1,
      },
      {
        delay: getDelayForUrgency(data.urgencyTier),
      },
    );
  }

  return {
    success: false,
    reason: 'No technician accepted',
    attempts: data.currentAttempt,
  };
}

/**
 * Contact a single technician
 */
async function contactTechnician(
  technicianId: string,
  workOrder: WorkOrder,
  urgencyTier: UrgencyTier,
): Promise<{ technicianId: string; accepted: boolean }> {
  // TODO: Integrate with SMS/voice services
  log.info(`Contacting tech ${technicianId} for WO ${workOrder.id} (${urgencyTier})`);

  // Placeholder - would integrate with SMS/voice services
  return {
    technicianId,
    accepted: false, // Would be determined by technician response
  };
}

/**
 * Get delay between attempts based on urgency
 */
function getDelayForUrgency(tier: UrgencyTier): number {
  switch (tier) {
    case UrgencyTier.EMERGENCY:
      return 60000; // 1 minute
    case UrgencyTier.URGENT:
      return 300000; // 5 minutes
    case UrgencyTier.STANDARD:
      return 900000; // 15 minutes
    case UrgencyTier.FLEXIBLE:
      return 3600000; // 1 hour
    default:
      return 900000;
  }
}

/**
 * Add work order to dispatch queue
 */
export async function queueDispatch(
  workOrder: WorkOrder,
  technicians: Technician[],
): Promise<string> {
  const urgencyTier = classifyUrgencyTier(workOrder.description, workOrder.tradeType);
  const nearbyTechs = findNearbyTechnicians(workOrder, technicians);

  if (nearbyTechs.length === 0) {
    throw new Error(`No technicians found near work order ${workOrder.id}`);
  }

  const config = getUrgencyConfig(urgencyTier, DEFAULT_URGENCY_CONFIG);

  const job = await dispatchQueue?.add(
    `dispatch-${workOrder.id}`,
    {
      workOrderId: workOrder.id,
      workOrder,
      urgencyTier,
      technicianIds: nearbyTechs.map(t => t.id),
      currentAttempt: 1,
      maxAttempts: config.maxAttempts,
      parallelCount: config.parallelCount,
    },
    {
      priority: getPriorityForUrgency(urgencyTier),
    },
  );

  log.info(`Queued dispatch for WO ${workOrder.id} with ${nearbyTechs.length} technicians`);
  return job?.id || '';
}

/**
 * Get job priority based on urgency
 */
function getPriorityForUrgency(tier: UrgencyTier): number {
  switch (tier) {
    case UrgencyTier.EMERGENCY:
      return 1; // Highest priority
    case UrgencyTier.URGENT:
      return 2;
    case UrgencyTier.STANDARD:
      return 3;
    case UrgencyTier.FLEXIBLE:
      return 4; // Lowest priority
    default:
      return 3;
  }
}

/**
 * Clean up queue and worker (for graceful shutdown)
 */
export async function cleanupDispatchQueue(): Promise<void> {
  await dispatchWorker?.close();
  await dispatchQueue?.close();
  dispatchWorker = null;
  dispatchQueue = null;
  log.info('Dispatch queue cleaned up');
}
