/* Koruna z popela – Prolog: věž, vražda, umírající král, útěk. */

/* ==========================================================================
   JAK ČÍST A UPRAVOVAT PŘÍBĚH (návod pro začátečníky)
   ==========================================================================

   Příběh je rozdělený do čtyř souborů:
     s0_prolog.js   Prolog: věž, vražda Hedviky, umírající král, útěk z hradu
     s1_mesto.js    Dějství I: město Popelov (hospoda, lékárna, Škvára, chrám,
                    stoky, Radim, brána)
     s2_venkov.js   Dějství II: Lhota, Černý les, Vědma, Dračí hrádek, drak
                    Kýchal, táboření
     s3_finale.js   Dějství III: popravčí den, souboj s kancléřem, slza,
                    koruna a všechny konce
   Postavy (jména, barvy, portréty) jsou v cast.js, Kronika je v lore.js.

   SCÉNA (v kódu se jí říká „uzel“)
   Každá scéna má jméno, třeba p_kral. Nad každou scénou je komentář, který
   řekne, o jakou situaci jde a ze kterých scén se do ní dá dostat.
   Jména scén NEMĚŇ. Odkazuje se na ně odjinud a hra by se rozbila.

     p_kral: {               jméno scény
       bg: 'loznice',        obrázek pozadí (seznam je v places.js)
       mood: 'sad',          nálada hudby a světla (rain, tense, sad, fight, warm...)
       npc: [{ id: 'kralovna', x: .62 }],
                             kdo stojí ve scéně. x je pozice zleva
                             (0 = úplně vlevo, 1 = úplně vpravo).
                             pose: 'dead' = postava leží mrtvá.
       t: [ ... ],           TEXTY SCÉNY. Každá položka je jedna stránka,
                             hráč je odklikává jednu po druhé.
       ch: [ ... ],          VOLBY, tlačítka, která se ukážou na konci.
       lore: ['vranov'],     odemkne kapitoly v Kronice (lore.js)
       enter: (G, A) => ...  co se stane, když hráč scénu otevře
                             (dostane předmět, stopu, ztratí život...)
     }

   TEXTY (to, co můžeš klidně přepisovat)
     'Obyčejný text v uvozovkách'       vypravěč
     S('hedvika', 'Co říká', 'sad')     postava mluví. První je kdo (id
                                        z cast.js), druhé co říká, třetí
                                        výraz tváře (n = normální, sad = smutek,
                                        angry = vztek, shock = úlek, smile =
                                        úsměv, smirk = úšklebek).
     '† Poznámka'                       začíná-li text znakem †, je to
                                        vtipná poznámka pod čarou. Hra ji
                                        přilepí pod předchozí stránku.
     *slovo*                            slovo se zobrazí kurzívou.

   ŠABLONY V TEXTU (hra je nahradí podle postavy hráče)
     {a}              ženská koncovka: viděl{a} = viděl / viděla.
                      Funguje JEN tam, kde žena = muž + „a“.
     [[muž|žena]]     dva celé tvary: [[celý|celá]], [[sám|sama]],
                      [[šel|šla]], [[princ|princezna]]. Použij vždy, když
                      {a} nestačí (celý/celá, sám/sama, šel/šla...).
     {name}           jméno hráče
     {titul} {Titul}  princ / princezna (s malým / velkým písmenem)
     {rasa}           rasa hráče (člověk, půlelf, trpaslík...)

   VOLBY (ch)
     { t: 'Text tlačítka', go: 'p_schody' }
           t  = co je napsané na tlačítku (to můžeš přepsat)
           go = do které scény tlačítko vede (NEMĚNIT)
     chk: { s: 'cha', dc: 12, ok: 'p_kral', no: 'p_odvedeni' }
           hod kostkou. s = vlastnost (sil = Síla, obr = Obratnost,
           odl = Odolnost, duv = Důvtip, mou = Moudrost, cha = Charisma),
           dc = jak těžké to je, ok = kam při úspěchu, no = kam při
           neúspěchu.
     fight: { foes: [...], win: '...', lose: '...' }
           souboj. win = kam po výhře, lose = kam po prohře.
     if: ...       volba se ukáže jen někdy (třeba když máš stopu)
     need: ...     volba je vidět, ale zamčená, dokud nesplníš podmínku
     cost: 20      volba stojí 20 zlatých
     fx: ...       co se stane po kliknutí (stejně jako enter)
     tag: 'Útok'   malý štítek na tlačítku

   CO ZNAMENAJÍ PŘÍKAZY V enter A fx (A je „akce“)
     A.set('nazev')       zapamatuj si, že se něco stalo (příznak)
     A.has('nazev')       stalo se to?
     A.inc('temnota')     přičti 1 (temnota = jak zlý hráč je)
     A.give('klic')       dej hráči předmět, A.take() ho vezme
     A.clue(id, 'text')   nový důkaz do deníku
     A.quest(id, ...)     nový úkol
     A.lore('id')         odemkni kapitolu v Kronice (lore.js)
     A.join('ester')      postava se přidá do družiny
     A.ap('radim', 2)     postava tě má o 2 raději (záporné číslo = méně)
     A.gold(25)           +25 zlatých (záporné = zaplatí)
     A.hurt(4)            −4 životy

   NA CO SI DÁT POZOR, ABY SE HRA NEROZBILA
   1. Texty jsou v apostrofech '...'. Uvnitř textu nepiš apostrof '.
      Pro přímou řeč používej české uvozovky „…“. Kdybys apostrof
      potřeboval, napiš \' (zpětné lomítko před ním).
   2. Za každou položkou v seznamu je čárka. Nesmaž ji.
   3. Neměň jména scén, id postav ani nic za go:, ok:, no:, win:, lose:.
   4. Některé texty jsou funkce, začínají (G, A) => [ ... nebo mají
      v sobě A.has('...') ? 'text A' : 'text B'. To znamená „když se
      stalo X, ukaž text A, jinak text B“. Přepisovat můžeš oba texty.
   ========================================================================== */

