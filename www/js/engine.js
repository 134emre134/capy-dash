'use strict';
// =====================================================================
// Capy Dash — engine: settings, renderer, input (keys / mouse / touch),
// audio and native-platform hooks (fullscreen, landscape lock, haptics).
// =====================================================================

// ---------- settings (persisted) ----------
const SETTINGS = (() => {
  let lang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  if (!['en', 'de', 'tr'].includes(lang)) lang = 'en';
  const def = { lang, sound: true, vib: true, touch: 'auto' };
  try { return Object.assign(def, JSON.parse(localStorage.getItem('capydash_settings') || '{}')); } catch (e) { return def; }
})();
function saveSettings() { try { localStorage.setItem('capydash_settings', JSON.stringify(SETTINGS)); } catch (e) {} }

// ---------- renderer ----------
// The scene is drawn at 1/PX resolution, snapped to a fixed palette, then scaled
// up with hard pixels. Text and touch buttons are drawn afterwards at full res.
const C = document.getElementById('game'), XM = C.getContext('2d');
const WRAP = document.getElementById('wrap');
const VH = 520, TS = 40, PX = 2, LH = VH / PX;
let VW = 960, LW = VW / PX;                    // VW grows on wide phone screens
const L = document.createElement('canvas'); L.width = LW; L.height = LH;
const XL = L.getContext('2d', { willReadFrequently: true });
let X = XL, CAMX = 0, CAMY = 0, DPR = 1, SCALE = 1;
function resize() {
  const r = WRAP.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height);
  const vw = Math.max(960, Math.min(1240, Math.round(VH * w / h / 4) * 4));
  if (vw !== VW) { VW = vw; LW = VW / PX; L.width = LW; L.height = LH; }
  SCALE = Math.min(w / VW, h / VH);
  C.style.width = Math.floor(VW * SCALE) + 'px'; C.style.height = Math.floor(VH * SCALE) + 'px';
  DPR = Math.max(1, Math.min(3, (window.devicePixelRatio || 1) * SCALE));
  C.width = Math.round(VW * DPR); C.height = Math.round(VH * DPR);
}
addEventListener('resize', resize);
addEventListener('orientationchange', () => setTimeout(resize, 200));
resize();

const PAL = PALETTE_HEX.map(h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
const QC = new Int32Array(32768).fill(-1);
function nearest(r, g, b) {
  let best = 0, bd = 1e9;
  for (const [pr, pg, pb] of PAL) { const d = 2 * (r - pr) ** 2 + 4 * (g - pg) ** 2 + 3 * (b - pb) ** 2; if (d < bd) { bd = d; best = (pr << 16) | (pg << 8) | pb; } }
  return best;
}
function quantize() {
  const im = XL.getImageData(0, 0, LW, LH), d = im.data;
  for (let i = 0; i < d.length; i += 4) {
    const k = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3);
    let c = QC[k]; if (c < 0) c = QC[k] = nearest((d[i] >> 3) * 8 + 4, (d[i + 1] >> 3) * 8 + 4, (d[i + 2] >> 3) * 8 + 4);
    d[i] = c >> 16; d[i + 1] = (c >> 8) & 255; d[i + 2] = c & 255; d[i + 3] = 255;
  }
  XL.putImageData(im, 0, 0);
}
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const DITHER = (() => { const c = mkCanvas(2, 2), x = c.getContext('2d'); x.fillStyle = '#1b1530'; x.fillRect(0, 0, 1, 1); x.fillRect(1, 1, 1, 1); return c; })();
function ditherDim() { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = X.createPattern(DITHER, 'repeat'); X.fillRect(0, 0, LW, LH); X.restore(); }
const snap = v => Math.round(v / PX) * PX;

// ---------- input: every action can be held by keyboard (K), touch (T) or mouse (M) ----------
const KEYMAP = {
  ArrowLeft: ['left'], KeyA: ['left'], ArrowRight: ['right'], KeyD: ['right'],
  ArrowUp: ['up', 'jump'], KeyW: ['up', 'jump'], ArrowDown: ['down'], KeyS: ['down'],
  Space: ['jump', 'ok'], KeyZ: ['jump'], KeyK: ['jump'], Enter: ['ok'], NumpadEnter: ['ok'],
  ShiftLeft: ['run'], ShiftRight: ['run'], KeyX: ['run'],
  KeyC: ['action'], KeyJ: ['action'], KeyF: ['action'],
  Escape: ['pause', 'back'], KeyP: ['pause'], Backspace: ['back'], KeyM: ['mute']
};
const SRCS = { K: {}, T: {}, M: {} }, held = {}, hit = {};
function setHeld(src, a, v) {
  const was = !!held[a]; SRCS[src][a] = v;
  const now = !!(SRCS.K[a] || SRCS.T[a] || SRCS.M[a]);
  held[a] = now; if (now && !was) hit[a] = true;
}
addEventListener('keydown', e => {
  initAudio();
  const acts = KEYMAP[e.code]; if (!acts) return;
  e.preventDefault(); if (e.repeat) return;
  acts.forEach(a => setHeld('K', a, true));
});
addEventListener('keyup', e => { const acts = KEYMAP[e.code]; if (acts) acts.forEach(a => setHeld('K', a, false)); });
addEventListener('blur', () => { ptrs.clear(); for (const s in SRCS) for (const a in SRCS[s]) setHeld(s, a, false); });

