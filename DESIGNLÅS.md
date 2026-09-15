# DESIGNLÅS — det senest låste design (gælder for enhver tråd)

**Læs denne fil, før du bygger eller ændrer noget, kunden ser.** Den seneste lås vinder altid over ældre kode, ældre kommentarer og ældre mockups. Finder du kode, der bryder en lås, er det en fejl, der skal rettes, ikke et design, der skal bevares.

Filen er kort med vilje. Hver regel kan måles. Målingen står i `tools/designlaas/`.

## Sådan låses et design (proceduren)

1. Ida låser med et klik eller med ord i tråden. Tråden skriver låsen ind HER samme dag, med dato.
2. **Låsning er fejning.** Den tråd, der låser, gennemgår hele appen for det gamle samme dag og lægger alt om, eller skriver præcist i statusnotatet, hvad der står tilbage og hvorfor. Det var det, der glippede 11/9 (arket blev låst kl. 12, helskærmen fra kl. 10 blev stående til 13/9).
3. Før hvert commit, der rører en popup, en knap eller en side på telefonen: kør `bash tools/designlaas/koer.sh` og skriv resultatet i statusnotatet. `SELE LAAS OK` eller ingen deploy.
   **Porten (13/9):** GitHub-actionen `.github/workflows/designlaas.yml` kører samme måling ved hvert push til `dashboard-og-database` og skubber kun commits, der siger OK, videre til grenen `produktion`. Peger Cloudflare Pages på `produktion`, når intet ud til kunderne uden målingen, uanset hvad en tråd gør.
4. Ny popup-dør i appen? Tilføj den i `DOERE` i `probe-popups.js` i samme commit. Ny side? Tilføj dens dør i `SIDER` i `probe-sider.js` (14/9: hele sider måles også: tæppet, sejlads, 44 px trykfelter, kryds, emoji, streger i fliser). En dør, proben ikke kender, er ikke målt.
   **Grænsen (14/9):** proben åbner KUNDEAPPEN. Døre i Backstage (fx arket på et rum i Maskinrummet) måles endnu ikke af `koer.sh` og skal måles for sig, indtil proben også kører Backstage. Står der OK, er det kundeappen, der er målt.
5. Er du i tvivl, om noget er låst: spørg Ida med et klik-valg. Byg ikke et bud og deploy det.

## Låsene (dato = den dag, Ida låste)

**Arket er den ene popup-form for alt, man skriver (11/9).** Titel i Didot kursiv, én streg, skrivefeltet med mikrofon til venstre for den røde sendecirkel, chips under feltet, kvittering, lang Luk. Telefon: ark fra bunden med greb. Computer: hvidt kort midt på. Aldrig hele skærmen. Man bliver stående efter Gem. Åbnes med `arkAabn`. Kundens skriveformer går gennem `kundeArkAabn`.

**Popups, der ikke er skriveformer (8/9 og 9/9).** Hvidt kort, intet kryds på telefonen, en lang Luk nederst. Kun valg og lister hører hjemme her (dage, datoer, Tag den nu/Senere).

**Alle knapper på telefonen er lange knapper (4/9, 5/9, 13/9).** Fuld bredde, mindst 48 px, radius 999, i en stak med den primære øverst. Rød flade og hvid tekst til den ene primære handling; hvid flade og rød tekst til de sekundære; hvid flade og grå tekst til den dæmpede (Slet, Gendan). Små røde ord som knapper findes ikke på telefonen. Computeren må have dem som ord til højre.

**Målingen holder øje med de lange knapper (14/9).** Sidemålingen (`probe-sider.js`) måler nu hver knap med et navn på telefonen: fylder den under 60 % af skærmens bredde, er det en fejl. Chips, ikon-knapper uden tekst, bundnavet, fanerne, fliser der er trykfelter og sendefeltets cirkler er ikke knapper i den forstand og står på undtagelseslisten i proben. Undtagelserne er navngivne: **`.kal-fpill`** (Arkivets filterpiller er chips) og **`.lek-top`** (lektionssidens titelbjælke, hvor Tilbage er bjælkens egen vej ud). Strategibyggeren er en anden fil og måles for sig.

**Etiketten hører til det, den indleder (14/9).** En sektions-etiket (»Seneste 7 dage«, »Målsætninger«, »Kommende indhold«) står tættere på indholdet UNDER sig end på det, der står over: 24 px op, 8 px ned. Det gælder også, når den står lige under heroen. Sidens identitets-etiket (`.bs-eye` lige under heroen, fx »ENERGIDA« under »Dine rum«) er det modsatte: den hører til heroen og står tæt på den. Står en etiket lige langt fra begge, svæver den, og øjet kan ikke se, hvad den hører til. Målingen tjekker det på geometrien, ikke på søskende i markuppen.

