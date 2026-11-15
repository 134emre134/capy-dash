'use strict';
// =====================================================================
// Pixel sprites (hand-made, drawn 1 sprite pixel = 1 low-res pixel)
// =====================================================================
function makeSprite(rows, legend, mirror = false) {
  if (mirror) rows = rows.map(r => r + [...r].reverse().join(''));
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const mk = (flip, flash) => {
    const c = mkCanvas(w, h), x = c.getContext('2d');
    rows.forEach((r, y) => { for (let i = 0; i < r.length; i++) { const col = legend[r[i]]; if (!col) continue; x.fillStyle = flash ? '#ffffff' : col; x.fillRect(flip ? w - 1 - i : i, y, 1, 1); } });
    return c;
  };
  return { w, h, r: mk(false), l: mk(true), f: mk(false, true) };
}
function drawSpr(s, cx, bottom, face = 1, sc = 1, flash = false) {
  const w = s.w * PX * sc, h = s.h * PX * sc;
  X.drawImage(flash ? s.f : face < 0 ? s.l : s.r, snap(cx - w / 2), snap(bottom - h), w, h);
}
const heroSet = (top, legs, legend) => ({ stand: makeSprite(top.concat(legs[0]), legend), walk: makeSprite(top.concat(legs[1]), legend), air: makeSprite(top.concat(legs[2]), legend) });

const HERO = {
  capy: heroSet([
    '..............gg......',
    '............rrg.......',
    '...........ryrrr......',
    '...........rrrrr......',
    '..........hkkkkkkk....',
    '...kkkkkkkkbbbbbbbk...',
    '..kbbbbbbbbbbbbbbbbk..',
    '.kblllllllbbbbbbbwek..',
    '.kbbbbbbbbbbbbbbbeebk.',
    '.kbbbbbbbbbbbbbbbbbddk',
    '.kbbbbbbbbbbbbbbbbddnk',
    '.kbbbbbbbbbbbbbbbbdddk',
    '.kbbbbbbbbbbbbbbbkkkk.',
    '..kblllllllllbbbk.....'], [
    ['..kfk.kfk...kfk.kfk...', '..kfk.kfk...kfk.kfk...', '..kkk.kkk...kkk.kkk...'],
    ['.kfk...kfk.kfk...kfk..', '.kfk...kfk.kfk...kfk..', '.kk.....kk.kk.....kk..'],
    ['...kfk.kfk..kfk.kfk...', '...kkk.kkk..kkk.kkk...', '......................']],
    { k: '#4b2f17', b: '#9c6b3b', l: '#b98a5a', d: '#7a5230', e: '#1a1a1a', w: '#ffffff', n: '#2a1a0e', r: '#ff9a1f', y: '#ffc66b', g: '#3fa34a', f: '#5e3b1e', h: '#6b4423' }),
  owl: heroSet([
    '..k.......k..',
    '.kbk.....kbk.',
    '.kbbkkkkkbbk.',
    'kbbbbbbbbbbbk',
    'kbwwwbbbwwwbk',
    'kwwyewbwwyewk',
    'kwwyywowwyywk',
    'kbwwwbobwwwbk',
    'kbbbbbbbbbbbk',
    'kdbcccccccbdk',
    'kdbcvcvcvcbdk',
    'kddcccccccddk',
    '.kdcvcvcvcdk.'], [
    ['..kkkkkkkkk..', '...oo...oo...', '..ooo..ooo...'],
    ['..kkkkkkkkk..', '..oo.....oo..', '.ooo....ooo..'],
    ['.dkkkkkkkkkd.', 'dd..o...o..dd', '....o...o....']],
    { k: '#3b2a1e', b: '#9c6b3b', w: '#fdf6e3', y: '#ffd23a', e: '#1a1a1a', o: '#ff9a1f', d: '#6b4423', c: '#ece3d0', v: '#b98a5a' }),
  mole: heroSet([
    '.....kkkkkk.......',
    '....kyyyyyylk.....',
    '...kyyyyyyylk.....',
    '...kyyyyyyyyk.....',
    '..kYYYYYYYYYYk....',
    '..kmmmmmmmmmmk....',
    '.kmmmmmmmkkmmmk...',
    '.kmmmmmmmmmmpppk..',
    '.kmmmmmmmmcpppppnk',
    '.kmmmmmmmmmmpppk..',
    '.kmmmMMMMMmmmkk...',
    '.kmmMMMMMMMmppk...',
    '.kmmmMMMMMmpppk...',
    '..kmmmmmmmmkkk....'], [
    ['.kppk....kppk.....', '.kkkk....kkkk.....'],
    ['..kppk..kppk......', '..kkkk..kkkk......'],
    ['..kpk....kpk......', '..kk......kk......']],
    { k: '#2b1a40', m: '#5d4b63', M: '#7f6b86', p: '#f2b4bb', n: '#e05a74', y: '#ffcc2e', Y: '#e0a800', l: '#fff8c0', c: '#ff9fb0' }),
  coon: heroSet([
    '...kk......kk....',
    '..kgGk....kGgk...',
    '..kgggkkkkgggk...',
    '..kgggggggggggk..',
    '.kggkkkkgkkkkggk.',
    '.kgkkwekkkwekkgk.',
    '.kggkkkkgkkkkggk.',
    '..kgwwwwwwwwwnk..',
    '...kkwwwwwwwkk...',
    'kk..kgggggggk....',
    'kGk.kggwwwggk....',
    'kgGkkgwwwwwgk....',
    '.kGgkgwwwwwgk....'], [
    ['..kkgggggggk.....', '....kGGk.kGGk....', '....kkkk.kkkk....'],
    ['..kkgggggggk.....', '...kGGk...kGGk...', '...kkkk...kkkk...'],
    ['..kkgggggggk.....', '....kGk...kGk....', '....kk.....kk....']],
    { k: '#1c1c24', g: '#8a8f9c', G: '#5f6672', w: '#e4e8ee', e: '#1a1a1a', n: '#1a1a1a' })
};
const PAN = makeSprite([
  '.......kkkkk.',
  '......kpppppk',
  'hhhhhhkpqpppk',
  '......kpppppk',
  '.......kkkkk.'], { h: '#7a5230', k: '#1c1c24', p: '#5f6672', q: '#b4bcc8' });
