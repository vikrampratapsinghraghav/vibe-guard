---
name: vibe-audit
description: Use when the user says "/vibe-audit", "audit my project", "find all the issues", "is this ready to ship", or asks for a design, functional, security and architecture review of an existing (often vibe-coded or AI-generated) codebase, or of a branch before a PR.
---

# /vibe-audit: find everything wrong with an existing project

## Overview
One audit, four lenses, each run by its specialist skill, with evidence from actually running the project. The result is a saved `AUDIT.md` the team can track, not a chat message that scrolls away.

**Core principle:** a lens is done only when its specialist skill ran and its evidence is recorded. Reviewing "directly" because the project looks small is how real projects get half-audited.

## Arguments
- none: full audit of the repo
- `--diff [base]`: only files changed against `base` (default `main`), for use before a PR
- `--lens security|functional|architecture|design`: one lens only

## Step 1: Scope
1. Detect the stack (web, iOS, Android, React Native, backend, CLI) from manifests.
2. Read `CLAUDE.md`, `ARCHITECTURE.md`, `DESIGN.md` if present; their rules count as findings when broken.
3. List the files in scope (`--diff`: `git diff --name-only <base>...HEAD` plus untracked).

## Step 2: Evidence (before any lens)
Run what exists and record each command and its result:
- install / build
- the test command (`npm test`, `xcodebuild test`, etc.); a stub or missing suite is itself a finding
- dependency audit (`npm audit`, `pip-audit`, etc.)
- for UI projects, launch the app (the `run` skill, or `dogfood` for mobile) and take screenshots of the main screens at desktop and 375px width; pass them to the design lens, which cannot take its own

Running safely:
- Port taken: use the app's port env var, or a free port; never kill someone else's process.
- Flows that would send email, charge money or call paid APIs: probe them without valid payloads, or with the provider's test mode only. List what was not exercised under "Not checked".
- Delete files the run created (local DBs, uploads) and stop the server when done.

If something cannot run, say why in the report's "Not checked" section. Never claim it passed.

## Step 3: Lenses, in parallel
Dispatch one subagent per lens with the brief in [lens-briefs.md](lens-briefs.md). Each subagent MUST invoke its skills with the Skill tool and return findings in the brief's format.

| Lens | Skills (invoke all that apply) |
|---|---|
| Security | `vibe-security`, `production-code-audit` (security part) |
| Functional | `production-code-audit` (correctness), test results, `break-ui` on key screens (report only) |
| Architecture | `codebase-design`, plus the criteria in `improve-codebase-architecture`'s SKILL.md (read the file: it is user-invoked only); `project-forge:architecture-guardian` if ARCHITECTURE.md exists |
| Design | web: `web-design-guidelines`; iOS: `ios-hig-design`; mobile: `mobile-app-ui-design`; plus the screenshots |

If a skill is not installed, the lens still runs without it, the report says so, and lists the install command from [lens-briefs.md](lens-briefs.md).

## Step 4: Report
Merge, dedupe (same root cause = one finding), and write `AUDIT.md` at the repo root using [report-template.md](report-template.md). Then reply with: the verdict line, the counts per severity, the top 5 findings and the path to `AUDIT.md`.

## Step 5: Fix (only after the user picks)
1. Ask which findings to fix (default suggestion: all Critical and High).
2. Fix in batches by severity. Security and functional fixes get a failing test first (superpowers:test-driven-development).
3. After each batch, re-run the affected lens on the changed files and the test command.
4. Update each finding's Status in `AUDIT.md` (`fixed`, `wontfix: reason`, `open`).

## Rules
- Never print secret values; refer to them by file:line and tell the user to rotate them.
- Read-only until the user picks fixes: no source edits, no demo toggles from `break-ui`. Only `AUDIT.md`, lockfiles from install, and temp files outside the repo. Never deploy, push or contact third parties.
- `--diff` mode: report only findings in changed lines or ones the change makes reachable.

## Common mistakes
| Mistake | Instead |
|---|---|
| "Small project, I'll review directly" | Run the lens skills anyway; they check things you won't think of |
| Judging UI from code only | Launch it and screenshot; record if you can't |
| Findings only in chat | Always write `AUDIT.md` |
| Fixing while auditing | Audit first, then the user picks |
| Same bug listed under 3 lenses | One finding, tagged with every lens it touches |
