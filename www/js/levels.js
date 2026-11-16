'use strict';
// =====================================================================
// Levels + tile physics
// =====================================================================
const SOLID = new Set(['#', 'X', 'B', '?', 'U', 'G', 'I']);
function grid(W, H) {
  const g = []; for (let y = 0; y < H; y++) g.push(new Array(W).fill('.'));
  const set = (x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = c; };
  const fill = (x0, x1, y0, y1, c) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, c); };
  return { g, set, fill };
}
function finishLevel(o, enemyList) {
  let total = 0; for (const row of o.g) for (const t of row) if (t === 'o' || t === '?') total++;
  o.total = total;
  o.enemies = enemyList.map(([tx, row]) => ({ x: tx * TS + 4, y: row * TS - 24, w: 32, h: 24, vx: -1, vy: 0, alive: true, active: false, flipped: false, deadT: 0, anim: Math.random() * 6 }));
  return o;
}
function buildLevel1() {
  const W = 170, H = 13, { g, set, fill } = grid(W, H);
  fill(0, W - 1, 11, 12, '#');
  [[27, 29], [54, 56], [96, 99], [126, 128]].forEach(([a, b]) => fill(a, b, 11, 12, '.'));
  fill(0, 0, 0, 10, 'X'); fill(W - 1, W - 1, 0, 10, 'X');
  fill(9, 11, 9, 9, 'o');
  set(14, 7, 'B'); set(15, 7, '?'); set(16, 7, 'B'); set(17, 7, '?'); set(18, 7, 'B');
  fill(23, 24, 9, 10, 'X'); fill(27, 29, 8, 8, 'o');
  fill(33, 37, 8, 8, 'B'); fill(33, 37, 7, 7, 'o');
  fill(42, 43, 8, 10, 'X');
  for (let i = 0; i < 4; i++) fill(49 + i, 49 + i, 10 - i, 10, 'X');
  fill(53, 53, 7, 10, 'X'); fill(54, 56, 5, 5, 'o');
  for (let i = 0; i < 4; i++) fill(57 + i, 57 + i, 7 + i, 10, 'X');
  fill(70, 73, 8, 8, 'B'); set(71, 8, '?'); fill(70, 73, 7, 7, 'o');
  fill(78, 80, 10, 10, '^'); fill(78, 80, 7, 7, 'o');
  fill(84, 85, 8, 10, 'X');
  fill(97, 98, 9, 9, 'X'); fill(96, 99, 7, 7, 'o');
  fill(102, 105, 7, 7, 'B'); fill(102, 105, 5, 5, 'o');
  set(112, 7, '?'); set(113, 7, 'B'); set(114, 7, '?'); fill(112, 114, 10, 10, 'o');
  fill(117, 118, 10, 10, '^');
  for (let i = 0; i < 8; i++) fill(135 + i, 135 + i, 10 - i, 10, 'X');
  fill(143, 143, 3, 10, 'X'); fill(145, 148, 9, 9, 'o');
  return finishLevel({ W, H, g, theme: 0, spawnX: 2 * TS, startX: 5 * TS, checkX: 62 * TS, finishX: 152 * TS, flies: [] },
    [[20, 11], [38, 11], [46, 11], [67, 11], [75, 11], [90, 11], [103, 7], [110, 11], [121, 11], [131, 11]]);
}
function buildLevel2() {
  const W = 162, H = 13, { g, set, fill } = grid(W, H);
  fill(0, W - 1, 11, 12, '#');
  [[18, 20], [40, 43], [66, 68], [88, 90]].forEach(([a, b]) => fill(a, b, 11, 12, '.'));
  fill(0, 0, 0, 10, 'X'); fill(W - 1, W - 1, 0, 10, 'X');
  fill(8, 10, 9, 9, 'o');
  set(13, 7, '?'); fill(14, 15, 7, 7, 'B'); set(16, 7, '?');
  fill(18, 20, 8, 8, 'o');
  fill(25, 26, 8, 10, 'X'); fill(25, 26, 6, 6, 'o');
  fill(30, 32, 10, 10, '^'); fill(30, 32, 7, 7, 'o');
  fill(35, 38, 8, 8, 'B'); fill(35, 38, 7, 7, 'o');
  fill(41, 42, 9, 9, 'X'); fill(40, 43, 7, 7, 'o');
  for (let i = 0; i < 3; i++) fill(48 + i, 48 + i, 10 - i, 10, 'X');
  fill(51, 52, 8, 10, 'X');
  fill(53, 56, 6, 6, 'B'); set(55, 6, '?'); fill(53, 56, 5, 5, 'o');
  fill(59, 61, 10, 10, '^');
  fill(66, 68, 8, 8, 'o');
  fill(72, 73, 9, 10, 'X'); fill(77, 78, 8, 10, 'X'); fill(82, 83, 7, 10, 'X');
  fill(74, 76, 10, 10, '^'); fill(79, 81, 10, 10, '^');
  set(73, 7, 'o'); set(78, 6, 'o'); set(83, 5, 'o');
  fill(88, 91, 8, 8, 'o');
  set(96, 7, '?'); set(97, 7, 'B'); set(98, 7, '?');
  fill(102, 103, 10, 10, '^'); fill(102, 103, 8, 8, 'o');
  // boss arena 120..143, exit gate at 144
  fill(124, 126, 8, 8, 'X'); fill(137, 139, 8, 8, 'X');
  fill(144, 144, 0, 10, 'G');
  fill(147, 149, 9, 9, 'o');
  const flies = Array.from({ length: 70 }, () => ({ x: Math.random() * W * TS, y: 120 + Math.random() * 270, p: Math.random() * 6 }));
  return finishLevel({ W, H, g, theme: 1, spawnX: 2 * TS, startX: 5 * TS, checkX: 108 * TS, finishX: 153 * TS, flies, boss: 'spider', arenaX0: 120 * TS, arenaX1: 144 * TS },
    [[12, 11], [23, 11], [34, 11], [46, 11], [54, 6], [64, 11], [86, 11], [95, 11], [106, 11], [114, 11]]);
}
function buildLevel3() {
  const W = 162, H = 13, { g, set, fill } = grid(W, H);
  fill(0, W - 1, 11, 12, '#');
  [[22, 24], [47, 49], [78, 80], [100, 103]].forEach(([a, b]) => fill(a, b, 11, 12, '.'));
  fill(0, 0, 0, 10, 'X'); fill(W - 1, W - 1, 0, 10, 'X');
  fill(8, 10, 9, 9, 'o');
  set(13, 7, '?'); set(14, 7, 'B'); set(15, 7, '?');
  fill(17, 21, 11, 11, 'I');                                   // slippery run-up to the first pit
  fill(22, 24, 8, 8, 'o');
  fill(29, 30, 9, 10, 'X'); fill(29, 30, 7, 7, 'o');
  fill(34, 37, 8, 8, 'I'); fill(34, 37, 7, 7, 'o');
  fill(40, 42, 10, 10, '^'); fill(40, 42, 7, 7, 'o');
  for (let i = 0; i < 3; i++) fill(44 + i, 44 + i, 10 - i, 10, 'X');
  fill(50, 51, 8, 10, 'X'); fill(47, 49, 6, 6, 'o');
  fill(53, 60, 11, 11, 'I');                                   // ice field
  fill(56, 59, 7, 7, 'B'); set(57, 7, '?');
  fill(64, 66, 9, 10, 'X'); fill(67, 69, 10, 10, '^'); fill(70, 72, 8, 10, 'X'); fill(73, 74, 10, 10, '^');
  set(65, 7, 'o'); set(71, 6, 'o'); fill(78, 80, 8, 8, 'o');
  fill(84, 87, 8, 8, 'I'); fill(84, 87, 7, 7, 'o');
  set(90, 7, '?'); set(91, 7, 'B'); set(92, 7, '?');
  fill(95, 96, 10, 10, '^'); fill(95, 96, 8, 8, 'o');
  fill(101, 102, 9, 9, 'X'); fill(100, 103, 7, 7, 'o');
  // boss arena 120..143, exit gate at 144
  fill(124, 126, 7, 7, 'X'); fill(137, 139, 7, 7, 'X');
  fill(144, 144, 0, 10, 'G');
  fill(147, 149, 9, 9, 'o');
  return finishLevel({ W, H, g, theme: 2, spawnX: 2 * TS, startX: 5 * TS, checkX: 110 * TS, finishX: 153 * TS, flies: [], boss: 'snowman', arenaX0: 120 * TS, arenaX1: 144 * TS },
    [[12, 11], [27, 11], [33, 11], [55, 11], [58, 11], [62, 11], [76, 11], [89, 11], [98, 11], [107, 11], [115, 11]]);
}
function buildLevel4() {      // forest
  const W = 162, H = 13, { g, set, fill } = grid(W, H);
  fill(0, W - 1, 11, 12, '#');
  [[16, 18], [37, 40], [62, 64], [84, 87], [104, 106]].forEach(([a, b]) => fill(a, b, 11, 12, '.'));
  fill(0, 0, 0, 10, 'X'); fill(W - 1, W - 1, 0, 10, 'X');
  fill(8, 10, 9, 9, 'o');
  set(12, 7, '?'); fill(13, 14, 7, 7, 'B'); set(15, 7, '?');
  fill(16, 18, 8, 8, 'o');
  fill(22, 23, 9, 10, 'X'); fill(22, 23, 7, 7, 'o');            // tree stump
  fill(27, 29, 10, 10, '^'); fill(27, 29, 7, 7, 'o');           // thorns
  fill(32, 35, 8, 8, 'B'); set(34, 8, '?'); fill(32, 35, 7, 7, 'o');
  fill(38, 39, 9, 9, 'X'); fill(37, 40, 7, 7, 'o');            // stepping stone over the wide pit
  for (let i = 0; i < 3; i++) fill(44 + i, 44 + i, 10 - i, 10, 'X');
  fill(47, 48, 8, 10, 'X');
  fill(50, 53, 6, 6, 'B'); set(52, 6, '?'); fill(50, 53, 5, 5, 'o');
  fill(56, 58, 10, 10, '^');
  fill(62, 64, 8, 8, 'o');
  fill(68, 69, 9, 10, 'X'); fill(70, 71, 10, 10, '^'); fill(72, 73, 8, 10, 'X'); fill(74, 75, 10, 10, '^'); fill(76, 77, 7, 10, 'X');
  set(68, 7, 'o'); set(72, 6, 'o'); set(76, 5, 'o');
  fill(85, 86, 9, 9, 'X'); fill(84, 87, 7, 7, 'o');
  set(92, 7, '?'); set(93, 7, 'B'); set(94, 7, '?');
  fill(98, 99, 10, 10, '^'); fill(98, 99, 8, 8, 'o');
  fill(104, 106, 8, 8, 'o');
  // boss arena 120..143, exit gate at 144
  fill(125, 127, 8, 8, 'X'); fill(136, 138, 8, 8, 'X');
  fill(144, 144, 0, 10, 'G');
  fill(147, 149, 9, 9, 'o');
  return finishLevel({ W, H, g, theme: 3, spawnX: 2 * TS, startX: 5 * TS, checkX: 108 * TS, finishX: 153 * TS, flies: [], boss: 'snake', arenaX0: 120 * TS, arenaX1: 144 * TS },
    [[11, 11], [25, 11], [34, 11], [51, 6], [60, 11], [80, 11], [90, 11], [96, 11], [110, 11], [115, 11]]);
}
function buildLevel5() {      // lava ('~' = lava: pits are filled with it, puddles kill like spikes)
  const W = 162, H = 13, { g, set, fill } = grid(W, H);
  fill(0, W - 1, 11, 12, '#');
  [[19, 21], [41, 43], [63, 66], [86, 88], [101, 103]].forEach(([a, b]) => fill(a, b, 11, 12, '~'));
  fill(0, 0, 0, 10, 'X'); fill(W - 1, W - 1, 0, 10, 'X');
  fill(8, 10, 9, 9, 'o');
  set(13, 7, '?'); set(14, 7, 'B'); set(15, 7, '?');
  fill(19, 21, 8, 8, 'o');
  fill(25, 26, 8, 10, 'X'); fill(25, 26, 6, 6, 'o');
  fill(30, 32, 10, 10, '^'); fill(30, 32, 7, 7, 'o');
  fill(35, 38, 8, 8, 'B'); set(36, 8, '?'); fill(35, 38, 7, 7, 'o');
  fill(41, 43, 7, 7, 'o');
  for (let i = 0; i < 4; i++) fill(47 + i, 47 + i, 10 - i, 10, 'X');
  fill(51, 51, 7, 10, 'X'); fill(52, 53, 5, 5, 'o');
  fill(55, 57, 10, 10, '^');
  fill(64, 65, 9, 9, 'X'); fill(63, 66, 7, 7, 'o');            // stepping stone over the wide lava pit
  fill(70, 71, 9, 10, 'X'); fill(72, 74, 10, 10, '~'); fill(75, 76, 8, 10, 'X');
  set(70, 7, 'o'); set(73, 7, 'o'); set(75, 6, 'o');
  fill(80, 83, 7, 7, 'B'); set(81, 7, '?'); fill(80, 83, 6, 6, 'o');
  fill(86, 88, 8, 8, 'o');
  set(92, 7, '?'); set(93, 7, 'B'); set(94, 7, '?');
  fill(97, 98, 10, 10, '^');
  fill(101, 103, 7, 7, 'o');
  // boss arena 120..143, exit gate at 144
  fill(124, 126, 7, 7, 'X'); fill(137, 139, 7, 7, 'X');
  fill(144, 144, 0, 10, 'G');
  fill(147, 149, 9, 9, 'o');
  return finishLevel({ W, H, g, theme: 4, spawnX: 2 * TS, startX: 5 * TS, checkX: 110 * TS, finishX: 153 * TS, flies: [], boss: 'ape', arenaX0: 120 * TS, arenaX1: 144 * TS },
    [[12, 11], [23, 11], [28, 11], [34, 11], [45, 11], [53, 11], [59, 11], [68, 11], [79, 11], [91, 11], [107, 11], [115, 11]]);
}
const LEVELS = [
  { key: 'l1', theme: 0, par: 60, build: buildLevel1 },
  { key: 'l2', theme: 1, par: 120, build: buildLevel2 },
  { key: 'l3', theme: 2, par: 130, build: buildLevel3 },
  { key: 'l4', theme: 3, par: 125, build: buildLevel4 },
  { key: 'l5', theme: 4, par: 135, build: buildLevel5 }
];
function tileAt(lv, tx, ty) { if (tx < 0 || tx >= lv.W) return 'X'; if (ty < 0 || ty >= lv.H) return '.'; return lv.g[ty][tx]; }
function isSolid(lv, tx, ty) { return SOLID.has(tileAt(lv, tx, ty)); }