const BEETLE_LEG = { k: '#2b1a40', p: '#6a43a3', P: '#4a2d77', s: '#9d7bd6', w: '#ffffff', e: '#1a1a1a' };
const BEETLE_TOP = [
  '....kkkkkk......',
  '..kkppppppkk....',
  '.kpssppppPppk...',
  '.kpsppppPpppkkk.',
  'kppppppPppppkwwk',
  'kpppppppPppkwekk',
  'kkkkkkkkkkkkkkk.'];
const BEETLE = [makeSprite(BEETLE_TOP.concat(['.k..k...k..k....', 'k..k...k..k.....']), BEETLE_LEG),
                makeSprite(BEETLE_TOP.concat(['..k..k...k..k...', '..k..k...k..k...']), BEETLE_LEG)];
const BEETLE_FLAT = makeSprite(['..kkkkkkkkkkkk..', '.kppppPpppppppk.', 'kkkkkkkkkkkkkkkk'], BEETLE_LEG);
const COINL = { o: '#b8860b', y: '#ffd23a', l: '#fff3a1' };
const COIN = [
  makeSprite(['..oooo..', '.oyyyyo.', 'oyyllyyo', 'oylyyyyo', 'oylyyyyo', 'oylyyyyo', 'oylyyyyo', 'oylyyyyo', 'oyyyyyyo', '.oyyyyo.', '..oooo..'], COINL),
  makeSprite(['.ooo.', 'oyyyo', 'oylyo', 'oylyo', 'oylyo', 'oylyo', 'oylyo', 'oylyo', 'oyyyo', 'oyyyo', '.ooo.'], COINL),
  makeSprite(['.o.', 'oyo', 'oyo', 'oyo', 'oyo', 'oyo', 'oyo', 'oyo', 'oyo', 'oyo', '.o.'], COINL)];
const COIN_SEQ = [0, 1, 2, 1];
const STAR = makeSprite(['....ll....', '....ll....', '...llll...', 'llllllllll', '.llllllll.', '..llllll..', '..llllll..', '.lll..lll.', '.ll....ll.'], { l: '#fff4c2' });
const CLOUD_ROWS = ['......wwww..........', '....wwwwwwww..ww....', '..wwwwwwwwwwwwwwww..', '.wwwwwwwwwwwwwwwwwww', 'wwwwwwwwwwwwwwwwwwww', '.bbbbbbbbbbbbbbbbbb.'];
const CLOUD = makeSprite(CLOUD_ROWS, { w: '#ffffff', b: '#d6f2ff' });
const CLOUD_N = makeSprite(CLOUD_ROWS, { w: '#3a2f5c', b: '#2a2140' });
const SPIDER = makeSprite([
  '........kkkkkk',
  '......kkbbbbbb',
  '.....kbbbbsbbb',
  '....kbbbbssbbb',
  '....kbbbbbsbbb',
  '....kbbbbbbbhh',
  '....kbbbbbbbbh',
  '.....kbbbbbbhh',
  '......kkbbbbbb',
  '........kBBBBB',
  '.......kBBBBBB',
  '.......kBrBBrR',
  '.......kBBBBBB',
  '........kBBBBB',
  '.........kkkkk'], { k: '#1c1c24', b: '#6a43a3', B: '#4a2d77', s: '#9d7bd6', h: '#e94b5a', r: '#e94b5a', R: '#ff5d73' }, true);
