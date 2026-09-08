import { Link } from "@tanstack/react-router";
import { ASSETS, ZONES } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { isModelConfirmed, useLedger } from "@/lib/store";

const PLATED = ASSETS.filter((a) => a.plate && a.collection === "desk").slice().sort((a, b) => {
  const aa = (a.plate?.w ?? 0) * (a.plate?.h ?? 0);
  const bb = (b.plate?.w ?? 0) * (b.plate?.h ?? 0);
  return bb - aa;
});

export function DeskMap({
  highlight,
  interactive = true,
}: {
  highlight?: string;
  interactive?: boolean;
}) {
  const assignments = useLedger((s) => s.assignments);

  return (
    <div className="overflow-x-auto">
      <div className="relative mx-auto min-w-[640px] max-w-4xl">
        <div className="rounded-[var(--radius-xl)] bg-surface p-3 shadow-[var(--shadow-border)] sm:p-5">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[var(--radius-lg)] bg-raised">
            <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full" aria-hidden>
              <rect x="1.5" y="1.5" width="97" height="67" fill="none" stroke="currentColor" strokeOpacity="0.16" />
              <rect x="4" y="4" width="92" height="8" fill="currentColor" fillOpacity="0.04" />
              <text x="6" y="9.4" fill="currentColor" fillOpacity="0.35" fontSize="2.4" fontFamily="ui-monospace, monospace">
                PARETE · medaglie · catena
              </text>
            </svg>

            {PLATED.map((asset, i) => {
              const box = asset.plate!;
              const assigned = isModelConfirmed(asset, assignments[asset.id]);
              const active = highlight === asset.id;
              const className = cn(
                "absolute overflow-hidden rounded-[4px] border transition-[background-color,border-color] duration-150",
                assigned
                  ? "border-ok/70 bg-ok/20"
                  : asset.confidence === "uncertain"
                    ? "border-terra/60 bg-terra/15"
                    : "border-accent/45 bg-accent/10",
                active && "border-fg bg-fg/20",
                interactive && "hover:border-fg hover:bg-fg/15",
              );

              const style = {
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
                zIndex: 10 + i,
              };

              const label = (
                <span className="block truncate px-1 pt-0.5 font-mono text-[9px] tracking-wide text-fg/85 sm:text-[10px]">
                  {asset.code}
                </span>
              );

              if (!interactive) {
                return (
                  <div key={asset.id} className={className} style={style}>
                    {label}
                  </div>
                );
              }

              return (
                <Link
                  key={asset.id}
                  to="/inventario/$id"
                  params={{ id: asset.id }}
                  title={asset.name}
                  className={className}
                  style={style}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 px-1 text-[11px] uppercase tracking-[0.14em] text-muted">
            <span className="inline-flex items-center gap-2">
              <i className="size-2 rounded-sm bg-accent/70" /> In attesa
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="size-2 rounded-sm bg-ok/80" /> Confermato
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="size-2 rounded-sm bg-terra/80" /> Incerto
            </span>
          </div>
        </div>
        <ul className="mt-5 hidden grid-cols-4 gap-2 sm:grid">
          {ZONES.filter((z) => z.collection === "desk").map((z) => (
            <li
              key={z.id}
              className="rounded-[var(--radius-md)] bg-surface px-3 py-2.5 shadow-[var(--shadow-border)]"
            >
              <p className="font-mono text-[10px] tracking-[0.16em] text-subtle">Zona {z.code}</p>
              <p className="mt-1 text-sm">{z.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
