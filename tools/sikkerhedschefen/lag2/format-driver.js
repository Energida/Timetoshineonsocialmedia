/* SIKKERHEDSCHEFEN · LØFTE 39 · HVERT FORMAT ÅBNER SIN EGEN BRIEF (fejlkataloget B38 — 6/10: Billede og Prøvereel fik reel-briefen).
   Ét opslag af hvert format oprettes. Briefen skal kende formatet, og skrivesiderne skal passe: reels har klip, karrusel har slides,
   et billede har hverken klip eller slides. Kun opdigtede data i selen. */
(async function () {
  var r = { tjek: [], set: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ navn: n, ok: !!ok, detalje: String(d || "").slice(0, 300) }); }
  var FORV = { "Reel": "klip", "Kort-reel": "klip", "Prøvereel": "klip", "Karrusel": "slide", "Billede": "ingen" };
  try {
    await V(7000);
    ["turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    var forkert = [];
    for (var f in FORV) {
      var id = "fm-" + f;
      try { openBriefSide(id); } catch (e) { forkert.push(f + ": briefen kunne ikke åbnes (" + e.message + ")"); continue; }
      await V(2000);
      var fmt = ((typeof BRIEF_STATE !== "undefined" && BRIEF_STATE) || {}).format || "";
      var klip = false, slide = false;
      for (var s = 0; s < 4; s++) { try { briefMbVis("skriv", s); } catch (e) {} await V(700); if (document.querySelector('[id^="bf_klip_"]')) klip = true; if (document.querySelector('[id^="bf_slide_"]')) slide = true; }
      var fik = klip && slide ? "klip+slide" : klip ? "klip" : slide ? "slide" : "ingen";
      r.set.push(f + "→" + fmt + "/" + fik);
      if (fmt !== f) forkert.push(f + ": briefen tror, det er »" + (fmt || "intet") + "«");
      /* en tom reel har endnu ingen klip (de tilføjes) — men en reel må aldrig få slides, og et billede må hverken få klip eller slides */
      var ok = FORV[f] === "klip" ? !slide : FORV[f] === "slide" ? (slide && !klip) : (!klip && !slide);
      if (!ok) forkert.push(f + ": skrivesiderne har " + fik + " (forventet " + FORV[f] + ")");
      try { briefTilbage(); } catch (e) {} await V(800);
    }
    tjek("Hvert format åbner sin egen brief (" + Object.keys(FORV).length + " formater)", !forkert.length, forkert.join(" · "));
  } catch (e) { r.fejl = String(e && e.message || e); }
  console.log("@@" + JSON.stringify(r) + "@@");
})();
