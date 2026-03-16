import type { Technician } from '../core/types.js';

const STRIPE_SECRET_KEY = process.env['STRIPE_SECRET_KEY'] ?? '';
const STRIPE_API = 'https://api.stripe.com/v1';

async function stripeRequest(endpoint: string, method: string, body?: Record<string, string>): Promise<unknown> {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
  };

  const options: RequestInit = { method, headers };

  if (body) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.body = new URLSearchParams(body).toString();
  }

  const response = await fetch(`${STRIPE_API}${endpoint}`, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Stripe API error ${response.status}: ${error}`);
  }
  return response.json();
}

export async function createConnectedAccount(tech: Technician): Promise<string> {
  const result = await stripeRequest('/accounts', 'POST', {
    type: 'custom',
    country: 'US',
    email: tech.email,
    'capabilities[transfers][requested]': 'true',
    'capabilities[card_payments][requested]': 'true',
    'business_type': 'individual',
    'individual[first_name]': tech.name.split(' ')[0] ?? '',
    'individual[last_name]': tech.name.split(' ').slice(1).join(' ') || tech.name,
    'individual[email]': tech.email,
    'individual[phone]': tech.phone,
  }) as { id: string };
  return result.id;
}

export async function createPaymentIntent(
  amount: number,
  accountId: string,
  platformFee: number,
  metadata: Record<string, string>
): Promise<{ id: string; clientSecret: string }> {
  const result = await stripeRequest('/payment_intents', 'POST', {
    amount: String(Math.round(amount * 100)),
    currency: 'usd',
    'transfer_data[destination]': accountId,
    application_fee_amount: String(Math.round(platformFee * 100)),
    ...Object.fromEntries(
      Object.entries(metadata).map(([k, v]) => [`metadata[${k}]`, v])
    ),
  }) as { id: string; client_secret: string };
  return { id: result.id, clientSecret: result.client_secret };
}

export async function createTransfer(
  amount: number,
  destinationAccountId: string,
  metadata: Record<string, string>
): Promise<string> {
  const result = await stripeRequest('/transfers', 'POST', {
    amount: String(Math.round(amount * 100)),
    currency: 'usd',
    destination: destinationAccountId,
    ...Object.fromEntries(
      Object.entries(metadata).map(([k, v]) => [`metadata[${k}]`, v])
    ),
  }) as { id: string };
  return result.id;
}

export async function createPayout(
  accountId: string,
  amount: number,
  method: 'standard' | 'instant' = 'standard'
): Promise<string> {
  const result = await stripeRequest('/payouts', 'POST', {
    amount: String(Math.round(amount * 100)),
    currency: 'usd',
    method,
    'stripe_account': accountId,
  }) as { id: string };
  return result.id;
}

export interface JobPnL {
  workOrderId: string;
  revenue: number;
  techPayout: number;
  platformCosts: {
    sms: number;
    voice: number;
    llm: number;
    compute: number;
  };
  totalCost: number;
  margin: number;
  marginPercent: number;
}

export function calculateJobPnL(
  revenue: number,
  techPayout: number,
  smsCost: number,
  voiceCost: number,
  llmCost: number,
  computeCost: number,
  workOrderId: string,
): JobPnL {
  const totalCost = techPayout + smsCost + voiceCost + llmCost + computeCost;
  const margin = revenue - totalCost;
  const marginPercent = revenue > 0 ? (margin / revenue) * 100 : 0;

  return {
    workOrderId,
    revenue,
    techPayout,
    platformCosts: { sms: smsCost, voice: voiceCost, llm: llmCost, compute: computeCost },
    totalCost,
    margin,
    marginPercent,
  };
}
