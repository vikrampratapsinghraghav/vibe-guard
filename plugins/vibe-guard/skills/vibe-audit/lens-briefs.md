# Lens briefs

Give each lens subagent: the project path, the stack, the files in scope, the evidence from Step 2, the project rules (CLAUDE.md / ARCHITECTURE.md / DESIGN.md paths) and the brief below.

## Shared return format
Every subagent returns findings, one per item, and nothing else:

```
- severity: Critical | High | Medium | Low
  lens: security | functional | architecture | design
  where: path:line (or path:start-end)
  problem: one sentence, what is wrong
  impact: one sentence, what a user or attacker experiences
  fix: the concrete change (short before/after code when it helps)
  source: skill or check that found it (e.g. vibe-security, test run, screenshot)
```

Then a line `SKILLS USED:` and a line `NOT CHECKED:` with anything skipped and why.

Severity guide: **Critical** = data loss, breach, money loss or crash on the main path. **High** = wrong results or broken flow for real users. **Medium** = degraded quality, likely future bug. **Low** = polish.

## Security
Invoke `vibe-security`, then the security sections of `production-code-audit`. Cover: secrets in code and client bundles, committed `.env`, database access rules, authn/authz on every endpoint, injection, client-trusted values (price, role, user id), payments, rate limits, unsafe HTML rendering, AI keys and prompt injection. Never print secret values.

## Functional
Invoke `production-code-audit` for correctness. Use the Step 2 test, build and dependency-audit results. Trace the main user flows end to end (signup, core action, payment) and look for: logic errors, wrong types, unhandled errors and promises, state that never resets, missing schema or migrations, missing assets. For UI, run `break-ui` on the key screens in report-only mode (skip its demo-toggle step). A missing or stub test suite is a High finding.

## Architecture
Invoke `codebase-design` for the vocabulary, and read `improve-codebase-architecture/SKILL.md` (in `~/.claude/skills/` or `.claude/skills/`) for its scan criteria; do not try to invoke it, it is user-only. If `ARCHITECTURE.md` exists, also run the `project-forge:architecture-guardian` agent. Look for: god files mixing layers, duplicated logic (name every copy's location), missing validation layer, hardcoded config, tight coupling that blocks testing. Every finding needs a concrete target structure, not "refactor this".

## Design
Web: invoke `web-design-guidelines`. iOS: `ios-hig-design`. Android/React Native: `mobile-app-ui-design`. If `DESIGN.md` exists, also run `project-forge:design-guardian`. Use the Step 2 screenshots. Look for: contrast below WCAG AA, non-semantic controls, missing labels and alt text, tap targets under 44px, broken mobile layout, missing loading/empty/error states, inconsistent spacing and type.

## Install commands for missing skills
```bash
npx skills add raroque/vibe-security-skill@vibe-security -g -y
npx skills add sickn33/agentic-awesome-skills@production-code-audit -g -y
npx skills add mattpocock/skills@improve-codebase-architecture -g -y
npx skills add mattpocock/skills@codebase-design -g -y
npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y
```
