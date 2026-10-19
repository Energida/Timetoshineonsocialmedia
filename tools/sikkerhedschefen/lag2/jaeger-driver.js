/* SIKKERHEDSCHEFEN · LØFTE 15 · SPØGELSESJÆGEREN (Ida 19/10: »jeg ser det rigtig mange steder!« · »det lyder genialt med en spøgelsesjæger«).
   Filmer hvert sideskift billede for billede og fejler, hvis der ses: (1) en tredje side, der hverken er den gamle eller den nye,
   (2) en tom skærm uden tæppe, (3) et tæppe, der løfter sig og viser den GAMLE side igen (blinket: brief → tæppe → brief → kalender). */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 15, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 260) }); }
  var L = function () { console.log("@@" + JSON.stringify(r) + "@@"); }; var slut = setTimeout(L, 85000);
  function synlige() { return [].filter.call(document.querySelectorAll(".screen"), function (e) { var s = getComputedStyle(e), b = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity || 1) > 0.05 && b.height > 40 && b.bottom > 0 && b.top < innerHeight; }).map(function (e) { return e.id; }); }
  function taeppe() { return ["appLoader", "privCover", "somkundeLoader", "energidaLoader"].some(function (i) { var e = document.getElementById(i); if (!e) return false; var s = getComputedStyle(e); return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity || 1) > 0.05; }); }
  async function film(navn, handling, ms) {
    var TL = [], on = true, t0 = performance.now(), fra = synlige();
    (function skud() { TL.push({ t: Math.round(performance.now() - t0), v: synlige(), T: taeppe() }); if (on) requestAnimationFrame(skud); })();
    try { await handling(); } catch (e) { tjek(navn, false, "handlingen fejlede: " + (e && e.message || e)); on = false; return; }
    await V(ms || 3000); on = false;
    var til = TL[TL.length - 1].v;
    var fejl = [];
    var tredje = TL.filter(function (x) { return !x.T && x.v.some(function (id) { return fra.indexOf(id) < 0 && til.indexOf(id) < 0; }); });
    if (tredje.length) fejl.push("en tredje side ses: " + tredje[0].v.join(",") + " fra " + tredje[0].t + " ms");
    var tom = TL.filter(function (x, i) { return i > 1 && !x.T && !x.v.length; });
    if (tom.length) fejl.push("tom skærm i " + tom.length + " billeder fra " + tom[0].t + " ms");
    var saaTaeppe = false, blink = null;
    TL.forEach(function (x) { if (x.T) saaTaeppe = true; else if (saaTaeppe && !blink && fra.length && x.v.some(function (id) { return fra.indexOf(id) > -1 && til.indexOf(id) < 0; })) blink = x; });
    if (blink) fejl.push("tæppet løfter sig og viser den gamle side igen (" + blink.v.join(",") + ") ved " + blink.t + " ms");
    tjek(navn + " · intet spøgelse", !fejl.length, fejl.join(" · ") + (fejl.length ? " [" + fra.join(",") + " → " + til.join(",") + "]" : ""));
  }
  try {
    await V(3500);
    try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    showTab(8); await V(2500);
    var kort = document.querySelector("#screen8 [onclick*='openBrief']");
    tjek("Kalenderen har et opslag at åbne", !!kort, "intet opslag i kalenderen");
    if (kort) {
      await film("Kalenderen → briefen", function () { kort.click(); }, 3500);
      await film("Briefen → Tilbage", function () { return briefTilbage(); }, 3000);
    }
    await film("Menu: Idébanken", function () { showTab(2); });
    await film("Menu: Hjem", function () { showTab(3); });
    await film("Menu: Performance", function () { showTab(9); });
    await film("Menu: Kalenderen", function () { showTab(8); });
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
