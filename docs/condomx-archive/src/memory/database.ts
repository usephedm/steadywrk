// CondomX database layer — better-sqlite3 with WAL mode

import Database from 'better-sqlite3';
import { resolve, dirname } from 'node:path';
import { mkdirSync } from 'node:fs';
import { config } from '../core/config.js';
import type {
  WorkOrder,
  Technician,
  Account,
  Dispatch,
  AuditEntry,
} from '../core/types.js';
import {
  type WorkOrderStatus,
  type DispatchStatus,
  type TradeType,
} from '../core/types.js';

// ---------------------------------------------------------------------------
// Database initialization
// ---------------------------------------------------------------------------

const dbPath = resolve(config.dbPath);
mkdirSync(dirname(dbPath), { recursive: true });

export const db: InstanceType<typeof Database> = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS work_orders (
    id TEXT PRIMARY KEY,
    dmg_pro_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    trade_type TEXT NOT NULL,
    urgency TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW',
    address TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    h3_index TEXT NOT NULL,
    client_name TEXT NOT NULL,
    site_type TEXT NOT NULL,
    estimated_pay REAL NOT NULL,
    actual_pay REAL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    accepted_at TEXT,
    dispatched_at TEXT,
    completed_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_wo_account ON work_orders(account_id);
  CREATE INDEX IF NOT EXISTS idx_wo_status ON work_orders(status);
  CREATE INDEX IF NOT EXISTS idx_wo_trade ON work_orders(trade_type);
  CREATE INDEX IF NOT EXISTS idx_wo_h3 ON work_orders(h3_index);
  CREATE INDEX IF NOT EXISTS idx_wo_dmg_pro ON work_orders(dmg_pro_id);

  CREATE TABLE IF NOT EXISTS technicians (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    trades TEXT NOT NULL,
    h3_index TEXT NOT NULL,
    timezone TEXT NOT NULL,
    account_id TEXT NOT NULL,
    composite_score REAL NOT NULL DEFAULT 0.5,
    reliability_score REAL NOT NULL DEFAULT 0.5,
    quality_score REAL NOT NULL DEFAULT 0.5,
    responsiveness_score REAL NOT NULL DEFAULT 0.5,
    compliance_score REAL NOT NULL DEFAULT 0.5,
    completed_jobs INTEGER NOT NULL DEFAULT 0,
    no_show_count INTEGER NOT NULL DEFAULT 0,
    last_contacted_at TEXT,
    consent_given_at TEXT,
    opted_out INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tech_h3 ON technicians(h3_index);
  CREATE INDEX IF NOT EXISTS idx_tech_account ON technicians(account_id);
  CREATE INDEX IF NOT EXISTS idx_tech_score ON technicians(composite_score);

  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dmg_pro_username TEXT NOT NULL,
    persona_name TEXT NOT NULL,
    persona_phone TEXT NOT NULL,
    company_name TEXT NOT NULL,
    phone_numbers TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS dispatches (
    id TEXT PRIMARY KEY,
    work_order_id TEXT NOT NULL,
    technician_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    outreach_method TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    accepted_at TEXT,
    started_at TEXT,
    completed_at TEXT,
    pay_amount REAL NOT NULL DEFAULT 0,
    platform_cost REAL NOT NULL DEFAULT 0,
    margin REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
    FOREIGN KEY (technician_id) REFERENCES technicians(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );

  CREATE INDEX IF NOT EXISTS idx_disp_wo ON dispatches(work_order_id);
  CREATE INDEX IF NOT EXISTS idx_disp_tech ON dispatches(technician_id);
  CREATE INDEX IF NOT EXISTS idx_disp_status ON dispatches(status);

  CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    account_id TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT NOT NULL DEFAULT '{}',
    agent_id TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_audit_account ON audit_log(account_id);
  CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
  CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_log(timestamp);

  CREATE TABLE IF NOT EXISTS payment_requests (
    id TEXT PRIMARY KEY,
    work_order_id TEXT NOT NULL,
    dispatch_id TEXT NOT NULL,
    technician_id TEXT NOT NULL,
    tech_name TEXT NOT NULL,
    tech_phone TEXT NOT NULL,
    tech_email TEXT NOT NULL,
    account_id TEXT NOT NULL,
    amount REAL NOT NULL,
    preferred_method TEXT NOT NULL DEFAULT 'zelle',
    zelle_id TEXT,
    paypal_id TEXT,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    approved_at TEXT,
    paid_at TEXT,
    paid_by TEXT,
    notes TEXT,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
    FOREIGN KEY (dispatch_id) REFERENCES dispatches(id),
    FOREIGN KEY (technician_id) REFERENCES technicians(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );

  CREATE INDEX IF NOT EXISTS idx_pay_status ON payment_requests(status);
  CREATE INDEX IF NOT EXISTS idx_pay_tech ON payment_requests(technician_id);
  CREATE INDEX IF NOT EXISTS idx_pay_account ON payment_requests(account_id);
`);

// ---------------------------------------------------------------------------
// Row types (snake_case from DB)
// ---------------------------------------------------------------------------

interface WorkOrderRow {
  id: string;
  dmg_pro_id: string;
  account_id: string;
  title: string;
  description: string;
  trade_type: string;
  urgency: string;
  status: string;
  address: string;
  lat: number;
  lng: number;
  h3_index: string;
  client_name: string;
  site_type: string;
  estimated_pay: number;
  actual_pay: number | null;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  dispatched_at: string | null;
  completed_at: string | null;
}

interface TechnicianRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  trades: string;
  h3_index: string;
  timezone: string;
  account_id: string;
  composite_score: number;
  reliability_score: number;
  quality_score: number;
  responsiveness_score: number;
  compliance_score: number;
  completed_jobs: number;
  no_show_count: number;
  last_contacted_at: string | null;
  consent_given_at: string | null;
  opted_out: number;
  created_at: string;
}

interface AccountRow {
  id: string;
  name: string;
  dmg_pro_username: string;
  persona_name: string;
  persona_phone: string;
  company_name: string;
  phone_numbers: string;
  active: number;
  created_at: string;
}

interface DispatchRow {
  id: string;
  work_order_id: string;
  technician_id: string;
  account_id: string;
  status: string;
  outreach_method: string;
  attempts: number;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  pay_amount: number;
  platform_cost: number;
  margin: number;
}

interface AuditRow {
  id: string;
  timestamp: string;
  account_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  agent_id: string;
}

// ---------------------------------------------------------------------------
// Row <-> Domain mappers
// ---------------------------------------------------------------------------

function rowToWorkOrder(row: WorkOrderRow): WorkOrder {
  return {
    id: row.id,
    dmgProId: row.dmg_pro_id,
    accountId: row.account_id,
    title: row.title,
    description: row.description,
    tradeType: row.trade_type as WorkOrder['tradeType'],
    urgency: row.urgency as WorkOrder['urgency'],
    status: row.status as WorkOrder['status'],
    location: {
      address: row.address,
      lat: row.lat,
      lng: row.lng,
      h3Index: row.h3_index,
    },
    clientName: row.client_name,
    siteType: row.site_type,
    estimatedPay: row.estimated_pay,
    actualPay: row.actual_pay,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    acceptedAt: row.accepted_at,
    dispatchedAt: row.dispatched_at,
    completedAt: row.completed_at,
  };
}

function rowToTechnician(row: TechnicianRow): Technician {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    trades: JSON.parse(row.trades) as Technician['trades'],
    h3Index: row.h3_index,
    timezone: row.timezone,
    accountId: row.account_id,
    compositeScore: row.composite_score,
    reliabilityScore: row.reliability_score,
    qualityScore: row.quality_score,
    responsivenessScore: row.responsiveness_score,
    complianceScore: row.compliance_score,
    completedJobs: row.completed_jobs,
    noShowCount: row.no_show_count,
    lastContactedAt: row.last_contacted_at,
    consentGivenAt: row.consent_given_at,
    optedOut: row.opted_out === 1,
    createdAt: row.created_at,
  };
}

function rowToAccount(row: AccountRow): Account {
  return {
    id: row.id,
    name: row.name,
    dmgProUsername: row.dmg_pro_username,
    personaName: row.persona_name,
    personaPhone: row.persona_phone,
    companyName: row.company_name,
    phoneNumbers: JSON.parse(row.phone_numbers) as string[],
    active: row.active === 1,
    createdAt: row.created_at,
  };
}

function rowToDispatch(row: DispatchRow): Dispatch {
  return {
    id: row.id,
    workOrderId: row.work_order_id,
    technicianId: row.technician_id,
    accountId: row.account_id,
    status: row.status as Dispatch['status'],
    outreachMethod: row.outreach_method as Dispatch['outreachMethod'],
    attempts: row.attempts,
    acceptedAt: row.accepted_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    payAmount: row.pay_amount,
    platformCost: row.platform_cost,
    margin: row.margin,
  };
}

function rowToAuditEntry(row: AuditRow): AuditEntry {
  return {
    id: row.id,
    timestamp: row.timestamp,
    accountId: row.account_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    details: JSON.parse(row.details) as Record<string, unknown>,
    agentId: row.agent_id,
  };
}

// ---------------------------------------------------------------------------
// Prepared statements
// ---------------------------------------------------------------------------

const stmts = {
  insertWorkOrder: db.prepare(`
    INSERT INTO work_orders (id, dmg_pro_id, account_id, title, description, trade_type, urgency, status, address, lat, lng, h3_index, client_name, site_type, estimated_pay, actual_pay, created_at, updated_at, accepted_at, dispatched_at, completed_at)
    VALUES (@id, @dmg_pro_id, @account_id, @title, @description, @trade_type, @urgency, @status, @address, @lat, @lng, @h3_index, @client_name, @site_type, @estimated_pay, @actual_pay, @created_at, @updated_at, @accepted_at, @dispatched_at, @completed_at)
  `),

  getWorkOrder: db.prepare(`SELECT * FROM work_orders WHERE id = ?`),

  updateWorkOrderStatus: db.prepare(`
    UPDATE work_orders SET status = ?, updated_at = datetime('now') WHERE id = ?
  `),

  insertTechnician: db.prepare(`
    INSERT INTO technicians (id, name, phone, email, trades, h3_index, timezone, account_id, composite_score, reliability_score, quality_score, responsiveness_score, compliance_score, completed_jobs, no_show_count, last_contacted_at, consent_given_at, opted_out, created_at)
    VALUES (@id, @name, @phone, @email, @trades, @h3_index, @timezone, @account_id, @composite_score, @reliability_score, @quality_score, @responsiveness_score, @compliance_score, @completed_jobs, @no_show_count, @last_contacted_at, @consent_given_at, @opted_out, @created_at)
  `),

  getTechnician: db.prepare(`SELECT * FROM technicians WHERE id = ?`),

  getTechniciansByTrade: db.prepare(`
    SELECT * FROM technicians WHERE trades LIKE ? AND opted_out = 0 ORDER BY composite_score DESC
  `),

  updateTechnicianScore: db.prepare(`
    UPDATE technicians SET composite_score = ?, reliability_score = ?, quality_score = ?, responsiveness_score = ?, compliance_score = ? WHERE id = ?
  `),

  insertAccount: db.prepare(`
    INSERT INTO accounts (id, name, dmg_pro_username, persona_name, persona_phone, company_name, phone_numbers, active, created_at)
    VALUES (@id, @name, @dmg_pro_username, @persona_name, @persona_phone, @company_name, @phone_numbers, @active, @created_at)
  `),

  getAccount: db.prepare(`SELECT * FROM accounts WHERE id = ?`),

  getActiveAccounts: db.prepare(`SELECT * FROM accounts WHERE active = 1`),

  insertDispatch: db.prepare(`
    INSERT INTO dispatches (id, work_order_id, technician_id, account_id, status, outreach_method, attempts, accepted_at, started_at, completed_at, pay_amount, platform_cost, margin)
    VALUES (@id, @work_order_id, @technician_id, @account_id, @status, @outreach_method, @attempts, @accepted_at, @started_at, @completed_at, @pay_amount, @platform_cost, @margin)
  `),

  getDispatch: db.prepare(`SELECT * FROM dispatches WHERE id = ?`),

  updateDispatchStatus: db.prepare(`
    UPDATE dispatches SET status = ?, attempts = attempts + 1 WHERE id = ?
  `),

  insertAuditEntry: db.prepare(`
    INSERT INTO audit_log (id, timestamp, account_id, action, entity_type, entity_id, details, agent_id)
    VALUES (@id, @timestamp, @account_id, @action, @entity_type, @entity_id, @details, @agent_id)
  `),

  getAuditEntries: db.prepare(`
    SELECT * FROM audit_log WHERE entity_type = ? AND entity_id = ? ORDER BY timestamp DESC
  `),
};

// ---------------------------------------------------------------------------
// Exported query helpers
// ---------------------------------------------------------------------------

export function insertWorkOrder(wo: WorkOrder): void {
  stmts.insertWorkOrder.run({
    id: wo.id,
    dmg_pro_id: wo.dmgProId,
    account_id: wo.accountId,
    title: wo.title,
    description: wo.description,
    trade_type: wo.tradeType,
    urgency: wo.urgency,
    status: wo.status,
    address: wo.location.address,
    lat: wo.location.lat,
    lng: wo.location.lng,
    h3_index: wo.location.h3Index,
    client_name: wo.clientName,
    site_type: wo.siteType,
    estimated_pay: wo.estimatedPay,
    actual_pay: wo.actualPay,
    created_at: wo.createdAt,
    updated_at: wo.updatedAt,
    accepted_at: wo.acceptedAt,
    dispatched_at: wo.dispatchedAt,
    completed_at: wo.completedAt,
  });
}

export function getWorkOrder(id: string): WorkOrder | undefined {
  const row = stmts.getWorkOrder.get(id) as WorkOrderRow | undefined;
  return row ? rowToWorkOrder(row) : undefined;
}

export function updateWorkOrderStatus(id: string, status: WorkOrderStatus): void {
  stmts.updateWorkOrderStatus.run(status, id);
}

export function insertTechnician(tech: Technician): void {
  stmts.insertTechnician.run({
    id: tech.id,
    name: tech.name,
    phone: tech.phone,
    email: tech.email,
    trades: JSON.stringify(tech.trades),
    h3_index: tech.h3Index,
    timezone: tech.timezone,
    account_id: tech.accountId,
    composite_score: tech.compositeScore,
    reliability_score: tech.reliabilityScore,
    quality_score: tech.qualityScore,
    responsiveness_score: tech.responsivenessScore,
    compliance_score: tech.complianceScore,
    completed_jobs: tech.completedJobs,
    no_show_count: tech.noShowCount,
    last_contacted_at: tech.lastContactedAt,
    consent_given_at: tech.consentGivenAt,
    opted_out: tech.optedOut ? 1 : 0,
    created_at: tech.createdAt,
  });
}

export function getTechnician(id: string): Technician | undefined {
  const row = stmts.getTechnician.get(id) as TechnicianRow | undefined;
  return row ? rowToTechnician(row) : undefined;
}

export function getTechniciansByTrade(trade: TradeType): Technician[] {
  const rows = stmts.getTechniciansByTrade.all(`%${trade}%`) as TechnicianRow[];
  return rows.map(rowToTechnician);
}

export function updateTechnicianScore(
  id: string,
  scores: {
    compositeScore: number;
    reliabilityScore: number;
    qualityScore: number;
    responsivenessScore: number;
    complianceScore: number;
  },
): void {
  stmts.updateTechnicianScore.run(
    scores.compositeScore,
    scores.reliabilityScore,
    scores.qualityScore,
    scores.responsivenessScore,
    scores.complianceScore,
    id,
  );
}

export function insertAccount(account: Account): void {
  stmts.insertAccount.run({
    id: account.id,
    name: account.name,
    dmg_pro_username: account.dmgProUsername,
    persona_name: account.personaName,
    persona_phone: account.personaPhone,
    company_name: account.companyName,
    phone_numbers: JSON.stringify(account.phoneNumbers),
    active: account.active ? 1 : 0,
    created_at: account.createdAt,
  });
}

export function getAccount(id: string): Account | undefined {
  const row = stmts.getAccount.get(id) as AccountRow | undefined;
  return row ? rowToAccount(row) : undefined;
}

export function getActiveAccounts(): Account[] {
  const rows = stmts.getActiveAccounts.all() as AccountRow[];
  return rows.map(rowToAccount);
}

export function insertDispatch(dispatch: Dispatch): void {
  stmts.insertDispatch.run({
    id: dispatch.id,
    work_order_id: dispatch.workOrderId,
    technician_id: dispatch.technicianId,
    account_id: dispatch.accountId,
    status: dispatch.status,
    outreach_method: dispatch.outreachMethod,
    attempts: dispatch.attempts,
    accepted_at: dispatch.acceptedAt,
    started_at: dispatch.startedAt,
    completed_at: dispatch.completedAt,
    pay_amount: dispatch.payAmount,
    platform_cost: dispatch.platformCost,
    margin: dispatch.margin,
  });
}

export function getDispatch(id: string): Dispatch | undefined {
  const row = stmts.getDispatch.get(id) as DispatchRow | undefined;
  return row ? rowToDispatch(row) : undefined;
}

export function updateDispatchStatus(id: string, status: DispatchStatus): void {
  stmts.updateDispatchStatus.run(status, id);
}

export function insertAuditEntry(entry: AuditEntry): void {
  stmts.insertAuditEntry.run({
    id: entry.id,
    timestamp: entry.timestamp,
    account_id: entry.accountId,
    action: entry.action,
    entity_type: entry.entityType,
    entity_id: entry.entityId,
    details: JSON.stringify(entry.details),
    agent_id: entry.agentId,
  });
}

export function getAuditEntries(entityType: string, entityId: string): AuditEntry[] {
  const rows = stmts.getAuditEntries.all(entityType, entityId) as AuditRow[];
  return rows.map(rowToAuditEntry);
}

// ---------------------------------------------------------------------------
// Payment requests
// ---------------------------------------------------------------------------

interface PaymentRequestRow {
  id: string;
  work_order_id: string;
  dispatch_id: string;
  technician_id: string;
  tech_name: string;
  tech_phone: string;
  tech_email: string;
  account_id: string;
  amount: number;
  preferred_method: string;
  zelle_id: string | null;
  paypal_id: string | null;
  description: string;
  status: string;
  created_at: string;
  approved_at: string | null;
  paid_at: string | null;
  paid_by: string | null;
  notes: string | null;
}

const paymentStmts = {
  insert: db.prepare(`
    INSERT INTO payment_requests (id, work_order_id, dispatch_id, technician_id, tech_name, tech_phone, tech_email, account_id, amount, preferred_method, zelle_id, paypal_id, description, status, created_at)
    VALUES (@id, @work_order_id, @dispatch_id, @technician_id, @tech_name, @tech_phone, @tech_email, @account_id, @amount, @preferred_method, @zelle_id, @paypal_id, @description, @status, @created_at)
  `),
  getById: db.prepare(`SELECT * FROM payment_requests WHERE id = ?`),
  getByStatus: db.prepare(`SELECT * FROM payment_requests WHERE status = ? ORDER BY created_at DESC`),
  getPending: db.prepare(`SELECT * FROM payment_requests WHERE status = 'pending' ORDER BY created_at ASC`),
  markPaid: db.prepare(`UPDATE payment_requests SET status = 'paid', paid_at = datetime('now'), paid_by = ?, notes = ? WHERE id = ?`),
  markApproved: db.prepare(`UPDATE payment_requests SET status = 'approved', approved_at = datetime('now') WHERE id = ?`),
  markRejected: db.prepare(`UPDATE payment_requests SET status = 'rejected', notes = ? WHERE id = ?`),
};

export function insertPaymentRequest(pr: {
  id: string;
  workOrderId: string;
  dispatchId: string;
  technicianId: string;
  techName: string;
  techPhone: string;
  techEmail: string;
  accountId: string;
  amount: number;
  preferredMethod: string;
  zelleId: string | null;
  paypalId: string | null;
  description: string;
  status: string;
  createdAt: string;
}): void {
  paymentStmts.insert.run({
    id: pr.id,
    work_order_id: pr.workOrderId,
    dispatch_id: pr.dispatchId,
    technician_id: pr.technicianId,
    tech_name: pr.techName,
    tech_phone: pr.techPhone,
    tech_email: pr.techEmail,
    account_id: pr.accountId,
    amount: pr.amount,
    preferred_method: pr.preferredMethod,
    zelle_id: pr.zelleId,
    paypal_id: pr.paypalId,
    description: pr.description,
    status: pr.status,
    created_at: pr.createdAt,
  });
}

export function getPendingPayments(): PaymentRequestRow[] {
  return paymentStmts.getPending.all() as PaymentRequestRow[];
}

export function markPaymentPaid(id: string, paidBy: string, notes?: string): void {
  paymentStmts.markPaid.run(paidBy, notes ?? null, id);
}

export function markPaymentApproved(id: string): void {
  paymentStmts.markApproved.run(id);
}

export function markPaymentRejected(id: string, reason: string): void {
  paymentStmts.markRejected.run(reason, id);
}
