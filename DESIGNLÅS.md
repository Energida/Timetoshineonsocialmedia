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

**Arket kan trækkes ned og lukkes (14/9).** Grebet øverst kan trækkes: mere end 110 px ned, og arket glider ud og lukker; slipper man før, glider det tilbage. Et træk der begynder i et skrivefelt, i chipsene eller i en rulleliste flytter ikke arket, og et træk opad er ikke et træk. **Den lange Luk bliver**: et træk kan ikke ses og kan ikke nås med tastatur, så det er en genvej, aldrig den eneste vej ud.

**Et langt tryk er en genvej, aldrig den eneste vej (14/9).** Holder man fingeren inde på en rød I dag-flise, åbner husets spørgsmåls-popup med Done og Udsæt. Et kort tryk gør præcis det samme som før. Et langt tryk må aldrig være det eneste sted, en handling findes, og det må ikke udløses af et swipe: bevæger fingeren sig mere end 10 px, afbrydes trykket.

**Navigationen på telefonen.** Ingen topbar; Tilbage står som lang knap nederst. Bundmenuen med plusset i midten. Plusset og swipe op på dagskortet åbner arket.

## Det, der IKKE er låst

Alt, der ikke står her, er ikke låst. Det betyder ikke frit valg: det betyder mockup først og Idas klik, før der bygges.
