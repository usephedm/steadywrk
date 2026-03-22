/**
 * STEADYWRK Swarm Dispatch Oracle
 * Cloudflare Worker for Agent Orchestration & Monitoring.
 *
 * Responsibilities:
 * 1. Production Watchdog (Health checks)
 * 2. Swarm Health Monitor (Linear/Notion stale task checks)
 * 3. Directive Intake Scanner (Slack -> Linear routing)
 */

export interface Env {
  // Bindings
  SWARM_STATE: KVNamespace;

  // Secrets
  SLACK_WEBHOOK_URL: string;
  LINEAR_API_KEY: string;
  NOTION_API_KEY: string;
  N8N_WEBHOOK_URL: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'oracle_active' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/intake' && request.method === 'POST') {
      // Endpoint for Slack to push new human directives from V
      try {
        const payload = await request.json();

        // 1. Parse directive
        // 2. Trigger n8n workflow or Linear API to create task
        // 3. Log to KV state

        return new Response(JSON.stringify({ success: true, routed: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to process intake' }), {
          status: 400,
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Cron Trigger Handler
    console.log(`[Oracle] Cron triggered at ${event.cron}`);

    // 1. Production Watchdog
    try {
      const healthRes = await fetch('https://steadywrk.app/api/health');
      if (!healthRes.ok) {
        await fetch(env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          body: JSON.stringify({ text: '🚨 CRITICAL: steadywrk.app health check failed.' }),
        });
      }
    } catch (e) {
      console.error('Watchdog failed', e);
    }

    // 2. Trigger n8n Swarm Health Monitor
    if (env.N8N_WEBHOOK_URL) {
      ctx.waitUntil(fetch(`${env.N8N_WEBHOOK_URL}/swarm-monitor`, { method: 'POST' }));
    }
  },
};
