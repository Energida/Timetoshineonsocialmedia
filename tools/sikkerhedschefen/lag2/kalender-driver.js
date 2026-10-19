/* SIKKERHEDSCHEFEN · LØFTE 6 · KALENDEREN VISER HVERT OPSLAG PÅ BEGGE FLADER (lovet Ida 18/10, efter v2805: »Vinterhvid« manglede på telefonen pga. et »snart«-filter).
   Hvert opslag med dato i de næste seks dage skal stå i kalenderen — telefonens Kommende opslag/dag og computerens kalender. Kun opdigtede opslag. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 6, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 260) }); }
  var L = function () { console.log("@@" + JSON.stringify(r) + "@@"); }; var slut = setTimeout(L, 40000);
  try {
    await V(3500);
    try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    showTab(8); await V(2500);
    var forventet = (IDEER || []).filter(function (x) { return /^kal-/.test(String(x.id)); }).map(function (x) { return x.titel; });
    var tekst = (document.getElementById("screen8") || document.body).innerText || "";
    var mangler = forventet.filter(function (t) { return tekst.indexOf(t) < 0; });
    tjek(innerWidth + " px · alle opslag med dato står i kalenderen", forventet.length && !mangler.length, forventet.length ? "mangler: " + mangler.join(" · ") : "ingen opdigtede opslag fundet i IDEER");
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
