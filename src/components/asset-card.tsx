import { Link } from "@tanstack/react-router";
import { KIND_LABEL, zoneById, type Asset } from "@/data/catalog";
import { StatusBadge } from "@/components/status-badge";
import { resolvedModel, useLedger } from "@/lib/store";

export function AssetCard({ asset }: { asset: Asset }) {
  const assignment = useLedger((s) => s.assignments[asset.id]);
  const zone = zoneById(asset.zoneId);
  const model = resolvedModel(asset, assignment);

  return (
    <Link
      to="/inventario/$id"
      params={{ id: asset.id }}
      className="group flex flex-col rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-200 ease-out hover:shadow-[var(--shadow-border-hover)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.16em] text-subtle">{asset.code}</p>
        <StatusBadge asset={asset} />
      </div>
      <h3 className="mt-3 font-display text-xl leading-snug tracking-tight">{asset.name}</h3>
      <p className="mt-1 text-sm text-muted">{asset.genericName}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-subtle">
        {KIND_LABEL[asset.kind]}
        {zone ? ` · Zona ${zone.code}` : ""}
      </p>
      <p className="mt-3 min-h-10 text-sm text-fg/80">
        {model ? (
          <span className="text-ok">{model}</span>
        ) : asset.needsHardwareModel ? (
          <span className="text-pending">Nessun modello assegnato</span>
        ) : (
          <span className="text-muted">Non richiede SKU hardware</span>
        )}
      </p>
    </Link>
  );
}
