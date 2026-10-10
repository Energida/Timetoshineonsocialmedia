/* SIKKERHEDSCHEFEN · LAG 2 · SCENARIER. Koeres i selen med huske-basen; FASE vaelges af runneren (window.__FASE).
   Hver fase skriver @@{json}@@ i konsollen. Data er opdigtede (Testbutikken), aldrig rigtige kunders. */
(async function () {
  var V = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var FASE = window.__FASE, r = { fase: FASE, tjek: [] };
  function tjek(loefte, navn, ok, detalje) { r.tjek.push({ loefte: loefte, navn: navn, ok: !!ok, detalje: String(detalje || "").slice(0, 200) }); }
  var LS = function (k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
  var iDag = new Date(), iMorgen = new Date(iDag.getTime() + 864e5), d = function (x) { return energidaKalDato(x); };
  try {
    await V(6000); try { dagensKortLuk(); } catch (e) {}
    if (FASE === "nulstil") {
      localStorage.removeItem("SELE_AFVIS");
      var nu = Date.now(), soejler = ["Produkt", "Målgruppens situation", "Menneskene bag", "Bag om forretningen"], ideer = [];
      for (var i = 0; i < 12; i++) ideer.push({ id: "sc-ide-" + i, kode: "HINGES2026", titel: "Opdigtet idé " + (i + 1), status: "Idé", soejle: soejler[i % 4], type: "Reel", dato: null, brief: { beskrivelse: "Testbutikken " + i }, created_at: new Date(nu - (100 - i) * 6e4).toISOString() });
      ideer.push({ id: "sc-plan-1", kode: "HINGES2026", titel: "Opdigtet planlagt", status: "Planlagt", soejle: "Produkt", type: "Reel", dato: d(iMorgen), brief: { tid: "19:00" }, created_at: new Date(nu).toISOString() });
      var aft = [1, 2].map(function (n) { return { id: "sc-moede-" + n, kode: "HINGES2026", titel: "Ugentlig contentplanlægning", dato: d(iMorgen), tid: "10:00", tid_slut: "11:00" }; });
      localStorage.setItem("SELE_DB", JSON.stringify({ content_ideer: ideer, kunde_aftaler: aft }));
      tjek(0, "Testdata lagt ind", true, ideer.length + " idéer, 2 møder (dublet)");
    }
    if (FASE === "skriv") {
      var rec = await ideAdd({ titel: "SC ny idé", soejle: "Produkt", type: "Reel", status: "Idé", brief: { beskrivelse: "skrevet af sikkerhedschefen" } });
      var id = rec && rec.id; LS("SC_ID", id);
      var ok1 = await ideUpdate(id, { brief: Object.assign({}, rec.brief, { hookTekst: "Hook fra sikkerhedschefen" }) });
      tjek(1, "Ny idé og brief gemt (kvittering)", !!id && ok1 !== false, "id " + id);
      var ok2 = await ideUpdate("sc-ide-3", { status: "Planlagt", dato: d(iMorgen) });
      tjek(3, "Status Idé → Planlagt gemt (kvittering)", ok2 !== false, "");
      try { showTab(2); } catch (e) {} await V(1200);
      LS("SC_ORDEN", IDEER.filter(ideErIBanken).map(function (x) { return String(x.id); }));
    }
    if (FASE === "laes1") {
      var id = LS("SC_ID"), it = (IDEER || []).find(function (x) { return String(x.id) === String(id); });
      tjek(1, "Ny idé står efter genindlæsning", !!it, it ? it.titel : "findes ikke");
      tjek(1, "Briefens hook står efter genindlæsning", it && it.brief && it.brief.hookTekst === "Hook fra sikkerhedschefen", it && it.brief ? it.brief.hookTekst : "");
      var p3 = (IDEER || []).find(function (x) { return x.id === "sc-ide-3"; });
      tjek(3, "Status Planlagt står efter genindlæsning", p3 && p3.status === "Planlagt", p3 ? p3.status : "findes ikke");
      var orden = IDEER.filter(ideErIBanken).map(function (x) { return String(x.id); }), foer = LS("SC_ORDEN") || [];
      tjek(4, "Idébankens rækkefølge er uændret efter genindlæsning", JSON.stringify(orden) === JSON.stringify(foer), orden.length + " idéer");
      var medDato = (IDEER || []).filter(function (x) { return x.dato && ideErIBanken(x); });
      tjek(6, "Ingen idé med dato står i Idébanken", medDato.length === 0, medDato.map(function (x) { return x.titel; }).join(", "));
      var udenDatoPlan = (IDEER || []).filter(function (x) { return !x.dato && x.status === "Planlagt"; }).filter(function (x) { return !ideManglerDato(x); });
      tjek(6, "Planlagt uden dato står under Mangler dato", udenDatoPlan.length === 0, "");
      try { await renderAftaler(); } catch (e) {}
      var moederFoer = (window.__kundeAftalerAlle || window.__kundeAftaler || []).filter(function (a) { return a.dato === d(iMorgen) && erMoedeTitel(a.titel); }).length;
      var ma0 = null; try { ma0 = planMoedeAftale(); } catch (e) {}
      var mid = ma0 && ma0.id; await moedeSlet(mid); await moedeSlet(mid); await V(1500);   /* to tryk: »Tryk igen for at annullere« */
      try { await renderAftaler(); } catch (e) {}
      var moederEfter = (window.__kundeAftalerAlle || window.__kundeAftaler || []).filter(function (a) { return a.dato === d(iMorgen) && erMoedeTitel(a.titel); }).length;
      var dbM = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").kunde_aftaler) || []).length;
      tjek(5, "Møde med dublet slettet i ét tryk", moederFoer === 2 && moederEfter === 0 && dbM === 0, "før " + moederFoer + " · efter " + moederEfter + " · i basen " + dbM + " · planMoedeAftale " + (ma0 ? ma0.id : "null"));
      /* LØFTE 19 · XSS: en titel og en beskrivelse med kode må aldrig køre — i Idébanken, briefen, kalenderen, Kommende opslag og Hjem */
      window.__XSS = 0; var ond = '<img src=x onerror="window.__XSS=(window.__XSS||0)+1">';
      var xr = await ideAdd({ titel: "XSS " + ond, soejle: "Produkt", type: "Reel", status: "Planlagt", dato: d(iMorgen), brief: { beskrivelse: ond, hookTekst: ond, tid: "19:00", hvemPerson: ond } });
      var sider = [];
      try { showTab(2); await V(900); sider.push("Idébanken"); } catch (e) {}
      try { openBriefSide(xr.id); await V(1500); sider.push("briefoversigten"); } catch (e) {}
      try { briefMbVis("skriv"); await V(900); sider.push("briefen"); } catch (e) {}
      try { showTab(8); await V(900); sider.push("kalenderen"); } catch (e) {}
      try { showTab(3); await V(900); sider.push("Hjem"); } catch (e) {}
      try { var t = document.createElement("div"); t.innerHTML = kommendeOpslagHtml(5, "hu-sek"); document.body.appendChild(t); await V(300); sider.push("Kommende opslag"); } catch (e) {}
      await V(500);
      tjek(19, "Kode i en titel kører aldrig (XSS)", !window.__XSS, (window.__XSS ? "koden kørte " + window.__XSS + " gang(e)" : "ingen kørsel") + " · sider: " + sider.join(", "));
      localStorage.setItem("SELE_AFVIS", "fejl");
      var ok3 = await ideUpdate("sc-ide-3", { status: "Idé", dato: null });
      await V(400);
      tjek(2, "Afvist skrivning siges højt (rød bjælke)", !!document.getElementById("syncFejl"), document.getElementById("syncFejl") ? "bjælken vises" : "ingen bjælke");
      tjek(2, "Afvist skrivning melder ikke »gemt«", ok3 === false, "ideUpdate svarede " + ok3);
      localStorage.removeItem("SELE_AFVIS");
    }
    if (FASE === "laes2") {
      var tilbage = (window.__kundeAftalerAlle || window.__kundeAftaler || []);
      try { await renderAftaler(); tilbage = (window.__kundeAftalerAlle || window.__kundeAftaler || []); } catch (e) {}
      var n = tilbage.filter(function (a) { return a.dato === d(iMorgen) && erMoedeTitel(a.titel); }).length;
      tjek(5, "Slettet møde og dublet kommer ikke igen", n === 0, n + " tilbage");
      var p3 = (IDEER || []).find(function (x) { return x.id === "sc-ide-3"; });
      tjek(2, "Afvist ændring røg ikke i basen", p3 && p3.status === "Planlagt", p3 ? p3.status : "");
    }
  } catch (e) { r.fejl = e.message + " @ " + ((e.stack || "").split("\n")[1] || ""); }
  try { r.ls = {}; ["SELE_DB", "SC_ID", "SC_ORDEN"].forEach(function (k) { var v = localStorage.getItem(k); if (v != null) r.ls[k] = v; }); } catch (e) {}
  console.log("@@" + JSON.stringify(r) + "@@");
})();
