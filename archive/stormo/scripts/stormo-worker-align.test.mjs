import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

const APP = "dist-worker/app.js";
const WORKER = "dist-worker/worker.mjs";

test("published stormo loads the six boy sprites and ground", () => {
  assert.equal(existsSync(APP), true, "dist-worker/app.js must exist");
  const app = readFileSync(APP, "utf8");
  for (let i = 1; i <= 6; i++) {
    assert.match(app, new RegExp(`/sprites/boy-${i}\\.png`));
  }
  assert.match(app, /\/ground\.jpg/);
  assert.match(app, /function drawBoy/);
  assert.match(app, /function drawGround/);
});

test("published stormo uses the same flock defaults as the React app", () => {
  const app = readFileSync(APP, "utf8");
  assert.match(app, /separation:\s*1\.55/);
  assert.match(app, /alignment:\s*1\.05/);
  assert.match(app, /cohesion:\s*0\.92/);
  assert.match(app, /avoid:\s*2\.2/);
  assert.match(app, /population:\s*96/);
  assert.match(app, /speed:\s*2\.55/);
});

test("published stormo draws people, not chevrons", () => {
  const app = readFileSync(APP, "utf8");
  assert.match(app, /FALLBACK_SHIRTS/);
  assert.doesNotMatch(app, /moveTo\(s \* 1\.7/);
});

test("worker is a public product surface", () => {
  const worker = readFileSync(WORKER, "utf8");
  assert.match(worker, /\/app\.js/);
  assert.match(worker, /\/health/);
  assert.match(worker, /env\.MEDIA\.get/);
  assert.doesNotMatch(worker, /__put/);
  assert.doesNotMatch(worker, /TECH_GATE|tech_gate|commandPlane/);
  assert.doesNotMatch(worker, /CONTROL_PLANE|skill inventory/i);
});

test("asset files exist for the edge copy", () => {
  for (let i = 1; i <= 6; i++) {
    assert.equal(
      existsSync(`dist-worker/assets/sprites/boy-${i}.png`),
      true,
      `missing boy-${i}.png`,
    );
  }
  assert.equal(existsSync("dist-worker/assets/ground.jpg"), true);
  assert.equal(existsSync("dist-worker/assets/app.js"), true);
});
