import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PhotoFrame } from "@/components/photo-frame";
import { Button } from "@/components/ui/button";
import {
  ASSETS,
  DESK_ASSETS,
  HARDWARE_ASSETS,
  OPEN_QUESTIONS,
  PHOTOS,
  ROOM_ASSETS,
} from "@/data/catalog";
import { isModelConfirmed, resolvedModel, useLedger } from "@/lib/store";

export const Route = createFileRoute("/archivio")({ component: Archivio });

function Archivio() {
  const assignments = useLedger((s) => s.assignments);
  const confirmed = HARDWARE_ASSETS.filter((a) => isModelConfirmed(a, assignments[a.id])).length;
  const pending = HARDWARE_ASSETS.length - confirmed;
  const uncertain = ASSETS.filter((a) => a.confidence === "uncertain").length;
  const hero = PHOTOS.find((p) => p.id === "front")!;
  const matched = HARDWARE_ASSETS.filter((a) => isModelConfirmed(a, assignments[a.id]));

  return (
    <div className="space-y-14">
      <section className="rise-in grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Riferimento · 9 lastre · non è il prodotto
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Censimento del banco.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Lastre e schede restano qui come verità. Il prodotto è lo studio 3D:
            void nero, vista frontale, pezzi sul sit-stand.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/">
                Apri lo studio
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/inventario">Inventario</Link>
            </Button>
          </div>
        </div>
        <PhotoFrame photo={hero} priority />
      </section>

      <section className="rise-in-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Asset visti" value={ASSETS.length} />
        <Stat label="Sul banco" value={DESK_ASSETS.length} />
        <Stat label="SKU in attesa" value={pending} tone="pending" />
        <Stat label="Confermati" value={confirmed} tone={confirmed ? "ok" : undefined} />
      </section>

      {matched.length > 0 && (
        <section className="rise-in-2 space-y-4">
          <h2 className="font-display text-2xl tracking-tight sm:text-3xl">Abbinati</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {matched.map((a) => (
              <li key={a.id}>
                <Link
                  to="/inventario/$id"
                  params={{ id: a.id }}
                  className="block rounded-[var(--radius-md)] bg-surface px-4 py-3 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
                >
                  <p className="font-mono text-[11px] tracking-[0.14em] text-subtle">{a.code}</p>
                  <p className="mt-1 text-sm leading-snug">{resolvedModel(a, assignments[a.id])}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rise-in-3 space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">Ancora aperti</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              {uncertain} osservazioni incerte. {pending} SKU ancora vuoti.
            </p>
          </div>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {OPEN_QUESTIONS.map((q) => (
            <li
              key={q.id}
              className="rounded-[var(--radius-lg)] bg-surface p-5 shadow-[var(--shadow-border)]"
            >
              <p className="font-mono text-[11px] tracking-[0.16em] text-subtle">
                {q.assetIds.length} schede
              </p>
              <h3 className="mt-2 font-display text-xl tracking-tight">{q.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{q.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {q.assetIds.map((id) => (
                  <Link
                    key={id}
                    to="/inventario/$id"
                    params={{ id }}
                    className="rounded-full bg-raised px-3 py-1.5 font-mono text-[11px] tracking-wide text-accent hover:text-fg"
                  >
                    {id}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-tight sm:text-3xl">Le lastre</h2>
          <Link to="/foto" className="text-sm text-accent">
            Archivio
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTOS.slice(0, 6).map((p) => (
            <PhotoFrame key={p.id} photo={p} />
          ))}
        </div>
      </section>

      <section className="grid gap-3 rounded-[var(--radius-xl)] bg-surface p-6 shadow-[var(--shadow-border)] sm:grid-cols-3 sm:p-8">
        <Note
          k="01"
          t="Riferimento"
          d={`${DESK_ASSETS.length} pezzi sul banco, ${ROOM_ASSETS.length} nella stanza. Le lastre non escono dal prodotto.`}
        />
        <Note
          k="02"
          t="Block-out"
          d="Prima tutta la postazione, proporzioni vere. Poi si rifinisce un pezzo alla volta."
        />
        <Note
          k="03"
          t="Void"
          d="Fuori dal piano: nero. Solo sit-stand, hardware, e i dettagli sul banco."
        />
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "pending" | "ok";
}) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-surface px-4 py-4 shadow-[var(--shadow-border)] sm:px-5 sm:py-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p
        className={`mt-2 font-display text-3xl tabular-nums tracking-tight sm:text-4xl ${
          tone === "pending" ? "text-pending" : tone === "ok" ? "text-ok" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Note({ k, t, d }: { k: string; t: string; d: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.18em] text-subtle">{k}</p>
      <h3 className="mt-2 font-display text-lg tracking-tight">{t}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
    </div>
  );
}
