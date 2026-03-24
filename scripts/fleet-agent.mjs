#!/usr/bin/env node
import fs from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { URL } from 'node:url';

// Try to load worker roles, fall back to stub
let getRoleWorker;
let startWorkerLoop;
let getWorkerState;
try {
  const mod = await import('./fleet-worker-roles.mjs');
  getRoleWorker = mod.getRoleWorker;
  startWorkerLoop = mod.startWorkerLoop;
  getWorkerState = mod.getWorkerState;
} catch {
  getRoleWorker = () => ({ name: 'stub', execute: async () => ({ ok: true, findings: [] }) });
  startWorkerLoop = () => {};
  getWorkerState = () => ({ isRunning: false, runCount: 0, errorCount: 0 });
}

const config = {
  agentId: env('AGENT_ID', 'UNKNOWN'),
  agentRole: env('AGENT_ROLE', 'generic'),
  agentNode: env('AGENT_NODE', 'steadywrk'),
  agentSide: env('AGENT_SIDE', 'local'),
  port: toInt(env('AGENT_PORT', env('PORT', '8000')), 8000),
  bind: env('BIND_ADDRESS', '0.0.0.0'),
  redisUrl: env('REDIS_URL', ''),
  stateDir: env('STATE_DIR', ''),
  heartbeatIntervalMs: toInt(env('HEARTBEAT_INTERVAL_MS', '10000'), 10000),
  capabilities: parseList(env('AGENT_CAPABILITIES', '')),
};

const startedAt = new Date();
const runtimeId = `${config.agentId.toLowerCase()}-${startedAt.getTime().toString(36)}`;
const state = {
  runtimeId,
  startedAt: startedAt.toISOString(),
  lastHeartbeatAt: startedAt.toISOString(),
  lastRequestAt: null,
  requestCount: 0,
  recentRequests: [],
  recentTasks: [],
  lastAcceptedTask: null,
};
const redisCache = { at: 0, value: null };
let persistQueue = Promise.resolve();

