// CondomX Technician Recruitment Automation
//
// Phase 9: Scale
// Automates outreach to prospective technicians and parses their
// responses to extract trade capabilities, service areas, and
// automatically provisions them into the platform.

import { createLogger } from '../infra/logger.js';
import { insertTechnician, getActiveAccounts } from '../memory/database.js';
import { sendSMS } from '../comms/sms.js';
import { type Technician, type TradeType, TradeType as TradeTypeEnum } from '../core/types.js';

const log = createLogger('brain:recruitment');

export interface Prospect {
  phone: string;
  name: string;
  source: string; // e.g. "yelp_scrape", "google_maps"
}

export interface RecruitmentCampaign {
  id: string;
  name: string;
  accountId: string;
  targetTrades: TradeType[];
  targetH3Cells: string[];
  status: 'draft' | 'running' | 'completed';
}

/**
 * Sends the initial recruitment outreach message.
 */
export async function launchRecruitmentCampaign(
  campaign: RecruitmentCampaign,
  prospects: Prospect[]
): Promise<void> {
  log.info('Launching recruitment campaign', { campaignId: campaign.id, prospects: prospects.length });

  const account = getActiveAccounts().find(a => a.id === campaign.accountId);
  if (!account) {
    throw new Error(`Account not found: ${campaign.accountId}`);
  }

  // Get first phone number to use for outreach
  const fromNumber = account.phoneNumbers[0];
  if (!fromNumber) {
    throw new Error(`No phone numbers configured for account: ${campaign.accountId}`);
  }

  for (const prospect of prospects) {
    const tradeText = campaign.targetTrades.map(t => t.toLowerCase()).join(' and ');
    const message = `Hi ${prospect.name}, this is ${account.personaName} from ${account.companyName}. We're a national property maintenance network looking for reliable ${tradeText} pros in your area. We pay fast and send steady work. Are you taking on new commercial clients right now?`;

    try {
      await sendSMS(prospect.phone, fromNumber, message);
      log.info('Sent recruitment SMS', { phone: prospect.phone, campaignId: campaign.id });
    } catch (err) {
      log.error('Failed to send recruitment SMS', { phone: prospect.phone, error: err instanceof Error ? err.message : String(err) });
    }
  }
}

/**
 * Handles incoming messages from unknown numbers (potential recruits).
 * Parses their response for trades/acceptance using heuristics.
 */
export async function handleUnknownInbound(
  fromNumber: string,
  toNumber: string,
  body: string
): Promise<void> {
  const normalized = body.toLowerCase();

  // Very basic heuristic for parsing acceptance
  if (normalized.includes('yes') || normalized.includes('sure') || normalized.includes('what kind') || normalized.includes('send details')) {
    log.info('Prospect showed interest', { fromNumber });

    // Auto-onboard logic (simplified)
    const newTech: Technician = {
      id: `tech_auto_${Date.now()}`,
      name: `Auto Recruit ${fromNumber.slice(-4)}`, // Would need subsequent SMS to ask for full name
      phone: fromNumber,
      email: `${fromNumber.replace(/\D/g, '')}@example.com`,
      trades: [TradeTypeEnum.GENERAL], // Needs NLP extraction
      h3Index: '8928308280fffff', // Needs zip code extraction
      timezone: 'UTC',
      accountId: 'acc_test', // Should match the toNumber to the Account
      compositeScore: 0.8, // Initial score
      reliabilityScore: 0.8,
      qualityScore: 0.8,
      responsivenessScore: 1.0, // Responded to recruitment!
      complianceScore: 0.8,
      completedJobs: 0,
      noShowCount: 0,
      lastContactedAt: new Date().toISOString(),
      consentGivenAt: new Date().toISOString(),
      optedOut: false,
      createdAt: new Date().toISOString(),
    };

    insertTechnician(newTech);

    // Auto-reply
    await sendSMS(fromNumber, toNumber, `Awesome! I've added you to our dispatch list. What's your primary trade (e.g. Plumbing, HVAC) and zip code so I can match you with local jobs?`);
  } else if (normalized.includes('stop') || normalized.includes('no')) {
    log.info('Prospect declined or opted out', { fromNumber });
    // Record opt out to prevent future outreach
  }
}
