// CondomX Voice engine — Retell AI REST API

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RetellCallStatus =
  | 'registered'
  | 'ongoing'
  | 'ended'
  | 'error';

export type RetellDisconnectReason =
  | 'user_hangup'
  | 'agent_hangup'
  | 'call_transfer'
  | 'voicemail_reached'
  | 'inactivity'
  | 'machine_detected'
  | 'max_duration_reached'
  | 'concurrency_limit_reached'
  | 'no_valid_payment'
  | 'dial_busy'
  | 'dial_failed'
  | 'dial_no_answer'
  | 'error_inbound_webhook'
  | 'error_llm_websocket_open'
  | 'error_llm_websocket_lost_connection'
  | 'error_llm_websocket_runtime'
  | 'error_llm_websocket_corrupt_payload'
  | 'error_frontend_corrupted_payload'
  | 'error_twilio'
  | 'error_no_audio_received'
  | 'error_asr'
  | 'error_retell'
  | 'error_unknown';

export interface RetellWebhookPayload {
  event: 'call_started' | 'call_ended' | 'call_analyzed';
  call: {
    call_id: string;
    agent_id: string;
    call_status: RetellCallStatus;
    from_number: string;
    to_number: string;
    direction: 'inbound' | 'outbound';
    start_timestamp: number;
    end_timestamp: number | null;
    duration_ms: number | null;
    transcript: string | null;
    transcript_object: Array<{
      role: 'agent' | 'user';
      content: string;
    }> | null;
    call_analysis: {
      call_summary: string | null;
      user_sentiment: 'Positive' | 'Negative' | 'Neutral' | null;
      call_successful: boolean | null;
      custom_analysis_data: Record<string, unknown> | null;
    } | null;
    metadata: Record<string, string> | null;
    disconnection_reason: RetellDisconnectReason | null;
  };
}

export interface CreateCallResult {
  callId: string;
}

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
// initiateCall
// ---------------------------------------------------------------------------

export async function initiateCall(
  to: string,
  from: string,
  agentId: string,
  metadata: Record<string, string>,
): Promise<CreateCallResult> {
  const apiKey = requireEnv('RETELL_API_KEY');

  const response = await fetch(
    'https://api.retellai.com/v2/create-phone-call',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_number: from,
        to_number: to,
        agent_id: agentId,
        metadata,
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Retell API error ${response.status}: ${errorBody}`,
    );
  }

  const json = (await response.json()) as { call_id: string };
  return { callId: json.call_id };
}

// ---------------------------------------------------------------------------
// Call webhook handler
// ---------------------------------------------------------------------------

export interface CallOutcome {
  callId: string;
  status: 'started' | 'ended' | 'analyzed';
  accepted: boolean | null;
  transcript: string | null;
  summary: string | null;
  sentiment: 'Positive' | 'Negative' | 'Neutral' | null;
  durationMs: number | null;
  disconnectReason: RetellDisconnectReason | null;
  metadata: Record<string, string> | null;
}

export type CallWebhookHandler = (outcome: CallOutcome) => Promise<void>;

let _callHandler: CallWebhookHandler | null = null;

export function registerCallHandler(handler: CallWebhookHandler): void {
  _callHandler = handler;
}

export async function handleCallWebhook(
  payload: RetellWebhookPayload,
): Promise<void> {
  const { event, call } = payload;

  const statusMap: Record<string, 'started' | 'ended' | 'analyzed'> = {
    'call_started': 'started',
    'call_ended': 'ended',
    'call_analyzed': 'analyzed',
  };

  const mappedStatus = statusMap[event];
  if (!mappedStatus) {
    return;
  }

  // Determine if the tech accepted the job based on call analysis
  let accepted: boolean | null = null;
  if (event === 'call_analyzed' && call.call_analysis) {
    accepted = call.call_analysis.call_successful ?? null;
  }

  const outcome: CallOutcome = {
    callId: call.call_id,
    status: mappedStatus,
    accepted,
    transcript: call.transcript ?? null,
    summary: call.call_analysis?.call_summary ?? null,
    sentiment: call.call_analysis?.user_sentiment ?? null,
    durationMs: call.duration_ms ?? null,
    disconnectReason: call.disconnection_reason ?? null,
    metadata: call.metadata ?? null,
  };

  if (_callHandler) {
    await _callHandler(outcome);
  }
}
