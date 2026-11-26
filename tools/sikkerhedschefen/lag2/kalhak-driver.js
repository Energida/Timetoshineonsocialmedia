/* SIKKERHEDSCHEFEN · LØFTE 15 · HAKJÆGEREN: KALENDERENS VÆRKTØJSRÆKKE (Ida 25/11: »hvorfor finder hakjægeren ikke dette??? når jeg klikker på content
   i … til i morgen … kommer 14 dage lige frem«). Idas video (Chrome ca. 1280–1366 px, admin »som kunde« med den røde bjælke, 14 dage): værktøjsrækken
   (filter · søg · Arkiv · »14 dage« · »+ Ny«) stod et billede NEDE i ugegitteret, så »14 dage« dækkede kolonnehovedet »LØR 28 NOV«, og hoppede så op.
   Hakjægeren kørte kun på 390 og 1440, kun som kunde og så kun briefen — derfor så den det aldrig.
   Her filmes kalenderen billede for billede (requestAnimationFrame, rigtig tid gennem realtid.mjs):
     (1) VÆRKTØJSRÆKKEN I GITTERET: et synligt værktøj (filter · søg · Arkiv · perioden · »+ Ny« · pilene) overlapper ugegitteret i bare ét billede
     (2) VÆRKTØJSRÆKKEN HOPPER: et værktøj, der er set, flytter sig 2 px eller mere senere end 40 ms efter første billede med kalenderen
   Scener: menuen → Content kalenderen · bladr frem (›) · bladr tilbage (‹) · Hjem → kalenderen igen.
   window.__KH_SOMKUNDE = 1: siden er åbnet som admin »som kunde« (#somkunde=…&fane=8, den røde bjælke øverst). */
