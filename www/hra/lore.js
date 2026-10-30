/* Koruna z popela – Kronika: co se hráč dozví o světě. Kapitoly se odemykají
   během hry (ve scénách přes lore: [...] nebo A.lore('id')).

   Každá kapitola vypadá takhle:
     id: { cat: 'Dějiny', title: 'Nadpis', text: 'Text...' }
       id     jméno kapitoly, odkazují se na něj scény. NEMĚNIT.
       cat    oddíl Kroniky: Dějiny, Místa, Národy, nebo Lidé
       title  nadpis kapitoly (můžeš přepsat)
       text   text kapitoly (můžeš přepsat). \n\n uvnitř textu = nový odstavec.
   Pozor: texty jsou v apostrofech '...', uvnitř proto nepiš apostrof. */
(function (T) {
  'use strict';
  T.LORE = {
    /* ---------- Dějiny ---------- */
    smlouva: { cat: 'Dějiny', title: 'Smlouva pod Havraní skálou', text:
      'Před třemi sty lety, když údolí řeky Smolné bylo ještě divočinou bažin a vlčích stezek, přišel k Havraní skále náčelník jménem Vran Jednooký. Nebyl to nejmoudřejší z lidí, ale byl první, kdo dokázal mlčet dost dlouho, aby ho draci vyslechli.\n\n' +
      'Na skále uzavřel s draky Žárových hor smlouvu: draci budou vládnout horám a nebi, lidé údolí a řece. A mezi nimi budou stát ti, kdo se dobrovolně napijí dračí krve a ponesou v sobě oheň obou světů – dračí lid. Měli být kováři, tlumočníci a strážci míru.\n\n' +
      'Tři sta let ta smlouva platila. Údolí zbohatlo na žárové oceli, kterou dračí lid kul v dračím ohni a jež se neohne ani nezrezne. Pak přišla jedna noc a smlouva shořela spolu s ní.' },
    valka: { cat: 'Dějiny', title: 'Dračí válka', text:
      'Před dvaceti lety, v noci, které se dnes říká Noc dlouhých plamenů, vzplálo město Žárov, kovárna celého království. Ráno z něj zbyl popel a zuhelnatělé trámy. Kdo ten oheň založil, se nikdy nevyšetřilo. Nikdo to vyšetřit nepotřeboval: všichni přece viděli nad střechami křídla.\n\n' +
      'Král Bořivoj vytáhl proti drakům a Řád Bledého plamene, do té doby hrstka poustevníků z hor, mu dal zbraň, jakou svět neznal – bílý oheň, který spaluje i dračí žár. Válka trvala tři roky. Skončila u vsi Hořany, kterou vojsko vypálilo do posledního domu, a výnosem, že draci jsou vyhubeni.\n\n' +
      'Kroniky kancléřského úřadu o válce mluví jako o vítězství. Písně, které se zpívají ve Škváře, o ní mluví jinak. A písně se, na rozdíl od kronik, nedají spálit.' },
    horany: { cat: 'Dějiny', title: 'Hořany', text:
      'Hořany bývaly ves pod Černým lesem, kde lidé, dračí lid, trpaslíci i půlelfové jedli u jednoho stolu a ženili se, jak jim srdce velelo. Říkalo se, že nad hořanským mlýnem někdy krouží drak a že mlynář mu dává pytel mouky ročně, „aby se neřeklo“.\n\n' +
      'V posledním roce války vojsko Hořany obklíčilo a zapálilo. Úřední zpráva hovoří o „hnízdu dračích zrádců“. Nikdo z Hořan už nežije, aby jí odporoval. Nikdo kromě jednoho dítěte, které král Bořivoj vynesl z popela ve svém plášti.' },
    rosa: { cat: 'Dějiny', title: 'Černá rosa', text:
      'Černá rosa je jed z vysokých hor, kde roste mezi kamením drobná černá tráva. Za úsvitu se na ní srážejí kapky, které otráví vlka, medvěda i krále. Kdo ji vypije, tomu zčernají nehty, pak rty, pak srdce. Sedm dní, nanejvýš osm.\n\n' +
      'Staré lékařské knihy znají jediný lék: dračí slzu. Lékaři Řádu ten zápis z knih pečlivě vyškrtali. Draci jsou přece mrtví, a co je mrtvé, nemá co plakat.' },
    /* ---------- Místa ---------- */
    vranov: { cat: 'Místa', title: 'Království Vranov', text:
      'Vranov je úzké a dlouhé království v údolí řeky Smolné. Na severu se zvedají Žárové hory, na západě se táhne Černý les a na jihu se řeka ztrácí v bažinách, o kterých se nemluví. Jmenuje se podle havranů, kteří od nepaměti hnízdí na skále nad řekou, a podle rodu Vranovců, který na té skále vládne.\n\n' +
      'Je to země zámožná, ale unavená. Dvacet let po válce tu lidé žijí v míru, jakému se v jiných zemích říká jinak: v míru, kde se nic neříká nahlas. Na každém náměstí stojí šibenice a na každé šibenici sedí havran a čeká.' },
    hrad: { cat: 'Místa', title: 'Hrad Vranov', text:
      'Hrad Vranov stojí na Havraní skále tam, kde Vran Jednooký uzavřel smlouvu s draky. Je postaven z tmavého kamene, který v dešti zčerná docela, a má sedm věží. Šest z nich slouží k obraně. Sedmá, štíhlá a bez schodů ven, slouží dvacet let k jedinému účelu: aby v ní [[byl zamčen dědic|byla zamčena dědička]].\n\n' +
      'Služebnictvo jí říká Holubník. Královna jí říká Bezpečí. Ty jsi jí nikdy neřekl{a} jinak než „tady“.' },
    popelov: { cat: 'Místa', title: 'Popelov', text:
      'Úředně se město pod hradem dodnes jmenuje Žárov. Kancléřský úřad trvá na tom jménu ve všech listinách a nikdo jiný ho nepoužívá. Když po Noci dlouhých plamenů vyrostlo nové město na popelu starého, lidé mu začali říkat Popelov, a lidé mají ve věcech jmen vždycky poslední slovo.\n\n' +
      'Popelov je město střech, šibenic a lucerniček, kde se ve sklepích pálí kořalka a nad nimi se káže střídmost. Na kopci nad ním stojí chrám Řádu, pod ním bují stoky a krysí národ, a na jeho okraji, za železnými vraty, leží Škvára.' },
    skvara: { cat: 'Místa', title: 'Škvára', text:
      'Škvára je čtvrť na východním okraji Popelova, postavená ze zbytků vyhořelých kováren. Po válce do ní Řád nahnal všechen dračí lid, který přežil, a obehnal ji zdí s železnými vraty, jež se na noc zamykají zvenčí.\n\n' +
      'Kovárny tu dodnes kouří. Dračí lid kuje podkovy, hřebíky a pluhy, protože žárovou ocel kovat nesmí, a platí z toho dračí daň. Kdo ze Škváry vyjde bez železné známky na krku, toho stráž smí zabít a nikdo se ho neptá proč.' },
    lhota: { cat: 'Místa', title: 'Lhota', text:
      'Lhota je velká ves dva dny cesty po proudu Smolné, obilnice celého údolí. Má statek, mlýn, kovárnu, kapličku a biřice, který jezdí vybírat dračí daň i od těch, kdo dračí lid v životě neviděli. „Daň je daň,“ říká biřic, „a draci jsou všude, když se pořádně podíváte.“\n\n' +
      'Za Lhotou začíná Černý les a nad lesem stojí zřícenina, které se v kraji říká Dračí hrádek. Lhotští tam nechodí. Lhotští mají rádi svoje nohy tam, kde jsou.' },
    cernyles: { cat: 'Místa', title: 'Černý les', text:
      'Černý les je starší než Vranov, starší než smlouva a možná starší než hory. Kdysi v něm žili elfové, dokud jednoho dne neodešli někam, kam lidé nedojdou, a nezanechali po sobě nic než půlelfy a písně, kterým nikdo nerozumí.\n\n' +
      'Dnes v něm žijí vlci, uhlíři, kteří se nesmějí, a Vědma, o které se říká, že je slepá a vidí všechno. Cesty v Černém lese mají ve zvyku vést jinam, než vedly včera.' },
    hradek: { cat: 'Místa', title: 'Dračí hrádek', text:
      'Na skalním ostrohu nad Černým lesem stojí zřícenina strážní věže, kde se za dob smlouvy scházeli draci s lidmi. Hrádek střežili Rytíři smlouvy, kteří přísahali, že ochrání mír i za cenu vlastního života. Když přišla válka, zůstali věrni přísaze a za to je pohřbili v kryptě pod hrádkem bez obřadu.\n\n' +
      'Pocestní tvrdí, že tam v noci svítí. Pocestní tvrdí spoustu věcí. Tahle je pravda.' },
    /* ---------- Národy ---------- */
    dracilid: { cat: 'Národy', title: 'Dračí lid', text:
      'Potomci těch, kdo se za dob smlouvy napili dračí krve. Mají rohy, šupiny na krku a lících a oči, ve kterých doutná žhavý uhlík. Žijí déle než lidé, hůř snášejí zimu a umějí kovat v ohni, který by lidskému kováři roztavil kladivo v ruce.\n\n' +
      'Po válce je Řád prohlásil za „krev zrady“. Dnes žijí ve Škváře a lidé jim říkají šupináči. Oni sami si říkají Žárovci, po městě, které jim kdysi patřilo a které jim údajně spálili jejich vlastní draci.' },
    rad: { cat: 'Národy', title: 'Řád Bledého plamene', text:
      'Řád vznikl jako bratrstvo poustevníků v Žárových horách, kteří uctívali oheň, jenž nehřeje. Ve válce dal králi bílý plamen a s ním vítězství. Za odměnu dostal chrám na kopci nad Popelovem, desátek z dračí daně a právo soudit „otázky krve“.\n\n' +
      'Rytíři Řádu nosí bílá roucha a bílé masky, aby jejich tváře nebyly vidět, když konají spravedlnost. Inkvizitoři nosí bílá pírka. Velmistr sídlí v horách a do Popelova nejezdí. Řád v Popelově vede ten, kdo platí jeho účty, a to je v posledních letech kancléř.' },
    krysaci: { cat: 'Národy', title: 'Krysí národ', text:
      'Ve stokách pod Popelovem žije národ, který lidé nepočítají, protože by ho museli počítat dlouho. Krysáci jsou malí, chlupatí, chytří a mají monarchii, ústavu, celní úřad a nejlepší zpravodajskou službu v království.\n\n' +
      'Obchodují se vším, co lidé ztratí, zahodí nebo spláchnou, a lidé toho spláchnou překvapivě hodně, včetně tajemství.† Vládne jim Krysí král, který je volen doživotně, což u krys znamená zhruba pět let.\n\n' +
      '† Nejcennějším zbožím ve stokách nejsou prsteny ani mince, ale dopisy. Lidé mají zvláštní přesvědčení, že co spláchnou, to přestane existovat. Krysáci je z toho přesvědčení vyvádět nehodlají.' },
    trpaslici: { cat: 'Národy', title: 'Trpaslíci z Popelova', text:
      'Trpaslíci přišli do Vranova z hor za stříbrem a zůstali kvůli úrokům. Drží v Popelově cech zvonařů, cech mincířů a banku U Kladiva, které dluží koruna víc, než by se slušelo říct nahlas.\n\n' +
      'Ve válce se nepřidali na žádnou stranu, což jim lidé dodnes vyčítají a dračí lid dodnes odpouští. Trpaslík vás nikdy neoklame. Jen vám přesně a nahlas přečte, co jste podepsali.' },
    pulelfove: { cat: 'Národy', title: 'Půlelfové', text:
      'Když elfové opustili Černý les, zůstaly po nich děti, které měly matky nebo otce z lidí. Půlelfové žijí po vesnicích a městech, slyší lépe než lidé, stárnou pomaleji a ve vlhkém počasí jim zpívá v uších les.\n\n' +
      'Lidé jim nedůvěřují, protože vypadají, jako by věděli víc, než říkají. Většinou to tak opravdu je.' },
    draci: { cat: 'Národy', title: 'Draci', text:
      'Draci Žárových hor byli staří, pomalí a hrozně trpěliví. Mluvili málo, ale když mluvili, hory poslouchaly. Neměli rádi lidská města, protože v nich bylo moc hluku, a měli rádi lidský sýr, protože v horách žádný nebyl.\n\n' +
      'Výnos z posledního roku války prohlásil draky za vyhubené. Výnos je opatřen pečetí, podpisem kancléře a otiskem palce svědka, který při slavnostním čtení omdlel. Draci sami se k němu nevyjádřili.' },
    /* ---------- Lidé ---------- */
    kral: { cat: 'Lidé', title: 'Král Bořivoj III.', text:
      'Poslední z rodu Vranovců. Ve válce vedl vojsko a vyhrál ji, a od té doby se mu nikdy nepodařilo usmát se tak, aby tomu někdo věřil. Říká se, že u Hořan něco viděl, a že od té doby nesnese pach kouře.\n\n' +
      'Dvacet let vládne spravedlivě, opatrně a příliš dlouho poslouchá kancléře. Nemá vlastních dětí. Má tebe.' },
    kralovna: { cat: 'Lidé', title: 'Královna Morana', text:
      'Morana přišla do Vranova z jižních bažin jako nevěsta, krásná, hrdá a s hlasem, který dokázal ztišit celý sál. Třikrát porodila mrtvé dítě. Po třetím přestala zpívat, a když jí král přinesl z války tebe, přestala otevírat okna.\n\n' +
      'Miluje tě způsobem, jakým se miluje svíčka v průvanu: s dlaněmi kolem tebe tak těsně, že se nemůžeš nadechnout. Posledních pár let ji drží nad vodou jen lék, který jí každý večer nalévá kancléř.' },
    vilem: { cat: 'Lidé', title: 'Kancléř Vilém', text:
      'Syn písaře ze Žárova, který začínal jako pomocník v zásobovací kanceláři vojska a skončil jako druhý nejmocnější muž království. V Noci dlouhých plamenů přišel o všechno, říká. Kupodivu z ní vyšel s penězi.\n\n' +
      'Lidé mu říkají Vilém Žlutý kvůli barvě kůže.† Je zdvořilý, trpělivý a nikdy nezvýší hlas. Nikdo si nepamatuje, že by se někdy spletl, a ti, kdo by si to pamatovali, už spolu nemluví.\n\n' +
      '† Dvorní lékař tvrdí, že je to od jater. Kuchaři tvrdí, že od šafránu. Služebnictvo tvrdí, že kancléř po léta polyká po kapkách všechny jedy, které zná, aby mu žádný z nich nemohl ublížit, a že mu to zežloutlo i duši. Služebnictvo mívá pravdu častěji, než by se lékařům líbilo.' },
    radim: { cat: 'Lidé', title: 'Kapitán Radim Kost', text:
      'Velitel hradní stráže, voják od svých šestnácti let. Ve válce sloužil jako mladý desátník, a byl u Hořan. O tom nemluví. O ničem moc nemluví.\n\n' +
      'Je z těch lidí, kteří drží rozkaz jako zábradlí na mostě nad propastí: ne proto, že by mu věřili, ale protože bez něj by se museli podívat dolů.' },
    sabina: { cat: 'Lidé', title: 'Inkvizitorka Sabina', text:
      'Nejmladší inkvizitorka Řádu v Popelově. Dcera mlynáře ze starého Žárova, která v Noci dlouhých plamenů přišla o matku i o polovinu tváře. Řád ji sebral z popela, naučil číst a dal jí bílé pírko a víru. Věří upřímně a doopravdy, což je mezi vyššími hodnostáři Řádu vlastnost téměř podezřelá.\n\n' +
      'Sabina neodpouští lež, ani cizí, ani svou. Co udělá, až zjistí, že ji Řád celý život krmil lží, nikdo neví. Ona sama nejméně.' },
    plachta: { cat: 'Lidé', title: 'Plachtička', text:
      'Veverka s jedním natrženým uchem, sprostou pusou a srdcem velkým jako vlašský ořech, což je u veverek míra nejvyšší. Žije v trámech tvé věže od doby, kdy jsi měl{a} pět let, a krade ti ze stolu medovinu.\n\n' +
      'Proč Plachtička mluví, nikdo neví.† Ví se jen, že mluví hodně, rychle a výhradně s tebou, protože ostatní lidé ji podle ní „neposlouchají, jen čekají, až domluví, aby po ní mohli hodit botou“.\n\n' +
      '† Ona sama tvrdí, že za to může sud královské medoviny, do kterého jako mládě spadla a ze kterého se musela vypít ven. Dvorní mág tvrdí, že za to může dvorní mág. Oba se mýlí, ale jen jeden z nich se za to stydí, a není to veverka.' },
    trubka: { cat: 'Lidé', title: 'Bohuslav Trubka a hraběnka Otýlie', text:
      'Bohuslav Trubka je básník, pěvec, kaligraf a podle vlastních slov „největší talent, jakého si tohle údolí nezasloužilo“. Údolí s ním v tomhle bodě souhlasí. Živí se psaním milostných dopisů za jiné, opisováním výnosů a zpěvem v hospodách, kde ho platí za to, aby přestal.\n\n' +
      'Jeho chotí je hraběnka Otýlie z Hrbu, kterou Vědma z Černého lesa proklela v husu za to, že ji ošidila v kartách.† Trubka si ji vzal až po prokletí, což je buď nejkrásnější, nebo nejpodivnější milostný příběh v království. Otýlie syčí na každého, kdo to řekne nahlas.\n\n' +
      '† Otýlie dodnes tvrdí, že neošidila. Vědma dodnes tvrdí, že eso srdcové nemá v balíčku tři kusy. Spor zůstává otevřený, husa zůstává husou.' },
    smudla: { cat: 'Lidé', title: 'Krysí král Šmudla', text:
      'Šmudla I., z Boží milosti a volbou sněmu Král všech stok, Pán kanálů, Ochránce Odpadu a Vrchní celník Přepadu. Nosí korunku z náprstku a monokl ze sklíčka od lampy a mluví o sobě v množném čísle, protože to dělají všichni králové a on se nehodlá nechat zahanbit.\n\n' +
      'Je lakomý, mazaný, ješitný a naprosto spolehlivý v jediném: dodrží každou smlouvu do posledního písmene. Proto taky každou smlouvu píše sám.' },
    vedma: { cat: 'Lidé', title: 'Vědma z Černého lesa', text:
      'Stařena, slepá od narození, která žije v chýši z kořenů uprostřed Černého lesa. Říká se, že pamatuje smlouvu pod Havraní skálou, že mluvila s posledními elfy a že nikdy neprohrála v kartách. Poslední z toho je ověřené.\n\n' +
      'Nepomáhá zadarmo. Za pomoc si bere vzpomínky, roky života nebo věci, které nikdy nepoužijete, dokud je nepotřebujete.' },
    kychal: { cat: 'Lidé', title: 'Drak Kýchal', text:
      'Starý drak z Žárových hor, který si za dob smlouvy oblíbil Hořany, hořanský mlýn a hořanský sýr. Jmenuje se ve skutečnosti jinak, jménem, které zní jako sesuv lavin, ale děti z Hořan mu říkaly Kýchal, protože když kýchl, zapálil mlynáři vousy. Jemu se to líbilo víc.\n\n' +
      'Když Hořany hořely, vynesl z ohně jediné dítě a pak zmizel. Výnos o vyhubení draků ho nezmiňuje. Výnosy obvykle nezmiňují věci, které by je vyvracely.' }
  };
})(window.T);
