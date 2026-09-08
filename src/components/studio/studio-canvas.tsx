import { Canvas } from "@react-three/fiber";
import { DeskScene } from "./desk-scene";
import { StudioProvider, useStudio } from "./studio-state";

export function StudioCanvas() {
  const api = useStudio();
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows="basic"
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.55, 2.85], fov: 35, near: 0.05, far: 40 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.45;
        }}
        onPointerMissed={() => api.setSelected(null)}
        style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
      >
        <StudioProvider value={api}>
          <DeskScene />
        </StudioProvider>
      </Canvas>
    </div>
  );
}
