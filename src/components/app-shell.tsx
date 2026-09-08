import { Link, useRouterState } from "@tanstack/react-router";
import { Box, Camera, LayoutGrid, Map, View } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/", label: "Studio", icon: View },
  { to: "/pezzi", label: "Pezzi", icon: Box },
  { to: "/foto", label: "Lastre", icon: Camera },
  { to: "/inventario", label: "Inventario", icon: LayoutGrid },
  { to: "/archivio", label: "Censimento", icon: Map },
] as const;

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const immersive = pathname === "/";

  if (immersive) {
    return <div className="h-dvh overflow-hidden bg-[#050505] text-fg">{children}</div>;
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg tracking-tight sm:text-xl">Banco</span>
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted sm:inline">
              Riferimento
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = isActive(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors duration-150",
                    active ? "bg-raised text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pt-10 md:pb-16">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] tracking-wide",
                    active ? "text-fg" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.6} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
