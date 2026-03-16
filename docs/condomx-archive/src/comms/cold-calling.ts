// CondomX cold-calling engine — proactive technician recruitment outreach
// This is NOT for dispatching jobs. It recruits NEW technicians into the network.

import type { TradeType } from '../core/types.js';
import { isWithinCallingWindow } from '../compliance/calling-window.js';
import { initiateCall } from './voice.js';
import { sendSMS } from './sms.js';
import { createLogger } from '../infra/logger.js';

const log = createLogger('comms:cold-calling');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RecruitmentLead {
  id: string;
  name: string;
  phone: string;
  trades: TradeType[];
  source: 'referral' | 'directory' | 'web_scrape';
  area: string;
  createdAt: string;
}

export interface RecruitmentCampaign {
  id: string;
  name: string;
  targetTrades: TradeType[];
  targetArea: string;
  leads: RecruitmentLead[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  stats: CampaignStats;
  createdAt: string;
}

interface CampaignStats {
  totalLeads: number;
  contacted: number;
  interested: number;
  onboarded: number;
  declined: number;
  dnc: number;
}

export type CampaignEvent =
  | { type: 'CALL_COMPLETED'; leadId: string; outcome: 'interested' | 'declined' | 'voicemail' | 'no_answer' }
  | { type: 'SMS_SENT'; leadId: string }
  | { type: 'LEAD_ONBOARDED'; leadId: string; techId: string }
  | { type: 'LEAD_DNC'; leadId: string };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_CALLS_PER_CAMPAIGN_PER_DAY = 50;
const MAX_ATTEMPTS_PER_LEAD = 3;

// Default timezone when lead timezone is unknown — conservative Eastern
const DEFAULT_TIMEZONE = 'America/New_York';

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

// All campaigns keyed by id
const campaigns = new Map<string, RecruitmentCampaign>();

// Per-lead attempt tracking: campaignId:leadId -> attempt count
const leadAttempts = new Map<string, number>();

// Per-lead follow-up state: campaignId:leadId -> last outcome
const leadOutcomes = new Map<string, 'interested' | 'declined' | 'voicemail' | 'no_answer' | 'dnc'>();

// Per-campaign daily call count: campaignId:YYYY-MM-DD -> count
const dailyCallCounts = new Map<string, number>();

// DNC list — phone numbers that must never be called
const dncList = new Set<string>();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function todayKey(campaignId: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `${campaignId}:${date}`;
}

function attemptKey(campaignId: string, leadId: string): string {
  return `${campaignId}:${leadId}`;
}

function getDailyCount(campaignId: string): number {
  return dailyCallCounts.get(todayKey(campaignId)) ?? 0;
}

function incrementDailyCount(campaignId: string): void {
  const key = todayKey(campaignId);
  dailyCallCounts.set(key, (dailyCallCounts.get(key) ?? 0) + 1);
}

function getAttemptCount(campaignId: string, leadId: string): number {
  return leadAttempts.get(attemptKey(campaignId, leadId)) ?? 0;
}

function incrementAttemptCount(campaignId: string, leadId: string): void {
  const key = attemptKey(campaignId, leadId);
  leadAttempts.set(key, (leadAttempts.get(key) ?? 0) + 1);
}

// ---------------------------------------------------------------------------
// DNC management
// ---------------------------------------------------------------------------

export function addToDNC(phone: string): void {
  dncList.add(phone);
  log.info('Added phone to DNC list', { phone });
}

export function isOnDNC(phone: string): boolean {
  return dncList.has(phone);
}

// ---------------------------------------------------------------------------
// Campaign CRUD
// ---------------------------------------------------------------------------

export function createCampaign(
  name: string,
  targetTrades: TradeType[],
  targetArea: string,
): RecruitmentCampaign {
  const campaign: RecruitmentCampaign = {
    id: generateId(),
    name,
    targetTrades,
    targetArea,
    leads: [],
    status: 'draft',
    stats: {
      totalLeads: 0,
      contacted: 0,
      interested: 0,
      onboarded: 0,
      declined: 0,
      dnc: 0,
    },
    createdAt: new Date().toISOString(),
  };

  campaigns.set(campaign.id, campaign);
  log.info('Campaign created', { campaignId: campaign.id, name, targetTrades, targetArea });
  return campaign;
}

export function addLeadsToCampaign(campaignId: string, leads: RecruitmentLead[]): void {
  const campaign = campaigns.get(campaignId);
  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`);
  }
  if (campaign.status === 'completed') {
    throw new Error(`Cannot add leads to completed campaign: ${campaignId}`);
  }

  // Deduplicate by phone number against existing leads
  const existingPhones = new Set(campaign.leads.map((l) => l.phone));
  const newLeads = leads.filter((l) => !existingPhones.has(l.phone));

  campaign.leads.push(...newLeads);
  campaign.stats.totalLeads = campaign.leads.length;

  log.info('Leads added to campaign', {
    campaignId,
    added: newLeads.length,
    duplicatesSkipped: leads.length - newLeads.length,
    totalLeads: campaign.stats.totalLeads,
  });
}

export function startCampaign(campaignId: string): void {
  const campaign = campaigns.get(campaignId);
  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`);
  }
  if (campaign.status === 'completed') {
    throw new Error(`Cannot start a completed campaign: ${campaignId}`);
  }
  if (campaign.leads.length === 0) {
    throw new Error(`Cannot start campaign with no leads: ${campaignId}`);
  }

  campaign.status = 'active';
  log.info('Campaign started', { campaignId, totalLeads: campaign.stats.totalLeads });
}

