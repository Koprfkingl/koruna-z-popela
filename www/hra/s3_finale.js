/* Koruna z popela – Dějství III: popravčí den, kancléř, slza, koruna, konce.
   Návod, jak tenhle soubor číst a co se v něm smí měnit, je na začátku
   souboru s0_prolog.js. Nad každou scénou je komentář: o jakou situaci jde
   a ze kterých scén se do ní dá dostat. */
(function (T) {
  'use strict';
  // S(kdo, text, výraz) = řeč postavy.
  const S = (w, t, m) => ({ w, t, m });
  // Seznam všech důkazů proti Vilémovi. Na veřejném soudu (f3_soud) se
  // počítá, kolik jich hráč má. Čím víc, tím spíš mu lidé uvěří.
  const GUILT = ['hlas', 'pirko', 'prsten', 'lek', 'dukat', 'kniha', 'svedek', 'najemnik', 'rozkaz', 'najemnici', 'dopis', 'horany', 'odmena', 'radim', 'sabina', 'kralovnaMlha'];
  const guilt = A => GUILT.filter(c => A.hasClue(c)).length;
  // Kdo všechno přijde hráči na pomoc ve finále. Závisí na tom, co hráč
  // udělal dřív (zachránil Škváru, Lhotu, spřátelil se s krysami...).
  const allies = (G, A) => {
    const a = [];
    if (A.has('drakSpojenec') && G.f.skvara !== 'zrada') a.push('dračí lid ze Škváry');
    if (A.has('lhotaSpojenec') && G.f.lhota !== 'vydani') a.push('sedláci z Lhoty');
    if (A.has('krysySpojenec') && !A.has('smudlaMrtvy')) a.push('Šmudlovy krysy');
    if (G.f.radim === 'spojenec') a.push('kapitán Radim a část stráže');
    if (G.f.sabina === 'obracena') a.push('Sabina a ti z Řádu, kdo jí věří');
    if (G.f.kychal === 'pritel' || G.f.kychal === 'pomsta') a.push('drak Kýchal (šupina)');
    return a;
  };
  T.allies = allies;
  // Je královna otrávená? Ano, pokud hráč v prologu nezjistil nic o jejím léku.
  const queenPoisoned = (G, A) => !(A.hasClue('lek') || A.has('kralovnaPochyba'));
  // Žije milovaná osoba hráče? (romance z tábořišť)
  const romAlive = G => G.f.rom && G.f.mrtvy !== G.f.rom;
  const fn = id => T.C[id].name.split(' ')[0];
  // Jména milovaných osob ve správném pádu: „Dát slzu Sarře“, „odejít se Sarrou“.
  const DAT = { ester: 'Ester', sarra: 'Sarře', vojta: 'Vojtovi', radim: 'Radimovi' }, INS = { ester: 'Ester', sarra: 'Sarrou', vojta: 'Vojtou', radim: 'Radimem' };

  Object.assign(T.N, {
    // ── akt3 ── Začátek Dějství III. Návrat k Vranovu, zítra je poprava.
    //    Sem se dostaneš z: tabor2, t2_ester, t2_ester_rom, t2_vojta, t2_vojta_rom, t2_sarra, t2_sarra_rom, t2_radim, t2_radim_rom
    akt3: { act: 'Dějství III · Popravčí den', bg: 'hrad', mood: 'tense', npc: [], cp: 1, enter: (G, A) => A.levelUp(), t: (G, A) => [
      'Druhého dne k večeru se před vámi z rovin zvedne Havraní skála a na ní Vranov. Slunce zapadá přímo za hradem, takže věže stojí černé proti rudému nebi, jako vystřižené z papíru, a celý hrad vypadá, jako by hořel zevnitř.',
      'Je to tvůj domov. Dvacet let jsi ho znal{a} jen zevnitř, jedno okno, jednu věž, jeden výhled. Teď se k němu vracíš zvenku, po prašné cestě, s mečem u pasu a s blátem na botách, jako [[cizinec|cizinka]]. A on se na tebe dívá, jako by tě neznal. Hrady nemají paměť. Mají jen zdi.',
      'Na cestě potkáváte vozy plné lidí, kteří utíkají z města s peřinami, slepicemi a dětmi. Novinky letí rychleji než vrány a jsou stejně černé: královna se zhroutila. Kancléř Vilém byl radou jmenován regentem, „do králova uzdravení“. Král ještě dýchá. Prozatím. Nikdo nečeká, že dlouho.',
      'A zítra za úsvitu je popravčí den. Na Náměstí šibenic budou viset lidé s rohy a šupinami' + (A.has('sarraZajata') ? ', mezi nimi Sarra Popelavá' : '') + (A.has('esterZajata') ? ', a Ester z Lhoty za srnu' : '') + (A.has('uprchliciZajati') ? ', a uprchlíci ze lhotského mlýna' : '') + '. Vilém chce, aby jeho regentství začalo něčím, co si lidé zapamatují. A lidé si nejlépe pamatují strach.',
      S('plachta', 'Tak. Velkej den. Kdybych byla člověk, teď bych si nervózně kousala nehty. Takhle si koušu ocas. Není to ono. Ocas je chlupatej.', 'n')
    ], ch: [{ t: 'Svolat poslední radu.', go: 'f3_rada' }] },

    // ── f3_rada ── Poslední porada. Útok, proniknutí podzemím, nebo veřejný soud.
    //    Sem se dostaneš z: akt3
    f3_rada: { bg: 'tabor', mood: 'tense', npc: (G) => G.party.filter(c => c !== 'plachta' && c !== 'radim').map((c, i) => ({ id: c, x: .62 + i * .12 })), t: (G, A) => {
        const al = allies(G, A);
        return [
          'Noc před popravčím dnem. Utáboříte se v rokli pod Havraní skálou, kde vás z hradeb nikdo neuvidí, a oheň necháte malý. Do hlíny někdo nožem vyškrábe mapu města: hrad, náměstí, chrám, Škváru, brány. Je to špatná mapa. Ale je to vaše mapa.',
          'Kolem ohně se sejdou všichni, kdo s tebou došli až sem, a ještě někteří, kdo přišli za tmy, potichu, s kápěmi přes hlavu. Takhle se rodí vzpoury: ne v sálech a ne v písních, ale v roklích, po tmě, šeptem, u malého ohně.',
          al.length ? 'Kdo stojí za tebou: ' + al.join(', ') + '.' : 'Za tebou nestojí nikdo než ti, kdo sedí u ohně. Spojence sis na cestě [[nenašel|nenašla]], nebo jsi o ně [[přišel|přišla]]. Malý oheň a malá družina. I tak se dá začít.',
          `Důkazů proti kancléři: ${guilt(A)}.`,
          G.party.includes('radim') ? S('radim', 'Tři cesty, Výsosti. Udeřit na náměstí a pak na hrad, se vším, co máme. Proplížit se k umírajícímu králi dřív, než Vilém dokončí, co začal. Nebo přijít na popraviště otevřeně a žalovat ho před celým Popelovem, podle starého práva. Každá má svou cenu. Každá stojí krev, jen pokaždé jinou.', 'n')
            : S('plachta', 'Tak co, generále? Rubat, plížit se, nebo kecat? Já hlasuju pro kecání, u toho se nejmíň umírá. Teda většinou. Záleží, kdo kecá a komu.', 'n')
        ];
      }, ch: (G, A) => {
        const al = allies(G, A).length, n = guilt(A);
        return [
          { t: `Udeřit na Náměstí šibenic a pak na hrad. (spojenců: ${al})`, tag: 'Útok', need: () => al >= 2 ? true : 'aspoň 2 spojenci', go: 'f3_utok' },
          { t: 'Proplížit se do hradu podzemím k umírajícímu králi.', need: () => (A.item('mapa') || G.f.radim === 'spojenec') ? true : 'mapa stok nebo Radim', go: 'f3_infiltrace' },
          { t: `Přijít na popraviště otevřeně a žalovat kancléře před lidem. (důkazů: ${n})`, go: 'f3_soud' }
        ];
      } },

    /* ---------- A: útok ---------- */

    // ── f3_utok ── Útok na Náměstí šibenic. Boj s katem a stráží.
    //    Sem se dostaneš z: f3_rada
    f3_utok: { bg: 'sibenice', mood: 'fight', enter: (G, A) => A.rest(), npc: [{ id: 'kat', x: .55 }, { id: 'zoldak', x: .7 }, { id: 'fanatik', x: .84 }], t: (G, A) => {
        const al = allies(G, A);
        return [
          'Úsvit. Slunce vychází rudé, jako by i ono vědělo, co je dnes za den. Náměstí šibenic je plné lidí. Přišli, protože museli, protože biřici obcházeli domy a vyháněli je ven. Stojí v tichých řadách a dívají se na lešení.',
          'Na lešení stojí v řadě odsouzení, se smyčkami kolem krků. Nad nimi kat v černé kápi, který si plive do dlaní, protože to tak dělával jeho otec a otcův otec a protože v Popelově je katovství řemeslo, které se dědí, jako všechno ostatní, co se nikomu jinému nechce dělat.',
          'Dav mlčí. Je to ten druh ticha, který se může zlomit oběma směry. Na jednu stranu do potlesku, na druhou do řevu. Všechno záleží na tom, kdo první promluví.',
          'Pak se to zlomí. ' + al.map(x => x[0].toUpperCase() + x.slice(1)).join('. ') + '. Najednou a ze všech stran, z uliček, ze střech, ze sklepů, jako by to město čekalo dvacet let na jediné slovo a teď ho konečně uslyšelo.',
          G.f.kychal === 'pritel' ? { t: 'Hodíš dračí šupinu do kotle s dehtem pod lešením. Plamen vyšlehne modře. A nad Popelovem se ozve kýchnutí, ze kterého se v celém městě rozdrnčí okna. Kýchal přistane na střeše radnice, obrovský a šedý v ranním světle, a fanatici odhodí pochodně a dají se na útěk.', snd: 'rev', shake: 14 } : null,
          'Kat zvedá sekeru. Kancléřovi žoldáci se řadí kolem lešení, štíty proti davu.'
        ];
      }, fight: { foes: (G, A) => { const f = ['kat', 'zoldak', 'zoldak', 'fanatik', 'fanatik']; const cut = Math.min(3, 1 + allies(G, A).length); return f.slice(0, f.length - cut); }, intro: 'Popravčí den začíná. Jen jinak, než si to kancléř představoval.', win: 'f3_utok_vyhra', lose: 'konec_loutka_prohra', loseFx: (G, A) => A.set('prohralNamesti') } },

    // ── f3_utok_vyhra ── Popraviště dobyto, lidé jsou volní.
    //    Sem se dostaneš z: f3_utok
    f3_utok_vyhra: { bg: 'sibenice', npc: [{ id: 'kat', x: .6, pose: 'dead' }], t: (G, A) => [
      'Kat leží pod lešením na vlastní sekeře, což by jeho otec a otcův otec jistě považovali za profesní selhání. Lidé šplhají na lešení a řežou provazy noži, srpy, zuby. Odsouzení padají do náruče davu. Živí.',
      'Někdo se rozpláče. Někdo se rozesměje. Stará žena s rohy objímá syna a nechce ho pustit. A uprostřed toho všeho stojíš ty, s mečem v ruce, a lidé se na tebe dívají a šeptají si tvé jméno, jako by ho zkoušeli, jak zní.',
      A.has('sarraZajata') ? S('sarra', 'Dvakrát v životě jsem měla smyčku na krku. Podruhé už to bylo skoro pohodlný. Kde je ten žlutej hajzl? Mám pro něj kladivo.', 'angry') : null,
      A.has('esterZajata') ? S('ester', 'Pověsit mě za srnu. Za jednu blbou srnu. Já jim dám srnu.', 'angry') : null,
      G.f.rom && G.party.includes(G.f.rom) ? { t: `Pak ${fn(G.f.rom)} vedle tebe zavrávorá. Pod žebry trčí šíp z kuše, vystřelený z hradeb. Krev, hodně krve, na dlažbě, na rukou. „To nic. To nic. Jdi. Dojdi to.“`, shake: 6 } : null,
      'Na hradě zvoní na poplach. Kancléř se zavřel v trůnním sále, s královnou a s posledními věrnými.'
    ], enter: (G, A) => { A.set('vezniZachraneni'); if (A.has('sarraZajata')) { A.join('sarra'); } if (A.has('esterZajata')) { A.join('ester'); } if (G.f.rom && G.party.includes(G.f.rom)) G.f.ranenRom = G.f.rom; A.done('sarra'); A.done('ester'); }, ch: [{ t: 'Na hrad!', go: 'f3_brana_hradu' }] },

    // ── f3_brana_hradu ── Útok na hradní bránu.
    //    Sem se dostaneš z: f3_utok_vyhra
    f3_brana_hradu: { bg: 'trunni', mood: 'tense', npc: [{ id: 'zoldak', x: .7 }, { id: 'zoldak', x: .86 }], t: ['Hradní brána padne pod náporem davu, nebo spíš se sama otevře, protože stráž na ní dostala strach a mnohem raději se rozhodla být jinde.', 'Běžíš chodbami, které znáš, a přesto je nepoznáváš. Schody, gobelíny, portréty předků s tvrdými tvářemi, kteří tě nikdy neviděli. Tvůj domov, poprvé zvenku. Před dveřmi trůnního sálu stojí dva poslední žoldáci. Mají v očích to, co mají v očích lidé, kteří pochopili, že za ně nikdo nezaplatí.'], ch: [{ t: 'Prorazit.', tag: 'Útok', fight: { foes: ['zoldak', 'zoldak'], win: 'f3_vilem', lose: 'konec_loutka_prohra' } }] },

    /* ---------- B: infiltrace ---------- */

    // ── f3_infiltrace ── Radim vede družinu tajnými chodbami.
    //    Sem se dostaneš z: f3_rada
    f3_infiltrace: { bg: 'stoky', mood: 'dark', npc: [], t: (G, A) => [
      A.item('mapa') ? 'Modrá čára na Šmudlově mapě vede pod Popelov. Nejdřív stokami, kde krysy uctivě uhýbají, protože mapa nese královskou krysí pečeť. Pak starým akvaduktem, kudy kdysi tekla voda z hor. A nakonec schody vytesané do živé skály, které vedou nahoru, do tmy pod hradem, tak husté, že by se dala krájet a mazat na chleba.' : 'Radim vede tajnými chodbami, které znají jen strážní. Zná každou škvíru, každý vlhký schod, každé místo, kde se dá stát, když nahoře projde hlídka. Dvacet let tu chodil a nikdy si nemyslel, že tu jednou půjde proti vlastnímu pánovi.',
      A.item('mapa') ? 'Na rozcestí se mapa dělí. Modrá čára vede vlevo. Černá vpravo, a vedle ní je drobným krysím písmem připsáno: „tam nechoď“.† Jenže modrá chodba je zasypaná kamením.' : null,
      A.item('mapa') ? '† Krysí kartografie je velmi přesná a velmi stručná. Na mapách stok se vyskytují jen tři poznámky: „tady sýr“, „tady kočka“ a „tam nechoď“. Ta třetí je nejvzácnější a znamená něco, čeho se bojí i kočky.' : null
    ], ch: (G, A) => A.item('mapa') && G.f.radim !== 'spojenec' ? [
      { t: 'Najít jinou cestu po modré.', chk: { s: 'duv', dc: 12, ok: 'f3_sklepy', no: 'f3_ghul' } },
      { t: 'Riskovat černou.', go: 'f3_ghul' }
    ] : [{ t: 'Dál', go: 'f3_sklepy' }] },

    // ── f3_ghul ── Ghúlové v černé chodbě (cesta podle černé čáry na mapě).
    //    Sem se dostaneš z: f3_infiltrace
    f3_ghul: { bg: 'stoky', mood: 'fight', npc: [{ id: 'ghul', x: .75 }, { id: 'ghul', x: .88 }], t: ['Černá chodba páchne jako hřbitov po povodni. Z výklenků ve zdech vylézají bledé, vychrtlé věci s dlouhými prsty a s očima jako zkažené žloutky. Kdysi to možná byli lidé, kteří se v podzemí ztratili. Teď je to něco, co žere krysy.', 'A teď má chuť na něco většího.'], ch: [{ t: 'Bojovat.', tag: 'Útok', fight: { foes: ['ghul', 'ghul'], win: 'f3_sklepy', lose: 'f3_ghul_prohra' } }] },

    // ── f3_ghul_prohra ── Ghúlové hráče porazili, zachrání ho Plachtička.
    //    Sem se dostaneš z: f3_ghul
    f3_ghul_prohra: { bg: 'stoky', npc: [], t: ['Ghúlové tě srazí a vlečou za nohy do tmy. A pak se zastaví. Zavětří. A s kvílením utečou před něčím ještě horším.', 'Před Plachtičkou, která se řítí chodbou s hořící slámou v tlamě, s naježeným ocasem a s výrazem bytosti, která už dnes ztratila veškerou trpělivost.', S('plachta', 'NIKDO. NEŽERE. MOJEHO. ČLOVĚKA.', 'angry')], enter: (G, A) => { A.ap('plachta', 2); }, ch: [{ t: 'Dál', go: 'f3_sklepy' }] },

    // ── f3_sklepy ── Hráč vyleze za gobelínem v královské ložnici.
    //    Sem se dostaneš z: f3_infiltrace, f3_ghul, f3_ghul_prohra
    f3_sklepy: { bg: 'loznice', mood: 'tense', npc: [], t: (G, A) => {
        const saved = A.has('drakSpojenec') && (G.f.sabina === 'obracena' || A.has('lhotaSpojenec') || A.has('krysySpojenec'));
        G.f.vezniOsud = saved ? 'vzpoura' : 'popraveni';
        return [
          'Schody končí u dvířek a dvířka vedou za gobelín. Odhrneš ho opatrně. Je to královská ložnice. Venku za oknem zvoní zvony, všechny najednou, těžce a pomalu: začíná popravčí den.',
          saved ? 'Z náměstí se ozve řev. Ne jásot. Boj. Dračí lid se zvedl sám, bez rozkazu, bez tebe, a ostatní se přidali, Lhota, krysy, Řád, jeden po druhém. A tvoje jméno křičí víc hrdel, než bys kdy věřil{a}.' : 'Z náměstí se ozve buben. Pak ticho. Pak buben znovu. Víš, co to znamená. A nemůžeš udělat nic. Jen stát za gobelínem a počítat údery, a každý z nich ti zůstane v hrudi jako hřebík.',
          'Král leží v posteli mezi těžkými závěsy, šedý jako popel z krbu, a dýchá tak mělce, že se peřina sotva hýbe. U lůžka stojí kancléř Vilém se sklenicí v ruce a dívá se na něj tak, jak se úředník dívá na spis, který brzy uloží do archivu. Královna sedí u okna. Nedívá se ven. Nedívá se nikam.'
        ];
      }, enter: (G, A) => { if (G.f.vezniOsud === 'vzpoura') A.set('vezniZachraneni'); }, ch: [{ t: 'Vystoupit ze stínu.', go: 'f3_vilem' }] },

    /* ---------- C: soud ---------- */

    // ── f3_soud ── Hráč přijde na popraviště otevřeně a žaluje Viléma.
    //    Sem se dostaneš z: f3_rada, f3_soud_radim, f3_soud_sabina
    f3_soud: { bg: 'sibenice', mood: 'tense', npc: [{ id: 'kat', x: .58 }, { id: 'vilem', x: .74 }, { id: 'kralovna', x: .86 }], t: (G, A) => [
      'Úsvit. Jdeš středem davu, sám, bez meče v ruce, s hlavou vztyčenou. Nikdo tě nezastaví. Lidé ti uhýbají z cesty a nevěřícně se po tobě otáčejí, protože nikdo nevěří, že by to dědic opravdu udělal. Přijít sem. Teď. Takhle.',
      'Na tribuně nad popravištěm stojí kancléř Vilém, regent. Je oblečen v černém, s řetězem úřadu na prsou, a na prstě mu svítí hadí prsten. Vedle něj sedí královna Morana, bledá, s očima jako dvě vyhaslá okna, ve kterých už dávno nikdo nesvítí.',
      S('vilem', 'Ach. Ztracený dědic. [[Přišel|Přišla]] ses podívat na popravu? Jak dojemné. Jak velice dojemné. Stráže –', 'smirk'),
      'Ale ty zvedneš hlas dřív, než stráže dojdou. Podle starého práva, ještě z dob smlouvy, má každý z královské krve nárok na veřejnou žalobu, a dokud žaloba nezazní celá, nesmí se ho nikdo dotknout. Je to zapomenuté právo. Ale dav ho zná. Dav zná všechna práva, která mu někdy mohou posloužit. A dav miluje divadlo.',
      { t: `„Obviňuji kancléře Viléma z otrávení krále Bořivoje!“`, shake: 4 }
    ], ch: (G, A) => {
      const n = guilt(A); let dc = Math.max(8, 22 - 2 * n); if (G.f.radim === 'spojenec') dc -= 2; if (G.f.sabina === 'obracena') dc -= 3; dc = Math.max(6, dc);
      return [
        { t: `Předložit důkazy jeden po druhém. (důkazů: ${n})`, chk: { s: 'cha', dc, ok: 'f3_soud_ok', no: 'f3_soud_ne' } },
        { t: '[Radim] „Kapitán Kost, svědek!“', if: () => G.f.radim === 'spojenec', go: 'f3_soud_radim', once: true },
        { t: '[Sabina] Nechat promluvit inkvizitorku.', if: () => G.f.sabina === 'obracena', go: 'f3_soud_sabina', once: true }
      ];
    } },

    // ── f3_soud_radim ── Radim svědčí na popravišti.
    //    Sem se dostaneš z: f3_soud
    f3_soud_radim: { bg: 'sibenice', npc: [{ id: 'radim', x: .44 }, { id: 'vilem', x: .74 }, { id: 'kralovna', x: .86 }], t: ['Z davu vystoupí Radim. Sundá si přilbu, přejde k tribuně a postaví se do pozoru, jak to dělal dvacet let. Jeho hlas je tichý, ale nese se přes celé náměstí, protože kolem něj najednou nikdo nedýchá.', S('radim', 'Já, Radim Kost, kapitán hradní stráže, jsem z rozkazu kancléře vyzvedl u lékárníka Šimona lahvičku. Bylo mi řečeno, že je to lék. Byla to Černá rosa. Donesl jsem ji do kuchyně. Svýma rukama.', 'n'), S('radim', 'Jsem vinen. On víc.', 'n'), 'Dav zašumí, jako když vítr projde obilím. Stráže na tribuně se po sobě dívají. Jeden z nich pomalu skloní kopí.'], enter: (G, A) => A.clue('radim', 'Radim Kost veřejně vypověděl, že jed vyzvedl na kancléřův rozkaz.'), ch: [{ t: 'Dál', go: 'f3_soud' }] },

    // ── f3_soud_sabina ── Sabina svědčí na popravišti.
    //    Sem se dostaneš z: f3_soud
    f3_soud_sabina: { bg: 'sibenice', npc: [{ id: 'sabina', x: .44 }, { id: 'vilem', x: .74 }, { id: 'kralovna', x: .86 }], t: ['Na schody chrámu vystoupí drobná postava v bílém, s jizvou přes půl tváře. Fanatici kolem lešení ji poznají a ztuhnou.', S('sabina', 'Bratři! Sestry! Dvacet let jsme pálili lež. Hořany nespálil drak. Žárov nespálil drak. Spálil je tenhle muž, a my jsme mu celou tu dobu nosili pochodně a říkali tomu víra.', 'angry'), S('sabina', 'Bledý plamen byl stvořen, aby pálil lež. Dnes se obrací.', 'angry'), 'A polovina fanatiků na náměstí sundá masky. Pod nimi jsou obyčejné tváře. Mladé, staré, vyděšené. Řezník, švec, syn pradleny. Někteří pláčou.'], ch: [{ t: 'Dál', go: 'f3_soud' }] },

    // ── f3_soud_ok ── Hráč měl dost důkazů, lid je na jeho straně.
    //    Sem se dostaneš z: f3_soud
    f3_soud_ok: { bg: 'sibenice', npc: [{ id: 'vilem', x: .74 }, { id: 'kralovna', x: .86 }], t: (G, A) => [
      'Mluvíš. Pomalu, zřetelně, jak tě to kdysi učila Hedvika, když ses jako dítě učil{a} číst. Pírko v mrtvé dlani. Lékárníkova kniha. Zlato s hadem. Dopis podepsaný jediným písmenem. Hořany. Každé slovo dopadá do davu jako kámen do studny a dlouho trvá, než se ozve žbluňknutí.',
      'A pak se ozve. Nejdřív jeden hlas, odněkud vzadu: „Hořany!“ Pak deset. Pak sto.',
      (A.has('kralovnaPouto') || A.has('kralovnaPochyba') || A.hasClue('lek')) ? S('kralovna', 'Ten lék… Každý večer. Každý večer mi ho nosil sám. A každé ráno jsem se bála víc. Viléme. Co jsi mi to dělal? Co jsi nám všem dělal?', 'shock') : S('kralovna', 'Je to pravda, Viléme? Je to pravda?', 'shock'),
      'Kancléř se poprvé za celou dobu přestane usmívat. Bez úsměvu vypadá jeho tvář jinak: starší, žlutější, prázdnější. Pak mávne rukou a z jeho prstenu vyšlehne bledý plamen. Lešení vzplane. Dav se s křikem rozprchne. Vilém prchá do hradu a táhne královnu s sebou za zápěstí jako zavazadlo.',
      'Lidé ti pomáhají sundat odsouzené z hořícího lešení. A pak se dav otočí k hradu. Tentokrát tě následuje.'
    ], enter: (G, A) => { A.set('vezniZachraneni'); A.set('soudVyhran'); if (A.has('sarraZajata')) A.join('sarra'); if (A.has('esterZajata')) A.join('ester'); }, ch: [{ t: 'Za ním!', go: 'f3_vilem' }] },

    // ── f3_soud_ne ── Důkazů je málo, lidé mlčí.
    //    Sem se dostaneš z: f3_soud
    f3_soud_ne: { bg: 'sibenice', npc: [{ id: 'straz', x: .6 }, { id: 'vilem', x: .74 }, { id: 'kralovna', x: .86 }], t: [
      'Mluvíš, ale slova se rozbíjejí o ticho jako vlny o skálu. Příliš málo důkazů. Příliš mnoho strachu. Lidé tě poslouchají a kývají, a pak se podívají na stráže a přestanou kývat.',
      S('vilem', 'Smutné. Velice smutné. Dědic je nemocný stejně jako náš drahý král. Horečka. Bludy. To se v rodině stává. Odveďte Výsost zpátky do věže. Pro {jeho|její} vlastní bezpečí.'.replace('{jeho|její}', '[[jeho|její]]'), 'smirk'),
      'Stráže se blíží. Dav se odvrací. Buben znovu začíná.'
    ], ch: [
      { t: 'Bojovat. Tady a teď.', tag: 'Útok', fight: { foes: ['straz', 'straz', 'zoldak'], intro: 'Vytrhneš se strážnému a tasíš.', win: 'f3_soud_boj_vyhra', lose: 'konec_loutka' } },
      { t: 'Vzdát se. Ještě není konec – v té věži jsi přežil{a} dvacet let.', go: 'konec_loutka' }
    ] },

    // ── f3_soud_boj_vyhra ── Hráč porazil stráže na popravišti.
    //    Sem se dostaneš z: f3_soud_ne
    f3_soud_boj_vyhra: { bg: 'sibenice', npc: [], t: ['Stráže padnou na dlažbu. A dav, který se odvracel, se otočí zpátky. Kdo bojuje, ten má aspoň trochu pravdu. Tak to v Popelově vždycky bylo, a je to špatný zákon, ale dnes poslouží.', 'Vilém mezitím zmizel v hradu.'], enter: (G, A) => { if (A.has('drakSpojenec')) A.set('vezniZachraneni'); }, ch: [{ t: 'Za ním.', go: 'f3_vilem' }] },

    /* ---------- kancléř ---------- */

    // ── f3_vilem ── Poslední setkání s Vilémem v trůnním sále.
    //    Sem se dostaneš z: f3_brana_hradu, f3_sklepy, f3_soud_ok, f3_soud_boj_vyhra
    f3_vilem: { bg: (G, A) => A.has('soudVyhran') || A.has('vezniZachraneni') && !G.f.vezniOsud ? 'trunni' : 'loznice', mood: 'dark', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .8 }], cp: 1, lore: 'vilem', t: (G, A) => [
      'Kancléř Vilém stojí vedle královny. Je klidný. Žlutá tvář, hadí prsten, úsměv úředníka, který právě zjistil, že mu sedí účty, a nikdo jiný to ještě neví.',
      'Je to drobný muž. To tě překvapí ze všeho nejvíc. Celý život sis ho představoval{a} velkého, jako stín na zdi věže. Je o hlavu menší než ty a má jemné ruce písaře.',
      S('vilem', 'Hořany? Nutnost. Lidé a šupináči u jednoho stolu, smíšené sňatky, společné mlýny. To je recept na válku, dítě. Dříve či později by vypukla. Já jsem ji jen uspíšil. A vyhrál ji pro nás.', 'smirk'),
      S('vilem', 'A Žárov? Žárov byl starý, špinavý a patřil kovářům s rohy. Teď je to Popelov, a patří koruně. Účetně vzato jsem království prokázal službu.', 'smirk'),
      S('vilem', 'Bořivoj byl měkký. Ty jsi [[měkký|měkká]]. Království nepotřebuje lásku. Potřebuje někoho, kdo se nebojí mít špinavé ruce, a pak si je umýt, než se někdo podívá.', 'smirk'),
      queenPoisoned(G, A) ? S('vilem', 'A tvá drahá matka? Pije můj lék každý večer, poslušně jako ovečka. Dnes ráno jsem do něj přidal Černou rosu. Dvojí smutek, jeden regent. Elegantní, nemyslíš?', 'smile') : S('vilem', 'Tvá matka už můj lék nepije. Škoda. Byla s ním tak poslušná. Tak klidná.', 'n'),
      queenPoisoned(G, A) ? 'Královna se zakymácí v křesle. Na nehtech jí černají drobné půlměsíčky.' : null
    ], enter: (G, A) => { if (queenPoisoned(G, A)) A.set('kralovnaOtravena'); }, ch: (G, A) => [
      { t: 'Konec řečí.', tag: 'Boj', go: 'f3_vilem_boj' },
      { t: '[Radim] „Stráže! Ve jménu krále – zatkněte kancléře.“', if: () => G.f.radim === 'spojenec' && G.party.includes('radim'), go: 'f3_vilem_zatceni' },
      { t: '[Šupina] Hodit dračí šupinu do krbu.', if: () => A.item('supina') && (G.f.kychal === 'pritel' || G.f.kychal === 'pomsta') && !A.has('kychalPrisel'), go: 'f3_kychal' },
      { t: '„Matko. Podívej se na mě. Ne na něj.“', if: () => A.has('kralovnaPouto') && !A.has('kralovnaSeObratila'), chk: { s: 'cha', dc: 11, ok: 'f3_kralovna_obrat', no: 'f3_vilem_boj' } }
    ] },

    // ── f3_kralovna_obrat ── Královna se vzpamatuje a obrátí se proti Vilémovi.
    //    Sem se dostaneš z: f3_vilem
    f3_kralovna_obrat: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .8 }], t: ['Královna se na tebe podívá. Dlouho. A mlha v jejích očích se na vteřinu rozestoupí, jako se rozestupují mraky nad bažinami, odkud kdysi přišla, a pod nimi je vidět něco tvrdého a jasného.', 'Pak vytáhne z vlasů dlouhou zlatou jehlici, svatební, kterou nosí od toho dne, kdy přijela do Vranova, a vrazí ji Vilémovi do ruky s prstenem. Až po hlavičku.', { t: 'Kancléř zařve. Je to první hlasitý zvuk, který kdy kdo od něj slyšel. Prsten mu sklouzne z prstu a kutálí se po mramoru.', shake: 8 }, S('kralovna', 'Dvacet let jsem se bála, že tě svět sežere. Zamykala jsem dveře, zavírala okna, hlídala každý tvůj krok. A on mi celou dobu seděl u stolu a naléval víno.', 'angry')], enter: (G, A) => { A.set('kralovnaSeObratila'); A.set('vilemOslaben'); }, ch: [{ t: 'Teď!', tag: 'Boj', go: 'f3_vilem_boj' }] },

    // ── f3_vilem_zatceni ── Radim nařídí stráži zatknout Viléma.
    //    Sem se dostaneš z: f3_vilem
    f3_vilem_zatceni: { bg: 'trunni', npc: [{ id: 'radim', x: .5 }, { id: 'vilem', x: .8 }], t: ['Strážní u dveří se podívají na Radima. Pak na kancléře. Pak zase na Radima. Je to dlouhá chvíle, a během ní se v jejich hlavách odehraje celá válka mezi strachem a zvykem.', 'Pak pomalu skloní kopí. Směrem ke kancléři.', S('vilem', 'Kapitáne. Dvacet let poslušnosti, a tohle?', 'angry'), S('radim', 'Dvacet let. A dnes poprvé poslouchám správně.', 'n'), 'Vilém se zasměje, krátce a ošklivě, a z jeho prstenu vyšlehne bledý oheň.'], enter: (G, A) => A.set('vilemOslaben'), ch: [{ t: 'Na něj!', tag: 'Boj', go: 'f3_vilem_boj' }] },

    // ── f3_vilem_boj ── Finální boj s Vilémem.
    //    Sem se dostaneš z: f3_vilem, f3_kralovna_obrat, f3_vilem_zatceni
    f3_vilem_boj: { bg: 'trunni', mood: 'fight', fight: { foes: (G, A) => { const v = { id: 'vilem', boss: true, hp: A.has('vilemOslaben') ? 48 : 66 }; const g = G.f.sabina === 'obracena' || A.has('vilemOslaben') ? [] : ['zoldak', 'zoldak']; return [v].concat(g); }, intro: 'Kancléř zvedne ruce. Kolem jeho prstů tančí bledý plamen, ten, kterým kdysi pálil Hořany.', win: 'f3_vilem_padl', lose: 'konec_smrt' } },

    // ── f3_kychal ── Hráč hodí šupinu do krbu, přiletí drak Kýchal.
    //    Sem se dostaneš z: f3_vilem
    f3_kychal: { bg: 'trunni', mood: 'fire', npc: [{ id: 'kralovna', x: .58 }, { id: 'vilem', x: .76 }], t: (G) => [
      'Hodíš šupinu do krbu. Vzplane modře, vysoko, až pod komín. Vilém se zasměje: *„Kouzla z pohádek? Opravdu?“*',
      { t: 'Pak se zboří půlka stěny. Ve vichru, prachu a střepech barevného skla se do sálu protlačí obrovská dračí hlava, šedá, zjizvená, s jedním zlatým okem, které hledá, a nachází.', snd: 'rev', shake: 18 },
      G.f.kychal === 'pomsta' ? S('kychal', 'Viléme. Hořany pozdravují.', 'roar') : S('kychal', 'Ty jsi ten, kdo zabil Žárovku. Pamatuju si tvůj pach. Dvacet let si ho pamatuju. Žlutý strach a inkoust.', 'n'),
      'Vilém zvedne prsten. Bledý plamen proti černému, chladný proti horkému, lež proti pravdě. Na jednu vteřinu je to vyrovnané a celý sál se zalije bílým a rudým světlem.',
      'Pak drak kýchne.',
      { t: 'Z kancléře Viléma, druhého nejmocnějšího muže království, zbude jen žlutá skvrna na mramoru a kapka roztaveného zlata, která kdysi bývala hadím prstenem.', flash: 1, snd: 'kych' }
    ], enter: (G, A) => { A.set('kychalPrisel'); G.f.vilem = 'spalen'; }, ch: (G, A) => G.f.kychal === 'pomsta' ? [{ t: 'Dál', go: 'f3_pomsta' }] : [{ t: 'Dál', go: 'f3_slza' }] },

    // ── f3_pomsta ── Drak začne pálit Popelov (když mu hráč slíbil pomstu).
    //    Sem se dostaneš z: f3_kychal
    f3_pomsta: { bg: 'popel', mood: 'fire', npc: [], t: ['Ale drak nekončí. Vznese se z trosek nad město, obrovský a strašný, a pak začne Popelov hořet.', 'Chrám první, s jeho bílou věží. Kasárna druhá. Pak radnice, pak sýpky, pak už není nic první ani druhé. Je jen oheň, který se valí ulicemi jako voda, a lidé, kteří před ním utíkají, a nad tím vším křídla. Přesně tak, jak to Řád dvacet let kázal. Lež se stala pravdou, protože jsi ji zavolal{a}.', S('kychal', 'Slíbil{a} jsi mi pomstu, dítě. Tohle je pomsta. Celý Popelov postavený na popelu Hořan a Žárova. Ať shoří, co bylo postaveno na lži.', 'roar')], ch: (G, A) => [
      { t: '„Dost! Tohle nejsou Hořany. Tady žijí děti. Tady žije dračí lid!“', chk: { s: 'cha', dc: A.has('drakSpojenec') ? 12 : 16, ok: 'f3_pomsta_stop', no: 'konec_popel' } },
      { t: 'Nechat ho. Ať to všechno shoří.', go: 'konec_popel' }
    ] },

    // ── f3_pomsta_stop ── Hráč draka zastavil.
    //    Sem se dostaneš z: f3_pomsta
    f3_pomsta_stop: { bg: 'popel', npc: [], t: ['Drak se zastaví ve vzduchu. Visí nad městem a mávání jeho křídel rozfoukává dým. Dole, ve Škváře, která ještě nehoří, stojí na střechách kováren lidé s rohy a dívají se nahoru. Nekřičí. Jen se dívají. Jeho lidé.', S('kychal', 'Moji… Ty děti dole. Mají rohy. Mají rohy jako ty, co mi nosily sýr.', 'sad'), 'Starý drak přistane na troskách chrámu, složí křídla a pláče. Pomalu, dlouze, jako pláčou hory, když taje sníh. A tam, kam dopadají jeho slzy, oheň zhasíná.', 'Popelov ztratil toho dne čtvrtinu domů. Ale ne svou duši. To se nedá říct o mnoha městech, která potkal drak.'], enter: (G, A) => { G.f.kychal = 'pritel'; A.set('mestoPopaleno'); }, ch: [{ t: 'Dál', go: 'f3_slza' }] },

    // ── f3_vilem_padl ── Vilém je poražený. Hráč rozhodne o jeho osudu.
    //    Sem se dostaneš z: f3_vilem_boj
    f3_vilem_padl: { bg: 'trunni', npc: [{ id: 'vilem', x: .76, pose: 'kneel' }, { id: 'kralovna', x: .6 }], t: (G, A) => [
      'Kancléř klečí na mramoru u schodů trůnu. Hadí prsten mu praskl a ruka, na které ho nosil, je černá od vlastního plamene. Dýchá ztěžka. Ale usmívá se. Pořád se usmívá.',
      S('vilem', 'Tak. Dítě z popela. Co teď? Zabiješ mě, a budeš jako já. Necháš mě žít, a já budu čekat, až uděláš chybu. A ty ji uděláš, všichni ji udělají. Obojí je pro mě vítězství.', 'smirk'),
      A.has('kralovnaOtravena') ? 'Za tebou královna klesne na kolena. Černá rosa pracuje rychle, rychleji u těch, kdo už jsou slabí.' : null
    ], ch: (G, A) => [
      { t: 'Zabít ho. Tady, na schodech trůnu.', tag: 'Zabít', go: 'f3_slza', fx: (G2, A2) => { G2.f.vilem = 'zabit'; A2.ap('sarra', 2); A2.ap('vojta', -1); A2.inc('temnota'); } },
      { t: '„Půjdeš před soud. Veřejně. Celý Popelov uslyší o Hořanech.“', go: 'f3_slza', fx: (G2, A2) => { G2.f.vilem = 'soud'; A2.ap('vojta', 2); A2.ap('radim', 2); A2.ap('ester', 1); } },
      { t: 'Vydat ho dračímu lidu. Ať rozhodnou Hořany.', if: () => A.has('drakSpojenec'), go: 'f3_slza', fx: (G2, A2) => { G2.f.vilem = 'drakum'; A2.ap('sarra', 3); A2.ap('radim', -1); } },
      { t: 'Vyhnat ho z království bez jména a bez peněz.', go: 'f3_slza', fx: (G2, A2) => { G2.f.vilem = 'vyhnan'; A2.ap('sarra', -2); A2.ap('ester', -1); } }
    ] },

    /* ---------- slza ---------- */

    // ── f3_slza ── Komu dát dračí slzu? Králi, matce, milované osobě, huse, nebo sobě.
    //    Sem se dostaneš z: f3_kychal, f3_pomsta_stop, f3_vilem_padl
    f3_slza: { bg: 'loznice', mood: 'sad', npc: (G, A) => { const n = [{ id: 'kralovna', x: .62 }]; if (!A.has('otylieSnedena') && !A.has('trubkaPryc')) n.push({ id: 'trubka', x: .82 }, { id: 'otylie', x: .9 }); return n; }, t: (G, A) => {
        const out = ['Pak je ticho. Takové ticho, jaké přichází jen po velkém hluku: zvoní v uších a je v něm slyšet každá maličkost. Kapky deště z rozbitého okna. Praskání dohasínajícího krbu. A chrčení umírajícího krále.', `Na krku ti visí lahvička. ${G.f.slza === 'krev' ? 'Dračí krev, černá, hustá a teplá, jako by v ní pořád tlouklo srdce.' : 'Jedna slza, horká a svítící, jako kousek úsvitu zavřený do skla.'} Stačí na jednoho. Jen na jednoho.`];
        if (A.has('kralovnaOtravena')) out.push('Královna leží u lůžka na koberci. Dýchá mělce a rychle. Černá rosa, stejně jako u krále. Hodina, možná dvě.');
        if (G.f.ranenRom) out.push(`${fn(G.f.ranenRom)} sedí opřen${T.C[G.f.ranenRom].P.fem ? 'a' : ''} o sloup, s šípem pod žebry, a snaží se usmívat. Krev už neteče. Ne proto, že by se rána zavřela. Protože už jí moc nezbývá.`);
        if (!A.has('otylieSnedena')) out.push('A do toho všeho, do ticha, do smrti, do velké chvíle dějin, vtrhne dveřmi muž v zablácených punčochách s husou v náručí.', S('trubka', 'Výsosti! Výsosti, nesmírně se omlouvám, že ruším v tak dějinné chvíli, jsem si vědom, že je dějinná, mám pro dějinné chvíle cit! Otýlie! Prokletá hraběnka! Jedna slza by stačila! Jedna! Jsem… jsem jen básník, nemám nic jiného, co bych vám nabídl, kromě sonetu, a ten ještě není hotový!', 'shock'), { w: 'otylie', t: 'Sssss.', snd: 'husa' });
        return out;
      }, ch: (G, A) => [
        { t: 'Dát slzu králi Bořivojovi.', go: 'f3_slza_kral' },
        { t: 'Dát slzu matce.', if: () => A.has('kralovnaOtravena'), go: 'f3_slza_kralovna' },
        { t: `Dát slzu ${G.f.ranenRom ? DAT[G.f.ranenRom] : ''}.`, tag: '♥', if: () => !!G.f.ranenRom, go: 'f3_slza_rom' },
        { t: 'Dát slzu huse.', if: () => !A.has('otylieSnedena'), go: 'konec_otylie' },
        { t: 'Vypít ji sám/sama. Svět si zasloužil, co si udělal.'.replace('sám/sama', G.sex === 'f' ? 'sama' : 'sám'), if: () => G.f.slza === 'krev', go: 'f3_slza_ja' }
      ] },

    // ── f3_slza_kral ── Slza zachrání krále.
    //    Sem se dostaneš z: f3_slza
    f3_slza_kral: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }], t: (G, A) => G.f.slza === 'krev' ? [
      'Nakapeš dračí krev králi mezi rty. Je hustá a pomalá a on ji polyká s námahou. Pak kašle, prudce, celým tělem. A pak se mu otevřou oči.',
      'Jsou žluté. S úzkou svislou zornicí, jako u hada.',
      S('kral', 'Vidím… vidím všechno. Všechny, kdo mě zradili. Všechny, kdo šeptali za mými zády. Jsou jich stovky. Spalte je. Spalte je všechny.', 'angry'),
      'Král žije. Ale není to Bořivoj, který tě kdysi nesl z popela ve svém plášti a mlčel celou cestu domů.'
    ] : [
      'Nakapeš slzu králi mezi rty. Chvíli se nic neděje, a ta chvíle je delší než celých dvacet let ve věži.',
      'Pak se mu černé nehty začnou rozjasňovat. Od kořene, pomalu, jako když svítá nad horami. Šedá barva mu ustupuje z tváře a místo ní přichází jiná, živá. Zhluboka se nadechne. Poprvé za mnoho dní.',
      S('kral', '{name}? Ty… ty jsi to zvládl{a}. Ty jsi [[odešel|odešla]] z věže. Vždycky jsem věděl, že jsi z nás nejsilnější. Jen jsem se bál ti to říct, abys [[neodešel|neodešla]].', 'smile')
    ], enter: (G, A) => { G.f.kralZije = G.f.slza === 'krev' ? 'krev' : 'ano'; if (A.has('kralovnaOtravena')) G.f.kralovnaMrtva = 1; if (G.f.ranenRom) G.f.mrtvy = G.f.ranenRom; }, ch: (G, A) => [
      A.has('kralovnaOtravena') ? { t: 'Královna…', go: 'f3_kralovna_umira' } : { t: 'Dál', go: 'f3_koruna' }
    ] },

    // ── f3_kralovna_umira ── Královna byla otrávená a umírá v náručí hráče.
    //    Sem se dostaneš z: f3_slza_kral
    f3_kralovna_umira: { bg: 'loznice', mood: 'sad', npc: [{ id: 'kralovna', x: .62 }], t: ['Klekneš si ke královně na koberec. Je lehká, když ji vezmeš do náruče. Lehčí, než by měla být. Jako by z ní za ta léta strachu zbyla jen skořápka.', S('kralovna', 'Neplač. Konečně jsi venku. To jsem pro tebe chtěla celou dobu. Opravdu. Jen jsem… jen jsem nevěděla jak. Nikdo mě to nenaučil. Moje děti umíraly dřív, než jsem se to stihla naučit.', 'sad'), 'Usne ti v náručí. Tentokrát bez mlhy. A ve tváři má výraz, jaký jsi u ní nikdy neviděl{a}: klid.'], ch: [{ t: 'Dál', go: 'f3_koruna' }] },

    // ── f3_slza_kralovna ── Slza zachrání královnu.
    //    Sem se dostaneš z: f3_slza
    f3_slza_kralovna: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }], t: (G) => [
      G.f.slza === 'krev' ? 'Dračí krev projede královnou jako blesk. Prohne se v zádech, zakřičí hlasem, jakým kdysi zpívala, a vstane. Oči má jasné. Příliš jasné, a v jejich hloubi se něco žlutě leskne.' : 'Slza se vpije do královniných rtů. Černé půlměsíce na nehtech blednou a mizí. Otevře oči, a poprvé za dvacet let jsou čisté, bez mlhy, šedé jako jezero v bažinách za jasného rána.',
      'Za vámi král Bořivoj vydechne naposledy. Tiše, jako by nechtěl rušit. Tak, jak celý život žil, když zrovna nebyla válka.',
      S('kralovna', 'Ty jsi… vybral{a} mě? Mě? Po tom všem, co jsem ti udělala? Po té věži, po těch zamčených dveřích?', 'shock')
    ], enter: (G, A) => { G.f.kralZije = 'ne'; G.f.kralovnaZachranena = 1; if (G.f.ranenRom) G.f.mrtvy = G.f.ranenRom; }, ch: [{ t: '„Jsi moje matka.“', go: 'f3_koruna' }] },

    // ── f3_slza_rom ── Slza zachrání zraněného milého nebo milou.
    //    Sem se dostaneš z: f3_slza
    f3_slza_rom: { bg: 'loznice', npc: [], t: (G) => [
      `Klekneš si a nalomíš lahvičku nad ${INS[G.f.ranenRom]}. Rána se začne zavírat, šíp sám vyklouzne ven, jako by ho tělo vyplivlo. Dech se vrátí. Hluboký, bolavý, živý.`,
      'Za tebou umírá král. Nemůžeš se otočit. Nechceš vidět, jestli se na tebe dívá. A nechceš vědět, jestli se usmívá, nebo ne, protože obojí by bolelo stejně.',
      S(G.f.ranenRom, 'Tys mě… vybral{a} mě? Místo krále? Ty jsi blázen. Ty jsi úplnej, nenapravitelnej blázen.', 'shock')
    ], enter: (G, A) => { G.f.kralZije = 'ne'; G.f.romZachranen = 1; if (A.has('kralovnaOtravena')) G.f.kralovnaMrtva = 1; A.ap(G.f.ranenRom, 5); }, ch: [{ t: 'Dál', go: 'f3_koruna' }] },

    // ── f3_slza_ja ── Hráč vypije slzu (nebo krev) sám.
    //    Sem se dostaneš z: f3_slza
    f3_slza_ja: { bg: 'loznice', npc: [], t: ['Vypiješ dračí krev. Pálí, jako by sis nalil{a} do hrdla roztavené železo. Svět zrudne, zostří se a zpomalí. Slyšíš srdce všech v sále. Slyšíš, které je slabé. Slyšíš, které se bojí. Ta, která se bojí, bijí nejhlasitěji.', 'Král za tebou umírá. Je ti to jedno. To je to nejhorší. Ne to, že umírá. To, že je ti to jedno.'], enter: (G, A) => { G.f.kralZije = 'ne'; A.inc('temnota', 3); if (A.has('kralovnaOtravena')) G.f.kralovnaMrtva = 1; if (G.f.ranenRom) G.f.mrtvy = G.f.ranenRom; }, ch: [{ t: 'Vstát.', go: 'konec_zelezo' }] },

    /* ---------- koruna ---------- */

    // ── f3_koruna ── Koruna leží na schodech trůnu. Konečná volba.
    //    Sem se dostaneš z: f3_slza_kral, f3_kralovna_umira, f3_slza_kralovna, f3_slza_rom, f3_okno
    f3_koruna: { bg: 'trunni', mood: 'sad', npc: (G) => G.f.kralZije === 'ano' ? [{ id: 'kral', x: .7 }] : [], t: (G, A) => [
      'Trůnní sál. Rozbitá okna, střepy barevného skla, které se třpytí na mramoru jako drahokamy, krev, popel a ticho. Na schodech trůnu leží koruna Vranovců. Někdo ji v boji upustil a nikdo ji nezvedl.',
      'Je to obyčejná koruna, když se na ni díváš zblízka. Zlatý obruč, sedm zubů, havran vepředu. Trochu ohnutá na jedné straně. Kdysi ji nosil Vran Jednooký, když uzavíral smlouvu s draky. Od té doby ji nosilo jedenáct králů a dvě královny, a žádný z nich v ní nebyl šťastný.',
      G.f.kralZije === 'ano' ? S('kral', 'Jsem starý, {name}. Slza mi dala život, ne sílu. Vranov potřebuje tebe. Ne mě, ne Viléma, ne radu, tebe. Vezmi ji. Nebo mi řekni, co místo ní.', 'n') : G.f.kralZije === 'krev' ? 'Král s hadíma očima sedí na trůnu a diktuje písaři seznamy jmen. Dlouhé seznamy. Dívá se na tebe, jako by čekal, jestli budeš první na seznamu, nebo ten, kdo ho píše.' : 'Král je mrtvý. Koruna nemá hlavu. A celý sál, celý hrad, celé království čeká, čí hlavu si najde.',
      romAlive(G) ? `${fn(G.f.rom)} stojí u dveří. Neřekne nic, ale v očích má otázku. Tu nejstarší otázku na světě.` : null
    ], ch: (G, A) => [
      { t: '„Vezmu ji. A s ní slib: stejné právo pro každou krev.“', if: () => G.f.kralZije !== 'krev', go: (G2, A2) => (G2.f.temnota || 0) >= 6 ? 'konec_zelezo' : (G2.f.kralZije === 'ano' ? 'konec_kral' : 'konec_popel_koruna') },
      { t: '„Vezmu ji. A Popelov se mě bude bát. Už nikdy nikdo nepřijde v noci s nožem.“', go: 'konec_zelezo' },
      { t: '„Koruna nikomu. Rada: lidé, dračí lid, Lhota, krysy. Ať vládnou všichni.“', if: () => A.has('drakSpojenec') || A.has('lhotaSpojenec'), go: 'konec_rada' },
      { t: `Vzít ${romAlive(G) ? fn(G.f.rom) : ''} za ruku a odejít. Nechte si svůj trůn.`, tag: '♥', if: () => romAlive(G), go: 'konec_pryc' },
      { t: 'Postavit se k oknu a podívat se dolů na Popelov.', if: () => !A.has('oknoVidel'), go: 'f3_okno' }
    ] },

    // ── f3_okno ── Hráč se dívá z okna na město, pak se vrátí k trůnu.
    //    Sem se dostaneš z: f3_koruna
    f3_okno: { bg: 'hradby', npc: [], t: (G, A) => [
      'Přejdeš k rozbitému oknu. Vítr ti vrhne do tváře déšť a kouř a vůni mokrých střech. Pod tebou leží Popelov. ' + (A.has('mestoPopaleno') ? 'Čtvrtina jeho střech je černá a ohořelá, ale z komínů těch ostatních se kouří, a ten kouř stoupá rovně, klidně, jako v obyčejný den.' : 'Kouří se z komínů, ne ze střech. Je to rozdíl, kterého si všimne jen ten, kdo viděl obojí.'),
      A.has('vezniZachraneni') ? 'Na Náměstí šibenic lidé rozebírají lešení. Na otop, protože dřevo je dřevo a zima přijde tak jako tak. Někdo se směje. Někdo zpívá. A dračí děti běhají mezi lidskými dětmi a nikdo je neodhání.' : 'Na Náměstí šibenic se pod lešením houpe řada těl. Nikdo je ještě nesundal. Vrány už ano.',
      'Dvacet let jsi to město viděl{a} z okna věže, jako obrázek. Teď víš, jak voní, jak zní a kolik váží.',
      S('plachta', 'Hezký, ne? Teda, smrdí to tu pořád. Ale hezky. Jako domov, co se nemyl.', 'n')
    ], enter: (G, A) => A.set('oknoVidel'), ch: [{ t: 'Vrátit se k trůnu.', go: 'f3_koruna' }] },

    /* ---------- konce ---------- */

    /* ---------- KONCE HRY ----------
       Každý konec má end: { n, title, text }.
         n      číslo konce (hra si pamatuje, které konce už hráč viděl)
         title  nadpis, svislá čára | ho rozdělí na dva řádky
         text   odstavce závěrečného textu; odstavec s † je poznámka pod čarou
       Nadpis i texty můžeš přepsat, číslo n neměň. */
    // ── konec_kral ── KONEC č. 1 „Králův návrat“: král přežije.
    //    Sem se dostaneš z: f3_koruna
    konec_kral: { end: { n: 1, title: 'KRÁLŮV | NÁVRAT', text: [
      'Král Bořivoj žil ještě sedm let. Nebyl to dlouhý čas, jak se počítá čas králů, ale stačil na to, aby podepsal edikt o rovném právu krve, aby vlastní rukou strhl ceduli nad branou Škváry a aby tě viděl korunovat. Prý se při tom poprvé za dvacet let usmál tak, že tomu všichni věřili.',
      'Dědic z věže se stal panovníkem, který nezamyká dveře. Popelov tě nemiloval. Popelov nemiluje nikoho, to není v jeho povaze. Ale přestal se bát. A to je u měst víc, než se dá čekat od lásky.'
    ], epi: (G, A) => T.epilog(G, A) } },

    // ── konec_popel_koruna ── KONEC č. 2 „Koruna z popela“: hráč usedne na trůn a slíbí stejné právo pro všechny.
    //    Sem se dostaneš z: f3_koruna
    konec_popel_koruna: { end: { n: 2, title: 'KORUNA | Z POPELA', text: [
      'Korunovali tě v hradní kapli s rozbitými okny, protože na nová nebyly peníze, a déšť padal dovnitř na kněze i na hosty. Nikomu to nevadilo. Koruna byla lehká. Prý proto, že je z toho, co zbylo.',
      'Vranov má [[krále|královnu]] z popela Hořan. První zákon, který podepíšeš, zakazuje slovo „šupináč“. Druhý ruší dračí daň. Třetí vrací městu jeho staré jméno, Žárov, ale lidé mu stejně dál říkají Popelov, protože jsou na to zvyklí a protože jméno, které si město vyslouží, se nedá zrušit výnosem.',
      'Čtvrtý dává Hedvice hrob v královské kapli, mezi králi. Je to jediný hrob tam, na kterém jsou pořád čerstvé květiny.'
    ], epi: (G, A) => T.epilog(G, A) } },

    // ── konec_zelezo ── KONEC č. 3 „Železná koruna“: vláda strachem (temnota 6 a víc, nebo volba „ať se mě bojí“).
    //    Sem se dostaneš z: f3_slza_ja, f3_koruna
    konec_zelezo: { end: { n: 3, title: 'ŽELEZNÁ | KORUNA', text: (G) => [
      G.f.kralZije === 'krev' ? 'Král s hadíma očima vládne a ty jsi jeho železná ruka. Seznamy jmen se zkracují, protože jmen ubývá. Popelov je čistý. Tichý. Vystrašený.' : 'Vládneš. Nikdo už nepřijde v noci s nožem. Ne proto, že by nechtěl, ale protože všichni, kdo by mohli, už visí na Náměstí šibenic.',
      'Říká se, že ve Vranově je pořádek. Říká se to šeptem, za zavřenými okenicemi. Ve věži, kde jsi dvacet let počítal{a} čárky na zdi, teď sedí jiní a počítají za tebe.',
      'Kancléř Vilém by na tebe byl hrdý. To je to nejhorší, co se o tobě dá říct, a kronikáři to o tobě říkají, ačkoli až dlouho po tvé smrti.'
    ], epi: (G, A) => T.epilog(G, A) } },

    // ── konec_popel ── KONEC č. 4 „Popel“: drak spálí Popelov.
    //    Sem se dostaneš z: f3_pomsta
    konec_popel: { end: { n: 4, title: 'PO | PEL', text: [
      'Kýchal pálil tři dny a tři noci. Pak odletěl na sever, za Žárové hory, a už se nikdy nevrátil.',
      'Z Popelova zbyly kamenné zdi, šibenice, která jediná nehořela, a jméno, které konečně sedí. Ty jsi přežil{a}. Chodíš po spáleništi a hledáš něco, co by se dalo nazvat královstvím.',
      'Nenajdeš. Ale vrány tě znají jménem.'
    ], epi: (G, A) => T.epilog(G, A) } },

    // ── konec_pryc ── KONEC č. 5 „Cesta pryč“: hráč nechá trůn být a odejde s milovanou osobou.
    //    Sem se dostaneš z: f3_koruna
    konec_pryc: { end: { n: 5, title: 'CESTA | PRYČ', text: (G) => [
      `Odešli jste za úsvitu, ty a ${fn(G.f.rom)}. Bez koruny, bez družiny, s jedním koněm, který kulhal, a s veverkou, která protestovala celou cestu až za hranice a pak ještě kus.`,
      'Vranov si našel jiného vládce. Nebo jiné vládce, zprávy se různí. Někdy o nich slyšíte vyprávět v hospodách na jihu, kde nikdo neví, kdo jste, a vy se smějete s ostatními. Nikdy se nevracíte.',
      'Dvacet let jsi viděl{a} svět z okna věže. Teď ho vidíš celý. A vedle tebe je někdo, kdo se dívá taky.'
    ], epi: (G, A) => T.epilog(G, A) } },

    // ── konec_loutka ── KONEC č. 6 „Loutka“: hráč se vzdal nebo prohrál, vládne Vilém.
    //    Sem se dostaneš z: f3_soud_ne, konec_loutka_prohra
    konec_loutka: { end: { n: 6, title: 'LOUT | KA', text: [
      'Věž. Čárky na zdi. Sedm tisíc tři sta dní a pak dalších pár, a pak už je nepočítáš.',
      'Kancléř Vilém vládne jako regent „do uzdravení dědice“. Dědic se neuzdravuje. Každý večer dostává lék na nervy, ve stříbrném poháru, z rukou samotného kancléře. Po něm se mu zdá, že hoří.',
      'Občas tě vyvedou na balkon a ty máváš davu. Lidé mávají zpátky. Nikdo neví, že pláčeš. Z té výšky to není vidět.'
    ], epi: (G, A) => T.epilog(G, A) } },

    // ── konec_loutka_prohra ── Nemá vlastní text, jen přesměruje na konec_loutka (prohra ve finálním boji).
    //    Sem se dostaneš z: f3_utok, f3_brana_hradu
    konec_loutka_prohra: { redirect: () => 'konec_loutka' },

    // ── konec_rada ── KONEC č. 7 „Rudý úsvit“: koruna nikomu, vládne rada.
    //    Sem se dostaneš z: f3_koruna
    konec_rada: { end: { n: 7, title: 'RUDÝ | ÚSVIT', text: [
      'Korunu Vranovců jste roztavili na náměstí, přesně tam, kde stávala šibenice. Ze zlata se razily mince s dvěma tvářemi: na jedné straně lidská, na druhé dračí. Trpaslíci z banky U Kladiva prohlásili, že je to nejlepší ražba za tři sta let, a pak to zdanili.',
      'Rada Popelova se hádá od rána do večera. Krysy, sedláci, kováři s rohy, kněží bez masek, trpasličí bankéři a jeden básník, který se tam dostal nedopatřením a nikdo ho nemá to srdce vyhodit. Je to chaos. Je to hluk. Nikdo při tom nevisí.',
      'Tebe zvolili předsedou. Hlasovalo pro tebe i pár krys. Jedna veverka se zdržela hlasování na protest proti tomu, že nemohla hlasovat dvakrát.'
    ], epi: (G, A) => T.epilog(G, A) } },

    // ── konec_otylie ── KONEC č. 8 „Hraběnka Otýlie“: slzu dostala husa.
    //    Sem se dostaneš z: f3_slza
    konec_otylie: { end: { n: 8, title: 'HRABĚNKA | OTÝLIE', text: [
      'Slza dopadne huse na zobák. Chvíli se nic neděje. Husa zamrká. Trubka zatají dech. Pak výbuch peří, který zaplní celou ložnici, a když se peří usadí, stojí na mramoru nahá, velmi rozzlobená žena středních let s orlím nosem a s pohledem, jaký mívají jen hraběnky a husy.',
      'Hraběnka Otýlie z Hrbu. Sestřenice krále Bořivoje z třetího kolena. A podle zákona o nástupnictví, který nikdo dvacet let nečetl, protože nikoho nenapadlo, že by bylo nutné, jediná legitimní dědička krve Vranovců. Ty jsi nalezenec. To se v zákonech nepočítá.',
      'Její první královský čin: zatknout Bohuslava Trubku za „dvacet let ponižování, kokrhání a nucení k procházkám na vodítku“. Druhý: prohlásit tě dvorním šaškem, s platem a s čepicí. Král mezitím umřel. Nikdo si toho nevšiml.',
      'Plachtička se smála tři dny v kuse. Pak dostala škytavku. Pak se smála dál, se škytavkou.',
      '† Vědma, když se o tom dozvěděla, prý prohlásila: „Říkala jsem, že vidím husu.“ Pak dodala, že eso srdcové v balíčku pořád nemá tři kusy, a že kdyby jí někdo dal karty, dokázala by to.'
    ], epi: (G, A) => T.epilog(G, A, 'otylie') } },

    // ── konec_smrt ── KONEC č. 9 „Poslední oheň“: hráč padl v boji s Vilémem.
    //    Sem se dostaneš z: f3_vilem_boj
    konec_smrt: { end: { n: 9, title: 'POSLEDNÍ | OHEŇ', text: (G) => [
      'Bledý plamen tě zasáhne do hrudi. Je studený, studenější, než si kdo dovede představit oheň. Padáš na schody trůnu a mramor je studený taky, studenější než věž, studenější než všechny ty zimy, kdy jsi dýchal{a} na sklo.',
      'Ale to, co jsi začal{a}, už se nedá zastavit. Popelov se zvedl. Kancléř neuteče. Lidé ho dostihnou na hradbách, a nebude to hezké, a nikdo se pak nebude chtít přiznat, kdo byl první.',
      G.f.rom ? `${fn(G.f.rom)} tě drží v náručí až do konce. Je to dobrý konec. Lepší než věž.` : 'Plachtička ti sedí na prsou a kleje. Klení je to poslední, co slyšíš. Je to krásné klení, nejkrásnější, jaké kdy svět slyšel, a celé je o tobě.'
    ], epi: (G, A) => T.epilog(G, A, 'smrt') } },

    // ── konec_slepa ── KONEC č. 0: záchranný konec pro případ, že hra nenajde cestu dál. Normálně se sem nedostaneš.
    //    Sem se dostaneš z: (nikam nevede, jen zvláštní případ)
    konec_slepa: { end: { n: 0, title: 'KONEC | CESTY', text: ['Tady příběh končí dřív, než měl. Zkus to jinak.'] } }
  });

  /* Epilogue lines for everybody you met. */
  T.epilog = function (G, A, kind) {
    const out = [], f = G.f, saved = A.has('vezniZachraneni');
    const kralovna = f.kralovnaMrtva ? 'Královna Morana zemřela na Černou rosu. Pohřbili ji v královské kapli vedle tří malých hrobů, o kterých nikdo nevěděl, protože na nich nebyla jména. Teď už jména mají.' : f.kralovnaZachranena ? 'Královna Morana žije. Odešla do kláštera v horách a každý týden ti píše dopis. Píše o počasí, o horách a o tom, že se znovu naučila zpívat. Nikdy v nich neříká „zůstaň doma“.' : A.has('kralovnaSeObratila') || A.has('kralovnaPouto') ? 'Královna Morana bez Vilémova „léku“ prospala tři dny a tři noci. Pak vstala a poprvé za dvacet let otevřela okna věže dokořán. Prý tam pak stála do večera.' : 'Královna Morana se z mlhy nikdy úplně neprobrala. Ale v dobrých dnech poznává tvůj hlas a usmívá se, a to je víc, než jsi kdy čekal{a}.';
    if (kind !== 'otylie') out.push(kralovna);
    if (A.has('esterPotkana')) out.push(f.mrtvy === 'ester' ? 'Ester zemřela na šíp z hradeb. V Lhotě jí postavili kříž z jejích vlastních šípů a Bohouš u něj sedává každý večer.' : A.has('esterZajata') && !saved ? 'Ester visela na Náměstí šibenic za srnu. Bohouš od té doby nepromluvil ani slovo.' : f.rom === 'ester' ? 'Ester zůstala po tvém boku a dál pytlačí, teď v královských lesích, legálně, s tvým požehnáním, což ji strašně nebaví.' : (G.ap.ester || 0) >= 2 ? 'Ester se stala rychtářkou Lhoty. První, co udělala, bylo, že strhla šibenici na návsi a z jejího dřeva postavila lavičku.' : 'Ester se vrátila do Lhoty a tvoje jméno už nikdy nevyslovila.');
    if (A.has('vojtaByl') && G.ap.vojta != null) out.push(f.mrtvy === 'vojta' ? 'Vojta zemřel s úsměvem. Prý poprvé za dvacet let neviděl Hořany, když zavřel oči.' : f.rom === 'vojta' ? 'Vojta konečně spí. Vedle tebe. Chrápe jako medvěd v zimě a ty to nikomu neříkáš.' : 'Vojta se vrátil do lesa. Na místě, kde stávaly Hořany, vysázel tisíc buků, každý za jeden dům. Rostou rovně.');
    if (A.has('byl_skvara') || A.has('sarraZajata')) out.push(f.mrtvy === 'sarra' ? 'Sarra zemřela s kladivem v ruce. Ve Škváře se po ní jmenuje první kovárna, kde smí dračí lid znovu kovat žárovou ocel.' : A.has('sarraZajata') && !saved ? 'Sarra Popelavá visela na Náměstí šibenic. Na jejím hrobě zapalují dračí děti každý rok malé ohně.' : (G.ap.sarra || 0) <= -5 ? 'Sarra Popelavá vede Škváru. Když jedeš kolem, zavírá okenice.' : f.rom === 'sarra' ? 'Sarra je tvou chotí. Na korunovaci si nechala vykovat korunu s otvory pro rohy a od té doby ji nesundala.' : 'Sarra Popelavá vede Škváru. Její neteř nosí meč a nikdo jí neřekne šupinačko. Aspoň ne dvakrát.');
    if (f.radim) out.push(f.radim === 'mrtvy' ? 'Kapitána Radima Kosta pohřbili bez poct. Nikdo nevěděl, že nakonec chtěl stát na správné straně.' : f.mrtvy === 'radim' ? 'Radim Kost padl na schodech trůnu. Pohřbili ho s mečem i s odznakem. Oba si zasloužil.' : f.rom === 'radim' ? 'Radim Kost odložil meč a velí teď jen jednomu člověku. Tobě. Prý je to náročnější než celá posádka a předpisy na to žádné nejsou.' : 'Radim Kost se přiznal a odseděl si rok v kobce, kterou dřív hlídal. Pak se vrátil do služby. Jako strážce, ne jako kat.');
    if (f.sabina) out.push(f.sabina === 'obracena' ? 'Sabina přejmenovala Řád Bledého plamene na Řád Popela. Jeho rytíři teď hasí požáry místo zakládání a bílé masky nosí jen na karnevalu.' : f.sabina === 'mrtva' ? 'Sabina zemřela v kryptě a Řád se bez ní rozpadl do sekt, které se dodnes hádají, kdo z nich je čistší.' : 'Sabina putuje po zemi jako žebračka. Prý hledá Žárov. Nikdo jí neřekne, že ho hledá na špatném místě. Ten Žárov, který hledá, už není nikde.');
    if (f.kychal) out.push(f.kychal === 'mrtvy' ? 'Kosti posledního draka leží ve zřícenině na Dračím hrádku. Děti z Lhoty tam chodí na stezky odvahy a nikdy nevydrží do půlnoci.' : A.has('mlade') ? 'Kýchal žije na Dračím hrádku s malou dračicí, která kýchá ještě hůř než on. Pojmenoval ji Hedvika. Plachtička ji navštěvuje každý týden a nosí jí ořechy, i když draci ořechy nejedí.' : f.kychal === 'zklaman' ? 'Kýchal odletěl na sever. Někdy, za jasných nocí, je nad horami vidět oheň.' : 'Kýchal sedává na střeše radnice a vozí děti na zádech za sýr. Ceník je vyvěšen u brány. Platí se předem.');
    if (A.has('smudlaMrtvy')) out.push('Krysy si po Šmudlovi zvolily novou královnu. Je mnohem chytřejší, mnohem zlejší a nemluví o sobě v množném čísle, což je u krys známka opravdové moci.'); else if (A.has('krysiSlib')) out.push('Krysí král Šmudla dostal křeslo v radě. Na zasedání nosí monokl, vždycky hlasuje pro sýr a my, Šmudla I., jsme s tím velmi spokojeni.');
    if (kind === 'otylie') out.push('Bohuslav Trubka sepsal ve vězení epos „Husa a já“ ve dvanácti zpěvech. Prodává se lépe než modlitební knížky a Otýlie se ho marně pokouší zakázat.');
    else if (!A.has('otylieSnedena') && A.has('esterPotkana')) out.push('Bohuslav Trubka dál zpívá U Oběšence. Otýlie dál syčí. Jsou šťastní, jak to jen u básníků a hus jde.');
    else if (A.has('otylieSnedena')) out.push('Bohuslav Trubka dodnes hledá svou choť po celém Popelově. Šmudla mu pokaždé soucitně kývne a rychle změní téma.');
    out.push(kind === 'smrt' ? 'Plachtička vypila na tvém pohřbu celý sud královské medoviny a pak pronesla nejsprostší a nejkrásnější řeč, jakou kdy Vranov slyšel. Biskup omdlel ve třetí větě.' : (G.ap.plachta || 0) <= -3 ? 'Plachtička jednou v noci zmizela. Na polštáři ti nechala ořech. Jen jeden.' : 'Plachtička se stala dvorní kronikářkou. Kroniky jsou plné sprostých slov, poznámek pod čarou a nepravdy. Lidé je milují. Tahle je jedna z nich.');
    return out;
  };
})(window.T);
