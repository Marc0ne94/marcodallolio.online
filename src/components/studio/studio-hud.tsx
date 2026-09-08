import { useState } from "react";
import { BUILD_LIST, WAVES, buildItemById } from "@/data/build-list";
import { cn } from "@/lib/cn";
import { useStudio } from "./studio-state";

export function StudioHud() {
  const { selected, setSelected, posture, setPosture, solo, isolate, showDesk } = useStudio();
  const [listOpen, setListOpen] = useState(true);
  const item = selected ? buildItemById(selected) : undefined;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="pointer-events-auto flex flex-wrap gap-1">
          <button
            type="button"
            onClick={showDesk}
            className={cn(
              "rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] transition-colors duration-150",
              !solo ? "bg-fg text-accent-fg" : "bg-raised/80 text-muted hover:text-fg",
            )}
          >
            Banco
          </button>
          <button
            type="button"
            onClick={() => setPosture("sit")}
            className={cn(
              "rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] transition-colors duration-150",
              posture === "sit" ? "bg-fg text-accent-fg" : "bg-raised/80 text-muted hover:text-fg",
            )}
          >
            Sit
          </button>
          <button
            type="button"
            onClick={() => setPosture("stand")}
            className={cn(
              "rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] transition-colors duration-150",
              posture === "stand" ? "bg-fg text-accent-fg" : "bg-raised/80 text-muted hover:text-fg",
            )}
          >
            Stand
          </button>
          <button
            type="button"
            onClick={() => setListOpen((v) => !v)}
            className="rounded-full bg-raised/80 px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-muted hover:text-fg md:hidden"
          >
            Lista
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-stretch gap-3 pt-3">
        {listOpen ? (
          <aside className="pointer-events-auto hidden w-64 shrink-0 flex-col overflow-hidden rounded-[18px] bg-surface/90 shadow-[var(--shadow-border)] backdrop-blur-md md:flex">
            <div className="border-b border-line px-4 py-3">
              <p className="font-mono text-[11px] tracking-[0.16em] text-subtle">Pezzi</p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto py-2">
              {WAVES.map((wave) => (
                <div key={wave.id} className="px-2 pb-2">
                  <p className="px-2 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
                    {wave.label}
                  </p>
                  {BUILD_LIST.filter((i) => i.wave === wave.id).map((i) => {
                    const on = (solo ?? selected) === i.id;
                    return (
                      <button
                        key={i.id}
                        type="button"
                        onClick={() => isolate(i.id)}
                        className={cn(
                          "flex w-full items-baseline gap-3 rounded-[10px] px-2 py-1.5 text-left transition-colors duration-150",
                          on ? "bg-raised text-fg" : "text-muted hover:text-fg",
                        )}
                      >
                        <span className="w-5 font-mono text-[11px] text-subtle">
                          {String(i.n).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm">{i.title}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </aside>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col justify-end gap-3">
          {listOpen ? (
            <aside className="pointer-events-auto max-h-[40vh] overflow-y-auto rounded-[18px] bg-surface/90 p-2 shadow-[var(--shadow-border)] backdrop-blur-md md:hidden">
              {BUILD_LIST.map((i) => {
                const on = (solo ?? selected) === i.id;
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => isolate(i.id)}
                    className={cn(
                      "flex w-full items-baseline gap-3 rounded-[10px] px-2 py-1.5 text-left",
                      on ? "bg-raised text-fg" : "text-muted",
                    )}
                  >
                    <span className="w-5 font-mono text-[11px] text-subtle">
                      {String(i.n).padStart(2, "0")}
                    </span>
                    <span className="truncate text-sm">{i.title}</span>
                  </button>
                );
              })}
            </aside>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
              {solo ? "Isolato · Banco per tornare" : "Trascina · clicca un pezzo"}
            </p>
            {item ? (
              <div className="pointer-events-auto max-w-md rounded-[18px] bg-surface/95 p-4 shadow-[var(--shadow-border)] backdrop-blur-md sm:p-5">
                <p className="font-mono text-[11px] tracking-[0.16em] text-subtle">
                  {String(item.n).padStart(2, "0")}
                </p>
                <h2 className="mt-1 font-display text-2xl tracking-tight">{item.title}</h2>
                {item.model !== "—" ? (
                  <p className="mt-1 text-sm text-muted">{item.model}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {solo !== item.id ? (
                    <button
                      type="button"
                      onClick={() => isolate(item.id)}
                      className="rounded-full bg-fg px-3 py-1.5 text-sm text-accent-fg"
                    >
                      Isola
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={showDesk}
                      className="rounded-full bg-fg px-3 py-1.5 text-sm text-accent-fg"
                    >
                      Banco
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="rounded-full bg-raised px-3 py-1.5 text-sm text-muted hover:text-fg"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
