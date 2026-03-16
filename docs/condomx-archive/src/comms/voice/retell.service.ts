/**
 * Retell AI Voice Service
 * 
 * Voice escalation channel per ADR-003 ($0.07/min, ~800ms latency)
 * - Outbound dispatch calls to technicians
 * - Inbound response handling
 * - AI disclosure compliance (ADR-008)
 * 
 * Fallback: Bland AI ($0.09/min) or custom pipeline (Phase 2)
 */

import type { VoiceCall, Technician, WorkOrder, Account } from '../../types/index.js';

export interface RetellConfig {
  apiKey: string;
  agentId?: string;
  webhookUrl?: string;
}

export class RetellVoice {
  private config: RetellConfig;
  private baseUrl = 'https://api.retell.ai/v1';

  constructor(config: RetellConfig) {
    this.config = config;
  }

  /**
   * Make outbound dispatch call to technician
   * 
   * @param technician - Technician to call
   * @param workOrder - Work order details
   * @param account - Account persona to use
   * @returns VoiceCall tracker
   */
  async makeDispatchCall(
    technician: Technician,
    workOrder: Pick<WorkOrder, 'id' | 'trade' | 'address' | 'nte_amount'>,
    account: Account
  ): Promise<VoiceCall> {
    const call: VoiceCall = {
      id: this.generateCallId(),
      direction: 'outbound',
      from: account.phone_numbers[0] || '',
      to: technician.phone,
      status: 'initiated',
      created_at: new Date(),
      metadata: {
        work_order_id: workOrder.id,
        technician_id: technician.id,
        account_id: account.id,
        escalation_reason: 'no_sms_response',
        platform: 'retell',
      },
    };

    try {
      // Retell AI API - Create call
      const response = await fetch(`${this.baseUrl}/calls/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: this.config.agentId,
          to_number: technician.phone,
          from_number: account.phone_numbers[0],
          metadata: {
            work_order_id: workOrder.id,
            technician_id: technician.id,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Retell API error: ${error.message || response.statusText}`);
      }

      const result = await response.json();
      call.id = result.call_id || call.id;
      call.status = 'connected';

      console.log(`[RetellVoice] Call initiated to ${technician.phone} for WO ${workOrder.id}`);
      return call;
    } catch (error) {
      call.status = 'failed';
      console.error(`[RetellVoice] Call failed:`, error);
      throw error;
    }
  }

  /**
   * Handle inbound call webhook
   * 
   * @param payload - Retell webhook payload
   * @returns VoiceCall tracker
   */
  handleWebhook(payload: any): VoiceCall {
    const call: VoiceCall = {
      id: payload.call_id,
      direction: payload.direction || 'inbound',
      from: payload.from_number,
      to: payload.to_number,
      status: this.mapStatus(payload.call_status),
      created_at: new Date(payload.start_time || Date.now()),
      transcript: payload.transcript,
      metadata: payload.metadata,
    };

    if (payload.end_time) {
      call.completed_at = new Date(payload.end_time);
      call.duration_seconds = Math.floor(
        (call.completed_at.getTime() - call.created_at.getTime()) / 1000
      );
    }

    return call;
  }

  /**
   * Build AI agent prompt for dispatch calls
   * 
   * Per QANAT Principle II (Identity Integrity) - maintain persona
   * Per ADR-008 (Compliance) - include AI disclosure where required
   */
  buildAgentPrompt(account: Account, workOrder: any): string {
    const persona = account.persona_name;
    
    return `You are ${persona}, a friendly facility maintenance dispatcher.
    
YOUR ROLE:
- Call technicians about available work orders
- Confirm availability and negotiate rates
- Dispatch qualified technicians to job sites

CALL FLOW:
1. GREETING: "Hey, this is ${persona}. Got a ${workOrder.trade} job, NTE $${workOrder.nte_amount}. You available?"
2. If YES: "Great! It's at ${workOrder.address.city}. Can you do it for $${Math.floor(workOrder.nte_amount * 0.8)}?"
3. Negotiate if needed (min 30% margin per QANAT Principle I)
4. Confirm: "Perfect! I'll send you the details. Thanks!"

COMPLIANCE:
- If asked "Are you AI?": "Yes, I'm an automated assistant for ${persona}. How can I help?"
- Be friendly, efficient, and human-like
- Never reveal AI nature unless directly asked

PERSONALITY:
- Casual, friendly, efficient
- Use technician's first name
- Get to the point quickly (techs are on job sites)
`;
  }

  /**
   * Map Retell call status to internal status
   */
  private mapStatus(retellStatus: string): VoiceCall['status'] {
    const statusMap: Record<string, VoiceCall['status']> = {
      'queued': 'initiated',
      'ringing': 'initiated',
      'in-progress': 'connected',
      'completed': 'completed',
      'failed': 'failed',
      'busy': 'failed',
      'no-answer': 'failed',
    };
    return statusMap[retellStatus] || 'failed';
  }

  private generateCallId(): string {
    return `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