let mouse = { x: -1, y: -1 }, buttons = [];
let usingTouch = matchMedia('(pointer: coarse)').matches;
const ptrs = new Map();
function touchActive() { return SETTINGS.touch === 'on' || (SETTINGS.touch === 'auto' && usingTouch); }
function toView(e) { const r = C.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * VW, y: (e.clientY - r.top) / r.height * VH }; }
function overBtn(b) { return mouse.x >= b.x && mouse.x <= b.x + b.w && mouse.y >= b.y && mouse.y <= b.y + b.h; }
// Mouse / pen: pointer events. Touch: touch events, rebuilding the finger list from
// e.touches every time, so a lost "touchend" (iOS) can never leave a button stuck.
function pressAt(isMouse, e) {
  initAudio(); firstGesture(isMouse);
  if (state !== 'play') { for (const b of buttons) if (overBtn(b)) { b.action(); return; } }
  else if (isMouse && e.button === 0) setHeld('M', 'action', true);
}
C.addEventListener('pointerdown', e => {
  if (e.pointerType === 'touch') return;                 // handled by touch events
  e.preventDefault();
  mouse = toView(e); pressAt(e.pointerType === 'mouse', e);
});
C.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  mouse = toView(e);
  if (e.pointerType === 'mouse') for (const b of buttons) if (overBtn(b) && b.hover) b.hover();
});
['pointerup', 'pointercancel'].forEach(t => C.addEventListener(t, e => { if (e.pointerType === 'mouse') setHeld('M', 'action', false); }));
function syncFingers(e) {
  ptrs.clear();
  for (const tch of e.touches) ptrs.set(tch.identifier, toView(tch));
}
C.addEventListener('touchstart', e => {
  e.preventDefault(); usingTouch = true;
  syncFingers(e);
  for (const tch of e.changedTouches) { mouse = toView(tch); pressAt(false, e); }
}, { passive: false });
C.addEventListener('touchmove', e => { e.preventDefault(); syncFingers(e); }, { passive: false });
['touchend', 'touchcancel'].forEach(tp => document.addEventListener(tp, e => syncFingers(e), { passive: true }));
const clearFingers = () => { ptrs.clear(); for (const s in SRCS) for (const a in SRCS[s]) setHeld(s, a, false); };
addEventListener('pagehide', clearFingers);
document.addEventListener('visibilitychange', () => { if (document.hidden) clearFingers(); });
C.addEventListener('contextmenu', e => e.preventDefault());
C.addEventListener('wheel', e => { if (state === 'notes') { notesScroll += Math.sign(e.deltaY) * 2; e.preventDefault(); } }, { passive: false });
document.addEventListener('gesturestart', e => e.preventDefault());

// on-screen controls (logical coordinates, recomputed for the current width)
function touchLayout() {
  return [
    { a: 'left', x: 82, y: VH - 84, r: 56, l: '◀' }, { a: 'right', x: 208, y: VH - 84, r: 56, l: '▶' },
    { a: 'action', x: VW - 216, y: VH - 70, r: 48, l: 'B' }, { a: 'jump', x: VW - 84, y: VH - 98, r: 62, l: 'A' },
    { a: 'pause', x: VW - 292, y: 32, r: 24, l: '‖' }];
}
let touchRunT = 0;
// called once per fixed step: turns the current finger positions into held actions
function syncTouch() {
  const want = { left: false, right: false, jump: false, action: false, pause: false };
  if (state === 'play' && touchActive()) for (const p of ptrs.values()) {
    if (p.x < 300 && p.y > VH - 240) { want[p.x < 145 ? 'left' : 'right'] = true; continue; }
    let best = null, bd = 1e9;
    for (const b of touchLayout()) { if (b.a === 'left' || b.a === 'right') continue; const d = Math.hypot(p.x - b.x, p.y - b.y); if (d < b.r * 1.5 && d < bd) { bd = d; best = b; } }
    if (best) want[best.a] = true;
  }
  for (const a in want) if (!!SRCS.T[a] !== want[a]) setHeld('T', a, want[a]);
  touchRunT = (want.left || want.right) ? touchRunT + 1 : 0;   // holding a direction longer = run
  const run = touchRunT > 20; if (!!SRCS.T.run !== run) setHeld('T', 'run', run);
}

