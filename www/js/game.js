'use strict';
// =====================================================================
// Game: heroes, scoring, player, enemies, bosses, projectiles, menus logic
// =====================================================================
const CHARS = [
  { id: 'capy', special: 'dash', w: 34, h: 28, maxSpeed: 3.6, runSpeed: 5.6, accel: 0.32, airAccel: 0.24, friction: 0.42, airFriction: 0.06, jump: 12.5, gravity: 0.55, stats: [3, 3] },
  { id: 'owl', special: 'spit', w: 26, h: 28, maxSpeed: 3.9, runSpeed: 6.0, accel: 0.4, airAccel: 0.32, friction: 0.3, airFriction: 0.04, jump: 13.6, gravity: 0.58, stats: [4, 4] },
  { id: 'mole', special: 'pound', w: 30, h: 28, maxSpeed: 3.4, runSpeed: 5.4, accel: 0.34, airAccel: 0.26, friction: 0.38, airFriction: 0.06, jump: 12.3, gravity: 0.55, stats: [3, 3] },
  { id: 'coon', special: 'swing', w: 28, h: 30, maxSpeed: 3.7, runSpeed: 5.7, accel: 0.36, airAccel: 0.26, friction: 0.4, airFriction: 0.06, jump: 12.6, gravity: 0.56, stats: [3, 3] }
];

