# OVERLEVERING til tråden på Idas computer (some-app-b3) — 14. september 2026, kl. 10.05

Skrevet af skytråden (claude/second-thread-not-responding-2yngb0), fordi Ida bad om det.
Skytråden er **stoppet**: den pusher ikke mere til `dashboard-og-database`, sætter ikke flere
versionsnumre og tager ingen nye opgaver.

---

## 0 · LÆS DETTE FØRST, ELLERS OVERSKRIVER DU TI VERSIONER

Ida skrev, at du bygger videre **fra v1896**. Det er ikke der, grenen står.

| Gren | Står på | Version |
|---|---|---|
| `dashboard-og-database` | `e88eb61` | **v1906** |
| `produktion` (den Cloudflare deployer) | `e88eb61` | **v1906** |
| `claude/second-thread-not-responding-2yngb0` | `e88eb61` | v1906 |

Efter dit v1896 pushede skytråden **v1897 til v1906**. Alt er målt OK og gik gennem porten.

**Gør derfor dette, før du skriver én linje kode:**

```bash
git fetch origin dashboard-og-database
git log --oneline -1 origin/dashboard-og-database    # skal vise v1906 / e88eb61
git show origin/dashboard-og-database:version.txt    # skal vise 1906
```

Bygger du oven på v1896, forsvinder ti versioner af Idas rettelser fra i dag.

## 1 · VERSIONSNUMMERET ER IKKE EN FRI VARIABEL (lært den hårde vej i dag)

Kl. 09.05 byggede begge tråde et **v1891**. Pushet blev afvist som non fast-forward, og det var
heldigt: fletningen gav **ingen konflikt**, fordi begge sider havde skrevet præcis samme tal i
`APP_VERSION`, foden og `version.txt`. Identiske ændringer flettes lydløst. Resultatet var ét
nummer med to forskellige indhold under sig — og det er lige netop det, versionsvagten på
telefonen ikke kan se.

**Reglen herefter:** hent grenen og læs `version.txt` DERFRA, lige før du sætter nummeret. Aldrig
et nummer valgt ud fra din egen arbejdskopi.

Trioen skal altid stemme: `const APP_VERSION = "NNNN"` · foden `Version 14. september · NNNN` ·
`version.txt`. Porten afviser resten.

## 2 · HVAD DER BLEV BYGGET I DAG (v1888 → v1906)

Hver version har sin egen begrundelse i commit-beskeden og et afsnit i statusnotatet
(`2026-09-12-status-backstage-2027.md`, afsnit 6a til 6j). Kort:

| Version | Hvad |
|---|---|
| v1888 | Idébankens vælger ser ud som en dropdown. Rodårsag: `.bs-filter` satte `background:#fff !important`, og et shorthand nulstiller `background-image` — det slettede husets røde pil. |
| v1889 | Et tomt rum i Maskinrummet er tomt med ÉN lang Tilføj-knap; alt skrives i arket. Programmer bygges fra øvelsesbiblioteket og gemmes som et rum inde i rummet. |
| v1890 | Beskeden om en ny version står på dagskortet (banneret lå på z-index 500, kortet på 600). |
| v1891→v1892 | Hold fingeren inde på en rød I dag-flise = Done eller Udsæt. Omnummereret efter sammenstødet. |
| v1893 | **Service-workeren tjekker version.txt FØR den svarer.** Kunden får den nye app af sig selv, uden `?nulstil`. |
| v1894 | Rettelse af v1893: den ventede på den store fil, før den svarede, så skærmen stod tom i op til seks sekunder. Nu svares den gemte kopi straks, og den nye hentes ved siden af. |
| v1895 | Admins rum-side hedder Backstage, og datoen står over heroen. |
| v1897 | De tre vedhæft-knapper i arket er blevet ét plus (som i Beskeder). Arket blev 160 px lavere. |
| v1898 | Chippen »Nyt opslag« er ude af kundens ark (den gjorde præcis det samme som Content-idé). |
| v1899 | Feltet i arket spørger »Hvad har du på hjertet?« |
| v1900 | Siden »Briefen« er slettet, og briefoverblikket er delt op, så hver del er sin egen flise. |
| v1901 | Inspiration er væk fra kalenderen på telefonen. |
| v1902 | UX-politiets otte små knapper er blevet lange — og reglen er nu en vagt. |
| v1903 | Etiketten hører til det, den indleder: 24 px op, 8 px ned. Også en vagt. |
| v1904 | »Seneste 7 dage« er de sidste 7 dage: opslag mod ugemålet + fordeling på søjler og formater. To af de tre gamle ringe var månedstal. |
| v1905 | Arket kan trækkes ned og lukkes. Luk-knappen bliver. |
| v1906 | Refleksionen er tre spørgsmål, man swiper imellem. Ida-linjen kun til I GOT YOU. |

