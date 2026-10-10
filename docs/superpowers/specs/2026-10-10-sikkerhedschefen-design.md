# /sikkerhedschefen — design

Godkendt af Ida 10. oktober 2026. Kilde: Claude Doc »Sikkerhedschefen« (https://claude.ai/code/artifact/c210f0e3-77f4-4313-95f9-cb1473319c17, rev 3).

## Formål

Én kommando, der siger »KLAR TIL NYE KUNDER« kun når alle kritiske løfter er BESTÅET på den præcise liveversion. Et kritisk løfte, der er IKKE TESTET, blokerer. Resultatet gælder versionsnummer + tidspunkt; en ny deploy gør det ugyldigt.

## Kommandoer

- `/sikkerhedschefen` — lag 1 + 2 automatisk (~35 min.), beder Ida trykke Selvtest (lag 3) og sende billedet, kører datavagt-SQL via Ida, samler rapporten.
- `/sikkerhedschefen hurtig` — kun lag 1 (~2 min.), til hver deploy. Siger aldrig »klar«.

## De tre lag

1. **Koden** (`tools/sikkerhedschefen/lag1.py`): git rent og pushet · version.txt = APP_VERSION = live version.txt = sw.js-version · syntaks (alle `<script>` gennem node) · designport (`tools/designlaas/koer.sh`) · skriv-tjek med liste over gemmeveje uden kvittering (hver er en mangel, intet loft) · én gem-motor pr. tabel (admin ↔ b2b) · døde referencer (onclick-navne og getElementById uden fund).
2. **Testversionen** (`tools/sikkerhedschefen/lag2/`, selen fra `tools/designlaas/byg-sele.py`): opdigtede, realistiske testdata (50 idéer m. rigtige søjlenavne, opslag i dag/i går, møder) · hvert felt skrives/gemmes/genindlæses/læses tilbage · afvisnings-stub (basen svarer fejl/0 rækker) → tilbagerulning + rød bjælke + teksten står · net-ud midt i gem · samme indhold i to faner · gammel appversion i cache opdateres · status frem/tilbage · idéer flytter sig ikke · møde opret/ret/slet uden dubletter · opgave m. teamchips · Ja/Nej i Indbakken · hver knap trykkes (`tools/tryghed/knapper.py`) · skærmbilleder (`tools/tryghed/skaermbilleder.py`) · Hans-tjek (næste skridt over folden, kvittering, Tilbage, fagord, tomt Gem). Begge bredder 390 (iframe, ikke window-size) og 1440.
3. **Live** — knappen Backstage · Teknik · **Selvtest** kører i Idas browser som hende mod TESTKUNDE-A og TESTKUNDE-B: skriv/læs/flyt/slet + A forsøger at læse, ændre og slette B's rækker og filer (skal afvises). Viser BESTÅET/FEJLET/IKKE TESTET pr. tjek og rydder sine egne testrækker. Dertil datavagtens fire læse-SQL'er (0 rækker hos alle kunder) og Dashboard-aflæsninger (Auth/session, backup, region), som Ida kører og sender.

## De 26 løfter

Ordret som i Claude Doc'en, rev 3: 1–8 data og funktion, 9–13 Hans, 14–16 udrulning, 17–21 sikkerhed og GDPR, 22–26 nye kunder, net og vejen tilbage. Kritiske (blokerer »klar«): 1, 2, 3, 4, 5, 6, 14, 15, 17, 18, 19, 22, 23, 24.

## Rapporten

Ét Artifact-ark: øverst KLAR / IKKE KLAR + version + tidspunkt; derunder hvert løfte BESTÅET / FEJLET / IKKE TESTET; FEJLET med side, felt og skærmbillede; nederst altid »ikke målt«. Kommandoen siger aldrig »det virker« om noget, der ikke blev kørt.

## Grænser

Claude logger aldrig ind på live med et kodeord, rører aldrig rigtige kunders data og sletter intet af sig selv. Selvtesten skriver kun på TESTKUNDE-A/B. Ida opretter testkunderne og kører SQL'en.

## Ida gør

1. Opretter TESTKUNDE-A og TESTKUNDE-B med én testbruger hver (vejledning følger).
2. Vælger fejlregistrering (anbefalet: egen fejl-tabel i Supabase).
3. Kører læse-SQL og Dashboard-aflæsninger, når de sendes.

## Lukkes før launch (uanset kommandoen)

Åbne drejebogs-filer med kundenavn i roden · ingen »slet min konto«/eksport · fejlregistrering findes ikke — alle tre ikke verificeret live endnu.

## Byggerækkefølge

1. Lag 1 + `hurtig` · 2. Lag 2 (testdata, afvisnings-stub, net-ud, to faner, gammel version, Hans-tjek) · 3. Selvtest-knappen · 4. Samle-rapporten · 5. Skill-filen `.claude/skills/sikkerhedschefen/SKILL.md`.