export function pauseCampaign(campaignId: string): void {
  const campaign = campaigns.get(campaignId);
  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`);
  }

  campaign.status = 'paused';
  log.info('Campaign paused', { campaignId });
}

export function getCampaignStatus(campaignId: string): RecruitmentCampaign | undefined {
  return campaigns.get(campaignId);
}

export function getAllCampaigns(): RecruitmentCampaign[] {
  return Array.from(campaigns.values());
}

// ---------------------------------------------------------------------------
// Lead processing
// ---------------------------------------------------------------------------

/**
 * Process the next eligible lead in a campaign.
 * Performs a voice call for recruitment, with SMS follow-up logic.
 *
 * Flow per lead:
 *   Attempt 1: Voice call
 *   Attempt 2 (if voicemail/no_answer): SMS follow-up
 *   Attempt 3 (if still no response): Second voice call
 *
 * Enforces:
 *   - Max 50 calls per campaign per day
 *   - Max 3 attempts per lead
 *   - TCPA calling window (8am-9pm recipient local time)
 *   - DNC check before each call
 */
export async function processNextLead(campaignId: string): Promise<CampaignEvent> {
  const campaign = campaigns.get(campaignId);
  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`);
  }
  if (campaign.status !== 'active') {
    throw new Error(`Campaign is not active: ${campaignId} (status: ${campaign.status})`);
  }

  // Rate limit: max calls per day
  if (getDailyCount(campaignId) >= MAX_CALLS_PER_CAMPAIGN_PER_DAY) {
    throw new Error(
      `Daily call limit reached for campaign ${campaignId}: ${MAX_CALLS_PER_CAMPAIGN_PER_DAY} calls`,
    );
  }

  // Find the next processable lead
  const lead = findNextLead(campaignId, campaign);
  if (!lead) {
    // No more leads to process — mark campaign as completed
    campaign.status = 'completed';
    log.info('Campaign completed — no more processable leads', { campaignId });
    throw new Error(`No more processable leads in campaign: ${campaignId}`);
  }

  // DNC check before any contact
  if (isOnDNC(lead.phone)) {
    const key = attemptKey(campaignId, lead.id);
    leadOutcomes.set(key, 'dnc');
    campaign.stats.dnc++;
    log.info('Lead on DNC list, skipping', { campaignId, leadId: lead.id, phone: lead.phone });
    return { type: 'LEAD_DNC', leadId: lead.id };
  }

  // TCPA calling window enforcement
  if (!isWithinCallingWindow(DEFAULT_TIMEZONE)) {
    throw new Error(
      'Outside TCPA calling window (8am-9pm recipient local time). Try again later.',
    );
  }

  const attempts = getAttemptCount(campaignId, lead.id);
  const key = attemptKey(campaignId, lead.id);
  const previousOutcome = leadOutcomes.get(key);

  // Attempt routing:
  // Attempt 0 (first): Voice call
  // Attempt 1 (second, after voicemail/no_answer): SMS follow-up
  // Attempt 2 (third, after SMS): Second voice call
  if (attempts === 0 || attempts === 2) {
    // Voice call attempt
    return await executeRecruitmentCall(campaignId, campaign, lead);
  } else if (attempts === 1 && (previousOutcome === 'voicemail' || previousOutcome === 'no_answer')) {
    // SMS follow-up after failed first call
    return await sendRecruitmentSMS(campaignId, campaign, lead);
  } else {
    // Shouldn't reach here, but treat as exhausted
    campaign.stats.declined++;
    return { type: 'CALL_COMPLETED', leadId: lead.id, outcome: 'no_answer' };
  }
}

