/* Koruna z popela – Prolog: věž, vražda, umírající král, útěk.
   Text: {a} = ženská koncovka, [[muž|žena]], {name}, {titul}. Řeč: { w: 'kdo', m: 'nálada', t: '...' } */
(function (T) {
  'use strict';
  const S = (w, t, m) => ({ w, t, m });
  Object.assign(T.N, {
    start: { act: 'Prolog', bg: 'vez', mood: 'rain', npc: [], t: [
      'Prší. Ve Vranově prší vždycky, když se má něco zlomit.',
      'Dvacet let počítáš čárky na zdi. Sedm tisíc tři sta dní ve věži. Matka – královna Morana – tomu říká *bezpečí*. Ty tomu říkáš jinak, ale jen potichu.',
      'Dveře zaskřípou. Chůva Hedvika. Jediná, kdo sem smí. Dnes jí třesou ruce tak, že rozlije polévku.',
      S('hedvika', 'Výsosti… Král umírá. Doktoři říkají horečka. Já vím, že jed. Viděla jsem mu zčernat nehty.', 'shock')
    ], ch: [
      { t: '„Kdo by otrávil krále?“', go: 'p_kdo' },
      { t: '„Proč mi to říkáš? Nikdy mi nic neříkáš.“', go: 'p_proc' },
      { t: 'Chytit ji za ruce. „Hedviko, dýchej. Pomalu.“', go: 'p_klic', fx: (G, A) => A.set('hedvikaKlid') }
    ] },
    p_kdo: { bg: 'vez', npc: [], t: [
      S('hedvika', 'Nevím. Ale kancléř Vilém od rána chodí s úsměvem jako kocour u prázdné klece. A Řád Bledého plamene už brousí pochodně. Prý to udělali šupináči – dračí lid ze Škváry.', 'sad'),
      S('hedvika', 'Královna tomu věří. Královna věří všemu, co jí Vilém nalije do poháru.', 'angry')
    ], ch: [{ t: '„Co mám dělat?“', go: 'p_klic' }] },
    p_proc: { bg: 'vez', npc: [], t: [
      S('hedvika', 'Protože jsem tě kojila, když tě král přinesl z popela. Byl{a} jsi [[takový malinký|taková malinká]] a voněl{a} jsi kouřem.', 'sad'),
      S('hedvika', 'A protože až král zemře, nikdo už ti tyhle dveře neotevře. Nikdy.', 'n')
    ], ch: [{ t: '„Z popela? Co tím myslíš?“', go: 'p_klic', fx: (G, A) => A.set('popelZminka') }] },
    p_klic: { bg: 'vez', npc: [], t: (G, A) => [
      A.has('popelZminka') ? S('hedvika', 'Na to teď není čas. Zeptej se krále, dokud ještě dýchá.', 'sad') : null,
      'Hedvika ti vtiskne do dlaně těžký železný klíč. Je teplý od jejího těla.',
      S('hedvika', 'Kuchyňské dveře pod věží. Kdyby se mnou něco stalo… Nečekej na nikoho. Jdi.', 'n'),
      'Odejde. Slyšíš její kroky na točitém schodišti. Dvacet sedm schodů. Znáš je nazpaměť.'
    ], enter: (G, A) => { A.give('klic'); }, ch: [{ t: 'Pohlédnout ke trámům. „Plachtičko? Slyšela jsi to?“', go: 'p_plachta' }] },
    p_plachta: { bg: 'vez', npc: [{ id: 'plachta', x: .62 }], t: [
      'Z trámu se snese chundelatý ocas, pak zbytek. Veverka s jedním natrženým uchem a lahvičkou medoviny, kterou ti krade z večeří.',
      'Plachtička. Jediná přítelkyně za dvacet let. Mluví – ale nikdo kromě tebe jí nevěří, takže tě mají za blázna. Možná oprávněně.',
      S('plachta', 'Slyšela, slyšela. Král chcípá, kancléř se tlemí a ty máš klíč. Hele, já nejsem žádná chytrá sova, ale tohle zní jako „vypadni, dokud můžeš“.', 'n'),
      S('plachta', 'A vem mě s sebou. Jestli tu zůstanu sama, sežerou mě strážný. Ten tlustej už po mně jednou házel botou.', 'angry')
    ], enter: (G, A) => { A.join('plachta'); A.ap('plachta', 1, true); }, ch: [
      { t: '„Jasně, že tě vezmu.“', go: 'p_krik', fx: (G, A) => A.ap('plachta', 1) },
      { t: '„Jen když přestaneš pít.“', go: 'p_krik', fx: (G, A) => A.set('plachtaSlib') }
    ] },
    p_krik: { bg: 'vez', npc: [], snd: 'hit', t: (G, A) => [
      A.has('plachtaSlib') ? S('plachta', 'Přestanu. Zítra. Možná. Pšt!', 'n') : null,
      { t: 'Ze schodiště se ozve krátký výkřik. Pak náraz. Pak nic.', shake: 10 },
      'Ticho na Vranově je vždycky horší než křik.'
    ], ch: [
      { t: 'Odemknout klíčem a vyběhnout ven.', go: 'p_schody' },
      { t: 'Přitisknout ucho ke dveřím a poslouchat.', chk: { s: 'mou', dc: 12, ok: 'p_krik_ok', no: 'p_krik_no' } }
    ] },
    p_krik_ok: { bg: 'vez', npc: [], t: [
      'Dva hlasy. Jeden hluboký, ochraptělý. Druhý tenký a hladký jako olej.',
      '*„…to pírko jí dej do dlaně. Ať to vypadá na Řád. Nebo na šupináče, co se převlékli za Řád. Lidi si vyberou, čemu chtějí věřit.“*',
      'Kroky se vzdálí dolů. Ten olejový hlas znáš. Slýcháš ho na nádvoří každé ráno – předčítá královské výnosy.'
    ], enter: (G, A) => { A.clue('hlas', 'U mrtvé Hedviky jsem slyšel{a} hlas, který zní jako kancléř Vilém: „To pírko jí dej do dlaně. Ať to vypadá na Řád.“'); A.set('slyselHlas'); }, ch: [{ t: 'Vyjít ven.', go: 'p_schody' }] },
    p_krik_no: { bg: 'vez', npc: [], t: ['Jen déšť a tvůj vlastní tep. Když konečně odemkneš, je po všem.'], ch: [{ t: 'Vyjít ven.', go: 'p_schody' }] },
    p_schody: { bg: 'schody', mood: 'tense', npc: [{ id: 'hedvika', pose: 'dead', x: .7 }], t: [
      'Hedvika leží na desátém schodu. Hrdlo přeťaté od ucha k uchu. Pochodeň nad ní syčí, jako by se jí to nelíbilo.',
      'V pravé dlani svírá bílé pírko. Znak Řádu Bledého plamene.',
      S('plachta', 'Do prdele. Do prdele, prdele, prdele. Měla ráda ořechy. Vždycky mi nechávala ořechy.', 'sad')
    ], ch: [
      { t: 'Prohlédnout tělo pořádně.', chk: { s: 'duv', dc: 11, ok: 'p_telo_ok', no: 'p_telo_no' } },
      { t: 'Zavřít jí oči a vzít pírko.', go: 'p_radim', fx: (G, A) => { A.give('pirko'); A.set('zavrelOci'); } },
      { t: 'Křičet o pomoc.', go: 'p_radim' }
    ] },
    p_telo_ok: { bg: 'schody', npc: [{ id: 'hedvika', pose: 'dead', x: .7 }], t: [
      'Řez vedený zezadu, zleva doprava. Zkušená ruka – voják nebo řezník.',
      'A to pírko: prsty kolem něj nejsou sevřené v křeči. Někdo je kolem něj ohnul *potom*, když už byla mrtvá. Krev pod pírkem je zaschlá dřív než na něm.',
      'Někdo chtěl, aby to vypadalo na Řád. Nebo chtěl, aby to vypadalo na někoho, kdo to chce svést na Řád. V Popelově je lež jako cibule.'
    ], enter: (G, A) => { A.give('pirko'); A.clue('pirko', 'Pírko Řádu vložil Hedvice do dlaně někdo až po smrti. Vrah byl zkušený voják.'); }, ch: [{ t: 'Na schodech zaduní kroky.', go: 'p_radim' }] },
    p_telo_no: { bg: 'schody', npc: [{ id: 'hedvika', pose: 'dead', x: .7 }], t: ['Krev, pírko, smrt. Víc z toho nevyčteš – ruce se ti třesou a v hlavě ti hučí.'], enter: (G, A) => A.give('pirko'), ch: [{ t: 'Na schodech zaduní kroky.', go: 'p_radim' }] },
    p_radim: { bg: 'schody', mood: 'tense', npc: [{ id: 'hedvika', pose: 'dead', x: .78, blood: true }, { id: 'radim', x: .64 }, { id: 'vilem', x: .88 }], t: (G, A) => [
      'Kapitán hradní stráže Radim Kost. Jizva přes obličej, oči jako dvě rezavé hřebíky. Za ním, v kruhu světla z pochodně, žlutá tvář kancléře Viléma.',
      S('vilem', 'Výsost mimo věž, a nad mrtvolou. Jaká… nešťastná souhra okolností.', 'smirk'),
      S('radim', 'Vraťte se do věže, Výsosti. Hned.', 'angry'),
      S('vilem', 'Pírko Řádu? Ach ne. To je přece trik šupináčů – převléknou se za svaté a vraždí. Ráno to vyřešíme. Ohněm.', 'smirk')
    ], ch: [
      { t: '„Jsem dědic Vranova. Chci vidět otce. Hned.“', chk: { s: 'cha', dc: 12, ok: 'p_kral', no: 'p_odvedeni' } },
      { t: '„To pírko jí někdo vložil do ruky až po smrti, kancléři.“', if: (G, A) => A.hasClue('pirko'), go: 'p_obvineni' },
      { t: '„Ten hlas na schodech. Byl jste to vy, Viléme.“', if: (G, A) => A.has('slyselHlas'), go: 'p_obvineni', fx: (G, A) => A.set('obvinilHlasem') },
      { t: '[Lež] „Viděl{a} jsem utíkat někoho s rohy a šupinami.“', go: 'p_lez', tag: 'Lež' },
      { t: 'Vytrhnout strážnému kopí a probít se dolů.', tag: 'Útok', fight: { foes: ['straz', 'straz'], intro: 'Radim ustoupí o krok a nechá své muže, ať to vyřeší. Kancléř se usmívá.', win: 'p_utek_boj', lose: 'p_odvedeni', loseFx: (G, A) => A.set('zbit') } }
    ] },
    p_obvineni: { bg: 'schody', npc: [{ id: 'hedvika', pose: 'dead', x: .78 }, { id: 'radim', x: .64 }, { id: 'vilem', x: .88 }], t: (G, A) => [
      S('vilem', A.has('obvinilHlasem') ? 'Můj hlas? Výsost slyší hlasy. Dvacet let ve věži… Chudinka. Kapitáne, zapište si to.' : 'Výsost četla příliš mnoho romancí. Vrazi, pírka, spiknutí. Kapitáne, zapište si to.', 'smirk'),
      'Radim nic nezapisuje. Dívá se na pírko. Potom na kancléře. Potom zpátky na tebe. Je to dlouhý pohled a něco v něm praská.',
      S('radim', 'Výsost půjde za králem. Pod mým dohledem. Na tom trvám, kancléři.', 'n')
    ], enter: (G, A) => { A.set('radimPochyba'); A.ap('radim', 2, true); }, ch: [{ t: 'Jít za králem.', go: 'p_kral' }] },
    p_lez: { bg: 'schody', npc: [{ id: 'hedvika', pose: 'dead', x: .78 }, { id: 'radim', x: .64 }, { id: 'vilem', x: .88 }], t: [
      S('vilem', 'Vidíte, kapitáne? Svědek. Výsost je *svědek*. Taková odvaha. Zítra to bude vyhlášeno na náměstí.', 'smile'),
      'Kancléř tě vezme kolem ramen. Voní mastí a něčím nasládlým pod ní. Uvědomíš si, že jsi mu právě podal{a} do ruky pochodeň.',
      'Radim mlčí. Jeho mlčení je těžší než zbroj.'
    ], enter: (G, A) => { A.set('lzi_drak'); A.ap('radim', -2, true); A.inc('temnota'); }, ch: [{ t: 'Jít s kancléřem za králem.', go: 'p_kral' }] },
    p_utek_boj: { bg: 'schody', npc: [{ id: 'hedvika', pose: 'dead', x: .78 }, { id: 'radim', x: .64 }], t: [
      'Dva strážní leží na schodech vedle Hedviky. Radim drží meč, ale nezvedá ho.',
      S('radim', 'Tohle vám nezapomenou, Výsosti. Já taky ne.', 'angry'),
      'Kancléř je pryč – ztratil se ve tmě, jak to umí jen hadi a úředníci. Za chvíli se rozezní zvon.'
    ], enter: (G, A) => { A.set('hledany'); A.ap('radim', -1, true); }, ch: [
      { t: 'Utéct nahoru na hradby.', go: 'p_hradby' },
      { t: 'Utéct dolů kuchyní – máš klíč.', go: 'p_kuchyne' }
    ] },
    p_odvedeni: { bg: 'vez', npc: [], t: (G, A) => [
      A.has('zbit') ? 'Probudíš se na podlaze věže. Ve rtu ti tepe. Někdo ti vzal kopí, ale klíč nenašli – zůstal ve švu rukávu.' : 'Radim tě odvede zpátky do věže. Neřekne ani slovo. Klíč v zámku cvakne dvakrát.',
      S('plachta', 'Tak. Výborně. Zase doma. Mám otevřít medovinu na oslavu?', 'n')
    ], ch: [{ t: 'Nečekat. Ještě dnes v noci zmizet.', go: 'p_utek_volba' }, { t: 'Počkat do půlnoci. Něco se stane.', go: 'p_kralovna_noc' }] },

    p_kral: { bg: 'loznice', mood: 'sad', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], t: [
      'Královská ložnice páchne vínem, mastí a smrtí. Král Bořivoj leží v rudých závěsech. Nehty má černé, rty šedivé.',
      S('kralovna', 'Kdo tě pustil ven?! Kdo ti dovolil – ty ses mohl{a} zranit, mohl tě někdo…', 'angry'),
      S('kral', 'Moro. Nech… nech to dítě. Pojď blíž, {name}.', 'sad'),
      S('kral', 'Nejsi… z mé krve. Ale jsi má. Našel jsem tě v popelu Hořan, když Dračí válka… Drak tě hlídal. Starý drak. Kýchal. Ve zřícenině za Lhotou.', 'sad'),
      S('kral', 'Černá rosa. To je ten jed. Lék… jen dračí slza. Říkají, že draci jsou mrtví. Draci…', 'sad'),
      'Kašle. Na polštáři zůstane černá skvrna. Dvorní lékař za tvými zády šeptá: *sedm dní, Výsosti. Možná osm.*'
    ], enter: (G, A) => { A.quest('slza', 'Dračí slza', 'Král umírá na Černou rosu. Podle něj ho vyléčí jen dračí slza. Starý drak Kýchal prý žije ve zřícenině za Lhotou. Zbývá sedm dní.'); A.quest('vrah', 'Kdo otrávil krále', 'Hedvika je mrtvá. Kancléř to svádí na dračí lid. Najdi skutečného traviče.'); A.clue('rosa', 'Krále otrávili Černou rosou. Lék je prý jen dračí slza.'); }, ch: [{ t: 'Dál', go: 'p_kral2' }] },
    p_kral2: { bg: 'loznice', mood: 'sad', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], t: [
      S('vilem', 'Veličenstvo, dovolte mi postarat se o bezpečí trůnu. Ráno Řád vyčistí Škváru. Ti šupináči otrávili vašeho muže.', 'smirk'),
      S('kralovna', 'Spalte to hnízdo. Do posledního.', 'angry')
    ], ch: [
      { t: '„Matko, ve Škváře žijí děti. Nedělej to.“', chk: { s: 'cha', dc: 14, ok: 'p_odklad', no: 'p_facka' } },
      { t: 'Mlčet a sledovat kancléře.', chk: { s: 'mou', dc: 12, ok: 'p_prsten', no: 'p_odvod2' } },
      { t: '„Najdu tu slzu. Pusť mě.“', go: 'p_nikdy' }
    ] },
    p_odklad: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], t: [
      'Královna se zarazí. Na vteřinu se jí v očích objeví ta žena, která ti zpívala, když jsi měl{a} horečku.',
      S('kralovna', 'Jeden den. Ať Řád počká jeden den, dokud… dokud nebudu mít jistotu.', 'sad'),
      'Vilém se ukloní. Úsměv mu nedosáhne do očí. Nikdy nedosáhne.'
    ], enter: (G, A) => { A.set('cistkaOdklad'); A.set('kralovnaPouto'); }, ch: [{ t: 'Dál', go: 'p_odvod2' }] },
    p_facka: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], t: [
      { t: 'Facka. Tvrdá, s prsteny. Ucítíš krev.', shake: 8 },
      S('kralovna', 'Ty nevíš nic o světě! Nic! Proto jsi naživu!', 'angry')
    ], ch: [{ t: 'Dál', go: 'p_odvod2' }] },
    p_prsten: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], t: [
      'Kancléř si pohrává s prstenem. Hadí hlava, zlaté oči. Když ho otočí ke světlu, uvidíš, že hlava se dá odklopit. Pod ní je dutinka. A v ní černý povlak, jako zaschlý dehet.',
      'Všimne si tvého pohledu a schová ruku do rukávu. Usměje se. Ty se usměješ taky. Oba víte.'
    ], enter: (G, A) => A.clue('prsten', 'Kancléř nosí prsten s dutinkou. Uvnitř je černý povlak.'), ch: [{ t: 'Dál', go: 'p_odvod2' }] },
    p_nikdy: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .86 }], t: [S('kralovna', 'Nikam nepůjdeš. Nikdy. Svět venku je plný zubů. Já tě před nimi uchráním, i kdybych tě měla zazdít.', 'angry')], ch: [{ t: 'Dál', go: 'p_odvod2' }] },
    p_odvod2: { bg: 'schody', npc: [{ id: 'radim', x: .7 }], t: (G, A) => [
      'Radim tě vede zpátky do věže. Na schodech už Hedvika neleží. Jen mokrý flek, který někdo vydrhnul příliš rychle.',
      A.has('radimPochyba') ? S('radim', 'To pírko… Nevěřím tomu. Ale mám rozkazy, Výsosti. Rozkazy jsou to jediné, co drží tohle království pohromadě.', 'n') : S('radim', 'Neutíkejte mi, Výsosti. Nechci vás honit po střechách.', 'n')
    ], ch: [
      { t: '„Rozkazy od koho, kapitáne? Od krále, nebo od kancléře?“', chk: { s: 'cha', dc: 15, ok: 'p_radim_pusti', no: 'p_utek_volba' } },
      { t: 'Mlčky jít.', go: 'p_utek_volba' },
      { t: 'Strčit ho ze schodů a utéct.', tag: 'Útok', chk: { s: 'sil', dc: 14, ok: 'p_utek_strcil', no: 'p_utek_volba' } }
    ] },
    p_radim_pusti: { bg: 'schody', npc: [{ id: 'radim', x: .7 }], t: [
      'Radim se zastaví. Dlouho se dívá na prázdný schod, kde ležela Hedvika.',
      S('radim', 'Kuchyňské dveře. Máte deset minut, pak vyhlásím poplach. A Výsosti… jestli to byl kancléř, přineste mi důkaz. Ne pocity. Důkaz.', 'n')
    ], enter: (G, A) => { A.ap('radim', 3, true); A.set('radimPustil'); }, ch: [{ t: 'Do kuchyně.', go: 'p_kuchyne' }] },
    p_utek_strcil: { bg: 'schody', npc: [], t: ['Radim se skutálí deset schodů a zůstane ležet. Dýchá. Nadává. Ty už jsi o patro níž.'], enter: (G, A) => { A.set('hledany'); A.ap('radim', -3, true); }, ch: [{ t: 'Do kuchyně.', go: 'p_kuchyne' }] },

    p_utek_volba: { bg: 'vez', npc: [], cp: 1, t: (G, A) => [
      'Věž. Dvacet let. Dnes naposledy.',
      S('plachta', 'Možnosti: okno a střecha, kde se zabiješ. Klíč a kuchyň, kde tě chytnou. Nebo počkáme, až se něco posere samo. Já hlasuju pro to poslední, je to nejmíň práce.', 'n')
    ], ch: [
      { t: 'Okno, mříž, střecha.', chk: { s: 'obr', dc: 13, ok: 'p_hradby', no: 'p_okno_pad' } },
      { t: 'Ohnout uvolněnou mříž hrubou silou.', chk: { s: 'sil', dc: 14, ok: 'p_hradby', no: 'p_okno_pad' } },
      { t: 'Odemknout Hedvičiným klíčem a proplížit se ke kuchyni.', if: (G, A) => A.item('klic'), chk: { s: 'obr', dc: 10, ok: 'p_kuchyne', no: 'p_chycen_chodba' } },
      { t: 'Počkat do půlnoci.', go: 'p_kralovna_noc' }
    ] },
    p_okno_pad: { bg: 'hradby', npc: [], t: ['Mokrý kámen. Prsty sklouznou. Padáš dva sáhy na olověnou střechu kaple a něco v rameni křupne.', S('plachta', 'Elegantní. Dávám šest bodů z deseti. Za ten zvuk.', 'n')], enter: (G, A) => A.hurt(4), ch: [{ t: 'Zatnout zuby a pokračovat.', go: 'p_hradby' }] },
    p_chycen_chodba: { bg: 'schody', npc: [{ id: 'straz', x: .7 }], t: ['Za rohem stojí strážný s miskou kaše. Zírá na tebe. Ty na něj. Kaše padá na zem.'], ch: [
      { t: '„Ty jsi mě neviděl a já tebe ne. Tady je za to prsten.“', chk: { s: 'cha', dc: 11, ok: 'p_kuchyne', no: 'p_chodba_boj' } },
      { t: 'Udeřit dřív, než zakřičí.', tag: 'Útok', fight: { foes: ['straz'], win: 'p_kuchyne', lose: 'p_odvedeni', loseFx: (G, A) => A.set('zbit') } }
    ] },
    p_chodba_boj: { bg: 'schody', fight: { foes: ['straz'], intro: 'Strážný sáhne po meči.', win: 'p_kuchyne', lose: 'p_odvedeni', loseFx: (G, A) => A.set('zbit') } },

    p_kralovna_noc: { bg: 'vez', mood: 'sad', npc: [{ id: 'kralovna', x: .7 }], t: [
      'Půlnoc. Klíč v zámku. Královna, sama, v noční košili, se svíčkou. Oči má skelné a ruce se jí třesou jako Hedvice.',
      S('kralovna', 'Spíš? Nespíš. Nikdy jsi nespal{a}, když pršelo.', 'sad'),
      S('kralovna', 'Měla jsem tři děti, víš. Tři. Žádné se nenadechlo. Pak tě Bořivoj přinesl v plášti, černé od sazí, a ty jsi křičel{a}. Tak nahlas. Živé.', 'sad'),
      S('kralovna', 'Vilém mi dává lék na nervy. Bez něj nespím. S ním… se mi zdá, že hořím.', 'n')
    ], ch: [
      { t: 'Obejmout ji. „Já jsem tady, mami.“', go: 'p_kn_objeti', fx: (G, A) => A.set('kralovnaPouto') },
      { t: 'Nenápadně jí sebrat lahvičku s lékem.', chk: { s: 'obr', dc: 12, ok: 'p_kn_lek', no: 'p_kn_nic' } },
      { t: '„Ten lék tě tráví. Vilém tě tráví.“', chk: { s: 'cha', dc: 14, ok: 'p_kn_pochyba', no: 'p_kn_nic' } }
    ] },
    p_kn_objeti: { bg: 'vez', npc: [{ id: 'kralovna', x: .7 }], t: ['Ztuhne. Pak se zhroutí do tvého náručí a pláče tiše, jako by se bála, že ji někdo uslyší. Když odchází, nechá dveře pootevřené. Možná omylem.'], ch: [{ t: 'Čekat, až její kroky utichnou.', go: 'p_vrah_okno' }] },
    p_kn_lek: { bg: 'vez', npc: [{ id: 'kralovna', x: .7 }], t: ['Lahvička je ti v rukávu dřív, než si všimne. Když odejde, přičichneš: mák, hořký mandlový pach a pod tím něco sladkého a hnilobného. Ne lék. Obojek.'], enter: (G, A) => A.clue('lek', 'Královnin „lék na nervy“ od Viléma obsahuje mák a něco, co ji drží v mlze.'), ch: [{ t: 'Dál', go: 'p_vrah_okno' }] },
    p_kn_pochyba: { bg: 'vez', npc: [{ id: 'kralovna', x: .7 }], t: [S('kralovna', 'Vilém je jediný, kdo… kdo mě drží nad vodou.', 'shock'), 'Ale lahvičku položí na okno a odejde bez ní. To je víc, než jsi čekal{a}.'], enter: (G, A) => { A.set('kralovnaPochyba'); A.clue('lek', 'Královnin „lék na nervy“ od Viléma ji drží v mlze. Sama ho odložila.'); }, ch: [{ t: 'Dál', go: 'p_vrah_okno' }] },
    p_kn_nic: { bg: 'vez', npc: [{ id: 'kralovna', x: .7 }], t: [S('kralovna', 'Spi. Ráno bude líp. Ráno bude oheň a pak bude líp.', 'n'), 'Odejde. Zamkne.'], ch: [{ t: 'Dál', go: 'p_vrah_okno' }] },
    p_vrah_okno: { bg: 'vez', mood: 'tense', npc: [{ id: 'zoldak', x: .72 }], t: [
      'Hodinu po půlnoci se mříž v okně pohne. Někdo ji zvenku tiše vyšroubuje. Po laně se do věže spustí muž v černém. Nůž mezi zuby.',
      S('plachta', 'Hosti! A já nemám nic k jídlu. Teda kromě tebe, ty vole.', 'angry')
    ], ch: [{ t: 'Na něj!', tag: 'Útok', fight: { foes: [{ id: 'zoldak', name: 'Vrah v černém' }], win: 'p_vrah_mrtvy', lose: 'p_vrah_prohra' } }] },
    p_vrah_prohra: { bg: 'vez', npc: [], t: ['Nůž tě drápne po žebrech, ale Plachtička mu skočí do očí. Zařve, vypadne z okna a pod věží to mlaskne. Lano zůstalo viset.'], ch: [{ t: 'Po laně dolů.', go: 'p_hradby' }] },
    p_vrah_mrtvy: { bg: 'vez', npc: [{ id: 'zoldak', pose: 'dead', x: .72 }], t: [
      'Vrah leží na podlaze. U pasu má měšec. V něm stříbro a jeden zlatý peníz s vyraženým hadem – znakem kancléřského úřadu. Za takový peníz se kupují lidé, ne chleba.'
    ], enter: (G, A) => { A.gold(25); A.clue('dukat', 'Najatý vrah ve věži měl zlatý peníz s hadem – znak kancléřského úřadu.'); }, ch: [{ t: 'Po jeho laně dolů.', go: 'p_hradby' }] },

    p_hradby: { bg: 'hradby', mood: 'storm', npc: [], cp: 1, t: [
      'Hradby. Vítr ti rve vlasy, déšť bičuje tvář. Pod tebou leží Popelov – město střech, šibenic a lucerniček. Poprvé ho vidíš celé.',
      { t: 'Blesk. Na vteřinu je všechno bílé a ty vidíš, jak hluboko je to dolů.', flash: 1, snd: 'thunder' },
      S('plachta', 'Tak co, Výsosti? Skočíme, slezeme, nebo budeš dramaticky zírat do bouře?', 'n')
    ], ch: [
      { t: 'Skočit do hradního příkopu.', chk: { s: 'odl', dc: 12, ok: 'p_prikop', no: 'p_prikop_bolest' } },
      { t: 'Slézt po zdi.', chk: { s: 'obr', dc: 13, ok: 'p_mesto_prichod', no: 'p_prikop_bolest' } },
      { t: 'Nechat Plachtičku najít cestu.', go: 'p_skluz' }
    ] },
    p_prikop: { bg: 'ulice', npc: [], t: ['Ledová voda, bahno, mrtvá kočka. Vylezeš na druhém břehu, [[celý|celá]] páchnoucí, ale [[živý|živá]]. Svoboda smrdí.'], ch: [{ t: 'Do města.', go: 'p_mesto_prichod' }] },
    p_prikop_bolest: { bg: 'ulice', npc: [], t: ['Náraz ti vyrazí dech. Chvíli nevíš, kde je nahoře. Pak se vyškrábeš na dlažbu a kašleš bahno.'], enter: (G, A) => A.hurt(4), ch: [{ t: 'Do města.', go: 'p_mesto_prichod' }] },
    p_skluz: { bg: 'stoky', npc: [], t: [
      S('plachta', 'Tudy. Odpadní žlab z kuchyně. Jezdím po něm, když se chci napít z kanálu. Nesuď mě.', 'n'),
      'Klouzáš tmou, smradem a slupkami od brambor. Vyplivne tě to v podzemí, po kolena ve vodě. Odněkud se ozve pískání.'
    ], enter: (G, A) => A.set('vStokach'), ch: [{ t: 'Jít za pískáním.', go: 'stoky' }, { t: 'Najít cestu nahoru na ulici.', go: 'p_mesto_prichod' }] },
    p_kuchyne: { bg: 'ulice', npc: [], t: ['Kuchyňské dveře se otevřou do uličky za hradbami. Hedvičin klíč zůstane v zámku. Ať tam zrezne.'], enter: (G, A) => A.take('klic'), ch: [{ t: 'Do města.', go: 'p_mesto_prichod' }] }
  });
})(window.T);
