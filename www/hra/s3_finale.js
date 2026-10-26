/* Koruna z popela – Dějství III: popravčí den, kancléř, slza, koruna, konce. */
(function (T) {
  'use strict';
  const S = (w, t, m) => ({ w, t, m });
  const GUILT = ['hlas', 'pirko', 'prsten', 'lek', 'dukat', 'kniha', 'svedek', 'najemnik', 'rozkaz', 'najemnici', 'dopis', 'horany', 'odmena', 'radim', 'sabina', 'kralovnaMlha'];
  const guilt = A => GUILT.filter(c => A.hasClue(c)).length;
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
  const queenPoisoned = (G, A) => !(A.hasClue('lek') || A.has('kralovnaPochyba'));
  const romAlive = G => G.f.rom && G.f.mrtvy !== G.f.rom;
  const fn = id => T.C[id].name.split(' ')[0];
  const DAT = { ester: 'Ester', sarra: 'Sarře', vojta: 'Vojtovi', radim: 'Radimovi' }, INS = { ester: 'Ester', sarra: 'Sarrou', vojta: 'Vojtou', radim: 'Radimem' };

  Object.assign(T.N, {
    akt3: { act: 'Dějství III · Popravčí den', bg: 'hrad', mood: 'tense', npc: [], cp: 1, enter: (G, A) => A.levelUp(), t: (G, A) => [
      'Vranov na skále, rudé slunce za ním. Domů se vracíš jako [[cizinec|cizinka]].',
      'Na cestě potkáváte vozy plné lidí, co utíkají z města. Novinky letí rychleji než vrány: královna se zhroutila, kancléř Vilém je jmenován regentem „do králova uzdravení“. Král ještě dýchá. Pro teď.',
      'A zítra za úsvitu je popravčí den. Na Náměstí šibenic budou viset lidé s rohy a šupinami' + (A.has('sarraZajata') ? ', mezi nimi Sarra Popelavá' : '') + (A.has('esterZajata') ? ', a Ester z Lhoty za srnu' : '') + (A.has('uprchliciZajati') ? ', a uprchlíci ze lhotského mlýna' : '') + '.',
      S('plachta', 'Tak. Velkej den. Kdybych byla člověk, teď bych si nervózně kousala nehty. Takhle si koušu ocas. Není to ono.', 'n')
    ], ch: [{ t: 'Svolat poslední radu.', go: 'f3_rada' }] },
    f3_rada: { bg: 'tabor', mood: 'tense', npc: (G) => G.party.filter(c => c !== 'plachta' && c !== 'radim').map((c, i) => ({ id: c, x: .62 + i * .12 })), t: (G, A) => {
        const al = allies(G, A);
        return [
          'Noc před popravčím dnem. Oheň, mapa města vyškrábaná nožem do hlíny.',
          al.length ? 'Kdo stojí za tebou: ' + al.join(', ') + '.' : 'Za tebou nestojí nikdo než ti, co sedí u ohně. Spojence sis na cestě nenašel{a} – nebo jsi o ně přišel{a}.',
          `Důkazů proti kancléři: ${guilt(A)}.`,
          G.party.includes('radim') ? S('radim', 'Tři cesty. Udeřit na náměstí a pak na hrad. Proplížit se k králi dřív, než Vilém dokončí, co začal. Nebo přijít na popraviště otevřeně a žalovat ho před celým Popelovem. Každá má svou cenu.', 'n')
            : S('plachta', 'Tak co, generále? Rubat, plížit se, nebo kecat? Já hlasuju pro kecání, u toho se nejmíň umírá. Teda většinou.', 'n')
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
    f3_utok: { bg: 'sibenice', mood: 'fight', enter: (G, A) => A.rest(), npc: [{ id: 'kat', x: .55 }, { id: 'zoldak', x: .7 }, { id: 'fanatik', x: .84 }], t: (G, A) => {
        const al = allies(G, A);
        return [
          'Úsvit. Rudé slunce za šibenicemi. Na lešení stojí v řadě odsouzení se smyčkami kolem krku. Kat si plive do dlaní.',
          'Dav mlčí. Ten druh ticha, který se může zlomit oběma směry.',
          'Pak se to zlomí. ' + al.map(x => x[0].toUpperCase() + x.slice(1)).join('. ') + '. Najednou, ze všech stran, jako by to město čekalo dvacet let na jedno slovo.',
          G.f.kychal === 'pritel' ? { t: 'Hodíš šupinu do kotle s dehtem. Nad Popelovem se ozve kýchnutí, ze kterého se třesou okna. Kýchal přistane na střeše radnice a fanatici odhodí pochodně.', snd: 'rev', shake: 14 } : null,
          'Kat zvedá sekeru. Žoldáci kancléře se řadí kolem lešení.'
        ];
      }, fight: { foes: (G, A) => { const f = ['kat', 'zoldak', 'zoldak', 'fanatik', 'fanatik']; const cut = Math.min(3, 1 + allies(G, A).length); return f.slice(0, f.length - cut); }, intro: 'Popravčí den začíná. Jen jinak, než si to kancléř představoval.', win: 'f3_utok_vyhra', lose: 'konec_loutka_prohra', loseFx: (G, A) => A.set('prohralNamesti') } },
    f3_utok_vyhra: { bg: 'sibenice', npc: [{ id: 'kat', x: .6, pose: 'dead' }], t: (G, A) => [
      'Kat leží pod lešením na vlastní sekeře. Lidé řežou provazy. Odsouzení padají do náruče davu – živí.',
      A.has('sarraZajata') ? S('sarra', 'Dvakrát jsem měla smyčku na krku. Podruhé už to bylo skoro pohodlný. Kde je ten žlutej hajzl?', 'angry') : null,
      A.has('esterZajata') ? S('ester', 'Pověsit mě za srnu. Já jim dám srnu.', 'angry') : null,
      G.f.rom && G.party.includes(G.f.rom) ? { t: `${fn(G.f.rom)} se zapotácí. Pod žebry šíp z kuše, z hradeb. Krev, hodně krve. „To nic. To nic. Jdi.“`, shake: 6 } : null,
      'Na hradě zvoní poplach. Kancléř se zavřel v trůnním sále s královnou.'
    ], enter: (G, A) => { A.set('vezniZachraneni'); if (A.has('sarraZajata')) { A.join('sarra'); } if (A.has('esterZajata')) { A.join('ester'); } if (G.f.rom && G.party.includes(G.f.rom)) G.f.ranenRom = G.f.rom; A.done('sarra'); A.done('ester'); }, ch: [{ t: 'Na hrad!', go: 'f3_brana_hradu' }] },
    f3_brana_hradu: { bg: 'trunni', mood: 'tense', npc: [{ id: 'zoldak', x: .7 }, { id: 'zoldak', x: .86 }], t: ['Hradní brána padne pod náporem davu. Chodby, schody, gobelíny – tvůj domov, poprvé zvenku. Před trůnním sálem dva poslední žoldáci.'], ch: [{ t: 'Prorazit.', tag: 'Útok', fight: { foes: ['zoldak', 'zoldak'], win: 'f3_vilem', lose: 'konec_loutka_prohra' } }] },

    /* ---------- B: infiltrace ---------- */
    f3_infiltrace: { bg: 'stoky', mood: 'dark', npc: [], t: (G, A) => [
      A.item('mapa') ? 'Modrá čára na Šmudlově mapě. Stoky pod Popelovem, pak starý akvadukt, pak schody vytesané do skály. Pod hradem je tma tak hustá, že by se dala krájet.' : 'Radim vede tajnými chodbami pro stráže. Zná každou škvíru. Dvacet let tu chodil.',
      A.item('mapa') ? 'Na rozcestí se mapa dělí. Modrá vlevo. Černá vpravo – „tam nechoď“. Ale modrá je zasypaná.' : null
    ], ch: (G, A) => A.item('mapa') && G.f.radim !== 'spojenec' ? [
      { t: 'Najít jinou cestu po modré.', chk: { s: 'duv', dc: 12, ok: 'f3_sklepy', no: 'f3_ghul' } },
      { t: 'Riskovat černou.', go: 'f3_ghul' }
    ] : [{ t: 'Dál', go: 'f3_sklepy' }] },
    f3_ghul: { bg: 'stoky', mood: 'fight', npc: [{ id: 'ghul', x: .75 }, { id: 'ghul', x: .88 }], t: ['Černá chodba páchne mrtvolami. Z výklenků vylézají bledé, vychrtlé věci s očima jako zkažené žloutky. Tohle žere krysy. A teď má chuť na něco většího.'], ch: [{ t: 'Bojovat.', tag: 'Útok', fight: { foes: ['ghul', 'ghul'], win: 'f3_sklepy', lose: 'f3_ghul_prohra' } }] },
    f3_ghul_prohra: { bg: 'stoky', npc: [], t: ['Ghúlové tě vlečou do tmy. Pak se zastaví a zavětří – a utečou před něčím ještě horším. Před Plachtičkou s hořící slámou v tlamě.', S('plachta', 'NIKDO. NEŽERE. MOJEHO. ČLOVĚKA.', 'angry')], enter: (G, A) => { A.ap('plachta', 2); }, ch: [{ t: 'Dál', go: 'f3_sklepy' }] },
    f3_sklepy: { bg: 'loznice', mood: 'tense', npc: [], t: (G, A) => {
        const saved = A.has('drakSpojenec') && (G.f.sabina === 'obracena' || A.has('lhotaSpojenec') || A.has('krysySpojenec'));
        G.f.vezniOsud = saved ? 'vzpoura' : 'popraveni';
        return [
          'Vylezeš ze sklepa za gobelínem v královské ložnici. Venku za oknem zvony – začíná popravčí den.',
          saved ? 'Z náměstí se ozve řev. Ne jásot – boj. Dračí lid se zvedl sám a ostatní se přidali. Tvoje jméno křičí víc hrdel, než bys věřil{a}.' : 'Z náměstí se ozve buben. Pak ticho. Pak buben znovu. Víš, co to znamená, a nemůžeš nic dělat.',
          'Král leží v závěsech, šedý jako popel. U lůžka stojí kancléř Vilém se sklenicí v ruce. Královna sedí u okna s prázdným pohledem.'
        ];
      }, enter: (G, A) => { if (G.f.vezniOsud === 'vzpoura') A.set('vezniZachraneni'); }, ch: [{ t: 'Vystoupit ze stínu.', go: 'f3_vilem' }] },

    /* ---------- C: soud ---------- */
    f3_soud: { bg: 'sibenice', mood: 'tense', npc: [{ id: 'kat', x: .58 }, { id: 'vilem', x: .74 }, { id: 'kralovna', x: .86 }], t: (G, A) => [
      'Úsvit. Jdeš středem davu. Nikdo tě nezastaví – nikdo nevěří, že by to dědic opravdu udělal.',
      'Na tribuně stojí kancléř Vilém, regent. Vedle něj královna, bledá, s očima jako dvě vyhaslá okna.',
      S('vilem', 'Ach. Ztracený dědic. Přišel{a} ses podívat na popravu? Jak dojemné. Stráže –', 'smirk'),
      'Zvedneš hlas. Podle starého práva má každý ze královské krve nárok na veřejnou žalobu. Dav to ví. Dav miluje divadlo.',
      { t: `„Obviňuji kancléře Viléma z otrávení krále Bořivoje!“`, shake: 4 }
    ], ch: (G, A) => {
      const n = guilt(A); let dc = Math.max(8, 22 - 2 * n); if (G.f.radim === 'spojenec') dc -= 2; if (G.f.sabina === 'obracena') dc -= 3; dc = Math.max(6, dc);
      return [
        { t: `Předložit důkazy jeden po druhém. (důkazů: ${n})`, chk: { s: 'cha', dc, ok: 'f3_soud_ok', no: 'f3_soud_ne' } },
        { t: '[Radim] „Kapitán Kost, svědek!“', if: () => G.f.radim === 'spojenec', go: 'f3_soud_radim', once: true },
        { t: '[Sabina] Nechat promluvit inkvizitorku.', if: () => G.f.sabina === 'obracena', go: 'f3_soud_sabina', once: true }
      ];
    } },
    f3_soud_radim: { bg: 'sibenice', npc: [{ id: 'radim', x: .44 }, { id: 'vilem', x: .74 }, { id: 'kralovna', x: .86 }], t: [S('radim', 'Já, Radim Kost, kapitán hradní stráže, jsem z rozkazu kancléře vyzvedl u lékárníka Šimona lahvičku. Prý lék. Byla to Černá rosa. Donesl jsem ji do kuchyně. Jsem vinen. On víc.', 'n'), 'Dav zašumí. Stráže na tribuně se po sobě dívají.'], enter: (G, A) => A.clue('radim', 'Radim Kost veřejně vypověděl, že jed vyzvedl na kancléřův rozkaz.'), ch: [{ t: 'Dál', go: 'f3_soud' }] },
    f3_soud_sabina: { bg: 'sibenice', npc: [{ id: 'sabina', x: .44 }, { id: 'vilem', x: .74 }, { id: 'kralovna', x: .86 }], t: [S('sabina', 'Bratři! Hořany nespálil drak. Spálil je tenhle muž a my jsme mu dvacet let nosili pochodně. Bledý plamen se dnes obrací.', 'angry'), 'Polovina fanatiků sundá masky. Pod nimi jsou obyčejné, vyděšené tváře.'], ch: [{ t: 'Dál', go: 'f3_soud' }] },
    f3_soud_ok: { bg: 'sibenice', npc: [{ id: 'vilem', x: .74 }, { id: 'kralovna', x: .86 }], t: (G, A) => [
      'Mluvíš. Pírko v mrtvé dlani. Kniha. Učeň Kuba. Zlato s hadem. Dopis. Hořany. Každé slovo dopadá do davu jako kámen do studny.',
      (A.has('kralovnaPouto') || A.has('kralovnaPochyba') || A.hasClue('lek')) ? S('kralovna', 'Ten lék… Každý večer. A každé ráno jsem chtěla víc ohně. Viléme. Co jsi mi to dělal?', 'shock') : S('kralovna', 'Je to pravda, Viléme?', 'shock'),
      'Kancléř se poprvé přestane usmívat. Pak mávne rukou a z prstenu mu vyšlehne bledý plamen. Lešení vzplane. Dav se rozprchne. Vilém prchá do hradu a táhne královnu s sebou.',
      'Lidé ti pomáhají sundat odsouzené. Pak se dav otočí k hradu. Tentokrát tě následuje.'
    ], enter: (G, A) => { A.set('vezniZachraneni'); A.set('soudVyhran'); if (A.has('sarraZajata')) A.join('sarra'); if (A.has('esterZajata')) A.join('ester'); }, ch: [{ t: 'Za ním!', go: 'f3_vilem' }] },
    f3_soud_ne: { bg: 'sibenice', npc: [{ id: 'straz', x: .6 }, { id: 'vilem', x: .74 }, { id: 'kralovna', x: .86 }], t: [
      'Mluvíš, ale slova se rozbíjejí o ticho. Příliš málo důkazů, příliš mnoho strachu.',
      S('vilem', 'Smutné. Dědic je nemocný stejně jako král. Horečka. Bludy. Odveďte Výsost do věže. Pro {jeho|její} vlastní bezpečí.'.replace('{jeho|její}', '[[jeho|její]]'), 'smirk'),
      'Stráže se blíží. Dav se odvrací. Buben znovu začíná.'
    ], ch: [
      { t: 'Bojovat. Tady a teď.', tag: 'Útok', fight: { foes: ['straz', 'straz', 'zoldak'], intro: 'Vytrhneš se strážnému a tasíš.', win: 'f3_soud_boj_vyhra', lose: 'konec_loutka' } },
      { t: 'Vzdát se. Ještě není konec – v té věži jsi přežil{a} dvacet let.', go: 'konec_loutka' }
    ] },
    f3_soud_boj_vyhra: { bg: 'sibenice', npc: [], t: ['Stráže padnou. Dav, který se odvracel, se otočí zpátky. Kdo bojuje, ten má aspoň trochu pravdu – tak to v Popelově vždycky bylo.', 'Vilém zmizel v hradu.'], enter: (G, A) => { if (A.has('drakSpojenec')) A.set('vezniZachraneni'); }, ch: [{ t: 'Za ním.', go: 'f3_vilem' }] },

    /* ---------- kancléř ---------- */
    f3_vilem: { bg: (G, A) => A.has('soudVyhran') || A.has('vezniZachraneni') && !G.f.vezniOsud ? 'trunni' : 'loznice', mood: 'dark', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .8 }], cp: 1, t: (G, A) => [
      'Kancléř Vilém stojí u královny. Žlutá tvář, hadí prsten, úsměv úředníka, který právě zjistil, že mu sedí účty.',
      S('vilem', 'Hořany? Nutnost. Lidé a šupináči u jednoho stolu – to je recept na válku. Já jsem válku jen uspíšil. A vyhrál.', 'smirk'),
      S('vilem', 'Bořivoj byl měkký. Ty jsi [[měkký|měkká]]. Království nepotřebuje lásku, potřebuje někoho, kdo se nebojí špinavých rukou.', 'smirk'),
      queenPoisoned(G, A) ? S('vilem', 'A tvá drahá matka? Pije můj lék každý večer. Dnes ráno jsem do něj přidal Černou rosu. Dvojí smutek, jeden regent. Elegantní, ne?', 'smile') : S('vilem', 'Tvá matka už můj lék nepije. Škoda. Byla s ním tak poslušná.', 'n'),
      queenPoisoned(G, A) ? 'Královna se zakymácí. Na nehtech jí černají půlměsíčky.' : null
    ], enter: (G, A) => { if (queenPoisoned(G, A)) A.set('kralovnaOtravena'); }, ch: (G, A) => [
      { t: 'Konec řečí.', tag: 'Boj', go: 'f3_vilem_boj' },
      { t: '[Radim] „Stráže! Ve jménu krále – zatkněte kancléře.“', if: () => G.f.radim === 'spojenec' && G.party.includes('radim'), go: 'f3_vilem_zatceni' },
      { t: '[Šupina] Hodit dračí šupinu do krbu.', if: () => A.item('supina') && (G.f.kychal === 'pritel' || G.f.kychal === 'pomsta') && !A.has('kychalPrisel'), go: 'f3_kychal' },
      { t: '„Matko. Podívej se na mě. Ne na něj.“', if: () => A.has('kralovnaPouto') && !A.has('kralovnaSeObratila'), chk: { s: 'cha', dc: 11, ok: 'f3_kralovna_obrat', no: 'f3_vilem_boj' } }
    ] },
    f3_kralovna_obrat: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }, { id: 'vilem', x: .8 }], t: ['Královna se na tebe podívá. Mlha v očích se na vteřinu rozestoupí. Pak vytáhne z vlasů dlouhou zlatou jehlici a vrazí ji Vilémovi do ruky s prstenem.', { t: 'Kancléř zařve. Prsten mu sklouzne z prstu a kutálí se po podlaze.', shake: 8 }, S('kralovna', 'Dvacet let jsem se bála, že tě svět sežere. A on mi celou dobu seděl u stolu.', 'angry')], enter: (G, A) => { A.set('kralovnaSeObratila'); A.set('vilemOslaben'); }, ch: [{ t: 'Teď!', tag: 'Boj', go: 'f3_vilem_boj' }] },
    f3_vilem_zatceni: { bg: 'trunni', npc: [{ id: 'radim', x: .5 }, { id: 'vilem', x: .8 }], t: ['Strážní u dveří se podívají na Radima. Na kancléře. Na Radima. Pak skloní kopí – směrem ke kancléři.', S('vilem', 'Kapitáne. Dvacet let poslušnosti a tohle?', 'angry'), S('radim', 'Dvacet let. A dnes poprvé poslouchám správně.', 'n'), 'Vilém se zasměje a z prstenu vyšlehne bledý oheň.'], enter: (G, A) => A.set('vilemOslaben'), ch: [{ t: 'Na něj!', tag: 'Boj', go: 'f3_vilem_boj' }] },
    f3_vilem_boj: { bg: 'trunni', mood: 'fight', fight: { foes: (G, A) => { const v = { id: 'vilem', boss: true, hp: A.has('vilemOslaben') ? 48 : 66 }; const g = G.f.sabina === 'obracena' || A.has('vilemOslaben') ? [] : ['zoldak', 'zoldak']; return [v].concat(g); }, intro: 'Kancléř zvedne ruce. Kolem prstů mu tančí bledý plamen – ten, kterým pálil Hořany.', win: 'f3_vilem_padl', lose: 'konec_smrt' } },
    f3_kychal: { bg: 'trunni', mood: 'fire', npc: [{ id: 'kralovna', x: .58 }, { id: 'vilem', x: .76 }], t: (G) => [
      'Šupina vzplane v krbu modře. Vilém se zasměje: *„Kouzla z pohádek?“*',
      { t: 'Pak se zboří půlka stěny. Ve vichru, prachu a skle se do sálu protlačí dračí hlava.', snd: 'rev', shake: 18 },
      G.f.kychal === 'pomsta' ? S('kychal', 'Viléme. Hořany pozdravují.', 'roar') : S('kychal', 'Ty jsi ten, kdo zabil Žárovku. Pamatuju si tvůj pach. Žlutý strach.', 'n'),
      'Vilém zvedne prsten. Bledý plamen proti černému. Na vteřinu je to vyrovnané. Pak drak kýchne.',
      { t: 'Z kancléře zbyde jen žlutá skvrna na mramoru a roztavený prsten.', flash: 1, snd: 'kych' }
    ], enter: (G, A) => { A.set('kychalPrisel'); G.f.vilem = 'spalen'; }, ch: (G, A) => G.f.kychal === 'pomsta' ? [{ t: 'Dál', go: 'f3_pomsta' }] : [{ t: 'Dál', go: 'f3_slza' }] },
    f3_pomsta: { bg: 'popel', mood: 'fire', npc: [], t: ['Drak se vznese nad město. A pak začne Popelov hořet. Chrám první. Kasárna druhá. A pak už není první ani druhá – je jen oheň.', S('kychal', 'Slíbil{a} jsi mi pomstu, dítě. Tohle je pomsta. Celý Popelov postavený na Hořanech.', 'roar')], ch: (G, A) => [
      { t: '„Dost! Tohle nejsou Hořany. Tady žijí děti. Tady žije dračí lid!“', chk: { s: 'cha', dc: A.has('drakSpojenec') ? 12 : 16, ok: 'f3_pomsta_stop', no: 'konec_popel' } },
      { t: 'Nechat ho. Ať to všechno shoří.', go: 'konec_popel' }
    ] },
    f3_pomsta_stop: { bg: 'popel', npc: [], t: ['Drak se zastaví ve vzduchu. Dole ve Škváře stojí lidé s rohy a dívají se nahoru. Jeho lidé.', S('kychal', 'Moji… Ty děti dole mají rohy.', 'sad'), 'Starý drak přistane na troskách chrámu a pláče. Oheň zhasíná. Popelov ztratil čtvrtinu domů. Ne svou duši.'], enter: (G, A) => { G.f.kychal = 'pritel'; A.set('mestoPopaleno'); }, ch: [{ t: 'Dál', go: 'f3_slza' }] },
    f3_vilem_padl: { bg: 'trunni', npc: [{ id: 'vilem', x: .76, pose: 'kneel' }, { id: 'kralovna', x: .6 }], t: (G, A) => [
      'Kancléř klečí na mramoru. Prsten mu praskl, ruka je černá od vlastního plamene.',
      S('vilem', 'Tak. Dítě z popela. Co teď? Zabiješ mě a budeš jako já? Nebo mě necháš žít a já budu čekat, až uděláš chybu? Obojí je pro mě vítězství.', 'smirk'),
      A.has('kralovnaOtravena') ? 'Za tebou královna klesne na kolena. Černá rosa pracuje rychle.' : null
    ], ch: (G, A) => [
      { t: 'Zabít ho. Tady, na schodech trůnu.', tag: 'Zabít', go: 'f3_slza', fx: (G2, A2) => { G2.f.vilem = 'zabit'; A2.ap('sarra', 2); A2.ap('vojta', -1); A2.inc('temnota'); } },
      { t: '„Půjdeš před soud. Veřejně. Celý Popelov uslyší o Hořanech.“', go: 'f3_slza', fx: (G2, A2) => { G2.f.vilem = 'soud'; A2.ap('vojta', 2); A2.ap('radim', 2); A2.ap('ester', 1); } },
      { t: 'Vydat ho dračímu lidu. Ať rozhodnou Hořany.', if: () => A.has('drakSpojenec'), go: 'f3_slza', fx: (G2, A2) => { G2.f.vilem = 'drakum'; A2.ap('sarra', 3); A2.ap('radim', -1); } },
      { t: 'Vyhnat ho z království bez jména a bez peněz.', go: 'f3_slza', fx: (G2, A2) => { G2.f.vilem = 'vyhnan'; A2.ap('sarra', -2); A2.ap('ester', -1); } }
    ] },

    /* ---------- slza ---------- */
    f3_slza: { bg: 'loznice', mood: 'sad', npc: (G, A) => { const n = [{ id: 'kralovna', x: .62 }]; if (!A.has('otylieSnedena') && !A.has('trubkaPryc')) n.push({ id: 'trubka', x: .82 }, { id: 'otylie', x: .9 }); return n; }, t: (G, A) => {
        const out = ['Ticho. Jen kapky z rozbitého okna a chrčení umírajícího krále.', `Na krku ti visí lahvička. ${G.f.slza === 'krev' ? 'Dračí krev, černá a teplá.' : 'Jedna slza, horká a svítící.'} Stačí na jednoho.`];
        if (A.has('kralovnaOtravena')) out.push('Královna leží u lůžka. Dýchá mělce. Černá rosa, stejně jako u krále. Hodina, možná dvě.');
        if (G.f.ranenRom) out.push(`${fn(G.f.ranenRom)} sedí opřen${T.C[G.f.ranenRom].P.fem ? 'a' : ''} o sloup s šípem pod žebry. Krev už neteče, protože už moc nezbývá.`);
        if (!A.has('otylieSnedena')) out.push(S('trubka', 'Výsosti! Výsosti, promiňte, že ruším v tak dějinné chvíli! Otýlie! Prokletá hraběnka! Jedna slza by stačila! Jsem… jsem básník, nemám nic jiného!', 'shock'), { w: 'otylie', t: 'Sssss.', snd: 'husa' });
        return out;
      }, ch: (G, A) => [
        { t: 'Dát slzu králi Bořivojovi.', go: 'f3_slza_kral' },
        { t: 'Dát slzu matce.', if: () => A.has('kralovnaOtravena'), go: 'f3_slza_kralovna' },
        { t: `Dát slzu ${G.f.ranenRom ? DAT[G.f.ranenRom] : ''}.`, tag: '♥', if: () => !!G.f.ranenRom, go: 'f3_slza_rom' },
        { t: 'Dát slzu huse.', if: () => !A.has('otylieSnedena'), go: 'konec_otylie' },
        { t: 'Vypít ji sám/sama. Svět si zasloužil, co si udělal.'.replace('sám/sama', G.sex === 'f' ? 'sama' : 'sám'), if: () => G.f.slza === 'krev', go: 'f3_slza_ja' }
      ] },
    f3_slza_kral: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }], t: (G, A) => G.f.slza === 'krev' ? [
      'Nakapeš dračí krev králi mezi rty. Kašle. Pak se mu otevřou oči – a jsou žluté, s úzkou zornicí jako u hada.',
      S('kral', 'Vidím… vidím všechno. Všechny, kdo mě zradili. Všechny. Spalte je.', 'angry'),
      'Král žije. Ale není to Bořivoj, který tě nesl z popela.'
    ] : [
      'Nakapeš slzu králi mezi rty. Chvíli nic. Pak se mu černé nehty začnou rozjasňovat, od kořene, jako když svítá.',
      S('kral', '{name}? Ty… ty jsi to zvládl{a}. Vždycky jsem věděl, že jsi z nás nejsilnější.', 'smile')
    ], enter: (G, A) => { G.f.kralZije = G.f.slza === 'krev' ? 'krev' : 'ano'; if (A.has('kralovnaOtravena')) G.f.kralovnaMrtva = 1; if (G.f.ranenRom) G.f.mrtvy = G.f.ranenRom; }, ch: (G, A) => [
      A.has('kralovnaOtravena') ? { t: 'Královna…', go: 'f3_kralovna_umira' } : { t: 'Dál', go: 'f3_koruna' }
    ] },
    f3_kralovna_umira: { bg: 'loznice', mood: 'sad', npc: [{ id: 'kralovna', x: .62 }], t: [S('kralovna', 'Neplač. Konečně jsi venku. To jsem pro tebe chtěla celou dobu, jen jsem… jen jsem nevěděla jak.', 'sad'), 'Usne. Tentokrát bez mlhy.'], ch: [{ t: 'Dál', go: 'f3_koruna' }] },
    f3_slza_kralovna: { bg: 'loznice', npc: [{ id: 'kralovna', x: .62 }], t: (G) => [
      G.f.slza === 'krev' ? 'Dračí krev projede královnou jako blesk. Prohne se, zakřičí – a vstane. Oči má jasné. Příliš jasné.' : 'Slza se vpije do královniných rtů. Černé půlměsíce na nehtech blednou. Otevře oči – a poprvé za dvacet let jsou čisté, bez mlhy.',
      'Za vámi král Bořivoj vydechne naposledy. Tiše, jako by nechtěl rušit.',
      S('kralovna', 'Ty jsi… vybral{a} mě? Mě? Po tom všem, co jsem ti udělala?', 'shock')
    ], enter: (G, A) => { G.f.kralZije = 'ne'; G.f.kralovnaZachranena = 1; if (G.f.ranenRom) G.f.mrtvy = G.f.ranenRom; }, ch: [{ t: '„Jsi moje matka.“', go: 'f3_koruna' }] },
    f3_slza_rom: { bg: 'loznice', npc: [], t: (G) => [
      `Nalomíš lahvičku nad ${INS[G.f.ranenRom]}. Rána se začne zavírat. Dech se vrátí – hluboký, bolavý, živý.`,
      'Za tebou umírá král. Nemůžeš se otočit. Nechceš vidět, jestli se na tebe dívá.',
      S(G.f.ranenRom, 'Tys mě… vybral{a} mě? Místo krále? Ty jsi blázen. Ty jsi úplnej blázen.', 'shock')
    ], enter: (G, A) => { G.f.kralZije = 'ne'; G.f.romZachranen = 1; if (A.has('kralovnaOtravena')) G.f.kralovnaMrtva = 1; A.ap(G.f.ranenRom, 5); }, ch: [{ t: 'Dál', go: 'f3_koruna' }] },
    f3_slza_ja: { bg: 'loznice', npc: [], t: ['Vypiješ dračí krev. Pálí. Svět zrudne, zostří se, zpomalí. Slyšíš srdce všech v sále. Víš, které je slabé.', 'Král za tebou umírá. Je ti to jedno. To je to nejhorší – je ti to jedno.'], enter: (G, A) => { G.f.kralZije = 'ne'; A.inc('temnota', 3); if (A.has('kralovnaOtravena')) G.f.kralovnaMrtva = 1; if (G.f.ranenRom) G.f.mrtvy = G.f.ranenRom; }, ch: [{ t: 'Vstát.', go: 'konec_zelezo' }] },

    /* ---------- koruna ---------- */
    f3_koruna: { bg: 'trunni', mood: 'sad', npc: (G) => G.f.kralZije === 'ano' ? [{ id: 'kral', x: .7 }] : [], t: (G, A) => [
      'Trůnní sál. Rozbitá okna, sklo, krev. Na schodech trůnu leží koruna, kterou někdo upustil v boji.',
      G.f.kralZije === 'ano' ? S('kral', 'Jsem starý, {name}. Slza mi dala život, ne sílu. Vranov potřebuje tebe. Vezmi ji – nebo mi řekni, co místo ní.', 'n') : G.f.kralZije === 'krev' ? 'Král s hadíma očima sedí na trůnu a diktuje seznamy jmen. Dívá se na tebe, jako by čekal, jestli budeš první na seznamu, nebo ten, kdo ho píše.' : 'Král je mrtvý. Koruna nemá hlavu.',
      romAlive(G) ? `${fn(G.f.rom)} stojí u dveří. Neřekne nic, ale v očích má otázku.` : null
    ], ch: (G, A) => [
      { t: '„Vezmu ji. A s ní slib: stejné právo pro každou krev.“', if: () => G.f.kralZije !== 'krev', go: (G2, A2) => (G2.f.temnota || 0) >= 6 ? 'konec_zelezo' : (G2.f.kralZije === 'ano' ? 'konec_kral' : 'konec_popel_koruna') },
      { t: '„Vezmu ji. A Popelov se mě bude bát. Už nikdy nikdo nepřijde v noci s nožem.“', go: 'konec_zelezo' },
      { t: '„Koruna nikomu. Rada: lidé, dračí lid, Lhota, krysy. Ať vládnou všichni.“', if: () => A.has('drakSpojenec') || A.has('lhotaSpojenec'), go: 'konec_rada' },
      { t: `Vzít ${romAlive(G) ? fn(G.f.rom) : ''} za ruku a odejít. Nechte si svůj trůn.`, tag: '♥', if: () => romAlive(G), go: 'konec_pryc' },
      { t: 'Postavit se k oknu a podívat se dolů na Popelov.', if: () => !A.has('oknoVidel'), go: 'f3_okno' }
    ] },
    f3_okno: { bg: 'hradby', npc: [], t: (G, A) => [
      'Pod tebou Popelov. ' + (A.has('mestoPopaleno') ? 'Čtvrtina střech je černá, ale z komínů se kouří.' : 'Kouří se z komínů, ne ze střech.'),
      A.has('vezniZachraneni') ? 'Na Náměstí šibenic lidé rozebírají lešení na otop. Někdo se směje.' : 'Na Náměstí šibenic se pod lešením houpe řada těl. Nikdo je ještě nesundal.',
      S('plachta', 'Hezký, ne? Teda, smrdí to tu pořád. Ale hezky.', 'n')
    ], enter: (G, A) => A.set('oknoVidel'), ch: [{ t: 'Vrátit se k trůnu.', go: 'f3_koruna' }] },

    /* ---------- konce ---------- */
    konec_kral: { end: { n: 1, title: 'KRÁLŮV | NÁVRAT', text: ['Král Bořivoj žil ještě sedm let. Nebyl to dlouhý čas, ale stačil na to, aby podepsal edikt o rovném právu krve a aby tě viděl korunovat.', 'Dědic z věže se stal panovníkem, který nezamyká dveře. Popelov tě nemiloval – Popelov nemiluje nikoho. Ale přestal se bát.'], epi: (G, A) => T.epilog(G, A) } },
    konec_popel_koruna: { end: { n: 2, title: 'KORUNA | Z POPELA', text: ['Korunovali tě v kapli s rozbitými okny, protože na nová nebyly peníze. Koruna byla lehká. Prý proto, že je z toho, co zbylo.', 'Vranov má [[krále|královnu]] z popela Hořan. První zákon, který podepíšeš, zakazuje slovo „šupináč“. Druhý ruší dračí daň. Třetí dává Hedvice hrob v královské kapli.'], epi: (G, A) => T.epilog(G, A) } },
    konec_zelezo: { end: { n: 3, title: 'ŽELEZNÁ | KORUNA', text: (G) => [
      G.f.kralZije === 'krev' ? 'Král s hadíma očima vládne a ty jsi jeho železná ruka. Seznamy jmen se zkracují. Popelov je čistý. Tichý. Vystrašený.' : 'Vládneš. Nikdo už nepřijde v noci s nožem, protože všichni, kdo by mohli, už visí.',
      'Říká se, že ve Vranově je pořádek. Říká se to šeptem. Ve věži, kde jsi dvacet let počítal{a} čárky na zdi, teď sedí jiní a počítají za tebe.',
      'Kancléř Vilém by na tebe byl hrdý. To je to nejhorší, co se o tobě dá říct.'
    ], epi: (G, A) => T.epilog(G, A) } },
    konec_popel: { end: { n: 4, title: 'PO | PEL', text: ['Kýchal pálil tři dny. Pak odletěl na sever a už se nevrátil.', 'Z Popelova zbyly kamenné zdi, šibenice a jméno, které konečně sedí. Ty jsi přežil{a}. Chodíš po spáleništi a hledáš něco, co by se dalo nazvat královstvím.', 'Nenajdeš. Ale vrány tě znají jménem.'], epi: (G, A) => T.epilog(G, A) } },
    konec_pryc: { end: { n: 5, title: 'CESTA | PRYČ', text: (G) => [
      `Odešli jste za úsvitu, ty a ${fn(G.f.rom)}. Bez koruny, bez družiny, s jedním koněm a veverkou, která protestovala celou cestu.`,
      'Vranov si našel jiného vládce – nebo jiné vládce. Někdy o nich slyšíte v hospodách na jihu. Nikdy se nevracíte.',
      'Dvacet let jsi viděl{a} svět z okna věže. Teď ho vidíš celý, a vedle tebe někdo, kdo se dívá taky.'
    ], epi: (G, A) => T.epilog(G, A) } },
    konec_loutka: { end: { n: 6, title: 'LOUT | KA', text: ['Věž. Čárky na zdi. Sedm tisíc tři sta dní a pak dalších pár.', 'Kancléř Vilém vládne jako regent „do uzdravení dědice“. Dědic se neuzdravuje. Každý večer dostává lék na nervy. Po něm se mu zdá, že hoří.', 'Občas tě vyvedou na balkon a ty máváš davu. Lidé mávají zpátky. Nikdo neví, že pláčeš.'], epi: (G, A) => T.epilog(G, A) } },
    konec_loutka_prohra: { redirect: () => 'konec_loutka' },
    konec_rada: { end: { n: 7, title: 'RUDÝ | ÚSVIT', text: ['Korunu jste roztavili na náměstí, kde stála šibenice. Ze zlata se razily mince s dvěma tvářemi: lidskou a dračí.', 'Rada Popelova se hádá od rána do večera. Krysy, sedláci, kováři s rohy, kněží bez masek. Je to chaos. Je to hluk. Nikdo při tom nevisí.', 'Tebe zvolili předsedou. Hlasovalo pro tebe i pár krys. Jedna veverka se zdržela.'], epi: (G, A) => T.epilog(G, A) } },
    konec_otylie: { end: { n: 8, title: 'HRABĚNKA | OTÝLIE', text: ['Slza dopadne huse na zobák. Chvíli nic. Pak výbuch peří – a na mramoru stojí nahá, velmi rozzlobená žena středních let.', 'Hraběnka Otýlie z Hrbu. Sestřenice krále Bořivoje. Podle zákona o nástupnictví – jediná legitimní dědička krve. Ty jsi nalezenec.', 'Její první královský čin: zatknout Bohuslava Trubku za „dvacet let ponižování, kokrhání a nucení k procházkám“. Druhý: prohlásit tě dvorním šaškem. Král mezitím umřel. Nikdo si toho nevšiml.', 'Plachtička se smála tři dny v kuse. Pak dostala škytavku. Pak se smála dál.'], epi: (G, A) => T.epilog(G, A, 'otylie') } },
    konec_smrt: { end: { n: 9, title: 'POSLEDNÍ | OHEŇ', text: (G) => ['Bledý plamen tě zasáhne do hrudi. Padáš na schody trůnu a mramor je studený, studenější než věž.', 'Ale to, co jsi začal{a}, už nejde zastavit. Popelov se zvedl. Kancléř neuteče – lidé ho dostihnou na hradbách a nebude to hezké.', G.f.rom ? `${fn(G.f.rom)} tě drží v náručí až do konce. Je to dobrý konec. Lepší než věž.` : 'Plachtička ti sedí na prsou a kleje. Klení je to poslední, co slyšíš. Je to krásné klení.'], epi: (G, A) => T.epilog(G, A, 'smrt') } },
    konec_slepa: { end: { n: 0, title: 'KONEC | CESTY', text: ['Tady příběh končí dřív, než měl. Zkus to jinak.'] } }
  });

  /* Epilogue lines for everybody you met. */
  T.epilog = function (G, A, kind) {
    const out = [], f = G.f, saved = A.has('vezniZachraneni');
    const kralovna = f.kralovnaMrtva ? 'Královna Morana zemřela na Černou rosu. Pohřbili ji vedle tří malých hrobů, o kterých nikdo nevěděl.' : f.kralovnaZachranena ? 'Královna Morana žije. Odešla do kláštera v horách a každý týden ti píše dopis. Nikdy v nich neříká „zůstaň doma“.' : A.has('kralovnaSeObratila') || A.has('kralovnaPouto') ? 'Královna Morana bez Vilémova „léku“ prospala tři dny. Pak poprvé za dvacet let otevřela okna věže dokořán.' : 'Královna Morana se z mlhy nikdy úplně neprobrala. Ale v dobrých dnech poznává tvůj hlas.';
    if (kind !== 'otylie') out.push(kralovna);
    if (A.has('esterPotkana')) out.push(f.mrtvy === 'ester' ? 'Ester zemřela na šíp z hradeb. V Lhotě jí postavili kříž z jejích vlastních šípů.' : A.has('esterZajata') && !saved ? 'Ester visela na Náměstí šibenic za srnu. Bohouš od té doby nemluví.' : f.rom === 'ester' ? 'Ester zůstala po tvém boku a dál pytlačí – teď v královských lesích, legálně, což ji strašně nebaví.' : (G.ap.ester || 0) >= 2 ? 'Ester se stala rychtářkou Lhoty. První, co udělala, bylo strhnout šibenici na návsi.' : 'Ester se vrátila do Lhoty a tvoje jméno nikdy nevyslovila.');
    if (A.has('vojtaByl') && G.ap.vojta != null) out.push(f.mrtvy === 'vojta' ? 'Vojta zemřel s úsměvem. Prý poprvé za dvacet let neviděl Hořany, když zavřel oči.' : f.rom === 'vojta' ? 'Vojta konečně spí. Vedle tebe. Chrápe jako medvěd a ty to nikomu neříkáš.' : 'Vojta se vrátil do lesa. Na místě Hořan vysázel tisíc buků. Rostou rovně.');
    if (A.has('byl_skvara') || A.has('sarraZajata')) out.push(f.mrtvy === 'sarra' ? 'Sarra zemřela s kladivem v ruce. Ve Škváře se po ní jmenuje první kovárna, kde smí dračí lid kovat meče.' : A.has('sarraZajata') && !saved ? 'Sarra Popelavá visela na Náměstí šibenic. Na jejím hrobě dračí děti zapalují každý rok malé ohně.' : (G.ap.sarra || 0) <= -5 ? 'Sarra Popelavá vede Škváru. Když jedeš kolem, zavírá okenice.' : f.rom === 'sarra' ? 'Sarra je tvou chotí. Na korunovaci si nechala vykovat korunu s otvory pro rohy.' : 'Sarra Popelavá vede Škváru. Její neteř nosí meč a nikdo jí neřekne šupinačko – aspoň ne dvakrát.');
    if (f.radim) out.push(f.radim === 'mrtvy' ? 'Kapitána Radima Kosta pohřbili bez poct. Nikdo nevěděl, že nakonec chtěl stát na správné straně.' : f.mrtvy === 'radim' ? 'Radim Kost padl na schodech trůnu. Pohřbili ho s mečem i s odznakem – oba si zasloužil.' : f.rom === 'radim' ? 'Radim Kost odložil meč a velí teď jen jednomu člověku. Tobě. Prý je to náročnější než celá posádka.' : 'Radim Kost se přiznal a odsloužil si rok v kobce, kterou dřív hlídal. Pak se vrátil do služby. Jako strážce, ne jako kat.');
    if (f.sabina) out.push(f.sabina === 'obracena' ? 'Sabina přejmenovala Řád Bledého plamene na Řád Popela. Jeho rytíři teď hasí požáry místo zakládání.' : f.sabina === 'mrtva' ? 'Sabina zemřela v kryptě a Řád se bez ní rozpadl do sekt, které se hádají, kdo je víc čistý.' : 'Sabina putuje po zemi jako žebračka. Prý hledá Hořany. Nikdo jí neřekne, že tam nic není.');
    if (f.kychal) out.push(f.kychal === 'mrtvy' ? 'Kosti posledního draka leží ve zřícenině. Děti tam chodí na stezky odvahy.' : A.has('mlade') ? 'Kýchal žije ve zřícenině s malou dračicí, která kýchá ještě hůř než on. Pojmenoval ji Hedvika.' : f.kychal === 'zklaman' ? 'Kýchal odletěl na sever. Někdy, za jasných nocí, je vidět oheň nad horami.' : 'Kýchal sedává na střeše radnice a prodává dětem projížďky za sýr.');
    if (A.has('smudlaMrtvy')) out.push('Krysy si po Šmudlovi zvolily novou královnu. Je mnohem chytřejší a mnohem zlejší.'); else if (A.has('krysiSlib')) out.push('Krysí král Šmudla dostal křeslo v radě. Na zasedání nosí monokl a vždycky hlasuje pro sýr.');
    if (kind === 'otylie') out.push('Bohuslav Trubka sepsal ve vězení eposem „Husa a já“. Prodává se lépe než Bible.');
    else if (!A.has('otylieSnedena') && A.has('esterPotkana')) out.push('Bohuslav Trubka dál zpívá U Oběšence. Otýlie dál syčí. Jsou šťastní, jak to jen jde.');
    else if (A.has('otylieSnedena')) out.push('Bohuslav Trubka dodnes hledá svou choť po celém Popelově. Šmudla mu pokaždé soucitně kývne.');
    out.push(kind === 'smrt' ? 'Plachtička vypila na tvém pohřbu celý sud medoviny a pak pronesla nejsprostší a nejkrásnější řeč, jakou kdy Vranov slyšel.' : (G.ap.plachta || 0) <= -3 ? 'Plachtička jednou v noci zmizela. Na polštáři ti nechala ořech. Jen jeden.' : 'Plachtička se stala dvorní kronikářkou. Kroniky jsou plné sprostých slov a nepravdy. Lidé je milují.');
    return out;
  };
})(window.T);
