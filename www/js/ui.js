'use strict';
// =====================================================================
// UI: drawing helpers, world rendering, HUD, menus, touch overlay, loop
// =====================================================================
function el(x, y, rx, ry, col) { if (col) X.fillStyle = col; X.beginPath(); X.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); X.fill(); }
function pbox(x, y, w, h, col) { X.fillStyle = col; X.fillRect(x + 4, y, w - 8, h); X.fillRect(x, y + 4, w, h - 8); X.fillRect(x + 2, y + 2, w - 4, h - 4); }
function pline(x0, y0, x1, y1, col, t = 2) {
  X.fillStyle = col;
  let ax = Math.round(x0 / PX), ay = Math.round(y0 / PX); const bx = Math.round(x1 / PX), by = Math.round(y1 / PX);
  const dx = Math.abs(bx - ax), dy = -Math.abs(by - ay), sx = ax < bx ? 1 : -1, sy = ay < by ? 1 : -1; let err = dx + dy;
  for (let n = 0; n < 400; n++) {
    X.fillRect(ax * PX, ay * PX, PX * t, PX * t);
    if (ax === bx && ay === by) break;
    const e2 = 2 * err; if (e2 >= dy) { err += dy; ax += sx; } if (e2 <= dx) { err += dx; ay += sy; }
  }
}
// text is queued and drawn after the pixel scene has been scaled up
let TQ = [];
function txt(s, x, y, size = 16, col = '#fff', align = 'left', shadow = true, maxW = 0) {
  if (maxW) while (size > 6 && textWidth(s, size) > maxW) size -= 1;
  TQ.push(() => drawText(s, x, y, size, col, align, shadow));
}
function title(s, y, size, col = '#ffd23a', maxW = VW - 40) {
  while (size > 10 && textWidth(s, size) > maxW) size -= 2;
  TQ.push(() => drawText(s, VW / 2, y, size, col, 'center', true, '#2a2140'));
}
function button(label, x, y, w, h, active, action, hover, size = 16) {
  const b = { x, y, w, h, action, hover }; buttons.push(b);
  const on = active || overBtn(b), dy = on ? 2 : 0;
  pbox(x, y + 6, w, h, '#1b1530'); pbox(x, y + dy, w, h, '#2a2140'); pbox(x + 4, y + dy + 4, w - 8, h - 8, on ? '#ffd23a' : '#fdf6e3');
  txt(label, x + w / 2, y + h / 2 + dy + 1, size, '#2a2140', 'center', false, w - 24);
}
function panel(x, y, w, h) { pbox(x, y + 8, w, h, '#1b1530'); pbox(x, y, w, h, '#2a2140'); pbox(x + 6, y + 6, w - 12, h - 12, '#3a2f5c'); }
function fmtTime(f) { return (f / 60).toFixed(2) + 's'; }

// ---------- backgrounds ----------
const CLOUDS = Array.from({ length: 14 }, (_, i) => ({ x: i * 420 + ((i * 137) % 200), y: 30 + ((i * 61) % 130), s: 2 + (i % 2) }));
const STARS = Array.from({ length: 80 }, (_, i) => ({ x: (i * 397) % 1240, y: 10 + ((i * 131) % 300), p: i * 1.7, b: i % 7 === 0 }));
const FLAKES = Array.from({ length: 90 }, (_, i) => ({ x: (i * 211) % 1240, y: (i * 97) % VH, v: 0.6 + (i % 5) * 0.25, dx: ((i % 3) - 1) * 0.3, s: i % 4 === 0 ? 2 : 1, p: i * 0.7 }));
function hills(cam, par, base, a1, a2, col) {
  X.fillStyle = col;
  for (let sx = 0; sx < VW; sx += PX * 2) { const w = sx + snap(cam * par); const top = snap(base - Math.sin(w * 0.005) * a1 - Math.sin(w * 0.013 + 1) * a2); X.fillRect(sx, top, PX * 2, VH - top); }
}
function snowPeaks(cam) {
  const snowLine = VH - 300;
  for (let sx = 0; sx < VW; sx += PX * 2) {
    const w = sx + snap(cam * 0.06);
    const m1 = ((w % 900) + 900) % 900, m2 = (((w + 310) % 530) + 530) % 530;
    const h = Math.max(330 - Math.abs(m1 - 450) * 0.75, 230 - Math.abs(m2 - 265) * 0.8, 80);
    const top = snap(VH - 110 - h);
    X.fillStyle = '#6b7fa8'; X.fillRect(sx, top, PX * 2, VH - top);
    X.fillStyle = '#5c6f99'; if (((w >> 2) % 9) < 2) X.fillRect(sx, top + 30, PX * 2, VH - top);
    if (top < snowLine) { X.fillStyle = '#ffffff'; X.fillRect(sx, top, PX * 2, snap(snowLine - top + ((w * 7) % 3) * 6)); }
  }
}
// forest: a row of round-canopy trees with parallax
function trees(cam, par, base, sp, canopy, trunk) {
  const off = ((snap(cam * par) % sp) + sp) % sp;
  for (let x = -off - sp; x < VW + sp; x += sp) {
    X.fillStyle = trunk; X.fillRect(snap(x + sp * 0.5 - 8), base - 40, 16, VH);
    el(x + sp * 0.5, base - 70, sp * 0.42, 52, canopy); el(x + sp * 0.28, base - 40, sp * 0.3, 34, canopy); el(x + sp * 0.72, base - 44, sp * 0.3, 36, canopy);
  }
}
// lava: distant volcanoes with glowing craters and lava streams
function volcanoes(cam) {
  for (let sx = 0; sx < VW; sx += PX * 2) {
    const w = sx + snap(cam * 0.06), m = ((w % 1100) + 1100) % 1100, d = Math.abs(m - 550);
    const h = Math.max(d < 40 ? 272 : 300 - d * 0.7, 70), top = snap(VH - 110 - h);
    X.fillStyle = '#3a1e22'; X.fillRect(sx, top, PX * 2, VH - top);
    if (d < 40) { X.fillStyle = '#ff9a1f'; X.fillRect(sx, top, PX * 2, 4); }
    if (d < 70 && ((w >> 3) % 4) === 0) { X.fillStyle = '#e94b5a'; X.fillRect(sx, top + 4, PX * 2, snap(60 + (d % 7) * 10)); }
  }
}
const SKY = [['#4aa8e0', '#62bdf0', '#8ad0f5', '#b2e2fa', '#d6f2ff'], ['#141826', '#1b1530', '#251e3f', '#2a2140', '#3a2f5c'],
  ['#7f9cc8', '#95b0d6', '#adc4e2', '#c6d8ee', '#dfeaf7'], ['#7fc8c0', '#95d4c8', '#addfcf', '#c6ead8', '#dff4e4'], ['#1c1014', '#2a141a', '#3d1a1e', '#5a2020', '#7a2a1e']];
