/**
 * Telnyx SMS Service Implementation
 * 
 * Primary SMS provider per ADR-004 ($0.004/msg)
 * - Send/receive SMS
 * - Sticky Sender logic (tech -> number mapping)
 * - A2P 10DLC compliance ready
 * 
 * Hot-swap compatible with Twilio via abstraction layer
 */

import type { SMSMessage, SMSMetadata, Account, Technician } from '../../types/index.js';

export interface TelnyxConfig {
  apiKey: string;
  apiSecret: string;
  phoneNumber: string;
  webhookUrl?: string;
}

export class TelnyxSMS {
  private config: TelnyxConfig;
  private baseUrl = 'https://api.telnyx.com/v2';

  constructor(config: TelnyxConfig) {
    this.config = config;
  }

  /**
   * Send SMS message
   * 
   * @param to - Recipient phone number (E.164 format)
   * @param body - Message body
   * @param metadata - Dispatch metadata for tracking
   * @returns SMSMessage with status
   */
  async send(
    to: string,
    body: string,
    metadata?: SMSMetadata
  ): Promise<SMSMessage> {
    const message: SMSMessage = {
      id: this.generateId(),
      direction: 'outbound',
      from: this.config.phoneNumber,
      to,
      body,
      status: 'queued',
      created_at: new Date(),
      metadata,
    };

    try {
      // Telnyx API v2 - Messages
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.config.phoneNumber,
          to,
          text: body,
          messaging_profile_id: this.config.apiSecret, // messaging profile = campaign
          webhook_url: this.config.webhookUrl,
          webhook_api_version: '2',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Telnyx API error: ${error.data?.message || response.statusText}`);
      }

      const result = await response.json();
      
      message.id = result.data?.id || message.id;
      message.status = result.data?.status === 'queued' ? 'sent' : 'failed';

      return message;
    } catch (error) {
      message.status = 'failed';
      console.error('[TelnyxSMS] Send failed:', error);
      throw error;
    }
  }

  /**
   * Send dispatch SMS to technician
   * 
   * @param technician - Technician to contact
   * @param workOrder - Work order details
   * @param account - Account persona to use (Sticky Sender)
   * @param attempt - Dispatch attempt number (1=initial, 2+=bump)
   */
  async sendDispatch(
    technician: Technician,
    workOrder: { id: string; trade: string; address: Address; nte_amount: number },
    account: Account,
    attempt: number = 1
  ): Promise<SMSMessage> {
    const body = this.buildDispatchMessage(technician, workOrder, account, attempt);
    
    // Sticky Sender: use account's assigned number for this technician
    const _fromNumber: string = account.phone_numbers[0] || this.config.phoneNumber;
    void _fromNumber; // TODO: use for sticky sender routing

    return this.send(technician.phone, body, {
      work_order_id: workOrder.id,
      technician_id: technician.id,
      account_id: account.id,
      dispatch_attempt: attempt,
      message_type: attempt === 1 ? 'dispatch_initial' : 'dispatch_bump',
    });
  }

  /**
   * Build dispatch SMS message body
   * 
   * Per QANAT Principle II (Identity Integrity) - maintain persona consistency
   */
  private buildDispatchMessage(
    technician: Technician,
    workOrder: { trade: string; address: Address; nte_amount: number },
    account: Account,
    attempt: number
  ): string {
    const persona = account.persona_name.split(' from ')[0]; // "Randy" from "Randy from FixIt"
    
    if (attempt === 1) {
      // Initial dispatch - friendly, direct
      return `Hey ${technician.name.split(' ')[0]}, it's ${account.persona_name}. ` +
        `Got a ${workOrder.trade} job at ${workOrder.address.city}. ` +
        `NTE $${workOrder.nte_amount}. You available today? Reply YES to accept.`;
    } else {
      // Urgency bump (15min later)
      return `${persona} here - following up on that ${workOrder.trade} job in ${workOrder.address.city}. ` +
        `Still available? First tech to respond gets it.`;
    }
  }

  /**
   * Handle inbound SMS (webhook receiver)
   * 
   * @param payload - Telnyx webhook payload
   * @returns Parsed SMSMessage
   */
  handleInbound(payload: any): SMSMessage {
    const message: SMSMessage = {
      id: payload.data?.id || this.generateId(),
      direction: 'inbound',
      from: payload.data?.from,
      to: payload.data?.to,
      body: payload.data?.text,
      status: 'delivered',
      created_at: new Date(payload.data?.received_at || Date.now()),
    };

    return message;
  }

  /**
   * Detect opt-out keywords (TCPA compliance - ADR-008)
   * 
   * @param body - Message body
   * @returns true if opt-out detected
   */
  isOptOut(body: string): boolean {
    const optOutKeywords = ['stop', 'end', 'quit', 'cancel', 'unsubscribe', 'opt-out', 'opt out'];
    const lowerBody = body.toLowerCase();
    return optOutKeywords.some(keyword => lowerBody.includes(keyword));
  }

  /**
   * Detect acceptance keywords
   * 
   * @param body - Message body  
   * @returns true if acceptance detected
   */
  isAcceptance(body: string): boolean {
    const acceptKeywords = ['yes', 'yeah', 'yep', 'sure', 'accept', 'i\'m in', 'count me in'];
    const lowerBody = body.toLowerCase();
    return acceptKeywords.some(keyword => lowerBody.includes(keyword));
  }

  private generateId(): string {
    return `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Re-export types for convenience
export type { SMSMessage, SMSMetadata, Account, Technician };
type Address = { street: string; city: string; state: string; zip: string; lat?: number; lng?: number };
