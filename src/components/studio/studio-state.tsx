import { createContext, useContext, type ReactNode } from "react";

export type Posture = "sit" | "stand";

export type StudioApi = {
  selected: string | null;
  setSelected: (id: string | null) => void;
  posture: Posture;
  setPosture: (p: Posture) => void;
  solo: string | null;
  isolate: (id: string) => void;
  showDesk: () => void;
};

const Ctx = createContext<StudioApi | null>(null);

export function StudioProvider({
  value,
  children,
}: {
  value: StudioApi;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStudio outside provider");
  return ctx;
}

export function Slot({ id, children }: { id: string; children: ReactNode }) {
  const { solo } = useStudio();
  if (solo && solo !== id) return null;
  return children;
}
