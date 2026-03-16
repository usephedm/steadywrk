# Skill: Orchestrate
Trigger: /orchestrate, or when user gives a complex multi-part task

## What This Does
You ARE the AI Command Center orchestrator. When the user gives you a task:
1. Break it into subtasks
2. Route each subtask to the right agent based on the model-routing rules
3. Run agents in parallel where possible
4. Collect results and synthesize back to the user

## Agent Dispatch Commands

### Codex (GPT-5.4) — for code review, debugging, parallel execution
```bash
codex exec "TASK_DESCRIPTION" 2>&1
```
Or for code review specifically:
```bash
codex review 2>&1
```
Use for: code review, bulk refactoring, debugging, test writing

### Gemini (Ultra) — for research, large context, web grounding
```bash
gemini -p "TASK_DESCRIPTION" 2>&1
```
Use for: research, competitor analysis, documentation review, web search

### Claude Agent Teams — for complex multi-agent work
Use the Agent tool with subagent_type and run_in_background for parallel work.

## Orchestration Rules
1. **Always parallelize** — if tasks are independent, dispatch them simultaneously
2. **Route by cost** — free/cheap models first (Gemini free, Codex via ChatGPT Pro, then Claude Opus)
3. **Synthesize** — collect all agent results and give the user ONE unified response
4. **Track progress** — use TaskCreate/TaskUpdate to show status on multi-step work
5. **Auto-route** — don't ask the user which model to use, just pick the right one

## Routing Table
| Task Type | Primary Agent | Fallback |
|-----------|--------------|----------|
| Architecture/design | Claude Opus (you) | — |
| Code review | Codex CLI | Claude Agent |
| Research/web | Gemini CLI | WebSearch |
| Bulk code gen | Codex CLI | Claude Agent |
| Scraping/data | @steadywrk/scraper | Gemini |
| Lead gen | LeadForge MCP | Scraper |
| Content writing | Claude Opus | Gemini |
| Testing | Codex CLI | Claude Agent |
| Deploy | Vercel/Cloudflare CLI | MCP tools |

## Example Flow
User: "Research our top 5 competitors, review our dispatch code for bugs, and draft a landing page"

You:
1. Dispatch Gemini → competitor research (background)
2. Dispatch Codex → code review of packages/dispatch (background)
3. You (Opus) → draft landing page copy (foreground)
4. Collect all results → unified report to user
