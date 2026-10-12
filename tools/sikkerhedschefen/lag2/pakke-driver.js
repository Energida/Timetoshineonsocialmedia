/* SIKKERHEDSCHEFEN · LØFTE 31 · PAKKE-TJEKKET (fejlkataloget C, Ida 12/10: Testkunde A (YOU GOT THIS) havde flueben ved »Resultat«, men ingen Performance).
   For hver pakke, der findes i basen: alle flueben er sat (standard). Hver funktion med flueben skal stå i menuen — åben eller låst med en forklaring.
   Står den slet ikke der, lyver fluebenet i CRM'et. Kun opdigtede data i selen. */
(async function () {
  var r = { tjek: [], pakker: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  var PAKKER = [["kursus","YOU GOT THIS"],["kursus","YOU GOT THIS — DETAIL"],["kursus","Content Studio"],["kursus","CONTENT STUDIO"],["kursus","Gratis kursusadgang"],["forloeb","Succesfuld Detail 2026"],["forloeb","Dit eget Content House"]];
  /* Energien og Strategien er ikke menupunkter (de bor bag døre i Værktøjskassen og Drejebogen) — kun menupunkterne måles her */
  var MENU = { indbakke: /Indbakke/i, content: /Content kalender|Content Studio|Idébank|Kalender/i, resultat: /Performance/i, vaerktoej: /Lektion|Værktøjskass/i };
  try {
    await V(6000);
    var gem = CURRENT_DEF, kIG = window.kursusIGangMenu;
    [["",false],[" (midt i forløbet)",true]].forEach(function (fase) {
    if (fase[1] && typeof kIG === "function") window.kursusIGangMenu = function () { return true; }; else window.kursusIGangMenu = kIG;
    PAKKER.forEach(function (p) {
      if (fase[1] && !/YOU GOT THIS/.test(p[1])) return;   /* et forløb kører kun i YOU GOT THIS-pakkerne */
      var def = Object.assign({}, gem || {}, { type: p[0], forloeb: p[1], funktioner: KUNDE_FUNKTIONER.map(function (f) { return f.k; }) });
      try { CURRENT_DEF = def; buildSideNav(def); } catch (e) { r.tjek.push({ navn: p[1] + ": menuen kan tegnes", ok: false, detalje: e.message }); return; }
      var items = [].slice.call(document.querySelectorAll("#sideNav .sn-item")).map(function (b) { return { t: (b.textContent || "").trim(), laast: b.classList.contains("sn-laast") }; });
      var mangler = [], laast = [];
      KUNDE_FUNKTIONER.forEach(function (f) {
        if (!funkTaendt(def, f.k) || !MENU[f.k]) return;
        var hit = items.filter(function (i) { return MENU[f.k] && MENU[f.k].test(i.t); });
        if (!hit.length) mangler.push(f.navn); else if (hit.every(function (i) { return i.laast; })) laast.push(f.navn);
      });
      r.pakker.push({ p: p[1] + fase[0], mangler: mangler, laast: laast });
      r.tjek.push({ navn: p[1] + fase[0] + ": hvert flueben findes i menuen", ok: !mangler.length, detalje: mangler.length ? "flueben sat, men kunden har ikke: " + mangler.join(", ") + (laast.length ? " · låst: " + laast.join(", ") : "") : "" });
    });
    });
    window.kursusIGangMenu = kIG; CURRENT_DEF = gem; try { buildSideNav(gem); } catch (e) {}
  } catch (e) { r.fejl = String(e && e.message || e); }
  console.log("@@" + JSON.stringify(r) + "@@");
})();
