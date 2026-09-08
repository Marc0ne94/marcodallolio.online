"use client";

import { useEffect, useRef } from "react";
import { FlockEngine } from "@/lib/flock/engine";
import { useFlockStore } from "@/lib/flock/params";

const SPRITE_SRCS = [
  "/sprites/boy-1.png",
  "/sprites/boy-2.png",
  "/sprites/boy-3.png",
  "/sprites/boy-4.png",
  "/sprites/boy-5.png",
  "/sprites/boy-6.png",
] as const;

const FALLBACK_SHIRTS = [
  "#2a3550",
  "#c45c3e",
  "#5a6b45",
  "#e8dcc8",
  "#2c2c30",
  "#a84a32",
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(src));
    img.src = src;
  });
}

export function FlockStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const engine = new FlockEngine();
    const pointer = { x: 0, y: 0, inside: false };
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let pulse = 0;
    let disposed = false;

    const sprites: (HTMLImageElement | null)[] = SPRITE_SRCS.map(() => null);
    let ground: HTMLImageElement | null = null;

    void Promise.all(
      SPRITE_SRCS.map((src, i) =>
        loadImage(src)
          .then((img) => {
            sprites[i] = img;
          })
          .catch(() => {
            sprites[i] = null;
          }),
      ),
    );
    void loadImage("/ground.jpg")
      .then((img) => {
        ground = img;
      })
      .catch(() => {
        ground = null;
      });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      engine.resize(width, height);
    };

    const setPointerFromEvent = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
      pointer.inside =
        pointer.x >= 0 &&
        pointer.y >= 0 &&
        pointer.x <= rect.width &&
        pointer.y <= rect.height;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (document.elementFromPoint(e.clientX, e.clientY) !== canvas) {
        pointer.inside = false;
        return;
      }
      setPointerFromEvent(e.clientX, e.clientY);
    };
    const onPointerLeave = () => {
      pointer.inside = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      setPointerFromEvent(e.clientX, e.clientY);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    engine.setPopulation(useFlockStore.getState().population);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown, { passive: true });

    const drawGround = () => {
      if (ground && ground.complete && ground.naturalWidth > 0) {
        const iw = ground.naturalWidth;
        const ih = ground.naturalHeight;
        const scale = Math.max(width / iw, height / ih) * 1.04;
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.drawImage(ground, (width - dw) / 2, (height - dh) / 2, dw, dh);
        ctx.fillStyle = "rgba(232, 196, 148, 0.18)";
        ctx.fillRect(0, 0, width, height);
      } else {
        const g = ctx.createLinearGradient(0, 0, width, height);
        g.addColorStop(0, "#c4a07a");
        g.addColorStop(1, "#8a6248");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const drawCursor = (dt: number) => {
      if (!pointer.inside) return;
      pulse += dt;
      const r = 46 + Math.sin(pulse * 3.2) * 5;
      const x = pointer.x;
      const y = pointer.y;
      const glow = ctx.createRadialGradient(x, y, 4, x, y, 150);
      glow.addColorStop(0, "rgba(243,239,230,0.16)");
      glow.addColorStop(0.45, "rgba(243,239,230,0.05)");
      glow.addColorStop(1, "rgba(243,239,230,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 150, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(243,239,230,0.55)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(243,239,230,0.22)";
      ctx.fill();
    };

    const drawBoy = (
      img: HTMLImageElement | null,
      kind: number,
      x: number,
      y: number,
      facing: 1 | -1,
      phase: number,
      flee: number,
      scale: number,
    ) => {
      const bob = Math.sin(phase) * 2.1;
      const tall = (56 + flee * 6) * scale;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(facing, 1);

      ctx.fillStyle = "rgba(20,18,16,0.28)";
      ctx.beginPath();
      ctx.ellipse(0, 5, 11 * scale + flee * 4, 3.6 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      if (img && img.complete && img.naturalWidth > 0) {
        const aspect = img.naturalWidth / img.naturalHeight;
        const h = tall;
        const w = h * aspect;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.shadowColor = "rgba(255, 236, 210, 0.35)";
        ctx.shadowBlur = 8;
        ctx.drawImage(img, -w / 2, -h + 4 + bob, w, h);
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = FALLBACK_SHIRTS[kind] ?? "#2a3550";
        ctx.beginPath();
        ctx.roundRect(-7, -26 + bob, 14, 22, 4);
        ctx.fill();
        ctx.fillStyle = "#d7b398";
        ctx.beginPath();
        ctx.arc(0, -31 + bob, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2a241c";
        ctx.beginPath();
        ctx.ellipse(0, -34 + bob, 7.2, 4.2, 0, Math.PI, 0);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawWrappedBoy = (
      img: HTMLImageElement | null,
      kind: number,
      x: number,
      y: number,
      facing: 1 | -1,
      phase: number,
      flee: number,
      scale: number,
    ) => {
      const margin = 40;
      const offsetsX = [0];
      const offsetsY = [0];
      if (x < margin) offsetsX.push(width);
      if (x > width - margin) offsetsX.push(-width);
      if (y < margin) offsetsY.push(height);
      if (y > height - margin) offsetsY.push(-height);
      for (const ox of offsetsX) {
        for (const oy of offsetsY) {
          drawBoy(img, kind, x + ox, y + oy, facing, phase, flee, scale);
        }
      }
    };

    const tick = (now: number) => {
      if (disposed) return;
      const raw = (now - last) / 1000;
      last = now;
      const dt = Math.min(raw, 0.05);
      const params = useFlockStore.getState();
      engine.cursor = pointer.inside ? { x: pointer.x, y: pointer.y } : null;
      engine.step(dt, params);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawGround();

      const order = engine.boids
        .map((b, i) => i)
        .sort((a, b) => engine.boids[a]!.y - engine.boids[b]!.y);

      for (let n = 0; n < order.length; n++) {
        const b = engine.boids[order[n]!]!;
        const img = sprites[b.kind] ?? null;
        drawWrappedBoy(img, b.kind, b.x, b.y, b.facing, b.phase, b.flee, b.scale);
      }

      drawCursor(dt);

      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.25,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.72,
      );
      vignette.addColorStop(0, "rgba(20,18,16,0)");
      vignette.addColorStop(1, "rgba(20,18,16,0.18)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block h-full w-full cursor-none touch-none bg-bg"
      aria-label="Simulazione dello stormo di ragazzi"
    />
  );
}
