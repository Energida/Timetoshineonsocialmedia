/* SIKKERHEDSCHEFEN · LØFTE 57 · MELLEMTILSTANDE (Ida 22/11: »GRUNDIGT gennemgår at alle klik på siden går naturligt og der ikke kommer alle de forstyrrende elementer når man navigerer rundt«).
   REGLEN: et klik giver ÉT skift. Fra det første nye billede efter klikket må intet synligt ændre plads, størrelse, farve eller synlighed mere end 40 ms senere.
   Metoden er briefens (probe-brief-rt.js): et aftryk af siden for HVERT tegnet billede (requestAnimationFrame), kørt i rigtig tid gennem realtid.mjs.
   Her er aftrykket alment: hvert synligt element (knapper, overskrifter, felter, billeder, fliser, popupper, slør, sider) med plads og størrelse, og fladerne (popup · slør · side) med farve og knapper.
   Tre slags brud, navngivet hver for sig:
     forskydning  et element, der allerede er vist, flytter sig eller skifter størrelse 2 px eller mere, senere end 40 ms efter første nye billede
     blink        et element eller en popups slør er synligt, væk og synligt igen inden for 400 ms
     ufaerdigt    en popup eller side er vist og skifter derefter flade, knapper eller højde, eller får/mister indhold senere end 40 ms
   Gruppen vælges med window.__MT_GRUPPE: kunde1 (menu, Hjem, popupper) · kunde2 (briefen, mødesiden) · kursus (lektionen) · backstage. */
