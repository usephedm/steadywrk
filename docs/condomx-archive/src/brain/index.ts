export { workOrderMachine } from './state-machine.js';
export type { WorkOrderContext, WorkOrderEvent } from './state-machine.js';

export {
  findCandidates,
  computeScore,
  getUrgencyConfig,
  selectOutreachBatch,
  indexTechnician,
  removeTechnician,
  getTechnicianById,
  listTechnicians,
  clearIndex,
} from './matching.js';
export type {
  MatchCandidate,
  ScoringPhase,
  FindCandidatesOptions,
  UrgencyConfig,
} from './matching.js';

export {
  handleNewWorkOrder,
  getSession,
  getActiveSessions,
  markTechArrived,
  markWorkDone,
  submitInvoice,
  markPaymentReceived,
  cancelWorkOrder,
  orchestrateDispatch,
  buildOutreachBatches,
  enqueueDispatch,
  ensureDispatchWorker,
  shutdownDispatchQueue,
} from './orchestrator.js';
export type {
  OrchestratorConfig,
  DispatchSession,
  DispatchOrchestrationInput,
  DispatchOrchestrationResult,
  DispatchAttempt,
  DispatchOrchestrationDeps,
  ExecuteOutreach,
} from './orchestrator.js';

export {
  isWithinCallingWindow,
  canContactTechnician,
  getNextAvailableSlot,
  recordContact,
  getSchedulingStrategy,
  getContactCount,
  clearContactLedger,
} from './scheduler.js';
export type { SchedulingStrategy, ContactRecord } from './scheduler.js';

export { calculateMargin } from './margin-calc.js';
export type { MarginCalculation } from './margin-calc.js';

export {
  initReputation,
  updateScoreAfterJob,
  decayScores,
  boostNewTech,
  penalizeNoShow,
  getScoreBreakdown,
  recalculateAll,
  recordComplianceViolation,
  getStats,
  clearReputationState,
} from './reputation.js';
export type {
  JobOutcome,
  ScoreBreakdown,
} from './reputation.js';

export {
  initNoShowProtection,
  createProtection,
  scheduleConfirmationCheck,
  handleConfirmationResponse,
  handleArrivalCheckIn,
  handleETAResponse,
  activateBackup,
  getProtectionStatus,
  getNoShowHistory,
  getNoShowPatterns,
  getProtectionStats,
  removeProtection,
  parseETAResponse,
  clearProtectionState,
} from './no-show-protection.js';
export type {
  DispatchProtection,
  NoShowRecord,
  SendSMSCallback,
  InitiateVoiceCallback,
  PenalizeNoShowCallback,
  AuditLogCallback,
} from './no-show-protection.js';

export {
  getCurrentWeights,
  recordDispatchOutcome,
  runSelfImprovementLoop,
  getSuccessProbability,
} from './learning.js';
export type { ScoringWeights } from './learning.js';

export {
  processJobFeedback,
  recordNoShow,
} from './scoring.js';
export type { JobFeedback } from './scoring.js';

export {
  extractCounterOffer,
  evaluateCounterOffer,
} from './negotiation.js';
export type { NegotiationResult } from './negotiation.js';

export {
  launchRecruitmentCampaign,
  handleUnknownInbound,
} from './recruitment.js';
export type {
  Prospect,
  RecruitmentCampaign as SentinelRecruitmentCampaign,
} from './recruitment.js';
