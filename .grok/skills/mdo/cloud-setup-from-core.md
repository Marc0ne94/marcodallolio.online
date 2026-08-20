# Skill L1 · cloud-setup-from-core

**level:** semplice
**id:** `cloud-setup-from-core`

## Principle

**core** owns tooling to prepare cloud environments.
Sites (**space**, **xyz**, **online**, …) only **consume** secrets/bindings; they do not invent setup.

## Ocra product

```bash
npm run build -w @mdo/auth-tag
node scripts/cloud-setup-ocra.mjs          # materialize secret + APPLY.md
# apply OCRA_TAG_SECRET to CF workers space + xyz (dashboard or CF MCP)
```

Flow: mdo1 issues ticket → Ocra redeems → session. User never holds the rotating token.

## Checklist

- [ ] Secret generated via core script
- [ ] Same value on issuer + redeemer workers
- [ ] Not in git / not in public JS
- [ ] Product path: `/mdo1/open-ocra` works end-to-end
