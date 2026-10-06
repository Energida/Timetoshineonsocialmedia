# Planlægning = ét kort, der skifter (6/10)

Idas klik: grundgreb 1 »Ét kort, der skifter« + »Ja, byg det« på de tre tilstande (Artifact 23SBS3mxpQhAjisfLW6gmS).
Kunden: 65 år, travl, hader sociale medier. Siden viser aldrig mere end én ting at gøre.

## Tilstande (planDashTegn)
1. **Første gang** — `rytme().uge` mangler. Kort »KOM I GANG« · »Hvornår har du en time i ro hver uge?« · underlinje · ugedage som chips (mandag forvalgt) · tider som chips (8.00 · 9.00 · 10.00 · 13.00 · 16.00, 9.00 forvalgt) · rød »Sæt den i kalenderen« → `rytmeGem('uge', d, t)` (samme gem + udrulning som rytmeArk).
2. **Før timen** — rytme sat, næste uge ikke planlagt (`PR_STATUS.gjorte` mangler næste uges nøgle). Rød flise »Næste skridt · Planlæg næste uge · <dag dato kl.> · cirka 1 time« + hvid »Start nu« → `planRitStart()`. Er næste møde månedens (inden for 7 dage): »Planlæg næste måned · cirka 2 timer« → `planRitStart('maaned')`. Under: »Sådan går timen« = fem fliser (min · titel · én linje). Link »Ret din faste tid«.
3. **Efter timen** — næste uges nøgle i `gjorte`. Hvid flise m. rødt flueben »Næste uge er planlagt« · »Godt gået. Næste gang er <dag dato kl.>.« · flisen »Din uge« = de næste 7 dage fra IDEER (brief.briefDag → »Skriv briefen til X«, brief.optagedag → »Optag: X«, dato → »Post: X«). Link »Ret din faste tid«.

»Ret din faste tid« = valgFliseArk med Ugens planlægning · Månedens planlægning · Svar på kommentarer · Find inspiration · Opdater profilen → rytmeArk(k).

Ude af siden: Denne uge, Kommende planlægning, Din rytme-listen, Overblik, døre (de bor i menuen og i timen). Motorerne (rytmeUdrul, rytmeFlyt) er urørte.

## Test
Selen: de tre tilstande på 390 + 1440; gem i tilstand 1 skriver MAALS.rytme + 4 møder; porten EXIT 0. Rigtig base: kunde_aftaler insert/update som kunde allerede målt 6/10 (rulles tilbage).
