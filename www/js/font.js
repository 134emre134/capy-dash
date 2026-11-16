'use strict';
// =====================================================================
// 5x7 bitmap pixel font (works offline, includes German + Turkish letters).
// Text is drawn at full resolution on the main canvas after the pixel scene.
// =====================================================================
const GLYPHS = {
  A: '01110 10001 10001 11111 10001 10001 10001', B: '11110 10001 10001 11110 10001 10001 11110',
  C: '01110 10001 10000 10000 10000 10001 01110', D: '11110 10001 10001 10001 10001 10001 11110',
  E: '11111 10000 10000 11110 10000 10000 11111', F: '11111 10000 10000 11110 10000 10000 10000',
  G: '01110 10001 10000 10111 10001 10001 01111', H: '10001 10001 10001 11111 10001 10001 10001',
  I: '01110 00100 00100 00100 00100 00100 01110', J: '00111 00010 00010 00010 00010 10010 01100',
  K: '10001 10010 10100 11000 10100 10010 10001', L: '10000 10000 10000 10000 10000 10000 11111',
  M: '10001 11011 10101 10101 10001 10001 10001', N: '10001 11001 10101 10011 10001 10001 10001',
  O: '01110 10001 10001 10001 10001 10001 01110', P: '11110 10001 10001 11110 10000 10000 10000',
  Q: '01110 10001 10001 10001 10101 10010 01101', R: '11110 10001 10001 11110 10100 10010 10001',
  S: '01111 10000 10000 01110 00001 00001 11110', T: '11111 00100 00100 00100 00100 00100 00100',
  U: '10001 10001 10001 10001 10001 10001 01110', V: '10001 10001 10001 10001 10001 01010 00100',
  W: '10001 10001 10001 10101 10101 10101 01010', X: '10001 10001 01010 00100 01010 10001 10001',
  Y: '10001 10001 01010 00100 00100 00100 00100', Z: '11111 00001 00010 00100 01000 10000 11111',
  0: '01110 10011 10101 10101 11001 10001 01110', 1: '00100 01100 00100 00100 00100 00100 01110',
  2: '01110 10001 00001 00110 01000 10000 11111', 3: '11110 00001 00001 01110 00001 00001 11110',
  4: '00010 00110 01010 10010 11111 00010 00010', 5: '11111 10000 11110 00001 00001 10001 01110',
  6: '00110 01000 10000 11110 10001 10001 01110', 7: '11111 00001 00010 00100 01000 01000 01000',
  8: '01110 10001 10001 01110 10001 10001 01110', 9: '01110 10001 10001 01111 00001 00010 01100',
  '.': '00000 00000 00000 00000 00000 01100 01100', ',': '00000 00000 00000 00000 01100 00100 01000',
  ':': '00000 01100 01100 00000 01100 01100 00000', '!': '00100 00100 00100 00100 00100 00000 00100',
  '?': '01110 10001 00001 00010 00100 00000 00100', '-': '00000 00000 00000 11111 00000 00000 00000',
  '+': '00000 00100 00100 11111 00100 00100 00000', '/': '00001 00010 00010 00100 01000 01000 10000',
  '(': '00010 00100 01000 01000 01000 00100 00010', ')': '01000 00100 00010 00010 00010 00100 01000',
  "'": '00100 00100 01000 00000 00000 00000 00000', '%': '11001 11010 00010 00100 01000 01011 10011',
  '&': '01100 10010 10100 01000 10101 10010 01101', '=': '00000 00000 11111 00000 11111 00000 00000',
  '·': '00000 00000 00000 00100 00000 00000 00000', '×': '00000 10001 01010 00100 01010 10001 00000',
  '←': '00000 00100 01000 11111 01000 00100 00000', '→': '00000 00100 00010 11111 00010 00100 00000',
  '↑': '00100 01110 10101 00100 00100 00100 00000', '↓': '00000 00100 00100 00100 10101 01110 00100',
  '▲': '00000 00100 00100 01110 01110 11111 00000', '▼': '00000 11111 01110 01110 00100 00100 00000',
  '◀': '00001 00011 00111 01111 00111 00011 00001', '▶': '10000 11000 11100 11110 11100 11000 10000',
  '‖': '00000 11011 11011 11011 11011 11011 00000', '"': '01010 01010 00000 00000 00000 00000 00000'
};
const MARKS = { uml: [[-2, '01010']], dot: [[-2, '00100']], breve: [[-3, '10001'], [-2, '01110']], ced: [[7, '00100'], [8, '01100']] };
const COMPOSE = { 'Ä': ['A', 'uml'], 'Ö': ['O', 'uml'], 'Ü': ['U', 'uml'], 'Ç': ['C', 'ced'], 'Ş': ['S', 'ced'], 'Ğ': ['G', 'breve'], 'İ': ['I', 'dot'] };
const GCACHE = {};
function glyphPixels(ch) {
  if (GCACHE[ch]) return GCACHE[ch];
  const px = [];
  const addRows = (rows, y0) => rows.forEach((r, y) => { for (let x = 0; x < 5; x++) if (r[x] === '1') px.push([x, y + y0]); });
  const comp = COMPOSE[ch];
  const base = GLYPHS[comp ? comp[0] : ch];
  if (base) addRows(base.split(' '), 0);
  if (comp) for (const [y, r] of MARKS[comp[1]]) addRows([r], y);
  return (GCACHE[ch] = px);
}
function upper(s) { return String(s).toLocaleUpperCase(SETTINGS.lang === 'tr' ? 'tr-TR' : 'en-US'); }
// logical width of a string at a given size
// (matches drawText: glyph pixels are rounded to whole device pixels)
function textWidth(s, size) { const n = [...upper(s)].length, k = C.width / VW; return n ? (n * 6 - 1) * Math.max(1, Math.round(size / 8 * k)) / k : 0; }

