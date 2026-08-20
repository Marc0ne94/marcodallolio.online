(function () {
  const SPRITE_SRCS = [
    "/sprites/boy-1.png",
    "/sprites/boy-2.png",
    "/sprites/boy-3.png",
    "/sprites/boy-4.png",
    "/sprites/boy-5.png",
    "/sprites/boy-6.png",
  ];
  const FALLBACK_SHIRTS = [
    "#2a3550",
    "#c45c3e",
    "#5a6b45",
    "#e8dcc8",
    "#2c2c30",
    "#a84a32",
  ];
  const DEFAULTS = {
    separation: 1.55,
    alignment: 1.05,
    cohesion: 0.92,
    avoid: 2.2,
    population: 96,
    speed: 2.55,
  };
  const META = [
    { key: "separation", label: "Separazione", hint: "Spazio personale", min: 0, max: 3, step: 0.05 },
    { key: "alignment", label: "Allineamento", hint: "Stessa direzione", min: 0, max: 3, step: 0.05 },
    { key: "cohesion", label: "Coesione", hint: "Restare insieme", min: 0, max: 3, step: 0.05 },
    { key: "avoid", label: "Evitamento", hint: "Fuga dal cursore", min: 0, max: 4, step: 0.05 },
    { key: "population", label: "Popolazione", hint: "Quanti ragazzi", min: 8, max: 220, step: 1 },
    { key: "speed", label: "Velocità", hint: "Passo dello stormo", min: 0.4, max: 5.5, step: 0.05 },
  ];

  const params = Object.assign({}, DEFAULTS);
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d", { alpha: false });
  const countEl = document.getElementById("count");
  const panel = document.getElementById("panel");
  const body = document.getElementById("body");
  const toggle = document.getElementById("toggle");

  const mq = window.matchMedia("(min-width: 768px)");
  function setOpen(v) {
    panel.classList.toggle("open", v);
    toggle.setAttribute("aria-expanded", String(v));
  }
  setOpen(mq.matches);
  mq.addEventListener("change", (e) => setOpen(e.matches));
  toggle.addEventListener("click", () => setOpen(!panel.classList.contains("open")));

  function fmt(key, n) {
    return key === "population" ? String(Math.round(n)) : Number(n).toFixed(2);
  }

  for (const m of META) {
    const lab = document.createElement("label");
    lab.innerHTML =
      '<span class="row"><span><b>' +
      m.label +
      "</b><small>" +
      m.hint +
      '</small></span><em data-k="' +
      m.key +
      '">' +
      fmt(m.key, params[m.key]) +
      "</em></span>";
    const inp = document.createElement("input");
    inp.type = "range";
    inp.min = m.min;
    inp.max = m.max;
    inp.step = m.step;
    inp.value = params[m.key];
    inp.setAttribute("aria-label", m.label);
    inp.addEventListener("input", () => {
      params[m.key] = m.key === "population" ? Math.round(+inp.value) : +inp.value;
      lab.querySelector("em").textContent = fmt(m.key, params[m.key]);
      if (m.key === "population") countEl.textContent = String(params.population);
    });
    lab.appendChild(inp);
    body.appendChild(lab);
  }
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "reset";
  reset.textContent = "Ripristina";
  reset.addEventListener("click", () => {
    Object.assign(params, DEFAULTS);
    body.querySelectorAll("input[type=range]").forEach((el, i) => {
      const m = META[i];
      el.value = params[m.key];
      body.querySelector('em[data-k="' + m.key + '"]').textContent = fmt(m.key, params[m.key]);
    });
    countEl.textContent = String(params.population);
  });
  body.appendChild(reset);

  const KIND_COUNT = 6;
  const PERCEPTION = 88;
  const SEPARATION_DIST = 28;
  const AVOID_RADIUS = 168;
  const HASH = 72;
  const boids = [];
  let w = 1,
    h = 1,
    dpr = 1;
  const pointer = { x: 0, y: 0, inside: false };
  const cells = new Map();
  const neighborBuf = [];
  const sprites = SPRITE_SRCS.map(() => null);
  let ground = null;
  let pulse = 0;

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(src));
      img.src = src;
    });
  }
  SPRITE_SRCS.forEach((src, i) => {
    loadImage(src)
      .then((img) => {
        sprites[i] = img;
      })
      .catch(() => {
        sprites[i] = null;
      });
  });
  loadImage("/ground.jpg")
    .then((img) => {
      ground = img;
    })
    .catch(() => {
      ground = null;
    });

  function wrapDelta(d, size) {
    if (d > size * 0.5) return d - size;
    if (d < -size * 0.5) return d + size;
    return d;
  }
  function wrap(v, size) {
    if (v < 0) return v + size;
    if (v >= size) return v - size;
    return v;
  }
  function limit(x, y, max) {
    const m2 = x * x + y * y;
    if (m2 > max * max && m2 > 1e-8) {
      const inv = max / Math.sqrt(m2);
      return [x * inv, y * inv];
    }
    return [x, y];
  }
  function hashKey(cx, cy) {
    return ((cx + 4096) << 16) ^ (cy + 4096);
  }

  function spawn(at) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 50;
    boids.push({
      x: at ? at.x : Math.random() * w,
      y: at ? at.y : Math.random() * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      kind: (Math.random() * KIND_COUNT) | 0,
      phase: Math.random() * Math.PI * 2,
      facing: Math.cos(angle) >= 0 ? 1 : -1,
      flee: 0,
      scale: 0.88 + Math.random() * 0.28,
    });
  }

  function setPop(n) {
    const t = Math.max(0, Math.round(n));
    while (boids.length < t) spawn();
    if (boids.length > t) boids.length = t;
  }

  function rebuild() {
    cells.clear();
    for (let i = 0; i < boids.length; i++) {
      const b = boids[i];
      const k = hashKey(Math.floor(b.x / HASH), Math.floor(b.y / HASH));
      let bucket = cells.get(k);
      if (!bucket) {
        bucket = [];
        cells.set(k, bucket);
      }
      bucket.push(i);
    }
  }

  function query(x, y) {
    neighborBuf.length = 0;
    const maxCx = Math.max(1, Math.ceil(w / HASH));
    const maxCy = Math.max(1, Math.ceil(h / HASH));
    const cx = Math.floor(x / HASH);
    const cy = Math.floor(y / HASH);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        let ncx = (((cx + dx) % maxCx) + maxCx) % maxCx;
        let ncy = (((cy + dy) % maxCy) + maxCy) % maxCy;
        const bucket = cells.get(hashKey(ncx, ncy));
        if (!bucket) continue;
        for (let i = 0; i < bucket.length; i++) neighborBuf.push(bucket[i]);
      }
    }
  }

  function step(dt) {
    const t = Math.min(Math.max(dt, 0), 0.05);
    setPop(params.population);
    rebuild();
    const maxSpeed = 52 + params.speed * 58;
    const maxForce = 140 + params.speed * 70;
    const cursor = pointer.inside ? pointer : null;

    for (let i = 0; i < boids.length; i++) {
      const b = boids[i];
      let sepX = 0,
        sepY = 0,
        sepN = 0;
      let aliX = 0,
        aliY = 0,
        aliN = 0;
      let cohX = 0,
        cohY = 0,
        cohN = 0;
      query(b.x, b.y);
      for (let n = 0; n < neighborBuf.length; n++) {
        const j = neighborBuf[n];
        if (j === i) continue;
        const o = boids[j];
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

      let ax = 0,
        ay = 0;
      if (sepN) {
        let [sx, sy] = limit(sepX / sepN, sepY / sepN, 1);
        sx *= maxSpeed;
        sy *= maxSpeed;
        let [fx, fy] = limit(sx - b.vx, sy - b.vy, maxForce);
        ax += fx * params.separation;
        ay += fy * params.separation;
      }
      if (aliN) {
        let [lx, ly] = limit(aliX / aliN, aliY / aliN, maxSpeed);
        let [fx, fy] = limit(lx - b.vx, ly - b.vy, maxForce);
        ax += fx * params.alignment;
        ay += fy * params.alignment;
      }
      if (cohN) {
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

  function drawGround() {
    if (ground && ground.complete && ground.naturalWidth > 0) {
      const iw = ground.naturalWidth;
      const ih = ground.naturalHeight;
      const scale = Math.max(w / iw, h / ih) * 1.04;
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(ground, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ctx.fillStyle = "rgba(232, 196, 148, 0.18)";
      ctx.fillRect(0, 0, w, h);
    } else {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#c4a07a");
      g.addColorStop(1, "#8a6248");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function drawBoy(img, kind, x, y, facing, phase, flee, scale) {
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
      const hh = tall;
      const ww = hh * aspect;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.shadowColor = "rgba(255, 236, 210, 0.35)";
      ctx.shadowBlur = 8;
      ctx.drawImage(img, -ww / 2, -hh + 4 + bob, ww, hh);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = FALLBACK_SHIRTS[kind] || "#2a3550";
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-7, -26 + bob, 14, 22, 4);
      else ctx.rect(-7, -26 + bob, 14, 22);
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
  }

  function drawWrappedBoy(img, kind, x, y, facing, phase, flee, scale) {
    const margin = 40;
    const offsetsX = [0];
    const offsetsY = [0];
    if (x < margin) offsetsX.push(w);
    if (x > w - margin) offsetsX.push(-w);
    if (y < margin) offsetsY.push(h);
    if (y > h - margin) offsetsY.push(-h);
    for (const ox of offsetsX) {
      for (const oy of offsetsY) {
        drawBoy(img, kind, x + ox, y + oy, facing, phase, flee, scale);
      }
    }
  }

  function drawCursor(dt) {
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
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    for (const b of boids) {
      b.x = wrap(b.x, w);
      b.y = wrap(b.y, h);
    }
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawGround();
    const order = boids.map((_, i) => i).sort((a, b) => boids[a].y - boids[b].y);
    for (let n = 0; n < order.length; n++) {
      const b = boids[order[n]];
      drawWrappedBoy(sprites[b.kind], b.kind, b.x, b.y, b.facing, b.phase, b.flee, b.scale);
    }
    const vignette = ctx.createRadialGradient(
      w * 0.5,
      h * 0.5,
      Math.min(w, h) * 0.25,
      w * 0.5,
      h * 0.5,
      Math.max(w, h) * 0.72,
    );
    vignette.addColorStop(0, "rgba(20,18,16,0)");
    vignette.addColorStop(1, "rgba(20,18,16,0.18)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    step(dt);
    draw();
    drawCursor(dt);
    requestAnimationFrame(frame);
  }

  function setPointer(clientX, clientY, inside) {
    pointer.x = clientX;
    pointer.y = clientY;
    pointer.inside = inside;
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => setPointer(e.clientX, e.clientY, true));
  window.addEventListener("pointerdown", (e) => setPointer(e.clientX, e.clientY, true));
  window.addEventListener("pointerleave", () => {
    pointer.inside = false;
  });
  window.addEventListener("blur", () => {
    pointer.inside = false;
  });

  resize();
  setPop(params.population);
  requestAnimationFrame(frame);
})();
