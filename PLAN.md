# Banco · piano di produzione

Questo file è il contratto. Non si improvvisa.

**Prodotto:** sit-to-stand, void nero, navigazione 3D.
**Dominio:** [marcodallolio.online](https://marcodallolio.online)
**Repo:** `Marc0ne94/marcodallolio.online`
**Asset:** un GLB per pezzo, metri, Y-up, origine sul piano. Stesso file web + Android.

Stormo non si butta. Vive in `archive/stormo`. Futuro (non ora): i ragazzi diventano insetti, il banco si anima. Concept. Si fa in fondo.

---

## Come si lavora

Né un pezzo a fotoreale mentre il resto è Lego, né un 5% su tutti.

| Passata | Cosa | Done quando |
|---|---|---|
| **A** Palco | Sit/stand, void, orbit, pick, lista pezzi | Fatto |
| **B** Silhouette | 8 macchine: quota, posa, schermo. Niente cubi | In corso |
| **C** Hero GLB | Un pezzo a PBR, file in `/models/{id}.glb` | Duo → XG349C |
| **D** Linguaggio | Gli altri copiano metallo/plastica del hero | Dopo C |

Dressing (cavi, stickies) resta dressing.

---

## Passata B — macchine

1. Sit-stand
2. XG349C
3. U32R590
4. Surface Pro 7 — silhouette ok
5. Zenbook Duo — silhouette ok, tastiera 31,3 × 20,9 cm
6. Strix 18 5090 chiuso
7. Z Fold 7
8. DGX Spark

Poi input (Trust, mech, M913, FreeBuds, Baseus).

---

## Passata C — GLB

Contratto in `src/lib/models.ts`.

1. Quota (scheda + lastra)
2. Mid-poly, bevel
3. PBR: color, roughness, metal, normal, AO
4. Mesh `BODY` `SCREEN` `KEYS`
5. Export GLB, scala 1, Draco
6. `ready: true`
7. Luce nello viewer, non nel mesh

Primo hero: **Zenbook Duo**. Secondo: **XG349C**.

---

## Cutover sito

Oggi `src/` è Banco. L’edge Cloudflare (`dist-worker`) serve ancora Stormo, così l’apex non si spegne.

Prossimo taglio: build Banco → nuovo worker → apex. Stormo resta in `archive/stormo` e, in app, in `/stormo`.
