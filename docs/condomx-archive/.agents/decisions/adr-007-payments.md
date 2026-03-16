# ADR-007: Payment & Financial Architecture

**Status**: ACCEPTED
**Date**: 2026-03-06
**Debate**: #7
**Decision by**: E0:orchestrator

## Decision

Stripe Connect (Custom accounts) + Mercury API + QuickBooks Online dimensional accounting + per-job P&L tracking.

## Rationale

- **Stripe Connect Custom**: Only option for marketplace payments. Hold funds (up to 90 days), split payments, 1099-NEC, instant payouts (1% fee), KYC/AML built in.
- **Mercury**: API-first banking, programmatic payments, reconciliation, up to $5M FDIC.
- **ACH default** ($0.20-1.50/transfer), instant payout to debit card as opt-in premium (1% fee).
- **QuickBooks Online with class tracking**: 14 accounts as P&L classes, per-account profitability without separate legal entities.
- **Per-job P&L**: `revenue - tech_payout - platform_cost = margin`. Feeds pricing optimization.

## NET55 Working Capital

DMG Pro pays NET55. Techs paid weekly. ~$100K float needed for first 2 months.

Solutions (ranked):
1. Bootstrap from existing revenue
2. Constrafor invoice factoring (80-95% advance, 1-5% fee)
3. Mercury line of credit
4. Personal capital injection

## Consequences

- Stripe Connect requires Custom account setup per technician (KYC flow)
- Mercury API requires business banking account setup
- NET55 gap is a real financial risk — must have working capital solution before scaling
- QuickBooks integration needs Chart of Accounts design with 14 classes

## Evidence

- `docs/research/payment-processing-finance.md`
