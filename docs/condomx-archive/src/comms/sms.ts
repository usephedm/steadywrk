// CondomX SMS engine — Telnyx REST API (no SDK)

// Types imported from core (used by getStickyNumber signature documentation)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TelnyxWebhookPayload {
  data: {
    event_type: 'message.received' | 'message.sent' | 'message.finalized';
    id: string;
    occurred_at: string;
    payload: {
      id: string;
      direction: 'inbound' | 'outbound';
      from: { phone_number: string };
      to: Array<{ phone_number: string }>;
      text: string;
      completed_at: string | null;
      errors: Array<{ code: string; title: string }>;
    };
  };
}

export interface SendSMSResult {
  id: string;
  status: string;
}

export type OptOutResult = 'OPT_OUT' | 'SOFT_DECLINE' | 'NONE';

// ---------------------------------------------------------------------------
// Env helpers
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// ---------------------------------------------------------------------------
// sendSMS
// ---------------------------------------------------------------------------

export async function sendSMS(
  to: string,
  from: string,
  body: string,
): Promise<SendSMSResult> {
  const apiKey = requireEnv('TELNYX_API_KEY');
  const profileId = requireEnv('TELNYX_PROFILE_ID');

  const response = await fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      text: body,
      messaging_profile_id: profileId,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Telnyx API error ${response.status}: ${errorBody}`,
    );
  }

  const json = (await response.json()) as {
    data: { id: string; to: Array<{ status: string }> };
  };

  const firstRecipient = json.data.to[0];
  return {
    id: json.data.id,
    status: firstRecipient?.status ?? 'queued',
  };
}

// ---------------------------------------------------------------------------
// Sticky number assignment
// ---------------------------------------------------------------------------

// In-process store — will be replaced by SQLite once the DB layer lands.
// Key: `${accountId}:${techPhone}` -> assigned number
const stickyMap = new Map<string, string>();
// Track which numbers are already assigned per account
const assignedPerAccount = new Map<string, Set<string>>();

export function getStickyNumber(
  techPhone: string,
  accountId: string,
  accountPhonePool: string[],
): string {
  const key = `${accountId}:${techPhone}`;

  const existing = stickyMap.get(key);
  if (existing) {
    return existing;
  }

  // Find next available number from the account's pool
  let assigned = assignedPerAccount.get(accountId);
  if (!assigned) {
    assigned = new Set<string>();
    assignedPerAccount.set(accountId, assigned);
  }

  const available = accountPhonePool.find((n) => !assigned.has(n));
  if (!available) {
    throw new Error(
      `No available phone numbers in pool for account ${accountId}. ` +
      `Pool size: ${accountPhonePool.length}, assigned: ${assigned.size}`,
    );
  }

  assigned.add(available);
  stickyMap.set(key, available);
  return available;
}

// ---------------------------------------------------------------------------
// Opt-out detection
// ---------------------------------------------------------------------------

const EXACT_OPT_OUT_KEYWORDS = new Set([
  'stop',
  'unsubscribe',
  'cancel',
  'end',
  'quit',
]);

const SOFT_DECLINE_PATTERNS: RegExp[] = [
  /\bno\s*thanks?\b/i,
  /\bnot\s+interested\b/i,
  /\bremove\s+me\b/i,
  /\bdon'?t\s+(text|message|contact)\s+me\b/i,
  /\bleave\s+me\s+alone\b/i,
  /\btake\s+me\s+off\b/i,
  /\bopt\s*out\b/i,
  /\bstop\s+(texting|messaging|contacting)\b/i,
  /\bi('?m)?\s+done\b/i,
  /\bpass\b/i,
];

export function detectOptOut(message: string): OptOutResult {
  const normalized = message.trim().toLowerCase();

  // Exact keyword match (single-word responses)
  if (EXACT_OPT_OUT_KEYWORDS.has(normalized)) {
    return 'OPT_OUT';
  }

  // Multi-word but still an explicit carrier-standard opt-out
  // e.g. "STOP please" or "please STOP"
  for (const keyword of EXACT_OPT_OUT_KEYWORDS) {
    const pattern = new RegExp(`^\\s*(?:please\\s+)?${keyword}(?:\\s+please)?[.!]?\\s*$`, 'i');
    if (pattern.test(message)) {
      return 'OPT_OUT';
    }
  }

  // Soft decline patterns
  for (const pattern of SOFT_DECLINE_PATTERNS) {
    if (pattern.test(message)) {
      return 'SOFT_DECLINE';
    }
  }

  return 'NONE';
}

// ---------------------------------------------------------------------------
// Inbound webhook handler
// ---------------------------------------------------------------------------

export type InboundSMSHandler = (
  from: string,
  to: string,
  body: string,
  messageId: string,
) => Promise<void>;

// Registered handler for routing inbound messages to the dispatch engine
let _inboundHandler: InboundSMSHandler | null = null;

export function registerInboundHandler(handler: InboundSMSHandler): void {
  _inboundHandler = handler;
}

export async function handleInboundSMS(
  payload: TelnyxWebhookPayload,
): Promise<void> {
  const event = payload.data;

  // Only process inbound received messages
  if (event.event_type !== 'message.received') {
    return;
  }

  const { payload: msg } = event;
  if (msg.direction !== 'inbound') {
    return;
  }

  const fromNumber = msg.from.phone_number;
  const toNumber = msg.to[0]?.phone_number;
  if (!toNumber) {
    return;
  }

  const body = msg.text;
  const messageId = msg.id;

  // Check for opt-out before routing
  const optOutStatus = detectOptOut(body);

  if (optOutStatus === 'OPT_OUT') {
    // Carrier-mandated: must stop all messaging immediately.
    // The dispatch engine will handle marking the tech as opted-out.
    console.log(
      `[sms] OPT_OUT received from ${fromNumber} (message: ${messageId})`,
    );
  }

  // Route to dispatch engine (handler decides what to do with opt-outs too)
  if (_inboundHandler) {
    await _inboundHandler(fromNumber, toNumber, body, messageId);
  }
}
