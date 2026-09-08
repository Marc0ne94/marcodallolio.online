import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/") {
    return <div className="h-dvh overflow-hidden bg-[#050505] text-fg">{children}</div>;
  }
  return <div className="min-h-dvh bg-[#050505] text-fg">{children}</div>;
}
