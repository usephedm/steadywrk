# Skill: Code Review
Trigger: review, audit, check code, PR review, security check
## Steps
1. Identify changed files: git diff --name-only HEAD~1
2. For each file check: typed functions, error handling, input validation, no secrets, RLS on tables, rate limiting, no console.log in prod
3. Run tests and lint
4. Severity: CRITICAL (block) → security vuln, data leak | HIGH (block) → unhandled crash | MEDIUM (fix) → missing validation | LOW (note) → style
5. Summarize with file paths and line numbers
## Optional Codex review
If deeper review needed, delegate to Codex CLI:
codex "Review this diff ruthlessly: $(git diff HEAD~1)"