let state = 'menu', sel = 0, charSel = 0, levelSel = 0, G = null, T = 0, notesScroll = 0;
function bestKey(li, id) { return 'capydash_v2_' + li + '_' + id; }
function loadBest(li, id) { try { const v = localStorage.getItem(bestKey(li, id)); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function saveBest(li, id, rec) { try { const b = loadBest(li, id); if (!b || rec.score > b.score) { localStorage.setItem(bestKey(li, id), JSON.stringify(rec)); return true; } } catch (e) {} return false; }
// Score: 100 per coin + 50 per second finished under par
function calcScore(lv, coins, frames) {
  const coinPts = coins * 100, timePts = Math.max(0, Math.round((lv.par - frames / 60) * 50)), total = coinPts + timePts;
  const ref = lv.total * 100 * 0.8 + lv.par * 50 * 0.5, r = total / ref;
  return { coinPts, timePts, total, rank: r >= 1 ? 'S' : r >= 0.8 ? 'A' : r >= 0.6 ? 'B' : 'C' };
}

function newPlayer(ch, x) {
  return { x, y: 11 * TS - ch.h, w: ch.w, h: ch.h, vx: 0, vy: 0, face: 1, onGround: false, coyote: 0, buf: 0, anim: 0, inv: 0,
    dead: false, deadT: 0, fell: false, prevBottom: 0, pound: false, poundT: 0, canDash: true, dashT: 0, swingT: 0, swingCd: 0, swingHit: false, spitCd: 0, spitT: 0, onIce: false };
}
function newBoss(lv) {
  if (lv.boss === 'snowman') return { type: 'snowman', x: lv.arenaX0 + 640, y: 11 * TS - 84, w: 56, h: 84, vx: 0, vy: 0, state: 'idle', t: 0, hp: 6, max: 6, inv: 0, anim: 0, face: -1, throwT: 0, phase2: false };
  return { type: 'spider', x: (lv.arenaX0 + lv.arenaX1) / 2 - 28, y: 130, w: 56, h: 34, vx: 0, vy: 0, state: 'idle', t: 0, hp: 4, max: 4, inv: 0, anim: 0, phase2: false, stormed: false };
}
function startGame(ci, li) {
  const lv = LEVELS[li].build(); lv.par = LEVELS[li].par; lv.li = li;
  G = { ci, li, lv, p: newPlayer(CHARS[ci], lv.spawnX), parts: [], bumps: [], haz: [], shots: [], cam: 0, coins: 0, time: 0, timerOn: false, started: false,
        deaths: 0, shake: 0, cp: false, cpT: 0, clear: false, clearT: 0, result: null, newBest: false,
        boss: lv.boss ? newBoss(lv) : null, fight: false, bossDown: false, banner: null };
  state = 'play'; sel = 0; SFX.ok();
}
function go(s) { state = s; sel = 0; notesScroll = 0; SFX.move(); }

function addPart(o) { G.parts.push(Object.assign({ vx: 0, vy: 0, g: 0, life: 30, max: 30, size: 4, col: '#ffffff', type: 'sq' }, o)); }
function puff(x, y, n = 6, col = '#ffffff') { for (let i = 0; i < n; i++) addPart({ x, y, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 1.5, life: 22, max: 22, size: 5 + Math.random() * 4, col, type: 'puff' }); }

function killPlayer(bounce) {
  const p = G.p; if (p.dead) return;
  p.dead = true; p.deadT = 0; p.fell = !bounce; p.vy = bounce ? -10 : 0; p.vx = 0; p.pound = false; p.dashT = 0;
  G.deaths++; SFX.die(); haptic(80);
}
function respawn() {
  const lv = G.lv;
  if (G.boss && G.fight) {               // reset the boss fight
    G.fight = false; G.boss = newBoss(lv); G.haz = []; G.banner = null;
    for (let ty = 0; ty <= 10; ty++) lv.g[ty][lv.arenaX0 / TS - 1] = '.';
  }
  G.shots = [];
  G.p = newPlayer(CHARS[G.ci], G.cp ? lv.checkX + 10 : lv.spawnX); G.p.inv = 100;
}
function killEnemy(e, flip) {
  if (!e.alive) return;
  e.alive = false; e.deadT = 0; e.flipped = flip;
  if (flip) { e.vy = -7; e.vx = (Math.random() < 0.5 ? -1 : 1) * 1.5; }
  puff(e.x + e.w / 2, e.y + e.h - 4, 6); SFX.stomp();
}
function collectCoin(cx, cy) {
  G.coins++; SFX.coin();
  for (let i = 0; i < 6; i++) addPart({ x: cx, y: cy, vx: Math.cos(i) * 2.2, vy: Math.sin(i) * 2.2 - 1, life: 18, max: 18, col: '#fff3a1', type: 'spark' });
}
function breakBrick(tx, ty) {
  G.lv.g[ty][tx] = '.'; SFX.brk();
  for (let i = 0; i < 4; i++) addPart({ x: tx * TS + 10 + (i % 2) * 20, y: ty * TS + 10 + (i >> 1) * 20, vx: (i % 2 ? 1 : -1) * (2 + Math.random()), vy: -7 + (i >> 1) * 3 - Math.random() * 2, g: 0.45, life: 60, max: 60, size: 12, col: G.lv.theme === 1 ? '#a8501f' : '#c8642f', type: 'sq' });
}
function popCoinBlock(tx, ty) {
  G.lv.g[ty][tx] = 'U'; G.bumps.push({ tx, ty, t: 0 }); G.coins++; SFX.coin();
  addPart({ x: tx * TS + 20, y: ty * TS - 10, vy: -9, g: 0.5, life: 34, max: 34, type: 'coin' });
}
function bumpBlock(tx, ty) {
  const lv = G.lv, t = lv.g[ty][tx];
  if (t === '?') popCoinBlock(tx, ty);
  else if (t === 'B') breakBrick(tx, ty);
  else { G.bumps.push({ tx, ty, t: 0 }); SFX.bump(); }
  for (const e of lv.enemies) if (e.alive && Math.abs(e.y + e.h - ty * TS) < 6 && e.x + e.w > tx * TS && e.x < (tx + 1) * TS) killEnemy(e, true);
  if (tileAt(lv, tx, ty - 1) === 'o') { lv.g[ty - 1][tx] = '.'; collectCoin(tx * TS + 20, (ty - 1) * TS + 20); }
}

// =====================================================================
// Bosses
// =====================================================================
function hurtBoss(dmg) {
  const B = G.boss; if (!B || B.inv > 0 || ['dead', 'intro', 'idle'].includes(B.state)) return false;
  B.hp -= dmg; B.inv = 45; G.shake = 8; SFX.bossHit(); haptic(40);
  puff(B.x + B.w / 2, B.y + B.h / 2, 8, B.type === 'spider' ? '#e94b5a' : '#ffffff');
  if (!B.phase2 && B.hp > 0 && B.hp <= B.max / 2) { B.phase2 = true; G.banner = { key: 'ab_' + B.type, t: 0 }; }
  if (B.hp <= 0) { B.state = 'dead'; B.t = 0; B.vy = -3; G.haz = []; }
  else if (B.type === 'spider' && B.state === 'ground') { B.state = 'rise'; B.t = 0; }
  return true;
}
function openGate() {
  const lv = G.lv;
  for (let ty = 0; ty <= 10; ty++) { lv.g[ty][lv.arenaX1 / TS] = '.'; lv.g[ty][lv.arenaX0 / TS - 1] = '.'; }
  G.fight = false; G.bossDown = true; SFX.check();
  for (let i = 0; i < 16; i++) addPart({ x: lv.arenaX1 + 20, y: 100 + i * 20, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 2, g: 0.1, life: 40, max: 40, col: '#b4bcc8', type: 'spark' });
}
// player touching a boss: stomp from above, otherwise it hurts
function bossContact(B, p, topPad) {
  if (p.dead || G.clear || !overlap(p, B) || B.state === 'intro' || B.state === 'dead') return;
  if (p.vy >= 0 && p.prevBottom <= B.y + topPad) {
    const pounding = p.pound;
    hurtBoss(pounding ? 2 : 1); p.pound = false; p.vy = -10; p.canDash = true; p.y = B.y - p.h;
    if (pounding) shockSlam(p);
  } else if (p.inv <= 0) killPlayer(true);
}
function updateBoss() {
  const B = G.boss, lv = G.lv, p = G.p; if (!B) return;
  if (!G.fight && B.state === 'idle') {
    if (!p.dead && p.x > lv.arenaX0 + TS) {
      G.fight = true; B.state = 'intro'; B.t = 0; SFX.boss(); G.banner = { key: 'boss_' + B.type, t: 0 };
      for (let ty = 0; ty <= 10; ty++) lv.g[ty][lv.arenaX0 / TS - 1] = 'G';
    } else return;
  }
  B.t++; B.anim += 0.2; if (B.inv > 0) B.inv--;
  if (B.type === 'spider') updateSpider(B, p, lv); else updateSnowman(B, p, lv);
}

// ---------- the Moonweaver (spider) ----------
function shootWeb(sx, sy, vx, vy) { G.haz.push({ type: 'web', x: sx - 6, y: sy - 6, w: 12, h: 12, vx, vy, life: 300 }); }
function updateSpider(B, p, lv) {
  const groundY = 11 * TS - B.h, topY = 130, cx = B.x + B.w / 2, px = p.x + p.w / 2, fast = B.phase2;
  switch (B.state) {
    case 'intro': B.y = topY + Math.sin(B.t * 0.1) * 4; if (B.t > 80) { B.state = 'patrol'; B.t = 0; } break;
    case 'patrol': {
      B.y = topY + Math.sin(B.t * 0.08) * 6;
      const sp = fast ? 2.8 : 2; B.x += Math.max(-sp, Math.min(sp, (px - cx) * 0.05));
      if (B.t % (fast ? 55 : 75) === 30 && !p.dead) { const dx = px - cx, dy = p.y + p.h / 2 - B.y - B.h, d = Math.hypot(dx, dy) || 1; shootWeb(cx, B.y + B.h, dx / d * 4.2, dy / d * 4.2); SFX.web(); }
      // phase 2 ability: WEB STORM — a fan of five webs
      if (fast && !B.stormed && B.t === 70) { B.state = 'charge'; B.t = 0; break; }
      if (B.t > (fast ? 150 : 160)) { B.state = 'warn'; B.t = 0; B.vy = 0; }
      break;
    }
    case 'charge':
      B.y = topY + (B.t % 4 < 2 ? -3 : 3);
      if (B.t > 36) {
        for (const a of [-60, -30, 0, 30, 60]) { const r = a * Math.PI / 180; shootWeb(cx, B.y + B.h, Math.sin(r) * 3.6, Math.cos(r) * 3.6); }
        SFX.web(); G.shake = 6; B.stormed = true; B.state = 'patrol'; B.t = 71;
      }
      break;
    case 'warn': B.y = topY + (B.t % 4 < 2 ? -2 : 2); if (B.t > 34) { B.state = 'drop'; B.t = 0; } break;
    case 'drop':
      B.vy = Math.min(B.vy + 0.7, 14); B.y += B.vy;
      if (B.y >= groundY) { B.y = groundY; B.state = 'ground'; B.t = 0; G.shake = 12; SFX.stomp(); haptic(40); puff(cx, 11 * TS, 10, '#d9d9e0'); }
      break;
    case 'ground': {
      const sp = fast ? 2.2 : 1.4; B.vx = B.t < 20 ? 0 : Math.sign(px - cx) * sp; B.x += B.vx;
      if (B.t > (fast ? 110 : 140)) { B.state = 'rise'; B.t = 0; }
      break;
    }
    case 'rise': B.y -= fast ? 4.5 : 3.5; if (B.y <= topY) { B.y = topY; B.state = 'patrol'; B.t = 0; B.stormed = false; } break;
    case 'dead':
      B.vy += 0.25; B.y += B.vy;
      if (B.t % 5 === 0) puff(B.x + Math.random() * B.w, B.y + Math.random() * B.h, 3, '#e94b5a');
      if (B.t > 90) { puff(cx, B.y + B.h / 2, 20, '#3a2f5c'); G.boss = null; openGate(); }
      return;
  }
  B.x = Math.max(lv.arenaX0 + 8, Math.min(lv.arenaX1 - B.w - 8, B.x));
  bossContact(B, p, 14);
}

// ---------- Grimfrost (evil snowman) ----------
function throwSnowball(B, p) {
  const sx = B.x + B.w / 2 + B.face * 30, sy = B.y + 34, dx = p.x + p.w / 2 - sx, dy = p.y + p.h / 2 - sy, g = 0.25;
  const tt = Math.max(30, Math.min(70, Math.abs(dx) / 5));
  G.haz.push({ type: 'snow', x: sx - 6, y: sy - 6, w: 12, h: 12, vx: dx / tt, vy: (dy - 0.5 * g * tt * tt) / tt, g, life: 300 });
  SFX.toss();
}
function spawnIcicles(p, lv) {   // phase 2 ability: ICICLE RAIN
  const xs = [p.x + p.w / 2, lv.arenaX0 + 60 + Math.random() * (lv.arenaX1 - lv.arenaX0 - 120), lv.arenaX0 + 60 + Math.random() * (lv.arenaX1 - lv.arenaX0 - 120)];
  for (const x of xs) G.haz.push({ type: 'ice', x: x - 6, y: -30, w: 12, h: 22, vx: 0, vy: 0, warn: 50, life: 400 });
}
function updateSnowman(B, p, lv) {
  const groundY = 11 * TS - B.h, cx = B.x + B.w / 2, px = p.x + p.w / 2, f = B.phase2;
  if (B.state !== 'dead' && B.state !== 'air') B.face = px < cx ? -1 : 1;
  switch (B.state) {
    case 'intro': if (B.t % 20 === 0) { G.shake = 5; SFX.bump(); } if (B.t > 80) { B.state = 'walk'; B.t = 0; } break;
    case 'walk': {
      const d = px - cx, ad = Math.abs(d), sp = f ? 1.8 : 1.1;
      B.vx = ad > 320 ? Math.sign(d) * sp : ad < 170 ? -Math.sign(d) * sp : 0;
      B.x += B.vx; B.anim += Math.abs(B.vx) * 0.1;
      const per = f ? 55 : 85;
      if (B.t % per === per - 1 && !p.dead) { throwSnowball(B, p); B.throwT = 14; }
      if (f && B.t % 110 === 60) spawnIcicles(p, lv);
      if (B.t > (f ? 200 : 250)) { B.state = 'crouch'; B.t = 0; }
      break;
    }
    case 'crouch': if (B.t > 30) { B.state = 'air'; B.t = 0; B.vy = -13; B.vx = Math.max(-6, Math.min(6, (px - cx) / 55)); } break;
    case 'air':
      B.vy += 0.5; B.x += B.vx; B.y += B.vy;
      if (B.y >= groundY) {
        B.y = groundY; B.vy = 0; B.state = 'stunned'; B.t = 0; G.shake = 14; haptic(50); SFX.stomp(); puff(cx, 11 * TS, 12, '#ffffff');
        if (f) spawnIcicles(p, lv);
      }
      break;
    case 'stunned': if (B.t > 80) { B.state = 'walk'; B.t = 0; } break;
    case 'dead':
      if (B.t % 6 === 0) puff(B.x + Math.random() * B.w, B.y + B.h - 10 - Math.random() * 40 * (1 - B.t / 100), 3, '#ffffff');
      if (B.t > 100) { puff(cx, 11 * TS - 10, 20, '#d6f2ff'); G.boss = null; openGate(); }
      return;
  }
  if (B.throwT > 0) B.throwT--;
  B.x = Math.max(lv.arenaX0 + 8, Math.min(lv.arenaX1 - B.w - 8, B.x));
  bossContact(B, p, 18);
}

// =====================================================================
// Projectiles: hazards (webs, snowballs, icicles) and Ays' spit shots
// =====================================================================
function updateHaz() {
  const p = G.p, lv = G.lv;
  for (const h of G.haz) {
    h.life--;
    if (h.type === 'ice') {
      if (h.warn > 0) { h.warn--; continue; }
      h.vy = Math.min(h.vy + 0.6, 14); h.y += h.vy;
      if (h.y + h.h >= 11 * TS) { h.life = 0; SFX.shatter(); for (let i = 0; i < 5; i++) addPart({ x: h.x + 6, y: 11 * TS - 4, vx: (Math.random() - 0.5) * 5, vy: -2 - Math.random() * 3, g: 0.3, life: 30, max: 30, col: '#a8d8f8', type: 'spark' }); }
    } else {
      if (h.g) h.vy += h.g;
      h.x += h.vx; h.y += h.vy;
      if (isSolid(lv, Math.floor((h.x + h.w / 2) / TS), Math.floor((h.y + h.h / 2) / TS))) { h.life = 0; puff(h.x + 6, h.y + 6, 3, h.type === 'web' ? '#e4e8ee' : '#ffffff'); }
    }
    if (h.life > 0 && !p.dead && !G.clear && p.inv <= 0 && overlap(p, h)) { h.life = 0; killPlayer(true); }
  }
  G.haz = G.haz.filter(h => h.life > 0);
}
function smashHazard(h) { if (h.type === 'ice' && h.warn > 0) return false; h.life = 0; puff(h.x + 6, h.y + 6, 4, h.type === 'web' ? '#e4e8ee' : '#ffffff'); return true; }
function updateShots() {
  const lv = G.lv;
  for (const s of G.shots) {
    s.x += s.vx; s.life--;
    if (T % 2 === 0) addPart({ x: s.x + 5, y: s.y + 4, life: 8, max: 8, col: '#ffd23a', type: 'spark' });
    const tx = Math.floor((s.x + s.w / 2) / TS), ty = Math.floor((s.y + s.h / 2) / TS);
    if (isSolid(lv, tx, ty)) { const tl = tileAt(lv, tx, ty); if (tl === 'B') breakBrick(tx, ty); else if (tl === '?') popCoinBlock(tx, ty); s.life = 0; puff(s.x + 5, s.y + 4, 3, '#ffd23a'); continue; }
    for (const e of lv.enemies) if (s.life > 0 && e.alive && overlap(s, e)) { killEnemy(e, true); s.life = 0; }
    for (const h of G.haz) if (s.life > 0 && h.life > 0 && overlap(s, h) && smashHazard(h)) s.life = 0;
    if (s.life > 0 && G.boss && overlap(s, G.boss)) { hurtBoss(1); s.life = 0; puff(s.x + 5, s.y + 4, 4, '#ffd23a'); }
  }
  G.shots = G.shots.filter(s => s.life > 0);
}

// =====================================================================
// Hero specials
// =====================================================================
function swingHits(p) {
  const lv = G.lv, hb = { x: p.face > 0 ? p.x + p.w - 6 : p.x - 42, y: p.y - 14, w: 48, h: p.h + 18 };
  for (const e of lv.enemies) if (e.alive && overlap(hb, e)) { killEnemy(e, true); SFX.clang(); }
  for (const h of G.haz) if (h.life > 0 && overlap(hb, h) && smashHazard(h)) SFX.clang();
  if (G.boss && !p.swingHit && overlap(hb, G.boss) && hurtBoss(1)) p.swingHit = true;
  const tx0 = Math.floor(hb.x / TS), tx1 = Math.floor((hb.x + hb.w - 1) / TS), ty0 = Math.floor(hb.y / TS), ty1 = Math.floor((hb.y + hb.h - 1) / TS);
  for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
    const tl = tileAt(lv, tx, ty);
    if (tl === 'B') breakBrick(tx, ty); else if (tl === '?') popCoinBlock(tx, ty);
  }
}
// Kerim's SHOCK SLAM: a shockwave that hits everything around the landing spot
function shockSlam(p) {
  const cx = p.x + p.w / 2, gy = p.y + p.h, R = 150;
  G.shake = 14; haptic(60); SFX.slam();
  for (const d of [-1, 1]) addPart({ x: cx, y: gy, vx: d * 9, life: 17, max: 17, type: 'wave' });
  puff(cx, gy, 10);
  for (const e of G.lv.enemies) if (e.alive && Math.abs(e.x + e.w / 2 - cx) < R && Math.abs(e.y + e.h - gy) < 70) killEnemy(e, true);
  for (const h of G.haz) if (h.life > 0 && Math.abs(h.x + h.w / 2 - cx) < R && Math.abs(h.y - gy) < 120) smashHazard(h);
  const B = G.boss;
  if (B && Math.abs(B.x + B.w / 2 - cx) < R + B.w / 2 && B.y + B.h > gy - 90 && B.y < gy + 10) hurtBoss(1);
}

// =====================================================================
// Main game update
// =====================================================================
function updateGame() {
  const lv = G.lv, ch = CHARS[G.ci];
  let p = G.p;
  if (G.timerOn) G.time++;
  if (G.banner && ++G.banner.t > 100) G.banner = null;

  if (p.dead) {
    p.deadT++;
    if (!p.fell && p.deadT > 18) { p.vy += 0.6; p.y += p.vy; }
    if (p.deadT > 95) respawn();
  } else if (G.clear) {
    G.clearT++;
    p.vx = 2.4; p.face = 1; p.vy = Math.min(p.vy + ch.gravity, 13);
    const r = moveBody(p, lv); p.onGround = r.landed; p.anim += 0.15;
    if (G.clearT % 6 === 0) {
      const cols = ['#ff5d73', '#ffd23a', '#4fd1ff', '#7cf07a', '#c08bff'];
      addPart({ x: G.cam + Math.random() * VW, y: -10, vx: (Math.random() - 0.5) * 2, vy: 1 + Math.random() * 2, g: 0.04, life: 160, max: 160, col: cols[(Math.random() * 5) | 0], type: 'conf' });
    }
    if (G.clearT === 100) { state = 'clear'; sel = 0; }
  } else {
    // --- specials ---
    if (ch.special === 'pound' && !p.onGround && !p.pound && (hit.down || hit.action)) { p.pound = true; p.poundT = 0; p.vx = 0; p.vy = 0; SFX.move(); }
    if (p.pound) p.poundT++;
    if (ch.special === 'dash' && hit.action && !p.onGround && p.canDash && p.dashT <= 0) {
      const d = ((held.right ? 1 : 0) - (held.left ? 1 : 0)) || p.face;
      p.face = d; p.dashT = 13; p.canDash = false; p.vx = d * 10.5; p.vy = 0; SFX.dash();
    }
    if (ch.special === 'swing' && hit.action && p.swingCd <= 0) { p.swingT = 18; p.swingCd = 26; p.swingHit = false; SFX.swing(); }
    if (p.swingT > 0) { p.swingT--; if (p.swingT <= 14 && p.swingT >= 5) swingHits(p); }
    if (p.swingCd > 0) p.swingCd--;
    if (ch.special === 'spit' && hit.action && p.spitCd <= 0 && G.shots.length < 3) {
      G.shots.push({ x: p.face > 0 ? p.x + p.w - 2 : p.x - 10, y: p.y + 9, w: 12, h: 10, vx: p.face * 8.5 + p.vx * 0.3, life: 60 });
      p.spitCd = 16; p.spitT = 8; SFX.spit(); puff(p.x + p.w / 2 + p.face * 16, p.y + 12, 2, '#fff3a1');
    }
    if (p.spitCd > 0) p.spitCd--;
    if (p.spitT > 0) p.spitT--;

    // --- horizontal (ice makes the ground slippery) ---
    const max = held.run ? ch.runSpeed : ch.maxSpeed;
    const iceK = p.onGround && p.onIce ? 0.18 : 1;
    const fr = (p.onGround ? ch.friction : ch.airFriction) * iceK, acc = (p.onGround ? ch.accel : ch.airAccel) * (iceK < 1 ? 0.45 : 1);
    if (p.dashT > 0) {
      p.dashT--;
      if (p.dashT % 2 === 0) addPart({ x: p.x + p.w / 2, y: p.y + p.h / 2, life: 14, max: 14, size: 10, col: '#fff0a8', type: 'puff' });
    } else {
      const dir = p.pound ? 0 : (held.right ? 1 : 0) - (held.left ? 1 : 0);
      if (dir) {
        let v = p.vx * dir;
        if (v < 0) { v += fr + acc; if (p.onGround && Math.abs(p.vx) > 2.5 && T % 4 === 0) puff(p.x + p.w / 2, p.y + p.h, 1); }
        else if (v < max) v = Math.min(max, v + acc);
        else v = Math.max(max, v - (p.onGround ? 0.25 : 0.12));
        p.vx = v * dir; p.face = dir;
      } else {
        if (Math.abs(p.vx) <= fr) p.vx = 0; else p.vx -= Math.sign(p.vx) * fr;
      }
    }
    // --- jump ---
    if (hit.jump) p.buf = 8; else if (p.buf > 0) p.buf--;
    if (p.onGround) p.coyote = 7; else if (p.coyote > 0) p.coyote--;
    if (p.buf > 0 && p.coyote > 0 && !p.pound) {
      p.vy = -(ch.jump + Math.abs(p.vx) * 0.2); p.buf = 0; p.coyote = 0; p.onGround = false; SFX.jump();
    }
    let grav = ch.gravity; if (p.vy < 0 && !held.jump) grav *= 2.3;
    p.vy = Math.min(p.vy + grav, 13);
    if (p.dashT > 0) p.vy = 0;
    if (p.pound) { p.vx = 0; p.vy = p.poundT < 10 ? 0 : 15; }
    const vyBefore = p.vy, wasGround = p.onGround;
    p.prevBottom = p.y + p.h;
    const r = moveBody(p, lv, bumpBlock);
    p.onGround = r.landed;
    if (r.landed) {
      p.canDash = true;
      const fy = Math.floor((p.y + p.h + 1) / TS);
      p.onIce = tileAt(lv, Math.floor((p.x + p.w / 2) / TS), fy) === 'I';
    }
    if (p.pound && r.landed) {
      const fy = Math.floor((p.y + p.h + 1) / TS), fx0 = Math.floor(p.x / TS), fx1 = Math.floor((p.x + p.w - 0.01) / TS);
      let broke = false;
      for (let fx = fx0; fx <= fx1; fx++) { const tl = tileAt(lv, fx, fy); if (tl === 'B') { breakBrick(fx, fy); broke = true; } else if (tl === '?') popCoinBlock(fx, fy); }
      if (!broke) { p.pound = false; shockSlam(p); }
      else { p.onGround = false; p.vy = 15; }
    }
    if (r.landed && !wasGround && vyBefore > 5) puff(p.x + p.w / 2, p.y + p.h, 4);
    p.anim += p.onGround ? Math.abs(p.vx) * 0.06 : 0;
    if (p.inv > 0) p.inv--;

    // --- tiles: coins + spikes ---
    const tx0 = Math.floor(p.x / TS), tx1 = Math.floor((p.x + p.w - 0.01) / TS), ty0 = Math.floor(p.y / TS), ty1 = Math.floor((p.y + p.h - 0.01) / TS);
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      const tl = tileAt(lv, tx, ty);
      if (tl === 'o') { lv.g[ty][tx] = '.'; collectCoin(tx * TS + 20, ty * TS + 20); }
      else if (tl === '^' && p.inv <= 0 && overlap(p, { x: tx * TS + 6, y: ty * TS + 20, w: 28, h: 20 })) killPlayer(true);
    }
    if (p.y > lv.H * TS + 40) killPlayer(false);

    // --- start / checkpoint / finish ---
    if (!G.started && p.x + p.w / 2 > lv.startX) { G.started = true; G.timerOn = true; SFX.start(); }
    if (!G.cp && p.x > lv.checkX) { G.cp = true; SFX.check(); for (let i = 0; i < 10; i++) addPart({ x: lv.checkX + 24, y: 300, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 4, g: 0.15, life: 40, max: 40, col: '#7cf07a', type: 'spark' }); }
    if (G.cp && G.cpT < 30) G.cpT++;
    if (p.x + p.w > lv.finishX && !p.dead) {
      G.clear = true; G.timerOn = false; SFX.clear(); haptic(30);
      G.result = calcScore(lv, G.coins, G.time);
      G.newBest = saveBest(G.li, ch.id, { score: G.result.total, time: G.time, coins: G.coins });
    }
  }

  // --- enemies ---
  for (const e of lv.enemies) {
    if (!e.alive) { e.deadT++; if (e.flipped) { e.vy += 0.5; e.y += e.vy; e.x += e.vx; } continue; }
    if (!e.active) { if (e.x < G.cam + VW + 80) e.active = true; else continue; }
    e.vy = Math.min(e.vy + 0.5, 12);
    const pv = e.vx, r = moveBody(e, lv);
    if (r.hitX) e.vx = -pv;
    else if (r.landed) {
      const front = pv > 0 ? Math.floor((e.x + e.w + 1) / TS) : Math.floor((e.x - 1) / TS);
      const below = Math.floor((e.y + e.h + 1) / TS), at = Math.floor((e.y + e.h - 1) / TS);
      if (!isSolid(lv, front, below) || tileAt(lv, front, at) === '^') e.vx = -pv;
    }
    if (e.y > lv.H * TS + 100) e.alive = false;
    e.anim += 0.18;
    p = G.p;
    if (!p.dead && !G.clear && overlap(p, e)) {
      if (p.pound) { killEnemy(e, true); }
      else if (p.vy >= 0 && p.prevBottom <= e.y + 10) {
        killEnemy(e, false); p.y = e.y - p.h; p.canDash = true;
        p.vy = held.jump ? -ch.jump * 0.95 : -7.5;
      } else if (p.inv <= 0) killPlayer(true);
    }
  }
  lv.enemies = lv.enemies.filter(e => e.alive || (e.flipped ? e.y < lv.H * TS + 200 : e.deadT < 30));

  updateBoss();
  updateHaz();
  updateShots();
  if (G.shake > 0) G.shake--;

  for (const q of G.parts) { q.x += q.vx; q.y += q.vy; q.vy += q.g; q.life--; }
  G.parts = G.parts.filter(q => q.life > 0);
  for (const b of G.bumps) b.t++;
  G.bumps = G.bumps.filter(b => b.t < 10);

  // --- camera (centres on the arena during a boss fight) ---
  p = G.p;
  if (G.fight) G.cam += ((lv.arenaX0 + lv.arenaX1) / 2 - VW / 2 - G.cam) * 0.12;
  else if (!p.dead || !p.fell) G.cam += (p.x + p.w / 2 - VW * 0.4 + p.face * 40 - G.cam) * 0.1;
  G.cam = Math.max(0, Math.min(lv.W * TS - VW, G.cam));
}

