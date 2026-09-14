# Designlåsens måling

`probe-popups.js` åbner hver kendt popup-dør i kundeappen og måler den mod `DESIGNLÅS.md`. `probe-sider.js` (14/9) åbner hver kendt side gennem den rigtige dør og måler tæppet, vandret sejlads, 44 px trykfelter, kryds, emoji og streger i fliser. `koer.sh` kører begge og siger kun OK, når begge er OK.

**Kør den:** `bash tools/designlaas/koer.sh` (bygger selen i en midlertidig mappe med `byg-sele.py`, kræver Chromium; sæt `CHROME=<sti>`, hvis den ikke finder den selv). Slutter med `SELE LAAS OK: N døre` og exit 0, ellers `SELE LAAS FEJL …` og exit 1.

**Porten:** `.github/workflows/designlaas.yml` kører det samme ved hvert push til `dashboard-og-database` og skubber kun OK-commits videre til `produktion`.

Ny popup-dør i appen skal ind i `DOERE` i `probe-popups.js`, og en ny side i `SIDER` i `probe-sider.js`, i samme commit. Selen bygges ud af `byg-sele.py` og må aldrig committes som filer (en `index-sele.html` på det levende site ville være appen med en falsk bruger).
