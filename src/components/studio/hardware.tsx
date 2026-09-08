import { RoundedBox, useCursor } from "@react-three/drei";
import { useMemo, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useStudio } from "./studio-state";
import {
  keycaps,
  matPrint,
  screenDuoBot,
  screenDuoTop,
  screenHome,
  screenIde,
  screenMail,
  screenSurface,
} from "./screens";

function Pick({ id, children }: { id: string; children: ReactNode }) {
  const { selected, setSelected } = useStudio();
  const [hover, setHover] = useState(false);
  useCursor(hover);
  const on = selected === id;
  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(on ? null : id);
      }}
    >
      {children}
    </group>
  );
}

function SelectHint({ size, on }: { size: [number, number, number]; on: boolean }) {
  return (
    <mesh>
      <boxGeometry args={size} />
      <meshBasicMaterial
        color="#d4c4a8"
        wireframe
        transparent
        opacity={on ? 0.5 : 0}
        depthTest={false}
      />
    </mesh>
  );
}

export function DeskTop() {
  const { selected, setSelected } = useStudio();
  const on = selected === "desk-standing";
  return (
    <group>
      <mesh
        position={[0, -0.017, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          setSelected(on ? null : "desk-standing");
        }}
      >
        <boxGeometry args={[1.52, 0.034, 0.76]} />
        <meshStandardMaterial color="#3a3530" roughness={0.68} metalness={0.08} />
      </mesh>
      <mesh position={[0, -0.36, 0.02]} castShadow>
        <boxGeometry args={[0.12, 0.68, 0.08]} />
        <meshStandardMaterial color="#141312" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.7, 0.02]} receiveShadow>
        <boxGeometry args={[0.7, 0.04, 0.42]} />
        <meshStandardMaterial color="#1c1a18" roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[0.62, -0.01, 0.34]} castShadow>
        <boxGeometry args={[0.09, 0.012, 0.04]} />
        <meshStandardMaterial color="#2a2622" />
      </mesh>
    </group>
  );
}

export function DeskMat() {
  const tex = useMemo(() => matPrint(), []);
  return (
    <mesh position={[0, 0.002, 0.04]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[1.42, 0.62]} />
      <meshStandardMaterial map={tex} roughness={0.9} />
    </mesh>
  );
}

function Monitor({
  id,
  position,
  width,
  height,
  screen,
  yaw = 0,
}: {
  id: string;
  position: [number, number, number];
  width: number;
  height: number;
  screen: THREE.Texture;
  yaw?: number;
}) {
  const { selected } = useStudio();
  return (
    <Pick id={id}>
      <group position={position} rotation={[0, yaw, 0]}>
        <mesh castShadow>
          <boxGeometry args={[width + 0.016, height + 0.016, 0.018]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.35} metalness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
        <mesh position={[0, -height / 2 - 0.09, 0.02]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.18, 12]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.45} roughness={0.4} />
        </mesh>
        <mesh position={[0, -height / 2 - 0.18, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.012, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.5} />
        </mesh>
        <SelectHint size={[width + 0.04, height + 0.04, 0.08]} on={selected === id} />
      </group>
    </Pick>
  );
}

export function MonLeft() {
  const mail = useMemo(() => screenMail(), []);
  return (
    <Monitor
      id="mon-left"
      position={[-0.34, 0.34, -0.28]}
      width={0.82}
      height={0.34}
      screen={mail}
      yaw={0.12}
    />
  );
}

export function MonRight() {
  const ide = useMemo(() => screenIde(), []);
  return (
    <Monitor
      id="mon-right"
      position={[0.4, 0.38, -0.28]}
      width={0.7}
      height={0.4}
      screen={ide}
      yaw={-0.1}
    />
  );
}

export function TrustKeyboard() {
  const tex = useMemo(() => keycaps("#1a1a1a"), []);
  const { selected } = useStudio();
  return (
    <Pick id="kb-compact">
      <group position={[-0.28, 0.012, -0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.44, 0.018, 0.14]} />
          <meshStandardMaterial map={tex} roughness={0.55} />
        </mesh>
        <SelectHint size={[0.46, 0.03, 0.16]} on={selected === "kb-compact"} />
      </group>
    </Pick>
  );
}

