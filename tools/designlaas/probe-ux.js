/* UX-POLITIET PAA HELE B2B (Ida 20/9 kl. 22.28: »vaer soed at koer hele ux politiet paa b2b tak saa jeg ikke skal bruge mere tid paa dette rod«).
   Aabner hver side gennem den rigtige doer og MAALER designlaasen paa fladen — i den bredde og menutilstand, koer.sh giver
   (390 · 1440 fast · 1440 frigjort med window.SELE_SMAL). Skriver EN linje pr. fund: "SELE UX <side> <hvad>", og til sidst
   "SELE UX SUM <antal>". Fund er rapport, ikke port: koer.sh laeser dem, men falder ikke paa dem — rene fejl rettes, valg gaar til Ida. */
setTimeout(async function () {
  var vent = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var UD = [], fund = function (side, hvad) { UD.push(side + " · " + hvad); };
  try {
    for (var v = 0; v < 40 && !document.body.classList.contains("app-klar"); v++) await vent(150);
    ["appLoader", "turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    try { turLuk(); window.turStart = function () {}; } catch (e) {}
    var SMAL = !!window.SELE_SMAL, tlf = innerWidth < 900;
    if (SMAL) { try { navPinSaet(false); } catch (e) {} document.body.classList.add("nav-smal"); try { document.getElementById("sideNav").classList.remove("aaben"); } catch (e) {} }
    var synlig = function (e) { var q = e.getBoundingClientRect(); var c = getComputedStyle(e); return q.width > 2 && q.height > 2 && c.display !== "none" && c.visibility !== "hidden" && parseFloat(c.opacity) > 0; };
    var egenTekst = function (e) { return [].filter.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }).map(function (n) { return n.textContent.trim(); }).join(" "); };
    var SIDER = [
      ["hjem", function () { showTab(3); }],
      ["idebanken", function () { showTab(2); }],
      ["inspiration", function () { showTab(2); ibVis("insp"); }],
      ["arkiv", function () { showTab(2); ibVis("arkiv"); }],
      ["kalenderen", function () { showTab(8); }],
      ["performance", function () { openMaal(); }],
      ["indbakken", function () { indbakkenAaben(); }],
      ["vaerktoejskassen", function () { vaerktoejAaben(); }],
      ["hashtagbanken", function () { htbAabn(); }],
      ["drejebogen", function () { drejebogAaben(); }],
      ["maalsaetninger", function () { tilpasAaben("maal"); }],
      ["forloebet", function () { showTab(12); }],
      ["forloebsoversigt", function () { openForloeb(); }],
      ["to-do", function () { haengSideAabn(); }],
      ["profil", function () { minProfilAaben(); }],
      ["planlaegningsdagen", function () { planRitStart(); }]
    ];
    var rod = function () { var pr = document.getElementById("planRit"); if (pr && pr.classList.contains("on")) return pr; var lv = document.getElementById("lekVis"); if (lv && lv.classList.contains("on")) return lv; return document.querySelector(".screen.active") || document.body; };
    var HERO = ".mb-baand, .hf-hero, #dagensKort, #homeName, .sn-logo, .lek-top, .bs-bog, #bsBog, .drejebog-side, #drejebogPapir";
    for (var i = 0; i < SIDER.length; i++) {
      var navn = SIDER[i][0];
      try { SIDER[i][1](); } catch (e) { fund(navn, "kunne ikke aabnes: " + e.message); continue; }
      await vent(700);
      try { var ct = document.querySelector(".content"); if (ct) ct.scrollTop = 0; window.scrollTo(0, 0); } catch (e) {}
      var r = rod();
      var skinne = 0; try { if (SMAL) { var sn = document.getElementById("sideNav"); if (sn && synlig(sn)) skinne = sn.getBoundingClientRect().right; } } catch (e) {}
      var didot = [], fed = [], skriv = [], streger = 0, selects = [], klip = [], luk = [], graaSmaa = 0, kanter = [], lysSmaa = [];
      [].forEach.call(r.querySelectorAll("*"), function (e) {
        if (!e.childNodes.length && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName)) return;
        if (!synlig(e)) return;
        var cs = getComputedStyle(e);
        if (/^(INPUT|TEXTAREA)$/.test(e.tagName)) { var ph = e.placeholder || ""; if (/\bskriv\b/i.test(ph)) skriv.push(ph.slice(0, 30)); }
        if (e.tagName === "SELECT" && !tlf) selects.push(e.id || e.className || "select");
        var t = egenTekst(e); if (!t) return;
        if (/Didot|Bodoni/i.test(cs.fontFamily) && !e.closest(HERO)) didot.push((e.className && String(e.className).split(" ")[0] || e.tagName) + "=" + t.slice(0, 20));
        if (/Poppins/i.test(cs.fontFamily) && parseInt(cs.fontWeight, 10) >= 600) fed.push(t.slice(0, 26));
        if (/—/.test(t)) { streger++; fund(navn, "STREG: " + t.slice(0, 90)); }
        if (/(^|[\s»"(])(I|jer|jeres|Jer|Jeres)([\s.,!?»)]|$)/.test(t) && !/^I DAG$/i.test(t) && !/^I dag/.test(t) && !/\bI (dag|morgen|aften|nat|løbet|gang|butikken|kalenderen|Idébanken|Indbakken|Kalenderen|Drejebogen|Arkiv|Inspiration|brief|videoen|captionen|Instagram|feltet|klippet|ugen|måneden|midten|banken)\b/.test(t)) fund(navn, "I/JER: " + t.slice(0, 90));
        if (/\b(hun|hende|hendes|han|ham|hans)\b/i.test(t)) fund(navn, "KOEN: " + t.slice(0, 90));
        if (/^Luk$/.test(t) && e.tagName === "BUTTON") luk.push("Luk-knap");
        var q = e.getBoundingClientRect();
        if (e.closest("#sideNav, #burgerMenu, .bottom-nav, #versionsFod, .mb-baand")) return;
        var p = e.parentElement, ruller = false; while (p && p !== document.body) { var pc = getComputedStyle(p); if (/(auto|scroll)/.test(pc.overflowX) && p.scrollWidth > p.clientWidth + 1) { ruller = true; break; } p = p.parentElement; }
        if (!ruller) { if (q.left < skinne - 0.5) klip.push("under skinnen: " + t.slice(0, 22)); else if (q.left < -0.5) klip.push("venstre: " + t.slice(0, 22)); if (q.right > innerWidth + 0.5) klip.push("hoejre: " + t.slice(0, 22)); }
        /* lys graa paa smaa ord, der ikke er versaler: 3,0 mod hvidt (Idas klik 20/9: den moerke graa i underlinjer) */
        if (cs.color === "rgb(154, 149, 144)" && cs.textTransform !== "uppercase" && parseFloat(cs.fontSize) >= 11 && t.length > 3 && !e.closest(".chip-btn, .kal-fpill, .ark-chip, .bdrop-knap, .pr-rail-rk, .pr-top-frem, .cf-prikker")) lysSmaa.push((e.className && String(e.className).split(" ")[0] || e.tagName) + "=" + t.slice(0, 18));
      });
      /* fliser med kant paa computeren (15/9: b2b-fliser uden kant m. varm skygge) */
      if (!tlf) [].forEach.call(r.querySelectorAll(".mb-flise, .idag-flise, .hf-kort, .idea-kort, .post-card, .kv-flise, .lek-kort, .db-kort, .pr-kort, .pr-svar"), function (e) { var c = getComputedStyle(e); if (synlig(e) && parseFloat(c.borderTopWidth) > 0 && c.borderTopStyle !== "none" && !/rgba\(0, 0, 0, 0\)/.test(c.borderTopColor)) kanter.push(e.id || e.className.split(" ")[0]); });
      /* ALDRIG ROEDE RINGE (HAARD, Ida 24/9): en hvid/gennemsigtig flade med roed kant fejler. Valgt = fyldt roed, ellers graa kant. */
      var ringe = [], ROED = /rgb\(252, 36, 4\)|rgb\(232, 60, 36\)|rgb\(233, 61, 35\)/;
      [].forEach.call(r.querySelectorAll("*"), function (e) {
        if (!synlig(e) || e.closest("#sideNav, #burgerMenu, .bottom-nav, #versionsFod")) return;
        var c = getComputedStyle(e);
        if ((parseFloat(c.borderTopWidth) || 0) >= 1 && c.borderTopStyle !== "none" && ROED.test(c.borderTopColor) && !ROED.test(c.backgroundColor))
          ringe.push((e.className && String(e.className).split(" ")[0] || e.tagName) + "=" + (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 18));
      });
      var uniq = function (a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); };
      if (ringe.length) fund(navn, "roed ring (" + ringe.length + "): " + uniq(ringe).slice(0, 3).join(" | "));
      if (didot.length) fund(navn, "Didot uden for heroen (" + didot.length + "): " + uniq(didot).slice(0, 3).join(" | "));
      if (fed.length) fund(navn, "fed Poppins (" + fed.length + "): " + uniq(fed).slice(0, 3).join(" | "));
      if (skriv.length) fund(navn, "pladsholder med »skriv« (" + skriv.length + "): " + uniq(skriv).slice(0, 3).join(" | "));
      if (streger) fund(navn, "lange streger i teksten: " + streger);
      if (selects.length) fund(navn, "native vaelger paa computeren: " + uniq(selects).slice(0, 3).join(", "));
      if (klip.length) fund(navn, "klippet" + (SMAL ? " (frigjort menu)" : "") + " (" + klip.length + "): " + uniq(klip).slice(0, 3).join(" | "));
      if (luk.length) fund(navn, "knap hedder Luk (skal hedde Annuller)");
      if (kanter.length) fund(navn, "fliser med kant paa computeren (" + kanter.length + "): " + uniq(kanter).slice(0, 4).join(", "));
      if (lysSmaa.length) fund(navn, "lys graa paa laeselinjer (" + lysSmaa.length + "): " + uniq(lysSmaa).slice(0, 8).join(" | "));
      var c2 = document.querySelector(".content"); if (document.documentElement.scrollWidth > innerWidth + 1 || (c2 && c2.scrollWidth > c2.clientWidth + 1)) fund(navn, "vandret sejlads");
      /* luk det, doeren aabnede */
      try { var pr = document.getElementById("planRit"); if (pr) pr.classList.remove("on"); } catch (e) {}
      try { if (typeof lukLektion === "function") lukLektion(); } catch (e) {}
      try { if (typeof arkLuk === "function") arkLuk(true); } catch (e) {}
      try { if (typeof closeModal === "function") closeModal(); } catch (e) {}
      document.querySelectorAll(".modal-back").forEach(function (m) { if (m.style.display === "flex") m.style.display = "none"; });
      document.querySelectorAll(".modal-back.on").forEach(function (m) { m.classList.remove("on"); });
    }
    UD.forEach(function (l) { console.log("SELE UX " + l); });
    console.log("SELE UX SUM " + UD.length + " fund paa " + innerWidth + (SMAL ? " frigjort" : ""));
  } catch (e) { console.log("SELE UX FEJL probe: " + e.message); }
}, 1200);
