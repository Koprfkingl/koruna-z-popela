/* Koruna z popela – who is who: names, portraits (P) and full-figure silhouettes (F). */
(function (T) {
  'use strict';
  const C = {
    hedvika: { name: 'Chůva Hedvika', P: { fem: 1, age: 3, hair: 'scarf', hw: 48, jaw: .7, light: -1, look: 1 }, F: { fem: 1, dress: 'dress', hair: 'bun', h: 1 } },
    kral: { name: 'Král Bořivoj', P: { age: 3, hair: 'long', hairCol: 'paper', beard: 'long', beardCol: 'paper', crown: 1, crownGem: 1, hw: 52, body: 'coat', fur: 1, light: 1 }, F: { dress: 'robe', crown: 1, beard: 'long', h: 1 } },
    kralovna: { name: 'Královna Morana', P: { fem: 1, hair: 'long', crown: 1, crownGem: 1, lips: 'spot', hw: 46, jaw: .58, hard: 1, body: 'gown', collar: 'high', dressCol: null, back: 'spot', light: -1 }, F: { fem: 1, dress: 'dress', dressCol: 'spot', crown: 1, hair: 'long', h: 1.02 } },
    vilem: { name: 'Kancléř Vilém', P: { hair: 'bald', skin: 'yellow', hw: 46, jaw: .6, age: 2, body: 'robe', robeCol: null, collar: 'high', light: 1, eye: 'yellow', mood: 'smirk' }, F: { dress: 'robe', skin: 'yellow', h: 1.04, sash: 'spot2' } },
    radim: { name: 'Kapitán Radim Kost', P: { hair: 'crop', stubble: 1, scar: 1, hw: 54, jaw: .92, body: 'armor', light: -1 }, F: { dress: 'armor', weapon: 'sword', cape: 'ink', h: 1.08 } },
    sabina: { name: 'Inkvizitorka Sabina', P: { fem: 1, hood: 'paper', hw: 44, jaw: .6, hard: 1, body: 'robe', pendant: 'spot', light: 1, eye: null }, F: { fem: 1, dress: 'robe', hood: 1, mask: 0, weapon: 'staff', h: 1.02, glow: 'spot' } },
    plachta: { name: 'Plachtička', P: { kind: 'squirrel' }, F: { kind: 'squirrel', h: .2 } },
    trubka: { name: 'Bohuslav Trubka', P: { hair: 'messy', beard: 'goatee', hw: 50, jaw: .7, body: 'coat', collar: 'coat', light: -1, mood: 'smile', strap: 1 }, F: { dress: 'coat', hat: 'wide', h: .95, build: 1.1 } },
    otylie: { name: 'Husa Otýlie', P: { kind: 'goose' }, F: { kind: 'goose', h: .32 } },
    smudla: { name: 'Krysí král Šmudla', P: { kind: 'rat', crown: 1, monocle: 1 }, F: { kind: 'rat', crown: 1, h: .7, dress: 'rags' } },
    simon: { name: 'Lékárník Šimon', P: { hair: 'messy', age: 2, hw: 46, jaw: .7, body: 'coat', apron: 1, light: -1 }, F: { dress: 'coat', h: .95 } },
    sarra: { name: 'Sarra Popelavá', P: { fem: 1, horns: 1, scales: 1, eye: 'ember', hair: 'crop', hw: 50, jaw: .74, hard: 1, body: 'coat', apron: 1, back: 'fire', light: 1 }, F: { fem: 1, horns: 1, tail: 1, dress: 'coat', weapon: 'hammer', eyeCol: 'ember', h: 1.06, build: 1.15 } },
    ester: { name: 'Ester', P: { fem: 1, hair: 'messy', hw: 46, jaw: .62, scar: 0, body: 'coat', collar: 'coat', strap: 1, light: -1, mood: 'smirk' }, F: { fem: 1, dress: 'coat', weapon: 'crossbow', hood: 0, h: .96 } },
    vojta: { name: 'Vojta', P: { hair: 'messy', beard: 'full', hw: 58, jaw: .95, body: 'coat', fur: 1, light: 1 }, F: { dress: 'coat', weapon: 'axe', beard: 1, h: 1.12, build: 1.3 } },
    bohous: { name: 'Statkář Bohouš', P: { hair: 'short', hairCol: 'paper', beard: 'full', beardCol: 'paper', age: 2, hw: 54, jaw: .9, body: 'coat', light: -1 }, F: { dress: 'coat', beard: 1, h: 1, build: 1.2 } },
    vedma: { name: 'Vědma z Černého lesa', P: { fem: 1, age: 3, hair: 'wild', hairCol: 'paper', eye: 'blind', hw: 44, jaw: .6, body: 'robe', light: 1, back: 'paper' }, F: { fem: 1, dress: 'rags', hair: 'wild', weapon: 'staff', h: .9 } },
    kychal: { name: 'Drak Kýchal', P: { kind: 'dragon' }, F: { kind: 'dragon', h: 1 } },
    hostinsky: { name: 'Hostinský Kulhavý Jarda', P: { hair: 'bald', beard: 'full', hw: 58, jaw: .95, age: 1, body: 'coat', apron: 1, light: -1 }, F: { dress: 'coat', h: 1, build: 1.35 } },
    // foes
    straz: { name: 'Strážný', P: { hair: 'crop', stubble: 1, hw: 52, jaw: .9, body: 'armor', light: -1 }, F: { dress: 'armor', helm: 1, weapon: 'spear', shield: 1, h: 1.04 } },
    fanatik: { name: 'Fanatik Řádu', P: { hood: 'paper', hw: 48, body: 'robe', light: 1, mask: 1 }, F: { dress: 'robe', hood: 1, mask: 1, weapon: 'torch', h: 1 } },
    krysak: { name: 'Krysák', P: { kind: 'rat' }, F: { kind: 'rat', h: .66, weapon: 'dagger', dress: 'rags' } },
    vlk: { name: 'Vlk', P: { kind: 'wolf' }, F: { kind: 'wolf', h: .55 } },
    kostlivec: { name: 'Kostěný rytíř', P: { kind: 'bones' }, F: { kind: 'bones', weapon: 'sword', shield: 1, helm: 1, h: 1.04, dress: 'armor' } },
    ghul: { name: 'Ghúl', P: { kind: 'ghoul' }, F: { kind: 'ghoul', dress: 'rags', h: .85, col: '#1a1714' } },
    zoldak: { name: 'Žoldák', P: { hair: 'short', beard: 'full', scar: 1, hw: 54, body: 'armor', light: 1 }, F: { dress: 'armor', weapon: 'axe', h: 1.04 } },
    lid: { name: 'Člověk z davu', P: { hair: 'short', hw: 50, body: 'coat', light: -1 }, F: { dress: 'coat', h: .98 } },
    lid2: { name: 'Žena z davu', P: { fem: 1, hair: 'scarf', hw: 46, body: 'dress', light: 1 }, F: { fem: 1, dress: 'dress', h: .94 } },
    drakolid: { name: 'Dračí uprchlík', P: { horns: 1, scales: 1, eye: 'ember', hair: 'crop', hw: 52, body: 'coat', light: -1 }, F: { horns: 1, tail: 1, dress: 'rags', eyeCol: 'ember', h: 1 } },
    kat: { name: 'Kat', P: { hood: 'ink', hw: 56, body: 'coat', light: -1 }, F: { hood: 1, dress: 'coat', weapon: 'axe', h: 1.1, build: 1.3 } }
  };
  T.C = C;
  // seeds make every figure sway on its own beat
  Object.keys(C).forEach((k, i) => { C[k].id = k; C[k].P.id = k; C[k].F.seed = i * 1.7 + 1; });

  /* The hero is built from the choices made at the start. */
  T.heroSpec = function (G) {
    const fem = G.sex === 'f', race = G.race, cls = G.cls;
    const P = { id: 'hrdina', fem: fem ? 1 : 0, hw: fem ? 46 : 52, jaw: fem ? .62 : .86, light: -1, body: 'coat', collar: 'coat', hard: 1 };
    const F = { fem: fem ? 1 : 0, dress: 'coat', h: 1, seed: 2.2 };
    P.hair = fem ? 'long' : 'messy'; F.hair = fem ? 'long' : null;
    if (race === 'elf') { P.ears = 'elf'; F.ears = 'elf'; P.hw -= 3; }
    if (race === 'trpaslik') { F.kind = 'dwarf'; F.h = .78; P.hw += 6; P.jaw = .95; if (!fem) { P.beard = 'long'; F.beard = 'long'; } else { P.hair = 'braid'; } }
    if (race === 'drak') { P.horns = 1; P.scales = 1; P.eye = 'ember'; F.horns = 1; F.tail = 1; F.eyeCol = 'ember'; P.hair = 'crop'; F.hair = null; }
    if (cls === 'bojovnik') { P.body = 'armor'; F.dress = 'armor'; F.weapon = 'sword'; F.cape = 'spot'; if (!fem && race !== 'trpaslik') P.stubble = 1; }
    if (cls === 'zlodej') { P.hood = 'ink'; P.hoodShade = .5; F.hood = 1; F.weapon = 'dagger'; }
    if (cls === 'mag') { P.body = 'robe'; F.dress = 'robe'; F.weapon = 'staff'; F.glow = 'spot'; P.pendant = 'spot2'; }
    if (cls === 'bard') { P.strap = 1; F.weapon = null; F.cape = 'spot'; P.mood = 'smirk'; }
    if (G.scar) P.scar = 1;
    return { id: 'hrdina', name: G.name, P, F };
  };
  T.who = function (id, G) { if (id === 'hrdina') return T.heroSpec(G); return C[id]; };
})(window.T);
