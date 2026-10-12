# Fejlkataloget — alt, der kan gå galt i Energida

Her står hver slags fejl, der kan ramme kundeappen (b2b.energida.dk), Backstage (admin.energida.dk), databasen, betalingen, mailene og Instagram — så sikkerhedschefen kan teste dem alle.
Eksemplerne er kun dem, der faktisk er sket (fra hukommelsen, DESIGNLÅS og sikkerhedskontrakten). »—« betyder: ikke sket endnu, men en reel risiko.
»Dækket i dag?« = løftenummer i sikkerhedschefen (samlet.py), et tjek i designporten (probe-…), »Delvis« eller NEJ.

Kilder: memory/*.md · Energida-soejler-kladde/DESIGNLÅS.md · tools/sikkerhedschefen (løfte 1–29, lag2/scenarier.js) · tools/designlaas/probe-*.js · skills tryghed/sikkerhedschefen · ENERGIDA SECURITY CONTRACT.md. Lavet 12/10.

Ordforklaring til testkolonnen: **selen** = testversionen af appen med opdigtede data (byg-sele.py) · **huske-basen** = selens falske database, der kan sige nej (SELE_AFVIS) · **live-læsning** = kun læsning i Supabase via Management API · **curl** = et kald udefra uden login.

---

## A · Data går tabt eller gemmes ikke

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 1 | Appen siger »gemt«, men basen afviste det (0 rækker, ingen fejl) | 2/8 manus-autosave og 3/8 SQL-kort-listen: »gemt« på skærmen, intet i basen | Ja · løfte 2 (tjek_skriv + lag2 »afvist skrivning«) og 16 (Backstage-rettelser) | Allerede: tæl skrivninger uden `.select()`; huske-basen med SELE_AFVIS=0 → rød bjælke skal komme |
| 2 | En gemning skriver »tomt« fra et felt, der ikke længere står på skærmen | 4/8 kbGemNu skrev null over et manus; 25/8 temaet blev tømt ved et klik ved siden af | NEJ | Selen: åbn brief/tema, luk arket midt i autosave-ventetiden, læs basen → feltet må ikke være tomt |
| 3 | En gammel, åben udgave overskriver en nyere (to personer på samme brief) | 7/10 Freja udfyldte en brief i Hinges Hus; Idas gamle åbne udgave i admin gemte ovenpå | Ja · løfte 33 (tjek_gammel; fandt og rettede v2756) | Selen med to faner: A åbner, B retter og gemmer, A gemmer et andet felt → B's felt skal stå; gentag admin ↔ b2b |
| 4 | Appen sletter eller nulstiller data af sig selv | 7/10 ideGamleDatoerRyd fjernede datoer på overskredne opslag hos Acorns og Hinges ved hver indlæsning | Ja · løfte 32 (tjek_selvslet) | Selen: læg opslag med dato i går/sidste uge, genindlæs 3 gange, sammenlign hvert felt med før — ingen ændring uden tryk. Kodesøgning efter skrivninger i opstartsfunktioner |
| 5 | En liste skrives over med en liste, der aldrig blev hentet | 11/10 (v2742) Backstage-lister kunne overskrives, mens basen svarede »gemt« | Ja · løfte 16 (tjek_lister) | Allerede |
| 6 | Log ud på én telefon logger alle andre ud — og det usendte forsvinder | 29/9 Hinges Hus: signOut var global; to kunder mistede briefs | Delvis · løfte 20 (log ud beholder køen) | Kodesøgning: hvert `signOut(` skal have `scope:"local"`; selen: log ud med usendt kø → køen står |
| 7 | En flertrins-guide gemmer først på sidste trin | 29/9 First thing first skrev først på 6. trin | Ja · løfte 45 (tjek_guide) | Selen: udfyld trin 1–3, luk arket, genindlæs → svarene står |
| 8 | En afvist oprettelse kommer ikke i køen til at blive sendt igen | 29/9 (rettet v2401) | Ja · løfte 2 (»afvist ændring sendes igen fra køen«) | Allerede |
| 9 | Genindlæsning overskriver telefonens kopi, før køens nye opslag er sendt | 29/9 Hinges Hus | Delvis · løfte 1/23 | Selen: net væk → opret → genindlæs med net → opslaget står og ligger i basen |
| 10 | Uden net: teksten forsvinder eller »gemt« lyver | — | Ja · løfte 23 | Allerede |
| 11 | Et felt hopper tilbage, fordi en gemning var undervejs | 9/10 »rettet fra kort reel til reel 100 gange« (v2688) | NEJ | Selen med huske-basen forsinket 2 s: skift format to gange hurtigt, genindlæs → sidste valg står |
| 12 | Falsk »ændret et andet sted« — kunden kan ikke gemme | 27/9 og 29/9 manus kunne ikke gemmes | NEJ | Selen: lad én gemning fejle, gem igen → må ikke melde konflikt |
| 13 | En import eller et SQL-kort overskriver noget nyere | 23/9 manuskript-importen skrev 54 lektioner over en nyere udgave | NEJ | Før hver import: sammenlign tidsstempel/længde pr. række med det, der overskrives; stop ved nyere. Køres som tørløb mod live-læsning |
| 14 | Et SQL-kort køres to gange og ødelægger noget | 4/10 note: gammelt Shinebarometer-kort må ikke køres igen; 22/9 »Modul 11 bliver Modul 10« aldrig målt | NEJ | Hvert kort skal kunne køres to gange uden ændring: kør på en kopi i lokal Postgres (eller Supabase-gren), sammenlign |
| 15 | Kundens lektionssvar overskrives af en gammel åben side | 8/10 svar-tryghedstesten (v2588) | Delvis · løfte 27 (set/stjerner), ikke selve svarene | Selen: to faner på samme lektion, ret i én, skift lektion i den anden → begge svar står |
| 16 | Et valg kræver »Gem«, og forlader man siden, er det væk | 9/10 »Hvem skal lave det?« i fakta ventede på Gem (v2691); 11/10 Hans: »Gem ændringer« midt i et trin smider ud uden kvittering | NEJ | Selen: vælg hver fakta-værdi, tryk Tilbage uden Gem, genåbn → valget står |
| 17 | Data ligger kun i én browser og følger ikke kunden til computeren | 10/10: 11 nøgler kun i localStorage (rettet v2727) | Ja · løfte 1 (»basen → computer: den anden enhed får det samme«) | Allerede. Udvid: kodesøgning efter nye `localStorage.setItem` uden for ENHED_SYNK |
| 18 | Dubletter: samme møde/link oprettes flere gange og kommer igen efter sletning | 10/10 »mødet d. 12. oktober, jeg har slettet 100 gange, kommer tilbage«; 10/10 samme Instagram-link igen fra Tøm hovedet | Ja · løfte 5 og 1 (inspiration-dubletter) | Allerede + datavagt-SQL (tryghed trin 3) som fast live-læsning |
| 19 | To funktioner med samme navn — rettelsen sidder i den, der aldrig kører | 10/10 moedeSlet, »Slet mødet«, kommentarfeltet (v2714, v2724) | Ja · løfte 16 (dubletter i samme blok) | Allerede |
| 20 | En idé uden navn gemmes som »Uden titel« | 10/10 (v2735) | Ja · løfte 13 | Allerede |
| 21 | En flytte-/ret-funktion nulstiller status eller dato på noget, kunden er i gang med | 6/10 planlægningens trin 3 kunne nulstille opslag; trin 6 flyttede mødet til 10:00 | NEJ | Selen: opslag »Brief i gang« med dato → gennemfør planlægningen → status, dato og mødetid uændrede |
| 22 | Tekst forsvinder lydløst i en PDF (Drejebogen) | 3/9 for lang tekst faldt ud af siden | NEJ | Generér Drejebogen med maksimal tekst i selen, mål overløb pr. side (scrollHeight > clientHeight = FEJL) |
| 23 | Kunden sletter noget ved et uheld, og der er ingen Fortryd | — (Done fik Fortryd 7/10) | NEJ | Selen: hver slet-knap → skal spørge først (ark) eller tilbyde Fortryd; tæl rækker før/efter |
| 24 | »Inviter en kollega« uden navn — kollegaen arver ejerens data | 1/10 lanceringstjekket | NEJ | Selen: invitér uden navn → skal afvises; live A/B: kollega ser kun det, der må deles |
| 25 | Hele kundekartoteket ligger i én række, og én fejlskrivning rammer alle kunder | 26/8 kunde_koder som ét JSON-felt på Idas række | NEJ | Live-læsning hver morgen: antal kunder i kunde_koder ≥ i går; selen: afvist hentning + gem → listen må ikke skrumpe |

## B · Data vises forkert eller hos den forkerte kunde

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 26 | Kunde A kan se, rette eller slette kunde B's data | — (aldrig sket; bevist adskilt 11/10) | Ja · løfte 17 (Idas A·B·A·B, kørt manuelt) | Gør den automatisk: kør `?selvtest=ab` hver nat med to faste testlogins (kræver Idas ja til en testkonto-vej) |
| 27 | En fremmed uden login kan læse kundedata med den offentlige nøgle | 6/8: alle tabeller stod på »using (true)« | Ja · løfte 17 (tjek_anon) | Allerede |
| 28 | To kilder til samme kunde — koden vinder over databasen | 1/9 Hinges Hus: Lene og Torben i Content Studio, Rikke og Per i Drejebogen; 11/10 Idas flueben nåede ikke Hinges/Acorns | Delvis · løfte 28 (flueben) | Selen: for hver fast kunde i koden, læg en anden kunde_def i basen → alle flader skal vise basens udgave |
| 29 | Koden og basen har hver sin udgave af kurset | 22/9: syv lektioner stillede spørgsmål fra en anden lektion | NEJ | Sammenlign lektioner/øvelser i basen (live-læsning) med KURSUS_MODULER i koden: titel og spørgsmål pr. id skal passe |
| 30 | Data hentes kun på kundens vej ind — admin ser kodens gamle standard | 4/8 oevelserHent kun fra kunden; Ida kunne have gemt de gamle spørgsmål ovenpå | NEJ | Selen som admin: åbn hvert studie → hentefunktionen skal være kaldt (spion på fetch) før editoren fyldes |
| 31 | Testdata ses hos rigtige kunder eller i tal | 11/10 A/B-markøren stod som »Næste aftale 1. januar« og som »Nyt fra Ida« | Delvis · løfte 29 (»ingen testmarkører«) | Live-læsning: søg »AB-MARKØR« og koden TEST i alt, kunderne læser; selen: kundens flader må aldrig vise markøren |
| 32 | Testkøb og egne koder tælles med i salgstal | — | Ja · løfte 1 (overblikket: testkøb udenfor) | Allerede |
| 33 | Et opslag gemmes, men vises ingen steder | 6/10: plus på en kalenderdag gav opslag med status Idé + dato, som ikke blev vist | Ja · løfte 6 (delvis) | Udvid: for hver status × med/uden dato skal opslaget stå præcis ét sted (Idébanken, kalender eller Mangler dato) |
| 34 | Noget forsvinder fra en liste, fordi filteret er for hårdt | 4/10 onlinekursus forsvandt; 6/10 produkt uden link forsvandt fra fakta; 10/10 Idébanken smed »Brief i gang« ud | NEJ | Selen: opret ét af hver slags (produkt uden link, produkt uden lektioner, brief i gang uden dato) → tæl, at alle står et sted |
| 35 | Kalender og møder er ikke enige | 11/10 »Bliv klar«-striben fulgte den gamle planlægningsdag | NEJ | Selen: flyt mødet → Hjem, kalender og »Bliv klar« viser samme dag |
| 36 | Hjems tal passer ikke med det, der er planlagt | 11/10 Hans: »0 af 3 planlagt« lige efter et planlagt opslag | Ja · løfte 38 (tjek_hjemtal) | Selen: planlæg et opslag → læs Hjems tæller; skal stige med 1 |
| 37 | Tekst findes, men er usynlig (hvid på hvid, låg over feltet) | 21/9 »alle mine manusser er væk« (CSS-låg); 22/9 dagens opslag hvidt på hvidt | Ja · løfte 36 (tjek_usynlig: kontrast ≥ 1,6:1 og intet synligt låg, alle sider 390 + 1440) | Selen: for hvert felt/flise med tekst, mål farve mod baggrund (kontrast < 1,5 = FEJL) og at tekstlaget ikke er dækket (elementFromPoint) |
| 38 | Forkert brief-type åbner (fx reel-brief til et billede) | 6/10 Billede/Prøvereel fik reel-briefen | Ja · løfte 39 (tjek_format) | Selen: opret ét opslag af hvert format → den åbnede brief skal have formatets egne trin |
| 39 | Forkerte modtagere i »Send til« | 9/10 »Send til« viste kun Ida (v2702) | NEJ | Selen som admin og som kunde: listen = kundens team, aldrig Ida som kunde |
| 40 | Data skrives, men læses aldrig af nogen | 2/9 stjerner og noter blev skrevet i månedsvis uden at blive vist | Delvis · løfte 27 | Kodesøgning: hvert `skema:` der skrives, skal også læses et sted; liste over »kun skrevet« = mangel |
| 41 | Filtret tæller ingenting, fordi tabellen er tom | 22/9 produkt_lektioner var tom — produktchips filtrerede ingenting | NEJ | Live-læsning: tabeller, appen filtrerer på, må ikke være tomme; ellers advarsel |
| 42 | Dato/tid forskubbet (sommertid, midnat, ugenummer) | 13/10 nat: 26 steder stemplede »i dag« i UTC — kl. 00–02 fik noget gårsdagens dato (rettet v2757) | Ja · løfte 42 (tjek_datoer) | Selen med uret sat til 23.30, 00.30 og sidste søndag i oktober: opslag ligger på rigtig dag, uge og tid |

## C · Login, adgangskoder og adgang (pakker, flueben, låse)

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 43 | »Vælg din nye adgangskode« kan lukkes eller springes over | 10/10 Ida lukkede arket med krydset og stod i admin uden ny kode | Ja · løfte 18 (lag2: kan ikke lukkes, kommer igen) | Allerede |
| 44 | En pakke mangler en side, den skal have (eller har en, den ikke må) | 12/10 testkunde YOU GOT THIS manglede Performance; 11/10 YGT-kunder havde ingen Adgang-fane i CRM | Ja · løfte 31 (tjek_pakker) — FUND: YOU GOT THIS midt i forløbet viser hverken Content Studio eller Performance, selv om fluebenet er sat | Matrix-test i selen: for hver pakke (YGT, Content Studio, forløb, kollega, admin) log ind og skriv listen over menupunkter/sider; sammenlign med en facitliste, Ida godkender én gang |
| 45 | Idas flueben under Adgang når ikke kunden | 11/10 Energien/Lektionerne kom frem hos Hinges | Ja · løfte 28 | Allerede |
| 46 | Menuen på telefonen og computeren viser forskellige låse | 1/10 telefonen viste låste døre (kun sidemenuen blev bygget om) | Ja · løfte 40 (tjek_menuer) — FUND 13/10: Drejebogen kun i telefonens menu; »Content kalenderen« (computer) / »Kalenderen« (bundmenu) | Selen: sammenlign punkterne i sidemenu og bundmenu på 390 og 1440 for hver pakke |
| 47 | YOU GOT THIS åbner funktioner på forkert dag | — (gradvis åbning bygget 9/10, dag 42) | NEJ | Selen med falsk startdato dag 41 og 42: plus/Opgaver skjult → synligt |
| 48 | Logget ud uden grund | 10/10 »er det med vilje, du har logget mig ud?« | Delvis · v2719 viser årsagen, ingen test | Selen: lad tokenet udløbe → appen skal forny stille; log ud-årsag skal stå |
| 49 | En signup-/invitationsfunktion kan sætte ny kode på en eksisterende bruger (kontoovertagelse) | 6/8 signup-med-kode kunne overskrive en kundes kode | NEJ | curl mod hver signup/invite-funktion med en kendt testmail → skal afvise; kodesøgning efter `updateUserById` med password |
| 50 | Kunden kan selv ændre sin kode/rolle i user_metadata | — (kontrakt §2/§6) | NEJ | Som testkunde: `auth.updateUser({data:{kode:"ANDEN"}})` → appen og RLS må ikke give adgang til den anden kode |
| 51 | Slet kunde i CRM sletter ikke loginnet (eller omvendt) | 11/10 Ida slettede Els og kunne ikke se, om loginnet var med | Ja · løfte 29 | Allerede |
| 52 | Login-mail og kontaktmail kommer ud af takt | 11/10 (v2744) | Ja · løfte 29 | Allerede |
| 53 | Browseren udfylder forkert (fx »Admin« i mailfeltet) | 10/10 (v2719) | NEJ | Selen: udfyld feltet med »Admin« → dansk fejlbesked, ingen kald |
| 54 | Delt login mellem flere medarbejdere | 29/9 Hinges Hus delte én bruger | NEJ | Live-læsning: logins med sessioner fra flere enheder samtidig → advarsel til Ida |
| 55 | Efterladte testlogins på live | 11/10 ZZTEST2026 står tilbage | Ja · løfte 35 (tjek_live: ukendte testlogins) | Live-læsning hver morgen: auth-brugere/koder med TEST/ZZTEST/AB-mønster, der ikke står på en godkendt liste |
| 56 | Team-koden kan ikke tastes ind nogen steder | 6/10 revisionen (stopper kunden) | NEJ | Selen: »Jeg har en kode«-vejen fra login til indtastning findes og virker |

## D · Popups, ark og knapper

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 57 | To popups ligger oven på hinanden (den ene skinner igennem) | 11/10 rundvisningens ark lå under »Vælg din adgangskode« (v2754) | Ja · løfte 30 (tjek_popup) | Selen: efter hver dør tæl synlige faste lag (position:fixed, > 200×100 px, synlige) — mere end ét = FEJL. Kør også ved login, efter testkøb og ved første start |
| 58 | En popup kan ikke åbnes igen, efter den er lukket med krydset | 12/10 »Tast ugens tal fra Instagram« — display:none hang ved (v2755) | Ja · løfte 30 (tjek_popup) | Selen: for HVER dør i probe-popups: åbn → kryds → åbn → Esc → åbn → klik udenfor → åbn; skal være synlig hver gang |
| 59 | Krydset lukker en anden popup end sin egen | 11/10 »Tast ugens tal« kunne ikke lukkes (v2752) | Ja · løfte 30 (tjek_popup) | Samme runde som nr. 58: efter kryds må arket ikke være synligt |
| 60 | En usynlig flade ligger over knapperne, så tryk ikke virker | 9/10 siden fryses under sideskift (sk-holder, op til 12 s); 14/9 »Drejebogen er tom«-døren blev stående over næste side | Ja · løfte 30 (tjek_popup: ingen flade over knappen, før og efter krydset) | Selen: for hver knap tjek `elementFromPoint(midten)` er knappen selv; efter hvert sideskift må sk-holder/turOverlay være væk inden 3 s |
| 61 | Popup bygget uden om husets form (gammelt modalBody) | 24/9 »Ret idéen« i Energida Studio; 24 popups uden om arkAabn | Delvis · probe-popups (kun kundeappens døre) | Kodesøgning: antal `getElementById("modalBody")`-popups må aldrig stige; føj admin-døre til probe-popups |
| 62 | Popups i Backstage måles aldrig | 24/9 og 29/9 (produkt-arket med links) | Delvis · løfte 30 (Backstages døre trykkes i popup-runden) | Udvid probe-popups med Backstages døre på 390 og 1440 |
| 63 | En ændring af »alle popups« ødelægger én, porten ikke kender | 29/9 produkt-arket med flere links | Delvis · probe-popups | Liste over ALLE `arkAabn(`-kald → hver skal være i DOERE (manglende = FEJL) |
| 64 | Plusset åbner det forkerte ark | 10/10 plusset i CRM viste ti »Tilføj rum« | Ja · løfte 8 (tjek_plus) | Allerede |
| 65 | En knap er død (funktionen findes ikke) eller giver en fejl | 10/10 »Slet mødet« gjorde ingenting | Ja · løfte 8 og 16 (tjek_knapper, tjek_motorer) | Allerede |
| 66 | En dropdown følger med, når man ruller, eller bliver skåret af | 23/9 statuslisten fulgte rulningen; 11/10 »Morgen (før 7:30)« skåret af | NEJ | Selen: åbn hver dropdown, rul 300 px → listen ved sin knap eller lukket; mål at listen ligger inden for skærmen |
| 67 | Swipe gør noget andet end fingeren ville (flere lyttere på samme bevægelse) | 5/9 tre swipe-lyttere i briefen | NEJ | Selen med touch: flik og langsomt træk på hver swipe-flade → forventet side/Slet; kodesøgning: antal touch-lyttere pr. element |
| 68 | En popup, der skal stå, kan lukkes med Esc / klik udenfor | 10/10 | Ja · løfte 18 | Allerede |
| 69 | Rundvisningen kommer på forkert tidspunkt eller bliver hængende | 9/10 rundvisningen før spørgeskemaet; 7/10 rød ring | NEJ | Selen som ny kunde: rækkefølge login → ny kode → rundvisning → skema; turOverlay væk efter sidste trin |
| 70 | Tastaturet på iPhone skubber arket ud af skærmen | 5/9 note: tastaturet = resize | NEJ | Playwright med iPhone-profil: fokus i felt, sæt visualViewport-højde −300 → Gem-knappen synlig |
| 71 | En lektions-overlay bliver liggende ved skift i sidemenuen | 7/10 natkøens småfund | NEJ | Selen: åbn lektion → tryk sidemenu → overlay væk |

## E · Navigation og blindgyder

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 72 | En side har ingen »Tilbage« | 10/10 Planlægning; 11/10 kundesiden i CRM på computeren | Ja · løfte 11 | Allerede (udvid til alle Backstage-sider) |
| 73 | Delelinket lander forkert eller loader for evigt | 10/10 »opslaget kommer aldrig — den bliver bare ved med at loade« | Ja · løfte 11 og 15 | Allerede |
| 74 | Genindlæsning smider adressens oplysninger væk | 10/10 ?frisk fjernede ?brief=…&kunde=… | Delvis · lag2 fase »link« | Selen: åbn delelink, udløs ?frisk-genindlæsning → samme brief |
| 75 | En side kan ikke nås (uopnåelig) | 21/9 slutskemaet var uopnåeligt siden 20/9; 6/10 Stories kunne ikke åbnes | NEJ | Selen: liste over alle sider/skemaer → hver skal kunne nås fra Hjem via klik (ikke showTab); manglende vej = FEJL |
| 76 | Menuen lover døre, siden ikke har | 7/10 Værktøjskassen manglede dørene (v2531) | NEJ | Selen: hvert menupunkt åbner en side med tekst og den rigtige overskrift |
| 77 | Efter en sletning lander man et forkert sted | 7/10 slettet brief → Idébanken i stedet for forsiden | NEJ | Selen: slet testbrief → aktiv skærm = briefoversigten |
| 78 | En baggrundsgenskabelse river siden væk efter et klik | 25/8 »når jeg klikker på mine kunder kommer intet frem« | NEJ | Selen med forsinket base (?selelat=900): klik ny side under genskabelse → klikket vinder |
| 79 | Spøgelsessiden (den gamle prototype) ses et øjeblik | 30/7, 12/9 (fire gange), 25/9 | Delvis · løfte 15 | Selen: optag skærm hvert 50 ms fra login til Hjem; screen0 må aldrig være synlig |
| 80 | Pinnede kunder åbner i ny fane i stedet for samme | 30/9 → 10/10 (virkede aldrig) | NEJ | Selen: tryk pinnet kunde → ingen window.open |

## F · Gamle versioner og cache

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 81 | Telefonen sidder fast på en gammel version | 5/9 Idas telefon på 1642, serveren 1690 | Ja · løfte 24 (tjek_sw) | Allerede |
| 82 | Genindlæsning giver ikke den nyeste version | 11/10 admin på 2744, serveren 2748 | Ja · løfte 24 | Allerede |
| 83 | En gammel version åbner en ny fane/funktion, der ikke findes i den | 12/10 CRM-fanen kunne ikke åbnes på en gammel cachet version | NEJ | Playwright: indlæs version N−1 fra git, opdatér serveren til N, klik ny fane før reload → enten virker den eller appen henter N; aldrig død knap |
| 84 | version.txt, APP_VERSION og versionslinjen er ikke ens | 5/9 version.txt stod på 1619; 9/10 versionslinjen stod fast på 2600 | Ja · løfte 14 | Allerede |
| 85 | Ny version hentes midt i kundens arbejde | 24/9 og 29/9 | Ja · løfte 24 | Allerede |
| 86 | Opdatering i baggrunden på iPhone → »Appen kunne ikke starte« | 24/9 | NEJ | Playwright iPhone-profil: skjul siden under hentning, vis igen → appen starter (kræver også én rigtig telefon) |
| 87 | Porten fejler i stilhed, så live ikke opdateres (eller opdateres uden måling) | 13–15/9 porten faldt på hvert push; 29/9 Linux-rullebjælke | Delvis · løfte 14 (live-version) | Hver morgen: sammenlign live version.txt med seneste commit; GitHub Actions-status for Designlaas læses via gh |
| 88 | Cloudflare bygger fra en gren uden port | 15/9 (åbent) | NEJ | gh/Cloudflare-API: produktionsgrenen skal være `produktion` |

## G · Design og designlås-brud

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 89 | Popuppens form er forkert (bredde, kryds, knapper under 44 px) | 19/9 »jeg er ved at blive sindssyg af at de altid er forskellige« | Ja · probe-popups (løfte 9) | Allerede |
| 90 | Elementer er ikke ens (chips, knapper, fliser, felter) | 15/9 versaler i 13 former, chips i 14; 9/10 »ALLE chips skal være ens« | Ja · probe-ens | Allerede |
| 91 | Heroen flytter sig, eller fliser går op i heroen | 26/9 heroen låst | Ja · probe-hero, probe-backstage (32 px) | Allerede |
| 92 | Streger i fliser, dobbeltlinjer, streg i en dør | 12/9 »Jeg vil ALDRIG se disse 2 streger« | Ja · probe-sider, probe-backstage | Allerede |
| 93 | Kryds bruges til at slette (skal være skraldespand) | 17/9 (v2082) | Delvis · probe-sider (kryds på side) | Selen: hver knap med title/aria »slet/fjern« skal have skraldespand-SVG, ikke kryds |
| 94 | Rosa eller farver uden for brandfarverne | 26/8 ti flader med rosa; 5/10 sand/fersken/salvie | Delvis · probe-ens (rosa) | Udvid: alle beregnede farver skal ligge i paletten (rød, hvid, husets grå, sand/slate) |
| 95 | Didot uden for heroen, fed Poppins | 15/9 | Delvis · tryghed skaermbilleder.py | Flyt ind i porten: font-family Didot uden for .hero = FEJL; Poppins ≥600 = FEJL |
| 96 | Emoji (også som HTML-tegn, der bliver blå på iPhone) | CLAUDE §4 | Ja · probe-sider, løfte 12 | Allerede |
| 97 | En bred regel rammer felter med egen farve | 21/9 manus-låg; 22/9 rød I dag-flise hvid | NEJ | Se nr. 37 (kontrast-tjek) |
| 98 | Telefonens CSS skrives ind i den maskinkopierede blok og forsvinder | 19/9 (tlf-kopi.py overskriver) | NEJ | Kodesøgning: regler mellem kopi-markørerne må kun komme fra tlf-kopi.py (diff efter kørsel = 0) |
| 99 | Computeren hopper sidelæns ved sideskift / knapper krymper | 10/10 »hver gang jeg klikker … så rykker tingene sig« | Ja · løfte 15 (tjek_stille) | Allerede |
| 100 | Hjem afviger fra det godkendte bud | 20/9 »INTET er det jeg godkendte« (rullet tilbage) | Ja · probe-bud | Allerede (kun Hjem — nye låste bud skal ind på samme måde) |
| 101 | Et billede får runde hjørner eller tekst ovenpå | 8/10 hård regel | Ja · løfte 44 (tjek_designregler: billeder og fotoflader, alle sider 390 + 1440) | Porten: img/baggrundsbilleder med border-radius > 0 = FEJL |
| 102 | Tekst i chips er ikke centreret / små versaler på rødt | 9/10, 5/10 | Delvis · løfte 44 (små versaler på rødt måles; chip-centrering ikke) — FUND 13/10: »I DAG« og den valgte dag (»MAN«) står i 10 px versaler på rødt (Hjem, Kalenderen, Backstage) | Porten: chip-tekst lodret centreret (±2 px); text-transform uppercase på rød baggrund = FEJL |
| 103 | Topbar eller bundbar på en mobilside | 8/9 hård regel | Delvis · probe-backstage (admin) | Udvid til kundeappen |

## H · Tekst og sprog

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 104 | Forbudte ord (kursus, I/jer, moat, doven, Uden titel, Ingenting endnu, strategibygger) | 27/7, 19/9, 5/10, 10/10 | Ja · løfte 12 (tjek_ord) | Allerede |
| 105 | »varen« i stedet for »produkt« | memory aldrig-varen-altid-produkt | Ja · løfte 12 (tjek_ord) — FUND 13/10: 27 steder i koden; flere er Idas manus-ord, venter på Ida | Føj `\bvaren?\b` til tjek_ord REGLER |
| 106 | Køn (hun/han) på en flade | CLAUDE §2 (men 6/10: »hun« om en persona er OK i appen) | NEJ | Føj til tjek_ord for mails og hjemmeside; i appen kun som advarsel, til Ida har afgjort konflikten |
| 107 | Teksten lover noget, der ikke er sandt | 7/10 slet-teksten sagde ikke sandheden (v2529); 12/10 Meta-formularens tekst sagde, at data blev slettet, når det ikke skete | NEJ | Liste over »løfte-sætninger« (slettes, gemmes, sendes, mail) i appen og i Meta/privatlivsteksterne; hver kobles til et tjek, der beviser det (fx sletning → tæl rækker) |
| 108 | Fagord uden forklaring | 11/10 Hans: Hook, Klip, Scene, CTA, Interaktionsrate | Delvis · løfte 12 | Ordliste over fagord → hver forekomst på kundens flade skal have et (i) eller en forklaring på samme skærm |
| 109 | Samme ting hedder to forskellige navne | 11/10 Hans: Kalenderen/Content kalenderen, Fasthold/Fasthold dem, Kommende opslag/aktiviteter | Ja · løfte 37 (tjek_navne: menupunkt = sidens overskrift, kundeapp + Backstage) — FUND 13/10: »Hashtagbanken« åbner »<Virksomhed> hashtagbank« | Navneliste (ét navn pr. ting) → tjek_ord fanger varianterne |
| 110 | Lille begyndelsesbogstav, lige anførselstegn »…« i kundetekst | 6/10, 4/10 | Delvis · løfte 12 (»…« måles på kundens flader 13/10; stort begyndelsesbogstav ikke) | tjek_ord: knapper/etiketter starter med stort; »« i kundetekst = FEJL |
| 111 | Fyldtekst og tomme rubrikker uden værdi | 17/9 hård regel; 25/9 fem former for tomme rubrikker | NEJ (kræver menneske) | Delvis: porten kan måle, at tomme sider har ét tom-kort og ingen åbne felter |
| 112 | Fejlbeskeder på engelsk eller teknisk | 7/10 skift adgangskode (v2538); 10/10 admin-login | Delvis · løfte 41 (tjek_fejltekst: 46 kendte steder må ikke blive flere; oversættelsen venter på Idas ord) | Selen: udløs hver fejl (forkert kode, kort kode, ingen net) → teksten skal være dansk (ordliste over engelske ord) |
| 113 | Kundenavne i offentlige filer eller tekster | 10/10 drejebog-acorns-*.html åbne i repo-roden | NEJ | curl mod b2b/admin for kendte filnavne; git-søgning efter kundenavne i rodfiler, der serveres |

## I · Køb, Stripe og rabatkoder

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 114 | Hele købsrejsen (betaling → mail → login → første side) brækker et sted | — (aldrig kørt helt igennem) | IKKE TESTET · løfte 22 (kritisk) | Stripe testtilstand: testkøb med testkort via Stripe CLI `stripe trigger checkout.session.completed` mod en test-webhook; læs tabellerne før/efter (tryghed trin 4) |
| 115 | Køberen får forkert pakke (Content Studio i stedet for forløbet) | 27/9 stripe-koeb oprettede type contentstudio → ingen lektioner | NEJ | Testkøb pr. betalingslink → virksomhedskoder.type og kunde_def skal passe med linkets metadata |
| 116 | 0-kr-køb markeres som test og skjules | 27/9 (rettet v2378) | NEJ | Testkøb med 100 %-kode → kunden står i CRM som rigtig kunde |
| 117 | Startskema og lås virker ikke for Stripe-købere | 27/9 skema:false | NEJ | Efter testkøb: første login viser ny kode → rundvisning → startskema |
| 118 | Testlink (test=ja) eller testpris ligger live | 27/9 »test=ja på Stripe-linket SKAL fjernes« | Ja · løfte 35 (tjek_live) | Hver morgen: hent hjemmesidens og appens betalingslinks, slå metadata op via Stripe-API (kun læsning) → ingen test=ja |
| 119 | Rabatkoden giver forkert rabat eller gælder forkert produkt | 10/10 JEGERVIGTIGFORIDA kun YGT, 100 % én gang | NEJ | Stripe-API (læsning): kupon, produktbegrænsning, udløb og antal brug pr. kode mod en facitliste |
| 120 | Samme køb oprettes to gange (webhook sendt igen) | — | NEJ | Send samme Stripe-event to gange til test-webhooken → én kunde, én kode |
| 121 | Refundering lukker ikke adgangen | — | NEJ | Stripe testrefund → kundens aktiv-flag/adgang ændres (eller Ida får besked) |
| 122 | Webhooken tager imod falske kald | — (stripe-koeb svarer 401 uden underskrift) | Ja · løfte 18 | Allerede |
| 123 | Prisen på hjemmesiden passer ikke med Stripe | 10/10 WGT 22.995 skal på hjemmesiden | NEJ | Hent pris fra hjemmesiden (curl) og fra Stripe (læsning) → ens |
| 124 | Betalingslinket i en mail er tomt | 10/10 GAMLE_KUNDER_LINK tom indtil linket fandtes | Delvis · løfte 1 (mailen bærer koden) | Udvid: mailen skal indeholde et buy.stripe.com-link, der svarer 200 |

## J · Mails

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 125 | Login- og invitationsmails sendes ikke (for lav grænse, forkert SMTP) | 30/9 kun 2 mails i timen; 4/10 porten tastet som 568 | Delvis · løfte 35 (afsender og grænse; selve udsendelsen måles ikke) | Management API (læsning): SMTP sat, grænse ≥ 100/t; Brevo-API: seneste mails Delivered, ingen bounce |
| 126 | Mailskabelonen er Supabases engelske standard | 4/10 »Your sign-in link« | Ja · løfte 35 (danske emner på de mails, der kan sendes) | Management API: Invite- og Reset-skabelonens emne/tekst skal være Idas danske (sammenlign med Energida-app/mail/) |
| 127 | Linket i mailen sender til forkert adresse | 9/10 »Glemt adgangskode« på admin faldt tilbage til energida.dk | Ja · løfte 35 (adresser b2b/admin) | Management API: Site URL og Redirect URLs indeholder b2b og admin præcist; app-kode bruger `redirectTo` uden skråstreg |
| 128 | Linket i mailen er udløbet, før kunden åbner det | — (udløb sat til 24 t 4/10) | Ja · løfte 35 (udløb 24 t) | Management API: OTP-udløb = 86400 |
| 129 | YOU GOT THIS-mails og Mailchimp-tilmelding virker ikke (funktion ikke lagt op) | 10/10 ygt-mailchimp svarede 404 | Delvis · løfte 18 (404 ses) | curl: hver funktion appen kalder skal svare 401 (findes), aldrig 404 |
| 130 | Mails lander i spam | — (DMARC p=none 30/9) | NEJ | DNS-opslag: SPF, DKIM (Brevo) og DMARC findes; send testmail til en seed-adresse og læs spam-placering |
| 131 | Billeder i mailen er brækket | — (billederne ligger på b2b.energida.dk/mail/) | Ja · løfte 35 | curl hvert billede i skabelonerne → 200 |
| 132 | Mail lovet på hjemmesiden sendes ikke (Drejebogen på mail) | 6/10 hjemmesiden lover det, ikke bygget | NEJ | Liste over mails, hjemmesiden lover → hver skal have en funktion, der svarer 401, og en testkørsel |
| 133 | Mail nr. 3 sendes ikke / to gange | 10/10 (adgangskode_valgt) | Ja · løfte 1 (noteres én gang) | Allerede (selve udsendelsen ikke bygget) |

## K · Instagram og Meta

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 134 | Målingen skriver i kolonner, der ikke findes | 5/10 instagram-maaling v1 (PostgREST 400) | NEJ | Sammenlign felterne i funktionens indsættelse med tabellens kolonner (OpenAPI-skemaet via anon-nøglen) |
| 135 | Forbind Instagram virker ikke (redirect, state, tester) | 5/10 kun bag ?igtest=1 | NEJ | Playwright: tryk Forbind → adressen til Instagram har rigtig client_id, redirect_uri og state; tilbage med falsk state → afvist |
| 136 | Instagram-nøglen udløber, og tallene stopper stille | — (nøgler holder ca. 60 dage) | NEJ | Live-læsning: for hver forbundet kunde, nyeste ig_maalinger < 8 dage; ellers advarsel til Ida |
| 137 | Teksterne til Meta (App Review, data deletion, privatliv) passer ikke med appen | 12/10 Meta-formularens tekst sagde, at data blev slettet, når det ikke skete | NEJ | Hver påstand i Meta-teksterne skrives som tjek (fx »data slettes ved frakobling« → frakobl testkonto → tæl rækker = 0) |
| 138 | Data deletion-adressen findes ikke eller gør intet | — (kræves af Meta) | NEJ | curl data deletion-URL'en → 200; kald med testsignatur → rækker slettes, bekræftelseskode returneres |
| 139 | Testkontoen til Meta kan ikke se det, der skal vises | 12/10 Testkunde A (YGT) har Performance låst | Delvis · løfte 31 (pakke-matrixen) | Del af pakke-matrixen (nr. 44): testkontoen har Performance og Forbind |
| 140 | Instagram-kort henter ikke billede, og ingen opdager det | 10/10 genhentes hver time | NEJ | Live-læsning: andel IG-kort uden billede > 24 t → advarsel |

## L · Edge Functions og sikkerhed

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 141 | En funktion kan kaldes uden login | 20/8 mailchimp-webhook svarede 200 uden hemmelighed | Ja · løfte 18 (kun funktioner nævnt i index.html) | Udvid: hent ALLE funktioner via Management API (ikke kun dem i index.html) |
| 142 | En kunde kan kalde en admin-funktion | — (kunde-admin målt 403 11/10) | Delvis · løfte 17 (A/B-linjen) | Natlig: testkunde-token mod hver admin-funktion → 403 |
| 143 | Databasefunktioner (RPC) kan kaldes uden login | 13/9 dashboard_hilsner/dashboard_citater kunne kaldes anonymt | Ja · løfte 34 (tjek_dbregler: funktioner med ejerens rettigheder, der kan kaldes uden login) | tjek_anon udvides med /rpc/-stierne fra OpenAPI → POST med anon → må ikke svare med data |
| 144 | Brede regler (using true, to anon/public) på tabeller med ejerdata | 6/8 alle tabeller; 24/8 Maskinrummets seks borde | Ja · løfte 34 (tjek_dbregler) | Management API SQL (kun select på pg_policies): 0 skrivende policies for anon/public, 0 tabeller uden RLS |
| 145 | Anonym SKRIVNING til en tabel | — | NEJ | tjek_anon med POST af en tom/ugyldig række i en transaktion, der altid fejler (fx manglende kolonne) — kun læs fejlkoden 401/403 vs 400 |
| 146 | Filer (storage) er offentlige | — (kontrakt §7) | Ja · løfte 34 (tjek_dbregler) | Management API: buckets med public=true på en godkendt liste; curl en kendt fil uden login → 400/403 |
| 147 | Service-nøglen ligger i klientkoden | — (kontrakt §4) | Ja · løfte 35 (forsiderne og sw.js) | Kodesøgning i index.html og alle serverede filer efter `service_role` og JWT med role service_role |
| 148 | Kode (XSS) i en titel kører | — | Ja · løfte 19 | Allerede |
| 149 | Manglende sikkerheds-headers (CSP for scripts) | 10/10 CSP mangler | Ja · løfte 21 (FEJLET) | Allerede |
| 150 | En AI-funktion kan misbruges og koste penge | — (kontrakt §3.6) | NEJ | curl uden login → 401; med testkunde: 20 kald på 1 min → skal begrænses |
| 151 | En lang AI-opgave dør efter 150 sek. uden forklaring | 14/8 Drejebogen blev afbrudt efter 145 s | NEJ | Testkørsel af Drejebog-generatoren på testkunde: hver del < 120 s; fejlbesked bærer sekundtal |
| 152 | Hemmeligheder i git | — | NEJ | gitleaks/grep på hele historikken i pre-push-krogen |

## M · Backup og gendannelse

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 153 | Der findes ingen sikkerhedskopier | 11/10 0 kopier, PITR fra | Ja · løfte 25 (FEJLET) | Allerede |
| 154 | En kopi findes, men kan ikke lægges tilbage | — | NEJ | Månedligt: gendan nyeste kopi til et testprojekt, tæl rækker pr. tabel mod live |
| 155 | Forrige app-version kan ikke tages frem | — | Ja · løfte 25 (tjek_tilbage) | Allerede |
| 156 | Ét kundes data kan ikke hentes tilbage efter en fejl (ingen historik) | 7/10 tabte datoer kunne kun genskabes fra Idas skærmbilleder | NEJ | Natlig egen kopi (pg_dump kun læsning) af kundetabellerne; tjek at gårsdagens fil findes og kan læses |

## N · Ydelse — hænger, fryser, loading-tæppet

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 157 | Tæppet løftes, før siden har tekst (tom side) | 11/9 3 s hjerte + 6 s tom baggrund; 23/9 tom side på admin | Ja · løfte 15 + probe-sider (tæppet) | Allerede |
| 158 | Tæppet løftes aldrig (»Appen kunne ikke starte« oven på en tegnet side) | 13/9 nye kunder; 28/9 og 29/9 Backstage (fem gange) | Delvis · løfte 15 (kundeappen) | Selen: for hver Backstage-side `sessionStorage.dash_side_reload=<side>; reload` → app-klar inden 6 s |
| 159 | En måling fjerner selv tæppet og ser derfor ingenting | 13/9 probe-popups fjernede appLoader | Delvis · probe-popups venter nu | Kodesøgning i tools/: `appLoader.*remove` kun efter målt app-klar |
| 160 | Loadinghjertet fryser | 5/10 (Chrome tegner appen bag hjertet) | NEJ | Playwright screencast: billeder pr. sekund under opstart ≥ 20 |
| 161 | Appen fryser på telefonen | 29/9 Hinges Hus (ikke undersøgt) | NEJ | Playwright med CPU-throttling ×4: lange opgaver > 500 ms under typiske tryk = advarsel |
| 162 | Mikrofonen virker ikke på iPhone | 29/9 Hinges Hus; 30/9 rettelsen slog husets mikrofon fra | NEJ (kræver rigtig telefon) | Kun delvis: selen tjekker, at mikrofonknappen findes i hvert felt og kalder husets mikrofon først |
| 163 | En gate siger »OK« uden at have målt | 11/9 designtjekket var dødt; 15/9 porten | Delvis · sikkerhedschefen skelner IKKE TESTET | Hvert tjek modprøves mod gammel kode (bryd med vilje) — kør modprøven ugentligt |

## O · Telefon mod computer (390 og 1440)

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 164 | Næste skridt ligger langt under folden på telefonen | 11/10 briefen: Næste ~1800 px nede | Ja · løfte 9 (FEJLET) | Allerede |
| 165 | Vandret rulning / felter oven i hinanden på telefonen | mobiltjekket | Ja · probe-sider | Allerede |
| 166 | Computeren er bare telefonen gjort bred (eller omvendt) | 15/9 »desktop bliver mobilen i en dårlig udgave«; 4/9 regel holdt kun i én bredde | Delvis · porten kører begge bredder | Hans-tjek på 1440: native datofelt = FEJL, Hjem-plus skal have samme valg som telefonen, »Kommende aktiviteter« viser opslag på begge (11/10 Hans) |
| 167 | Headless 390 viser noget andet end den rigtige telefon/hjemmeskærmsapp | 2/9, 16/8 (Safari-krom) | NEJ | Playwright med iPhone-profil + standalone-tilstand; endelig kontrol på rigtig telefon |
| 168 | Kalenderen starter forskellige dage på de to flader | 11/10 Hans: mandag på 1440, i dag på telefonen | NEJ | Selen: første synlige dag på 390 og 1440 skal følge samme regel |

## P · Eksterne løfter (hjemmeside, privatliv, Meta)

| Nr | Fejltype | Rigtigt eksempel | Dækket i dag? | Sådan testes automatisk |
|---|---|---|---|---|
| 169 | Hjemmesiden lover noget, appen ikke gør | 6/10 Drejebogen på mail | NEJ | Liste over løfter på energida.dk (curl + tekstsøgning) → hvert kobles til et tjek eller markeres »ikke bygget« |
| 170 | Privatlivspolitikken passer ikke med det, der gemmes (fx Instagram, fejlregistrering, Brevo) | — | Delvis · løfte 21 | Liste over databehandlere i politikken mod faktiske (Supabase, Brevo, Stripe, Meta, Vimeo, Crisp, GA) |
| 171 | Kunden kan ikke slette sin konto eller få sine data (GDPR) | 10/10 »ingen slet min konto« | NEJ | Selen: »Slet min konto« findes; testkonto slettes → 0 rækker med koden/uid |
| 172 | Fejl hos kunden når aldrig Ida | — (bygget 10/10) | Ja · løfte 26 | Allerede |

---

## Tal

172 fejltyper i alt. **Dækket helt: 44 · Delvis: 28 · NEJ: 99 · IKKE TESTET (løfte 22): 1.**

---

## Det, der ikke kan testes automatisk

- **Om det føles rigtigt for kunden** — fyldtekst, tone, om forklaringen hjælper (Idas øjne; Hans-testen giver kun et bud).
- **Idas egne ord** — om en tekst er hendes, om ordlyden er ændret uden at spørge.
- **Rigtige telefoner** — mikrofon, frysning, hjemmeskærmsapp, tastatur, iPhone-baggrund (selen er kun en tilnærmelse).
- **Det rigtige køb med rigtigt kort** og at mailen faktisk lander i indbakken hos en rigtig udbyder (testtilstand dækker det meste).
- **Meta App Review og Business Verification** — Metas afgørelse.
- **Designvalg** — om et nyt bud er godt; porten måler kun, at det godkendte holdes.
- **Login som rigtige kunder** — Claude må ikke logge ind med kodeord på live; A/B-testen kræver Idas tryk, til en sikker testvej er godkendt.
- **Skærmbilleder Ida selv sender** — læs versionsfoden først.

---

## Byg først — de 10 vigtigste huller (efter risiko for betalende kunders data og tillid)

1. **Købsrejsen hele vejen (løfte 22, nr. 114–117)** — testkøb i Stripe testtilstand → webhook → mail → login → første side, med tabeller læst før/efter. Kritisk løfte, aldrig testet.
2. **Appen sletter/nulstiller aldrig data af sig selv (nr. 4, 21)** — genindlæs-og-sammenlign-test med rigtige-lignende data (overskredne datoer, briefs i gang).
3. **Gammel udgave overskriver ny — admin ↔ b2b (nr. 3, 2, 11)** — to faner/to roller på samme brief, autosave efter lukket ark.
4. **Backup der faktisk kan lægges tilbage (nr. 153–156)** — kopier findes ikke; natlig egen kopi + månedlig gendannelsesprøve.
5. **Pakke-matrixen (nr. 44, 46, 47, 139)** — hver pakke logges ind i selen og sammenlignes med facitlisten over sider/menupunkter (fanger »YGT mangler Performance«).
6. **Popup-runden (nr. 57–60)** — hver dør: åbn → kryds → åbn igen; aldrig to lag synlige; ingen usynlig flade over knapper. Fanger begge dagens popup-fejl.
7. **Databasens regler målt direkte (nr. 143–146)** — anonyme RPC-kald, brede policies, offentlige filer, anonym skrivning.
8. **Løfte-tekster bevises (nr. 107, 137, 138, 169, 171)** — hver sætning, der lover sletning/gem/mail (appen, Meta, hjemmesiden), kobles til et tjek; data deletion og »slet min konto« bygges og testes.
9. **Gammel version + ny funktion (nr. 83, 86, 87)** — version N−1 med ny fane; port-status og live-version tjekkes hver morgen.
10. **Usynlig tekst og to kilder til samme kunde (nr. 37, 28, 29)** — kontrast-/dække-tjek på felter med tekst, og facit-sammenligning af kodens og basens kunder/kursus.
