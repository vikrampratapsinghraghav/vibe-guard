---
name: vibe-start
description: Use when the user says "/vibe-start", "start a fresh project", "new project with vibe-guard", or wants a new project set up so the issues /vibe-audit looks for (security holes, untested logic, god files, inaccessible UI) are prevented from day one.
---

# /vibe-start: a new project that stays audit-clean

## Overview
`/project-forge:new-project` does the scaffold, architecture, design system and hooks. This skill runs it and inserts three additions at fixed points: the four specialist skills behind `/vibe-audit` (so they guide code while it is written), vibe-guard rules in the project, and a baseline audit before the first commit.

**Core principle:** prevent, then check. The skills that audit later are loaded while writing now.

## The run, in order
Invoke `project-forge:new-project` and follow it. Insert the steps below at the named points.

| When | Do |
|---|---|
| Phase 1 | Ask only the questions the user's request leaves open, one at a time. "Skip the questions" never skips Phase 3 plan approval. |
| After Phase 4.1 (app folder exists) | **A. Install skills** |
| After Phase 4.8 (CLAUDE.md, settings, PR template written) | **B. Wire vibe-guard** |
| After Phase 6.1 (verify green), before Phase 6.2 commit | **C. Baseline audit**, then let 6.2 commit |
| Phase 6.3 | One merged handover: project-forge's bullets plus the vibe-guard additions, max 5 bullets |

## A. Install skills (inside the app folder)
Five skills, project-local, so cloud sessions get them too. Never run this before the folder exists.

```bash
npx skills add raroque/vibe-security-skill@vibe-security -y --agent claude-code
npx skills add sickn33/agentic-awesome-skills@production-code-audit -y --agent claude-code
npx skills add mattpocock/skills@improve-codebase-architecture -y --agent claude-code
npx skills add mattpocock/skills@codebase-design -y --agent claude-code
npx skills add vercel-labs/agent-skills@web-design-guidelines -y --agent claude-code
```

This writes `.claude/skills/<name>/` and `skills-lock.json`; both get committed. Mobile-only projects may skip `web-design-guidelines`. If an install fails, stop and tell the user: section B points at these files.

## B. Wire vibe-guard
1. In `CLAUDE.md`, insert above `## Working style`:

```markdown
## Vibe-guard
- Before writing code that touches auth, payments, database access, API keys, AI calls or user data: read the matching file in `.claude/skills/vibe-security/references/`.
- New module, or a file taking on a second responsibility: apply `codebase-design` (deep modules, clear seams) before adding code.
- UI work: check it against `web-design-guidelines` (or the iOS/mobile design skill) and DESIGN.md before calling it done.
- Before every PR: `/vibe-audit --diff`. No open Critical or High findings may be merged.
- End of every milestone: `/vibe-audit`. `AUDIT.md` stays committed as the project's issue ledger.
```

2. In `.claude/settings.json`, add these keys inside the existing objects (keep project-forge's entries):
   - under `extraKnownMarketplaces`: `"vibe-guard": { "source": { "source": "github", "repo": "vikrampratapsinghraghav/vibe-guard" }, "autoUpdate": true }`
   - under `enabledPlugins`: `"vibe-guard@vibe-guard": true`

3. In `.github/pull_request_template.md`, add to the checklist: `- [ ] /vibe-audit --diff run, no open Critical/High`.

## C. Baseline audit
1. Run `/vibe-audit` (full).
2. Fix every Critical and High finding without asking: the scaffold must start clean. Medium and Low stay in `AUDIT.md` as `open`.
3. Runtime checks that need real keys (Supabase, Stripe, etc.): run with `.env.example` placeholders, and list what could not run under "Not checked".
4. Re-run verify, then continue with Phase 6.2; the commit includes `AUDIT.md`.

## Common mistakes
| Mistake | Instead |
|---|---|
| Installing skills before the folder exists, or with `-g` | After Phase 4.1, project-local, committed |
| Skipping A because the network is slow | B's rules then point at missing files; stop and report |
| Letting Phase 6.2 commit before the audit | Pause after 6.1; audit; then commit |
| Skipping the baseline audit ("it's just a scaffold") | Scaffolds carry defaults (open CORS, no rate limits) the audit catches |
| Rewriting project-forge's steps here | Invoke it; this skill only inserts A, B, C |
| Replacing `.claude/settings.json` | Merge the keys; keep project-forge enabled |