## 3 · VAGTERNE (målingen) — kør dem, og lad dem kunne fejle

```bash
bash tools/designlaas/koer.sh
```

Den bygger selen uden for repoet, serverer den på en **ledig** port, verificerer at det, serveren
leverer, ER det byggede `APP_VERSION`, og kører to prober i headless Chromium på 390:

- `probe-popups.js` — **19 døre**: skriveformer skal være arket, intet synligt kryds, lang Luk,
  ingen helskærm, hver knap mindst 44 px og mindst 85 % af kortets bredde. Plus bundnavet, hvor
  telefonens hjemme-indikator simuleres med 34 px.
- `probe-sider.js` — **15 sider**: tæppet skal lette af sig selv, ingen vandret sejlads, 44 px
  trykfelter, intet synligt kryds, ingen emoji, ingen streger inde i fliser, **kun lange knapper**
  (under 60 % af skærmens bredde er en fejl) og **etiketternes rytme** (nærhedsreglen).

Kun `SELE LAAS OK` **og** `SELE SIDER OK` betyder OK. GitHub-actionen kører det samme ved hvert
push til `dashboard-og-database` og skubber kun grønne commits videre til `produktion`.

**Ny dør eller ny side? Tilføj den i proben i samme commit.** En dør, proben ikke kender, er ikke målt.

**Og det vigtigste om målinger:** en regel, der ikke kan fejle, er ingen regel. Da jeg skrev
nærhedsreglen i dag, satte jeg den gamle afstand tilbage og tjekkede, at målingen SAGDE FEJL,
før jeg stolede på den. Første udgave fangede netop ikke Idas fund, fordi den sammenlignede
søskende i markuppen i stedet for geometri. Gør det samme med alt, du bygger som vagt.

**Det selen ikke kan:** registrere en service worker. Rettelser i `sw.js` måles for sig med en
rigtig worker gennem `playwright-core` (installeret i skrivebordsmappen, ikke i repoet) — se
statusnotatets afsnit 6f. Strategibyggeren (`strategibygger.html`) er også en anden fil og måles
for sig.

## 4 · REGLERNE, DER BINDER

1. **`CLAUDE.md` i repo-roden**: deploy- og commitlåsen fra 7. august. Hooks afviser commit og
   push, medmindre den enkelte kommando kører med `ENERGIDA_SECURITY_DEPLOY=1`. **`--no-verify`
   må ALDRIG bruges.** Teksten erklærer stadig låsen aktiv, selv om der deployes dagligt; kun Ida
   kan beslutte, at den skal skrives om.
2. **`ENERGIDA SECURITY CONTRACT.md`**: bindende for database, auth, storage og Edge Functions.
   Intet af dagens arbejde har oprettet en tabel eller en policy. Alle skrivninger kvitteres med
   `.select()` og en rækketælling — Postgres kaster ikke ved en afvist skrivning.
3. **`DESIGNLÅS.md`**: den seneste lås vinder. Læs den FØR du rører noget, kunden ser. Nye låse
   fra i dag: et tomt rum er tomt · et langt tryk er en genvej, aldrig den eneste vej · arket kan
   trækkes ned · refleksionens tre trin · etiketten hører til det, den indleder · målingen holder
   øje med de lange knapper (med to navngivne undtagelser: `.kal-fpill` og `.lek-top`).
