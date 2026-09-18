/* DESIGNLAASENS MAALING (13/9). Koeres i selen paa 390 (koer.sh "vis=kunde&fil=index-sele.html&bred=390" laas tools/designlaas/probe-popups.js).
   Aabner hver kendt doer til en popup i kundeappen og maaler den mod DESIGNLÅS.md:
   - skriveformer SKAL vaere arket (#arkSlor)
   - andre popups: intet synligt kryds, lang Luk (.modal-luk-mobil / .ark-luk), ingen helskaerm (.plus-menu.open)
   - alle knapper i popuppen: mindst 44 px hoeje og mindst 85 % af kortets bredde (lange knapper paa telefonen)
   Skriver SELE LAAS OK / SELE LAAS FEJL <doer> <hvad>. Ny popup-doer? Tilfoej den i DOERE. */
const DOERE = [
  ["fangIde", "skriv", function () { fangIde(); }],
  ["fangNote", "skriv", function () { fangNote(); }],
  ["fangFedt", "skriv", function () { fangFedt(); }],
  ["inspAaben", "skriv", function () { inspAaben(); }],
  ["togglePlus", "skriv", function () { togglePlus(); }],
  ["swipe", "skriv", function () { dagensKortToemHovedet(); }],
  ["addIdea", "skriv", function () { addIdea("idebank"); }],
  ["openIdeaPanel", "skriv", function () { openIdeaPanel(); }],
  ["inspTilIde", "skriv", function () { INSPIRATION = [{ id: "dl1", type: "link", url: "https://x.dk", note: "n" }]; inspTilIde("dl1"); }],
  ["plusTemaIde", "skriv", function () { plusTemaIde(); }],
  ["opslagRefleksionVis", "skriv", function () { opslagRefleksionVis("dl-ops"); }],
  ["appOenskeAabn", "skriv", function () { appOenskeAabn(); }],
  ["perfMaalRet", "skriv", function () { perfMaalRet("opslag"); }],
  ["perfStoryDageVis", "valg", function () { perfStoryDageVis(); }],
  ["vaelgPlanDagModal", "valg", function () { vaelgPlanDagModal(); }],
  ["opslagNyDatoAabn", "valg", function () { opslagNyDatoAabn("dl-ops"); }],
  ["visDagOpslag", "valg", function () { visDagOpslag(datoDK()); }],
  ["drejebogTomVis", "valg", function () { drejebogTomVis(); }],   /* »Drejebogen er tom« (fundet af sidemaalingen 14/9: doeren var ukendt og blev staaende over naeste side) */
  /* Det lange tryk paa en roed I dag-flise (Ida 14/9): Done eller Udsaet. Doeren aabnes her direkte
     med et punkt lagt i listen, saa maalingen ikke afhaenger af, hvad basen svarer. */
  ["hjemIdagValg", "valg", function () { window.__HJEM_FOKUS = { pkt: [{ titel: "Designlaas-punkt", navn: "", sub: "", knap: "Ja" }], klarede: 0 }; hjemIdagValgAabn(0); }]
];
setTimeout(async function () {
  try {
    /* TAEPPET SKAL VAERE LETTET AF SIG SELV (13/9 aften): proben fjernede appLoader med haanden, saa ingen maaling saa,
       at en NY kunde (rejsen paa Hjem) fik hjertet i 30 sek. og »Appen kunne ikke starte«. Nu venter vi op til 6 sek.
       paa body.app-klar, og staar taeppet der stadig, er det en fejl, FOER doerene maales. */
    var taeppeFejl = 0;
    for (var v = 0; v < 40 && !document.body.classList.contains("app-klar"); v++) { await new Promise(function (r) { setTimeout(r, 150); }); }
    if (!document.body.classList.contains("app-klar")) { console.log("SELE LAAS FEJL taeppet: appLoader lettede ikke af sig selv paa 6 sek. (aktiv skaerm: " + ((document.querySelector(".screen.active") || {}).id || "ingen") + ")"); taeppeFejl = 1; }
    ["appLoader", "turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    IDEER.push({ id: "dl-ops", titel: "Designlaas-opslag", type: "Reel", soejle: "Produkt", status: "Postet", dato: datoDK(), kode: currentKode, brief: {} });
    try { MAALS = Object.assign(maalsStandard(), {}); MAALS_KODE = String(currentKode).toUpperCase(); } catch (e) {}
    showTab(3); await new Promise(function (r) { setTimeout(r, 300); });
    var fejl = taeppeFejl;
    for (var i = 0; i < DOERE.length; i++) {
      var d = DOERE[i]; var navn = d[0], art = d[1];
      try { d[2](); } catch (e) { console.log("SELE LAAS FEJL " + navn + " kunne ikke aabnes: " + e.message); fejl++; continue; }
      await new Promise(function (r) { setTimeout(r, 450); });
      var ark = document.getElementById("arkSlor");
      var modal = document.querySelector(".modal-back.on");
      var hel = document.querySelector(".plus-menu.open");
      var delt = document.getElementById("deltDialog"); var deltAaben = delt && delt.style.display === "flex";
      var rod = ark ? ark.querySelector(".ark") : (modal ? modal.querySelector(".modal") : (deltAaben ? delt.firstElementChild : null));
      if (hel) { console.log("SELE LAAS FEJL " + navn + " helskaerm (.plus-menu.open)"); fejl++; }
      if (deltAaben) { console.log("SELE LAAS FEJL " + navn + " lille dialog (deltPrompt) i stedet for arket"); fejl++; }
      if (art === "skriv" && !ark) { console.log("SELE LAAS FEJL " + navn + " skriveform er ikke arket"); fejl++; }
      if (!rod) { console.log("SELE LAAS FEJL " + navn + " ingen popup fundet"); fejl++; }
      if (rod) {
        var kryds = rod.querySelector(".modal-close"); if (kryds && getComputedStyle(kryds).display !== "none") { console.log("SELE LAAS FEJL " + navn + " synligt kryds"); fejl++; }
        if (!rod.querySelector(".modal-luk-mobil, .ark-luk")) { console.log("SELE LAAS FEJL " + navn + " ingen lang Luk"); fejl++; }
        var rb = rod.getBoundingClientRect();
        var knapper = [].filter.call(rod.querySelectorAll("button, label.ark-knap, a.ib-genbrug"), function (b) { var r = b.getBoundingClientRect(); return r.height > 0 && !b.classList.contains("ark-kryds") && !b.classList.contains("ark-chip") && !b.classList.contains("ark-send") && !b.classList.contains("ark-rund") && !b.classList.contains("modal-close") && !b.classList.contains("pr-chip") && !/^(Ma|Ti|On|To|Fr|Lø|Sø)$/.test(b.textContent.trim()); });
        knapper.forEach(function (b) { var r = b.getBoundingClientRect(); if (r.height < 44) { console.log("SELE LAAS FEJL " + navn + " knap under 44 px: " + b.textContent.trim().slice(0, 30) + " (" + Math.round(r.height) + ")"); fejl++; } if (r.width < rb.width * 0.85 && !b.closest(".pr-chips") && !b.classList.contains("kort-plus") && !/^(Slet|Tilføj til kalender|Fjern)$/.test(b.textContent.trim()))   /* 15/9: tilfoej-knappen er 44 px i EGEN bredde, ogsaa paa telefonen (Idas klik kl. 16.55) */ { console.log("SELE LAAS FEJL " + navn + " knap ikke lang: " + b.textContent.trim().slice(0, 30) + " (" + Math.round(r.width) + " af " + Math.round(rb.width) + ")"); fejl++; } });
      }
      try { arkLuk(true); } catch (e) {}
      try { closeIdeaWizard(); } catch (e) {}
      try { closeModal(); } catch (e) {}
      try { if (hel) togglePlus(); } catch (e) {}
      try { deltDialogLuk(); } catch (e) {}
      try { drejebogTomLuk(); } catch (e) {}
      document.querySelectorAll(".modal-back.on").forEach(function (m) { m.classList.remove("on"); });
      await new Promise(function (r) { setTimeout(r, 150); });
    }
    /* BUNDNAVET (Idas fund 14/9): headless Chromium har env(safe-area-inset-bottom) = 0, en iPhone med
       hjemme-indikator har ~34 px. 90 px flad bundpolstring saa derfor rigtig ud her og skjulte alligevel
       Tilbage bag navet paa telefonen. Vi maaler to ting: at reglen REGNER indikatoren med, og at bunden
       kan naas, naar vi SIMULERER den (vi kan ikke saette env() i headless). */
    const INDIKATOR = 34;
    const nav = document.querySelector(".bottom-nav");
    const navR = nav && getComputedStyle(nav).display !== "none" ? nav.getBoundingClientRect() : null;
    if (!navR) { console.log("SELE LAAS FEJL bundnav: ikke synligt, kunne ikke maales"); fejl++; }
    else {
      /* Chrome oploeser env() ved indlaesning, saa CSSOM viser kun "90px". Vi laeser derfor KILDETEKSTEN
         i <style> og spoerger, om en .content-regel skriver env(safe-area-inset-bottom) i bunden. */
      let regner = false;
      try {
        const css = [].map.call(document.querySelectorAll("style"), function (e) { return e.textContent || ""; }).join("\n");
        const re = /([^{}]*\.content[^{}]*)\{([^}]*)\}/g; let m;
        while ((m = re.exec(css))) { if (/padding(-bottom)?\s*:[^;]*safe-area-inset-bottom/.test(m[2])) { regner = true; break; } }
      } catch (e) {}
      if (!regner) { console.log("SELE LAAS FEJL bundnav: .content regner ikke env(safe-area-inset-bottom) med i bunden"); fejl++; }
      /* simuler iPhonen: navet bliver hoejere, og bundpolstringen vokser lige saa meget, som env() ville give */
      const c = document.querySelector(".content");
      const padFoer = parseFloat(getComputedStyle(c).paddingBottom) || 0;
      const navPadFoer = parseFloat(getComputedStyle(nav).paddingBottom) || 0;
      nav.style.paddingBottom = (navPadFoer + INDIKATOR) + "px";
      if (regner) c.style.paddingBottom = (padFoer + INDIKATOR) + "px";
      await new Promise(function (r) { setTimeout(r, 250); });
      const navR2 = nav.getBoundingClientRect();
      for (const t of [3, 8, 2, 9]) {
        try { showTab(t); } catch (e) { continue; }
        await new Promise(function (r) { setTimeout(r, 400); });
        const sc = document.querySelector(".screen.active"); if (!sc) continue;
        c.scrollTop = c.scrollHeight;
        await new Promise(function (r) { setTimeout(r, 200); });
        const born = [].slice.call(sc.children).filter(function (x) { const r = x.getBoundingClientRect(); return r.height > 0 && getComputedStyle(x).position !== "fixed"; });
        const sidste = born[born.length - 1]; if (!sidste) continue;
        const sr = sidste.getBoundingClientRect();
        if (sr.bottom > navR2.top && sr.top < navR2.bottom) { console.log("SELE LAAS FEJL bundnav: nederste element paa fane " + t + " (" + (sidste.id || sidste.className.split(" ")[0]) + ") naar " + Math.round(sr.bottom) + " px, navet starter " + Math.round(navR2.top) + " px"); fejl++; }
      }
      nav.style.paddingBottom = navPadFoer + "px"; c.style.paddingBottom = "";
    }
    console.log(fejl ? "SELE LAAS FEJL i alt: " + fejl : "SELE LAAS OK: " + DOERE.length + " doere og bundnavet holder designlaasen");
  } catch (e) { console.log("SELE LAAS FEJL probe: " + e.message); }
}, 1200);
