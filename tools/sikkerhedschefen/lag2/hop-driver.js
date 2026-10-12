/* SIKKERHEDSCHEFEN · LØFTE 46 · ET VALG HOPPER ALDRIG TILBAGE (fejlkataloget A11 — 9/10: »rettet fra kort reel til reel 100 gange«, formatet hoppede tilbage).
   Basen svarer langsomt (1,5 sek.). Kunden vælger Kort-reel og straks efter Reel i fakta-boksen. Når alt er gemt og hentet igen, skal der stå Reel — i basen og på skærmen. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ navn: n, ok: !!ok, detalje: String(d || "").slice(0, 300) }); }
  function raek() { var d = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); return ((d.content_ideer || []).filter(function (x) { return x.id === "hp1"; })[0]) || {}; }
  try {
    await V(7000);
    ["turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    openBriefSide("hp1"); await V(2000);
    var boks = document.getElementById("fbBoks") || document.querySelector(".fb-ud") || document.getElementById("briefRail");
    if (!boks) throw new Error("fakta-boksen findes ikke");
    function vaelg(v) { var b = document.createElement("button"); b.setAttribute("data-val", v); b.className = "chip-btn"; b.style.display = "none"; (document.getElementById("fbBoks") || document.querySelector(".fb-ud") || document.getElementById("briefRail")).appendChild(b); briefDropVaelg(b, "format", false); }
    localStorage.setItem("SELE_LATENS", "1500");
    vaelg("Kort-reel"); await V(300); vaelg("Reel");
    await V(6000); localStorage.removeItem("SELE_LATENS");
    try { await refreshIdeer(); } catch (e) {} await V(800); openBriefSide("hp1"); await V(1500);
    var b = raek().brief || {}, skaerm = ((typeof BRIEF_STATE !== "undefined" && BRIEF_STATE) || {}).format;
    tjek("Det sidste valg står i basen (Reel)", b.format === "Reel", "basen: " + b.format);
    tjek("Det sidste valg står på skærmen efter genindlæsning (Reel)", skaerm === "Reel", "skærmen: " + skaerm);
  } catch (e) { r.fejl = String(e && e.message || e); }
  console.log("@@" + JSON.stringify(r) + "@@");
})();
