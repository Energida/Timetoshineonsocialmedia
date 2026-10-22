/* SIKKERHEDSCHEFEN · LØFTE 15 · SPØGELSESJÆGEREN (Ida 19/10: »jeg ser det rigtig mange steder!« · »det lyder genialt med en spøgelsesjæger«).
   Filmer hvert sideskift billede for billede og fejler, hvis der ses: (1) en tredje side, der hverken er den gamle eller den nye,
   (2) en tom skærm uden tæppe, (3) et tæppe, der løfter sig og viser den GAMLE side igen (blinket: brief → tæppe → brief → kalender). */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 15, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 260) }); }
  var L = function () { console.log("@@" + JSON.stringify(r) + "@@"); }; var slut = setTimeout(L, 85000);
  function synlige() { return [].filter.call(document.querySelectorAll(".screen"), function (e) { var s = getComputedStyle(e), b = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity || 1) > 0.05 && b.height > 40 && b.bottom > 0 && b.top < innerHeight; }).map(function (e) { return e.id; }); }
  function taeppe() { return ["appLoader", "privCover", "somkundeLoader", "energidaLoader"].some(function (i) { var e = document.getElementById(i); if (!e) return false; var s = getComputedStyle(e); return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity || 1) > 0.05; }); }
  /* (4) DEN GAMLE SIDE SKIFTER FORM (Ida 22/10, video fra Acorns: kalenderen viste sin skjulte computer-udgave i 1 sek. før briefen):
     mens den gamle side står i holdet, må intet nyt dukke op på den, og intet må forsvinde fra den */
  function aftryk(ids) { var m = new Map(); ids.forEach(function (id) { var sc = document.getElementById(id); if (!sc) return; sc.querySelectorAll("*").forEach(function (e) { var r = e.getClientRects(); if (!r.length) return; var b = r[0]; if (b.bottom <= 0 || b.top >= innerHeight || b.width < 2 || b.height < 2) return; m.set(e, 1); }); }); return m; }
  function navnPaa(e) { return (e.id ? "#" + e.id : e.tagName.toLowerCase()) + (String(e.textContent || "").trim() ? " »" + String(e.textContent).trim().replace(/\s+/g, " ").slice(0, 30) + "«" : ""); }
  async function film(navn, handling, ms) {
    var TL = [], on = true, t0 = performance.now(), fra = synlige(), start = aftryk(fra), form = null;
    (function skud() {
      var v = synlige(); TL.push({ t: Math.round(performance.now() - t0), v: v, T: taeppe() });
      if (!form && !taeppe() && v.length && v.every(function (id) { return fra.indexOf(id) > -1; }) && TL.length > 1) {
        var nu = aftryk(fra), ny = null, vaek = null;
        nu.forEach(function (_, e) { if (!ny && !start.has(e) && !e.closest("[data-bs-hold]")) ny = e; });
        if (!ny) start.forEach(function (_, e) { if (!vaek && !nu.has(e) && document.contains(e)) vaek = e; });
        if (ny || vaek) form = { t: TL[TL.length - 1].t, ny: ny ? navnPaa(ny) : "", vaek: vaek ? navnPaa(vaek) : "" };
      }
      if (on) requestAnimationFrame(skud);
    })();
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
    if (form) fejl.push("den gamle side skifter form, før den nye er klar (" + (form.ny ? "dukker op: " + form.ny : "forsvinder: " + form.vaek) + ") ved " + form.t + " ms");
    tjek(navn + " · intet spøgelse", !fejl.length, fejl.join(" · ") + (fejl.length ? " [" + fra.join(",") + " → " + til.join(",") + "]" : ""));
  }
  try {
    await V(3500);
    try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    showTab(8); await V(2500);
    var kort = [].filter.call(document.querySelectorAll("#screen8 [onclick*='openBrief']"), function (e) { return e.getClientRects().length; })[0];   /* det kort, kunden ser (22/10: telefonen har kalenderen to gange) */
    tjek("Kalenderen har et opslag at åbne", !!kort, "intet opslag i kalenderen");
    if (kort) {
      await film("Kalenderen → briefen", function () { kort.click(); }, 3500);
      await film("Briefen → Tilbage", function () { return briefTilbage(); }, 3000);
    }
    await film("Menu: Idébanken", function () { showTab(2); });
    await film("Menu: Hjem", function () { showTab(3); });
    await film("Menu: Performance", function () { showTab(9); });
    await film("Menu: Kalenderen", function () { showTab(8); });
    /* VENTETIDEN (Ida 19/10: »gør ventetiden kortere, når man skifter side«): en fil fra brief-mappen må ikke holde siden — et kald til basen skal */
    var n0 = window.__NET || 0;
    try { window.fetch(location.origin + "/storage/v1/object/brief-filer/test.jpg?supabase.co").catch(function () {}); } catch (e) {}
    var nFil = (window.__NET || 0) - n0;
    try { window.fetch(location.origin + "/rest/v1/test?supabase.co").catch(function () {}); } catch (e) {}
    var nDb = (window.__NET || 0) - n0 - nFil;
    tjek("En fil fra brief-mappen holder ikke siden", nFil === 0, "filen blev talt som et kald til basen (" + nFil + ")");
    tjek("Et kald til basen holder stadig siden", nDb === 1, "kaldet blev ikke talt (" + nDb + ")");
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
