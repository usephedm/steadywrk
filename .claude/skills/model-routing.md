# Skill: Model Routing
Trigger: (internal — apply automatically based on task type)
## Rules
When deciding which tool/model to use for a subtask:

### Claude Opus 4.6 (Max 20x) — use for:
- Architecture decisions
- Complex multi-file refactoring
- Security reviews
- System design
- Anything requiring deep reasoning
- Cost: included in $200/mo subscription

### Codex CLI / GPT-5.4 (ChatGPT Pro) — delegate for:
- Code review (ruthless, catches edge cases)
- Async parallel execution (fire and forget)
- Debugging complex issues
- Terminal-heavy tasks
- Command: codex "your task here"

### Gemini CLI (Ultra) — delegate for:
- Research requiring web grounding
- Analyzing large documents (1M context)
- Competitor analysis
- Documentation review
- Command: gemini "your task here"

### Qwen Code (free 2K/day) — delegate for:
- Boilerplate generation
- Simple file scaffolding
- Repetitive code patterns
- Tests for straightforward functions
- Command: qwen "your task here"

### DeepSeek V3.2 (near-free API) — delegate for:
- Bulk text processing
- Simple translations
- Data formatting
- Anything high-volume, low-complexity

## Cost Priority
Always use the cheapest capable model. Don't send boilerplate to Opus.
Free tiers first → Qwen/Gemini free → Codex → Claude Opus.