**Trykfelter er mindst 44 px høje (2/8).** Også chips, runde dagknapper og rækker, man kan trykke på.

**Bunden af hver side skal kunne nås (14/9).** Bundnavet er fast og 68 px højt PLUS telefonens hjemme-indikator, som er cirka 34 px på en iPhone. Bundpolstringen skal regne indikatoren med (`calc(… + env(safe-area-inset-bottom))`), ellers ligger den nederste knap bag navet. En flad pixelværdi er en fejl, også når den ser rigtig ud i selen, hvor indikatoren er 0.

**Én rød handling pr. flade.** Røde etiketter findes ikke. Tal i cirkler findes ikke (6/9).

**Didot kursiv er forbeholdt navnet** (personens navn, sidens navn). Sætninger og opgaver står i Poppins.

**Ingen emoji. Ingen »I« og »jer« til kunden (du og din).** En sætning, der kan lyve, er værre end ingen sætning: lov aldrig noget, appen ikke gør.

**Dubletreglen.** Én funktion, én dør, ét navn. To veje til det samme er en fejl. Et navn, der bruges to steder til to forskellige ting, er en fejl. **Også inde i arket (14/9):** etiketten over titlen siger, HVOR man er, når det ikke allerede står i titlen (»Postet · Vinterjakken«). Siger etiketten og titlen det samme, er etiketten en dublet og skal væk.

**Produktet bestemmer adgangen (14/9).** Hvert produkt har sin egen liste over funktioner (`PRODUKT_FUNKTIONER`), og den er kundens standard. En manglende liste må ALDRIG betyde »alt er tændt«. En fluebensliste på kunden vinder fortsat over produktet, så et eksisterende køb aldrig ændrer sig af en ny regel. Menupunkter i burgeren og i computerens menu er tvillinger: får den ene en lås, får den anden samme lås samme dag.

**B2b er kundeappen, også når Ida er logget ind (14/9).** Idas egne lister (Manus, Food Studio, Workout Studio, Mindful Studio, App-ønskelisten) hører i Backstage og må ikke kunne nås fra b2b. Plusset og swipet på b2b åbner kundens ark med kundens chips for alle koder, også `EGNE_KODER`. Backstage-arket (`nyIdeAabn`) må kun kaldes fra Backstage.

**Et tomt rum er tomt (14/9).** En side eller et rum uden indhold viser navnet og ÉN lang Tilføj-knap, ikke åbne skrivefelter. Det, der skal skrives, skrives i arket med chips for hvad man tilføjer. Tre skriveflader oven i hinanden på en tom side er den tivoli, dubletreglen forbyder. Så snart rummet HAR indhold, står fladerne som før.

**Refleksionen er tre spørgsmål, man swiper imellem (14/9).** Arket efter et opslag har INGEN chips: heroen er spørgsmålet (»Hvad gik godt?« · »Hvad var svært?« · »Hvad lærte du af dette opslag?«), prikker viser hvor man er, og man swiper til siden. Formen er ellers arket uændret. Swiper man med noget uskrevet i feltet, gemmes det først: et swipe må aldrig koste tekst. Teksten følger produktet: kun **I GOT YOU** får »Ida læser det og bruger det til næste planlægning«, fordi det kun er dér, hun gør det. Content Studio, YOU GOT THIS og WE GOT THIS får »Refleksion« og »Din refleksion bliver liggende på opslaget«.

**Arket kan trækkes ned og lukkes (14/9).** Grebet øverst kan trækkes: mere end 110 px ned, og arket glider ud og lukker; slipper man før, glider det tilbage. Et træk der begynder i et skrivefelt, i chipsene eller i en rulleliste flytter ikke arket, og et træk opad er ikke et træk. **Den lange Luk bliver**: et træk kan ikke ses og kan ikke nås med tastatur, så det er en genvej, aldrig den eneste vej ud.

**Et langt tryk er en genvej, aldrig den eneste vej (14/9).** Holder man fingeren inde på en rød I dag-flise, åbner husets spørgsmåls-popup med Done og Udsæt. Et kort tryk gør præcis det samme som før. Et langt tryk må aldrig være det eneste sted, en handling findes, og det må ikke udløses af et swipe: bevæger fingeren sig mere end 10 px, afbrydes trykket.

**Navigationen på telefonen.** Ingen topbar; Tilbage står som lang knap nederst. Bundmenuen med plusset i midten. Plusset og swipe op på dagskortet åbner arket.

