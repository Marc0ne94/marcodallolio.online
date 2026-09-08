import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AssetCard } from "@/components/asset-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import {
  ASSETS,
  KIND_LABEL,
  type Collection,
  type Kind,
} from "@/data/catalog";
import { exportInventory, isModelConfirmed, useLedger } from "@/lib/store";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/inventario/")({ component: Inventario });

type Filter = "all" | "desk" | "room" | "pending" | "uncertain" | Kind;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Tutti" },
  { id: "desk", label: "Banco" },
  { id: "room", label: "Stanza" },
  { id: "pending", label: "SKU in attesa" },
  { id: "uncertain", label: "Incerti" },
  { id: "display", label: KIND_LABEL.display },
  { id: "computer", label: KIND_LABEL.computer },
  { id: "input", label: KIND_LABEL.input },
  { id: "audio", label: KIND_LABEL.audio },
  { id: "connectivity", label: KIND_LABEL.connectivity },
  { id: "support", label: KIND_LABEL.support },
  { id: "furniture", label: KIND_LABEL.furniture },
];

function Inventario() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const assignments = useLedger((s) => s.assignments);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ASSETS.filter((a) => {
      if (filter === "desk" || filter === "room") return a.collection === (filter as Collection);
      if (filter === "pending") {
        return a.needsHardwareModel && !isModelConfirmed(a, assignments[a.id]);
      }
      if (filter === "uncertain") return a.confidence === "uncertain";
      if (filter !== "all") return a.kind === filter;
      return true;
    }).filter((a) => {
      if (!query) return true;
      const blob = `${a.name} ${a.genericName} ${a.code} ${a.observed.join(" ")}`.toLowerCase();
      return blob.includes(query);
    });
  }, [q, filter, assignments]);

  function download() {
    const payload = exportInventory(assignments);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "banco-inventario.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Censimento
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight">Inventario.</h1>
          <p className="mt-3 max-w-xl text-muted">
            {ASSETS.length} elementi. I modelli hardware si assegnano scheda per scheda.
          </p>
        </div>
        <Button variant="outline" onClick={download}>
          Esporta JSON
        </Button>
      </header>

      <div className="space-y-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca per nome, codice, osservazione…"
          aria-label="Cerca inventario"
        />
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "h-10 shrink-0 rounded-full px-3.5 text-sm transition-colors duration-150",
                filter === f.id ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-subtle">
        {list.length} {list.length === 1 ? "scheda" : "schede"}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}
