import { useEffect, useState } from "react";
import { StudioCanvas } from "./studio-canvas";
import { StudioHud } from "./studio-hud";
import { StudioProvider, type Posture } from "./studio-state";

export function StudioPage({ initialSolo }: { initialSolo?: string }) {
  const [selected, setSelected] = useState<string | null>(initialSolo ?? null);
  const [solo, setSolo] = useState<string | null>(initialSolo ?? null);
  const [posture, setPosture] = useState<Posture>("sit");

  useEffect(() => {
    if (initialSolo) {
      setSolo(initialSolo);
      setSelected(initialSolo);
    }
  }, [initialSolo]);

  return (
    <StudioProvider
      value={{
        selected,
        setSelected,
        posture,
        setPosture,
        solo,
        isolate: (id) => {
          setSolo(id);
          setSelected(id);
        },
        showDesk: () => {
          setSolo(null);
          setSelected(null);
        },
      }}
    >
      <div className="relative h-dvh w-full overflow-hidden bg-[#050505]">
        <StudioCanvas />
        <StudioHud />
      </div>
    </StudioProvider>
  );
}