function drawSky(cam, theme) {
  SKY[theme].forEach((c, i) => { X.fillStyle = c; X.fillRect(0, i * 70, VW, i === 4 ? VH : 70); });
  if (theme === 3) { trees(cam, 0.1, VH - 190, 180, '#9ccc9a', '#78b080'); trees(cam, 0.25, VH - 120, 240, '#4a7a55', '#2f5a3a'); return; }
  if (theme === 4) { volcanoes(cam); hills(cam, 0.2, VH - 150, 30, 12, '#2a1418'); hills(cam, 0.35, VH - 110, 32, 14, '#3a2226'); return; }
  if (theme === 1) {
    for (const s of STARS) if (Math.sin(T * 0.05 + s.p) > -0.4) { const x = ((s.x - cam * 0.03) % VW + VW) % VW; X.fillStyle = s.b ? '#ffffff' : '#fff0a8'; X.fillRect(snap(x), snap(s.y), PX * (s.b ? 2 : 1), PX * (s.b ? 2 : 1)); }
    el(VW - 130, 92, 34, 34, '#fff6c9'); el(VW - 144, 82, 6, 6, '#d9d9e0'); el(VW - 120, 104, 8, 8, '#d9d9e0'); el(VW - 116, 78, 4, 4, '#d9d9e0');
  } else if (theme === 0) { el(VW - 130, 92, 44, 44, '#fff0a8'); el(VW - 130, 92, 34, 34, '#fff6c9'); }
  if (theme === 2) snowPeaks(cam);
  const span = 14 * 420, cl = theme === 1 ? CLOUD_N : theme === 2 ? CLOUD_S : CLOUD;
  for (const c of CLOUDS) { const x = ((c.x - cam * 0.1 - T * 0.15) % span + span) % span - 200; if (x < VW + 100) drawSpr(cl, x + 40, c.y + 24, 1, c.s); }
  if (theme === 2) { hills(cam, 0.2, VH - 150, 30, 12, '#c6d8ee'); hills(cam, 0.35, VH - 110, 32, 14, '#e8f1fa'); }
  else { hills(cam, 0.15, VH - 170, 45, 18, theme === 1 ? '#1f2a44' : '#a3d7c6'); hills(cam, 0.35, VH - 110, 32, 14, theme === 1 ? '#2e3d5c' : '#78c48b'); }
}
// lava: embers drifting up; forest: falling leaves (both reuse the snow flakes)
function embers(cam) {
  for (const f of FLAKES) {
    const x = (((f.x + Math.sin(T * 0.03 + f.p) * 14 - cam * 0.25) % VW) + VW) % VW, y = VH - (f.y + T * f.v * 0.8) % VH;
    X.fillStyle = f.s > 1 ? '#ffd23a' : '#ff9a1f'; X.fillRect(snap(x), snap(y), PX * f.s, PX);
  }
}
function leaves(cam) {
  for (let i = 0; i < FLAKES.length; i += 3) {
    const f = FLAKES[i], x = (((f.x + Math.sin(T * 0.02 + f.p) * 30 - cam * 0.3) % VW) + VW) % VW, y = (f.y + T * f.v * 0.5) % VH;
    X.fillStyle = i % 2 ? '#ff9a1f' : '#4fc04c'; X.fillRect(snap(x), snap(y), PX * 2, PX); X.fillRect(snap(x) + PX, snap(y) + PX, PX * 2, PX);
  }
}
function snowfall(cam) {
  X.fillStyle = '#ffffff';
  for (const f of FLAKES) {
    const x = (((f.x + T * f.dx + Math.sin(T * 0.02 + f.p) * 12 - cam * 0.25) % VW) + VW) % VW, y = (f.y + T * f.v) % VH;
    X.fillRect(snap(x), snap(y), PX * f.s, PX * f.s);
  }
}

// ---------- tiles ----------
function bumpOff(tx, ty) { for (const b of G.bumps) if (b.tx === tx && b.ty === ty) return snap(-Math.sin(b.t / 10 * Math.PI) * 9); return 0; }
function drawTile(lv, tl, tx, ty) {
  const S = TILES[lv.theme], x = tx * TS, y = ty * TS + bumpOff(tx, ty);
  let img = null;
  if (tl === '#') img = S['g' + (SOLID.has(tileAt(lv, tx, ty - 1)) ? 0 : 1) + ((tx * 7 + ty * 3) % 3)];
  else if (tl === '?') img = S['Q' + (Math.floor(T / 30) % 2)];
  else if (tl === 'o') { drawSpr(COIN[COIN_SEQ[Math.floor(T * 0.12 + tx * 0.7) % 4]], x + 20, y + 31); return; }
  else if (tl === '~') { drawLava(x, y, tileAt(lv, tx, ty - 1) !== '~'); return; }
  else img = S[tl];
  if (img) X.drawImage(img, x, y, TS, TS);
}

function drawLava(x, y, top) {
  const s = top ? 12 : 0;
  X.fillStyle = '#e94b5a'; X.fillRect(x, y + s, TS, TS - s);
  if (!top) { X.fillStyle = '#ff9a1f'; X.fillRect(x + 8 + snap(Math.sin(T * 0.05 + x) * 6), y + 16, 6, 4); return; }
  for (let i = 0; i < TS; i += 4) {
    const wy = y + s + snap(Math.sin((x + i) * 0.12 + T * 0.08) * 3);
    X.fillStyle = '#ffd23a'; X.fillRect(x + i, wy, 4, 4); X.fillStyle = '#ff9a1f'; X.fillRect(x + i, wy + 4, 4, 6);
  }
}

