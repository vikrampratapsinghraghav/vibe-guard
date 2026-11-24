# vibe-guard

Two Claude Code skills for vibe-coded projects.

| Command | Use it when | What you get |
|---|---|---|
| `/vibe-audit` | A project already exists | `AUDIT.md`: every security, functional, architecture and design issue, ranked, with file:line and a fix |
| `/vibe-audit --diff` | Before a PR | Same, only for the changed code |
| `/vibe-start` | Starting a new project | `/project-forge:new-project` plus the audit skills built in and a clean baseline audit |

## How it works
vibe-guard writes no checks of its own. It runs proven skills and merges their results:

| Lens | Skill |
|---|---|
| Security | `vibe-security`, `production-code-audit` |
| Functional | `production-code-audit`, your tests, `break-ui` |
| Architecture | `codebase-design` + `improve-codebase-architecture` criteria, project-forge `architecture-guardian` |
| Design | `web-design-guidelines` / `ios-hig-design` / `mobile-app-ui-design` |

## Install

**Quick install (any agent, via [skills.sh](https://skills.sh/)):**
```bash
npx skills add vikrampratapsinghraghav/vibe-guard -g -y
```

**As a Claude Code plugin:**
1. Add the marketplace and plugin:
   ```bash
   claude plugin marketplace add vikrampratapsinghraghav/vibe-guard
   ```
   ```bash
   claude plugin install vibe-guard@vibe-guard
   ```
2. Install the specialist skills (once per machine):
   ```bash
   npx skills add raroque/vibe-security-skill@vibe-security -g -y
   ```
   ```bash
   npx skills add sickn33/agentic-awesome-skills@production-code-audit -g -y
   ```
   ```bash
   npx skills add mattpocock/skills@improve-codebase-architecture -g -y
   ```
   ```bash
   npx skills add mattpocock/skills@codebase-design -g -y
   ```
   ```bash
   npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y
   ```

## Testing the skills
`tests/fixture-shop/` is a small app with planted issues; `tests/answer-key.md` lists them. After changing a skill, run `/vibe-audit` on a copy of the fixture (rename `env.fixture` to `.env` and `git init` it first) and check the findings against the key.

`/vibe-start` installs these project-locally instead, so cloud sessions get them too.

## Requires
- `project-forge` and `superpowers` plugins (declared as dependencies)