const TCACHE = new Map();
function textCanvas(str, u, col, shadow, outline) {
  const key = str + '|' + u + '|' + col + '|' + shadow + '|' + outline;
  let c = TCACHE.get(key); if (c) return c;
  if (TCACHE.size > 600) TCACHE.clear();
  const chars = [...str], pad = (outline ? u : 0), sh = shadow ? u : 0;
  const w = Math.max(1, chars.length * 6 * u + pad * 2 + sh), h = 12 * u + pad * 2 + sh;
  c = mkCanvas(w, h); const x = c.getContext('2d');
  const paint = (color, ox, oy, grow) => {
    x.fillStyle = color;
    chars.forEach((ch, i) => { for (const [gx, gy] of glyphPixels(ch)) x.fillRect(pad + ox + (i * 6 + gx) * u - grow, pad + oy + (gy + 3) * u - grow, u + grow * 2, u + grow * 2); });
  };
  if (outline) paint(outline, 0, 0, u);
  if (shadow) paint('#1b1530', sh, sh, 0);
  paint(col, 0, 0, 0);
  c.pad = pad;
  TCACHE.set(key, c); return c;
}
// draws immediately on the main canvas (device pixels); y is the vertical middle of the caps
function drawText(s, x, y, size, col = '#fff', align = 'left', shadow = false, outline = null) {
  const str = upper(s); if (!str) return;
  const k = C.width / VW, u = Math.max(1, Math.round(size / 8 * k));
  const cv = textCanvas(str, u, col, shadow, outline), w = ([...str].length * 6 - 1) * u;
  let dx = x * k; if (align === 'center') dx -= w / 2; else if (align === 'right') dx -= w;
  const dy = Math.round(y * k - 3.5 * u) - 3 * u - cv.pad;
  XM.setTransform(1, 0, 0, 1, 0, 0);
  XM.drawImage(cv, Math.round(dx) - cv.pad, dy);
}
// word-wrap into lines that fit maxW logical px at a given size
function wrapText(s, size, maxW) {
  const words = String(s).split(' '), lines = []; let cur = '';
  for (const w of words) { const tryS = cur ? cur + ' ' + w : w; if (textWidth(tryS, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = tryS; }
  if (cur) lines.push(cur); return lines;
}