// ---------- characters, enemies, bosses, projectiles ----------
// red landing marker on the ground: big for a boss jump, small for a falling projectile
function landMark(cx, big = true) {
  X.fillStyle = '#e94b5a';
  if (big) { X.fillRect(snap(cx - 40), 11 * TS - 6, 80, 4); X.fillRect(snap(cx - 28), 11 * TS - 10, 56, 4); }
  else X.fillRect(snap(cx - 16), 11 * TS - 6, 32, 4);
}
function heroFrame(p) { if (!p.onGround) return 'air'; if (Math.abs(p.vx) > 0.3) return Math.floor(p.anim) % 2 ? 'walk' : 'stand'; return 'stand'; }
function drawHero(id, cx, bottom, face, frame = 'stand', sc = 1) { drawSpr(HERO[id][frame], cx, bottom, face, sc); }
function drawPan(cx, bottom, face, swingT, sc = 1) {
  const hx = cx + face * 8 * sc, hy = bottom - 16 * sc;
  const ang = swingT > 0 ? -2.3 + (1 - swingT / 18) * 3.6 : -1.1;
  X.save(); X.translate(snap(hx), snap(hy)); X.scale(face, 1); X.rotate(ang);
  X.drawImage(PAN.r, -2, -5 * sc, PAN.w * PX * sc, PAN.h * PX * sc); X.restore();
  if (swingT >= 5 && swingT <= 14) for (const [rad, col] of [[52, '#ffffff'], [40, '#d6f2ff']]) { X.fillStyle = col; for (let a = -1.8; a <= ang; a += 0.16) X.fillRect(snap(hx + face * Math.cos(a) * rad * sc), snap(hy + Math.sin(a) * rad * sc), 4, 4); }
}
function drawBeetle(e, theme) {
  const cx = e.x + e.w / 2, by = e.y + e.h, d = e.vx >= 0 ? 1 : -1;
  const [walk, flat] = theme === 2 ? [BEETLE_FROST, BEETLE_FROST_FLAT] : theme === 4 ? [BEETLE_LAVA, BEETLE_LAVA_FLAT] : [BEETLE, BEETLE_FLAT];
  if (!e.alive && !e.flipped) { drawSpr(flat, cx, by, d); return; }
  if (e.flipped) { X.save(); X.translate(snap(cx), snap(by - e.h / 2)); X.scale(1, -1); X.translate(-snap(cx), -snap(by - e.h / 2)); }
  drawSpr(walk[Math.floor(e.anim) % 2], cx, by, d);
  if (e.flipped) X.restore();
}
function drawSpider(B) {
  const cx = B.x + B.w / 2, flash = (B.inv > 0 && Math.floor(B.inv / 3) % 2 === 0) || (B.state === 'charge' && B.t % 6 < 3);
  if ((B.state === 'warn' && Math.floor(B.t / 4) % 2) || B.state === 'drop') landMark(cx);
  if (B.state !== 'ground' && B.state !== 'dead') { X.fillStyle = '#d9d9e0'; X.fillRect(snap(cx), 0, PX, snap(B.y + 4)); }
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const ph = Math.sin(B.anim + i * 1.3 + (s > 0 ? 0 : 1.5)) * 5;
    const ax = cx + s * 10, ay = B.y + 8 + i * 4, kx = cx + s * (30 + i * 5), ky = B.y - 8 + i * 6 + ph;
    const onG = B.state === 'ground' || B.state === 'drop';
    const fx = cx + s * (38 + i * 5), fy = onG ? B.y + B.h : B.y + B.h + 4 + i * 3 - ph;
    const col = flash ? '#ffffff' : '#8f86b8';
    pline(ax, ay, kx, ky, col); pline(kx, ky, fx, fy, col);
  }
  drawSpr(SPIDER, cx, B.y + B.h, 1, 1, flash);
}
function drawSnowman(B) {
  const cx = B.x + B.w / 2, bottom = B.y + B.h, w = SNOWMAN.w * PX, flash = B.inv > 0 && Math.floor(B.inv / 3) % 2 === 0;
  if (B.state === 'dead') {
    const k = Math.max(0.05, 1 - B.t / 100), h = snap(SNOWMAN.h * PX * k);
    X.fillStyle = '#b2e2fa'; X.fillRect(snap(cx - 30 - 30 * (1 - k)), bottom - 4, snap(60 + 60 * (1 - k)), 4);
    X.drawImage(SNOWMAN.r, snap(cx - w / 2), bottom - h, w, h); return;
  }
  if ((B.state === 'crouch' && Math.floor(B.t / 4) % 2) || B.state === 'air') landMark(B.landX);
  const armY = B.y + 46;
  for (const s of [-1, 1]) {
    const up = s === B.face && B.throwT > 0 ? -30 : B.state === 'crouch' ? 8 : Math.round(Math.sin(B.anim + s) * 3);
    const sx = cx + s * 22, ex = cx + s * 50, ey = armY - 8 + up;
    pline(sx, armY, ex, ey, '#6b4423'); pline(ex, ey, ex + s * 8, ey - 8, '#6b4423', 1); pline(ex, ey, ex + s * 10, ey + 2, '#6b4423', 1);
  }
  const h = snap(SNOWMAN.h * PX * (B.state === 'crouch' ? 0.86 : 1));
  X.drawImage(flash ? SNOWMAN.f : SNOWMAN.r, snap(cx - w / 2), bottom - h, w, h);
  if (B.state === 'stunned') for (let i = 0; i < 3; i++) { const a = T * 0.12 + i * 2.1; X.fillStyle = '#ffd23a'; X.fillRect(snap(cx + Math.cos(a) * 26), snap(B.y - 14 + Math.sin(a) * 6), 6, 6); }
}
function drawSnake(B) {
  const cx = B.x + B.w / 2, f = B.face, flash = B.inv > 0 && Math.floor(B.inv / 3) % 2 === 0;
  // body: neck from the head down to the ground, then the tail wiggling along the floor (away from the face)
  const hx = cx - f * 16, hy = B.y + B.h - 6, gy = 11 * TS - 12, pts = [];
  for (let i = 0; i <= 8; i++) { const k = i / 8; pts.push([hx - f * 44 * k, hy + (gy - hy) * k * k, 15]); }
  for (let i = 1; i <= 14; i++) pts.push([hx - f * (44 + i * 11), gy + Math.sin(i * 0.8 + B.anim) * 3, 14 - i * 0.6]);
  for (const [x, y, r] of pts) el(x, y, r + 2, r + 2, flash ? '#ffffff' : '#1f4a2a');
  pts.forEach(([x, y, r], i) => el(x, y, r, r, flash ? '#ffffff' : i % 3 ? '#3fa34a' : '#2f7a35'));
  drawSpr(SNAKE_HEAD, cx, B.y + B.h, f, 2, flash);
  if (B.state === 'rest') for (let i = 0; i < 3; i++) { const a = T * 0.12 + i * 2.1; X.fillStyle = '#ffd23a'; X.fillRect(snap(cx + Math.cos(a) * 26), snap(B.y - 10 + Math.sin(a) * 6), 6, 6); }
}
function drawApe(B) {
  const cx = B.x + B.w / 2, bottom = B.y + B.h, w = APE.w * PX, flash = B.inv > 0 && Math.floor(B.inv / 3) % 2 === 0;
  if ((B.state === 'crouch' && Math.floor(B.t / 4) % 2) || B.state === 'air') landMark(B.landX);
  if (B.state === 'dead') {
    const k = Math.max(0.1, 1 - B.t / 110), h = snap(APE.h * PX * k);
    X.drawImage(APE.r, snap(cx - w / 2), bottom - h, w, h); return;
  }
  const sq = B.state === 'crouch' ? 0.84 : B.state === 'air' ? 1.08 : 1, h = snap(APE.h * PX * sq);
  const shake = B.state === 'intro' || B.state === 'tired' ? (Math.floor(B.t / 4) % 2 ? 2 : -2) : 0;
  X.drawImage(flash ? APE.f : APE.r, snap(cx - w / 2 + shake), bottom - h, w, h);
  if (B.phase2 && !flash) { X.fillStyle = '#ff9a1f'; for (let i = 0; i < 3; i++) X.fillRect(snap(cx - 20 + i * 18), snap(B.y - 6 - ((T + i * 7) % 14)), 4, 4); }
  if (B.state === 'tired') for (let i = 0; i < 3; i++) { const a = T * 0.12 + i * 2.1; X.fillStyle = '#ffd23a'; X.fillRect(snap(cx + Math.cos(a) * 30), snap(B.y - 14 + Math.sin(a) * 6), 6, 6); }
}
function drawHazards() {
  for (const h of G.haz) {
    if (h.type === 'web') drawSpr(WEB, h.x + 6, h.y + 12);
    else if (h.type === 'snow') drawSpr(SNOWBALL, h.x + 6, h.y + 12);
    else if (h.type === 'venom') drawSpr(VENOM, h.x + h.w / 2, h.y + h.h, Math.sign(h.vx), 1.4);
    else if (h.type === 'bomb') { if (Math.floor(T / 5) % 2) landMark(h.landX, false); drawSpr(LAVABOMB, h.x + h.w / 2, h.y + h.h); }
    else if (h.warn > 0) {
      if (Math.floor(h.warn / 5) % 2) landMark(h.x + 6, false);
      drawSpr(ICICLE, h.x + 6, 18);
    } else drawSpr(ICICLE, h.x + 6, h.y + h.h);
  }
  for (const s of G.shots) drawSpr(SEED, s.x + 6, s.y + 9, Math.sign(s.vx));
}

