# Skill composta · setup-site

**level:** composta
**id:** `setup-site`

## Obiettivo

Aggiungere o allineare un sito MDO come **consumer** del core, senza doppi setup e senza abilitare il command plane.

## Precondizioni

- [ ] Letto `docs/ACTIVATION.md` e `docs/CONTROL_PLANE.md`
- [ ] Polo non è `no-touch` (es. `.it`)
- [ ] Esiste repo GitHub **oppure** si crea uno solo dopo update registry
- [ ] Non esiste già `site:{id}` con declared_state (verifica catalogo)

## Procedura

1. **Registry first**
   - Aggiorna `packages/ecosystem/src/poles.json`
   - Aggiorna `docs/ACTIVATION.md`
   - Upsert riga `public.poles` (Supabase)

2. **Manifest**
   - Copia `mdo.manifest.json` da template (core)
   - `metadata.id` = logical id (`quest`, `wiki`, `online`, …)
   - `commandPlane.enabled` = **false**
   - packages/capabilities minimi

3. **Deploy target**
   - Vercel e/o Cloudflare come da host policy
   - Non duplicare progetto Vercel se `providerRef` già in catalogo
   - Se l’host è un **Cloudflare Worker**: leggi L1 `cf-worker-site` (contesto git+worker+stack). Non copiare i passi lì dentro — quella skill si aggiorna sul campo.

4. **Sync declared**
   ```bash
   node scripts/catalog-sync-declared.mjs path/to/mdo.manifest.json
   ```

5. **Verify**
   ```bash
   node scripts/catalog-verify.mjs {id}
   ```
   Fail = stop. Warn = documenta in audit.

6. **Consumer wiring**
   - Link da `.xyz` solo se visibility public
   - Import `@mdo/*` solo se package reale
   - Nessuna dipendenza runtime obbligatoria al catalogo per il sito pubblico

## Done when

- [ ] `describeSite` risponde per `site:{id}`
- [ ] verify senza fail
- [ ] ACTIVATION status coerente
- [ ] nessun executor automatico

## Non fare

- Non copiare secret values nel catalogo
- Non abilitare reconcile automatico
- Non creare il 2° progetto Vercel “per prova” sullo stesso domain
