/* SIKKERHEDSCHEFEN · LØFTE 28 · Idas flueben under Adgang når kunden (Ida 11/10: »hvis jeg klikker noget af at det faktisk også sker«).
   Selen startes med en kunde_def, hvor Energien og Lektionerne er taget fra (som Hinges Hus 5/8). Kunden logger ind og skal IKKE have dem. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 28, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 200) }); }
  try {
    await V(6000);
    tjek("Et flueben, Ida har taget fra (Energien), er væk hos kunden", typeof funkTaendt === "function" && funkTaendt(CURRENT_DEF, "energi") === false, "funktioner: " + JSON.stringify(CURRENT_DEF && CURRENT_DEF.funktioner));
    tjek("Et flueben, Ida har taget fra (Lektionerne), er væk hos kunden", funkTaendt(CURRENT_DEF, "vaerktoej") === false, "funktioner: " + JSON.stringify(CURRENT_DEF && CURRENT_DEF.funktioner));
    tjek("Et flueben, Ida har sat (Content Studio), er der hos kunden", funkTaendt(CURRENT_DEF, "content") === true, "");
  } catch (e) { r.fejl = String(e && e.message || e); }
  console.log("@@" + JSON.stringify(r) + "@@");
})();