const WEB = makeSprite(['.w..w.', 'w.ww.w', '.wwww.', '.wwww.', 'w.ww.w', '.w..w.'], { w: '#e4e8ee' });

const BEETLE_FROST_LEG = { k: '#1f3a5c', p: '#4f8fd1', P: '#2e5c9c', s: '#a8d8f8', w: '#ffffff', e: '#1a1a1a' };
const BEETLE_FROST = [makeSprite(BEETLE_TOP.concat(['.k..k...k..k....', 'k..k...k..k.....']), BEETLE_FROST_LEG),
                      makeSprite(BEETLE_TOP.concat(['..k..k...k..k...', '..k..k...k..k...']), BEETLE_FROST_LEG)];
const BEETLE_FROST_FLAT = makeSprite(['..kkkkkkkkkkkk..', '.kppppPpppppppk.', 'kkkkkkkkkkkkkkkk'], BEETLE_FROST_LEG);
const CLOUD_S = makeSprite(CLOUD_ROWS, { w: '#e8f1fa', b: '#c6d8ee' });
// Ays' spit shot
const SEED = makeSprite(['.yyy.', 'yllyy', 'yyyyo', '.ooo.'], { y: '#ffd23a', l: '#fff3a1', o: '#e0a800' });
const SNOWBALL = makeSprite(['.wwww.', 'wwwwwd', 'wwwwwd', 'wwwwdd', 'dwwddd', '.dddd.'], { w: '#ffffff', d: '#b2e2fa' });
const ICICLE = makeSprite(['kkkkkk', 'kwiiik', 'kwiiik', '.kwiik', '.kwiik', '.kwik.', '..wik.', '..wik.', '..kk..', '..kk..', '...k..'],
  { k: '#4f8fd1', w: '#ffffff', i: '#a8d8f8' });
// Grimfrost, the evil snowman (left half, mirrored)
const SNOWMAN = makeSprite([
  '........kkkkkkk',
  '........kssssss',
  '........kssssss',
  '........kssssss',
  '........krrrrrr',
  '.....kkkkssssss',
  '.....kkkkkkkkkk',
  '........kkkkkkk',
  '......kkwwwwwww',
  '.....kwwwwwwwww',
  '.....kwwccwwwww',
  '....kwwwwwccwww',
  '....kwwwwrrwwww',
  '....kwwwwrrwwoo',
  '....kwwwwwwwwoo',
  '....kwwwwwwwccw',
  '....kwwwwwccwww',
  '.....kwwccwwwww',
  '......kwwwwwwww',
  '.......kkwwwwww',
  '.....kkwwwwwwww',
  '....kwwwwwwwwww',
  '...kwwwwwwwwwww',
  '..kwwwwwwwwwwcc',
  '..kwwwwwwwwwwww',
  '..kwwwwwwwwwwww',
  '..kdwwwwwwwwwcc',
  '..kddwwwwwwwwww',
  '...kddwwwwwwwww',
  '....kkdwwwwwwww',
  '...kkwwwwwwwwww',
  '..kwwwwwwwwwwww',
  '.kwwwwwwwwwwwcc',
  'kwwwwwwwwwwwwww',
  'kwwwwwwwwwwwwww',
  'kdwwwwwwwwwwwww',
  'kdwwwwwwwwwwwww',
  'kddwwwwwwwwwwww',
  'kddwwwwwwwwwwww',
  '.kdddwwwwwwwwww',
  '.kddddwwwwwwwww',
  '..kkdddddddwwww',
  '...kkkkkkkkkkkk'], { k: '#2e3d5c', w: '#ffffff', d: '#b2e2fa', s: '#2a2140', r: '#e94b5a', c: '#1c1c24', o: '#ff9a1f' }, true);

