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
      /* LØFTE 24 · NY VERSION: appen må kun genindlæse, når intet er i gang (ingen skrivning, ingen brief, intet ark, intet gem på vej) */
      try {
        showTab(2); await V(800); try { document.activeElement && document.activeElement.blur(); } catch (e) {}
        var roligt = nyVersionSikkert();
        openBriefSide(LS("SC_ID")); await V(1200); var iBrief = nyVersionSikkert();
        showTab(2); await V(800); var t = document.createElement("textarea"); document.body.appendChild(t); t.focus(); var iSkriv = nyVersionSikkert(); t.remove();
        window.__NET = 1; var iGem = nyVersionSikkert(); window.__NET = 0;
        tjek(24, "Ny version venter, mens kunden skriver, har en brief åben eller gemmer", iBrief === false && iSkriv === false && iGem === false, "brief " + iBrief + " · skriver " + iSkriv + " · gemmer " + iGem);
        tjek(24, "Ny version hentes, når intet er i gang", roligt === true, "roligt " + roligt);
      } catch (e) { tjek(24, "Ny version-tjekket kunne køre", false, e.message); }
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
      /* LØFTE 23 · TO FANER: en anden fane har skrevet briefens CTA i basen; denne fane retter hooket — begge skal stå bagefter, ingen tavs overskrivning */
      var idT = LS("SC_ID"), dbT = JSON.parse(localStorage.getItem("SELE_DB") || "{}"), rkT = (dbT.content_ideer || []).find(function (x) { return String(x.id) === String(idT); });
      if (rkT) { rkT.brief = Object.assign({}, rkT.brief, { ctaCaption: "Fra den anden fane" }); localStorage.setItem("SELE_DB", JSON.stringify(dbT)); }
      var itT = (IDEER || []).find(function (x) { return String(x.id) === String(idT); });
      var okT = await ideUpdate(idT, { brief: Object.assign({}, itT && itT.brief, { hookTekst: "Rettet i denne fane" }) });
      var efterT = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").content_ideer) || []).find(function (x) { return String(x.id) === String(idT); }) || {};
      tjek(23, "To faner: begge rettelser står (ingen tavs overskrivning)", okT !== false && efterT.brief && efterT.brief.ctaCaption === "Fra den anden fane" && efterT.brief.hookTekst === "Rettet i denne fane", efterT.brief ? ("CTA: " + efterT.brief.ctaCaption + " · hook: " + efterT.brief.hookTekst) : "rækken findes ikke");
      /* LØFTE 23 · NET VÆK midt i et gem: ingen falsk »gemt«, den røde bjælke vises, og teksten står stadig lokalt */
      try { var sf = document.getElementById("syncFejl"); if (sf) sf.remove(); } catch (e) {}
      localStorage.setItem("SELE_AFVIS", "net");
      var okN = await ideUpdate("sc-ide-5", { brief: { beskrivelse: "Skrevet uden net" } }); await V(400);
      var lokal = (IDEER || []).find(function (x) { return x.id === "sc-ide-5"; });
      tjek(23, "Net væk: ingen falsk »gemt«", okN === false, "ideUpdate svarede " + okN);
      tjek(23, "Net væk: teksten står stadig i appen", !!(lokal && lokal.brief && lokal.brief.beskrivelse === "Skrevet uden net"), lokal && lokal.brief ? lokal.brief.beskrivelse : "");
      tjek(23, "Net væk: kunden får besked", !!document.getElementById("syncFejl") || !!document.querySelector(".ide-kladde, #ideKladdeStatus"), document.getElementById("syncFejl") ? "rød bjælke" : "ingen bjælke");
      localStorage.removeItem("SELE_AFVIS");
      try { var sf2 = document.getElementById("syncFejl"); if (sf2) sf2.remove(); } catch (e) {}
      localStorage.setItem("SELE_AFVIS", "fejl");
      var ok3 = await ideUpdate("sc-ide-3", { status: "Idé", dato: null });
      await V(400);
      tjek(2, "Afvist skrivning siges højt (rød bjælke)", !!document.getElementById("syncFejl"), document.getElementById("syncFejl") ? "bjælken vises" : "ingen bjælke");
      tjek(2, "Afvist skrivning melder ikke »gemt«", ok3 === false, "ideUpdate svarede " + ok3);
      localStorage.removeItem("SELE_AFVIS");
    }
    if (FASE === "laes2") {
      /* LØFTE 11 · TILBAGE på hver side i kundeappen (undtagen Hjem) — en usynlig vej ud er en blindgyde */
      try {
        var uden = [], tlf11 = window.matchMedia("(max-width:899px)").matches, sider11 = [1, 2, 6, 8, 9, 10, 12, 20, 21, 22, 23, 24, 25, 26, 31].filter(function (n) { return !(tlf11 && (n === 2 || n === 8)); });   /* Idébanken og Kalenderen er bundmenuens rodsider på telefonen */
        for (var si = 0; si < sider11.length; si++) { var n11 = sider11[si]; try { showTab(n11); } catch (e) { continue; } await V(500);
          var sc = document.getElementById("screen" + n11); if (!sc || !sc.getBoundingClientRect().height) continue;
          var tb = [].slice.call(document.querySelectorAll("button, a, [role=button]")).filter(function (b) { return /^\s*Tilbage\s*$/.test(b.textContent || "") && b.getBoundingClientRect().width > 0; });
          if (!tb.length) uden.push(n11); }
        tjek(11, "Tilbage findes på hver side", uden.length === 0, uden.length ? "uden Tilbage: skærm " + uden.join(", ") : sider11.length + " sider tjekket");
      } catch (e) { tjek(11, "Tilbage-tjekket kunne køre", false, e.message); }
      /* LØFTE 20 · LOG UD rydder kundens indhold på enheden, men ikke køen af ikke-sendte gem */
      try {
        var k20 = String(currentKode || "");
        localStorage.setItem("ide_koe_" + k20, '[{"test":1}]');
        var foer20 = Object.keys(localStorage).filter(function (n) { return n.slice(-k20.length) === k20; });
        var n20 = rydKundedataLokalt(k20);
        var efter20 = Object.keys(localStorage).filter(function (n) { return n.indexOf("ideer_cache_") === 0 || n.indexOf("skema_") === 0 || n.indexOf("maal_") === 0 || n.indexOf("opg_") === 0 || n.indexOf("insp_") === 0; }).filter(function (n) { return n.slice(-k20.length) === k20; });
        tjek(20, "Log ud fjerner kundens indhold fra enheden", efter20.length === 0, n20 + " fjernet · tilbage: " + efter20.join(", "));
        tjek(20, "Log ud beholder det, der endnu ikke er sendt", localStorage.getItem("ide_koe_" + k20) === '[{"test":1}]', "");
        localStorage.removeItem("ide_koe_" + k20);
      } catch (e) { tjek(20, "Log ud-tjekket kunne køre", false, e.message); }
      var tilbage = (window.__kundeAftalerAlle || window.__kundeAftaler || []);
      try { await renderAftaler(); tilbage = (window.__kundeAftalerAlle || window.__kundeAftaler || []); } catch (e) {}
      var n = tilbage.filter(function (a) { return a.dato === d(iMorgen) && erMoedeTitel(a.titel); }).length;
      tjek(5, "Slettet møde og dublet kommer ikke igen", n === 0, n + " tilbage");
      await V(2500);
      var sendt = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").content_ideer) || []).find(function (x) { return x.id === "sc-ide-5"; });
      tjek(23, "Det skrevne uden net sendes, når nettet er tilbage", !!(sendt && sendt.brief && sendt.brief.beskrivelse === "Skrevet uden net"), sendt && sendt.brief ? sendt.brief.beskrivelse : "ikke sendt");
      var p3 = (IDEER || []).find(function (x) { return x.id === "sc-ide-3"; });
      tjek(2, "Afvist ændring går ikke tabt: den sendes igen fra køen", p3 && p3.status === "Idé", p3 ? "status i basen: " + p3.status : "");
    }
  } catch (e) { r.fejl = e.message + " @ " + ((e.stack || "").split("\n")[1] || ""); }
  try { r.ls = {}; for (var li = 0; li < localStorage.length; li++) { var lk = localStorage.key(li); if (lk === "SELE_AFVIS") continue; r.ls[lk] = localStorage.getItem(lk); } } catch (e) {}   /* HELE lageret følger med (køen af ikke-sendte gem bor her) */
  console.log("@@" + JSON.stringify(r) + "@@");
})();