export function MechKeyboard() {
  const tex = useMemo(() => keycaps("#111111", "#3a6b8a"), []);
  const { selected } = useStudio();
  return (
    <Pick id="kb-mech">
      <group position={[0.05, 0.018, 0.24]}>
        <mesh castShadow>
          <boxGeometry args={[0.44, 0.032, 0.13]} />
          <meshStandardMaterial map={tex} roughness={0.45} />
        </mesh>
        <SelectHint size={[0.46, 0.04, 0.15]} on={selected === "kb-mech"} />
      </group>
    </Pick>
  );
}

export function DgxSpark() {
  const { selected } = useStudio();
  return (
    <Pick id="dgx-spark">
      <group position={[-0.26, 0.028, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.05, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.35} roughness={0.4} />
        </mesh>
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[0, -0.018 + i * 0.006, 0.076]}>
            <boxGeometry args={[0.12, 0.0025, 0.002]} />
            <meshStandardMaterial color="#4a4a4a" metalness={0.5} roughness={0.35} />
          </mesh>
        ))}
        <SelectHint size={[0.16, 0.06, 0.16]} on={selected === "dgx-spark"} />
      </group>
    </Pick>
  );
}

function OledPanel({
  w,
  h,
  t = 0.0072,
  bezel = 0.007,
  map,
  color = "#121214",
  radius = 0.005,
}: {
  w: number;
  h: number;
  t?: number;
  bezel?: number;
  map: THREE.Texture;
  color?: string;
  radius?: number;
}) {
  return (
    <group>
      <RoundedBox args={[w, h, t]} radius={radius} smoothness={3} castShadow>
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.32} />
      </RoundedBox>
      <mesh position={[0, 0, t / 2 + 0.00035]}>
        <planeGeometry args={[w - bezel * 2, h - bezel * 2]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    </group>
  );
}

function KeyDeck({
  width,
  depth,
  trackpad = true,
  trackpadSize,
  thickness = 0.008,
  deck = "#2c2e32",
  keyColor = "#1a1c1e",
}: {
  width: number;
  depth: number;
  trackpad?: boolean;
  trackpadSize?: [number, number];
  thickness?: number;
  deck?: string;
  keyColor?: string;
}) {
  const padH = trackpadSize?.[1] ?? (trackpad ? depth * 0.36 : 0.01);
  const padW = trackpadSize?.[0] ?? width * 0.32;
  const cols = 14;
  const rows = 5;
  const gap = 0.0018;
  const mx = 0.008;
  const keyArea = depth - (trackpad ? padH + 0.016 : 0.01);
  const kw = (width - mx * 2 - gap * (cols - 1)) / cols;
  const kd = (keyArea - 0.01 - gap * (rows - 1)) / rows;
  const keyH = Math.max(0.0024, thickness * 0.45);
  const keys: ReactNode[] = [];
  const zBack = -depth / 2 + 0.008;
  const yKey = thickness / 2 + keyH / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === rows - 1 && c >= 4 && c <= 9) continue;
      const x = -width / 2 + mx + c * (kw + gap) + kw / 2;
      const z = zBack + r * (kd + gap) + kd / 2;
      keys.push(
        <mesh key={`${r}-${c}`} position={[x, yKey, z]} castShadow>
          <boxGeometry args={[kw, keyH, kd]} />
          <meshStandardMaterial color={keyColor} roughness={0.45} />
        </mesh>,
      );
    }
  }
  const spaceW = 6 * kw + 5 * gap;
  keys.push(
    <mesh key="space" position={[0, yKey, zBack + 4 * (kd + gap) + kd / 2]} castShadow>
      <boxGeometry args={[spaceW, keyH, kd]} />
      <meshStandardMaterial color={keyColor} roughness={0.45} />
    </mesh>,
  );

  return (
    <group>
      <RoundedBox args={[width, thickness, depth]} radius={0.004} smoothness={2} castShadow>
        <meshStandardMaterial color={deck} roughness={0.62} metalness={0.12} />
      </RoundedBox>
      {keys}
      {trackpad ? (
        <RoundedBox
          args={[padW, 0.0018, padH]}
          radius={0.004}
          smoothness={2}
          position={[0, thickness / 2 + 0.0006, depth / 2 - padH / 2 - 0.008]}
        >
          <meshStandardMaterial color="#3a3d42" roughness={0.35} metalness={0.2} />
        </RoundedBox>
      ) : null}
    </group>
  );
}