// =====================================================================
// Tiles: 20x20 low-res pixel tiles per theme (0 day, 1 night, 2 snow)
// =====================================================================
function tileSet(theme) {
  const night = theme === 1, snow = theme === 2;
  const S = {}, mk = fn => { const c = mkCanvas(20, 20), x = c.getContext('2d'); fn((col, a, b, w = 1, h = 1) => { x.fillStyle = col; x.fillRect(a, b, w, h); }, x); return c; };
  const dirt = snow ? '#4a5a7a' : night ? '#5e3b1e' : '#8a5a34', speck = snow ? '#3a4a68' : night ? '#4b2f17' : '#74492a';
  const cap = f => { f('#ffffff', 0, 0, 20, 3); f('#d6f2ff', 0, 3, 20, 1); f('#d6f2ff', 3, 4, 2, 1); f('#d6f2ff', 13, 4, 3, 1); };
  for (let v = 0; v < 3; v++) for (const top of [0, 1]) S['g' + top + v] = mk(f => {
    f(dirt, 0, 0, 20, 20);
    [[3, 8], [12, 5], [7, 14], [16, 12], [2, 17], [14, 17]].forEach(([a, b], i) => { if ((i + v) % 2 === 0) f(speck, a, b, 2, 2); });
    if (top && snow) {
      f('#ffffff', 0, 0, 20, 5); f('#d6f2ff', 0, 5, 20, 1);
      for (let i = v; i < 20; i += 4) f('#d6f2ff', i, 6, 2, 1);
      for (let i = v * 2; i < 20; i += 7) f('#e8f1fa', i, 1, 2, 1);
    } else if (top) {
      f(night ? '#2f7a35' : '#4fc04c', 0, 0, 20, 5); f(night ? '#1f4a2a' : '#3a9a3a', 0, 5, 20, 1);
      for (let i = 0; i < 20; i += 3) if ((i + v) % 2) f(night ? '#1f4a2a' : '#3a9a3a', i, 6, 2, 1);
      f(night ? '#3e9a44' : '#6ad866', 0, 0, 20, 1); for (let i = v; i < 20; i += 5) f(night ? '#3e9a44' : '#6ad866', i, 1, 1, 1);
    }
  });
  S.X = mk(f => { f(night ? '#2a2140' : '#5f6672', 0, 0, 20, 20); f(night ? '#8a8f9c' : '#b4bcc8', 0, 0, 19, 19); f(night ? '#6b7380' : '#939baa', 1, 1, 18, 18); f(night ? '#5f6672' : '#7d8594', 3, 3, 2, 2); f(night ? '#5f6672' : '#7d8594', 15, 15, 2, 2); if (snow) cap(f); });
  S.B = mk(f => { const m = night ? '#5e2a10' : '#7a3412'; f(night ? '#a8501f' : '#c8642f', 0, 0, 20, 20); f(night ? '#c8642f' : '#e07a40', 0, 0, 20, 1); f(m, 0, 9, 20, 1); f(m, 0, 19, 20, 1); f(m, 9, 0, 1, 9); f(m, 4, 10, 1, 9); f(m, 14, 10, 1, 9); if (snow) cap(f); });
  for (const k of [0, 1]) S['Q' + k] = mk((f, x) => { f('#a8670f', 0, 0, 20, 20); f(k ? '#ffcc2e' : '#f2b233', 1, 1, 18, 18); [[2, 2], [17, 2], [2, 17], [17, 17]].forEach(([a, b]) => f('#a8670f', a, b)); x.drawImage(STAR.r, 5, 5); });
  S.U = mk(f => { f('#5e3d1f', 0, 0, 20, 20); f('#9b6b3f', 1, 1, 18, 18); [[2, 2], [17, 2], [2, 17], [17, 17]].forEach(([a, b]) => f('#5e3d1f', a, b)); });
  S['^'] = mk(f => { f('#6b7380', 1, 17, 18, 3); for (let i = 0; i < 3; i++) { const x0 = 1 + i * 6; for (let r = 0; r < 9; r++) { const hw = Math.ceil((r + 1) * 3 / 9); f(snow ? '#d6f2ff' : '#e4e8ee', x0 + 3 - hw, 8 + r, hw, 1); f(snow ? '#8fd3f4' : '#a3abb8', x0 + 3, 8 + r, hw, 1); } } });
  S.G = mk(f => { for (const x of [1, 6, 11, 16]) { f('#5f6672', x, 0, 3, 20); f('#b4bcc8', x, 0, 1, 20); } f('#5f6672', 0, 3, 20, 2); f('#5f6672', 0, 15, 20, 2); f('#b4bcc8', 0, 3, 20, 1); f('#b4bcc8', 0, 15, 20, 1); });
  // slippery ice
  S.I = mk(f => { f('#4f8fd1', 0, 0, 20, 20); f('#8fd3f4', 0, 0, 19, 19); f('#d6f2ff', 0, 0, 19, 2); f('#d6f2ff', 0, 0, 2, 19); for (let i = 0; i < 6; i++) { f('#ffffff', 5 + i, 12 - i); f('#ffffff', 11 + i, 15 - i); } });
  return S;
}
const TILES = [tileSet(0), tileSet(1), tileSet(2)];