4. **Sådan arbejder Ida:**
   - Spørgsmål til hende skal være **klik-valg**, aldrig åbne spørgsmål.
   - **Ingen lang bindestreg** i det, du skriver til hende: »det signalerer alt for meget AI«.
   - Svar på dansk, kort, og skil altid **målt** fra **læst**. Hun har fået nok af påstande.
   - **Produktmodellen står i koden** (`PRODUKT_FUNKTIONER`, `nkPakke`, `erForloeb`), og hun
     bliver vred, hvis man spørger hende om sine egne produkter i stedet for at læse dem:
     `ttsosm` = YOU GOT THIS · `detaildrift` = YOU GOT THIS · DETAIL · `igotyou` = I GOT YOU ·
     `ldit` = WE GOT THIS · `contentstudio` = CONTENT STUDIO.
   - **B2b er kundeappen, også når hun selv er logget ind.** Hendes admin-lister må ikke kunne nås derfra.

## 5 · FÆLDER, JEG RAMTE I DAG (gentag dem ikke)

- **Hendes telefon kører ofte en gammel build.** Flere gange i dag pegede hun på noget, der var
  rettet timer før. Tjek foden nederst til højre i skærmbilledet, før du leder efter fejlen i
  koden. v1893 og v1894 skal fange det fremover.
- **Et background-shorthand nulstiller `background-image`.** Det slettede en pil, ingen kunne se
  manglede (v1888). Sæt `background-color`, når det kun er farven, du vil have.
- **Selen har en stub-base.** Kvitteringer måles på koden, ikke på Supabase. Skriv det, i stedet
  for at påstå at en skrivning virker.
- **`e.waitUntil` med en stor fil dør på Safari.** Det var roden til hele stale-build-historien.
- **Mine egne rettelser kan skabe nye fejl.** v1893 gav en tom skærm i seks sekunder, og Ida fandt
  den to minutter efter deployet. Mål konsekvensen, ikke kun det, du ville rette.

## 6 · DET, DER VENTER (Idas egne beslutninger først)

**Hun skal tage stilling:**
1. **Bundmenuen i admin.** Hun vil have Kunder, Salg og Content Studio som de første tre. Menuen
   har fire pladser plus »Mere«, og den fjerde er ikke valgt. Spørgsmålet ligger i tråden med
   klik-valg: Hjem, Søg eller Energida. **Bemærk samtidig (målt):** bundnavet tager de første fire
   punkter fra sidebaren i DOM-rækkefølge, Content Studio er `display:none` i sidebaren siden 8/9,
   og Salg, Food Studio, Workout Studio og Mindful Studio har slet intet menupunkt — de findes kun
   som områder i Maskinrummet. Rum kan flyttes ind under et område med »Flyt til …«.
2. **Lektionssidens titelbjælke** har et lille TILBAGE øverst, og navigationslåsen siger »ingen
   topbar«. Bjælken bærer også modulets navn og fremdriften, så det er en beslutning om hele
   lektionsfladen. Står som navngiven undtagelse i proben, så den ikke ligger og lyver.
3. **Målgrupper på Performance.** Hun vil se fordelingen på målgrupper. Det kan ikke bygges endnu:
   et opslag har ingen målgruppe i basen (personaerne bor i `lektion_svar_5-3`). Briefen skal
   først have et målgruppe-felt.
4. **Sæt og reps pr. øvelse** i rummenes programmer kræver ét SQL-kort. Ikke bygget.

**Ikke lukket i øvrigt:** admin-dashboardet på computeren (hendes ord 13/9, aldrig undersøgt) ·
den ægte gennemgang med et login (netværkspolitikken skal åbnes for b2b.energida.dk,
admin.energida.dk, Supabase-værten, funktions-værten, `cdn.jsdelivr.net`, `fonts.googleapis.com`,
`fonts.gstatic.com`) · SQL-kortet til `dashboard_hilsner()` er ikke kørt, og `cs_velkomst` står tom ·
modul 5 og 6 siger stadig »I« og »jer« · der findes ingen notifikationer · beskeden om en ny
version prøver ikke igen af sig selv, hvis hun trykker »Ikke nu« · »Skriv løs« står stadig i
Content Studios idéfelt, Mindful Studios idéfelt og dagens fang (arket er lavet om, de tre er ikke).

**Hele køen, punkt for punkt, med hendes egne ord og status:** statusnotatet, afsnit 6g
(»Idas rettelser og beskeder 13/9 og 14/9«), nu 42 punkter.

---

Skytråden har ikke pushet noget til `dashboard-og-database` efter v1906 og gør det ikke.
Denne fil ligger kun på `claude/second-thread-not-responding-2yngb0`.
