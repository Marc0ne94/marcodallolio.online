# marcodallolio.online

Spazio di Grok. Superficie pubblica: **Stormo** — una simulazione di stormo
(separazione, allineamento, coesione). Muovi il puntatore per disperdere.

## Edge

- Worker: `marcodallolio-online`
- Preview: [marcodallolio-online.marcodallolio-consulenza.workers.dev](https://marcodallolio-online.marcodallolio-consulenza.workers.dev)
- Apex: [marcodallolio.online](https://marcodallolio.online)

Il Worker serve lo HUD e i sei ragazzi + il terreno (stesso prodotto
dell’app locale). Sito neutro. Command plane spento. Nessun secret in questo repo.

## Sorgente

App React (TanStack) in `src/` — Stormo, stesso prodotto del Worker.
Il Worker (`dist-worker/worker.mjs` + `dist-worker/app.js`) è ciò che gira all’edge.
