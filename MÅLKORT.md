# MÅLKORT — ét facit pr. element (4. november, Ida: »kontrol af ALT, før det bygges … højder, farver, fonte og størrelser på alt, også knapper«)

Målt i appen 4/11 (selen, briefens fem sider, 390 og 1440) og valgt ud fra det, der var mest brugt og stemmer med DESIGNLÅS.md og CLAUDE.md §4. `tools/designlaas/probe-maal.js` måler tabellen nedenfor i porten (`koer.sh`) — én afvigelse = FEJL. Nyt element = mål skrives HER først, derefter bygges det.

Kilden i koden er **MÅLKORT-BLOKKEN** sidst i det første `<style>` i `index.html` (`#briefWrap#briefWrap#briefWrap` slår alle ældre lag uden nye !important-stakke). Ældre bud-regler (body[data-felt/forkl/hook/guide/klip], 375 døde linjer, aldrig sat af appen) er slettet.

| Element | Facit |
|---|---|
| **Flise** (.sk-q, .klip-kort) | hvid · radius 20 · luft 18 øverst/nederst, 20 siderne · afstand til næste flise **10** · skygge `--mb-skygge` · ingen ramme |
| **Flisetitel** (spørgsmål, »Tekst på coverbilledet«, »Hashtags«, »Hvem taler opslaget til?«) | Poppins **18** (telefon **16**) / 400 / #1A1A1A / linjehøjde 1,35 · **16** til første indhold · ingen streg, når der kun står ét felt under |
| **Klip-etiket** (»Klip 1 · Hook«, »Klip 2«) | Poppins 10 / 400 · versal · bogstavafstand 1,5 · #9A9590 · højre side: ikonknapper 36 · **én** streg under (1 px #E3E2DE, 12 over / 16 under) |
| **Felt-etiket** (»Tekst på skærmen«, »Det, man ser«, »Manus«) | Poppins 13 / 400 / #6F6B66 · **8** til feltet |
| **Hjælpetekst** | Poppins 12,5 / 400 / #6F6B66 · 4 under titlen |
| **Felt** (.sk-input) | Poppins 13 / 400 / #1A1A1A · radius 14 · 1 px #DEDAD4 · luft 10/12 (40 til mikrofon til højre) · **mindst 44 høj** · aldrig kursiv · mikrofonen inde i feltet, grå |
| **Feltflugt** | alle felter i samme flise starter og slutter på samme x (hook-valgets cirkel ligger INDE i feltet til venstre, 28 rund, 8 fra kanten) |
| **Chip** | højde **36** · Poppins 13 / 400 · #6F6B66 · 1 px #DEDAD4 · radius 999 · luft **16** hver side · hvid · gap mellem chips 8 · én linje · valgt = mørkere grå ramme (aldrig fyldt) |
| **Plus-chip** (»Tilføj forslag/klip/scene/CTA«) | som chip + plus 14 × 14 grå, **6** mellem plus og tekst (ikke 8 + 8), venstrestillet i rækken (aldrig højre), 12 over |
| **Knap, grå** | pille radius 999 · hvid · 1 px #DEDAD4 · tekst #6F6B66 · Poppins 12–13 / 400 |
| **Knap, rød** | pille · #FC2404 · hvid tekst · gør noget færdigt |
| **Knaphøjder** | ikon-/chip-/lille knap **36** · status/dropdown/bundknap i briefen **40** · knap i ark/popup **44** · rød primær på tilføj-felt **44** |
| **Ikonknap** | rund **36 × 36** · hvid · 1 px #DEDAD4 · streg #6F6B66 · ikonet 16 i midten · trykfelt 44 via ::before |
| **Centrering (alle knapper)** | tekstens lodrette midte = knappens midte (≤ 1 px) · samlet ikon + tekst vandret i midten (≤ 1,5 px) · ikon og tekst flugter lodret. Mønster: `display:inline-flex; align-items:center; justify-content:center` (`:where(.dbtn)` nederst i basis-CSS) — aldrig lodret polstring 11/11 på en inline-block med tvunget højde |
| **Skillelinje i flise** | 1 px #E3E2DE · KUN mellem forskelligt indhold (hook-delene, klippets felter) og under etiketten, når der er tekst under · **aldrig to streger i træk** (< 24 px imellem) · ingen streg i en dør · ingen streg over et enligt felt |
| **Ikonrække (briefen, computer)** | KUN ⋯ (ikonknap 36) yderst til højre; øje, blyant, kommentarer, del, slet står som rækker i menuen (`briefBaandMereArk`, samme menu som telefonen) |
| **Hero-titel, mus** | `cursor:default` (pilen) på computer; `text` kun mens titlen rettes |
| **Sideskift** | så længe et skift holdes, dækker `#skDaek` (side-baggrund #FAF9F5, hjerte-puls efter 0,4 s) hele indholdsfladen; den gamle side ses aldrig |
| **Hjem** | overskrift→flise 16 · flise→flise 10 · sektion→sektion 24 · radius 20 · overskrifter 16 høje |
| **Skrift/farver** | Poppins 300/400, aldrig fed · Didot kun i heroens titel · rød #FC2404 · #1A1A1A · #6F6B66 · #9A9590 · #DEDAD4 · #E3E2DE · side #FAF9F5 |

## Tilføjet 4/11 (anden runde)
| Element | Facit |
|---|---|
| **Hjem computer, bud 4B** | panel **#F6F4F1** radius 28 luft 12, 24 mellem paneler · flise i panel hvid, **80 høj**, radius 20, ramme 1 px **#E3E2DE**, ingen skygge, 10 mellem · overskrift→panel 16 · rød datobjælke 44 (#FC2404, hvid 13/400) · datoboks 56 · pile runde 32 · første overskrift flugter med datofliserne (≤ 1 px) |
| **Telefonens oplysnings-chips (briefoversigt)** | under statuslinjen, én linje, swipe sidelæns, chip 36 (13/400 #6F6B66), kun udfyldte, ingen +, ingen ikon, kun visning; coveret 228 |
| **Story-række** | [status ⌄] [dato] samme højde **36**, 8 imellem, status til venstre, ⋯ yderst til højre; storytype-chips 36 på én linje under Titel (valgt = grå flueben) |
| **Upload-flise** (cover, Story, Den færdige video) | `.cv-upload`: hvid, stiplet 1,5 px #DEDAD4, radius 14, 9:16, grønt symbol + »Upload«; under upload står procesringen (husets ring, ubestemt) i flisen; ved fejl står årsagen + »Prøv igen« i flisen; færdig = video 9:16 + »Skift video« · »Download« · skraldespand (36) |
| **Valgt chip i cover-editoren** | grå flueben, aldrig rød fyldt |

## Valg, hvor to udseender var »rigtige« (begrundelse)
- **Flisetitel 18 (telefon 16), sort Poppins** — mest brugt på Retning-siden og samme som »Hvad er idéen?«, som Ida peger på som det rigtige. Den lille versal-etiket (»HVEM TALER OPSLAGET TIL?«) er væk.
- **Klip-etiket som lille versal** (ikke rød 17 / sort 15): følger reglen »flisen = etiket · én streg · indhold« og forsidens etiketter. Klip 1 var rød, Klip 2/3 sorte, Klip 1 på Fasthold grå — nu ens.
- **Skillelinje mellem delene i en klipflise** (ikke kun én pr. flise): CLAUDE.md siger både »forskelligt indhold = skillelinje« og at to streger i samme flise ikke må ske. Tolket som: streg mellem forskelligt indhold, aldrig to i træk. **Ida skal bekræfte**, eller de tre dele (Tekst på skærmen / Det, man ser / Det, jeg siger) bliver hver sin flise.
- **Bundknapper 40** (ikke 44): mest udbredt i briefens bundrække; 44 forbeholdt ark/popups.
- **»Tilføj« med plus i Fakta-boksen** (`fb-pil-tilfoej`): ordet står i midten, plusset foran (Idas 17/9) — undtaget fra »gruppen i midten«.

## Tilføjet 4/11 (forløbssiden = bud 1)
| Element | Facit |
|---|---|
| **Sektionsetiket** (DIT FORLØB · SENERE · FÆRDIGE) | Poppins 10 / 400 · versal · bogstavafstand 1,5 · #9A9590 · 16 høj + hårlinje #DDDAD3 til højre · 16 til første flise · 24 fra sektion til sektion · første etiket 32 under heroen |
| **Stor modulflise** (.ftl2-stor, kun det åbne modul) | hvid · radius 20 · luft 18/20 · skygge `--mb-skygge` · ingen kant · etiket ÅBEN 10 versal #9A9590 · titel Poppins **18** (telefon **16**) / 400 / **#1A1A1A (aldrig rød)** · antal lektioner 12 #9A9590 (4 under titlen) · rød pilleknap **44** (13/400, tekst i midten) yderst til højre, 20 fra kanten; telefon: knappen i fuld bredde under titlen |
| **Tynd modulrække** (SENERE · FÆRDIGE) | #FAF9F5 · 1 px #E3E2DE · radius 20 · ingen skygge · mindst **64** høj · luft 20 · titel 15 #6F6B66 · antal 12 #9A9590 · højre: 12 #6F6B66 (»Åbner om N dage« + hængelås 16 / »Færdig« / »Åben«) · 10 mellem rækker |
