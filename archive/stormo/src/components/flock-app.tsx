"use client";

import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { FlockControls } from "@/components/flock-controls";
import { FlockStage } from "@/components/flock-stage";

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-8 w-20 animate-pulse rounded-md bg-fg/10" />;
  }
  if (user) return <UserButton />;
  return (
    <Link
      to="/login"
      className="inline-flex h-8 items-center rounded-md bg-fg px-3 font-sans text-sm font-medium text-accent-fg transition-opacity duration-(--motion-quick) hover:opacity-90"
    >
      Accedi
    </Link>
  );
}

export function FlockApp() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <FlockStage />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
        <div className="bg-linear-to-b from-bg/80 via-bg/35 to-transparent px-4 pt-4 pb-16 md:px-6 md:pt-6">
          <header className="flex items-start justify-between gap-4">
            <div className="max-w-sm">
              <p className="font-sans text-xs font-medium tracking-[0.18em] text-accent uppercase">
                Simulazione
              </p>
              <h1 className="font-display text-4xl leading-none tracking-tight text-balance text-fg md:text-5xl">
                Stormo
              </h1>
              <p className="mt-2 max-w-xs font-sans text-sm leading-snug text-pretty text-fg/80">
                Separazione, allineamento, coesione. Muovi il puntatore per
                disperdere i ragazzi.
              </p>
            </div>
            <div className="pointer-events-auto">
              <AuthSlot />
            </div>
          </header>
        </div>

        <div className="px-4 pb-4 md:px-6 md:pb-6">
          <div className="pointer-events-auto w-full md:w-auto">
            <FlockControls />
          </div>
        </div>
      </div>
    </div>
  );
}
