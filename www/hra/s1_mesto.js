/* Koruna z popela – Dějství I: Popelov. Hospoda, lékárna, Škvára, chrám, stoky, brána, Radim. */
(function (T) {
  'use strict';
  const S = (w, t, m) => ({ w, t, m });
  const step = (G, A, k) => { if (!A.has('byl_' + k)) { A.set('byl_' + k); A.inc('kroky'); } };
  const purgeAt = A => A.has('cistkaOdklad') ? 4 : 3;
  Object.assign(T.N, {
    p_mesto_prichod: { act: 'Dějství I · Popelov', bg: 'ulice', mood: 'rain', cp: 1, lore: ['popelov', 'trpaslici'], t: (G, A) => [
      'Popelov. Úředně Žárov, ale tak mu neřekne nikdo, kdo nedostává plat od kancléře. Město, které vyrostlo z popela Dračí války a nikdy se ho úplně nezbavilo: popel je v maltě jeho zdí, v bahně jeho ulic a, jak tvrdí místní, i v jeho pivu.',
      'Uličky se tu kroutí jako střeva a jsou zhruba stejně čisté. Z oken visí prádlo, v průjezdech postávají lidé, kteří vypadají, že na něco čekají, a není dobré se ptát na co. Nad krámy se houpou cechovní štíty: zvon trpasličích zvonařů, kladivo banky U Kladiva, perník, rakev, šibenice.',
      'Na konci ulice, proti bledému nebi, stojí skutečná šibenice. Je prázdná. Zatím. Na jejím trámu sedí havran a s profesionálním zájmem si tě prohlíží.',
      S('plachta', 'Tak. Svět. Všechno, o čem jsi dvacet let snil{a}. Smrdí to tu jako moje nora po zimě, jen tady k tomu ještě zpívají.', 'n'),
      'Kvůli králově nemoci jsou městské brány zavřené. Kdo chce ven, potřebuje propustku, známosti, nebo víc odvahy, než je zdrávo. Ty ven potřebuješ: Dračí hrádek je dva dny cesty za Lhotou a král má sedm dní. Ale vrah tvého otce je tady, v těch křivých ulicích. A dokud žije, nebude bezpečný ani král, ani ty.'
    ], enter: (G, A) => { A.quest('ven', 'Ven z Popelova', 'Brány jsou zavřené. Najdi způsob, jak se dostat z města: propustka, známosti, podzemí, nebo silou.'); }, ch: [{ t: 'Rozhlédnout se.', go: 'mesto' }] },

    mesto: { bg: 'ulice', mood: 'rain', redirect: (G, A) => {
        if ((G.f.kroky || 0) >= 2 && !A.has('radimPotkan')) return 'radim_ulice';
        return null;
      }, t: (G, A) => [
        (G.f.kroky || 0) === 0 ? 'Kam teď? Déšť tě žene pod okapy a okapy tě ženou zpátky do deště. Popelov je město, které má na všechno dva názory a oba jsou mokré.'
          : (G.f.kroky >= purgeAt(A) && !A.has('byl_skvara') ? 'Nad východní částí města, nad Škvárou, stoupá k nebi sloup černého dýmu. Někde v dálce zvoní umíráček. Lidé na ulici se nedívají tím směrem. V Popelově se lidé umějí nedívat velmi dobře.' : 'Popelov hučí jako úl, do kterého někdo kopl. Na rozích visí čerstvé vyhlášky a lidé je čtou nahlas těm, kdo číst neumějí, a přidávají k nim, co si myslí, že tam mělo stát.')
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
      G.seen.hospoda > 1 ? 'U Oběšence je pořád stejně: kouř, pivo, falešný zpěv a podlaha, která se lepí k podrážkám jako dávný dluh.' : 'Nad dveřmi se ve větru houpe skutečná oprátka, protože hostinský má za to, že lidé ocení poctivost. Uvnitř je teplo, smrad z loje a mokrých kabátů a zpěv tak falešný, že by si ho člověk mohl splést s modlitbou.',
      G.seen.hospoda > 1 ? null : 'Za pultem stojí hostinský Kulhavý Jarda, chlap jako sud, a leští půllitr hadrem, který zažil lepší časy. Nebo taky ne. Někteří hadři se už narodí špinaví.',
      !A.has('esterPotkana') ? 'V rohu dva strážní tisknou ke zdi mladou ženu v zablácené kazajce. Na stole mezi nimi leží mrtvá srna s šípem v plecích. Žena se nebojí. Vypadá spíš, že si v duchu vybírá, kterému z nich vydloubne oko jako prvnímu, a nemůže se rozhodnout.' : null,
      G.seen.hospoda > 1 ? null : 'U krbu sedí muž s loutnou, obrovským kloboukem a výrazem nedoceněného génia a zpívá baladu o králi, který kýchal tak silně, že mu uletěla koruna. U jeho nohou sedí husa s malinkou zlatou korunkou na hlavě a syčí do rytmu.'
    ], ch: (G, A) => [
      { t: 'Vložit se do toho se strážemi.', if: () => !A.has('esterPotkana'), go: 'h_ester' },
      { t: 'Přisednout k pěvci s husou.', go: 'h_trubka' },
      { t: 'Promluvit s hostinským.', go: 'h_jarda' },
      { t: 'Zpátky do ulic.', go: 'mesto' }
    ] },
    h_ester: { bg: 'hospoda', npc: [{ id: 'straz', x: .9 }, { id: 'ester', x: .78 }, { id: 'straz', x: .66 }], t: [
      S('straz', 'Pytlačka z Lhoty, chlapi. Králova srna, králův les, králova šibenice. To je ta královská spravedlnost, holka. Leda by ses s náma domluvila nějak jinak, že jo.', 'smirk'),
      S('ester', 'Tvoje máma se s celou posádkou domluvila jinak, kamaráde. Na ni si to zkus. Ta už je zvyklá.', 'angry'),
      'Strážný zrudne a sáhne po opasku. Celá hospoda zpozorní tím zvláštním tichým způsobem, jakým hospody zpozorní, když se blíží něco zajímavějšího než pivo.'
    ], ch: [
      { t: '„Ta srna je moje. Poslal{a} jsem ji pro ni. Máte s tím snad problém?“', chk: { s: 'cha', dc: 12, ok: 'h_ester_ok', no: 'h_ester_boj' } },
      { t: 'Zlomit prvnímu z nich prst. Pomalu.', chk: { s: 'sil', dc: 13, ok: 'h_ester_ok', no: 'h_ester_boj' } },
      { t: 'Hodit jim pět zlatých. „Na pivo. Někde daleko odsud.“', cost: 5, go: 'h_ester_ok' },
      { t: 'Bez řečí vytáhnout zbraň.', tag: 'Útok', go: 'h_ester_boj' },
      { t: 'Nemíchat se do toho.', go: 'h_ester_ne' }
    ] },
    h_ester_boj: { bg: 'hospoda', npc: [{ id: 'ester', x: .78 }], fight: { foes: ['straz', 'straz'], intro: 'Ester popadne ze stolu korbel a rozbije ho o hlavu bližšímu strážnému. Hospoda vybuchne jásotem. U Oběšence se rvačky považují za kulturní program.', win: 'h_ester_ok', lose: 'h_ester_prohra', winFx: (G, A) => A.set('esterBoj') } },
    h_ester_prohra: { bg: 'hospoda', npc: [{ id: 'ester', x: .78 }, { id: 'hostinsky', x: .9 }], t: ['Ležíš na lepkavé podlaze a strop se nad tebou pomalu otáčí. Nad tebou stojí Jarda s dubovou palicí a oba strážní jsou venku. I se zuby, které jim tam Jarda laskavě vyprovodil. Ester ti podá ruku.', S('ester', 'Bojuješ jako panstvo. Odvážně, nahlas a blbě. Ale bojuješ. To je víc, než dělá většina lidí v týhle díře.', 'smirk')], ch: [{ t: 'Vstát.', go: 'h_ester_ok' }] },
    h_ester_ne: { bg: 'hospoda', npc: [{ id: 'hostinsky', x: .82 }, { id: 'trubka', x: .62 }, { id: 'otylie', x: .7 }], t: ['Strážní ji vyvlečou ven do deště. Nebrání se, protože ví, že by to nemělo smysl. Na prahu se ale ohlédne a podívá se přímo na tebe. Ne prosebně. Jen si tě zapamatuje. Ten pohled si zapamatuješ taky.'], enter: (G, A) => { A.set('esterPotkana'); A.set('esterZajata'); A.ap('ester', -3, true); }, ch: [{ t: 'Dál', go: 'hospoda' }] },
    h_ester_ok: { bg: 'hospoda', npc: [{ id: 'ester', x: .72 }], enter: (G, A) => { A.set('esterPotkana'); A.ap('ester', 2, true); }, t: (G, A) => [
      A.has('esterBoj') ? 'Strážní se odpotácí do deště a slibují pomstu tak, jak ji slibují lidé, kteří vědí, že na ni zapomenou, až vystřízliví. Ester si otře krev z kloubů o kalhoty a změří si tě od hlavy k patě.' : 'Strážní si odplivnou, seberou srnu, protože některé věci jsou silnější než strach, a odejdou. Ester si tě změří od hlavy k patě.',
      S('ester', 'Ester. Z Lhoty. A nečekej, že ti padnu k nohám jenom proto, že máš čistý nehty a mluvíš jako z knížky.', 'smirk'),
      S('ester', 'U nás doma nám kancléřovi výběrčí a bratři Řádu berou poslední zrno. Dračí daň, tak tomu říkají. Ve Lhotě v životě nikdo draka neviděl, ale daň za ně platíme rok co rok. Táta je dlužnej až po krk a biřic už si prohlíží náš statek, jako by mu patřil.', 'n'),
      S('ester', 'Tu srnu jsem chtěla prodat, abych splatila aspoň úrok. Teď nemám nic. Teda, mám tebe. Nevím ještě, jestli je to lepší.', 'n')
    ], ch: [
      { t: '„Potřebuju se dostat za Lhotu, k Dračímu hrádku. Pojď se mnou.“', go: 'h_ester_join' },
      { t: '„Tady máš deset zlatých. Pro tátu.“', cost: 10, go: 'h_ester_join', fx: (G, A) => A.ap('ester', 2, true) },
      { t: '„Hodně štěstí, Ester.“', go: 'hospoda' }
    ] },
    h_ester_join: { bg: 'hospoda', npc: [{ id: 'ester', x: .72 }], t: [
      S('ester', 'K Dračímu hrádku? Tam chodí jenom blázni a mrtví. A ty vypadáš jako obojí.', 'smirk'),
      S('ester', 'Ale fajn. Znám stezky lesem, kde nejsou stráže, a znám brody, kde se člověk neutopí, když ví, kam šlápnout. Za to mi ve Lhotě pomůžeš s výběrčím a s Řádem. Dohoda?', 'n')
    ], enter: (G, A) => { A.join('ester'); A.quest('lhota', 'Esteřin domov', 'Ester mi ukáže cestu přes Lhotu. Slíbil{a} jsem jí pomoct s výběrčím a s Řádem.'); }, ch: [{ t: 'Plivnout si do dlaně a podat jí ji.', go: 'hospoda', fx: (G, A) => A.ap('ester', 1) }, { t: '„Dohoda.“', go: 'hospoda' }] },

    h_trubka: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], lore: 'trubka', t: (G, A) => [
      G.seen.h_trubka > 1 ? S('trubka', 'Ach, můj mecenáš se vrací! Otýlie, drahá, ukloň se. Otýlie! Nekousej. Mecenáše se nekoušou, dokud nezaplatí.', 'smile') : S('trubka', 'Bohuslav Trubka, k vašim službám. Básník, pěvec, kaligraf, příležitostný padělatel a vdovec za živa. A tohle je má choť, hraběnka Otýlie z Hrbu.', 'smile'),
      G.seen.h_trubka > 1 ? null : S('trubka', 'Ano, je to husa. Prokletí. Ve dne husa, v noci… taky husa. Vědma z Černého lesa nedělá nic napůl. Ale má duše, má duše je pořád hraběnka. Většinou. Když nemá hlad.', 'smile'),
      { w: 'otylie', t: 'Ssssssss.', snd: 'husa' },
      S('plachta', 'Kdyby mě někdo takhle představil, taky bych syčela. Ale musím uznat, že ta korunka jí sluší. Ptám se, kde se dá taková koupit. Pro známou.', 'n')
    ], ch: (G, A) => [
      { t: 'Koupit mu pivo a poslechnout si drby. (2 zl)', cost: 2, go: 'h_trubka_drby', if: () => !A.has('tipSimon') },
      { t: '„Prý umíš krásně psát. Umíš i úřední pečeti?“', go: 'h_trubka_propustka', if: () => !A.has('propustka') },
      { t: '[Bard] Vyzvat ho na pěvecký souboj o propustku.', if: () => A.cls('bard') && !A.has('propustka'), chk: { s: 'cha', dc: 12, ok: 'h_trubka_duel_ok', no: 'h_trubka_duel_no' } },
      { t: 'Ukázat mu zašifrovaný dopis.', if: () => A.item('dopis') && !A.hasClue('dopis'), go: 'h_trubka_sifra' },
      { t: '„Jak se z hraběnky stane husa?“', go: 'h_otylie_pribeh', once: true },
      { t: 'Pohladit husu.', go: 'h_otylie', once: true },
      { t: 'Odejít.', go: 'hospoda' }
    ] },
    h_otylie_pribeh: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [
      S('trubka', 'Ach, to je příběh hodný eposu ve dvanácti zpěvech, z nichž jsem zatím dokončil tři. Zkrátka: hraběnka Otýlie hrála před lety v Černém lese karty s Vědmou. O vysokou sázku. Vyhrála. Třikrát po sobě, a pokaždé esem srdcovým.', 'smile'),
      S('trubka', 'Vědma tvrdí, že v balíčku je jen jedno eso srdcové. Otýlie tvrdí, že balíček byl starý a eso se v něm rozmnožilo. Vědma ten argument nepřijala.', 'n'),
      { w: 'otylie', t: 'SSSSSSSS.', snd: 'husa' },
      S('trubka', 'A já? Já jsem ji potkal o dva roky později na hrbském rybníce. Plavala tam s takovou… důstojností. S takovou zlostí. Řekl jsem si: Bohuslave, tohle je žena, která nikdy nebude nudná. A měl jsem pravdu.', 'smile'),
      'Plachtička k tobě nakloní hlavu a zašeptá: *„Dobrá. Je to buď nejkrásnější, nebo nejpodivnější milostný příběh, jaký jsem kdy slyšela. Ještě se nerozhodla, který.“*'
    ], ch: [{ t: 'Dál', go: 'h_trubka' }] },
    h_otylie: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [{ t: 'Otýlie ti bleskově klovne do kloubů. Krev. Na tak malou husu překvapivě mnoho krve, a na tak malou ránu překvapivě mnoho bolesti.', shake: 6, snd: 'husa' }, S('trubka', 'Ona tě má ráda! Kdyby tě neměla ráda, šla by po očích. Po očích jde jen po lidech, které si opravdu váží. A po výběrčích.', 'smile')], enter: (G, A) => A.hurt(1), ch: [{ t: 'Dál', go: 'h_trubka' }] },
    h_trubka_drby: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [
      'Trubka se napije, otře si pěnu z kníru a nakloní se k tobě s výrazem muže, který prodává tajemství a ví, že je prodává pod cenou.',
      S('trubka', 'Drby, drby. Tak tedy: Černou rosu, ten jed, o kterém se ve městě šeptá, v Popelově prodává jen jediný člověk. Lékárník Šimon, U Zlatého hada. Prodává ji krysařům, prý. Ale krysy v Popelově mají monarchii a dobré vztahy se sousedy, takže nevím, komu ji vlastně prodává.', 'n'),
      S('trubka', 'A předevčírem večer, když jsem šel kolem s Otýlií na procházku, vcházel do lékárny pán se žlutou tváří. Žlutou jako sýr, jako starý pergamen, jako svědomí úředníka. A kdo v Popelově má žlutou tvář, hm?', 'smirk'),
      S('trubka', 'A pak, že básníci nic nevidí. Básníci vidí všechno. Jen to potom musí rýmovat, a tím to trochu ztrácí na důvěryhodnosti.', 'smile')
    ], enter: (G, A) => { A.set('tipSimon'); A.note('vrah', 'Trubka: Černou rosu prodává jen lékárník Šimon. Předevčírem k němu chodil muž se žlutou tváří.'); }, ch: [{ t: 'Dál', go: 'h_trubka' }] },
    h_trubka_propustka: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [S('trubka', 'Propustku z města? S pečetí městské rady a podpisem purkmistra, který si sám svůj podpis nepamatuje? To je zločin, za který se věší, mladý přítelečku. Dvacet zlatých. Za dvacet zlatých se věší s úsměvem.', 'smirk')], ch: [
      { t: 'Zaplatit. (20 zl)', cost: 20, go: 'h_trubka_ma', fx: (G, A) => A.set('propustka') },
      { t: 'Smlouvat.', chk: { s: 'cha', dc: 13, ok: 'h_trubka_sleva', no: 'h_trubka' } },
      { t: 'Pohrozit, že prozradíš, že je padělatel.', chk: { s: 'sil', dc: 12, ok: 'h_trubka_ma', no: 'h_trubka', okFx: (G, A) => { A.set('propustka'); A.ap('ester', -1); } } },
      { t: 'Jindy.', go: 'h_trubka' }
    ] },
    h_trubka_sleva: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [S('trubka', 'Deset. Ale složíš o mně baladu, až budeš [[slavný|slavná]]. Nemusí být dlouhá. Stačí dvanáct slok. A rým na „Trubka“ je „skrumáž“, kdybys hledal{a}. Není to rým, ale lidé to nepoznají.', 'smile')], ch: [{ t: 'Zaplatit deset.', cost: 10, go: 'h_trubka_ma', fx: (G, A) => A.set('propustka') }, { t: 'Jindy.', go: 'h_trubka' }] },
    h_trubka_duel_ok: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: ['Tvoje píseň o žlutém kancléři, který si spletl jed s medem a pak se divil, proč mu včely nosí věnce, rozesměje celou hospodu. Jarda pláče smíchy do pultu. Dva opilci se objímají. Trubka se ukloní až k zemi a klobouk mu přitom spadne do piva.', S('trubka', 'Poražen! Konečně někým, kdo za to stojí. Propustka je tvoje, zadarmo. A tu píseň mi daruj. Budu ji zpívat jako svou a ty budeš dělat, že nevíš.', 'smile')], enter: (G, A) => { A.set('propustka'); A.gold(6); }, ch: [{ t: 'Dál', go: 'h_trubka_ma' }] },
    h_trubka_duel_no: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: ['Tvoje píseň skončí v tichu. Ne v tom dobrém tichu, kdy lidé zatajují dech, ale v tom druhém, kdy předstírají, že se nic nestalo. Otýlie zasyčí. Trubka tě soucitně poplácá po rameni, jako se plácá kůň, který doběhl poslední.'], ch: [{ t: 'Dál', go: 'h_trubka' }] },
    h_trubka_ma: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: ['Trubka vytáhne z klobouku pergamen, tyčinku pečetního vosku a pečetidlo městské rady, které by podle všech pravidel nemělo existovat. Hrdě ti vysvětlí, že originál je „trochu ohraný“. O deset minut později máš propustku, krásnější a úřednější než pravou.'], enter: (G, A) => A.note('ven', 'Mám padělanou propustku od Trubky.'), ch: [{ t: 'Dál', go: 'h_trubka' }] },
    h_trubka_sifra: { bg: 'hospoda', npc: [{ id: 'trubka', x: .66 }, { id: 'otylie', x: .76 }], t: [S('trubka', 'Kancléřská šifra. Posouvá písmena podle dne v týdnu. Jako by ji vymyslel úředník, který se bojí, že ji zapomene. Což vymyslel.', 'smirk'), 'Pár minut škrábe uhlem po stole a mumlá si. Pak zbledne, a u básníka, který má obličej barvy vína, to něco znamená.', S('trubka', '„Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. – V.“ …Tohle jsem nečetl. Já ani neumím číst. Otýlie taky ne. Otýlie je husa.', 'shock')], enter: (G, A) => A.clue('dopis', 'Dopis kancléře Řádu: „Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. – V.“'), ch: [{ t: 'Dál', go: 'h_trubka' }] },

    h_jarda: { bg: 'hospoda', npc: [{ id: 'hostinsky', x: .74 }], t: (G, A) => [
      S('hostinsky', G.seen.h_jarda > 1 ? 'Ještě něco? Pivo je pořád za groš. Otázky jsou pořád za stříbro. Úsměv nedávám vůbec.' : 'Pokoj za pět, pivo za groš, otázky za stříbro. Na dluh nic, na čest ještě míň. Čest je v Popelově měna, se kterou se nedá zaplatit ani za kýbl.', 'n'),
      A.has('hledany') ? S('hostinsky', 'A mimochodem, kapitán Kost tu byl. Hledá někoho, kdo vypadá dost jako ty. Neboj. Já si obličeje nepamatuju. Za mírný příplatek si je nepamatuju ještě víc.', 'smirk') : null
    ], ch: (G, A) => [
      { t: 'Pronajmout pokoj a vyspat se. (5 zl)', cost: 5, go: 'noc_hospoda' },
      { t: '„Slyšel{a} jsem o Krysím králi. Kudy se k němu dostanu?“ (5 zl)', cost: 5, if: () => !A.has('stokyVstup'), go: 'h_jarda_stoky' },
      { t: 'Koupit léčivý lektvar. (12 zl)', cost: 12, go: 'h_jarda', fx: (G2, A2) => A2.give('lektvar') },
      { t: 'Zpátky.', go: 'hospoda' }
    ] },
    h_jarda_stoky: { bg: 'hospoda', npc: [{ id: 'hostinsky', x: .74 }], t: [S('hostinsky', 'Sklep. Za sudem s kyselým vínem je mříž do stok. Klíč od ní nemá nikdo, protože tam není zámek. Krysy nemají rády zámky. Mají rády zlato a sýr, a zdvořilost, v tomhle pořadí.', 'n'), S('hostinsky', 'A ještě rada zadarmo: Krysímu králi neříkej „krysa“. Je to Jeho Veličenstvo. Ten poslední, kdo mu řekl krysa, teď platí clo za každý krok, a to až do smrti. Jeho smrt se nečekala, ale přišla rychle.', 'n')], enter: (G, A) => { A.set('stokyVstup'); A.quest('krysy', 'Krysí král', 'Pod hospodou vede cesta do stok, kde vládne Krysí král Šmudla. Prý ví o všem, co se v Popelově šustne.'); }, ch: [{ t: 'Dál', go: 'h_jarda' }] },
    noc_hospoda: { bg: 'hospoda', mood: 'warm', npc: (G, A) => A.inParty('ester') ? [{ id: 'ester', x: .7 }] : A.inParty('sarra') ? [{ id: 'sarra', x: .7 }] : [], t: (G, A) => {
        const out = ['Slamník, deka, která pamatuje lepší dny, a svíčka. Poprvé za dvacet let spíš za dveřmi, které se dají otevřít zevnitř. Dlouho se díváš na petlici a nemůžeš usnout, protože ta svoboda je tak hlasitá.'];
        if (A.inParty('ester') && !A.has('esterNoc1')) out.push(S('ester', 'Nemůžu spát. Ve Lhotě v noci slyším sovy a vítr v obilí. Tady slyším, jak se lidi o patro níž hádají, kdo komu dluží a kdo koho zabije.', 'n'), S('ester', 'Proč jsi mi pomohl{a}? Vážně. Lidi jako ty nepomáhaj lidem jako já. Lidi jako ty nás věšej. Slušně, podle zákona, s kněžským požehnáním.', 'n'));
        else if (A.inParty('sarra') && !A.has('sarraNoc1')) out.push(S('sarra', 'Dvacet let jsem kovala podkovy koním, na kterých jezdili ti, co nás pálili. Každá podkova byla dobrá. Každá vydržela. Víš, jaký je to pocit? Dělat dobře práci pro lidi, kteří tě nenávidí?', 'angry'));
        else out.push(S('plachta', 'Chrápeš. Jen abys věděl{a}. Jako medvěd s rýmou, který se snaží zpívat. Dvacet let jsem dělala, že to neslyším. Teď už to říct můžu, jsme na útěku.', 'n'));
        return out;
      }, enter: (G, A) => A.rest(), ch: (G, A) => [
        { t: '„Protože mě dvacet let nikdo nepustil ven. Vím, jaké je to být v pasti.“', if: () => A.inParty('ester') && !A.has('esterNoc1'), go: 'mesto_rano', ap: { ester: 2 }, fx: (G2, A2) => A2.set('esterNoc1') },
        { t: '„Potřeboval{a} jsem průvodce.“', if: () => A.inParty('ester') && !A.has('esterNoc1'), go: 'mesto_rano', ap: { ester: -1 }, fx: (G2, A2) => A2.set('esterNoc1') },
        { t: '„Ten pocit znám jen z druhé strany. Pověz mi o něm.“', if: () => A.inParty('sarra') && !A.inParty('ester') && !A.has('sarraNoc1'), go: 'mesto_rano', ap: { sarra: 2 }, fx: (G2, A2) => A2.set('sarraNoc1') },
        { t: 'Zhasnout svíčku.', go: 'mesto_rano' }
      ] },
    mesto_rano: { bg: 'ulice', t: ['Ráno. Déšť konečně ustal, ale město pořád kape ze všech říms, okapů a nosů. Někde kokrhá kohout s takovou vervou, jako by na tom ještě něco záleželo. Králi zbývá o den méně.'], enter: (G, A) => { A.inc('kroky'); G.day++; }, ch: [{ t: 'Dál', go: 'mesto' }] },

    /* ---------- lékárna ---------- */
    lekarna: { bg: 'lekarna', mood: 'tense', npc: [], enter: (G, A) => step(G, A, 'lekarna'), t: (G, A) => [
      'Lékárna U Zlatého hada. Nad dveřmi visí pozlacený had omotaný kolem kalichu, kterému chybí kus ocasu. Dveře jsou pootevřené a zvonek nad nimi někdo ustřihl. Uvnitř voní heřmánek, sušená máta a krev.',
      'Lékárník Šimon leží přes pult, tváří v kaluži vlastní krve, s rukou nataženou k zásuvce, kterou už neotevře. Je ještě teplý. [[Přišel|Přišla]] jsi o pár minut pozdě. V Popelově přicházíš pozdě nějak často.',
      S('plachta', 'Tohle město je úžasný. Kam vlezeme, tam mrtvola. Jako by nás někdo předbíhal a uklízel za sebou svědky. Jen teda uklízí dost blbě.', 'n')
    ], ch: (G, A) => [
      { t: 'Prohlédnout knihu prodejů na pultu.', if: () => !A.has('lekKniha'), chk: { s: 'duv', dc: 12, ok: 'l_kniha_ok', no: 'l_kniha_no' } },
      { t: 'Prohledat lékárnu. Vrah tu možná ještě je.', if: () => !A.has('lekVrah'), chk: { s: 'mou', dc: 12, ok: 'l_vrah', no: 'l_vrah_prepad' } },
      { t: 'Odejít, než přijdou stráže.', go: 'mesto' }
    ] },
    l_kniha_ok: { bg: 'lekarna', npc: [], t: ['Poslední listy z knihy jsou vytržené, rychle a neuměle. Ale Šimon psal tvrdou rukou a pero se protlačilo do další strany. Seškrábneš uhlík z kamen a lehce přejedeš papír.', 'Ze šedi pomalu vystoupí písmo, jako duch z mlhy: *„Černá rosa, 1 lahvička, převzal R. K., na účet Kancléřství.“*', 'R. K. Radim Kost? Kapitán stráže, který tě vedl po schodech a mluvil o rozkazech?'], enter: (G, A) => { A.set('lekKniha'); A.give('kniha'); A.clue('kniha', 'Lékárníkova kniha: „Černá rosa, 1 lahvička, převzal R. K., na účet Kancléřství.“'); }, ch: [{ t: 'Dál', go: 'lekarna' }] },
    l_kniha_no: { bg: 'lekarna', npc: [], t: ['Vytržené listy, rozmazaný inkoust, krev, která prosákla až do vazby. Víc z toho nevyčteš. Knihu si vezmeš. Možná ji někdo chytřejší, nebo aspoň méně vyděšený, přečte.'], enter: (G, A) => { A.set('lekKniha'); A.give('kniha'); A.set('knihaNeprectena'); }, ch: [{ t: 'Dál', go: 'lekarna' }] },
    l_vrah_prepad: { bg: 'lekarna', npc: [{ id: 'zoldak', x: .72 }], t: [{ t: 'Dvířka skříně s lektvary se rozletí a ven vyrazí muž s nožem. Zasáhne tě do ramene dřív, než se stihneš otočit.', shake: 10 }], enter: (G, A) => A.hurt(3), ch: [{ t: 'Bránit se!', tag: 'Útok', go: 'l_vrah_boj' }] },
    l_vrah: { bg: 'lekarna', npc: [{ id: 'zoldak', x: .72 }], t: ['Skříň s lektvary má pootevřené dveře a pod nimi čerstvou šmouhu krve, rozmazanou podrážkou. Nikdo, kdo by se skrýval ve skříni s lektvary, by nepočítal s tím, že ho prozradí vlastní bota. Než ji otevřeš, vyrazí ven muž s nožem. Ale ty už jsi [[připravený|připravená]].'], ch: [{ t: 'Na něj.', tag: 'Útok', go: 'l_vrah_boj' }, { t: '„Kdo tě platí? Řekni to a odejdeš živý.“', chk: { s: 'cha', dc: 14, ok: 'l_vrah_mluvi', no: 'l_vrah_boj' } }] },
    l_vrah_boj: { bg: 'lekarna', fight: { foes: [{ id: 'zoldak', name: 'Vrah z lékárny' }], win: 'l_vrah_mrtvy', lose: 'l_vrah_utekl' } },
    l_vrah_mluvi: { bg: 'lekarna', npc: [{ id: 'zoldak', x: .72 }], t: [S('zoldak', 'Žlutej pán. Platí zlatem s hadem, vždycky dopředu, vždycky přesně. Šimon mu prodal jed a pak se v hospodě chlubil, komu ho prodal. Teď už se nechlubí. Víc nevím, přísahám na mámu. Teda, na mámu ne. Na tu by se přísahat nemělo.', 'shock'), 'Pustíš ho. Uteče do deště, ani se neohlédne. Možná ho zítra najdou v řece. Kancléř nemá rád upovídané a ještě míň má rád ty, kdo se nechali chytit.'], enter: (G, A) => { A.set('lekVrah'); A.clue('najemnik', 'Najatý vrah z lékárny přiznal: platí ho „žlutý pán“ zlatem s hadem. Šimon prodal jed a pak mluvil.'); A.ap('vojta', 1, true); }, ch: [{ t: 'Dál', go: 'l_kuba' }] },
    l_vrah_mrtvy: { bg: 'lekarna', npc: [{ id: 'zoldak', pose: 'dead', x: .72 }], t: ['U pasu má vrah složený lístek, psaný úhledným, učeným písmem, které se k jeho tvrdým rukám vůbec nehodí: *„Šimon. Lékárna. Dnes. Knihu spálit. V.“*', 'Knihu nespálil. Byl línější, než měl být, nebo hloupější, než si jeho pán myslel. Mrtví vrazi mají tu výhodu, že jejich chyby přežijí je.'], enter: (G, A) => { A.set('lekVrah'); A.gold(12); A.clue('rozkaz', 'Lístek u vraha z lékárny: „Šimon. Lékárna. Dnes. Knihu spálit. V.“'); }, ch: [{ t: 'Dál', go: 'l_kuba' }] },
    l_vrah_utekl: { bg: 'lekarna', npc: [], t: ['Vrah tě srazí do regálu a lahvičky se roztříští v duze bylinných pachů. Než se vyhrabeš, zmizí oknem do dvora. Zůstane po něm jen otevřené okno, pach česneku a tvá krev na dlaždicích.'], enter: (G, A) => A.set('lekVrah'), ch: [{ t: 'Dál', go: 'l_kuba' }] },
    l_kuba: { bg: 'lekarna', npc: [{ id: 'lid', x: .72 }], t: [
      'Pod pultem někdo vzlykne, tiše, jako když se pláče s rukou na puse. Chlapec, nanejvýš dvanáct let, s ušima jako dvě otevřené okenice a s Šimonovou zástěrou, která mu sahá po kotníky. Učeň. Jmenuje se Kuba.',
      S('lid', 'Byli tu dva, předevčírem večer. Pán se žlutou tváří. Mluvil hezky, tak hezky, že mi z toho bylo zle. A voják s jizvou přes celej obličej. Voják zaplatil a odnesl tu lahvičku s černou rosou.', 'shock'),
      S('lid', 'A dneska přišel jen ten s nožem. Pan Šimon mi řekl, ať se schovám. Tak jsem se schoval. Měl jsem… měl jsem něco udělat?', 'sad')
    ], enter: (G, A) => A.clue('svedek', 'Učeň Kuba: jed si předevčírem vyzvedli „pán se žlutou tváří“ a „voják s jizvou přes obličej“.'), ch: [
      { t: '„Udělal jsi přesně to správné. Jdi do hospody U Oběšence. Řekni Jardovi, že tě posílám. A nikomu jinému nic.“', go: 'mesto', ap: { ester: 1, vojta: 1, sarra: 1 }, fx: (G, A) => A.set('kubaZachranen') },
      { t: 'Dát mu pět zlatých a nechat ho jít.', cost: 5, go: 'mesto', fx: (G, A) => A.set('kubaZachranen') },
      { t: '„Jestli o mně někomu řekneš, najdu tě.“', go: 'mesto', ap: { ester: -1, vojta: -2 }, fx: (G, A) => A.inc('temnota') }
    ] },

    /* ---------- Škvára ---------- */
    skvara: { bg: 'skvara', mood: 'fire', npc: [{ id: 'sarra', x: .6 }, { id: 'fanatik', x: .76 }, { id: 'sabina', x: .9 }], lore: ['skvara', 'dracilid', 'sabina'], enter: (G, A) => step(G, A, 'skvara'), t: [
      'Škvára hoří. Ne celá. Zatím. Za železnými vraty, která se na noc zamykají zvenčí, stoupá dým z dvaceti oken naráz. Řád Bledého plamene jde od domu k domu, s klidem, s jakým jde hospodyně po zahradě a trhá plevel, a fanatici v bílých maskách hází pochodně do oken.',
      'Na náměstíčku u studny stojí inkvizitorka Sabina. Mladší, než bys čekal{a}. Kápě bílá jako vybělená kost a hlas jasný jako zvon na ranní mši: *„Oheň očistí, co krev pošpinila! Kdo je čistý, nemá se čeho bát!“*',
      'Před kovárnou s vyvrácenými vraty stojí žena s rohy, se šupinami na krku a s očima, ve kterých doutná uhlík. V ruce drží kovářské kladivo, které by většina mužů nezvedla oběma rukama. Za její sukní se krčí dvě dračí děti. Sarra Popelavá, kovářka. Nevypadá, že by se chystala ustoupit, ani kdyby na ni padalo nebe.',
      S('sarra', 'Pojďte si pro ně. Jeden po druhém, nebo všichni najednou. Kladivu je to jedno. Kladivo nedělá rozdíly mezi krví.', 'angry'),
      S('sabina', 'Tvá krev je hřích, ženo. Hřích tvých předků a tvůj. Já ti nabízím milost ohně. Je to jediná milost, kterou si tvůj rod zaslouží.', 'n')
    ], ch: (G, A) => [
      { t: 'Postavit se vedle Sarry.', tag: 'Boj', go: 's_boj', fx: (G2, A2) => { A2.join('sarra'); A2.ap('sarra', 2); } },
      { t: '„Jsem [[dědic|dědička]] Vranova. Ve jménu krále, stůjte!“', chk: { s: 'cha', dc: A.has('radimPustil') ? 12 : 14, ok: 's_zastaveno', no: 's_vysmech' } },
      { t: '[Dračí krev] Vystoupit a ukázat své rohy. „Mě upalte první.“', if: () => A.race('drak'), chk: { s: 'cha', dc: 11, ok: 's_zastaveno', no: 's_vysmech' } },
      { t: 'Ustoupit do stínu. Tohle není tvůj boj.', go: 's_ustup' },
      { t: '[Zrada] Prozradit Sabině, kde se schovávají další uprchlíci. Za propustku z města.', go: 's_zrada' }
    ] },
    s_vysmech: { bg: 'skvara', npc: [{ id: 'sarra', x: .6 }, { id: 'fanatik', x: .76 }, { id: 'sabina', x: .9 }], t: [S('sabina', '[[Dědic|Dědička]]? [[Dědic Vranova sedí|Dědička Vranova sedí]] ve věži, kde patří, a modlí se za otce. Ty jsi jen další špína v ulici, která si myslí, že má hezký hlas. Bratři!', 'angry')], ch: [{ t: 'Tak tedy boj. Ke Sarře!', tag: 'Boj', go: 's_boj', fx: (G, A) => { A.join('sarra'); } }, { t: 'Utéct.', go: 's_ustup' }] },
    s_boj: { bg: 'skvara', mood: 'fight', fight: { foes: ['fanatik', 'fanatik', 'fanatik'], intro: 'Sarra se s řevem, ve kterém je dvacet let mlčení, vrhne vpřed. Kladivo zazvoní o první bílou masku jako o zvon.', win: 's_vyhra', lose: 's_prohra' } },
    s_prohra: { bg: 'skvara', npc: [{ id: 'sabina', x: .85 }], t: ['Probereš se v popelu s chutí sazí v ústech. Sarra je pryč, odvlekli ji v řetězech. Děti taky. Sabina nad tebou stojí a dívá se na tebe tím pohledem, jakým se účetní dívají na sloupec čísel, který jim nesedí.', S('sabina', 'Ty nejsi špína. Ty jsi [[zajímavý|zajímavá]]. A zajímavé věci Řád neupaluje hned. Nejdřív je zkoumá. Uvidíme se na náměstí, až bude popravčí den.', 'n')], enter: (G, A) => { A.leave('sarra', 'byla zajata'); A.set('sarraZajata'); G.f.skvara = 'spalena'; A.set('sabinaZna'); }, ch: [{ t: 'Zvednout se a jít.', go: 'mesto' }] },
    s_vyhra: { bg: 'skvara', npc: [{ id: 'sarra', x: .66 }, { id: 'drakolid', x: .86 }], t: [
      'Poslední fanatik prchá ulicí s hořící kápí a jeho křik se mísí s praskáním trámů. Sabina se otočí na podpatku a odchází, pomalu a vzpřímeně, jako by šla z mše. Na rohu chrámové ulice se zastaví a ohlédne.',
      S('sabina', 'Bledý plamen nezapomíná. A já taky ne.', 'angry'),
      'Z trosek, ze sklepů a z kováren vylézají lidé s rohy a šupinami, s popelem ve vlasech a s kladivy v rukou. Dívají se na tebe zvláštně. Jako by nevěřili, že někdo jako ty může stát na jejich straně, a jako by se báli tomu uvěřit, aby je to pak nebolelo.',
      S('sarra', 'Nevím, kdo jsi. Nevím, proč jsi to udělal{a}. Ale dneska tady nikdo nehořel. To se ve Škváře nestalo dvacet let.', 'n')
    ], enter: (G, A) => { G.f.skvara = 'branena'; A.set('drakSpojenec'); A.set('sabinaNepritel'); A.set('tunel'); A.ap('sarra', 2); }, ch: [{ t: 'Dál', go: 's_sarra' }] },
    s_zastaveno: { bg: 'skvara', npc: [{ id: 'sarra', x: .6 }, { id: 'sabina', x: .82 }], t: (G, A) => [
      'Sabina zvedne ruku a fanatici ztuhnou s pochodněmi ve vzduchu jako sochy. Dlouze si tě prohlíží zpod kápě a ty v jejích očích vidíš něco, co jsi tam nečekal{a}: nejistotu.',
      S('sabina', A.race('drak') ? 'Šupinatý [[dědic|dědička]]. Takže je to pravda, ty řeči ve sklepech. Bořivoj vychoval hada na vlastní hrudi. Dobrá. Dnes tu nikdo hořet nebude. Dnes. Napíšu královně a zeptám se jí, ví-li, koho chová.' : '[[Dědic, který utekl|Dědička, která utekla]] z věže. Zajímavé. Velmi zajímavé. Dobrá. Dnes tu nikdo hořet nebude. Dnes. Napíšu královně a zeptám se jí, kdo tu vlastně vládne.', 'n'),
      'Řád odchází v tichém průvodu bílých kápí. Kouř se pomalu rozplývá nad střechami a na jeho místo se snáší mžení. Sarra si hřbetem ruky utře saze z tváře a podívá se na tebe jinak než předtím.'
    ], enter: (G, A) => { G.f.skvara = 'odlozena'; A.set('sabinaZna'); A.set('tunel'); A.set('drakSpojenec'); }, ch: [{ t: 'Dál', go: 's_sarra' }] },
    s_sarra: { bg: 'skvara', npc: [{ id: 'sarra', x: .66 }], t: [
      S('sarra', 'K Dračímu hrádku? Za Kýchalem? Ty jsi blázen. Kýchal je pohádka, kterou si u nás vyprávějí děti, aby se v noci míň bály. Že někde v lese spí poslední drak a jednou se vzbudí a všechno spraví.', 'n'),
      S('sarra', 'Ale moje babička říkávala, že žije. Že hlídá kosti svých dětí a čeká. Říkala to až do dne, kdy umřela, a pak už to nikdo neříkal nahlas.', 'n'),
      S('sarra', 'Kdyby byl naživu… chci ho vidět. Aspoň jednou v životě chci vidět něco, co Řád nedokázal zabít.', 'n'),
      S('sarra', 'Pod starou slévárnou vede tunel až za hradby. Pašovali jsme tudy uhlí, protože ho Řád nechce prodávat šupinářům za normální cenu. Teď můžeme pašovat tebe.', 'smirk')
    ], enter: (G, A) => A.note('ven', 'Sarra zná tunel pod slévárnou ve Škváře, který vede za hradby.'), ch: (G, A) => [
      { t: '„Pojď se mnou, Sarro.“', go: 'mesto', fx: (G2, A2) => { A2.join('sarra'); A2.ap('sarra', 1); } , if: () => !A.inParty('sarra') },
      { t: '„Jsem [[rád|ráda]], že jdeš.“', go: 'mesto', if: () => A.inParty('sarra'), fx: (G2, A2) => A2.ap('sarra', 1) },
      { t: '„Zůstaň tu a chraň je. Najdu tě, až budu potřebovat tunel.“', go: 'mesto', if: () => !A.inParty('sarra') }
    ] },
    s_ustup: { bg: 'skvara', npc: [{ id: 'fanatik', x: .7 }, { id: 'sabina', x: .9 }], t: ['Couváš do stínu za roh, kde nikdo nikoho nevidí. Slyšíš, jak kladivo zvoní o masky jednou, dvakrát, třikrát. Pak řinčení řetězů. Pak křik dětí. Pak už jen praskání ohně, který si nevybírá.', 'Když se ohlédneš, Sarru vlečou ke chrámu. Krvácí z čela a ještě se dívá zpátky. Ne na tebe. Na děti.', S('plachta', 'Hele… tohle bylo rozumný. Vážně. Nechci, abys umřel{a}. Ale stejně je mi z toho na blití. Rozumný věci jsou občas hrozně odporný.', 'sad')], enter: (G, A) => { G.f.skvara = 'spalena'; A.set('sarraZajata'); A.leave('sarra', 'byla zajata'); A.inc('temnota'); A.ap('ester', -2); }, ch: [{ t: 'Odejít.', go: 'mesto' }] },
    s_zrada: { bg: 'skvara', npc: [{ id: 'sabina', x: .8 }], t: ['Přistoupíš k Sabině a šeptneš jí o sklepě pod pekárnou, kde se schovávají ti, kdo neutekli. Kápě se k tobě skloní. Pod ní je tvář, z poloviny krásná a z poloviny zjizvená ohněm, a oči, které se poprvé usmějí.', S('sabina', 'Tady je propustka, dítě. A tady plášť Řádu. Budeš ho potřebovat, svět je plný lidí, kteří nebudou rozumět tomu, co jsi dnes udělal{a}. Bledý plamen odměňuje věrné.', 'smile'), 'O hodinu později hoří pekárna. Nikdo z ní nevyjde. Sarru odvlečou v řetězech kolem tebe. Než zmizí za rohem, plivne ti pod nohy. Nic neřekne. Nemusí.'], enter: (G, A) => { G.f.skvara = 'zrada'; A.set('sarraZajata'); A.leave('sarra', 'tě proklíná'); A.ap('sarra', -10, true); A.set('propustkaRad'); A.give('plast'); A.inc('temnota', 3); A.ap('ester', -4); A.ap('plachta', -2); A.set('radPritel'); }, ch: [{ t: 'Odejít s pláštěm přes ruku.', go: 'mesto' }] },
    skvara_pozde: { bg: 'skvara', mood: 'sad', npc: [{ id: 'drakolid', x: .78 }], lore: ['skvara', 'dracilid'], enter: (G, A) => { step(G, A, 'skvara'); G.f.skvara = 'spalena'; A.set('sarraZajata'); }, t: [
      '[[Přišel|Přišla]] jsi pozdě. Škvára je jen černý zub dýmu nad zbytkem města. Železná vrata jsou dokořán, protože už není koho zamykat. Na začouzené zdi visí nápis ŠUPINÁČI DO OHNĚ, napsaný velkými, pečlivými písmeny. A pod ním… radši se nedívej. Podíváš se stejně.',
      S('drakolid', 'Sarru Popelavou odvlekli do chrámu. Ráno v popravčí den ji pověsí s ostatními, na náměstí, aby to všichni viděli. Ty jsi kdo? Další, kdo se přišel podívat na popel?', 'angry')
    ], ch: [{ t: '„Někdo, kdo to zastaví. Přísahám.“', go: 'mesto', fx: (G, A) => { A.quest('sarra', 'Sarra v řetězech', 'Sarru Popelavou zajal Řád. Bude popravena v popravčí den, pokud ji nezachráním.'); A.set('tunel'); } }, { t: 'Mlčky odejít.', go: 'mesto' }] },
    skvara_po: { bg: 'skvara', npc: (G) => G.f.skvara === 'branena' || G.f.skvara === 'odlozena' ? [{ id: 'drakolid', x: .8 }] : [], t: (G) => [G.f.skvara === 'branena' || G.f.skvara === 'odlozena' ? 'Ve Škváře se uklízí. Kovárny znovu kouří a kladiva zvoní v rytmu, který je skoro veselý. Lidé s rohy ti kývají na pozdrav a jedna stará žena ti strčí do ruky horkou placku s cibulí. Nic neřekne. Placka je řeč dostatečná.' : 'Popel. Ticho. Vrány. A vítr, který si v sutinách prozpěvuje písničku, kterou tu před týdnem zpívaly děti.'], ch: [{ t: 'Zpět.', go: 'mesto' }] },

    /* ---------- chrám ---------- */
    chram: { bg: 'chram', mood: 'dark', npc: [{ id: 'fanatik', x: .78 }, { id: 'fanatik', x: .9 }], lore: 'rad', enter: (G, A) => step(G, A, 'chram'), t: [
      'Chrám Bledého plamene stojí na kopci nad Popelovem jako bílý zub. Uvnitř je chladno, chladněji než venku v dešti, a ticho, které se usazuje na kůži jako jinovatka.',
      'Nad oltářem hoří oheň, který nehřeje. Bílý, tichý, bez kouře a bez praskání, plamen, kolem kterého se lidé shromažďují, aniž by k němu natahovali ruce. Říká se, že ho zapálili z kostí prvního draka zabitého ve válce, a že dokud hoří, žádný drak se do údolí nevrátí.',
      'Novicové v bílých rouchách zpívají chorál o čistotě krve, tak krásně a tak chladně, že ti z toho běhá mráz po zádech. Za oltářem jsou těžké dubové dveře do archivu.'
    ], ch: (G, A) => [
      { t: 'Poslechnout si kázání.', go: 'c_kazani', if: () => !A.has('kazani') },
      { t: 'Proklouznout do archivu.', chk: { s: 'obr', dc: 13, ok: 'c_archiv', no: 'c_chycen' } },
      { t: '„Jsem novic, poslali mě pro svíce.“', chk: { s: 'cha', dc: 13, ok: 'c_archiv', no: 'c_chycen' } },
      { t: 'Obléknout plášť Řádu a jít rovnou do archivu.', if: () => A.item('plast'), go: 'c_archiv' },
      { t: 'Odejít.', go: 'mesto' }
    ] },
    c_kazani: { bg: 'chram', npc: [{ id: 'sabina', x: .8 }], lore: 'sabina', t: [
      'Na kazatelnu vystoupí inkvizitorka Sabina. Chrám ztichne tak dokonale, že slyšíš, jak plamen nad oltářem nevydává žádný zvuk.',
      S('sabina', 'Bylo mi sedm let, když přiletěli. Noc dlouhých plamenů. Starý Žárov hořel od řeky až po hradby a nebe nad ním bylo plné křídel. Viděla jsem matku hořet ve dveřích našeho mlýna. Viděla jsem, jak se nad ní drak směje.', 'n'),
      S('sabina', 'Neříkejte mi, že dračí krev je jen krev. Že šupináči jsou jen lidé s rohy. Já ten jejich oheň nosím na vlastní tváři.', 'angry'),
      'Shodí kápi. Levá polovina její tváře je krásná. Pravá je mapa jizev, lesklých a zvrásněných jako rozteklý vosk. Chrám zalapá po dechu, jako by to viděl poprvé, ačkoli to vidí každý týden.'
    ], ch: [
      { t: 'Vnímat ji. Opravdu ji poslouchat, ne jen slyšet.', chk: { s: 'mou', dc: 12, ok: 'c_kazani_ok', no: 'chram' } },
      { t: 'Dost. Zpět.', go: 'chram' }
    ], enter: (G, A) => A.set('kazani') },
    c_kazani_ok: { bg: 'chram', npc: [{ id: 'sabina', x: .8 }], t: ['Posloucháš a za tou zuřivostí slyšíš něco jiného. Strach. A pod strachem něco, co se podobá vině. Mluví o tom, jak se drak smál. Ale draci se nesmějí, aspoň ne v žádné pověsti, kterou jsi kdy četl{a}. A žádné dítě, které vidí hořet matku, se nedívá nahoru, aby zjistilo, jestli se drak směje. Někdo jí ten úsměv později dopověděl.', 'Sabina věří. Opravdu a celým srdcem věří, a to je na ní to nejnebezpečnější i to nejcennější. Kdo věří, toho nelze koupit. Ale lze ho přesvědčit. Správným důkazem ve správnou chvíli.'], enter: (G, A) => A.set('sabinaPochopena'), ch: [{ t: 'Dál', go: 'chram' }] },
    c_chycen: { bg: 'chram', npc: [{ id: 'fanatik', x: .7 }, { id: 'fanatik', x: .84 }], t: ['Dva fanatici ti zastoupí cestu. Bílé masky bez úst, pochodně v rukou. Za maskami nejsou vidět tváře, a to je přesně účel masek.', S('fanatik', 'Kacíř v domě světla. Oheň tě očistí. Nebude to bolet. Teda, bude. Ale jen krátce.', 'angry')], ch: [{ t: 'Bojovat.', tag: 'Útok', fight: { foes: ['fanatik', 'fanatik'], win: 'c_archiv', lose: 'c_vyhozen', winFx: (G, A) => A.set('hledany') } }, { t: 'Utéct.', chk: { s: 'obr', dc: 11, ok: 'mesto', no: 'c_vyhozen' } }] },
    c_vyhozen: { bg: 'ulice', npc: [], t: ['Vyhodí tě na dlažbu před chrámem s popáleninami na předloktí, které páchnou jako spálené peří. Jsi naživu. Řád je dnes milosrdný. Nebo líný. U Řádu se to dá těžko rozeznat.'], enter: (G, A) => { A.hurt(3); A.set('chramHotovo'); }, ch: [{ t: 'Dál', go: 'mesto' }] },
    c_archiv: { bg: 'chram', npc: [], t: ['Archiv. Police až ke stropu, svitky, seznamy a rodokmeny. Kdo má jakou krev, kdo si koho vzal, čí děda měl na krku šupinu. Řád si vede účetnictví hříchů pečlivěji, než město vede účetnictví daní, a je to vidět.', 'Na stole inkvizitorky leží čerstvý dopis se žlutou voskovou pečetí. V pečeti je had, který si kouše vlastní ocas. Dopis je psaný šifrou.'], enter: (G, A) => { A.give('dopis'); A.set('chramHotovo'); }, ch: [
      { t: 'Pokusit se šifru rozluštit hned.', chk: { s: 'duv', dc: 14, ok: 'c_sifra_ok', no: 'c_sifra_no' } },
      { t: 'Vzít dopis a zmizet.', go: 'mesto' }
    ] },
    c_sifra_ok: { bg: 'chram', npc: [], t: ['Posun písmen podle dne v týdnu. Úřednická šifra, vymyšlená někým, kdo si nedokázal představit, že by úřední spisy četl někdo, kdo je nemusí číst. Po chvíli to čteš:', '*„Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. V.“*', 'Dědic zmizí v ohni. To jsi ty. Je zvláštní číst o vlastní smrti v cizí poště.'], enter: (G, A) => A.clue('dopis', 'Dopis kancléře Řádu: „Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. V.“'), ch: [{ t: 'Zmizet.', go: 'mesto' }] },
    c_sifra_no: { bg: 'chram', npc: [], t: ['Písmena ti tančí před očima jako mravenci. Někdo chytřejší, nebo aspoň s víc času, to rozluští. Strčíš dopis za košili a srdce ti tluče tak hlasitě, že se bojíš, že ho uslyší celý chrám.'], ch: [{ t: 'Zmizet.', go: 'mesto' }] },

    /* ---------- stoky ---------- */
    stoky: { bg: 'stoky', mood: 'dark', npc: [{ id: 'krysak', x: .74 }, { id: 'smudla', x: .86 }, { id: 'krysak', x: .96 }], lore: ['krysaci', 'smudla'], enter: (G, A) => step(G, A, 'stoky'), t: (G, A) => [
      'Stoky. Voda po kotníky, tma po krk a pach, který se nedá popsat, jen přežít. Klenby jsou tu starší než město nad nimi, postavené ještě za dob smlouvy, kdy se stavělo pro věčnost a ne pro rozpočet.',
      'Z výklenků ve zdech svítí desítky rudých očiček. Neútočí. Pozorují. Je to ten druh pozornosti, se kterým celník čte cizí pas.',
      'Na trůnu z naskládaných sudů sedí krysa velká jako šestileté dítě, s korunkou z mosazného náprstku a monoklem ze sklíčka od lucerny. Nohy má zkřížené a v tlapce drží žezlo, které bylo kdysi lžící.',
      S('smudla', 'Ale ale. Někdo nám leze do našeho království bez cla. Jsme Šmudla, z Boží milosti a volbou sněmu Král všech stok, Pán kanálů a Ochránce Odpadu. Kdo platí, je host. Kdo neplatí, je oběd. Kdo je oběd, neplatí. Je to velmi spravedlivý systém.', 'smirk'),
      A.inParty('plachta') ? S('plachta', 'Bratranec! Ne, dělám si prdel, nejsme příbuzní. Veverky jsou lepší rasa. Máme ocas, kterej se dá ukázat ve společnosti.', 'n') : null,
      S('smudla', 'Ty jsi ten utečenec z věže, že ano? Za tvou hlavu nabízí žlutý pán padesát zlatých. My ale nejsme lovci odměn. My jsme obchodníci. A obchodník se nejdřív ptá, kolik nabízí druhá strana.', 'smirk')
    ], ch: (G, A) => [
      { t: '„Jaký obchod, Veličenstvo?“', go: 'st_obchod' },
      { t: '„Žlutý pán? Co o něm víš?“', go: 'st_info', if: () => !A.has('stInfo') },
      { t: 'Vytasit zbraň. „Já jsem tvůj oběd.“', tag: 'Útok', fight: { foes: ['smudla', 'krysak', 'krysak'], win: 'st_vyhra', lose: 'st_prohra' } }
    ] },
    st_info: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: [S('smudla', 'Informace něco stojí. Pět zlatých. Nebo sýr. Máš sýr? Nemáš sýr. Nikdo nikdy nemá sýr. Je to tragédie naší doby.', 'n')], ch: [
      { t: 'Zaplatit. (5 zl)', cost: 5, go: 'st_info2' },
      { t: '„Když mi to řekneš, řeknu ti, kde má Trubka schovaný sýr.“', chk: { s: 'cha', dc: 12, ok: 'st_info2', no: 'stoky' } },
      { t: '„Tak nic. Sýr nemám a zlato taky ne.“ Odejít.', go: 'stoky' }
    ] },
    st_info2: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: [S('smudla', 'Žlutý pán u nás najímá tiché lidi. Nožíře, škrtiče, jednoho traviče, který se v noci budí s pláčem. Platí zlatem s hadem, vždycky přesně a nikdy víc. Minulý týden chtěl někoho, kdo umí vylézt po hradní zdi. Do sedmé věže.', 'n'), S('smudla', 'A ještě něco zdarma, protože máme dobrý den a ty máš hezký uši: kapitán Kost s ním nemluví. Nenávidí ho. Jen o tom ještě sám neví. Lidi jsou v tomhle pomalí. Krysy to poznají podle pachu.', 'smirk')], enter: (G, A) => { A.set('stInfo'); A.clue('najemnici', 'Šmudla: kancléř u Krysího krále najímá vrahy a platí zlatem s hadem. Minulý týden chtěl lezce do věže.'); }, ch: [{ t: 'Dál', go: 'stoky' }] },
    st_obchod: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: [
      S('smudla', 'Mapa stok. Celých. Vede pod hradbami ven z města a pod hradem až do sklepů Vranova. Taková mapa je cennější než koruna, protože koruna nevede nikam. Koruna jen sedí na hlavě a tlačí.', 'smirk'),
      S('smudla', 'Cena? Čtyřicet zlatých. Nebo ta tlustá husa, co ji vláčí ten pěvec. Už měsíc o ní sníme. Každou noc. Ve sněnu je pečená. Nebo slib. Až budeš sedět nahoře, krysy dostanou hlas v radě. Krysí právo. Jeden hlas. Malý. Ale náš.', 'n')
    ], ch: [
      { t: 'Zaplatit čtyřicet. (40 zl)', cost: 40, go: 'st_mapa' },
      { t: '„Krysí právo. Máš mé slovo.“', go: 'st_mapa', fx: (G, A) => { A.set('krysiSlib'); A.set('krysySpojenec'); } },
      { t: '„Přinesu ti tu husu.“', if: (G, A) => !A.has('otylieSnedena'), go: 'st_husa' },
      { t: '„Rozmyslím si to.“', go: 'stoky' }
    ] },
    st_husa: { bg: 'hospoda', npc: [{ id: 'trubka', x: .7 }, { id: 'otylie', x: .78 }], t: ['Vrátíš se do hospody. Trubka spí s hlavou na stole a s loutnou v náručí a ve snu si brouká rým na „Otýlie“. Otýlie nespí. Sedí vedle jeho klobouku a dívá se na tebe. Ví to. Husy to vždycky vědí.'], ch: [
      { t: 'Popadnout husu.', chk: { s: 'obr', dc: 12, ok: 'st_husa_ok', no: 'st_husa_no' } },
      { t: 'Ne. Tohle ne. Ani já nejsem [[takový|taková]].', go: 'stoky' }
    ] },
    st_husa_no: { bg: 'hospoda', npc: [{ id: 'trubka', x: .7 }, { id: 'otylie', x: .78 }], t: [{ t: 'Otýlie tě kousne do nosu, do ucha a do důstojnosti, v tomhle pořadí. Trubka se probudí, uvidí tě s rukama kolem své choti a začne ječet o vrahovi hraběnek tak, že se seběhne půlka ulice.', shake: 8, snd: 'husa' }], enter: (G, A) => A.hurt(2), ch: [{ t: 'Utéct.', go: 'mesto' }] },
    st_husa_ok: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: ['Šmudla si olízne vousy. Otýlie syčí až do samého konce, hrdě a beze strachu, jak se na hraběnku sluší. Nebudeme to popisovat. Někdy je vypravěč milosrdnější než postavy.', S('smudla', 'Obchodník jako ty… z tebe bude dobrý král. Nebo aspoň dobrý obchodník, a to je skoro totéž. Tady je mapa.', 'smile'), S('plachta', 'Tohle Trubkovi nikdy neříkej. Nikdy. Já taky ne. A už se se mnou dneska nebav.', 'sad')], enter: (G, A) => { A.set('otylieSnedena'); A.inc('temnota'); A.ap('ester', -1); A.give('mapa'); A.set('stokyHotovo'); A.set('krysySpojenec'); }, ch: [{ t: 'Zpět do ulic.', go: 'mesto' }] },
    st_mapa: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: [S('smudla', 'Obchod je obchod a smlouva je smlouva. Tady máš. Červená čára ven z města, modrá pod hrad. Černá… tam nechoď. Tam bydlí něco, co žere krysy. A co žere krysy, to se nezastaví u lidí.', 'n')], enter: (G, A) => { A.give('mapa'); A.set('stokyHotovo'); A.note('ven', 'Mám mapu stok od Šmudly. Vede ven z města i pod hrad.'); A.done('krysy'); }, ch: [{ t: 'Zpět do ulic.', go: 'mesto' }] },
    st_vyhra: { bg: 'stoky', npc: [{ id: 'smudla', pose: 'dead', x: .86 }], t: ['Krysí král leží ve vodě a korunka z náprstku mu sklouzla na oko. Zbytek krys zmizel ve tmě, tiše a rychle, a ty máš nepříjemný pocit, že si tvůj obličej zapamatovaly. Na sudu leží mapa stok. A vedle ní hromádka zlatých s hadí ražbou.'], enter: (G, A) => { A.give('mapa'); A.gold(20); A.set('stokyHotovo'); A.set('smudlaMrtvy'); A.done('krysy'); A.clue('najemnici', 'U Krysího krále jsem [[našel|našla]] hromádku zlatých s hadí ražbou. Kancléř ho platil.'); }, ch: [{ t: 'Zpět do ulic.', go: 'mesto' }] },
    st_prohra: { bg: 'stoky', npc: [{ id: 'smudla', x: .86 }], t: ['Probudíš se na hromadě odpadků bez měšce. Šmudla ti z trůnu shovívavě mávne monoklem.', S('smudla', 'Dneska máš štěstí. Mrtví neplatí a my jsme obchodníci, ne řezníci. Vrať se, až budeš mít peníze. Nebo rozum. Obojí najednou se u lidí vidí jen zřídka.', 'smirk')], enter: (G, A) => { G.gold = 0; }, ch: [{ t: 'Vylézt nahoru.', go: 'mesto' }] },

    /* ---------- Radim v uličce ---------- */
    radim_ulice: { bg: 'ulice', mood: 'rain', npc: (G, A) => A.has('radimPustil') ? [{ id: 'radim', x: .72 }] : [{ id: 'straz', x: .62 }, { id: 'radim', x: .74 }, { id: 'straz', x: .86 }], lore: 'radim', enter: (G, A) => A.set('radimPotkan'), t: (G, A) => [
      'V úzké uličce mezi koželužnou a zadní zdí kostela ti cestu zastoupí postava v mokrém plášti. Jizva přes celý obličej. Rezavé oči. Kapitán Radim Kost, a déšť mu stéká po přilbě jako po soše.',
      A.has('radimPustil') ? S('radim', 'Řekl jsem důkaz, Výsosti. Ne výlet po hospodách a lékárnách. Celé město mluví o [[mladíkovi|dívce]], co se zajímá o jedy. Co máte?', 'n') : S('radim', 'Konec procházky, Výsosti. Půjdete se mnou zpátky na hrad. Po dobrém, nebo po mém. Po mém to bolí víc a trvá to déle.', 'angry'),
      A.hasClue('kniha') || A.hasClue('svedek') ? 'Vzpomeneš si na Šimonovu knihu. *Převzal R. K.* A na Kubova slova: *voják s jizvou přes celej obličej zaplatil.* Díváš se na tu jizvu a ona se dívá na tebe.' : null
    ], ch: (G, A) => [
      { t: `Ukázat mu, co víš. (důkazů: ${A.clues()})`, if: () => A.clues() >= 2, chk: { s: 'cha', dc: Math.max(8, 15 - A.clues()), ok: 'r_spojenec', no: 'r_nevěří' } },
      { t: '„R. K. Radim Kost. Vy jste si vyzvedl ten jed, kapitáne.“', if: () => A.hasClue('kniha') || A.hasClue('svedek'), go: 'r_konfrontace' },
      { t: '„Věřte mi. Bez důkazů. Jen mi věřte.“', chk: { s: 'cha', dc: 16, ok: 'r_spojenec', no: 'r_nevěří' } },
      { t: 'Vyzvat ho na souboj. [[Sám|Sama]] proti němu.', tag: 'Boj', go: 'r_duel' },
      { t: 'Utéct přes střechy.', chk: { s: 'obr', dc: 13, ok: 'r_utek', no: 'r_nevěří' } }
    ] },
    r_konfrontace: { bg: 'ulice', npc: [{ id: 'radim', x: .72 }], t: [
      'Radim zbledne. Opravdu zbledne, až mu jizva na tváři zčervená, jako by byla čerstvá. Ruka mu sjede z jílce meče, jako by najednou zapomněl, k čemu je.',
      S('radim', 'Vyzvedl jsem… lék. Kancléř mi dal lístek. „Pro krále, na spaní, aby ho netrápily sny.“ Donesl jsem tu lahvičku do kuchyně a předal ji kuchaři. Vlastní rukou. Ještě jsem mu řekl, ať je opatrný, že je to drahé.', 'shock'),
      S('radim', 'Já jsem mu ten jed donesl. Já. Dvacet let ho chráním a nakonec jsem mu sám přinesl smrt v lahvičce.', 'sad')
    ], enter: (G, A) => A.clue('radim', 'Radim Kost jed nevědomky vyzvedl a donesl do kuchyně. Kancléř mu tvrdil, že je to lék na spaní.'), ch: [
      { t: '„Pak mi pomozte to napravit.“', go: 'r_spojenec' },
      { t: '„Vrah je vrah, kapitáne.“', go: 'r_duel', fx: (G, A) => A.ap('radim', -2, true) }
    ] },
    r_nevěří: { bg: 'ulice', npc: [{ id: 'radim', x: .72 }], t: [S('radim', 'Pohádky. Kdybych za každou pohádku o spiknutí dostal groš, koupil bych si hospodu a nemusel bych tohle dělat. Pojďte se mnou, Výsosti, nebo vás ponesu.', 'angry')], ch: [{ t: 'Tak tedy souboj.', tag: 'Boj', go: 'r_duel' }, { t: 'Vzdát se.', go: 'r_cela' }] },
    r_duel: { bg: 'ulice', mood: 'fight', fight: { foes: [{ id: 'radim', boss: true }], noAllies: ['plachta'], intro: 'Radim kývne na své muže, ať ustoupí. Tohle je mezi vámi dvěma. Odhodí plášť do bláta a zvedne meč, starý voják proti [[dítěti|dívce]] z věže, a ani jeden z vás neví, kdo z toho vyjde.', win: 'r_duel_vyhra', lose: 'r_cela' } },
    r_duel_vyhra: { bg: 'ulice', npc: [{ id: 'radim', x: .72, pose: 'kneel' }], t: ['Radim klečí v kaluži. Meč mu leží o tři kroky dál, v blátě, kam ho nedosáhne. Krev z rozseknutého obočí mu stéká do očí a on ji neutírá.', S('radim', 'Tak dělejte, Výsosti. Za kapitána stráže vám kancléř dá titul. Za mrtvého kapitána dva. Je to výhodný obchod. Celé tohle království je postavené na výhodných obchodech.', 'angry')], ch: [
      { t: 'Podat mu ruku. „Nechci vaši smrt. Chci vaši pomoc.“', go: 'r_spojenec', fx: (G, A) => A.ap('radim', 2, true) },
      { t: 'Nechat ho klečet a odejít.', go: 'mesto', fx: (G, A) => A.set('radimLovi') },
      { t: 'Dorazit ho.', tag: 'Zabít', go: 'r_zabit' }
    ] },
    r_zabit: { bg: 'ulice', npc: [{ id: 'radim', x: .72, pose: 'dead' }], t: ['Čepel projde snadněji, než jsi čekal{a}. Mnohem snadněji, než by měla. Radim se na tebe dívá až do konce a nevypadá rozzlobeně. Vypadá ulehčeně, jako člověk, který konečně složí těžký náklad, který nesl dvacet let.', S('plachta', 'Ty vole.', 'sad'), 'Je to poprvé, co Plachtička nemá co dodat.'], enter: (G, A) => { G.f.radim = 'mrtvy'; A.inc('temnota', 2); A.ap('vojta', -2, true); A.ap('ester', -1); A.set('hledany'); }, ch: [{ t: 'Odejít v dešti.', go: 'mesto' }] },
    r_utek: { bg: 'hradby', npc: [], t: ['Okap, štít, komín, další okap. Střechy Popelova jsou kluzké a strmé a vedou nikam, ale vedou tam rychle. Radim tě pronásleduje dvě ulice, funí a nadává, pak zůstane stát na hřebeni střechy a jen se dívá, jak mizíš v mlze.'], enter: (G, A) => A.set('radimLovi'), ch: [{ t: 'Dál', go: 'mesto' }] },
    r_cela: { bg: 'vez', npc: [], t: ['Kobka pod hradem. Řetěz, kýbl, krysy a malé okénko u stropu, kterým je vidět kousek nebe velký jako dlaň. Radim zamkne a beze slova odejde.', S('plachta', 'Klid. Tohle už jsme dělali, ne? Strážný usnul na stoličce a klíče mu visí z opasku. Já mám malý ruce. A velký ambice. Hlavně velký ambice.', 'smirk'), 'O hodinu později jsi venku. Plachtička škytá. Strážnému ukradla nejen klíče, ale i čutoru s pálenkou, a vysvětluje ti, že to byla „nezbytná součást operace“.'], enter: (G, A) => { A.set('radimLovi'); A.set('hledany'); A.ap('plachta', 2); }, ch: [{ t: 'Zpět do ulic.', go: 'mesto' }] },
    r_spojenec: { bg: 'ulice', npc: [{ id: 'radim', x: .72 }], t: (G, A) => [
      'Radim dlouho mlčí. Déšť mu stéká po jizvě a kape z brady a on se dívá někam za tebe, za ulici, za město, možná až k Hořanům.',
      S('radim', 'Dvacet let sloužím. Viděl jsem věšet nevinné, protože to bylo v rozkazu, a sám jsem pár takových rozkazů vykonal. Říkal jsem si, že tohle drží království pohromadě. Že bez rozkazů by byl jen chaos.', 'n'),
      S('radim', 'Když král zemře, kancléř sežere korunu i se zemí a my všichni budeme vykonávat jeho rozkazy. Ne. Už ne. Půjdu s vámi pro tu slzu, Výsosti. A pak se spolu vrátíme a zeptáme se kancléře, kdo podepsal ten lístek. Slušně. Jednou.', 'n')
    ], enter: (G, A) => { G.f.radim = 'spojenec'; A.join('radim'); A.ap('radim', 2, true); A.set('radimPropustka'); A.note('ven', 'Radim nás vyvede branou na své slovo.'); }, ch: [{ t: 'Dál', go: 'mesto' }] },

    /* ---------- brána ---------- */
    brana: { bg: 'brana', mood: 'tense', npc: [{ id: 'straz', x: .66 }, { id: 'straz', x: .8 }, { id: 'straz', x: .92 }], t: (G, A) => [
      'Městská brána. Úsvit barví nebe do barvy starého pergamenu a ve věžích po stranách brány se střídá stráž s takovým zíváním, že by se z něj daly počítat hodiny.',
      'Nad bránou visí v železných klecích ti, kdo se pokusili dostat ven bez propustky. Vrány na klecích sedí a pracují. Stráže kontrolují každého, kdo chce ven, a většinu vracejí s poučením, jehož součástí bývá kopanec.',
      A.has('hledany') ? S('straz', 'Hele, desátníku, támhleten vypadá jako ten z vyhlášky. Teda, ta vyhláška je trochu rozmazaná. Ale ten nos sedí.', 'n') : null
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
    b_boj: { bg: 'brana', mood: 'fight', fight: { foes: ['straz', 'straz', 'straz'], intro: 'Desátník zařve a někdo nahoře začne zvonit na poplach, nejdřív váhavě, pak s nadšením.', win: 'odchod', lose: 'b_prohra', winFx: (G, A) => A.set('hledany') } },
    b_prohra: { bg: 'brana', npc: [{ id: 'straz', x: .7 }], t: ['Srazí tě do bláta, seberou ti polovinu měšce a pak tě s chechtotem hodí zpátky do města jako kotě do řeky. Kdyby věděli, kdo jsi, nesmáli by se. Ale nevědí, a to je v tuhle chvíli jediné štěstí, které máš.'], enter: (G, A) => { G.gold = Math.floor(G.gold / 2); A.inc('branaProhra'); }, ch: (G, A) => [
      { t: 'V noci přelézt hradby za jatkami, kde se stráž nedívá.', if: () => (G.f.branaProhra || 0) >= 2, go: 'b_hradby' },
      { t: 'Zpět.', go: 'mesto' }
    ] },
    b_hradby: { bg: 'brana', mood: 'rain', npc: [], t: ['Za jatkami je hradba nižší a stráž tam chodí jen tehdy, když musí, protože to tam páchne. V noci, v dešti, s rukama od slizu a s Plachtičkou, která nahoře na cimbuří hlásí „vzduch čistej, teda čistej není, ale nikdo tu není“, se přeneseš přes zeď a spadneš do příkopu plného věcí, o kterých nechceš nic vědět.', S('plachta', 'Hrdinský útěk. Kronikáři to napíšou jinak. Já to napíšu přesně.', 'smirk')], enter: (G, A) => A.hurt(2), ch: [{ t: 'Pryč z Popelova.', go: 'odchod' }] },
    odchod: { bg: 'cesta', mood: 'wind', npc: [], cp: 1, lore: 'lhota', enter: (G, A) => {
        if (!A.has('byl_skvara')) { G.f.skvara = 'spalena'; A.set('sarraZajata'); A.set('skvaraNevi'); }
        A.done('ven');
      }, t: (G, A) => [
        'Popelov zůstává za zády. Z kopce za městem vypadá kouř nad jeho střechami skoro krásně, jako šedé peří, a šibenice na náměstích jsou odsud tak malé, že by je člověk mohl považovat za hračky.',
        'Před tebou se otevírá údolí Smolné, široké a zelené a mokré, s řekou, která se v něm vine jako stříbrný had. Silnice vede po proudu ke Lhotě. Za Lhotou je černá čára lesa a nad ní, na skalním ostrohu, sotva viditelná v oparu, stojí zřícenina.',
        A.has('skvaraNevi') ? 'Na cestě potkáš vůz se zajatci s rohy a šupinami, spoutanými k sobě jako dobytek. Vozka se otočí a zasměje se ti do tváře: *„Škvára vyhořela, slyšels? V popravčí den bude na náměstí veselo. Přijď se podívat.“*' : null,
        S('plachta', 'Tráva! Stromy! Opravdický stromy, a ne ten pokřivenej jasan na nádvoří, co ho čůrají psi! Já tu umřu štěstím. Nebo na klíšťata. Uvidíme, co bude dřív.', 'smile'),
        'Šest dní do králova skonu. Cesta do Lhoty trvá den, když se nikdo nepokusí tě zabít. Někdo se pokusí.'
      ], ch: [{ t: 'Na cestu.', go: 'akt2' }] }
  });
})(window.T);
