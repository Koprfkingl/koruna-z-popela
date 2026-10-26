/* Koruna z popela – Dějství I: Popelov. Hospoda, lékárna, Škvára, chrám, stoky, brána, Radim. */
(function (T) {
  'use strict';
  const S = (w, t, m) => ({ w, t, m });
  const step = (G, A, k) => { if (!A.has('byl_' + k)) { A.set('byl_' + k); A.inc('kroky'); } };
  const purgeAt = A => A.has('cistkaOdklad') ? 4 : 3;
  Object.assign(T.N, {
    p_mesto_prichod: { act: 'Dějství I · Popelov', bg: 'ulice', mood: 'rain', cp: 1, t: (G, A) => [
      'Popelov. Město, které vyrostlo z popela Dračí války a nikdy ho ze sebe nesmylo.',
      'Uličky se kroutí jako střeva. Z oken visí prádlo a v průchodech lidé. Na konci ulice, proti bledému nebi, šibenice. Prázdná. Zatím.',
      S('plachta', 'Tak. Svět. Všechno, o čem jsi dvacet let snil{a}. Smrdí to tu jako moje nora po zimě.', 'n'),
      'Brány jsou kvůli králově nemoci zavřené. Kdo chce ven, potřebuje propustku, známosti, nebo hodně odvahy. A ty potřebuješ ven – ke zřícenině za Lhotou. Ale vrah tvého otce je tady, ve městě.'
    ], enter: (G, A) => { A.quest('ven', 'Ven z Popelova', 'Brány jsou zavřené. Najdi způsob, jak se dostat z města: propustka, známosti, podzemí, nebo silou.'); }, ch: [{ t: 'Rozhlédnout se.', go: 'mesto' }] },

    mesto: { bg: 'ulice', mood: 'rain', redirect: (G, A) => {
        if ((G.f.kroky || 0) >= 2 && !A.has('radimPotkan')) return 'radim_ulice';
        return null;
      }, t: (G, A) => [
        (G.f.kroky || 0) === 0 ? 'Kam teď? Déšť tě žene pod okapy.' : (G.f.kroky >= purgeAt(A) && !A.has('byl_skvara') ? 'Nad Škvárou stoupá černý dým. Někde v dálce zvoní umíráček.' : 'Popelov hučí jako úl, do kterého někdo kopl.')
      ], ch: (G, A) => [
        { t: 'Hospoda U Oběšence', go: 'hospoda' },
        { t: 'Lékárna U Zlatého hada' + (A.has('tipSimon') ? ' (Šimon prodává Černou rosu)' : ''), go: 'lekarna', if: () => !A.has('byl_lekarna') },
        { t: 'Škvára, dračí čtvrť', go: (G2, A2) => A2.has('byl_skvara') ? 'skvara_po' : ((G2.f.kroky || 0) >= purgeAt(A2) ? 'skvara_pozde' : 'skvara') },
        { t: 'Chrám Bledého plamene', go: 'chram', if: () => !A.has('chramHotovo') },
        { t: 'Sestoupit do stok', go: 'stoky', if: () => (A.has('stokyVstup') || A.has('vStokach')) && !A.has('stokyHotovo') },
        { t: 'Městská brána (opustit Popelov)', go: 'brana' }
      ] },

    /* ---------- hospoda ---------- */
    hospoda: { bg: 'hospoda', mood: 'warm', npc: (G, A) => A.has('esterPotkana') ? [{ id: 'hostinsky', x: .82 }, { id: 'trubka', x: .62 }, { id: 'otylie', x: .7 }] : [{ id: 'straz', x: .9 }, { id: 'ester', x: .78 }, { id: 'straz', x: .66 }], enter: (G, A) => step(G, A, 'hospoda'), t: (G, A) => [
      G.seen.hospoda > 1 ? 'U Oběšence je pořád stejně: kouř, pivo, falešný zpěv.' : 'Nad dveřmi se houpe smyčka. Uvnitř je teplo, smrad z loje a falešný zpěv. Hostinský Kulhavý Jarda leští půllitr hadrem, který viděl lepší časy. Nebo možná ne.',
      !A.has('esterPotkana') ? 'V rohu dva strážní tisknou ke stěně mladou ženu v zablácené kazajce. Na stole leží mrtvá srna. Žena se nebojí. Vypadá spíš, že počítá, kterému z nich vydloubne oko jako prvnímu.' : null,
      G.seen.hospoda > 1 ? null : 'U krbu sedí muž s loutnou a obrovským kloboukem a zpívá o králi, který kýchal. U jeho nohou syčí husa s malinkou korunkou.'
    ], ch: (G, A) => [
      { t: 'Vložit se do toho se strážemi.', if: () => !A.has('esterPotkana'), go: 'h_ester' },
      { t: 'Přisednout k pěvci s husou.', go: 'h_trubka' },
      { t: 'Promluvit s hostinským.', go: 'h_jarda' },
      { t: 'Zpátky do ulic.', go: 'mesto' }
    ] },
    h_ester: { bg: 'hospoda', npc: [{ id: 'straz', x: .9 }, { id: 'ester', x: .78 }, { id: 'straz', x: .66 }], t: [
      S('straz', 'Pytlačka z Lhoty. Králova srna, králův les, králova šibenice. Leda by se s náma domluvila jinak, že jo, holka.', 'smirk'),
      S('ester', 'Tvoje máma se s celou posádkou domluvila jinak. Na ni si zkus.', 'angry')
    ], ch: [
      { t: '„Ta srna je moje. Poslal{a} jsem ji pro ni. Máte s tím problém?“', chk: { s: 'cha', dc: 12, ok: 'h_ester_ok', no: 'h_ester_boj' } },
      { t: 'Zlomit prvnímu z nich prst. Pomalu.', chk: { s: 'sil', dc: 13, ok: 'h_ester_ok', no: 'h_ester_boj' } },
      { t: 'Hodit jim pět zlatých. „Na pivo. Daleko odsud.“', cost: 5, go: 'h_ester_ok' },
      { t: 'Bez řečí vytáhnout zbraň.', tag: 'Útok', go: 'h_ester_boj' },
      { t: 'Nemíchat se do toho.', go: 'h_ester_ne' }
    ] },
    h_ester_boj: { bg: 'hospoda', npc: [{ id: 'ester', x: .78 }], fight: { foes: ['straz', 'straz'], intro: 'Ester popadne korbel a rozbije ho o hlavu bližšímu strážnému. Hospoda jásá.', win: 'h_ester_ok', lose: 'h_ester_prohra', winFx: (G, A) => A.set('esterBoj') } },
    h_ester_prohra: { bg: 'hospoda', npc: [{ id: 'ester', x: .78 }, { id: 'hostinsky', x: .9 }], t: ['Ležíš na podlaze. Nad tebou stojí Jarda s palicí a oba strážní jsou venku – i se zuby. Ester ti podá ruku.', S('ester', 'Bojuješ jako panstvo. Odvážně a blbě.', 'smirk')], ch: [{ t: 'Vstát.', go: 'h_ester_ok' }] },
    h_ester_ne: { bg: 'hospoda', npc: [{ id: 'hostinsky', x: .82 }, { id: 'trubka', x: .62 }, { id: 'otylie', x: .7 }], t: ['Strážní ji vyvlečou ven. Na prahu se ohlédne a podívá se přímo na tebe. Ten pohled si zapamatuješ.'], enter: (G, A) => { A.set('esterPotkana'); A.set('esterZajata'); A.ap('ester', -3, true); }, ch: [{ t: 'Dál', go: 'hospoda' }] },
    h_ester_ok: { bg: 'hospoda', npc: [{ id: 'ester', x: .72 }], enter: (G, A) => { A.set('esterPotkana'); A.ap('ester', 2, true); }, t: (G, A) => [
      A.has('esterBoj') ? 'Strážní se odpotácí do deště. Ester si otře krev z kloubů a změří si tě od hlavy k patě.' : 'Strážní si odplivnou a odejdou. Ester si tě změří od hlavy k patě.',
      S('ester', 'Ester. Z Lhoty. Nečekej, že ti padnu k nohám, jen proto, že máš čisté nehty a mluvíš jako z knížky.', 'smirk'),
      S('ester', 'Doma nám Řád a kancléřovi výběrčí berou poslední zrno. Dračí daň, tak tomu říkají. Táta je dlužný až po krk. Srnu jsem chtěla prodat. Teď nemám nic.', 'n')
    ], ch: [
      { t: '„Potřebuju se dostat za Lhotu. Ke zřícenině. Pojď se mnou.“', go: 'h_ester_join' },
      { t: '„Tady máš deset zlatých. Pro tátu.“', cost: 10, go: 'h_ester_join', fx: (G, A) => A.ap('ester', 2, true) },
      { t: '„Hodně štěstí, Ester.“', go: 'hospoda' }
    ] },
    h_ester_join: { bg: 'hospoda', npc: [{ id: 'ester', x: .72 }], t: [
      S('ester', 'Ke Dračímu hrádku? Tam chodí jenom blázni a mrtví. Ty vypadáš jako obojí.', 'smirk'),
      S('ester', 'Fajn. Znám stezky, kde nejsou stráže. Ale až budeme v Lhotě, pomůžeš mi s výběrčím. Dohoda?', 'n')
    ], enter: (G, A) => { A.join('ester'); A.quest('lhota', 'Esteřin domov', 'Ester mi ukáže cestu přes Lhotu. Slíbil{a} jsem jí pomoct s výběrčím a s Řádem.'); }, ch: [{ t: 'Plivnout si do dlaně a podat jí ji.', go: 'hospoda', fx: (G, A) => A.ap('ester', 1) }, { t: '„Dohoda.“', go: 'hospoda' }] },

    h_trubka: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: (G, A) => [
      G.seen.h_trubka > 1 ? S('trubka', 'Ach, můj mecenáš se vrací! Otýlie, ukloň se. Otýlie! Nekousej.', 'smile') : S('trubka', 'Bohuslav Trubka, básník, pěvec, kaligraf a vdovec za živa. Tohle je moje choť, hraběnka Otýlie z Hrbu. Prokletá. Ve dne husa, v noci… taky husa. Prokletí je důkladné.', 'smile'),
      { w: 'otylie', t: 'Ssssssss.', snd: 'husa' },
      S('plachta', 'Kdyby mě někdo takhle představil, taky bych syčela.', 'n')
    ], ch: (G, A) => [
      { t: 'Koupit mu pivo a poslechnout si drby. (2 zl)', cost: 2, go: 'h_trubka_drby', if: () => !A.has('tipSimon') },
      { t: '„Prý umíš krásně psát. Umíš i úřední pečeti?“', go: 'h_trubka_propustka', if: () => !A.has('propustka') },
      { t: '[Bard] Vyzvat ho na pěvecký souboj o propustku.', if: () => A.cls('bard') && !A.has('propustka'), chk: { s: 'cha', dc: 12, ok: 'h_trubka_duel_ok', no: 'h_trubka_duel_no' } },
      { t: 'Ukázat mu zašifrovaný dopis.', if: () => A.item('dopis') && !A.hasClue('dopis'), go: 'h_trubka_sifra' },
      { t: 'Pohladit husu.', go: 'h_otylie', once: true },
      { t: 'Odejít.', go: 'hospoda' }
    ] },
    h_otylie: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [{ t: 'Otýlie ti bleskově klovne do kloubů. Krev. Hodně krve na tak malou husu.', shake: 6, snd: 'husa' }, S('trubka', 'Ona tě má ráda! Kdyby tě neměla ráda, šla by po očích.', 'smile')], enter: (G, A) => A.hurt(1), ch: [{ t: 'Dál', go: 'h_trubka' }] },
    h_trubka_drby: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [
      S('trubka', 'Drby, drby. Tak tedy: Černou rosu – ten jed, o kterém se šeptá – v Popelově prodává jen jeden člověk. Lékárník Šimon, U Zlatého hada.', 'n'),
      S('trubka', 'A včera večer, když jsem šel kolem s Otýlií na procházku, vcházel tam pán se žlutou tváří. Žlutou jako sýr. Kdo v Popelově má žlutou tvář, hm?', 'smirk'),
      S('trubka', 'A pak, že básníci nic nevidí.', 'smile')
    ], enter: (G, A) => { A.set('tipSimon'); A.note('vrah', 'Trubka: Černou rosu prodává jen lékárník Šimon. Včera k němu chodil muž se žlutou tváří.'); }, ch: [{ t: 'Dál', go: 'h_trubka' }] },
    h_trubka_propustka: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [S('trubka', 'Propustku z města? S pečetí městské rady? To je zločin, za který se věší. Dvacet zlatých. Za dvacet zlatých se věší rád.', 'smirk')], ch: [
      { t: 'Zaplatit. (20 zl)', cost: 20, go: 'h_trubka_ma', fx: (G, A) => A.set('propustka') },
      { t: 'Smlouvat.', chk: { s: 'cha', dc: 13, ok: 'h_trubka_sleva', no: 'h_trubka' } },
      { t: 'Pohrozit, že prozradíš, že je padělatel.', chk: { s: 'sil', dc: 12, ok: 'h_trubka_ma', no: 'h_trubka', okFx: (G, A) => { A.set('propustka'); A.ap('ester', -1); } } },
      { t: 'Jindy.', go: 'h_trubka' }
    ] },
    h_trubka_sleva: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [S('trubka', 'Deset. Ale složíš o mně baladu, až budeš [[slavný|slavná]]. Dohoda?', 'smile')], ch: [{ t: 'Zaplatit deset.', cost: 10, go: 'h_trubka_ma', fx: (G, A) => A.set('propustka') }, { t: 'Jindy.', go: 'h_trubka' }] },
    h_trubka_duel_ok: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: ['Tvoje píseň o žlutém kancléři, který si spletl jed s medem, rozesměje celou hospodu. Jarda brečí smíchy. Trubka se ukloní až k zemi.', S('trubka', 'Poražen. Konečně někým, kdo za to stojí. Propustka je tvoje, zadarmo. A tu píseň mi daruj.', 'smile')], enter: (G, A) => { A.set('propustka'); A.gold(6); }, ch: [{ t: 'Dál', go: 'h_trubka_ma' }] },
    h_trubka_duel_no: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: ['Tvoje píseň skončí ticho. Otýlie zasyčí. Trubka tě soucitně poplácá po rameni.'], ch: [{ t: 'Dál', go: 'h_trubka' }] },
    h_trubka_ma: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: ['Trubka vytáhne z klobouku pergamen, vosk a pečetidlo, které by nemělo existovat. O deset minut později máš propustku, krásnější než pravou.'], enter: (G, A) => A.note('ven', 'Mám padělanou propustku od Trubky.'), ch: [{ t: 'Dál', go: 'h_trubka' }] },
    h_trubka_sifra: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [S('trubka', 'Kancléřská šifra. Posouvá písmena podle dní v týdnu. Jako by to vymyslel úředník. Což vymyslel.', 'smirk'), 'Pár minut škrábe uhlem po stole.', S('trubka', '„Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. – V.“ …Tohle jsem nečetl. Otýlie taky ne.', 'shock')], enter: (G, A) => A.clue('dopis', 'Dopis kancléře Řádu: „Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. – V.“'), ch: [{ t: 'Dál', go: 'h_trubka' }] },

    h_jarda: { bg: 'hospoda', npc: [{ id: 'hostinsky', x: .74 }], t: (G, A) => [
      S('hostinsky', G.seen.h_jarda > 1 ? 'Ještě něco?' : 'Pokoj za pět, pivo za groš, otázky za stříbro. Na dluh nic, na čest ještě míň.', 'n'),
      A.has('hledany') ? S('hostinsky', 'A mimochodem – kapitán Kost tu byl. Hledá někoho, kdo vypadá dost jako ty. Neboj, já si obličeje nepamatuju. Za příplatek.', 'smirk') : null
    ], ch: (G, A) => [
      { t: 'Pronajmout pokoj a vyspat se. (5 zl)', cost: 5, go: 'noc_hospoda' },
      { t: '„Slyšel jsem o Krysím králi. Kudy se k němu dostanu?“ (5 zl)', cost: 5, if: () => !A.has('stokyVstup'), go: 'h_jarda_stoky' },
      { t: 'Koupit léčivý lektvar. (12 zl)', cost: 12, go: 'h_jarda', fx: (G2, A2) => A2.give('lektvar') },
      { t: 'Zpátky.', go: 'hospoda' }
    ] },
    h_jarda_stoky: { bg: 'hospoda', npc: [{ id: 'hostinsky', x: .74 }], t: [S('hostinsky', 'Sklep. Za sudem s kyselým vínem je mříž. Klíč nemá nikdo, protože tam není zámek. Krysy nemají rády zámky. Mají rády zlato. A sýr.', 'n')], enter: (G, A) => { A.set('stokyVstup'); A.quest('krysy', 'Krysí král', 'Pod hospodou vede cesta do stok, kde vládne Krysí král Šmudla. Prý ví o všem, co se v Popelově šustne.'); }, ch: [{ t: 'Dál', go: 'h_jarda' }] },
    noc_hospoda: { bg: 'hospoda', mood: 'warm', npc: (G, A) => A.inParty('ester') ? [{ id: 'ester', x: .7 }] : A.inParty('sarra') ? [{ id: 'sarra', x: .7 }] : [], t: (G, A) => {
        const out = ['Slamník, deka, svíčka. Poprvé za dvacet let spíš za dveřmi, které můžeš otevřít zevnitř.'];
        if (A.inParty('ester') && !A.has('esterNoc1')) out.push(S('ester', 'Nemůžu spát. V Lhotě slyším sovy. Tady slyším, jak se lidi vraždí o patro níž.', 'n'), S('ester', 'Proč jsi mi pomohl{a}? Lidi jako ty nepomáhají lidem jako já. Lidi jako ty nás věší.', 'n'));
        else if (A.inParty('sarra') && !A.has('sarraNoc1')) out.push(S('sarra', 'Dvacet let jsem kovala podkovy koním, na kterých jezdili ti, co nás pálili. Víš, jaký je to pocit?', 'angry'));
        else out.push(S('plachta', 'Chrápeš. Jen abys věděl{a}. Jako medvěd s rýmou.', 'n'));
        return out;
      }, enter: (G, A) => A.rest(), ch: (G, A) => [
        { t: '„Protože mě dvacet let nikdo nepustil ven. Vím, jaké je to být v pasti.“', if: () => A.inParty('ester') && !A.has('esterNoc1'), go: 'mesto_rano', ap: { ester: 2 }, fx: (G2, A2) => A2.set('esterNoc1') },
        { t: '„Potřeboval{a} jsem průvodce.“', if: () => A.inParty('ester') && !A.has('esterNoc1'), go: 'mesto_rano', ap: { ester: -1 }, fx: (G2, A2) => A2.set('esterNoc1') },
        { t: '„Ten pocit znám jen z druhé strany. Pověz mi o něm.“', if: () => A.inParty('sarra') && !A.inParty('ester') && !A.has('sarraNoc1'), go: 'mesto_rano', ap: { sarra: 2 }, fx: (G2, A2) => A2.set('sarraNoc1') },
        { t: 'Zhasnout svíčku.', go: 'mesto_rano' }
      ] },
    mesto_rano: { bg: 'ulice', t: ['Ráno. Déšť ustal, ale město pořád kape. Někde kokrhá kohout, jako by na tom ještě záleželo.'], enter: (G, A) => { A.inc('kroky'); G.day++; }, ch: [{ t: 'Dál', go: 'mesto' }] },

    /* ---------- lékárna ---------- */
    lekarna: { bg: 'lekarna', mood: 'tense', npc: [], enter: (G, A) => step(G, A, 'lekarna'), t: (G, A) => [
      'Lékárna U Zlatého hada. Dveře pootevřené, zvonek ustřižený. Uvnitř voní heřmánek a krev.',
      'Lékárník Šimon leží přes pult, tváří v kaluži vlastní krve. Je ještě teplý. Přišel{a} jsi o pár minut pozdě.',
      S('plachta', 'Tohle město je úžasný. Kam přijdeš, tam mrtvola. Jako by nás někdo předbíhal.', 'n')
    ], ch: (G, A) => [
      { t: 'Prohlédnout knihu prodejů na pultu.', if: () => !A.has('lekKniha'), chk: { s: 'duv', dc: 12, ok: 'l_kniha_ok', no: 'l_kniha_no' } },
      { t: 'Prohledat lékárnu – vrah tu možná ještě je.', if: () => !A.has('lekVrah'), chk: { s: 'mou', dc: 12, ok: 'l_vrah', no: 'l_vrah_prepad' } },
      { t: 'Odejít, než přijdou stráže.', go: 'mesto' }
    ] },
    l_kniha_ok: { bg: 'lekarna', npc: [], t: ['Poslední listy jsou vytržené. Ale Šimon psal tvrdou rukou a pero se protlačilo na další stranu. Přejedeš ji uhlíkem z kamen.', 'Ze šedi vystoupí písmo: *„Černá rosa – 1 lahvička – převzal R. K. – na účet Kancléřství.“*', 'R. K. Radim Kost? Kapitán stráže, který tě vedl po schodech?'], enter: (G, A) => { A.set('lekKniha'); A.give('kniha'); A.clue('kniha', 'Lékárníkova kniha: „Černá rosa – 1 lahvička – převzal R. K. – na účet Kancléřství.“'); }, ch: [{ t: 'Dál', go: 'lekarna' }] },
    l_kniha_no: { bg: 'lekarna', npc: [], t: ['Vytržené listy, rozmazaný inkoust, krev. Knihu si vezmeš – možná ji někdo chytřejší přečte.'], enter: (G, A) => { A.set('lekKniha'); A.give('kniha'); A.set('knihaNeprectena'); }, ch: [{ t: 'Dál', go: 'lekarna' }] },
    l_vrah_prepad: { bg: 'lekarna', npc: [{ id: 'zoldak', x: .72 }], t: [{ t: 'Ze skříně vyrazí muž s nožem a zasáhne tě do ramene, než se stihneš otočit.', shake: 10 }], enter: (G, A) => A.hurt(3), ch: [{ t: 'Bránit se!', tag: 'Útok', go: 'l_vrah_boj' }] },
    l_vrah: { bg: 'lekarna', npc: [{ id: 'zoldak', x: .72 }], t: ['Skříň s lektvary má pootevřené dveře a pod nimi čerstvou šmouhu krve. Než ji otevřeš, vyrazí ven muž s nožem. Ale ty už jsi [[připravený|připravená]].'], ch: [{ t: 'Na něj.', tag: 'Útok', go: 'l_vrah_boj' }, { t: '„Kdo tě platí? Řekni to a odejdeš živý.“', chk: { s: 'cha', dc: 14, ok: 'l_vrah_mluvi', no: 'l_vrah_boj' } }] },
    l_vrah_boj: { bg: 'lekarna', fight: { foes: [{ id: 'zoldak', name: 'Vrah z lékárny' }], win: 'l_vrah_mrtvy', lose: 'l_vrah_utekl' } },
    l_vrah_mluvi: { bg: 'lekarna', npc: [{ id: 'zoldak', x: .72 }], t: [S('zoldak', 'Žlutej pán. Platí zlatem s hadem. Šimon mu prodal jed a pak moc mluvil v hospodě. Teď už nemluví. Víc nevím, přísahám na mámu.', 'shock'), 'Pustíš ho. Uteče do deště. Možná ho už zítra najdou v řece – kancléř nemá rád upovídané.'], enter: (G, A) => { A.set('lekVrah'); A.clue('najemnik', 'Najatý vrah z lékárny přiznal: platí ho „žlutý pán“ zlatem s hadem. Šimon prodal jed a pak mluvil.'); A.ap('vojta', 1, true); }, ch: [{ t: 'Dál', go: 'l_kuba' }] },
    l_vrah_mrtvy: { bg: 'lekarna', npc: [{ id: 'zoldak', pose: 'dead', x: .72 }], t: ['U pasu má vrah složený lístek: *„Šimon. Lékárna. Dnes. Knihu spálit. – V.“* Knihu nespálil. Byl línější, než měl být.'], enter: (G, A) => { A.set('lekVrah'); A.gold(12); A.clue('rozkaz', 'Lístek u vraha z lékárny: „Šimon. Lékárna. Dnes. Knihu spálit. – V.“'); }, ch: [{ t: 'Dál', go: 'l_kuba' }] },
    l_vrah_utekl: { bg: 'lekarna', npc: [], t: ['Vrah tě srazí do regálu, lahvičky se roztříští a on zmizí oknem. Zůstane po něm jen pach a tvá krev.'], enter: (G, A) => A.set('lekVrah'), ch: [{ t: 'Dál', go: 'l_kuba' }] },
    l_kuba: { bg: 'lekarna', npc: [{ id: 'lid', x: .72 }], t: [
      'Pod pultem někdo vzlykne. Chlapec, dvanáct let, Šimonův učeň. Kuba.',
      S('lid', 'Byli tu dva. Pán se žlutou tváří a voják s jizvou přes obličej. Voják zaplatil a odnesl lahvičku. To bylo předevčírem. Dneska přišel jen ten s nožem…', 'shock')
    ], enter: (G, A) => A.clue('svedek', 'Učeň Kuba: jed si předevčírem vyzvedli „pán se žlutou tváří“ a „voják s jizvou přes obličej“.'), ch: [
      { t: '„Jdi do hospody U Oběšence. Řekni Jardovi, že tě posílám. A nikomu jinému nic.“', go: 'mesto', ap: { ester: 1, vojta: 1, sarra: 1 }, fx: (G, A) => A.set('kubaZachranen') },
      { t: 'Dát mu pět zlatých a nechat ho jít.', cost: 5, go: 'mesto', fx: (G, A) => A.set('kubaZachranen') },
      { t: '„Jestli o mně někomu řekneš, najdu tě.“', go: 'mesto', ap: { ester: -1, vojta: -2 }, fx: (G, A) => A.inc('temnota') }
    ] },

    /* ---------- Škvára ---------- */
    skvara: { bg: 'skvara', mood: 'fire', npc: [{ id: 'sarra', x: .6 }, { id: 'fanatik', x: .76 }, { id: 'sabina', x: .9 }], enter: (G, A) => step(G, A, 'skvara'), t: [
      'Škvára hoří. Ne celá – zatím. Řád Bledého plamene jde od domu k domu a fanatici v bílých maskách hází pochodně do oken.',
      'Na náměstíčku stojí inkvizitorka Sabina. Kápě bílá jako kost, hlas jako zvon: *„Oheň očistí, co krev pošpinila!“*',
      'Před kovárnou stojí žena s rohy a šupinami, kladivo v ruce. Za ní se krčí dvě dračí děti. Sarra Popelavá. Kovářka. Nevypadá, že by se chystala ustoupit.',
      S('sarra', 'Pojďte si pro ně. Jeden po druhém nebo všichni najednou. Kladivu je to jedno.', 'angry'),
      S('sabina', 'Tvá krev je hřích, ženo. Já ti nabízím milost ohně.', 'n')
    ], ch: (G, A) => [
      { t: 'Postavit se vedle Sarry.', tag: 'Boj', go: 's_boj', fx: (G2, A2) => { A2.join('sarra'); A2.ap('sarra', 2); } },
      { t: '„Jsem dědic Vranova. Ve jménu krále – stůjte!“', chk: { s: 'cha', dc: A.has('radimPustil') ? 12 : 14, ok: 's_zastaveno', no: 's_vysmech' } },
      { t: '[Dračí krev] Vystoupit a ukázat své rohy. „Mě upalte první.“', if: () => A.race('drak'), chk: { s: 'cha', dc: 11, ok: 's_zastaveno', no: 's_vysmech' } },
      { t: 'Ustoupit do stínu. Tohle není tvůj boj.', go: 's_ustup' },
      { t: '[Zrada] Prozradit Sabině, kde se schovávají další uprchlíci – za propustku z města.', go: 's_zrada' }
    ] },
    s_vysmech: { bg: 'skvara', npc: [{ id: 'sarra', x: .6 }, { id: 'fanatik', x: .76 }, { id: 'sabina', x: .9 }], t: [S('sabina', 'Dědic? Dědic sedí ve věži, kde patří. Ty jsi jen další špína v ulici. Bratři!', 'angry')], ch: [{ t: 'Tak tedy boj. Ke Sarře!', tag: 'Boj', go: 's_boj', fx: (G, A) => { A.join('sarra'); } }, { t: 'Utéct.', go: 's_ustup' }] },
    s_boj: { bg: 'skvara', mood: 'fight', fight: { foes: ['fanatik', 'fanatik', 'fanatik'], intro: 'Sarra se s řevem vrhne vpřed. Kladivo zazvoní o první masku.', win: 's_vyhra', lose: 's_prohra' } },
    s_prohra: { bg: 'skvara', npc: [{ id: 'sabina', x: .85 }], t: ['Probereš se v popelu. Sarra je pryč – odvlekli ji v řetězech. Děti taky. Sabina nad tebou stojí a dívá se, jako by počítala.', S('sabina', 'Ty nejsi špína. Ty jsi [[zajímavý|zajímavá]]. Uvidíme se na náměstí, až bude popravčí den.', 'n')], enter: (G, A) => { A.leave('sarra', 'byla zajata'); A.set('sarraZajata'); G.f.skvara = 'spalena'; A.set('sabinaZna'); }, ch: [{ t: 'Zvednout se a jít.', go: 'mesto' }] },
    s_vyhra: { bg: 'skvara', npc: [{ id: 'sarra', x: .66 }, { id: 'drakolid', x: .86 }], t: [
      'Poslední fanatik prchá s hořící kápí. Sabina se otočí na podpatku a odchází. Ve dveřích chrámové ulice se zastaví.',
      S('sabina', 'Bledý plamen nezapomíná. A já taky ne.', 'angry'),
      'Z trosek vylézají lidé s rohy, šupinami, popelem ve vlasech. Dívají se na tebe, jako by nevěřili, že takový jako ty může stát na jejich straně.',
      S('sarra', 'Nevím, kdo jsi. Ale dneska tu nikdo nehořel. To se ve Škváře nestalo dvacet let.', 'n')
    ], enter: (G, A) => { G.f.skvara = 'branena'; A.set('drakSpojenec'); A.set('sabinaNepritel'); A.set('tunel'); A.ap('sarra', 2); }, ch: [{ t: 'Dál', go: 's_sarra' }] },
    s_zastaveno: { bg: 'skvara', npc: [{ id: 'sarra', x: .6 }, { id: 'sabina', x: .82 }], t: (G, A) => [
      'Sabina zvedne ruku. Fanatici ztuhnou. Dlouze si tě prohlíží zpod kápě.',
      S('sabina', A.race('drak') ? 'Šupinatý dědic. Takže je to pravda. Bořivoj vychoval hada. Dobrá. Dnes nikdo hořet nebude. Dnes. Napíšu královně.' : 'Dědic, který utekl z věže. Zajímavé. Dobrá. Dnes nikdo hořet nebude. Dnes. Napíšu královně a zeptám se, kdo tu vlastně vládne.', 'n'),
      'Řád odchází. Kouř se pomalu rozplývá. Sarra si utře saze z tváře a podívá se na tebe jinak.'
    ], enter: (G, A) => { G.f.skvara = 'odlozena'; A.set('sabinaZna'); A.set('tunel'); A.set('drakSpojenec'); }, ch: [{ t: 'Dál', go: 's_sarra' }] },
    s_sarra: { bg: 'skvara', npc: [{ id: 'sarra', x: .66 }], t: [
      S('sarra', 'Ke Dračímu hrádku? Za Kýchalem? Ty jsi blázen. Kýchal je pohádka, kterou si u nás vyprávějí děti, aby se méně bály.', 'n'),
      S('sarra', 'Ale… moje babička říkala, že žije. Že hlídá kosti svých dětí. Kdyby byl naživu… Chci ho vidět. Jednou v životě chci vidět něco, co Řád nedokázal zabít.', 'n'),
      S('sarra', 'Pod starou slévárnou vede tunel za hradby. Pašovali jsme tudy uhlí. Teď můžeme pašovat tebe.', 'smirk')
    ], enter: (G, A) => A.note('ven', 'Sarra zná tunel pod slévárnou ve Škváře, který vede za hradby.'), ch: (G, A) => [
      { t: '„Pojď se mnou, Sarro.“', go: 'mesto', fx: (G2, A2) => { A2.join('sarra'); A2.ap('sarra', 1); } , if: () => !A.inParty('sarra') },
      { t: '„Jsem [[rád|ráda]], že jdeš.“', go: 'mesto', if: () => A.inParty('sarra'), fx: (G2, A2) => A2.ap('sarra', 1) },
      { t: '„Zůstaň tu a chraň je. Najdu tě, až budu potřebovat tunel.“', go: 'mesto', if: () => !A.inParty('sarra') }
    ] },
    s_ustup: { bg: 'skvara', npc: [{ id: 'fanatik', x: .7 }, { id: 'sabina', x: .9 }], t: ['Couváš do stínu. Slyšíš, jak kladivo zvoní o masky, pak řetězy, pak křik dětí. Pak jen praskání ohně.', 'Když se ohlédneš, Sarru vlečou k chrámu. Ještě se dívá zpátky. Ne na tebe – na děti.', S('plachta', 'Hele… tohle bylo rozumný. Nechci, abys umřel{a}. Ale stejně je mi z toho na blití.', 'sad')], enter: (G, A) => { G.f.skvara = 'spalena'; A.set('sarraZajata'); A.leave('sarra', 'byla zajata'); A.inc('temnota'); A.ap('ester', -2); }, ch: [{ t: 'Odejít.', go: 'mesto' }] },
    s_zrada: { bg: 'skvara', npc: [{ id: 'sabina', x: .8 }], t: ['Šeptneš Sabině o sklepě pod pekárnou. Kápě se k tobě skloní. Pod ní je tvář zjizvená ohněm a oči, které se poprvé usmějí.', S('sabina', 'Tady je propustka, dítě. A tady plášť Řádu. Budeš ho potřebovat. Bledý plamen odměňuje věrné.', 'smile'), 'O hodinu později hoří pekárna. Nikdo z ní nevyjde. Sarru odvlečou v řetězech. Než zmizí, plivne ti pod nohy.'], enter: (G, A) => { G.f.skvara = 'zrada'; A.set('sarraZajata'); A.leave('sarra', 'tě proklíná'); A.ap('sarra', -10, true); A.set('propustkaRad'); A.give('plast'); A.inc('temnota', 3); A.ap('ester', -4); A.ap('plachta', -2); A.set('radPritel'); }, ch: [{ t: 'Odejít s pláštěm přes ruku.', go: 'mesto' }] },
    skvara_pozde: { bg: 'skvara', mood: 'sad', npc: [{ id: 'drakolid', x: .78 }], enter: (G, A) => { step(G, A, 'skvara'); G.f.skvara = 'spalena'; A.set('sarraZajata'); }, t: [
      'Přišel{a} jsi pozdě. Škvára je jen černý zub dýmu. Na zdi visí nápis ŠUPINÁČI DO OHNĚ a pod ním… radši se nedívej.',
      S('drakolid', 'Sarru Popelavou odvlekli do chrámu. Ráno v popravčí den ji pověsí s ostatními. Ty jsi kdo? Další, co se přišel podívat?', 'angry')
    ], ch: [{ t: '„Někdo, kdo to zastaví. Přísahám.“', go: 'mesto', fx: (G, A) => { A.quest('sarra', 'Sarra v řetězech', 'Sarru Popelavou zajal Řád. Bude popravena v popravčí den, pokud ji nezachráním.'); A.set('tunel'); } }, { t: 'Mlčky odejít.', go: 'mesto' }] },
    skvara_po: { bg: 'skvara', npc: (G) => G.f.skvara === 'branena' || G.f.skvara === 'odlozena' ? [{ id: 'drakolid', x: .8 }] : [], t: (G) => [G.f.skvara === 'branena' || G.f.skvara === 'odlozena' ? 'Ve Škváře se uklízí. Lidé s rohy ti kývají na pozdrav. Někdo ti strčí do ruky placku.' : 'Popel. Ticho. Vrány.'], ch: [{ t: 'Zpět.', go: 'mesto' }] },

    /* ---------- chrám ---------- */
    chram: { bg: 'chram', mood: 'dark', npc: [{ id: 'fanatik', x: .78 }, { id: 'fanatik', x: .9 }], enter: (G, A) => step(G, A, 'chram'), t: [
      'Chrám Bledého plamene. Nad oltářem hoří oheň, který nehřeje – bílý, tichý, bez kouře. Říká se, že ho zapálili z kostí prvního zabitého draka.',
      'Novicové zpívají. Kázání je o čistotě krve. Archiv je za oltářem, za těžkými dveřmi.'
    ], ch: (G, A) => [
      { t: 'Poslechnout si kázání.', go: 'c_kazani', if: () => !A.has('kazani') },
      { t: 'Proklouznout do archivu.', chk: { s: 'obr', dc: 13, ok: 'c_archiv', no: 'c_chycen' } },
      { t: '„Jsem novic, poslali mě pro svíce.“', chk: { s: 'cha', dc: 13, ok: 'c_archiv', no: 'c_chycen' } },
      { t: 'Obléknout plášť Řádu a jít rovnou do archivu.', if: () => A.item('plast'), go: 'c_archiv' },
      { t: 'Odejít.', go: 'mesto' }
    ] },
    c_kazani: { bg: 'chram', npc: [{ id: 'sabina', x: .8 }], t: [
      S('sabina', 'Bylo mi sedm, když přiletěli. Hořany, Lhota, polovina Popelova. Viděla jsem matku hořet. Viděla jsem, jak se drak směje.', 'n'),
      S('sabina', 'Neříkejte mi, že dračí krev je jen krev. Já ji nesu na tváři.', 'angry'),
      'Shodí kápi. Polovina její tváře je zjizvená ohněm. Chrám ztichne.'
    ], ch: [
      { t: 'Vnímat ji. Opravdu ji poslouchat.', chk: { s: 'mou', dc: 12, ok: 'c_kazani_ok', no: 'chram' } },
      { t: 'Dost. Zpět.', go: 'chram' }
    ], enter: (G, A) => A.set('kazani') },
    c_kazani_ok: { bg: 'chram', npc: [{ id: 'sabina', x: .8 }], t: ['Za tou zuřivostí je něco jiného. Strach a vina. Mluví o Hořanech, ale Hořany byla vesnice dračího lidu, ne lidí. Ten oheň, který viděla jako dítě… možná nezapálil drak.', 'Sabina věří. Opravdu věří. A kdo věří, toho lze přesvědčit – správným důkazem ve správnou chvíli.'], enter: (G, A) => A.set('sabinaPochopena'), ch: [{ t: 'Dál', go: 'chram' }] },
    c_chycen: { bg: 'chram', npc: [{ id: 'fanatik', x: .7 }, { id: 'fanatik', x: .84 }], t: ['Dva fanatici ti zastoupí cestu. Bílé masky, pochodně.', S('fanatik', 'Kacíř v domě světla. Oheň tě očistí.', 'angry')], ch: [{ t: 'Bojovat.', tag: 'Útok', fight: { foes: ['fanatik', 'fanatik'], win: 'c_archiv', lose: 'c_vyhozen', winFx: (G, A) => A.set('hledany') } }, { t: 'Utéct.', chk: { s: 'obr', dc: 11, ok: 'mesto', no: 'c_vyhozen' } }] },
    c_vyhozen: { bg: 'ulice', npc: [], t: ['Vyhodí tě na dlažbu před chrámem s popáleninami na předloktí. Jsi naživu. Řád je dnes milosrdný – nebo líný.'], enter: (G, A) => { A.hurt(3); A.set('chramHotovo'); }, ch: [{ t: 'Dál', go: 'mesto' }] },
    c_archiv: { bg: 'chram', npc: [], t: ['Archiv. Svitky, seznamy, rodokmeny – kdo má jakou krev. Řád si vede účetnictví hříchů pečlivěji než město daně.', 'Na stole inkvizitorky leží čerstvý dopis se žlutou pečetí s hadem. Psaný šifrou.'], enter: (G, A) => { A.give('dopis'); A.set('chramHotovo'); }, ch: [
      { t: 'Pokusit se šifru rozluštit hned.', chk: { s: 'duv', dc: 14, ok: 'c_sifra_ok', no: 'c_sifra_no' } },
      { t: 'Vzít dopis a zmizet.', go: 'mesto' }
    ] },
    c_sifra_ok: { bg: 'chram', npc: [], t: ['Posun písmen podle dne v týdnu. Úřednická šifra. Po chvíli čteš:', '*„Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. – V.“*', 'Dědic zmizí v ohni. To jsi ty.'], enter: (G, A) => A.clue('dopis', 'Dopis kancléře Řádu: „Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. – V.“'), ch: [{ t: 'Zmizet.', go: 'mesto' }] },
    c_sifra_no: { bg: 'chram', npc: [], t: ['Písmena tančí. Někdo chytřejší – nebo s víc času – to rozluští. Strčíš dopis za košili.'], ch: [{ t: 'Zmizet.', go: 'mesto' }] },

    /* ---------- stoky ---------- */
    stoky: { bg: 'stoky', mood: 'dark', npc: [{ id: 'krysak', x: .74 }, { id: 'smudla', x: .86 }, { id: 'krysak', x: .96 }], enter: (G, A) => step(G, A, 'stoky'), t: (G, A) => [
      'Stoky. Voda po kotníky, tma po krk. Z výklenků svítí desítky rudých očiček.',
      'Na trůnu ze sudů sedí krysa velká jako dítě, s plechovou korunkou a monoklem z dna lahve.',
      S('smudla', 'Ale ale. Někdo leze do mýho království bez cla. Šmudla. Krysí král. Kdo platí, ten je host. Kdo neplatí, ten je oběd.', 'smirk'),
      A.inParty('plachta') ? S('plachta', 'Bratranec! Ne, dělám si prdel, nejsme příbuzní. Veverky jsou lepší rasa.', 'n') : null,
      S('smudla', 'Ty jsi ten utečenec z věže, co? Za tvou hlavu nabízí žlutej pán padesát. Já nabízím obchod. Jsem obchodník.', 'smirk')
    ], ch: (G, A) => [
      { t: '„Jaký obchod?“', go: 'st_obchod' },
      { t: '„Žlutý pán? Co o něm víš?“', go: 'st_info', if: () => !A.has('stInfo') },
      { t: 'Vytasit zbraň. „Já jsem tvůj oběd.“', tag: 'Útok', fight: { foes: ['smudla', 'krysak', 'krysak'], win: 'st_vyhra', lose: 'st_prohra' } }
    ] },
    st_info: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: [S('smudla', 'Informace něco stojí. Pět zlatých. Nebo sýr. Máš sýr? Nemáš sýr.', 'n')], ch: [
      { t: 'Zaplatit. (5 zl)', cost: 5, go: 'st_info2' },
      { t: '„Když mi to řekneš, řeknu ti, kde má Trubka schovaný sýr.“', chk: { s: 'cha', dc: 12, ok: 'st_info2', no: 'stoky' } }
    ] },
    st_info2: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: [S('smudla', 'Žlutej pán najímá u mě tichý lidi. Nožíři, škrtiči, jeden travič. Platí zlatem s hadem. Minulý týden chtěl někoho, kdo umí lézt po hradní zdi. Do věže.', 'n'), S('smudla', 'A ještě něco zadarmo, protože mám dobrej den: kapitán Kost s ním nemluví. Nenávidí ho. Jen to ještě neví.', 'smirk')], enter: (G, A) => { A.set('stInfo'); A.clue('najemnici', 'Šmudla: kancléř u Krysího krále najímá vrahy a platí zlatem s hadem. Minulý týden chtěl lezce do věže.'); }, ch: [{ t: 'Dál', go: 'stoky' }] },
    st_obchod: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: [
      S('smudla', 'Mapa stok. Vede pod hradbami ven z města. A pod hradem – až do sklepů Vranova. Taková mapa je cennější než koruna, protože koruna nevede nikam.', 'smirk'),
      S('smudla', 'Cena? Čtyřicet zlatých. Nebo ta tlustá husa, co ji vláčí ten pěvec. Už měsíc o ní sním. Nebo… slib. Až budeš sedět nahoře, krysy dostanou hlas v radě. Krysí právo.', 'n')
    ], ch: [
      { t: 'Zaplatit čtyřicet. (40 zl)', cost: 40, go: 'st_mapa' },
      { t: '„Krysí právo. Máš mé slovo.“', go: 'st_mapa', fx: (G, A) => { A.set('krysiSlib'); A.set('krysySpojenec'); } },
      { t: '„Přinesu ti tu husu.“', if: (G, A) => !A.has('otylieSnedena'), go: 'st_husa' },
      { t: '„Rozmyslím si to.“', go: 'stoky' }
    ] },
    st_husa: { bg: 'hospoda', npc: [{ id: 'trubka', x: .7 }, { id: 'otylie', x: .78 }], t: ['Vrátíš se do hospody. Trubka zrovna spí s hlavou na stole. Otýlie ne. Dívá se na tebe. Ví to.'], ch: [
      { t: 'Popadnout husu.', chk: { s: 'obr', dc: 12, ok: 'st_husa_ok', no: 'st_husa_no' } },
      { t: 'Ne. Tohle ne. Ani já nejsem [[takový|taková]].', go: 'stoky' }
    ] },
    st_husa_no: { bg: 'hospoda', npc: [{ id: 'trubka', x: .7 }, { id: 'otylie', x: .78 }], t: [{ t: 'Otýlie tě kousne do nosu, do ucha a do důstojnosti. Trubka se probudí, uvidí tě s rukama kolem své „choti“ a začne ječet o vrahovi hraběnek.', shake: 8, snd: 'husa' }], enter: (G, A) => A.hurt(2), ch: [{ t: 'Utéct.', go: 'mesto' }] },
    st_husa_ok: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: ['Šmudla si olízne vousy. Otýlie syčí až do konce. Nebudeme to popisovat.', S('smudla', 'Obchodník jako ty… z tebe bude dobrej král. Tady je mapa.', 'smile'), S('plachta', 'Tohle Trubkovi nikdy neříkej. Nikdy. Já taky ne.', 'sad')], enter: (G, A) => { A.set('otylieSnedena'); A.inc('temnota'); A.ap('ester', -1); A.give('mapa'); A.set('stokyHotovo'); A.set('krysySpojenec'); }, ch: [{ t: 'Zpět do ulic.', go: 'mesto' }] },
    st_mapa: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: [S('smudla', 'Obchod je obchod. Tady máš. Červená čára ven, modrá pod hrad. Černá… tam nechoď. Tam bydlí něco, co žere krysy.', 'n')], enter: (G, A) => { A.give('mapa'); A.set('stokyHotovo'); A.note('ven', 'Mám mapu stok od Šmudly. Vede ven z města i pod hrad.'); A.done('krysy'); }, ch: [{ t: 'Zpět do ulic.', go: 'mesto' }] },
    st_vyhra: { bg: 'stoky', npc: [{ id: 'smudla', pose: 'dead', x: .86 }], t: ['Krysí král leží ve vodě a korunka mu sklouzla na oko. Zbytek krys zmizel. Na sudu leží mapa stok – a hromádka zlatých s hadí ražbou.'], enter: (G, A) => { A.give('mapa'); A.gold(20); A.set('stokyHotovo'); A.set('smudlaMrtvy'); A.done('krysy'); A.clue('najemnici', 'U Krysího krále jsem našel{a} hromádku zlatých s hadí ražbou – kancléř ho platil.'); }, ch: [{ t: 'Zpět do ulic.', go: 'mesto' }] },
    st_prohra: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: ['Probudíš se na hromadě odpadků bez měšce. Šmudla ti mávne monoklem.', S('smudla', 'Dneska máš štěstí. Mrtví neplatí. Vrať se, až budeš mít peníze nebo rozum.', 'smirk')], enter: (G, A) => { G.gold = 0; }, ch: [{ t: 'Vylézt nahoru.', go: 'mesto' }] },

    /* ---------- Radim v uličce ---------- */
    radim_ulice: { bg: 'ulice', mood: 'rain', npc: (G, A) => A.has('radimPustil') ? [{ id: 'radim', x: .72 }] : [{ id: 'straz', x: .62 }, { id: 'radim', x: .74 }, { id: 'straz', x: .86 }], enter: (G, A) => A.set('radimPotkan'), t: (G, A) => [
      'V úzké uličce ti cestu zastoupí postava v plášti. Jizva. Rezavé oči.',
      A.has('radimPustil') ? S('radim', 'Řekl jsem důkaz, Výsosti. Ne výlet po hospodách. Co máte?', 'n') : S('radim', 'Konec procházky, Výsosti. Půjdete se mnou. Po dobrém, nebo po mém.', 'angry'),
      A.hasClue('kniha') || A.hasClue('svedek') ? 'Vzpomeneš si na Šimonovu knihu. *R. K.* A na Kubova slova: *voják s jizvou zaplatil.*' : null
    ], ch: (G, A) => [
      { t: `Ukázat mu, co víš. (důkazů: ${A.clues()})`, if: () => A.clues() >= 2, chk: { s: 'cha', dc: Math.max(8, 15 - A.clues()), ok: 'r_spojenec', no: 'r_nevěří' } },
      { t: '„R. K. Radim Kost. Vy jste si vyzvedl ten jed, kapitáne.“', if: () => A.hasClue('kniha') || A.hasClue('svedek'), go: 'r_konfrontace' },
      { t: '„Věřte mi. Bez důkazů. Jen mi věřte.“', chk: { s: 'cha', dc: 16, ok: 'r_spojenec', no: 'r_nevěří' } },
      { t: 'Vyzvat ho na souboj. [[Sám|Sama]] proti němu.', tag: 'Boj', go: 'r_duel' },
      { t: 'Utéct mezi střechami.', chk: { s: 'obr', dc: 13, ok: 'r_utek', no: 'r_nevěří' } }
    ] },
    r_konfrontace: { bg: 'ulice', npc: [{ id: 'radim', x: .72 }], t: [
      'Radim zbledne. Opravdu zbledne – jizva na tváři mu zčervená jako čerstvá.',
      S('radim', 'Vyzvedl jsem… lék. Kancléř mi dal lístek. „Pro krále, na spaní.“ Donesl jsem to do kuchyně. Já…', 'shock'),
      S('radim', 'Já jsem mu ten jed donesl. Vlastníma rukama.', 'sad')
    ], enter: (G, A) => A.clue('radim', 'Radim Kost jed nevědomky vyzvedl a donesl do kuchyně – kancléř mu tvrdil, že je to lék na spaní.'), ch: [
      { t: '„Pak mi pomozte to napravit.“', go: 'r_spojenec' },
      { t: '„Vrah je vrah, kapitáne.“', go: 'r_duel', fx: (G, A) => A.ap('radim', -2, true) }
    ] },
    r_nevěří: { bg: 'ulice', npc: [{ id: 'radim', x: .72 }], t: [S('radim', 'Pohádky. Pojďte se mnou, nebo vás přinesu.', 'angry')], ch: [{ t: 'Tak tedy souboj.', tag: 'Boj', go: 'r_duel' }, { t: 'Vzdát se.', go: 'r_cela' }] },
    r_duel: { bg: 'ulice', mood: 'fight', fight: { foes: [{ id: 'radim', boss: true }], noAllies: ['plachta'], intro: 'Radim kývne na své muže, ať ustoupí. Tohle je mezi vámi dvěma.', win: 'r_duel_vyhra', lose: 'r_cela' } },
    r_duel_vyhra: { bg: 'ulice', npc: [{ id: 'radim', x: .72, pose: 'kneel' }], t: ['Radim klečí v kaluži. Meč má o tři kroky dál. Krev z obočí mu stéká do očí.', S('radim', 'Tak dělejte. Za kapitána stráže vám dají titul. Za mrtvého kapitána dva.', 'angry')], ch: [
      { t: 'Podat mu ruku. „Nechci vaši smrt. Chci vaši pomoc.“', go: 'r_spojenec', fx: (G, A) => A.ap('radim', 2, true) },
      { t: 'Nechat ho klečet a odejít.', go: 'mesto', fx: (G, A) => A.set('radimLovi') },
      { t: 'Dorazit ho.', tag: 'Zabít', go: 'r_zabit' }
    ] },
    r_zabit: { bg: 'ulice', npc: [{ id: 'radim', x: .72, pose: 'dead' }], t: ['Čepel projde snadněji, než čekáš. Radim se na tebe dívá až do konce. Nevypadá rozzlobeně. Vypadá… ulehčeně.', S('plachta', 'Ty vole.', 'sad')], enter: (G, A) => { G.f.radim = 'mrtvy'; A.inc('temnota', 2); A.ap('vojta', -2, true); A.ap('ester', -1); A.set('hledany'); }, ch: [{ t: 'Odejít v dešti.', go: 'mesto' }] },
    r_utek: { bg: 'hradby', npc: [], t: ['Okap, štít, komín. Radim tě pronásleduje dvě ulice, pak zůstane stát na hřebeni střechy a dívá se, jak mizíš.'], enter: (G, A) => A.set('radimLovi'), ch: [{ t: 'Dál', go: 'mesto' }] },
    r_cela: { bg: 'vez', npc: [], t: ['Kobka pod hradem. Řetěz, kýbl, krysy. Radim zamkne a beze slova odejde.', S('plachta', 'Klid. Tohle už jsme dělali. Strážný usnul a klíče mu visí z opasku. Já mám malý ruce. A velký ambice.', 'smirk'), 'O hodinu později jsi venku. Plachtička škytá – strážnému ukradla i flašku.'], enter: (G, A) => { A.set('radimLovi'); A.set('hledany'); A.ap('plachta', 2); }, ch: [{ t: 'Zpět do ulic.', go: 'mesto' }] },
    r_spojenec: { bg: 'ulice', npc: [{ id: 'radim', x: .72 }], t: (G, A) => [
      'Radim dlouho mlčí. Déšť mu stéká po jizvě.',
      S('radim', 'Dvacet let sloužím. Viděl jsem věšet nevinné, protože to bylo v rozkazu. Myslel jsem, že tohle drží království pohromadě.', 'n'),
      S('radim', 'Když král zemře, kancléř sežere korunu i se zemí. Půjdu s vámi pro tu slzu, Výsosti. A pak se spolu vrátíme a zeptáme se kancléře, kdo podepsal ten lístek.', 'n')
    ], enter: (G, A) => { G.f.radim = 'spojenec'; A.join('radim'); A.ap('radim', 2, true); A.set('radimPropustka'); A.note('ven', 'Radim nás vyvede branou na své slovo.'); }, ch: [{ t: 'Dál', go: 'mesto' }] },

    /* ---------- brána ---------- */
    brana: { bg: 'brana', mood: 'tense', npc: [{ id: 'straz', x: .66 }, { id: 'straz', x: .8 }, { id: 'straz', x: .92 }], t: (G, A) => [
      'Městská brána. Úsvit barví nebe do barvy starého pergamenu. V klecích nad bránou se kývají vrány a to, co po sobě nechaly.',
      'Stráže kontrolují každého, kdo chce ven. Většinu vracejí.',
      A.has('hledany') ? S('straz', 'Hele, támhleten vypadá jako ten z vyhlášky…', 'n') : null
    ], ch: (G, A) => [
      { t: 'Ukázat Trubkovu propustku.', if: () => A.has('propustka'), chk: { s: 'cha', dc: A.has('hledany') ? 14 : 10, ok: 'odchod', no: 'b_boj' } },
      { t: 'Ukázat propustku Řádu.', if: () => A.has('propustkaRad'), go: 'odchod' },
      { t: 'Nechat mluvit Radima.', if: () => A.inParty('radim'), go: 'odchod' },
      { t: 'Tunel pod slévárnou ve Škváře.', if: () => A.has('tunel') && G.f.skvara !== 'zrada', go: 'odchod' },
      { t: 'Podzemím podle Šmudlovy mapy.', if: () => A.item('mapa'), go: 'odchod' },
      { t: 'Podplatit desátníka. (30 zl)', cost: 30, go: 'odchod' },
      { t: 'Probít se ven.', tag: 'Útok', go: 'b_boj' },
      { t: 'Ještě ne. Zpět do města.', go: 'mesto' }
    ] },
    b_boj: { bg: 'brana', mood: 'fight', fight: { foes: ['straz', 'straz', 'straz'], intro: 'Desátník zařve a zvoní na poplach.', win: 'odchod', lose: 'b_prohra', winFx: (G, A) => A.set('hledany') } },
    b_prohra: { bg: 'brana', npc: [{ id: 'straz', x: .7 }], t: ['Srazí tě do bláta a seberou ti měšec. Pak se ti vysmějí a hodí tě zpátky do města. Kdyby věděli, kdo jsi, nesmáli by se.'], enter: (G, A) => { G.gold = Math.floor(G.gold / 2); }, ch: [{ t: 'Zpět.', go: 'mesto' }] },
    odchod: { bg: 'cesta', mood: 'wind', npc: [], cp: 1, enter: (G, A) => {
        if (!A.has('byl_skvara')) { G.f.skvara = 'spalena'; A.set('sarraZajata'); A.set('skvaraNevi'); }
        A.done('ven');
      }, t: (G, A) => [
        'Popelov zůstává za zády. Kouř nad ním vypadá z dálky skoro krásně.',
        A.has('skvaraNevi') ? 'Na cestě potkáš vůz se zajatci s rohy a šupinami. Vozka se směje: *„Škvára vyhořela. V popravčí den bude na náměstí veselo.“*' : null,
        S('plachta', 'Tráva! Stromy! Já tu umřu štěstím. Nebo na klíšťata.', 'smile'),
        'Šest dní do králova skonu. Cesta do Lhoty trvá den, když se nikdo nepokusí tě zabít. Někdo se pokusí.'
      ], ch: [{ t: 'Na cestu.', go: 'akt2' }] }
  });
})(window.T);
