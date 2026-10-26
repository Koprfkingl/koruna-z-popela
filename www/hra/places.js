/* Koruna z popela – the places, painted as ink and paper. Each place has a palette, a static layer (cached)
   and an animated layer (rain, fire, fog). Figures stand on the floor line `fy`. */
(function (T) {
  'use strict';
  const PI = Math.PI, W = 1280, H = 720;
  const { poly, smooth, slash, rnd } = T;
  const P = () => T.pal;

  function sky300(g, y1) { const p = P(); const gr = g.createLinearGradient(0, 0, 0, y1); gr.addColorStop(0, p.sky0); gr.addColorStop(1, p.sky1); g.fillStyle = gr; g.fillRect(0, 0, W, y1); }
  function moon(g, x, y, r, col) { g.fillStyle = col || P().paper; g.beginPath(); g.arc(x, y, r, 0, PI * 2); g.fill(); }
  function bricks(g, x0, y0, x1, y1, bw, bh, col, lw) { g.strokeStyle = col; g.lineWidth = lw || 1.5; for (let y = y0, row = 0; y < y1; y += bh, row++) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); for (let x = x0 + (row % 2) * bw / 2; x < x1; x += bw) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + bh); g.stroke(); } } }
  function hatch(g, x0, y0, x1, y1, step, ang, col, lw) { g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip(); g.strokeStyle = col; g.lineWidth = lw || 1.5; const d = (y1 - y0) / Math.tan(ang || PI / 3); for (let x = x0 - Math.abs(d); x < x1 + Math.abs(d); x += step) { g.beginPath(); g.moveTo(x, y1); g.lineTo(x + d, y0); g.stroke(); } g.restore(); }
  function house(g, x, w, base, top, roof, lit, r) {
    const p = P(); g.fillStyle = p.ink; poly(g, [[x, base], [x, top], [x + w / 2, top - roof], [x + w, top], [x + w, base]]); g.fill();
    g.strokeStyle = p.paper; g.lineWidth = 2; g.beginPath(); g.moveTo(x + w / 2, top - roof); g.lineTo(x, top); g.stroke();
    for (let wy = top + 20; wy < base - 60; wy += 70) for (let wx = x + 18; wx < x + w - 30; wx += 46) if (r() < lit) { g.fillStyle = r() < .2 ? p.spot2 : p.paper; g.fillRect(wx, wy, 20, 30); g.fillStyle = p.ink; g.fillRect(wx + 9, wy, 2, 30); g.fillRect(wx, wy + 13, 20, 2); }
  }
  function tree(g, x, base, h, r, col, lean) {
    const p = P(); g.fillStyle = col || p.ink; g.strokeStyle = col || p.ink; lean = lean || 0;
    poly(g, [[x - 14, base], [x - 8 + lean * .3, base - h * .6], [x - 4 + lean, base - h], [x + 4 + lean, base - h], [x + 8 + lean * .3, base - h * .6], [x + 16, base]]); g.fill();
    g.lineCap = 'round';
    const br = (bx, by, len, ang, w, d) => { if (d > 4 || len < 8) return; const ex = bx + Math.cos(ang) * len, ey = by + Math.sin(ang) * len; g.lineWidth = w; g.beginPath(); g.moveTo(bx, by); g.lineTo(ex, ey); g.stroke(); br(ex, ey, len * .7, ang - .4 - r() * .3, w * .65, d + 1); br(ex, ey, len * .65, ang + .4 + r() * .3, w * .6, d + 1); };
    for (let i = 0; i < 4; i++) br(x + lean * (.4 + i * .15), base - h * (.45 + i * .15), h * (.3 - i * .04), -PI / 2 + (i % 2 ? .7 : -.7) + (r() - .5) * .4, 9 - i, 0);
  }
  function floorLine(g, y, col) { g.fillStyle = col || P().ink; g.fillRect(0, y, W, H - y); }
  function puddles(g, y, r) { const p = P(); for (let i = 0; i < 8; i++) { const x = r() * W, w = 60 + r() * 140; g.fillStyle = p.paper; g.globalAlpha = .7; g.beginPath(); g.ellipse(x, y + 20 + r() * (H - y - 40), w, 5 + r() * 6, 0, 0, PI * 2); g.fill(); g.globalAlpha = 1; } }
  function torch(g, x, y, t) { const p = P(); g.fillStyle = p.ink; g.fillRect(x - 4, y, 8, 40); const f = Math.sin(t * 13 + x) * 4; g.fillStyle = p.spot; g.beginPath(); g.moveTo(x - 12, y); g.quadraticCurveTo(x + f, y - 50, x + 12, y); g.fill(); g.fillStyle = p.spot2; g.beginPath(); g.moveTo(x - 6, y); g.quadraticCurveTo(x + f * .5, y - 26, x + 6, y); g.fill(); const gr = g.createRadialGradient(x, y - 10, 0, x, y - 10, 160); gr.addColorStop(0, 'rgba(232,200,26,.18)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - 160, y - 170, 320, 320); }
  function candle(g, x, y, t) { const p = P(); g.fillStyle = p.paper; g.fillRect(x - 5, y, 10, 28); const f = Math.sin(t * 11 + x) * 2; g.fillStyle = p.spot2; g.beginPath(); g.moveTo(x - 5, y); g.quadraticCurveTo(x + f, y - 22, x + 5, y); g.fill(); const gr = g.createRadialGradient(x, y - 6, 0, x, y - 6, 90); gr.addColorStop(0, 'rgba(232,200,26,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - 90, y - 96, 180, 180); }
  function flames(g, x, base, w, h, t, seed) { const p = P(), r = rnd(seed || 3); for (let i = 0; i < 9; i++) { const fx = x + (r() - .5) * w, fh = h * (.5 + r() * .5) * (1 + Math.sin(t * 7 + i * 2) * .12), fw = w * (.12 + r() * .1); g.fillStyle = i % 3 === 0 ? p.spot2 : p.spot; g.beginPath(); g.moveTo(fx - fw, base); g.quadraticCurveTo(fx - fw * .3 + Math.sin(t * 9 + i) * 8, base - fh * .7, fx + Math.sin(t * 5 + i) * 10, base - fh); g.quadraticCurveTo(fx + fw * .4, base - fh * .5, fx + fw, base); g.fill(); } }
  function smoke(g, x, y, t, col) { for (let i = 0; i < 8; i++) { const k = (t * .08 + i / 8) % 1; g.fillStyle = col || 'rgba(10,9,9,.55)'; g.beginPath(); g.arc(x + Math.sin(k * 6 + i) * 30 + k * 80, y - k * 380, 30 + k * 70, 0, PI * 2); g.fill(); } }
  function crows(g, t, n, y0) { const p = P(); g.fillStyle = p.ink; for (let i = 0; i < n; i++) { const x = (i * 211 + t * (30 + i * 7)) % (W + 100) - 50, y = y0 + Math.sin(t + i) * 20 + i * 9, f = Math.sin(t * 8 + i) * 8; g.beginPath(); g.moveTo(x - 16, y - f); g.quadraticCurveTo(x - 6, y - 4, x, y); g.quadraticCurveTo(x + 6, y - 4, x + 16, y - f); g.lineTo(x, y + 3); g.fill(); } }
  function gallows(g, x, base, h, col, rope) { g.fillStyle = col || P().ink; g.fillRect(x, base - h, 12, h); g.fillRect(x - 10, base - h, h * .5, 12); poly(g, [[x + 12, base - h + 50], [x + 12, base - h + 62], [x + 60, base - h + 12], [x + 46, base - h + 12]]); g.fill(); if (rope !== false) { g.strokeStyle = col || P().ink; g.lineWidth = 3; g.beginPath(); g.moveTo(x + h * .45, base - h + 10); g.lineTo(x + h * .45, base - h + 80); g.stroke(); g.beginPath(); g.ellipse(x + h * .45, base - h + 92, 9, 13, 0, 0, PI * 2); g.stroke(); } }
  function columns(g, xs, top, base, w) { const p = P(); xs.forEach(x => { g.fillStyle = p.ink; g.fillRect(x - w / 2, top, w, base - top); g.fillStyle = p.paper; g.fillRect(x - w / 2 + 6, top, 6, base - top); g.fillStyle = p.ink; g.fillRect(x - w / 2 - 12, top, w + 24, 22); g.fillRect(x - w / 2 - 12, base - 22, w + 24, 22); }); }
  function banner(g, x, y, w, h, t) { const p = P(); const s = Math.sin(t * 1.2 + x) * 6; g.fillStyle = p.spot; poly(g, [[x, y], [x + w, y], [x + w + s, y + h], [x + w / 2 + s, y + h - 30], [x + s, y + h]]); g.fill(); g.fillStyle = p.ink; g.globalAlpha = .45; poly(g, [[x + w * .6, y], [x + w, y], [x + w + s, y + h], [x + w * .6 + s, y + h - 18]]); g.fill(); g.globalAlpha = 1; g.strokeStyle = p.ink; g.lineWidth = 3; g.beginPath(); g.arc(x + w / 2 + s * .5, y + h * .4, w * .22, 0, PI * 2); g.stroke(); }
  function bars(g, x, y, w, h, n, col) { g.fillStyle = col || P().ink; for (let i = 0; i <= n; i++) g.fillRect(x + i * (w / n) - 4, y, 8, h); g.fillRect(x, y + h * .3, w, 7); }

  const PL = {};
  PL.vez = { pal: 'noir', light: 1, fy: 640, name: 'Věž na hradě Vranov', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      // tall window: rain-lit paper beyond, with bars
      g.fillStyle = p.paper; g.beginPath(); g.moveTo(760, 560); g.lineTo(760, 200); g.arc(900, 200, 140, PI, 0); g.lineTo(1040, 560); g.fill();
      moon(g, 960, 170, 50, p.ink); moon(g, 976, 160, 50, p.paper);
      bars(g, 760, 60, 280, 500, 5);
      // window light on the floor
      g.fillStyle = p.paper; poly(g, [[760, 560], [1040, 560], [940, 720], [420, 720]]); g.fill(); g.fillStyle = p.ink; for (let i = 0; i <= 5; i++) poly(g, [[760 + i * 56 - 4, 560], [760 + i * 56 + 4, 560], [420 + i * 104 + 10, 720], [420 + i * 104 - 10, 720]]), g.fill();
      // bed, chest, a small mirror
      g.fillStyle = p.ink; g.fillRect(60, 470, 360, 150); g.fillRect(60, 300, 26, 320); g.fillRect(394, 380, 26, 240);
      g.strokeStyle = p.paper; g.lineWidth = 3; g.beginPath(); g.moveTo(86, 470); g.quadraticCurveTo(240, 440, 394, 470); g.stroke(); slash(g, 140, 500, 200, .05, 5, p.paper);
      g.strokeStyle = p.paper; g.lineWidth = 2; g.strokeRect(520, 240, 90, 130); g.fillStyle = p.paper; slash(g, 530, 250, 80, .9, 3, p.paper);
      g.fillStyle = p.ink; g.fillRect(480, 560, 150, 80); g.strokeStyle = p.paper; g.strokeRect(480, 560, 150, 80);
      // twenty years of tally marks scratched into the wall
      g.strokeStyle = p.paper; g.lineWidth = 1.5; for (let i = 0; i < 40; i++) { const x = 140 + (i % 10) * 26, y = 120 + Math.floor(i / 10) * 40; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x + k * 4, y); g.lineTo(x + k * 4, y + 24); g.stroke(); } g.beginPath(); g.moveTo(x - 3, y + 18); g.lineTo(x + 17, y + 4); g.stroke(); }
    }, anim(g, t) { const p = P(); g.save(); g.beginPath(); g.moveTo(760, 560); g.lineTo(760, 200); g.arc(900, 200, 140, PI, 0); g.lineTo(1040, 560); g.clip(); T.rain(g, W, H, t, 1.2, 'rgba(10,9,9,.6)'); g.restore(); candle(g, 560, 532, t); }
  };
  PL.schody = { pal: 'blood', light: -1, fy: 650, name: 'Schodiště ve věži', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      // a spiral stair seen from above-ish: white step edges curving down into black
      for (let i = 0; i < 14; i++) { const y = 80 + i * 44, x0 = 300 + Math.sin(i * .5) * 160, w = 520 - i * 10; g.fillStyle = p.paper; poly(g, [[x0, y], [x0 + w, y - 10], [x0 + w - 20, y + 12], [x0 + 10, y + 18]]); g.fill(); }
      g.fillStyle = p.ink; g.beginPath(); g.ellipse(640, 300, 130, 320, 0, 0, PI * 2); g.fill();
      bricks(g, 0, 0, 220, H, 60, 34, p.paper, 1); bricks(g, 1060, 0, W, H, 60, 34, p.paper, 1);
      floorLine(g, 650); g.fillStyle = p.paper; g.fillRect(0, 650, W, 4);
    }, anim(g, t) { torch(g, 160, 260, t); torch(g, 1120, 300, t); }
  };
  PL.loznice = { pal: 'blood', light: 1, fy: 650, name: 'Královská ložnice', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      g.fillStyle = p.paper; g.fillRect(980, 80, 160, 420); bars(g, 980, 80, 160, 420, 3); g.fillStyle = p.paper; poly(g, [[980, 500], [1140, 500], [1000, 720], [640, 720]]); g.fill();
      // the canopy bed, curtains in spot red
      g.fillStyle = p.ink; g.fillRect(260, 140, 20, 470); g.fillRect(800, 140, 20, 470); g.fillRect(240, 120, 600, 40);
      g.fillStyle = p.spot; poly(g, [[260, 160], [360, 160], [330, 420], [280, 600], [260, 600]]); g.fill(); poly(g, [[820, 160], [720, 160], [760, 400], [800, 600], [820, 600]]); g.fill();
      g.fillStyle = p.paper; poly(g, [[300, 470], [790, 470], [800, 530], [290, 530]]); g.fill(); g.fillStyle = p.ink; g.fillRect(280, 530, 540, 90);
      for (let i = 0; i < 6; i++) slash(g, 330 + i * 70, 486, 60, .1, 4, p.ink);
      // the old king, lying, crown on the pillow
      g.fillStyle = p.ink; g.beginPath(); g.ellipse(360, 462, 40, 22, 0, 0, PI * 2); g.fill(); g.fillStyle = p.paper; g.beginPath(); g.ellipse(350, 458, 18, 14, 0, 0, PI * 2); g.fill();
      g.fillStyle = p.spot2; poly(g, [[392, 446], [394, 426], [404, 438], [412, 422], [420, 438], [430, 426], [432, 446]]); g.fill();
      g.fillStyle = p.ink; for (let i = 0; i < 5; i++) { g.fillRect(140 + i * 12, 560, 6, 50); }
    }, anim(g, t) { candle(g, 160, 532, t); candle(g, 900, 560, t); const f = T.lightning(g, W, H, t, 3); if (f) { g.fillStyle = `rgba(236,230,214,${f * .25})`; g.fillRect(0, 0, W, H); } }
  };
  PL.trunni = { pal: 'blood', light: -1, fy: 660, name: 'Trůnní sál', draw(g, r) {
      const p = P(); g.fillStyle = p.paper; g.fillRect(0, 0, W, H);
      // light from tall windows on the left: long black shadows of columns
      for (let i = 0; i < 5; i++) { g.fillStyle = p.ink; poly(g, [[120 + i * 240, 660], [170 + i * 240, 660], [460 + i * 240, 720], [380 + i * 240, 720]]); g.fill(); }
      columns(g, [120, 360, 920, 1160], 0, 660, 50);
      g.fillStyle = p.ink; g.fillRect(0, 0, W, 60); g.fillRect(0, 660, W, 60); g.fillStyle = p.paper; g.fillRect(0, 664, W, 3);
      // throne on steps, banners
      for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? p.paper : p.ink; g.fillRect(500 - i * 30, 600 + i * 15, 280 + i * 60, 15); }
      g.fillStyle = p.ink; poly(g, [[580, 600], [580, 360], [610, 320], [640, 290], [670, 320], [700, 360], [700, 600]]); g.fill(); g.strokeStyle = p.paper; g.lineWidth = 3; g.beginPath(); g.moveTo(580, 600); g.lineTo(580, 360); g.lineTo(640, 290); g.stroke();
      g.fillStyle = p.spot; g.fillRect(605, 420, 70, 90);
    }, anim(g, t) { banner(g, 240, 60, 70, 300, t); banner(g, 1000, 60, 70, 300, t); }
  };
  PL.hradby = { pal: 'noir', light: 1, fy: 600, name: 'Na hradbách', draw(g, r) {
      const p = P(); g.fillStyle = p.paper; g.fillRect(0, 0, W, H); moon(g, 920, 220, 170, p.ink); moon(g, 940, 210, 160, p.paper); g.strokeStyle = p.ink; g.lineWidth = 2; g.beginPath(); g.arc(940, 210, 160, 0, PI * 2); g.stroke();
      // the city far below: roofs, a spire
      g.fillStyle = p.ink; for (let x = 0; x < W; x += 50) { const h = 60 + r() * 120; poly(g, [[x, 720], [x, 720 - h], [x + 25, 720 - h - 30], [x + 50, 720 - h], [x + 50, 720]]); g.fill(); }
      g.fillRect(380, 360, 18, 300); poly(g, [[370, 360], [389, 250], [408, 360]]); g.fill();
      // battlements in front
      g.fillRect(0, 600, W, 120); for (let x = 0; x < W; x += 120) g.fillRect(x, 540, 70, 70);
      g.fillStyle = p.paper; for (let x = 0; x < W; x += 120) g.fillRect(x + 64, 540, 6, 70);
      g.strokeStyle = p.ink; g.lineWidth = 4; g.beginPath(); g.moveTo(1180, 0); g.lineTo(1180, 600); g.stroke();
    }, anim(g, t) { T.rain(g, W, H, t, 1.2, 'rgba(10,9,9,.55)'); crows(g, t, 3, 140); const f = T.lightning(g, W, H, t, 5); if (f) { g.fillStyle = `rgba(10,9,9,${f * .3})`; g.fillRect(0, 0, W, H); } }
  };
  PL.ulice = { pal: 'noir', light: -1, fy: 620, name: 'Popelov, Uličky', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      // a slit of pale sky between leaning houses
      g.fillStyle = p.paper; poly(g, [[420, 0], [860, 0], [740, 460], [560, 460]]); g.fill();
      gallows(g, 610, 460, 150, p.ink);
      house(g, 0, 260, 620, 80, 60, .3, r); house(g, 240, 220, 620, 200, 60, .35, r); house(g, 1040, 240, 620, 60, 80, .3, r); house(g, 820, 240, 620, 180, 70, .35, r);
      floorLine(g, 620); g.fillStyle = p.paper; for (let i = 0; i < 18; i++) { const y = 630 + i * 6; g.fillRect(560 - i * 30, y, 180 + i * 60, 2); }
      puddles(g, 620, r);
      g.fillStyle = p.ink; g.fillRect(300, 330, 6, 290); g.fillRect(980, 330, 6, 290);
    }, anim(g, t) { T.rain(g, W, H, t, 1); [[303, 330], [983, 330]].forEach(([x, y]) => { const p = P(); g.fillStyle = p.spot2; g.fillRect(x - 12, y - 30, 24, 30); g.strokeStyle = p.ink; g.lineWidth = 3; g.strokeRect(x - 12, y - 30, 24, 30); const gr = g.createRadialGradient(x, y - 15, 0, x, y - 15, 120); gr.addColorStop(0, 'rgba(232,200,26,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - 120, y - 135, 240, 240); }); }
  };
  PL.hospoda = { pal: 'ember', light: 1, fy: 640, name: 'Hospoda U Oběšence', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      g.fillStyle = p.paper; g.fillRect(0, 0, W, 260); for (let x = 0; x < W; x += 160) { g.fillStyle = p.ink; g.fillRect(x, 0, 40, 260); } g.fillRect(0, 230, W, 40); g.fillRect(0, 0, W, 30);
      hatch(g, 0, 30, W, 230, 9, PI / 2.4, p.ink, 1.2);
      // fireplace on the right
      g.fillStyle = p.paper; g.fillRect(940, 300, 300, 340); g.fillStyle = p.ink; g.fillRect(980, 400, 220, 240); bricks(g, 940, 300, 1240, 400, 40, 20, p.ink, 1.5);
      // barrels and tables
      for (let i = 0; i < 3; i++) { g.fillStyle = p.ink; g.beginPath(); g.ellipse(80 + i * 90, 560, 44, 70, 0, 0, PI * 2); g.fill(); g.strokeStyle = p.paper; g.lineWidth = 3; g.beginPath(); g.ellipse(80 + i * 90, 560, 44, 70, 0, -PI * .45, PI * .45); g.stroke(); g.beginPath(); g.moveTo(40 + i * 90, 530); g.lineTo(120 + i * 90, 530); g.stroke(); }
      g.fillStyle = p.ink; g.fillRect(420, 540, 360, 18); g.fillRect(440, 556, 14, 84); g.fillRect(746, 556, 14, 84); g.fillStyle = p.paper; g.fillRect(420, 540, 360, 4);
      // the sign: a noose
      g.strokeStyle = p.paper; g.lineWidth = 4; g.beginPath(); g.moveTo(640, 30); g.lineTo(640, 110); g.stroke(); g.beginPath(); g.ellipse(640, 128, 14, 20, 0, 0, PI * 2); g.stroke();
      floorLine(g, 640);
    }, anim(g, t) { flames(g, 1090, 640, 160, 130, t, 7); const p = P(); const gr = g.createRadialGradient(1090, 560, 0, 1090, 560, 520); gr.addColorStop(0, 'rgba(224,86,26,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); smoke(g, 600, 260, t, 'rgba(232,220,203,.06)'); }
  };
  PL.lekarna = { pal: 'blood', light: -1, fy: 640, name: 'Lékárna U Zlatého hada', draw(g, r) {
      const p = P(); g.fillStyle = p.paper; g.fillRect(0, 0, W, H);
      // shelves of bottles: ink shelves, paper bottles with ink outlines
      for (let s = 0; s < 4; s++) { const y = 90 + s * 110; g.fillStyle = p.ink; g.fillRect(80, y + 80, 1120, 12); for (let i = 0; i < 22; i++) { const x = 100 + i * 50 + r() * 10, h = 30 + r() * 40, w = 18 + r() * 12; g.fillStyle = r() < .4 ? p.ink : p.paper; g.strokeStyle = p.ink; g.lineWidth = 2; g.beginPath(); g.rect(x, y + 80 - h, w, h); g.fill(); g.stroke(); g.fillRect(x + w / 3, y + 80 - h - 10, w / 3, 10); } }
      // light from a window on the left leaves the right side in deep shadow
      g.fillStyle = p.ink; poly(g, [[700, 0], [W, 0], [W, H], [900, H]]); g.fill();
      // counter, slumped body, the spilled ledger and spot red
      g.fillStyle = p.ink; g.fillRect(260, 470, 700, 40); g.fillRect(280, 510, 660, 130);
      g.fillStyle = p.spot; smooth(g, [[480, 470], [640, 466], [700, 480], [760, 520], [700, 560], [640, 500]]); g.fill(); for (let i = 0; i < 6; i++) g.fillRect(640 + i * 14, 510, 4, 30 + i * 9);
      g.fillStyle = p.ink; g.beginPath(); g.ellipse(560, 440, 70, 36, -.2, 0, PI * 2); g.fill(); g.beginPath(); g.arc(500, 430, 26, 0, PI * 2); g.fill(); g.strokeStyle = p.paper; g.lineWidth = 3; g.beginPath(); g.arc(500, 430, 26, PI * .8, PI * 1.6); g.stroke();
      g.fillStyle = p.paper; poly(g, [[760, 462], [850, 452], [860, 470], [770, 480]]); g.fill();
      floorLine(g, 640);
    }, anim(g, t) { }
  };
  PL.skvara = { pal: 'fire', light: 1, fy: 640, name: 'Škvára, dračí čtvrť', draw(g, r) {
      const p = P(); const gr = g.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, p.ink); gr.addColorStop(.55, '#5a1a08'); gr.addColorStop(1, p.spot); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // burning shells of houses
      for (let i = 0; i < 7; i++) { const x = i * 190 - 30, w = 150 + r() * 40, h = 200 + r() * 200; g.fillStyle = p.ink; poly(g, [[x, 640], [x, 640 - h], [x + w * .3, 640 - h - 40 * r()], [x + w * .5, 640 - h + 30], [x + w * .8, 640 - h - 20], [x + w, 640 - h + 10], [x + w, 640]]); g.fill(); for (let k = 0; k < 3; k++) { g.fillStyle = r() < .5 ? p.spot2 : p.spot; g.fillRect(x + 20 + k * 40, 640 - h + 60 + r() * 60, 22, 34); } }
      floorLine(g, 640); g.fillStyle = p.spot; for (let i = 0; i < 30; i++) g.fillRect(r() * W, 650 + r() * 60, 20 + r() * 60, 2);
      // a painted slur on a wall, crossed out by someone braver
      g.fillStyle = p.paper; g.font = '38px "Bebas Neue", Impact, sans-serif'; g.fillText('ŠUPINÁČI DO OHNĚ', 40, 300); g.strokeStyle = p.spot; g.lineWidth = 6; g.beginPath(); g.moveTo(30, 296); g.lineTo(330, 270); g.stroke();
    }, anim(g, t) { flames(g, 200, 640, 260, 220, t, 1); flames(g, 1050, 640, 300, 260, t, 2); flames(g, 640, 420, 120, 120, t, 3); T.embers(g, W, H, t); smoke(g, 300, 400, t); smoke(g, 900, 380, t + 3); }
  };
  PL.stoky = { pal: 'noir', light: -1, fy: 600, name: 'Stoky pod Popelovem', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      // receding arches in paper outline
      for (let i = 0; i < 6; i++) { const k = 1 - i * .15, cx = 640, w = 560 * k, h = 520 * k, top = 360 - h * .55; g.strokeStyle = p.paper; g.lineWidth = 8 * k; g.beginPath(); g.moveTo(cx - w / 2, 600 - i * 26); g.lineTo(cx - w / 2, top + w / 2); g.arc(cx, top + w / 2, w / 2, PI, 0); g.lineTo(cx + w / 2, 600 - i * 26); g.stroke(); }
      // shaft of light from a street grate
      g.fillStyle = 'rgba(236,230,214,.9)'; poly(g, [[560, 0], [660, 0], [760, 600], [520, 600]]); g.fill(); g.fillStyle = p.ink; for (let i = 0; i < 5; i++) poly(g, [[565 + i * 20, 0], [572 + i * 20, 0], [540 + i * 48 + 10, 600], [540 + i * 48, 600]]), g.fill();
      // water channel
      g.fillStyle = p.ink; g.fillRect(0, 600, W, 120); g.fillStyle = p.paper; for (let i = 0; i < 40; i++) { const y = 610 + r() * 100; g.fillRect(r() * W, y, 30 + r() * 120, 2); }
      g.fillStyle = p.spot; for (let i = 0; i < 6; i++) { const x = 60 + r() * 300 + (i > 2 ? 800 : 0), y = 420 + r() * 120; g.beginPath(); g.arc(x, y, 3, 0, PI * 2); g.arc(x + 12, y, 3, 0, PI * 2); g.fill(); }
    }, anim(g, t) { const p = P(); g.fillStyle = 'rgba(236,230,214,.5)'; for (let i = 0; i < 20; i++) { const x = 540 + (i * 37) % 200, y = (t * 120 + i * 53) % 600; g.fillRect(x, y, 1.5, 12); } }
  };
  PL.chram = { pal: 'gold', light: -1, fy: 650, name: 'Chrám Bledého plamene', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      // tall windows throw white blades of light across the nave
      for (let i = 0; i < 4; i++) { const x = 60 + i * 120; g.fillStyle = p.paper; g.fillRect(x, 60, 50, 260); g.beginPath(); g.arc(x + 25, 60, 25, PI, 0); g.fill(); poly(g, [[x, 320], [x + 50, 320], [x + 700, 720], [x + 520, 720]]); g.fill(); }
      // the pale flame on the altar
      g.fillStyle = p.paper; g.beginPath(); g.moveTo(980, 420); g.quadraticCurveTo(900, 300, 1000, 120); g.quadraticCurveTo(990, 260, 1060, 300); g.quadraticCurveTo(1080, 220, 1050, 160); g.quadraticCurveTo(1150, 300, 1080, 420); g.fill();
      g.fillStyle = p.ink; g.fillRect(900, 420, 260, 30); g.fillRect(930, 450, 200, 200);
      // pews
      for (let i = 0; i < 5; i++) { g.fillStyle = p.ink; g.fillRect(140 + i * 130, 560 + i * 8, 100, 90); g.fillStyle = p.paper; g.fillRect(140 + i * 130, 560 + i * 8, 100, 3); }
      floorLine(g, 650);
      g.fillStyle = p.spot; g.beginPath(); g.arc(1030, 400, 8, 0, PI * 2); g.fill();
    }, anim(g, t) { const p = P(); g.save(); g.globalAlpha = .2 + Math.sin(t * 2) * .05; g.fillStyle = p.spot; g.beginPath(); g.arc(1030, 280, 140, 0, PI * 2); g.fill(); g.restore(); }
  };
  PL.brana = { pal: 's300', light: 1, fy: 620, name: 'Brána Popelova', draw(g, r) {
      const p = P(); sky300(g, 620); moon(g, 900, 300, 120, p.paper);
      g.fillStyle = p.ink; g.fillRect(120, 160, 180, 460); g.fillRect(980, 160, 180, 460); for (let x = 120; x < 300; x += 40) g.fillRect(x, 130, 24, 40); for (let x = 980; x < 1160; x += 40) g.fillRect(x, 130, 24, 40);
      g.fillRect(300, 220, 680, 80); g.beginPath(); g.moveTo(300, 620); g.lineTo(300, 300); g.lineTo(980, 300); g.lineTo(980, 620); g.lineTo(860, 620); g.lineTo(860, 420); g.arc(640, 420, 220, 0, PI, true); g.lineTo(420, 620); g.fill();
      // gibbet cages hanging from the gate
      [[350, 300], [930, 300]].forEach(([x, y]) => { g.strokeStyle = p.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 60); g.stroke(); g.strokeRect(x - 22, y + 60, 44, 80); for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x - 22 + k * 11, y + 60); g.lineTo(x - 22 + k * 11, y + 140); g.stroke(); } });
      g.fillStyle = p.mid; poly(g, [[0, 620], [W, 620], [W, H], [0, H]]); g.fill(); g.fillStyle = p.ink; poly(g, [[540, 620], [740, 620], [980, H], [300, H]]); g.fill();
      hatch(g, 0, 620, W, H, 10, PI / 3, p.ink, 1.2);
    }, anim(g, t) { crows(g, t, 5, 100); T.fog(g, W, H, t, 600, .35, '241,227,191'); }
  };
  PL.lhota = { pal: 's300', light: -1, fy: 630, name: 'Lhota, statek Bohoušů', draw(g, r) {
      const p = P(); sky300(g, 520);
      g.fillStyle = p.paper; g.beginPath(); g.arc(240, 230, 90, 0, PI * 2); g.fill();
      // hills and a wheat field in ochre
      g.fillStyle = p.mid; smooth(g, [[0, 520], [200, 470], [500, 500], [800, 460], [1100, 490], [1280, 470], [1280, 720], [0, 720]]); g.fill();
      g.strokeStyle = p.ink; g.lineWidth = 1.5; for (let i = 0; i < 200; i++) { const x = r() * W, y = 520 + r() * 100; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 3, y - 14); g.stroke(); }
      // farmhouse, barn, mill wheel, fence
      g.fillStyle = p.ink; poly(g, [[700, 600], [700, 400], [840, 300], [980, 400], [980, 600]]); g.fill(); g.fillStyle = p.spot2; g.fillRect(760, 450, 40, 50); g.fillRect(880, 450, 40, 50);
      g.fillStyle = p.ink; poly(g, [[1000, 600], [1000, 380], [1110, 300], [1220, 380], [1220, 600]]); g.fill();
      g.fillStyle = p.ink; g.fillRect(380, 420, 140, 180); g.beginPath(); g.arc(380, 520, 80, 0, PI * 2); g.lineWidth = 10; g.strokeStyle = p.ink; g.stroke(); for (let i = 0; i < 8; i++) { const a = i * PI / 4; g.beginPath(); g.moveTo(380, 520); g.lineTo(380 + Math.cos(a) * 80, 520 + Math.sin(a) * 80); g.lineWidth = 5; g.stroke(); }
      g.fillStyle = p.ink; for (let x = 0; x < W; x += 60) g.fillRect(x, 580, 8, 60); g.fillRect(0, 596, W, 6);
      g.fillStyle = p.ink; g.fillRect(0, 630, W, 90); hatch(g, 0, 630, W, H, 8, PI / 2.5, p.mid, 1.5);
      gallows(g, 560, 600, 130, p.ink, true);
    }, anim(g, t) { const p = P(); smoke(g, 840, 300, t, 'rgba(18,12,7,.4)'); crows(g, t, 4, 120); }
  };
  PL.mlyn = { pal: 'ember', light: 1, fy: 640, name: 'Starý mlýn', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      // beams and hay lit from a lantern
      g.fillStyle = p.paper; for (let i = 0; i < 6; i++) poly(g, [[i * 240 - 100, 0], [i * 240 - 60, 0], [i * 240 + 200, 640], [i * 240 + 150, 640]]), g.fill();
      g.fillStyle = p.ink; g.fillRect(0, 100, W, 30); g.fillRect(0, 300, W, 20);
      g.fillStyle = p.spot2; smooth(g, [[60, 640], [120, 480], [300, 440], [420, 500], [460, 640]]); g.fill(); g.strokeStyle = p.ink; g.lineWidth = 1.5; for (let i = 0; i < 70; i++) { const x = 90 + r() * 360, y = 480 + r() * 150; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - .5) * 30, y - 12); g.stroke(); }
      g.fillStyle = p.ink; g.beginPath(); g.arc(980, 380, 160, 0, PI * 2); g.fill(); g.strokeStyle = p.paper; g.lineWidth = 4; g.beginPath(); g.arc(980, 380, 160, 0, PI * 2); g.stroke(); g.beginPath(); g.arc(980, 380, 30, 0, PI * 2); g.stroke();
      floorLine(g, 640);
    }, anim(g, t) { const p = P(); const x = 640, y = 220 + Math.sin(t) * 6; g.strokeStyle = p.ink; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y); g.stroke(); g.fillStyle = p.spot2; g.fillRect(x - 12, y, 24, 30); const gr = g.createRadialGradient(x, y + 15, 0, x, y + 15, 380); gr.addColorStop(0, 'rgba(242,194,48,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); T.embers(g, W, H, t * .2, 0, W, 'rgba(236,230,214,.6)'); }
  };
  PL.les = { pal: 'noir', light: 1, fy: 640, name: 'Černý les', draw(g, r) {
      const p = P(); g.fillStyle = p.paper; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 12; i++) tree(g, r() * W, 720, 300 + r() * 300, r, 'rgba(10,9,9,.35)', (r() - .5) * 60);
      for (let i = 0; i < 7; i++) tree(g, 60 + i * 190 + r() * 60, 720, 520 + r() * 200, r, p.ink, (r() - .5) * 80);
      g.fillStyle = p.ink; g.fillRect(0, 640, W, 80); for (let i = 0; i < 60; i++) { const x = r() * W; poly(g, [[x, 640], [x + 4, 600 - r() * 40], [x + 9, 640]]); g.fill(); }
    }, anim(g, t) { T.fog(g, W, H, t, 520, .55); T.snow(g, W, H, t, .3, 'rgba(10,9,9,.6)'); const p = P(); if ((t % 7) < 4) { g.fillStyle = p.spot2; [[180, 560], [1120, 590], [920, 540]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 6, 2.5, 0, 0, PI * 2); g.ellipse(x + 18, y, 6, 2.5, 0, 0, PI * 2); g.fill(); }); } }
  };
  PL.vedma = { pal: 'teal', light: -1, fy: 640, name: 'Chýše Vědmy', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      g.fillStyle = p.paper; poly(g, [[300, 640], [320, 300], [520, 140], [760, 280], [800, 640]]); g.fill(); g.fillStyle = p.ink; poly(g, [[540, 140], [760, 280], [800, 640], [560, 640]]); g.fill();
      g.fillStyle = p.ink; g.fillRect(420, 460, 90, 180); g.fillStyle = p.spot; g.fillRect(620, 380, 50, 60);
      // bones and skulls hung on strings
      for (let i = 0; i < 9; i++) { const x = 330 + i * 52, y = 260 + Math.abs(4 - i) * 22; g.strokeStyle = p.paper; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y - 60); g.lineTo(x, y); g.stroke(); g.fillStyle = i % 2 ? p.paper : p.ink; g.beginPath(); g.arc(x, y + 8, 9, 0, PI * 2); g.fill(); g.strokeStyle = i % 2 ? p.ink : p.paper; g.stroke(); }
      for (let i = 0; i < 5; i++) tree(g, i < 2 ? 80 + i * 140 : 900 + i * 90, 720, 600, r, p.ink, (r() - .5) * 100);
      g.fillStyle = p.ink; g.fillRect(0, 640, W, 80);
      g.fillStyle = p.ink; g.beginPath(); g.ellipse(640, 620, 80, 30, 0, 0, PI * 2); g.fill(); g.strokeStyle = p.paper; g.lineWidth = 3; g.stroke();
    }, anim(g, t) { const p = P(); for (let i = 0; i < 6; i++) { const k = (t * .3 + i / 6) % 1; g.fillStyle = `rgba(63,181,168,${.5 * (1 - k)})`; g.beginPath(); g.arc(640 + Math.sin(k * 8 + i) * 20, 600 - k * 220, 10 + k * 26, 0, PI * 2); g.fill(); } T.fog(g, W, H, t, 600, .25); }
  };
  PL.zricenina = { pal: 'noir', light: 1, fy: 630, name: 'Zřícenina Dračí hrádek', draw(g, r) {
      const p = P(); g.fillStyle = p.paper; g.fillRect(0, 0, W, H); moon(g, 900, 200, 150, p.paper); g.strokeStyle = p.ink; g.lineWidth = 3; g.beginPath(); g.arc(900, 200, 150, 0, PI * 2); g.stroke(); hatch(g, 0, 0, W, 400, 14, PI / 2.2, 'rgba(10,9,9,.18)', 1);
      g.fillStyle = p.ink; poly(g, [[100, 630], [120, 200], [160, 180], [170, 230], [200, 150], [260, 170], [270, 630]]); g.fill();
      poly(g, [[700, 630], [720, 330], [760, 300], [800, 360], [830, 280], [880, 320], [890, 630]]); g.fill();
      poly(g, [[270, 630], [270, 420], [320, 430], [380, 400], [420, 440], [700, 450], [700, 630]]); g.fill();
      g.fillStyle = p.paper; g.beginPath(); g.moveTo(440, 630); g.lineTo(440, 540); g.arc(500, 540, 60, PI, 0); g.lineTo(560, 630); g.fill(); g.fillStyle = p.ink; g.beginPath(); g.moveTo(452, 630); g.lineTo(452, 548); g.arc(500, 548, 48, PI, 0); g.lineTo(548, 630); g.fill();
      g.fillStyle = p.paper; for (let i = 0; i < 6; i++) g.fillRect(130 + (i % 2) * 60, 260 + i * 50, 14, 28);
      g.fillStyle = p.ink; g.fillRect(0, 630, W, 90); for (let i = 0; i < 14; i++) { const x = r() * W; g.beginPath(); g.ellipse(x, 640, 30 + r() * 40, 16, 0, PI, 0); g.fill(); }
      tree(g, 1120, 720, 500, r, p.ink, -60);
    }, anim(g, t) { crows(g, t, 6, 120); T.fog(g, W, H, t, 600, .5); }
  };
  PL.krypta = { pal: 'blood', light: -1, fy: 640, name: 'Krypta Řádu', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 5; i++) { const x = 140 + i * 250; g.strokeStyle = p.paper; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 110, 640); g.lineTo(x - 110, 260); g.arc(x, 260, 110, PI, 0); g.lineTo(x + 110, 640); g.stroke(); }
      // stone knights on the sarcophagi
      for (let i = 0; i < 3; i++) { const x = 220 + i * 400; g.fillStyle = p.paper; g.fillRect(x - 130, 520, 260, 60); g.fillStyle = p.ink; g.fillRect(x - 130, 580, 260, 60); g.fillStyle = p.ink; g.beginPath(); g.ellipse(x, 512, 110, 18, 0, 0, PI * 2); g.fill(); g.strokeStyle = p.paper; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 100, 506); g.lineTo(x + 100, 506); g.stroke(); g.fillStyle = p.paper; g.beginPath(); g.arc(x - 104, 500, 14, 0, PI * 2); g.fill(); g.strokeStyle = p.spot; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 60, 500); g.lineTo(x + 70, 500); g.stroke(); }
      bricks(g, 0, 0, W, 120, 70, 30, p.paper, 1); floorLine(g, 640);
      g.fillStyle = p.paper; for (let i = 0; i < 20; i++) { g.beginPath(); g.arc(r() * W, 660 + r() * 50, 4 + r() * 6, 0, PI * 2); g.fill(); }
    }, anim(g, t) { candle(g, 90, 500, t); candle(g, 1190, 500, t); candle(g, 620, 480, t); }
  };
  PL.doupe = { pal: 'gold', light: 1, fy: 650, name: 'Dračí doupě', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      // a crack in the vault lets the moon in onto the hoard
      g.fillStyle = p.paper; poly(g, [[820, 0], [880, 0], [1100, 650], [700, 650]]); g.fill();
      g.fillStyle = p.spot; smooth(g, [[500, 650], [620, 560], [760, 520], [900, 500], [1060, 540], [1220, 600], [1280, 650]]); g.fill();
      g.fillStyle = p.ink; for (let i = 0; i < 80; i++) { const x = 560 + r() * 680, y = 560 + r() * 90; g.beginPath(); g.ellipse(x, y, 8, 3, 0, 0, PI * 2); g.fill(); }
      g.strokeStyle = p.ink; g.lineWidth = 3; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(700 + i * 110, 600, 24, PI, 0); g.stroke(); }
      for (let i = 0; i < 4; i++) { g.fillStyle = p.paper; g.fillRect(60 + i * 90, 150, 20, 500); }
      floorLine(g, 650);
      // bones of the dragon's kin, a skull with a horn
      g.fillStyle = p.paper; g.beginPath(); g.ellipse(250, 620, 90, 34, 0, 0, PI * 2); g.fill(); g.fillStyle = p.ink; g.beginPath(); g.arc(230, 612, 12, 0, PI * 2); g.fill(); g.fillStyle = p.paper; poly(g, [[300, 600], [380, 520], [320, 610]]); g.fill();
    }, anim(g, t) { const p = P(); g.fillStyle = 'rgba(236,230,214,.6)'; for (let i = 0; i < 30; i++) { const x = 760 + (i * 43) % 300 + Math.sin(t + i) * 10, y = (t * 20 + i * 37) % 650; g.fillRect(x, y, 2, 2); } }
  };
  PL.sibenice = { pal: 's300', light: 1, fy: 640, name: 'Náměstí šibenic', draw(g, r) {
      const p = P(); sky300(g, 640); g.fillStyle = p.spot; g.beginPath(); g.arc(640, 330, 150, 0, PI * 2); g.fill();
      g.fillStyle = p.ink; for (let x = -20; x < W; x += 110) { const h = 200 + r() * 160; poly(g, [[x, 560], [x, 560 - h], [x + 55, 560 - h - 50], [x + 110, 560 - h], [x + 110, 560]]); g.fill(); }
      // scaffold with three nooses
      g.fillStyle = p.ink; g.fillRect(380, 470, 520, 30); for (let i = 0; i < 5; i++) g.fillRect(390 + i * 120, 500, 14, 100); g.fillRect(420, 220, 16, 250); g.fillRect(840, 220, 16, 250); g.fillRect(400, 220, 480, 18);
      g.strokeStyle = p.ink; g.lineWidth = 3; [520, 640, 760].forEach(x => { g.beginPath(); g.moveTo(x, 238); g.lineTo(x, 330); g.stroke(); g.beginPath(); g.ellipse(x, 344, 10, 15, 0, 0, PI * 2); g.stroke(); });
      // the crowd: a sea of heads and spears
      g.fillStyle = p.ink; g.fillRect(0, 600, W, 120); for (let i = 0; i < 70; i++) { const x = r() * W, y = 590 + r() * 30; g.beginPath(); g.arc(x, y, 12 + r() * 6, 0, PI * 2); g.fill(); if (r() < .2) { g.fillRect(x, y - 140, 3, 140); poly(g, [[x - 5, y - 140], [x + 1.5, y - 160], [x + 8, y - 140]]); g.fill(); } }
    }, anim(g, t) { crows(g, t, 7, 90); }
  };
  PL.tabor = { pal: 'ember', light: 1, fy: 640, name: 'Tábor', draw(g, r) {
      const p = P(); g.fillStyle = p.ink; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(232,220,203,.85)'; for (let i = 0; i < 160; i++) { g.fillRect(r() * W, r() * 300, 1.5, 1.5); }
      moon(g, 1080, 120, 40, p.paper);
      for (let i = 0; i < 6; i++) tree(g, i < 3 ? i * 140 : 900 + (i - 3) * 140, 640, 400 + r() * 150, r, p.ink, (r() - .5) * 60);
      g.fillStyle = p.ink; g.fillRect(0, 640, W, 80);
      // tents
      g.fillStyle = p.paper; poly(g, [[180, 640], [300, 470], [420, 640]]); g.fill(); g.fillStyle = p.ink; poly(g, [[300, 470], [420, 640], [320, 640]]); g.fill();
      g.fillStyle = p.paper; poly(g, [[880, 640], [990, 490], [1100, 640]]); g.fill(); g.fillStyle = p.ink; poly(g, [[990, 490], [1100, 640], [1010, 640]]); g.fill();
      g.fillStyle = p.ink; g.beginPath(); g.ellipse(640, 640, 70, 16, 0, 0, PI * 2); g.fill(); g.strokeStyle = p.paper; g.lineWidth = 3; g.stroke();
    }, anim(g, t) { flames(g, 640, 640, 90, 110, t, 11); const gr = g.createRadialGradient(640, 600, 0, 640, 600, 520); gr.addColorStop(0, 'rgba(224,86,26,.3)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); T.embers(g, W, H, t, 560, 720); }
  };
  PL.cesta = { pal: 's300', light: -1, fy: 620, name: 'Cesta', draw(g, r) {
      const p = P(); sky300(g, 620);
      g.fillStyle = p.mid; smooth(g, [[0, 520], [300, 460], [700, 500], [1000, 440], [1280, 480], [1280, 720], [0, 720]]); g.fill();
      g.fillStyle = p.ink; for (let i = 0; i < 40; i++) { const x = r() * W, y = 470 + r() * 40; poly(g, [[x - 6, y + 10], [x, y - 20 - r() * 20], [x + 6, y + 10]]); g.fill(); }
      g.fillStyle = p.paper; poly(g, [[600, 470], [680, 470], [1000, 720], [200, 720]]); g.fill(); hatch(g, 0, 560, W, H, 12, PI / 3, 'rgba(18,12,7,.35)', 1.2);
      g.fillStyle = p.ink; g.fillRect(1040, 360, 10, 260); g.fillRect(1000, 380, 90, 8);
    }, anim(g, t) { crows(g, t, 3, 120); T.fog(g, W, H, t, 560, .25, '241,227,191'); }
  };
  PL.hrad = { pal: 's300', light: 1, fy: 640, name: 'Hrad Vranov', draw(g, r) {
      const p = P(); sky300(g, 640); g.fillStyle = p.spot; g.beginPath(); g.arc(300, 240, 100, 0, PI * 2); g.fill();
      g.fillStyle = p.ink; poly(g, [[0, 640], [200, 420], [400, 380], [700, 300], [1000, 360], [1280, 330], [1280, 640]]); g.fill();
      // the castle on its crag
      g.fillRect(600, 120, 70, 200); poly(g, [[590, 120], [635, 40], [680, 120]]); g.fill(); g.fillRect(500, 200, 360, 140); g.fillRect(820, 160, 60, 180); poly(g, [[812, 160], [850, 90], [888, 160]]); g.fill();
      for (let x = 500; x < 860; x += 30) g.fillRect(x, 186, 18, 20);
      g.fillStyle = p.paper; g.fillRect(626, 160, 10, 20); g.fillStyle = p.spot2; g.fillRect(846, 200, 8, 14);
      g.fillStyle = p.ink; g.fillRect(0, 640, W, 80);
    }, anim(g, t) { crows(g, t, 6, 100); T.fog(g, W, H, t, 400, .3, '241,227,191'); }
  };
  PL.popel = { pal: 'fire', light: 1, fy: 660, name: 'Popelov v plamenech', draw(g, r) { PL.skvara.draw(g, r); const p = P(); g.fillStyle = p.ink; g.fillRect(560, 80, 60, 200); poly(g, [[550, 80], [590, 10], [630, 80]]); g.fill(); }, anim(g, t) { PL.skvara.anim(g, t); const p = P(); g.save(); g.translate(640, 220); g.scale(1, 1); T.figure(g, T.C.kychal.F, 0, 0, 120, { t, face: -1, rim: true }); g.restore(); } };

  T.PL = PL;

  /* Cache the static layer per place and palette. */
  const cache = {};
  T.paintPlace = function (g, id, t) {
    const pl = PL[id] || PL.vez; T.setPal(pl.pal);
    const key = id; let c = cache[key];
    if (!c) { c = document.createElement('canvas'); c.width = W; c.height = H; const cg = c.getContext('2d'); pl.draw(cg, rnd(T.hash(id))); cache[key] = c; }
    g.drawImage(c, 0, 0);
    return pl;
  };
  T.placeAnim = function (g, id, t) { const pl = PL[id]; if (pl && pl.anim) pl.anim(g, t); };
  T.W = W; T.H = H;
})(window.T);
