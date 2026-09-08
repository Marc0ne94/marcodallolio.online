import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ASSETS, type Asset } from "@/data/catalog";

export type Assignment = {
  model: string;
  notes: string;
  confirmed: boolean;
  updatedAt: string;
};

type State = {
  assignments: Record<string, Assignment>;
  setDraft: (id: string, patch: Partial<Pick<Assignment, "model" | "notes">>) => void;
  confirm: (id: string) => void;
  clear: (id: string) => void;
  resetAll: () => void;
};

export const useLedger = create<State>()(
  persist(
    (set, get) => ({
      assignments: {},
      setDraft: (id, patch) => {
        const prev = get().assignments[id] ?? {
          model: "",
          notes: "",
          confirmed: false,
          updatedAt: new Date().toISOString(),
        };
        set({
          assignments: {
            ...get().assignments,
            [id]: {
              ...prev,
              ...patch,
              confirmed: false,
              updatedAt: new Date().toISOString(),
            },
          },
        });
      },
      confirm: (id) => {
        const prev = get().assignments[id];
        if (!prev?.model.trim()) return;
        set({
          assignments: {
            ...get().assignments,
            [id]: { ...prev, confirmed: true, updatedAt: new Date().toISOString() },
          },
        });
      },
      clear: (id) => {
        const next = { ...get().assignments };
        delete next[id];
        set({ assignments: next });
      },
      resetAll: () => set({ assignments: {} }),
    }),
    { name: "banco-ledger" },
  ),
);

export function resolvedModel(asset: Asset, assignment?: Assignment): string | null {
  if (assignment?.confirmed && assignment.model.trim()) return assignment.model.trim();
  return asset.confirmedModel?.trim() || null;
}

export function resolvedNotes(asset: Asset, assignment?: Assignment): string {
  if (assignment?.confirmed && assignment.notes.trim()) return assignment.notes;
  return asset.confirmedNotes?.trim() || assignment?.notes?.trim() || "";
}

export function isModelConfirmed(asset: Asset, assignment?: Assignment): boolean {
  return Boolean(resolvedModel(asset, assignment));
}

export function mergedAsset(asset: Asset, assignment?: Assignment) {
  return {
    ...asset,
    hardwareModel: resolvedModel(asset, assignment),
    extraNotes: resolvedNotes(asset, assignment),
    confirmed: isModelConfirmed(asset, assignment),
  };
}

export function exportInventory(assignments: Record<string, Assignment>) {
  return {
    project: "Banco",
    phase: 1,
    generatedAt: new Date().toISOString(),
    policy:
      "I modelli in confirmedModel / hardwareModel arrivano da te. Niente SKU inventati.",
    assets: ASSETS.map((a) => {
      const asg = assignments[a.id];
      const model = resolvedModel(a, asg);
      return {
        id: a.id,
        code: a.code,
        name: a.name,
        genericName: a.genericName,
        kind: a.kind,
        collection: a.collection,
        zoneId: a.zoneId,
        confidence: a.confidence,
        needsHardwareModel: a.needsHardwareModel,
        observed: a.observed,
        visibleMarkings: a.visibleMarkings,
        appearsIn: a.appearsIn,
        hardwareModel: model,
        assignmentNotes: resolvedNotes(a, asg) || null,
        confirmed: Boolean(model),
      };
    }),
  };
}
