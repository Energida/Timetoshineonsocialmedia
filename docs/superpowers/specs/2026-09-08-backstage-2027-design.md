# Backstage 2027 — designspec

**Dato:** 8. september 2026 · **Besluttet af:** Ida (klik: »Ja, det er retningen«) · **Tegning:** https://claude.ai/code/artifact/cd235b15-a8bd-4a30-b8e4-05898462a2f7

## Formål
Backstage (admin.energida.dk) bygges op forfra, så navigationen passer til Idas hverdag: alt bruges hver dag, så alt skal være højst to tryk væk, og det, der venter på hende, skal være det eneste, der råber. Regel 8/9: kun funktioner hun bruger.

## Grundstruktur
- **Bundmenu med fire:** Hjem · Kunderne · Energida · Søg. Ordet »Maskinrummet« forsvinder; det, der lå der, bor under Energida.
- **Idas eget Content Studio er ude af Backstage.** Ida bruger kundeappen (b2b.energida.dk, kode ENERGIDA) som kunde og lægger den på hjemmeskærmen. Tøm hovedets »Content-idé« skriver til `content_ideer` med kode ENERGIDA, så idéen lander i kundeappens Idébanken. Noter → Rodebutikken, to-dos → to-do, som i dag.
- **Indbakken går op i forsiden.** Der findes ikke en separat Indbakke-side; klokken øverst ruller til »Venter på dig«.

## Skærm 1 · Forsiden (Hjem)
- Top: dato-linje (»Backstage · tirs. 8. september«), Didot-hilsen (»Godmorgen«), mappe-ikon og klokke øverst til højre som på kundeappen.
- **Venter på dig:** røde kort i swipe-spor med prikker. Typer: Godkend (Ja/Nej), Er det postet? (Ja, postet / Ny dato), kommentarer til dig, to-dos tagget dig, byggekø-punkter der kræver ord. Svaret gives direkte i kortet; kortet forsvinder, når det er svaret. Ingen kort = rubrikken vises ikke.
- **Døre:** gitter i to spalter, hvide fliser med tegnet ikon (husets streg-SVG), Didot-navn og én grå linje, der siger noget sandt lige nu (»5 aktive · 2 venter«, »Sidst: Manus 2027«). Fire døre: Kunderne · Mine rum · Manus & klip · Produkter. Teknik som lav flise i fuld bredde nederst.
- Tallene i de grå linjer skal gøre noget (2/9-reglen); står der intet at sige, står linjen tom.

## Skærm 2 · Kunderne
- Didot-hero »Kunderne«. Chips: Alle · I GOT YOU · Detaildrift · Venter (chip = filter, fyldt rød = valgt).
- Én flise pr. aktiv kunde: rundt felt (kundens logo/initial), navn (Poppins 14), grå linje med produkt og status. Rødt Didot-tal til højre KUN når noget venter på Ida hos den kunde.
- Sortering: venter-tal først, derefter seneste aktivitet.

## Skærm 3 · Én kunde
- Etiket »Kunderne · <produkt>«, Didot-hero med kundens navn.
- Tre ringe (samme ring-motor som kundeappens Hjem): postet af planlagt denne uge · planlagt frem · venter på dig.
- »Venter på dig« for denne kunde som røde kort (samme motor som forsiden, filtreret på kunden).
- »Alt om <kunde>« som lave fliser: Briefs · Kalenderen · Aftaler · Noter · Drejebogen · Kundekortet. Hver flise åbner det eksisterende (kundekort, kalender for kunden, drejebog).
- Lang hvid knap »Se som kunden« → åbner kundens app-visning (eksisterende »Vis kundens version«).

## Skærm 4 · Energida (dig)
- Didot-hero »Energida«. Øverst sendefeltet »Skriv det ned …« = Tøm hovedet (samme Tøm hovedet-motor: note/idé/to-do/app-ønske vælges i det røde kort efter send).
- Pinnede rum som fotofliser (rum kan pinnes; foto valgfrit, ellers gradient-tone).
- Alle rum som liste-fliser: Idas egne rum (MR_RUM), Klipperummet, YOU GOT THIS-modulerne, Produkter (produkt-siderne), Teknik (SQL-kort, Mangler, Byggekøen, arkiverede områder).

## Søg
- Eksisterende søgning (⌘K) som egen fane: ét felt, resultater som fliser (kunde · rum · brief · post).

## Regler, der holdes
Ingen pile · ingen tal i cirkler (tal i ringe er kundeappens facit) · ingen beskrivende tekster · Poppins aldrig fed · rødt kun til handlinger og det, der venter · altid Tilbage (lang hvid knap nederst på telefonen, navsti på computeren) · sendefeltet alle steder, hvor man kan skrive noget til · fliser, aldrig rækker i én kasse · sorte titler med grå forklaring.

## Bevægelse (Emil)
Fliser og rækker: `transform: scale(.97)` ved tryk, 160 ms, `cubic-bezier(0.23,1,0.32,1)`. Røde kort glider ind første gang med 40 ms forskydning (opacity + translateX, ≤ 240 ms). Intet andet animerer. `prefers-reduced-motion`: ingen transform, kun opacity.

## Data og motorer (ingen nye tabeller)
- Venter på dig = union af: GODK_KOE (godkendelser), opslagPostetListe() (forsinkede), kommentarer med hvem ≠ Ida på briefs hun ejer, kunde_opgaver med ansvarlig Ida, mrKoe-punkter markeret »kræver Idas ord«.
- Kunderne = VIRKSOMHEDSKODER + DYN_KODER (aktive). Status pr. kunde = seneste brief-status + venter-tal.
- Ringe pr. kunde = samme beregning som kundeappens Hjem (uge-target, planlagt).
- Energida-rum = MR_RUM + faste indgange (Klipperum, moduler, produkter, Teknik).

## Fejl og tomme tilfælde
- Uden net: forsiden viser det, der er hentet; svar i røde kort lægges i køen (hjem_koe-mønstret) og sendes ved online.
- Ingen kunder venter: rubrikken »Venter på dig« vises ikke. Ingen kunder: »Kunderne« viser sendefelt »Ny kunde …« (eksisterende opret-flow).
- Et rum uden foto: gradient-tone, aldrig et tomt billede.

## Etaper (hver sin deploy, hver verificeret på 390 og 1440)
1. Forsiden: Venter på dig-motoren + fire døre + Teknik-flise; bundmenu med fire. Indbakke-siden bliver en omdirigering til forsiden.
2. Kunderne + Én kunde (ringe, venter, lave fliser, Se som kunden).
3. Energida: sendefelt = Tøm hovedet, pinnede rum, listen. Maskinrummets forside pensioneres (rum og Teknik flyttes ind).
4. Søg som fane. Content Studio ud af Backstage; Tøm hovedets Content-idé → content_ideer (ENERGIDA).
5. Oprydning: gamle sider bag arkiv (data-arkiv), manual + skill + hukommelse.

## Ikke i denne spec
Kundeappen (b2b) røres ikke ud over Tøm hovedets idé-vej. Klipperummets indre, YOU GOT THIS-modulernes redigering og Teknik-siderne beholder deres indhold; de får kun den nye vej ind og Tilbage.
