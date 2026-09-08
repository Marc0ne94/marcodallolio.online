# Align Stormo Worker to local simulation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The published Cloudflare Stormo must show the same six boy sprites and ground texture as the local simulation, with the same flock rules.

**Architecture:** Keep the React TanStack app as the source of visual truth (`src/components/flock-stage.tsx`, `src/lib/flock/*`, `public/sprites`, `public/ground.jpg`). The edge Worker stays a module Worker (not TanStack SSR). It serves the same HUD + canvas, loads `/sprites/boy-1.png`…`boy-6.png` and `/ground.jpg` from R2 (`env.MEDIA`), and draws with the same `drawBoy` / `drawGround` / y-sort / cursor ring as `flock-stage.tsx`.

Workers static assets (`ASSETS` + JWT upload) are not usable from this MCP (`api.workers.cloudflare.com` forbidden). R2 bucket `marcodallolio-online` is the media plane.

**Tech Stack:** Cloudflare Workers module + R2 binding `MEDIA`, vanilla canvas, existing PNG/JPEG.

**Spec:** Align published Stormo with local Stormo. Public surface stays product-only (no kit, no login gate).

## Global Constraints

- Command plane OFF
- Do not touch `marcodallolio.it`
- Git author `Marc0ne94 <99964496+Marc0ne94@users.noreply.github.com>`
- No secrets in git
- Public site must not serve skill inventory or control-plane docs
- Login/Accedi stays on the local app only (intentional)

---

### Task 1: Alignment contract test

**Files:**
- Create: `scripts/stormo-worker-align.test.mjs`
- Modify: none yet

- [x] **Step 1: Write the failing test**
- [x] **Step 2: Run it — expect FAIL until app.js exists**
- [x] **Step 3: Implement app.js + worker routing (Task 2–3)**
- [x] **Step 4: Re-run test — expect PASS**
- [x] **Step 5: Commit**

---

### Task 2: Client canvas matches flock-stage

**Files:**
- Create: `dist-worker/app.js`
- Create: `dist-worker/assets/sprites/boy-1.png` … `boy-6.png` (copies of `public/sprites`)
- Create: `dist-worker/assets/ground.jpg` (1024px jpeg of `public/ground.jpg`)

- [x] Vanilla port of `drawBoy` / `drawGround` / y-sort / cursor / DEFAULT_PARAMS

---

### Task 3: Worker serves HUD + assets

**Files:**
- Modify: `dist-worker/worker.mjs`
- Modify: `wrangler.toml`

Worker routes: `/` HTML HUD (Stormo tokens `#141210` / `#d4cdc2`), `/health` JSON, otherwise `env.MEDIA.get` for `/app.js`, `/ground.jpg`, `/sprites/boy-*.png`.

- [x] R2 binding `MEDIA` → bucket `marcodallolio-online`

---

### Task 4: Deploy assets + Worker, verify visually

- [x] Upload 6 PNG + compressed ground + `app.js` to R2
- [x] PUT worker with R2 binding (ingest stripped after upload)
- [x] Screenshot workers.dev: boys + terrain, not triangles
- [x] GET `/sprites/boy-*.png` and `/ground.jpg` 200, bytes match local edge copies

---

## Out of scope / missing (tell the human)

1. **Login/Accedi** on the local app — not on the public Worker (public polo).
2. **TanStack/Vite on Cloudflare** — not this deploy; visual port only.
3. **Apex `marcodallolio.online`** — zone still pending NS at Register.it.
4. **Core catalog / SUPER.MDO** — `online` not registered in core yet.
5. **Edge ground** is a 1024px jpeg of the same texture; React app keeps the 1408px original.