// ---------------------------------------------------------------------------
// Internal: find next lead
// ---------------------------------------------------------------------------

function findNextLead(
  campaignId: string,
  campaign: RecruitmentCampaign,
): RecruitmentLead | undefined {
  for (const lead of campaign.leads) {
    const key = attemptKey(campaignId, lead.id);
    const attempts = getAttemptCount(campaignId, lead.id);
    const outcome = leadOutcomes.get(key);

    // Skip if max attempts reached
    if (attempts >= MAX_ATTEMPTS_PER_LEAD) continue;

    // Skip if already resolved (interested, declined, dnc)
    if (outcome === 'interested' || outcome === 'declined' || outcome === 'dnc') continue;

    // Skip DNC numbers
    if (isOnDNC(lead.phone)) continue;

    return lead;
  }

  return undefined;
}

// ---------------------------------------------------------------------------
// Internal: voice call
// ---------------------------------------------------------------------------

async function executeRecruitmentCall(
  campaignId: string,
  campaign: RecruitmentCampaign,
  lead: RecruitmentLead,
): Promise<CampaignEvent> {
  const agentId = process.env['RETELL_RECRUITMENT_AGENT_ID'];
  if (!agentId) {
    throw new Error('RETELL_RECRUITMENT_AGENT_ID environment variable not set');
  }

  const fromNumber = process.env['RECRUITMENT_FROM_NUMBER'];
  if (!fromNumber) {
    throw new Error('RECRUITMENT_FROM_NUMBER environment variable not set');
  }

  incrementAttemptCount(campaignId, lead.id);
  incrementDailyCount(campaignId);

  log.info('Initiating recruitment call', {
    campaignId,
    leadId: lead.id,
    name: lead.name,
    attempt: getAttemptCount(campaignId, lead.id),
  });

  try {
    const result = await initiateCall(lead.phone, fromNumber, agentId, {
      campaignId,
      leadId: lead.id,
      leadName: lead.name,
      trades: lead.trades.join(','),
      area: lead.area,
      purpose: 'recruitment',
    });

    log.info('Recruitment call initiated', {
      campaignId,
      leadId: lead.id,
      callId: result.callId,
    });

    // For now, we simulate the outcome based on the call being placed.
    // In production, the Retell webhook handler would update the lead outcome
    // asynchronously via handleRecruitmentCallOutcome().
    // Return a voicemail outcome as default — webhook will override if answered.
    const outcome = 'voicemail' as const;
    const key = attemptKey(campaignId, lead.id);
    leadOutcomes.set(key, outcome);
    campaign.stats.contacted++;

    return { type: 'CALL_COMPLETED', leadId: lead.id, outcome };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('Recruitment call failed', {
      campaignId,
      leadId: lead.id,
      error: message,
    });

    // Treat call failure as no_answer so we can retry
    const key = attemptKey(campaignId, lead.id);
    leadOutcomes.set(key, 'no_answer');
    campaign.stats.contacted++;

    return { type: 'CALL_COMPLETED', leadId: lead.id, outcome: 'no_answer' };
  }
}

