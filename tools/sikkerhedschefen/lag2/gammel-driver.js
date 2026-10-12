/* SIKKERHEDSCHEFEN · LØFTE 33 · EN GAMMEL, ÅBEN UDGAVE GEMMER ALDRIG OVEN I EN NYERE (fejlkataloget A3 — 7/10: Freja udfyldte en brief i Hinges Hus;
   Idas gamle åbne udgave i admin gemte ovenpå). Briefen åbnes her. Imens skriver »en anden« (anden fane/admin) CTA'en i basen.
   Her skrives så i briefens første felt, og autogem kører. Begge dele skal stå i basen bagefter. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ navn: n, ok: !!ok, detalje: String(d || "").slice(0, 300) }); }
  function raek() { var d = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); return ((d.content_ideer || []).filter(function (x) { return x.id === "ga1"; })[0]) || null; }
  try {
    await V(7000);
    openBriefSide("ga1"); await V(2500);
    try { briefMbVis("skriv", 0); } catch (e) {} await V(1500);
    /* DEN ANDEN: skriver CTA'en og en ny beskrivelse direkte i basen */
    var d = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); var x = d.content_ideer.filter(function (z) { return z.id === "ga1"; })[0];
    x.brief = Object.assign({}, x.brief, { ctaCaption: "Skrevet af den anden", beskrivelse: "Den andens beskrivelse" }); localStorage.setItem("SELE_DB", JSON.stringify(d));
    /* HER: skriv i det første synlige tekstfelt i briefen (som kunden), og lad autogem køre */
    var felt = [].slice.call(document.querySelectorAll("textarea, input[type=text]")).filter(function (f) { return f.getClientRects().length && !f.closest("#authGate,#arkSlor,.modal-back") && !f.disabled && !f.readOnly; })[0];
    if (!felt) { tjek("Briefen har et felt at skrive i", false, "intet synligt felt"); throw 0; }
    var feltNavn = felt.id || felt.name || felt.placeholder || "felt";
    felt.focus(); felt.value = (felt.value || "") + " · rettet her"; felt.dispatchEvent(new Event("input", { bubbles: true })); felt.dispatchEvent(new Event("change", { bubbles: true }));
    await V(5000); felt.blur(); felt.dispatchEvent(new Event("blur", { bubbles: true })); await V(1500);
    try { saveBrief(true); } catch (e) {} await V(3000);
    try { briefTilbage(); } catch (e) {} await V(3000);
    var efter = raek(); var b = (efter && efter.brief) || {};
    tjek("Den andens CTA står stadig efter autogem fra den gamle, åbne brief", b.ctaCaption === "Skrevet af den anden", "CTA: " + JSON.stringify(b.ctaCaption) + " · felt: " + feltNavn);
    tjek("Den andens beskrivelse står stadig (medmindre det var dét felt, der blev rettet her)", b.beskrivelse === "Den andens beskrivelse" || /rettet her/.test(b.beskrivelse || ""), "beskrivelse: " + JSON.stringify(b.beskrivelse));
    tjek("Rettelsen herfra er også gemt", JSON.stringify(efter).indexOf("rettet her") > -1, "felt: " + feltNavn);
    /* BAGEFTER RETTER KUNDEN SELV FELTET: kundens nye tekst skal vinde (fletningen må ikke låse feltet) */
    openBriefSide("ga1"); await V(2000); try { briefMbVis("skriv", 0); } catch (e) {} await V(1200);
    var f2 = document.getElementById(feltNavn) || felt; if (f2 && f2.isConnected) { f2.value = "Kundens nye tekst"; f2.dispatchEvent(new Event("input", { bubbles: true })); await V(1500); try { saveBrief(true); } catch (e) {} await V(3000); }
    var efter2 = raek(); tjek("Når kunden selv retter feltet bagefter, er det kundens tekst, der gemmes", JSON.stringify(efter2).indexOf("Kundens nye tekst") > -1, "felt: " + feltNavn);
    tjek("Den andens CTA står stadig efter kundens egen rettelse", ((efter2 && efter2.brief) || {}).ctaCaption === "Skrevet af den anden", "CTA: " + JSON.stringify(((efter2 && efter2.brief) || {}).ctaCaption));
  } catch (e) { if (e !== 0) r.fejl = String(e && e.message || e); }
  console.log("@@" + JSON.stringify(r) + "@@");
})();
