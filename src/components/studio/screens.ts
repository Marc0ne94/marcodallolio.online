import * as THREE from "three";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) throw new Error("2d");
  return { c, g };
}

function tex(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

function round(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
}

function winTaskbar(g: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const th = 44;
  g.fillStyle = color;
  g.fillRect(0, h - th, w, th);
  const icons = ["#d8dde6", "#6e9b7a", "#8f4e38", "#c4a574", "#5a7aa0", "#9c9488"];
  const start = w / 2 - icons.length * 22;
  icons.forEach((col, i) => {
    g.fillStyle = col;
    round(g, start + i * 44, h - 32, 18, 18, 4);
    g.fill();
  });
  g.fillStyle = "#8b93a3";
  g.font = "13px system-ui, sans-serif";
  g.fillText("14:17", w - 92, h - 18);
}

function windowFrame(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  paper: string,
  title: string,
) {
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.fillRect(x + 6, y + 8, w, h);
  g.fillStyle = paper;
  g.fillRect(x, y, w, h);
  g.fillStyle = "#ded8d0";
  g.fillRect(x, y, w, 36);
  g.fillStyle = "#6e675e";
  g.font = "16px system-ui, sans-serif";
  g.fillText(title, x + 16, y + 24);
  g.fillStyle = "#c45c48";
  g.beginPath();
  g.arc(x + w - 20, y + 18, 6, 0, Math.PI * 2);
  g.fill();
}

export function screenMail() {
  const { c, g } = canvas(1280, 540);
  g.fillStyle = "#1b1e24";
  g.fillRect(0, 0, 1280, 540);
  g.fillStyle = "#12141a";
  g.fillRect(0, 0, 280, 540);
  g.fillStyle = "#2a3140";
  g.fillRect(280, 0, 420, 540);
  for (let i = 0; i < 8; i++) {
    g.fillStyle = i === 2 ? "#3a4558" : "#222833";
    g.fillRect(300, 24 + i * 62, 380, 48);
  }
  g.fillStyle = "#d8dde6";
  g.fillRect(740, 40, 480, 16);
  g.fillStyle = "#8b93a3";
  g.fillRect(740, 72, 420, 10);
  g.fillRect(740, 100, 500, 10);
  g.fillRect(740, 128, 360, 10);
  return tex(c);
}

export function screenIde() {
  const { c, g } = canvas(1024, 576);
  g.fillStyle = "#1a1b1e";
  g.fillRect(0, 0, 1024, 576);
  g.fillStyle = "#121316";
  g.fillRect(0, 0, 220, 576);
  g.fillStyle = "#0e0f12";
  g.fillRect(0, 0, 48, 576);
  const rows = [
    "#7d9a78",
    "#9c9488",
    "#c4a574",
    "#8f4e38",
    "#d8dde6",
    "#7d9a78",
    "#6e675e",
  ];
  for (let i = 0; i < 22; i++) {
    g.fillStyle = rows[i % rows.length]!;
    const w = 280 + ((i * 47) % 320);
    g.fillRect(250, 28 + i * 24, w, 8);
  }
  return tex(c);
}

export function screenDoc() {
  return screenSurface();
}

export function screenSurface() {
  const W = 1368;
  const H = 912;
  const { c, g } = canvas(W, H);
  g.fillStyle = "#d8d2c8";
  g.fillRect(0, 0, W, H);

  round(g, 28, 18, W - 56, H - 78, 10);
  g.fillStyle = "#f4f0ea";
  g.fill();

  g.fillStyle = "#ebe6de";
  g.fillRect(28, 18, W - 56, 44);
  g.fillStyle = "#8a847c";
  g.font = "22px system-ui, sans-serif";
  g.fillText("Document", 48, 48);

  g.fillStyle = "#1c1916";
  g.font = "600 36px Georgia, serif";
  g.fillText("Untitled", 88, 140);
  g.fillStyle = "#4a453e";
  g.font = "22px Georgia, serif";
  for (let i = 0; i < 8; i++) {
    g.fillRect(88, 190 + i * 36, 720 - (i % 4) * 80, 12);
  }
  g.fillStyle = "#c8c0b4";
  g.fillRect(110, 500, 476, 200);

  winTaskbar(g, W, H, "#1f1f22");
  return tex(c);
}

export function screenHome() {
  const { c, g } = canvas(1024, 1024);
  g.fillStyle = "#f4f1ec";
  g.fillRect(0, 0, 1024, 1024);
  g.fillStyle = "#1a1a1a";
  g.beginPath();
  g.arc(512, 48, 10, 0, Math.PI * 2);
  g.fill();
  const icons = ["#1c6b4a", "#2b5a8a", "#8f4e38", "#3a3a3a"];
  icons.forEach((col, i) => {
    g.fillStyle = col;
    const x = 280 + i * 130;
    g.fillRect(x, 860, 72, 72);
  });
  return tex(c);
}

export function screenDuoTop() {
  const W = 1600;
  const H = 1000;
  const { c, g } = canvas(W, H);
  g.fillStyle = "#3a4148";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#2e353c";
  g.fillRect(0, 0, W, 36);
  g.fillStyle = "#c8d0d6";
  g.font = "16px system-ui, sans-serif";
  g.fillText("Display 2", 18, 24);

  windowFrame(g, 70, 64, 1180, 820, "#f3eee6", "notes");
  g.fillStyle = "#1a1612";
  g.font = "28px Georgia, serif";
  g.fillText("Untitled", 110, 160);
  g.fillStyle = "#5a534c";
  for (let i = 0; i < 6; i++) g.fillRect(110, 210 + i * 34, 640 - (i % 3) * 80, 12);
  g.fillStyle = "#ddd6cc";
  g.fillRect(110, 430, 720, 320);

  winTaskbar(g, W, H, "#1a1d22");
  return tex(c);
}

export function screenDuoBot() {
  const W = 1600;
  const H = 1000;
  const { c, g } = canvas(W, H);
  g.fillStyle = "#1b1e24";
  g.fillRect(0, 0, W, H);

  windowFrame(g, 90, 50, 1420, 860, "#ece8e0", "editor");
  g.fillStyle = "#1a1b1e";
  g.fillRect(90, 86, 280, 824);
  g.fillStyle = "#8b93a3";
  g.font = "18px ui-monospace, monospace";
  ["src/", "  app/", "  scene", "  mesh", "lib/", "  gltf"].forEach((t, i) => {
    g.fillStyle = i === 2 ? "#d8dde6" : "#7a828e";
    g.fillText(t, 112, 130 + i * 32);
  });
  g.fillStyle = "#2a2622";
  g.font = "18px ui-monospace, monospace";
  const code = ["group()", "  mesh()", "  light()", "", "orbit", "frame"];
  code.forEach((t, i) => g.fillText(t, 410, 140 + i * 28));

  winTaskbar(g, W, H, "#12141a");
  return tex(c);
}

export function matPrint() {
  const { c, g } = canvas(2048, 1024);
  g.fillStyle = "#141210";
  g.fillRect(0, 0, 2048, 1024);
  g.strokeStyle = "#2c2824";
  g.lineWidth = 2;
  for (let x = 80; x < 2048; x += 160) {
    g.beginPath();
    g.moveTo(x, 40);
    g.lineTo(x, 984);
    g.stroke();
  }
  g.fillStyle = "#2a2622";
  g.font = "22px monospace";
  for (let i = 0; i < 6; i++) g.fillText("·", 100 + (i % 3) * 620, 80 + Math.floor(i / 3) * 420);
  return tex(c);
}

export function keycaps(color: string, lit?: string) {
  const { c, g } = canvas(1024, 320);
  g.fillStyle = color;
  g.fillRect(0, 0, 1024, 320);
  const cols = 15;
  const rows = 5;
  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < cols; k++) {
      g.fillStyle = lit && r === 0 ? lit : "#2a2a2a";
      g.fillRect(18 + k * 66, 16 + r * 60, 54, 46);
    }
  }
  return tex(c);
}
