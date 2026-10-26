/* Koruna z popela – Dějství II: cesta, Lhota, Vojta, Černý les, Vědma, Dračí hrádek, Kýchal, tábor. */
(function (T) {
  'use strict';
  const S = (w, t, m) => ({ w, t, m });
  const refugees = G => G.f.skvara === 'branena' || G.f.skvara === 'odlozena' ? 'čtyřicet' : 'devět';
  Object.assign(T.N, {
    akt2: { act: 'Dějství II · Venkov', bg: 'cesta', mood: 'wind', cp: 1, npc: [{ id: 'zoldak', x: .7 }, { id: 'zoldak', x: .82 }, { id: 'zoldak', x: .94 }], enter: (G, A) => A.levelUp(), t: (G, A) => [
      'Polní cesta, vrány, vítr. Obilí tu dávno nikdo nesklízel – dračí daň sebrala i sedláky.',
      'U rozbitého kříže čekají tři muži v kroužkových košilích. Na štítech mají vymalovaného žlutého hada.',
      S('zoldak', 'Hele, kluci. Odměna sama přišla. Kancléřství platí dvě stě – živého nebo mrtvého. Mrtví se líp nesou.', 'smirk'),
      A.inParty('ester') ? S('ester', 'Žoldáci. Tyhle chlapy jsem už viděla v Lhotě. Vybírali daň s noži.', 'angry') : null
    ], ch: (G, A) => [
      { t: 'Do nich.', tag: 'Útok', fight: { foes: ['zoldak', 'zoldak', 'zoldak'], win: 'a2_po_boji', lose: 'a2_prohra', gold: 15 } },
      { t: '„Dvě stě? Kancléř si vás cení míň než mě. Odejděte, dokud vám to ještě můžu odpustit.“', chk: { s: 'sil', dc: 14, ok: 'a2_utekli', no: 'a2_boj' } },
      { t: 'V plášti Řádu: „Jsem posel Bledého plamene. Uhněte.“', if: () => A.item('plast'), chk: { s: 'cha', dc: 11, ok: 'lhota', no: 'a2_boj' } },
      { t: 'Ester: „Kolem rybníka je stezka. Za mnou.“', if: () => A.inParty('ester'), go: 'a2_obejiti' }
    ] },
    a2_boj: { bg: 'cesta', mood: 'fight', fight: { foes: ['zoldak', 'zoldak', 'zoldak'], win: 'a2_po_boji', lose: 'a2_prohra', gold: 15 } },
    a2_utekli: { bg: 'cesta', npc: [], t: ['Nejmladší z nich zaváhá. Pak druhý. Pak utíkají přes pole a jeden ztratí v blátě botu. Na zemi zůstane složený list.'], enter: (G, A) => A.clue('odmena', 'Vyhláška kancléřství: „Dědic Vranova – živ nebo mrtev – 200 zlatých.“ Kancléř chce dědice mrtvého ještě před králem.'), ch: [{ t: 'Do Lhoty.', go: 'lhota' }] },
    a2_obejiti: { bg: 'cesta', npc: [], t: ['Ester vede po hrázi, rákosím, kolem utopené kapličky. Žoldáci za vámi chvíli pokřikují a pak to vzdají. Je vidět, že tudy chodila tisíckrát.', S('ester', 'Pytlačit se naučíš, jen když tě chce někdo pověsit. Pak už je to snadné.', 'smirk')], enter: (G, A) => A.ap('ester', 1), ch: [{ t: 'Do Lhoty.', go: 'lhota' }] },
    a2_prohra: { bg: 'cesta', npc: [], t: ['Probereš se v příkopu. Svázaný. Žoldáci se hádají, kdo tě ponese. Plachtička ti mezitím přehryže provaz – a pak kousne do zadku toho nejbližšího. Utíkáš.'], enter: (G, A) => { A.hurt(2); G.gold = Math.max(0, G.gold - 10); }, ch: [{ t: 'Do Lhoty.', go: 'lhota' }] },
    a2_po_boji: { bg: 'cesta', npc: [{ id: 'zoldak', pose: 'dead', x: .8 }], t: ['U jednoho z žoldáků najdeš vyhlášku s pečetí: *„Dědic Vranova – živ nebo mrtev – 200 zlatých. Kancléřství.“*', 'Živ nebo mrtev. Král ještě dýchá a kancléř už rozdává tvou hlavu.'], enter: (G, A) => A.clue('odmena', 'Vyhláška kancléřství: „Dědic Vranova – živ nebo mrtev – 200 zlatých.“ Kancléř chce dědice mrtvého ještě před králem.'), ch: [{ t: 'Do Lhoty.', go: 'lhota' }] },

    /* ---------- Lhota ---------- */
    lhota: { bg: 'lhota', mood: 'warm', npc: [{ id: 'bohous', x: .8 }], t: (G, A) => [
      'Lhota. Dvacet chalup, mlýn, statek Bohoušů a šibenice na návsi, nová, ještě voní smrkem.',
      A.inParty('ester') ? 'Ester se rozběhne k vratům statku. Starý muž s bílými vousy ji sevře tak, že jí luplo v zádech.' : 'Statkář Bohouš stojí ve vratech s vidlemi. Nevypadá, že by vítal hosty.',
      A.inParty('ester') ? S('bohous', 'Holka moje. Myslel jsem, že tě pověsili. Kdo je tohle?', 'sad') : S('bohous', 'Jestli jste od kancléře, nic už nemáme. Jestli od Řádu, nic jsme neviděli.', 'angry'),
      A.has('esterZajata') ? S('bohous', 'Moji dceru zavřeli v Popelově. Ester. Prý pytlačila. Pověsí ji v popravčí den.', 'sad') : null
    ], enter: (G, A) => { if (A.has('esterZajata')) A.quest('ester', 'Ester v žaláři', 'Ester, dceru statkáře Bohouše, zavřeli v Popelově. V popravčí den ji pověsí.'); }, ch: [{ t: 'Dál', go: 'l_situace' }] },
    l_situace: { bg: 'lhota', npc: [{ id: 'bohous', x: .8 }], t: (G, A) => [
      S('bohous', `Ve starém mlýně schováváme dračí lidi. Utekli ze Škváry. Je jich ${refugees(G)}, polovina děti.`, 'n'),
      S('bohous', 'A v poledne přijede bratr Kazimír z Řádu s žoldáky. Řekl, že jestli je nevydáme, zapálí Lhotu. Celou. Mám tu vnoučata, rozumíte? Vnoučata.', 'sad'),
      A.inParty('sarra') ? S('sarra', 'Ty děti ze mlýna znám jménem. Jestli je někdo vydá, bude mít co dělat se mnou.', 'angry') : null
    ], enter: (G, A) => A.quest('mlyn', 'Mlýn ve Lhotě', 'V poledne si pro uprchlíky ve mlýně přijde bratr Kazimír z Řádu. Jestli je vesnice nevydá, Lhota shoří.'), ch: [{ t: 'Dál', go: 'l_hub' }] },
    l_hub: { bg: 'lhota', npc: [{ id: 'bohous', x: .8 }], t: (G, A) => [A.has('lhotaHub') ? 'Slunce leze k poledni.' : 'Do poledne zbývá pár hodin.'], enter: (G, A) => A.set('lhotaHub'), ch: (G, A) => [
      { t: 'Zajít do mlýna za uprchlíky.', go: 'l_mlyn', if: () => !A.has('mlynByl') },
      { t: 'Najít dřevorubce na kraji lesa. Prý byl voják.', go: 'l_vojta', if: () => !A.has('vojtaByl') },
      { t: 'Připravit s vesničany past.', go: 'l_past', if: () => !A.has('lhotaPast') },
      { t: 'Čekat na Kazimíra.', go: 'l_kazimir' }
    ] },
    l_mlyn: { bg: 'mlyn', mood: 'warm', npc: [{ id: 'drakolid', x: .66 }, { id: 'drakolid', x: .8 }, { id: 'lid2', x: .92 }], enter: (G, A) => A.set('mlynByl'), t: (G, A) => [
      'Ve mlýně je dusno od strachu. Na seně sedí lidé s rohy, šupinami, popálenými dlaněmi. Děti se na tebe dívají uhlíkovýma očima.',
      S('drakolid', 'Jsem Žár, stařešina. Neprosíme o nic. Jen nás nevydávejte, dokud se děti nevyspí. Pak půjdeme sami. Do lesa. K vlkům. Vlci aspoň nekážou.', 'n'),
      A.race('drak') ? 'Jedno dítě ti sáhne na roh. Pak na svůj. Usměje se, jako by našlo zrcadlo.' : null
    ], ch: [
      { t: '„Nikdo vás nevydá. Slibuju.“', go: 'l_hub', ap: { sarra: 1, ester: 1, vojta: 1 }, fx: (G, A) => A.set('slibMlyn') },
      { t: 'Dát dětem jídlo ze zásob. (5 zl)', cost: 5, go: 'l_hub', ap: { sarra: 1, ester: 1 }, fx: (G, A) => A.set('slibMlyn') },
      { t: 'Neslibovat nic.', go: 'l_hub' }
    ] },
    l_vojta: { bg: 'les', mood: 'wind', npc: [{ id: 'vojta', x: .72 }], enter: (G, A) => A.set('vojtaByl'), t: (G, A) => [
      'Na kraji Černého lesa stojí srub. Velký chlap s plnovousem štípe dřevo, jako by každé poleno bylo něčí hlava.',
      S('vojta', 'Ať jsi kdo jsi, nic nekupuju a nic neprodávám. A do lesa nevodím. Les žere lidi.', 'n'),
      A.inParty('ester') ? S('ester', 'Vojto. To jsem já. Potřebujeme se dostat ke Dračímu hrádku.', 'n') : null,
      S('vojta', 'K hrádku… Proč?', 'shock')
    ], ch: (G, A) => [
      { t: '„Hledám draka Kýchala. Prý mě kdysi hlídal. V popelu Hořan.“', go: 'l_vojta_horany' },
      { t: '„Král umírá. Potřebuju dračí slzu.“', chk: { s: 'cha', dc: 12, ok: 'l_vojta_ok', no: 'l_vojta_ne' } },
      { t: 'Zaplatit mu za cestu. (15 zl)', cost: 15, go: 'l_vojta_ok' }
    ] },
    l_vojta_ne: { bg: 'les', npc: [{ id: 'vojta', x: .72 }], t: [S('vojta', 'Králové umírají. Na to jsou. Běž.', 'n')], ch: [{ t: '„Hledám Kýchala. Kvůli Hořanům.“', go: 'l_vojta_horany' }, { t: 'Odejít.', go: 'l_hub' }] },
    l_vojta_horany: { bg: 'les', npc: [{ id: 'vojta', x: .72 }], t: [
      'Sekera se zastaví ve vzduchu. Vojta ji pomalu položí.',
      S('vojta', 'Hořany. Byl jsem tam. Bylo mi osmnáct. Velel nám hrabě Vilém – dnes kancléř.', 'sad'),
      S('vojta', 'Hořany nespálil drak. Spálili jsme je my. Lidi i dračí lid, žili tam spolu, mlýn, kostel, svatby. Vilém řekl, že je to hnízdo. Pak řekl, že to udělali draci. Všichni jsme mlčeli.', 'sad'),
      S('vojta', 'V popelu jsme našli dítě. Starý drak nad ním stál a plakal. Vilém ho chtěl zabít – dítě i draka. Král Bořivoj ne. Vzal dítě do pláště a odjel. Já jsem ten den zahodil meč.', 'n'),
      S('vojta', 'Tak ty jsi to dítě. Bože.', 'shock')
    ], enter: (G, A) => { A.clue('horany', 'Vojta: Hořany nespálil drak, ale vojáci hraběte Viléma (dnes kancléře). Pak to svedli na draky. Vilém chtěl zabít i dítě z popela – mě.'); A.ap('vojta', 2, true); }, ch: [{ t: '„Pomoz mi. Prosím.“', go: 'l_vojta_ok' }] },
    l_vojta_ok: { bg: 'les', npc: [{ id: 'vojta', x: .72 }], t: [S('vojta', 'Dobře. Provedu tě lesem. A když v poledne přijede Kazimír… sekera pořád seká.', 'n')], enter: (G, A) => { A.join('vojta'); A.quest('les', 'Přes Černý les', 'Vojta mě provede Černým lesem ke Dračímu hrádku.'); }, ch: [{ t: 'Zpět do vesnice.', go: 'l_hub' }] },
    l_past: { bg: 'lhota', npc: [{ id: 'bohous', x: .7 }, { id: 'lid', x: .82 }, { id: 'lid2', x: .92 }], t: ['Sedláci mají cepy, kosy a jednu rezavou kuši po dědovi. A strach. Hodně strachu.'], ch: [
      { t: 'Vymyslet past: zátaras z vozů a past na koně v úvozu.', chk: { s: 'duv', dc: 12, ok: 'l_past_ok', no: 'l_past_no' } },
      { t: 'Promluvit k nim. Dodat jim odvahu.', chk: { s: 'cha', dc: 12, ok: 'l_past_ok', no: 'l_past_no' } },
      { t: 'Nechat je být.', go: 'l_hub' }
    ] },
    l_past_ok: { bg: 'lhota', npc: [{ id: 'bohous', x: .7 }, { id: 'lid', x: .82 }, { id: 'lid2', x: .92 }], t: ['Do poledne stojí v úvozu zátaras a za ním dvacet sedláků, kteří ještě ráno věřili, že nic nezmůžou.', S('bohous', 'Když to nevyjde, pověsí nás všechny. Ale aspoň ne na kolenou.', 'n')], enter: (G, A) => { A.set('lhotaPast'); A.ap('ester', 2); }, ch: [{ t: 'Dál', go: 'l_hub' }] },
    l_past_no: { bg: 'lhota', npc: [{ id: 'bohous', x: .7 }], t: ['Sedláci kývají a pak se jeden po druhém vytratí domů. Strach je silnější než slova.'], enter: (G, A) => A.set('lhotaPast', 0), ch: [{ t: 'Dál', go: 'l_hub' }] },
    l_kazimir: { bg: 'lhota', mood: 'tense', npc: [{ id: 'fanatik', x: .64 }, { id: 'fanatik', x: .76 }, { id: 'zoldak', x: .88 }, { id: 'zoldak', x: .98 }], t: (G, A) => [
      'Poledne. Prach na cestě. Bratr Kazimír v bílé masce, za ním fanatici a kancléřovi žoldáci.',
      S('fanatik', 'Lhoto! Vydejte šupinaté plemeno a Bledý plamen vás ušetří. Neuposlechnete – shoříte s nimi. Odpočítávám do sta.', 'angry'),
      S('bohous', 'Výsosti… Prosím. Mám tu vnoučata.', 'sad')
    ], ch: (G, A) => [
      { t: 'Postavit se jim. Bojovat.', tag: 'Boj', go: 'l_boj' },
      { t: '„Uprchlíci utekli do lesa. Tady máte jejich stopy.“ (falešná stopa)', chk: { s: 'duv', dc: 13, ok: 'l_lest', no: 'l_boj' } },
      { t: 'V plášti Řádu: „Bratře, tento mlýn už prohledal Řád. Já [[sám|sama]].“', if: () => A.item('plast'), chk: { s: 'cha', dc: 12, ok: 'l_lest', no: 'l_boj' } },
      { t: 'Vydat uprchlíky. Lhota se nesmí obětovat za cizí.', go: 'l_vydani' }
    ] },
    l_boj: { bg: 'lhota', mood: 'fight', fight: { foes: (G, A) => A.has('lhotaPast') ? ['fanatik', 'zoldak', 'zoldak'] : ['fanatik', 'fanatik', 'zoldak', 'zoldak'], intro: 'Sedláci za zátarasy zařvou. Kazimír tasí meč.', win: 'l_vyhra', lose: 'l_prohra', gold: 10 } },
    l_vyhra: { bg: 'lhota', npc: [{ id: 'bohous', x: .72 }, { id: 'drakolid', x: .86 }], t: (G, A) => [
      'Kazimír leží v prachu bez masky. Pod ní je obyčejná tvář. Tvář řezníka z Popelova, kterého znala celá Lhota.',
      'Z mlýna vycházejí lidé s rohy. Sedláci s cepy. Chvíli se na sebe dívají přes náves. Pak stařešina Žár podá Bohoušovi ruku.',
      A.inParty('ester') ? S('ester', 'Tohle mi nikdo neuvěří. Lhota se postavila Řádu. Kvůli tobě.', 'smile') : null
    ], enter: (G, A) => { G.f.lhota = 'branena'; A.set('lhotaSpojenec'); A.done('mlyn'); A.ap('ester', 2); A.ap('sarra', 2); A.ap('vojta', 1); A.done('lhota'); }, ch: [{ t: 'Na noc do tábora za vesnicí.', go: 'tabor1' }] },
    l_prohra: { bg: 'lhota', npc: [{ id: 'bohous', x: .72 }], t: ['Padneš. Když se probereš, mlýn hoří. Kazimír odvezl uprchlíky v řetězech do Popelova – na popravčí den. Lhota stojí. Tentokrát.', S('bohous', 'Snažil{a} ses. To je víc, než kdy kdo pro nás udělal.', 'sad')], enter: (G, A) => { G.f.lhota = 'prohra'; A.done('mlyn', false); A.set('uprchliciZajati'); }, ch: [{ t: 'Do tábora za vesnicí.', go: 'tabor1' }] },
    l_lest: { bg: 'lhota', npc: [{ id: 'fanatik', x: .7 }], t: ['Kazimír se skloní nad stopami, které ještě před hodinou nebyly. Zavrčí, zavelí a celý průvod odcválá k lesu – na opačnou stranu.', 'Za humny se Lhota smíchem chytá za břicho. Tiše. Velmi tiše.'], enter: (G, A) => { G.f.lhota = 'lest'; A.set('lhotaSpojenec'); A.done('mlyn'); A.ap('ester', 2); A.ap('plachta', 1); A.done('lhota'); }, ch: [{ t: 'Na noc do tábora.', go: 'tabor1' }] },
    l_vydani: { bg: 'lhota', mood: 'sad', npc: [{ id: 'fanatik', x: .7 }, { id: 'drakolid', x: .84 }], t: (G, A) => [
      'Kývneš. Bohouš se rozpláče úlevou. Fanatici vyvádějí z mlýna lidi s rohy. Děti nepláčou. To je nejhorší.',
      'Stařešina Žár se na tebe podívá, když ho vedou kolem. Neřekne nic. Nemusí.',
      A.inParty('sarra') ? S('sarra', 'Tak tohle jsi. Dobře, že to vím teď. Sbohem.', 'angry') : null,
      A.inParty('ester') ? S('ester', 'Táta je naživu. Já ti mám děkovat? Kurva. Nevím, jestli ti mám děkovat.', 'sad') : null
    ], enter: (G, A) => { G.f.lhota = 'vydani'; A.set('uprchliciZajati'); A.done('mlyn', false); A.inc('temnota', 2); if (A.inParty('sarra')) { A.ap('sarra', -10); A.leave('sarra', 'odchází. Navždy'); } A.ap('ester', -3); A.ap('vojta', -3); A.set('lhotaSpojenec'); }, ch: [{ t: 'Odejít z vesnice.', go: 'tabor1' }] },

    /* ---------- tábor 1 ---------- */
    tabor1: { bg: 'tabor', mood: 'warm', npc: [], cp: 1, enter: (G, A) => { A.rest(); }, t: (G, A) => [
      'Oheň, hvězdy, sova. Poprvé v životě spíš pod nebem. Je větší, než sis myslel{a}. A tišší.',
      G.party.filter(c => c !== 'plachta').length ? 'Družina sedí kolem ohně. Každý mlčí jinak.' : 'Sedíš u ohně [[sám|sama]] s veverkou. Možná je to tak lepší.'
    ], ch: (G, A) => [
      { t: 'Přisednout si k Ester.', if: () => A.inParty('ester'), go: 't1_ester' },
      { t: 'Přisednout si k Vojtovi.', if: () => A.inParty('vojta'), go: 't1_vojta' },
      { t: 'Přisednout si k Sarře.', if: () => A.inParty('sarra'), go: 't1_sarra' },
      { t: 'Přisednout si k Radimovi.', if: () => A.inParty('radim'), go: 't1_radim' },
      { t: 'Přisednout si k Plachtičce.', go: 't1_plachta' },
      { t: 'Jít spát.', go: 'les' }
    ] },
    t1_ester: { bg: 'tabor', npc: [{ id: 'ester', x: .66 }], t: (G, A) => [
      S('ester', 'Víš, co je na tobě divný? Díváš se na všechno, jako bys to viděl{a} poprvé. Oheň, les, mě.', 'n'),
      S('ester', A.ap && (G.ap.ester || 0) >= 3 ? 'Líbí se mi to. Nikdo se na mě nedíval, jako bych byla něco nového. Spíš jako na něco, co se dá sebrat.' : 'Nevím, jestli se mi to líbí.', 'smirk')
    ], ch: (G, A) => [
      { t: '[♥] „Protože jsi. Něco nového.“', tag: '♥', if: () => (G.ap.ester || 0) >= 2, go: 't1_ester_flirt' },
      { t: '„Pověz mi o Lhotě. O tom, jak jsi vyrůstala.“', go: 't1_ester_rec', ap: { ester: 1 } },
      { t: '„Dobrou noc, Ester.“', go: 'les' }
    ] },
    t1_ester_flirt: { bg: 'tabor', npc: [{ id: 'ester', x: .66 }], t: [S('ester', 'To byla nejhorší věta, jakou jsem kdy slyšela. A já slyšela opilýho faráře na svatbě.', 'smile'), 'Ale neodtáhne se. Dívá se do ohně a ruka jí leží kousek od tvé. Jen kousek.'], enter: (G, A) => { A.set('flirt_ester'); A.ap('ester', 1); }, ch: [{ t: 'Nechat to tak. Spát.', go: 'les' }] },
    t1_ester_rec: { bg: 'tabor', npc: [{ id: 'ester', x: .66 }], t: [S('ester', 'Máma umřela, když mi bylo osm. Hlad. Táta pak pil a já jsem se naučila střílet, abychom měli co jíst. Bratra pověsili za srnu. Za srnu, chápeš? Já od té doby střílím jen jejich srny. Z principu.', 'n')], ch: [{ t: 'Dál', go: 'les' }] },
    t1_vojta: { bg: 'tabor', npc: [{ id: 'vojta', x: .66 }], t: [S('vojta', 'Dvacet let nespím. Pokaždé, když zavřu oči, vidím Hořany. A teď vidím tebe. To dítě v popelu. Jak jsi vyrostl{a}.', 'sad')], ch: (G, A) => [
      { t: '„Nebyla to tvoje vina. Byl jsi kluk a měl jsi rozkaz.“', go: 't1_vojta_odp', ap: { vojta: 2 } },
      { t: '„Byla. Ale můžeš ji odčinit.“', go: 't1_vojta_odp', ap: { vojta: 1 } },
      { t: '[♥] Položit mu ruku na tvář. „Teď vidíš mě. Ne popel.“', tag: '♥', if: () => (G.ap.vojta || 0) >= 2, go: 't1_vojta_flirt' }
    ] },
    t1_vojta_odp: { bg: 'tabor', npc: [{ id: 'vojta', x: .66 }], t: [S('vojta', 'Možná. Možná ne. Ale dneska poprvé nemám chuť se opít. To je něco.', 'n')], ch: [{ t: 'Spát.', go: 'les' }] },
    t1_vojta_flirt: { bg: 'tabor', npc: [{ id: 'vojta', x: .66 }], t: ['Velký chlap ztuhne jako srna. Pak si přitiskne tvou dlaň víc k tváři a zavře oči.', S('vojta', 'Tohle bys neměl{a}. Já jsem starý, rozbitý a smrdím kouřem.', 'n'), S('vojta', 'Ale nepouštěj mě. Ještě chvíli ne.', 'sad')], enter: (G, A) => { A.set('flirt_vojta'); A.ap('vojta', 1); }, ch: [{ t: 'Spát.', go: 'les' }] },
    t1_sarra: { bg: 'tabor', npc: [{ id: 'sarra', x: .66 }], t: [S('sarra', 'Víš, proč mám kladivo? Protože meč nám zakázali nosit. Kladivo je nářadí. Nářadí smí mít i zvíře.', 'angry'), S('sarra', 'Až tohle skončí, chci, aby moje neteř mohla nosit meč. A nikdo jí neřekl šupinačko.', 'n')], ch: (G, A) => [
      { t: '„Až budu vládnout, dračí lid bude mít stejná práva. Přísahám.“', go: 't1_sarra_odp', ap: { sarra: 2 }, fx: (G2, A2) => A2.set('slibPrava') },
      { t: '„Nejdřív musím přežít. Pak uvidíme.“', go: 't1_sarra_odp', ap: { sarra: -1 } },
      { t: '[♥] „Řekni mi, jaké to je – chrlit oheň.“ Přisednout blíž.', tag: '♥', if: () => (G.ap.sarra || 0) >= 2, go: 't1_sarra_flirt' }
    ] },
    t1_sarra_odp: { bg: 'tabor', npc: [{ id: 'sarra', x: .66 }], t: [S('sarra', 'Slova. Ale tvoje slova zatím vždycky něco stála. Uvidíme.', 'n')], ch: [{ t: 'Spát.', go: 'les' }] },
    t1_sarra_flirt: { bg: 'tabor', npc: [{ id: 'sarra', x: .66 }], t: [S('sarra', 'Jako by ti v hrudi hořela kovárna a ty jsi měchy. Pálí to. Je to krásný.', 'smirk'), 'Vydechne do noci malý plamínek. Osvítí ti tvář. Nechá ho hořet o chvilku déle, než je nutné.'], enter: (G, A) => { A.set('flirt_sarra'); A.ap('sarra', 1); }, ch: [{ t: 'Spát.', go: 'les' }] },
    t1_radim: { bg: 'tabor', npc: [{ id: 'radim', x: .66 }], t: [S('radim', 'Donesl jsem králi jed. Svýma rukama. Dvacet let služby a tohle je to, co si o mně zapamatují.', 'sad')], ch: (G, A) => [
      { t: '„Zapamatují si, co uděláš teď.“', go: 't1_radim_odp', ap: { radim: 2 } },
      { t: '„Ano. To si zapamatují.“', go: 't1_radim_odp', ap: { radim: -1 } },
      { t: '[♥] „Já si zapamatuju tohle.“ Sundat mu rukavici a vzít ho za ruku.', tag: '♥', if: () => (G.ap.radim || 0) >= 3, go: 't1_radim_flirt' }
    ] },
    t1_radim_odp: { bg: 'tabor', npc: [{ id: 'radim', x: .66 }], t: [S('radim', 'Spěte, Výsosti. Budu hlídat. Aspoň to umím.', 'n')], ch: [{ t: 'Spát.', go: 'les' }] },
    t1_radim_flirt: { bg: 'tabor', npc: [{ id: 'radim', x: .66 }], t: ['Ruka je mozolnatá, plná jizev. Chvíli se třese. Pak se uklidní.', S('radim', 'Tohle je proti všem předpisům, Výsosti.', 'n'), S('radim', '…Žádný předpis to výslovně nezakazuje.', 'smirk')], enter: (G, A) => { A.set('flirt_radim'); A.ap('radim', 1); }, ch: [{ t: 'Spát.', go: 'les' }] },
    t1_plachta: { bg: 'tabor', npc: [{ id: 'plachta', x: .6 }], t: [S('plachta', 'Jestli se pokusíš o něco romantickýho, ukousnu ti nos. Jen abys věděl{a}. Jsem veverka. Mám standardy.', 'angry'), S('plachta', 'Ale… jsem ráda, že jsme venku. Dvacet let jsem ti krádla medovinu a ty jsi mi nikdy nic neřekl{a}. To je přátelství. Nebo blbost.', 'n')], enter: (G, A) => A.ap('plachta', 1), ch: [{ t: 'Podrbat ji za uchem.', go: 'les' }, { t: 'Spát.', go: 'les' }] },

    /* ---------- Černý les ---------- */
    les: { bg: 'les', mood: 'wind', npc: [], snd: 'sova', t: (G, A) => [
      'Černý les. Stromy jako spálené kosti, mlha po pás. Ani pták. Jen sova, jednou, daleko.',
      'Mezi kmeny se rozsvítí žluté oči. Dvoje. Šestery. Vlci. Hubení, šediví, hladoví.',
      A.inParty('vojta') ? S('vojta', 'Nedívej se jim do očí. Pomalu. Znám tuhle smečku. Když půjdeme po větru, nechají nás.', 'n') : null
    ], ch: (G, A) => [
      { t: 'Poslechnout Vojtu a jít po větru.', if: () => A.inParty('vojta'), chk: { s: 'mou', dc: 10, ok: 'les2', no: 'les_vlci' } },
      { t: 'Ustoupit pomalu, nedívat se do očí.', chk: { s: 'mou', dc: 13, ok: 'les2', no: 'les_vlci' } },
      { t: '[Půlelf] Promluvit k vlkům jejich řečí, kterou ti zpívala krev.', if: () => A.race('elf'), chk: { s: 'mou', dc: 9, ok: 'les2', no: 'les_vlci' } },
      { t: 'Tasit zbraň.', tag: 'Útok', go: 'les_vlci' }
    ] },
    les_vlci: { bg: 'les', mood: 'fight', fight: { foes: ['vlk', 'vlk', 'vlk'], intro: 'Smečka zaútočí ze tří stran najednou.', win: 'les2', lose: 'les_prohra', flee: 'les2' } },
    les_prohra: { bg: 'les', npc: [], t: ['Vlci tě srazí. Kousnutí do ramene, do lýtka. Pak se zčistajasna stáhnou – něco v lese je vyděsilo víc než ty.'], enter: (G, A) => A.hurt(4), ch: [{ t: 'Belhat se dál.', go: 'les2' }] },
    les2: { bg: 'vedma', mood: 'dark', npc: [{ id: 'vedma', x: .8 }], t: [
      'Uprostřed lesa stojí chýše na kořenech jako na kuřecích nohou. Kolem visí kosti na provázcích a cinkají, i když nefouká.',
      'Ve dveřích stojí stará žena s očima bílýma jako mléko. Slepá. Přesto se dívá přímo na tebe.',
      S('vedma', 'Dítě z popela. Konečně. Čekám na tebe dvacet let a ty si dáváš na čas.', 'smirk')
    ], ch: (G, A) => [
      { t: '„Kdo jsi?“', go: 'v_kdo', if: () => !A.has('vKdo') },
      { t: '„Řekni mi budoucnost.“', go: 'v_proroctvi', if: () => !A.has('vProroctvi') },
      { t: 'Ukázat jí zašifrovaný dopis.', if: () => A.item('dopis') && !A.hasClue('dopis'), go: 'v_dopis' },
      { t: 'Přečti mi lékárníkovu knihu.', if: () => A.has('knihaNeprectena') && !A.hasClue('kniha'), go: 'v_kniha' },
      { t: 'Koupit lektvary. (10 zl za dva)', cost: 10, go: 'les2', fx: (G2, A2) => A2.give('lektvar', 2) },
      { t: '„Co víš o královně?“', go: 'v_kralovna', if: () => !A.has('vKralovna') },
      { t: 'Zabít čarodějnici. Takovým se nevěří.', tag: 'Útok', go: 'v_boj' },
      { t: 'Pokračovat ke zřícenině.', go: 'zricenina' }
    ] },
    v_kdo: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [S('vedma', 'Kdysi porodní bába v Hořanech. Rodila jsem lidské i dračí děti, dokud mi oči nespálil ten oheň. Teď vidím jinak. Hůř a víc.', 'n')], enter: (G, A) => A.set('vKdo'), ch: [{ t: 'Dál', go: 'les2' }] },
    v_proroctvi: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [
      S('vedma', 'Vidím tři koruny. Jednu z popela – lehkou, protože je z toho, co zbylo. Jednu ze železa – těžkou, protože ji drží strach. A jednu, kterou nikdo nenosí, protože ji všichni nesou spolu.', 'n'),
      S('vedma', 'Vidím slzu, která může zachránit jen jednoho. A husu. Proč vidím husu? Nevím. Osud má smysl pro humor.', 'smirk'),
      S('vedma', 'A vidím oheň, který přiletí z hor. Jestli ho pozveš s nenávistí, spálí všechno. Jestli s láskou, spálí jen to, co má.', 'n')
    ], enter: (G, A) => A.set('vProroctvi'), ch: [{ t: 'Dál', go: 'les2' }] },
    v_dopis: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [S('vedma', 'Slepá žena a šifra. Vtipné. Řekni mi písmena, já ti řeknu smysl. Ale něco to stojí.', 'smirk')], ch: [
      { t: 'Zaplatit krví.', go: 'v_dopis_ok', fx: (G, A) => A.hurt(5) },
      { t: 'Zaplatit vzpomínkou. (−1 Moudrost)', go: 'v_dopis_ok', fx: (G, A) => { G.st.mou--; A.toast('Moudrost −1. Zapomněl{a} jsi Hedvičin hlas.'.replace('{a}', G.sex === 'f' ? 'a' : '')); } },
      { t: 'Zaplatit zlatem. (15 zl)', cost: 15, go: 'v_dopis_ok' },
      { t: 'Rozmyslím si to.', go: 'les2' }
    ] },
    v_dopis_ok: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [S('vedma', '„Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. – V.“', 'n'), S('vedma', 'Hořany. Řád dostane popel, který sám nadělal. To je spravedlnost úředníků.', 'angry')], enter: (G, A) => A.clue('dopis', 'Dopis kancléře Řádu: „Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. – V.“'), ch: [{ t: 'Dál', go: 'les2' }] },
    v_kniha: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: ['Vědma přejede prsty po stránce jako po tváři.', S('vedma', '„Černá rosa – jedna lahvička – převzal R. K. – na účet Kancléřství.“ Otisk je hluboký. Kdo psal, ten se bál.', 'n')], enter: (G, A) => A.clue('kniha', 'Lékárníkova kniha: „Černá rosa – 1 lahvička – převzal R. K. – na účet Kancléřství.“'), ch: [{ t: 'Dál', go: 'les2' }] },
    v_kralovna: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [S('vedma', 'Ta žena tě nemiluje míň proto, že tě zavřela. Miluje tě špatně. To je rozdíl. A někdo jí každý večer leje do poháru mlhu, aby milovala ještě hůř.', 'n'), S('vedma', 'Až bude stát na kraji, podej jí ruku. Nebo ji strč. Obojí bude tvoje volba.', 'n')], enter: (G, A) => { A.set('vKralovna'); A.clue('kralovnaMlha', 'Vědma: královně někdo každý večer leje do poháru „mlhu“.'); }, ch: [{ t: 'Dál', go: 'les2' }] },
    v_boj: { bg: 'vedma', mood: 'fight', fight: { foes: [{ id: 'vedma', boss: true }], intro: 'Kosti na provázcích začnou cinkat jako zvony. Vědma se směje.', win: 'v_mrtva', lose: 'v_proklety' } },
    v_mrtva: { bg: 'vedma', npc: [{ id: 'vedma', pose: 'dead', x: .8 }], t: ['Stará žena leží na prahu. Kosti přestaly cinkat. Les je najednou mnohem tišší, a to není dobře.', S('plachta', 'Ona tě čekala dvacet let. A tys ji zabil{a}. Hezký.', 'sad')], enter: (G, A) => { A.inc('temnota', 2); A.ap('vojta', -2); A.ap('ester', -2); A.give('lektvar', 3); A.set('vedmaMrtva'); }, ch: [{ t: 'Ke zřícenině.', go: 'zricenina' }] },
    v_proklety: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [S('vedma', 'Hloupé dítě. Neprokleju tě. [[Ty sám|Ty sama]] jsi prokletí. Jdi.', 'angry'), 'Probudíš se na kraji lesa, ke zřícenině blíž, než bys čekal{a}.'], ch: [{ t: 'Ke zřícenině.', go: 'zricenina' }] },

    /* ---------- Dračí hrádek ---------- */
    zricenina: { bg: 'zricenina', mood: 'wind', npc: [], cp: 1, t: (G, A) => [
      'Dračí hrádek. Měsíc velký jako štít, věže rozbité jako zuby po rvačce. Vrány na cimbuří.',
      'Brána zeje dokořán. Příliš dokořán. Na prahu je rozházená kost, a kosti se samy nerozhazují.',
      A.inParty('sarra') ? S('sarra', 'Tady… tady žili moji předkové? V pohádkách to bylo větší.', 'n') : null
    ], ch: [
      { t: 'Prozkoumat práh, než vkročíš.', chk: { s: 'duv', dc: 13, ok: 'z_past_ok', no: 'z_past' } },
      { t: 'Přeskočit práh a doufat.', chk: { s: 'obr', dc: 13, ok: 'krypta', no: 'z_past' } },
      { t: 'Poslat napřed Plachtičku.', go: 'z_plachta' }
    ] },
    z_plachta: { bg: 'zricenina', npc: [{ id: 'plachta', x: .55 }], t: [S('plachta', 'Jasně, pošli veverku. Veverka je levná.', 'angry'), { t: 'Šlápne na dlaždici. Z boku vylétnou tři rezavé čepele – a minou ji, protože je velká jako bota. Zato ty jsi stál{a} přímo za ní.', shake: 8 }, S('plachta', 'Pardon. Vlastně ne, nepardon.', 'smirk')], enter: (G, A) => A.hurt(3), ch: [{ t: 'Dovnitř.', go: 'krypta' }] },
    z_past: { bg: 'zricenina', npc: [], t: [{ t: 'Dlaždice cvakne. Z boku vyletí čepel a projede ti stehnem.', shake: 10 }], enter: (G, A) => A.hurt(5), ch: [{ t: 'Dovnitř.', go: 'krypta' }] },
    z_past_ok: { bg: 'zricenina', npc: [], t: ['Tenký drát. Uvolněná dlaždice. Někdo tu nastražil past – a ne před sto lety. Před pár dny. Řád ví, že sem někdo chodí.'], ch: [{ t: 'Dovnitř.', go: 'krypta' }] },
    krypta: { bg: 'krypta', mood: 'dark', npc: [{ id: 'kostlivec', x: .66 }, { id: 'kostlivec', x: .8 }, { id: 'kostlivec', x: .94 }], t: [
      'Krypta Řádu. Rytíři, kteří sem kdysi přišli zabít draka, tu leží na kamenných sarkofázích. Nebo leželi.',
      'Kosti se zvedají. Brnění zarezlé, oči rudé jako uhlíky. Pořád mají rozkaz. Nikdo ho neodvolal.'
    ], ch: [{ t: 'Rozbít je.', tag: 'Útok', fight: { foes: ['kostlivec', 'kostlivec', 'kostlivec'], win: 'k_sabina', lose: 'k_prohra' } }] },
    k_prohra: { bg: 'krypta', npc: [], t: ['Ležíš mezi sarkofágy. Kostlivci se zastavili – nad tebou, jako by čekali na rozkaz, který nepřišel. Pak se rozpadnou. Někdo jiný je přerušil.'], ch: [{ t: 'Zvednout se.', go: 'k_sabina' }] },
    k_sabina: { bg: 'krypta', mood: 'tense', npc: [{ id: 'fanatik', x: .7 }, { id: 'sabina', x: .82 }, { id: 'fanatik', x: .94 }], t: (G, A) => [
      'Za tebou zazvoní kroky. Bílé kápě. Pochodně. Inkvizitorka Sabina.',
      S('sabina', A.has('sabinaNepritel') ? 'Řekla jsem, že Bledý plamen nezapomíná. Šla jsem po tvé stopě dva dny. Kancléř ti vzkazuje, že se má věž po tobě stýská.' : 'Dědic. Ve dračím hrobě. Kancléř měl pravdu – přišel{a} jsi probudit draka.', 'angry'),
      S('sabina', 'Kde je ta stvůra? Tvoje cesta končí tady. A jeho taky.', 'n')
    ], ch: (G, A) => [
      { t: `Ukázat jí kancléřův dopis a říct pravdu o Hořanech.`, if: () => A.hasClue('dopis') && A.hasClue('horany'), chk: { s: 'cha', dc: A.has('sabinaPochopena') ? 9 : 12, ok: 's_obrat', no: 'k_boj' } },
      { t: '„Hořany nespálil drak, Sabino. Spálil je Vilém.“', if: () => A.hasClue('horany') && !A.hasClue('dopis'), chk: { s: 'cha', dc: A.has('sabinaPochopena') ? 13 : 16, ok: 's_obrat', no: 'k_boj' } },
      { t: 'Bojovat.', tag: 'Boj', go: 'k_boj' }
    ] },
    k_boj: { bg: 'krypta', mood: 'fight', fight: { foes: [{ id: 'sabina', boss: true }, 'fanatik', 'fanatik'], intro: 'Sabina zvedne hůl. Na jejím konci vzplane bledý plamen, který nehřeje, ale pálí.', win: 'k_sabina_por', lose: 'k_sabina_prohra' } },
    k_sabina_prohra: { bg: 'krypta', npc: [{ id: 'sabina', x: .8 }], t: ['Ležíš na zádech. Sabina nad tebou zvedá hůl k poslednímu úderu – a vtom se celou kryptou rozlehne řev. Prach padá ze stropu. Fanatici utečou. Sabina se zaváhá, pak zmizí taky.', { t: 'Ze tmy pod kryptou se ozve obrovské, zahleněné *HAPČÍÍÍ* a chodbou prolétne ohnivá koule.', snd: 'kych', shake: 14 }], enter: (G, A) => { G.f.sabina = 'zive'; }, ch: [{ t: 'Jít za tím zvukem.', go: 'k_hadanka' }] },
    k_sabina_por: { bg: 'krypta', npc: [{ id: 'sabina', x: .8, pose: 'kneel' }], t: ['Sabina klečí. Hůl zlomená, kápě roztržená. Zjizvená tvář je mokrá. Pot, nebo slzy.', S('sabina', 'Dokonči to. Bledý plamen mě přijme.', 'n')], ch: (G, A) => [
      { t: 'Ušetřit ji. „Jdi. A přemýšlej, komu sloužíš.“', go: 'k_hadanka', fx: (G2, A2) => { G2.f.sabina = 'zive'; A2.ap('vojta', 1); A2.ap('sarra', -1); } },
      { t: '„Hořany spálil Vilém. Ty jsi jen jeho pochodeň.“', if: () => A.hasClue('horany'), go: 's_obrat' },
      { t: 'Dokončit to.', tag: 'Zabít', go: 'k_hadanka', fx: (G2, A2) => { G2.f.sabina = 'mrtva'; A2.ap('sarra', 2); A2.ap('vojta', -1); A2.inc('temnota'); A2.clue('sabinaMrtva', 'Sabina, inkvizitorka Řádu, je mrtvá. Kancléř přišel o svou pochodeň.'); } }
    ] },
    s_obrat: { bg: 'krypta', npc: [{ id: 'sabina', x: .8 }], t: [
      'Sabina čte. Jednou. Podruhé. Ruce se jí začnou třást tak jako Hedvice tu noc ve věži.',
      S('sabina', 'Hořany… Já jsem z Hořan. Lidské dítě. Bydleli jsme vedle kovárny dračího lidu. Jejich holka mě učila plavat.', 'shock'),
      S('sabina', 'Řád mě našel v popelu a řekl mi, kdo to udělal. Dvacet let jsem pálila sousedy té holky. Pro něj.', 'sad'),
      S('sabina', 'Bledý plamen nebyl stvořen pro kancléřovy vraždy. Až se vrátíš do Popelova, budu tam. A tentokrát budu pálit správně.', 'angry')
    ], enter: (G, A) => { G.f.sabina = 'obracena'; A.clue('sabina', 'Sabina, inkvizitorka Řádu, uvěřila. Je z Hořan. Postaví se kancléři.'); A.ap('vojta', 2); A.ap('sarra', 1); }, ch: [{ t: 'Pokračovat hlouběji.', go: 'k_hadanka' }] },
    k_hadanka: { bg: 'krypta', npc: [], t: [
      'Na konci krypty jsou kamenné dveře s dračí hlavou. V tlamě je vyryto:',
      '*„Čím víc z ní bereš, tím je větší. Kopáč ji dělá, král do ní padá. Co jsem?“*',
      S('plachta', 'Moje žízeň! Ne? Kurva.', 'n')
    ], ch: [
      { t: '„Jáma.“', go: 'doupe' },
      { t: '„Popel.“', go: 'k_hadanka_spatne' },
      { t: '„Koruna.“', go: 'k_hadanka_spatne' },
      { t: 'Přemýšlet.', chk: { s: 'duv', dc: 11, ok: 'k_hadanka_napoveda', no: 'k_hadanka_spatne' } }
    ] },
    k_hadanka_napoveda: { bg: 'krypta', npc: [], t: ['Čím víc bereš, tím je větší… Hlína. Rýč. Hrob. Jáma.'], ch: [{ t: '„Jáma.“', go: 'doupe' }] },
    k_hadanka_spatne: { bg: 'krypta', npc: [], t: [{ t: 'Z dračí tlamy vyšlehne plamen a ožehne ti obočí. Dveře se nehnou. Plachtička mezitím kopne do páky vedle dveří, kterou nikdo z vás neviděl, a dveře se otevřou.', shake: 6 }, S('plachta', 'Hádanky jsou pro lidi s časem. Páky jsou pro veverky.', 'smirk')], enter: (G, A) => A.hurt(3), ch: [{ t: 'Dál.', go: 'doupe' }] },

    /* ---------- Kýchal ---------- */
    doupe: { bg: 'doupe', mood: 'sad', npc: [{ id: 'kychal', x: .78 }], snd: 'rev', t: (G, A) => [
      'Doupě. Prasklinou v klenbě sem padá měsíc na hromadu zlata. Na zlatě leží drak.',
      'Je obrovský a starý. Šupiny matné, jeden roh ulomený, jedno oko mléčné. Dech mu chrčí jako měchy v zimě.',
      { w: 'kychal', t: 'Kdo leze do mého hrobu? Další rytíř? Pojď blíž, ať tě… ať tě… HAPČÍ!', m: 'sneeze', snd: 'kych', shake: 12 },
      'Ohnivá koule proletí metr nad tvou hlavou a roztaví svícen. Drak si utře nos pařátem.',
      S('kychal', 'Pardon. Dvacet let rýma. Tady je vlhko. …Počkej. Ten pach.', 'n'),
      S('kychal', 'Popel z Hořan. Dítě, které jsem nesl v tlamě z ohně. Vrátil{a} ses.', 'sad')
    ], enter: (G, A) => A.clue('kychal', 'Drak Kýchal žije. Pamatuje si mě jako dítě, které vynesl z ohně Hořan.'), ch: (G, A) => [
      { t: '„Kdo jsem? Kde jsem se tam vzal{a}?“', go: 'd_puvod', if: () => !A.has('dPuvod') },
      { t: '„Král Bořivoj umírá. Potřebuju tvou slzu.“', go: 'd_slza', if: () => A.has('dPuvod') }
    ] },
    d_puvod: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: (G, A) => [
      A.race('drak') ? S('kychal', 'Jsi z dračího lidu, z rodu kovářů. Tvá matka mi nosila sýr, když jsem byl nemocný. Tvůj otec mi spravoval šupiny. Oba shořeli.', 'sad')
        : A.race('elf') ? S('kychal', 'Tvá matka byla elfka z lesů, otec mlynář. V Hořanech se nikdo neptal, kdo je čí krve. Proto Hořany musely shořet.', 'sad')
        : A.race('trpaslik') ? S('kychal', 'Tvoji rodiče byli trpasličí zvonaři. Ulili zvon pro hořanský kostel. Ten zvon zvonil, když přišli vojáci. Pak už nezvonil.', 'sad')
        : S('kychal', 'Tví rodiče byli lidé, pekař a švadlena. Žili v Hořanech, kde lidé a dračí lid jedli u jednoho stolu. Za to je Vilém spálil.', 'sad'),
      S('kychal', 'Vilém přišel s vojáky a s lží. Mou družku Žárovku zabili, když bránila mlýn. Mé děti… jsou tady. Na tom zlatě leží jejich kosti.', 'sad'),
      S('kychal', 'Vynesl jsem tě z ohně. Bořivoj tě vzal. Já se schoval sem, s jedním vejcem, které už dvacet let nevychladlo – a nevylíhlo se.', 'n'),
      'Za drakovým bokem uvidíš vejce velké jako sud. Černé, popraskané, studené.'
    ], enter: (G, A) => A.set('dPuvod'), ch: [{ t: 'Dál', go: 'd_slza' }] },
    d_slza: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: [
      S('kychal', 'Slza. Draci pláčou jen ze dvou důvodů: ze žalu tak velkého, že se nevejde do těla. Nebo ze štěstí, kterého se už nedočkali.', 'n'),
      S('kychal', 'Já už dvacet let nepláču. Vyschnul jsem. Tak mi dej důvod, dítě.', 'n')
    ], ch: (G, A) => [
      { t: '„Dračí lid ve Škváře žije. Postavil{a} jsem se za ně.“', if: () => G.f.skvara === 'branena' || G.f.skvara === 'odlozena', go: 'd_radost' },
      { t: '„Lhota schovala dračí děti a ubránila je před Řádem.“', if: () => G.f.lhota === 'branena' || G.f.lhota === 'lest', go: 'd_radost' },
      { t: '[Mág] Zahřát vejce ohněm.', if: () => A.cls('mag'), chk: { s: 'duv', dc: 12, ok: 'd_vejce', no: 'd_vejce_ne' } },
      { t: '[Dračí krev] Obejmout vejce a vdechnout do něj svůj oheň.', if: () => A.race('drak'), chk: { s: 'odl', dc: 11, ok: 'd_vejce', no: 'd_vejce_ne' } },
      { t: 'Sarra: „Nech mě to zkusit. Mám v sobě oheň.“', if: () => A.inParty('sarra') && !A.race('drak'), chk: { s: 'cha', dc: 10, ok: 'd_vejce', no: 'd_vejce_ne' } },
      { t: 'Mluvit s ním o jeho dětech. O Žárovce. Nechat ho truchlit.', chk: { s: 'mou', dc: 13, ok: 'd_zal', no: 'd_odmita' } },
      { t: '„Pomstím Hořany. Spálím Viléma i jeho Řád. Ty mi pomůžeš.“', go: 'd_pomsta' },
      { t: 'Vzít si slzu i krev silou.', tag: 'Útok', go: 'd_utok' }
    ] },
    d_odmita: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: [S('kychal', 'Slova, slova. Vyschnul jsem, říkám. Zkus to jinak – nebo jdi.', 'n')], ch: (G, A) => [
      { t: 'Zkusit to znovu, jinak.', go: 'd_slza' },
      { t: '„Pomstím Hořany. Ty mi pomůžeš.“', go: 'd_pomsta' }
    ] },
    d_radost: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: [
      'Drak dlouho mlčí. Pak se mu zachvěje víko na zdravém oku.',
      S('kychal', 'Oni žijí. Moji lidé žijí. A někdo… někdo z koruny za ně stál.', 'sad'),
      'Z oka mu sklouzne slza velká jako ořech. Zachytíš ji do lahvičky. Je horká a svítí.',
      S('kychal', 'Vezmi si i šupinu. Až budeš potřebovat oheň, který spálí jen to, co má, hoď ji do plamene. Přiletím.', 'n')
    ], enter: (G, A) => { A.set('slza'); G.f.slza = 'slza'; A.give('slza'); A.give('supina'); G.f.kychal = 'pritel'; A.done('slza'); A.ap('sarra', 3); }, ch: [{ t: 'Dál', go: 'd_odchod' }] },
    d_vejce: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: [
      'Oheň obejme černou skořápku. Chvíli se nic neděje. Pak – prásk. Prasklina. Druhá. Z vejce vystrčí hlavičku dráček velký jako kočka a hned kýchne. Malý plamínek.',
      { w: 'kychal', t: 'Ono… ono kýchá. Kýchá jako já.', m: 'sad', snd: 'kych' },
      'Starý drak pláče. Velké horké slzy padají do zlata a syčí. Jednu chytíš do lahvičky. A on si toho ani nevšimne.',
      S('kychal', 'Vezmi si i šupinu, dítě. Hoď ji do ohně, až budeš potřebovat křídla. Přiletím. My dva přiletíme.', 'smile')
    ], enter: (G, A) => { G.f.slza = 'slza'; A.give('slza'); A.give('supina'); G.f.kychal = 'pritel'; A.set('mlade'); A.done('slza'); A.ap('sarra', 4); A.ap('vojta', 2); A.ap('ester', 1); A.ap('plachta', 2); }, ch: [{ t: 'Dál', go: 'd_odchod' }] },
    d_vejce_ne: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: ['Skořápka zůstane studená. Drak si povzdechne – a z toho povzdechu se mu skoro zalesknou oči. Skoro.'], ch: [{ t: 'Zkusit něco jiného.', go: 'd_slza' }] },
    d_zal: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: ['Ptáš se na Žárovku. Jak se smála. Co jedla. Jak se jmenovaly jeho děti. Drak odpovídá. Nejdřív stroze, pak dlouze, pak už jen šeptá jména do zlata.', { w: 'kychal', t: 'Plamínek. Popelka. Uhlík. Jiskra. …Nikdo se mě na ně dvacet let nezeptal.', m: 'sad' }, 'Slza spadne do zlata. Druhou zachytíš.', S('kychal', 'Vezmi si i šupinu. Kdybys mě potřeboval{a}.', 'n')], enter: (G, A) => { G.f.slza = 'slza'; A.give('slza'); A.give('supina'); G.f.kychal = 'pritel'; A.done('slza'); A.ap('vojta', 2); }, ch: [{ t: 'Dál', go: 'd_odchod' }] },
    d_pomsta: { bg: 'doupe', mood: 'fire', npc: [{ id: 'kychal', x: .78 }], t: [
      'V drakově zdravém oku se něco rozhoří. Něco starého, co spalo dvacet let.',
      { w: 'kychal', t: 'Pomsta. Ano. Ano! Dvacet let jsem tu hnil a čekal, až mi to někdo řekne.', m: 'roar', snd: 'rev', shake: 14 },
      'Slza mu stéká po tváři. Horká, kalná, vzteklá. Zachytíš ji – svítí rudě.',
      S('kychal', 'Hoď šupinu do ohně, až budeš chtít. Přiletím. A Popelov si zapamatuje, proč se mu tak říká.', 'angry')
    ], enter: (G, A) => { G.f.slza = 'slza'; A.give('slza'); A.give('supina'); G.f.kychal = 'pomsta'; A.done('slza'); A.inc('temnota'); A.ap('sarra', 1); A.ap('vojta', -2); A.ap('ester', -1); }, ch: [{ t: 'Dál', go: 'd_odchod' }] },
    d_utok: { bg: 'doupe', mood: 'fight', npc: [{ id: 'kychal', x: .78 }], t: (G, A) => [
      A.inParty('sarra') ? S('sarra', 'Cože? Ne. NE. To ti nedovolím.', 'angry') : null,
      S('kychal', 'Takže další rytíř. Ach, dítě. Myslel jsem, že tě znám.', 'sad')
    ], enter: (G, A) => { if (A.inParty('sarra')) { A.ap('sarra', -10); A.leave('sarra', 'se obrací zády'); } A.ap('vojta', -4); A.ap('ester', -2); }, fight: { foes: [{ id: 'kychal', boss: true, hp: 70 }], noAllies: [], intro: 'Starý drak se zvedne ze zlata. Je pomalý. Ale je to pořád drak.', win: 'd_krev', lose: 'd_spalen' } },
    d_spalen: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: ['Oheň. Bolest. A pak – nic. Drak tě nespálil. Odfoukne tě do chodby jako smetí.', S('kychal', 'Jdi. Vezmi si svou slzu – tady. Plakal jsem, protože jsem se v tobě spletl. Je to taky žal.', 'sad')], enter: (G, A) => { G.f.slza = 'slza'; A.give('slza'); G.f.kychal = 'zklaman'; A.done('slza'); }, ch: [{ t: 'Odejít.', go: 'd_odchod' }] },
    d_krev: { bg: 'doupe', mood: 'sad', npc: [{ id: 'kychal', pose: 'dead', x: .78, blood: true }], t: [
      'Poslední drak leží na zlatě svých dětí. Krev z něj teče pomalu, tmavá, kouřící.',
      'Slza nepřišla. Draci pláčou jen ze žalu a ze štěstí. Ne z bolesti.',
      'Naplníš lahvičku krví. Stará pověst říká, že dračí krev léčí všechno. Neříká, co si vezme na oplátku.',
      S('plachta', 'Už se ke mně nepřibližuj. Prosím.', 'sad')
    ], enter: (G, A) => { G.f.slza = 'krev'; A.give('slza'); G.f.kychal = 'mrtvy'; A.inc('temnota', 3); A.done('slza'); A.ap('plachta', -5); G.f.bonusHp = (G.f.bonusHp || 0) + 6; A.toast('Napil{a} ses dračí krve. +6 životů. Něco v tobě ztvrdlo.'.replace('{a}', G.sex === 'f' ? 'a' : '')); }, ch: [{ t: 'Odejít.', go: 'd_odchod' }] },
    d_odchod: { bg: 'zricenina', mood: 'wind', npc: [], t: (G, A) => [
      'Vylezeš ze zříceniny za svítání. Lahvička na krku pálí jako uhlík.',
      'Pět dní cesty sem, dva zpátky. Král ještě dýchá – musí. Zítra večer budeš v Popelově. Pozítří ráno je popravčí den.',
      G.f.kychal === 'pritel' ? 'Za tebou se z rozpadlé věže ozve kýchnutí. A pak druhé, menší.' : null
    ], ch: [{ t: 'Rozbít tábor na noc.', go: 'tabor2' }] },

    /* ---------- tábor 2: romance ---------- */
    tabor2: { bg: 'tabor', mood: 'warm', npc: [], cp: 1, enter: (G, A) => A.rest(), t: (G, A) => [
      'Poslední noc před návratem. Nikdo nemluví o zítřku. Všichni na něj myslí.',
      G.f.rom ? `${T.C[G.f.rom].name.split(' ')[0]} na tebe přes oheň kouká jinak než včera.` : null
    ], ch: (G, A) => [
      { t: 'Najít Ester u potoka.', tag: (A.has('flirt_ester') ? '♥' : null), if: () => A.inParty('ester'), go: (G2) => A.has('flirt_ester') && (G2.ap.ester || 0) >= 4 ? 't2_ester_rom' : 't2_ester' },
      { t: 'Přisednout si k Vojtovi.', tag: (A.has('flirt_vojta') ? '♥' : null), if: () => A.inParty('vojta'), go: (G2) => A.has('flirt_vojta') && (G2.ap.vojta || 0) >= 4 ? 't2_vojta_rom' : 't2_vojta' },
      { t: 'Najít Sarru u ohně.', tag: (A.has('flirt_sarra') ? '♥' : null), if: () => A.inParty('sarra'), go: (G2) => A.has('flirt_sarra') && (G2.ap.sarra || 0) >= 4 ? 't2_sarra_rom' : 't2_sarra' },
      { t: 'Vystřídat Radima na hlídce.', tag: (A.has('flirt_radim') ? '♥' : null), if: () => A.inParty('radim'), go: (G2) => A.has('flirt_radim') && (G2.ap.radim || 0) >= 4 ? 't2_radim_rom' : 't2_radim' },
      { t: 'Spát. Zítra je zítra.', go: 'akt3' }
    ] },
    t2_ester: { bg: 'tabor', npc: [{ id: 'ester', x: .66 }], t: [S('ester', 'Zítra se vrátíme do města, kde mě chtěli pověsit za srnu. Vtipný, ne?', 'smirk'), S('ester', 'Díky. Za Lhotu. Za tátu. Za… prostě díky.', 'n')], enter: (G, A) => A.ap('ester', 1), ch: (G, A) => [{ t: '[♥] „Ester… zůstaň dnes se mnou.“', tag: '♥', if: () => (G.ap.ester || 0) >= 4, go: 't2_ester_rom' }, { t: 'Jít spát.', go: 'akt3' }] },
    t2_ester_rom: { bg: 'tabor', npc: [{ id: 'ester', x: .62 }], t: [
      'Ester sedí u potoka, bosé nohy ve vodě. Když si přisedneš, neřekne nic. Jen ti podá polovinu jablka.',
      S('ester', 'Víš, že jsi [[úplně šílený|úplně šílená]]? [[Princ|Princezna]] z věže a pytlačka z Lhoty. Táta by dostal infarkt.', 'smile'),
      S('ester', 'Ale víš co? Ať dostane.', 'smirk'),
      'Políbí tě. Chutná po jablku a kouři. Zbytek noci patří jen vám dvěma a potoku, který o tom nikomu neřekne.'
    ], enter: (G, A) => { A.romance('ester'); A.ap('ester', 2); A.sfx('love'); }, ch: [{ t: 'Ráno.', go: 'akt3' }] },
    t2_vojta: { bg: 'tabor', npc: [{ id: 'vojta', x: .66 }], t: [S('vojta', 'Zítra uvidím Popelov po dvaceti letech. A Viléma. Nevím, jestli udržím sekeru dole.', 'n')], ch: (G, A) => [{ t: '[♥] „Nemusíš nic udržet. Jen mě.“', tag: '♥', if: () => (G.ap.vojta || 0) >= 4, go: 't2_vojta_rom' }, { t: 'Jít spát.', go: 'akt3' }] },
    t2_vojta_rom: { bg: 'tabor', npc: [{ id: 'vojta', x: .66 }], t: [
      'Vojta se na tebe dívá dlouho. Ten pohled je těžký jako sekera, ale ruce, kterými tě pak obejme, jsou neuvěřitelně opatrné.',
      S('vojta', 'Dvacet let jsem se bál zavřít oči. Dnes v noci je zavřu. Když budeš vedle.', 'n'),
      'Oheň dohoří. Ani jeden z vás si toho nevšimne.'
    ], enter: (G, A) => { A.romance('vojta'); A.ap('vojta', 2); A.sfx('love'); }, ch: [{ t: 'Ráno.', go: 'akt3' }] },
    t2_sarra: { bg: 'tabor', npc: [{ id: 'sarra', x: .66 }], t: (G) => [S('sarra', G.f.kychal === 'pritel' ? 'Viděla jsem draka. Živého. Mluvil se mnou. Kdyby mi to někdo řekl před týdnem, rozbila bych mu hubu.' : 'Viděla jsem, co jsi udělal{a} v doupěti. Nevím, co si o tobě mám myslet.', 'n')], ch: (G, A) => [{ t: '[♥] Vzít ji za ruku se šupinami. „Mysli si tohle.“', tag: '♥', if: () => (G.ap.sarra || 0) >= 4, go: 't2_sarra_rom' }, { t: 'Jít spát.', go: 'akt3' }] },
    t2_sarra_rom: { bg: 'tabor', npc: [{ id: 'sarra', x: .66 }], t: [
      S('sarra', 'Šupiny škrábou. A rohy překážejí. Jen abys věděl{a}, do čeho jdeš.', 'smirk'),
      S('sarra', 'A jestli mi zítra umřeš, najdu tě na onom světě a zmlátím tě kladivem.', 'n'),
      'Její polibek pálí. Doslova. Ráno máš na rtu malý puchýř a nelituješ ani vteřinu.'
    ], enter: (G, A) => { A.romance('sarra'); A.ap('sarra', 2); A.sfx('love'); }, ch: [{ t: 'Ráno.', go: 'akt3' }] },
    t2_radim: { bg: 'tabor', npc: [{ id: 'radim', x: .66 }], t: [S('radim', 'Zítra budu zatýkat kancléře. Nebo mě pověsí vedle vás. Obojí je v pořádku. Konečně dělám něco správně.', 'n')], ch: (G, A) => [{ t: '[♥] „Nejdřív udělej správně tohle.“ Políbit ho.', tag: '♥', if: () => (G.ap.radim || 0) >= 4, go: 't2_radim_rom' }, { t: 'Jít spát.', go: 'akt3' }] },
    t2_radim_rom: { bg: 'tabor', npc: [{ id: 'radim', x: .66 }], t: [
      'Radim ztuhne, jako by dostal rozkaz, kterému nerozumí. Pak odepne meč, poprvé za celou cestu, a položí ho na zem.',
      S('radim', 'Hlídku dnes převezme Plachtička.', 'smirk'),
      S('plachta', 'Ani hovno.', 'angry'),
      'Ale nakonec hlídá. A bručí do tmy o lidech, kteří nemají žádné standardy.'
    ], enter: (G, A) => { A.romance('radim'); A.ap('radim', 2); A.sfx('love'); }, ch: [{ t: 'Ráno.', go: 'akt3' }] }
  });
})(window.T);
