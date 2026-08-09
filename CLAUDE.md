> **Rører din ændring database, auth, storage eller Edge Functions?
> Læs `ENERGIDA SECURITY CONTRACT.md` i denne mappe FØRST. Den er bindende.**

# DEPLOY- OG COMMITLÅS — AKTIV (HÅRD, Ida 7. august 2026)

**Denne fil ligger i repo-roden, fordi en tråd, der starter direkte her, ikke nødvendigvis indlæser `../CLAUDE.md` i projektmappen ovenover. Den fil gælder stadig — læs den også. Ved konflikt vinder den strengeste.**

**Filen indeholder ingen appkode. Den er en spærring, ikke et dokument.**

---

## Reglen

**Kun den aktive sikkerhedstråd må committe ændringer til deployfiler eller pushe.** Låsen gælder, indtil **sikkerhedstråden dokumenterer, at den er ophævet** — ingen anden tråd kan ophæve den, og den udløber ikke af sig selv.

Alle andre tråde:

- må gerne **analysere** og **redigere separate dokumenter**
- må **ikke** røre `index.html`
- må **ikke** røre `version.txt`
- må **ikke** røre deploykonfiguration (`_headers`, `manifest.webmanifest`, `sw.js`, `.claude/launch.json`)
- må **ikke** ændre versionsnumre — hverken footeren, `APP_VERSION` eller `version.txt`
- må **ikke** committe
- må **ikke** pushe

**Har du allerede arbejde liggende:** lad det ligge som ucommitteret ændring, og sig til Ida. **Overskriv intet.**

**Finder du uventede ændringer** i deployfilerne, eller commits du ikke selv har lavet: **stop, og rapportér dem til Ida.**

---

## Hvorfor både commit og push er låst

`.git/hooks/pre-push` afviser ethvert push. `.git/hooks/pre-commit` afviser ethvert commit. Begge slipper kun igennem, når den enkelte kommando køres med `ENERGIDA_SECURITY_DEPLOY=1`. Der ligger ingen hemmelighed i hookene, og der findes ingen permanent bypass.

**`--no-verify` må ALDRIG bruges.** Det omgår låsen i stedet for at åbne den.

En lås på push alene var ikke nok. Den 7. august kl. 16.50 committede en anden tråd „v1013: Hjem-fanen faar hierarki og luft“ lokalt på den delte gren. Commiten kunne ikke pushes — men den lagde sig som **forælder** til sikkerhedstrådens arbejde, og så kunne sikkerhedsændringen ikke deployes uden også at sende en uverificeret designændring til produktion. Den commit er parkeret på grenen `parkeret-v1013-hjem-design-49b7654`; intet er gået tabt.

---

## Baggrunden

Der kører en RLS-sikkerhedsmigrering. En åben database blev fundet 6. august, og arbejdet med at lukke den er ikke afsluttet. Under det arbejde deployede andre tråde **tre gange** midt i migreringen — v1009, v1011 og et genbrug af v1012 — og committede en fjerde gang lokalt.

Hele forløbet står i `../HÆNDELSESLOG - RLS (6.-7. august).md`. Rækkefølgen for det resterende arbejde står i `../MASTERPLAN - vejen til strategibyggeren.md`.

---

## Når låsen ophæves

**Slet IKKE denne fil.** Den indlæses automatisk af enhver tråd, der starter i repomappen, og den bærer henvisningen til `ENERGIDA SECURITY CONTRACT.md`.

Når deploylåsen ophæves, **erstattes indholdet** af henvisningen øverst — filen bliver stående som pegepind.

**Kontrakten gælder uændret, når låsen er væk.** Den står også som punkt 0 i `../CLAUDE.md`, som er den permanente henvisning.
