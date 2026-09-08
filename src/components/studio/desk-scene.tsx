import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Group } from "three";
import { DESK, FOCUS, FRONT } from "@/lib/layout";
import {
  Cable,
  DeskMat,
  DeskTop,
  DgxSpark,
  Fold7,
  FreeBuds,
  HubBaseus,
  MechKeyboard,
  MonLeft,
  MonRight,
  Mouse,
  RayBanCase,
  Stickies,
  StrixClosed,
  SurfacePro,
  TrustKeyboard,
  ZenbookDuo,
} from "./hardware";
import { Slot, useStudio } from "./studio-state";

export function DeskScene() {
  const { selected, posture, solo } = useStudio();
  const group = useRef<Group>(null);
  const height = posture === "stand" ? DESK.stand : DESK.sit;
  const currentH = useRef(DESK.sit);
  const framed = solo ?? selected;

  useFrame((_, raw) => {
    const d = Math.min(raw, 0.1);
    currentH.current += (height - currentH.current) * (1 - Math.exp(-d * 6));
    if (group.current) group.current.position.y = currentH.current;
  });

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#e8e4dc", "#2a2622", 0.6]} />
      <directionalLight
        castShadow
        position={[2.4, 3.6, 2.6]}
        intensity={3.6}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
      />
      <directionalLight position={[-2.2, 2.4, 1.4]} intensity={0.55} />
      <directionalLight position={[0.2, 2.2, -3]} intensity={0.7} color="#c8d0dc" />

      <group ref={group} position={[0, DESK.sit, 0]}>
        {solo ? null : (
          <>
            <DeskTop />
            <DeskMat />
          </>
        )}
        <Slot id="desk-standing">
          {solo === "desk-standing" ? (
            <>
              <DeskTop />
              <DeskMat />
            </>
          ) : null}
        </Slot>
        <Slot id="mat-desk">{solo === "mat-desk" ? <DeskMat /> : null}</Slot>
        <Slot id="mon-left">
          <MonLeft />
        </Slot>
        <Slot id="mon-right">
          <MonRight />
        </Slot>
        <Slot id="kb-compact">
          <TrustKeyboard />
        </Slot>
        <Slot id="dgx-spark">
          <DgxSpark />
        </Slot>
        <Slot id="laptop-left">
          <SurfacePro />
        </Slot>
        <Slot id="riser-black">
          <StrixClosed />
        </Slot>
        <Slot id="phone-fold">
          <Fold7 />
        </Slot>
        <Slot id="stand-phone">
          {solo === "stand-phone" ? <Fold7 /> : null}
        </Slot>
        <Slot id="earbuds">
          <FreeBuds />
        </Slot>
        <Slot id="cable-white">
          <Cable />
        </Slot>
        <Slot id="kb-mech">
          <MechKeyboard />
        </Slot>
        <Slot id="laptop-right">
          <ZenbookDuo />
        </Slot>
        <Slot id="mouse-main">
          <Mouse />
        </Slot>
        <Slot id="hub-usbc">
          <HubBaseus />
        </Slot>
        <Slot id="glasses-case">
          <RayBanCase />
        </Slot>
        {solo ? null : <Stickies />}
      </group>

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={solo ? 0.7 : 0.55}
        scale={solo ? 3 : 6}
        blur={2.4}
        far={2.2}
        color="#000000"
      />
      <CameraRig selected={framed} posture={posture} />
    </>
  );
}

function CameraRig({
  selected,
  posture,
}: {
  selected: string | null;
  posture: "sit" | "stand";
}) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as unknown as
    | {
        target: { x: number; y: number; z: number };
        update: () => void;
      }
    | undefined;
  const animating = useRef(true);
  const lift = posture === "stand" ? DESK.stand - DESK.sit : 0;
  const focus = useMemo(() => {
    const f = FOCUS[selected ?? "desk"] ?? FRONT;
    return {
      cam: [f.cam[0], f.cam[1] + lift, f.cam[2]] as const,
      target: [f.target[0], f.target[1] + lift, f.target[2]] as const,
    };
  }, [selected, lift]);

  useEffect(() => {
    animating.current = true;
  }, [selected, posture]);

  useFrame((_, raw) => {
    if (!animating.current) return;
    const d = Math.min(raw, 0.1);
    const k = 1 - Math.exp(-d * 4);
    camera.position.x += (focus.cam[0] - camera.position.x) * k;
    camera.position.y += (focus.cam[1] - camera.position.y) * k;
    camera.position.z += (focus.cam[2] - camera.position.z) * k;
    if (controls?.target) {
      controls.target.x += (focus.target[0] - controls.target.x) * k;
      controls.target.y += (focus.target[1] - controls.target.y) * k;
      controls.target.z += (focus.target[2] - controls.target.z) * k;
      controls.update();
    }
    const dx = focus.cam[0] - camera.position.x;
    const dy = focus.cam[1] - camera.position.y;
    const dz = focus.cam[2] - camera.position.z;
    if (dx * dx + dy * dy + dz * dz < 0.0004) animating.current = false;
  });

  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={0.35}
      maxDistance={4.2}
      maxPolarAngle={1.42}
      minPolarAngle={0.18}
      target={[0, 1.02, -0.05]}
    />
  );
}
