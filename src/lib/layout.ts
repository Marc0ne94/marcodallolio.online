/** Desk-surface coordinates in meters. Origin: center of the sit-stand top. +Z toward the operator / camera. */

export const DESK = {
  w: 1.52,
  d: 0.76,
  t: 0.034,
  sit: 0.72,
  stand: 1.08,
};

export type Focus = {
  cam: [number, number, number];
  target: [number, number, number];
};

export const FOCUS: Record<string, Focus> = {
  desk: { cam: [0, 1.55, 2.85], target: [0, 1.02, -0.05] },
  "desk-standing": { cam: [0, 1.55, 2.85], target: [0, 1.02, -0.05] },
  "mon-left": { cam: [-0.35, 1.22, 1.35], target: [-0.3, 1.08, -0.22] },
  "mon-right": { cam: [0.42, 1.22, 1.35], target: [0.36, 1.1, -0.22] },
  "laptop-left": { cam: [-0.55, 1.15, 1.05], target: [-0.5, 0.86, 0.16] },
  "laptop-right": { cam: [0.55, 1.2, 1.25], target: [0.48, 0.88, 0.08] },
  "riser-black": { cam: [0.05, 1.12, 1.05], target: [0.02, 0.78, 0.02] },
  "phone-fold": { cam: [0.04, 1.05, 0.72], target: [0.02, 0.9, 0.02] },
  "dgx-spark": { cam: [-0.22, 1.0, 0.85], target: [-0.26, 0.8, -0.08] },
  "kb-compact": { cam: [-0.28, 1.05, 0.95], target: [-0.28, 0.78, -0.04] },
  "kb-mech": { cam: [0.04, 1.0, 0.95], target: [0.04, 0.76, 0.22] },
  "mouse-main": { cam: [-0.08, 0.95, 0.85], target: [-0.1, 0.74, 0.28] },
  earbuds: { cam: [0.16, 0.98, 0.7], target: [0.14, 0.78, 0.05] },
  "hub-usbc": { cam: [-0.08, 0.95, 0.75], target: [-0.06, 0.75, -0.04] },
  "glasses-case": { cam: [-0.42, 0.95, 0.8], target: [-0.4, 0.74, 0.08] },
  "mat-desk": { cam: [0, 1.55, 2.2], target: [0, 0.78, 0.04] },
  "desk-controller": { cam: [0.55, 1.05, 1.1], target: [0.62, 0.74, 0.34] },
  "mon-arm-left": { cam: [-0.35, 1.2, 1.2], target: [-0.34, 0.95, -0.28] },
  "mon-arm-right": { cam: [0.42, 1.2, 1.2], target: [0.4, 0.95, -0.28] },
};

export const FRONT: Focus = FOCUS.desk;
