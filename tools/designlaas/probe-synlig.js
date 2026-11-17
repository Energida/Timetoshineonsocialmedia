/* DE SYNLIGE REGLER (fase 2 af »UX-politiet skal fange alle reglerne«, Ida 17/11 »Ja, start fase 2«).
   Måler på det, man SER (farve, størrelse, tekst, placering) — aldrig på klassenavne alene, så en håndbygget kopi ikke kan slippe igennem.
   koer.sh sætter SYNLIG_FLADE = "kunde" eller "dash" foran koden. Første runde er RAPPORT: hver linje hedder »SELE SYNLIG RAPPORT …«
   og stopper ikke porten. Når bruddene er rettet, bliver de regler, der holder, til en bremse (»SELE SYNLIG FEJL«).
   Reglerne og deres sted i DESIGNLÅS.md står ved hver måling. */
setTimeout(async function () {
  var vent = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var FLADE = (typeof SYNLIG_FLADE === "string") ? SYNLIG_FLADE : "kunde";
  var tlf = innerWidth < 900;
  var FUND = {}, N = 0;
  var fund = function (regel, side, eks) { N++; var k = regel; FUND[k] = FUND[k] || { n: 0, sider: {}, eks: [] }; FUND[k].n++; FUND[k].sider[side] = 1; if (FUND[k].eks.length < 4 && FUND[k].eks.indexOf(eks) < 0) FUND[k].eks.push(eks); };
  var synlig = function (e) { var q = e.getBoundingClientRect(); if (q.width < 2 || q.height < 2) return false; var c = getComputedStyle(e); if (c.display === "none" || c.visibility === "hidden" || parseFloat(c.opacity) === 0) return false; return !e.closest("[hidden]"); };
  var iSkaerm = function (e) { var q = e.getBoundingClientRect(); return q.bottom > 0 && q.top < innerHeight * 3 && q.right > 0 && q.left < innerWidth; };
  var egen = function (e) { return [].filter.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }).map(function (n) { return n.textContent.trim(); }).join(" "); };
  var rgb = function (s) { var m = String(s).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] } : null; };
  var lys = function (c) { return (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255; };
  var navn = function (e) { var c = String(e.className && e.className.baseVal != null ? e.className.baseVal : e.className || "").split(/\s+/).filter(Boolean)[0]; return (e.id ? "#" + e.id : (c ? "." + c : e.tagName.toLowerCase())); };
  var COVER = ".mb-baand, .bs-baand, .hf-hero, .lek-top";
  var MENU = "#sideNav, #burgerMenu, .bottom-nav, #versionsFod, .dash-sidebar, #dashSidebar, #virkMenu, #dashMenu";
  var erFlise = function (e) {   /* en flise = hvid flade med skygge eller kant og runde hjørner, ikke selve siden */
    if (!e || e === document.body) return false; var c = getComputedStyle(e), bg = rgb(c.backgroundColor), r = parseFloat(c.borderTopLeftRadius) || 0, q = e.getBoundingClientRect();
    if (!bg || bg.a < 0.9 || lys(bg) < 0.93 || r < 10) return false; if (q.width > innerWidth * 0.97 && q.height > innerHeight * 0.8) return false;
    return c.boxShadow !== "none" || parseFloat(c.borderTopWidth) > 0;
  };
  var maal = function (side, rod) {
    var alle = rod.querySelectorAll("*");
    for (var i = 0; i < alle.length; i++) {
      var e = alle[i]; if (!synlig(e) || !iSkaerm(e) || e.closest(MENU)) continue;
      var c = getComputedStyle(e), q = e.getBoundingClientRect(), t = egen(e), iCover = !!e.closest(COVER);
      /* 1 · COVERET: ingen knapper ud over Tilbage (HÅRD 16/11 »ingen knapper udover tilbage må være i coveret«, DESIGNLÅS »INDHOLDET STARTER 32 PX UNDER COVERET«) */
      if (iCover && e.matches("button, a[href], [role=button]")) { var tx = (e.innerText || e.getAttribute("aria-label") || "").trim(); if (!/^(Tilbage|‹?\s*Tilbage)$/i.test(tx)) fund("KNAP I COVERET (kun Tilbage må stå der)", side, (tx || navn(e)).slice(0, 30)); }
      /* 2 · VERSALER ALDRIG INDE I EN FLISE (HÅRD 15/11) */
      if (t && t.length > 2 && !iCover && (c.textTransform === "uppercase" || (t === t.toUpperCase() && /[A-ZÆØÅ]{3}/.test(t) && parseFloat(c.letterSpacing) >= 0.8)) && parseFloat(c.fontSize) <= 13) {
        var p = e.parentElement, fl = null; while (p && p !== rod.parentElement) { if (erFlise(p)) { fl = p; break; } p = p.parentElement; }
        if (fl) fund("VERSALER INDE I EN FLISE", side, t.slice(0, 28) + " i " + navn(fl));
      }
      /* 3 · ALDRIG LYSEBLÅ RAMMER (HÅRD 15/11, #DCE8F0) */
      ["Top", "Right", "Bottom", "Left"].some(function (s) { if (parseFloat(c["border" + s + "Width"]) > 0 && c["border" + s + "Style"] !== "none") { var b = rgb(c["border" + s + "Color"]); if (b && b.b > b.r + 12 && b.b > 200 && lys(b) > 0.8 && b.a > 0.3) { fund("LYSEBLÅ RAMME", side, navn(e) + " " + c["border" + s + "Color"]); return true; } } return false; });
      /* 4 · ALDRIG EN MØRK FLADE (HÅRD 8/10 + 17/11) — fotos, video, lærreder, farveprikker og coveret er undtaget */
      var bg = rgb(c.backgroundColor);
      if (bg && bg.a > 0.85 && lys(bg) < 0.3 && q.width >= 120 && q.height >= 40 && !iCover && !e.closest("img, video, canvas, .cv-laerred, .kv-laerred, .cv-farver, .ss-farver, .lek-video, .lk-video, iframe, .mb-foto") && !(bg.r > 200 && bg.g < 80)) fund("MØRK FLADE", side, navn(e) + " " + c.backgroundColor);
      /* 5 · CHIPS, DER IKKE ER VALGT: hvid · 1 px #DEDAD4 · grå tekst · 32 høje (HÅRD 14/11 + 15/11) — en chip = afrundet pille under 44 høj med kort tekst */
      var erChip = e.matches("button") && q.height >= 24 && q.height < 40 && (parseFloat(c.borderTopLeftRadius) >= q.height / 2 - 1);   /* en chip er en pille under 40 — knapper med tekst er 44/56 */
      if (erChip && t && t.length <= 40 && !iCover) {
        var cbg = rgb(c.backgroundColor), rod2 = cbg && cbg.r > 240 && cbg.g < 60;
        if (!rod2 && cbg && cbg.a > 0.1) {
          var kant = rgb(c.borderTopColor);
          if (lys(cbg) < 0.97) fund("CHIP IKKE VALGT: flade ikke hvid", side, t.slice(0, 20) + " " + c.backgroundColor);
          else if (!(parseFloat(c.borderTopWidth) >= 1 && kant && Math.abs(kant.r - 222) < 8 && Math.abs(kant.g - 218) < 8 && Math.abs(kant.b - 212) < 8)) fund("CHIP IKKE VALGT: kant ikke grå #DEDAD4", side, t.slice(0, 20) + " " + c.borderTopWidth + " " + c.borderTopColor);
          if (Math.round(q.height) !== 32) fund("CHIP: højde ikke 32", side, t.slice(0, 20) + " h" + Math.round(q.height));
        }
      }
      /* 6 · KNAP MED TEKST: 56 høj på telefonen, 44 på computeren (HÅRD 14/11 + 15/11) — en bred knap (mindst 140 px) med tekst */
      if (e.matches("button, a[role=button], label[role=button]") && !erChip && (e.innerText || "").trim().length >= 2 && q.width >= 140 && q.height <= 70 && q.width > q.height * 2.5 && !iCover) {   /* store dør-fliser (fx Backstages »Idéer«, 96 høje) er ikke knapper */
        var mk = tlf ? 56 : 44; if (Math.abs(Math.round(q.height) - mk) > 1) fund("KNAP MED TEKST: højde " + mk, side, (e.innerText || "").trim().slice(0, 22) + " h" + Math.round(q.height));
      }
      /* 7 · ORD: altid »Indholdssøjle(r)« (HÅRD 2/11) · aldrig »skriv« i en pladsholder (HÅRD) · stort begyndelsesbogstav på knapper og overskrifter (HÅRD 6/10) */
      if (t && /(^|[^a-zæøå])søjle/i.test(t) && !/indholdssøjle/i.test(t)) fund("ORD: »søjle« uden »Indholds«", side, t.slice(0, 40));
      if (/^(INPUT|TEXTAREA)$/.test(e.tagName) && /\bskriv\b/i.test(e.placeholder || "")) fund("ORD: »skriv« i pladsholder", side, (e.placeholder || "").slice(0, 40));
      if (t && e.matches("button, h1, h2, h3, h4, label") && /^[a-zæøå]/.test(t) && c.textTransform !== "uppercase" && !/^(i|og|på|kl\.|uge)\b/.test(t)) fund("ORD: lille begyndelsesbogstav", side, t.slice(0, 30));
    }
    /* 8 · CHIPS PÅ ÉN LINJE (HÅRD 2/11 + 25/10) — rækker med mindst tre chips må ikke brydes (undtaget 15/11: briefens fakta-chips på telefonen, Mails, hashtagbanken) */
    [].forEach.call(rod.querySelectorAll(".ark-chips, .cv-chips, .ss-chips, .fb-chips, [class*='chips']"), function (r) {
      if (!synlig(r) || r.closest(MENU) || r.closest(".mails-ret, .htb, .htg-rk, .fb-chips, .bf-fakta-chips")) return;
      var b = [].filter.call(r.children, function (x) { return synlig(x) && x.matches("button, .ark-chip, span"); }); if (b.length < 3) return;
      var top = b.map(function (x) { return Math.round(x.getBoundingClientRect().top); }); if (Math.max.apply(null, top) - Math.min.apply(null, top) > 6) fund("CHIPS BRYDER LINJEN", side, navn(r) + " (" + b.length + " chips)");
    });
  };
  try {
    for (var v = 0; v < 50 && FLADE === "kunde" && !document.body.classList.contains("app-klar"); v++) await vent(150);
    ["appLoader", "turOverlay", "dagensKort", "nyVersion"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    try { turLuk(); window.turStart = function () {}; } catch (e) {} try { dagensKortLuk(); } catch (e) {}
    var SIDER = FLADE === "kunde" ? [
      ["hjem", function () { showTab(3); }], ["idebanken", function () { showTab(2); }], ["inspiration", function () { showTab(2); ibVis("insp"); }],
      ["kalenderen", function () { showTab(8); }], ["performance", function () { openMaal(); }], ["indbakken", function () { indbakkenAaben(); }],
      ["vaerktoejskassen", function () { vaerktoejAaben(); }], ["hashtagbanken", function () { htbAabn(); }], ["drejebogen", function () { drejebogAaben(); }],
      ["maalsaetninger", function () { tilpasAaben("maal"); }], ["tema", function () { tilpasAaben("tema"); }], ["forloebsoversigt", function () { openForloeb(); }],
      ["to-do", function () { haengSideAabn(); }], ["profil", function () { minProfilAaben(); }],
      ["moedesiden", function () { try { planRitLuk(); } catch (e) {} moedeSideAaben(); }], ["moedeforloebet", function () { planRitStart(); }]
    ] : ["overblik", "indbakke", "crm", "gsd", "energida", "klip", "opgbib", "vaner", "maskinrum"].map(function (s) { return [s, function () { try { planRitLuk(); } catch (e) {} visDashSide(s); }]; });
    for (var i = 0; i < SIDER.length; i++) {
      var s = SIDER[i][0];
      try { SIDER[i][1](); } catch (e) { fund("SIDEN ÅBNEDE IKKE", s, (e && e.message || "").slice(0, 40)); continue; }
      await vent(1000); try { var ct = document.querySelector(".content"); if (ct) ct.scrollTop = 0; window.scrollTo(0, 0); } catch (e) {}
      var pr = document.getElementById("planRit"), dm = document.getElementById("dashMain");
      var rod = (pr && pr.classList.contains("on")) ? pr : (FLADE === "dash" && dm ? dm : (document.querySelector(".screen.active") || document.body));
      try { maal(s, rod); } catch (e) { fund("MÅLINGEN FEJLEDE", s, (e && e.message || "").slice(0, 40)); }
      if (FLADE === "kunde") { try { var cv = document.querySelector(".screen.active"); if (cv && cv !== rod) maal(s, cv); } catch (e) {} }
    }
    var regler = Object.keys(FUND).sort(function (a, b) { return FUND[b].n - FUND[a].n; });
    regler.forEach(function (k) { var f = FUND[k]; console.log("SELE SYNLIG RAPPORT " + k + " · " + f.n + " steder · sider: " + Object.keys(f.sider).join(", ") + " · fx " + f.eks.join(" | ")); });
    console.log("SELE SYNLIG SUM " + FLADE + " " + innerWidth + ": " + N + " fund i " + regler.length + " regler");
  } catch (e) { console.log("SELE SYNLIG RAPPORT probe: " + (e && e.message)); }
}, 600);
