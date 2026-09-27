> **Rører din ændring database, auth, storage eller Edge Functions?
> Læs `ENERGIDA SECURITY CONTRACT.md` i denne mappe FØRST. Den er bindende.**

> **Rører din ændring noget, kunden ser (en side, en popup, en knap)?
> Læs `DESIGNLÅS.md` i denne mappe FØRST. Den seneste lås vinder, og låsning er fejning.**

# DEPLOY: DEN AKTIVE CODE-TRÅD DEPLOYER (Ida 27. september 2026)

**Låsen fra 7. august (»kun sikkerhedstråden må committe og pushe«) er ophævet af Ida 27/9:** »Der er altid kun 1 aktiv code tråd og det er den der skal kunne gøre det.« RLS-oprydningen, som låsen beskyttede, er afsluttet; siden august har den aktive tråd deployet hver dag efter overleveringerne.

Denne fil ligger i repo-roden, fordi en tråd, der starter direkte her, ikke nødvendigvis indlæser `../CLAUDE.md`. Den fil gælder også.

## Sådan deployes

1. Design deployes kun efter Idas klik på det BYGGEDE, set på 390 og 1440 (`../CLAUDE.md` og `DESIGNLÅS.md`).
2. Bump `APP_VERSION`, `#versionsFod` og `version.txt` sammen.
3. `bash tools/designlaas/koer.sh` skal slutte med exit 0.
4. Commit og push med `ENERGIDA_SECURITY_DEPLOY=1` foran — **én git-kommando ad gangen**.
5. Vent, til `b2b.energida.dk/version.txt` viser den nye version, og se ændringen live.

## Det, der stadig gælder

- `.git/hooks/pre-commit` og `.git/hooks/pre-push` afviser commit og push uden `ENERGIDA_SECURITY_DEPLOY=1`. Krogene bliver stående som bremse mod utilsigtede commits.
- **`--no-verify` må ALDRIG bruges.**
- **Finder du uventede ændringer** i deployfilerne eller commits, du ikke selv har lavet: stop, og sig det til Ida. Overskriv intet.
- **`ENERGIDA SECURITY CONTRACT.md` gælder uændret.** Rører en ændring database, auth, storage eller Edge Functions, læses kontrakten først.

Historik: den oprindelige lås og baggrunden står i git-historikken for denne fil og i `../HÆNDELSESLOG - RLS (6.-7. august).md`. Grenen `parkeret-v1013-hjem-design-49b7654` er urørt.