**Backstage på computeren (14/9, Idas klik på bud F og G; rækkefølgen rettet 14/9 kl. 14.20).** Sidemenuen ER dørene: Kunder · Salg · Content Studio · Energida Studio · Workout Studio · Food Studio · Mindful Studio · Mine rum · Teknik. Det under en dør er PRÆCIS det, siden viser; et rum, der kun er en vej, står ikke ved siden af døren til samme side; Mine rum viser kun rum, der ikke er lagt et andet sted. Sidemenuen ER dørene (gammel formulering): Kunder · Mine rum · Energida Studio · Salg · Content Studio · Workout Studio · Food Studio · Mindful Studio · Teknik, hver folder ud til det, der ligger bag (registret `BS_DOER_DEF` + rum + kategorier + studiernes kort), én dør åben ad gangen, den aktive rød. Dørfliserne på Hjem findes ikke på computeren. Hjem på computeren er fem rammer: I dag (Venter på dig med To-do under, Kommende aftaler til højre) · Dine (genveje som piller, pinnede kunder som døre) · Denne uge (tre ringe) · Forretningen (Energida Studio, salget) · Dig (dit eget content fra IDAENERGIDA, de samme rækker som hendes eget login; energien hører til Time to Shine). Rammen er gennemsigtig med hårfin kant; rækker i en stak står med 8 px. Telefonen (< 1000 px) er urørt: dagens kort, dørene som fliser, bundmenuen.

