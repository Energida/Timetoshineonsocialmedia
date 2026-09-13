# Overlevering: live-gennemgangen af Content Studio (13. september 2026)

**Fra:** en Claude Code-tråd i skyen (Ida i Grækenland, computeren hjemme lukket).
**Til:** en tråd på Idas egen computer.
**Hvorfor:** skyen kan ikke nå `b2b.energida.dk` eller Supabase (proxyen afviser), og et login kan ikke sendes over. På Idas maskine kan tråden åbne appen i en browser, og **Ida taster selv adgangskoden ind i det vindue**, så ingen adgangskode skifter hænder.

## Læs først

1. `CLAUDE.md` og `DESIGNLÅS.md` i repo-roden. Designlåsen er ny (13/9) og bindende.
2. `docs/superpowers/plans/2026-09-12-status-backstage-2027.md`, afsnit 5c til 5u. Alt bygget 13/9 står der, version for version.
3. `ENERGIDA SECURITY CONTRACT.md`, hvis du rører base, auth, storage eller Edge Functions.

**Deploylåsen i `CLAUDE.md` (7/8) står stadig som aktiv i teksten.** Ida har givet udtrykkeligt mundtligt lov til at committe og deploye hele 13/9 (»Ja du må deploye«). Spørg hende med et klik-valg, før du pusher, og foreslå samtidig, at låseteksten skrives om, så den ikke stopper hver ny tråd.

## Sådan arbejder du med Ida

- **Alle spørgsmål som klik-valg** (AskUserQuestion). Hun er på telefon.
- **Aldrig den lange bindestreg** i det, du skriver.
- Dansk. Kort. Sig hvad der faktisk er målt, og hvad der ikke er.

## Status 13/9: v1859 til v1878 er deployet

Lektionssiden (rejse, lås, video i fuld skærm, stjerner og kommentar), oplæsning på briefen, billede og link på idéer, Indbakken begge veje, ønsker til appen med svarvej, Drejebog-synk, mål for prøvereels og story-dage, refleksion dagen efter, **planlægningsdagen som fem trin**, skærmbillede plus link på Inspiration, velkomsthilsnerne fra Content Studio, og **alle kundens skrivefelter lagt om til arket**.

**Designlåsen (13/9) er ny og vigtig:** `DESIGNLÅS.md` er reglerne, `tools/designlaas/koer.sh` er målingen (17 popup-døre på 390), og `.github/workflows/designlaas.yml` er porten: hvert push til `dashboard-og-database` måles på GitHub, og kun commits, der siger OK, skubbes til grenen `produktion`, som Cloudflare Pages deployer fra. Kør `bash tools/designlaas/koer.sh` før hvert push, der rører noget synligt.

## Opgaven: den live gennemgang

Alt fra 13/9 er målt i selen med en **falsk base**. Fire ting kan kun den rigtige base svare på, og de har hver deres ærlige fejlbesked i appen, så de er lette at se:

| Hvad | Hvor | Går det galt, siger appen |
|---|---|---|
| Kunden må UPDATE sin egen række i `inspiration` (skærmbillede på et link bagefter) | Inspiration, det grå felt på et linkkort | »Kunne ikke gemme skærmbilledet på kortet« |
| Ida (admin) må UPDATE en anden kodes `skema_svar` (svar på et ønske til appen) | Backstage, Venter på dig, rækken Ønske til appen, knappen Svar | »Kunne ikke gemme. Prøv igen.« i arket |
| Backstage må LÆSE `skema_svar` på tværs af koder (lektionsfeedback og ønsker) | Backstage, kundens side og Venter på dig | rækkerne mangler helt |
| `dashboard_hilsner()` findes og svarer | kundens forside | klokkehilsenen i stedet for Idas egen |

**SQL-kortet for hilsnerne er kørt 13/9, men funktionen svarede `0` hilsner.** Listen `cs_velkomst` er tom i basen. Første opgave: find ud af, om Idas hilsner ligger et andet sted (`select kode, navn, skema from public.skema_svar where skema ilike '%velkomst%' or skema ilike '%hils%'`), eller om de skal skrives ind under Backstage → Content Studio → Velkomsthilsner med flueben.

### Sådan kører du gennemgangen

1. Åbn `https://b2b.energida.dk` i en browser, du styrer (Playwright med `headless: false`, så Ida kan se med).
2. **Bed Ida taste login ind i vinduet.** Brug en testkonto, ikke en rigtig kunde. Der ligger testkonti i basen (`resettest@bruger.energida.dk`). Du skal aldrig bede om adgangskoden i chatten.
3. Gå kunderejsen igennem i denne rækkefølge, og tag skærmbillede hvert sted:
   - forsiden (står Idas egen hilsen eller klokkehilsenen?)
   - swipe op på dagskortet og plusset i bunden: begge skal åbne **arket** »Tøm hovedet · Ny idé« med chips, aldrig en helskærm med lange piller
   - gem én ting pr. chip: Content-idé, Set noget fedt (med et link), Skrevet ned, Nyt opslag, Ugetema. Hver skal kvittere med et flueben og en sætning
   - Inspiration: sæt et skærmbillede på et linkkort med det grå felt
   - Idébanken og en brief hele vejen
   - planlægningsdagen: sæt `plan_dato` til i dag under Målsætninger, gå de fem trin igennem, og se, at opslagene faktisk lander i kalenderen
   - Indbakken: »Er det postet?« → Ja, postet → »Hvordan gik det?« som ark med to chips
4. Skriv en liste over det, der fejlede, med skærmbillede og den præcise fejlbesked. Ret det, der er kode. Er det RLS, skriv et SQL-kort efter husets mønster (se de eksisterende kort i `index.html`, søg `sqlk_`), og lad Ida køre det.

### Bagefter, hvis der er tid

- **Modul 5 og 6 siger stadig I og jer** i spørgsmålene i basen. Det er data, ikke kode. Rettes i Backstage.
- **En helt ny kunde fra nul:** opret en kode, log ind første gang, de 19 spørgsmål, Forløbet, første brief. Ingen har prøvet den rejse i ét stræk.
- **Designlåsens måling kender kun popups.** Hjem, Content, Idébanken, Inspiration og lektionssiden bør ind i `DOERE` i `tools/designlaas/probe-popups.js`.
- **Notifikationer findes ikke.** Planlægningsdagen og »Er det postet?« står kun i appen. Mail fra basen er den billige vej og er kontraktarbejde.

## Selen (test uden base)

`tools/designlaas/byg-sele.py <mappe>` bygger appen med en falsk Supabase i en mappe uden for repoet. Server den på 4600 og åbn `sele.html?vis=kunde&fil=index-sele.html&bred=390&kode=<urlencoded js>`. Se `docs/superpowers/plans/2026-09-12-status-backstage-2027.md`, bilaget. **Selen må aldrig committes som filer.**
