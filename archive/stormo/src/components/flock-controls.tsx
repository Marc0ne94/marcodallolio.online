"use client";

import { useEffect, useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { PARAM_META, useFlockStore } from "@/lib/flock/params";
import { cn } from "@/lib/utils";

export function FlockControls() {
  const store = useFlockStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setOpen(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <aside
      className={cn(
        "pointer-events-auto w-full max-w-md md:w-80",
        "rounded-xl bg-surface/88 text-fg shadow-border backdrop-blur-md",
        "ring-1 ring-fg/10",
      )}
    >
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5">
          <SlidersHorizontal className="size-4 text-muted" strokeWidth={1.75} />
          <span className="font-display text-lg leading-tight tracking-tight">
            Regole
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="font-sans text-xs tabular-nums text-muted">
            {Math.round(store.population)}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-muted transition-transform duration-(--motion-fast) ease-(--ease-smooth-out)",
              open ? "rotate-180" : "rotate-0",
            )}
          />
        </span>
      </button>

      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows,opacity] duration-(--motion-fast) ease-(--ease-smooth-out)",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2 md:grid-cols-1">
            {PARAM_META.map((meta) => {
              const value = store[meta.key];
              return (
                <label key={meta.key} className="block">
                  <span className="mb-1 flex items-baseline justify-between gap-3">
                    <span>
                      <span className="block font-sans text-sm font-medium text-fg">
                        {meta.label}
                      </span>
                      <span className="block font-sans text-xs text-subtle">
                        {meta.hint}
                      </span>
                    </span>
                    <span className="font-sans text-sm tabular-nums text-accent">
                      {meta.format(value)}
                    </span>
                  </span>
                  <Slider
                    value={value}
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    onValueChange={(next) => store.setParam(meta.key, next)}
                    label={meta.label}
                    ariaLabel={meta.label}
                  />
                </label>
              );
            })}

            <button
              type="button"
              onClick={() => store.reset()}
              className={cn(
                "col-span-full mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-md",
                "bg-fg/10 font-sans text-sm font-medium text-fg",
                "transition-[background-color,transform] duration-(--motion-quick) ease-(--ease-out)",
                "hover:bg-fg/15 active:scale-[0.98]",
              )}
            >
              <RotateCcw className="size-3.5" strokeWidth={1.75} />
              Ripristina
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