**Salg › Pipeline = bud 3 »Dagens salg« (14/9 kl. 17.20, Idas klik efter fem bud).** Øverst »Følg op i dag« som den røde ramme med hvide rækker (samme form som Venter på dig på Hjem): kontakter med næste aktivitet i dag eller overskredet, og samarbejder der udløber inden 14 dage; svaret er »Åbn« (kontaktkortet). Til højre pipelinen som fire af husets ringe (Leads · Kontaktet · Ikke sendt · Aktive) i hver sin hvide flise. Under: alle kontakter med chips på status (Idas egne statusord fra CRM'et, aldrig omskrevet), som fliser i tre spalter på computeren og én på telefonen, og »Tilføj kontakt …« som sendefelt (ny kontakt = Lead). Heroen siger Pipeline, stien Hjem › Salg › Pipeline. Det gamle CRM med faner nås kun fra Kunder › »Pipeline, kontakter og koder«. Ikke tegnet endnu: kontaktkortet som ark og Ny kontakt-arket (kommer som næste bud).

**Kalenderen på telefonen bliver, som den er (Ida 14/9 kl. 19.30: »det skal bare være som det fint var, kommende indhold … vi havde da ramt noget godt tidligere«).** I dag · Kommende indhold · Kommende opslag som fliser med datoen først, og den røde plus-knap. Ingen dage eller datoer uden indhold, ingen Dag/Uge/Måned-piller på telefonen. Bud 4 (klikket kl. 19.20) blev trukket tilbage af hendes ord ti minutter efter og er IKKE bygget. Computerens kalender er urørt.

**Drejebogen på telefonen åbner i appen (14/9, v1925).** Menuens »Drejebogen« viser bogen som sider i appen (screen1, bud 2 8/9) på ≤ 760 px; på computeren åbnes vinduet, mens trykket gælder. Et nyt vindue efter en hentning findes ikke: pop op-spærren stopper det.

**Søjlen vælges, når idéen skrives (14/9 kl. 20.00, Idas klik).** I kundens ark (Tøm hovedet, »+ Ny idé«, Idébankens sendefelt) står de fire indholdssøjler som en anden chip-række under den første, når chippen er Content-idé. Gem uden søjle giver »Vælg en søjle først.« Står man i en søjle i Idébanken, er den valgt på forhånd. Ingen ny flade; »Andet« skal ikke længere vokse.

**Popuppen fylder ikke hele bredden på telefonen (14/9 kl. 21.50, Idas klik: »Popuppen selv«).** Arket (`.ark`, alle popups i appen: Tøm hovedet, ny idé, søjle, målsætning, ⋯-menuer) står med 12 px luft til begge sider og 12 px til bunden og har runde hjørner (28 px) hele vejen rundt; det går ikke længere fra kant til kant. Målt i selen v1928 på 390: 12 · 366 · 12. På computeren er arket uændret (centreret, 520 px). Hjulet til antal opslag (planlægningsdagen, ikke bygget endnu) er smalt, midt i arket, med tal i Poppins, aldrig Didot (Idas kommentar kl. 21.23).

**Planlægningsdagens trin 2 = bud 3 »Ét spørgsmål fylder skærmen« (14/9 kl. 22.05, Idas klik; v1929).** Ingen popup: hvert spørgsmål er sin egen side i planlægningsdagen, som strategibyggeren og briefen på telefonen. Rækkefølgen: antal (hjulet = ugemålet, samme tal som Performance › Målsætninger, gemmes begge steder) → rækkefølgen (det, ugen mangler i fordelingen mellem 1A·1B·2A·2B, står først, derefter rotationen; det, der ligger, vises som »Ligger allerede«) → pr. opslag: målgruppen (kun når Drejebogen har flere; Content Studio sætter den med færrest opslag de sidste fire uger øverst med »Anbefalet«; valget gemmes som brief.maalgruppe) → tre spørgsmål fra Drejebogen med målgruppens navn sat ind, svar som store kort (Drejebogens situationer, kundens egne eksempler og hooks, husets søjler) med cirkel til højre, valgt = rød kant, og altid et sidste kort »Skriv selv« med mikrofonen → »Her er idéen«: titel (kan rettes), dag, format → gemmes som Planlagt med søjle og dato; de tre spørgsmål med svar er briefens beskrivelse. Heroen ER spørgsmålet (Didot), én lang rød knap i bunden, »Tilbage« øverst går ét skridt tilbage. Ingen AI-kald. Uden køn i spørgsmålene.

**Drejebogen som værktøj i Idébanken (14/9 kl. 22.50, Idas klik; v1930).** I kundens ark (Tøm hovedet, »+ Ny idé«, Idébankens sendefelt, Lav til idé) står der, når en søjle er valgt, én lang hvid knap under søjle-chipsene: »Find idéen med Drejebogen«. Den åbner de samme tre spørgsmål som på planlægningsdagen (samme skærme, samme svarkort, samme »Skriv selv« med mikrofon), toplinjen hedder »Drejebogen«, uden trin-bjælke og skinne. Det, der allerede var skrevet i arket, står som svar på det første spørgsmål. Sidste skærm: titel og format (ingen dag), knappen »Læg i Idébanken« gemmer som Idé under søjlen uden dato; de tre spørgsmål med svar er briefens beskrivelse. »Tilbage« fra det første spørgsmål lukker og går tilbage til appen.

**ALT SES PÅ BÅDE 390 OG 1440, FØR DET DEPLOYES (HÅRD, Ida 15/9 kl. 11.22).** Mødeflowet (v1948–v1950) blev bygget under tidspres og kun målt på telefonen — på computeren stod flisen i venstre side, tekst i heroen og små knapper. Computeren er sin egen flade: flisen fylder hele bredden, 32 px under heroen, knapper i fuld bredde. Ingen undtagelser, heller ikke under tidspres — nås det ikke, deployes der ikke.

## Det, der IKKE er låst

Alt, der ikke står her, er ikke låst. Det betyder ikke frit valg: det betyder mockup først og Idas klik, før der bygges.

**Flisen = etiket · ÉN skillelinje · indhold (15/9 kl. 08.27, Idas ord — RETTER 12/9-noten).** En flise med etiket har altid én hårfin streg i fuld bredde under etiketten (grå på hvidt, hvid/35 % på rødt). Aldrig to streger i samme flise; en dør er kun navnet. **Didot kun i heroen — Poppins i alt andet** (fliseoverskrifter, felter, tal, ringe, knapper).

**FLISEN — LÅST 15/9 kl. 08.35 (bud A »Ét skridt fylder skærmen«, Idas ord: »sådan skal alle fliser se ud fremadrettet … i alle mine apps, både admin, Succesfuld Detaildrift og Time to Shine«).** Hvid flise (1 px #DEDAD4, hjørner 20, polstring 18/20) = etiket (10 px versal, grå) · ÉN hårfin skillelinje · overskrift Poppins 18 normal · én sætning Poppins 12,5 grå · rød pilleknap i fuld bredde (48 px). Didot kun i heroen. Flere trin = ét spor, det aktive kort fylder bredden, swipe til de næste (dæmpede med lås / grønt flueben), prikker under; computeren tre kort pr. række. Fremgang = husets ringe i små hvide fliser under sporet, etiketten 14 px under ringen. Ingen tal i knapper (»Start her« · »Fortsæt« · »Åbn«). Motor: `dashBentoHtml` — tegner Hjem (rejsen: Spørgeskema · Forløbet · Drejebogen · Planlægningsdagen · Den første brief) og Forløbet-siden. Rundvisningen tilpasses kortene. Manualen: afsnittet »Flisen« (15/9). Alle knapper i huset er piller (999).