// ---------- world markers ----------
function arch(x, label, check, col) {
  const gy = 11 * TS;
  X.fillStyle = '#5b4a3a'; X.fillRect(x - 64, gy - 170, 8, 170); X.fillRect(x + 56, gy - 170, 8, 170);
  X.fillStyle = '#ece3d0'; X.fillRect(x - 64, gy - 174, 8, 6); X.fillRect(x + 56, gy - 174, 8, 6);
  X.fillStyle = '#2a2140'; X.fillRect(x - 74, gy - 178, 148, 38);
  if (check) {
    for (let i = 0; i < 18; i++) for (let j = 0; j < 4; j++) { X.fillStyle = (i + j) % 2 ? '#ffffff' : '#1c1c24'; X.fillRect(x - 70 + i * 8, gy - 174 + j * 8, 8, 8); }
    X.fillStyle = '#e94b5a'; X.fillRect(x - 52, gy - 168, 104, 20);
  } else { X.fillStyle = col; X.fillRect(x - 70, gy - 174, 140, 30); }
  txt(label, x - CAMX, gy - 158 - CAMY, 12, '#fff', 'center', false, 96);
}
function groundLine(x) { const gy = 11 * TS; for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { X.fillStyle = (i + j) % 2 ? '#ffffff' : '#1c1c24'; X.fillRect(x - 12 + i * 6, gy + j * 6, 6, 6); } }
function drawCheckpoint(lv) {
  const x = lv.checkX + 20, gy = 11 * TS;
  X.fillStyle = '#d9d9e0'; X.fillRect(x, gy - 120, 4, 120); X.fillStyle = '#ffd23a'; X.fillRect(x - 2, gy - 126, 8, 8);
  const k = G.cp ? Math.min(1, G.cpT / 30) : 0, fy = snap(gy - 30 - k * 82), wave = Math.floor(T / 10) % 2 * 2;
  X.fillStyle = G.cp ? '#4fd16a' : '#8a8f9c';
  for (let r = 0; r < 11; r++) X.fillRect(x + 4, fy + r * 2, snap(34 - Math.abs(r - 5) * 6) + wave, 2);
}

