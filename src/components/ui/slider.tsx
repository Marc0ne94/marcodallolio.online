"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type SliderProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  label: string;
  ariaLabel: string;
};

export function Slider({
  value,
  min,
  max,
  step,
  onValueChange,
  label,
  ariaLabel,
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className="relative flex h-8 w-full touch-none items-center select-none"
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(next) => onValueChange(next[0] ?? value)}
      aria-label={ariaLabel}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-fg/15">
        <SliderPrimitive.Range className="absolute h-full bg-accent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block size-4 rounded-full bg-fg shadow-sm",
          "transition-[box-shadow,transform] duration-(--motion-quick) ease-(--ease-out)",
          "hover:scale-110 focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:outline-none",
          "active:scale-95",
        )}
        aria-label={label}
      />
    </SliderPrimitive.Root>
  );
}