// =====================================================================
// Menu logic (drawing lives in ui.js)
// =====================================================================
const MENU = [{ k: 'play', a: () => go('select') }, { k: 'settings', a: () => go('settings') }, { k: 'controls', a: () => go('controls') }, { k: 'notes', a: () => go('notes') }];
const PAUSE = [{ k: 'resume', a: () => { state = 'play'; } }, { k: 'restart', a: () => startGame(G.ci, G.li) }, { k: 'mainMenu', a: () => go('menu') }];
function clearMenu() {
  const list = [];
  if (G.li < LEVELS.length - 1) list.push({ k: 'nextLevel', a: () => startGame(G.ci, G.li + 1) });
  list.push({ k: 'playAgain', a: () => startGame(G.ci, G.li) }, { k: 'changeHero', a: () => go('select') }, { k: 'mainMenu', a: () => go('menu') });
  return list;
}
// settings rows: value getter + cycle(dir)
const SETTING_ROWS = [
  { k: 'language', val: () => STR[SETTINGS.lang].langName, cycle: d => { SETTINGS.lang = LANGS[(LANGS.indexOf(SETTINGS.lang) + d + LANGS.length) % LANGS.length]; notesCache = null; } },
  { k: 'sound', val: () => t(SETTINGS.sound ? 'on' : 'off'), cycle: () => { SETTINGS.sound = !SETTINGS.sound; } },
  { k: 'vibration', val: () => t(SETTINGS.vib ? 'on' : 'off'), cycle: () => { SETTINGS.vib = !SETTINGS.vib; haptic(40); } },
  { k: 'touch', val: () => t(SETTINGS.touch), cycle: d => { const o = ['auto', 'on', 'off']; SETTINGS.touch = o[(o.indexOf(SETTINGS.touch) + d + 3) % 3]; } },
  { k: 'back', val: () => '', cycle: () => go('menu') }
];
function cycleSetting(i, d) { SETTING_ROWS[i].cycle(d); saveSettings(); if (SETTING_ROWS[i].k !== 'back') SFX.move(); }

