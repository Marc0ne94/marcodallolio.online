# Skill L1 · git-author-vercel

**level:** semplice
**id:** `git-author-vercel`

## Rule (hard)

Every commit that may trigger Vercel Git integration:

```
user.name  = Marc0ne94
user.email = 99964496+Marc0ne94@users.noreply.github.com
```

**Forbidden:** `agent@mdo.local`, `marco@marcodallolio.it`, `marco@marcodallolio.xyz` (unless verified on GitHub).

## Verify

- Vercel MCP: `list_deployments` → latest `state=READY`
- Or GitHub: commit status context `Vercel` = success

## Fail closed

If author wrong → new commit with valid author; do not redeploy blocked SHA.