// ---------- world ----------
function renderWorld() {
  const lv = G.lv, cam = snap(G.cam);
  drawSky(cam, lv.theme);
  const sh = G.shake > 0 ? G.shake * 0.6 : 0;
  CAMX = cam + snap((Math.random() - 0.5) * sh); CAMY = snap((Math.random() - 0.5) * sh);
  X.save(); X.translate(-CAMX, -CAMY);
  arch(lv.startX, t('archStart'), false, '#3fbf5a');
  arch(lv.finishX, t('archFinish'), true);
  drawCheckpoint(lv);
  if (lv.theme === 1) for (const f of lv.flies) {
    if (f.x < cam - 40 || f.x > cam + VW + 40 || Math.sin(T * 0.07 + f.p) < 0) continue;
    X.fillStyle = '#fff0a8'; X.fillRect(snap(f.x + Math.sin(T * 0.02 + f.p) * 20), snap(f.y + Math.cos(T * 0.03 + f.p) * 14), 4, 4);
  }
  const x0 = Math.max(0, Math.floor(cam / TS) - 1), x1 = Math.min(lv.W - 1, x0 + Math.ceil(VW / TS) + 2);
  for (let ty = 0; ty < lv.H; ty++) for (let tx = x0; tx <= x1; tx++) { const tl = lv.g[ty][tx]; if (tl !== '.') drawTile(lv, tl, tx, ty); }
  groundLine(lv.startX); groundLine(lv.finishX);
  for (const e of lv.enemies) if (e.x > cam - 60 && e.x < cam + VW + 60) drawBeetle(e, lv.theme);
  const B = G.boss;
  if (B && (B.state !== 'idle' || B.x < cam + VW + 80)) ({ spider: drawSpider, snowman: drawSnowman, snake: drawSnake, ape: drawApe })[B.type](B);
  drawHazards();
  const p = G.p, ch = CHARS[G.ci];
  if (!(p.inv > 0 && Math.floor(p.inv / 4) % 2) && !(p.dead && p.fell)) {
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    let rot = 0;
    if (p.dead) rot = Math.min(p.deadT, 18) / 18 * Math.PI;
    else if (p.pound && p.poundT < 10) rot = p.poundT / 10 * Math.PI * 2 * p.face;
    if (rot) { X.save(); X.translate(snap(cx), snap(cy)); X.rotate(rot); X.translate(-snap(cx), -snap(cy)); }
    if (p.rollT > 0 && !p.dead) {   // Cheemus curled into a rolling ball
      const r = BEAR_BALL.w * PX / 2, by = snap(p.y + p.h - r);
      X.save(); X.translate(snap(cx), by); X.rotate(p.rollA); X.drawImage(BEAR_BALL.r, -r, -r, r * 2, r * 2); X.restore();
    } else drawHero(ch.id, cx, p.y + p.h, p.face, p.dead ? 'air' : G.clear ? (Math.floor(G.clearT / 6) % 2 ? 'walk' : 'stand') : heroFrame(p));
    if (ch.special === 'swing' && !p.dead) drawPan(cx, p.y + p.h, p.face, p.swingT);
    if (ch.special === 'spit' && p.spitT > 0) { X.fillStyle = '#ffd23a'; X.fillRect(snap(cx + p.face * 12), snap(p.y + 12), 6, 4); }
    if (rot) X.restore();
    if (p.pound && p.poundT >= 10) { X.fillStyle = '#ffffff'; for (let i = 0; i < 3; i++) X.fillRect(snap(p.x + 4 + i * 10), snap(p.y - 20 - (i % 2) * 8), 2, 12); }
  }
  for (const q of G.parts) {
    const a = Math.max(0, q.life / q.max);
    if (q.type === 'puff') { const r = snap(q.size * (0.3 + a * 0.9)); X.fillStyle = q.col; X.fillRect(snap(q.x) - r, snap(q.y) - r, r * 2, r * 2); }
    else if (q.type === 'coin') drawSpr(COIN[COIN_SEQ[Math.floor(q.life / 3) % 4]], q.x, q.y + 11);
    else if (q.type === 'spark') { if (a > 0.15) { X.fillStyle = q.col; X.fillRect(snap(q.x) - 2, snap(q.y) - 2, 4, 4); } }
    else if (q.type === 'wind') { const len = snap(q.size * (0.3 + a * 0.7)); X.fillStyle = q.col; X.fillRect(snap(q.dir > 0 ? q.x - len : q.x), snap(q.y), len, PX); }
    else if (q.type === 'conf') { X.fillStyle = q.col; X.fillRect(snap(q.x), snap(q.y), Math.floor(q.life / 8) % 2 ? 8 : 4, 4); }
    else if (q.type === 'wave') { const hgt = snap(8 + 22 * a); X.fillStyle = '#fff0a8'; X.fillRect(snap(q.x), snap(q.y) - hgt, 6, hgt); X.fillStyle = '#ffffff'; X.fillRect(snap(q.x - q.vx * 0.6), snap(q.y) - snap(hgt * 0.6), 4, snap(hgt * 0.6)); }
    else { X.fillStyle = q.col; X.fillRect(snap(q.x - q.size / 2), snap(q.y - q.size / 2), q.size, q.size); X.fillStyle = '#7a3412'; X.fillRect(snap(q.x - q.size / 2), snap(q.y), q.size, 2); }
  }
  X.restore();
  if (lv.theme === 2) snowfall(cam); else if (lv.theme === 3) leaves(cam); else if (lv.theme === 4) embers(cam);
  drawHUD();
}
function drawHUD() {
  const ch = CHARS[G.ci], lv = G.lv;
  pbox(12, 10, 330, 44, '#2a2140');
  drawHero(ch.id, 44, 48, 1, 'stand', 1);
  drawSpr(COIN[0], 86, 43);
  txt(`${G.coins}/${lv.total}`, 100, 33, 14);
  txt(t('falls', G.deaths), 200, 33, 12, '#ffb3bd', 'left', true, 130);
  pbox(VW / 2 - 100, 10, 200, 44, '#2a2140');
  txt(G.started ? fmtTime(G.time) : '0.00s', VW / 2, 33, 16, G.clear ? '#7cf07a' : '#fff', 'center');
  const sc = G.result ? G.result.total : calcScore(lv, G.coins, G.time).total;
  pbox(VW - 250, 10, 238, 44, '#2a2140');
  txt(t('score', String(sc).padStart(5, '0')), VW - 131, 33, 13, '#ffd23a', 'center', true, 216);
  if (!G.started && Math.floor(T / 30) % 2 === 0) txt(t('crossStart'), VW / 2, 92, 14, '#fff', 'center');
  if (G.cp && G.cpT < 30) txt(t('checkpoint'), VW / 2, 92, 14, '#7cf07a', 'center');
  if (G.bossDown && !G.clear && Math.floor(T / 30) % 2 === 0 && G.p.x < lv.finishX - 200) txt(t('gateOpen'), VW / 2, 92, 14, '#7cf07a', 'center');
  if (G.clear && state === 'play') title(t('courseClear'), 150, 30);
  const B = G.boss;
  if (B && G.fight) {
    pbox(VW / 2 - 190, 64, 380, 30, '#2a2140');
    X.fillStyle = '#1b1530'; X.fillRect(VW / 2 - 50, 72, 228, 14);
    X.fillStyle = '#e94b5a'; X.fillRect(VW / 2 - 50, 72, snap(228 * Math.max(0, B.hp) / B.max), 14);
    txt(t('boss_' + B.type), VW / 2 - 178, 80, 10, '#c9bfff', 'left', false, 120);
  }
  if (G.banner && G.banner.t < 90) title(t(G.banner.key), 200, 34, G.banner.key.startsWith('ab_') ? '#ff9a1f' : '#e94b5a');
  if (ch.special && G.time < 360 && T % 60 < 50) txt(t(touchActive() ? 'hintSpecialTouch' : 'hintSpecialKeys', t('sp_' + ch.id)), VW / 2, touchActive() ? 120 : VH - 24, 11, '#ffffff', 'center');
}

