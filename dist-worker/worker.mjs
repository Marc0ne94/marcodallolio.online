const HEADERS = {
  html: {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "public, max-age=60",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
  },
  json: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  },
};

const MEDIA_TYPES = {
  "app.js": "application/javascript; charset=utf-8",
  "ground.jpg": "image/jpeg",
  "sprites/boy-1.png": "image/png",
  "sprites/boy-2.png": "image/png",
  "sprites/boy-3.png": "image/png",
  "sprites/boy-4.png": "image/png",
  "sprites/boy-5.png": "image/png",
  "sprites/boy-6.png": "image/png",
};

function mediaHeaders(key) {
  return {
    "content-type": MEDIA_TYPES[key] || "application/octet-stream",
    "cache-control": "public, max-age=86400",
    "x-content-type-options": "nosniff",
  };
}

async function serveMedia(env, key) {
  if (!env || !env.MEDIA || !MEDIA_TYPES[key]) return null;
  const obj = await env.MEDIA.get(key);
  if (!obj) return null;
  return new Response(obj.body, { status: 200, headers: mediaHeaders(key) });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";

    if (path === "/health") {
      return new Response(
        JSON.stringify({
          ok: true,
          site: "online",
          worker: "marcodallolio-online",
          product: "stormo",
          assets: ["sprites", "ground"],
        }),
        { status: 200, headers: HEADERS.json },
      );
    }

    if (path === "/" || path === "/index.html") {
      return new Response(PAGE, { status: 200, headers: HEADERS.html });
    }

    const key = path.startsWith("/") ? path.slice(1) : path;
    const media = await serveMedia(env, key);
    if (media) return media;

    return new Response("Not Found", { status: 404 });
  },
};

const PAGE = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Stormo</title>
  <meta name="description" content="Stormo — simulazione di stormo. Separazione, allineamento, coesione." />
  <meta name="theme-color" content="#141210" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #141210;
      --surface: #1c1a17;
      --fg: #f3efe6;
      --muted: #a39c90;
      --subtle: #7a746a;
      --accent: #d4cdc2;
      --line: rgba(243, 239, 230, 0.12);
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0; height: 100%;
      background: var(--bg); color: var(--fg);
      font-family: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow: hidden;
    }
    canvas { display: block; width: 100%; height: 100%; cursor: none; touch-action: none; }
    .hud {
      position: fixed; inset: 0;
      display: flex; flex-direction: column; justify-content: space-between;
      pointer-events: none; padding: 16px 16px 16px;
      background: linear-gradient(to bottom, rgba(20,18,16,0.55), transparent 28%);
    }
    @media (min-width: 768px) {
      .hud { padding: 24px 24px 24px; }
    }
    header { max-width: 28rem; }
    .kicker {
      margin: 0 0 6px;
      font-size: 11px; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent);
    }
    h1 {
      margin: 0;
      font-family: "Newsreader", Georgia, serif;
      font-size: clamp(2.4rem, 7vw, 3.2rem);
      font-weight: 500; letter-spacing: -0.03em; line-height: 0.92;
    }
    .lede {
      margin: 10px 0 0; max-width: 22rem;
      font-size: 14px; line-height: 1.4; color: rgba(243,239,230,0.8);
    }
    .panel {
      pointer-events: auto;
      width: min(100%, 22rem);
      background: color-mix(in srgb, var(--surface) 88%, transparent);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: 0 0 0 1px rgba(243,239,230,0.08), 0 18px 40px -24px rgba(0,0,0,0.55);
    }
    .panel-h {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; min-height: 44px; padding: 10px 16px;
      background: none; border: 0; color: inherit; cursor: pointer; text-align: left;
    }
    .panel-h span.title {
      font-family: "Newsreader", Georgia, serif; font-size: 1.15rem;
    }
    .panel-h .meta { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; }
    .body { display: none; padding: 0 16px 14px; }
    .panel.open .body { display: grid; gap: 12px; }
    label { display: block; }
    .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 4px; }
    .row b { font-size: 13px; font-weight: 500; }
    .row small { display: block; color: var(--subtle); font-size: 11px; font-weight: 400; }
    .row em { font-style: normal; color: var(--accent); font-size: 13px; font-variant-numeric: tabular-nums; }
    input[type=range] { width: 100%; accent-color: var(--accent); height: 28px; }
    .reset {
      height: 44px; border: 0; border-radius: 10px; cursor: pointer;
      background: rgba(243,239,230,0.1); color: var(--fg);
      font: 500 13px/1 "IBM Plex Sans", system-ui, sans-serif;
    }
    .reset:hover { background: rgba(243,239,230,0.15); }
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }
  </style>
</head>
<body>
  <canvas id="c" aria-label="Simulazione dello stormo di ragazzi"></canvas>
  <div class="hud">
    <header>
      <p class="kicker">Simulazione</p>
      <h1>Stormo</h1>
      <p class="lede">Separazione, allineamento, coesione. Muovi il puntatore per disperdere i ragazzi.</p>
    </header>
    <aside class="panel" id="panel">
      <button class="panel-h" type="button" id="toggle" aria-expanded="false">
        <span class="title">Regole</span>
        <span class="meta" id="count">96</span>
      </button>
      <div class="body" id="body"></div>
    </aside>
  </div>
  <script src="/app.js"></script>
</body>
</html>
`;