function moveBody(b, lv, onHead) {
  const res = { hitX: false, landed: false };
  b.x += b.vx;
  const y0 = Math.floor(b.y / TS), y1 = Math.floor((b.y + b.h - 0.01) / TS);
  if (b.vx > 0) { const tx = Math.floor((b.x + b.w - 0.01) / TS); for (let ty = y0; ty <= y1; ty++) if (isSolid(lv, tx, ty)) { b.x = tx * TS - b.w; b.vx = 0; res.hitX = true; break; } }
  else if (b.vx < 0) { const tx = Math.floor(b.x / TS); for (let ty = y0; ty <= y1; ty++) if (isSolid(lv, tx, ty)) { b.x = (tx + 1) * TS; b.vx = 0; res.hitX = true; break; } }
  b.y += b.vy;
  const x0 = Math.floor(b.x / TS), x1 = Math.floor((b.x + b.w - 0.01) / TS);
  if (b.vy > 0) {
    const ty = Math.floor((b.y + b.h - 0.01) / TS);
    for (let tx = x0; tx <= x1; tx++) if (isSolid(lv, tx, ty)) { b.y = ty * TS - b.h; b.vy = 0; res.landed = true; break; }
  } else if (b.vy < 0) {
    const ty = Math.floor(b.y / TS); let best = null, bd = 1e9;
    for (let tx = x0; tx <= x1; tx++) if (isSolid(lv, tx, ty)) { const d = Math.abs((tx + 0.5) * TS - (b.x + b.w / 2)); if (d < bd) { bd = d; best = tx; } }
    if (best !== null) {
      const cx = b.x + b.w / 2;
      if (x0 !== x1 && bd > TS * 0.5 + b.w * 0.5 - 7) b.x += cx < (best + 0.5) * TS ? -(b.x + b.w - best * TS) : ((best + 1) * TS - b.x);
      else { b.y = (ty + 1) * TS; b.vy = 0; if (onHead) onHead(best, ty); }
    }
  }
  return res;
}
const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

