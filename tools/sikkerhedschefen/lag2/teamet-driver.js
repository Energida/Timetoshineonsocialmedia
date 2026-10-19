/* SIKKERHEDSCHEFEN · LØFTE 7 · TEAMET FÅR BESKED (Idas klik 19/10 »Ja, teamet i kundens studio« + »Bud 2: app + mail«):
   et opslag sat til Klar til post står som rød flise under »Til dig« hos den, der står under »Hvem laver indholdet?«, tænder klokken,
   står ikke hos andre, og den, der selv satte statussen, får ikke sin egen besked. Kun opdigtede opslag. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 7, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 220) }); }
  var L = function () { console.log("@@" + JSON.stringify(r) + "@@"); }; var slut = setTimeout(L, 40000);
  try {
    await V(3500);
    CURRENT_NAVN = "Mette";
    try { localStorage.removeItem(nsKey("ib_set")); } catch (e) {}
    var d = new Date(Date.now() + 2 * 864e5), dIso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    var KODE = currentKode;
    IDEER = (IDEER || []).filter(function (x) { return !/^team-/.test(String(x.id)); }).concat([
      { id: "team-1", kode: KODE, titel: "Opdigtet til Mette", status: "Klar til post", dato: dIso, brief: { hvemPerson: "Mette · Ida", tid: "10:00" } },
      { id: "team-2", kode: KODE, titel: "Opdigtet kun til Ida", status: "Klar til post", dato: dIso, brief: { hvemPerson: "Ida" } },
      { id: "team-3", kode: KODE, titel: "Opdigtet Mette satte selv", status: "Brief i gang", dato: dIso, brief: { hvemPerson: "Mette" } }]);
    var ib = indbakkeRegn();
    var t = (ib.tildig || []).map(function (x) { return x.t; }).join(" | ");
    tjek("Klar til post står hos personen under »Hvem laver indholdet?«", /Opdigtet til Mette/.test(t) && (ib.tildig || []).some(function (x) { return /Opdigtet til Mette/.test(x.t) && x.roed; }), t || "intet under Til dig");
    tjek("Klar til post står ikke hos en, der ikke er nævnt", !/kun til Ida/.test(t), t);
    try { await ideUpdate("team-3", { status: "Klar til post" }); } catch (e) {}
    var t2 = (indbakkeRegn().tildig || []).map(function (x) { return x.t; }).join(" | ");
    tjek("Den, der selv satte Klar til post, får ikke sin egen besked", !/satte selv/.test(t2), t2);
    try { indbakkenAaben(); } catch (e) {} await V(1200);
    var roed = [].find.call(document.querySelectorAll(".ib-roed"), function (e) { return /Opdigtet til Mette/.test(e.innerText || "") && e.getClientRects().length; });
    tjek("Den røde flise står i Indbakken", !!roed, "ingen synlig rød flise med opslaget");
    if (roed) { roed.click(); await V(900); }
    var t3 = (indbakkeRegn().tildig || []).map(function (x) { return x.t; }).join(" | ");
    tjek("Flisen forsvinder, når opslaget er åbnet", !/Opdigtet til Mette/.test(t3), t3);
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
