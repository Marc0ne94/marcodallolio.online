/**
 * Shared 3D asset contract.
 *
 * Same files on web (R3F / three.js) and Android (Filament, SceneView,
 * three.js in WebView, or RN + expo-gl). The JSX meshes in `hardware.tsx`
 * are stand-ins until a GLB is marked ready.
 *
 * File:        /models/{id}.glb
 * Units:       meters
 * Up axis:     Y
 * Forward:     +Z toward the operator
 * Origin:      contact with the desk, center of the footprint
 * Materials:   glTF PBR metallic-roughness (baseColor, metallic, roughness, normal)
 * Screens:     mesh named SCREEN (emissive), swapped at runtime
 * Compression: Draco mesh + KTX2 textures when we ship
 */

export const MODEL_DIR = "/models";

export type ModelDef = {
  id: string;
  file: string;
  /** False = still the procedural stand-in. */
  ready: boolean;
};

export const MODELS: Record<string, ModelDef> = {
  "desk-standing": { id: "desk-standing", file: "desk-standing.glb", ready: false },
  "mon-left": { id: "mon-left", file: "mon-left.glb", ready: false },
  "mon-right": { id: "mon-right", file: "mon-right.glb", ready: false },
  "laptop-left": { id: "laptop-left", file: "laptop-left.glb", ready: false },
  "laptop-right": { id: "laptop-right", file: "laptop-right.glb", ready: false },
  "riser-black": { id: "riser-black", file: "riser-black.glb", ready: false },
  "phone-fold": { id: "phone-fold", file: "phone-fold.glb", ready: false },
  "dgx-spark": { id: "dgx-spark", file: "dgx-spark.glb", ready: false },
  "kb-compact": { id: "kb-compact", file: "kb-compact.glb", ready: false },
  "kb-mech": { id: "kb-mech", file: "kb-mech.glb", ready: false },
  "mouse-main": { id: "mouse-main", file: "mouse-main.glb", ready: false },
  earbuds: { id: "earbuds", file: "earbuds.glb", ready: false },
  "hub-usbc": { id: "hub-usbc", file: "hub-usbc.glb", ready: false },
};

export function modelUrl(id: string) {
  const def = MODELS[id];
  return def ? `${MODEL_DIR}/${def.file}` : null;
}