// ---------- menus ----------
function menuBackdrop(withChars = true) {
  const cam = snap(T * 1.2);
  drawSky(cam, 0);
  const off = -(cam % TS);
  for (let i = 0; i < VW / TS + 2; i++) { X.drawImage(TILES[0]['g1' + (i % 3)], off + i * TS, 440, TS, TS); X.drawImage(TILES[0]['g0' + (i % 3)], off + i * TS, 480, TS, TS); }
  if (withChars) {
    const fr = Math.floor(T / 8) % 2 ? 'walk' : 'stand', c = VW / 2;
    drawHero('capy', c - 320, 440, 1, fr, 2);
    const oh = snap(Math.abs(Math.sin(T * 0.08)) * 36);
    drawHero('owl', c - 165, 440 - oh, 1, oh > 3 ? 'air' : fr, 2);
    drawHero('mole', c - 20, 440, 1, fr, 2);
    drawHero('coon', c + 125, 440, 1, fr, 2); drawPan(c + 125, 440, 1, T % 90 < 18 ? 18 - (T % 90) : 0, 2);
    drawHero('bear', c + 300, 440, 1, fr, 2);
  }
}
function hint(key) { txt(t(touchActive() ? 'hintTap' : key), VW / 2, 505, 10, '#fff', 'center'); }
function renderMenu() {
  menuBackdrop();
  title('CAPY DASH', 82 + Math.sin(T * 0.05) * 4, 54);
  txt(t('subtitle') + ' · v1.1', VW / 2, 134, 12, '#2a2140', 'center', false);
  MENU.forEach((m, i) => button(t(m.k), VW / 2 - 150, 160 + i * 56, 300, 44, sel === i, m.a, () => sel = i));
  if (showIosHint()) {
    buttons.push({ x: 40, y: 384, w: VW - 80, h: 40, action: () => { iosHintClosed = true; SFX.move(); } });
    pbox(40, 384, VW - 80, 40, '#ffd23a'); pbox(44, 388, VW - 88, 32, '#2a2140');
    txt(t('iosHint') + '  ×', VW / 2, 405, 11, '#ffd23a', 'center', false, VW - 120);
  }
  hint('hintKeys');
}
function renderSettings() {
  menuBackdrop(false);
  panel(VW / 2 - 330, 36, 660, 410);
  txt(t('settings'), VW / 2, 76, 22, '#ffd23a', 'center');
  SETTING_ROWS.forEach((r, i) => {
    const y = 108 + i * 62, on = sel === i;
    if (r.k === 'back') { button(t('back'), VW / 2 - 100, y + 6, 200, 44, on, () => cycleSetting(i, 1), () => sel = i); return; }
    buttons.push({ x: VW / 2 - 300, y, w: 600, h: 52, action: () => { sel = i; cycleSetting(i, 1); }, hover: () => sel = i });
    pbox(VW / 2 - 300, y, 600, 52, on ? '#ffd23a' : '#251e3f');
    pbox(VW / 2 - 296, y + 4, 592, 44, on ? '#4a3a7a' : '#2a2140');
    txt(t(r.k), VW / 2 - 276, y + 27, 14, '#c9bfff', 'left', true, 280);
    txt('◀ ' + r.val() + ' ▶', VW / 2 + 276, y + 27, 14, '#fff', 'right', true, 260);
  });
  hint('hintKeys');
}
function renderControls() {
  menuBackdrop(false);
  panel(VW / 2 - 340, 30, 680, 420);
  txt(t('controls'), VW / 2, 70, 22, '#ffd23a', 'center');
  const rows = touchActive()
    ? [['c_move', t('t_move')], ['c_jump', 'A'], ['c_special', 'B'], ['c_pause', '‖']]
    : [['c_move', '← →  /  A D'], ['c_jump', t('k_jump')], ['c_run', 'SHIFT / X'], ['c_special', t('k_special')], ['c_fred', t('k_fred')], ['c_pause', 'ESC / P'], ['c_mute', 'M']];
  rows.forEach(([a, b], i) => { txt(t(a), VW / 2 - 300, 116 + i * 36, 13, '#c9bfff', 'left', true, 250); txt(b, VW / 2 + 300, 116 + i * 36, 13, '#fff', 'right', true, 340); });
  txt(t('c_tip'), VW / 2, 392, 10, '#ffd23a', 'center', true, 620);
  button(t('back'), VW / 2 - 100, 462, 200, 46, true, () => go('menu'));
}
let notesCache = null;
function notesLines() {
  if (notesCache && notesCache.lang === SETTINGS.lang) return notesCache.lines;
  const lines = [];
  for (const n of NOTES[SETTINGS.lang]) {
    if (Array.isArray(n)) { if (lines.length) lines.push({ s: '', h: false }); lines.push({ s: n[1], h: true }); }
    else wrapText(n, 11, 560).forEach((s, i) => lines.push({ s: (i ? '  ' : '+ ') + s, h: false }));
  }
  notesCache = { lang: SETTINGS.lang, lines }; return lines;
}
const NOTES_VISIBLE = 11;
function renderNotes() {
  menuBackdrop(false);
  const lines = notesLines();
  notesScroll = Math.max(0, Math.min(lines.length - NOTES_VISIBLE, notesScroll));
  panel(VW / 2 - 360, 24, 720, 426);
  txt(t('notes'), VW / 2, 62, 20, '#ffd23a', 'center');
  for (let i = 0; i < NOTES_VISIBLE; i++) {
    const n = lines[notesScroll + i]; if (!n) break;
    txt(n.s, VW / 2 - 320, 104 + i * 30, n.h ? 14 : 11, n.h ? '#ffd23a' : '#fdf6e3', 'left', n.h);
  }
  const trackH = 320, th = trackH * Math.min(1, NOTES_VISIBLE / lines.length), ty = 96 + (trackH - th) * notesScroll / Math.max(1, lines.length - NOTES_VISIBLE);
  X.fillStyle = '#251e3f'; X.fillRect(VW / 2 + 330, 96, 8, trackH); X.fillStyle = '#ffd23a'; X.fillRect(VW / 2 + 330, snap(ty), 8, snap(th));
  button('▲', VW / 2 + 254, 100, 60, 50, false, () => notesScroll -= 3);
  button('▼', VW / 2 + 254, 372, 60, 50, false, () => notesScroll += 3);
  button(t('back'), VW / 2 - 100, 462, 200, 46, true, () => go('menu'));
}
function renderSelect() {
  menuBackdrop(false);
  title(t('chooseHero'), 48, 28);
  const w = 176, gap = 12, x0 = (VW - (w * CHARS.length + gap * (CHARS.length - 1))) / 2;
  CHARS.forEach((c, i) => {
    const on = charSel === i, x = x0 + i * (w + gap), y = 80 + (on ? -6 : 0), h = 348;
    buttons.push({ x, y, w, h, action: () => { if (charSel === i) go('levels'); else { charSel = i; SFX.move(); } }, hover: () => { if (charSel !== i) { charSel = i; SFX.move(); } } });
    pbox(x, y + 10, w, h, '#1b1530'); pbox(x - 4, y - 4, w + 8, h + 8, on ? '#ffd23a' : '#2a2140'); pbox(x, y, w, h, '#3a2f5c');
    X.fillStyle = on ? '#8ad0f5' : '#5c6f99'; X.fillRect(x + 12, y + 12, w - 24, 100);
    X.fillStyle = on ? '#4fc04c' : '#4a7a55'; X.fillRect(x + 12, y + 100, w - 24, 12);
    const fr = on ? (Math.floor(T / 8) % 2 ? 'walk' : 'stand') : 'stand';
    const hop = on && c.id === 'owl' ? snap(Math.abs(Math.sin(T * 0.1)) * 10) : 0;
    drawHero(c.id, x + w / 2, y + 102 - hop, 1, hop > 2 ? 'air' : fr, 2);
    if (c.id === 'coon') drawPan(x + w / 2, y + 102, 1, on && T % 70 < 18 ? 18 - (T % 70) : 0, 2);
    txt(t('h_' + c.id), x + w / 2, y + 132, 16, on ? '#ffd23a' : '#fff', 'center', true, w - 20);
    txt(t('tag_' + c.id), x + w / 2, y + 156, 10, '#c9bfff', 'center', false, w - 20);
    ['speed', 'jump', 'power'].forEach((n, k) => {
      txt(t(n), x + 12, y + 182 + k * 20, 9, '#fff', 'left', false, 58);
      for (let j = 0; j < 5; j++) { X.fillStyle = j < c.stats[k] ? '#ffd23a' : '#251e3f'; X.fillRect(x + 74 + j * 18, y + 176 + k * 20, 14, 12); }
    });
    pbox(x + 12, y + 238, w - 24, 40, '#251e3f');
    txt(t('special'), x + w / 2, y + 250, 8, '#8f86b8', 'center', false, w - 36);
    txt(t('sp_' + c.id), x + w / 2, y + 266, 10, '#7cf07a', 'center', false, w - 36);
    // high scores per level
    pbox(x + 12, y + 284, w - 24, 56, '#251e3f');
    txt(t('highscores'), x + w / 2, y + 296, 8, '#8f86b8', 'center', false, w - 36);
    const cw = (w - 24) / LEVELS.length;
    LEVELS.forEach((_, li) => {
      const b = loadBest(li, c.id), cx = x + 12 + cw * (li + 0.5);
      txt(String(li + 1), cx, y + 312, 8, '#c9bfff', 'center', false);
      txt(b ? String(b.score) : '-', cx, y + 328, 9, b ? '#ffd23a' : '#5c6f99', 'center', false, cw - 2);
    });
  });
  button(t('next'), VW / 2 - 110, 448, 220, 44, true, () => go('levels'));
  if (!touchActive()) txt(t('hintSelect'), VW / 2, 508, 9, '#fff', 'center');
  else button(t('back'), 16, 450, 130, 44, false, () => go('menu'), null, 14);
}
function levelPreview(i, px0, py0, pw, ph) {
  const theme = LEVELS[i].theme;
  X.fillStyle = ['#62bdf0', '#1b1530', '#adc4e2', '#95d4c8', '#3d1a1e'][theme]; X.fillRect(px0, py0, pw, ph);
  if (theme === 1) { for (let s = 0; s < 14; s++) { X.fillStyle = '#fff0a8'; X.fillRect(px0 + 10 + (s * 53) % (pw - 20), py0 + 8 + (s * 31) % 60, 2, 2); } el(px0 + pw - 40, py0 + 30, 14, 14, '#fff6c9'); }
  else if (theme === 0) { el(px0 + pw - 40, py0 + 30, 16, 16, '#fff6c9'); drawSpr(CLOUD, px0 + 80, py0 + 40, 1, 2); }
  else if (theme === 3) { for (let k = 0; k < 4; k++) { X.fillStyle = '#2f5a3a'; X.fillRect(px0 + 14 + k * 40, py0 + 40, 10, ph - 70); el(px0 + 19 + k * 40, py0 + 36, 24, 22, '#4a7a55'); } }
  else if (theme === 4) {
    for (let sx = 0; sx < pw; sx += 4) { const d = Math.abs(sx - pw * 0.5), hgt = Math.max(0, (d < 14 ? 66 : 80 - d * 0.9)); if (hgt > 0) { X.fillStyle = '#3a1e22'; X.fillRect(px0 + sx, py0 + ph - 30 - hgt, 4, hgt); } }
    X.fillStyle = '#ff9a1f'; X.fillRect(px0 + pw * 0.5 - 14, py0 + ph - 96, 28, 4);
  } else {
    for (let sx = 0; sx < pw; sx += 4) { const hgt = Math.max(0, 70 - Math.abs(sx - pw * 0.6) * 0.7); if (hgt > 0) { X.fillStyle = '#6b7fa8'; X.fillRect(px0 + sx, py0 + ph - 30 - hgt, 4, hgt); if (hgt > 45) { X.fillStyle = '#ffffff'; X.fillRect(px0 + sx, py0 + ph - 30 - hgt, 4, hgt - 45); } } }
    X.fillStyle = '#ffffff'; for (let s = 0; s < 18; s++) X.fillRect(px0 + 6 + (s * 47) % (pw - 12), py0 + 6 + ((s * 29 + T) % (ph - 40)), 2, 2);
  }
  for (let k = 0; k < pw / TS; k++) X.drawImage(TILES[theme]['g1' + (k % 3)], px0 + k * TS, py0 + ph - 30, Math.min(TS, pw - k * TS), 30);
  if (theme === 1) { drawSpr(SPIDER, px0 + pw - 70, py0 + 70, 1, 1); X.fillStyle = '#d9d9e0'; X.fillRect(px0 + pw - 70, py0, 2, 42); }
  else if (theme === 2) X.drawImage(SNOWMAN.r, px0 + pw - 76, py0 + ph - 30 - 86, 60, 86);
  else if (theme === 3) drawSpr(SNAKE_HEAD, px0 + pw - 40, py0 + ph - 30, -1, 1.5);
  else if (theme === 4) drawSpr(APE, px0 + pw - 42, py0 + ph - 30, 1, 1);
  else drawSpr(BEETLE[0], px0 + pw - 80, py0 + ph - 30, -1);
  drawHero(CHARS[charSel].id, px0 + 34, py0 + ph - 30, 1, 'stand', 1);
}
function renderLevels() {
  menuBackdrop(false);
  title(t('chooseLevel'), 48, 28);
  const id = CHARS[charSel].id, w = 176, gap = 12, x0 = (VW - (w * LEVELS.length + gap * (LEVELS.length - 1))) / 2;
  LEVELS.forEach((lvd, i) => {
    const on = levelSel === i, h = 330, x = x0 + i * (w + gap), y = 88 + (on ? -6 : 0);
    buttons.push({ x, y, w, h, action: () => { if (levelSel === i) startGame(charSel, i); else { levelSel = i; SFX.move(); } }, hover: () => { if (levelSel !== i) { levelSel = i; SFX.move(); } } });
    pbox(x, y + 10, w, h, '#1b1530'); pbox(x - 4, y - 4, w + 8, h + 8, on ? '#ffd23a' : '#2a2140'); pbox(x, y, w, h, '#3a2f5c');
    levelPreview(i, x + 12, y + 12, w - 24, 130);
    txt(`${i + 1} · ${t(lvd.key)}`, x + w / 2, y + 170, 13, on ? '#ffd23a' : '#fff', 'center', true, w - 16);
    txt(t(lvd.key + 'd'), x + w / 2, y + 200, 9, '#c9bfff', 'center', false, w - 16);
    txt(t('par', lvd.par), x + w / 2, y + 230, 10, '#fdf6e3', 'center', false, w - 16);
    const b = loadBest(i, id);
    txt(b ? t('best', b.score, fmtTime(b.time)) : t('noBest'), x + w / 2, y + 296, 10, b ? '#7cf07a' : '#8f86b8', 'center', false, w - 16);
  });
  button(t('start'), VW / 2 - 110, 446, 220, 46, true, () => startGame(charSel, levelSel));
  if (!touchActive()) txt(t('hintLevel'), VW / 2, 508, 9, '#fff', 'center');
  else button(t('back'), 16, 450, 130, 44, false, () => go('select'), null, 14);
}
function renderOverlayList(head, list, extra) {
  ditherDim(); TQ = [];
  const h = 110 + list.length * 52 + (extra ? extra.h : 0), y0 = snap((VH - h) / 2);
  panel(VW / 2 - 260, y0, 520, h);
  txt(head, VW / 2, y0 + 40, 22, '#ffd23a', 'center', true, 480);
  let y = y0 + 76;
  if (extra) { extra.draw(y); y += extra.h; }
  list.forEach((m, i) => button(t(m.k), VW / 2 - 160, y + i * 52, 320, 42, sel === i, m.a, () => sel = i));
}
function renderClear() {
  const R = G.result;
  renderOverlayList(t('courseClear'), clearMenu(), {
    h: 124, draw: y => {
      const rows = [[t('coinsRow', G.coins), R.coinPts, '#fff'], [t('timeRow', fmtTime(G.time), G.lv.par), R.timePts, '#fff'], [t('scoreRow') + (G.newBest ? '  ' + t('newBest') : ''), R.total, G.newBest ? '#7cf07a' : '#ffd23a']];
      rows.forEach(([a, b, col], i) => { txt(a, VW / 2 - 220, y + 6 + i * 30, 11, i === 2 ? col : '#c9bfff', 'left', true, 300); txt(String(b), VW / 2 + 140, y + 6 + i * 30, 12, col, 'right'); });
      pbox(VW / 2 + 160, y - 10, 70, 80, '#251e3f');
      txt(R.rank, VW / 2 + 195, y + 26, 34, { S: '#ffd23a', A: '#7cf07a', B: '#4fd1ff', C: '#c9bfff' }[R.rank], 'center');
      txt(t('falls', G.deaths), VW / 2 - 220, y + 92, 9, '#ffb3bd');
    }
  });
}
function renderRotate() {
  X.fillStyle = '#1b1530'; X.fillRect(0, 0, VW, VH);
  const cx = VW / 2, cy = 200, a = Math.min(1, (T % 120) / 60) * Math.PI / 2;
  X.save(); X.translate(cx, cy); X.rotate(-a);
  X.fillStyle = '#fdf6e3'; X.fillRect(-36, -64, 72, 128); X.fillStyle = '#2a2140'; X.fillRect(-28, -52, 56, 100); X.fillStyle = '#ffd23a'; X.fillRect(-6, 54, 12, 4);
  X.restore();
  txt(t('rotate'), cx, 330, 24, '#ffd23a', 'center', true, VW - 60);
  txt(t('rotate2'), cx, 372, 12, '#c9bfff', 'center', true, VW - 60);
}