// ---------- platform: fullscreen, landscape lock, haptics, status bar ----------
const CAP = () => window.Capacitor && window.Capacitor.Plugins;
function isNative() { try { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); } catch (e) { return false; } }
function lockLandscape() {
  try {
    const P = CAP();
    if (P && P.ScreenOrientation) P.ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {});
    else if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
  } catch (e) {}
}
let gestured = false;
function firstGesture(isMouse) {
  if (gestured) return; gestured = true;
  if (isMouse || isNative()) { lockLandscape(); return; }
  const el = document.documentElement;
  try {
    if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen({ navigationUI: 'hide' }).then(lockLandscape, lockLandscape);
    else lockLandscape();
  } catch (e) {}
}
function haptic(ms = 30) {
  if (!SETTINGS.vib) return;
  try {
    const P = CAP();
    if (P && P.Haptics) { P.Haptics.impact({ style: ms > 40 ? 'HEAVY' : 'MEDIUM' }); return; }
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch (e) {}
}
// iPhone/iPad Safari can't go fullscreen; only the home-screen app can
const IS_IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IS_STANDALONE = (window.matchMedia && matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) || navigator.standalone === true;
let iosHintClosed = false;
function showIosHint() { return IS_IOS && !IS_STANDALONE && !isNative() && !iosHintClosed; }
function isPortrait() { return usingTouch && innerHeight > innerWidth * 1.05; }
if (isNative()) { lockLandscape(); try { const P = CAP(); if (P && P.StatusBar) P.StatusBar.hide(); } catch (e) {} }
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (state === 'play' && G && !G.clear) { state = 'pause'; sel = 0; } if (AC) AC.suspend().catch(() => {}); }
  else if (AC) AC.resume().catch(() => {});
});

// ---------- audio ----------
let AC = null;
function initAudio() { if (AC) return; try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
function beep(f, d, type = 'square', v = 0.05, slide = 0, delay = 0) {
  if (!AC || !SETTINGS.sound) return;
  try {
    const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + 0.02);
  } catch (e) {}
}
const SFX = {
  jump: () => beep(300, 0.16, 'square', 0.035, 620),
  coin: () => { beep(988, 0.07, 'square', 0.035); beep(1319, 0.16, 'square', 0.035, 0, 0.06); },
  stomp: () => beep(220, 0.14, 'triangle', 0.09, 70),
  bump: () => beep(130, 0.08, 'triangle', 0.08),
  brk: () => beep(180, 0.18, 'sawtooth', 0.04, 50),
  die: () => beep(520, 0.6, 'square', 0.045, 70),
  move: () => beep(660, 0.05, 'square', 0.025),
  ok: () => { beep(660, 0.06, 'square', 0.03); beep(990, 0.1, 'square', 0.03, 0, 0.06); },
  check: () => [523, 659, 784].forEach((f, i) => beep(f, 0.12, 'square', 0.035, 0, i * 0.08)),
  clear: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => beep(f, i === 5 ? 0.5 : 0.14, 'square', 0.04, 0, i * 0.12)),
  start: () => beep(880, 0.12, 'square', 0.03),
  dash: () => beep(900, 0.14, 'sawtooth', 0.03, 300),
  swing: () => beep(500, 0.1, 'triangle', 0.06, 180),
  clang: () => { beep(1200, 0.12, 'square', 0.03, 900); beep(300, 0.1, 'triangle', 0.06, 0, 0.02); },
  spit: () => beep(700, 0.08, 'square', 0.03, 1100),
  slam: () => { beep(90, 0.35, 'sawtooth', 0.08, 40); beep(60, 0.3, 'triangle', 0.1, 30, 0.03); },
  web: () => beep(260, 0.12, 'triangle', 0.05, 520),
  toss: () => beep(400, 0.12, 'triangle', 0.05, 200),
  shatter: () => beep(1500, 0.1, 'square', 0.025, 600),
  boss: () => [196, 185, 175, 147].forEach((f, i) => beep(f, 0.25, 'sawtooth', 0.04, 0, i * 0.2)),
  bossHit: () => { beep(160, 0.2, 'square', 0.06, 60); beep(800, 0.06, 'square', 0.03); }
};
