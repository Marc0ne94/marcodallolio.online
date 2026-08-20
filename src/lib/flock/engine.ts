import type { FlockParams } from "./params";

export type Boid = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: number;
  phase: number;
  facing: 1 | -1;
  flee: number;
  scale: number;
};

const KIND_COUNT = 6;
const PERCEPTION = 88;
const SEPARATION_DIST = 28;
const AVOID_RADIUS = 168;
const HASH_SIZE = 72;

function wrapDelta(d: number, size: number): number {
  if (d > size * 0.5) return d - size;
  if (d < -size * 0.5) return d + size;
  return d;
}

function wrap(v: number, size: number): number {
  if (v < 0) return v + size;
  if (v >= size) return v - size;
  return v;
}

function limit(x: number, y: number, max: number): [number, number] {
  const m2 = x * x + y * y;
  if (m2 > max * max && m2 > 1e-8) {
    const inv = max / Math.sqrt(m2);
    return [x * inv, y * inv];
  }
  return [x, y];
}

function hashKey(cx: number, cy: number): number {
  return ((cx + 4096) << 16) ^ (cy + 4096);
}

export class FlockEngine {
  boids: Boid[] = [];
  width = 1;
  height = 1;
  cursor: { x: number; y: number } | null = null;
  private cells = new Map<number, number[]>();
  private neighborBuf: number[] = [];

  resize(width: number, height: number) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    for (const b of this.boids) {
      b.x = wrap(b.x, this.width);
      b.y = wrap(b.y, this.height);
    }
  }

  setPopulation(n: number) {
    const target = Math.max(0, Math.round(n));
    while (this.boids.length < target) this.spawn();
    if (this.boids.length > target) this.boids.length = target;
  }

  spawn(at?: { x: number; y: number }) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 50;
    this.boids.push({
      x: at?.x ?? Math.random() * this.width,
      y: at?.y ?? Math.random() * this.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      kind: (Math.random() * KIND_COUNT) | 0,
      phase: Math.random() * Math.PI * 2,
      facing: Math.cos(angle) >= 0 ? 1 : -1,
      flee: 0,
      scale: 0.88 + Math.random() * 0.28,
    });
  }

  step(dt: number, params: FlockParams) {
    const t = Math.min(Math.max(dt, 0), 0.05);
    this.setPopulation(params.population);
    this.rebuildHash();

    const maxSpeed = 52 + params.speed * 58;
    const maxForce = 140 + params.speed * 70;
    const { width: w, height: h, cursor } = this;

    for (let i = 0; i < this.boids.length; i++) {
      const b = this.boids[i]!;
      let sepX = 0,
        sepY = 0,
        sepN = 0;
      let aliX = 0,
        aliY = 0,
        aliN = 0;
      let cohX = 0,
        cohY = 0,
        cohN = 0;

      this.queryNeighbors(b.x, b.y);
      const nearby = this.neighborBuf;
      for (let n = 0; n < nearby.length; n++) {
        const j = nearby[n]!;
        if (j === i) continue;
        const o = this.boids[j]!;
        const dx = wrapDelta(o.x - b.x, w);
        const dy = wrapDelta(o.y - b.y, h);
        const d2 = dx * dx + dy * dy;
        if (d2 > PERCEPTION * PERCEPTION || d2 < 1e-6) continue;
        const d = Math.sqrt(d2);

        if (d < SEPARATION_DIST) {
          const inv = 1 / d;
          sepX -= dx * inv * inv;
          sepY -= dy * inv * inv;
          sepN++;
        }
        aliX += o.vx;
        aliY += o.vy;
        aliN++;
        cohX += dx;
        cohY += dy;
        cohN++;
      }

      let ax = 0;
      let ay = 0;

      if (sepN > 0) {
        let [sx, sy] = limit(sepX / sepN, sepY / sepN, 1);
        sx *= maxSpeed;
        sy *= maxSpeed;
        let [fx, fy] = limit(sx - b.vx, sy - b.vy, maxForce);
        ax += fx * params.separation;
        ay += fy * params.separation;
      }
      if (aliN > 0) {
        let [lx, ly] = limit(aliX / aliN, aliY / aliN, maxSpeed);
        let [fx, fy] = limit(lx - b.vx, ly - b.vy, maxForce);
        ax += fx * params.alignment;
        ay += fy * params.alignment;
      }
      if (cohN > 0) {
        let [cx, cy] = limit(cohX / cohN, cohY / cohN, maxSpeed);
        let [fx, fy] = limit(cx - b.vx, cy - b.vy, maxForce);
        ax += fx * params.cohesion;
        ay += fy * params.cohesion;
      }

      let fleeing = 0;
      if (cursor) {
        const dx = wrapDelta(b.x - cursor.x, w);
        const dy = wrapDelta(b.y - cursor.y, h);
        const d2 = dx * dx + dy * dy;
        const r = AVOID_RADIUS;
        if (d2 < r * r && d2 > 1e-4) {
          const d = Math.sqrt(d2);
          const falloff = (1 - d / r) ** 2;
          fleeing = falloff;
          const inv = 1 / d;
          const desiredX = dx * inv * maxSpeed * (1.15 + falloff * 1.6);
          const desiredY = dy * inv * maxSpeed * (1.15 + falloff * 1.6);
          let [fx, fy] = limit(desiredX - b.vx, desiredY - b.vy, maxForce * 2.2);
          ax += fx * params.avoid * (0.65 + falloff);
          ay += fy * params.avoid * (0.65 + falloff);
        }
      }

      b.vx += ax * t;
      b.vy += ay * t;
      [b.vx, b.vy] = limit(b.vx, b.vy, maxSpeed * (1 + fleeing * 0.45));

      b.x = wrap(b.x + b.vx * t, w);
      b.y = wrap(b.y + b.vy * t, h);

      const spd = Math.hypot(b.vx, b.vy);
      b.phase += (0.9 + spd * 0.042) * t * 8.5;
      if (Math.abs(b.vx) > 8) b.facing = b.vx >= 0 ? 1 : -1;
      b.flee += (fleeing - b.flee) * Math.min(1, t * 10);
    }
  }

  private rebuildHash() {
    this.cells.clear();
    const size = HASH_SIZE;
    for (let i = 0; i < this.boids.length; i++) {
      const b = this.boids[i]!;
      const cx = Math.floor(b.x / size);
      const cy = Math.floor(b.y / size);
      const k = hashKey(cx, cy);
      let bucket = this.cells.get(k);
      if (!bucket) {
        bucket = [];
        this.cells.set(k, bucket);
      }
      bucket.push(i);
    }
  }

  private queryNeighbors(x: number, y: number) {
    const out = this.neighborBuf;
    out.length = 0;
    const size = HASH_SIZE;
    const maxCx = Math.max(1, Math.ceil(this.width / size));
    const maxCy = Math.max(1, Math.ceil(this.height / size));
    const cx = Math.floor(x / size);
    const cy = Math.floor(y / size);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        let ncx = cx + dx;
        let ncy = cy + dy;
        ncx = ((ncx % maxCx) + maxCx) % maxCx;
        ncy = ((ncy % maxCy) + maxCy) % maxCy;
        const bucket = this.cells.get(hashKey(ncx, ncy));
        if (!bucket) continue;
        for (let i = 0; i < bucket.length; i++) out.push(bucket[i]!);
      }
    }
  }
}
