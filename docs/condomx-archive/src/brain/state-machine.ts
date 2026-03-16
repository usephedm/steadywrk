import { setup, assign } from 'xstate';
import type { AuditEntry } from '../core/types.js';

// ── Context ─────────────────────────────────────────────────────────

export interface WorkOrderContext {
  workOrderId: string;
  accountId: string;
  technicianId: string | null;
  attemptCount: number;
  lastEvent: string;
  auditTrail: AuditEntry[];
}

// ── Events ──────────────────────────────────────────────────────────

type WorkOrderEvent =
  | { type: 'EVALUATE' }
  | { type: 'ACCEPT' }
  | { type: 'REJECT'; reason: string }
  | { type: 'MATCH' }
  | { type: 'OUTREACH_START'; technicianId: string }
  | { type: 'ESCALATE'; reason: string }
  | { type: 'TECH_ACCEPTED'; technicianId: string }
  | { type: 'TECH_DECLINED'; technicianId: string }
  | { type: 'NO_TECHS' }
  | { type: 'TECH_ARRIVED' }
  | { type: 'TECH_NO_SHOW' }
  | { type: 'CANCEL'; reason: string }
  | { type: 'WORK_DONE' }
  | { type: 'ISSUE'; description: string }
  | { type: 'SUBMIT_INVOICE'; amount: number }
  | { type: 'PAYMENT_RECEIVED'; amount: number }
  | { type: 'REMATCH' };

export type { WorkOrderEvent };

// ── Audit helper ────────────────────────────────────────────────────

function getStateLabel(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.join('.');
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map(getStateLabel)
      .join('.');
  }

  return 'unknown';
}

function appendAudit(
  trail: AuditEntry[],
  ctx: { workOrderId: string; accountId: string },
  fromState: string,
  toState: string,
  event: string,
  detail?: string,
): AuditEntry[] {
  const entry: AuditEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    accountId: ctx.accountId,
    action: `${fromState} -> ${toState}`,
    entityType: 'work_order',
    entityId: ctx.workOrderId,
    details: { event, fromState, toState, ...(detail ? { detail } : {}) },
    agentId: 'dispatch-brain',
  };
  return [...trail, entry];
}

function getEscalationDetail(event: WorkOrderEvent): string | undefined {
  if (event.type === 'ESCALATE') return event.reason;
  if (event.type === 'ISSUE') return event.description;
  if (event.type === 'NO_TECHS') return 'No technicians available';
  return undefined;
}

function getCancellationDetail(event: WorkOrderEvent): string | undefined {
  return event.type === 'CANCEL' ? event.reason : undefined;
}

function getRejectionDetail(event: WorkOrderEvent): string | undefined {
  return event.type === 'REJECT' ? event.reason : undefined;
}

function buildAuditUpdate(
  context: WorkOrderContext,
  event: WorkOrderEvent,
  self: { getSnapshot(): { value: unknown } },
  toState: string,
  detailResolver?: (event: WorkOrderEvent) => string | undefined,
) {
  const fromState = getStateLabel(self.getSnapshot().value);

  return {
    lastEvent: event.type,
    auditTrail: appendAudit(
      context.auditTrail,
      context,
      fromState,
      toState,
      event.type,
      detailResolver?.(event),
    ),
  };
}

// ── State Machine ───────────────────────────────────────────────────

