import { createFileRoute, Link } from "@tanstack/react-router";
import { DeskMap } from "@/components/desk-map";
import { PhotoFrame } from "@/components/photo-frame";
import { ROOM_ASSETS, ZONES, photoById } from "@/data/catalog";

export const Route = createFileRoute("/mappa")({ component: Mappa });

function Mappa() {
  const overhead = photoById("overhead-close");
  const windowP = photoById("side-window");
  const bedP = photoById("side-bed");

  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Pianta del banco
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">Mappa.</h1>
        <p className="mt-3 text-muted">
          Schema zenitale della scrivania. I riquadri sono gli asset visti in lastra —
          clicca per aprire la scheda. I modelli 3D arriveranno dopo i SKU.
        </p>
      </header>

      <DeskMap />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-display text-2xl tracking-tight">Riferimento fotografico</h2>
          <p className="mt-2 mb-4 text-sm text-muted">Lastra zenitale da cui è stata letta la pianta.</p>
          <PhotoFrame photo={overhead} />
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-2xl tracking-tight">Stanza</h2>
          <p className="text-sm text-muted">
            Non è sul piano, ma entra nel gemello della stanza. {ROOM_ASSETS.length} elementi.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <PhotoFrame photo={windowP} />
            <PhotoFrame photo={bedP} />
          </div>
          <ul className="divide-y divide-line rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-border)]">
            {ZONES.filter((z) => z.collection === "room").map((z) => (
              <li key={z.id} className="px-4 py-3">
                <p className="font-mono text-[10px] tracking-[0.16em] text-subtle">Zona {z.code}</p>
                <p className="text-sm">{z.label}</p>
                <p className="text-xs text-muted">{z.blurb}</p>
              </li>
            ))}
          </ul>
          <Link to="/inventario" className="inline-block text-sm text-accent">
            Filtra inventario stanza
          </Link>
        </div>
      </section>
    </div>
  );
}
