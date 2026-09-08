import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type Tone = "mute" | "pending" | "ok" | "uncertain" | "accent";

const tones: Record<Tone, string> = {
  mute: "bg-raised text-muted",
  pending: "bg-pending/15 text-pending",
  ok: "bg-ok/15 text-ok",
  uncertain: "bg-terra/15 text-terra",
  accent: "bg-accent/15 text-accent",
};

export function Badge({
  tone = "mute",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
