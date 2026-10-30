/* Koruna z popela – Dějství II: cesta, Lhota, Vojta, Černý les, Vědma, Dračí hrádek, Kýchal, tábor.
   Návod, jak tenhle soubor číst a co se v něm smí měnit, je na začátku
   souboru s0_prolog.js. Nad každou scénou je komentář: o jakou situaci jde
   a ze kterých scén se do ní dá dostat. */
(function (T) {
  'use strict';
  // S(kdo, text, výraz) = řeč postavy.
  const S = (w, t, m) => ({ w, t, m });
  // Kolik uprchlíků je ve mlýně ve Lhotě. Když hráč zachránil Škváru,
  // utekla jich sem spousta (čtyřicet), jinak jen devět.
  const refugees = G => G.f.skvara === 'branena' || G.f.skvara === 'odlozena' ? 'čtyřicet' : 'devět';
  Object.assign(T.N, {
    // ── akt2 ── Začátek Dějství II. Na cestě za městem čekají žoldáci.
    //    Sem se dostaneš z: odchod
    akt2: { act: 'Dějství II · Venkov', bg: 'cesta', mood: 'wind', cp: 1, npc: [{ id: 'zoldak', x: .7 }, { id: 'zoldak', x: .82 }, { id: 'zoldak', x: .94 }], enter: (G, A) => A.levelUp(), t: (G, A) => [
      'Za branami Popelova se svět rozevře tak náhle, že se ti z toho na okamžik zatočí hlava. Celý život jsi znal{a} jen tolik nebe, kolik se vešlo do okna věže. Teď ho je tolik, že se nedá dohlédnout jeho konce, a vítr, který po něm běží, voní mokrou zemí, kouřem z dalekých chalup a něčím, co nemá jméno a co možná je jen svoboda.',
      'Cesta vede podél Smolné, řeky tmavé a pomalé, která nese z hor popel a z měst odpadky a nikdy si nestěžuje. Po obou stranách se táhnou pole. Obilí na nich stojí zplihlé a přezrálé. Nikdo ho nesklidil, protože dračí daň sebrala sedlákům nejdřív zrno, potom koně a nakonec i chuť.',
      'Vrány se zvedají z brázd, když jdeš kolem, a zase sedají, jako by tě vyprovázely. Když se slunce schyluje k poledni, dojdeš k rozcestí, kde stojí starý kamenný kříž s uraženým ramenem. A u kříže čekají tři muži.',
      'Mají kroužkové košile, které kdysi patřily někomu jinému, a štíty, na nichž je narychlo namalovaný žlutý had, znak kancléřství. Žoldáci. Lidé, kteří prodávají meč tomu, kdo zaplatí, a dobře vědí, že mrtvý zákazník už nic nereklamuje.',
      S('zoldak', 'Hele, kluci. Podívejte, co nám přišlo samo. Kancléřství platí dvě stě – živého nebo mrtvého. Mrtví se líp nesou, a taky míň mluví.', 'smirk'),
      A.inParty('ester') ? S('ester', 'Tyhle znám. Byli loni v Lhotě. Vybírali daň a kdo neměl čím platit, tomu vzali, co se dalo nést. Mámy jim braly děti z cesty.', 'angry') : null
    ], ch: (G, A) => [
      { t: 'Do nich.', tag: 'Útok', fight: { foes: ['zoldak', 'zoldak', 'zoldak'], win: 'a2_po_boji', lose: 'a2_prohra', gold: 15 } },
      { t: '„Dvě stě? Kancléř si vás cení míň než mě. Odejděte, dokud vám to ještě můžu odpustit.“', chk: { s: 'sil', dc: 14, ok: 'a2_utekli', no: 'a2_boj' } },
      { t: 'V plášti Řádu: „Jsem posel Bledého plamene. Uhněte.“', if: () => A.item('plast'), chk: { s: 'cha', dc: 11, ok: 'lhota', no: 'a2_boj' } },
      { t: 'Ester: „Kolem rybníka je stezka. Za mnou.“', if: () => A.inParty('ester'), go: 'a2_obejiti' }
    ] },

    // ── a2_boj ── Boj se žoldáky na cestě.
    //    Sem se dostaneš z: akt2
    a2_boj: { bg: 'cesta', mood: 'fight', fight: { foes: ['zoldak', 'zoldak', 'zoldak'], win: 'a2_po_boji', lose: 'a2_prohra', gold: 15 } },

    // ── a2_utekli ── Žoldáci se lekli a utekli.
    //    Sem se dostaneš z: akt2
    a2_utekli: { bg: 'cesta', npc: [], t: [
      'Chvíli se nestane nic. Pak nejmladší z nich, kluk, kterému pod přilbou ještě nevyrostly vousy, o krok ustoupí. Druhý se na něj podívá, pak na tebe, a v jeho tváři je vidět, jak počítá, kolik je dvě stě zlatých děleno třemi a kolik z toho zbude na pohřeb.',
      'Potom utíkají přes pole, všichni tři, a jeden z nich ztratí v brázdě botu a nevrátí se pro ni.†',
      '† Ta bota tam leží dodnes. Místní jí říkají Kancléřova bota a věří, že kdo ji obuje, ten uteče i smrti. Zatím to nikdo nezkusil, protože bota je levá, děravá a smrdí, a smrt, jak známo, tak rychle neběží.',
      'Na zemi, kde stáli, zůstal ležet složený list s pečetí.'
    ], enter: (G, A) => A.clue('odmena', 'Vyhláška kancléřství: „Dědic Vranova – živ nebo mrtev – 200 zlatých.“ Kancléř chce dědice mrtvého ještě před králem.'), ch: [{ t: 'Do Lhoty.', go: 'lhota' }] },

    // ── a2_obejiti ── Ester vede družinu kolem žoldáků po hrázi rybníka.
    //    Sem se dostaneš z: akt2
    a2_obejiti: { bg: 'cesta', npc: [], t: [
      'Ester se neohlíží a nečeká. Seběhne z cesty do rákosí a ty za ní. Vede tě po hrázi starého rybníka, po kládách, které by sis sám nikdy nevšiml{a}, kolem utopené kapličky, ze které nad vodu čouhá už jen kříž a hnízdo čápů.',
      'Za vámi chvíli pokřikují hlasy, pak se ozve šplouchnutí a nadávka a pak už nic. Je vidět, že tudy Ester chodila tisíckrát, za tmy, s vycpaným pytlem na zádech a se strachem v zádech ještě větším.',
      S('ester', 'Pytlačit se naučíš, jen když tě chce někdo pověsit. Pak už je to snadný. Nejtěžší je naučit se, kudy utíkat. Zbytek je jen čekání.', 'smirk')
    ], enter: (G, A) => A.ap('ester', 1), ch: [{ t: 'Do Lhoty.', go: 'lhota' }] },

    // ── a2_prohra ── Žoldáci hráče svázali, družina ho osvobodí.
    //    Sem se dostaneš z: akt2, a2_boj
    a2_prohra: { bg: 'cesta', npc: [], t: [
      'Probereš se v příkopu, s pusou plnou bláta a s rukama svázanýma za zády. Nad tebou se žoldáci hádají, kdo tě ponese, a protože žoldáci se neumějí hádat potichu, slyšíš každé slovo.',
      'Plachtička mezitím, nikým nepozorována, sedí u tvých zápěstí a přehryzává provaz s výrazem odborníka, který tohle dělá s velkou nechutí a za příplatek. Když povolí poslední vlákno, nemůže si pomoct a kousne nejbližšího žoldáka do zadku. Hluboko.',
      'V následujícím zmatku utíkáš. Lehčí o pár mincí a o kus důstojnosti, ale živ{a}.'
    ], enter: (G, A) => { A.hurt(2); G.gold = Math.max(0, G.gold - 10); }, ch: [{ t: 'Do Lhoty.', go: 'lhota' }] },

    // ── a2_po_boji ── Po boji se žoldáky hráč najde u jednoho z nich dopis.
    //    Sem se dostaneš z: akt2, a2_boj
    a2_po_boji: { bg: 'cesta', npc: [{ id: 'zoldak', pose: 'dead', x: .8 }], t: [
      'Když je po všem, vrány se snesou zpátky na pole, jako by se nic nestalo. Pro vrány se nikdy nic nestalo, jen se občas prostře.',
      'U jednoho z žoldáků najdeš za košilí složený list s pečetí žlutého hada: *„Dědic Vranova – živ nebo mrtev – 200 zlatých. Kancléřství.“*',
      'Díváš se na to dlouho. Živ nebo mrtev. Král ještě dýchá, v té tmavé komnatě s pachem černé rosy, a kancléř už rozdává tvou hlavu po tržnicích. Spěchá. A kdo spěchá, ten se bojí, že nestihne něco dokončit dřív, než se na to přijde.'
    ], enter: (G, A) => A.clue('odmena', 'Vyhláška kancléřství: „Dědic Vranova – živ nebo mrtev – 200 zlatých.“ Kancléř chce dědice mrtvého ještě před králem.'), ch: [{ t: 'Do Lhoty.', go: 'lhota' }] },

    /* ---------- Lhota ---------- */

    // ── lhota ── Příchod do vesnice Lhota.
    //    Sem se dostaneš z: akt2, a2_utekli, a2_obejiti, a2_prohra, a2_po_boji
    lhota: { bg: 'lhota', mood: 'warm', npc: [{ id: 'bohous', x: .8 }], lore: 'lhota', t: (G, A) => [
      'Lhota leží v mírném ohbí Smolné, tam, kde se řeka unaví a rozleje do luk. Je to velká ves, dvacet chalup se slaměnými střechami, mlýn s kolem, které se líně otáčí, kaplička, kovárna, statek Bohoušů s velkými vraty a na návsi šibenice.',
      'Ta šibenice je nová. Ještě voní smrkem a pryskyřice z ní kape jako slzy, což je od dřeva hezké, ale nikoho to neutěší. Lhota ji nechtěla. Postavil ji kancléřův biřic, „aby bylo vidět, že zákon dosáhne i sem“. Zákon zatím dosáhl na dva pytláky a jednoho muže, který se biřicovi nahlas zasmál.',
      'Je to krajina, kde se lidé rodí, pracují a umírají na stejném místě a kde se o čemkoli, co se stalo dál než za kopcem, mluví jako o pohádce. Válka sem nedošla nikdy, jen její daně. A daně jsou, jak ví každý sedlák, horší než válka, protože válka jednou skončí.',
      A.inParty('ester') ? 'Ester se při pohledu na vrata statku rozběhne. Ve vratech stojí starý muž s bílými vousy, zarazí se, upustí vidle a pak ji sevře v náručí tak pevně, že jí lupne v zádech.' : 'Ve vratech statku stojí starý muž s bílými vousy a s vidlemi v rukou. Nedrží je, jako by kydal hnůj. Drží je, jako by se je kdysi naučil držet jinak.',
      A.inParty('ester') ? S('bohous', 'Holka moje. Holka moje. Myslel jsem, že tě pověsili. Kdo je tohle? Kdo to s tebou přišel?', 'sad') : S('bohous', 'Jestli jste od kancléře, nic už nemáme, vzali jste to loni. Jestli od Řádu, nic jsme neviděli a nic nevíme. Jestli od někoho jinýho, tak to je poprvé za dvacet let.', 'angry'),
      A.has('esterZajata') ? S('bohous', 'Moji dceru zavřeli v Popelově. Ester. Prý pytlačila. Pytlačila, protože jsme měli hlad, a hlad jsme měli, protože nám vzali obilí. Pověsí ji v popravčí den.', 'sad') : null
    ], enter: (G, A) => { if (A.has('esterZajata')) A.quest('ester', 'Ester v žaláři', 'Ester, dceru statkáře Bohouše, zavřeli v Popelově. V popravčí den ji pověsí.'); }, ch: [{ t: 'Dál', go: 'l_situace' }] },

    // ── l_situace ── Rychtář Bohouš řekne, že v poledne přijede inkvizitor Kazimír pro uprchlíky z dračího lidu.
    //    Sem se dostaneš z: lhota
    l_situace: { bg: 'lhota', npc: [{ id: 'bohous', x: .8 }], t: (G, A) => [
      'Bohouš tě odvede stranou, za stodolu, kde nikdo neslyší, a teprve tam promluví. Mluví tiše a pomalu, jako člověk, který o tom, co se chystá říct, přemýšlel celou noc a nenašel jiná slova.',
      S('bohous', `Ve starém mlýně za potokem schováváme dračí lidi. Utekli ze Škváry, když tam začal Řád pálit. Je jich ${refugees(G)}, polovina děti. Přišli v noci, po kolena v řece, a jedna ženská nesla dvě děcka najednou a třetí jí viselo na sukni.`, 'n'),
      S('bohous', 'Já nejsem žádnej hrdina. Já jsem sedlák. Ale když někdo v noci zaklepe a má na rukou děti, tak se dveře otvírají. Tak mě to učil táta. A jeho zase jeho táta, ještě za smlouvy.', 'n'),
      S('bohous', 'A dneska v poledne přijede bratr Kazimír z Řádu s kancléřovými žoldáky. Řekl, že jestli je nevydáme, zapálí Lhotu. Celou. Mám tu vnoučata, rozumíte? Vnoučata. A vy jste první, kdo se tu ukázal a nemá na štítě hada.', 'sad'),
      A.inParty('sarra') ? S('sarra', 'Ty děti ze mlýna znám jménem. Učila jsem je kovat hřebíky, když jim bylo pět. Jestli je někdo vydá, bude mít co dělat se mnou. A s kladivem.', 'angry') : null
    ], enter: (G, A) => A.quest('mlyn', 'Mlýn ve Lhotě', 'V poledne si pro uprchlíky ve mlýně přijde bratr Kazimír z Řádu. Jestli je vesnice nevydá, Lhota shoří.'), ch: [{ t: 'Dál', go: 'l_hub' }] },

    // ── l_hub ── Rozcestí ve Lhotě před polednem. Mlýn, dřevorubec Vojta, past, nebo čekat.
    //    Sem se dostaneš z: l_situace, l_mlyn, l_vojta_ne, l_vojta_ok, l_past, l_past_ok, l_past_no
    l_hub: { bg: 'lhota', npc: [{ id: 'bohous', x: .8 }], t: (G, A) => [A.has('lhotaHub') ? 'Slunce leze k poledni pomalu a neúprosně, jako biřic, který ví, že mu neutečeš. Stíny na návsi se zkracují. Lidé se nedívají na cestu, a přesto ji pořád sledují.' : 'Do poledne zbývá pár hodin. Ve vsi je ticho, jaké bývá před bouřkou: slepice se schovávají, psi nevyjí a ženy zavírají okenice, i když je teprve dopoledne.'], enter: (G, A) => A.set('lhotaHub'), ch: (G, A) => [
      { t: 'Zajít do mlýna za uprchlíky.', go: 'l_mlyn', if: () => !A.has('mlynByl') },
      { t: 'Najít dřevorubce na kraji lesa. Prý byl voják.', go: 'l_vojta', if: () => !A.has('vojtaByl') },
      { t: 'Připravit s vesničany past.', go: 'l_past', if: () => !A.has('lhotaPast') },
      { t: 'Čekat na Kazimíra.', go: 'l_kazimir' }
    ] },

    // ── l_mlyn ── Uprchlíci z dračího lidu ve starém mlýně.
    //    Sem se dostaneš z: l_hub
    l_mlyn: { bg: 'mlyn', mood: 'warm', npc: [{ id: 'drakolid', x: .66 }, { id: 'drakolid', x: .8 }, { id: 'lid2', x: .92 }], enter: (G, A) => A.set('mlynByl'), t: (G, A) => [
      'Starý mlýn už léta nemele. Kolo se v potoce točí naprázdno a uvnitř je cítit mouka, myši a strach. Strach má svůj pach, kdo ho jednou ucítil, ten ho pozná: je kyselý a tichý a drží se ve vlasech.',
      'Na seně a na pytlích sedí lidé dračího rodu. Mají rohy, některé dlouhé a zahnuté jako u kozorožců, jiné jen malé hrbolky, a na krcích a lících šupiny, které ve tmě mlýna slabě odrážejí světlo. Mají popálené dlaně kovářů a zástěry, ve kterých utíkali. A jejich děti se na tebe dívají očima, ve kterých doutnají drobné uhlíky, a nepláčou. To je na tom to nejhorší.',
      'Ze stínu se zvedne starý muž s rohy ohlazenými věkem jako kámen v řece. Kdysi musel být vysoký. Teď je shrbený, ale ne pokorný. To jsou dvě různé věci a on dobře ví, jak se liší.',
      S('drakolid', 'Jsem Žár, stařešina rodu Kovářů ze Škváry. Neprosíme o nic. Prosili jsme dvacet let a k ničemu to nebylo. Jen nás nevydávejte, dokud se děti nevyspí. Pak půjdeme sami. Do lesa. K vlkům.', 'n'),
      S('drakolid', 'Vlci aspoň nekážou, než tě sežerou.', 'n'),
      A.race('drak') ? 'Jedno z dětí, holčička s rohy sotva jako fazole, se k tobě připlíží a opatrně ti sáhne na roh. Pak sáhne na svůj. Pak se poprvé za celou cestu usměje, jako by v cizím světě našla zrcadlo.' : null
    ], ch: [
      { t: '„Nikdo vás nevydá. Slibuju.“', go: 'l_hub', ap: { sarra: 1, ester: 1, vojta: 1 }, fx: (G, A) => A.set('slibMlyn') },
      { t: 'Dát dětem jídlo ze zásob. (5 zl)', cost: 5, go: 'l_hub', ap: { sarra: 1, ester: 1 }, fx: (G, A) => A.set('slibMlyn') },
      { t: 'Neslibovat nic.', go: 'l_hub' }
    ] },

    // ── l_vojta ── Dřevorubec Vojta u srubu na kraji Černého lesa.
    //    Sem se dostaneš z: l_hub
    l_vojta: { bg: 'les', mood: 'wind', npc: [{ id: 'vojta', x: .72 }], enter: (G, A) => A.set('vojtaByl'), t: (G, A) => [
      'Na kraji Černého lesa, tam, kde se poslední pole vzdávají a začínají první stromy, stojí srub z neotesaných klád. Kouří se z něj a před ním stojí velký chlap s plnovousem a štípe dřevo.',
      'Štípe ho tak, jak se štípat nemá: s velkou silou a malou trpělivostí, jako by každé poleno bylo něčí hlava a on si přesně pamatoval čí. Kolem srubu je dřeva na tři zimy. Možná na deset.',
      'Lhotští o něm mluví málo. Jmenuje se Vojta, přišel odněkud z války, nikdy nemluví o tom odkud, a do lesa chodí sám, což v Lhotě znamená buď velkou odvahu, nebo velkou lhostejnost k vlastnímu životu.',
      S('vojta', 'Ať jsi kdo jsi, nic nekupuju a nic neprodávám. A do lesa nevodím. Les žere lidi. Některý pomalu, některý najednou. Mě žere pomalu, a tak to má zůstat.', 'n'),
      A.inParty('ester') ? S('ester', 'Vojto. To jsem já. Ester od Bohoušů. Potřebujeme se dostat ke Dračímu hrádku.', 'n') : null,
      S('vojta', 'K hrádku…', 'shock'),
      'Sekera mu v ruce poprvé zaváhá.'
    ], ch: (G, A) => [
      { t: '„Hledám draka Kýchala. Prý mě kdysi hlídal. V popelu Hořan.“', go: 'l_vojta_horany' },
      { t: '„Král umírá. Potřebuju dračí slzu.“', chk: { s: 'cha', dc: 12, ok: 'l_vojta_ok', no: 'l_vojta_ne' } },
      { t: 'Zaplatit mu za cestu. (15 zl)', cost: 15, go: 'l_vojta_ok' }
    ] },

    // ── l_vojta_ne ── Vojta odmítne pomoct.
    //    Sem se dostaneš z: l_vojta
    l_vojta_ne: { bg: 'les', npc: [{ id: 'vojta', x: .72 }], t: [S('vojta', 'Králové umírají. Na to jsou. Za jednoho přijde druhej a daně zůstanou stejný. Běž domů, ať je to kdekoli.', 'n'), 'A znovu se skloní nad špalek, jako bys tam nikdy nestál{a}.'], ch: [{ t: '„Hledám Kýchala. Kvůli Hořanům.“', go: 'l_vojta_horany' }, { t: 'Odejít.', go: 'l_hub' }] },

    // ── l_vojta_horany ── Hráč zmíní Hořany. Vojta se přizná, že tam tehdy byl.
    //    Sem se dostaneš z: l_vojta, l_vojta_ne
    l_vojta_horany: { bg: 'les', npc: [{ id: 'vojta', x: .72 }], lore: 'horany', t: [
      'Sekera se zastaví ve vzduchu. Dlouho tam visí, jako by nevěděla, kam dopadnout. Pak ji Vojta pomalu, velmi pomalu položí na špalek a posadí se vedle ní, jako by mu najednou podklesly nohy.',
      S('vojta', 'Hořany. Nikdo to slovo neřekl nahlas dvacet let. Ani já ne. Ani ve spánku, a to je co říct.', 'sad'),
      S('vojta', 'Byl jsem tam. Bylo mi osmnáct a myslel jsem, že jsem hrdina, protože jsem měl meč a nový kabátec. Velel nám Vilém. Tehdy ještě nebyl ani hrabě, ani kancléř, jen správce zásob, co se moc rád díval na mapy. Ale ten den velel on.', 'sad'),
      S('vojta', 'Hořany byla hezká ves. Pod lesem, u potoka. Lidi tam žili s dračím lidem dohromady, chápeš? Mlýn měli společnej, kostel, hospodu. Svatby. Viděl jsem tam dítě, co mělo jeden roh a pihy. Vilém řekl, že je to hnízdo zrády. Že je to musíme vyčistit. Že je to rozkaz od krále.', 'sad'),
      S('vojta', 'Tak jsme je vyčistili. Ohněm. A druhej den Vilém napsal hlášení, že Hořany spálili draci. A my všichni jsme kývli. Víš, co je nejhorší? Že kývnout bylo tak snadný. Jen pohnout hlavou.', 'sad'),
      S('vojta', 'V popelu jsme pak našli dítě. Živý. Nad ním stál starý drak a brečel. Drak, chápeš, velkej jako kostel, a brečel jako ženská nad hrobem. Vilém ho chtěl zabít. Draka i dítě. Ale přijel král Bořivoj. Podíval se na to všechno, na ten popel, na nás, na draka. Pak sesedl, vzal dítě do pláště a odjel bez jediného slova.', 'n'),
      S('vojta', 'Já jsem ten den zahodil meč do potoka. Od tý doby štípu dřevo. Dřevo aspoň nekřičí.', 'n'),
      'Dívá se na tebe. Dlouho. Na tvé oči, na tvé ruce, na tvou tvář, jako by v ní něco hledal a bál se, že to najde.',
      S('vojta', 'Tak ty jsi to dítě. Bože. Bože můj.', 'shock')
    ], enter: (G, A) => { A.clue('horany', 'Vojta: Hořany nespálil drak, ale vojáci hraběte Viléma (dnes kancléře). Pak to svedli na draky. Vilém chtěl zabít i dítě z popela – mě.'); A.ap('vojta', 2, true); }, ch: [{ t: '„Pomoz mi. Prosím.“', go: 'l_vojta_ok' }] },

    // ── l_vojta_ok ── Vojta se přidá do družiny.
    //    Sem se dostaneš z: l_vojta, l_vojta_horany
    l_vojta_ok: { bg: 'les', npc: [{ id: 'vojta', x: .72 }], t: [S('vojta', 'Dobře. Provedu tě lesem. Znám v něm každou stezku, i ty, co tam včera nebyly.', 'n'), S('vojta', 'A když v poledne přijede Kazimír… sekera pořád seká. Dvacet let jsem ji držel dole. Možná je čas ji zase zvednout.', 'n'), 'Vstane, hodí si sekeru na rameno a poprvé za celou dobu vypadá, že ví, proč ji nosí.'], enter: (G, A) => { A.join('vojta'); A.quest('les', 'Přes Černý les', 'Vojta mě provede Černým lesem ke Dračímu hrádku.'); }, ch: [{ t: 'Zpět do vesnice.', go: 'l_hub' }] },

    // ── l_past ── Hráč může s vesničany připravit past na Kazimíra.
    //    Sem se dostaneš z: l_hub
    l_past: { bg: 'lhota', npc: [{ id: 'bohous', x: .7 }, { id: 'lid', x: .82 }, { id: 'lid2', x: .92 }], t: [
      'Na návsi se seběhne hlouček sedláků. Mají cepy, kosy, jedny vidle s ulomeným hrotem, sekeru na dříví a jednu rezavou kuši po dědovi, o které nikdo neví, jestli vystřelí dopředu, nebo dozadu.',
      'A mají strach. Hodně strachu. Je to strach lidí, kteří celý život slýchali, že proti pánům se nic nezmůže, a kteří tomu věřili, protože pokaždé, když to někdo zkusil, visel potom na návsi.',
      'Dívají se na tebe. Čekají, co řekneš. Nikdo se jich na nic takového nikdy neptal.'
    ], ch: [
      { t: 'Vymyslet past: zátaras z vozů a past na koně v úvozu.', chk: { s: 'duv', dc: 12, ok: 'l_past_ok', no: 'l_past_no' } },
      { t: 'Promluvit k nim. Dodat jim odvahu.', chk: { s: 'cha', dc: 12, ok: 'l_past_ok', no: 'l_past_no' } },
      { t: 'Nechat je být.', go: 'l_hub' }
    ] },

    // ── l_past_ok ── Past je hotová, v boji s Kazimírem pomůže.
    //    Sem se dostaneš z: l_past
    l_past_ok: { bg: 'lhota', npc: [{ id: 'bohous', x: .7 }, { id: 'lid', x: .82 }, { id: 'lid2', x: .92 }], t: [
      'Do poledne se Lhota promění. V úvozu, kudy vede cesta od Popelova, stojí zátaras z převrácených vozů a hnojných kár. Za ním je vykopaná jáma přikrytá chrastím, do které by se vešel kůň i s jezdcem. A za tím vším stojí dvacet sedláků, kteří ještě ráno věřili, že nic nezmůžou.',
      'Teď tomu věří o něco méně. Je to zvláštní věc, odvaha. Nepřichází najednou, jako blesk. Přichází po kouscích, jako voda do sklepa, a jednoho dne zjistíš, že ti sahá po krk.',
      S('bohous', 'Když to nevyjde, pověsí nás všechny. Na tu novou šibenici, co nám postavili, aby se nemuseli namáhat. Ale aspoň ne na kolenou. Na kolenou už jsme byli dost dlouho.', 'n')
    ], enter: (G, A) => { A.set('lhotaPast'); A.ap('ester', 2); }, ch: [{ t: 'Dál', go: 'l_hub' }] },

    // ── l_past_no ── Vesničané se rozutekli, past nebude.
    //    Sem se dostaneš z: l_past
    l_past_no: { bg: 'lhota', npc: [{ id: 'bohous', x: .7 }], t: ['Sedláci kývají. Souhlasí. Říkají „jo“ a „jasně“ a „to bysme mohli“. A pak se jeden po druhém vytratí domů, za zavřené okenice, protože strach, který se usazoval celé generace, se jedním proslovem nevyžene.', 'Bohouš zůstane na návsi sám, s vidlemi v ruce. Nevyčítá ti nic. Zná svoje lidi.'], enter: (G, A) => A.set('lhotaPast', 0), ch: [{ t: 'Dál', go: 'l_hub' }] },

    // ── l_kazimir ── V poledne přijede Kazimír s fanatiky. Boj, lest, nebo vydat uprchlíky.
    //    Sem se dostaneš z: l_hub
    l_kazimir: { bg: 'lhota', mood: 'tense', npc: [{ id: 'fanatik', x: .64 }, { id: 'fanatik', x: .76 }, { id: 'zoldak', x: .88 }, { id: 'zoldak', x: .98 }], t: (G, A) => [
      'Poledne přijde i tak, jak to poledne dělá. Na cestě od Popelova se zvedne prach a z prachu vyjede průvod: vpředu na bílém koni muž v bílém rouchu a s bílou maskou bez úsměvu, za ním pěšky čtyři fanatici s pochodněmi, které v poledním slunci vypadají hloupě a zbytečně, a za nimi kancléřovi žoldáci, kteří vypadají, že tu jsou jen pro peníze. Což jsou.',
      'Bratr Kazimír. O bratrech Řádu se říká, že pod maskou nemají tvář, jen světlo. To je pověra. Pod maskou mají tvář jako každý jiný. To je na tom to horší.',
      S('fanatik', 'Lhoto! Ve vašich zdech se skrývá šupinaté plemeno, krev zrady, která spálila Žárov! Vydejte je a Bledý plamen vás ušetří. Neuposlechnete – shoříte s nimi a váš popel rozfouká vítr. Odpočítávám do sta.', 'angry'),
      'A opravdu začne počítat. Nahlas, pomalu, s chutí. Jedna. Dvě. Tři.',
      S('bohous', 'Výsosti… Prosím vás. Mám tu vnoučata.', 'sad')
    ], ch: (G, A) => [
      { t: 'Postavit se jim. Bojovat.', tag: 'Boj', go: 'l_boj' },
      { t: '„Uprchlíci utekli do lesa. Tady máte jejich stopy.“ (falešná stopa)', chk: { s: 'duv', dc: 13, ok: 'l_lest', no: 'l_boj' } },
      { t: 'V plášti Řádu: „Bratře, tento mlýn už prohledal Řád. Já [[sám|sama]].“', if: () => A.item('plast'), chk: { s: 'cha', dc: 12, ok: 'l_lest', no: 'l_boj' } },
      { t: 'Vydat uprchlíky. Lhota se nesmí obětovat za cizí.', go: 'l_vydani' }
    ] },

    // ── l_boj ── Boj s Kazimírem ve Lhotě.
    //    Sem se dostaneš z: l_kazimir
    l_boj: { bg: 'lhota', mood: 'fight', fight: { foes: (G, A) => A.has('lhotaPast') ? ['fanatik', 'zoldak', 'zoldak'] : ['fanatik', 'fanatik', 'zoldak', 'zoldak'], intro: 'Sedláci za zátarasy zařvou, víc ze strachu než z odvahy, ale zařvou. Kazimír tasí meč.', win: 'l_vyhra', lose: 'l_prohra', gold: 10 } },

    // ── l_vyhra ── Kazimír je poražený, Lhota je zachráněná.
    //    Sem se dostaneš z: l_boj
    l_vyhra: { bg: 'lhota', npc: [{ id: 'bohous', x: .72 }, { id: 'drakolid', x: .86 }], t: (G, A) => [
      'Kazimír leží v prachu návsi a jeho bílá maska se odkutálela až ke studni. Lidé se kolem něj seběhnou a dívají se. Pod maskou je obyčejná tvář. Kulatá, s pihami a s jizvou po neštovicích na bradě.',
      'Tvář Kazimíra Masaře, řezníka z Popelova, od kterého celá Lhota léta kupovala uzené. Jedna z žen se pokřižuje. Jiná se rozesměje, a ten smích je ošklivý a úlevný zároveň.',
      'Pak se otevřou dveře mlýna. Ven vycházejí lidé s rohy, nejdřív opatrně, pak víc. Na návsi stojí sedláci s cepy a dívají se na ně přes celou ves. Chvíli se nic neděje. Lhota a Škvára na sebe hledí, jako by se viděly poprvé, a možná se vidí poprvé.',
      'Pak stařešina Žár přejde náves, pomalu, o holi, a podá Bohoušovi ruku. Bohouš se na ni chvíli dívá. Je to ruka s šupinami a s popáleninami po kovadlině. Pak ji stiskne.†',
      '† V kronice Lhoty, kterou vede farář a kterou nikdo nečte, je ten den zapsán jedinou větou: „Ve čtvrtek přijel Řád a odjel bez Kazimíra. Úroda slabá.“ Farář nebyl hrdina a o velkých věcech psát neuměl. Ale zapsal to, a to je víc, než udělal kdokoli z kronikářů kancléřství.',
      A.inParty('ester') ? S('ester', 'Tohle mi nikdo neuvěří. Lhota se postavila Řádu. Lhota, kde se lidi bojí i vlastního stínu, protože by ho mohli zdanit. Kvůli tobě.', 'smile') : null
    ], enter: (G, A) => { G.f.lhota = 'branena'; A.set('lhotaSpojenec'); A.done('mlyn'); A.ap('ester', 2); A.ap('sarra', 2); A.ap('vojta', 1); A.done('lhota'); }, ch: [{ t: 'Na noc do tábora za vesnicí.', go: 'tabor1' }] },

    // ── l_prohra ── Hráč prohrál, Kazimír odvezl uprchlíky.
    //    Sem se dostaneš z: l_boj
    l_prohra: { bg: 'lhota', npc: [{ id: 'bohous', x: .72 }], t: ['Padneš do prachu a svět se ztratí. Když se vrátí, je cítit kouř.', 'Mlýn hoří. Hoří pomalu a smutně, jak hoří stará místa, která toho viděla moc. Kazimír odvezl uprchlíky v řetězech do Popelova, kde je čeká popravčí den. Lhota stojí. Tentokrát. Kazimír ji nechal stát, aby měl kdo vyprávět, co se stane těm, kdo se staví Řádu na odpor.', S('bohous', 'Snažil{a} ses. To je víc, než pro nás kdy kdo udělal. Víc než král, víc než Řád, víc než Pánbůh. Já si to budu pamatovat.', 'sad')], enter: (G, A) => { G.f.lhota = 'prohra'; A.done('mlyn', false); A.set('uprchliciZajati'); }, ch: [{ t: 'Do tábora za vesnicí.', go: 'tabor1' }] },

    // ── l_lest ── Lest se povedla, Kazimír odjede po falešných stopách.
    //    Sem se dostaneš z: l_kazimir
    l_lest: { bg: 'lhota', npc: [{ id: 'fanatik', x: .7 }], t: ['Kazimír sesedne z koně a skloní se nad stopami u potoka. Jsou to dobré stopy: bosé dětské nohy, šlápoty dospělých, jeden ztracený střevíc. Ještě před hodinou tam nebyly, ale to bratr Kazimír nemůže vědět, protože stopování se v řeznictví neučí.', 'Zavrčí, zavelí a celý průvod se s řinčením a pochodněmi vydá k lesu. Na opačnou stranu, než je mlýn.', 'Za humny se Lhota smíchem chytá za břicho. Tiše. Velmi, velmi tiše. Takhle se smějí lidé, kteří se dlouho nesmáli a kteří vědí, že smích se za určitých okolností trestá.'], enter: (G, A) => { G.f.lhota = 'lest'; A.set('lhotaSpojenec'); A.done('mlyn'); A.ap('ester', 2); A.ap('plachta', 1); A.done('lhota'); }, ch: [{ t: 'Na noc do tábora.', go: 'tabor1' }] },

    // ── l_vydani ── Hráč vydal uprchlíky. Přidá hodně temnoty.
    //    Sem se dostaneš z: l_kazimir
    l_vydani: { bg: 'lhota', mood: 'sad', npc: [{ id: 'fanatik', x: .7 }, { id: 'drakolid', x: .84 }], t: (G, A) => [
      'Kývneš. Jen pohneš hlavou. Je to tak snadné.',
      'Bohouš se rozpláče úlevou, a pak hanbou, a pak už se nedá rozeznat čím. Fanatici vyvádějí z mlýna lidi s rohy a navlékají jim na krky železné obojky. Ženy, starce, děti. Děti nepláčou. Ani teď. To je to nejhorší.',
      'Stařešina Žár se na tebe podívá, když ho vedou kolem. Nic neřekne. Nemusí. Jeho pohled ti zůstane, dlouho poté, co prach za průvodem slehne.',
      A.inParty('sarra') ? S('sarra', 'Tak tohle jsi. Dobře, že to vím teď, a ne až v Popelově. Sbohem. A ať tě tvoje koruna hřeje.', 'angry') : null,
      A.inParty('ester') ? S('ester', 'Táta je naživu. Lhota je celá. Já ti mám děkovat? Kurva. Nevím, jestli ti mám děkovat.', 'sad') : null
    ], enter: (G, A) => { G.f.lhota = 'vydani'; A.set('uprchliciZajati'); A.done('mlyn', false); A.inc('temnota', 2); if (A.inParty('sarra')) { A.ap('sarra', -10); A.leave('sarra', 'odchází. Navždy'); } A.ap('ester', -3); A.ap('vojta', -3); A.set('lhotaSpojenec'); }, ch: [{ t: 'Odejít z vesnice.', go: 'tabor1' }] },

    /* ---------- tábor 1 ---------- */

    // ── tabor1 ── První noc v táboře. Hráč si může přisednout ke členům družiny.
    //    Sem se dostaneš z: l_vyhra, l_prohra, l_lest, l_vydani
    tabor1: { bg: 'tabor', mood: 'warm', npc: [], cp: 1, enter: (G, A) => { A.rest(); }, t: (G, A) => [
      'Utáboříte se na mýtině za Lhotou, kde začíná les. Oheň praská, nad ním visí hrnec s polévkou z toho, co dala Lhota, a nad hrncem se klene noc.',
      'Poprvé v životě spíš pod širým nebem. Je větší, než sis kdy myslel{a}, když ses na něj díval{a} oknem věže, a hvězd je na něm tolik, že se nedají spočítat, i když to Plachtička zkouší a u sto dvanácti to vzdá s tím, že tamty vzadu jsou stejně jen pro parádu. Někde v lese houká sova. Ozve se jednou, dvakrát, a pak už jen poslouchá, jako všichni.',
      G.party.filter(c => c !== 'plachta').length ? 'Družina sedí kolem ohně. Každý mlčí jinak. Je to zvláštní věc, společné mlčení u ohně: řekne se v něm víc než v mnoha hovorech, jen se tomu musí umět naslouchat.' : 'Sedíš u ohně [[sám|sama]] s veverkou. Les kolem šumí a je v tom šumění cosi starého a laskavého, jako hlas babičky, kterou jsi nikdy neměl{a}. Možná je to tak lepší.'
    ], ch: (G, A) => [
      { t: 'Přisednout si k Ester.', if: () => A.inParty('ester'), go: 't1_ester' },
      { t: 'Přisednout si k Vojtovi.', if: () => A.inParty('vojta'), go: 't1_vojta' },
      { t: 'Přisednout si k Sarře.', if: () => A.inParty('sarra'), go: 't1_sarra' },
      { t: 'Přisednout si k Radimovi.', if: () => A.inParty('radim'), go: 't1_radim' },
      { t: 'Přisednout si k Plachtičce.', go: 't1_plachta' },
      { t: 'Jít spát.', go: 'les' }
    ] },

    // ── t1_ester ── Rozhovor s Ester u ohně. Možnost flirtu [♥].
    //    Sem se dostaneš z: tabor1
    t1_ester: { bg: 'tabor', npc: [{ id: 'ester', x: .66 }], t: (G, A) => [
      'Ester sedí opodál, zády ke kmeni, a čistí kuši. Nedívá se na tebe, když si přisedneš, ale posune se, abys měl{a} místo.',
      S('ester', 'Víš, co je na tobě divný? Díváš se na všechno, jako bys to viděl{a} poprvé. Oheň. Les. Hvězdy. Mě.', 'n'),
      S('ester', A.ap && (G.ap.ester || 0) >= 3 ? 'Líbí se mi to. Na mě se nikdo nikdy takhle nedíval. Spíš jako na něco, co se dá sebrat, prodat nebo pověsit.' : 'Nevím, jestli se mi to líbí. Lidi, co se diví, obvykle brzo umřou. Svět se nediví zpátky.', 'smirk')
    ], ch: (G, A) => [
      { t: '[♥] „Protože jsi. Něco nového.“', tag: '♥', if: () => (G.ap.ester || 0) >= 2, go: 't1_ester_flirt' },
      { t: '„Pověz mi o Lhotě. O tom, jak jsi vyrůstala.“', go: 't1_ester_rec', ap: { ester: 1 } },
      { t: '„Dobrou noc, Ester.“', go: 'les' }
    ] },

    // ── t1_ester_flirt ── Flirt s Ester.
    //    Sem se dostaneš z: t1_ester
    t1_ester_flirt: { bg: 'tabor', npc: [{ id: 'ester', x: .66 }], t: [S('ester', 'To byla nejhorší věta, jakou jsem kdy slyšela. A já slyšela opilýho faráře na svatbě, jak se vyznává nevěstině kozě.', 'smile'), 'Ale neodtáhne se. Dívá se do ohně a ruka jí leží v trávě kousek od tvé. Jen kousek. Ani jeden z vás tu vzdálenost nepřekročí. Ani jeden z vás ji nezvětší.'], enter: (G, A) => { A.set('flirt_ester'); A.ap('ester', 1); }, ch: [{ t: 'Nechat to tak. Spát.', go: 'les' }] },

    // ── t1_ester_rec ── Ester vypráví o dětství ve Lhotě.
    //    Sem se dostaneš z: t1_ester
    t1_ester_rec: { bg: 'tabor', npc: [{ id: 'ester', x: .66 }], t: [S('ester', 'Máma umřela, když mi bylo osm. Hlad. Ten rok vybírali dračí daň dvakrát, protože se kancléřovi nelíbilo, jak málo vybrali poprvé.', 'n'), S('ester', 'Táta pak pil a já jsem se naučila střílet, abychom měli co jíst. Bratra, Kubu, pověsili za srnu. Za jednu srnu, chápeš? Byla hubená a stejně jsme ji nesnědli, protože nám ji sebrali.', 'n'), S('ester', 'Od tý doby střílím jen panský srny. Z principu. Kdyby mě pověsili, aspoň vědí proč.', 'smirk')], ch: [{ t: 'Dál', go: 'les' }] },

    // ── t1_vojta ── Rozhovor s Vojtou u ohně. Možnost flirtu [♥].
    //    Sem se dostaneš z: tabor1
    t1_vojta: { bg: 'tabor', npc: [{ id: 'vojta', x: .66 }], t: ['Vojta sedí nejblíž k ohni, jako by mu byla pořád zima, a přikládá větvičky jednu po druhé, pečlivě, s rozmyslem, jako by stavěl něco důležitého.', S('vojta', 'Dvacet let nespím. Teda spím, ale nespím. Pokaždý, když zavřu oči, vidím Hořany. Ten mlýn. To dítě s rohem a pihama.', 'sad'), S('vojta', 'A teď vidím tebe. To dítě v popelu. Jak jsi vyrostl{a}. Nevím, jestli je to lepší, nebo horší.', 'sad')], ch: (G, A) => [
      { t: '„Nebyla to tvoje vina. Byl jsi kluk a měl jsi rozkaz.“', go: 't1_vojta_odp', ap: { vojta: 2 } },
      { t: '„Byla. Ale můžeš ji odčinit.“', go: 't1_vojta_odp', ap: { vojta: 1 } },
      { t: '[♥] Položit mu ruku na tvář. „Teď vidíš mě. Ne popel.“', tag: '♥', if: () => (G.ap.vojta || 0) >= 2, go: 't1_vojta_flirt' }
    ] },

    // ── t1_vojta_odp ── Vojta přijme útěchu.
    //    Sem se dostaneš z: t1_vojta
    t1_vojta_odp: { bg: 'tabor', npc: [{ id: 'vojta', x: .66 }], t: [S('vojta', 'Možná. Možná ne. Ale dneska poprvé za dlouhý roky nemám chuť se opít. To je něco. Nevím co, ale je to něco.', 'n')], ch: [{ t: 'Spát.', go: 'les' }] },

    // ── t1_vojta_flirt ── Flirt s Vojtou.
    //    Sem se dostaneš z: t1_vojta
    t1_vojta_flirt: { bg: 'tabor', npc: [{ id: 'vojta', x: .66 }], t: ['Velký chlap ztuhne jako srna, která zaslechla praskot větve. Chvíli nedýchá. Pak si tvou dlaň přitiskne víc k tváři, do vousů, a zavře oči.', S('vojta', 'Tohle bys neměl{a}. Já jsem starej, rozbitej a smrdím kouřem. A ty jsi [[král|královna]], nebo budeš.', 'n'), S('vojta', 'Ale nepouštěj mě. Ještě chvíli ne.', 'sad')], enter: (G, A) => { A.set('flirt_vojta'); A.ap('vojta', 1); }, ch: [{ t: 'Spát.', go: 'les' }] },

    // ── t1_sarra ── Rozhovor se Sarrou u ohně. Možnost flirtu [♥].
    //    Sem se dostaneš z: tabor1
    t1_sarra: { bg: 'tabor', npc: [{ id: 'sarra', x: .66 }], t: ['Sarra sedí na kraji světla a otáčí v rukou kladivo. Těžké, kovářské, s topůrkem ohlazeným jejími dlaněmi do lesku.', S('sarra', 'Víš, proč mám kladivo? Protože meč nám zakázali nosit. Výnos kancléřství, rok po válce: dračí lid nesmí nosit zbraň. Kladivo je nářadí. Nářadí smí mít i zvíře.', 'angry'), S('sarra', 'Moje babička kovala žárovou ocel. Meče pro krále, co se neohnou ani nezreznou. Já kovám hřebíky do rakví. Až tohle skončí, chci, aby moje neteř mohla nosit meč. A aby jí nikdo neřekl šupinačko.', 'n')], ch: (G, A) => [
      { t: '„Až budu vládnout, dračí lid bude mít stejná práva. Přísahám.“', go: 't1_sarra_odp', ap: { sarra: 2 }, fx: (G2, A2) => A2.set('slibPrava') },
      { t: '„Nejdřív musím přežít. Pak uvidíme.“', go: 't1_sarra_odp', ap: { sarra: -1 } },
      { t: '[♥] „Řekni mi, jaké to je – chrlit oheň.“ Přisednout blíž.', tag: '♥', if: () => (G.ap.sarra || 0) >= 2, go: 't1_sarra_flirt' }
    ] },

    // ── t1_sarra_odp ── Sarra odpoví na slib.
    //    Sem se dostaneš z: t1_sarra
    t1_sarra_odp: { bg: 'tabor', npc: [{ id: 'sarra', x: .66 }], t: [S('sarra', 'Slova. Slyšela jsem jich hodně. Ale tvoje slova zatím vždycky něco stála. To je u lidí z hradu novinka. Uvidíme.', 'n')], ch: [{ t: 'Spát.', go: 'les' }] },

    // ── t1_sarra_flirt ── Flirt se Sarrou.
    //    Sem se dostaneš z: t1_sarra
    t1_sarra_flirt: { bg: 'tabor', npc: [{ id: 'sarra', x: .66 }], t: [S('sarra', 'Jako by ti v hrudi hořela kovárna a ty jsi měchy. Pálí to. Je to krásný. Lidi si myslí, že to bolí. Bolí jenom to, když to musíš držet v sobě.', 'smirk'), 'Vydechne do noci malý plamínek, modrý u kořene a zlatý na konci. Osvítí ti tvář. Nechá ho hořet o chvilku déle, než je nutné.'], enter: (G, A) => { A.set('flirt_sarra'); A.ap('sarra', 1); }, ch: [{ t: 'Spát.', go: 'les' }] },

    // ── t1_radim ── Rozhovor s Radimem na hlídce. Možnost flirtu [♥].
    //    Sem se dostaneš z: tabor1
    t1_radim: { bg: 'tabor', npc: [{ id: 'radim', x: .66 }], t: ['Radim sedí na hlídce, rovně jako na nádvoří, s mečem přes kolena. Nedívá se do ohně. Vojáci se nedívají do ohně, říká, protože pak ve tmě nic nevidí.', S('radim', 'Donesl jsem králi jed. Svýma rukama, Výsosti. Vyzvedl jsem lahvičku u lékárníka, protože mi to kancléř nařídil, a nezeptal jsem se. Dvacet let služby, a tohle je to, co si o mně zapamatují.', 'sad')], ch: (G, A) => [
      { t: '„Zapamatují si, co uděláš teď.“', go: 't1_radim_odp', ap: { radim: 2 } },
      { t: '„Ano. To si zapamatují.“', go: 't1_radim_odp', ap: { radim: -1 } },
      { t: '[♥] „Já si zapamatuju tohle.“ Sundat mu rukavici a vzít ho za ruku.', tag: '♥', if: () => (G.ap.radim || 0) >= 3, go: 't1_radim_flirt' }
    ] },

    // ── t1_radim_odp ── Radim jde hlídat.
    //    Sem se dostaneš z: t1_radim
    t1_radim_odp: { bg: 'tabor', npc: [{ id: 'radim', x: .66 }], t: [S('radim', 'Spěte, Výsosti. Budu hlídat. Aspoň to umím. Hlídat a poslouchat rozkazy. To první se teď hodí víc.', 'n')], ch: [{ t: 'Spát.', go: 'les' }] },

    // ── t1_radim_flirt ── Flirt s Radimem.
    //    Sem se dostaneš z: t1_radim
    t1_radim_flirt: { bg: 'tabor', npc: [{ id: 'radim', x: .66 }], t: ['Ruka pod rukavicí je mozolnatá, plná drobných jizev, jaké zanechá roky s mečem. Chvíli se třese. Pak se uklidní a stiskne tvou.', S('radim', 'Tohle je proti všem předpisům, Výsosti.', 'n'), 'Dlouhá pauza. Je slyšet, jak přemýšlí, a protože je to Radim, přemýšlí v paragrafech.', S('radim', '…Žádný předpis to výslovně nezakazuje.', 'smirk')], enter: (G, A) => { A.set('flirt_radim'); A.ap('radim', 1); }, ch: [{ t: 'Spát.', go: 'les' }] },

    // ── t1_plachta ── Plachtička louská bukvici.
    //    Sem se dostaneš z: tabor1
    t1_plachta: { bg: 'tabor', npc: [{ id: 'plachta', x: .6 }], t: ['Plachtička sedí na pařezu, má ocas obtočený kolem sebe jako šálu a louská bukvici, kterou někde ukradla. Bukvice nebyla nikoho, ale Plachtička ji i tak považuje za ukradenou, protože jinak jí nechutná.', S('plachta', 'Jestli se pokusíš o něco romantickýho, ukousnu ti nos. Jen abys věděl{a}. Jsem veverka. Mám standardy. Nízký, ale mám.', 'angry'), S('plachta', 'Ale… jsem ráda, že jsme venku. Dvacet let jsem ti kradla medovinu a ty jsi mi nikdy nic neřekl{a}. To je buď přátelství, nebo blbost. U lidí se to špatně pozná.', 'n')], enter: (G, A) => A.ap('plachta', 1), ch: [{ t: 'Podrbat ji za uchem.', go: 'les' }, { t: 'Spát.', go: 'les' }] },

    /* ---------- Černý les ---------- */

    // ── les ── Černý les. Družinu obklíčí vlci.
    //    Sem se dostaneš z: tabor1, t1_ester, t1_ester_flirt, t1_ester_rec, t1_vojta_odp, t1_vojta_flirt, t1_sarra_odp, t1_sarra_flirt, t1_radim_odp, t1_radim_flirt, t1_plachta
    les: { bg: 'les', mood: 'wind', npc: [], snd: 'sova', lore: ['cernyles', 'pulelfove'], t: (G, A) => [
      'Ráno vejdete do Černého lesa a les se za vámi zavře jako voda.',
      'Je to starý les. Ne starý tak, jako jsou staré hrady nebo staré rody, které počítají svá léta na pergamenu. Starý tak, jako jsou staré hory: bez počítání, bez pergamenu, prostě odjakživa. Kmeny jsou tu černé a holé jako spálené kosti a jejich koruny se nahoře splétají tak hustě, že pod nimi i v poledne panuje šero. Mezi kořeny se drží mlha po pás a voní hnilobou, houbami a něčím sladkým, co se nedá pojmenovat a co je lepší nepojmenovávat.',
      'Kdysi tu žili elfové. Lhotští to říkají šeptem a s jistotou lidí, kteří elfa nikdy neviděli. Odešli prý někam, kam lidé nedojdou, a les po nich zůstal smutný. Ani pták tu nezpívá. Jen sova, jednou, daleko, jako by se ptala, kdo jste.',
      'Pak se mezi kmeny rozsvítí oči. Žluté. Dvoje. Šestery. Desatery. Vlci. Hubení, šediví, s žebry jako obruče na sudu. Hladový vlk je chytřejší než sytý a mnohem méně zdvořilý.',
      A.inParty('vojta') ? S('vojta', 'Nedívej se jim do očí. Pomalu. Znám tuhle smečku, ta stará fena s roztrženým uchem je vede. Když půjdeme po větru, nechají nás. Vlci nejsou zlí. Jen počítají.', 'n') : null
    ], ch: (G, A) => [
      { t: 'Poslechnout Vojtu a jít po větru.', if: () => A.inParty('vojta'), chk: { s: 'mou', dc: 10, ok: 'les2', no: 'les_vlci' } },
      { t: 'Ustoupit pomalu, nedívat se do očí.', chk: { s: 'mou', dc: 13, ok: 'les2', no: 'les_vlci' } },
      { t: '[Půlelf] Promluvit k vlkům jejich řečí, kterou ti zpívala krev.', if: () => A.race('elf'), chk: { s: 'mou', dc: 9, ok: 'les2', no: 'les_vlci' } },
      { t: 'Tasit zbraň.', tag: 'Útok', go: 'les_vlci' }
    ] },

    // ── les_vlci ── Boj s vlky.
    //    Sem se dostaneš z: les
    les_vlci: { bg: 'les', mood: 'fight', fight: { foes: ['vlk', 'vlk', 'vlk'], intro: 'Smečka zaútočí ze tří stran najednou, tiše, bez vytí. Vytí je pro měsíc. Lov je pro ticho.', win: 'les2', lose: 'les_prohra', flee: 'les2' } },

    // ── les_prohra ── Vlci hráče porazili, ale pak se stáhnou.
    //    Sem se dostaneš z: les_vlci
    les_prohra: { bg: 'les', npc: [], t: ['Vlci tě srazí do mechu. Zuby v rameni, zuby v lýtku, horký dech u krku.', 'A pak, zčistajasna, se stáhnou. Všichni najednou, s ocasy mezi nohama, jako by je někdo zavolal. Něco v hloubi lesa je vyděsilo víc než ty. A to, co vyděsí vlky, by mělo vyděsit i tebe.'], enter: (G, A) => A.hurt(4), ch: [{ t: 'Belhat se dál.', go: 'les2' }] },

    // ── les2 ── Chýše Vědmy na mýtině. Proroctví, šifra, kniha, lektvary.
    //    Sem se dostaneš z: les, les_vlci, les_prohra, v_kdo, v_proroctvi, v_dopis, v_dopis_ok, v_kniha, v_kralovna
    les2: { bg: 'vedma', mood: 'dark', npc: [{ id: 'vedma', x: .8 }], lore: 'vedma', t: [
      'Stezka, která vede jinam, než vedla včera, tě nakonec dovede na mýtinu, kde by žádná mýtina být neměla.',
      'Uprostřed stojí chýše. Nestojí na zemi, ale na kořenech starého dubu, které ji zvedají do výšky jako na kuřecích nohou, a dub je přitom už dávno mrtvý. Kolem chýše visí na provázcích kosti, ptačí, zvířecí a některé, o kterých je lepší nevědět, a cinkají jedna o druhou, i když nefouká ani ten nejmenší vánek.',
      'Ve dveřích stojí stará žena. Je drobná, shrbená a zabalená do tolika šátků, že se nedá říct, kde končí ona a kde začínají šátky. Její oči jsou bílé jako mléko. Slepá. A přesto se dívá přímo na tebe, a ne přes tebe, jak se dívají slepí. Na tebe. Dovnitř.',
      S('vedma', 'Dítě z popela. Konečně. Čekám na tebe dvacet let a ty si dáváš na čas, jako všichni mladí. Pojď dál. Neboj se, nekoušu. Zuby už nemám. Pojď dál a zavři za sebou, táhne.', 'smirk')
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

    // ── v_kdo ── Vědma vypráví, kdo je.
    //    Sem se dostaneš z: les2
    v_kdo: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [
      S('vedma', 'Kdo jsem? To je otázka, kterou si mladí kladou, a staří na ni zapomněli odpověď. Jsem slepá od narození. Vidět jsem nikdy nepotřebovala, viděla jsem jinak. Hůř a víc.', 'n'),
      S('vedma', 'Kdysi jsem bývala porodní bábou v Hořanech. Rodila jsem lidské i dračí děti, rukama, po hmatu, a žádné mi neumřelo. Ani jedno za čtyřicet let. Pak přišel ten oheň a vzal mi je všechny najednou. Všechny, co jsem kdy chytila do dlaní.', 'sad'),
      S('vedma', 'Kromě jednoho.', 'n'),
      'Nic víc neřekne. Jen se usměje bezzubými ústy a nalije ti do hrnku něco, co voní jako mateřídouška a chutná jako bláto.†',
      '† Je to skutečně mateřídouška a skutečně bláto. Vědma tvrdí, že bláto je zdravé, protože obsahuje zem, a země obsahuje všechno. Je to argument, který se nedá vyvrátit, jen vyplivnout.'
    ], enter: (G, A) => A.set('vKdo'), ch: [{ t: 'Dál', go: 'les2' }] },

    // ── v_proroctvi ── Vědma věští budoucnost.
    //    Sem se dostaneš z: les2
    v_proroctvi: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [
      'Vědma si sedne ke krbu, ve kterém nehoří oheň, ale přesto z něj jde teplo, a natáhne ruce nad popel. Kosti venku přestanou cinkat. Les zadrží dech.',
      S('vedma', 'Vidím tři koruny. Jednu z popela – lehkou, protože je z toho, co zbylo, když všechno ostatní shořelo. Jednu ze železa – těžkou, protože ji drží na hlavě strach, a strach je těžký. A jednu, kterou nikdo nenosí, protože ji všichni nesou spolu.', 'n'),
      S('vedma', 'Vidím slzu, která může zachránit jen jednoho. A husu. Proč, u všech kořenů, vidím husu? Nevím. Osud má smysl pro humor, a obvykle je to humor, kterému se směje jen on.', 'smirk'),
      S('vedma', 'A vidím oheň, který přiletí z hor. Jestli ho zavoláš s nenávistí, spálí všechno. Jestli s láskou, spálí jen to, co má. Oheň neumí rozlišovat sám, dítě. Rozlišuje ten, kdo ho volá.', 'n'),
      'Pak se kosti venku zase rozcinkají a Vědma kýchne, a kouzlo je pryč.'
    ], enter: (G, A) => A.set('vProroctvi'), ch: [{ t: 'Dál', go: 'les2' }] },

    // ── v_dopis ── Vědma rozluští dopis za krev, vzpomínku, nebo zlato.
    //    Sem se dostaneš z: les2
    v_dopis: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [S('vedma', 'Slepá žena a šifra. To je vtip, který by se líbil bohům, kdyby nějací zbyli. Řekni mi ta písmena nahlas, jedno po druhém, a já ti řeknu jejich smysl.', 'smirk'), S('vedma', 'Ale něco to stojí. Všechno něco stojí, dítě. Kdo ti říká, že ne, ten ti něco prodává.', 'n')], ch: [
      { t: 'Zaplatit krví.', go: 'v_dopis_ok', fx: (G, A) => A.hurt(5) },
      { t: 'Zaplatit vzpomínkou. (−1 Moudrost)', go: 'v_dopis_ok', fx: (G, A) => { G.st.mou--; A.toast('Moudrost −1. Zapomněl{a} jsi Hedvičin hlas.'.replace('{a}', G.sex === 'f' ? 'a' : '')); } },
      { t: 'Zaplatit zlatem. (15 zl)', cost: 15, go: 'v_dopis_ok' },
      { t: 'Rozmyslím si to.', go: 'les2' }
    ] },

    // ── v_dopis_ok ── Vědma přečte kancléřův dopis.
    //    Sem se dostaneš z: v_dopis
    v_dopis_ok: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [
      'Vědma poslouchá písmena se zavřenýma očima, kývá hlavou a pohybuje rty, jako by počítala korálky na růženci. Pak promluví, a hlas se jí změní: je suchý, úřední a zdvořilý. Je to hlas, který jsi už slyšel{a}.',
      S('vedma', '„Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. – V.“', 'n'),
      S('vedma', 'Hořany. Řád dostane popel, který sám nadělal. Pozemky, louky, mlýn a les. Za dvacet let na nich nikdo nebydlí, tak proč by je nedostal. To je spravedlnost úředníků: nikdy nikomu nic neukradnou, jen to přepíšou.', 'angry')
    ], enter: (G, A) => A.clue('dopis', 'Dopis kancléře Řádu: „Až král padne, Škvára shoří a dědic zmizí v ohni. Rada potřebuje jen jednoho regenta. Řád dostane Hořany. – V.“'), ch: [{ t: 'Dál', go: 'les2' }] },

    // ── v_kniha ── Vědma přečte lékárníkovu knihu.
    //    Sem se dostaneš z: les2
    v_kniha: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: ['Vědma přejede prsty po stránce, pomalu, něžně, jako se přejíždí po tváři spícího dítěte. Inkoust jí pod konečky prstů šeptá.', S('vedma', '„Černá rosa – jedna lahvička – převzal R. K. – na účet Kancléřství.“ Otisk pera je hluboký. Kdo to psal, ten se bál, a tlačil, aby se mu netřásla ruka.', 'n')], enter: (G, A) => A.clue('kniha', 'Lékárníkova kniha: „Černá rosa – 1 lahvička – převzal R. K. – na účet Kancléřství.“'), ch: [{ t: 'Dál', go: 'les2' }] },

    // ── v_kralovna ── Vědma vypráví o královně Moraně.
    //    Sem se dostaneš z: les2
    v_kralovna: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [S('vedma', 'Morana. Krásná Morana z bažin, která zpívala tak, že se v Žárově zastavovaly vozy. Ta žena tě nemiluje míň proto, že tě zavřela do věže. Miluje tě špatně. To je rozdíl, dítě. Velký rozdíl, i když zevnitř věže vypadá stejně.', 'n'), S('vedma', 'Třikrát pohřbila dítě. Když přineseš do domu čtvrté, jak ho máš pustit ven? A k tomu jí někdo každý večer leje do poháru mlhu. Aby milovala ještě hůř. Aby se bála ještě víc.', 'n'), S('vedma', 'Až bude stát na kraji, podej jí ruku. Nebo ji strč. Obojí bude tvoje volba, a obojí si poneseš.', 'n')], enter: (G, A) => { A.set('vKralovna'); A.clue('kralovnaMlha', 'Vědma: královně někdo každý večer leje do poháru „mlhu“.'); }, ch: [{ t: 'Dál', go: 'les2' }] },

    // ── v_boj ── Hráč napadl Vědmu.
    //    Sem se dostaneš z: les2
    v_boj: { bg: 'vedma', mood: 'fight', fight: { foes: [{ id: 'vedma', boss: true }], intro: 'Kosti na provázcích se rozezvoní jako zvony na poplach. Vědma se směje a její smích je mnohem mladší než ona.', win: 'v_mrtva', lose: 'v_proklety' } },

    // ── v_mrtva ── Hráč Vědmu zabil. Přidá temnotu.
    //    Sem se dostaneš z: v_boj
    v_mrtva: { bg: 'vedma', npc: [{ id: 'vedma', pose: 'dead', x: .8 }], t: ['Stará žena leží na prahu své chýše, drobná jako hromádka šátků. Kosti přestaly cinkat. Les je najednou mnohem tišší, a to není dobře. Je to ticho, jaké nastává, když někdo zemře v domě, kde se dlouho žilo.', 'Kdesi v dálce zavyje vlk. Jednou, dlouze. Pak už nic.', S('plachta', 'Ona tě čekala dvacet let. Rodila děti v Hořanech. A tys ji zabil{a}, protože vypadala divně. Hezký. Fakt hezký. Já taky vypadám divně, jen abys věděl{a}.', 'sad')], enter: (G, A) => { A.inc('temnota', 2); A.ap('vojta', -2); A.ap('ester', -2); A.give('lektvar', 3); A.set('vedmaMrtva'); }, ch: [{ t: 'Ke zřícenině.', go: 'zricenina' }] },

    // ── v_proklety ── Vědma hráče porazila, ale neprokleje ho.
    //    Sem se dostaneš z: v_boj
    v_proklety: { bg: 'vedma', npc: [{ id: 'vedma', x: .8 }], t: [S('vedma', 'Hloupé dítě. Hloupé, hloupé dítě. Neprokleju tě. Nemusím. [[Ty sám|Ty sama]] sis už nadělal{a} dost prokletí na jeden život.', 'angry'), S('vedma', 'Jdi. A až se jednou budeš ptát, proč se ti nedaří, vzpomeň si na starou ženu, která ti nalila čaj.', 'n'), 'Svět se zatočí. Probudíš se na kraji lesa, v mechu, ke zřícenině blíž, než bys čekal{a}, a s pachutí bláta a mateřídoušky v ústech.'], ch: [{ t: 'Ke zřícenině.', go: 'zricenina' }] },

    /* ---------- Dračí hrádek ---------- */

    // ── zricenina ── Dračí hrádek na skalním ostrohu. Na prahu je past.
    //    Sem se dostaneš z: les2, v_mrtva, v_proklety
    zricenina: { bg: 'zricenina', mood: 'wind', npc: [], cp: 1, lore: 'hradek', t: (G, A) => [
      'Les skončí stejně náhle, jako začal, a před vámi se zvedne skalní ostroh. Na jeho vrcholu stojí Dračí hrádek.',
      'Kdysi to byla strážní věž, kde se za dob smlouvy scházeli draci s lidmi. Na jejím nádvoří se uzavíraly obchody, rozsuzovaly spory a pily se přípitky, a draci přilétali z hor a sedali na hradby tak opatrně, aby žádnou neprolomili. Teď z ní zbyly jen zdi a dvě věže, rozbité jako zuby po hospodské rvačce. Na cimbuří sedí vrány a nad tím vším visí měsíc, velký a bledý jako štít padlého rytíře.',
      'Brána zeje dokořán. Příliš dokořán. Na prahu leží rozházené kosti, a kosti, jak ví každé dítě z vesnice, se samy nerozhazují. Někdo je rozházel. Nebo něco.',
      A.inParty('sarra') ? S('sarra', 'Tady… tady se moji předkové scházeli s draky? V písních, co nám zpívala babička, to bylo větší. A čistší. A míň to smrdělo netopýry.', 'n') : null
    ], ch: [
      { t: 'Prozkoumat práh, než vkročíš.', chk: { s: 'duv', dc: 13, ok: 'z_past_ok', no: 'z_past' } },
      { t: 'Přeskočit práh a doufat.', chk: { s: 'obr', dc: 13, ok: 'krypta', no: 'z_past' } },
      { t: 'Poslat napřed Plachtičku.', go: 'z_plachta' }
    ] },

    // ── z_plachta ── Plachtička jde první a past spustí.
    //    Sem se dostaneš z: zricenina
    z_plachta: { bg: 'zricenina', npc: [{ id: 'plachta', x: .55 }], t: [S('plachta', 'Jasně. Pošli veverku. Veverka je levná. Veverek je v lese plno. Kdo by brečel pro veverku.', 'angry'), 'S hlubokým uraženým povzdechem vyskočí na práh a šlápne na první dlaždici.', { t: 'Cvak. Z boku vylétnou tři rezavé čepele, zasvištějí vzduchem a minou ji, protože je velká přibližně jako bota. Zato ty jsi stál{a} přímo za ní.', shake: 8 }, S('plachta', 'Pardon. Vlastně ne. Nepardon. Příště pošli sebe.', 'smirk')], enter: (G, A) => A.hurt(3), ch: [{ t: 'Dovnitř.', go: 'krypta' }] },

    // ── z_past ── Hráč šlápl do pasti a zranil se.
    //    Sem se dostaneš z: zricenina
    z_past: { bg: 'zricenina', npc: [], t: [{ t: 'Dlaždice ti pod nohou cvakne, tím nepříjemným, spokojeným cvaknutím, kterým se ozývají věci, které na tebe dlouho čekaly. Z boku vyletí čepel a projede ti stehnem.', shake: 10 }, 'Bolest přijde až po chvíli, jako opožděný host, ale zato se usadí a nechce odejít.'], enter: (G, A) => A.hurt(5), ch: [{ t: 'Dovnitř.', go: 'krypta' }] },

    // ── z_past_ok ── Hráč past našel a obešel.
    //    Sem se dostaneš z: zricenina
    z_past_ok: { bg: 'zricenina', npc: [], t: ['Skloníš se a v měsíčním světle uvidíš tenký drát, natažený přes práh ve výšce kotníku. Vedle něj uvolněnou dlaždici, pod ní pružinu.', 'Drát je nový a lesklý. Mazivo na pružině ještě nezaschlo. Někdo tu tu past nastražil, a ne před sto lety. Před pár dny. Řád ví, že sem někdo chodí. Nebo že sem někdo přijde.'], ch: [{ t: 'Dovnitř.', go: 'krypta' }] },

    // ── krypta ── Krypta pod hrádkem. Vstanou kostlivci.
    //    Sem se dostaneš z: zricenina, z_plachta, z_past, z_past_ok
    krypta: { bg: 'krypta', mood: 'dark', npc: [{ id: 'kostlivec', x: .66 }, { id: 'kostlivec', x: .8 }, { id: 'kostlivec', x: .94 }], t: [
      'Pod hrádkem vede schodiště do tmy a na jeho konci je krypta. Stropy jsou nízké, vzduch studený a těžký jako mokrá vlna. Po stranách stojí kamenné sarkofágy a na jejich víkách jsou vytesáni rytíři s meči na prsou a s havranem a drakem na štítech, propletenými dohromady.',
      'Rytíři smlouvy. Ti, kdo přísahali, že budou chránit mír mezi lidmi a draky i za cenu vlastního života. Když přišla válka, zůstali přísaze věrni, a za to je pohřbili sem, bez obřadu, bez kněze a bez jmen.',
      'Víka sarkofágů jsou odsunutá. Kosti se zvedají. Zarezlá brnění zachrastí, prázdné oční důlky se rozžhaví rudě jako uhlíky ve výhni. Pořád mají rozkaz: nikoho nepustit dál. Nikdo jim ho neodvolal. Nikdo jim ani neřekl, že válka skončila, a možná proto, že neskončila.'
    ], ch: [{ t: 'Rozbít je.', tag: 'Útok', fight: { foes: ['kostlivec', 'kostlivec', 'kostlivec'], win: 'k_sabina', lose: 'k_prohra' } }] },

    // ── k_prohra ── Kostlivci hráče porazili, ale pak ho nechají být.
    //    Sem se dostaneš z: krypta
    k_prohra: { bg: 'krypta', npc: [], t: ['Ležíš na studené dlažbě mezi sarkofágy. Kostlivci stojí nad tebou a jeden z nich už zvedá rezavý meč, a pak se zastaví. Nakloní hlavu. Jako by tě poznal. Jako by ucítil něco, co znal kdysi dávno, popel z Hořan, pach dračího ohně.', 'Pak se rozpadnou. Kosti zarachotí o kámen a zůstanou ležet. Jejich hlídka skončila.'], ch: [{ t: 'Zvednout se.', go: 'k_sabina' }] },

    // ── k_sabina ── Do krypty přijde Sabina s fanatiky. Hráč ji může přesvědčit důkazy, nebo bojovat.
    //    Sem se dostaneš z: krypta, k_prohra
    k_sabina: { bg: 'krypta', mood: 'tense', npc: [{ id: 'fanatik', x: .7 }, { id: 'sabina', x: .82 }, { id: 'fanatik', x: .94 }], t: (G, A) => [
      'Za tebou zazvoní kroky na schodech. Pak světlo. Bílé kápě, pochodně, a uprostřed nich drobná postava s holí a s bílým pírkem na rameni. Inkvizitorka Sabina.',
      'V záři pochodní je vidět jizva na její tváři, ta dlouhá, zvrásněná spálenina, která jí vzala půl obličeje. Druhá polovina je mladá a hezká a ze všeho nejvíc unavená.',
      S('sabina', A.has('sabinaNepritel') ? 'Řekla jsem ti, že Bledý plamen nezapomíná. Šla jsem po tvé stopě dva dny, přes Lhotu a přes ten proklatý les. Kancléř ti vzkazuje, že se tvá věž po tobě stýská.' : 'Dědic. Ve dračím hrobě. Kancléř měl pravdu. [[Přišel|Přišla]] jsi probudit draka, který spálil Žárov.', 'angry'),
      S('sabina', 'Kde je ta stvůra? Tvoje cesta končí tady. A jeho taky. Dvacet let čekám, až se mu podívám do očí.', 'n')
    ], ch: (G, A) => [
      { t: `Ukázat jí kancléřův dopis a říct pravdu o Hořanech.`, if: () => A.hasClue('dopis') && A.hasClue('horany'), chk: { s: 'cha', dc: A.has('sabinaPochopena') ? 9 : 12, ok: 's_obrat', no: 'k_boj' } },
      { t: '„Hořany nespálil drak, Sabino. Spálil je Vilém.“', if: () => A.hasClue('horany') && !A.hasClue('dopis'), chk: { s: 'cha', dc: A.has('sabinaPochopena') ? 13 : 16, ok: 's_obrat', no: 'k_boj' } },
      { t: 'Bojovat.', tag: 'Boj', go: 'k_boj' }
    ] },

    // ── k_boj ── Boj se Sabinou v kryptě.
    //    Sem se dostaneš z: k_sabina
    k_boj: { bg: 'krypta', mood: 'fight', fight: { foes: [{ id: 'sabina', boss: true }, 'fanatik', 'fanatik'], intro: 'Sabina zvedne hůl. Na jejím konci vzplane bledý plamen, který nehřeje, ale pálí, a sarkofágy kolem se v jeho světle zdají ještě starší.', win: 'k_sabina_por', lose: 'k_sabina_prohra' } },

    // ── k_sabina_prohra ── Hráč prohrál se Sabinou, zachrání ho drakův řev.
    //    Sem se dostaneš z: k_boj
    k_sabina_prohra: { bg: 'krypta', npc: [{ id: 'sabina', x: .8 }], t: ['Ležíš na zádech na studeném kameni. Sabina nad tebou zvedá hůl k poslednímu úderu, a bledý plamen na jejím konci ti osvětluje tvář.', 'A vtom se celou kryptou rozlehne zvuk. Hluboký, táhlý, jako když se pohnou hory. Prach padá ze stropu, sarkofágy se chvějí. Fanatici upustí pochodně a utečou. Sabina zaváhá, pohlédne do tmy pod kryptou a v její tváři je poprvé vidět strach. Pak zmizí taky.', { t: 'Ze tmy se ozve obrovské, zahleněné, naprosto nedůstojné *HAPČÍÍÍ* a chodbou proletí ohnivá koule velká jako vůz se senem.', snd: 'kych', shake: 14 }], enter: (G, A) => { G.f.sabina = 'zive'; }, ch: [{ t: 'Jít za tím zvukem.', go: 'k_hadanka' }] },

    // ── k_sabina_por ── Hráč Sabinu porazil. Ušetřit, přesvědčit, nebo zabít.
    //    Sem se dostaneš z: k_boj
    k_sabina_por: { bg: 'krypta', npc: [{ id: 'sabina', x: .8, pose: 'kneel' }], t: ['Sabina klečí na dlažbě. Hůl má zlomenou, kápi roztrženou a pírko z ramene je pryč. Zjizvená tvář je mokrá. Pot, nebo slzy. U Sabiny se to nedá poznat, protože pláče tak, jak se v Řádu učí: bez zvuku a bez pohybu.', S('sabina', 'Dokonči to. Bledý plamen mě přijme. Je to jediné místo, kam mě kdy kdo přijal.', 'n')], ch: (G, A) => [
      { t: 'Ušetřit ji. „Jdi. A přemýšlej, komu sloužíš.“', go: 'k_hadanka', fx: (G2, A2) => { G2.f.sabina = 'zive'; A2.ap('vojta', 1); A2.ap('sarra', -1); } },
      { t: '„Hořany spálil Vilém. Ty jsi jen jeho pochodeň.“', if: () => A.hasClue('horany'), go: 's_obrat' },
      { t: 'Dokončit to.', tag: 'Zabít', go: 'k_hadanka', fx: (G2, A2) => { G2.f.sabina = 'mrtva'; A2.ap('sarra', 2); A2.ap('vojta', -1); A2.inc('temnota'); A2.clue('sabinaMrtva', 'Sabina, inkvizitorka Řádu, je mrtvá. Kancléř přišel o svou pochodeň.'); } }
    ] },

    // ── s_obrat ── Sabina uvěří, že Hořany spálil Vilém. Přidá se na stranu hráče.
    //    Sem se dostaneš z: k_sabina, k_sabina_por
    s_obrat: { bg: 'krypta', npc: [{ id: 'sabina', x: .8 }], t: [
      'Sabina poslouchá. Nejdřív s posměšným úšklebkem, potom bez něj. Když jí podáš to, co máš, čte. Jednou. Podruhé. Ruce se jí začnou třást, stejně jako se třásly Hedvice tu noc ve věži, a pochodeň v rukou fanatika vedle ní najednou svítí příliš jasně.',
      S('sabina', 'Hořany… Řád mi o nich kázal. Hnízdo zrady, kde se dračí plemeno spolčilo s lidmi. Já jsem o tom kázala. Stokrát. Tisíckrát.', 'shock'),
      S('sabina', 'A Žárov… Já jsem ze Žárova. Byla jsem holka, mlynářova holka. Tu noc jsem se probudila v kouři a máma mě nesla ze schodů. Řád mi pak řekl, co jsem viděla. Draka, který se smál nad střechami. Říkali mi to tak dlouho, až jsem si to pamatovala.', 'sad'),
      S('sabina', 'Ale já si pamatuju něco jinýho. Teď, když to vidím napsaný. Pamatuju si muže ve žlutém plášti s pochodní, na rohu u naší brány. Pamatuju si, že se nesmál. Jen se díval na hodinky.', 'shock'),
      'Dlouho mlčí. Pochodně praskají. Kdesi v hloubi krypty něco velkého a starého zachrčí ze spánku.',
      S('sabina', 'Bledý plamen nebyl stvořen pro kancléřovy vraždy. Byl stvořen, aby pálil lež. Až se vrátíš do Popelova, budu tam. A tentokrát budu pálit správně.', 'angry')
    ], enter: (G, A) => { G.f.sabina = 'obracena'; A.clue('sabina', 'Sabina, inkvizitorka Řádu, uvěřila. Je ze Žárova a pochopila, že i Noc dlouhých plamenů byla Vilémova lež. Postaví se kancléři.'); A.ap('vojta', 2); A.ap('sarra', 1); }, ch: [{ t: 'Pokračovat hlouběji.', go: 'k_hadanka' }] },

    // ── k_hadanka ── Kamenné dveře s dračí hlavou a hádankou. Správně je „Jáma“.
    //    Sem se dostaneš z: k_sabina_prohra, k_sabina_por, s_obrat
    k_hadanka: { bg: 'krypta', npc: [], t: [
      'Na konci krypty se chodba zužuje a končí kamennými dveřmi. Jsou vysoké a těžké, bez kliky a bez zámku, a místo nich z nich vystupuje dračí hlava vytesaná do kamene, s otevřenou tlamou a s očima z červeného skla, které ve světle pochodně vypadají, že mrkají.',
      'Do kamene v tlamě je vyrytá hádanka, písmem starým a hranatým, jakým se psalo za smlouvy, kdy lidé ještě věřili, že slova jsou důležitější než klíče:',
      '*„Čím víc z ní bereš, tím je větší. Kopáč ji dělá, král do ní padá. Co jsem?“*',
      S('plachta', 'Moje žízeň! Ne? Kurva. Já myslela, že to bude moje žízeň.', 'n')
    ], ch: [
      { t: '„Jáma.“', go: 'doupe' },
      { t: '„Popel.“', go: 'k_hadanka_spatne' },
      { t: '„Koruna.“', go: 'k_hadanka_spatne' },
      { t: 'Přemýšlet.', chk: { s: 'duv', dc: 11, ok: 'k_hadanka_napoveda', no: 'k_hadanka_spatne' } }
    ] },

    // ── k_hadanka_napoveda ── Hod na Důvtip se povedl, hráč hádanku vyřeší.
    //    Sem se dostaneš z: k_hadanka
    k_hadanka_napoveda: { bg: 'krypta', npc: [], t: ['Čím víc bereš, tím je větší… Co se zvětšuje, když se z toho bere? Hlína. Rýč. Kopáč. Hrob. A do hrobu nakonec padne každý král, ať se mu to líbí, nebo ne.', 'Jáma. Samozřejmě. Je to tak jednoduché, že se to málem nedá uhodnout.'], ch: [{ t: '„Jáma.“', go: 'doupe' }] },

    // ── k_hadanka_spatne ── Špatná odpověď, dračí hlava hráče ožehne.
    //    Sem se dostaneš z: k_hadanka
    k_hadanka_spatne: { bg: 'krypta', npc: [], t: [{ t: 'Červené oči dračí hlavy se rozžhaví a z kamenné tlamy vyšlehne plamen. Ožehne ti obočí a polovinu sebevědomí. Dveře se nehnou.', shake: 6 }, 'Plachtička mezitím, aniž by čekala na další pokus, seskočí na podlahu, odhrabe tlapkou prach u zdi, najde tam páku, které si nikdo z vás nevšiml, a kopne do ní. Dveře se se skřípěním otevřou.', S('plachta', 'Hádanky jsou pro lidi s časem. Páky jsou pro veverky.', 'smirk'),
      '† Všechny dveře s hádankou na světě mají někde páku. Stavitelé to vědí, protože je sami potřebují, když zapomenou odpověď. Hrdinové to nevědí, protože hrdinové nikdy nehledají u zdi. Veverky to vědí odjakživa.'], enter: (G, A) => A.hurt(3), ch: [{ t: 'Dál.', go: 'doupe' }] },

    /* ---------- Kýchal ---------- */

    // ── doupe ── Doupě draka Kýchala.
    //    Sem se dostaneš z: k_hadanka, k_hadanka_napoveda, k_hadanka_spatne
    doupe: { bg: 'doupe', mood: 'sad', npc: [{ id: 'kychal', x: .78 }], snd: 'rev', lore: ['draci', 'kychal'], t: (G, A) => [
      'Za dveřmi se chodba otevře do jeskyně tak velké, že světlo pochodně nedosáhne k jejímu stropu. Jen někde vysoko je v klenbě prasklina a tou sem padá měsíc, jediný úzký sloup stříbrného světla, a ten sloup dopadá na hromadu zlata.',
      'Je to dračí poklad, takový, o jakém se zpívá v písních: mince, poháry, korunky, meče s rukojetí posázenou kameny, a všechno to leží v jediné obrovské hromadě, zaprášené, zčernalé a zapomenuté. Na té hromadě leží drak.',
      'Je obrovský. Větší než kostel v Lhotě, větší než mlýn, větší než cokoli živého, co jsi kdy viděl{a}. A je starý. Šupiny má matné a šedivé jako břidlice, jeden roh ulomený u kořene, jedno oko zakalené mlékem stáří a kolem tlamy vousy, které kdysi bývaly zlaté. Dýchá těžce a chrčivě, jako kovářské měchy v mrazivém ránu.',
      { w: 'kychal', t: 'Kdo leze do mého hrobu? Další rytíř? Další hrdina s mečem a s písní? Pojď blíž, ať tě… ať tě… ať… HAPČÍÍ!', m: 'sneeze', snd: 'kych', shake: 12 },
      'Ohnivá koule proletí metr nad tvou hlavou, rozprskne se o zeď a roztaví železný svícen na kapku. Drak si utře nos pařátem a vypadá, že se mu to stává často.',
      S('kychal', 'Pardon. Dvacet let rýma. Tady je vlhko. Nikdo tu netopí, víš. …Počkej. Počkej. Ten pach.', 'n'),
      'Drak zvedne hlavu. Pomalu, se skřípáním šupin, jako by se zvedala hora. Jeho zdravé oko, zlaté jako roztavená mince, se na tebe upře, a v jeho hloubi se něco pohne.',
      S('kychal', 'Popel z Hořan. Ten pach si pamatuju. Dítě, které jsem nesl v tlamě z ohně, opatrně, abych ho nekousl. Vrátil{a} ses.', 'sad')
    ], enter: (G, A) => A.clue('kychal', 'Drak Kýchal žije. Pamatuje si mě jako dítě, které vynesl z ohně Hořan.'), ch: (G, A) => [
      { t: '„Kdo jsem? Kde jsem se tam vzal{a}?“', go: 'd_puvod', if: () => !A.has('dPuvod') },
      { t: '„Král Bořivoj umírá. Potřebuju tvou slzu.“', go: 'd_slza', if: () => A.has('dPuvod') }
    ] },

    // ── d_puvod ── Kýchal vypráví, odkud hráč pochází.
    //    Sem se dostaneš z: doupe
    d_puvod: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: (G, A) => [
      'Drak se uloží pohodlněji, zlato pod ním zachrastí a z jeho nozder vyjde obláček kouře. Když promluví, hlas mu zní jako vzdálená bouře, která už nikomu neublíží.',
      A.race('drak') ? S('kychal', 'Jsi z dračího lidu, dítě, z rodu Kovářů. Tvá matka mi nosila sýr, když jsem byl nemocný, a zpívala mi u toho, falešně a ráda. Tvůj otec mi spravoval šupiny, které jsem si ulomil o skály. Oba shořeli. Já to viděl.', 'sad')
        : A.race('elf') ? S('kychal', 'Tvá matka byla elfka, jedna z posledních, co zůstaly v lese, když ostatní odešli. Tvůj otec byl mlynář. Ten mlynář, co mi dával pytel mouky ročně, aby se neřeklo. V Hořanech se nikdo neptal, kdo je čí krve. Proto Hořany musely shořet.', 'sad')
        : A.race('trpaslik') ? S('kychal', 'Tvoji rodiče byli trpasličí zvonaři. Ulili zvon pro hořanský kostel, nejkrásnější zvon v údolí, s hlasem jako med. Ten zvon zvonil, když přišli vojáci. Zvonil, dokud nespadla věž. Pak už nezvonil.', 'sad')
        : S('kychal', 'Tví rodiče byli lidé. Pekař a švadlena. Tvůj otec pekl chleba pro celé Hořany, pro lidi i dračí lid, a mně pekl sýrové koláče, velké jako vozové kolo. Žili v místě, kde lidé a dračí lid jedli u jednoho stolu. Za to je Vilém spálil.', 'sad'),
      S('kychal', 'Vilém přišel s vojáky a se lží. Lež šla napřed a vojáci za ní. Mou družku Žárovku zabili bílým ohněm Řádu, když bránila mlýn s dětmi uvnitř. A mé děti… mé děti jsou tady. Na tom zlatě, na kterém ležím, leží jejich kosti. Nesl jsem je sem jednu po druhé.', 'sad'),
      S('kychal', 'Tebe jsem vynesl z ohně. Bořivoj tě vzal do pláště a podíval se na mě. Neřekl nic. Ale nezabil mě. Tak jsem se schoval sem, s jedním vejcem, které zbylo. Dvacet let ho zahřívám. Dvacet let je studené.', 'n'),
      'Za drakovým bokem, v hnízdě ze zlatých mincí a starých plášťů, uvidíš vejce. Je velké jako sud, černé, popraskané a studené jako kámen v potoce.'
    ], enter: (G, A) => A.set('dPuvod'), ch: [{ t: 'Dál', go: 'd_slza' }] },

    // ── d_slza ── Hráč žádá o dračí slzu. Hlavní rozcestí rozhovoru s drakem.
    //    Sem se dostaneš z: doupe, d_puvod, d_odmita, d_vejce_ne
    d_slza: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: [
      S('kychal', 'Slza. Ach. Takže kvůli tomu jsi [[přišel|přišla]]. Slyšel jsem, že Bořivoj pije černou rosu. Vítr mi to řekl. Vítr toho říká hodně, jen se ho málokdo ptá.', 'n'),
      S('kychal', 'Draci pláčou jen ze dvou důvodů. Ze žalu tak velkého, že se nevejde do těla, ani do dračího, a to je velké tělo. Nebo ze štěstí, kterého se už nedočkali.', 'n'),
      S('kychal', 'Já už dvacet let nepláču. Vyschnul jsem jako studna v suchém roce. Tak mi dej důvod, dítě. Jakýkoli. Ale ať je pravdivý. Lež poznám po pachu. Smrdí po Vilémovi.', 'n')
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

    // ── d_odmita ── Drak odmítne prázdná slova.
    //    Sem se dostaneš z: d_slza
    d_odmita: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: [S('kychal', 'Slova, slova. Hezká slova, jako koláče z papíru. Vyschnul jsem, říkám ti. Zkus to jinak, nebo jdi. Já mám času dost. Ty a tvůj král ne.', 'n')], ch: (G, A) => [
      { t: 'Zkusit to znovu, jinak.', go: 'd_slza' },
      { t: '„Pomstím Hořany. Ty mi pomůžeš.“', go: 'd_pomsta' }
    ] },

    // ── d_radost ── Drak se rozpláče radostí, protože dračí lid žije. Hráč dostane slzu.
    //    Sem se dostaneš z: d_slza
    d_radost: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: [
      'Drak dlouho mlčí. Tak dlouho, že si začneš myslet, že tě neslyšel, nebo usnul. Měsíc ve škvíře klenby se posune o kousek dál.',
      'Pak se mu zachvěje víčko na zdravém oku. Jen trochu. Jako list, na který dopadla první kapka deště po dlouhém suchu.',
      S('kychal', 'Oni žijí. Moji lidé žijí. Ti, co mi nosili sýr a zpívali falešně. Jejich vnoučata. A někdo… někdo z koruny, z Bořivojova rodu, se za ně postavil. Dvacet let jsem čekal na takovou zprávu. Přestal jsem čekat. A teď přišla.', 'sad'),
      'Z oka mu sklouzne slza. Je velká jako lískový ořech a horká jako roztavené sklo. Zachytíš ji do lahvičky a lahvička se v tvé dlani rozzáří, jako bys v ní držel{a} kousek úsvitu.',
      S('kychal', 'Vezmi si i šupinu. Tady, z hrudi, kde jsou nejsilnější. Až budeš potřebovat oheň, který spálí jen to, co má, hoď ji do plamene. Přiletím. Starý jsem, ale létat jsem nezapomněl.', 'n')
    ], enter: (G, A) => { A.set('slza'); G.f.slza = 'slza'; A.give('slza'); A.give('supina'); G.f.kychal = 'pritel'; A.done('slza'); A.ap('sarra', 3); }, ch: [{ t: 'Dál', go: 'd_odchod' }] },

    // ── d_vejce ── Drakovo vejce se vylíhne. Hráč dostane slzu.
    //    Sem se dostaneš z: d_slza
    d_vejce: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: [
      'Oheň obejme černou skořápku. Chvíli se nic neděje. Drak se dívá a nedýchá. Ty se díváš a nedýcháš. I Plachtička přestane žvýkat.',
      'Pak se ozve tiché ťuknutí. Jako když někdo klepe na dveře, nesměle, poprvé. Na skořápce se objeví prasklina. Pak druhá. Pak se kus skořápky odloupne a z otvoru vystrčí hlavičku dráček, velký jako kočka, mokrý, zmačkaný a nesmírně rozhořčený tím, jak je svět jasný.',
      'Podívá se kolem. Podívá se na tebe. A pak kýchne. Malý, rozpačitý plamínek mu vyletí z nosu a zapálí Plachtičce ocas.†',
      '† Plachtička to později popisovala jako „nejhorší a nejkrásnější chvíli svýho života, v tomhle pořadí“, a dráčkovi nikdy neodpustila. To ovšem neznamená, že mu nepřinesla každý týden ořech. Veverčí odpuštění a veverčí ořechy jsou dvě různé věci.',
      { w: 'kychal', t: 'Ono… ono kýchá. Kýchá jako já. Jako jeho máma, když byla malá.', m: 'sad', snd: 'kych' },
      'A starý drak pláče. Ne jednou slzou, ale proudem. Velké horké slzy padají do zlata a syčí na mincích. Jednu chytíš do lahvičky, a on si toho ani nevšimne, protože se dívá jen na to malé, mokré, kýchající stvoření, které mu leze po tlapě.',
      S('kychal', 'Vezmi si i šupinu, dítě. Hoď ji do ohně, až budeš potřebovat křídla. Přiletím. My dva přiletíme.', 'smile')
    ], enter: (G, A) => { G.f.slza = 'slza'; A.give('slza'); A.give('supina'); G.f.kychal = 'pritel'; A.set('mlade'); A.done('slza'); A.ap('sarra', 4); A.ap('vojta', 2); A.ap('ester', 1); A.ap('plachta', 2); }, ch: [{ t: 'Dál', go: 'd_odchod' }] },

    // ── d_vejce_ne ── Vejce se nevylíhlo.
    //    Sem se dostaneš z: d_slza
    d_vejce_ne: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: ['Oheň olizuje skořápku, ale ta zůstane černá a studená. Nic. Ani ťuknutí.', 'Drak si povzdechne, dlouze, a z toho povzdechu se mu skoro zalesknou oči. Skoro. Dvacet let se naučil nedoufat, a takové učení se nezapomíná za jeden večer.'], ch: [{ t: 'Zkusit něco jiného.', go: 'd_slza' }] },

    // ── d_zal ── Hráč mluví s drakem o jeho mrtvé dceři Žárovce. Drak pláče.
    //    Sem se dostaneš z: d_slza
    d_zal: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: [
      'Posadíš se na zlato vedle jeho obrovské tlapy a zeptáš se na Žárovku.',
      'Jak se smála. Co ráda jedla. Jak létala. Drak odpovídá. Nejdřív stroze, jedním slovem, jako by tě zkoušel. Pak delšími větami. Pak dlouze, o jaru v horách, o tom, jak Žárovka uměla chytat pstruhy do tlamy a jak nesnášela hrom. A nakonec už jen šeptá jména do zlata, jedno po druhém.',
      { w: 'kychal', t: 'Plamínek. Popelka. Uhlík. Jiskra. …Nikdo se mě na ně dvacet let nezeptal. Nikdo. Myslel jsem, že jsem je zapomněl. Nezapomněl.', m: 'sad' },
      'Slza spadne do zlata. Pak druhá. Tu zachytíš do lahvičky a ona v ní tiše svítí, jako vzpomínka.',
      S('kychal', 'Vezmi si i šupinu. Kdybys mě potřeboval{a}. Je to málo, za to, co jsi mi dal{a}. Ale víc nemám. Víc už nikdo nemá.', 'n')
    ], enter: (G, A) => { G.f.slza = 'slza'; A.give('slza'); A.give('supina'); G.f.kychal = 'pritel'; A.done('slza'); A.ap('vojta', 2); }, ch: [{ t: 'Dál', go: 'd_odchod' }] },

    // ── d_pomsta ── Hráč slíbí drakovi pomstu. Drak dá šupinu a přiletí ve finále.
    //    Sem se dostaneš z: d_slza, d_odmita
    d_pomsta: { bg: 'doupe', mood: 'fire', npc: [{ id: 'kychal', x: .78 }], t: [
      'V drakově zdravém oku se něco rozhoří. Něco starého, co spalo dvacet let pod popelem a čekalo jen na jediný dech.',
      { w: 'kychal', t: 'Pomsta. Ano. Ano! Dvacet let jsem tu hnil na kostech svých dětí a čekal, až mi to někdo řekne nahlas!', m: 'roar', snd: 'rev', shake: 14 },
      'Zařve, a ten řev otřese celým hrádkem. Z klenby padají kameny, vrány nahoře se vznesou s křikem. Slza mu stéká po tváři. Horká, kalná a vzteklá. Zachytíš ji a lahvička se rozsvítí rudě, jako uhlík, do kterého někdo foukl.',
      S('kychal', 'Hoď šupinu do ohně, až budeš chtít. Přiletím. A Popelov si zapamatuje, proč se mu tak říká.', 'angry')
    ], enter: (G, A) => { G.f.slza = 'slza'; A.give('slza'); A.give('supina'); G.f.kychal = 'pomsta'; A.done('slza'); A.inc('temnota'); A.ap('sarra', 1); A.ap('vojta', -2); A.ap('ester', -1); }, ch: [{ t: 'Dál', go: 'd_odchod' }] },

    // ── d_utok ── Hráč napadl draka.
    //    Sem se dostaneš z: d_slza
    d_utok: { bg: 'doupe', mood: 'fight', npc: [{ id: 'kychal', x: .78 }], t: (G, A) => [
      A.inParty('sarra') ? S('sarra', 'Cože? Ne. NE. Tohle ti nedovolím. Je to poslední drak, ty…', 'angry') : null,
      S('kychal', 'Takže další rytíř. Ach, dítě. Nesl jsem tě v tlamě a myslel jsem, že tě znám. Ale oheň, ze kterého jsem tě vynesl, sis zřejmě odnesl{a} s sebou.', 'sad')
    ], enter: (G, A) => { if (A.inParty('sarra')) { A.ap('sarra', -10); A.leave('sarra', 'se obrací zády'); } A.ap('vojta', -4); A.ap('ester', -2); }, fight: { foes: [{ id: 'kychal', boss: true, hp: 70 }], noAllies: [], intro: 'Starý drak se zvedne ze zlata a mince se z něj sypou jako vodopád. Je pomalý. Je starý. Ale je to pořád drak.', win: 'd_krev', lose: 'd_spalen' } },

    // ── d_spalen ── Drak hráče porazil, ale slzu mu stejně dá.
    //    Sem se dostaneš z: d_utok
    d_spalen: { bg: 'doupe', npc: [{ id: 'kychal', x: .78 }], t: ['Oheň. Bolest. A pak nic. Drak tě nespálil, ačkoli mohl. Jen tě odfoukne do chodby jako smetí ze stolu a ty narazíš do zdi.', S('kychal', 'Jdi. Vezmi si svou slzu. Tady.', 'sad'), 'Pustí ji z oka do prachu před tebou, malou a šedivou.', S('kychal', 'Plakal jsem, protože jsem se v tobě spletl. Je to taky žal. Možná ten nejhorší.', 'sad')], enter: (G, A) => { G.f.slza = 'slza'; A.give('slza'); G.f.kychal = 'zklaman'; A.done('slza'); }, ch: [{ t: 'Odejít.', go: 'd_odchod' }] },

    // ── d_krev ── Hráč draka zabil a vezme si jeho krev. Přidá hodně temnoty.
    //    Sem se dostaneš z: d_utok
    d_krev: { bg: 'doupe', mood: 'sad', npc: [{ id: 'kychal', pose: 'dead', x: .78, blood: true }], t: [
      'Poslední drak Žárových hor leží na zlatě svých dětí. Krev z něj teče pomalu, tmavá a kouřící, a tam, kam dopadne, se mince taví.',
      'Měsíc ve škvíře klenby svítí dál, jako by se nic nestalo. Měsíc viděl umírat hodně draků. Tohle je poslední, a ani jemu to není jedno, ale nemůže nic dělat. Jen svítit.',
      'Slza nepřišla. Draci pláčou jen ze žalu a ze štěstí. Ne z bolesti. Na to jsou příliš hrdí.',
      'Naplníš lahvičku krví. Stará pověst říká, že dračí krev léčí všechno. Neříká, co si vezme na oplátku. Staré pověsti tyhle věci nikdy neříkají, protože je vyprávějí ti, kdo už zaplatili.',
      S('plachta', 'Už se ke mně nepřibližuj. Prosím. Ne teď.', 'sad')
    ], enter: (G, A) => { G.f.slza = 'krev'; A.give('slza'); G.f.kychal = 'mrtvy'; A.inc('temnota', 3); A.done('slza'); A.ap('plachta', -5); G.f.bonusHp = (G.f.bonusHp || 0) + 6; A.toast('Napil{a} ses dračí krve. +6 životů. Něco v tobě ztvrdlo.'.replace('{a}', G.sex === 'f' ? 'a' : '')); }, ch: [{ t: 'Odejít.', go: 'd_odchod' }] },

    // ── d_odchod ── Odchod ze zříceniny za svítání.
    //    Sem se dostaneš z: d_radost, d_vejce, d_zal, d_pomsta, d_spalen, d_krev
    d_odchod: { bg: 'zricenina', mood: 'wind', npc: [], t: (G, A) => [
      'Vylezeš ze zříceniny za svítání. Na východě se nebe barví do růžova a do zlata, a les pod ostrohem vypadá v tom světle skoro přívětivě, jako les z pohádky, kterou ti nikdo nikdy nevyprávěl.',
      'Lahvička na krku tě pálí na kůži jako uhlík. Je to dobrá bolest. Připomíná ti, proč jsi tady.',
      'Vojtovy zkratky přes les, hráz u Lhoty a pak dolů po Smolné: zítra večer budeš v Popelově. Pozítří ráno je popravčí den. A král ještě dýchá. Musí. Nikdo jiný ti neřekne, že ho máš rád{a}, tak to musí vydržet, dokud mu to neřekneš ty.',
      G.f.kychal === 'pritel' ? 'Za tebou se z rozpadlé věže ozve kýchnutí. A pak druhé, menší, rozpačitější. A pak, poprvé po dvaceti letech, něco, co zní jako dračí smích.' : null
    ], ch: [{ t: 'Rozbít tábor na noc.', go: 'tabor2' }] },

    /* ---------- tábor 2: romance ---------- */

    // ── tabor2 ── Poslední noc před návratem. Romance, pokud hráč dřív flirtoval.
    //    Sem se dostaneš z: d_odchod
    tabor2: { bg: 'tabor', mood: 'warm', npc: [], cp: 1, enter: (G, A) => A.rest(), t: (G, A) => [
      'Poslední noc před návratem. Utáboříte se v úvalu nad Smolnou, odkud je za tmy vidět v dálce záře Popelova, matná, oranžová, jako žhnoucí uhlík v popelníku.',
      'Nikdo nemluví o zítřku. Všichni na něj myslí. Je to zvláštní, jak se zítřek umí posadit k ohni mezi lidi, bez jediného slova, a zabrat nejlepší místo.',
      G.f.rom ? `${T.C[G.f.rom].name.split(' ')[0]} na tebe přes oheň kouká jinak než včera. A když se setkáte pohledem, neuhne.` : null
    ], ch: (G, A) => [
      { t: 'Najít Ester u potoka.', tag: (A.has('flirt_ester') ? '♥' : null), if: () => A.inParty('ester'), go: (G2) => A.has('flirt_ester') && (G2.ap.ester || 0) >= 4 ? 't2_ester_rom' : 't2_ester' },
      { t: 'Přisednout si k Vojtovi.', tag: (A.has('flirt_vojta') ? '♥' : null), if: () => A.inParty('vojta'), go: (G2) => A.has('flirt_vojta') && (G2.ap.vojta || 0) >= 4 ? 't2_vojta_rom' : 't2_vojta' },
      { t: 'Najít Sarru u ohně.', tag: (A.has('flirt_sarra') ? '♥' : null), if: () => A.inParty('sarra'), go: (G2) => A.has('flirt_sarra') && (G2.ap.sarra || 0) >= 4 ? 't2_sarra_rom' : 't2_sarra' },
      { t: 'Vystřídat Radima na hlídce.', tag: (A.has('flirt_radim') ? '♥' : null), if: () => A.inParty('radim'), go: (G2) => A.has('flirt_radim') && (G2.ap.radim || 0) >= 4 ? 't2_radim_rom' : 't2_radim' },
      { t: 'Spát. Zítra je zítra.', go: 'akt3' }
    ] },

    // ── t2_ester ── Rozhovor s Ester u potoka.
    //    Sem se dostaneš z: tabor2
    t2_ester: { bg: 'tabor', npc: [{ id: 'ester', x: .66 }], t: [S('ester', 'Zítra se vrátíme do města, kde mě chtěli pověsit za srnu. Vtipný, ne? Nikdy by mě nenapadlo, že tam půjdu dobrovolně.', 'smirk'), S('ester', 'Díky. Za Lhotu. Za tátu. Za… prostě díky. Neumím to říct líp. Nikdy jsem nikomu neděkovala. Nebylo za co.', 'n')], enter: (G, A) => A.ap('ester', 1), ch: (G, A) => [{ t: '[♥] „Ester… zůstaň dnes se mnou.“', tag: '♥', if: () => (G.ap.ester || 0) >= 4, go: 't2_ester_rom' }, { t: 'Jít spát.', go: 'akt3' }] },

    // ── t2_ester_rom ── Romantická noc s Ester.
    //    Sem se dostaneš z: tabor2, t2_ester
    t2_ester_rom: { bg: 'tabor', npc: [{ id: 'ester', x: .62 }], t: [
      'Ester sedí u potoka, bosé nohy ve studené vodě, a hází do proudu kamínky. Když si přisedneš, neřekne nic. Jen ti podá polovinu jablka, které někde ukradla, protože Ester nikdy nic nekoupila.',
      S('ester', 'Víš, že jsi [[úplně šílený|úplně šílená]]? [[Princ|Princezna]] z věže a pytlačka z Lhoty. Táta by dostal infarkt. Farář by dostal dva.', 'smile'),
      S('ester', 'Ale víš co? Ať dostanou.', 'smirk'),
      'Políbí tě. Chutná po jablku a kouři a po něčem divokém, co se nedá chytit do oka ani zastřelit kuší. Zbytek noci patří jen vám dvěma a potoku, který o tom nikomu neřekne, protože potoky jsou nejdiskrétnější tvorové na světě.'
    ], enter: (G, A) => { A.romance('ester'); A.ap('ester', 2); A.sfx('love'); }, ch: [{ t: 'Ráno.', go: 'akt3' }] },

    // ── t2_vojta ── Rozhovor s Vojtou.
    //    Sem se dostaneš z: tabor2
    t2_vojta: { bg: 'tabor', npc: [{ id: 'vojta', x: .66 }], t: [S('vojta', 'Zítra uvidím Popelov po dvaceti letech. A Viléma. Toho chlapa, co nám ten den řekl, že je to rozkaz od krále.', 'n'), S('vojta', 'Nevím, jestli udržím sekeru dole. Fakt nevím. A nevím, jestli chci.', 'n')], ch: (G, A) => [{ t: '[♥] „Nemusíš nic udržet. Jen mě.“', tag: '♥', if: () => (G.ap.vojta || 0) >= 4, go: 't2_vojta_rom' }, { t: 'Jít spát.', go: 'akt3' }] },

    // ── t2_vojta_rom ── Romantická noc s Vojtou.
    //    Sem se dostaneš z: tabor2, t2_vojta
    t2_vojta_rom: { bg: 'tabor', npc: [{ id: 'vojta', x: .66 }], t: [
      'Vojta se na tebe dívá dlouho. Ten pohled je těžký jako sekera, ale ruce, kterými tě pak obejme, jsou neuvěřitelně opatrné, jako by držely něco, co se snadno rozbije a co už jednou viděly rozbité.',
      S('vojta', 'Dvacet let jsem se bál zavřít oči. Dnes v noci je zavřu. Když budeš vedle.', 'n'),
      'Oheň dohoří. Ani jeden z vás si toho nevšimne. A když se Vojta ráno probudí, poprvé po dvaceti letech neví, co se mu zdálo. Jen že to bylo dobré.'
    ], enter: (G, A) => { A.romance('vojta'); A.ap('vojta', 2); A.sfx('love'); }, ch: [{ t: 'Ráno.', go: 'akt3' }] },

    // ── t2_sarra ── Rozhovor se Sarrou.
    //    Sem se dostaneš z: tabor2
    t2_sarra: { bg: 'tabor', npc: [{ id: 'sarra', x: .66 }], t: (G) => [S('sarra', G.f.kychal === 'pritel' ? 'Viděla jsem draka. Živýho. Mluvil se mnou. Řekl mi, že moje babička mu jednou spravila šupinu. Kdyby mi to někdo řekl před týdnem, rozbila bych mu hubu, že si ze mě dělá srandu.' : 'Viděla jsem, co jsi udělal{a} v doupěti. Celou cestu zpátky o tom přemýšlím. Nevím, co si o tobě mám myslet. A to mě děsí víc než Řád.', 'n')], ch: (G, A) => [{ t: '[♥] Vzít ji za ruku se šupinami. „Mysli si tohle.“', tag: '♥', if: () => (G.ap.sarra || 0) >= 4, go: 't2_sarra_rom' }, { t: 'Jít spát.', go: 'akt3' }] },

    // ── t2_sarra_rom ── Romantická noc se Sarrou.
    //    Sem se dostaneš z: tabor2, t2_sarra
    t2_sarra_rom: { bg: 'tabor', npc: [{ id: 'sarra', x: .66 }], t: [
      S('sarra', 'Šupiny škrábou. A rohy překážejí. A když se rozčílím, kouří se mi z nosu. Jen abys věděl{a}, do čeho jdeš.', 'smirk'),
      S('sarra', 'A jestli mi zítra umřeš, najdu tě na onom světě a zmlátím tě kladivem. Tím samým. Vezmu si ho s sebou.', 'n'),
      'Její polibek pálí. Doslova. Ráno máš na rtu malý puchýř, velký jako čočka, a nelituješ ani vteřiny, i když se ti Plachtička celé dopoledne směje.'
    ], enter: (G, A) => { A.romance('sarra'); A.ap('sarra', 2); A.sfx('love'); }, ch: [{ t: 'Ráno.', go: 'akt3' }] },

    // ── t2_radim ── Rozhovor s Radimem na hlídce.
    //    Sem se dostaneš z: tabor2
    t2_radim: { bg: 'tabor', npc: [{ id: 'radim', x: .66 }], t: [S('radim', 'Zítra budu zatýkat kancléře. Nebo mě pověsí vedle vás, Výsosti. Obojí je v pořádku.', 'n'), S('radim', 'Víte, co je zvláštní? Dvacet let jsem plnil rozkazy a nikdy jsem nespal tak klidně jako teď, když žádný nemám. Konečně dělám něco správně. A nikdo mi to nenařídil.', 'n')], ch: (G, A) => [{ t: '[♥] „Nejdřív udělej správně tohle.“ Políbit ho.', tag: '♥', if: () => (G.ap.radim || 0) >= 4, go: 't2_radim_rom' }, { t: 'Jít spát.', go: 'akt3' }] },

    // ── t2_radim_rom ── Romantická noc s Radimem.
    //    Sem se dostaneš z: tabor2, t2_radim
    t2_radim_rom: { bg: 'tabor', npc: [{ id: 'radim', x: .66 }], t: [
      'Radim ztuhne, jako by dostal rozkaz, kterému nerozumí, v jazyce, který nezná. Pak pomalu odepne meč, poprvé za celou cestu, a položí ho do trávy vedle sebe. Ten zvuk, kov na zemi, je v noci velmi hlasitý.',
      S('radim', 'Hlídku dnes převezme Plachtička.', 'smirk'),
      S('plachta', 'Ani hovno.', 'angry'),
      'Ale nakonec hlídá. Sedí na nejvyšší větvi nad táborem, s ocasem nafouknutým jako štětka, a celou noc bručí do tmy o lidech, kteří nemají žádné standardy, a o tom, že jí to nikdo nezaplatí.'
    ], enter: (G, A) => { A.romance('radim'); A.ap('radim', 2); A.sfx('love'); }, ch: [{ t: 'Ráno.', go: 'akt3' }] }
  });
})(window.T);
