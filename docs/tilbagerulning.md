# Tilbagerulning af appen (løfte 25)

Bruges kun, når en ny version gør skade hos kunderne, og kun på Idas ord. Data i basen røres ikke.

1. Find den sidste gode version: `git log --oneline -- version.txt | head` (fx `v2733` = commit `57ac427`).
2. Hent dens app-fil: `git show 57ac427:index.html > index.html`
3. Giv den et NYT versionsnummer (aldrig et gammelt — ellers henter telefonerne den ikke): sæt `const APP_VERSION` og `version.txt` til næste nummer.
4. Skriv i DESIGNLÅS.md øverst: »vNNNN = tilbagerulning til v2733, fordi …«.
5. Porten: `bash tools/designlaas/koer.sh` (16 OK).
6. `ENERGIDA_SECURITY_DEPLOY=1 git commit …` og `ENERGIDA_SECURITY_DEPLOY=1 git push origin HEAD:dashboard-og-database` — én kommando ad gangen.
7. Vent til `https://b2b.energida.dk/version.txt` og admin viser det nye nummer.

Sikkerhedschefen beviser hver gang (`tools/sikkerhedschefen/tjek_tilbage.py`), at den forrige version kan bygges og starter.
Gendannelse af DATA (Supabase-backup) er ikke afprøvet.