export const workOrderMachine = setup({
  types: {
    context: {} as WorkOrderContext,
    events: {} as WorkOrderEvent,
    input: {} as { workOrderId: string; accountId: string },
  },
  actions: {
    logEvaluateTransition: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'evaluating')
    ),
    logAcceptTransition: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'accepted')
    ),
    logRejection: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'rejected', getRejectionDetail)
    ),
    logMatchTransition: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'matching')
    ),
    logOutreachTransition: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'outreach')
    ),
    logDispatchingTransition: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'dispatching')
    ),
    logInProgressTransition: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'in_progress')
    ),
    logNoShowTransition: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'no_show')
    ),
    logCompletingTransition: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'completing')
    ),
    logInvoicingTransition: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'invoicing')
    ),
    logPaidTransition: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'paid')
    ),
    logEscalation: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'escalated', getEscalationDetail)
    ),
    logCancellation: assign(({ context, event, self }) =>
      buildAuditUpdate(context, event, self, 'cancelled', getCancellationDetail)
    ),
    incrementAttempts: assign(({ context }) => ({
      attemptCount: context.attemptCount + 1,
    })),
    setTechnician: assign(({ event }) => {
      if (event.type === 'TECH_ACCEPTED' || event.type === 'OUTREACH_START') {
        return { technicianId: event.technicianId };
      }
      return {};
    }),
    clearTechnician: assign(() => ({
      technicianId: null,
    })),
  },
  guards: {
    hasAttemptsRemaining: ({ context }) => context.attemptCount < 10,
  },
}).createMachine({
  id: 'workOrder',
  initial: 'new',
  context: ({ input }: { input: { workOrderId: string; accountId: string } }) => ({
    workOrderId: input.workOrderId,
    accountId: input.accountId,
    technicianId: null,
    attemptCount: 0,
    lastEvent: '',
    auditTrail: [],
  }),
  on: {
    CANCEL: {
      target: '.cancelled',
      actions: ['logCancellation'],
    },
    ESCALATE: {
      target: '.escalated',
      actions: ['logEscalation'],
    },
  },
  states: {
    new: {
      on: {
        EVALUATE: {
          target: 'evaluating',
          actions: ['logEvaluateTransition'],
        },
      },
    },

    evaluating: {
      on: {
        ACCEPT: {
          target: 'accepted',
          actions: ['logAcceptTransition'],
        },
        REJECT: {
          target: 'rejected',
          actions: ['logRejection'],
        },
      },
    },

    accepted: {
      on: {
        MATCH: {
          target: 'matching',
          actions: ['logMatchTransition'],
        },
      },
    },

    matching: {
      on: {
        OUTREACH_START: {
          target: 'outreach',
          actions: ['logOutreachTransition', 'setTechnician'],
        },
        ESCALATE: {
          target: 'escalated',
          actions: ['logEscalation'],
        },
      },
    },

    outreach: {
      on: {
        TECH_ACCEPTED: {
          target: 'dispatching',
          actions: ['logDispatchingTransition', 'setTechnician'],
        },
        TECH_DECLINED: [
          {
            target: 'matching',
            actions: ['logMatchTransition', 'incrementAttempts', 'clearTechnician'],
            guard: 'hasAttemptsRemaining',
          },
          {
            target: 'escalated',
            actions: ['logEscalation', 'clearTechnician'],
          },
        ],
        NO_TECHS: {
          target: 'escalated',
          actions: ['logEscalation'],
        },
      },
    },

    dispatching: {
      on: {
        TECH_ARRIVED: {
          target: 'in_progress',
          actions: ['logInProgressTransition'],
        },
        TECH_NO_SHOW: {
          target: 'no_show',
          actions: ['logNoShowTransition', 'clearTechnician'],
        },
      },
    },

    in_progress: {
      on: {
        WORK_DONE: {
          target: 'completing',
          actions: ['logCompletingTransition'],
        },
        ISSUE: {
          target: 'escalated',
          actions: ['logEscalation'],
        },
      },
    },

    completing: {
      on: {
        SUBMIT_INVOICE: {
          target: 'invoicing',
          actions: ['logInvoicingTransition'],
        },
      },
    },

    invoicing: {
      on: {
        PAYMENT_RECEIVED: {
          target: 'paid',
          actions: ['logPaidTransition'],
        },
      },
    },

    paid: {
      type: 'final',
    },

    rejected: {
      type: 'final',
    },

    escalated: {
      on: {
        REMATCH: {
          target: 'matching',
          actions: ['logMatchTransition', 'clearTechnician'],
        },
      },
    },

    cancelled: {
      type: 'final',
    },

    no_show: {
      on: {
        REMATCH: {
          target: 'matching',
          actions: ['logMatchTransition', 'incrementAttempts', 'clearTechnician'],
        },
      },
    },

    rescheduled: {
      on: {
        REMATCH: {
          target: 'matching',
          actions: ['logMatchTransition', 'clearTechnician'],
        },
      },
    },
  },
});
