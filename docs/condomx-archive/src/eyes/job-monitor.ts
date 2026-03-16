// P1.7+ Job Monitor — Polls DMG Pro API for new work orders
// Integrates with P1.3 dispatch engine via event emitter
// Per ADR-002 (Browser Automation) and ADR-003 (Voice AI)

import { DmgMobileClient, createDmgMobileClient } from './mobile-api.js';
import type { WorkOrder } from '../core/types.js';
import { createLogger } from '../infra/logger.js';

const log = createLogger('eyes:job-monitor');

// ---------------------------------------------------------------------------
// Event Types (for P1.3/P1.5 integration)
// ---------------------------------------------------------------------------

export const JOB_MONITOR_EVENTS = {
  NEW_JOB: 'job-monitor:new-job',
  JOB_ACCEPTED: 'job-monitor:job-accepted',
  JOB_DECLINED: 'job-monitor:job-declined',
  ERROR: 'job-monitor:error',
  AUTH_REQUIRED: 'job-monitor:auth-required',
  CONNECTION_LOST: 'job-monitor:connection-lost',
  CONNECTION_RESTORED: 'job-monitor:connection-restored',
} as const;

export type JobMonitorEventType = (typeof JOB_MONITOR_EVENTS)[keyof typeof JOB_MONITOR_EVENTS];

export interface JobMonitorEvent {
  type: JobMonitorEventType;
  timestamp: string;
  data?: unknown;
}

export interface NewJobEvent extends JobMonitorEvent {
  type: 'job-monitor:new-job';
  data: { job: WorkOrder };
}

export interface JobAcceptedEvent extends JobMonitorEvent {
  type: 'job-monitor:job-accepted';
  data: { jobId: string; acceptedAt: string };
}

export interface JobMonitorErrorEvent extends JobMonitorEvent {
  type: 'job-monitor:error';
  data: { error: string; jobId?: string };
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export interface JobMonitorConfig {
  pollIntervalMs: number;
  dmgApiBaseUrl: string;
  dmgDeviceId: string;
  phone: string;
  smsCode?: string;
  maxRetries: number;
  retryDelayMs: number;
}

// ---------------------------------------------------------------------------
// Job Monitor Class
// ---------------------------------------------------------------------------

export class JobMonitor {
  private client: DmgMobileClient;
  private config: JobMonitorConfig;
  private isRunning: boolean = false;
  private processedJobIds: Set<string> = new Set();
  private pollTimer?: NodeJS.Timeout;
  private eventListeners: Map<JobMonitorEventType, Set<(event: JobMonitorEvent) => void>>;
  private consecutiveErrors: number = 0;
  private lastSuccessfulPoll: string | null = null;

  constructor(config: Partial<JobMonitorConfig> = {}) {
    this.config = {
      pollIntervalMs: config.pollIntervalMs ?? 30000, // 30s (QANAT: <60s detection)
      dmgApiBaseUrl: config.dmgApiBaseUrl ?? process.env.DMG_API_BASE_URL ?? 'https://api.dmgpro.com',
      dmgDeviceId: config.dmgDeviceId ?? process.env.DMG_DEVICE_ID ?? 'condomx-p1.7',
      phone: config.phone ?? process.env.DMG_PHONE ?? '',
      smsCode: config.smsCode,
      maxRetries: config.maxRetries ?? 3,
      retryDelayMs: config.retryDelayMs ?? 5000,
    };

    this.client = createDmgMobileClient({
      baseUrl: this.config.dmgApiBaseUrl,
      deviceId: this.config.dmgDeviceId,
      timeout: this.config.pollIntervalMs / 2,
    });

    this.eventListeners = new Map();
    Object.values(JOB_MONITOR_EVENTS).forEach(event => {
      this.eventListeners.set(event as JobMonitorEventType, new Set());
    });

    log.info('JobMonitor initialized', {
      pollInterval: this.config.pollIntervalMs,
      baseUrl: this.config.dmgApiBaseUrl,
    });
  }

  // ---------------------------------------------------------------------------
  // Event Emitter (for P1.3/P1.5 integration)
  // ---------------------------------------------------------------------------

  on(event: JobMonitorEventType, handler: (event: JobMonitorEvent) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.add(handler);
      log.debug('Event listener registered', { event, count: listeners.size });
    }
  }

