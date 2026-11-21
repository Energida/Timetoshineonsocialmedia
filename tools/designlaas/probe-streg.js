/* ÉN STREG (HÅRD, Ida 18/11: »skillestregen skal have en funktion og ofte kun bruges mellem 2 stykker tekst! Aldrig over en tekstboks eller flise uden formål«).
   Finder hver synlig vandret streg (en tynd flade, en kant i én side eller <hr>) og ser, hvad der står LIGE over og LIGE under den.
   OK = tekst på begge sider. FEJL = et felt, en flise eller tom luft på en af siderne. STREG_FLADE = "kunde", "brief" eller "dash" sættes af koer.sh. */
setTimeout(async function () {
  var vent = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var FLADE = (typeof STREG_FLADE === "string") ? STREG_FLADE : "kunde";
  /* KALENDERENS GITTER ER IKKE SKILLESTREGER (Ida 21/11: »mangler lodrette linjer mellem dagene (svagt grå) og jeg mangler linje under datoerne«): linjerne i ugegitteret (.uge-grid) måles ikke som streger */
  var MENU = ".uge-grid, #sideNav, #burgerMenu, .bottom-nav, #versionsFod, .dash-sidebar, #dashSidebar, #virkMenu, #dashMenu, #bundNav, .bund-nav, .mb-baand, .bs-baand, .hf-hero, .lek-top, #turOverlay, .tur-slor, #dashFooter, #dashBundnav, #briefSideNav";
  var FELT = "input, textarea, select, [contenteditable=''], [contenteditable='true'], .bdrop-knap, .ark-felt, .bs3-felt, .bs3-drop";
  var rgb = function (s) { var m = String(s).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] } : null; };
  var lys = function (c) { return (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255; };
  var navn = function (e) { var c = String(e.className && e.className.baseVal != null ? e.className.baseVal : e.className || "").split(/\s+/).filter(Boolean)[0]; return e.id ? "#" + e.id : (c ? "." + c : e.tagName.toLowerCase()); };
  var synlig = function (e) { var q = e.getBoundingClientRect(); if (q.width < 2) return false; var c = getComputedStyle(e); if (c.display === "none" || c.visibility === "hidden" || parseFloat(c.opacity) < 0.05) return false; for (var a = e; a && a !== document.body; a = a.parentElement) { var ca = getComputedStyle(a); if (ca.display === "none" || ca.visibility === "hidden" || parseFloat(ca.opacity) < 0.05) return false; } return true; };
  var erFlise = function (e) {
    if (!e || e === document.body || e === document.documentElement) return false; var c = getComputedStyle(e), bg = rgb(c.backgroundColor), r = parseFloat(c.borderTopLeftRadius) || 0, q = e.getBoundingClientRect();
    if (!bg || bg.a < 0.9 || lys(bg) < 0.9 || r < 10) return false; if (q.width > innerWidth * 0.97 && q.height > innerHeight * 0.8) return false;
    return c.boxShadow !== "none" || parseFloat(c.borderTopWidth) > 0;
  };
  var fliseAf = function (e) { for (var a = e; a && a !== document.body; a = a.parentElement) if (erFlise(a)) return a; return null; };
  /* SYMBOLFELTET ER PYNT FORAN EN TEKST, IKKE EN FLISE (DESIGNLÅS 19/11 »SYMBOLFELTER ER LYSEBLÅ ALLE STEDER«: »det runde felt med et symbol foran en tekst«, og 19/11 om faktaboksen:
     »rundt lyseblåt symbolfelt 44 … navn 13 grå · værdi 15 · hårfin streg mellem rækkerne«). Rammer målingen et symbolfelt (rundt · 36–44 · #F4F7FA · med et symbol · uden ord), tæller teksten, det står foran i samme række.
     Står der ingen tekst ved siden af det, tæller det ikke som tekst, og målingen leder videre. */
  var symbolfelt = function (e) { for (var a = e; a && a !== document.body; a = a.parentElement) { var q = a.getBoundingClientRect(); if (q.width > 45 || q.height > 45) return null; if (a.tagName.toLowerCase() === "svg" || a.closest("svg")) continue; var c = getComputedStyle(a), k = rgb(c.backgroundColor);
    if (q.width >= 35 && Math.abs(q.width - q.height) <= 1 && (parseFloat(c.borderTopLeftRadius) || 0) >= q.width / 2 - 1 && k && k.a > 0.9 && k.r === 244 && k.g === 247 && k.b === 250 && a.querySelector("svg") && !(a.innerText || "").trim()) return a; } return null; };
  var egenTekst = function (e) { return [].some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim().length > 0; }); };
  /* hvad står i retning dir (-1 op, +1 ned) fra stregen? */
  var nabo = function (linje, y, x, dir) {
    var lf = fliseAf(linje);
    for (var d = 3; d <= 72; d += 3) {
      var yy = y + dir * d; if (yy < 1 || yy > innerHeight - 1) return "kant";
      var el = document.elementFromPoint(x, yy); if (!el || el === linje || el.contains(linje)) continue;
      if (el.closest(FELT)) return "felt";
      var sf = symbolfelt(el); if (sf) { if (sf.parentElement && (sf.parentElement.innerText || "").trim()) return "tekst"; continue; }
      if (egenTekst(el) || (el.tagName === "IMG") || (el.closest("button, .ark-chip, a") && (el.closest("button, .ark-chip, a").innerText || "").trim())) return "tekst";
      var f = fliseAf(el); if (f && f !== lf && !f.contains(linje)) return "flise";
    }
    return "luft";
  };
  var FUND = {}, OK = 0, FEJL = 0, SET = new Set();
  var maal = function (side) {
    var alle = document.querySelectorAll("body *");
    var linjer = [];
    for (var i = 0; i < alle.length; i++) {
      var e = alle[i]; if (e.closest(MENU) || e.closest("svg") || e.tagName === "svg") continue;
      var c = getComputedStyle(e), q = e.getBoundingClientRect(); if (q.width < 40) continue;
      var bt = parseFloat(c.borderTopWidth) || 0, bb = parseFloat(c.borderBottomWidth) || 0, bl = parseFloat(c.borderLeftWidth) || 0, br = parseFloat(c.borderRightWidth) || 0;
      var synligK = function (w, col) { var k = rgb(col); return w >= 0.5 && w <= 2.5 && k && k.a > 0.15 && lys(k) < 0.97; };
      if (e.tagName === "HR" || (q.height > 0 && q.height <= 2.5 && rgb(c.backgroundColor) && rgb(c.backgroundColor).a > 0.15)) linjer.push([e, "flade"]);
      else if (!(bl > 0 || br > 0)) {   /* en kasse med kant hele vejen rundt er en ramme, ikke en streg */
        if (synligK(bt, c.borderTopColor)) linjer.push([e, "top"]);
        if (synligK(bb, c.borderBottomColor)) linjer.push([e, "bund"]);
      }
    }
    linjer.forEach(function (L) {
      var e = L[0]; if (!synlig(e)) return;
      try { e.scrollIntoView({ block: "center" }); } catch (x) {}
      var q = e.getBoundingClientRect(); if (q.bottom < 0 || q.top > innerHeight) return;
      var y = L[1] === "top" ? q.top : (L[1] === "bund" ? q.bottom : (q.top + q.bottom) / 2);
      var x = Math.min(innerWidth - 2, Math.max(2, q.left + Math.min(40, q.width / 2)));
      var selv = (!e.closest(FELT) && !e.matches(FELT) && (e.innerText || "").trim()) ? "tekst" : "";   /* stregen er elementets egen kant: dets tekst står på den side */
      var over = (L[1] === "bund" && selv) ? "tekst" : nabo(e, y, x, -1), under = (L[1] === "top" && selv) ? "tekst" : nabo(e, y, x, 1);
      var ok = over === "tekst" && under === "tekst";
      var k = (ok ? "OK " : "FEJL ") + side + " · " + navn(e) + " (" + L[1] + ") · over: " + over + " · under: " + under;
      if (SET.has(k)) return; SET.add(k);
      if (ok) OK++; else { FEJL++; FUND[k] = 1; }
    });
  };
  try {
    for (var v = 0; v < 50 && FLADE !== "dash" && !document.body.classList.contains("app-klar"); v++) await vent(150);
    ["appLoader", "turOverlay", "dagensKort", "nyVersion"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    try { turLuk(); window.turStart = function () {}; } catch (e) {} try { dagensKortLuk(); } catch (e) {}
    var SIDER;
    if (FLADE === "kunde") SIDER = [
      ["hjem", function () { showTab(3); }], ["idebanken", function () { showTab(2); }], ["inspiration", function () { showTab(2); ibVis("insp"); }],
      ["kalenderen", function () { showTab(8); }], ["planlaegning", function () { showTab(31); }], ["performance", function () { openMaal(); }], ["indbakken", function () { indbakkenAaben(); }],
      ["vaerktoejskassen", function () { vaerktoejAaben(); }], ["hashtagbanken", function () { htbAabn(); }], ["drejebogen", function () { drejebogAaben(); }],
      ["maalsaetninger", function () { tilpasAaben("maal"); }], ["tema", function () { tilpasAaben("tema"); }], ["forloebsoversigt", function () { openForloeb(); }],
      ["to-do", function () { haengSideAabn(); }], ["profil", function () { minProfilAaben(); }],
      ["moedesiden", function () { try { planRitLuk(); } catch (e) {} moedeSideAaben(); }]
    ];
    else if (FLADE === "brief") {
      try { IDEER.push({ id: "strg1", titel: "Lange frakker", soejle: "Produkt", type: "Reel", status: "Brief i gang", dato: "2026-11-23", brief: { format: "Reel", platform: ["Instagram"], beskrivelse: "Vi viser frakkerne.", maal: "Flere besøg", hookTekst: "", klip: [{ ser: "" }] } }); } catch (e) {}
      SIDER = [["brief-forside", function () { openBriefSide("strg1"); }]];
      for (var s = 0; s < 4; s++) for (var t = 0; t < 4; t++) (function (s, t) { SIDER.push(["brief-trin" + (s + 1) + "." + (t + 1), function () { BRIEF_SIDE_AKTIV = s; BRIEF_TRIN_AKTIV = t; briefMbVis("skriv");
        /* de valgfrie felter (+ Tekst · + Manus …) åbnes, så stregerne mellem felterne også måles (Idas fund 18/11: stregen mellem »Det, man ser« og »Tekst på skærmen«) */
        setTimeout(function () { [].forEach.call(document.querySelectorAll("#briefWrap button"), function (x) { if ((/^\+\s*\S/.test((x.innerText || "").trim()) || x.classList.contains("bf-plads")) && x.offsetParent) try { x.click(); } catch (e) {} }); }, 120); }]); })(s, t);
    }
    else SIDER = ["overblik", "indbakke", "crm", "gsd", "energida", "klip", "opgbib", "vaner", "maskinrum", "budget", "kunde"].map(function (s) { return [s, function () { try { planRitLuk(); } catch (e) {} visDashSide(s); }]; });
    for (var i = 0; i < SIDER.length; i++) {
      try { SIDER[i][1](); } catch (e) { continue; }
      await vent(FLADE === "brief" ? 500 : 1000);
      ["turOverlay"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
      try { maal(SIDER[i][0]); } catch (e) { console.log("SELE STREG FEJL maalingen: " + SIDER[i][0] + " " + (e && e.message)); FEJL++; }
      /* KALENDERENS GITTER ER LÅST (Ida 21/11: »kan du ikke sørge for det ikke kan ske igen?« — linjerne forsvandt, da en farve blev lysere, og en fejning tog linjen under datoerne):
         ugekalenderen på computeren har ÉN ramme, en SYNLIG linje foran hver dag efter den første og en SYNLIG linje under hver dato. Synlig = mindst 1 px og mørkere end 92 % lys (#DEDEDE er 87 %, #F8F8F8 er 97 %). */
      if (FLADE === "kunde" && SIDER[i][0] === "kalenderen" && innerWidth >= 900) { try { var ug = document.querySelector("#screen8 .uge-grid:not(.kal-endag)"); if (!ug) { console.log("SELE STREG FEJL KALENDERENS GITTER: ugegitteret findes ikke"); FEJL++; } else { var lysK = function (c) { var k = rgb(c); return k ? lys(k) : 1; }, kf = [];
        [].slice.call(ug.querySelectorAll(".uge-dag")).forEach(function (d, n) { var c = getComputedStyle(d); if (n > 0 && !(parseFloat(c.borderLeftWidth) >= 1 && c.borderLeftStyle !== "none" && lysK(c.borderLeftColor) < 0.92)) kf.push("ingen synlig linje foran dag " + (n + 1));
          var t = d.querySelector(".uge-top"); if (t) { var ct = getComputedStyle(t); if (!(parseFloat(ct.borderBottomWidth) >= 1 && ct.borderBottomStyle !== "none" && lysK(ct.borderBottomColor) < 0.92)) kf.push("ingen synlig linje under datoen, dag " + (n + 1)); } });
        var cg = document.getElementById("calGrid"); if (cg && parseFloat(getComputedStyle(cg).borderTopWidth) > 0 && parseFloat(getComputedStyle(ug).borderTopWidth) > 0) kf.push("to rammer om ugen");
        if (parseFloat(getComputedStyle(ug).borderTopWidth) < 1) kf.push("ugen har ingen ramme");
        if (kf.length) { console.log("SELE STREG FEJL KALENDERENS GITTER: " + kf.slice(0, 4).join(" · ")); FEJL++; } else console.log("SELE STREG KALENDERENS GITTER OK (" + innerWidth + ")"); } } catch (e) { console.log("SELE STREG FEJL KALENDERENS GITTER: " + (e && e.message)); FEJL++; } }
    }
    Object.keys(FUND).sort().forEach(function (k) { console.log("SELE STREG " + k); });
    console.log(FEJL ? "SELE STREG FEJL: " + FEJL + " streger uden tekst på begge sider, " + OK + " i orden (" + FLADE + " " + innerWidth + ")" : "SELE STREG OK: " + OK + " streger står mellem tekst (" + FLADE + " " + innerWidth + ")");
  } catch (e) { console.log("SELE STREG FEJL probe: " + (e && e.message)); }
}, 600);
