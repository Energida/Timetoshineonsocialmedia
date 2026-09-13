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
  ["visDagOpslag", "valg", function () { visDagOpslag(datoDK()); }]
];
setTimeout(async function () {
  try {
    ["appLoader", "turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    IDEER.push({ id: "dl-ops", titel: "Designlaas-opslag", type: "Reel", soejle: "Produkt", status: "Postet", dato: datoDK(), kode: currentKode, brief: {} });
    try { MAALS = Object.assign(maalsStandard(), {}); MAALS_KODE = String(currentKode).toUpperCase(); } catch (e) {}
    showTab(3); await new Promise(function (r) { setTimeout(r, 300); });
    var fejl = 0;
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
        var knapper = [].filter.call(rod.querySelectorAll("button, label.ark-knap, a.ib-genbrug"), function (b) { var r = b.getBoundingClientRect(); return r.height > 0 && !b.classList.contains("ark-chip") && !b.classList.contains("ark-send") && !b.classList.contains("ark-rund") && !b.classList.contains("modal-close") && !b.classList.contains("pr-chip") && !/^(Ma|Ti|On|To|Fr|Lø|Sø)$/.test(b.textContent.trim()); });
        knapper.forEach(function (b) { var r = b.getBoundingClientRect(); if (r.height < 44) { console.log("SELE LAAS FEJL " + navn + " knap under 44 px: " + b.textContent.trim().slice(0, 30) + " (" + Math.round(r.height) + ")"); fejl++; } if (r.width < rb.width * 0.85 && !b.closest(".pr-chips") && !/^(Slet|Tilføj til kalender|Fjern)$/.test(b.textContent.trim())) { console.log("SELE LAAS FEJL " + navn + " knap ikke lang: " + b.textContent.trim().slice(0, 30) + " (" + Math.round(r.width) + " af " + Math.round(rb.width) + ")"); fejl++; } });
      }
      try { arkLuk(true); } catch (e) {}
      try { closeIdeaWizard(); } catch (e) {}
      try { closeModal(); } catch (e) {}
      try { if (hel) togglePlus(); } catch (e) {}
      try { deltDialogLuk(); } catch (e) {}
      document.querySelectorAll(".modal-back.on").forEach(function (m) { m.classList.remove("on"); });
      await new Promise(function (r) { setTimeout(r, 150); });
    }
    console.log(fejl ? "SELE LAAS FEJL i alt: " + fejl : "SELE LAAS OK: " + DOERE.length + " doere holder designlaasen");
  } catch (e) { console.log("SELE LAAS FEJL probe: " + e.message); }
}, 1200);