(async function () {
  var r = { tjek: [], somkunde: !!window.__KH_SOMKUNDE, bredde: innerWidth };
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  var faerdig = false, L = function () { if (faerdig) return; faerdig = true; console.log("@@" + JSON.stringify(r) + "@@"); };
  var slut = setTimeout(function () { r.fejl = "tiden løb ud efter " + r.tjek.length + " scener"; L(); }, 100000);
  var EFTER = 40, RYK = 2;
  function ses(e) { try { return e.checkVisibility ? e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : !!e.getClientRects().length; } catch (x) { return !!e.getClientRects().length; } }
  function taeppe() { return ["appLoader", "privCover", "somkundeLoader", "energidaLoader", "skDaek"].some(function (i) { var e = document.getElementById(i); return !!(e && ses(e) && parseFloat(getComputedStyle(e).opacity || 1) > 0.5 && e.getBoundingClientRect().height > 100); }); }
  function kalSes() { var s = document.getElementById("screen8"); if (!s || !ses(s)) return false; var b = s.getBoundingClientRect(); return b.height > 40 && parseFloat(getComputedStyle(s).opacity || 1) > 0.05; }
  /* VÆRKTØJERNE: alt synligt i kalenderens hoved (#kalBlok .cal-header) — pilene, filter, søg, Arkiv, perioden og »+ Ny« */
  function vaerktoej() {
    var h = document.querySelector("#kalBlok .cal-header"); if (!h) return [];
    var ud = [];
    [].forEach.call(h.querySelectorAll("button, #calVisDropW, .bs3-drop, input"), function (e) {
      if (!ses(e)) return; var b = e.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return;
      var n = e.id ? "#" + e.id : (e.getAttribute("aria-label") || (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 16) || e.className.split(" ")[0]);
      ud.push({ n: n, x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height) });
    });
    return ud;
  }
  /* GITTERET: den synlige del af ugegitteret (#calGrid) — kolonnehovederne og dagene */
  function gitter() { var g = document.getElementById("calGrid"); if (!g || !ses(g)) return null; var b = g.getBoundingClientRect(); if (b.height < 20) return null; return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height) }; }
  function overlap(a, g) { var dx = Math.min(a.x + a.w, g.x + g.w) - Math.max(a.x, g.x), dy = Math.min(a.y + a.h, g.y + g.h) - Math.max(a.y, g.y); return dx > 2 && dy > 2; }
  async function film(navn, handling, ms) {
    var TL = [], on = true, t0 = performance.now();
    try { console.log("FILM " + Date.now() + " " + navn); } catch (e) {}
    (function skud() { TL.push({ t: Math.round(performance.now() - t0), k: kalSes(), T: taeppe(), v: vaerktoej(), g: gitter(), d: (document.getElementById("calTitle") || {}).textContent || "", bar: !!document.getElementById("somKundeBar") }); if (on) requestAnimationFrame(skud); })();
    try { await handling(); } catch (e) { r.tjek.push({ navn: navn, tilstand: "ikke", info: "handlingen fejlede: " + (e && e.message || e), fund: [] }); on = false; return; }
    await V(ms || 2500); on = false;
    var set = TL.filter(function (x) { return x.k && !x.T && x.v.length && x.g; });
    if (!set.length) { r.tjek.push({ navn: navn, tilstand: "ikke", info: "kalenderen blev aldrig vist (" + TL.length + " billeder)", fund: [] }); return; }
    var fund = [], f0 = set[0].t;
    /* (1) i gitteret */
    var i1 = null; set.some(function (x) { var o = x.v.filter(function (a) { return overlap(a, x.g); }); if (o.length) { i1 = { t: x.t, o: o, g: x.g }; return true; } return false; });
    if (i1) { var a = i1.o[0]; fund.push({ art: "i_gitteret", el: i1.o.map(function (q) { return q.n; }).join(" · "), ms: i1.t - f0, hvad: "værktøjet står i ugegitteret: " + a.n + " (" + a.x + "," + a.y + " " + a.w + "×" + a.h + ") over gitteret (top " + i1.g.y + ")", billeder: set.filter(function (x) { return x.v.some(function (q) { return overlap(q, x.g); }); }).length }); }
    /* (2) hopper */
    /* ÉT SKIFT ER KLIKKETS EGET (mellemtilstandenes regel): måles fra det første billede, der er anderledes end billedet før klikket. Står kalenderen allerede (bladring), er det billedet, hvor titlen og dagene skifter. */
    var aft = function (x) { return (x.k ? "K" : "") + (x.T ? "T" : "") + JSON.stringify(x.v) + JSON.stringify(x.g) + x.d; };
    var j0 = 0; for (var q = 1; q < TL.length; q++) { if (aft(TL[q]) !== aft(TL[0])) { j0 = q; break; } }
    var b0 = TL[j0]; f0 = b0.t;
    var foerst = {}, hop = null;
    TL.slice(j0).filter(function (x) { return x.k && !x.T && x.v.length && x.g; }).forEach(function (x) { x.v.forEach(function (a) { var p = foerst[a.n]; if (!p) { foerst[a.n] = { a: a, t: x.t }; return; } if (!hop && x.t - f0 > EFTER && (Math.abs(a.x - p.a.x) >= RYK || Math.abs(a.y - p.a.y) >= RYK)) hop = { n: a.n, t: x.t, fra: p.a, til: a }; }); });
    if (hop) fund.push({ art: "hopper", el: hop.n, ms: hop.t - f0, hvad: "værktøjet flytter sig fra " + hop.fra.x + "," + hop.fra.y + " til " + hop.til.x + "," + hop.til.y });
    var sidst = set[set.length - 1], pd = sidst.v.filter(function (q) { return /calVisDropW/.test(q.n); })[0];
    r.tjek.push({ navn: navn, tilstand: fund.length ? "fund" : "ok", fund: fund,
      info: "billeder " + TL.length + " · med kalender " + set.length + " · bjælke " + (sidst.bar ? "ja" : "nej") + " · perioden " + (pd ? pd.x + "," + pd.y : "-") + " · gitter top " + sidst.g.y });
  }
  function menuKnap() {
    /* den rigtige menuknap til Content (sidemenuen på computeren, bundmenuen på telefonen) — ellers showTab(8) */
    var k = [].filter.call(document.querySelectorAll("#sideNav .sn-item, #bottomNav .bn-item"), function (e) { return ses(e) && /content/i.test((e.getAttribute("aria-label") || "") + " " + (e.textContent || "")); })[0];
    r.menu = k ? "menuknappen »" + ((k.getAttribute("aria-label") || k.textContent || "").replace(/\s+/g, " ").trim().slice(0, 24)) + "«" : "showTab(8)";
    return k || null;
  }
  try {
    await V(3000);
    try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    try { showTab(3); } catch (e) {} await V(2500);
    await film("Menuen → Content kalenderen (14 dage)", function () { var k = menuKnap(); if (k) k.click(); else showTab(8); }, 2500);
    var frem = function () { var p = document.querySelector("#kalBlok .cal-pil[onclick*='nextMonth']"); if (p && ses(p)) p.click(); else nextMonth(); };
    var tilb = function () { var p = document.querySelector("#kalBlok .cal-pil[onclick*='prevMonth']"); if (p && ses(p)) p.click(); else prevMonth(); };
    /* IDAS VEJ (25/11: »når jeg klikker på content i … til i morgen«): opslaget i morgen i kalenderen → briefen. Kalenderen holdes fremme, til briefen er klar — og dér hakkede den. */
    var kort = [].filter.call(document.querySelectorAll("#screen8 [onclick*='openBrief']"), function (e) { return ses(e) && (e.innerText || "").indexOf("Sådan sliber du kniven") > -1; })[0];
    if (kort) { await film("Kalenderen → opslaget i morgen (briefen)", function () { kort.click(); }, 3000); try { briefTilbage(); } catch (e) { showTab(8); } await V(2500); }
    else r.tjek.push({ navn: "Kalenderen → opslaget i morgen (briefen)", tilstand: "ikke", info: "opslaget i morgen blev ikke fundet i kalenderen", fund: [] });
    await film("Kalenderen: bladr frem (›)", frem, 2000);
    await film("Kalenderen: bladr frem igen (›)", frem, 2000);
    await film("Kalenderen: bladr tilbage (‹)", tilb, 2000);
    await film("Kalenderen: bladr tilbage igen (‹)", tilb, 2000);
    await film("Kalenderen → Forsiden (menuen)", function () { var k = [].filter.call(document.querySelectorAll("#sideNav .sn-item, #bottomNav .bn-item"), function (e) { return ses(e) && /forside|hjem/i.test((e.getAttribute("aria-label") || "") + " " + (e.textContent || "")); })[0]; if (k) k.click(); else showTab(3); }, 2500);
    await V(1000);
    await film("Forsiden → Content kalenderen igen", function () { var k = menuKnap(); if (k) k.click(); else showTab(8); }, 2500);
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