(function (T) {
  'use strict';
  // S(kdo, text, výraz) = řeč postavy. Viz návod nahoře.
  const S = (w, t, m) => ({ w, t, m });
  Object.assign(T.N, {
    // ── start ── Úplný začátek hry. Věž na Vranově, prší, chůva Hedvika přiběhne se zprávou, že král umírá na jed.
    //    Sem se dostaneš z: Nová hra.
    start: { act: 'Prolog', bg: 'vez', mood: 'rain', npc: [], lore: ['vranov', 'hrad'], t: [
      'Psal se dvacátý rok po Dračí válce. Rok, o němž kronikáři kancléřského úřadu později napíší, že byl „klidný a požehnaný“. Kronikáři kancléřského úřadu psali o každém roce, že byl klidný a požehnaný. Platili je za to.',
      'Nad údolím Smolné se toho podzimu snesly deště, jaké nepamatovali ani nejstarší havrani na Havraní skále. Pršelo devět dní a devět nocí a na desátý den, říká se ve Vranově, se vždycky něco zlomí.',
      'Na hradě Vranově, v nejvyšší komnatě sedmé věže, sedíš u okna a počítáš čárky na zdi. Je jich sedm tisíc tři sta. Jedna za každý den, kdy jsi neviděl{a} nic než nebe, střechy a havrany.',
      'Královna Morana, tvá matka, tomu říká *bezpečí*. Říká to laskavě, s dlaní na tvé tváři, a pak za sebou zamkne na dva západy. Ty tomu říkáš jinak. Ale jen potichu. A jen do polštáře.',
      'Dveře zaskřípou. Do komnaty smí jen jediný člověk: chůva Hedvika, která tě odkojila, naučila číst a dvacet let ti nosí polévku, novinky a kradené knihy. Dnes se jí ale tak třesou ruce, že polévku rozlije na práh.',
      S('hedvika', 'Výsosti! Ach, Výsosti... Král umírá! Doktoři povídají, že je to horečka z deště, a pouštějí mu žilou, jako by se z krále dalo vypustit neštěstí.', 'shock'),
      S('hedvika', 'Ale já už jsem v životě viděla umírat dost lidí, abych poznala horečku. A tohle horečka není! Nehty mu zčernaly. Od kořínků, jako když se do vody kápne inkoust. Je to jed!', 'shock')
    ], ch: [
      { t: '„Jed? Kdo by se odvážil otrávit krále?“', go: 'p_kdo' },
      { t: '„Proč mi to říkáš? Nikdy neříkáš nic, co by mě mohlo rozrušit.“', go: 'p_proc' },
      { t: 'Chytit ji za ruce. „Hedviko. Dýchej. Pomalu, a všechno od začátku.“', go: 'p_klic', fx: (G, A) => A.set('hedvikaKlid') }
    ] },

    // ── p_kdo ── Hráč se ptá Hedviky, kdo by se odvážil otrávit krále.
    //    Sem se dostaneš z: start
    p_kdo: { bg: 'vez', npc: [], lore: ['rad', 'dracilid'], t: [
      S('hedvika', 'Kdo by se odvážil? Výsosti, na tomhle hradě se lidé neodvažují. Na tomhle hradě lidé počítají. A někdo si spočítal, že mrtvý král je výhodnější než živý.', 'sad'),
      S('hedvika', 'Říká se, že to udělali šupináči - dračí lid ze Škváry. Prý se krále chtěli zbavit z pomsty za válku. Nebo to jsou další kancléřovi pletichy', 'sad'),
      S('hedvika', 'A královna tomu věří. Královna dnes věří všemu, co jí kancléř Vilém poví.', 'angry')
    ], ch: [{ t: '„Co mám dělat?“', go: 'p_klic' }] },

    // ── p_proc ── Hráč se ptá, proč mu to Hedvika říká. Ona vzpomíná, jak král přinesl miminko z války.
    //    Sem se dostaneš z: start
    p_proc: { bg: 'vez', npc: [], t: [
      S('hedvika', 'Protože jsem tě kojila, dítě. Tu noc, kdy tě král přinesl z války zabalen{a} do vlastního pláště. Byl{a}s [[celý černý|celá černá]] od sazí. Byl{a} jsi [[takový drobounký|taková drobounká]] a voněl{a} jsi kouřem. Tři dny ses nechtěl{a} napít, ale nakonec ses na mě usmál{a}.', 'sad'),
      S('hedvika', 'A protože až král zemře, nikdo už za tebou nepřijde. Královna tě miluje tak, že by tě klidně zazdila, jen aby tě ochránila.', 'n')
    ], ch: [{ t: '„Z války? Z popela? O čem to mluvíš?“', go: 'p_klic', fx: (G, A) => A.set('popelZminka') }] },

    // ── p_klic ── Hedvika dá hráči klíč od kuchyňských dveří a radí mu utéct. Hráč dostane předmět „klic“.
    //    Sem se dostaneš z: start, p_kdo, p_proc
    p_klic: { bg: 'vez', npc: [], t: (G, A) => [
      A.has('popelZminka') ? S('hedvika', 'Zeptej se krále, dokud ještě dýchá. Má ti co vyprávět. Ne já.', 'sad') : null,
      A.has('hedvikaKlid') ? 'Hedvika se pomalu nadechne, jako by si tvá slova vzala do plic místo vzduchu. Na okamžik jako by byla zase mámou, která se o tebe starala.' : null,
      'Rozhlédne se a pak ti vtiskne do dlaně těžký železný klíč, starý a hrubý jako kus podkovy. Je teplý od jejího těla.',
      S('hedvika', 'V kuchyni pod věží jsou dveře s orlím klepadlem. Ty vedou do uličky za hradbami. Kdyby se se mnou něco stalo… nečekej na nikoho. Ani na krále, ani na královnu a už vůbec ne na zázrak. Uteč!', 'n'),
      'Odejde dřív, než stihneš cokoli říct. Slyšíš její kroky na točitém schodišti. Dvacet sedm schodů. Znáš je nazpaměť, každý má svůj zvuk - je to stejné, jako když si lidé pamatují hlasy jiných lidí.'
    ], enter: (G, A) => { A.give('klic'); }, ch: [{ t: 'Podíváš se ke stropu, k trámům. „Plachtičko? Slyšelas?“', go: 'p_plachta' }] },

    // ── p_plachta ── Poprvé se objeví veverka Plachtička. Připojí se k družině.
    //    Sem se dostaneš z: p_klic
    p_plachta: { bg: 'vez', npc: [{ id: 'plachta', x: .62 }], lore: 'plachta', t: [
      'V pološeru se mihne chundelatý rezavý ocas. Veverka s jedním natrženým uchem, očima jako dva korálky černého jantaru a malou lahvičkou medoviny v tlapkách - už dobrých pět let ti je krade z večeří.',
      'Plachtička. Jiné přátele nemáš. Mluví, ale kromě tebe to nikdo neví. S nikým jiným mluvit nechce. Všichni na hradě si myslí, že si v noci povídáš se zdí.†\n\n† To má své výhody. Když si lidé myslí, že jste se pomátli, přestanou si před vámi dávat pozor na pusu...',
      S('plachta', 'Slyšela, všechno jsem slyšela. Mám snad uši, ne? Teda, jedno a půl, ale stačí! Král má na kahánku, kancléř Vilém má určitě něco za lubem. A ty tu stojíš a máš v ruce klíč. Já nejsem nejostřejší tužka v penále, ale v lese se tomuhle říká „zdrhej, dokud ti nehoří ocas“.', 'n'),
      S('plachta', 'Vezmi mě s sebou. Jestli tu zůstanu, určitě mě sežerou strážný. Ten tlustej s knírem po mně minulou zimu hodil botu. Botu! Já jsem dáma... A po těch se boty nehážou!', 'angry')
    ], enter: (G, A) => { A.join('plachta'); A.ap('plachta', 1, true); }, ch: [
      { t: '„Že váháš. Bez tebe bych už dávno zešílel{a}.“', go: 'p_krik', fx: (G, A) => A.ap('plachta', 1) },
      { t: '„Vezmu. Ale jen když slíbíš, že přestaneš pít.“', go: 'p_krik', fx: (G, A) => A.set('plachtaSlib') }
    ] },

    // ── p_krik ── Hedvika odešla, ze schodů se ozve výkřik. Hráč se rozhoduje, jestli vyběhne, nebo bude poslouchat.
    //    Sem se dostaneš z: p_plachta
    p_krik: { bg: 'vez', npc: [], snd: 'hit', t: (G, A) => [
      A.has('plachtaSlib') ? S('plachta', 'Na mou duši, slavnostně slibuju, že přestanu. Hned zítra, nejpozději pozítří...', 'n') : null,
      { t: 'Ze schodů se ozve krátký výkřik, utnutý v polovině - jako kus masa když pleskne o zem. Pak tupý náraz. A pak už je úplné ticho.', shake: 10 },
      'Ticho je na Vranově horší než křik. Křik znamená, že ještě něco děje. Ticho znamená, že už se to stalo.'
    ], ch: [
      { t: 'Odemknout dveře Hedvičiným klíčem a vyběhnout ven.', go: 'p_schody' },
      { t: 'Přitisknout ucho ke dveřím a poslouchat.', chk: { s: 'mou', dc: 12, ok: 'p_krik_ok', no: 'p_krik_no' } }
    ] },

    // ── p_krik_ok ── Hod na Moudrost se povedl: hráč přes dveře slyší vrahy (Radim a Vilém). Získá stopu „hlas“.
    //    Sem se dostaneš z: p_krik
    p_krik_ok: { bg: 'vez', npc: [], t: [
      'Zadržíš dech. Přes dubové dveře k tobě dolehnou dva hlasy. Jeden hluboký a ochraptělý, jako by jeho majitel spolkl hrst štěrku. Druhý tenký, hladký a jemně navoněný, hlas, který by dokázal přečíst rozsudek smrti tak, že by odsouzený poděkoval.',
      '*„…to pírko jí vlož do dlaně. Ať to vypadá na Řád. Nebo na šupináče, co se za Řád převlékli. Lidi si vyberou, čemu chtějí věřit. Lidi si vždycky vyberou.“*',
      'Kroky se vzdalují. Ten hladký hlas znáš. Slýcháš ho každé ráno z nádvoří, když předčítá královské výnosy, a každé ráno ti z něj naskočí husí kůže, aniž bys věděl{a} proč. Teď už to víš.'
    ], enter: (G, A) => { A.clue('hlas', 'U mrtvé Hedviky jsem slyšel{a} hlas, který zní jako kancléř Vilém: „To pírko jí vlož do dlaně. Ať to vypadá na Řád.“'); A.set('slyselHlas'); }, ch: [{ t: 'Vyjít ven.', go: 'p_schody' }] },

    // ── p_krik_no ── Hod na Moudrost se nepovedl: hráč nic neslyší a vyjde ven.
    //    Sem se dostaneš z: p_krik
    p_krik_no: { bg: 'vez', npc: [], t: ['Slyšíš jen déšť, vítr ve střeše a tlukot vlastního srdce, který je najednou hlasitější než obojí. Když konečně odemkneš, už je po všem a schodiště je prázdné. Kromě toho, co na něm leží.'], ch: [{ t: 'Vyjít ven.', go: 'p_schody' }] },

    // ── p_schody ── Hráč najde Hedviku mrtvou na schodech, v ruce má pírko Řádu.
    //    Sem se dostaneš z: p_krik, p_krik_ok, p_krik_no
    p_schody: { bg: 'schody', mood: 'tense', npc: [{ id: 'hedvika', pose: 'dead', x: .7 }], t: [
      'Hedvika najdeš ležet na desátém schodu, s hlavou níž než nohama, jako by chtěla ještě kus cesty doběhnout. Hrdlo má přeťaté od ucha k uchu. Pochodeň ve zdi nad ní syčí a prská, jako by se jí to celé nelíbilo stejně jako tobě.',
      'V pravé dlani svírá bílé pírko. Takové nosí inkvizitoři Řádu Bledého plamene, když chodí soudit „otázky krve“.',
      S('plachta', 'Do prdele. Do prdele, do prdele, do prdele. Ona mi nechávala ořechy, víš? Na okně. Dělala, že neví, pro koho jsou. Dvacet let dělala, že neví. Teď mám po oříškách!', 'sad')
    ], ch: [
      { t: 'Prohlédnout tělo pořádně, i když se ti zvedá žaludek.', chk: { s: 'duv', dc: 11, ok: 'p_telo_ok', no: 'p_telo_no' } },
      { t: 'Zavřít jí oči a vzít pírko.', go: 'p_radim', fx: (G, A) => { A.give('pirko'); A.set('zavrelOci'); } },
      { t: 'Křičet o pomoc.', go: 'p_radim' }
    ] },

    // ── p_telo_ok ── Hod na Důvtip se povedl: hráč pozná, že vraždu spáchal zkušený voják a pírko je podvržené.
    //    Sem se dostaneš z: p_schody
    p_telo_ok: { bg: 'schody', npc: [{ id: 'hedvika', pose: 'dead', x: .7 }], t: [
      'Klekneš si. Řez je vedený zezadu, zleva doprava, jedním tahem a bez zaváhání. Tohle nedělá rozzuřený šupinář ze Škváry. Tohle dělá ruka, která to dělala už mnohokrát: voják, kat či řezník.',
      'A to pírko. Prsty kolem něj nejsou sevřené v křeči, jak by byly, kdyby ho chytila v posledním zápase. Někdo jí je kolem pírka ohnul až *potom*. Krev pod pírkem je zaschlá dřív než krev na něm.',
      'Někdo chtěl, aby to vypadalo, že to udělal Řád. Nebo chtěl, aby to vypadalo, jako že to někdo chce svést na Řád. V Popelově je lež jako cibule: loupeš a loupeš, pláčeš, a uprostřed nenajdeš nic než další slupku.'
    ], enter: (G, A) => { A.give('pirko'); A.clue('pirko', 'Pírko Řádu vložil Hedvice do dlaně někdo až po smrti. Vrah byl zkušený voják.'); }, ch: [{ t: 'Na schodech zaduní kroky.', go: 'p_radim' }] },

    // ── p_telo_no ── Hod na Důvtip se nepovedl: hráč jen vezme pírko.
    //    Sem se dostaneš z: p_schody
    p_telo_no: { bg: 'schody', npc: [{ id: 'hedvika', pose: 'dead', x: .7 }], t: ['Krev, pírko, smrt. Víc z toho nevyčteš. Ruce se ti třesou, v hlavě ti hučí a schody se ti houpají pod nohama jako paluba. Vezmeš pírko, protože nevíš, co jiného udělat.'], enter: (G, A) => A.give('pirko'), ch: [{ t: 'Na schodech zaduní kroky.', go: 'p_radim' }] },

    // ── p_radim ── Přijde kapitán Radim a kancléř Vilém. Vilém svádí vraždu na dračí lid. Hlavní rozcestí prologu.
    //    Sem se dostaneš z: p_schody, p_telo_ok, p_telo_no
    p_radim: { bg: 'schody', mood: 'tense', npc: [{ id: 'hedvika', pose: 'dead', x: .78, blood: true }, { id: 'radim', x: .64 }, { id: 'vilem', x: .88 }], lore: ['radim', 'vilem'], t: (G, A) => [
      'Zdola stoupá světlo pochodní a s ním dva muži. Napřed kapitán hradní stráže Radim Kost: široký, šedivějící, s jizvou přes celý obličej a očima jako dva rezavé hřebíky zatlučené do dubu. Voják, který se dávno přestal ptát proč.',
      'Za ním, v kruhu světla, kancléř Vilém. Hubený muž v černém sametu, s rukama sepjatýma na břiše a s kůží žlutou jako starý pergamen. Usmívá se. Kancléř Vilém se usmívá vždycky, i když nikdo neví čemu.',
      S('vilem', 'Ale ale... Výsost mimo věž, v noci, a nad mrtvolou! To je ale… nešťastná souhra okolností. Takové věci se tak špatně vysvětlují.', 'smirk'),
      S('radim', 'Vraťte se do věže, Výsosti. Hned. Tohle není místo pro vás.', 'angry'),
      S('vilem', 'Pírko Řádu, kapitáne? Ach, ne, ne. To je přece starý trik šupináčů. Převléknou se za svaté bratry a vraždí, aby rozeštvali poctivé lidi. Ráno to vyřešíme. Ohněm, jak je zvykem.', 'smirk')
    ], ch: [
      { t: '„Jsem [[dědic|dědička]] Vranova. Chci vidět otce. Hned.“', chk: { s: 'cha', dc: 12, ok: 'p_kral', no: 'p_odvedeni' } },
      { t: '„To pírko jí někdo vložil do ruky až po smrti, kancléři.“', if: (G, A) => A.hasClue('pirko'), go: 'p_obvineni' },
      { t: '„Ten hlas na schodech. Byl jste to vy, Viléme.“', if: (G, A) => A.has('slyselHlas'), go: 'p_obvineni', fx: (G, A) => A.set('obvinilHlasem') },
      { t: '„Viděl{a} jsem utíkat někoho s rohy a šupinami.“', go: 'p_lez', tag: 'Lež' },
      { t: 'Vytrhnout strážnému kopí a probít se dolů.', tag: 'Útok', fight: { foes: ['straz', 'straz'], intro: 'Radim ustoupí o krok a nechá své muže, ať to vyřeší. Kancléř se usmívá, jako by sledoval divadlo, za které nemusel platit.', win: 'p_utek_boj', lose: 'p_odvedeni', loseFx: (G, A) => A.set('zbit') } }
    ] },

    // ── p_obvineni ── Hráč obviní Viléma (pírkem nebo hlasem ze schodů). Vilém to zesměšní, Radim začne pochybovat.
    //    Sem se dostaneš z: p_radim
    p_obvineni: { bg: 'schody', npc: [{ id: 'hedvika', pose: 'dead', x: .78 }, { id: 'radim', x: .64 }, { id: 'vilem', x: .88 }], t: (G, A) => [
      S('vilem', A.has('obvinilHlasem') ? 'Můj hlas? Výsost slyší hlasy. Dvacet let [[zavřený|zavřená]] ve věži, jen se svou fantazií a s tou… veverkou. Kapitáne, zapište si to, prosím. Pro lékaře.' : 'Výsost zřejmě četla příliš mnoho rytířských romancí. Vrazi, pírka, spiknutí ve tmě. Jak romantické. Kapitáne, zapište si to, prosím. Pro lékaře.', 'smirk'),
      'Radim nic nezapisuje. Dívá se na pírko. Potom na kancléře. Potom zpátky na tebe. Je to dlouhý pohled a v jeho průběhu v něm něco praskne, tiše, jako led na jaře.',
      S('radim', 'Výsost půjde za králem. Pod mým dohledem. Na tom trvám, kancléři. Jestli je to tak, jak říkáte, nic se nestane. A jestli ne… tak tím spíš.', 'n')
    ], enter: (G, A) => { A.set('radimPochyba'); A.ap('radim', 2, true); }, ch: [{ t: 'Jít za králem.', go: 'p_kral' }] },

    // ── p_lez ── Hráč lže, že viděl utíkat šupináče. Vilém lež s radostí přijme. Přidá temnotu.
    //    Sem se dostaneš z: p_radim
    p_lez: { bg: 'schody', npc: [{ id: 'hedvika', pose: 'dead', x: .78 }, { id: 'radim', x: .64 }, { id: 'vilem', x: .88 }], t: [
      S('vilem', 'Slyšíte, kapitáne? Svědek. Výsost je *svědek*. Taková odvaha, takový bystrý zrak. Zítra to vyhlásím na náměstí, lidé to budou chtít slyšet od samotného [[dědice|dědičky]].', 'smile'),
      'Kancléř tě vezme kolem ramen. Voní mastí z mandlí a pod ní něčím nasládlým a nahnilým, jako ovoce zapomenuté ve spíži. Uvědomíš si, že jsi mu právě podal{a} do ruky pochodeň. A že on přesně ví, kterou střechu s ní zapálí.',
      'Radim mlčí. Jeho mlčení je těžší než jeho zbroj.'
    ], enter: (G, A) => { A.set('lzi_drak'); A.ap('radim', -2, true); A.inc('temnota'); }, ch: [{ t: 'Jít s kancléřem za králem.', go: 'p_kral' }] },

    // ── p_utek_boj ── Hráč porazil stráže na schodech. Radim ho nechá utéct, ale je teď hledaný.
    //    Sem se dostaneš z: p_radim
    p_utek_boj: { bg: 'schody', npc: [{ id: 'hedvika', pose: 'dead', x: .78 }, { id: 'radim', x: .64 }], t: [
      'Dva strážní leží na schodech vedle Hedviky a jeden z nich sténá. Radim drží meč v ruce, ale nezvedá ho. Dívá se na tebe, jako by tě viděl poprvé, a možná že tě poprvé opravdu vidí.',
      S('radim', 'Tohle vám nezapomenou, Výsosti. Ti dva mají ženy a děti. A já to nezapomenu taky.', 'angry'),
      'Kancléř je pryč. Ztratil se ve tmě tak tiše a rychle, jak to umějí jen hadi a vysocí úředníci. Za chvíli se nad hradem rozezní zvon a ten zvon bude zvonit kvůli tobě.'
    ], enter: (G, A) => { A.set('hledany'); A.ap('radim', -1, true); }, ch: [
      { t: 'Utéct nahoru na hradby.', go: 'p_hradby' },
      { t: 'Utéct dolů kuchyní. Máš přece klíč.', go: 'p_kuchyne' }
    ] },

    // ── p_odvedeni ── Hráč prohrál nebo neprošel přes stráž, Radim ho zamkne zpět do věže.
    //    Sem se dostaneš z: p_radim, p_chycen_chodba, p_chodba_boj
    p_odvedeni: { bg: 'vez', npc: [], t: (G, A) => [
      A.has('zbit') ? 'Probudíš se na podlaze věže s pusou plnou krve. Spodní ret ti tepe jako druhé srdce. Kopí ti vzali, ale Hedvičin klíč nenašli. Zůstal zašitý ve švu rukávu, kam sis ho schoval{a}, když jsi padal{a}.' : 'Radim tě odvede zpátky do věže. Celou cestu neřekne ani slovo. Za tvými zády cvakne zámek, jednou a podruhé, a zvuk toho zámku je ti známější než tvůj vlastní hlas.',
      S('plachta', 'Výborně a jsme zase doma. Byl to věru krásný výlet, deset schodů tam a deset zpátky. Mám otevřít medovinu na oslavu, nebo budeme dělat něco užitečného?', 'n')
    ], ch: [{ t: 'Nečekat. Ještě dnes v noci zmizet.', go: 'p_utek_volba' }, { t: 'Počkat do půlnoci. Něco se stane, cítíš to v kostech.', go: 'p_kralovna_noc' }] },

    // ── p_kral ── Ložnice umírajícího krále Bořivoje. Král řekne o Černé rose a dračí slze. Začnou hlavní úkoly.
    //    Sem se dostaneš z: p_radim, p_obvineni, p_lez
    p_kral: { bg: 'loznice', mood: 'sad', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], lore: ['kral', 'kralovna'], t: [
      'Královská ložnice je velká jako kostelní loď a páchne vínem, mastmi a smrtí. Pod rudými závěsy leží král Bořivoj, poslední z rodu Vranovců. Býval to velký muž s hlasem, který přehlušil bitvu. Teď je z něj jen hromádka kostí. Nehty má černé, rty šedivé.',
      'U lože sedí královna Morana, krásná a bledá jako socha ze slonoviny, kterou někdo zapomněl v mrazu. Když tě uvidí, vyskočí.',
      S('kralovna', 'Kdo tě pustil ven?! Kdo ti to dovolil?! Ty ses mohl{a} zranit, nebo tě mohl někdo… na schodech je krev, viděl{a} jsi tu krev?!', 'angry'),
      S('kral', 'Moro. Nech… nech to dítě. Pojď blíž, {name}. Můj dech se krátí a musím toho ještě hodně říct.', 'sad'),
      S('kral', 'Nejsi… z mé krve. Měl jsem ti to říct dávno. Našel jsem tě v popelu Hořan, poslední den války. Vesnice hořela… vojáci… moji vojáci. A uprostřed ohně seděl starý drak a chránil tě křídlem. Kýchal mu říkali. Nechal mě tě vzít. A odletěl.', 'sad'),
      S('kral', 'Byl jsem otráven. Felčaři říkají, že jed je Černá rosa a lék je jen jeden: dračí slza. Říká se, že draci jsou mrtví, že jsme je vyhubili… ale on žil. Dračí hrádek za Lhotou. Tam jsem ho viděl naposled, s vejcem pod křídlem. Draci…', 'sad'),
      'Rozkašle se. Na bílém polštáři zůstane černá skvrna jako otisk prstu. Dvorní lékař za tvými zády šeptá do rukávu, ale ty ho slyšíš: *sedm dní, Výsosti. Možná osm. Ne víc.*'
    ], enter: (G, A) => { A.lore('valka'); A.lore('horany'); A.lore('rosa'); A.lore('kychal'); A.quest('slza', 'Dračí slza', 'Král umírá na Černou rosu. Podle něj ho vyléčí jen dračí slza. Starý drak Kýchal prý žije v Dračím hrádku za Lhotou. Zbývá sedm dní.'); A.quest('vrah', 'Kdo otrávil krále', 'Hedvika je mrtvá. Kancléř to svádí na dračí lid. Najdi skutečného traviče.'); A.clue('rosa', 'Krále otrávili Černou rosou. Lék je prý jen dračí slza.'); }, ch: [{ t: 'Dál', go: 'p_kral2' }] },

    // ── p_kral2 ── Vilém navrhne „očistu“ Škváry, královna souhlasí. Hráč může protestovat, sledovat kancléře, nebo prosit.
    //    Sem se dostaneš z: p_kral
    p_kral2: { bg: 'loznice', mood: 'sad', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], lore: 'skvara', t: [
      'Kancléř Vilém přistoupí k loži a ukloní se tak hluboko, že by mu to záviděl i dvorní tanečník.',
      S('vilem', 'Veličenstvo, dovolte mi postarat se o bezpečí trůnu, když jeho pán nemůže. Bratři Řádu jsou připraveni. Ráno vyčistí Škváru. Ti šupináči otrávili vašeho muže. Měli by za to zaplatit.', 'smirk'),
      S('kralovna', 'Spalte to hnízdo zmijí. Do posledního. Do poslední šupiny. Ať je ve městě konečně klid.', 'angry'),
      'Král se pokusí něco říct, ale z hrdla mu vyjde jen chroptění. Kancléř mu soucitně položí ruku na čelo, jako otec nemocnému dítěti, a ty bys mu tu ruku nejraději usekl{a}.'
    ], ch: [
      { t: '„Matko, ve Škváře žijí děti. Nedělej to.“', chk: { s: 'cha', dc: 14, ok: 'p_odklad', no: 'p_facka' } },
      { t: 'Mlčet a pozorně sledovat kancléře.', chk: { s: 'mou', dc: 12, ok: 'p_prsten', no: 'p_odvod2' } },
      { t: '„Najdu tu dračí slzu. Pusť mě, matko.“', go: 'p_nikdy' }
    ] },

    // ── p_odklad ── Hráč přesvědčil královnu (Charisma). Očista Škváry se o den odloží.
    //    Sem se dostaneš z: p_kral2
    p_odklad: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], t: [
      'Královna se zarazí uprostřed nádechu. Na jediný okamžik se jí v očích objeví jiná žena: ta, která ti kdysi zpívala ukolébavky, když jsi měl{a} horečku, a nespala tři noci za sebou.',
      S('kralovna', 'Jeden den. Ať Řád počká jeden den, Viléme. Dokud… dokud nebudu mít jistotu. Nejsem žádná řeznice.', 'sad'),
      'Kancléř se ukloní. Úsměv mu nedosáhne do očí. Nikdy jim nedosáhne. Kancléřovy oči jsou místo, kam se úsměvy nedostanou ani s propustkou.'
    ], enter: (G, A) => { A.set('cistkaOdklad'); A.set('kralovnaPouto'); }, ch: [{ t: 'Dál', go: 'p_odvod2' }] },

    // ── p_facka ── Přesvědčování se nepovedlo, královna dá hráči facku.
    //    Sem se dostaneš z: p_kral2
    p_facka: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], t: [
      { t: 'Přiletí facka zesílená prsteny. Ucítíš na jazyku krev a v uších ti zvoní.', shake: 8 },
      S('kralovna', 'Ty nevíš nic o světě! Nic! Venku jsou zuby a drápy a oheň! Proto jsi naživu, rozumíš? Proto!', 'angry'),
      'Kancléř se za jejími zády tiše usměje. Velmi tiše, jen pro tebe.'
    ], ch: [{ t: 'Dál', go: 'p_odvod2' }] },

    // ── p_prsten ── Hod na Moudrost se povedl: hráč si všimne jedu v kancléřově prstenu. Získá stopu „prsten“.
    //    Sem se dostaneš z: p_kral2
    p_prsten: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], t: [
      'Mlčíš a díváš se. Kancléř si pohrává s prstenem na ukazováčku. Zlatá hadí hlava se smaragdovýma očima. Když ji otočí ke světlu svíce, uvidíš to: hlava se dá odklopit jako víčko. Pod ní je dutinka. A ve dutince černý povlak, lesklý a zaschlý jako dehet.',
      'Všimne si tvého pohledu a pomalu, velmi pomalu schová ruku do rukávu. Usměje se. Ty se usměješ taky. Oba teď víte, že ten druhý ví. Je to ten nejosamělejší úsměv tvého života.'
    ], enter: (G, A) => A.clue('prsten', 'Kancléř nosí prsten s hadí hlavou a dutinkou. Uvnitř je černý povlak.'), ch: [{ t: 'Dál', go: 'p_odvod2' }] },

    // ── p_nikdy ── Hráč chce jít hledat slzu, královna ho nikam nepustí.
    //    Sem se dostaneš z: p_kral2
    p_nikdy: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], t: [
      S('kralovna', 'Nikam nepůjdeš. Nikdy, slyšíš? Svět venku je plný zubů. Já tě před nimi uchráním, i kdybych tě měla zazdít. Rozumíš? I kdybych tě měla zazdít vlastníma rukama.', 'angry'),
      'Kancléř si za jejími zády odkašle, jako by chtěl říct, že na zdění má lidi.'
    ], ch: [{ t: 'Dál', go: 'p_odvod2' }] },

    // ── p_odvod2 ── Radim vede hráče zpět do věže. Hráč se ho může zeptat, mlčet, nebo ho shodit ze schodů.
    //    Sem se dostaneš z: p_kral2, p_odklad, p_facka, p_prsten, p_nikdy
    p_odvod2: { bg: 'schody', npc: [{ id: 'radim', x: .7 }], t: (G, A) => [
      'Radim tě vede zpátky do věže. Na schodech už Hedvika neleží. Zbyl po ní jen mokrý flek na kameni, vydrhnutý tak rychle a tak důkladně, jako by tu nikdy nebyla.',
      A.has('radimPochyba') ? S('radim', 'To pírko… Nevěřím tomu, Výsosti. Ani trochu. Ale mám rozkazy. Rozkazy jsou to jediné, co drží tohle království pohromadě. Když je pustím, rozsype se všechno.', 'n') : S('radim', 'Neutíkejte mi, Výsosti. Prosím. Jsem na honění po střechách už moc starý a vy jste na padání ze střech moc [[mladý|mladá]].', 'n')
    ], ch: [
      { t: '„Rozkazy od koho, kapitáne? Od krále, nebo od kancléře?“', chk: { s: 'cha', dc: 15, ok: 'p_radim_pusti', no: 'p_utek_volba' } },
      { t: 'Mlčky jít.', go: 'p_utek_volba' },
      { t: 'Strčit ho ze schodů a utéct.', tag: 'Útok', chk: { s: 'sil', dc: 14, ok: 'p_utek_strcil', no: 'p_utek_volba' } }
    ] },

    // ── p_radim_pusti ── Radim se zastydí a pustí hráče ke kuchyni.
    //    Sem se dostaneš z: p_odvod2
    p_radim_pusti: { bg: 'schody', npc: [{ id: 'radim', x: .7 }], t: [
      'Radim se zastaví na desátém schodu. Dlouho se dívá na vydrhnutý kámen, kde ležela Hedvika. Pak si sundá rukavici a promne si jizvu, jako by ho zabolela.',
      S('radim', 'Byl jsem u Hořan, víte to? Bylo mi devatenáct. Měli jsme rozkaz. Taky od kancléře, jen tehdy ještě nebyl kancléř.', 'n'),
      S('radim', 'Běžte přes dveře v kuchyni. Dám Vám deset minut, pak vyhlásím poplach. A Výsosti… jestli to byl on, přineste mi důkaz. Ne pocity, ne hlasy na schodech. Důkaz, který se dá položit na stůl.', 'n')
    ], enter: (G, A) => { A.ap('radim', 3, true); A.set('radimPustil'); }, ch: [{ t: 'Do kuchyně.', go: 'p_kuchyne' }] },

    // ── p_utek_strcil ── Hráč shodil Radima ze schodů a utíká. Radim ho teď nemá rád.
    //    Sem se dostaneš z: p_odvod2
    p_utek_strcil: { bg: 'schody', npc: [], t: ['Radim se skutálí deset schodů v rachotu železa a zůstane ležet na odpočívadle. Dýchá. Nadává způsobem, který by zčervenal i havrana. Ty už jsi o patro níž a srdce ti buší jako zvon.'], enter: (G, A) => { A.set('hledany'); A.ap('radim', -3, true); }, ch: [{ t: 'Do kuchyně.', go: 'p_kuchyne' }] },

    // ── p_utek_volba ── Hráč je zamčený ve věži. Vybírá, jak utéct: okno, mříž, klíč, nebo počkat do půlnoci.
    //    Sem se dostaneš z: p_odvedeni, p_odvod2
    p_utek_volba: { bg: 'vez', npc: [], cp: 1, t: (G, A) => [
      'Věž. Sedm tisíc tři sta čárek na zdi. Dnes v noci k nim žádnou další nepřidáš. Buď odsud odejdeš, nebo už nebude komu je dělat.',
      S('plachta', 'Tak si shrňme, jaké jsou možnosti. Utečeš přes okno a střechu, kde si nejspíš zlomíš vaz. Zkusíš použít klíč a utečeš přes kuchyň, tam tě nejspíš chytnou. A nebo počkáme, až se něco samo posere. Já hlasuju pro to poslední. Je to nejmíň práce a nejvíc filozofie.', 'n')
    ], ch: [
      { t: 'Okno, mříž, střecha.', chk: { s: 'obr', dc: 13, ok: 'p_hradby', no: 'p_okno_pad' } },
      { t: 'Ohnout uvolněnou mříž hrubou silou.', chk: { s: 'sil', dc: 14, ok: 'p_hradby', no: 'p_okno_pad' } },
      { t: 'Odemknout Hedvičiným klíčem a proplížit se ke kuchyni.', if: (G, A) => A.item('klic'), chk: { s: 'obr', dc: 10, ok: 'p_kuchyne', no: 'p_chycen_chodba' } },
      { t: 'Počkat do půlnoci.', go: 'p_kralovna_noc' }
    ] },

    // ── p_okno_pad ── Lezení oknem se nepovedlo, hráč spadne na střechu kaple a zraní se.
    //    Sem se dostaneš z: p_utek_volba
    p_okno_pad: { bg: 'hradby', npc: [], t: ['Mokrý kámen, mokré železo, mokré prsty. Prsty sklouznou. Padáš dva sáhy na olověnou střechu kaple a něco v rameni ti ošklivě křupne. Chvíli ležíš v dešti a zíráš do mraků, které se na tebe dívají bez zájmu.', S('plachta', 'Elegantní. Dávám šest bodů z deseti. Tři za styl, tři za ten zvuk. Jsi [[celý|celá]]? Tedy, alespoň z větší části?', 'n')], enter: (G, A) => A.hurt(4), ch: [{ t: 'Zatnout zuby a pokračovat.', go: 'p_hradby' }] },

    // ── p_chycen_chodba ── Hráč při plížení narazí na strážného s kaší.
    //    Sem se dostaneš z: p_utek_volba
    p_chycen_chodba: { bg: 'schody', npc: [{ id: 'straz', x: .7 }], t: ['Za rohem chodby stojí strážný s miskou kaše v ruce a lžící v puse. Zírá na tebe. Ty zíráš na něj. Lžíce mu pomalu vypadne z úst a cinkne o dlažbu. Ani jeden z vás neví, co říct.'], ch: [
      { t: '„Ty jsi mě neviděl a já tebe ne. Tady máš za to prsten.“', chk: { s: 'cha', dc: 11, ok: 'p_kuchyne', no: 'p_chodba_boj' } },
      { t: 'Udeřit dřív, než zakřičí.', tag: 'Útok', fight: { foes: ['straz'], win: 'p_kuchyne', lose: 'p_odvedeni', loseFx: (G, A) => A.set('zbit') } }
    ] },

    // ── p_chodba_boj ── Úplatek se nepovedl, strážný bojuje.
    //    Sem se dostaneš z: p_chycen_chodba
    p_chodba_boj: { bg: 'schody', fight: { foes: ['straz'], intro: 'Strážný se podívá na prsten, pak na tebe, pak na meč u pasu. Kaše letí na zem. Vybral si meč.', win: 'p_kuchyne', lose: 'p_odvedeni', loseFx: (G, A) => A.set('zbit') } },

    // ── p_kralovna_noc ── O půlnoci přijde do věže královna sama. Hráč ji může obejmout, ukrást jí lék, nebo ji varovat.
    //    Sem se dostaneš z: p_odvedeni, p_utek_volba
    p_kralovna_noc: { bg: 'vez', mood: 'sad', npc: [{ id: 'kralovna', x: .7 }], lore: 'kralovna', t: [
      'Je půlnoc. Déšť utichl a ticho po něm je tak husté, že slyšíš kapat vodu z okapu. Ozve se zámek. Klíč se otočí jednou, podruhé. Ve dveřích stojí královna, sama, bez dvorních dam, se svíčkou v ruce. Oči má skelné a ruce se jí třesou stejně jako dnes večer Hedvice.',
      S('kralovna', 'Spíš? Ne, nikdy jsi nespal{a}, když pršelo. Seděl{a} jsi u okna a počítal{a} kapky.', 'sad'),
      S('kralovna', 'Před tebou jsem měla tři děti, víš to? Tři. Žádné z nich se nenadechlo. Dala jsem jim jména a pak je pohřbili. Tehdy jsem přestala zpívat. A pak tě Bořivoj přinesl - v plášti a [[celý černý|celá černá]] od sazí. A ty jsi křičel{a}. Tak nahlas. Tak *živě*.', 'sad'),
      S('kralovna', 'Vilém mi dává lék na spaní. Bez něj nemohu usnout. S ním… s ním mám ale divné sny. Každou noc se mi zdá o požáru. V tom ohni jsi ty. A já tě nemůžu zachránit.', 'n')
    ], ch: [
      { t: 'Obejmout ji. „Jsem tady, mami. Nehořím.“', go: 'p_kn_objeti', fx: (G, A) => A.set('kralovnaPouto') },
      { t: 'Nenápadně jí sebrat lahvičku s lékem.', chk: { s: 'obr', dc: 12, ok: 'p_kn_lek', no: 'p_kn_nic' } },
      { t: '„Ten lék tě tráví, mami. Vilém tě tráví.“', chk: { s: 'cha', dc: 14, ok: 'p_kn_pochyba', no: 'p_kn_nic' } }
    ] },

    // ── p_kn_objeti ── Hráč obejme královnu. Pouto s matkou se posílí.
    //    Sem se dostaneš z: p_kralovna_noc
    p_kn_objeti: { bg: 'vez', npc: [{ id: 'kralovna', x: .7 }], t: ['Ztuhne, jako by ji objímal někdo cizí. Pak se ti zhroutí do náručí a pláče, tiše a dlouho, jako by se bála, že ji někdo uslyší. Voní levandulí a mákem. Když odchází, nechá dveře pootevřené. Možná omylem. Možná ne.'], ch: [{ t: 'Čekat, až její kroky utichnou.', go: 'p_vrah_okno' }] },

    // ── p_kn_lek ── Hráč ukradl královnin lék. Získá stopu „lek“.
    //    Sem se dostaneš z: p_kralovna_noc
    p_kn_lek: { bg: 'vez', npc: [{ id: 'kralovna', x: .7 }], t: ['Lahvička máš v rukávu dřív, než si toho všimne. Když odejde, vytáhneš zátku a přičichneš. Mák. Hořký pach mandlí. A pod tím něco sladkého a hnilobného, co znáš z kancléřova kabátu. Tohle není lék. Tohle je obojek.'], enter: (G, A) => A.clue('lek', 'Královnin „lék na nervy“ od Viléma obsahuje mák a něco, co ji udržuje v mlze.'), ch: [{ t: 'Dál', go: 'p_vrah_okno' }] },

    // ── p_kn_pochyba ── Hráč přesvědčil královnu, že ji lék tráví. Ona ho sama odloží.
    //    Sem se dostaneš z: p_kralovna_noc
    p_kn_pochyba: { bg: 'vez', npc: [{ id: 'kralovna', x: .7 }], t: [S('kralovna', 'Vilém je jediný, kdo… kdo mě drží nad vodou. Jediný, kdo se nebojí se mnou mluvit. Jediný…', 'shock'), 'Ale pak udělá něco, co jsi nečekal{a}. Lahvičku položí na parapet a odejde bez ní. Je to malé gesto. Je to víc, než za posledních deset let udělala.'], enter: (G, A) => { A.set('kralovnaPochyba'); A.clue('lek', 'Královnin „lék na nervy“ od Viléma ji drží v mlze. Sama ho odložila.'); }, ch: [{ t: 'Dál', go: 'p_vrah_okno' }] },

    // ── p_kn_nic ── Nepovedlo se, královna odejde a zamkne.
    //    Sem se dostaneš z: p_kralovna_noc
    p_kn_nic: { bg: 'vez', npc: [{ id: 'kralovna', x: .7 }], t: [S('kralovna', 'Spi. Ráno bude líp. Ráno bude oheň, a po ohni je vždycky líp. Tak to říká Vilém.', 'n'), 'Odejde. Zamkne. Dvakrát.'], ch: [{ t: 'Dál', go: 'p_vrah_okno' }] },

    // ── p_vrah_okno ── Hodinu po půlnoci leze oknem do věže najatý vrah. Boj.
    //    Sem se dostaneš z: p_kn_objeti, p_kn_lek, p_kn_pochyba, p_kn_nic
    p_vrah_okno: { bg: 'vez', mood: 'tense', npc: [{ id: 'zoldak', x: .72 }], t: [
      'Hodinu po půlnoci se mříž v okně pohne. Nejdřív jen trochu, pak víc. Někdo ji zvenku tiše a trpělivě vyšroubovává. Po laně se do věže spustí muž v černém, s tváří začerněnou sazemi a s nožem mezi zuby.',
      S('plachta', 'Máme návštěvu! A nemáme čím po psu hodit... Leda bych naporcovala tebe. Ty vole, ale tenhle návštěvník asi nepřišel kvůli kulinářským zážitkům!', 'angry')
    ], ch: [{ t: 'Na něj!', tag: 'Útok', fight: { foes: [{ id: 'zoldak', name: 'Vrah v černém' }], win: 'p_vrah_mrtvy', lose: 'p_vrah_prohra' } }] },

    // ── p_vrah_prohra ── Hráč boj s vrahem prohrál, zachrání ho Plachtička.
    //    Sem se dostaneš z: p_vrah_okno
    p_vrah_prohra: { bg: 'vez', npc: [], t: ['Nůž tě drápne po žebrech a svět zrudne. Pak Plachtička, osm palců zuřivosti a drápů, skočí vrahovi rovnou do obličeje. Vrah zařve, zavrávorá, vypadne z okna a dole pod věží to mlaskne. Lano zůstalo viset.'], ch: [{ t: 'Po laně dolů.', go: 'p_hradby' }] },

    // ── p_vrah_mrtvy ── Hráč vraha zabil. Najde zlato a peníz s hadem (stopa „dukat“).
    //    Sem se dostaneš z: p_vrah_okno
    p_vrah_mrtvy: { bg: 'vez', npc: [{ id: 'zoldak', pose: 'dead', x: .72 }], t: [
      'Vrah leží na podlaze a jeho krev se vpíjí do spár mezi kameny. Ještě chvilku chroptí, pak vydechne naposledy.',
      'U pasu má měšec. V něm stříbro a jeden zlatý peníz s vyraženým hadem, který si kouše vlastní ocas. Znak kancléřského úřadu. Za takový peníz se nekupuje chleba. Za takový peníz se kupují lidé.'
    ], enter: (G, A) => { A.gold(25); A.clue('dukat', 'Najatý vrah ve věži měl zlatý peníz s hadem, znakem kancléřského úřadu.'); }, ch: [{ t: 'Po jeho laně dolů.', go: 'p_hradby' }] },

    // ── p_hradby ── Hráč je venku na hradbách. Vybírá, jak se dostat dolů do města.
    //    Sem se dostaneš z: p_utek_boj, p_utek_volba, p_okno_pad, p_vrah_prohra, p_vrah_mrtvy
    p_hradby: { bg: 'hradby', mood: 'storm', npc: [], cp: 1, lore: 'popelov', t: [
      'Hradby. Vítr ti rve vlasy a déšť bičuje tvář jako trest za každý rok, kdy jsi ho znal{a} jen přes sklo. Pod tebou, v hlubině noci, leží Popelov.',
      'Poprvé ho vidíš celé. Moře střech, mokrých a lesklých jako šupiny. Šibenice na náměstích. Tisíce lucerniček v oknech. A na kopci nad tím vším bílý chrám Řádu, jehož věčný plamen hoří tak bíle, že vrhá stíny i přes déšť.',
      { t: 'Blesk. Na okamžik je celý svět bílý a ostrý jako vyřezaný z kosti a ty vidíš, jak strašně hluboko je to dolů.', flash: 1, snd: 'thunder' },
      S('plachta', 'Tak co, Výsosti? Skočíme, slezeme, nebo budeME dramaticky zírat do bouře, dokud NÁS neuvidí ze všech sedmi věží?', 'n')
    ], ch: [
      { t: 'Skočit do hradního příkopu.', chk: { s: 'odl', dc: 12, ok: 'p_prikop', no: 'p_prikop_bolest' } },
      { t: 'Slézt po zdi.', chk: { s: 'obr', dc: 13, ok: 'p_mesto_prichod', no: 'p_prikop_bolest' } },
      { t: 'Nechat Plachtičku najít cestu.', go: 'p_skluz' }
    ] },

    // ── p_prikop ── Skok do příkopu se povedl. Hráč je od bahna, ale živý.
    //    Sem se dostaneš z: p_hradby
    p_prikop: { bg: 'ulice', npc: [], t: ['Ucítíš mrazivý vzduch, pak následuje pád a náraz ledové vody. Všude je bahno, tma a cosi měkkého. Co to je? Neptej se na otázky, na které nechceš znát odpověď. Zmátoříš se a vyškrábeš na druhý břeh, jsi [[celý|celá]] od bahna a páchneš jako hradní latrína, ale [[živý|živá]]. Konečně svoboda - smrdí.'], ch: [{ t: 'Do města.', go: 'p_mesto_prichod' }] },

    // ── p_prikop_bolest ── Skok nebo slézání se nepovedlo, hráč se zraní.
    //    Sem se dostaneš z: p_hradby
    p_prikop_bolest: { bg: 'ulice', npc: [], t: ['Náraz ti vyrazí dech z plic i myšlenky z hlavy. Chvíli nevíš, kde je nahoře a kde dole, a je ti to skoro jedno. Pak se vyškrábeš na dlažbu, kašleš bahno a smíchem, který se ti dere z hrdla, děsíš [[sám|sama]] sebe.'], enter: (G, A) => A.hurt(4), ch: [{ t: 'Do města.', go: 'p_mesto_prichod' }] },

    // ── p_skluz ── Plachtička vede hráče odpadním žlabem. Může jít do stok, nebo nahoru do města.
    //    Sem se dostaneš z: p_hradby
    p_skluz: { bg: 'stoky', npc: [], t: [
      S('plachta', 'Poběž za mnou. Je tu odpadní žlab z kuchyně. Jezdím po něm, když se chci najíst v kanále. Nesuď mě. Je tam lepší výběr než u královského stolu!', 'n'),
      'Klouzáš tmou, smradem a bramborovými slupkami, s hlavou dopředu. Modlíš se, modlitbu kterou sis nikdy nepamatoval{a} celou. Žlab tě vyplivne v podzemí, po kolena ve vodě, ve tmě, která má vlastní vůni a vlastní ozvěny. Odněkud zdálky se ozve pískání. Melodické, jako by někdo pískal pochod.'
    ], enter: (G, A) => A.set('vStokach'), ch: [{ t: 'Jít za pískáním.', go: 'stoky' }, { t: 'Najít cestu nahoru na ulici.', go: 'p_mesto_prichod' }] },

    // ── p_kuchyne ── Hráč utekl kuchyňskými dveřmi a nechá klíč v zámku.
    //    Sem se dostaneš z: p_utek_boj, p_radim_pusti, p_utek_strcil, p_utek_volba, p_chycen_chodba, p_chodba_boj
    p_kuchyne: { bg: 'ulice', npc: [], t: ['Kuchyňské dveře s orlím klepadlem se otevřou do úzké uličky za hradbami, kde voní mokré listí a koňský hnůj. Hedvičin klíč necháš v zámku. Ať tam zrezne. Ať každý, kdo ty dveře otevře, vzpomene na ni.'], enter: (G, A) => A.take('klic'), ch: [{ t: 'Do města.', go: 'p_mesto_prichod' }] }
  });
})(window.T);
