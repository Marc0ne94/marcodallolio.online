import { createFileRoute, Link } from "@tanstack/react-router";
import { BUILD_LIST, WAVES } from "@/data/build-list";
import { assetById } from "@/data/catalog";
import { isModelConfirmed, resolvedModel, useLedger } from "@/lib/store";

export const Route = createFileRoute("/pezzi")({ component: Pezzi });

function Pezzi() {
  const assignments = useLedger((s) => s.assignments);
  const confirmed = BUILD_LIST.filter((i) => {
    const a = assetById(i.id);
    return a ? isModelConfirmed(a, assignments[a.id]) : false;
  }).length;

  return (
    <div className="space-y-12">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Produzione · {BUILD_LIST.length} pezzi · {confirmed} confermati
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
          Uno alla volta.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Ogni oggetto si isola nel void, si rifinisce, poi torna sul banco. Non si
          chiude un pezzo a CAD pieno prima di aver piazzato gli altri.
        </p>
      </header>

      {WAVES.map((wave) => (
        <section key={wave.id} className="space-y-4">
          <div>
            <h2 className="font-display text-2xl tracking-tight">{wave.label}</h2>
            <p className="mt-1 text-sm text-muted">{wave.blurb}</p>
          </div>
          <ol className="divide-y divide-line overflow-hidden rounded-[var(--radius-xl)] bg-surface shadow-[var(--shadow-border)]">
            {BUILD_LIST.filter((i) => i.wave === wave.id).map((item) => {
              const asset = assetById(item.id);
              const model = asset ? resolvedModel(asset, assignments[asset.id]) : item.model;
              const ok = asset ? isModelConfirmed(asset, assignments[asset.id]) : false;
              return (
                <li key={item.id}>
                  <Link
                    to="/"
                    search={{ solo: item.id }}
                    className="flex flex-col gap-2 px-5 py-4 transition-colors duration-150 hover:bg-raised sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="w-8 font-mono text-sm text-subtle">
                      {String(item.n).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-xl tracking-tight">{item.title}</span>
                      <span className="mt-1 block text-sm text-muted">{item.why}</span>
                    </span>
                    <span className="font-mono text-[12px] text-subtle sm:max-w-xs sm:text-right">
                      {model}
                      {ok ? (
                        <span className="mt-1 block text-ok">Confermato</span>
                      ) : item.model === "—" ? (
                        <span className="mt-1 block text-pending">SKU aperto</span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
