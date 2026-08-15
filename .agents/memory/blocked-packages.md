---
name: Blocked pnpm packages
description: Packages blocked by the Replit package firewall that required version overrides in pnpm-workspace.yaml.
---

# Blocked pnpm packages

The Replit package firewall blocks specific package versions for unknown reasons unrelated to minimum release age.

**Blocked versions and their replacements (set in `pnpm-workspace.yaml` overrides):**
- `tar@7.5.13` → overridden to `7.5.22`
- `shell-quote@1.8.3` → overridden to `1.8.4`

**Why:** These packages returned HTTP 403 from `http://package-firewall.replit.local` even though they were published months before the 1-day minimum release age window.

**How to apply:** If `pnpm install` fails with `ERR_PNPM_FETCH_403`, check the version with `curl -o /dev/null -w "%{http_code}" http://package-firewall.replit.local/npm/<name>/-/<name>-<ver>.tgz`, then find an available version and add it to the `overrides` section of `pnpm-workspace.yaml`. Run `pnpm store prune && pnpm install --force` if the cached blocked response persists.