export function SurfacePro() {
  const doc = useMemo(() => screenSurface(), []);
  const { selected } = useStudio();
  const recline = THREE.MathUtils.degToRad(22);
  const W = 0.292;
  const H = 0.201;
  const T = 0.0085;
  return (
    <Pick id="laptop-left">
      <group position={[-0.5, 0.005, 0.17]} rotation={[0, 0.1, 0]}>
        <group position={[0, 0, 0.055]}>
          <KeyDeck width={W} depth={0.128} deck="#2a2c2e" keyColor="#141618" />
        </group>
        <mesh position={[0, 0.004, -0.022]} rotation={[-0.55, 0, 0]} castShadow>
          <boxGeometry args={[W - 0.004, 0.0022, 0.038]} />
          <meshStandardMaterial color="#1a1c1e" roughness={0.85} />
        </mesh>
        <group position={[0, 0.01, -0.042]} rotation={[-recline, 0, 0]}>
          <group position={[0, H / 2, 0]}>
            <OledPanel w={W} h={H} t={T} bezel={0.011} map={doc} color="#1a1c1e" radius={0.006} />
            <mesh position={[0, H / 2 - 0.01, T / 2 + 0.0005]}>
              <circleGeometry args={[0.0024, 16]} />
              <meshStandardMaterial color="#050505" />
            </mesh>
            <mesh position={[0.012, H / 2 - 0.01, T / 2 + 0.0005]}>
              <circleGeometry args={[0.0012, 12]} />
              <meshStandardMaterial color="#0a0a0a" />
            </mesh>
            <mesh position={[-0.012, H / 2 - 0.01, T / 2 + 0.0005]}>
              <circleGeometry args={[0.0012, 12]} />
              <meshStandardMaterial color="#0a0a0a" />
            </mesh>
          </group>
          <mesh position={[0, 0.055, -T / 2 - 0.001]} rotation={[1.15, 0, 0]} castShadow>
            <boxGeometry args={[0.155, 0.0014, 0.092]} />
            <meshStandardMaterial color="#c5c5c5" metalness={0.82} roughness={0.22} />
          </mesh>
        </group>
        <SelectHint size={[0.32, 0.24, 0.28]} on={selected === "laptop-left"} />
      </group>
    </Pick>
  );
}

export function StrixClosed() {
  const { selected } = useStudio();
  return (
    <Pick id="riser-black">
      <group position={[0.02, 0.012, 0.0]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.022, 0.28]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.35} metalness={0.25} />
        </mesh>
        <SelectHint size={[0.42, 0.03, 0.3]} on={selected === "riser-black"} />
      </group>
    </Pick>
  );
}

export function Fold7() {
  const home = useMemo(() => screenHome(), []);
  const { selected } = useStudio();
  return (
    <Pick id="phone-fold">
      <group position={[0.02, 0.09, 0.02]}>
        <mesh position={[0, 0.07, 0]} castShadow>
          <boxGeometry args={[0.158, 0.148, 0.006]} />
          <meshStandardMaterial color="#3a4148" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.07, 0.0034]}>
          <planeGeometry args={[0.148, 0.138]} />
          <meshBasicMaterial map={home} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.02, 0.01]} castShadow>
          <boxGeometry args={[0.07, 0.004, 0.07]} />
          <meshStandardMaterial color="#b8b8b8" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.03, 0.01]}>
          <boxGeometry args={[0.008, 0.08, 0.008]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.25} />
        </mesh>
        <SelectHint size={[0.18, 0.18, 0.08]} on={selected === "phone-fold"} />
      </group>
    </Pick>
  );
}

export function FreeBuds() {
  const { selected } = useStudio();
  return (
    <Pick id="earbuds">
      <group position={[0.16, 0.016, 0.05]}>
        <mesh rotation={[0.4, 0.3, 0.2]} castShadow>
          <capsuleGeometry args={[0.018, 0.03, 6, 12]} />
          <meshStandardMaterial color="#c62828" roughness={0.45} />
        </mesh>
        <SelectHint size={[0.06, 0.05, 0.06]} on={selected === "earbuds"} />
      </group>
    </Pick>
  );
}