(async function () {
  var G = window.__MT_GRUPPE || "kunde1";
  var r = { gruppe: G, bredde: innerWidth, tjek: [] };
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  var faerdig = false, L = function () { if (faerdig) return; faerdig = true; console.log("@@" + JSON.stringify(r) + "@@"); };
  var slut = setTimeout(function () { r.fejl = "tiden løb ud efter " + r.tjek.length + " scener"; L(); }, 135000);
  var EFTER = 40, RYK = 2, BLINK = 400;
  var POP = "#bsFlytMenu .bs-flyt-ark, .ark-slor .ark, .modal-back .modal, #modalBack.kt-side, #nyKodeBoks .nyk-ark, #planRit.on, #toemFuld";
  var SLOR = "#bsFlytMenu, .ark-slor, .modal-back, #planRit";
  var SEL = "button, a[href], [onclick], h1, h2, h3, h4, input, textarea, select, img, canvas, label, .screen, [role=dialog], [class*='flise'], [class*='kort'], [class*='card'], [class*='chip'], [class*='boks'], .tfl, .tfl-x, #lekNoteFelt, " + POP + ", " + SLOR;   /* .tfl · .tfl-x · #lekNoteFelt (23/11): rundvisningens flise og notefeltet var slet ikke med i aftrykket */
  var NR = new WeakMap(), NAVN = [], AREAL = [], naeste = 0;
  function nr(e) { var n = NR.get(e); if (n === undefined) { n = naeste++; NR.set(e, n); NAVN[n] = navn(e); AREAL[n] = 0; } return n; }
  function navn(e) {
    var k = []; for (var i = 0, x = e; x && i < 3 && x !== document.body; i++, x = x.parentElement) k.push(x.id ? "#" + x.id : (x.tagName.toLowerCase() + (typeof x.className === "string" && x.className.trim() ? "." + x.className.trim().split(/\s+/).slice(0, 2).join(".") : "")));
    var t = (e.tagName === "INPUT" || e.tagName === "TEXTAREA" ? (e.getAttribute("placeholder") || "") : (e.textContent || "")).replace(/\s+/g, " ").trim().slice(0, 30);
    return k.join("<") + (t ? " »" + t + "«" : "");
  }
  function ses(e) { try { return e.checkVisibility ? e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : !!e.getClientRects().length; } catch (x) { return !!e.getClientRects().length; } }
  function taeppe() { return ["appLoader", "privCover", "somkundeLoader", "energidaLoader", "skDaek"].some(function (i) { var e = document.getElementById(i); return !!(e && ses(e) && parseFloat(getComputedStyle(e).opacity || 1) > 0.5 && e.getBoundingClientRect().height > 100); }); }
  /* ÉT AFTRYK = alle synlige elementer i vinduet (plads og størrelse) + fladerne (farve, højde, knapper) */
  function aftryk() {
    var pos = new Map(), fl = new Map(), W = innerWidth, H = innerHeight, antal = 0;
    var alle = document.querySelectorAll(SEL);
    /* BAG ET DÆKKENDE LAG ER IKKE SYNLIGT (23/11, »Gå til lektion«): lektionen (#lekVis, fast, hele vinduet, uigennemsigtig) dækker forsiden, og forsiden tegnes om bagved.
       Står et sådant lag fremme, tælles et element uden for laget kun, hvis det øverste element i dets midte IKKE ligger i laget. */
    var daek = null; try { var lv = document.getElementById("lekVis"); if (lv && ses(lv)) { var lb = lv.getBoundingClientRect(), lc = getComputedStyle(lv); if (lb.width >= W * 0.8 /* på computeren står lektionen ved siden af menuen: 1204 af 1440 (v3453) — om et element er dækket, afgøres af punktet i dets midte nedenfor */ && lb.height >= H * 0.98 && parseFloat(lc.opacity || 1) >= 0.99 && !/rgba\([^)]*,\s*0(\.\d+)?\)$/.test(lc.backgroundColor) && lc.backgroundColor !== "transparent") daek = lv; } } catch (x) { daek = null; }
    for (var i = 0; i < alle.length && antal < 1600; i++) {
      var e = alle[i]; if (!ses(e)) continue;
      var b = e.getBoundingClientRect(); if (b.width < 2 || b.height < 2 || b.bottom < 0 || b.top > H || b.right < 0 || b.left > W) continue;
      if (daek && !daek.contains(e)) { var mx = Math.min(W - 1, Math.max(0, b.left + b.width / 2)), my = Math.min(H - 1, Math.max(0, b.top + b.height / 2)), tp = document.elementFromPoint(mx, my); if (tp && daek.contains(tp)) continue; }
      /* TEKSTSKIFT I EN UÆNDRET BOKS (23/11): rundvisningens flise har samme boks på alle trin, og notefeltet vokser ikke af ét tegn — uden teksten med i aftrykket gav de klik »intet synligt skift«.
         Kun dér tages tekstens længde og en lille sum med; alle andre steder er aftrykket som før. */
      var n = nr(e), pv = [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)];
      if (e.matches && e.matches(".tfl, .tfl-x, #lekNoteFelt")) { var tx = (e.textContent || ""), hs = 0; for (var ti = 0; ti < tx.length && ti < 400; ti++) hs = (hs * 31 + tx.charCodeAt(ti)) % 9973; pv.push(tx.length, hs); }
      pos.set(n, pv); antal++;
      var a = b.width * b.height; if (a > AREAL[n]) AREAL[n] = a;
    }
    var flader = document.querySelectorAll(POP + ", " + SLOR + ", .screen");
    for (var j = 0; j < flader.length; j++) {
      var f = flader[j]; if (!ses(f)) continue; var q = f.getBoundingClientRect(); if (q.width < 40 || q.height < 40) continue;
      var c = getComputedStyle(f); if (parseFloat(c.opacity || 1) < 0.05 || c.visibility === "hidden") continue;
      var erPop = f.matches(POP), kn = "";
      if (erPop) { var bs = f.querySelectorAll("button"), ord = []; for (var m = 0; m < bs.length && ord.length < 14; m++) { if (ses(bs[m])) ord.push(((bs[m].getAttribute("aria-label") || bs[m].textContent || "").replace(/\s+/g, " ").trim().slice(0, 16)) || "·"); } kn = " knapper[" + ord.join("|") + "]"; }
      fl.set(nr(f), "flade " + c.backgroundColor.replace(/\s/g, "") + (parseFloat(c.opacity) < 1 ? " gennemsigtig " + c.opacity : "") + (erPop ? " højde " + Math.round(q.height) : "") + kn);
    }
    return { t: performance.now(), pos: pos, fl: fl, T: taeppe(), rul: Math.round(scrollY) };
  }
  /* To billeder er ens, når de VISER det samme: samme navne på samme pladser og samme flader. Et element, der er tegnet på ny med samme udseende, er ikke et skift. */
  function sig(x) { if (x.sig) return x.sig; var l = []; x.pos.forEach(function (v, k) { l.push(NAVN[k] + "|" + v.join(",")); }); x.fl.forEach(function (v, k) { l.push(NAVN[k] + "¦" + v); }); l.sort(); return (x.sig = (x.T ? "T" : "") + l.join("\n")); }
  function ens(a, b) { return sig(a) === sig(b); }
  var kortNavn = function (n) { return NAVN[n] || "?"; };
  /* FILM ÉT KLIK og find de tre slags brud */
  async function film(scene, handling, ms, opt) {
    opt = opt || {};
    try { console.log("FILM " + scene); } catch (e) {}
    await V(opt.ro || 500);
    var F0 = aftryk(), B = [], on = true, t0 = 0;
    var rec = { navn: scene, tilstand: "ok", fund: [], info: "" };
    (function skud() { if (!on) return; B.push(aftryk()); requestAnimationFrame(skud); })();
    await new Promise(function (x) { requestAnimationFrame(function () { requestAnimationFrame(x); }); });
    t0 = performance.now();
    try { var svar = await handling(); if (svar === false) { on = false; rec.tilstand = "ikke"; rec.info = "fandt ikke det, der skulle klikkes på"; r.tjek.push(rec); return rec; } }
    catch (e) { on = false; rec.tilstand = "ikke"; rec.info = "klikket kunne ikke udføres: " + String(e && e.message || e).slice(0, 120); r.tjek.push(rec); return rec; }
    await V(ms || 1500); on = false;
    var efter = B.filter(function (x) { return x.t >= t0; });
    var i1 = -1; for (var i = 0; i < efter.length; i++) { if (!ens(F0, efter[i])) { i1 = i; break; } }
    if (i1 < 0) { rec.tilstand = "ikke"; rec.info = "klikket gav intet synligt skift (" + efter.length + " billeder)"; r.tjek.push(rec); return rec; }
    var X = efter.slice(i1), T1 = X[0].t, ms1 = function (t) { return Math.round(t - T1); };
    var pause = 0; for (var p = 1; p < efter.length; p++) pause = Math.max(pause, efter[p].t - efter[p - 1].t);
    rec.info = "første nye billede " + Math.round(T1 - t0) + " ms efter klikket · " + X.length + " billeder · længste pause " + Math.round(pause) + " ms";
    var popNr = {}; X.forEach(function (x) { x.fl.forEach(function (v, k) { popNr[k] = 1; }); });
    /* 1) FORSKYDNING: et element, der står i to billeder i træk, har flyttet sig eller skiftet størrelse senere end 40 ms efter første nye billede (og efter det selv blev vist) */
    var foerst = new Map();
    X[0].pos.forEach(function (v, k) { foerst.set(k, F0.pos.has(k) ? T1 : X[0].t); });
    for (var j = 1; j < X.length; j++) X[j].pos.forEach(function (v, k) { if (!foerst.has(k)) foerst.set(k, X[j].t); });
    /* samme element kan glide gennem mange billeder: saml pr. element, så en glidende bevægelse er ÉT fund med samlet vej og varighed */
    var prEl = {};
    for (var jj = 1; jj < X.length; jj++) {
      X[jj].pos.forEach(function (v, k) {
        var w = X[jj - 1].pos.get(k); if (!w) return;
        if (Math.abs(v[0] - w[0]) < RYK && Math.abs(v[1] - w[1]) < RYK && Math.abs(v[2] - w[2]) < RYK && Math.abs(v[3] - w[3]) < RYK) return;
        if (X[jj].t - Math.max(T1, foerst.get(k) || T1) <= EFTER) return;
        if (popNr[k] && v[0] === w[0] && v[1] === w[1]) return;
        var e = prEl[k] = prEl[k] || { fra: w, til: v, t0: X[jj].t, t1: X[jj].t, trin: 0 }; e.til = v; e.t1 = X[jj].t; e.trin++;
      });
    }
    var el = Object.keys(prEl).map(function (k) { var e = prEl[k]; e.k = +k; e.px = Math.max(Math.abs(e.til[0] - e.fra[0]), Math.abs(e.til[1] - e.fra[1]), Math.abs(e.til[2] - e.fra[2]), Math.abs(e.til[3] - e.fra[3])); return e; }).filter(function (e) { return e.px >= RYK || e.trin > 1; });
    /* saml elementer, der gør præcis det samme (samme vej, samme tidspunkt), til ét fund */
    var saml = {};
    el.forEach(function (e) { var n = [e.til[0] - e.fra[0], e.til[1] - e.fra[1], e.til[2] - e.fra[2], e.til[3] - e.fra[3], Math.round(ms1(e.t0) / 50)].join(","); var s = saml[n] = saml[n] || { n: 0, e: e }; s.n++; if (AREAL[e.k] > AREAL[s.e.k]) s.e = e; });
    Object.keys(saml).map(function (n) { return saml[n]; }).sort(function (a, b) { return b.e.px * Math.sqrt(b.n) - a.e.px * Math.sqrt(a.n); }).slice(0, 4).forEach(function (s) {
      var e = s.e, d = [e.til[0] - e.fra[0], e.til[1] - e.fra[1], e.til[2] - e.fra[2], e.til[3] - e.fra[3]], dele = [];
      if (d[0]) dele.push((d[0] > 0 ? "mod højre " : "mod venstre ") + Math.abs(d[0]) + " px"); if (d[1]) dele.push((d[1] > 0 ? "ned " : "op ") + Math.abs(d[1]) + " px");
      if (d[2]) dele.push("bredde " + e.fra[2] + " → " + e.til[2]); if (d[3]) dele.push("højde " + e.fra[3] + " → " + e.til[3]);
      if (!dele.length) dele.push("flytter sig frem og tilbage (" + e.trin + " trin)");
      var glider = e.trin > 2 && (e.t1 - e.t0) / e.trin < 60;
      rec.fund.push({ art: "forskydning", el: kortNavn(e.k), flere: s.n - 1, hvad: dele.join(" · ") + " (plads " + e.fra[0] + "," + e.fra[1] + " → " + e.til[0] + "," + e.til[1] + ")" + (glider ? " · glider i " + Math.round(e.t1 - e.t0) + " ms" : " · i ét ryk"), ms: ms1(e.t0), px: e.px });
    });
    /* 2) BLINK: samme element (navn + tekst) er synligt, væk og synligt igen inden for 400 ms. Slør og popupper tælles med; kun elementer over 600 px² */
    var sidstSet = {}, blink = {};
    var runde = [F0].concat(X);
    runde.forEach(function (x, idx) {
      var nu = {}; x.pos.forEach(function (v, k) { if (AREAL[k] >= 600) nu[NAVN[k]] = k; });
      Object.keys(nu).forEach(function (s) {
        var f = sidstSet[s];
        if (f && f.idx < idx - 1 && x.t - f.t <= BLINK && x.t > T1 && !blink[s]) blink[s] = { k: nu[s], vaek: Math.round(x.t - f.t), t: x.t, fraT: f.t };
        sidstSet[s] = { idx: idx, t: x.t };
      });
    });
    var bl = Object.keys(blink).map(function (s) { return blink[s]; }).sort(function (a, b) { return AREAL[b.k] - AREAL[a.k]; });
    bl.slice(0, 3).forEach(function (q, i) { rec.fund.push({ art: "blink", el: kortNavn(q.k), flere: i === 0 ? Math.max(0, bl.length - 3) : 0, hvad: "synligt → væk → synligt igen på " + q.vaek + " ms", ms: Math.max(0, ms1(q.fraT)), px: Math.round(Math.sqrt(AREAL[q.k])) }); });
    /* 3) UFÆRDIGT: en flade (popup · slør · side) skifter farve, højde eller knapper senere end 40 ms efter den blev vist; eller en vist flade får/mister indhold senere */
    var flFoerst = {}, flSidst = {};
    X.forEach(function (x) {
      x.fl.forEach(function (v, k) {
        if (flFoerst[k] === undefined) { flFoerst[k] = F0.fl.has(k) ? T1 : x.t; flSidst[k] = v; return; }
        if (flSidst[k] !== v) { if (x.t - Math.max(T1, flFoerst[k]) > EFTER && !rec.fund.some(function (f) { return f.art === "ufaerdigt" && f.k === k; })) { var h0 = +(/højde (\d+)/.exec(flSidst[k]) || [0, 0])[1], h1 = +(/højde (\d+)/.exec(v) || [0, 0])[1]; rec.fund.push({ art: "ufaerdigt", k: k, el: kortNavn(k), flere: 0, hvad: flSidst[k].slice(0, 150) + " → " + v.slice(0, 150), ms: ms1(x.t), px: Math.max(Math.abs(h1 - h0), 8) }); } flSidst[k] = v; }
      });
    });
    var sent = [], vaek = [], sidste = X[X.length - 1];
    foerst.forEach(function (t, k) { if (t - T1 > EFTER && sidste.pos.has(k) && AREAL[k] >= 600 && !blink[NAVN[k]]) sent.push({ k: k, t: t }); });
    X[0].pos.forEach(function (v, k) { if (!sidste.pos.has(k) && AREAL[k] >= 600) { var tv = 0; for (var q = X.length - 1; q >= 0; q--) { if (X[q].pos.has(k)) { tv = X[q + 1] ? X[q + 1].t : X[q].t; break; } } if (tv - T1 > EFTER) vaek.push({ k: k, t: tv }); } });
    var sp = function (k, x) { var v = x.pos.get(k); return NAVN[k] + "|" + (v ? v.join(",") : ""); };
    var vaekSig = {}; vaek.forEach(function (q) { var fr = null; for (var z = X.length - 1; z >= 0; z--) { if (X[z].pos.has(q.k)) { fr = X[z]; break; } } q.s = fr ? sp(q.k, fr) : ""; vaekSig[q.s] = (vaekSig[q.s] || 0) + 1; });
    var sentSig = {}; sent.forEach(function (q) { q.s = sp(q.k, sidste); sentSig[q.s] = (sentSig[q.s] || 0) + 1; });
    sent = sent.filter(function (q) { return !vaekSig[q.s]; }); vaek = vaek.filter(function (q) { return !sentSig[q.s]; });
    if (sent.length) { sent.sort(function (a, b) { return AREAL[b.k] - AREAL[a.k]; }); var tS = Math.max.apply(null, sent.map(function (s) { return s.t; })); rec.fund.push({ art: "ufaerdigt", el: kortNavn(sent[0].k), flere: sent.length - 1, hvad: "kommer først til efter første billede (det sidste efter " + ms1(tS) + " ms)", ms: ms1(sent[0].t), px: Math.round(Math.sqrt(AREAL[sent[0].k])) }); }
    if (vaek.length) { vaek.sort(function (a, b) { return AREAL[b.k] - AREAL[a.k]; }); rec.fund.push({ art: "ufaerdigt", el: kortNavn(vaek[0].k), flere: vaek.length - 1, hvad: "står i det første nye billede og forsvinder bagefter", ms: ms1(vaek[0].t), px: Math.round(Math.sqrt(AREAL[vaek[0].k])) }); }
    rec.fund.forEach(function (f) { delete f.k; });
    if (rec.fund.length) rec.tilstand = "fund";
    r.tjek.push(rec); return rec;
  }
  /* ---------- hjælpere til scenerne ---------- */
  var synlig = function (e) { return !!(e && ses(e) && e.getBoundingClientRect().width > 1); };
  var find = function (sel, tekst) { return [].filter.call(document.querySelectorAll(sel), function (e) { return synlig(e) && (!tekst || tekst.test((e.textContent || "").replace(/\s+/g, " ").trim())); })[0] || null; };
  var klik = function (sel, tekst) { return function () { var e = find(sel, tekst); if (!e) return false; e.click(); }; };
  var K = function (fn) { var a = [].slice.call(arguments, 1); return function () { if (typeof window[fn] !== "function") return false; window[fn].apply(window, a); }; };
  function ryd() { try { arkLuk(true); } catch (e) {} try { bsFlytLuk(); } catch (e) {} try { toemFotoLuk(); } catch (e) {} try { closeModal(); } catch (e) {} try { var p = document.getElementById("planRit"); if (p && p.classList.contains("on") && typeof planRitLuk === "function") planRitLuk(); } catch (e) {} }
  var mobil = innerWidth < 900;
  try {
    console.log("FILM start " + G + " " + innerWidth);
    await V(4000); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {} await V(600);
    if (G === "kunde1") {
      await film("Menu: Content kalenderen", K("showTab", 8), 2500);
      await film("Menu: Idébanken", K("showTab", 2), 2500);
      await film("Menu: Planlægning", K("showTab", 31), 2500);
      await film("Menu: Forsiden", K("showTab", 3), 2500);
      await film("Browserens Tilbage", function () { history.back(); }, 2500);
      await film("Browserens Frem", function () { history.forward(); }, 2500);
      try { showTab(3); } catch (e) {} await V(1500);
      await film("Forsiden: næste dag", function () { var e = find("[onclick*='hjemDagSkift(1)']") || [].filter.call(document.querySelectorAll("[onclick*='huDagVaelg']"), synlig)[2]; if (!e) return false; e.click(); });
      await film("Forsiden: dagen tilbage", function () { var e = find("[onclick*='hjemDagSkift(-1)']") || [].filter.call(document.querySelectorAll("[onclick*='huDagVaelg']"), synlig)[1]; if (!e) return false; e.click(); });
      await film("Plusset: åbn", K("plusArk"));
      await film("Plusset → Aftale", K("plusArkVaelg", "akt"));
      await film("Aftale → Ugens møde", klik("#aftPlusChips .ark-chip, .aft-plus-chips .ark-chip", /Ugens møde/));
      await film("Møde-arket → Månedens møde", klik(".pm-type .ark-chip", /Månedens møde/));
      await film("Møde-arket: luk", function () { ryd(); });
      await film("Plusset: åbn igen", K("plusArk"));
      await film("Plusset → Content-idé (Ny idé)", K("plusArkVaelg", "ide"));
      await film("Ny idé: luk", function () { ryd(); });
      await film("Plusset: åbn tredje gang", K("plusArk"));
      await film("Plusset: luk med krydset", klik(".plus-ark-luk"));
      try { showTab(2); } catch (e) {} await V(1800);
      await film("Idébanken: plusset åbn", K("plusArk"));
      await film("Idébanken: plusset → Link", K("plusArkVaelg", "link"));
      await film("Link: luk", function () { ryd(); });
      try { showTab(8); } catch (e) {} await V(1800);
      await film("Kalenderen: plusset åbn", K("plusArk"));
      await film("Kalenderen: plusset → Nyt opslag", K("plusArkVaelg", "opslag"), 3000);
    }
    if (G === "kunde2") {
      try { showTab(8); } catch (e) {} await V(2200);
      await film("Kalenderen → briefen", function () { var e = [].filter.call(document.querySelectorAll("#screen8 [onclick*='openBrief']"), synlig)[0]; if (!e) return false; e.click(); }, 4000);
      var trin = function (i) { return function () { var e = document.querySelectorAll("#b3Trin .b3-tf")[i]; if (!e || !synlig(e)) return false; e.click(); }; };
      await film("Briefen: Skriv → Optag", K("b3Vaelg", "optag"));
      await film("Briefen: Optag → Post", K("b3Vaelg", "post"));
      await film("Briefen: Post → Skriv", K("b3Vaelg", "skriv"));
      try { b3Vaelg("skriv"); } catch (e) {} try { briefProcesGaa(0); } catch (e) {} await V(1400);
      if (!mobil) {
        await film("Briefen: Overblikket → Fang dem", trin(1));
        await film("Briefen: Næste", klik("#briefSideNav button", /Næste/));
        await film("Briefen: → Få dem til at handle", trin(3));
        await film("Briefen: → Overblikket", trin(0));
      } else {
        await film("Briefen (telefon): Næste", klik("#briefSideNav button, .b3-nav button", /Næste/));
        await film("Briefen (telefon): Næste igen", klik("#briefSideNav button, .b3-nav button", /Næste/));
        await film("Briefen (telefon): Tilbage", klik("#briefSideNav button, .b3-nav button", /Tilbage/));
      }
      /* fakta, »Tilføj« og den røde hjælp står på Overblikket — også på telefonen (dér ligger faktaboksen under felterne; arket, der åbner, er fast på skærmen) */
      try { briefProcesGaa(0); } catch (e) {} await V(1200);
      await film("Briefen: en faktarække åbnes", klik("#briefRail .fb-boks .fb-rk[onclick], .fb-boks .fb-rk[onclick], .fb-boks [onclick]"));
      await film("Briefen: faktarækken lukkes", function () { var a = document.activeElement; ryd(); try { document.body.click(); } catch (e) {} if (a && a.blur) a.blur(); });
      await film("Briefen: »Tilføj« under fakta", klik(".fb-pil-tilfoej, [onclick^='briefTilfoejLinkArk']"));
      await film("Briefen: »Tilføj« lukkes", function () { ryd(); try { document.body.click(); } catch (e) {} });
      /* den røde hjælp = det røde i ved spørgsmålet (b3Hjaelp): computeren skifter flisen til højre, telefonen åbner et ark */
      await film("Briefen: den røde hjælp", klik("#screen7 button.b3-i"));
      await film("Briefen: hjælpen lukkes", klik("#briefHjaelp .b3h-luk, #bsFlytMenu .b3h-arkluk"));
      try { b3HjaelpLuk(); } catch (e) {} ryd();
      /* forslag og tilvalgs-chips står på »Fang dem« */
      try { briefProcesGaa(1); } catch (e) {} await V(1400);
      await film("Briefen: et forslag vælges", klik("#screen7 button[onclick^='briefForslagVaelg']"));
      /* tilvalgs-chippen (»Tekst på skærmen« · »Hvad siger du?«) åbner sit felt i klip 1. Den sidste chip vælges (den første kan allerede være åben, når opslaget har en tekst), og den rulles ind i vinduet først — på telefonen står den under folden. */
      var chipSidst = function () { var l = [].filter.call(document.querySelectorAll("#kkHookTilfoej .ark-chip, #screen7 [onclick^='briefHookTypeTilfoej']"), synlig); return l[l.length - 1] || null; };
      try { var chip0 = chipSidst(); if (chip0) chip0.scrollIntoView({ block: "center" }); } catch (e) {} await V(700);
      await film("Briefen: en tilvalgs-chip", function () { var e = chipSidst(); if (!e) return false; e.click(); });
      await film("Briefen → Tilbage", K("briefTilbage"), 3000);
      /* mødesiden */
      await film("Mødesiden: åbn", K("moedeSideAaben"), 3000);
      var rum = function () { return document.getElementById("moedeSideRum") || document.getElementById("screen24"); };
      await film("Mødesiden: skift type", function () { var e = rum() && rum().querySelector(".mo-type-rk .ark-chip:not(.on)"); if (!e || !synlig(e)) return false; e.click(); });
      await film("Mødesiden: skift type tilbage", function () { var e = rum() && rum().querySelector(".mo-type-rk .ark-chip:not(.on)"); if (!e || !synlig(e)) return false; e.click(); });
      await film("Mødesiden: åbn gennemgangen", function () { var e = (rum() && rum().querySelector(".mo-gennemgaa")) || find("[onclick*='planRitStart']"); if (!e || !synlig(e)) return false; e.click(); }, 3000);
      var faner = function () { var pr = document.getElementById("planRit"); return pr ? [].filter.call(pr.querySelectorAll(mobil ? "#prFaner button" : ".pr-rail-rk"), synlig) : []; };
      await film("Gennemgangen: fane 2", function () { var f = faner(); if (f.length < 2) return false; f[1].click(); });
      await film("Gennemgangen: fane 3", function () { var f = faner(); if (f.length < 3) return false; f[2].click(); });
      await film("Gennemgangen: første fane igen", function () { var f = faner(); if (f.length < 2) return false; f[0].click(); });
      await film("Gennemgangen: luk", function () { var pr = document.getElementById("planRit"); var e = pr && pr.classList.contains("on") && (pr.querySelector(".mb-sti > button") || pr.querySelector(".ark-kryds, [onclick*='planRitLuk']")); if (!e) return false; e.click(); }, 2500);
    }
    if (G === "kunde2") {
      /* KALENDEREN RULLET NED → BRIEFEN (Ida 23/11: »i øvrigt rykker hele skærmen sig stadig når man klikker på en contentflise i kalenderen - alt det hak skal fandmem stoppe«).
         Målt på live 3450 af »Briefen«: .content.scrollTop 300 → 467 → 300 → 0 → 300, mens kalenderen stadig var den synlige side. Scenen ruller 500 px ned, trykker med mus (pointerdown … click)
         og måler rulningen i en requestAnimationFrame, der er sat op FØR trykket: fra trykket til briefen ses, må kalenderens rulning ikke flytte sig 1 px. */
      try { ryd(); showTab(8); } catch (e) {} await V(2400);
      var cnt = document.querySelector(".content"); if (cnt) cnt.scrollTop = 500; await V(700);
      var s0 = cnt ? Math.round(cnt.scrollTop) : 0;
      if (!cnt || s0 < 200) r.tjek.push({ navn: "Kalenderen (rullet ned) → briefen", tilstand: "ikke", fund: [], info: "kalenderen kan ikke rulles 200 px ned (nåede " + s0 + ")" });
      else {
        var prv = { on: true, max: 0, t: 0, t0: 0 };
        var tik = function () { if (!prv.on) return; var s7 = document.getElementById("screen7"); if (s7 && s7.classList.contains("active") && synlig(s7)) { prv.on = false; return; } var d = Math.abs(cnt.scrollTop - s0); if (d > prv.max) { prv.max = d; prv.t = performance.now(); } requestAnimationFrame(tik); };
        var recK = await film("Kalenderen (rullet ned) → briefen", function () {
          var e = [].filter.call(document.querySelectorAll("#screen8 .uge-op, #screen8 [onclick*='openBrief']"), function (x) { if (!synlig(x)) return false; var b = x.getBoundingClientRect(); return b.top > 120 && b.bottom < innerHeight - 100; })[0]; if (!e) return false;
          var b = e.getBoundingClientRect(), x0 = b.left + b.width / 2, y0 = b.top + b.height / 2, o = { bubbles: true, cancelable: true, clientX: x0, clientY: y0, button: 0, pointerId: 1, pointerType: "mouse", isPrimary: true, view: window };
          prv.t0 = performance.now(); requestAnimationFrame(tik);
          e.dispatchEvent(new PointerEvent("pointerdown", o)); e.dispatchEvent(new MouseEvent("mousedown", o)); e.dispatchEvent(new PointerEvent("pointerup", o)); e.dispatchEvent(new MouseEvent("mouseup", o)); e.dispatchEvent(new MouseEvent("click", o));
        }, 4000);
        prv.on = false;
        if (recK && recK.tilstand !== "ikke" && prv.max >= 1) { recK.fund.push({ art: "forskydning", el: ".content", flere: 0, hvad: "kalenderens rulning flyttede sig " + Math.round(prv.max) + " px, før briefen stod (rullet " + s0 + " px ned)", ms: Math.max(0, Math.round(prv.t - prv.t0)), px: Math.round(prv.max) }); recK.tilstand = "fund"; }
        try { history.back(); } catch (e) {} await V(1500);
      }
    }
    if (G === "kursus") {
      try { OB_SKEMA = true; } catch (e) {}
      await film("Menu: Dit forløb", K("showTab", 12), 3000);
      var lek = function () { return [].filter.call(document.querySelectorAll("#screen12 [onclick*='visLektion']"), synlig)[0]; };
      await film("Åbn en lektion", function () { var e = lek(); if (!e) return false; e.click(); }, 3500);
      /* NOTEFELTET UDEN STARTKNAPPER (Ida 23/11: »tror bare det skal være skriv der er en slags placeholder i feltet i stedet. keep it simple«): findes knapperne stadig (udgaver før de blev fjernet), trykkes den første; ellers skrives der i feltet */
      await film("Notefeltet: første tegn", function () { var e = [].filter.call(document.querySelectorAll("#lekNoteStart button"), synlig)[0]; if (e) { e.click(); return; } var f = document.getElementById("lekNoteFelt"); if (!f) return false; f.focus(); f.textContent = "Det tog jeg med"; f.dispatchEvent(new Event("input", { bubbles: true })); });
      await film("Notefeltet: tømmes igen", function () { var f = document.getElementById("lekNoteFelt"); if (!f) return false; f.innerHTML = ""; f.dispatchEvent(new Event("input", { bubbles: true })); f.blur(); });
      await film("Lektionen lukkes (Tilbage)", function () { history.back(); }, 3000);
      /* »Mine noter« har ingen knap i lektionen længere (»Alle noter« blev fjernet fra notefeltet 15/11): siden åbnes fra Værktøjskassens flise, som kalder vkNoterAabn. Samme funktion kaldes her (Værktøjskassen er låst for den opdigtede kursuskunde, så flisen kan ikke trykkes). */
      await film("»Mine noter« åbnes", function () { if (typeof vkNoterAabn !== "function") return false; vkNoterAabn(); }, 3000);
      await film("Tilbage fra »Mine noter«", function () { var s = document.getElementById("screen27"); if (!s || !s.classList.contains("active")) return false; history.back(); }, 3000);
      /* RUNDVISNINGEN (Ida 23/11: »når rundvisningen starter. - så bliver den røde flise større??? og når man klikker mellem rundvisningen, ser man den mørkerøde boks under???? alt det her hak skal væk!!!«):
         velkomsten → Start rundvisningen → hvert Næste → Tilbage. Ud over de tre almindelige brud måles to ting pr. klik, 600 ms efter: flisens boks må ikke ændre sig fra velkomsten (≥ 2 px), og der må højst stå ÉN flise (.tfl) på skærmen. */
      try { TUR_FL_FORCE = true; TUR_FL_I = 0; } catch (e) {}
      await film("Rundvisningen: forsiden med velkomsten", K("showTab", 3), 3000);
      try { turStartKortTegn(); } catch (e) {}
      await V(300);
      /* laget har sin egen kopi af flisen, og det gamle lags knapper er slået fra: tryk på den SIDSTE synlige knap, der ikke er slået fra */
      var turKn = function (sel, rx) { return function () { var l = [].filter.call(document.querySelectorAll(sel), function (e) { return synlig(e) && !e.disabled && getComputedStyle(e).visibility !== "hidden" && getComputedStyle(e).pointerEvents !== "none" && rx.test((e.textContent || "").replace(/\s+/g, " ").trim()); }); if (!l.length) return false; l[l.length - 1].click(); }; };
      var tfl = function () { return [].filter.call(document.querySelectorAll(".tfl"), synlig); };
      var boks = function () { var l = tfl(); if (!l.length) return null; var b = l[l.length - 1].getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top + scrollY), Math.round(b.width), Math.round(b.height)]; };
      var b0 = boks();
      var tur = async function (navn, handling) {
        var trF = window.__TUR_FL_NU;
        var rec = await film(navn, handling, 2500);
        if (rec) rec.info = (rec.info || "") + " [trin " + trF + " → " + window.__TUR_FL_NU + "]";
        if (!rec || rec.tilstand === "ikke") return rec;
        await V(600);
        var b = boks(), n = tfl().length;
        if (b0 && b && (Math.abs(b[2] - b0[2]) >= 2 || Math.abs(b[3] - b0[3]) >= 2 || Math.abs(b[0] - b0[0]) >= 2 || Math.abs(b[1] - b0[1]) >= 2)) { rec.fund.push({ art: "forskydning", el: ".tfl", flere: 0, hvad: "rundvisningens flise har ikke velkomstens boks: " + b0.join(",") + " → " + b.join(","), ms: 600, px: Math.max(Math.abs(b[2] - b0[2]), Math.abs(b[3] - b0[3]), Math.abs(b[0] - b0[0]), Math.abs(b[1] - b0[1])) }); rec.tilstand = "fund"; }
        if (n > 1) { rec.fund.push({ art: "ufaerdigt", el: ".tfl", flere: 0, hvad: n + " fliser synlige på samme tid (den nedtonede under laget)", ms: 600, px: 0 }); rec.tilstand = "fund"; }
        return rec;
      };
      if (!b0) r.tjek.push({ navn: "Rundvisningen: start", tilstand: "ikke", fund: [], info: "velkomstflisen står ikke på forsiden" });
      else {
        await tur("Rundvisningen: start", turKn(".tfl-hk", /Start rundvisningen/));
        for (var tn = 1; tn <= 6; tn++) { if (!find(".tfl-hk", /^Næste$/)) break; await tur("Rundvisningen: Næste (" + tn + ")", turKn(".tfl-hk", /^Næste$/)); }
        await tur("Rundvisningen: Tilbage", turKn(".tfl-tl", /^Tilbage$/));
        /* »GÅ TIL LEKTION« (Ida 23/11: »når man afslutter rundvisningen - så ser man lige hurtigt dashboardet indtil man bliver sendt ind på forløbet?!«): frem til sidste stop uden at filme, og så ét klik, der skal være ét skift */
        for (var tq = 0; tq < 12 && !find(".tfl-hk", /^Gå til lektion$/); tq++) { var nk = find(".tfl-hk", /^Næste$/); if (!nk) break; nk.click(); await V(700); }
        await film("Rundvisningen: Gå til lektion", klik(".tfl-hk", /^Gå til lektion$/), 3500);
        try { TUR_FL_FORCE = true; TUR_FL_I = 1; showTab(3); turStartKortTegn(); } catch (e) {}
        await V(900);
        if (find(".tfl button", /^Spring over$/)) await film("Rundvisningen: Spring over", klik(".tfl button", /^Spring over$/), 2500);
      }
      try { TUR_FL_FORCE = false; turFlOverlayFjern(); } catch (e) {}
    }
    if (G === "backstage") {
      var bsSider = [].filter.call(document.querySelectorAll("#dashNav [onclick], .dash-nav [onclick], nav [onclick*='dashGaa'], [onclick*='visDashSide'], [onclick*='dashSide(']"), synlig);
      r.menu = bsSider.slice(0, 12).map(function (e) { return (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 20); });
      var bsKlik = function (rx) { return function () { var e = [].filter.call(document.querySelectorAll("[onclick]"), function (x) { return synlig(x) && x.closest("nav, aside, #dashNav, .dash-nav, .sidebar, #burgerMenu, [class*='menu']") && rx.test((x.textContent || "").replace(/\s+/g, " ").trim()); })[0]; if (!e) return false; e.click(); }; };
      await film("Backstage: CRM", bsKlik(/^CRM\b/), 3500);
      await film("Backstage: Hjem (mens tallene hentes)", bsKlik(/^(Hjem|Overblik)\b/), 5000);
      /* telefonen: Mails står bag »Mere« i bundmenuen (sidepanelet med dørene) — panelet åbnes først, så døren kan trykkes */
      var mailsDoer = function () { return find('.dsb-doer[data-doer-m="mails"]'); };
      if (mobil && !mailsDoer()) await film("Backstage: »Mere« åbnes", function () { var e = find("#dashBundnav [onclick*='dsbPanelSkift']"); if (!e) return false; e.click(); }, 1500);
      await film("Backstage: Mails", function () { var e = mobil ? mailsDoer() : null; if (e) { e.click(); return; } return bsKlik(/^Mails?\b/)(); }, 3500);
      try { if (mobil && document.body.classList.contains("dsb-aaben")) dsbPanelSkift(true); } catch (e) {}
      await film("Backstage: Hjem igen", bsKlik(/^(Hjem|Overblik)\b/), 5000);
      await film("Backstage: browserens Tilbage", function () { history.back(); }, 3500);
    }
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
