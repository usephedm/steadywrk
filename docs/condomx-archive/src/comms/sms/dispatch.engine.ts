/**
 * SMS-First Dispatch Engine
 * 
 * Implements ADR-003 dispatch flow:
 * 1. SMS to top technician (immediate)
 * 2. SMS urgency bump (15 min if no response)
 * 3. Voice escalation via Retell (30 min if no response)
 * 4. Expand to next technician
 * 
 * Economics (ADR-003):
 * - SMS dispatch: $0.004 per message
 * - Voice escalation: $0.07/min (~$0.42 per 6-min call)
 * - Happy path (SMS acceptance): $0.008 total (2 SMS)
 * - Voice path: $0.432 total (2 SMS + 1 call)
 */

import { TelnyxSMS } from './telnyx.service.js';
import type { SMSMessage, Technician, WorkOrder, Account, DispatchState } from '../../types/index.js';

export interface DispatchEngineConfig {
  smsService: TelnyxSMS;
  voiceService?: any; // Retell AI service (TODO)
  smsBumpDelayMs: number; // Default: 15 minutes
  voiceEscalationDelayMs: number; // Default: 30 minutes
  maxTechnicians: number; // Max techs to contact before expiring
}

export class DispatchEngine {
  private config: DispatchEngineConfig;
  private activeDispatches: Map<string, DispatchState> = new Map();

  constructor(config: DispatchEngineConfig) {
    this.config = config;
  }

  /**
   * Start dispatch flow for a work order
   * 
   * @param workOrder - Work order to dispatch
   * @param technicians - Ranked list of technicians (by composite score)
   * @param account - Account persona to use
   * @returns DispatchState tracker
   */
  async startDispatch(
    workOrder: WorkOrder,
    technicians: Technician[],
    account: Account
  ): Promise<DispatchState> {
    const state: DispatchState = {
      work_order_id: workOrder.id,
      status: 'sms_initial_sent',
      technicians_contacted: [],
      sms_count: 0,
      voice_calls: 0,
      first_contact_at: new Date(),
      last_contact_at: new Date(),
    };

    this.activeDispatches.set(workOrder.id, state);

    // Step 1: Send initial SMS to top technician
    const topTech = technicians[0];
    if (!topTech) {
      state.status = 'expired';
      return state;
    }

    try {
      await this.config.smsService.sendDispatch(topTech, workOrder, account, 1);
      state.technicians_contacted.push(topTech.id);
      state.sms_count++;
      console.log(`[DispatchEngine] SMS sent to ${topTech.name} for WO ${workOrder.id}`);
    } catch (error) {
      console.error(`[DispatchEngine] SMS failed:`, error);
    }

    // Step 2: Schedule urgency bump (15 min)
    this.scheduleSmsBump(workOrder, technicians, account, state);

    // Step 3: Schedule voice escalation (30 min)
    this.scheduleVoiceEscalation(workOrder, technicians, account, state);

    return state;
  }

  /**
   * Handle SMS response from technician
   * 
   * @param message - Inbound SMS message
   * @returns true if accepted, false otherwise
   */
  async handleSmsResponse(message: SMSMessage): Promise<boolean> {
    const { body } = message;
    
    // Check for opt-out (compliance - ADR-008)
    if (this.config.smsService.isOptOut(body)) {
      console.log(`[DispatchEngine] Opt-out detected from ${message.from}`);
      // TODO: Revoke consent in compliance module
      return false;
    }

    // Check for acceptance
    if (this.config.smsService.isAcceptance(body)) {
      console.log(`[DispatchEngine] Acceptance from ${message.from}`);
      
      // Update dispatch state
      const dispatch = this.activeDispatches.get(message.metadata?.work_order_id || '');
      if (dispatch) {
        dispatch.status = 'accepted';
        dispatch.accepted_at = new Date();
        dispatch.accepted_by = message.metadata?.technician_id;
      }

      // TODO: Send confirmation SMS
      await this.sendConfirmation(message);
      
      return true;
    }

    // Neutral response - continue monitoring
    return false;
  }

  /**
   * Schedule SMS urgency bump at 15 minutes
   */
  private scheduleSmsBump(
    workOrder: WorkOrder,
    technicians: Technician[],
    account: Account,
    _state: DispatchState
  ) {
    setTimeout(async () => {
      const dispatch = this.activeDispatches.get(workOrder.id);
      if (!dispatch || dispatch.status === 'accepted' || dispatch.status === 'expired') {
        return;
      }

      // Send bump to same technician
      const tech = technicians[0]!;
      try {
        await this.config.smsService.sendDispatch(tech, workOrder, account, 2);
        dispatch.status = 'sms_bump_sent';
        dispatch.sms_count++;
        dispatch.last_contact_at = new Date();
        console.log(`[DispatchEngine] SMS bump sent to ${tech.name}`);
      } catch (error) {
        console.error(`[DispatchEngine] SMS bump failed:`, error);
      }
    }, this.config.smsBumpDelayMs);
  }

  /**
   * Schedule voice escalation at 30 minutes
   */
  private scheduleVoiceEscalation(
    workOrder: WorkOrder,
    technicians: Technician[],
    account: Account,
    _state: DispatchState
  ) {
    setTimeout(async () => {
      const dispatch = this.activeDispatches.get(workOrder.id);
      if (!dispatch || dispatch.status === 'accepted' || dispatch.status === 'expired') {
        return;
      }

      // Escalate to voice call
      const tech = technicians[0]!;
      if (this.config.voiceService) {
        try {
          await this.config.voiceService.makeDispatchCall(tech, workOrder, account);
          dispatch.status = 'voice_escalated';
          dispatch.voice_calls++;
          dispatch.last_contact_at = new Date();
          console.log(`[DispatchEngine] Voice call placed to ${tech.name}`);
        } catch (error) {
          console.error(`[DispatchEngine] Voice escalation failed:`, error);
        }
      } else {
        console.warn(`[DispatchEngine] Voice service not configured, expanding to next tech`);
        // TODO: Expand to next technician in list
      }
    }, this.config.voiceEscalationDelayMs);
  }

  /**
   * Send acceptance confirmation SMS
   */
  private async sendConfirmation(message: SMSMessage): Promise<SMSMessage> {
    const confirmBody = `Great! Job details sent to your phone. Customer expects you within 2 hours. Reply if you need anything.`;
    
    return this.config.smsService.send(message.from, confirmBody, {
      ...message.metadata,
      message_type: 'dispatch_confirm',
    });
  }

  /**
   * Get active dispatch state
   */
  getDispatchState(workOrderId: string): DispatchState | undefined {
    return this.activeDispatches.get(workOrderId);
  }

  /**
   * Clean up completed dispatches (call after acceptance or expiry)
   */
  cleanupDispatch(workOrderId: string) {
    this.activeDispatches.delete(workOrderId);
  }
}
