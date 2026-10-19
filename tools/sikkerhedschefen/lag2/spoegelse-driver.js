/* SIKKERHEDSCHEFEN · LØFTE 15 · SPØGELSESSIDEN: et dybt link til en brief (#fane=8&brief=ID — det, genvejen og godkendelserne åbner)
   må aldrig vise Hjem eller kalenderen uden tæppe, før briefen står. Læser filmen fra spoegelse-sampler.js. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 15, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 220) }); }
  var L = function () { console.log("@@" + JSON.stringify(r) + "@@"); }; var slut = setTimeout(L, 40000);
  try {
    for (var i = 0; i < 60 && !(window.__TL || []).some(function (x) { return x.brief; }); i++) await V(250);
    await V(600);
    var tl = window.__TL || [];
    var foersteBrief = tl.findIndex(function (x) { return x.brief; });
    tjek("Det dybe link åbner briefen", foersteBrief > -1, "briefen åbnede aldrig (" + tl.length + " billeder)");
    var foer = foersteBrief > -1 ? tl.slice(0, foersteBrief) : tl;
    var blink = foer.filter(function (x) { return !x.taeppe && x.skaerm && x.skaerm !== "screen7"; });
    var hvilke = {}; blink.forEach(function (x) { hvilke[x.skaerm] = (hvilke[x.skaerm] || 0) + 1; });
    tjek("Ingen anden side blinker, før briefen står", !blink.length, blink.length ? "uden tæppe før briefen: " + Object.keys(hvilke).map(function (k) { return k + " i " + hvilke[k] + " billeder"; }).join(", ") + " (fra " + blink[0].t + " ms)" : "");
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