  off(event: JobMonitorEventType, handler: (event: JobMonitorEvent) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(handler);
    }
  }

  private emit(event: JobMonitorEvent): void {
    const listeners = this.eventListeners.get(event.type as JobMonitorEventType);
    if (listeners) {
      listeners.forEach(handler => handler(event));
    }
    log.debug('Event emitted', { type: event.type });
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Start polling for new jobs
   * Emits job-monitor:new-job for each new work order
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      log.warn('Job monitor already running');
      return;
    }

    this.isRunning = true;
    log.info('Job monitor started', { pollInterval: this.config.pollIntervalMs });

    // Initial auth if SMS code provided
    if (this.config.smsCode) {
      try {
        await this.client.verifyOtp(this.config.phone, this.config.smsCode);
        log.info('Authenticated with DMG Pro API');
      } catch (error) {
        this.emit({
          type: JOB_MONITOR_EVENTS.AUTH_REQUIRED,
          timestamp: new Date().toISOString(),
          data: { error: String(error) },
        });
        log.error('Authentication failed', { error });
        return;
      }
    }

    // Start polling
    this.poll();
  }

  /**
   * Stop polling
   */
  stop(): void {
    this.isRunning = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = undefined;
    }
    log.info('Job monitor stopped', {
      processedJobs: this.processedJobIds.size,
      lastSuccessfulPoll: this.lastSuccessfulPoll,
    });
  }

  // ---------------------------------------------------------------------------
  // Polling Logic
  // ---------------------------------------------------------------------------

  private async poll(): Promise<void> {
    if (!this.isRunning) return;

    try {
      const jobs = await this.client.getPendingJobs();
      log.debug('Polled jobs', { count: jobs.length });

      this.consecutiveErrors = 0;
      this.lastSuccessfulPoll = new Date().toISOString();

      for (const dmgJob of jobs) {
        if (!this.processedJobIds.has(dmgJob.id)) {
          const job = this.client.toWorkOrder(dmgJob);
          this.emit({
            type: JOB_MONITOR_EVENTS.NEW_JOB,
            timestamp: new Date().toISOString(),
            data: { job },
          } as NewJobEvent);

          log.info('New job detected', {
            jobId: job.id,
            trade: job.tradeType,
            nte: job.estimatedPay,
            location: job.location.address,
            urgency: job.urgency,
          });

          this.processedJobIds.add(job.id);
        }
      }
    } catch (error) {
      this.consecutiveErrors++;
      log.error('Poll error', { error, consecutiveErrors: this.consecutiveErrors });

      this.emit({
        type: JOB_MONITOR_EVENTS.ERROR,
        timestamp: new Date().toISOString(),
        data: { error: String(error) },
      } as JobMonitorErrorEvent);

      if (this.consecutiveErrors >= this.config.maxRetries) {
        this.emit({
          type: JOB_MONITOR_EVENTS.CONNECTION_LOST,
          timestamp: new Date().toISOString(),
        });
        log.error('Max retries exceeded, stopping poller');
        this.stop();
        return;
      }
    }

    // Schedule next poll (with exponential backoff on errors)
    const nextPollDelay = this.consecutiveErrors > 0
      ? this.config.retryDelayMs * Math.pow(2, this.consecutiveErrors - 1)
      : this.config.pollIntervalMs;

    this.pollTimer = setTimeout(() => this.poll(), nextPollDelay);
  }

  // ---------------------------------------------------------------------------
  // Job Actions
  // ---------------------------------------------------------------------------

  /**
   * Accept a job via DMG Pro API
   * Emits job-monitor:job-accepted on success
   */
  async acceptJob(jobId: string): Promise<void> {
    try {
      await this.client.acceptJob(jobId);
      log.info('Job accepted', { jobId });

      this.emit({
        type: JOB_MONITOR_EVENTS.JOB_ACCEPTED,
        timestamp: new Date().toISOString(),
        data: { jobId, acceptedAt: new Date().toISOString() },
      } as JobAcceptedEvent);
    } catch (error) {
      log.error('Job accept failed', { jobId, error });
      this.emit({
        type: JOB_MONITOR_EVENTS.ERROR,
        timestamp: new Date().toISOString(),
        data: { error: String(error), jobId },
      } as JobMonitorErrorEvent);
      throw error;
    }
  }

  /**
   * Inject SMS code for authentication
   * Called by P1.3 SMS service when code received
   */
  async injectSmsCode(smsCode: string): Promise<void> {
    try {
      await this.client.verifyOtp(this.config.phone, smsCode);
      log.info('SMS code injected successfully');

      // Restore connection status
      this.emit({
        type: JOB_MONITOR_EVENTS.CONNECTION_RESTORED,
        timestamp: new Date().toISOString(),
      });

      this.consecutiveErrors = 0;
    } catch (error) {
      log.error('SMS code injection failed', { error });
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // Status & Metrics
  // ---------------------------------------------------------------------------

  getStatus(): {
    isRunning: boolean;
    processedJobs: number;
    consecutiveErrors: number;
    lastSuccessfulPoll: string | null;
  } {
    return {
      isRunning: this.isRunning,
      processedJobs: this.processedJobIds.size,
      consecutiveErrors: this.consecutiveErrors,
      lastSuccessfulPoll: this.lastSuccessfulPoll,
    };
  }

  /**
   * Get verification report from underlying client
   */
  async verifyEndpoints() {
    return await this.client.verifyEndpoints();
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createJobMonitor(config: Partial<JobMonitorConfig> = {}): JobMonitor {
  return new JobMonitor(config);
}
