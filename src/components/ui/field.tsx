import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-[11px] font-medium uppercase tracking-[0.16em] text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[var(--radius-md)] bg-raised px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle",
        "transition-[box-shadow] duration-150 focus:shadow-[var(--shadow-border-hover)] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-[var(--radius-md)] bg-raised px-3 py-2.5 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle",
        "transition-[box-shadow] duration-150 focus:shadow-[var(--shadow-border-hover)] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
