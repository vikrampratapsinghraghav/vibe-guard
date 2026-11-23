# AUDIT.md template

Write the file with exactly these sections, in this order.

```markdown
# Audit: <project name>

**Verdict:** <Ship / Ship after Critical+High fixes / Don't ship> — <one line why>
**Date:** <YYYY-MM-DD> · **Scope:** <full | diff vs base> · **Stack:** <stack>
**Counts:** Critical <n> · High <n> · Medium <n> · Low <n>

## Evidence
| Check | Command | Result |
|---|---|---|
| Build | `...` | pass / fail / not run (why) |
| Tests | `...` | n passed, n failed / no suite |
| App run | `...` | screenshots: <paths> / not run (why) |

## Findings
| ID | Sev | Lens | Where | Problem | Fix | Status |
|---|---|---|---|---|---|---|
| SEC-1 | Critical | security | `path:line` | ... | ... | open |

IDs: SEC-, FUN-, ARC-, DES- plus a number. Sort Critical first. A finding touching
several lenses lists them all in Lens and uses the ID of the most severe one.

## Details
Only Critical and High findings get a Details entry; the table row is enough for Medium and Low.

### SEC-1 <title>
**Impact:** ...
**Fix:** before/after code or exact steps.

## Fix order
1. <IDs to fix first and why (rotate secrets, then auth, then money paths...)>

## Not checked
- <lens or check skipped, and why; missing skills with install commands>

## Skills used
- <lens>: <skills>
```
