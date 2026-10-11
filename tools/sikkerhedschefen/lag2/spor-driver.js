/* SIKKERHEDSCHEFEN · LØFTE 27 · SPORINGEN (Ida 11/10: »jeg vil virkelig kunne tracke alt. jeg vil have en tryghed i at det virker!«).
   En opdigtet kunde ser lektion 1.1 og giver stjerner + kommentar (kundens egne funktioner); derefter henter Backstages »Sådan går det« tallene
   forfra fra basen og skal vise præcis det. Kører i selen med huske-basen — aldrig rigtige kunder. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 27, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 200) }); }
  var L = function () { console.log("@@" + JSON.stringify(r) + "@@"); }; var slut = setTimeout(L, 25000);
  try {
    await V(3000);
    var K = "HINGES2026", LEK = "1-1", gl = currentKode;
    currentKode = K; CURRENT_NAVN = "Opdigtet kunde";
    try { delete KURSUS_SET[LEK]; } catch (e) {}
    await lektionSet(LEK);
    REFL_STJERNER = 4; var t = document.getElementById("lekMomentKom"); if (!t) { t = document.createElement("textarea"); t.id = "lekMomentKom"; document.body.appendChild(t); } t.value = "Opdigtet kommentar til sporingen";
    await lekMomentFeedbackGem(LEK);
    currentKode = gl;
    var db = JSON.parse(localStorage.getItem("SELE_DB") || "{}");
    var rk = (db.skema_svar || []).filter(function (x) { return x.kode === K; });
    tjek("At kunden har set lektionen, gemmes i basen", rk.some(function (x) { return x.skema === "lektion_set_" + LEK; }), "ingen lektion_set_-række");
    var fb = rk.find(function (x) { return x.skema === "lektion_feedback_" + LEK; });
    tjek("Stjerner og kommentar gemmes i basen", fb && fb.svar && fb.svar.stjerner === 4 && /sporingen/.test(fb.svar.kommentar || ""), fb ? JSON.stringify(fb.svar) : "ingen lektion_feedback_-række");
    BF3_DATA = null; window.__BF3_DATA_HENT = 0; KLIP_LEKFB_HENTET = false; await bf3DataHent();
    tjek("»Sådan går det« viser, at kunden har set lektionen", ((BF3_DATA.set || {})[LEK] || {})[K], JSON.stringify((BF3_DATA.set || {})[LEK] || {}));
    var f2 = ((KLIP_LEKFB || {})[LEK] || []).find(function (x) { return x.kode === K; });
    tjek("»Sådan går det« viser stjerner og kommentar", f2 && f2.stjerner === 4 && /sporingen/.test(f2.kommentar || ""), f2 ? JSON.stringify(f2) : "ingen feedback hos Ida");
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