const server = http.createServer(async (req, res) => {
  state.requestCount += 1;
  state.lastRequestAt = new Date().toISOString();
  remember(state.recentRequests, { at: state.lastRequestAt, method: req.method, path: req.url });
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  try {
    if (req.method === 'GET' && url.pathname === '/')
      return sendJson(res, 200, await buildSnapshot('root'));
    if (req.method === 'GET' && url.pathname === '/health')
      return sendJson(res, 200, await buildSnapshot('health'));
    if (req.method === 'GET' && url.pathname === '/ready') {
      const s = await buildSnapshot('ready');
      const ready = s.redis?.reachable !== false && s.heartbeat.fresh === true;
      return sendJson(res, ready ? 200 : 503, { ...s, ready });
    }
    if (req.method === 'GET' && url.pathname === '/a2a')
      return sendJson(res, 200, await buildSnapshot('a2a'));
    if (req.method === 'POST' && url.pathname === '/a2a') {
      const payload = await readJson(req);
      const task = normalizeTask(payload);
      state.lastAcceptedTask = task;
      remember(state.recentTasks, task);
      return sendJson(res, 200, {
        ok: true,
        accepted: true,
        agent: agentDescriptor(),
        received: task,
      });
    }
    if (req.method === 'POST' && url.pathname === '/heartbeat') {
      const payload = await readJson(req);
      const hb = {
        at: new Date().toISOString(),
        agentId: config.agentId,
        status: payload?.status ?? 'active',
        task: payload?.task ?? null,
        note: payload?.note ?? null,
      };
      state.lastHeartbeatAt = hb.at;
      remember(state.recentTasks, hb);
      await persistState(hb);
      return sendJson(res, 200, { ok: true, heartbeat: hb });
    }
    if (req.method === 'GET' && url.pathname === '/state') {
      const s = await buildSnapshot('state');
      s.worker = getWorkerState();
      return sendJson(res, 200, s);
    }
    if (req.method === 'GET' && url.pathname === '/dashboard') {
      try {
        const dashPath = path.join(
          path.dirname(new URL(import.meta.url).pathname),
          'fleet-dashboard.html',
        );
        const html = await fs.readFile(dashPath, 'utf8');
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        return res.end(html);
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: `Dashboard not found: ${err.message}` });
      }
    }
    sendJson(res, 404, {
      ok: false,
      error: 'not_found',
      routes: ['/health', '/ready', '/a2a', '/heartbeat', '/state', '/dashboard'],
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

server.keepAliveTimeout = 5000;
server.headersTimeout = 10000;
server.listen(config.port, config.bind, async () => {
  await persistState({ event: 'startup' });
  console.log(
    `[fleet-agent] ${config.agentId} on http://${config.bind}:${config.port} (${config.agentNode}/${config.agentSide})`,
  );
  const worker = getRoleWorker(config.agentRole);
  const intervalMs = toInt(env('WORKER_INTERVAL_MS', '300000'), 300000);
  startWorkerLoop(
    worker,
    {
      agentId: config.agentId,
      agentNode: config.agentNode,
      port: config.port,
      fetch: globalThis.fetch,
      log: (m) => console.log(`[worker:${config.agentId}] ${m}`),
    },
    intervalMs,
  );
  console.log(`[fleet-agent] Worker "${worker.name}" started (interval: ${intervalMs}ms)`);
});

const hbTimer = setInterval(async () => {
  state.lastHeartbeatAt = new Date().toISOString();
  await persistState({ event: 'heartbeat' });
}, config.heartbeatIntervalMs);
hbTimer.unref();
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
async function shutdown() {
  clearInterval(hbTimer);
  await persistState({ event: 'shutdown' });
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000).unref();
}
function env(n, f) {
  const v = process.env[n];
  return v === undefined || v === '' ? f : v;
}
function toInt(v, f) {
  const p = Number.parseInt(String(v), 10);
  return Number.isFinite(p) ? p : f;
}
function parseList(v) {
  return String(v)
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean);
}
function agentDescriptor() {
  return {
    id: config.agentId,
    role: config.agentRole,
    node: config.agentNode,
    side: config.agentSide,
    runtimeId,
    port: config.port,
    host: os.hostname(),
    pid: process.pid,
  };
}
function remember(list, item, limit = 25) {
  list.unshift(item);
  if (list.length > limit) list.length = limit;
}
async function buildSnapshot(ch) {
  const redis = await getRedisStatus();
  return {
    ok: true,
    channel: ch,
    status: redis?.reachable === false ? 'degraded' : 'ok',
    agent: agentDescriptor(),
    process: {
      startedAt: state.startedAt,
      uptimeSeconds: Math.round(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    heartbeat: {
      startedAt: state.startedAt,
      lastHeartbeatAt: state.lastHeartbeatAt,
      lastRequestAt: state.lastRequestAt,
      requestCount: state.requestCount,
      ageMs: hbAge(),
      fresh: hbAge() <= config.heartbeatIntervalMs * 3,
    },
    capabilities: config.capabilities,
    redis,
    task: state.lastAcceptedTask,
    recentTasks: state.recentTasks.slice(0, 10),
    recentRequests: state.recentRequests.slice(0, 10),
  };
}
function hbAge() {
  const a = Date.now() - Date.parse(state.lastHeartbeatAt);
  return Number.isFinite(a) && a >= 0 ? a : Number.POSITIVE_INFINITY;
}
async function getRedisStatus() {
  if (!config.redisUrl) return { configured: false, reachable: null, detail: 'not configured' };
  const now = Date.now();
  if (redisCache.value && now - redisCache.at < 5000) return redisCache.value;
  const p = parseRedisUrl(config.redisUrl);
  if (!p) {
    redisCache.value = { configured: true, reachable: false, detail: 'invalid redis url' };
    redisCache.at = now;
    return redisCache.value;
  }
  redisCache.value = await probeRedis(p);
  redisCache.at = now;
  return redisCache.value;
}
function parseRedisUrl(raw) {
  try {
    const u = new URL(raw);
    if (!['redis:', 'rediss:'].includes(u.protocol)) return null;
    return {
      host: u.hostname,
      port: Number.parseInt(u.port || '6379', 10),
      password: u.password || '',
    };
  } catch {
    return null;
  }
}
function encodeRedisCommand(parts) {
  const l = [`*${parts.length}`];
  for (const p of parts) {
    const v = String(p);
    l.push(`$${Buffer.byteLength(v)}`);
    l.push(v);
  }
  return `${l.join('\r\n')}\r\n`;
}
async function probeRedis(t) {
  return new Promise((r) => {
    const s = net.createConnection({ host: t.host, port: t.port });
    const to = setTimeout(() => {
      s.destroy();
      r({ configured: true, reachable: false, detail: `timeout ${t.host}:${t.port}` });
    }, 750);
    let buf = '';
    let stage = t.password ? 'auth' : 'ping';
    s.setNoDelay(true);
    s.once('connect', () => {
      s.write(encodeRedisCommand(stage === 'auth' ? ['AUTH', t.password] : ['PING']));
    });
    s.on('data', (c) => {
      buf += c.toString('utf8');
      const ln = buf.split('\r\n')[0];
      if (stage === 'auth') {
        if (ln.startsWith('+OK')) {
          stage = 'ping';
          buf = '';
          s.write(encodeRedisCommand(['PING']));
          return;
        }
        if (ln.startsWith('-')) {
          clearTimeout(to);
          s.destroy();
          r({ configured: true, reachable: false, detail: ln.slice(1) });
        }
        return;
      }
      if (ln.startsWith('+PONG')) {
        clearTimeout(to);
        s.end();
        r({ configured: true, reachable: true, detail: `${t.host}:${t.port}` });
      } else if (ln.startsWith('-')) {
        clearTimeout(to);
        s.destroy();
        r({ configured: true, reachable: false, detail: ln.slice(1) });
      }
    });
    s.on('error', (e) => {
      clearTimeout(to);
      r({ configured: true, reachable: false, detail: e.message });
    });
    s.on('close', () => clearTimeout(to));
  });
}
async function readJson(req) {
  const ch = [];
  for await (const c of req) {
    ch.push(c);
    if (Buffer.concat(ch).length > 65536) throw new Error('body too large');
  }
  if (!ch.length) return null;
  const b = Buffer.concat(ch).toString('utf8').trim();
  if (!b) return null;
  try {
    return JSON.parse(b);
  } catch {
    return { raw: b };
  }
}
function normalizeTask(p) {
  if (!p)
    return { at: new Date().toISOString(), message: null, source: 'unknown', kind: 'heartbeat' };
  if (typeof p === 'string')
    return { at: new Date().toISOString(), message: p, source: 'text', kind: 'task' };
  return {
    at: new Date().toISOString(),
    kind: p.kind ?? p.type ?? 'task',
    message: p.message ?? p.task ?? p.goal ?? null,
    source: p.source ?? p.from ?? 'client',
    payload: p,
  };
}
async function persistState(ev) {
  if (!config.stateDir) return;
  persistQueue = persistQueue
    .then(async () => {
      const s = {
        event: ev,
        savedAt: new Date().toISOString(),
        ...(await buildSnapshot('persist')),
      };
      const f = path.join(config.stateDir, 'agent-state.json');
      const t = `${f}.tmp`;
      await fs.mkdir(config.stateDir, { recursive: true });
      await fs.writeFile(t, `${JSON.stringify(s, null, 2)}\n`, 'utf8');
      await fs.rename(t, f);
    })
    .catch((e) =>
      console.error('[fleet-agent] persist failed:', e instanceof Error ? e.message : String(e)),
    );
  return persistQueue;
}
function sendJson(res, sc, p) {
  const b = `${JSON.stringify(p, null, 2)}\n`;
  res.writeHead(sc, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(b),
    'x-agent-id': config.agentId,
    'x-agent-role': config.agentRole,
  });
  res.end(b);
}
