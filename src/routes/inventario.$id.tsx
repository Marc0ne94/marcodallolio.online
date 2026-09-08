import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DeskMap } from "@/components/desk-map";
import { ModelForm } from "@/components/model-form";
import { ConfidenceBadge, StatusBadge } from "@/components/status-badge";
import { KIND_LABEL, PHOTOS, assetById, zoneById } from "@/data/catalog";
import { isModelConfirmed, resolvedModel, resolvedNotes, useLedger } from "@/lib/store";

export const Route = createFileRoute("/inventario/$id")({ component: AssetDetail });

function AssetDetail() {
  const { id } = Route.useParams();
  const resolvedId = id === "enclosure" ? "dgx-spark" : id;
  const assignment = useLedger((s) => s.assignments[resolvedId]);
  if (id === "enclosure") {
    return <Navigate to="/inventario/$id" params={{ id: "dgx-spark" }} replace />;
  }
  const asset = assetById(id);
  if (!asset) {
    return (
      <div className="space-y-4">
        <Link to="/inventario" className="text-sm text-muted hover:text-fg">
          Torna all’inventario
        </Link>
        <h1 className="font-display text-3xl">Scheda non in catalogo.</h1>
      </div>
    );
  }
  const zone = zoneById(asset.zoneId);
  const plates = PHOTOS.filter((p) => asset.appearsIn.includes(p.id));
  const model = resolvedModel(asset, assignment);
  const notes = resolvedNotes(asset, assignment);
  const confirmed = isModelConfirmed(asset, assignment);

  return (
    <div className="space-y-10">
      <Link
        to="/inventario"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        Inventario
      </Link>

      <header className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-subtle">{asset.code}</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">{asset.name}</h1>
          <p className="mt-2 text-lg text-muted">{asset.genericName}</p>
          {model && <p className="mt-3 text-base text-ok">{model}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge asset={asset} />
          <ConfidenceBadge asset={asset} />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl tracking-tight">Osservato in lastra</h2>
            <ul className="mt-4 space-y-3">
              {asset.observed.map((line) => (
                <li key={line} className="border-l border-line pl-4 text-sm leading-relaxed text-fg/90">
                  {line}
                </li>
              ))}
            </ul>
          </section>

          {asset.visibleMarkings.length > 0 && (
            <section>
              <h2 className="font-display text-2xl tracking-tight">Marchi visibili</h2>
              <p className="mt-2 text-sm text-muted">
                Solo ciò che si legge in foto — non è una attribuzione di modello.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {asset.visibleMarkings.map((m) => (
                  <li
                    key={m}
                    className="rounded-full bg-raised px-3 py-1.5 text-sm text-accent"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {notes && (
            <section className="rounded-[var(--radius-lg)] bg-surface p-5 shadow-[var(--shadow-border)]">
              <p className="font-mono text-[11px] tracking-[0.16em] text-ok">Scheda da te</p>
              <p className="mt-2 text-sm leading-relaxed">{notes}</p>
            </section>
          )}

          {asset.openQuestion && !confirmed && (
            <section className="rounded-[var(--radius-lg)] bg-surface p-5 shadow-[var(--shadow-border)]">
              <p className="font-mono text-[11px] tracking-[0.16em] text-pending">Aperto</p>
              <p className="mt-2 text-sm leading-relaxed">{asset.openQuestion}</p>
            </section>
          )}

          <section className="rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
            <h2 className="font-display text-2xl tracking-tight">Assegna il modello</h2>
            <p className="mt-2 mb-5 text-sm text-muted">
              {confirmed
                ? "Già abbinato. Puoi correggere la stringa se serve."
                : "Campo vuoto di proposito. Quando me lo passi, lo scriviamo qui."}
            </p>
            <ModelForm asset={asset} />
          </section>
        </div>

        <aside className="space-y-6">
          <dl className="grid grid-cols-2 gap-3 rounded-[var(--radius-lg)] bg-surface p-5 shadow-[var(--shadow-border)]">
            <Item k="Famiglia" v={KIND_LABEL[asset.kind]} />
            <Item k="Collezione" v={asset.collection === "desk" ? "Banco" : "Stanza"} />
            <Item k="Zona" v={zone ? `${zone.code} · ${zone.label}` : "—"} />
            <Item k="Lastre" v={String(plates.length)} />
          </dl>

          <div className="space-y-3">
            <h2 className="font-display text-xl tracking-tight">Compare in</h2>
            <ul className="grid grid-cols-2 gap-3">
              {plates.map((p) => (
                <li key={p.id}>
                  <Link to="/foto/$id" params={{ id: p.id }} className="block">
                    <img
                      src={p.file}
                      alt={p.angle}
                      className="plate aspect-[4/3] w-full rounded-[var(--radius-md)] object-cover"
                    />
                    <p className="mt-2 text-xs text-muted">{p.angle}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {asset.collection === "desk" && asset.plate && (
        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-tight">Sulla pianta</h2>
          <DeskMap highlight={asset.id} />
        </section>
      )}
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-subtle">{k}</dt>
      <dd className="mt-1 text-sm">{v}</dd>
    </div>
  );
}
