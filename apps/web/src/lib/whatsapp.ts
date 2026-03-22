interface WhatsAppMessagePayload {
  to: string; // e.g., '962770000000'
  templateName: string;
  languageCode?: string; // default 'en' or 'ar'
  components?: Array<{
    type: 'body' | 'header' | 'button';
    parameters: Array<{
      type: 'text' | 'currency' | 'date_time' | 'document' | 'image' | 'video';
      text?: string;
      // add other types as needed
    }>;
  }>;
}

/**
 * Utility to send transactional WhatsApp messages using the Meta Cloud API.
 * Ref: STE-41
 */
export async function sendWhatsAppTemplate({
  to,
  templateName,
  languageCode = 'en',
  components = [],
}: WhatsAppMessagePayload) {
  // Graceful degradation if WA is not configured yet
  if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
    console.warn(
      `[WhatsApp API] Skipped sending template '${templateName}' to ${to} — missing API keys.`,
    );
    return { success: true, mocked: true };
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('[WhatsApp API] Failed to send message:', JSON.stringify(errorData));
      return { success: false, error: errorData };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('[WhatsApp API] Network error:', error);
    return { success: false, error };
  }
}