function navList(list) {
  if (hit.up) { sel = (sel + list.length - 1) % list.length; SFX.move(); }
  if (hit.down) { sel = (sel + 1) % list.length; SFX.move(); }
  if (hit.ok) list[sel].a();
}
function update() {
  T++;
  syncTouch();
  if (hit.mute) { SETTINGS.sound = !SETTINGS.sound; saveSettings(); }
  if (isPortrait()) { if (state === 'play' && G && !G.clear) { state = 'pause'; sel = 0; } return; }
  switch (state) {
    case 'menu': navList(MENU); break;
    case 'controls': if (hit.ok || hit.back) go('menu'); break;
    case 'settings':
      if (hit.up) { sel = (sel + SETTING_ROWS.length - 1) % SETTING_ROWS.length; SFX.move(); }
      if (hit.down) { sel = (sel + 1) % SETTING_ROWS.length; SFX.move(); }
      if (hit.left) cycleSetting(sel, -1);
      if (hit.right || hit.ok) cycleSetting(sel, 1);
      else if (hit.back) go('menu');
      break;
    case 'notes':
      if (hit.up) notesScroll--; if (hit.down) notesScroll++;
      if (hit.ok || hit.back) go('menu');
      break;
    case 'select':
      if (hit.left) { charSel = (charSel + CHARS.length - 1) % CHARS.length; SFX.move(); }
      if (hit.right) { charSel = (charSel + 1) % CHARS.length; SFX.move(); }
      if (hit.ok) go('levels'); else if (hit.back) go('menu');
      break;
    case 'levels':
      if (hit.left) { levelSel = (levelSel + LEVELS.length - 1) % LEVELS.length; SFX.move(); }
      if (hit.right) { levelSel = (levelSel + 1) % LEVELS.length; SFX.move(); }
      if (hit.ok) startGame(charSel, levelSel); else if (hit.back) go('select');
      break;
    case 'play':
      if (hit.pause && !G.clear) { state = 'pause'; sel = 0; SFX.move(); break; }
      updateGame(); break;
    case 'pause':
      if (hit.pause || hit.back) { state = 'play'; break; }
      navList(PAUSE); break;
    case 'clear': updateGame(); navList(clearMenu()); break;
  }
}