// ---------- touch overlay (drawn at full resolution, semi-transparent) ----------
function drawTouchUI() {
  if (state !== 'play' || !touchActive() || !G || G.clear) return;
  const k = C.width / VW; XM.setTransform(1, 0, 0, 1, 0, 0);
  for (const b of touchLayout()) {
    const on = !!SRCS.T[b.a], r = b.r * k, x = b.x * k, y = b.y * k, c = Math.max(2, Math.round(r * 0.25));
    XM.globalAlpha = on ? 0.75 : 0.42;
    XM.fillStyle = on ? '#ffd23a' : '#2a2140';
    XM.fillRect(x - r + c, y - r, 2 * r - 2 * c, 2 * r); XM.fillRect(x - r, y - r + c, 2 * r, 2 * r - 2 * c);
    XM.globalAlpha = on ? 0.9 : 0.55; XM.strokeStyle = '#fdf6e3'; XM.lineWidth = Math.max(2, 3 * k);
    XM.beginPath(); XM.moveTo(x - r + c, y - r); XM.lineTo(x + r - c, y - r); XM.lineTo(x + r, y - r + c); XM.lineTo(x + r, y + r - c); XM.lineTo(x + r - c, y + r); XM.lineTo(x - r + c, y + r); XM.lineTo(x - r, y + r - c); XM.lineTo(x - r, y - r + c); XM.closePath(); XM.stroke();
    XM.globalAlpha = 1;
    drawText(b.l, b.x, b.y, b.r > 40 ? 26 : 14, on ? '#2a2140' : '#fdf6e3', 'center');
  }
}

