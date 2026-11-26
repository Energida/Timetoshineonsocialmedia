# Designlåsens måling

`probe-popups.js` åbner hver kendt popup-dør i kundeappen og måler den mod `DESIGNLÅS.md`. `probe-sider.js` (14/9) åbner hver kendt side gennem den rigtige dør og måler tæppet, vandret sejlads, 44 px trykfelter, kryds, emoji og streger i fliser. `koer.sh` kører begge og siger kun OK, når begge er OK.

**Kør den:** `bash tools/designlaas/koer.sh` (bygger selen i en midlertidig mappe med `byg-sele.py`, kræver Chromium; sæt `CHROME=<sti>`, hvis den ikke finder den selv). Slutter med `SELE LAAS OK: N døre` og exit 0, ellers `SELE LAAS FEJL …` og exit 1.

**Porten:** `.github/workflows/designlaas.yml` kører det samme ved hvert push til `dashboard-og-database` og skubber kun OK-commits videre til `produktion`.

Ny popup-dør i appen skal ind i `DOERE` i `probe-popups.js`, og en ny side i `SIDER` i `probe-sider.js`, i samme commit. Selen bygges ud af `byg-sele.py` og må aldrig committes som filer (en `index-sele.html` på det levende site ville være appen med en falsk bruger).

## Fase 1 af »UX-politiet skal fange alle reglerne« (Ida 17/11)

- **Regelregistret** `regler.json`: hver HÅRD regel i DESIGNLÅS.md har én linje med `type` (design · data · proces) og enten `maaling` (den probe, der stopper porten) eller `plan` (hvornår målingen bygges). `delvis: true` = målingen dækker kun en del (fx kun briefen).
- **Dækningsporten** `daekning.py` køres af koer.sh og stopper porten, hvis en HÅRD regel mangler sin linje, eller en linje har type »ny«. Låser du en HÅRD regel: kør `python3 tools/designlaas/daekning.py --opret` og udfyld linjen SAMME tur — helst med målingen.
- **Popups venter, til de er åbne** (probe-regler2): ingen fast pause på 450 ms længere; der kigges hver 100. ms i op til 2 sek.
- **Oversprunget = fejl** i probe-hero (en side, der ikke åbner, eller ingen hero-titel).
- **Backstages cover-målinger kører igen og stopper porten** (var døde pga. BS_FORFRA; første kørsel 0 fund). **Rapport, ikke port** (gennemgås i fase 2): probe-laas via `rapport-laas.js` (`SELE RAPPORT LAAS`), og versal-etiketter med streg inde i fliser (`SELE SIDER RAPPORT`, 15/11 vælter 15/9).
- probe-ens.js er et data-værktøj (dumper JSON til hånd-analyse), ikke en kontrol — den køres ikke af porten.
