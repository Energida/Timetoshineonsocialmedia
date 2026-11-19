/* SIKKERHEDSCHEFEN · LØFTE 15 · HAKJÆGEREN (Ida 19/11: »jeg oplever en masse hak i b2b siden når man vil navigere frem og tilbage -
   spøgelsessider mm. - specielt ved coveret i briefen mm - kan du lave en kontrol og fjerne alt dette??«).
   Spøgelsesjægeren (jaeger-driver.js) ser kun HELE sider. Hakjægeren ser INDE i siden, billede for billede:
   (1) en brief viser en ANDEN briefs titel eller cover, mens den åbner (den gamle brief som spøgelse)
   (2) coveret blinker: det har vist sit billede og bliver tomt igen
   (3) coveret springer: flisen skifter højde, efter den er set
   (4) indholdet hopper (layout-shift uden tryk) mere end 0,02
   (5) browserens Tilbage/Frem (og telefonens swipe tilbage) viser en tredje side, en tom skærm eller ingenting
   Coverets foto hentes med 600 ms forsinkelse som live (lageret). */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 15, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 300) }); }
  var L = function () { window.__HAK = r; console.log("@@" + JSON.stringify(r) + "@@"); }; var slut = setTimeout(L, 110000);
  var TITEL_A = "Hak A med cover", TITEL_B = "Hak B uden cover";
  /* lageret: coverets foto kommer efter 600 ms, som live */
  try {
    var orig = sb.storage.from.bind(sb.storage);
    sb.storage.from = function (b) {
      var o = orig(b) || {};
      o.download = async function () { await V(600); var bl = await (await fetch("dagens/kort.jpg")).blob(); return { data: bl, error: null }; };
      o.createSignedUrl = async function () { await V(600); return { data: { signedUrl: location.origin + "/dagens/kort.jpg" }, error: null }; };
      return o;
    };
  } catch (e) { r.fejl = "kunne ikke saette lageret op: " + e.message; }
  var SKIFT = [];
  try { new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { if (e.hadRecentInput) return; if ((e.sources || []).length && e.sources.every(function (q) { var p = q.previousRect; return !p || (p.width === 0 && p.height === 0) || (p.x < 1 && p.y < 1); })) return;   /* noget, der DUKKER OP (fra 0 px eller fra hjoernet 0,0, hvor det ikke var tegnet), er ikke et hop — kun noget, der flytter sig (maalt 19/11: Hjems ikoner ved Tilbage, usynligt paa filmen) */ SKIFT.push({ t: performance.now(), v: e.value, kilde: (e.sources || []).map(function (s) { var n = s.node; if (!n) return ""; var k = []; for (var i = 0; n && i < 3; i++, n = n.parentElement) k.push((n.id ? "#" + n.id : (n.tagName || "").toLowerCase()) + (typeof n.className === "string" && n.className ? "." + n.className.trim().split(/\s+/)[0] : "")); return k.join("<"); }).filter(Boolean).slice(0, 3).join(",") }); }); }).observe({ type: "layout-shift", buffered: false }); } catch (e) {}
  function synlige() { return [].filter.call(document.querySelectorAll(".screen"), function (e) { var s = getComputedStyle(e), b = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity || 1) > 0.05 && b.height > 40 && b.width > 40; }).map(function (e) { return e.id; }); }
  function taeppe() { return ["appLoader", "privCover", "somkundeLoader", "energidaLoader"].some(function (i) { var e = document.getElementById(i); if (!e) return false; var s = getComputedStyle(e); return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity || 1) > 0.5; }); }
  function i7(tekst) { var s = document.getElementById("screen7"); if (!s || synlige().indexOf("screen7") < 0) return false; return (s.innerText || "").indexOf(tekst) > -1; }
  function cover() {
    /* coverbillederne paa briefoversigten (.op-bild img, Ida 7/11) og det tegnede cover (.pf-cv canvas) */
    var s = document.getElementById("screen7"); if (!s || synlige().indexOf("screen7") < 0) return null;
    var im = [].filter.call(s.querySelectorAll(".op-bild img"), function (e) { return e.getClientRects().length; })[0];
    if (im) { var bi = im.closest(".op-bild").getBoundingClientRect(); return { h: Math.round(bi.height), foto: !!(im.getAttribute("src") && im.complete && im.naturalWidth > 0), el: im }; }
    var f = [].filter.call(s.querySelectorAll(".pf-cv"), function (e) { return e.getClientRects().length; })[0]; if (!f) return null;
    var b = f.getBoundingClientRect();
    var c = f.querySelector("canvas[data-cv='cover']") || f.querySelector("canvas"), foto = false;
    try { if (c && c.width > 4) { var x = c.getContext("2d"), d = x.getImageData(Math.floor(c.width / 2), Math.floor(c.height / 2), 1, 1).data, d2 = x.getImageData(Math.floor(c.width / 4), Math.floor(c.height / 4), 1, 1).data; var graa = function (p) { return Math.abs(p[0] - p[1]) < 6 && Math.abs(p[1] - p[2]) < 6 && p[0] > 200; }; foto = d[3] > 0 && !(graa(d) && graa(d2)); } } catch (e) {}
    return { h: Math.round(b.height), foto: foto, el: c };
  }
  function midt() { try { var e = document.elementFromPoint(Math.round(innerWidth / 2), Math.round(innerHeight * 0.4)); var k = []; for (var i = 0; e && i < 4; i++, e = e.parentElement) k.push((e.id ? "#" + e.id : e.tagName.toLowerCase()) + (typeof e.className === "string" && e.className ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : "")); return k.join("<"); } catch (e) { return "?"; } }
  async function film(navn, handling, ms, opt) {
    opt = opt || {};
    var TL = [], on = true, t0 = performance.now(), fra = synlige(), s0 = SKIFT.length;
    try { console.log("FILM " + Date.now() + " " + navn); } catch (e) {}
    (function skud() {
      TL.push({ t: Math.round(performance.now() - t0), v: synlige(), T: taeppe(), cv: cover(), A: i7(TITEL_A), B: i7(TITEL_B), m: midt() });
      if (on) requestAnimationFrame(skud);
    })();
    try { await handling(); } catch (e) { tjek(navn, false, "handlingen fejlede: " + (e && e.message || e)); on = false; return; }
    await V(ms || 3500); on = false;
    var til = TL[TL.length - 1].v, fejl = [];
    if (opt.maaFlytte !== false && JSON.stringify(til) === JSON.stringify(fra) && opt.skalSkifte) fejl.push("siden skiftede ikke (står stadig på " + til.join(",") + ")");
    var tredje = TL.filter(function (x) { return !x.T && x.v.some(function (id) { return fra.indexOf(id) < 0 && til.indexOf(id) < 0; }); });
    if (tredje.length) fejl.push("en tredje side ses: " + tredje[0].v.join(",") + " ved " + tredje[0].t + " ms");
    var tom = TL.filter(function (x, i) { return i > 1 && !x.T && !x.v.length; });
    if (tom.length) fejl.push("tom skærm i " + tom.length + " billeder fra " + tom[0].t + " ms");
    if (opt.ikke) { var g = TL.filter(function (x) { return x[opt.ikke]; }); if (g.length) fejl.push("den forrige brief (" + (opt.ikke === "A" ? TITEL_A : TITEL_B) + ") ses i " + g.length + " billeder fra " + g[0].t + " ms"); }
    var cv = TL.filter(function (x) { return x.cv; }), saaFoto = false, blink = null, h0 = null, spring = null;
    var nyEl = 0, sidstEl = null; cv.forEach(function (x) { if (x.cv.el !== sidstEl) { if (sidstEl) nyEl++; sidstEl = x.cv.el; } if (x.cv.foto) saaFoto = true; else if (saaFoto && !blink) blink = x; if (h0 === null) h0 = x.cv.h; else if (!spring && Math.abs(x.cv.h - h0) > 2) spring = { t: x.t, fra: h0, til: x.cv.h }; });
    if (blink) fejl.push("coveret blinker: billedet forsvinder igen ved " + blink.t + " ms");
    /* LOADEREN BLINKER (19/11): markbilledet maa kun komme, naar et skift er rigtig langsomt — og saa blive, til den nye side staar. Ses den i under 400 ms, er det et blink. */
    var ld = TL.filter(function (x) { return /#skDaek/.test(x.m || ""); });
    if (ld.length) { var lt0 = ld[0].t, lt1 = ld[ld.length - 1].t; if (lt1 - lt0 < 400) fejl.push("loaderen (markbilledet) blinker i " + (lt1 - lt0 + 16) + " ms fra " + lt0 + " ms"); }
    if (spring) fejl.push("coveret springer fra " + spring.fra + " til " + spring.til + " px ved " + spring.t + " ms");
    if (opt.foto && cv.length && !cv[cv.length - 1].cv.foto) fejl.push("coveret viser aldrig sit billede");
    var sk = SKIFT.slice(s0), sum = sk.reduce(function (a, e) { return a + e.v; }, 0);
    if (sum > 0.02) { var stoerst = sk.slice().sort(function (a, b) { return b.v - a.v; })[0]; fejl.push("indholdet hopper (" + sum.toFixed(3) + ", størst " + stoerst.v.toFixed(3) + " ved " + Math.round(stoerst.t - t0) + " ms i " + (stoerst.kilde || "?") + ")"); }
    var pause = 0, paaT = 0; for (var i = 1; i < TL.length; i++) { var g2 = TL[i].t - TL[i - 1].t; if (g2 > pause) { pause = g2; paaT = TL[i - 1].t; } }
    if (window.__HAK_REALTID && pause > 300) fejl.push("siden fryser i " + pause + " ms ved " + paaT + " ms (hakket)");
    var info = "billeder " + TL.length + " · længste pause " + pause + " ms ved " + paaT + " ms · cover set " + cv.length + " (tegnet " + (nyEl + (cv.length ? 1 : 0)) + " gange)/foto " + cv.filter(function (x) { return x.cv.foto; }).length + " · hop " + sum.toFixed(3);
    var seq = []; TL.forEach(function (x) { if (!seq.length || seq[seq.length - 1].m !== x.m) seq.push({ t: x.t, m: x.m }); });
    info += " · midten: " + seq.slice(0, 8).map(function (x) { return x.t + "ms " + x.m; }).join(" | ");
    (r.info = r.info || []).push(navn + ": " + info);
    tjek(navn + " · intet hak", !fejl.length, fejl.join(" · ") + (fejl.length ? " [" + fra.join(",") + " → " + til.join(",") + "] " + info : ""));
  }
  function kort(titel) { return [].filter.call(document.querySelectorAll("#screen8 [onclick*='openBrief']"), function (e) { return e.getClientRects().length && (e.innerText || "").indexOf(titel) > -1; })[0]; }
  try {
    await V(3500);
    try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    showTab(8); await V(2500);
    var a = kort(TITEL_A), b = kort(TITEL_B);
    tjek("Kalenderen har begge opslag", a && b, "fandt " + (a ? "A" : "-") + (b ? "B" : "-"));
    if (a && b) {
      await film("Kalenderen → brief med cover", function () { a.click(); }, 4500, { foto: true, skalSkifte: true });
      await film("Brief → Tilbage-knappen", function () { return briefTilbage(); }, 3500, { skalSkifte: true });
      b = kort(TITEL_B);
      await film("Kalenderen → en anden brief", function () { b.click(); }, 3500, { ikke: "A", skalSkifte: true });
      await film("Brief → browserens Tilbage (swipe tilbage)", function () { history.back(); }, 3500, { skalSkifte: true });
      a = kort(TITEL_A);
      if (a) await film("Kalenderen → briefen med cover igen", function () { a.click(); }, 4000, { foto: true, ikke: "B", skalSkifte: true });
      await film("Brief → browserens Tilbage igen", function () { history.back(); }, 3500, { skalSkifte: true });
    }
    await film("Menu: Idébanken", function () { showTab(2); }, 3000, { skalSkifte: true });
    await film("Browserens Tilbage fra Idébanken", function () { history.back(); }, 3000, { skalSkifte: true });
    await film("Browserens Frem til Idébanken", function () { history.forward(); }, 3000, { skalSkifte: true });
    await film("Menu: Hjem", function () { showTab(3); }, 3000, { skalSkifte: true });
    await film("Browserens Tilbage fra Hjem", function () { history.back(); }, 3000, { skalSkifte: true });
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