// ---------- frame ----------
function render() {
  X = XL; X.setTransform(1 / PX, 0, 0, 1 / PX, 0, 0); X.imageSmoothingEnabled = false;
  buttons = []; TQ = [];
  if (isPortrait()) renderRotate();
  else if (state === 'menu') renderMenu();
  else if (state === 'settings') renderSettings();
  else if (state === 'controls') renderControls();
  else if (state === 'notes') renderNotes();
  else if (state === 'select') renderSelect();
  else if (state === 'levels') renderLevels();
  else {
    renderWorld();
    if (state === 'pause') renderOverlayList(t('paused'), PAUSE);
    if (state === 'clear') renderClear();
  }
  if (!SETTINGS.sound) txt(t('sound') + ' ' + t('off'), VW - 18, VH - 16, 9, '#fff', 'right');
  quantize();
  XM.setTransform(1, 0, 0, 1, 0, 0); XM.imageSmoothingEnabled = false;
  XM.drawImage(L, 0, 0, C.width, C.height);
  for (const f of TQ) f();
  drawTouchUI();
}
let last = performance.now(), acc = 0;
const STEP = 1000 / 60;
function frame(now) {
  acc += Math.min(100, now - last); last = now;
  while (acc >= STEP) { update(); acc -= STEP; for (const k in hit) hit[k] = false; }
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
