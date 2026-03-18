---
description: code review for security, bugs, and quality issues
---

# Review Skill

## When to Use
Use when reviewing code changes, PRs, or auditing a codebase section.

## Review Checklist
Check for these in order of severity:

### CRITICAL (block merge)
- SQL injection via Supabase queries
- Missing RLS policies on tables
- Secrets/API keys in code
- Auth bypass vulnerabilities
- Unvalidated user input reaching DB

### HIGH (block merge)
- Unhandled crashes / missing try-catch
- Race conditions in async code
- Missing error boundaries in React

### MEDIUM (request fix)
- Missing input validation
- Poor error handling / generic catches
- Missing TypeScript types (any usage)

### LOW (note)
- Style / naming inconsistencies
- Missing JSDoc on public APIs

## Output Format
Summarize findings with severity tags and file:line references.
