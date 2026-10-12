/* SIKKERHEDSCHEFEN · LØFTE 38 · TALLENE PÅ HJEM PASSER (fejlkataloget B36 — Hans 11/10: »0 af 3 planlagt« lige efter et planlagt opslag).
   Basen sås med denne uges opslag (2 planlagt, 1 postet, 1 idé med dato) og ét fra sidste uge. Ringene skal vise 3 planlagt og 1 postet.
   Derefter planlægges ét opslag mere, som kunden gør — ringen skal tælle det med, uden genindlæsning. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ navn: n, ok: !!ok, detalje: String(d || "").slice(0, 300) }); }
  function ringe() { return [].map.call(document.querySelectorAll("#screen3 .hu-ring"), function (e) { return (e.textContent || "").replace(/\s+/g, " ").trim(); }).filter(function (t) { return t; }); }
  function tal(ord) { var t = ringe().filter(function (x) { return x.toLowerCase().indexOf(ord) > -1; })[0] || ""; var m = t.match(/(\d+)\s*af/); return m ? +m[1] : null; }
  try {
    await V(7000);
    ["turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    showTab(3); try { hjemUgeTegn(); } catch (e) {} await V(1500);
    var p0 = tal("planlagt"), u0 = tal("postet");
    tjek("Hjem tæller denne uges opslag rigtigt (planlagt)", p0 === 3, "viser " + p0 + " — forventet 3 (2 planlagt + 1 postet; idé med dato og sidste uge tæller ikke) · ringe: " + ringe().join(" | "));
    tjek("Hjem tæller denne uges opslag rigtigt (postet)", u0 === 1, "viser " + u0 + " — forventet 1");
    /* KUNDEN PLANLÆGGER ÉT MERE (idé → dato i dag + Planlagt), som briefen gør */
    var iso = huIso(new Date());
    await ideUpdate("ht4", { dato: iso, status: "Planlagt" }); await V(1200);
    showTab(3); await V(1500);
    var p1 = tal("planlagt");
    tjek("Ringen tæller et nyplanlagt opslag med, uden genindlæsning", p1 === 4, "før " + p0 + ", efter " + p1);
  } catch (e) { r.fejl = String(e && e.message || e); }
  console.log("@@" + JSON.stringify(r) + "@@");
})();
