/* Koruna z popela – ink toolkit in the manner of Frank Miller: black masses, paper light, one spot colour.
   Portraits (big faces for dialogue) and figures (silhouettes with rim light) are drawn from parameters. */
window.T = window.T || {};
(function (T) {
  'use strict';
  const PI = Math.PI;
  const rnd = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  T.rnd = rnd; T.hash = hash;

  /* Palettes. noir = Sin City, 300 = ochre dawn with red capes, blue = The Dark Knight Returns cold wash. */
  const PALS = {
    noir: { paper: '#ece6d6', ink: '#0a0909', spot: '#c3121c', spot2: '#e8c81a', mid: null },
    blood: { paper: '#e9e2d0', ink: '#0a0909', spot: '#c3121c', spot2: '#e8c81a', mid: null },
    gold: { paper: '#ece6d6', ink: '#0a0909', spot: '#e3b419', spot2: '#c3121c', mid: null },
    fire: { paper: '#efe2c4', ink: '#0b0806', spot: '#e0561a', spot2: '#f2c230', mid: null },
    s300: { paper: '#f1e3bf', ink: '#120c07', spot: '#a8141a', spot2: '#d9a441', mid: '#b98a4e', sky0: '#f6ecd0', sky1: '#d6a764' },
    blue: { paper: '#dfe4e6', ink: '#0a0c10', spot: '#c3121c', spot2: '#e8c81a', mid: '#6e8796', sky0: '#cdd8dc', sky1: '#7d97a6' },
    ember: { paper: '#e8dccb', ink: '#0a0807', spot: '#e0561a', spot2: '#c3121c', mid: null },
    teal: { paper: '#e2e6e0', ink: '#070a0a', spot: '#3fb5a8', spot2: '#c3121c', mid: null }
  };
  T.PALS = PALS;
  T.pal = PALS.noir;
  T.setPal = k => { T.pal = PALS[k] || PALS.noir; return T.pal; };

  /* ---------- path helpers ---------- */
  function poly(g, pts, close = true) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); if (close) g.closePath(); }
  function smooth(g, pts, close = true) {
    const n = pts.length; g.beginPath();
    if (!close) { g.moveTo(pts[0][0], pts[0][1]); }
    const at = i => pts[(i + n) % n];
    if (close) { const a = at(0), b = at(1); g.moveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); for (let i = 1; i <= n; i++) { const p = at(i), q = at(i + 1); g.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } g.closePath(); }
    else { for (let i = 1; i < n - 1; i++) { const p = pts[i], q = pts[i + 1]; g.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } g.lineTo(pts[n - 1][0], pts[n - 1][1]); }
  }
  function jag(g, x1, y1, x2, y2, amp, n, r) { g.moveTo(x1, y1); for (let i = 1; i < n; i++) { const k = i / n; g.lineTo(x1 + (x2 - x1) * k + (r() - .5) * amp, y1 + (y2 - y1) * k + (r() - .5) * amp); } g.lineTo(x2, y2); }
  function slash(g, x, y, len, ang, w, col) { /* a tapered brush stroke */
    const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
    g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x + dx * len * .5 + nx * w, y + dy * len * .5 + ny * w, x + dx * len, y + dy * len);
    g.quadraticCurveTo(x + dx * len * .5 - nx * w * .3, y + dy * len * .5 - ny * w * .3, x, y);
    g.fillStyle = col; g.fill();
  }
  T.poly = poly; T.smooth = smooth; T.jag = jag; T.slash = slash;

  /* ---------- paper grain, splatter, weather ---------- */
  let grainCv = null;
  function grain(g, w, h, a = .1) {
    if (!grainCv) {
      grainCv = document.createElement('canvas'); grainCv.width = 256; grainCv.height = 256;
      const c = grainCv.getContext('2d'), id = c.createImageData(256, 256), r = rnd(7);
      for (let i = 0; i < id.data.length; i += 4) { const v = r() < .5 ? 0 : 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = r() * 60; }
      c.putImageData(id, 0, 0);
    }
    g.save(); g.globalAlpha = a; g.fillStyle = g.createPattern(grainCv, 'repeat'); g.fillRect(0, 0, w, h); g.restore();
  }
  function splatter(g, x, y, rad, n, col, seed) {
    const r = rnd(seed || 9); g.fillStyle = col;
    for (let i = 0; i < n; i++) { const a = r() * PI * 2, d = Math.pow(r(), 1.7) * rad, s = (1 - d / rad) * 4 * r() + .6; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * .7, s, 0, PI * 2); g.fill(); }
  }
  function rain(g, w, h, t, dens = 1, col = 'rgba(236,230,214,.55)', slant = .22) {
    const r = rnd(31), n = Math.floor(160 * dens); g.strokeStyle = col; g.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const sp = 900 + r() * 700, len = 18 + r() * 34, x0 = r() * (w + 200) - 100, y0 = r() * h;
      const y = (y0 + t * sp) % (h + 60) - 30, x = x0 + (y * slant) - (t * sp * slant) % 0;
      g.lineWidth = r() < .2 ? 2 : 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x - len * slant, y - len); g.stroke();
    }
  }
  function snow(g, w, h, t, dens = 1, col = 'rgba(240,236,226,.9)') {
    const r = rnd(41), n = Math.floor(120 * dens); g.fillStyle = col;
    for (let i = 0; i < n; i++) { const sp = 30 + r() * 60, s = 1 + r() * 3, x0 = r() * w, y0 = r() * h; const y = (y0 + t * sp) % h, x = x0 + Math.sin(t * .8 + i) * 14; g.beginPath(); g.arc(x, y, s, 0, PI * 2); g.fill(); }
  }
  function embers(g, w, h, t, x0 = 0, x1 = w, col) {
    const r = rnd(51); col = col || T.pal.spot;
    for (let i = 0; i < 70; i++) {
      const sp = 40 + r() * 90, life = h * .8, x = x0 + r() * (x1 - x0) + Math.sin(t * 2 + i) * 18, y = h - ((r() * life + t * sp) % life);
      g.globalAlpha = Math.min(1, (y / h) * 1.4); g.fillStyle = r() < .4 ? T.pal.spot2 : col; g.fillRect(x, y, 2 + r() * 2, 2 + r() * 2);
    }
    g.globalAlpha = 1;
  }
  function fog(g, w, h, t, y, a = .35, col = '236,230,214') {
    for (let i = 0; i < 4; i++) {
      const yy = y + i * 22, off = (t * (12 + i * 6)) % w;
      const gr = g.createLinearGradient(0, yy - 40, 0, yy + 40); gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(.5, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr; g.save(); g.translate(-off, 0);
      g.beginPath(); for (let x = 0; x <= w * 2 + 40; x += 40) g.lineTo(x, yy + Math.sin(x * .01 + i) * 14 - 40); for (let x = w * 2 + 40; x >= 0; x -= 40) g.lineTo(x, yy + Math.sin(x * .013 + i) * 12 + 40); g.fill(); g.restore();
    }
  }
  function lightning(g, w, h, t, seed) { /* returns flash strength 0..1 and draws the bolt when on */
    const cyc = (t + (seed || 0)) % 9; if (cyc > .35) return 0;
    const r = rnd(Math.floor((t + (seed || 0)) / 9) + 3); let x = w * (.2 + r() * .6), y = 0;
    g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y);
    while (y < h * .55) { x += (r() - .5) * 60; y += 20 + r() * 30; g.lineTo(x, y); }
    g.stroke(); return cyc < .12 ? 1 : .5;
  }
  T.grain = grain; T.splatter = splatter; T.rain = rain; T.snow = snow; T.embers = embers; T.fog = fog; T.lightning = lightning;

  /* ======================= PORTRAITS ======================= */
  /* Portrait space is 240 x 300. Light comes from side L (-1 = from the left). Everything on the far side of the
     terminator (eye socket, nose, cheek, jaw) is solid ink; the near side is paper (or the face's spot colour). */
  function headPath(g, cx, cy, s) {
    const hw = s.hw, jw = s.jaw, f = s.fem ? 1 : 0;
    const pts = [
      [cx, cy - 84], [cx + hw * .8, cy - 74], [cx + hw, cy - 40], [cx + hw * 1.02, cy - 6], [cx + hw * (.9 - .05 * f), cy + 26],
      [cx + hw * jw * .8, cy + 56], [cx + 14 - f * 4, cy + 80], [cx - 14 + f * 4, cy + 80], [cx - hw * jw * .8, cy + 56],
      [cx - hw * (.9 - .05 * f), cy + 26], [cx - hw * 1.02, cy - 6], [cx - hw, cy - 40], [cx - hw * .8, cy - 74]
    ];
    smooth(g, pts);
  }

  function portrait(g, P, o) {
    o = o || {}; const W = 240, H = 300, pal = T.pal, ink = pal.ink, paper = pal.paper;
    const t = o.t || 0, mood = o.mood || P.mood || 'n', talk = o.talk ? Math.abs(Math.sin(t * 14)) * (.6 + .4 * Math.sin(t * 5.3)) : 0;
    const L = P.light || -1; const r = rnd(hash(P.id || 'x'));
    g.save(); g.fillStyle = ink; g.fillRect(0, 0, W, H);
    // backdrop: a slab of spot colour or paper rain, Sin City style
    if (P.back === 'spot') { g.fillStyle = P.spotCol || pal.spot; g.beginPath(); g.arc(W / 2 + L * 60, 110, 120, 0, PI * 2); g.fill(); }
    else if (P.back === 'paper') { g.fillStyle = paper; poly(g, [[0, 0], [W, 0], [W, 120], [0, 210]]); g.fill(); }
    else if (P.back === 'bars') { g.fillStyle = paper; g.fillRect(0, 0, W, H); g.fillStyle = ink; for (let x = 10; x < W; x += 46) g.fillRect(x, 0, 16, H); g.fillRect(0, 60, W, 12); }
    else if (!P.back || P.back === 'slab') { // a lit wall behind the dark half, so the shadow side reads as a silhouette
      const sx = W / 2 - L * 20; g.fillStyle = paper; poly(g, [[sx, 0], [L < 0 ? W : 0, 0], [L < 0 ? W : 0, H], [sx - L * 70, H]]); g.fill();
      g.strokeStyle = ink; g.lineWidth = 2; const rr = rnd(hash(P.id || 'y') + 1); for (let i = 0; i < 26; i++) { const x = sx + (L < 0 ? 1 : -1) * rr() * 140, y = rr() * H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 8, y + 30); g.stroke(); }
    }
    else if (P.back === 'fire') { const gr = g.createRadialGradient(W / 2, H, 10, W / 2, H, 260); gr.addColorStop(0, pal.spot2); gr.addColorStop(.5, pal.spot); gr.addColorStop(1, ink); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    if (o.rain !== false && P.back !== 'bars') rain(g, W, H, t * .5, .25, 'rgba(236,230,214,.35)');

    const kind = P.kind || 'human';
    if (kind === 'squirrel') { squirrelP(g, P, t, mood, talk); return done(); }
    if (kind === 'goose') { gooseP(g, P, t, mood, talk); return done(); }
    if (kind === 'rat') { ratP(g, P, t, mood, talk); return done(); }
    if (kind === 'dragon') { dragonP(g, P, t, mood, talk); return done(); }
    if (kind === 'wolf' || kind === 'bones' || kind === 'ghoul' || kind === 'spider') { beastP(g, P, t, mood, talk); return done(); }

    const breathe = Math.sin(t * 1.6) * 1.5;
    const cx = 120 + (P.dx || 0), cy = 132 + breathe * .3;
    const s = { hw: (P.hw || 50), jaw: P.jaw || (P.fem ? .62 : .82), fem: !!P.fem };
    const skin = P.skin === 'yellow' ? pal.spot2 : P.skin === 'spot' ? pal.spot : paper;

    // shoulders and garment
    g.save(); g.translate(0, breathe);
    body(g, P, cx, cy, L, r);
    // neck
    g.fillStyle = ink; poly(g, [[cx - 24, cy + 40], [cx + 24, cy + 40], [cx + 28, cy + 120], [cx - 28, cy + 120]]); g.fill();
    g.fillStyle = skin; poly(g, [[cx + L * 4, cy + 84], [cx + L * 22, cy + 60], [cx + L * 27, cy + 112], [cx + L * 8, cy + 104]]); g.fill();
    g.fillStyle = ink; poly(g, [[cx - 26, cy + 64], [cx + 26, cy + 64], [cx + 18, cy + 92], [cx - 14, cy + 86]]); g.fill(); // jaw cast shadow
    collar(g, P, cx, cy, L, r);
    g.restore();

    // ears behind the head
    if (P.ears === 'elf') { [-1, 1].forEach(sd => { g.fillStyle = sd === L ? skin : ink; poly(g, [[cx + sd * (s.hw - 4), cy - 14], [cx + sd * (s.hw + 34), cy - 52], [cx + sd * (s.hw + 6), cy + 14]]); g.fill(); g.strokeStyle = ink; g.lineWidth = 2; g.stroke(); }); }
    else { [-1, 1].forEach(sd => { g.fillStyle = sd === L ? skin : ink; g.beginPath(); g.ellipse(cx + sd * (s.hw + 2), cy + 2, 9, 17, 0, 0, PI * 2); g.fill(); }); }
    if (P.horns) horns(g, P, cx, cy, L, s, 'back');

    // head plane
    headPath(g, cx, cy, s); g.fillStyle = skin; g.fill();
    g.save(); headPath(g, cx, cy, s); g.clip();
    if (P.scales) { g.strokeStyle = ink; g.lineWidth = 1.3; for (let y = cy - 70; y < cy + 80; y += 9) for (let x = cx - 70; x < cx + 70; x += 12) { const xx = x + ((y / 9) % 2) * 6; if (Math.abs(xx - cx) < 26 && y > cy - 30) continue; g.beginPath(); g.arc(xx, y, 6, .1, PI - .1); g.stroke(); } }
    // terminator: everything on the far side of the nose line is ink
    const sd = -L; const T0 = [
      [cx + sd * 6, cy - 92], [cx + sd * 10, cy - 58], [cx + sd * 4, cy - 30], [cx + sd * 12, cy - 22], [cx + sd * 4, cy - 6],
      [cx + sd * 1, cy + 18], [cx + sd * 10, cy + 26], [cx + sd * 26, cy + 30], [cx + sd * 14, cy + 44 + (mood === 'smile' ? -2 : 0)], [cx + sd * 10, cy + 58], [cx + sd * 4, cy + 74], [cx + sd * 2, cy + 90],
      [cx + sd * 120, cy + 90], [cx + sd * 120, cy - 92]
    ];
    g.fillStyle = ink; poly(g, T0); g.fill();
    // carved shadows on the lit half
    const ls = L; // lit side sign is L (light comes from L, so the lit half is x on L side)
    g.fillStyle = ink;
    // brow socket
    g.beginPath(); g.moveTo(cx + ls * 6, cy - 26); g.quadraticCurveTo(cx + ls * 22, cy - 34, cx + ls * 40, cy - 24); g.quadraticCurveTo(cx + ls * 26, cy - 22, cx + ls * 8, cy - 14); g.fill();
    // cheekbone hollow
    if (!P.fem || P.hard) { g.beginPath(); g.moveTo(cx + ls * (s.hw - 2), cy + 10); g.quadraticCurveTo(cx + ls * 30, cy + 26, cx + ls * 22, cy + 46); g.quadraticCurveTo(cx + ls * 34, cy + 24, cx + ls * (s.hw + 4), cy + 18); g.fill(); }
    // nostril and under-nose
    g.beginPath(); g.ellipse(cx + ls * 6, cy + 22, 5, 3, 0, 0, PI * 2); g.fill();
    // under lower lip
    g.beginPath(); g.moveTo(cx + ls * 10, cy + 54); g.quadraticCurveTo(cx, cy + 60, cx + ls * -6, cy + 54); g.quadraticCurveTo(cx + ls * 2, cy + 58, cx + ls * 10, cy + 54); g.fill();
    // age lines
    if (P.age > 0) {
      g.strokeStyle = ink; g.lineWidth = 1.6; g.lineCap = 'round';
      for (let i = 0; i < P.age * 3; i++) { const y = cy - 60 + i * 7; g.beginPath(); g.moveTo(cx + ls * 4, y); g.quadraticCurveTo(cx + ls * 22, y - 3, cx + ls * 40, y + 1); g.stroke(); }
      g.beginPath(); g.moveTo(cx + ls * 16, cy + 26); g.quadraticCurveTo(cx + ls * 26, cy + 40, cx + ls * 20, cy + 56); g.stroke();
      for (let i = 0; i < P.age * 2; i++) { g.beginPath(); g.moveTo(cx + ls * 40, cy - 12 + i * 4); g.lineTo(cx + ls * 50, cy - 16 + i * 6); g.stroke(); }
    }
    // stubble
    if (P.stubble) { g.fillStyle = ink; for (let i = 0; i < 160; i++) { const a = r() * PI, d = 30 + r() * 46; const x = cx + Math.cos(a) * d * .9 * (r() < .5 ? 1 : -1), y = cy + 30 + Math.sin(a) * d * .7; if (y > cy + 24) g.fillRect(x, y, 1.6, 1.6); } }
    g.restore();

    // a thin rim of light along the dark cheek and jaw
    g.save(); g.beginPath(); g.rect(L < 0 ? cx + 20 : 0, cy - 40, W / 2 - 20 + (L < 0 ? 0 : cx - 20 - W / 2 + 20), 140); g.clip(); headPath(g, cx, cy, s); g.strokeStyle = paper; g.lineWidth = 2; g.stroke(); g.restore();
    // eyes
    eyes(g, P, cx, cy, L, mood, t);
    // mouth
    mouth(g, P, cx, cy, L, mood, talk);
    // beard over the jaw
    if (P.beard) beard(g, P, cx, cy, L, s, r, talk);
    // scar
    if (P.scar) { g.lineCap = 'round'; g.strokeStyle = paper; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - L * 40, cy - 50); g.lineTo(cx - L * 8, cy + 20); g.stroke(); g.strokeStyle = ink; g.lineWidth = 2.5; g.beginPath(); g.moveTo(cx - L * 4, cy + 24); g.lineTo(cx + L * 10, cy + 44); g.stroke(); }
    // hair on top
    hair(g, P, cx, cy, L, s, r, t);
    if (P.horns) horns(g, P, cx, cy, L, s, 'front');
    if (P.crown) crown(g, P, cx, cy, s);
    if (P.hood) hood(g, P, cx, cy, L, s, r);
    if (P.mask) { g.fillStyle = paper; smooth(g, [[cx - 46, cy - 46], [cx + 46, cy - 46], [cx + 40, cy + 12], [cx, cy + 34], [cx - 40, cy + 12]]); g.fill(); g.fillStyle = ink; g.beginPath(); g.ellipse(cx - 20, cy - 12, 12, 6, -.2, 0, PI * 2); g.ellipse(cx + 20, cy - 12, 12, 6, .2, 0, PI * 2); g.fill(); g.fillStyle = pal.spot; g.beginPath(); g.arc(cx - 20, cy - 12, 3, 0, PI * 2); g.arc(cx + 20, cy - 12, 3, 0, PI * 2); g.fill(); g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy - 46); g.lineTo(cx, cy + 30); g.stroke(); }
    if (mood === 'dead') { g.fillStyle = 'rgba(10,9,9,.55)'; g.fillRect(0, 0, W, H); }
    return done();

    function done() { splatter(g, 30 + r() * 180, 260, 60, 30, ink, hash(P.id) + 3); grain(g, W, H, .12); g.restore(); }
  }

  function body(g, P, cx, cy, L, r) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper, b = P.body || 'coat', wide = P.fem ? 78 : 96;
    g.fillStyle = ink;
    smooth(g, [[cx - 30, cy + 70], [cx - wide, cy + 120], [cx - wide - 30, cy + 200], [cx - wide - 34, cy + 320], [cx + wide + 34, cy + 320], [cx + wide + 30, cy + 200], [cx + wide, cy + 120], [cx + 30, cy + 70]]);
    g.fill();
    // rim light along the lit shoulder
    g.strokeStyle = paper; g.lineWidth = 4; g.beginPath(); g.moveTo(cx + L * 34, cy + 76); g.quadraticCurveTo(cx + L * (wide + 4), cy + 110, cx + L * (wide + 30), cy + 200); g.lineTo(cx + L * (wide + 32), cy + 300); g.stroke();
    // folds as white slashes on the lit side
    for (let i = 0; i < 6; i++) slash(g, cx + L * (30 + r() * (wide - 10)), cy + 130 + r() * 120, 30 + r() * 50, PI / 2 + L * (.2 + r() * .3), 4 + r() * 3, paper);
    if (b === 'armor') { g.fillStyle = paper; [-1, 1].forEach(sd => { g.save(); g.beginPath(); g.ellipse(cx + sd * (wide - 10), cy + 112, 40, 22, sd * .4, PI, PI * 2); g.restore(); g.fillStyle = sd === L ? paper : ink; g.fill(); g.strokeStyle = sd === L ? ink : paper; g.lineWidth = 2; g.stroke(); }); g.strokeStyle = paper; g.lineWidth = 2; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(cx, cy + 160 + i * 30, 60, PI * 1.15, PI * 1.85); g.stroke(); } }
    if (b === 'dress' || b === 'gown') { g.strokeStyle = paper; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 44, cy + 110); g.quadraticCurveTo(cx, cy + 150, cx + 44, cy + 110); g.stroke(); if (P.dressCol) { g.fillStyle = P.dressCol === 'spot' ? pal.spot : P.dressCol; smooth(g, [[cx - 40, cy + 112], [cx + 40, cy + 112], [cx + wide + 20, cy + 320], [cx - wide - 20, cy + 320]]); g.fill(); g.fillStyle = ink; poly(g, [[cx - L * 6, cy + 120], [cx - L * (wide + 30), cy + 320], [cx - L * 20, cy + 320]]); g.fill(); } }
    if (b === 'robe') { g.strokeStyle = paper; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy + 90); g.lineTo(cx, cy + 300); g.stroke(); if (P.robeCol) { g.fillStyle = P.robeCol === 'spot2' ? pal.spot2 : pal.spot; poly(g, [[cx - 10, cy + 88], [cx + 10, cy + 88], [cx + 14, cy + 300], [cx - 14, cy + 300]]); g.fill(); } }
    if (P.cape) { g.fillStyle = P.cape === 'spot' ? pal.spot : ink; smooth(g, [[cx - wide + 6, cy + 100], [cx - wide - 40, cy + 200], [cx - wide - 50, cy + 320], [cx - wide + 10, cy + 320], [cx - wide + 20, cy + 160]]); g.fill(); smooth(g, [[cx + wide - 6, cy + 100], [cx + wide + 40, cy + 200], [cx + wide + 50, cy + 320], [cx + wide - 10, cy + 320], [cx + wide - 20, cy + 160]]); g.fill(); }
    if (P.fur) { g.fillStyle = paper; for (let i = 0; i < 26; i++) { const a = PI + i / 25 * PI; const x = cx + Math.cos(a) * (wide - 6), y = cy + 112 + Math.sin(a) * 30; slash(g, x, y, 22 + r() * 18, a + PI / 2 + (r() - .5), 3, i % 2 ? paper : ink); } }
    if (P.apron) { g.fillStyle = paper; poly(g, [[cx - 40, cy + 160], [cx + 40, cy + 160], [cx + 50, cy + 320], [cx - 50, cy + 320]]); g.fill(); g.fillStyle = ink; poly(g, [[cx - L * 4, cy + 160], [cx - L * 40, cy + 160], [cx - L * 50, cy + 320], [cx - L * 10, cy + 320]]); g.fill(); }
    if (P.strap) { g.strokeStyle = paper; g.lineWidth = 6; g.beginPath(); g.moveTo(cx + L * 60, cy + 100); g.lineTo(cx - L * 50, cy + 260); g.stroke(); g.strokeStyle = ink; g.lineWidth = 2; g.stroke(); }
    if (P.pendant) { g.fillStyle = P.pendant === 'spot' ? pal.spot : pal.spot2; g.beginPath(); g.moveTo(cx, cy + 150); g.lineTo(cx + 9, cy + 162); g.lineTo(cx, cy + 176); g.lineTo(cx - 9, cy + 162); g.fill(); g.strokeStyle = paper; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx - 30, cy + 98); g.lineTo(cx, cy + 150); g.lineTo(cx + 30, cy + 98); g.stroke(); }
  }
  function collar(g, P, cx, cy, L, r) {
    const pal = T.pal;
    if (P.collar === 'high') { g.fillStyle = pal.ink; poly(g, [[cx - 44, cy + 70], [cx - 34, cy + 30], [cx - 20, cy + 88], [cx + 20, cy + 88], [cx + 34, cy + 30], [cx + 44, cy + 70], [cx + 20, cy + 120], [cx - 20, cy + 120]]); g.fill(); g.strokeStyle = pal.paper; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + L * 44, cy + 70); g.lineTo(cx + L * 34, cy + 30); g.stroke(); }
    if (P.collar === 'coat') { g.fillStyle = pal.ink; poly(g, [[cx - 60, cy + 84], [cx - 20, cy + 70], [cx, cy + 140], [cx + 20, cy + 70], [cx + 60, cy + 84], [cx + 30, cy + 170], [cx - 30, cy + 170]]); g.fill(); g.strokeStyle = pal.paper; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + L * 20, cy + 70); g.lineTo(cx, cy + 140); g.stroke(); }
  }
  function eyes(g, P, cx, cy, L, mood, t) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper;
    const blink = (t % 4.3) < .12 || mood === 'dead';
    const ey = cy - 12, dx = 22;
    const browA = mood === 'angry' ? .32 : mood === 'sad' ? -.3 : mood === 'shock' ? -.12 : .08;
    [-1, 1].forEach(sd => {
      const lit = sd === L, x = cx + sd * dx;
      const eyeCol = P.eye === 'ember' ? pal.spot : P.eye === 'yellow' ? pal.spot2 : P.eye === 'blind' ? paper : null;
      if (lit) {
        if (blink) { g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 13, ey); g.quadraticCurveTo(x, ey + 4, x + 13, ey); g.stroke(); }
        else {
          g.fillStyle = paper; g.beginPath(); g.moveTo(x - 14, ey); g.quadraticCurveTo(x, ey - (mood === 'shock' ? 12 : 8), x + 14, ey); g.quadraticCurveTo(x, ey + 6, x - 14, ey); g.fill();
          g.fillStyle = eyeCol || ink; const look = (P.look || 0) * 3; g.beginPath(); g.arc(x + look - sd * 1, ey - 1, P.eye === 'blind' ? 0 : 5.5, 0, PI * 2); g.fill();
          if (P.eye === 'ember' || P.eye === 'yellow') { g.fillStyle = ink; g.fillRect(x + look - 1, ey - 6, 2, 10); }
          g.fillStyle = paper; g.beginPath(); g.arc(x + look - sd * 2.5, ey - 3, 1.6, 0, PI * 2); g.fill();
          g.strokeStyle = ink; g.lineWidth = 3.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 15, ey + 1); g.quadraticCurveTo(x, ey - (mood === 'shock' ? 13 : 9), x + 15, ey); g.stroke();
          if (P.fem) { g.lineWidth = 2; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(x + sd * (8 + i * 3), ey - 5 + i); g.lineTo(x + sd * (13 + i * 4), ey - 10 + i * 2); g.stroke(); } }
        }
      } else {
        // the eye in shadow is only a glint, the way Miller does it
        if (!blink) {
          if (eyeCol && P.eye !== 'blind') { g.fillStyle = eyeCol; g.beginPath(); g.ellipse(x, ey - 1, 9, 4, 0, 0, PI * 2); g.fill(); g.fillStyle = ink; g.fillRect(x - 1, ey - 5, 2, 9); }
          else if (P.eye === 'blind') { g.fillStyle = paper; g.beginPath(); g.ellipse(x, ey - 1, 9, 4, 0, 0, PI * 2); g.fill(); }
          else { g.fillStyle = paper; g.beginPath(); g.arc(x - sd * 2, ey - 2, 2.2, 0, PI * 2); g.fill(); g.strokeStyle = paper; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 8, ey + 4); g.quadraticCurveTo(x, ey + 6, x + 8, ey + 3); g.stroke(); }
        }
      }
      // brow
      g.fillStyle = lit ? ink : paper;
      const bx = x, by = ey - 16 - (mood === 'shock' ? 5 : 0), a = browA * sd;
      g.save(); g.translate(bx, by); g.rotate(a);
      if (lit) { g.beginPath(); g.moveTo(-18, 2); g.quadraticCurveTo(0, -6 - (P.fem ? 0 : 2), 18, 0); g.quadraticCurveTo(0, P.fem ? -2 : 2, -18, 2); g.fill(); }
      else { g.beginPath(); g.moveTo(-14, 0); g.quadraticCurveTo(0, -6, 16, -1); g.lineTo(16, 0); g.quadraticCurveTo(0, -4, -14, 1); g.fill(); }
      g.restore();
    });
    if (mood === 'angry') { g.strokeStyle = ink; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 3, cy - 34); g.lineTo(cx - 1, cy - 22); g.moveTo(cx + 3, cy - 34); g.lineTo(cx + 1, cy - 22); g.stroke(); }
  }
  function mouth(g, P, cx, cy, L, mood, talk) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper, my = cy + 44;
    const curve = mood === 'smile' ? 6 : mood === 'sad' ? -5 : mood === 'angry' ? -3 : mood === 'smirk' ? 3 : 0;
    const open = mood === 'shock' ? 10 : mood === 'angry' ? 3 + talk * 6 : talk * 9;
    if (P.lips) { g.fillStyle = P.lips === 'spot' ? pal.spot : pal.spot2; g.beginPath(); g.moveTo(cx - 17, my); g.quadraticCurveTo(cx - 6, my - 7, cx, my - 4); g.quadraticCurveTo(cx + 6, my - 7, cx + 17, my); g.quadraticCurveTo(cx, my + 10 + open, cx - 17, my); g.fill(); }
    g.fillStyle = ink;
    if (open > 1) { g.beginPath(); g.moveTo(cx - 14, my); g.quadraticCurveTo(cx, my - 3 - curve * .3, cx + 14, my - (mood === 'smirk' ? 3 : 0)); g.quadraticCurveTo(cx, my + open + 2, cx - 14, my); g.fill(); if (mood === 'angry' || mood === 'snarl') { g.fillStyle = paper; g.fillRect(cx - 9, my - 1, 18, 3); } }
    else { g.strokeStyle = ink; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 15, my - curve * .5); g.quadraticCurveTo(cx, my + curve, cx + 15, my - curve * .5 - (mood === 'smirk' ? 5 : 0)); g.stroke(); }
    // lower lip catches light even on the dark side
    g.strokeStyle = paper; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - L * 2, my + 7 + open * .8); g.quadraticCurveTo(cx - L * 8, my + 8 + open * .8, cx - L * 13, my + 5); g.stroke();
  }
  function beard(g, P, cx, cy, L, s, r, talk) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper, long = P.beard === 'long' ? 50 : P.beard === 'goatee' ? 14 : 22;
    g.fillStyle = P.beardCol === 'paper' ? paper : ink;
    if (P.beard === 'goatee') { smooth(g, [[cx - 16, cy + 50 + talk * 6], [cx + 16, cy + 50 + talk * 6], [cx + 12, cy + 84 + long], [cx, cy + 96 + long], [cx - 12, cy + 84 + long]]); g.fill(); g.beginPath(); g.moveTo(cx - 22, cy + 38); g.quadraticCurveTo(cx, cy + 30, cx + 22, cy + 38); g.quadraticCurveTo(cx, cy + 36, cx - 22, cy + 38); g.lineWidth = 5; g.strokeStyle = g.fillStyle; g.stroke(); }
    else { smooth(g, [[cx - s.hw, cy + 0], [cx - s.hw + 4, cy + 40], [cx - 30, cy + 78 + long * .6], [cx, cy + 90 + long], [cx + 30, cy + 78 + long * .6], [cx + s.hw - 4, cy + 40], [cx + s.hw, cy + 0], [cx + s.hw - 10, cy + 30], [cx + 22, cy + 46 + talk * 8], [cx - 22, cy + 46 + talk * 8], [cx - s.hw + 10, cy + 30]]); g.fill(); }
    if (P.beardCol !== 'paper') { g.save(); g.beginPath(); g.rect(L < 0 ? 0 : cx, 0, 120, 300); g.clip(); g.strokeStyle = paper; g.lineWidth = 2.5; g.stroke(); g.restore(); }
    g.strokeStyle = P.beardCol === 'paper' ? ink : paper; g.lineWidth = 1.8; g.lineCap = 'round';
    for (let i = 0; i < 30; i++) { const x = cx + L * (6 + r() * (s.hw - 10)), y = cy + 50 + r() * (30 + long * .7); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - L * 3, y + 10, x - L * 1, y + 18 + r() * 10); g.stroke(); }
    g.strokeStyle = P.beardCol === 'paper' ? ink : paper; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 12, cy + 50 + talk * 6); g.quadraticCurveTo(cx, cy + 53 + talk * 8, cx + 12, cy + 50 + talk * 6); g.stroke();
  }
  function hair(g, P, cx, cy, L, s, r, t) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper, st = P.hair || 'short', col = P.hairCol === 'paper' ? paper : P.hairCol === 'spot' ? pal.spot : P.hairCol === 'spot2' ? pal.spot2 : ink;
    const strand = col === ink ? paper : ink; const wind = Math.sin(t * 1.3) * 4;
    g.fillStyle = col;
    if (st === 'bald') { g.strokeStyle = ink; g.lineWidth = 2; g.beginPath(); g.arc(cx + L * 10, cy - 66, 18, PI * 1.1, PI * 1.6); g.stroke(); return; }
    if (st === 'short' || st === 'messy' || st === 'crop') {
      const sp = st === 'messy' ? 14 : st === 'crop' ? 4 : 8, pts = [];
      for (let i = 0; i <= 18; i++) { const a = PI + i / 18 * PI; const rr = s.hw + 8 + (i % 2 ? sp : 0) * (st === 'messy' ? r() : .5); pts.push([cx + Math.cos(a) * rr * 1.04, cy - 32 + Math.sin(a) * (58 + (i % 2 ? sp * .6 : 0))]); }
      pts.push([cx + s.hw + 4, cy - 20], [cx + s.hw - 6, cy - 46], [cx + 10, cy - 56], [cx - 20, cy - 50], [cx - s.hw + 6, cy - 46], [cx - s.hw - 4, cy - 20]);
      poly(g, pts); g.fill();
    } else if (st === 'long' || st === 'braid' || st === 'wild') {
      const len = st === 'wild' ? 150 : 130;
      smooth(g, [[cx - s.hw - 8, cy - 30], [cx - s.hw * .6, cy - 90], [cx + s.hw * .6, cy - 92], [cx + s.hw + 10, cy - 30], [cx + s.hw + 20 + wind, cy + 40], [cx + s.hw + 30 + wind, cy + len], [cx + s.hw - 6, cy + len - 10], [cx + s.hw - 8, cy + 10], [cx + 12, cy - 54], [cx - 20, cy - 50], [cx - s.hw + 8, cy + 10], [cx - s.hw + 6, cy + len - 10], [cx - s.hw - 30 + wind, cy + len], [cx - s.hw - 20 + wind, cy + 40]]);
      g.fill();
    } else if (st === 'bun') {
      smooth(g, [[cx - s.hw - 4, cy - 20], [cx - s.hw * .7, cy - 84], [cx + s.hw * .7, cy - 86], [cx + s.hw + 4, cy - 20], [cx + s.hw - 6, cy - 44], [cx, cy - 58], [cx - s.hw + 6, cy - 44]]); g.fill();
      g.beginPath(); g.arc(cx - L * 20, cy - 92, 22, 0, PI * 2); g.fill();
    } else if (st === 'scarf') {
      g.fillStyle = P.scarfCol === 'spot' ? pal.spot : paper; smooth(g, [[cx - s.hw - 12, cy - 6], [cx - s.hw * .7, cy - 94], [cx + s.hw * .7, cy - 96], [cx + s.hw + 12, cy - 6], [cx + s.hw + 4, cy + 60], [cx + s.hw - 6, cy - 30], [cx, cy - 54], [cx - s.hw + 6, cy - 30], [cx - s.hw - 4, cy + 60]]); g.fill();
      g.fillStyle = ink; poly(g, [[cx - L * 6, cy - 96], [cx - L * (s.hw + 14), cy - 6], [cx - L * (s.hw + 4), cy + 60], [cx - L * (s.hw - 6), cy - 30], [cx - L * 6, cy - 54]]); g.fill();
      return;
    }
    // strands catch light on the lit side
    g.strokeStyle = strand; g.lineCap = 'round';
    for (let i = 0; i < 14; i++) { const x0 = cx + L * (4 + r() * (s.hw)), y0 = cy - 80 + r() * 30; g.lineWidth = 1 + r() * 2; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + L * 12, y0 + 18, x0 + L * (16 + r() * 12), y0 + 30 + r() * (st === 'long' || st === 'wild' ? 80 : 20)); g.stroke(); }
  }
  function horns(g, P, cx, cy, L, s, layer) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper;
    if (layer === 'back') return;
    [-1, 1].forEach(sd => { g.fillStyle = ink; g.beginPath(); g.moveTo(cx + sd * 26, cy - 70); g.quadraticCurveTo(cx + sd * 70, cy - 120, cx + sd * 64, cy - 150); g.quadraticCurveTo(cx + sd * 56, cy - 112, cx + sd * 40, cy - 64); g.fill(); g.strokeStyle = sd === L ? paper : ink; g.lineWidth = 2.5; g.beginPath(); g.moveTo(cx + sd * 30, cy - 74); g.quadraticCurveTo(cx + sd * 66, cy - 118, cx + sd * 64, cy - 148); g.stroke(); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(cx + sd * (34 + i * 6), cy - 80 - i * 14); g.lineTo(cx + sd * (44 + i * 5), cy - 76 - i * 16); g.stroke(); } });
  }
  function crown(g, P, cx, cy, s) {
    const pal = T.pal; const y = cy - 74; g.fillStyle = P.crownCol === 'paper' ? pal.paper : pal.spot2;
    poly(g, [[cx - 50, y + 14], [cx - 52, y - 20], [cx - 34, y - 2], [cx - 18, y - 30], [cx, y - 6], [cx + 18, y - 30], [cx + 34, y - 2], [cx + 52, y - 20], [cx + 50, y + 14]]); g.fill();
    g.strokeStyle = pal.ink; g.lineWidth = 3; g.stroke(); g.fillStyle = pal.ink; poly(g, [[cx + 6, y - 4], [cx + 18, y - 30], [cx + 34, y - 2], [cx + 52, y - 20], [cx + 50, y + 14], [cx + 6, y + 14]]); g.globalAlpha = .55; g.fill(); g.globalAlpha = 1;
    if (P.crownGem) { g.fillStyle = pal.spot; g.beginPath(); g.arc(cx, y + 4, 5, 0, PI * 2); g.fill(); }
  }
  function hood(g, P, cx, cy, L, s, r) {
    const pal = T.pal; g.fillStyle = P.hood === 'paper' ? pal.paper : pal.ink;
    g.beginPath(); g.moveTo(cx - 110, 300); g.quadraticCurveTo(cx - 100, cy - 40, cx - 40, cy - 110); g.quadraticCurveTo(cx, cy - 130, cx + 40, cy - 110); g.quadraticCurveTo(cx + 100, cy - 40, cx + 110, 300);
    g.lineTo(cx + 64, 300); g.quadraticCurveTo(cx + s.hw + 14, cy + 40, cx + s.hw + 6, cy - 30); g.quadraticCurveTo(cx + 20, cy - 96, cx, cy - 92); g.quadraticCurveTo(cx - 20, cy - 96, cx - s.hw - 6, cy - 30); g.quadraticCurveTo(cx - s.hw - 14, cy + 40, cx - 64, 300); g.fill();
    g.strokeStyle = P.hood === 'paper' ? pal.ink : pal.paper; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + L * 108, 300); g.quadraticCurveTo(cx + L * 100, cy - 40, cx + L * 40, cy - 110); g.stroke();
    // the hood throws the upper face into shadow
    g.fillStyle = pal.ink; g.globalAlpha = 1; g.save(); headPath(g, cx, cy, s); g.clip(); g.beginPath(); g.moveTo(cx - 80, cy - 100); g.lineTo(cx + 80, cy - 100); g.lineTo(cx + 80, cy - 26); g.quadraticCurveTo(cx, cy - 2, cx - 80, cy - 26); g.fill(); g.restore(); g.globalAlpha = 1;
    // eyes glint under the hood
    const pal2 = pal; g.fillStyle = P.eye === 'ember' ? pal2.spot : pal2.paper; [-1, 1].forEach(sd => { g.beginPath(); g.ellipse(cx + sd * 22, cy - 12, 6, 2.5, 0, 0, PI * 2); g.fill(); });
  }

  /* ---------- non-human portraits ---------- */
  function squirrelP(g, P, t, mood, talk) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper, cx = 120, cy = 150, L = -1;
    const tw = Math.sin(t * 3) * 6;
    // tail: huge ink plume with white rim
    g.fillStyle = ink; smooth(g, [[160, 300], [230 + tw, 220], [236 + tw, 110], [200 + tw, 30], [150, 40], [190, 120], [180, 220]]); g.fill();
    g.strokeStyle = paper; g.lineWidth = 3; g.beginPath(); g.moveTo(236 + tw, 110); g.quadraticCurveTo(220 + tw, 40, 160, 38); g.stroke();
    for (let i = 0; i < 12; i++) slash(g, 186 + i * 3 + tw, 60 + i * 16, 30, PI * .6, 3, paper);
    // body
    g.fillStyle = ink; smooth(g, [[60, 300], [70, 220], [96, 190], [150, 190], [176, 230], [180, 300]]); g.fill();
    g.fillStyle = paper; smooth(g, [[100, 300], [104, 230], [124, 214], [140, 232], [142, 300]]); g.fill();
    // head
    g.fillStyle = paper; smooth(g, [[cx - 54, cy - 10], [cx - 40, cy - 60], [cx + 10, cy - 74], [cx + 50, cy - 50], [cx + 58, cy], [cx + 30, cy + 40], [cx - 20, cy + 44]]); g.fill();
    g.fillStyle = ink; poly(g, [[cx + 6, cy - 80], [cx + 2, cy - 30], [cx + 14, cy - 4], [cx + 4, cy + 20], [cx + 10, cy + 50], [cx + 80, cy + 50], [cx + 80, cy - 80]]); g.save(); smooth(g, [[cx - 54, cy - 10], [cx - 40, cy - 60], [cx + 10, cy - 74], [cx + 50, cy - 50], [cx + 58, cy], [cx + 30, cy + 40], [cx - 20, cy + 44]]); g.clip(); g.fillStyle = ink; poly(g, [[cx + 6, cy - 80], [cx + 2, cy - 30], [cx + 14, cy - 4], [cx + 4, cy + 20], [cx + 10, cy + 50], [cx + 80, cy + 50], [cx + 80, cy - 80]]); g.fill(); g.restore();
    // ears with tufts
    [[cx - 36, cy - 60, -1], [cx + 30, cy - 66, 1]].forEach(([x, y, sd]) => { g.fillStyle = sd < 0 ? paper : ink; poly(g, [[x - 14, y + 10], [x + sd * 6, y - 46], [x + 14, y + 8]]); g.fill(); g.strokeStyle = ink; g.lineWidth = 2; g.stroke(); g.fillStyle = ink; for (let i = 0; i < 4; i++) slash(g, x + sd * 6, y - 44, 16, -PI / 2 + (i - 1.5) * .3, 2, sd < 0 ? ink : paper); });
    // eyes: big glossy black with one glint; one half-lidded and cynical
    const blink = (t % 3.7) < .12;
    g.fillStyle = ink; g.beginPath(); g.ellipse(cx - 22, cy - 18, 13, blink ? 1 : 15, 0, 0, PI * 2); g.fill();
    g.fillStyle = paper; if (!blink) { g.beginPath(); g.arc(cx - 26, cy - 24, 4, 0, PI * 2); g.fill(); }
    g.fillStyle = paper; g.beginPath(); g.arc(cx + 26, cy - 18, 4, 0, PI * 2); g.fill();
    g.strokeStyle = ink; g.lineWidth = 5; g.beginPath(); g.moveTo(cx - 40, cy - 34 - (mood === 'angry' ? -4 : 2)); g.lineTo(cx - 6, cy - 30 + (mood === 'angry' ? 4 : 0)); g.stroke(); // heavy cynical lid
    // snout and teeth
    g.fillStyle = ink; g.beginPath(); g.ellipse(cx - 4, cy + 10, 9, 6, 0, 0, PI * 2); g.fill();
    g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 4, cy + 16); g.lineTo(cx - 4, cy + 24); g.moveTo(cx - 20, cy + 26); g.quadraticCurveTo(cx - 4, cy + 34 + talk * 8, cx + 14, cy + 24); g.stroke();
    g.fillStyle = paper; g.fillRect(cx - 9, cy + 25 + talk * 4, 10, 8);
    g.strokeStyle = ink; g.lineWidth = 1.2; g.strokeRect(cx - 9, cy + 25 + talk * 4, 10, 8); g.beginPath(); g.moveTo(cx - 4, cy + 25 + talk * 4); g.lineTo(cx - 4, cy + 33 + talk * 4); g.stroke();
    // whiskers
    g.lineWidth = 1.2; for (let i = -1; i <= 1; i++) { g.strokeStyle = ink; g.beginPath(); g.moveTo(cx - 14, cy + 12); g.lineTo(cx - 60, cy + 6 + i * 8); g.stroke(); g.strokeStyle = paper; g.beginPath(); g.moveTo(cx + 6, cy + 12); g.lineTo(cx + 54, cy + 6 + i * 8); g.stroke(); }
    // her flask and the little eyepatch scrap
    g.fillStyle = pal.spot; g.beginPath(); g.ellipse(70, 252, 14, 20, -.3, 0, PI * 2); g.fill(); g.strokeStyle = paper; g.lineWidth = 2; g.stroke(); g.fillStyle = paper; g.fillRect(64, 226, 8, 10);
  }
  function gooseP(g, P, t, mood, talk) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper; const bob = Math.sin(t * 2) * 4;
    g.fillStyle = paper; smooth(g, [[40, 300], [60, 220], [120, 200], [190, 230], [210, 300]]); g.fill();
    g.fillStyle = ink; poly(g, [[130, 200], [210, 230], [220, 300], [140, 300]]); g.fill();
    g.fillStyle = paper; smooth(g, [[96, 210], [100, 120 + bob], [110, 70 + bob], [150, 60 + bob], [168, 90 + bob], [140, 120 + bob], [134, 210]]); g.fill();
    g.fillStyle = ink; poly(g, [[128, 60 + bob], [170, 90 + bob], [142, 122 + bob], [134, 210], [118, 210], [120, 120 + bob]]); g.globalAlpha = .9; g.fill(); g.globalAlpha = 1;
    g.fillStyle = pal.spot2; poly(g, [[160, 78 + bob], [214, 92 + bob + talk * 4], [160, 100 + bob]]); g.fill(); g.strokeStyle = ink; g.lineWidth = 2; g.stroke();
    if (talk > .3) { g.fillStyle = ink; poly(g, [[164, 92 + bob], [208, 94 + bob + talk * 6], [164, 98 + bob]]); g.fill(); }
    g.fillStyle = ink; g.beginPath(); g.arc(136, 84 + bob, 7, 0, PI * 2); g.fill(); g.fillStyle = pal.spot; g.beginPath(); g.arc(137, 83 + bob, 2.5, 0, PI * 2); g.fill();
    g.strokeStyle = ink; g.lineWidth = 4; g.beginPath(); g.moveTo(124, 72 + bob); g.lineTo(148, 78 + bob); g.stroke();
    // a tiny crown, because she insists she is a cursed lady
    g.fillStyle = pal.spot2; poly(g, [[112, 62 + bob], [114, 44 + bob], [122, 54 + bob], [130, 40 + bob], [138, 54 + bob], [146, 44 + bob], [146, 62 + bob]]); g.fill(); g.strokeStyle = ink; g.lineWidth = 2; g.stroke();
  }
  function ratP(g, P, t, mood, talk) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper, cx = 120, cy = 140;
    g.fillStyle = ink; smooth(g, [[20, 300], [40, 210], [120, 180], [200, 210], [220, 300]]); g.fill();
    g.strokeStyle = paper; g.lineWidth = 3; g.beginPath(); g.moveTo(30, 300); g.quadraticCurveTo(40, 210, 110, 186); g.stroke();
    if (P.crown) { g.fillStyle = pal.spot2; }
    // long snout head, three-quarter
    g.fillStyle = paper; smooth(g, [[cx - 60, cy - 10], [cx - 40, cy - 60], [cx + 20, cy - 66], [cx + 50, cy - 30], [cx + 100, cy + 20], [cx + 60, cy + 40], [cx, cy + 50], [cx - 50, cy + 30]]); g.fill();
    g.save(); smooth(g, [[cx - 60, cy - 10], [cx - 40, cy - 60], [cx + 20, cy - 66], [cx + 50, cy - 30], [cx + 100, cy + 20], [cx + 60, cy + 40], [cx, cy + 50], [cx - 50, cy + 30]]); g.clip();
    g.fillStyle = ink; poly(g, [[cx - 80, cy + 4], [cx + 10, cy + 10], [cx + 110, cy + 26], [cx + 110, cy + 80], [cx - 80, cy + 80]]); g.fill();
    g.strokeStyle = ink; g.lineWidth = 1.5; for (let i = 0; i < 30; i++) { const x = cx - 50 + i * 4, y = cy - 50 + (i % 5) * 8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6, y + 8); g.stroke(); }
    g.restore();
    // ears
    [[cx - 44, cy - 56], [cx + 6, cy - 70]].forEach(([x, y], i) => { g.fillStyle = i ? paper : ink; g.beginPath(); g.ellipse(x, y, 22, 28, -.3, 0, PI * 2); g.fill(); g.strokeStyle = i ? ink : paper; g.lineWidth = 2.5; g.stroke(); g.fillStyle = pal.spot; g.globalAlpha = .7; g.beginPath(); g.ellipse(x, y + 2, 10, 16, -.3, 0, PI * 2); g.fill(); g.globalAlpha = 1; });
    // eye: small, red, greedy
    g.fillStyle = pal.spot; g.beginPath(); g.arc(cx + 8, cy - 22, 6, 0, PI * 2); g.fill(); g.fillStyle = paper; g.beginPath(); g.arc(cx + 6, cy - 24, 2, 0, PI * 2); g.fill();
    g.strokeStyle = ink; g.lineWidth = 4; g.beginPath(); g.moveTo(cx - 6, cy - 34); g.lineTo(cx + 22, cy - 26); g.stroke();
    g.fillStyle = ink; g.beginPath(); g.arc(cx + 98, cy + 20, 7, 0, PI * 2); g.fill();
    g.fillStyle = paper; g.fillRect(cx + 66, cy + 30, 8, 12 + talk * 6); g.fillRect(cx + 76, cy + 30, 8, 10 + talk * 6);
    g.strokeStyle = paper; g.lineWidth = 1.2; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(cx + 90, cy + 26); g.lineTo(cx + 140, cy + 20 + i * 10); g.stroke(); }
    if (P.crown) { g.fillStyle = pal.spot2; poly(g, [[cx - 40, cy - 66], [cx - 44, cy - 96], [cx - 28, cy - 80], [cx - 14, cy - 104], [cx, cy - 82], [cx + 14, cy - 98], [cx + 14, cy - 66]]); g.fill(); g.strokeStyle = ink; g.lineWidth = 2; g.stroke(); }
    if (P.monocle) { g.strokeStyle = pal.spot2; g.lineWidth = 3; g.beginPath(); g.arc(cx + 8, cy - 22, 13, 0, PI * 2); g.stroke(); g.beginPath(); g.moveTo(cx + 8, cy - 9); g.quadraticCurveTo(cx, cy + 40, cx - 20, cy + 70); g.lineWidth = 1.5; g.stroke(); }
  }
  function dragonP(g, P, t, mood, talk) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper, br = Math.sin(t * .9) * 3;
    // smoke curling from the nostrils
    g.fillStyle = 'rgba(236,230,214,.18)'; for (let i = 0; i < 6; i++) { const k = (t * .3 + i / 6) % 1; g.beginPath(); g.arc(60 - k * 40 + Math.sin(k * 8 + i) * 10, 200 - k * 190, 10 + k * 30, 0, PI * 2); g.fill(); }
    g.save(); g.translate(0, br);
    g.fillStyle = ink; smooth(g, [[240, 300], [240, 40], [180, 20], [110, 40], [60, 90], [20, 150], [10, 210], [60, 230], [120, 220], [150, 260], [160, 300]]); g.fill();
    // lit ridge and scales
    g.strokeStyle = paper; g.lineWidth = 3.5; g.beginPath(); g.moveTo(10, 210); g.quadraticCurveTo(14, 150, 60, 90); g.quadraticCurveTo(110, 40, 180, 22); g.stroke();
    g.lineWidth = 1.5; for (let y = 60; y < 300; y += 14) for (let x = 120; x < 240; x += 18) { g.beginPath(); g.arc(x + ((y / 14) % 2) * 9, y, 8, .2, PI - .2); g.stroke(); }
    // brow horn and the old cracked horn
    g.fillStyle = ink; poly(g, [[150, 50], [230, -10], [180, 60]]); g.fill(); g.strokeStyle = paper; g.lineWidth = 2.5; g.beginPath(); g.moveTo(150, 50); g.lineTo(226, -6); g.stroke();
    g.beginPath(); g.moveTo(190, 30); g.lineTo(200, 40); g.lineTo(194, 50); g.stroke();
    // jaw, teeth
    g.fillStyle = paper; for (let i = 0; i < 7; i++) poly(g, [[30 + i * 14, 212 + talk * 10], [36 + i * 14, 228 + talk * 10], [42 + i * 14, 212 + talk * 10]]), g.fill();
    if (talk > .2 || mood === 'roar') { g.fillStyle = pal.spot; poly(g, [[20, 214], [130, 222], [120, 222 + talk * 16 + (mood === 'roar' ? 30 : 0)], [24, 220 + talk * 10]]); g.fill(); }
    // eye: one huge ember eye, the other milky
    const ey = 120, ex = 110; const blink = (t % 6) < .15;
    g.fillStyle = blink ? ink : pal.spot2; g.beginPath(); g.ellipse(ex, ey, 24, blink ? 2 : 13, -.2, 0, PI * 2); g.fill();
    if (!blink) { g.fillStyle = ink; g.beginPath(); g.ellipse(ex + 2, ey, 3.5, 12, -.2, 0, PI * 2); g.fill(); g.fillStyle = paper; g.beginPath(); g.arc(ex - 8, ey - 4, 2.5, 0, PI * 2); g.fill(); }
    g.strokeStyle = paper; g.lineWidth = 3; g.beginPath(); g.moveTo(ex - 32, ey - 20); g.quadraticCurveTo(ex, ey - 32, ex + 34, ey - 14); g.stroke();
    g.fillStyle = paper; g.beginPath(); g.ellipse(36, 196, 6, 3, -.4, 0, PI * 2); g.fill();
    if (mood === 'sneeze') { g.fillStyle = pal.spot; g.beginPath(); g.moveTo(30, 196); g.lineTo(-20, 160); g.lineTo(-20, 240); g.fill(); g.fillStyle = pal.spot2; g.beginPath(); g.moveTo(30, 196); g.lineTo(-10, 180); g.lineTo(-10, 214); g.fill(); }
    if (mood === 'sad') { g.fillStyle = paper; g.beginPath(); g.moveTo(ex - 10, ey + 12); g.quadraticCurveTo(ex - 16, ey + 40, ex - 8, ey + 50); g.quadraticCurveTo(ex - 2, ey + 36, ex - 10, ey + 12); g.fill(); }
    g.restore();
  }
  function beastP(g, P, t, mood, talk) {
    const pal = T.pal, ink = pal.ink, paper = pal.paper;
    if (P.kind === 'wolf') { g.fillStyle = ink; smooth(g, [[0, 300], [20, 160], [70, 70], [110, 40], [150, 70], [200, 130], [236, 220], [240, 300]]); g.fill(); g.strokeStyle = paper; g.lineWidth = 3; g.beginPath(); g.moveTo(20, 160); g.quadraticCurveTo(50, 90, 110, 40); g.stroke(); poly(g, [[80, 70], [70, 10], [110, 50]]); g.fillStyle = ink; g.fill(); g.stroke(); g.fillStyle = pal.spot2; g.beginPath(); g.ellipse(96, 120, 12, 5, .2, 0, PI * 2); g.ellipse(150, 124, 12, 5, -.2, 0, PI * 2); g.fill(); g.fillStyle = paper; for (let i = 0; i < 8; i++) poly(g, [[84 + i * 9, 200], [88 + i * 9, 224 + talk * 6], [92 + i * 9, 200]]), g.fill(); }
    else if (P.kind === 'bones') { g.fillStyle = paper; smooth(g, [[70, 160], [66, 70], [120, 40], [174, 70], [170, 160], [150, 200], [90, 200]]); g.fill(); g.fillStyle = ink; g.beginPath(); g.ellipse(96, 110, 18, 22, 0, 0, PI * 2); g.ellipse(146, 110, 18, 22, 0, 0, PI * 2); g.fill(); g.fillStyle = pal.spot; g.beginPath(); g.arc(96, 112, 4, 0, PI * 2); g.arc(146, 112, 4, 0, PI * 2); g.fill(); g.fillStyle = ink; poly(g, [[120, 136], [112, 156], [128, 156]]); g.fill(); for (let i = 0; i < 6; i++) g.fillRect(94 + i * 9, 176, 3, 22); g.fillStyle = paper; for (let i = 0; i < 5; i++) { g.fillRect(70, 230 + i * 14, 100, 6); } g.fillStyle = ink; g.fillRect(117, 220, 6, 80); g.strokeStyle = paper; g.lineWidth = 6; g.beginPath(); g.moveTo(40, 300); g.lineTo(60, 210); g.stroke(); }
    else if (P.kind === 'ghoul') { g.fillStyle = paper; smooth(g, [[60, 300], [70, 180], [80, 80], [130, 50], [180, 90], [184, 180], [200, 300]]); g.fill(); g.fillStyle = ink; poly(g, [[130, 40], [124, 120], [140, 150], [128, 200], [220, 300], [240, 0]]); g.fill(); g.beginPath(); g.ellipse(104, 110, 16, 10, 0, 0, PI * 2); g.fill(); g.fillStyle = pal.spot2; g.beginPath(); g.arc(106, 110, 4, 0, PI * 2); g.fill(); g.fillStyle = ink; g.beginPath(); g.ellipse(112, 176, 26, 12 + talk * 10, 0, 0, PI * 2); g.fill(); g.fillStyle = paper; for (let i = 0; i < 6; i++) poly(g, [[92 + i * 8, 168], [96 + i * 8, 184], [100 + i * 8, 168]]), g.fill(); g.strokeStyle = ink; g.lineWidth = 2; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(80, 60 + i * 20); g.lineTo(96, 64 + i * 20); g.stroke(); } }
  }
  T.portrait = portrait;

  /* ======================= FIGURES ======================= */
  /* A figure is an ink silhouette with a thin paper rim on the lit side and a few white slashes for folds.
     Spec keys: h, build, fem, dress (coat/robe/dress/armor/rags/none), cape, hood, crown, horns, tail, ears, beard,
     hair, weapon (sword/spear/axe/crossbow/staff/dagger/hammer/torch/lantern), shield, spotCape, kind (human/dwarf/rat/squirrel/goose/dragon/wolf/bones/ghoul). */
  function figShape(g, F, st) {
    // all coordinates are in a box where the feet are at y = 0 and the figure is 1 unit tall.
    const k = F.kind || 'human';
    if (k !== 'human' && k !== 'dwarf') return beastShape(g, F, st);
    const dw = k === 'dwarf', H = 1, hr = dw ? .085 : .062, sh = (F.fem ? .1 : .13) * (F.build || 1) * (dw ? 1.35 : 1);
    const hip = (F.fem ? .095 : .085) * (F.build || 1) * (dw ? 1.3 : 1), sw = st.sway || 0, br = st.breathe || 0;
    const neckY = dw ? -.7 : -.83, headY = neckY - hr * .95, hipY = dw ? -.36 : -.47, kneeY = hipY * .5;
    const step = st.step || 0, pose = st.pose || 'stand';
    g.beginPath();
    // legs
    if (pose === 'kneel') { poly(g, [[-hip, hipY + .1], [hip, hipY + .1], [hip + .1, -.06], [hip + .14, 0], [-hip * .4, 0], [-hip, -.18], [-hip * 1.2, -.02], [-hip * 1.6, 0], [-hip * 1.4, hipY + .12]], true); g.fill(); }
    else if (pose !== 'dead') {
      const lx = -hip * .55 + step * .04, rx = hip * .55 - step * .04;
      poly(g, [[-hip, hipY], [-.012, hipY + .02], [lx + .02, kneeY], [lx + .025, -.02], [lx + .05, 0], [lx - .04, 0], [lx - .03, kneeY]]); g.fill();
      poly(g, [[hip, hipY], [.012, hipY + .02], [rx - .02, kneeY], [rx - .025, -.02], [rx + .05, 0], [rx - .04, 0], [rx + .03, kneeY]]); g.fill();
    }
    const yoff = pose === 'kneel' ? .2 : 0;
    g.save(); g.translate(sw * .02, yoff);
    // torso
    const top = neckY + .03;
    smooth(g, [[-sh, top + .02 - br * .004], [-sh * 1.05, top + .1], [-hip * 1.05, hipY + .02], [-hip * .9, hipY + .08], [hip * .9, hipY + .08], [hip * 1.05, hipY + .02], [sh * 1.05, top + .1], [sh, top + .02 - br * .004], [0, top - .02]]); g.fill();
    // garment skirt / coat tails
    const d = F.dress || 'coat';
    if (d === 'robe' || d === 'dress') { const w = d === 'dress' ? .22 : .16; smooth(g, [[-hip, hipY - .05], [-w - sw * .02, -.005], [w - sw * .02, -.005], [hip, hipY - .05]]); g.fill(); }
    if (d === 'coat') { poly(g, [[-hip * 1.1, hipY - .02], [-hip * 1.6 - sw * .03, kneeY + .05], [hip * 1.6 - sw * .03, kneeY + .05], [hip * 1.1, hipY - .02]]); g.fill(); }
    if (d === 'rags') { g.beginPath(); g.moveTo(-hip * 1.2, hipY); for (let i = 0; i <= 8; i++) g.lineTo(-hip * 1.4 + i * hip * .35, kneeY + .06 + (i % 2) * .05); g.lineTo(hip * 1.2, hipY); g.fill(); }
    if (d === 'armor') { g.beginPath(); g.ellipse(-sh, top + .05, sh * .55, .04, -.3, 0, PI * 2); g.ellipse(sh, top + .05, sh * .55, .04, .3, 0, PI * 2); g.fill(); poly(g, [[-hip * 1.2, hipY - .03], [-hip * 1.3, hipY + .12], [hip * 1.3, hipY + .12], [hip * 1.2, hipY - .03]]); g.fill(); }
    // arms
    const arm = (sd, ang, bend) => {
      const sx = sd * sh * .92, sy = top + .04; const l1 = dw ? .16 : .19, l2 = dw ? .15 : .18;
      const ex = sx + Math.sin(ang) * l1 * sd, ey = sy + Math.cos(ang) * l1;
      const hx = ex + Math.sin(ang + bend) * l2 * sd, hy = ey + Math.cos(ang + bend) * l2;
      g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = dw ? .055 : .042; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.lineTo(hx, hy); g.stroke();
      g.beginPath(); g.arc(hx, hy, .022, 0, PI * 2); g.fill(); return [hx, hy];
    };
    g.strokeStyle = g.fillStyle;
    const A = st.arms || [.15, .1, .15, .1];
    const hl = arm(-1, A[0] + sw * .03, A[1]), hrr = arm(1, A[2] - sw * .03, A[3]);
    st.hands = [hl, hrr];
    // neck & head
    g.fillRect(-.02, neckY - .02, .04, .06);
    g.beginPath(); g.ellipse(0, headY, hr * .85, hr, 0, 0, PI * 2); g.fill();
    if (F.hair === 'long') { poly(g, [[-hr * .9, headY - hr * .3], [-hr * 1.1 - sw * .01, headY + hr * 2.6], [hr * 1.1 - sw * .01, headY + hr * 2.6], [hr * .9, headY - hr * .3]]); g.fill(); }
    if (F.hair === 'bun') { g.beginPath(); g.arc(-hr * .4, headY - hr * 1.1, hr * .5, 0, PI * 2); g.fill(); }
    if (F.hair === 'wild') { for (let i = 0; i < 7; i++) { const a = -PI + i / 6 * PI; poly(g, [[Math.cos(a) * hr * .8, headY + Math.sin(a) * hr * .8], [Math.cos(a) * hr * 1.6, headY + Math.sin(a) * hr * 1.5], [Math.cos(a + .3) * hr * .8, headY + Math.sin(a + .3) * hr * .8]]); g.fill(); } }
    if (F.beard) { poly(g, [[-hr * .7, headY + hr * .2], [0, headY + hr * (F.beard === 'long' ? 2.6 : 1.7)], [hr * .7, headY + hr * .2]]); g.fill(); }
    if (F.ears === 'elf') { poly(g, [[-hr * .7, headY], [-hr * 1.9, headY - hr * .9], [-hr * .7, headY + hr * .3]]); g.fill(); poly(g, [[hr * .7, headY], [hr * 1.9, headY - hr * .9], [hr * .7, headY + hr * .3]]); g.fill(); }
    if (F.horns) { [-1, 1].forEach(sd => { g.beginPath(); g.moveTo(sd * hr * .4, headY - hr * .7); g.quadraticCurveTo(sd * hr * 1.6, headY - hr * 1.8, sd * hr * 1.2, headY - hr * 2.6); g.quadraticCurveTo(sd * hr * 1.1, headY - hr * 1.6, sd * hr * .7, headY - hr * .4); g.fill(); }); }
    if (F.hood) { smooth(g, [[-hr * 1.3, headY + hr * 1.6], [-hr * 1.2, headY - hr * .8], [0, headY - hr * 1.5], [hr * 1.2, headY - hr * .8], [hr * 1.3, headY + hr * 1.6]]); g.fill(); }
    if (F.helm) { poly(g, [[-hr * 1.05, headY + hr * .3], [-hr * 1.05, headY - hr * .6], [0, headY - hr * 1.3], [hr * 1.05, headY - hr * .6], [hr * 1.05, headY + hr * .3]]); g.fill(); if (F.helm === 'crest') { smooth(g, [[-hr * 1.6, headY - hr * .6], [-hr * .6, headY - hr * 2.2], [hr * .8, headY - hr * 2], [hr * 1.8, headY - hr * .4], [hr * .4, headY - hr * 1.2]]); g.fill(); } }
    if (F.hat === 'wide') { g.beginPath(); g.ellipse(0, headY - hr * .5, hr * 2.2, hr * .35, 0, 0, PI * 2); g.fill(); g.fillRect(-hr * .8, headY - hr * 1.5, hr * 1.6, hr); }
    if (F.tail) { g.lineWidth = .03; g.beginPath(); g.moveTo(0, hipY + .04); g.quadraticCurveTo(.18 + sw * .02, hipY + .2, .24 + Math.sin((st.t || 0) * 2) * .02, -.02); g.stroke(); }
    st.head = [0, headY, hr]; st.top = top; st.hipY = hipY; st.sh = sh; st.neckY = neckY;
    g.restore();
  }
  function beastShape(g, F, st) {
    const k = F.kind, t = st.t || 0;
    if (k === 'squirrel') { g.beginPath(); g.ellipse(0, -.35, .2, .3, 0, 0, PI * 2); g.fill(); g.beginPath(); g.arc(.05, -.75, .16, 0, PI * 2); g.fill(); poly(g, [[-.04, -.86], [0, -1.05], [.06, -.86]]); g.fill(); poly(g, [[.1, -.86], [.16, -1.05], [.18, -.84]]); g.fill(); smooth(g, [[-.12, -.1], [-.5 + Math.sin(t * 3) * .03, -.3], [-.6, -.9], [-.36, -1.25], [-.2, -1], [-.3, -.6], [-.16, -.36]]); g.fill(); st.head = [.05, -.75, .16]; return; }
    if (k === 'goose') { g.beginPath(); g.ellipse(0, -.3, .38, .22, 0, 0, PI * 2); g.fill(); g.lineWidth = .1; g.lineCap = 'round'; g.beginPath(); g.moveTo(.26, -.35); g.quadraticCurveTo(.34 + Math.sin(t * 2) * .03, -.7, .3, -.9); g.stroke(); g.beginPath(); g.ellipse(.32, -.92, .1, .08, 0, 0, PI * 2); g.fill(); poly(g, [[.38, -.94], [.55, -.9], [.38, -.86]]); g.fill(); g.fillRect(-.06, -.1, .03, .1); g.fillRect(.06, -.1, .03, .1); st.head = [.32, -.92, .1]; return; }
    if (k === 'rat') { figShape(g, Object.assign({}, F, { kind: 'human', tail: true, ears: null }), st); const [hx, hy, hr] = st.head; poly(g, [[hx, hy - hr * .6], [hx + hr * 2.4, hy + hr * .3], [hx, hy + hr * .8]]); g.fill(); g.beginPath(); g.arc(hx - hr * .5, hy - hr * 1.1, hr * .6, 0, PI * 2); g.arc(hx + hr * .4, hy - hr * 1.2, hr * .6, 0, PI * 2); g.fill(); st.eyes = [[hx + hr * .6, hy - hr * .1]]; return; }
    if (k === 'wolf') { const s = Math.sin(t * 6) * (st.step ? .04 : 0); g.beginPath(); g.ellipse(0, -.42, .5, .17, 0, 0, PI * 2); g.fill(); poly(g, [[.4, -.5], [.75, -.62], [.88, -.5], [.72, -.42], [.42, -.34]]); g.fill(); poly(g, [[.6, -.6], [.62, -.78], [.7, -.6]]); g.fill(); [[-.35, s], [-.25, -s], [.3, -s], [.4, s]].forEach(([x, o]) => { poly(g, [[x - .04, -.4], [x + .04, -.4], [x + .03 + o, 0], [x - .02 + o, 0]]); g.fill(); }); g.lineWidth = .06; g.beginPath(); g.moveTo(-.48, -.46); g.quadraticCurveTo(-.7, -.5, -.78, -.3); g.stroke(); st.head = [.75, -.56, .08]; st.eyes = [[.74, -.56]]; return; }
    if (k === 'bones' || k === 'ghoul') { return figShape(g, Object.assign({}, F, { kind: 'human' }), st); }
    if (k === 'dragon') { dragonShape(g, F, st); return; }
  }
  function dragonShape(g, F, st) {
    const t = st.t || 0, br = Math.sin(t * .8) * .01, nod = Math.sin(t * .5) * .02;
    // huge crouched body, folded bat wings, long neck curling to the left
    smooth(g, [[-1.1, 0], [-1.2, -.25], [-.9, -.55 - br], [-.3, -.7 - br], [.3, -.62], [.75, -.4], [.9, 0]]); g.fill();
    // wing
    poly(g, [[-.6, -.6], [-.2, -1.3 - br * 3], [.15, -1.05], [.45, -1.2 - br * 2], [.6, -.6]]); g.fill();
    // neck and head
    g.lineWidth = .22; g.lineCap = 'round'; g.beginPath(); g.moveTo(-.8, -.45); g.quadraticCurveTo(-1.25, -.75, -1.3, -1.0 + nod); g.stroke();
    smooth(g, [[-1.22, -1.08 + nod], [-1.5, -1.12 + nod], [-1.82, -.98 + nod], [-1.8, -.9 + nod], [-1.45, -.88 + nod], [-1.2, -.86 + nod]]); g.fill();
    poly(g, [[-1.3, -1.1 + nod], [-1.15, -1.36 + nod], [-1.22, -1.06 + nod]]); g.fill();
    // tail
    g.lineWidth = .12; g.beginPath(); g.moveTo(.8, -.15); g.quadraticCurveTo(1.4, -.05, 1.5, -.35 + Math.sin(t) * .04); g.stroke();
    // legs
    [[-.75, 0], [-.35, 0], [.35, 0], [.65, 0]].forEach(([x]) => { poly(g, [[x - .09, -.3], [x + .09, -.3], [x + .12, 0], [x - .12, 0]]); g.fill(); });
    st.head = [-1.5, -1.0 + nod, .1]; st.eyes = [[-1.45, -1.02 + nod]];
  }
  /* Draw one figure. x,y = feet; h = height in px; face = 1 facing right, -1 left. light = -1 light from the left. */
  function figure(g, F, x, y, h, o) {
    o = o || {}; const pal = T.pal, t = o.t || 0, face = o.face || 1, light = o.light == null ? -1 : o.light;
    const st = { t, sway: Math.sin(t * 1.1 + (F.seed || 0)) * (F.cape || F.dress === 'dress' ? 1 : .5), breathe: Math.sin(t * 1.7 + (F.seed || 0)), step: o.step || 0, pose: o.pose || F.pose, arms: o.arms || F.arms };
    const k = F.kind || 'human';
    const sc = h * (k === 'dragon' ? 1 : 1);
    g.save(); g.translate(x, y);
    if (o.rot) g.rotate(o.rot);
    if (o.alpha != null) g.globalAlpha = o.alpha;
    g.scale(sc * face, sc);
    const lim = light * face; // light direction in the figure's local space
    // cape behind
    const cape = F.cape ? (F.cape === 'spot' ? pal.spot : pal.ink) : null;
    const drawCape = col => { if (!F.cape) return; g.fillStyle = col; const fl = Math.sin(t * 1.4 + (F.seed || 0)) * .03 + (o.wind || .02); smooth(g, [[-.13, -.82], [-.2 - fl, -.5], [-.3 - fl * 2, -.04], [-.24 - fl * 2, .0], [.1 - fl, -.01], [.04, -.4], [.13, -.82]]); g.fill(); };
    // rim pass in paper, offset toward the light
    const off = 1.6 / sc;
    if (o.rim !== false) {
      g.save(); g.translate(lim * off * 1.0, -off * .4); g.fillStyle = pal.paper; g.strokeStyle = pal.paper; drawCape(pal.paper); figShape(g, F, Object.assign({}, st)); if (F.weapon) weapon(g, F, st, pal.paper); g.restore();
    }
    // ink pass
    g.fillStyle = o.flash ? pal.paper : (F.col || pal.ink); g.strokeStyle = g.fillStyle;
    drawCape(cape === pal.spot ? pal.spot : g.fillStyle);
    g.fillStyle = o.flash ? pal.paper : (F.col || pal.ink); g.strokeStyle = g.fillStyle;
    figShape(g, F, st);
    if (F.weapon) weapon(g, F, st, g.fillStyle);
    // detail in paper: lit half of the face, an eye, a fold slash or two
    if (!o.flash && st.head && k !== 'squirrel' && k !== 'goose' && k !== 'dragon' && k !== 'wolf') {
      const [hx, hy, hr] = st.head; const yoff = st.pose === 'kneel' ? .2 : 0;
      if (F.kind === 'bones') { g.fillStyle = pal.paper; g.beginPath(); g.ellipse(hx, hy + yoff, hr * .8, hr * .95, 0, 0, PI * 2); g.fill(); g.fillStyle = pal.ink; g.beginPath(); g.arc(hx - hr * .3, hy + yoff, hr * .22, 0, PI * 2); g.arc(hx + hr * .3, hy + yoff, hr * .22, 0, PI * 2); g.fill(); g.strokeStyle = pal.paper; g.lineWidth = .012; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-.06, st.top + .05 + i * .05); g.lineTo(.06, st.top + .05 + i * .05); g.stroke(); } }
      else if (!F.hood && !F.helmFull && !F.mask) { g.save(); g.beginPath(); g.ellipse(hx, hy + yoff, hr * .85, hr, 0, 0, PI * 2); g.clip(); g.fillStyle = F.skin === 'yellow' ? pal.spot2 : pal.paper; g.beginPath(); g.ellipse(hx + lim * hr * .55, hy + yoff + hr * .05, hr * .55, hr * .9, 0, 0, PI * 2); g.fill(); g.fillStyle = pal.ink; g.fillRect(hx + lim * hr * .1, hy + yoff - hr * .2, hr * .4 * lim, hr * .12); g.restore(); }
      if (F.mask) { g.fillStyle = pal.paper; g.beginPath(); g.ellipse(hx + .006, hy + yoff, hr * .7, hr * .85, 0, 0, PI * 2); g.fill(); g.fillStyle = pal.spot; g.fillRect(hx - hr * .4, hy + yoff - hr * .2, hr * .25, hr * .12); g.fillRect(hx + hr * .15, hy + yoff - hr * .2, hr * .25, hr * .12); }
      if (F.hood && F.eyes !== false) { g.fillStyle = F.eyeCol === 'ember' ? pal.spot : pal.paper; g.fillRect(hx - hr * .45, hy + yoff - hr * .1, hr * .3, hr * .12); g.fillRect(hx + hr * .15, hy + yoff - hr * .1, hr * .3, hr * .12); }
      if (F.eyeCol === 'ember' && !F.hood) { g.fillStyle = pal.spot; g.fillRect(hx + lim * hr * .2, hy + yoff - hr * .22, hr * .35 * lim, hr * .14); }
      if (F.crown) { g.fillStyle = pal.spot2; poly(g, [[hx - hr * .8, hy + yoff - hr * .8], [hx - hr * .9, hy + yoff - hr * 1.5], [hx - hr * .4, hy + yoff - hr * 1.1], [hx, hy + yoff - hr * 1.6], [hx + hr * .4, hy + yoff - hr * 1.1], [hx + hr * .9, hy + yoff - hr * 1.5], [hx + hr * .8, hy + yoff - hr * .8]]); g.fill(); }
      // white slashes on the lit side of the coat
      if (F.slashes !== false && st.top != null) { const r = rnd(F.seed || 5); g.fillStyle = pal.paper; for (let i = 0; i < 3; i++) slash(g, lim * st.sh * (.3 + r() * .5), st.top + .1 + r() * .25, .12 + r() * .1, PI / 2 + lim * .25, .012, pal.paper); }
      if (F.dressCol && st.top != null) { g.fillStyle = F.dressCol === 'spot' ? pal.spot : pal.spot2; smooth(g, [[-.08, st.hipY - .1], [-.2 - st.sway * .02, -.01], [.2 - st.sway * .02, -.01], [.08, st.hipY - .1]]); g.fill(); g.fillStyle = pal.ink; poly(g, [[-lim * .02, st.hipY - .08], [-lim * .2, -.01], [-lim * .06, -.01]]); g.fill(); }
      if (F.sash && st.top != null) { g.strokeStyle = F.sash === 'spot' ? pal.spot : pal.spot2; g.lineWidth = .025; g.beginPath(); g.moveTo(-st.sh * .8, st.top + .04); g.lineTo(st.sh * .5, st.hipY); g.stroke(); }
    }
    if (st.eyes && k !== 'human') { g.fillStyle = k === 'dragon' ? pal.spot2 : pal.spot2; st.eyes.forEach(([ex, ey]) => { g.beginPath(); g.ellipse(ex, ey, k === 'dragon' ? .05 : .025, k === 'dragon' ? .02 : .012, 0, 0, PI * 2); g.fill(); }); }
    if (F.glow) { g.globalCompositeOperation = 'lighter'; const [hx, hy] = st.hands ? st.hands[1] : [0, -.5]; const gr = g.createRadialGradient(hx, hy, 0, hx, hy, .25); gr.addColorStop(0, F.glow === 'spot2' ? 'rgba(232,200,26,.8)' : 'rgba(224,86,26,.8)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(hx - .3, hy - .3, .6, .6); g.globalCompositeOperation = 'source-over'; }
    g.restore();
    return st;
  }
  function weapon(g, F, st, col) {
    if (!st.hands) return; const [hx, hy] = st.hands[1], yo = st.pose === 'kneel' ? .2 : 0; g.save(); g.translate(0, yo); g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round';
    const w = F.weapon;
    if (w === 'spear') { g.lineWidth = .016; g.beginPath(); g.moveTo(hx, hy + .3); g.lineTo(hx, hy - .95); g.stroke(); poly(g, [[hx - .025, hy - .93], [hx, hy - 1.05], [hx + .025, hy - .93]]); g.fill(); }
    if (w === 'sword') { g.lineWidth = .018; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + .18, hy - .42); g.stroke(); g.lineWidth = .03; g.beginPath(); g.moveTo(hx - .04, hy - .02); g.lineTo(hx + .05, hy + .02); g.stroke(); }
    if (w === 'axe') { g.lineWidth = .02; g.beginPath(); g.moveTo(hx, hy + .05); g.lineTo(hx + .06, hy - .4); g.stroke(); smooth(g, [[hx + .04, hy - .38], [hx + .16, hy - .46], [hx + .18, hy - .3], [hx + .05, hy - .3]]); g.fill(); }
    if (w === 'hammer') { g.lineWidth = .022; g.beginPath(); g.moveTo(hx, hy + .04); g.lineTo(hx, hy - .36); g.stroke(); g.fillRect(hx - .07, hy - .42, .14, .08); }
    if (w === 'staff') { g.lineWidth = .016; g.beginPath(); g.moveTo(hx, hy + .45); g.lineTo(hx, hy - .5); g.stroke(); g.beginPath(); g.arc(hx, hy - .52, .03, 0, PI * 2); g.fill(); }
    if (w === 'dagger') { g.lineWidth = .014; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + .1, hy - .14); g.stroke(); }
    if (w === 'crossbow') { g.lineWidth = .02; g.beginPath(); g.moveTo(hx - .08, hy - .04); g.lineTo(hx + .2, hy - .1); g.stroke(); g.lineWidth = .012; g.beginPath(); g.moveTo(hx + .14, hy - .17); g.lineTo(hx + .18, hy - .02); g.stroke(); }
    if (w === 'torch' || w === 'lantern') { g.lineWidth = .016; g.beginPath(); g.moveTo(hx, hy + .05); g.lineTo(hx, hy - .2); g.stroke(); }
    if (F.shield) { const [sx, sy] = st.hands[0]; g.beginPath(); g.arc(sx - .01, sy - .1, .1, 0, PI * 2); g.fill(); }
    g.restore();
    if ((w === 'torch' || w === 'lantern') && col !== T.pal.paper) { // the flame is spot colour and stays bright
      const pal = T.pal, fx = hx, fy = hy - .24 + yo, fl = Math.sin(st.t * 17) * .01;
      g.fillStyle = pal.spot; g.beginPath(); g.moveTo(fx - .04, fy); g.quadraticCurveTo(fx, fy - .14 - fl, fx + .04 + fl, fy); g.fill(); g.fillStyle = pal.spot2; g.beginPath(); g.moveTo(fx - .02, fy); g.quadraticCurveTo(fx, fy - .07, fx + .02, fy); g.fill();
    }
  }
  T.figure = figure;

  /* ---------- d20 for skill checks ---------- */
  T.d20 = function (g, x, y, R, n, col, t) {
    const pal = T.pal; g.save(); g.translate(x, y); g.rotate(Math.sin(t * 9) * .08);
    const pts = []; for (let i = 0; i < 6; i++) { const a = -PI / 2 + i * PI / 3; pts.push([Math.cos(a) * R, Math.sin(a) * R]); }
    g.fillStyle = pal.ink; poly(g, pts); g.fill(); g.strokeStyle = col || pal.paper; g.lineWidth = 4; g.stroke();
    const inner = [[0, -R * .55], [R * .5, R * .32], [-R * .5, R * .32]]; poly(g, inner); g.lineWidth = 2.5; g.stroke();
    g.lineWidth = 2; for (let i = 0; i < 6; i++) { const p = pts[i], q = inner[Math.floor(((i + 1) % 6) / 2) % 3]; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); }
    g.fillStyle = col || pal.paper; g.font = `${Math.round(R * .5)}px "Bebas Neue", Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 0, R * .02);
    g.restore();
  };
})(window.T);
