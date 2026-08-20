# Skill L1 · site-neutral-check

**level:** semplice
**id:** `site-neutral-check`

## Obiettivo

Garantire che un sito **pubblico** non esponga kit, strutture, MCP o grafo infra.

## Check (fail se match in public/)

| pattern | motivo |
|---------|--------|
| `ecosystem.json` pubblico | mappa infra |
| `service_role` / `SUPABASE_SERVICE_ROLE` | privileged |
| docs che spiegano catalog/control-plane in `public/` | structure leak |
| link a core GitHub da landing | optional warn |

## Done when

- public surface solo prodotto
- nav da DB se usata (`public_nav_links`)
- `MDO.MDO` può esistere in root (non servito staticamente se non in public)

## Non fare

- Pubblicare skill inventory o CONTROL_PLANE sul sito
