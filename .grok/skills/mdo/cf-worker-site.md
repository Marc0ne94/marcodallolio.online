# Skill L1 · cf-worker-site

**level:** semplice (blocco)  
**id:** `cf-worker-site`  
**home:** questo file in **marcodallolio.core** — non chat, non Notion
**local:** `.grok/skills/mdo/cf-worker-site.md` (copia di lavoro, polo online)

<!--
  ANNOTATE / KEEP FRESH
  Se in una sessione emergono annotazioni migliori (API diversa, assets nativi,
  CI wrangler, certificati, registrar nuovo), aggiorna QUESTO file in core.
  Non aprire una seconda skill parallela sullo stesso contesto.
  Data ultimo campo: 2026-08-20 · primo uso: polo tech · secondo: polo online
-->

## Contesto (cosa è, non una ricetta)

Un polo MDO su Cloudflare è **tre cose insieme**:

| Pezzo | Dove | Ruolo |
|-------|------|--------|
| **Git** | repo `Marc0ne94/marcodallolio.{tld}` (privato di solito) | declared: sorgente, `wrangler.toml`, `mdo.manifest.json` |
| **Worker** | Cloudflare Workers, stesso account MCP | effective: serve il sito all’edge |
| **Stack** | sito **neutro** (html/css/js o board) + kit da **core** (`@mdo/*`) | il sito consuma; il kit non si inventa nel polo |

Core (`Marc0ne94/marcodallolio.core`) resta hub: skills, packages, catalogo.  
Il Worker del polo **non** è il core e **non** è Pages (al 2026-08 i poli CF noti sono Worker + custom hostname).

## Stack da usare (finché non si annota di meglio)

- Module Worker (`export default { fetch }`), `compatibility_date` recente
- Contenuto: o HTML inline nel worker, o mappa path→asset in `dist-worker/worker.mjs` (come `.ai`)
- Preview account: subdomain `marcodallolio-consulenza.workers.dev` → `https://{worker-name}.marcodallolio-consulenza.workers.dev`
- Custom hostname: Worker + zona CF `marcodallolio.{tld}`
- NS attesi (stessi degli altri poli CF): `iris.ns.cloudflare.com` · `yisroel.ns.cloudflare.com`
- Design: token MDO (bg `#0c0d10`, accent `#d4c4a8`) — o `@mdo/brand` se il polo importa pacchetti
- Command plane **OFF** · siti neutri · `.it` NO-TOUCH

## Meccaniche viste (prove, non obblighi)

Campo 2026-08-13 su **tech** — utile se si ripete, da correggere se smentito:

- Zona assente: `POST /zones` `{ name, account, type: "full" }` → spesso `pending`
- Registrar visto su `.tech` / `.online`: Register.it (`ns1`/`ns2.register.it`)
- Upload: `PUT /accounts/{id}/workers/scripts/{name}` multipart (`metadata` + `worker.mjs` module)
- Accendere preview: `POST .../scripts/{name}/subdomain` `{ enabled: true }`
- **1042** su workers.dev nei primi ~60s dopo l’enable è comparso e poi è diventato 200 — non trattarlo subito come worker inesistente
- Attach dominio: `PUT /accounts/{id}/workers/domains` `{ hostname, service, zone_id }` — su zona pending il cert è stato emesso, ma l’HTTPS apex resta del registrar finché i NS non cambiano
- Repo Git vuoto (409 no default branch): push su `main` lo inizializza
- MCP `github` non ha (qui) update visibility; CF execute + git push bastano per worker+repo

Campo 2026-08-20 su **online** (Stormo, binari):

- Workers static assets JWT (`api.workers.cloudflare.com` + `cfwau_`) **non** è usabile da MCP execute (403 / 401). Non insistere.
- Fallback che ha funzionato: bucket R2 omonimo + binding `{ type: "r2_bucket", name: "MEDIA", bucket_name }` + `env.MEDIA.get(key)` nel Worker
- Per caricare i binari: Worker temporaneo con PUT gated su `/__put/{key}` (allowlist + header), `curl --data-binary` dal sandbox, poi **ridistribuire senza ingest**. Non lasciare `__put` in git.
- Multipart Worker PUT: join con CRLF reali (`String.fromCharCode(13,10)`), `main_module` + `application/javascript+module`

## Done when (minimo, adattabile)

- [ ] Worker risponde 200 sulla preview **o** sull’hostname, con contenuto visibile
- [ ] Repo ha almeno worker + manifest/wrangler (declared)
- [ ] Se il custom domain deve essere live: zona `active` e NS Cloudflare
- [ ] Nessun secret nel git del polo

## Non fare

- Toccare `marcodallolio.it`
- Abilitare command plane
- Mettere kit/control-plane/skill inventory sul sito pubblico
- Assumere che la zona CF esista già (tech non c’era)
- Trattare un 1042 immediato come fallimento definitivo
- Duplicare questa skill: aggiorna qui (e in core)

## Vicini

- L2 `setup-site` — registry/manifest/catalog; per l’edge CF passa da qui
- L1 `cloud-setup-from-core` — secret/bindings (Ocra), non l’hosting
- L1 `git-author-vercel` — author commit se un giorno il polo ha anche Vercel Git
