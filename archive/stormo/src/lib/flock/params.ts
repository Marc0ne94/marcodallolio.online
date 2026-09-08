import { create } from "zustand";

export type FlockParams = {
  separation: number;
  alignment: number;
  cohesion: number;
  avoid: number;
  population: number;
  speed: number;
};

export const DEFAULT_PARAMS: FlockParams = {
  separation: 1.55,
  alignment: 1.05,
  cohesion: 0.92,
  avoid: 2.2,
  population: 96,
  speed: 2.55,
};

export const PARAM_META: {
  key: keyof FlockParams;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
}[] = [
  {
    key: "separation",
    label: "Separazione",
    hint: "Spazio personale",
    min: 0,
    max: 3,
    step: 0.05,
    format: (n) => n.toFixed(2),
  },
  {
    key: "alignment",
    label: "Allineamento",
    hint: "Stessa direzione",
    min: 0,
    max: 3,
    step: 0.05,
    format: (n) => n.toFixed(2),
  },
  {
    key: "cohesion",
    label: "Coesione",
    hint: "Restare insieme",
    min: 0,
    max: 3,
    step: 0.05,
    format: (n) => n.toFixed(2),
  },
  {
    key: "avoid",
    label: "Evitamento",
    hint: "Fuga dal cursore",
    min: 0,
    max: 4,
    step: 0.05,
    format: (n) => n.toFixed(2),
  },
  {
    key: "population",
    label: "Popolazione",
    hint: "Quanti ragazzi",
    min: 8,
    max: 220,
    step: 1,
    format: (n) => String(Math.round(n)),
  },
  {
    key: "speed",
    label: "Velocità",
    hint: "Passo dello stormo",
    min: 0.4,
    max: 5.5,
    step: 0.05,
    format: (n) => n.toFixed(2),
  },
];

type FlockStore = FlockParams & {
  setParam: <K extends keyof FlockParams>(key: K, value: FlockParams[K]) => void;
  reset: () => void;
};

export const useFlockStore = create<FlockStore>((set) => ({
  ...DEFAULT_PARAMS,
  setParam: (key, value) => set({ [key]: value }),
  reset: () => set({ ...DEFAULT_PARAMS }),
}));
