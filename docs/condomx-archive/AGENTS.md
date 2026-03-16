# CondomX — Multi-Agent Development Protocol

> This file governs how AI agents collaborate on this repo.
> Every agent MUST read this file before doing ANY work.

---

## Echelon System

### E0: Orchestrator (Claude Opus — @v)
- **Authority**: Supreme. All architectural decisions, milestone approvals, conflict resolution.
- **Responsibilities**: Sets milestones, assigns work, reviews PRs, resolves disputes, maintains ROADMAP.md.
- **Can**: Merge to main, modify any file, override any agent decision.
- **Identity**: The human operator's primary Claude instance.

### E1: Specialist Agents
- **Authority**: Full autonomy within assigned scope. Cannot modify files outside scope without E0 approval.
- **Responsibilities**: Execute assigned tasks, create branches, submit PRs, document decisions.
- **Specialties**:
  - `agent:eyes` — DMG Pro browser automation, scraping, session management
  - `agent:brain` — Dispatch engine, state machine, matching, pricing
  - `agent:comms` — Voice AI (Bland/Retell), SMS (Twilio/Telnyx), conversation engine
  - `agent:memory` — Database, learning system, tech scoring, market intelligence
  - `agent:finance` — Invoicing, payments, Stripe Connect, P&L
  - `agent:compliance` — Legal, TCPA, consent management, AI disclosure
  - `agent:infra` — CI/CD, deployment, monitoring, process management
  - `agent:research` — Deep research, competitive intelligence, market analysis

### E2: Task Agents
- **Authority**: Single-task scope only. Cannot create branches or modify shared files.
- **Responsibilities**: Execute specific subtasks assigned by E1 agents.
- **Examples**: Write a single function, fix a bug, add a test, update docs.

---

## Branch Protocol

```
main                    ← Protected. Only E0 merges here.
├── research/*          ← Research branches (any agent)
├── design/*            ← Design proposals (E1+)
├── feat/*              ← Feature branches (E1, one per task)
├── fix/*               ← Bug fixes (E1/E2)
└── experiment/*        ← Throwaway experiments (any agent)
```

### Rules
- NEVER push directly to `main`. Always use PRs.
- Branch naming: `{type}/{agent-name}/{short-description}` (e.g., `feat/brain/state-machine`)
- One agent per branch. No shared branches.
- Delete branch after merge.

---

## Work Claiming Protocol

Before starting work, an agent MUST:

1. Check `.agents/active-tasks.md` for conflicts
2. Add their task claim to `.agents/active-tasks.md`
3. Create their branch
4. Work in isolation
5. Submit PR when done
6. Remove their claim from `.agents/active-tasks.md` after merge

### Claim Format
```markdown
| Agent | Branch | Files Touched | Started | Status |
|-------|--------|---------------|---------|--------|
| agent:brain | feat/brain/state-machine | src/dispatch/* | 2026-03-06T04:00Z | in-progress |
```

If a file is already claimed by another agent, you MUST NOT touch it. Coordinate via `.agents/discussions/` or wait.

---

## Communication Protocol

Agents communicate through the repo itself:

### Channels
- `.agents/discussions/` — Threaded discussions (one .md file per topic)
- `.agents/decisions/` — Architectural Decision Records (ADRs)
- `.agents/active-tasks.md` — Current work claims (prevent conflicts)
- `.agents/changelog.md` — All changes with timestamps and agent attribution
- `ROADMAP.md` — Milestones and phases (E0 only modifies)

### Discussion Format
```markdown
# Topic: [Short Title]

## [agent:name] — [ISO timestamp]
[Message content]

## [agent:name] — [ISO timestamp]
[Reply]
```

### Decision Record Format
```markdown
# ADR-{number}: [Title]
- **Status**: proposed | accepted | rejected | superseded
- **Proposed by**: [agent:name]
- **Date**: [ISO date]
- **Context**: [Why this decision is needed]
- **Decision**: [What was decided]
- **Consequences**: [What changes as a result]
```

---

## Commit Convention

All commits MUST follow this format:

```
[agent:{name}] {type}: {description}

{body — what and why, not how}

Co-Authored-By: {Agent Model} <noreply@anthropic.com>
```

Types: `feat`, `fix`, `docs`, `research`, `refactor`, `test`, `chore`

Example:
```
[agent:brain] feat: implement work order state machine

Added state transitions with validation per QANAT constitution.
Escalation triggers at 30-min matching timeout.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

## File Ownership

| Path | Owner | Others Can |
|------|-------|-----------|
| QANAT.md | E0 only | Read |
| AGENTS.md | E0 only | Read |
| ROADMAP.md | E0 only | Read, propose changes via ADR |
| CLAUDE.md | E0 only | Read |
| .agents/* | Any agent (own entries) | Read all, write own |
| docs/research/* | agent:research | Read, propose additions |
| docs/plans/* | E1+ | Read, propose via PR |
| src/{module}/* | Assigned agent | Read, propose changes via PR |
| tests/* | Any agent | Read, write tests for own code |
| config/* | agent:infra | Read, propose changes via PR |

---

## Onboarding Checklist (Every Agent Reads This)

When you enter this repo for the first time:

1. Read `QANAT.md` — The constitution. Non-negotiable principles.
2. Read `AGENTS.md` — This file. How agents collaborate.
3. Read `ROADMAP.md` — Current milestones and what needs work.
4. Read `CLAUDE.md` — Project configuration and constraints.
5. Check `.agents/active-tasks.md` — What's currently being worked on.
6. Check `.agents/changelog.md` — Recent changes and context.
7. Identify your role (E0/E1/E2) and specialty.
8. Claim your task before starting work.
9. Follow the branch protocol.
10. Log everything.

---

## Conflict Resolution

1. **File conflict**: First claimer wins. Second agent waits or coordinates.
2. **Design disagreement**: Create an ADR in `.agents/decisions/`. E0 decides.
3. **Merge conflict**: The later PR resolves conflicts. Never force-push.
4. **Scope creep**: If your task touches files outside your scope, create a separate PR or coordinate with the owning agent.

---

## Quality Gates

Every PR must:
- [ ] Pass TypeScript strict compilation (when code exists)
- [ ] Not break existing tests
- [ ] Include changelog entry in `.agents/changelog.md`
- [ ] Follow commit convention
- [ ] Stay within claimed file scope
- [ ] Reference the ROADMAP milestone it addresses
