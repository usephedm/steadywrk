import { PackageType } from '@/types'

// Map the generic frontend packages to strict backend pricing logic
export const PAYPAL_PRODUCT_MAP: Record<PackageType, { name: string; price: string; currency: string; type: 'DIGITAL' | 'PHYSICAL' }> = {
  demo: {
    name: 'Free Consultation',
    price: '0.00',
    currency: 'USD',
    type: 'DIGITAL'
  },
  starter: {
    name: 'Starter Architecture (Strategy Deposit)',
    price: '50.00',
    currency: 'USD',
    type: 'DIGITAL'
  },
  growth: {
    name: 'Growth Infrastructure (Strategy Deposit)',
    price: '50.00',
    currency: 'USD',
    type: 'DIGITAL'
  },
  scale: {
    name: 'Scale Blueprint (Strategy Deposit)',
    price: '50.00',
    currency: 'USD',
    type: 'DIGITAL'
  }
}

// Route to sandbox if explicit, otherwise assume live for safety
export const PAYPAL_BASE_URL = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT === 'sandbox' 
  ? 'https://api-m.sandbox.paypal.com' 
  : 'https://api-m.paypal.com'

/**
 * Handles generating a Server-to-Server authentication token for PayPal REST APIs.
 */
export async function generatePayPalAccessToken() {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('MISSING_PAYPAL_CREDENTIALS')
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
    // Prevent Next.js from aggressively caching this token request
    cache: 'no-store'
  })

  const data = await response.json()
  return data.access_token
}

/**
 * Validates package selection and initiates a new PayPal order intent.
 */
export async function createPayPalOrder(packageType: PackageType) {
  const product = PAYPAL_PRODUCT_MAP[packageType]
  if (!product) {
    throw new Error('INVALID_PACKAGE_TYPE')
  }

  if (product.price === '0.00') {
    throw new Error('CANNOT_CHARGE_ZERO')
  }

  const accessToken = await generatePayPalAccessToken()
  const url = `${PAYPAL_BASE_URL}/v2/checkout/orders`
  
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        description: product.name,
        amount: {
          currency_code: product.currency,
          value: product.price,
        },
      },
    ],
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      // Optionally provide a PayPal-Request-Id to ensure idempotency
    },
    body: JSON.stringify(payload),
    cache: 'no-store'
  })

  return await handleResponse(response)
}

/**
 * Captures funds for a successfully approved PayPal order.
 */
export async function capturePayPalOrder(orderID: string) {
  const accessToken = await generatePayPalAccessToken()
  const url = `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store'
  })

  return await handleResponse(response)
}

async function handleResponse(response: Response) {
  try {
    const jsonResponse = await response.json()
    return {
      jsonResponse,
      httpStatusCode: response.status,
    }
  } catch (err) {
    const errorMessage = await response.text()
    throw new Error(errorMessage)
  }
}
