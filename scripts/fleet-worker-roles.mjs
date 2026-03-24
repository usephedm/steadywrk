const safeFetch = async (url, opts = {}) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeout || 8000);
  try {
    const r = await fetch(url, { ...opts, signal: ctrl.signal });
    clearTimeout(t);
    return r;
  } catch (e) {
    clearTimeout(t);
    return { ok: false, status: 0, text: async () => e.message };
  }
};

const roles = {
  intelligence: {
    name: 'hawkeye',
    execute: async (ctx) => {
      const findings = [];
      try {
        const r = await safeFetch('https://steadywrk.app/robots.txt');
        findings.push({ check: 'robots.txt', status: r.ok ? r.status : 'error' });
      } catch {}
      try {
        const r = await safeFetch('https://steadywrk.app/sitemap.xml');
        findings.push({ check: 'sitemap.xml', status: r.ok ? r.status : 'error' });
      } catch {}
      return { ok: true, findings, metrics: { checks: findings.length } };
    },
  },
  content: {
    name: 'scribe',
    execute: async (ctx) => {
      const findings = [];
      try {
        const r = await safeFetch('https://steadywrk.app/blog');
        findings.push({ check: 'blog', status: r.ok ? r.status : 'error' });
      } catch {}
      return { ok: true, findings };
    },
  },
  security: {
    name: 'sentinel',
    execute: async (ctx) => {
      const findings = [];
      try {
        const r = await safeFetch('https://steadywrk.app/.env');
        findings.push({ check: '.env-exposed', status: r.status === 404 ? 'safe' : 'EXPOSED' });
      } catch {}
      return { ok: true, findings };
    },
  },
  pipeline: {
    name: 'dispatch',
    execute: async (ctx) => {
      const findings = [];
      for (const p of [8001, 8002, 8003, 8004]) {
        try {
          const r = await safeFetch(`http://127.0.0.1:${p}/health`, { timeout: 3000 });
          findings.push({ port: p, ok: r.ok });
        } catch {
          findings.push({ port: p, ok: false });
        }
      }
      return { ok: true, findings };
    },
  },
  code: {
    name: 'forge',
    execute: async (ctx) => {
      return { ok: true, findings: [{ check: 'stub', note: 'CI worker pending' }] };
    },
  },
  analytics: {
    name: 'nexus',
    execute: async (ctx) => {
      const findings = [];
      try {
        const r = await safeFetch('https://steadywrk.app/');
        findings.push({ check: 'latency', status: r.ok ? r.status : 'error' });
      } catch {}
      return { ok: true, findings };
    },
  },
  strategy: {
    name: 'oracle',
    execute: async (ctx) => {
      return { ok: true, findings: [{ check: 'stub', note: 'competitor recon pending' }] };
    },
  },
  growth: {
    name: 'phantom',
    execute: async (ctx) => {
      return { ok: true, findings: [{ check: 'stub', note: 'growth worker pending' }] };
    },
  },
};

const workerState = {
  isRunning: false,
  runCount: 0,
  errorCount: 0,
  lastRunAt: null,
  lastError: null,
};

export function getRoleWorker(role) {
  return roles[role] || { name: 'generic', execute: async () => ({ ok: true, findings: [] }) };
}
export function startWorkerLoop(worker, ctx, intervalMs = 300000) {
  const run = async () => {
    workerState.isRunning = true;
    try {
      const result = await worker.execute(ctx);
      workerState.runCount++;
      workerState.lastRunAt = new Date().toISOString();
      if (ctx.log)
        ctx.log(
          `run #${workerState.runCount}: ${JSON.stringify(result.findings?.length || 0)} findings`,
        );
    } catch (e) {
      workerState.errorCount++;
      workerState.lastError = e.message;
      if (ctx.log) ctx.log(`error: ${e.message}`);
    }
    workerState.isRunning = false;
  };
  setTimeout(run, 5000);
  setInterval(run, intervalMs);
}
export function getWorkerState() {
  return { ...workerState };
}
