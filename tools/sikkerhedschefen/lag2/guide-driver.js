/* SIKKERHEDSCHEFEN · LØFTE 45 · EN GUIDE I FLERE TRIN GEMMER HVERT SVAR MED DET SAMME (fejlkataloget A7 — 29/9: »First thing first« skrev først på 6. trin).
   En idé uden søjle og format åbnes; kunden svarer på første trin, trykker Næste og lukker guiden med krydset. Svaret skal stå i basen. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ navn: n, ok: !!ok, detalje: String(d || "").slice(0, 300) }); }
  function raek() { var d = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); return ((d.content_ideer || []).filter(function (x) { return x.id === "gd1"; })[0]) || {}; }
  try {
    await V(7000);
    ["turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    var it = (IDEER || []).filter(function (x) { return String(x.id) === "gd1"; })[0];
    if (!it) throw new Error("idéen findes ikke i appen");
    briefSoejleArkVis(it); await V(1000);
    var F = window.__FTF; if (!F) throw new Error("guiden åbnede ikke");
    var trin1 = F.trin[F.i], forv = null;
    if (trin1 === "format") { briefFtfFormatVaelg("Billede"); forv = function (x) { return x.type === "Billede" || ((x.brief || {}).format === "Billede"); }; }
    else if (trin1 === "soejle") { var navn = (typeof strategyPillars !== "undefined" && strategyPillars[0]) || "Produkt"; briefSoejleArkVaelg(navn); forv = function (x) { return !!x.soejle; }; }
    else throw new Error("ukendt første trin: " + trin1);
    await V(500);
    if (window.__FTF && window.__FTF.i === 0) { briefFtfNaeste(); }
    await V(1500);
    /* LUK MED KRYDSET (som kunden) */
    var k = document.querySelector("#bsFlytMenu .ark-kryds, .ark-kryds"); if (k) k.click(); else bsFlytLuk();
    await V(2500);
    var x = raek();
    tjek("Svaret på første trin står i basen, selv om guiden lukkes på trin 2 (" + trin1 + ")", forv(x), "type: " + x.type + " · format: " + ((x.brief || {}).format) + " · søjle: " + x.soejle);
  } catch (e) { r.fejl = String(e && e.message || e); }
  console.log("@@" + JSON.stringify(r) + "@@");
})();
