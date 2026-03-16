// CondomX production LLM client — raw fetch to Anthropic Messages API

import { createLogger } from '../infra/logger.js';

const log = createLogger('llm-client');

const LLM_API_KEY = process.env['LLM_API_KEY'] ?? '';
const LLM_MODEL = process.env['LLM_MODEL'] ?? 'claude-haiku-4-5';
const LLM_BASE_URL = process.env['LLM_BASE_URL'] ?? 'https://api.anthropic.com';

interface CallLLMOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

interface AnthropicMessage {
  role: string;
  content: Array<{ type: string; text: string }>;
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
  error?: { message: string };
}

export async function callLLM(prompt: string, options?: CallLLMOptions): Promise<string> {
  if (!LLM_API_KEY) {
    log.warn('LLM_API_KEY not set — returning empty fallback');
    return '';
  }

  const maxTokens = options?.maxTokens ?? 1024;
  const temperature = options?.temperature ?? 0;

  const messages: AnthropicMessage[] = [{ role: 'user', content: [{ type: 'text', text: prompt }] }];

  const body: Record<string, unknown> = {
    model: LLM_MODEL,
    max_tokens: maxTokens,
    temperature,
    messages,
  };

  if (options?.systemPrompt) {
    body['system'] = options.systemPrompt;
  }

  try {
    const res = await fetch(`${LLM_BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LLM_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      log.error('LLM API request failed', { status: res.status, body: text });
      return '';
    }

    const data = (await res.json()) as AnthropicResponse;

    if (data.error) {
      log.error('LLM API returned error', { error: data.error.message });
      return '';
    }

    const firstText = data.content.find((b) => b.type === 'text');
    return firstText?.text ?? '';
  } catch (err) {
    log.error('LLM API call threw', { error: String(err) });
    return '';
  }
}

export async function classifyText(
  text: string,
  categories: string[],
  systemPrompt?: string,
): Promise<{ category: string; confidence: number }> {
  const fallback = { category: categories[0] ?? '', confidence: 0 };

  if (!LLM_API_KEY) {
    log.warn('LLM_API_KEY not set — returning fallback classification');
    return fallback;
  }

  const catList = categories.map((c, i) => `${i + 1}. ${c}`).join('\n');
  const prompt = [
    'Classify the following text into exactly one of the categories below.',
    'Respond with ONLY a JSON object: {"category": "<exact category name>", "confidence": <0.0 to 1.0>}',
    '',
    'Categories:',
    catList,
    '',
    'Text:',
    text,
  ].join('\n');

  const raw = await callLLM(prompt, {
    maxTokens: 128,
    temperature: 0,
    systemPrompt: systemPrompt ?? 'You are a precise text classifier. Output only valid JSON.',
  });

  if (!raw) return fallback;

  try {
    const parsed: unknown = JSON.parse(raw.trim());
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'category' in parsed &&
      'confidence' in parsed
    ) {
      const obj = parsed as { category: string; confidence: number };
      // Validate the category is in the list
      if (categories.includes(obj.category) && typeof obj.confidence === 'number') {
        return { category: obj.category, confidence: Math.min(1, Math.max(0, obj.confidence)) };
      }
    }
    log.warn('LLM classification response did not match expected schema', { raw });
    return fallback;
  } catch {
    log.warn('Failed to parse LLM classification response', { raw });
    return fallback;
  }
}
