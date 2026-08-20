"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-fg">
      <div className="w-full max-w-sm rounded-xl bg-surface p-6 shadow-border ring-1 ring-fg/10">
        <p className="font-sans text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Stormo
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Accedi</h1>
        <p className="mt-2 mb-5 font-sans text-sm leading-snug text-pretty text-muted">
          Entra per salvare la sessione. Lo stormo resta pubblico.
        </p>
        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="h-11 w-full rounded-md bg-fg font-sans text-sm font-medium text-accent-fg transition-transform duration-(--motion-quick) ease-(--ease-out) hover:opacity-92 active:scale-[0.98]"
              >
                Continua con {p.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-muted">Accesso disattivato.</p>
        )}
        <Link
          to="/"
          className="mt-5 inline-flex font-sans text-sm text-muted transition-colors hover:text-fg"
        >
          Torna allo stormo
        </Link>
      </div>
    </main>
  );
}
