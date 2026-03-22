import { env } from '@/env.mjs';

/**
 * Listmonk API Wrapper
 * Used to sync subscribers, manage lists, and trigger transactional/marketing campaigns.
 */
export class ListmonkClient {
  private baseUrl: string;
  private authHeader: string;

  constructor() {
    this.baseUrl = process.env.LISTMONK_URL || 'https://listmonk.steadywrk.app/api';
    this.authHeader = `Basic ${Buffer.from(`${process.env.LISTMONK_USER}:${process.env.LISTMONK_PASS}`).toString('base64')}`;
  }

  /**
   * Subscribes a user to the main marketing list
   */
  async subscribe(email: string, name: string, listIds: number[] = [1]) {
    try {
      const response = await fetch(`${this.baseUrl}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.authHeader,
        },
        body: JSON.stringify({
          email,
          name,
          status: 'enabled',
          lists: listIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`Listmonk API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[Listmonk] Failed to subscribe:', error);
      throw error;
    }
  }

  /**
   * Triggers a specific transactional template
   */
  async sendTransactional(email: string, templateId: number, data: Record<string, unknown>) {
    try {
      const response = await fetch(`${this.baseUrl}/tx`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.authHeader,
        },
        body: JSON.stringify({
          subscriber_email: email,
          template_id: templateId,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Listmonk Tx API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[Listmonk] Failed to send transactional email:', error);
      throw error;
    }
  }
}

export const listmonk = new ListmonkClient();