export function ZenbookDuo() {
  const top = useMemo(() => screenDuoTop(), []);
  const bot = useMemo(() => screenDuoBot(), []);
  const { selected } = useStudio();
  const W = 0.313;
  const H = 0.196;
  const T = 0.0074;
  const bottomTilt = THREE.MathUtils.degToRad(10);
  const lid = THREE.MathUtils.degToRad(24);
  return (
    <Pick id="laptop-right">
      <group position={[0.48, 0.005, 0.04]} rotation={[0, -0.12, 0]}>
        <group position={[0, 0.004, -0.05]}>
          <mesh position={[0, 0.018, -H / 2 + 0.006]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.0052, 0.0052, W - 0.012, 16]} />
            <meshStandardMaterial color="#0c0c0e" metalness={0.55} roughness={0.3} />
          </mesh>
          <group position={[0, 0.006, 0]} rotation={[-Math.PI / 2 + bottomTilt, 0, 0]}>
            <OledPanel w={W} h={H} t={T} bezel={0.006} map={bot} color="#141416" radius={0.005} />
          </group>
          <group position={[0, 0.02, -H / 2 + 0.004]} rotation={[-lid, 0, 0]}>
            <group position={[0, H / 2, 0]}>
              <OledPanel w={W} h={H} t={T} bezel={0.006} map={top} color="#141416" radius={0.005} />
            </group>
          </group>
        </group>
        <group position={[0, 0, 0.195]}>
          <KeyDeck
            width={0.313}
            depth={0.209}
            thickness={0.0052}
            trackpadSize={[0.129, 0.074]}
            deck="#3a3c40"
            keyColor="#1c1e22"
          />
        </group>
        <SelectHint size={[0.34, 0.32, 0.56]} on={selected === "laptop-right"} />
      </group>
    </Pick>
  );
}

export function Mouse() {
  const { selected } = useStudio();
  return (
    <Pick id="mouse-main">
      <group position={[-0.08, 0.016, 0.3]}>
        <mesh rotation={[0.2, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.026, 0.048, 6, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        <SelectHint size={[0.07, 0.04, 0.1]} on={selected === "mouse-main"} />
      </group>
    </Pick>
  );
}

export function HubBaseus() {
  const { selected } = useStudio();
  return (
    <Pick id="hub-usbc">
      <group position={[-0.05, 0.01, -0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.016, 0.032]} />
          <meshStandardMaterial color="#6b6b6b" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.04, 0.01, 0]}>
          <boxGeometry args={[0.01, 0.006, 0.01]} />
          <meshBasicMaterial color="#1e6bff" />
        </mesh>
        <SelectHint size={[0.11, 0.03, 0.04]} on={selected === "hub-usbc"} />
      </group>
    </Pick>
  );
}

export function RayBanCase() {
  const { selected } = useStudio();
  return (
    <Pick id="glasses-case">
      <group position={[-0.42, 0.012, 0.08]}>
        <mesh rotation={[0, 0.4, 0]} castShadow>
          <capsuleGeometry args={[0.028, 0.1, 6, 12]} />
          <meshStandardMaterial color="#6b3f24" roughness={0.7} />
        </mesh>
        <SelectHint size={[0.14, 0.04, 0.08]} on={selected === "glasses-case"} />
      </group>
    </Pick>
  );
}

export function Stickies() {
  return (
    <mesh position={[-0.22, 0.006, 0.16]} castShadow>
      <boxGeometry args={[0.07, 0.008, 0.07]} />
      <meshStandardMaterial color="#e6d35a" roughness={0.85} />
    </mesh>
  );
}

export function Cable() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.02, 0.04, 0.05),
        new THREE.Vector3(0.08, 0.03, 0.12),
        new THREE.Vector3(0.12, 0.01, 0.22),
        new THREE.Vector3(0.18, 0.008, 0.3),
      ]),
    [],
  );
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 32, 0.003, 8, false), [curve]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#d8d8d8" roughness={0.5} />
    </mesh>
  );
}
