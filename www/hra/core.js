/* Koruna z popela – the engine: hero, stats, d20 checks, story nodes, turn-based fights, party and approval,
   journal, saves, sound. Story files fill T.N with nodes. */
(function (T) {
  'use strict';
  const W = 1280, H = 720, PI = Math.PI;
  const $ = (s, el) => (el || document).querySelector(s);
  const h = (tag, attrs, ...kids) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === 'class') e.className = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]); else if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k]); } kids.flat().forEach(c => { if (c != null) e.append(c.nodeType ? c : document.createTextNode(c)); }); return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const d = n => 1 + Math.floor(Math.random() * n);
  const roll = (n, s, b) => { let t = b || 0; for (let i = 0; i < n; i++) t += d(s); return t; };

  /* ---------- rules ---------- */
  const STATS = [['sil', 'Síla', 'SÍL'], ['obr', 'Obratnost', 'OBR'], ['odl', 'Odolnost', 'ODL'], ['duv', 'Důvtip', 'DŮV'], ['mou', 'Moudrost', 'MOU'], ['cha', 'Charisma', 'CHA']];
  const SN = Object.fromEntries(STATS.map(s => [s[0], s[2]]));
  const RACES = {
    clovek: { name: 'Člověk', bon: { sil: 1, cha: 1 }, d: 'Nejpočetnější a nejhlasitější. Ve Vranově je člověk „normální“ – a tak tě nikdo nepodezírá.' },
    elf: { name: 'Půlelf', bon: { obr: 2, mou: 1 }, d: 'Půl krve z lesů, které lidé vykáceli. Vidíš ve tmě o kus dál. Trpaslíci ti nevěří, lidé tě přehlížejí.' },
    trpaslik: { name: 'Trpaslík', bon: { odl: 2, sil: 1 }, d: 'Tvrdá kost, tvrdá hlava. Jed ti ublíží méně. Cechy pod horou ti otevřou dveře, které jiným zůstanou zavřené.' },
    drak: { name: 'Dračí krev', bon: { sil: 2, cha: 1 }, d: 'Rohy, šupiny, uhlíkové oči. Lid, který Řád dvacet let pronásleduje. Jednou za souboj umíš chrlit oheň. Mnozí tě budou nenávidět jen za to, co jsi.' }
  };
  const CLASSES = {
    bojovnik: { name: 'Bojovník', base: { sil: 15, obr: 12, odl: 14, duv: 8, mou: 10, cha: 10 }, hp: 12, ac: 16, main: 'sil', prof: ['sil', 'odl'], d: 'Těžká zbroj, těžká čepel. Drtivý úder.', atk: 'Meč', dmg: [1, 10], spec: 'Drtivý úder', cd: 3 },
    zlodej: { name: 'Zloděj', base: { sil: 8, obr: 15, odl: 12, duv: 12, mou: 10, cha: 13 }, hp: 9, ac: 14, main: 'obr', prof: ['obr', 'duv'], d: 'Stín, dýka, zámky. Zákeřná rána.', atk: 'Dýka', dmg: [1, 6], spec: 'Zákeřná rána', cd: 3 },
    mag: { name: 'Mág', base: { sil: 8, obr: 12, odl: 12, duv: 15, mou: 13, cha: 10 }, hp: 7, ac: 12, main: 'duv', prof: ['duv', 'mou'], d: 'Oheň v dlaních a knihy v hlavě. Ohnivá koule.', atk: 'Ohnivý šíp', dmg: [1, 10], spec: 'Ohnivá koule', cd: 4 },
    bard: { name: 'Bard', base: { sil: 8, obr: 13, odl: 12, duv: 11, mou: 10, cha: 15 }, hp: 8, ac: 13, main: 'cha', prof: ['cha', 'obr'], d: 'Jazyk ostřejší než rapír. Zlomyslná píseň.', atk: 'Rapír', dmg: [1, 8], spec: 'Zlomyslná píseň', cd: 3 }
  };
  T.RACES = RACES; T.CLASSES = CLASSES; T.STATS = STATS;
  const mod = v => Math.floor((v - 10) / 2);
  const sgn = n => (n >= 0 ? '+' : '') + n;

  /* Companions in a fight. Their numbers grow with the hero's level. */
  const COMP = {
    ester: { hp: 12, ac: 14, hit: 5, dmg: [1, 8, 3], atk: 'kuše' },
    vojta: { hp: 18, ac: 15, hit: 5, dmg: [1, 10, 3], atk: 'sekera' },
    sarra: { hp: 16, ac: 15, hit: 5, dmg: [1, 10, 3], atk: 'kladivo', breath: 1 },
    radim: { hp: 18, ac: 17, hit: 6, dmg: [1, 8, 3], atk: 'meč' },
    plachta: { hp: 6, ac: 17, hit: 4, dmg: [1, 4, 0], atk: 'zuby', distract: 1 }
  };
  const FOES = {
    straz: { hp: 11, ac: 14, hit: 4, dmg: [1, 8, 2] },
    fanatik: { hp: 9, ac: 12, hit: 4, dmg: [1, 6, 2], burn: 1 },
    krysak: { hp: 7, ac: 13, hit: 4, dmg: [1, 4, 2] },
    vlk: { hp: 11, ac: 13, hit: 4, dmg: [2, 4, 2] },
    kostlivec: { hp: 13, ac: 15, hit: 4, dmg: [1, 8, 2] },
    ghul: { hp: 16, ac: 12, hit: 5, dmg: [2, 6, 1], stun: 1 },
    zoldak: { hp: 14, ac: 14, hit: 5, dmg: [1, 10, 2] },
    kat: { hp: 30, ac: 13, hit: 5, dmg: [2, 8, 2] },
    radim: { hp: 36, ac: 17, hit: 6, dmg: [1, 10, 3] },
    smudla: { hp: 22, ac: 15, hit: 5, dmg: [1, 6, 3], call: 'krysak' },
    sabina: { hp: 42, ac: 15, hit: 6, dmg: [2, 6, 3], aoe: [2, 6] },
    vilem: { hp: 64, ac: 15, hit: 7, dmg: [2, 8, 3], aoe: [3, 6] },
    kychal: { hp: 90, ac: 17, hit: 8, dmg: [3, 8, 4], aoe: [4, 6] },
    vedma: { hp: 30, ac: 13, hit: 6, dmg: [2, 6, 2], stun: 1 }
  };

  /* ---------- state ---------- */
  let G = null;
  const fresh = () => ({ v: 1, name: 'Mara', sex: 'f', race: 'clovek', cls: 'bojovnik', st: {}, lvl: 1, hp: 10, gold: 15, items: { lektvar: 2 }, f: {}, ap: {}, party: [], q: {}, qOrder: [], clues: [], node: null, act: 'Prolog', seen: {}, chosen: {}, kills: 0, day: 1, lore: [] });
  T.G = () => G;
  const hpMax = () => { const c = CLASSES[G.cls], m = mod(G.st.odl); return c.hp + m + (G.lvl - 1) * (Math.ceil(c.hp / 2) + 1 + m) + (G.f.bonusHp || 0); };
  const ac = () => CLASSES[G.cls].ac + (G.cls === 'bojovnik' ? 0 : Math.max(0, mod(G.st.obr) - 1)) + (G.f.zbroj ? 1 : 0);
  const prof = () => 2 + Math.floor((G.lvl - 1) / 3);
  T.mod = mod;

  /* text: {name}, {a} feminine ending, [[male|female]] */
  function fmt(s) {
    if (s == null) return '';
    if (typeof s === 'function') s = s(G, API);
    return String(s).replace(/\[\[([^|\]]*)\|([^\]]*)\]\]/g, (m, a, b) => G.sex === 'f' ? b : a)
      .replace(/\{a\}/g, G.sex === 'f' ? 'a' : '').replace(/\{name\}/g, G.name)
      .replace(/\{titul\}/g, G.sex === 'f' ? 'princezna' : 'princ').replace(/\{Titul\}/g, G.sex === 'f' ? 'Princezna' : 'Princ')
      .replace(/\{rasa\}/g, RACES[G.race].name.toLowerCase());
  }
  T.fmt = fmt;

  /* ---------- story API used by story files ---------- */
  const API = {
    has: k => !!G.f[k], set: (k, v) => { G.f[k] = v == null ? true : v; }, get: k => G.f[k], inc: (k, n) => { G.f[k] = (G.f[k] || 0) + (n == null ? 1 : n); },
    ap(c, n, quiet) { G.ap[c] = clamp((G.ap[c] || 0) + n, -10, 10); if (!quiet && T.C[c]) toast(`${T.C[c].name.split(' ')[0]} ${n > 0 ? (n > 1 ? 'to velmi oceňuje' : 'to oceňuje') : (n < -1 ? 'tím opovrhuje' : 'nesouhlasí')}`, n > 0 ? '' : 'bad'); },
    join(c) { if (!G.party.includes(c)) { G.party.push(c); toast(`${T.C[c].name} se přidává k družině`); } },
    leave(c, why) { G.party = G.party.filter(x => x !== c); toast(`${T.C[c].name} ${why || 'odchází'}`, 'bad'); },
    inParty: c => G.party.includes(c),
    romance(c) { if (G.f.rom !== c) { G.f.rom = c; toast(`♥ ${T.C[c].name}`, 'love'); } },
    unromance(c) { if (G.f.rom === c) { G.f.rom = null; toast(`♥ ${T.C[c].name} – konec`, 'bad'); } },
    rom: c => G.f.rom === c,
    quest(id, title, note) { if (!G.q[id]) { G.q[id] = { t: title, s: 'a', n: [] }; G.qOrder.push(id); toast('Nový úkol: ' + title); } if (note) G.q[id].n.push(fmt(note)); },
    note(id, note) { if (G.q[id]) { G.q[id].n.push(fmt(note)); toast('Deník doplněn'); } },
    done(id, ok) { if (G.q[id] && G.q[id].s === 'a') { G.q[id].s = ok === false ? 'f' : 'd'; toast((ok === false ? 'Úkol selhal: ' : 'Splněno: ') + G.q[id].t, ok === false ? 'bad' : ''); } },
    lore(id) { G.lore = G.lore || []; if (T.LORE && T.LORE[id] && !G.lore.includes(id)) { G.lore.push(id); toast('Kronika: ' + T.LORE[id].title); } },
    clue(id, text) { if (!G.clues.find(c => c.id === id)) { G.clues.push({ id, t: fmt(text) }); toast('Nový důkaz'); } },
    hasClue: id => !!G.clues.find(c => c.id === id),
    clues: () => G.clues.length,
    give(it, n) { G.items[it] = (G.items[it] || 0) + (n || 1); toast(`Získáno: ${ITEMS[it] ? ITEMS[it].n : it}${(n || 1) > 1 ? ' ×' + n : ''}`); },
    take(it, n) { G.items[it] = Math.max(0, (G.items[it] || 0) - (n || 1)); },
    item: it => G.items[it] || 0,
    gold(n) { G.gold = Math.max(0, G.gold + n); toast(`${n > 0 ? '+' : ''}${n} zlaťáků`, n > 0 ? '' : 'bad'); },
    heal(n) { G.hp = Math.min(hpMax(), G.hp + (n == null ? 999 : n)); },
    hurt(n) { G.hp = Math.max(1, G.hp - n); toast(`−${n} životů`, 'bad'); sfx('hit'); },
    rest() { G.hp = hpMax(); },
    levelUp, sfx, toast, fmt,
    stat: s => G.st[s], mod: s => mod(G.st[s]),
    race: r => G.race === r, cls: c => G.cls === c, fem: () => G.sex === 'f',
    get G() { return G; }
  };
  T.API = API;
  const ITEMS = {
    lektvar: { n: 'Léčivý lektvar', d: 'Vrátí 2k4+4 životů. V souboji stojí tah.' },
    klic: { n: 'Hedvičin klíč', d: 'Těžký železný klíč od kuchyňských dveří.' },
    supina: { n: 'Dračí šupina', d: 'Teplá jako dlaň. Kýchalův dar.' },
    slza: { n: 'Dračí slza', d: 'Jediná kapka. Vyléčí jakýkoli jed – jednou.' },
    pecet: { n: 'Kancléřova pečeť', d: 'Žlutý vosk, otisk hada.' },
    dopis: { n: 'Zašifrovaný dopis', d: 'Psaný kancléřovou rukou.' },
    kniha: { n: 'Lékárníkova kniha', d: 'Vytržené listy, otisk písma na dalším.' },
    lahev: { n: 'Lahev slivovice', d: 'Plachtička by za ni vraždila. Doslova.' },
    pirko: { n: 'Bílé pírko', d: 'Znak Řádu Bledého plamene. Nastrčené.' },
    mapa: { n: 'Mapa stok', d: 'Krysí čmáranice. Vede pod hrad.' },
    otrava: { n: 'Lahvička Černé rosy', d: 'Jed, který zabíjí krále.' },
    plast: { n: 'Plášť Řádu', d: 'Bílý plášť s plamenem. Převlek.' },
    zbroj: { n: 'Trpasličí kroužková košile', d: 'Brnění o bod lepší.' }
  };
  T.ITEMS = ITEMS;

  /* ---------- DOM ---------- */
  let root, cv, g, pcv, pg, capEl, chsEl, placeEl, hpEl, toastEl, logEl;
  function build() {
    root = h('div', { id: 't18' });
    const wrap = h('div', { class: 'wrap' });
    placeEl = h('span', { class: 'place' });
    const sndBtn = h('button', { class: 'tb', 'aria-pressed': 'true', onclick: e => { SND.on = !SND.on; e.target.setAttribute('aria-pressed', SND.on); e.target.textContent = SND.on ? 'Zvuk' : 'Ticho'; if (!SND.on) SND.stopAll(); else SND.mood(curMood); } }, 'Zvuk');
    const readBtn = h('button', { class: 'tb', 'aria-pressed': String(TTS.on), onclick: e => { TTS.on = !TTS.on; e.target.setAttribute('aria-pressed', TTS.on); try { localStorage.setItem('t18_tts', TTS.on ? '1' : '0'); } catch (x) {} if (!TTS.on) TTS.stop(); else TTS.say(curSpeech); } }, 'Předčítat');
    wrap.append(h('div', { class: 'top' },
      h('h1', null, 'KORUNA ', h('b', null, 'Z POPELA')), placeEl,
      h('button', { class: 'tb', onclick: () => sheetModal() }, 'Postava'),
      h('button', { class: 'tb', onclick: () => journalModal() }, 'Deník'),
      h('button', { class: 'tb', onclick: () => partyModal() }, 'Družina'),
      h('button', { class: 'tb', onclick: () => saveModal() }, 'Uložit / Načíst'),
      sndBtn, readBtn));
    cv = h('canvas', { width: W, height: H, 'aria-label': 'Obraz scény' }); g = cv.getContext('2d');
    hpEl = h('div', { class: 'hp' }); toastEl = h('div', { class: 'toasts', 'aria-live': 'polite' });
    wrap.append(h('div', { class: 'stage' }, cv, h('div', { class: 'hud' }, hpEl), toastEl));
    pcv = h('canvas', { width: 240, height: 300 }); pg = pcv.getContext('2d');
    capEl = h('div', { class: 'cap', 'aria-live': 'polite' }); chsEl = h('div', { class: 'chs' });
    wrap.append(h('div', { class: 'dlg' }, h('div', { class: 'por' }, pcv), h('div', { class: 'box' }, capEl, chsEl)));
    root.append(wrap);
    document.body.append(root);
    cv.addEventListener('click', onCanvasClick);
    document.addEventListener('keydown', onKey);
  }
  function onKey(e) {
    if (!root || root.querySelector('.modal') || e.target.tagName === 'INPUT') return;
    const bs = [...chsEl.querySelectorAll('button.ch:not([disabled])')];
    if ((e.key === ' ' || e.key === 'Enter') && bs.length && bs[0].classList.contains('next')) { e.preventDefault(); bs[0].click(); return; }
    const n = parseInt(e.key, 10); if (n >= 1 && n <= bs.length) { e.preventDefault(); bs[n - 1].click(); }
  }
  let toastQ = 0;
  function toast(txt, cls) { if (!toastEl) return; const el = h('div', { class: 'toast ' + (cls || '') }, txt); toastEl.append(el); toastQ++; setTimeout(() => { el.remove(); toastQ--; }, 3800); while (toastEl.children.length > 5) toastEl.firstChild.remove(); }
  function hud() { if (!G) return; const m = hpMax(); hpEl.innerHTML = `${esc(G.name)} · ŽIVOTY <i>${G.hp}</i>/${m} · ÚR ${G.lvl} · ${G.gold} ZL`; }

  /* ---------- sound: synth pads + the family's recordings ---------- */
  const SND = { on: true, ac: null, nodes: [], cur: null, buf: {} };
  // Browsers (and Electron) keep audio muted until the first click or key press.
  // Then start the sound that was meant to play but stayed silent.
  const unlockAudio = () => {
    if (!SND.ac || SND.ac.state !== 'running') {
      const want = SND.cur; SND.cur = null; const ac = SND.ctx();
      if (ac && SND.on && want) ac.resume().then(() => SND.mood(want)).catch(() => {});
    }
    if (SND.ac && SND.ac.state === 'running') { removeEventListener('pointerdown', unlockAudio, true); removeEventListener('keydown', unlockAudio, true); }
  };
  addEventListener('pointerdown', unlockAudio, true); addEventListener('keydown', unlockAudio, true);
  SND.ctx = function () { if (!SND.ac) { try { SND.ac = new (window.AudioContext || window.webkitAudioContext)(); SND.master = SND.ac.createGain(); SND.master.gain.value = .5; SND.master.connect(SND.ac.destination); } catch (e) { return null; } } if (SND.ac.state === 'suspended') SND.ac.resume(); return SND.ac; };
  SND.noise = function () { const ac = SND.ac, b = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d0 = b.getChannelData(0); for (let i = 0; i < d0.length; i++) d0[i] = Math.random() * 2 - 1; return b; };
  SND.stopAll = function () { SND.nodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) {} }); SND.nodes = []; SND.cur = null; };
  SND.mood = function (m) {
    if (!SND.on || m === SND.cur) return; const ac = SND.ctx(); if (!ac) return; SND.stopAll(); SND.cur = m;
    const out = ac.createGain(); out.gain.value = 0; out.connect(SND.master); out.gain.linearRampToValueAtTime(1, ac.currentTime + 2); SND.nodes.push(out);
    const add = n => { SND.nodes.push(n); return n; };
    const rainy = /rain|storm/.test(m), fire = /fire/.test(m);
    if (rainy || fire || /wind/.test(m)) { const s = add(ac.createBufferSource()); s.buffer = SND.noise(); s.loop = true; const f = ac.createBiquadFilter(); f.type = rainy ? 'highpass' : 'bandpass'; f.frequency.value = rainy ? 1800 : fire ? 600 : 300; f.Q.value = .6; const gn = ac.createGain(); gn.gain.value = rainy ? .16 : fire ? .1 : .12; s.connect(f); f.connect(gn); gn.connect(out); s.start(); }
    // a low drone that sets the mood: minor and slow, darker when tense
    const base = /fight/.test(m) ? 55 : /tense|dark/.test(m) ? 49 : /sad/.test(m) ? 58.27 : /warm/.test(m) ? 65.41 : 55;
    const ints = /warm/.test(m) ? [1, 1.5, 2.52] : [1, 1.498, 2.378];
    ints.forEach((k, i) => { const o = add(ac.createOscillator()); o.type = i ? 'triangle' : 'sawtooth'; o.frequency.value = base * k; o.detune.value = (i - 1) * 6; const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = /fight/.test(m) ? 700 : 380; const gn = ac.createGain(); gn.gain.value = i ? .035 : .05; const lfo = add(ac.createOscillator()); lfo.frequency.value = .07 + i * .03; const lg = ac.createGain(); lg.gain.value = .02; lfo.connect(lg); lg.connect(gn.gain); lfo.start(); o.connect(f); f.connect(gn); gn.connect(out); o.start(); });
    if (/fight/.test(m)) { const o = add(ac.createOscillator()); o.type = 'square'; o.frequency.value = 2.2; const gn = ac.createGain(); gn.gain.value = 0; const k = ac.createOscillator(); k.type = 'sine'; k.frequency.value = 55; const kg = ac.createGain(); kg.gain.value = 0; k.connect(kg); kg.connect(out); add(k); k.start(); const lfo = ac.createGain(); lfo.gain.value = .12; o.connect(lfo); lfo.connect(kg.gain); o.start(); }
  };
  function sfx(name) {
    if (!SND.on) return; const ac = SND.ctx(); if (!ac) return; const t0 = ac.currentTime;
    const REC = ['rev', 'kych', 'husa', 'vitr', 'sova', 'kun', 'krava', 'prase', 'slepice', 'koza', 'osel', 'zaba', 'houser'];
    if (REC.includes(name)) { const play = b => { const s = ac.createBufferSource(); s.buffer = b; const gn = ac.createGain(); gn.gain.value = .9; s.connect(gn); gn.connect(SND.master); s.start(); }; if (SND.buf[name]) return play(SND.buf[name]); fetch(`zvuky/${name}.mp3`).then(r => r.arrayBuffer()).then(a => ac.decodeAudioData(a, b => { SND.buf[name] = b; play(b); })).catch(() => {}); return; }
    const env = (gn, a, dcy, peak) => { gn.gain.setValueAtTime(0, t0); gn.gain.linearRampToValueAtTime(peak, t0 + a); gn.gain.exponentialRampToValueAtTime(.001, t0 + a + dcy); };
    if (name === 'hit' || name === 'clang') { const s = ac.createBufferSource(); s.buffer = SND.noise(); const f = ac.createBiquadFilter(); f.type = name === 'clang' ? 'bandpass' : 'lowpass'; f.frequency.value = name === 'clang' ? 2400 : 900; const gn = ac.createGain(); env(gn, .005, .25, .6); s.connect(f); f.connect(gn); gn.connect(SND.master); s.start(t0); s.stop(t0 + .4); if (name === 'clang') { const o = ac.createOscillator(); o.frequency.value = 1250; const g2 = ac.createGain(); env(g2, .002, .5, .15); o.connect(g2); g2.connect(SND.master); o.start(t0); o.stop(t0 + .6); } }
    if (name === 'dice') { for (let i = 0; i < 6; i++) { const o = ac.createOscillator(); o.type = 'square'; o.frequency.value = 900 + Math.random() * 900; const gn = ac.createGain(); const tt = t0 + i * .07 + Math.random() * .03; gn.gain.setValueAtTime(0, tt); gn.gain.linearRampToValueAtTime(.08, tt + .003); gn.gain.exponentialRampToValueAtTime(.001, tt + .05); o.connect(gn); gn.connect(SND.master); o.start(tt); o.stop(tt + .06); } }
    if (name === 'ok' || name === 'fail' || name === 'love') { const notes = name === 'ok' ? [392, 523.25, 659.25] : name === 'love' ? [523.25, 659.25, 783.99] : [311.13, 233.08]; notes.forEach((f, i) => { const o = ac.createOscillator(); o.type = 'triangle'; o.frequency.value = f; const gn = ac.createGain(); const tt = t0 + i * .12; gn.gain.setValueAtTime(0, tt); gn.gain.linearRampToValueAtTime(.18, tt + .02); gn.gain.exponentialRampToValueAtTime(.001, tt + .7); o.connect(gn); gn.connect(SND.master); o.start(tt); o.stop(tt + .8); }); }
    if (name === 'thunder' || name === 'boom') { const s = ac.createBufferSource(); s.buffer = SND.noise(); const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 220; const gn = ac.createGain(); env(gn, .05, 2.2, .9); s.connect(f); f.connect(gn); gn.connect(SND.master); s.start(t0); s.stop(t0 + 2.5); }
    if (name === 'fire') { const s = ac.createBufferSource(); s.buffer = SND.noise(); const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(300, t0); f.frequency.linearRampToValueAtTime(1500, t0 + .5); const gn = ac.createGain(); env(gn, .05, .9, .7); s.connect(f); f.connect(gn); gn.connect(SND.master); s.start(t0); s.stop(t0 + 1.1); }
    if (name === 'coin') { [1568, 2093].forEach((fq, i) => { const o = ac.createOscillator(); o.frequency.value = fq; const gn = ac.createGain(); const tt = t0 + i * .07; gn.gain.setValueAtTime(0, tt); gn.gain.linearRampToValueAtTime(.12, tt + .005); gn.gain.exponentialRampToValueAtTime(.001, tt + .3); o.connect(gn); gn.connect(SND.master); o.start(tt); o.stop(tt + .35); }); }
    if (name === 'heart') { [0, .28].forEach(dl => { const o = ac.createOscillator(); o.frequency.value = 50; const gn = ac.createGain(); const tt = t0 + dl; gn.gain.setValueAtTime(0, tt); gn.gain.linearRampToValueAtTime(.5, tt + .02); gn.gain.exponentialRampToValueAtTime(.001, tt + .2); o.connect(gn); gn.connect(SND.master); o.start(tt); o.stop(tt + .25); }); }
  }
  T.sfx = sfx;

  /* ---------- reading aloud ---------- */
  const TTS = { on: false, voices: [] };
  // Reading aloud is remembered; in the phone app it starts switched on.
  try { const v = localStorage.getItem('t18_tts'); TTS.on = v == null ? !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) : v === '1'; } catch (e) {}
  TTS.load = () => { try { TTS.voices = speechSynthesis.getVoices().filter(v => /^cs/i.test(v.lang)); } catch (e) {} };
  try { speechSynthesis.onvoiceschanged = TTS.load; TTS.load(); } catch (e) {}
  TTS.stop = () => { try { speechSynthesis.cancel(); } catch (e) {} };
  TTS.say = function (sp) {
    if (!TTS.on || !sp || !sp.t) return; TTS.stop();
    try {
      const u = new SpeechSynthesisUtterance(sp.t.replace(/[*_]/g, '')); u.lang = 'cs-CZ';
      const fem = sp.w ? (sp.w === 'hrdina' ? G.sex === 'f' : !!(T.C[sp.w] && T.C[sp.w].P.fem)) : null;
      const vs = TTS.voices, fv = vs.filter(v => /vlasta|zuzana|female|žena|iveta/i.test(v.name)), mv = vs.filter(v => /antonín|antonin|jakub|male|muž/i.test(v.name) && !/female/i.test(v.name));
      u.voice = fem === true ? (fv[0] || vs[0]) : fem === false ? (mv[0] || vs[0]) : (mv[1] || fv[1] || mv[0] || vs[0]); if (!u.voice) delete u.voice;
      u.rate = sp.w ? 1 : .92; u.pitch = sp.w === 'vilem' ? .7 : sp.w === 'plachta' ? 1.4 : sp.w === 'kychal' ? .5 : 1;
      speechSynthesis.speak(u);
    } catch (e) {}
  };
  let curSpeech = null, curMood = 'calm';

  /* ---------- scene drawing ---------- */
  const SC = { place: 'vez', npc: [], party: true, speaker: null, t0: performance.now(), shake: 0, flash: 0, roll: null, fight: null, float: [] };
  function partyIds() { return ['hrdina'].concat(G.party.filter(c => c !== 'plachta')); }
  function drawScene() {
    const t = (performance.now() - SC.t0) / 1000;
    g.save(); if (SC.shake > 0) { g.translate((Math.random() - .5) * SC.shake, (Math.random() - .5) * SC.shake); SC.shake *= .9; if (SC.shake < .5) SC.shake = 0; }
    const pl = T.paintPlace(g, SC.place, t); T.placeAnim(g, SC.place, t);
    const fy = pl.fy, light = pl.light;
    if (SC.fight) drawFight(t, fy, light);
    else {
      // party on the left, others on the right
      if (SC.party) { const ids = partyIds(); ids.forEach((id, i) => { const sp = T.who(id, G); const x = 150 + i * 120 + (i ? 30 : 0); T.figure(g, sp.F, x, fy, 350 * (sp.F.h || 1), { t, face: 1, light, step: 0 }); }); if (G.party.includes('plachta')) { const sp = T.C.plachta; T.figure(g, sp.F, 120 + ids.length * 120, fy, 70, { t, face: 1, light }); } }
      SC.npc.forEach((n, i) => { const sp = T.C[n.id]; if (!sp) return; const big = sp.F.kind === 'dragon'; const x = n.x != null ? n.x * W : (W - 170 - i * 150); const hh = big ? 260 : (sp.F.kind === 'squirrel' ? 70 : sp.F.kind === 'goose' ? 110 : 350 * (sp.F.h || 1)); const dead = n.pose === 'dead'; T.figure(g, sp.F, x, fy - (dead ? 18 : 0), hh, { t, face: n.face || -1, light, pose: n.pose, rot: dead ? (n.face || -1) * -PI / 2 : 0, arms: n.arms }); if (dead && n.blood !== false) { g.fillStyle = T.pal.spot; g.beginPath(); g.ellipse(x, fy + 4, 120, 14, 0, 0, PI * 2); g.fill(); } });
    }
    // a Sin City frame: grain and hard vignette
    T.grain(g, W, H, .08);
    const vg = g.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * .95); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    if (SC.flash > 0) { g.fillStyle = `rgba(195,18,28,${SC.flash * .5})`; g.fillRect(0, 0, W, H); SC.flash *= .88; if (SC.flash < .02) SC.flash = 0; }
    if (SC.roll) drawRoll(t);
    g.restore();
    // the speaking portrait
    if (SC.speaker) { T.setPal(T.PL[SC.place] ? T.PL[SC.place].pal : 'noir'); const pal = SC.speaker === 'sarra' ? 'fire' : null; if (pal) T.setPal(pal); const sp = T.who(SC.speaker, G); T.portrait(pg, Object.assign({}, sp.P, SC.mood ? { mood: SC.mood } : {}), { t, talk: (performance.now() - SC.talkT) < SC.talkLen }); }
    requestAnimationFrame(drawScene);
  }

  /* ---------- d20 overlay ---------- */
  function drawRoll(t) {
    const R = SC.roll, k = (performance.now() - R.t0) / 1000; const pal = T.pal;
    g.fillStyle = 'rgba(5,5,5,.78)'; g.fillRect(0, 0, W, H);
    const spinning = k < 1.3; const n = spinning ? 1 + Math.floor(Math.random() * 20) : R.n;
    const col = spinning ? pal.paper : (R.ok ? '#ece6d6' : pal.spot);
    T.d20(g, W / 2, H / 2 - 30, 120 + (spinning ? Math.sin(k * 30) * 6 : 0), n, col, spinning ? k : 0);
    g.textAlign = 'center'; g.fillStyle = '#ece6d6'; g.font = '40px "Bebas Neue", Impact, sans-serif';
    g.fillText(`${R.label}  ·  ${R.dcLabel}`, W / 2, 100);
    if (!spinning) { g.font = '30px "Bebas Neue", Impact, sans-serif'; g.fillText(`${R.n} ${sgn(R.bonus)} = ${R.n + R.bonus}`, W / 2, H / 2 + 150); g.font = '84px "Bebas Neue", Impact, sans-serif'; g.fillStyle = R.ok ? '#ece6d6' : pal.spot; g.fillText(R.n === 20 ? 'KRITICKÝ ÚSPĚCH' : R.n === 1 ? 'KRITICKÉ SELHÁNÍ' : R.ok ? 'ÚSPĚCH' : 'NEÚSPĚCH', W / 2, H / 2 + 240); }
  }
  function check(s, dc, label) {
    const n = d(20), bonus = mod(G.st[s]) + (CLASSES[G.cls].prof.includes(s) ? prof() : 0) + (G.f['buff_' + s] || 0);
    const ok = n === 20 || (n !== 1 && n + bonus >= dc);
    return new Promise(res => {
      SC.roll = { n, bonus, ok, t0: performance.now(), label: label || STATS.find(x => x[0] === s)[1].toUpperCase(), dcLabel: 'OBTÍŽNOST ' + dc };
      sfx('dice'); chsEl.innerHTML = ''; if (T.fast) { SC.roll = null; return res(ok); } setTimeout(() => sfx(ok ? 'ok' : 'fail'), 1350);
      setTimeout(() => { SC.roll = null; res(ok); }, 2700);
    });
  }
  T.check = check;

  /* ---------- nodes ---------- */
  const N = T.N = T.N || {};
  let pages = [], pi = 0, node = null, nodeId = null;
  function normPages(t) { t = typeof t === 'function' ? t(G, API) : t; if (t == null) return []; if (!Array.isArray(t)) t = [t]; const out = [];
    t.filter(p => p != null && p !== '').forEach(p => {
      const prev = out[out.length - 1];
      // a footnote (†) joins the narration page before it
      if (typeof p === 'string' && /^†/.test(p) && prev && !prev.w) prev.t += '\n\n' + p;
      else out.push(typeof p === 'string' ? { t: p } : Object.assign({}, p));
    });
    return out; }
  function go(id, opt) {
    opt = opt || {};
    const n = N[id]; if (!n) { console.error('Missing node', id); toast('Chybí scéna: ' + id, 'bad'); return; }
    node = n; nodeId = id; G.node = id;
    if (n.act) G.act = n.act;
    if (!opt.load) { G.seen[id] = (G.seen[id] || 0) + 1; if (n.lore) [].concat(n.lore).forEach(l => API.lore(l)); if (n.enter) n.enter(G, API); }
    // the node may redirect after its side effects
    if (!opt.load && n.redirect) { const r = n.redirect(G, API); if (r) return go(r); }
    SC.place = (typeof n.bg === 'function' ? n.bg(G, API) : n.bg) || SC.place;
    const npc = typeof n.npc === 'function' ? n.npc(G, API) : n.npc;
    if (npc) SC.npc = npc.map(x => typeof x === 'string' ? { id: x } : x); else if (!n.keepNpc) SC.npc = [];
    SC.party = n.party !== false;
    placeEl.textContent = `${G.act} · ${(T.PL[SC.place] || {}).name || ''}`;
    curMood = n.mood || (T.PL[SC.place] && /rain|ulice|vez|hradby/.test(SC.place) ? 'rain' : 'dark');
    SND.mood(curMood);
    if (n.snd && !opt.load) setTimeout(() => sfx(n.snd), 400);
    hud(); autosave();
    if (n.end) return ending(n.end);
    if (n.fight) { pages = normPages(n.t); pi = 0; if (pages.length) return showPage(); return startFight(n.fight); }
    pages = normPages(n.t); pi = 0; showPage();
  }
  T.go = go;
  function speakerName(w) { if (w === 'hrdina') return G.name; return T.C[w] ? T.C[w].name : w; }
  function showPage() {
    const p = pages[pi];
    capEl.innerHTML = ''; chsEl.innerHTML = '';
    if (p) {
      const txt = fmt(p.t);
      if (p.w) { SC.speaker = p.w; SC.mood = p.m || null; capEl.className = 'cap speech'; capEl.append(h('span', { class: 'nm' }, speakerName(p.w))); }
      else { capEl.className = 'cap'; SC.speaker = null; }
      txt.split(/\n\n/).forEach(par => capEl.append(h('p', { class: /^†/.test(par) ? 'fn' : '', html: esc(par).replace(/\*(.+?)\*/g, '<em>$1</em>') })));
      SC.talkT = performance.now(); SC.talkLen = p.w ? Math.min(6000, txt.length * 45) : 0;
      if (p.snd) sfx(p.snd); if (p.shake) SC.shake = p.shake; if (p.flash) SC.flash = 1;
      curSpeech = { w: p.w, t: txt.replace(/†/g, '') }; TTS.say(curSpeech);
      $('.por', root).style.visibility = p.w ? 'visible' : 'hidden'; root.classList.toggle('nopor', !p.w);
    }
    if (pi < pages.length - 1) { chsEl.append(h('button', { class: 'ch next', onclick: () => { pi++; showPage(); } }, 'Dál ▸')); return; }
    if (node.fight) { chsEl.append(h('button', { class: 'ch next fight', onclick: () => startFight(node.fight) }, 'Do boje ▸')); return; }
    showChoices();
  }
  function choiceList() { let ch = typeof node.ch === 'function' ? node.ch(G, API) : node.ch; return (ch || []).filter(Boolean); }
  function showChoices() {
    const list = choiceList(); let i = 0;
    list.forEach((c, idx) => {
      if (c.if && !c.if(G, API)) return;
      const key = nodeId + ':' + (c.k || idx);
      if (c.once && G.chosen[key]) return;
      let dis = false, why = '';
      // A check can be tried only once: no re-rolling the same dice by walking out and back in.
      const tk = c.chk ? nodeId + ':' + (c.k || c.t) : null;
      if (tk && G.f.tried && G.f.tried[tk]) { dis = true; why = G.f.tried[tk] === 'ok' ? 'už se povedlo' : 'nevyšlo, podruhé to nezkusíš'; }
      if (c.need) { const r = typeof c.need === 'function' ? c.need(G, API) : (G.st[c.need.s] >= c.need.v ? true : `${SN[c.need.s]} ${c.need.v}`); if (r !== true) { dis = true; why = typeof r === 'string' ? r : 'nelze'; } }
      if (c.cost && G.gold < c.cost) { dis = true; why = `${c.cost} zl`; }
      i++;
      const b = h('button', { class: 'ch' + (c.fight ? ' fight' : ''), disabled: dis ? '' : null });
      b.append(h('span', { class: 'n' }, i + '.'));
      if (c.chk) b.append(h('span', { class: 'tag' }, `[${SN[c.chk.s]} ${c.chk.dc}]`));
      if (c.tag) b.append(h('span', { class: 'tag' + (/♥/.test(c.tag) ? ' l' : /Útok|Zabít|Boj/.test(c.tag) ? ' r' : '') }, `[${c.tag}]`));
      if (c.cost) b.append(h('span', { class: 'tag' }, `[${c.cost} zl]`));
      b.append(fmt(c.t));
      if (dis) b.append(h('span', { class: 'tag r' }, ` (${why})`));
      b.addEventListener('click', () => pick(c, key));
      chsEl.append(b);
    });
    if (!i) chsEl.append(h('button', { class: 'ch', onclick: () => go('konec_slepa') }, 'Konec cesty'));
  }
  async function pick(c, key) {
    G.chosen[key] = 1; TTS.stop();
    if (c.cost) API.gold(-c.cost);
    if (c.ap) Object.entries(c.ap).forEach(([k, v]) => { if (G.party.includes(k) || c.apAll) API.ap(k, v); });
    if (c.fx) c.fx(G, API);
    if (c.chk) {
      const ok = await check(c.chk.s, c.chk.dc, c.chk.label);
      G.f.tried = G.f.tried || {}; G.f.tried[nodeId + ':' + (c.k || c.t)] = ok ? 'ok' : 'no';
      if (ok && c.chk.okFx) c.chk.okFx(G, API); if (!ok && c.chk.noFx) c.chk.noFx(G, API);
      return go(ok ? c.chk.ok : c.chk.no);
    }
    if (c.fight) return startFightNode(c.fight);
    const to = typeof c.go === 'function' ? c.go(G, API) : c.go;
    if (to) go(to); else showChoices();
  }
  function startFightNode(f) { startFight(f); }

  /* ---------- combat ---------- */
  let F = null;
  function mkFoe(spec, i) {
    const s = typeof spec === 'string' ? { id: spec } : spec; const base = FOES[s.id] || FOES.straz; const c = T.C[s.id] || {};
    const sc = 1 + (G.lvl - 1) * .25;
    return { side: 'e', id: s.id, name: s.name || c.name || s.id, hp: Math.round((s.hp || base.hp) * (s.hp ? 1 : sc)), max: Math.round((s.hp || base.hp) * (s.hp ? 1 : sc)), ac: base.ac, hit: base.hit + Math.floor((G.lvl - 1) / 2), dmg: base.dmg, burn: base.burn, stun: base.stun, aoe: base.aoe, call: base.call, boss: s.boss, F: c.F, alive: true, st: {}, x: 0, anim: 0 };
  }
  function mkHero() { const c = CLASSES[G.cls]; return { side: 'p', id: 'hrdina', name: G.name, hp: G.hp, max: hpMax(), ac: ac(), alive: true, st: {}, cd: 0, breath: G.race === 'drak' ? 1 : 0, hero: true, anim: 0 }; }
  function mkComp(id) { const b = COMP[id]; const lv = G.lvl - 1; return { side: 'p', id, name: T.C[id].name.split(' ')[0], hp: b.hp + lv * 6, max: b.hp + lv * 6, ac: b.ac, hit: b.hit + Math.floor(lv / 2), dmg: [b.dmg[0], b.dmg[1], b.dmg[2] + Math.floor(lv / 2)], atk: b.atk, breath: b.breath, distract: b.distract, alive: true, st: {}, anim: 0 }; }
  function startFight(f) {
    const foes = (typeof f.foes === 'function' ? f.foes(G, API) : f.foes).map(mkFoe);
    // name duplicates 1, 2, 3
    const cnt = {}; foes.forEach(e => { cnt[e.name] = (cnt[e.name] || 0) + 1; }); const seen = {}; foes.forEach(e => { if (cnt[e.name] > 1) { seen[e.name] = (seen[e.name] || 0) + 1; e.name += ' ' + seen[e.name]; } });
    const allies = [mkHero()].concat(G.party.filter(c => COMP[c] && !(f.noAllies || []).includes(c)).map(mkComp));
    F = { def: f, foes, allies, round: 1, target: 0, log: [], busy: false, items: 0 };
    SC.fight = F; curMood = 'fight'; SND.mood('fight'); SC.speaker = null; $('.por', root).style.visibility = 'hidden'; root.classList.add('nopor');
    capEl.className = 'cap'; capEl.innerHTML = '';
    if (f.intro) say(fmt(f.intro));
    renderFight();
  }
  function say(s) { F.log.push(s); if (F.log.length > 4) F.log.shift(); }
  function liveFoes() { return F.foes.filter(e => e.alive); }
  function heroC() { return F.allies[0]; }
  function renderFight() {
    if (!F) return;
    capEl.className = 'cap'; capEl.innerHTML = '';
    capEl.append(h('span', { class: 'nm' }, `Souboj · kolo ${F.round}`));
    const lg = h('div', { class: 'log' }); F.log.forEach(l => lg.append(h('div', { html: l }))); capEl.append(lg);
    chsEl.innerHTML = '';
    const lf = liveFoes(); if (!lf.includes(F.foes[F.target])) F.target = F.foes.indexOf(lf[0]);
    const tg = h('div', { class: 'targets' }); tg.append(h('span', { class: 'n', style: 'font-family:var(--title);letter-spacing:.06em;color:var(--muted);align-self:center' }, 'CÍL:'));
    F.foes.forEach((e, i) => tg.append(h('button', { class: 'tgt', 'aria-pressed': String(i === F.target), disabled: e.alive ? null : '', onclick: () => { F.target = i; renderFight(); } }, `${e.name} ${e.alive ? e.hp + '/' + e.max : '✝'}`)));
    chsEl.append(tg);
    if (F.busy) return;
    const c = CLASSES[G.cls], hc = heroC();
    const act = (label, tag, fn, dis) => { const b = h('button', { class: 'ch fight', disabled: dis ? '' : null, onclick: () => { if (!F.busy) fn(); } }); if (tag) b.append(h('span', { class: 'tag' }, `[${tag}]`)); b.append(label); chsEl.append(b); };
    const tgt = F.foes[F.target];
    act(`${c.atk} → ${tgt.name}`, `${sgn(atkBonus())} vs ÚČ ${tgt.ac}`, () => heroAct('atk'));
    act(`${c.spec}${hc.cd ? ` (za ${hc.cd} ${hc.cd === 1 ? 'kolo' : 'kola'})` : ''}`, 'Speciál', () => heroAct('spec'), hc.cd > 0);
    if (hc.breath) act('Dračí dech – oheň na všechny', 'Rasa', () => heroAct('breath'));
    act(`Léčivý lektvar (${G.items.lektvar || 0})`, '2k4+4', () => heroAct('pot'), !(G.items.lektvar > 0));
    act('Kryt (+4 k obraně do příštího tahu)', null, () => heroAct('guard'));
    if (F.def.flee) act('Útěk', 'OBR 12', () => heroAct('flee'));
  }
  const atkBonus = () => { const c = CLASSES[G.cls]; return mod(G.st[c.main]) + prof(); };
  function dmgFloat(who, txt, col) { SC.float.push({ who, txt, col, t0: performance.now() }); }
  function hitRoll(bonus, acv) { const n = d(20); return { n, crit: n >= (G.cls === 'zlodej' ? 19 : 20), hit: n !== 1 && (n === 20 || n + bonus >= acv) }; }
  function strike(att, def, dmg, label) {
    def.hp -= dmg; def.anim = 1; sfx(dmg > 10 ? 'clang' : 'hit'); dmgFloat(def, '−' + dmg, '#c3121c');
    if (def.hp <= 0) { def.hp = 0; def.alive = false; if (def.side === 'e') { G.kills++; say(`<b>${esc(def.name)}</b> padá.`); } else say(`<span class="hurt"><b>${esc(def.name)}</b> padá k zemi!</span>`); }
  }
  async function heroAct(kind) {
    F.busy = true; const hc = heroC(), c = CLASSES[G.cls], tgt = F.foes[F.target]; F.log = [];
    const mainMod = mod(G.st[c.main]);
    hc.st.guard = 0;
    if (kind === 'atk') {
      const r = hitRoll(atkBonus(), tgt.ac);
      if (r.hit) { let dm = roll(c.dmg[0] * (r.crit ? 2 : 1), c.dmg[1], mainMod); strike(hc, tgt, dm); say(`${r.crit ? '<b>Kritický zásah!</b> ' : ''}${esc(c.atk)} zasahuje ${esc(tgt.name)} za <b>${dm}</b>.`); if (r.crit) SC.shake = 12; }
      else { say(`Hod ${r.n}${sgn(atkBonus())} – ${esc(tgt.name)} uhýbá.`); dmgFloat(tgt, 'vedle', '#ece6d6'); }
    } else if (kind === 'spec') {
      hc.cd = c.cd + 1;
      if (G.cls === 'bojovnik') { const r = hitRoll(atkBonus() + 1, tgt.ac); if (r.hit) { const dm = roll(2 * (r.crit ? 2 : 1), 10, mainMod + 2); strike(hc, tgt, dm); SC.shake = 16; say(`Drtivý úder! ${esc(tgt.name)} dostává <b>${dm}</b>.`); } else say('Drtivý úder jde do prázdna.'); }
      if (G.cls === 'zlodej') { const r = hitRoll(atkBonus() + 2, tgt.ac); if (r.hit) { const dm = roll(1 + 3 * (r.crit ? 2 : 1), 6, mainMod); strike(hc, tgt, dm); say(`Zákeřná rána mezi žebra: <b>${dm}</b>.`); } else say('Zákeřná rána sklouzne po zbroji.'); }
      if (G.cls === 'mag') { sfx('fire'); SC.flash = 1; liveFoes().forEach(e => { const dm = roll(3 + Math.floor(G.lvl / 2), 6, 0); strike(hc, e, dm); }); say(`Ohnivá koule! Plameny olizují všechny nepřátele.`); }
      if (G.cls === 'bard') { const r = hitRoll(atkBonus(), tgt.ac - 2); if (r.hit) { const dm = roll(2, 6, mod(G.st.cha)); strike(hc, tgt, dm); tgt.st.stun = 1; say(`Zlomyslná píseň: ${esc(tgt.name)} se zapotácí (<b>${dm}</b>) a příští kolo nezaútočí.`); } else say('Píseň zazní, ale nepřítel ji přeřve.'); }
    } else if (kind === 'breath') { hc.breath = 0; sfx('fire'); SC.flash = 1; liveFoes().forEach(e => { const dm = roll(2 + Math.floor(G.lvl / 2), 6, 0); strike(hc, e, dm); }); say('Nadechneš se a z hrdla ti vyšlehne oheň!'); }
    else if (kind === 'pot') { G.items.lektvar--; const hv = roll(2, 4, 4); hc.hp = Math.min(hc.max, hc.hp + hv); dmgFloat(hc, '+' + hv, '#ece6d6'); say(`Lektvar hořce pálí v krku. +<b>${hv}</b> životů.`); }
    else if (kind === 'guard') { hc.st.guard = 4; say('Kryješ se a čekáš na jejich chybu.'); }
    else if (kind === 'flee') { const ok = await check('obr', 12, 'ÚTĚK'); if (ok) { G.hp = Math.max(1, hc.hp); return endFight('flee'); } say('Útěk se nepovedl!'); }
    renderFight(); await wait(650);
    if (!liveFoes().length) return endFight('win');
    // companions
    for (const a of F.allies.slice(1)) {
      if (!a.alive || !liveFoes().length) continue;
      const lf = liveFoes(), e = lf.reduce((m, x) => x.hp < m.hp ? x : m, lf[0]);
      if (a.breath && F.round === 2) { a.breath = 0; sfx('fire'); lf.forEach(x => strike(a, x, roll(2, 6, 0))); say(`<b>${esc(a.name)}</b> chrlí oheň na celou řadu!`); }
      else if (a.distract && Math.random() < .5) { e.st.stun = 1; say(`<b>Plachtička</b> skočí ${esc(e.name)} do obličeje a kouše. Ten příští kolo nezaútočí.`); }
      else { const r = hitRoll(a.hit, e.ac); if (r.hit) { const dm = roll(a.dmg[0] * (r.crit ? 2 : 1), a.dmg[1], a.dmg[2]); strike(a, e, dm); say(`<b>${esc(a.name)}</b> (${a.atk}) zasahuje ${esc(e.name)} za ${dm}.`); } else say(`<b>${esc(a.name)}</b> mine.`); }
      renderFight(); await wait(450);
    }
    if (!liveFoes().length) return endFight('win');
    // foes
    for (const e of liveFoes()) {
      if (e.st.stun) { e.st.stun = 0; say(`${esc(e.name)} se vzpamatovává.`); continue; }
      const al = F.allies.filter(a => a.alive); if (!al.length) break;
      if (e.call && F.round % 3 === 2 && F.foes.length < 6) { const n = mkFoe(e.call); n.name = 'Krysák ' + (F.foes.length + 1); F.foes.push(n); say(`${esc(e.name)} hvízdne a ze tmy vyleze další krysák!`); continue; }
      if (e.aoe && F.round % 3 === 0) { sfx('fire'); SC.flash = 1; al.forEach(a => strike(e, a, roll(e.aoe[0], e.aoe[1], 0))); say(`<span class="hurt"><b>${esc(e.name)}</b> zasáhne celou družinu!</span>`); renderFight(); await wait(500); continue; }
      const tg = Math.random() < .5 ? al[0] : al[Math.floor(Math.random() * al.length)];
      const r = { n: d(20) }; const hit = r.n !== 1 && (r.n === 20 || r.n + e.hit >= tg.ac + (tg.st.guard || 0));
      if (hit) { const dm = roll(e.dmg[0] * (r.n === 20 ? 2 : 1), e.dmg[1], e.dmg[2]); strike(e, tg, dm); SC.shake = tg.hero ? 10 : 4; if (tg.hero) SC.flash = .7; say(`<span class="hurt">${esc(e.name)} zasahuje ${tg.hero ? 'tebe' : esc(tg.name)} za <b>${dm}</b>.</span>`); if (e.stun && tg.hero && Math.random() < .25) { tg.st.stunned = 1; say('<span class="hurt">Ochromující dotek! Ztrácíš příští tah.</span>'); } }
      else say(`${esc(e.name)} útočí na ${tg.hero ? 'tebe' : esc(tg.name)} – vedle.`);
      renderFight(); await wait(450);
      if (!heroC().alive) break;
    }
    G.hp = heroC().hp;
    if (!heroC().alive) return endFight('lose');
    if (heroC().hp < heroC().max * .3) sfx('heart');
    F.round++; if (hc.cd > 0) hc.cd--;
    if (hc.st.stunned) { hc.st.stunned = 0; say('Jsi omráčen{a} a kolo ti uteče.'.replace('{a}', G.sex === 'f' ? 'a' : '')); F.busy = false; return heroAct('guard'); }
    F.busy = false; renderFight();
  }
  const wait = ms => new Promise(r => setTimeout(r, T.fast ? 0 : ms));
  function endFight(res) {
    const f = F.def; G.hp = Math.max(res === 'lose' ? 1 : 1, heroC().hp); SC.fight = null; F = null; SC.float = [];
    if (res === 'win') { toast('Vítězství'); sfx('ok'); if (f.gold) API.gold(f.gold); if (f.winFx) f.winFx(G, API); return go(f.win); }
    if (res === 'flee') { toast('Unikl{a} jsi'.replace('{a}', G.sex === 'f' ? 'a' : '')); return go(f.flee === true ? f.lose : f.flee); }
    if (f.lose) { G.hp = Math.max(1, Math.floor(hpMax() / 3)); if (f.loseFx) f.loseFx(G, API); return go(f.lose); }
    gameOver();
  }
  function drawFight(t, fy, light) {
    const now = performance.now();
    const place = (arr, left) => arr.forEach((c, i) => {
      const sp = c.id === 'hrdina' ? T.heroSpec(G) : T.C[c.id] || T.C.straz; const Fs = sp.F;
      const big = Fs.kind === 'dragon'; const hh = big ? 230 : Fs.kind === 'squirrel' ? 64 : Fs.kind === 'wolf' ? 190 : 320 * (Fs.h || 1);
      const x = left ? 170 + i * 135 : W - 170 - i * 150 - (big ? 120 : 0);
      c.x = x; c.y = fy; c.hh = hh;
      const lunge = c.anim > 0 ? Math.sin(c.anim * PI) * 18 * (left ? -1 : 1) : 0; c.anim = Math.max(0, c.anim - .06);
      const dead = !c.alive;
      T.figure(g, Fs, x + lunge, fy - (dead ? 16 : 0), hh, { t, face: left ? 1 : -1, light, flash: c.anim > .7, rot: dead ? (left ? -PI / 2 : PI / 2) : 0, alpha: dead ? .7 : 1, pose: c.st.guard ? 'kneel' : null });
      if (!dead) { // health bar like a slash of ink
        const bw = 90, by = fy - hh - 36 - (big ? 60 : 0), bx = x - bw / 2;
        g.fillStyle = '#0a0909'; g.fillRect(bx - 3, by - 3, bw + 6, 16); g.fillStyle = '#3a3634'; g.fillRect(bx, by, bw, 10); g.fillStyle = c.side === 'e' ? T.pal.spot : '#ece6d6'; g.fillRect(bx, by, bw * c.hp / c.max, 10);
        g.font = '20px "Bebas Neue", Impact, sans-serif'; g.textAlign = 'center'; g.fillStyle = '#ece6d6'; g.strokeStyle = '#0a0909'; g.lineWidth = 4; g.strokeText(c.name.toUpperCase(), x, by - 8); g.fillText(c.name.toUpperCase(), x, by - 8);
        if (!left && F && F.foes[F.target] === c) { g.fillStyle = T.pal.spot; g.beginPath(); g.moveTo(x - 14, by - 40); g.lineTo(x + 14, by - 40); g.lineTo(x, by - 26); g.fill(); }
        if (c.st.stun) { g.fillStyle = '#e8c81a'; g.fillText('✶ ✶', x, by - 30); }
      } else if (c.side === 'e') { g.fillStyle = T.pal.spot; g.beginPath(); g.ellipse(x, fy + 4, 90, 10, 0, 0, PI * 2); g.fill(); }
    });
    if (!F) return;
    place(F.allies, true); place(F.foes, false);
    SC.float = SC.float.filter(f => now - f.t0 < 1100);
    SC.float.forEach(f => { const k = (now - f.t0) / 1100; g.globalAlpha = 1 - k; g.font = '54px "Bebas Neue", Impact, sans-serif'; g.textAlign = 'center'; g.fillStyle = f.col; g.strokeStyle = '#ece6d6'; g.lineWidth = 7; g.lineJoin = 'round'; const y = (f.who.y || 600) - (f.who.hh || 300) * .6 - k * 60; g.strokeText(f.txt, f.who.x || 640, y); g.fillText(f.txt, f.who.x || 640, y); g.globalAlpha = 1; });
  }
  function onCanvasClick(e) {
    if (!F) return; const r = cv.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * W;
    let best = -1, bd = 1e9; F.foes.forEach((f, i) => { if (!f.alive) return; const dd = Math.abs((f.x || 0) - x); if (dd < bd) { bd = dd; best = i; } });
    if (best >= 0 && bd < 120) { F.target = best; renderFight(); }
  }

  /* ---------- level up, endings, game over ---------- */
  function levelUp(cb) {
    G.lvl++; const old = G.hp;
    modal(m => {
      m.append(h('h2', null, 'Úroveň ', h('b', null, String(G.lvl))), h('p', { class: 'lead' }, 'Přežil{a} jsi. Co tě to naučilo? Vyber vlastnost, která vzroste o 1. Životy se doplní.'.replace('{a}', G.sex === 'f' ? 'a' : '')));
      const cards = h('div', { class: 'cards' });
      STATS.forEach(([k, n]) => cards.append(h('button', { class: 'card', onclick: () => { G.st[k]++; G.hp = hpMax(); close(); hud(); toast(`${n} ${G.st[k]}`); if (cb) cb(); } }, h('b', null, `${n} ${G.st[k]} → ${G.st[k] + 1}`), h('small', null, statHint(k)))));
      m.append(cards);
    }, false);
  }
  T.levelUp = levelUp;
  const statHint = k => ({ sil: 'Útok a zranění bojovníka. Páčit, zvedat, zastrašit silou.', obr: 'Útok zloděje, obrana, šplhání, plížení, útěk.', odl: 'Životy. Jed, mráz, alkohol.', duv: 'Útok mága. Stopy, šifry, zámky, vědění.', mou: 'Prohlédnout lež, vycítit nebezpečí, víra, zvířata.', cha: 'Útok barda. Přesvědčit, lhát, svádět, vést lidi.' }[k]);
  function ending(e) {
    SND.mood('sad'); TTS.stop();
    modal(m => {
      m.classList.add('end');
      m.append(h('h2', null, ...fmt(e.title).split('|').map((s, i) => i ? h('b', null, s) : s)));
      normPages(e.text).forEach(p => fmt(p.t).split(/\n\n/).forEach(par => m.append(h('p', { class: /^†/.test(par) ? 'lead fn' : 'lead' }, par))));
      const ep = typeof e.epi === 'function' ? e.epi(G, API) : (e.epi || []);
      if (ep.length) { m.append(h('h3', null, 'Co se stalo s ostatními')); ep.filter(Boolean).forEach(x => m.append(h('p', null, fmt(x)))); }
      m.append(h('h3', null, 'Tvoje cesta'), h('p', null, `${G.name}, ${RACES[G.race].name.toLowerCase()}, ${CLASSES[G.cls].name.toLowerCase()}, úroveň ${G.lvl}. Padlých nepřátel: ${G.kills}. Důkazů: ${G.clues.length}. ${G.f.rom ? 'Láska: ' + T.C[G.f.rom].name + '.' : 'Srdce: nikomu nepatřilo.'}`));
      m.append(h('p', null, h('em', null, `Konec ${e.n || ''} z 9. Zkus jiné volby – příběh se větví.`)));
      m.append(h('div', { class: 'row' }, h('button', { class: 'big', onclick: () => { close(); newGame(); } }, 'Nová hra'), h('button', { class: 'big alt', onclick: () => { close(); saveModal(); } }, 'Načíst uloženou')));
    }, false);
    try { const seen = JSON.parse(localStorage.getItem('t18_konce') || '[]'); if (!seen.includes(e.n)) seen.push(e.n); localStorage.setItem('t18_konce', JSON.stringify(seen)); } catch (x) {}
  }
  function gameOver() {
    SND.mood('sad'); sfx('heart');
    modal(m => {
      m.classList.add('end'); m.append(h('h2', null, 'MRTV', h('b', null, G.sex === 'f' ? 'Á' : 'Ý')));
      m.append(h('p', { class: 'lead' }, 'Popelov si tě nepamatuje. Koruna jde dál, z ruky do ruky, a nikdo neví, že jsi kdy existoval{a}.'.replace('{a}', G.sex === 'f' ? 'a' : '')));
      m.append(h('div', { class: 'row' }, h('button', { class: 'big', onclick: () => { close(); loadSlot('cp'); } }, 'Zkusit znovu (poslední kontrolní bod)'), h('button', { class: 'big alt', onclick: () => { close(); saveModal(); } }, 'Načíst')));
    }, false);
  }

  /* ---------- saves ---------- */
  const KEY = s => 't18_save_' + s;
  function autosave() { try { localStorage.setItem(KEY('auto'), JSON.stringify(G)); if (node && (node.fight || node.cp)) localStorage.setItem(KEY('cp'), JSON.stringify(G)); } catch (e) {} }
  function readSlot(s) { try { const j = localStorage.getItem(KEY(s)); return j ? JSON.parse(j) : null; } catch (e) { return null; } }
  function loadSlot(s) { const d0 = readSlot(s) || readSlot('auto'); if (!d0) return newGame(); G = Object.assign(fresh(), d0); hud(); go(G.node, { load: true }); }
  T.loadState = st => { G = Object.assign(fresh(), st); hud(); go(G.node, { load: true }); };
  T.state = () => G;

  /* ---------- modals ---------- */
  let modalEl = null;
  function modal(fill, closable = true) {
    close(); modalEl = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' }); const s = h('div', { class: 'sheet' }); fill(s);
    if (closable) s.prepend(h('div', { class: 'row', style: 'justify-content:flex-end' }, h('button', { class: 'tb', onclick: close }, 'Zavřít ✕')));
    modalEl.append(s); root.append(modalEl); if (closable) modalEl.addEventListener('click', e => { if (e.target === modalEl) close(); });
    const f = s.querySelector('button, input'); if (f) f.focus();
  }
  function close() { if (modalEl) { modalEl.remove(); modalEl = null; } }
  function portraitCanvas(id, w) { const c = h('canvas', { width: 240, height: 300 }); const cg = c.getContext('2d'); T.setPal(id === 'sarra' ? 'fire' : 'noir'); T.portrait(cg, T.who(id, G).P, { t: 1 }); return c; }
  function sheetModal() {
    if (!G.node) { toast('Postava vznikne, až začneš novou hru.'); return; }
    modal(m => {
      const c = CLASSES[G.cls];
      m.append(h('h2', null, G.name.toUpperCase() + ' ', h('b', null, `${RACES[G.race].name} · ${c.name}`)));
      const left = h('div', null);
      left.append(h('p', { class: 'lead' }, `Úroveň ${G.lvl} · Životy ${G.hp}/${hpMax()} · Obrana (ÚČ) ${ac()} · Útok ${sgn(atkBonus())} · Zlaťáky ${G.gold}`));
      const st = h('div', { class: 'stats' }); STATS.forEach(([k, n]) => st.append(h('div', { class: 'stat', title: statHint(k) }, h('b', null, n + (c.prof.includes(k) ? ' ★' : '')), h('span', null, String(G.st[k])), h('i', null, sgn(mod(G.st[k])))))); left.append(st);
      left.append(h('p', null, h('small', null, `★ = tvoje třída má v této vlastnosti výcvik (+${prof()} k hodům). Hod: k20 + oprava ≥ obtížnost.`)));
      left.append(h('h3', null, 'Batoh'));
      const inv = Object.entries(G.items).filter(([, n]) => n > 0); left.append(inv.length ? h('ul', { class: 'j' }, inv.map(([k, n]) => h('li', null, h('b', null, (ITEMS[k] || { n: k }).n + (n > 1 ? ` ×${n}` : '')), ' – ', (ITEMS[k] || { d: '' }).d))) : h('p', null, 'Prázdno.'));
      m.append(h('div', { class: 'split' }, left, portraitCanvas('hrdina')));
    });
  }
  function journalModal() {
    modal(m => {
      m.append(h('h2', null, 'DENÍK ', h('b', null, G.act)));
      m.append(h('h3', null, 'Úkoly'));
      const ul = h('ul', { class: 'j' }); [...G.qOrder].reverse().forEach(id => { const q = G.q[id]; ul.append(h('li', { class: q.s === 'd' ? 'done' : q.s === 'f' ? 'fail' : '' }, h('b', null, q.t + (q.s === 'f' ? ' (selhalo)' : '')), q.n.length ? h('ul', null, q.n.map(n => h('li', null, n))) : null)); });
      m.append(G.qOrder.length ? ul : h('p', null, 'Zatím nic.'));
      m.append(h('h3', null, `Důkazy (${G.clues.length})`));
      m.append(G.clues.length ? h('ul', { class: 'j' }, G.clues.map(c => h('li', null, c.t))) : h('p', null, 'Žádné. Kdo zabíjí, ten si myslí, že je chytřejší.'));
      const lore = (G.lore || []).filter(id => T.LORE && T.LORE[id]);
      m.append(h('h3', null, `Kronika (${lore.length})`));
      if (!lore.length) m.append(h('p', null, 'Zatím prázdná. Svět se teprve otevírá.'));
      ['Dějiny', 'Místa', 'Národy', 'Lidé'].forEach(cat => {
        const ids = lore.filter(id => T.LORE[id].cat === cat); if (!ids.length) return;
        m.append(h('p', { class: 'kcat' }, cat));
        ids.forEach(id => { const L = T.LORE[id]; const d = h('details', { class: 'kron' }, h('summary', null, L.title)); fmt(L.text).split(/\n\n/).forEach(par => d.append(h('p', { class: /^†/.test(par) ? 'fn' : '' }, par))); m.append(d); });
      });
    });
  }
  const apWord = v => v <= -6 ? 'Nenávist' : v <= -2 ? 'Nedůvěra' : v < 2 ? 'Neutrální' : v < 5 ? 'Respekt' : v < 8 ? 'Důvěra' : 'Oddanost';
  function partyModal() {
    modal(m => {
      m.append(h('h2', null, 'DRUŽINA'));
      const ids = Object.keys(G.ap).filter(k => T.C[k]).concat(G.party).filter((v, i, a) => a.indexOf(v) === i);
      if (!ids.length) m.append(h('p', { class: 'lead' }, 'Jsi sám{a}. Zatím.'.replace('{a}', G.sex === 'f' ? 'a' : '')));
      ids.forEach(id => { const v = G.ap[id] || 0; const pc = portraitCanvas(id); m.append(h('div', { class: 'comp' }, pc, h('div', null, h('b', { style: 'font-family:var(--title);font-size:22px;letter-spacing:.08em;font-weight:400' }, T.C[id].name + (G.party.includes(id) ? '' : ' (není s tebou)') + (G.f.rom === id ? '  ♥' : '')), h('div', { class: 'bar2' + (G.f.rom === id ? ' l' : '') }, h('i', { style: `width:${(v + 10) * 5}%` })), h('small', null, `${apWord(v)} (${sgn(v)})`)))); });
    });
  }
  function saveModal() {
    modal(m => {
      m.append(h('h2', null, 'ULOŽIT ', h('b', null, '/ NAČÍST')));
      m.append(h('p', null, h('small', null, 'Ukládá se jen v tomto prohlížeči. Hra se navíc sama ukládá při každé scéně.')));
      const sl = h('div', { class: 'slots' });
      ['auto', '1', '2', '3'].forEach(s => {
        const d0 = readSlot(s); const lbl = s === 'auto' ? 'Automatická' : 'Pozice ' + s;
        const info = d0 ? `${d0.name} · ${d0.act} · úr. ${d0.lvl} · ${(T.PL[(T.N[d0.node] || {}).bg] || {}).name || ''}` : 'prázdná';
        sl.append(h('div', { class: 'row' }, h('b', { style: 'font-family:var(--title);font-weight:400;font-size:20px;letter-spacing:.08em;min-width:130px' }, lbl), h('span', { style: 'flex:1;min-width:160px;color:var(--paper2)' }, info),
          s !== 'auto' && G && G.node ? h('button', { class: 'tb', onclick: () => { try { localStorage.setItem(KEY(s), JSON.stringify(G)); toast('Uloženo'); } catch (e) { toast('Uložení se nepovedlo', 'bad'); } saveModal(); } }, 'Uložit sem') : null,
          d0 ? h('button', { class: 'tb red', onclick: () => { close(); loadSlot(s); } }, 'Načíst') : null));
      });
      m.append(sl);
      m.append(h('div', { class: 'row' }, h('button', { class: 'big alt', onclick: () => { close(); newGame(); } }, 'Nová hra')));
    });
  }

  /* ---------- title and character creation ---------- */
  function titleScreen() {
    SC.place = 'hradby'; SC.npc = []; SC.party = false; placeEl.textContent = '';
    capEl.className = 'cap'; capEl.innerHTML = '<span class="nm">Jen pro dospělé</span><p>Temná fantasy: vraždy, intriky, souboje, předsudky a láska bez cudnosti, ale i bez detailů. Každá volba má váhu. Kostky nelžou.</p>';
    chsEl.innerHTML = ''; $('.por', root).style.visibility = 'hidden'; root.classList.add('nopor');
    const auto = readSlot('auto');
    if (auto && auto.node) chsEl.append(h('button', { class: 'ch next', onclick: () => loadSlot('auto') }, `Pokračovat (${auto.name}, ${auto.act})`));
    chsEl.append(h('button', { class: 'ch', onclick: () => newGame() }, 'Nová hra'));
    chsEl.append(h('button', { class: 'ch', onclick: () => saveModal() }, 'Načíst uloženou hru'));
    let seen = []; try { seen = JSON.parse(localStorage.getItem('t18_konce') || '[]'); } catch (e) {}
    if (seen.length) capEl.append(h('p', null, h('small', null, `Objevené konce: ${seen.length} z 9.`)));
  }
  function newGame() {
    const NG = fresh(); NG.name = ''; let pts = 3; const add = { sil: 0, obr: 0, odl: 0, duv: 0, mou: 0, cha: 0 };
    const total = k => CLASSES[NG.cls].base[k] + (RACES[NG.race].bon[k] || 0) + add[k];
    modal(m => {
      const draw = () => {
        m.innerHTML = '';
        m.append(h('h2', null, 'KDO ', h('b', null, 'JSI?')));
        m.append(h('p', { class: 'lead' }, 'Dvacet let jsi ' + (NG.sex === 'f' ? 'nevyšla' : 'nevyšel') + ' z věže. Nalezenec z popela Dračí války, kterého si král a královna vzali za vlastního. Dědic trůnu – a vězeň.'));
        const nm = h('input', { type: 'text', value: NG.name, placeholder: NG.sex === 'f' ? 'Mara' : 'Marek', maxlength: 18, 'aria-label': 'Jméno' }); nm.addEventListener('input', () => { NG.name = nm.value; });
        const left = h('div', { style: 'display:flex;flex-direction:column;gap:12px' });
        left.append(h('div', { class: 'row' }, nm, h('button', { class: 'card', 'aria-pressed': String(NG.sex === 'f'), onclick: () => { NG.sex = 'f'; draw(); } }, h('b', null, 'Princezna')), h('button', { class: 'card', 'aria-pressed': String(NG.sex === 'm'), onclick: () => { NG.sex = 'm'; draw(); } }, h('b', null, 'Princ'))));
        left.append(h('h3', null, 'Krev'));
        const rc = h('div', { class: 'cards' }); Object.entries(RACES).forEach(([k, r]) => rc.append(h('button', { class: 'card', 'aria-pressed': String(NG.race === k), onclick: () => { NG.race = k; draw(); } }, h('b', null, r.name), h('small', null, r.d), h('em', null, Object.entries(r.bon).map(([s, v]) => `${SN[s]} +${v}`).join(' · '))))); left.append(rc);
        left.append(h('h3', null, 'Výcvik'));
        const cc = h('div', { class: 'cards' }); Object.entries(CLASSES).forEach(([k, c]) => cc.append(h('button', { class: 'card', 'aria-pressed': String(NG.cls === k), onclick: () => { NG.cls = k; draw(); } }, h('b', null, c.name), h('small', null, c.d), h('em', null, `Životy ${c.hp} · Obrana ${c.ac} · ★ ${c.prof.map(s => SN[s]).join(', ')}`)))); left.append(cc);
        left.append(h('h3', null, `Vlastnosti – zbývá ${pts} ${pts === 1 ? 'bod' : 'body'}`));
        const st = h('div', { class: 'stats' }); STATS.forEach(([k, n]) => st.append(h('div', { class: 'stat', title: statHint(k) }, h('b', null, n + (CLASSES[NG.cls].prof.includes(k) ? ' ★' : '')), h('button', { class: 'pm', 'aria-label': 'méně ' + n, disabled: add[k] <= 0 ? '' : null, onclick: () => { add[k]--; pts++; draw(); } }, '−'), h('span', null, String(total(k))), h('button', { class: 'pm', 'aria-label': 'více ' + n, disabled: pts <= 0 || total(k) >= 18 ? '' : null, onclick: () => { add[k]++; pts--; draw(); } }, '+')))); left.append(st);
        const pv = h('canvas', { width: 240, height: 300 }); const pg2 = pv.getContext('2d'); T.setPal('noir'); T.portrait(pg2, T.heroSpec(NG).P, { t: 1 });
        m.append(h('div', { class: 'split' }, left, pv));
        m.append(h('div', { class: 'row' }, h('button', { class: 'big', onclick: () => { NG.name = (NG.name || '').trim() || (NG.sex === 'f' ? 'Mara' : 'Marek'); STATS.forEach(([k]) => { NG.st[k] = total(k); }); G = NG; G.hp = hpMax(); close(); hud(); go('start'); } }, 'Vstoupit do příběhu'), h('button', { class: 'big alt', onclick: () => { close(); titleScreen(); } }, 'Zpět')));
      };
      modalEl && 0; draw(); m.redraw = draw;
    }, false);
  }

  /* ---------- boot ---------- */
  T.boot = function () {
    if (root) return; build(); G = fresh(); SC.t0 = performance.now(); requestAnimationFrame(drawScene); titleScreen();
    document.addEventListener('pointerdown', () => { SND.ctx(); }, { once: true });
  };
  T._test = { go: (id) => go(id), pick: (i) => { const bs = [...chsEl.querySelectorAll('button.ch:not([disabled])')]; if (bs[i]) bs[i].click(); return bs.length; }, buttons: () => [...chsEl.querySelectorAll('button.ch')].map(b => ({ t: b.textContent, dis: b.disabled })), node: () => nodeId, fight: () => !!F, newGame: (st) => { G = Object.assign(fresh(), st); G.hp = hpMax(); hud(); }, hpMax: () => hpMax(), F: () => F, close };
})(window.T);
