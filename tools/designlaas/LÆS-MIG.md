# Designlåsens måling

`probe-popups.js` åbner hver kendt popup-dør i kundeappen og måler den mod `DESIGNLÅS.md`.

Kør den i selen (selen er beskrevet i bilaget i `docs/superpowers/plans/2026-09-12-status-backstage-2027.md`, den må aldrig committes):

```
bash koer.sh "vis=kunde&fil=index-sele.html&bred=390" laas tools/designlaas/probe-popups.js | grep "SELE LAAS"
```

`SELE LAAS OK` = alle døre holder. Hver `SELE LAAS FEJL` siger dør og hvad der er galt. Ny popup-dør i appen skal ind i `DOERE` i samme commit.