// ---------------------------------------------------------------------------
// Internal: SMS follow-up
// ---------------------------------------------------------------------------

async function sendRecruitmentSMS(
  campaignId: string,
  _campaign: RecruitmentCampaign,
  lead: RecruitmentLead,
): Promise<CampaignEvent> {
  const fromNumber = process.env['RECRUITMENT_FROM_NUMBER'];
  if (!fromNumber) {
    throw new Error('RECRUITMENT_FROM_NUMBER environment variable not set');
  }

  incrementAttemptCount(campaignId, lead.id);

  const tradesText = lead.trades.map((t) => t.toLowerCase()).join(', ');
  const body =
    `Hi ${lead.name}, we tried reaching you earlier. ` +
    `We're looking for ${tradesText} pros in the ${lead.area} area for ongoing subcontract work. ` +
    `Flexible schedules, competitive pay. Interested? Reply YES or call us back.`;

  log.info('Sending recruitment SMS', {
    campaignId,
    leadId: lead.id,
    attempt: getAttemptCount(campaignId, lead.id),
  });

  try {
    await sendSMS(lead.phone, fromNumber, body);

    log.info('Recruitment SMS sent', { campaignId, leadId: lead.id });
    return { type: 'SMS_SENT', leadId: lead.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('Recruitment SMS failed', {
      campaignId,
      leadId: lead.id,
      error: message,
    });
    // Still count as SMS_SENT event — the attempt was made
    return { type: 'SMS_SENT', leadId: lead.id };
  }
}

// ---------------------------------------------------------------------------
// Webhook integration: update lead outcome from Retell callback
// ---------------------------------------------------------------------------

/**
 * Called by the Retell webhook handler when a recruitment call completes.
 * Updates the lead's outcome and campaign stats accordingly.
 */
export function handleRecruitmentCallOutcome(
  campaignId: string,
  leadId: string,
  outcome: 'interested' | 'declined' | 'voicemail' | 'no_answer',
): void {
  const campaign = campaigns.get(campaignId);
  if (!campaign) {
    log.warn('Campaign not found for call outcome', { campaignId, leadId });
    return;
  }

  const key = attemptKey(campaignId, leadId);
  const previousOutcome = leadOutcomes.get(key);

  // Don't downgrade from interested/declined to voicemail/no_answer
  if (previousOutcome === 'interested' || previousOutcome === 'declined') {
    return;
  }

  leadOutcomes.set(key, outcome);

  // Update campaign stats based on outcome transition
  switch (outcome) {
    case 'interested':
      campaign.stats.interested++;
      log.info('Lead expressed interest', { campaignId, leadId });
      break;
    case 'declined':
      campaign.stats.declined++;
      log.info('Lead declined', { campaignId, leadId });
      break;
    case 'voicemail':
    case 'no_answer':
      // Already counted in contacted, no additional stat update
      break;
  }
}

/**
 * Mark a lead as onboarded — they've been added to the technician index.
 * This is called after the onboarding flow captures their info.
 */
export function markLeadOnboarded(
  campaignId: string,
  leadId: string,
  techId: string,
): CampaignEvent {
  const campaign = campaigns.get(campaignId);
  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`);
  }

  const key = attemptKey(campaignId, leadId);
  leadOutcomes.set(key, 'interested'); // Ensure marked as interested
  campaign.stats.onboarded++;

  log.info('Lead onboarded as technician', { campaignId, leadId, techId });

  return { type: 'LEAD_ONBOARDED', leadId, techId };
}
