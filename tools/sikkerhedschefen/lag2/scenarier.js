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
      aft.push({ id: "sc-moede-3", kode: "HINGES2026", titel: "Ugentlig contentplanlægning", dato: d(new Date(iDag.getTime() + 9 * 864e5)), tid: "10:00", tid_slut: "11:00" });   /* L49 */
      localStorage.setItem("SELE_DB", JSON.stringify({ content_ideer: ideer, kunde_aftaler: aft }));
      tjek(0, "Testdata lagt ind", true, ideer.length + " idéer, 2 møder (dublet) + 1 møde");
    }
    if (FASE === "skriv") {
      var rec = await ideAdd({ titel: "SC ny idé", soejle: "Produkt", type: "Reel", status: "Idé", brief: { beskrivelse: "skrevet af sikkerhedschefen" } });
      var id = rec && rec.id; LS("SC_ID", id);
      var ok1 = await ideUpdate(id, { brief: Object.assign({}, rec.brief, { hookTekst: "Hook fra sikkerhedschefen" }) });
      tjek(1, "Ny idé og brief gemt (kvittering)", !!id && ok1 !== false, "id " + id);
      var ok2 = await ideUpdate("sc-ide-3", { status: "Planlagt", dato: d(iMorgen) });
      tjek(3, "Status Idé → Planlagt gemt (kvittering)", ok2 !== false, "");
      /* LØFTE 3 · KUNDENS VEJ GENNEM BRIEFEN (Ida 18/10: »hvorfor har sikkerhedschefen ikke fanget det?«): en planlagt brief sættes til Idé i briefen
         og forlades — briefens eget gem skrev før datoen og »Planlagt« tilbage. Testen går den rigtige vej: åbn briefen → status Idé → ud. */
      try {
        await ideUpdate("sc-ide-6", { status: "Planlagt", dato: d(iMorgen) });
        openBriefSide("sc-ide-6"); await V(2500);
        await briefStatusVaelgFakta("sc-ide-6", "Idé"); await V(3000);
        var b6 = (IDEER || []).find(function (x) { return x.id === "sc-ide-6"; });
        var skaerm = (document.querySelector(".screen.active") || {}).id || "";
        tjek(3, "Brief sat til Idé og forladt: står i Idébanken, ikke i kalenderen", !!(b6 && b6.status === "Idé" && !b6.dato && ideErIBanken(b6)), b6 ? b6.status + " · dato " + (b6.dato || "ingen") : "findes ikke");
        tjek(3, "Efter statusskift lander man på kalenderens forside", skaerm === "screen8", "skærm " + skaerm);
      } catch (e) { tjek(3, "Statusskift gennem briefen kunne køre", false, e.message); }
      /* LØFTE 8 · KALENDERENS PLUS OPRETTER DIREKTE (Ida 18/10: »her skal jeg bare komme igang med at oprette direkte«): vagten mod »Uden titel« (10/10)
         afviste plusset, saa man landede i Idébanken uden et ark. Kundens vej: plus paa en dag → Opslag → First thing first staar aabent paa et nyt opslag. */
      try {
        try { bsFlytLuk(); } catch (e) {} showTab(8); await V(1200);
        var foerN = (IDEER || []).length; kalOpret(d(iMorgen)); await V(700);
        var opsKnap = [].slice.call(document.querySelectorAll("button, [role=button]")).filter(function (b) { return b.getClientRects().length && /^\s*Opslag\s*$/.test(b.innerText || ""); })[0];
        if (opsKnap) opsKnap.click(); await V(2500);
        var ftfAaben = !!document.querySelector("#bsFlytMenu .ftf-ark") && (document.getElementById("bsFlytMenu") || {}).style.display !== "none";
        tjek(8, "Kalenderens plus → Opslag åbner First thing first på et nyt opslag", !!opsKnap && ftfAaben && (IDEER || []).length === foerN + 1, (opsKnap ? "" : "ingen Opslag-knap · ") + "ark " + ftfAaben + " · opslag " + foerN + "→" + (IDEER || []).length);
        try { bsFlytLuk(); } catch (e) {} await V(1500);
      } catch (e) { tjek(8, "Kalenderens plus kunne testes", false, e.message); }
      /* L49 mødesiden viser ny dag (19/10) */
      try {
        moedeSideAaben("sc-moede-3"); await V(1500);
        var dagChip = document.querySelector(".mo-top-chips .ark-vchip"); if (dagChip) dagChip.click(); await V(900);
        var ny = new Date(iDag.getTime() + 12 * 864e5), nyIso = d(ny);
        var pd = document.getElementById("pmDato"); if (pd) pd.value = nyIso;
        var gemK = document.querySelector("#arkSlor .ark-send-pille"); if (gemK) gemK.click(); await V(2500);
        var vist = ((document.querySelector(".mo-top-chips .ark-vchip") || {}).innerText || "");
        var forvent = ny.getDate() + ". " + ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"][ny.getMonth()];
        tjek(49, "Ret mødets dag → mødesiden viser den nye dag med det samme", !!(dagChip && pd && gemK) && vist.indexOf(forvent) > -1, (dagChip ? "" : "ingen dag-chip · ") + (pd ? "" : "intet dagfelt · ") + (gemK ? "" : "ingen Gem · ") + "siden: " + vist + " · forventet " + forvent);
        try { arkLuk(true); } catch (e) {} window.__MOEDE_VALGT = ""; await V(800);
      } catch (e) { tjek(49, "Mødets dag kunne testes", false, e.message); }
      /* L51 møder oprettes kun manuelt (Ida 19/10) */
      try {
        var nAft = function () { return ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").kunde_aftaler) || []).length; };
        var foer51 = nAft(); var rFoer = MAALS.rytme;
        MAALS.rytme = Object.assign({}, MAALS.rytme || {}, { uge: { d: 3, t: "10:00" } }); window.__RYT_DAG = ""; window.__RYT_LAVET = {};
        var lavet51 = 0; try { lavet51 = await rytmeUdrul(); } catch (e) {} try { await renderAftaler(); } catch (e) {} await V(1500);
        tjek(51, "»Gentages hver uge« opretter ingen møder af sig selv", lavet51 === 0 && nAft() === foer51, "oprettet " + lavet51 + " · møder " + foer51 + "→" + nAft());
        MAALS.rytme = rFoer;
      } catch (e) { tjek(51, "Automatiske møder kunne testes", false, e.message); }
      try { showTab(2); } catch (e) {} await V(1200);
      LS("SC_ORDEN", IDEER.filter(ideErIBanken).map(function (x) { return String(x.id); }));
      /* LØFTE 13 · INGEN »UDEN TITEL« (Ida 10/10) */
      try {
        var u0 = await ideAdd({ titel: "", soejle: "Produkt", type: "Reel", status: "Idé", brief: {} });
        var u1 = await ideAdd({ titel: "  ", soejle: "Produkt", type: "Reel", status: "Idé", brief: { beskrivelse: "strik til efteråret i butikken med varme farver" } });
        tjek(13, "En idé uden navn og beskrivelse gemmes ikke", u0 === null, u0 ? "gemt som " + JSON.stringify(u0.titel) : "");
        tjek(13, "En idé uden navn får beskrivelsens første ord", !!(u1 && /^Strik til efteråret/.test(u1.titel || "")), u1 ? u1.titel : "ikke gemt");
        if (u1 && u1.id) { try { await sb.from("content_ideer").delete().eq("id", u1.id); IDEER = IDEER.filter(function (x) { return String(x.id) !== String(u1.id); }); } catch (e) {} }   /* testidéen væk igen, så rækkefølge-tjekket (løfte 4) er rent */
      } catch (e) { tjek(13, "Titel-tjekket kunne køre", false, e.message); }
      /* LØFTE 1 · DEN NYE IDÉ SES PÅ COMPUTEREN (Mette-testen 20/10: »Gemt under Uden plads — men hvor er den?« + »Tilføj din første idé« stod, selv om banken ikke var tom) */
      try {
        if (document.body.classList.contains("mb") && window.innerWidth >= 900) {
          showTab(2); ibVis("ideer"); IB_STED = ""; KUNDE_ARK_SOEJLE = ""; KUNDE_ARK_FORMAT = ""; await V(600);
          var kU = await kundeArkGem("SC idé uden søjle", "ide"); await V(1200);
          var nyU = (IDEER || []).filter(function (x) { return x.titel === "SC idé uden søjle"; }).pop();
          var synligU = !!(nyU && [].some.call(document.querySelectorAll('#ideaBank [data-id="' + nyU.id + '"], [data-id="' + nyU.id + '"]'), function (e) { return e.getClientRects().length; }));
          tjek(1, "1440 · ny idé uden søjle står på skærmen bagefter", synligU, "kvittering: " + kU + " · sted: " + (IB_STED || "Opslag"));
          IB_STED = ""; renderIdeas(); await V(400);
          var foersteU = [].some.call(document.querySelectorAll(".ibb-tom-alt"), function (e) { return e.getClientRects().length && /første idé/.test(e.innerText || ""); });
          tjek(1, "1440 · »Tilføj din første idé« står ikke, når banken har idéer", !foersteU, "teksten står under Opslag");
          if (nyU && nyU.id) { try { await sb.from("content_ideer").delete().eq("id", nyU.id); IDEER = IDEER.filter(function (x) { return String(x.id) !== String(nyU.id); }); } catch (e) {} }
        }
      } catch (e) { tjek(1, "Den nye idé på computeren kunne testes", false, e.message); }
      /* LØFTE 1 · »+ TILFØJ« OVER EN SØJLE VISER SØJLERNE (Ida 20/10: »her kommer der ingen indholdssøjle op«) */
      try {
        showTab(2); ibVis("ideer"); await V(500);
        var kolN = (strategyPillars && strategyPillars[1]) || "1B"; ibNyIdeI(kolN); await V(800);
        var ekS = document.getElementById("arkEkstra"); var sjS = ekS && ekS.querySelector(".ark-soejler");
        tjek(1, "»+ Tilføj« over en søjle: Indholdssøjle viser søjlerne", !!sjS && sjS.querySelectorAll(".ark-chip").length >= 4, sjS ? sjS.querySelectorAll(".ark-chip").length + " chips" : "ingen søjler i arket");
        try { arkLuk(true); } catch (e) {} KUNDE_ARK_SOEJLE = "";
      } catch (e) { tjek(1, "»+ Tilføj« over en søjle kunne testes", false, e.message); }
      /* LØFTE 7 + 10 · OPGAVER OG JA/NEJ: en ny to-do (med kvittering), afkrydset, og »Ja, postet« på et planlagt opslag */
      try {
        var k7 = await kundeArkGem("SC to-do fra sikkerhedschefen", "todo");
        tjek(10, "Ny to-do giver en kvittering", typeof k7 === "string" && k7.length > 0, "svar: " + k7);
        await refreshOpgaver(); var o7 = (OPGAVER || []).find(function (o) { return o.titel === "SC to-do fra sikkerhedschefen"; });
        if (o7) await toggleOpgave(o7.id);
        tjek(7, "To-do oprettet og afkrydset (kvittering)", !!(o7 && o7.done), o7 ? "done " + o7.done : "findes ikke");
        await opslagPostetJa("sc-plan-1"); await V(400); try { bsFlytLuk(); } catch (e) {} try { arkLuk(true); } catch (e) {}
      } catch (e) { tjek(7, "Opgave-tjekket kunne køre", false, e.message); }
      /* »ER DET POSTET?« NÅR HELE TEAMET (Idas klik 27/10 »Hele teamet + tal«): målt hos en kunde — intet sat til Postet siden 2/9, fordi spørgsmålet kun
         stod hos personen under Hvem laver indholdet. Et overskredet opslag til »René« skal ses af en anden i teamet og tælle med ved Indbakken; Idas eget aldrig. */
      try {
        var gaar = new Date(); gaar.setDate(gaar.getDate() - 1); var gIso = gaar.getFullYear() + "-" + String(gaar.getMonth() + 1).padStart(2, "0") + "-" + String(gaar.getDate()).padStart(2, "0");
        var navnF = CURRENT_NAVN; CURRENT_NAVN = "SC Freja";
        IDEER.push({ id: "sc-team-1", titel: "SC Teamopslag", status: "Brief i gang", dato: gIso, brief: { hvemPerson: "SC René" } });
        IDEER.push({ id: "sc-team-2", titel: "SC Idas opslag", status: "Brief i gang", dato: gIso, brief: { hvemPerson: "Ida" } });
        var ibT = indbakkeRegn(); ibBadgeTegn(ibT);
        var tTxt = (ibT.postet || []).map(function (x) { return x.t; }).join(" | ");
        var bdg = ["snIndbakBadge", "burgerIndbakBadge"].map(function (i) { var e = document.getElementById(i); return e ? Number(e.textContent || 0) : -1; }).filter(function (n) { return n >= 0; });
        IDEER = IDEER.filter(function (x) { return x.id !== "sc-team-1" && x.id !== "sc-team-2"; }); CURRENT_NAVN = navnF; try { ibBadgeTegn(); } catch (e) {}
        tjek(7, "»Er det postet?« står hos hele teamet, ikke kun den, der laver indholdet", /SC Teamopslag/.test(tTxt) && !/SC Idas opslag/.test(tTxt), tTxt || "ingen spørgsmål");
        tjek(7, "»Er det postet?« tæller med i tallet ved Indbakken", bdg.length > 0 && bdg.every(function (n) { return n >= 1; }), JSON.stringify(bdg));
      } catch (e) { tjek(7, "»Er det postet?« til teamet kunne testes", false, e.message); }
      /* »SE SOM KUNDEN« ER IDA (Ida 27/10: »jeg skal ikke redigere som kunden«): kommentaren står som Ida, og Idas kig gemmer aldrig kundens lektionsfremgang.
         Fejlede med koden før v2986 (»Kunden« + lektion_gjort-række). */
      try {
        var skF = SOM_KUNDE, nvF = CURRENT_NAVN, hlF = CURRENT_HILSEN, komF = BRIEF_STATE.kommentarer;
        SOM_KUNDE = "SCKODE"; CURRENT_NAVN = ""; CURRENT_HILSEN = "";
        var kfx = document.getElementById("briefKommentarFelt"), lavet = false; if (!kfx) { kfx = document.createElement("textarea"); kfx.id = "briefKommentarFelt"; document.body.appendChild(kfx); lavet = true; }
        BRIEF_STATE.kommentarer = []; kfx.value = "SC kommentar"; briefKommentarSend(); await V(200);
        var skHvem = ((BRIEF_STATE.kommentarer || []).slice(-1)[0] || {}).hvem;
        var lekFoer = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar) || []).filter(function (x) { return /^lektion_(gjort|set)_sc-som/.test(x.skema); }).length;
        await lekGjortSkift("sc-som-lek"); await V(200);
        var lekEfter = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar) || []).filter(function (x) { return /^lektion_(gjort|set)_sc-som/.test(x.skema); }).length;
        SOM_KUNDE = skF; CURRENT_NAVN = nvF; CURRENT_HILSEN = hlF; BRIEF_STATE.kommentarer = komF; if (lavet) kfx.remove();
        tjek(16, "Se som kunden: Idas kommentar står som Ida, ikke som kunden", skHvem === "Ida", "hvem: " + skHvem);
        tjek(16, "Se som kunden: Idas kig gemmer ikke kundens lektionsfremgang", lekEfter === lekFoer, lekFoer + " → " + lekEfter);
      } catch (e) { tjek(16, "Se som kunden kunne testes", false, e.message); }
      /* PLATFORM KUN FOR KREATØRER (Ida 27/10): en butik ser ikke Platform; en kreatør gør */
      try {
        var ftF = CURRENT_DEF && CURRENT_DEF.forretningstype; if (!CURRENT_DEF) CURRENT_DEF = {};
        CURRENT_DEF.forretningstype = "butik"; var pB = platformVises(); CURRENT_DEF.forretningstype = "kreator"; var pK = platformVises(); CURRENT_DEF.forretningstype = ftF;
        tjek(1, "Platform står kun hos kreatører, ikke hos butikker", pB === false && pK === true, "butik " + pB + " · kreatør " + pK);
      } catch (e) { tjek(1, "Platform-reglen kunne testes", false, e.message); }
      /* KALENDERKORTETS MENU (Ida 27/10: højreklik → Duplikér): kopien af et opslag i kalenderen beholder datoen og gemmes i basen */
      try {
        var dIso = "2026-12-24"; var kildeD = await ideAdd({ titel: "SC kalenderopslag", type: "Reel", soejle: "", status: "Brief i gang", dato: dIso, brief: { format: "Reel" } });
        if (kildeD && kildeD.id) { await kalOpslagDupl(kildeD.id); await V(400); }
        var kopierD = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").content_ideer) || []).filter(function (x) { return x.titel === "SC kalenderopslag" && x.dato === dIso; });
        tjek(1, "Kalenderens Duplikér: kopien står på samme dato og er gemt", kopierD.length === 2, kopierD.length + " rækker");
      } catch (e) { tjek(1, "Kalenderens Duplikér kunne testes", false, e.message); }
      /* LØFTE 52 · LEKTIONERNES OPGAVER GEMMES — FORLØBSKUNDEN (kursuskunden: tjek_forloeb.py) (Ida 22/10: »et grundigt sikkerhedstjek hver dag for at det kunderne skriver ind at det bliver gemt … når de laver opgaver«):
         ALLE lektioner med en opgave udfyldes som kunden gør det (feltet → Næste → Færdig); hvert svar skal stå i basen nu og efter genindlæsning (laes1). Nye opgaver kommer selv med. */
      try {
        var ovL = (KURSUS_LEKTIONER || []).filter(function (l) { return l.ovelse && l.ovelse.length; }), forv = {}, mangler = [], nSvar = 0;
        for (var oi = 0; oi < ovL.length; oi++) {
          var lk = ovL[oi]; try { closeIdeaWizard(); } catch (e) {}
          startOvelse(lk.id); await V(150); forv[lk.id] = {};
          for (var qi = 0; qi < lk.ovelse.length; qi++) {
            var q = lk.ovelse[qi], nk = ovNoegle(lk, qi);
            if (q && typeof q === "object" && q.type === "dage") { var db0 = document.querySelector("#ovelseDage [onclick*='ovelseDagToggle']"); if (db0) db0.click(); await V(50); forv[lk.id][nk] = OVELSE.svar[nk]; }
            else { var ta0 = document.getElementById("ovelseSvar"); if (!ta0) { mangler.push(lk.id + " spm " + (qi + 1) + ": intet felt"); break; } ta0.value = "SC svar " + lk.id + " nr " + (qi + 1); ovelseKladdeInput(ta0); forv[lk.id][nk] = ta0.value; }
            nSvar++; await ovelseNaeste(); await V(120);
          }
          await V(300);
          var rk0 = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar) || []).filter(function (x) { return x.skema === "lektion_svar_" + lk.id; }).pop();
          Object.keys(forv[lk.id]).forEach(function (k) { if (!rk0 || JSON.stringify((rk0.svar || {})[k]) !== JSON.stringify(forv[lk.id][k])) mangler.push(lk.id + " · " + k); });
        }
        try { closeIdeaWizard(); } catch (e) {}
        LS("SC_OV", forv);
        tjek(52, "Alle " + ovL.length + " opgaver (" + nSvar + " svar) er gemt i basen", ovL.length > 0 && !mangler.length, mangler.length ? "mangler: " + mangler.slice(0, 6).join(", ") : (ovL.length ? "" : "ingen lektioner med opgaver fundet"));
      } catch (e) { tjek(52, "Opgave-tjekket kunne køre", false, e.message); }
    }
    if (FASE === "laes1") {
      var id = LS("SC_ID"), it = (IDEER || []).find(function (x) { return String(x.id) === String(id); });
      /* LØFTE 52 efter genindlæsning (forløbskunden — kursuskunden + forsidens tal: tjek_forloeb.py): opgavesvarene kommer fra basen; før 22/10 hentede en forløbskunde aldrig sit forløb ved opstart */
      try {
        var forv1 = LS("SC_OV") || {}, mangl1 = [], vist = [];
        Object.keys(forv1).forEach(function (lid) { Object.keys(forv1[lid]).forEach(function (k) { if (JSON.stringify((KURSUS_SVAR[lid] || {})[k]) !== JSON.stringify(forv1[lid][k])) mangl1.push(lid + " · " + k); }); });
        var l1 = Object.keys(forv1)[0], lk1 = l1 && (KURSUS_LEKTIONER || []).find(function (x) { return x.id === l1; });
        if (lk1) { startOvelse(l1); await V(200); var ta1 = document.getElementById("ovelseSvar"); vist.push(ta1 ? ta1.value : "(intet felt)"); try { closeIdeaWizard(); } catch (e) {} }
        var k1 = lk1 && ovNoegle(lk1, 0);
        tjek(52, "Opgavesvarene står efter genindlæsning", Object.keys(forv1).length > 0 && !mangl1.length, mangl1.length ? "mangler: " + mangl1.slice(0, 6).join(", ") : "");
        tjek(52, "Kunden ser sit svar, når opgaven åbnes igen", !!(lk1 && vist[0] === forv1[l1][k1]), "viser »" + (vist[0] || "") + "«");
      } catch (e) { tjek(52, "Opgave-læsetjekket kunne køre", false, e.message); }
      tjek(1, "Ny idé står efter genindlæsning", !!it, it ? it.titel : "findes ikke");
      tjek(1, "Briefens hook står efter genindlæsning", it && it.brief && it.brief.hookTekst === "Hook fra sikkerhedschefen", it && it.brief ? it.brief.hookTekst : "");
      try { await refreshOpgaver(); var o7b = (OPGAVER || []).find(function (o) { return o.titel === "SC to-do fra sikkerhedschefen"; });
        tjek(7, "To-do og flueben står efter genindlæsning", !!(o7b && o7b.done), o7b ? "done " + o7b.done : "findes ikke");
        var pj = (IDEER || []).find(function (x) { return x.id === "sc-plan-1"; });
        tjek(7, "»Ja, postet« står efter genindlæsning", !!(pj && pj.status === "Postet"), pj ? pj.status : "findes ikke");
      } catch (e) { tjek(7, "Opgave-læsetjekket kunne køre", false, e.message); }
      var p3 = (IDEER || []).find(function (x) { return x.id === "sc-ide-3"; });
      tjek(3, "Status Planlagt står efter genindlæsning", p3 && p3.status === "Planlagt", p3 ? p3.status : "findes ikke");
      var p6 = (IDEER || []).find(function (x) { return x.id === "sc-ide-6"; });
      tjek(3, "Brief sat til Idé står stadig som Idé uden dato efter genindlæsning", !!(p6 && p6.status === "Idé" && !p6.dato), p6 ? p6.status + " · dato " + (p6.dato || "ingen") : "findes ikke");
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
      var dbM = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").kunde_aftaler) || []).filter(function (a) { return a.id !== "sc-moede-3"; }).length;
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
      /* LØFTE 5 · SLET FRA REDIGERINGEN (10/10: knappen »Slet mødet« i redigeringsarket kaldte uden id og gjorde ingenting) */
      try {
        var db5 = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); db5.kunde_aftaler = (db5.kunde_aftaler || []).concat([{ id: "sc-moede-9", kode: "HINGES2026", titel: "Ugentlig contentplanlægning", dato: d(iMorgen), tid: "10:00", tid_slut: "11:00" }]);
        localStorage.setItem("SELE_DB", JSON.stringify(db5)); await renderAftaler(); await V(300);
        var ma5 = null; try { ma5 = planMoedeAftale(); } catch (e) {}
        moedeSlet(); await V(500);
        var ja5 = [].slice.call(document.querySelectorAll("button")).filter(function (b) { return /Ja, slet/.test(b.textContent || "") && b.getBoundingClientRect().width > 0; })[0];
        if (ja5) ja5.click(); await V(1800);
        var tilb5 = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").kunde_aftaler) || []).filter(function (a) { return a.id === "sc-moede-9"; }).length;
        tjek(5, "»Slet mødet« i redigeringen spørger og sletter", !!ja5 && tilb5 === 0, "åbent møde " + (ma5 ? ma5.id : "intet") + " · spørgsmål " + (ja5 ? "vist" : "kom ikke") + " · i basen " + tilb5);
      } catch (e) { tjek(5, "Slet-fra-redigeringen-tjekket kunne køre", false, e.message); }
      /* LØFTE 16 · BACKSTAGES RETTELSER: en afvist rettelse (0 rækker) i en tabel, der kan læses, giver rød bjælke — en tabel, der intet kan bevise, er stille */
      try {
        var fjern16 = function () { var s16 = document.getElementById("syncFejl"); if (s16) s16.remove(); };
        var db16 = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); db16.contacts = [{ id: "sc-kontakt-1", navn: "Opdigtet kontakt", status: "Lead" }]; db16.energida_ideer = []; localStorage.setItem("SELE_DB", JSON.stringify(db16));
        fjern16(); localStorage.setItem("SELE_AFVIS", "0");
        await sb.from("contacts").update({ status: "Kunde" }).eq("id", "sc-kontakt-1"); await V(800);
        var bjaelke16 = !!document.getElementById("syncFejl"); fjern16();
        await sb.from("energida_ideer").update({ projekt: "x" }).eq("id", "findes-ikke"); await sb.from("virksomhedskoder").update({ aktiv: true }).eq("kode", "FINDESIKKE"); await V(800);
        var stille16 = !document.getElementById("syncFejl"); fjern16();
        localStorage.removeItem("SELE_AFVIS");
        await sb.from("contacts").update({ status: "Kunde" }).eq("id", "sc-kontakt-1"); await V(800);
        var ok16 = !document.getElementById("syncFejl"); fjern16();
        tjek(16, "Afvist rettelse i Backstage giver rød bjælke", bjaelke16, bjaelke16 ? "" : "ingen bjælke ved 0 rækker i kontakter");
        tjek(16, "Ingen falsk bjælke, hvor intet kan bevises eller alt lykkes", stille16 && ok16, "tom tabel/kode: " + (stille16 ? "stille" : "BJÆLKE") + " · lykket rettelse: " + (ok16 ? "stille" : "BJÆLKE"));
      } catch (e) { localStorage.removeItem("SELE_AFVIS"); tjek(16, "Backstage-rettelse-tjekket kunne køre", false, e.message); }
      /* LØFTE 1 · KOMMENTAR I DIALOG-FLISEN på briefens forside (10/10: feltet kaldte en funktion med samme navn som godkendelsens, der ikke fandt feltet) */
      try {
        var id1 = LS("SC_ID"); openBriefSide(id1); await V(1500);
        BRIEF_STATE.godk = { fra: "Kunden", til: "Ida", sendt: new Date().toISOString() };
        var f1 = document.createElement("textarea"); f1.value = "Kommentar fra sikkerhedschefen"; document.body.appendChild(f1);
        await (typeof briefKommentarSendFlise==="function"?briefKommentarSendFlise(f1):briefKommentarSend(f1)); await V(1500); f1.remove();
        var r1 = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").content_ideer) || []).find(function (x) { return String(x.id) === String(id1); }) || {};
        var k1 = (r1.brief && r1.brief.kommentarer) || [];
        tjek(1, "Kommentar i briefens dialog-flise gemmes i basen", k1.some(function (k) { return k && k.tekst === "Kommentar fra sikkerhedschefen"; }), k1.length + " kommentarer i basen");
      } catch (e) { tjek(1, "Kommentar-tjekket kunne køre", false, e.message); }
      /* LØFTE 1 · TELEFON OG COMPUTER ER ENS (Ida 10/10): det, der sættes på én enhed, står på den anden; den nyeste vinder */
      try {
        var k9 = "energibank_status_" + String(currentKode || "X"), k9b = "ib_set_" + String(currentKode || "X");
        localStorage.setItem(k9, '{"opdigtet":"Rykker"}'); localStorage.setItem(k9b, '{"sc":1}'); await V(2600);
        var rk9 = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").workout_data) || []).filter(function (x) { return x.skema === "enhedssynk"; });
        var i9 = rk9[0] && rk9[0].svar || {};
        tjek(1, "Telefon → basen: det satte gemmes i brugerens række", rk9.length === 1 && i9[k9] && i9[k9].v === '{"opdigtet":"Rykker"}' && !!i9[k9b], rk9.length + " række(r) · " + Object.keys(i9).join(", "));
        /* den anden enhed: intet lokalt — hentes fra basen */
        ENHED_SYNK.skriver = true; localStorage.removeItem(k9); localStorage.removeItem(k9b); localStorage.removeItem("enhedssynk_t"); ENHED_SYNK.skriver = false;
        var n9 = await enhedSynkHent();
        tjek(1, "Basen → computer: den anden enhed får det samme", localStorage.getItem(k9) === '{"opdigtet":"Rykker"}' && localStorage.getItem(k9b) === '{"sc":1}', n9 + " hentet · " + localStorage.getItem(k9));
        /* nyeste vinder: en nyere værdi fra den anden enhed overskriver den ældre lokale */
        var db9 = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); var r9 = (db9.workout_data || []).filter(function (x) { return x.skema === "enhedssynk"; })[0];
        r9.svar[k9] = { v: '{"opdigtet":"Inkasso"}', t: Date.now() + 60000 }; localStorage.setItem("SELE_DB", JSON.stringify(db9));
        await enhedSynkHent();
        tjek(1, "Nyeste ændring vinder mellem enhederne", localStorage.getItem(k9) === '{"opdigtet":"Inkasso"}', localStorage.getItem(k9));
        /* afvist synk: ingen rød bjælke, og tingen står stadig på enheden */
        var sf9 = document.getElementById("syncFejl"); if (sf9) sf9.remove();
        localStorage.setItem("SELE_AFVIS", "fejl"); localStorage.setItem(k9b, '{"sc":2}'); await V(2600); localStorage.removeItem("SELE_AFVIS");
        tjek(1, "Afvist synk: ingen falsk bjælke, intet tabt på enheden", !document.getElementById("syncFejl") && localStorage.getItem(k9b) === '{"sc":2}', document.getElementById("syncFejl") ? "BJÆLKE" : "stille · " + localStorage.getItem(k9b));
      } catch (e) { localStorage.removeItem("SELE_AFVIS"); tjek(1, "Synk-tjekket kunne køre", false, e.message); }
      /* LØFTE 26 · FEJL NÅR FREM TIL IDA: en rød bjælke hos kunden bliver én linje i basen (kun fejlbeskeden), og samme fejl kun én gang */
      try {
        localStorage.removeItem("SELE_AFVIS"); Object.keys(sessionStorage).forEach(function (k) { if (k.indexOf("fejl_sendt_") === 0) sessionStorage.removeItem(k); });
        visSyncFejl("sikkerhedschefen.test — 0 rækker skrevet"); visSyncFejl("sikkerhedschefen.test — 0 rækker skrevet"); await V(600);
        var f26 = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar) || []).filter(function (x) { return x.navn === "app_fejl" && x.svar && /sikkerhedschefen\.test/.test(x.svar.hvad || ""); });
        tjek(26, "En rød bjælke hos kunden når frem til Ida (én linje, ingen dublet)", f26.length === 1 && !!f26[0].svar.v && !!f26[0].svar.tid, f26.length + " linje(r)" + (f26[0] ? " · v" + f26[0].svar.v : ""));
        var sf26 = document.getElementById("syncFejl"); if (sf26) sf26.remove();
      } catch (e) { tjek(26, "Fejl-tjekket kunne køre", false, e.message); }
      /* OVERBLIKKETS TAL (Ida 10/10): køb pr. kode, koder sendt, nye kunders fremgang — testkøb tælles aldrig */
      try {
        var nu0 = Date.now(), dag0 = 864e5;
        var db0 = JSON.parse(localStorage.getItem("SELE_DB") || "{}");
        db0.contacts = (db0.contacts || []).concat([
          { id: "o1", kunde: "Opdigtet Isenkram", status: "Kunde", source: "YOU GOT THIS · Gamle kunder", kommentar: "Hanne · h@x.dk · Kode: OPDIGTET2026", created_at: new Date(nu0 - Math.min(3600e3, Math.max(1000, (nu0 - new Date(nu0).setHours(0, 0, 0, 0)) / 2))).toISOString() },   /* »i dag« også lige efter midnat (nat 23/10: en time før 00.20 er i går) */
          { id: "o2", kunde: "Butik Nordlys", status: "Kunde", source: "YOU GOT THIS · Ringkøbing Handelsforening", kommentar: "Kode: NORDLYS2026", created_at: new Date(nu0 - 3 * dag0).toISOString() },
          { id: "o3", kunde: "Gammel butik", status: "Kunde", source: "YOU GOT THIS · Ringkøbing Handelsforening", kommentar: "Kode: GAMMEL2026", created_at: new Date(nu0 - 40 * dag0).toISOString() },
          { id: "o4", kunde: "Test", status: "Kunde", source: "Testlink", kommentar: "Kode: TEST", created_at: new Date(nu0).toISOString() },
          { id: "o5", kunde: "Lead A", status: "Lead", source: "Gamle kunder", created_at: new Date(nu0).toISOString() },
          { id: "o6", kunde: "Lead B", status: "Lead", source: "Gamle kunder", created_at: new Date(nu0).toISOString() }]);
        db0.skema_svar = (db0.skema_svar || []).concat([1, 2, 3].map(function (n) { return { id: "ls" + n, kode: "OPDIGTET2026", navn: "Hanne", skema: "lektion_set_1-" + n, svar: { set: true }, created_at: new Date(nu0 - n * 600e3).toISOString() }; }));
        localStorage.setItem("SELE_DB", JSON.stringify(db0));
        var ot = await overblikTal(new Date(nu0));
        var opd = (ot.nye || []).filter(function (x) { return x.kode === "OPDIGTET2026"; })[0];
        tjek(1, "Overblikket: køb i dag · uge · måned tælles rigtigt (testkøb udenfor)", ot.ok && ot.koeb.iDag === 1 && ot.koeb.uge === 2 && ot.koeb.maaned === 2 && ot.koeb.alle === 3, JSON.stringify(ot.koeb));
        tjek(1, "Overblikket: køb pr. kode og sendte koder", ot.prKilde["Gamle kunder"] === 1 && ot.prKilde["Ringkøbing Handelsforening"] === 2 && ot.koderSendt === 2, JSON.stringify(ot.prKilde) + " · sendt " + ot.koderSendt);
        tjek(1, "Overblikket: nye kunders fremgang (lektioner set)", !!(opd && opd.set === 3 && opd.ialt > 0), opd ? opd.set + " af " + opd.ialt : "ingen");
      } catch (e) { tjek(1, "Overbliks-tjekket kunne køre", false, e.message); }
      /* LØFTE 1 · MAPPER I INSPIRATION (Idas klik 20/10, bud 1): en mappe gemmes på kundens kode, et kort lagt i mappen gemmes på kortets egen række (insp_meta), mappen viser kortet — og kortet selv røres ikke */
      try {
        var dbI = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); dbI.inspiration = (dbI.inspiration || []).filter(function (x) { return x.id !== "sc-insp-1"; }).concat([{ id: "sc-insp-1", kode: currentKode, type: "link", url: "https://www.instagram.com/reel/SCmappe1/", note: null, created_at: new Date().toISOString() }]); localStorage.setItem("SELE_DB", JSON.stringify(dbI));
        showTab(2); ibVis("insp"); await V(600); await refreshInspiration(); await V(300);
        var kM = (INSPIRATION || []).filter(function (x) { return String(x.id).indexOf("i") !== 0; })[0];
        if (!kM) tjek(1, "Mapper: der findes et kort at teste på", false, "ingen inspiration i selen");
        else {
          var foerKort = JSON.stringify(kM);
          INSP_MAPPER = INSP_MAPPER.filter(function (m) { return m.id !== "msc"; }).concat([{ id: "msc", navn: "SC mappe" }]);
          var okL = await inspMapperGem(); await inspFlytTil(kM.id, "msc"); await V(300);
          var dbM = JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar || [];
          var lR = dbM.filter(function (x) { return x.skema === "insp_mapper" && x.navn === "liste"; })[0];
          var mR = dbM.filter(function (x) { return x.skema === "insp_meta" && String(x.navn) === String(kM.id); })[0];
          tjek(1, "Mapper: ny mappe gemmes på kundens kode", okL && lR && JSON.stringify(lR.svar).indexOf("SC mappe") > -1, lR ? JSON.stringify(lR.svar).slice(0, 120) : "ingen insp_mapper-række");
          tjek(1, "Mapper: kortet lagt i mappen gemmes på kortets egen række", !!(mR && mR.svar && mR.svar.mappe === "msc"), mR ? JSON.stringify(mR.svar) : "ingen insp_meta-række");
          inspMappeAabn("msc"); await V(300);
          var iM = [].map.call(document.querySelectorAll("#inspGrid .insp-kort[data-id]"), function (e) { return e.getAttribute("data-id"); });
          tjek(1, "Mapper: mappen viser kortet", iM.length === 1 && iM[0] === String(kM.id), iM.join(","));
          tjek(1, "Mapper: selve inspirationskortet er urørt", JSON.stringify((INSPIRATION || []).filter(function (x) { return x.id === kM.id; })[0]) === foerKort, "kortet ændrede sig");
          inspMappeAabn(""); await V(200);
          var nyKnap = [].some.call(document.querySelectorAll("#inspMapper button"), function (b) { return /Ny mappe/.test(b.textContent || ""); });
          tjek(1, "Mapper: »+ Ny mappe« er en flise, ikke en lille knap", !nyKnap && !!document.querySelector("#inspMapper .insp-mappe-ny"), nyKnap ? "står som knap" : "mangler");
          INSP_MAPPER = INSP_MAPPER.filter(function (m) { return m.id !== "msc"; }); await inspMapperGem(); await inspFlytTil(kM.id, "");
        }
      } catch (e) { tjek(1, "Mapper-tjekket kunne køre", false, e.message); }
      /* LØFTE 2 · INGEN DATA PÅ TVÆRS AF KUNDER I INSPIRATION (Ida 20/10: »Data må ALDRIG kunne deles på tværs af profiler«): ligger en anden kundes kort og mapper i hukommelsen, tegnes de ALDRIG */
      try {
        showTab(2); ibVis("insp"); await V(400);
        window.INSP_VIST_KODE = "ANDENKUNDE2026"; try { INSP_VIST_KODE = "ANDENKUNDE2026"; } catch (e) {}
        INSPIRATION = [{ id: "x-anden-kunde", kode: "ANDENKUNDE2026", type: "link", url: "https://www.instagram.com/reel/ANDENkunde/", created_at: new Date().toISOString() }];
        INSP_MAPPER = [{ id: "ma", navn: "Anden kundes mappe" }];
        renderInspiration(); await V(600);
        var tekstI = ((document.getElementById("inspSektion") || {}).innerText || "");
        var fremmed = !!document.querySelector('#inspGrid [data-id="x-anden-kunde"]') || /Anden kundes mappe/.test(tekstI);
        tjek(2, "Inspiration viser aldrig en anden kundes kort eller mapper", !fremmed, "en anden kundes data stod på siden");
      } catch (e) { tjek(2, "Tvær-kunde-tjekket kunne køre", false, e.message); }
      /* LØFTE 3 · INDHOLDSSØJLEN ÆNDRER ALDRIG STATUS (Ida 20/10): en idé med beskrivelse får en søjle — via knappen på flisen og via briefens gem — og er stadig »Idé« */
      try {
        var rS = await ideAdd({ titel: "SC idé uden søjle", type: "", soejle: "", status: "Idé", dato: null, brief: { beskrivelse: "skrevet i Ny idé" } });
        var pl = ibIdeSoejler(); await ibIdeFlytTil(rS.id, pl[0]); await V(300);
        var efterKnap = (ibIdeAf(rS.id) || {}).status;
        BRIEF_ID = rS.id; BRIEF_STATE = { beskrivelse: "skrevet i Ny idé", soejle: pl[1] }; briefAutosavePlan(); await V(1600);
        var efterBrief = (ibIdeAf(rS.id) || {}).status;
        tjek(3, "Indholdssøjlen ændrer aldrig status (knap + brief)", efterKnap === "Idé" && efterBrief === "Idé", "knap: " + efterKnap + " · brief: " + efterBrief);
        BRIEF_ID = null; try { await sb.from("content_ideer").delete().eq("id", rS.id); IDEER = IDEER.filter(function (x) { return String(x.id) !== String(rS.id); }); } catch (e) {}
      } catch (e) { tjek(3, "Søjle-status-tjekket kunne køre", false, e.message); }
      /* LØFTE 1 · PLANLÆGNINGSMØDET HUSKER STEDET (20/10, fund 7): luk mødet på trin 4 → start igen → stadig trin 4; »Færdig« starter forfra */
      try {
        window.__PR_PAUSE = null; planRitStart("uge"); await V(300);
        prGaa(4); planRitLuk(); planRitStart(); await V(200);
        var prOk = PR && PR.trin === 4;
        PR.__faerdig = true; planRitLuk(); planRitStart("uge"); await V(200);
        var prNy = PR && PR.trin === 1 && !PR.__faerdig;
        planRitLuk(); window.__PR_PAUSE = null;
        tjek(1, "Planlægningsmødet fortsætter, hvor man slap", prOk, "stod ikke på trin 4");
        tjek(1, "Planlægningsmødet starter forfra efter Færdig", prNy, "huskede et afsluttet møde");
      } catch (e) { tjek(1, "Møde-tjekket kunne køre", false, e.message); }
      /* LØFTE 1 · NYT LEAD UDEN AT VÆLGE (Ida 21/10): »Nyt lead« gemmer et lead uden kilde; taget »Gamle kunder« giver kilden — og intet andet */
      try {
        var mmL = window.matchMedia; window.matchMedia = function () { return { matches: false }; };
        nytLeadArk(false); await V(200);
        document.getElementById("gkNavn").value = "Lise"; document.getElementById("gkButik").value = "SC Lead uden tag"; document.getElementById("gkMail").value = "lise@sc.dk";
        await gamleKunderSend(null); await V(300); window.matchMedia = mmL; try { bsFlytLuk(); } catch (e) {}
        var lR = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").contacts) || []).filter(function (x) { return x.kunde === "SC Lead uden tag"; })[0];
        tjek(1, "Nyt lead gemmes som Lead uden tag", !!(lR && lR.status === "Lead" && !lR.source), lR ? JSON.stringify({ status: lR.status, source: lR.source }) : "ikke gemt");
      } catch (e) { tjek(1, "Nyt lead kunne testes", false, e.message); }
      /* PERSON-LEAD (Ida 22/10: familie og venner, der tester, »er altså ikke en butik«): Person → intet butiksfelt, navnet kræves, leadet står under navnet */
      try {
        var mmP = window.matchMedia; window.matchMedia = function () { return { matches: false }; };
        nytLeadArk(false); await V(200); gkTypeSaet(true);
        document.getElementById("gkMail").value = "person@sc.dk"; await gamleKunderSend(null); var pTom = (document.getElementById("gkMsg") || {}).textContent || "";
        document.getElementById("gkNavn").value = "SC Opdigtet Person"; await gamleKunderSend(null); await V(300); window.matchMedia = mmP; try { bsFlytLuk(); } catch (e) {}
        var pR = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").contacts) || []).filter(function (x) { return x.kunde === "SC Opdigtet Person"; })[0];
        tjek(1, "Person-lead uden navn gemmes ikke og siges", /personens navn/i.test(pTom), pTom);
        tjek(1, "Person-lead gemmes uden butik under personens navn", !!(pR && pR.status === "Lead" && pR.kontaktperson === "SC Opdigtet Person"), pR ? JSON.stringify({ kunde: pR.kunde, status: pR.status }) : "ikke gemt");
      } catch (e) { tjek(1, "Person-lead kunne testes", false, e.message); }
      /* ÉT ARK TIL NYE LEADS (Ida 22/10: »jeg føler mig ikke tryg i at den lander i crm«): plusset/Tøm hovedet med Lead åbner Nyt lead med navnet; produktet gemmes på leadet */
      try {
        var dbP = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); dbP.produkter = [{ navn: "SC Produkt", sortering: 1 }]; localStorage.setItem("SELE_DB", JSON.stringify(dbP)); LEAD_PRODUKTER = null;
        var mmL2 = window.matchMedia; window.matchMedia = function () { return { matches: false }; };
        bf3ToemArk("SC Lead fra Hjem", "lead"); await V(500);
        var navnL = (document.getElementById("gkNavn") || {}).value || "";
        BF3_DROP_VALG.gkProdukt = "SC Produkt"; document.getElementById("gkButik").value = "SC Hjem-butik"; document.getElementById("gkMail").value = "hjem@sc.dk";
        await gamleKunderSend(null); await V(300); window.matchMedia = mmL2; try { bsFlytLuk(); } catch (e) {}
        var hR = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").contacts) || []).filter(function (x) { return x.kunde === "SC Hjem-butik"; })[0];
        tjek(1, "Lead fra Hjem åbner Nyt lead med navnet", navnL === "SC Lead fra Hjem", "navn »" + navnL + "«");
        tjek(1, "Lead fra Hjem står i CRM som Lead med produktet", !!(hR && hR.status === "Lead" && hR.produkt === "SC Produkt"), hR ? JSON.stringify({ status: hR.status, produkt: hR.produkt }) : "ikke gemt");
      } catch (e) { tjek(1, "Lead fra Hjem kunne testes", false, e.message); }
      /* EGNE TAGS (Ida 21/10: »så skal jeg kunne tilføje nyt tag jeg skal kunne filtrere efter«): nyt tag i arket → sidder på leadet, gemt i basen, og filterchippen viser kun det lead */
      try {
        var mmT = window.matchMedia; window.matchMedia = function () { return { matches: false }; };
        nytLeadArk(false); await V(200);
        document.getElementById("gkNavn").value = "Tove"; document.getElementById("gkButik").value = "SC Tagbutik"; document.getElementById("gkMail").value = "tove@sc.dk";
        document.getElementById("gkTagNy").value = "sc messe"; gkNytTag();
        await gamleKunderSend(null); await V(400); window.matchMedia = mmT; try { bsFlytLuk(); } catch (e) {}
        var tR = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").contacts) || []).filter(function (x) { return x.kunde === "SC Tagbutik"; })[0];
        var tPaa = tR ? crmTagsPaa(tR.id) : [];
        var tBase = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar) || []).filter(function (x) { return x.skema === "crm_tags"; })[0];
        tjek(1, "Eget tag sidder på det nye lead og er gemt i basen", tPaa.indexOf("Sc messe") > -1 && !!tBase && JSON.stringify(tBase.svar).indexOf("Sc messe") > -1, JSON.stringify(tPaa) + (tBase ? " · gemt" : " · ikke i basen"));
        BS_KUNDE_CHIP = "tag:Sc messe"; kunderneTegn(true); await V(200);
        var tFl = Array.prototype.map.call(document.querySelectorAll("#dside-crm .bs3-kunde .bs3-n, #dside-crm .crmt td.crmt-k, #dside-crm .crmt-rk-n"), function (x) { return x.textContent; });
        BS_KUNDE_CHIP = "alle"; try { kunderneTegn(true); } catch (e) {}
        tjek(1, "Filterchippen med et eget tag viser kun leads med tagget", tFl.length === 1 && tFl[0] === "SC Tagbutik", JSON.stringify(tFl));
      } catch (e) { tjek(1, "Egne tags kunne testes", false, e.message); }
      /* ET NYT TAG OVERLEVER, AT ARKET LUKKES (Ida 27/10: »Jeg har tidligere oprettet et tag der hedder netværk … hvorfor fremgår netværk ikke nu?«):
         tagget skrives i basen, så snart det tilføjes — også når leadet aldrig gemmes. Fejlede med koden før v2980 (tagget levede kun i hukommelsen). */
      try {
        var mmT2 = window.matchMedia; window.matchMedia = function () { return { matches: false }; };
        nytLeadArk(false); await V(200);
        document.getElementById("gkTagNy").value = "sc netværk"; gkNytTag(); await V(600);
        window.matchMedia = mmT2; try { bsFlytLuk(); } catch (e) {}
        var tB2 = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar) || []).filter(function (x) { return x.skema === "crm_tags"; })[0];
        tjek(1, "Nyt tag i Nyt lead er gemt i basen, selv om leadet ikke gemmes", !!tB2 && JSON.stringify(tB2.svar).indexOf("Sc netværk") > -1, tB2 ? "i basen: " + JSON.stringify(tB2.svar).slice(0, 120) : "ikke i basen");
      } catch (e) { tjek(1, "Nyt tag uden lead kunne testes", false, e.message); }
      /* PRODUKTLISTEN I NYT LEAD (Ida 27/10, v2978): Forretnings produkter + de inderste rum under dem; YOU GOT THIS · DETAIL er ikke et eget valg */
      try {
        LEAD_PRODUKTER_BASE = ["YOU GOT THIS", "YOU GOT THIS · DETAIL"]; await salgHent(); var prisF = SALG.priser; SALG.priser = [{ id: "scp", n: "SC Foredrag", p: "", l: "" }];
        var rumF = MR_RUM, hentF = MR_RUM_HENTET; MR_RUM = [{ id: "scr1", navn: "SC Oplæg", produkt: "SC Foredrag", felter: {} }, { id: "scr2", navn: "SC Talen", foraelder_id: "scr1", felter: {} }]; MR_RUM_HENTET = true;
        var pl = await leadProdukterHent();
        SALG.priser = prisF; MR_RUM = rumF; MR_RUM_HENTET = hentF; LEAD_PRODUKTER_BASE = null;
        tjek(1, "Nyt lead: produkt fra Forretning og punktet under det kan vælges", pl.indexOf("SC Foredrag") > -1 && pl.indexOf("SC Foredrag · SC Talen") > -1 && pl.indexOf("SC Foredrag · SC Oplæg") < 0, JSON.stringify(pl));
        tjek(1, "Nyt lead: YOU GOT THIS står én gang", pl.filter(function (x) { return /^you got this/i.test(x); }).length === 1, JSON.stringify(pl));
      } catch (e) { tjek(1, "Produktlisten i Nyt lead kunne testes", false, e.message); }
      /* GAMLE KUNDER (salgsturnéen): lead gemmes m. kvittering, mailen bærer koden og siden, tom butik siges */
      try {
        var mm = window.matchMedia, wo = window.open; window.matchMedia = function () { return { matches: false }; }; window.open = function (u) { window.__GK_MAIL = u; return {}; };
        gamleKunderArk(); await V(200);
        await gamleKunderSend(null); var gkTom = (document.getElementById("gkMsg") || {}).textContent || "";
        document.getElementById("gkNavn").value = "Hanne"; document.getElementById("gkButik").value = "SC Isenkram"; document.getElementById("gkMail").value = "hanne@sc.dk";
        await gamleKunderSend(null); await V(300);
        window.matchMedia = mm; window.open = wo; try { bsFlytLuk(); } catch (e) {}
        var gkRk = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").contacts) || []).filter(function (x) { return x.source === "Gamle kunder" && x.kunde === "SC Isenkram"; });
        var gkMail = decodeURIComponent(String(window.__GK_MAIL || "").split("body=")[1] || "");
        tjek(1, "Gamle kunder: tom butik gemmes ikke og siges", /butikkens navn/i.test(gkTom), gkTom);
        tjek(1, "Gamle kunder: lead gemt i CRM", gkRk.length === 1 && gkRk[0].status === "Lead", gkRk.length + " række(r)");
        /* gem nu, send senere (13/10) */
        tjek(1, "Gamle kunder: arket sender ingen mail, kontakten venter på udsendelsen", !gkMail && gkRk.length === 1 && gkRk[0].kommentar === "Kode ikke sendt endnu", (gkMail ? "mail åbnet · " : "") + (gkRk[0] ? gkRk[0].kommentar : "ingen række"));
      } catch (e) { tjek(1, "Gamle kunder-tjekket kunne køre", false, e.message); }
      /* INSPIRATION: flere links ad gangen, ingen dubletter, linket i noten bliver et Instagram-kort */
      try {
        var i0 = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").inspiration) || []).length;
        var iSvar = await kundeArkGem("https://www.instagram.com/reel/SCa1/\nwww.instagram.com/reel/SCb2/", "fedt");
        var iDub = await kundeArkGem("https://instagram.com/reel/SCa1", "fedt");
        var i1 = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").inspiration) || []).length;
        tjek(1, "Inspiration: to links på én gang bliver to kort", i1 - i0 === 2, (i1 - i0) + " nye · " + iSvar);
        tjek(1, "Inspiration: samme link oprettes ikke igen", /allerede/i.test(String(iDub)) && i1 - i0 === 2, String(iDub));
        tjek(1, "Inspiration: link i noten genkendes som Instagram", inspErIg({ type: "link", url: null, note: "www.instagram.com/reel/X1/" }), "");
      } catch (e) { tjek(1, "Inspirations-tjekket kunne køre", false, e.message); }
      localStorage.setItem("energida_skal_ny_kode", "1");   /* som når linket »Glemt adgangskode« i mailen er åbnet — næste fase starter appen forfra */
    }
    if (FASE === "link") {
      /* LØFTE 11 + 15 · DELELINKET (ikke 22: købsrejsen er sin egen) (Ida 10/10: »opslaget kommer aldrig — den bliver bare ved med at loade« + »del skal ind på briefoversigten«) */
      try {
        var tid22 = 0; while (tid22 < 8000 && !(typeof BRIEF_ID !== "undefined" && String(BRIEF_ID) === "sc-ide-2")) { await V(250); tid22 += 250; }
        var synligt = function (e) { if (!e) return false; var cs = getComputedStyle(e), b = e.getBoundingClientRect(); return cs.display !== "none" && cs.visibility !== "hidden" && +cs.opacity >= 0.1 && b.height > 100 && b.width > 100; };
        var tepper = ["privCover", "appLoader", "energidaLoader", "somkundeLoader"].filter(function (id) { return synligt(document.getElementById(id)); });
        var loeftet = tepper.length === 0;
        var s7 = document.getElementById("screen7"); var tekst = s7 ? s7.innerText.replace(/\s+/g, " ") : "";
        var godk = !!document.querySelector("#briefGodkendKrop") && document.querySelector("#briefGodkendKrop").getBoundingClientRect().height > 0;
        tjek(11, "Delelinket åbner briefen", typeof BRIEF_ID !== "undefined" && String(BRIEF_ID) === "sc-ide-2" && /Opdigtet idé 3/.test(tekst), "BRIEF_ID " + (typeof BRIEF_ID !== "undefined" ? BRIEF_ID : "?") + " · " + tekst.slice(0, 60));
        tjek(15, "Delelinket bliver færdig med at loade (tæppet løftet)", loeftet, loeftet ? "" : "indlæsningsbilledet står stadig: " + tepper.join(", "));
        tjek(11, "Delelinket lander på briefoversigten, ikke godkendelsen", !godk, godk ? "godkendelsessiden åbnede" : "");
      } catch (e) { tjek(11, "Delelink-tjekket kunne køre", false, e.message); }
    }
    if (FASE === "kode") {
      /* LØFTE 18 · NY ADGANGSKODE KAN ALDRIG SPRINGES OVER (Ida 10/10: »så kunne jeg bare lukke den pop up … så var jeg inde i mit admin«) */
      try {
        await V(800); var bx = document.getElementById("nyKodeBoks");
        var kryds = bx ? [].slice.call(bx.querySelectorAll("button, [onclick], a")).filter(function (b) { return /luk|log ud|annull|spring|senere|×/i.test((b.getAttribute("aria-label") || "") + " " + (b.textContent || "")); }).length : -1;
        if (bx) { document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); bx.dispatchEvent(new MouseEvent("click", { bubbles: true })); try { arkLuk(true); } catch (e) {} try { bsFlytLuk(); } catch (e) {} await V(500); }
        var staar = !!document.getElementById("nyKodeBoks");
        tjek(18, "»Vælg ny adgangskode« kommer igen efter genindlæsning", !!bx, bx ? "" : "arket kom ikke");
        tjek(18, "»Vælg ny adgangskode« kan ikke lukkes (kryds, Esc, klik udenfor)", !!bx && kryds === 0 && staar, "lukkeknapper " + kryds + " · står efter Esc/klik " + staar);
      } catch (e) { tjek(18, "Adgangskode-tjekket kunne køre", false, e.message); }
      /* KLAR TIL MAIL NR. 3: første valgte adgangskode noteres én gang */
      try {
        var nf = document.getElementById("nyKodeFelt"); if (nf) nf.value = "sele-kode-123";
        await gemNyAdgangskode(); await V(600); await adgangskodeValgtNoter(); await V(300);
        var av = ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar) || []).filter(function (x) { return x.skema === "adgangskode_valgt"; });
        tjek(1, "Første adgangskode noteres én gang (klar til mail nr. 3)", av.length === 1 && av[0].svar && av[0].svar.mail3_sendt === false, av.length + " række(r)");
      } catch (e) { tjek(1, "Mail 3-noten kunne køre", false, e.message); }
      localStorage.removeItem("energida_skal_ny_kode");
    }
  } catch (e) { r.fejl = e.message + " @ " + ((e.stack || "").split("\n")[1] || ""); }
  try { r.ls = {}; for (var li = 0; li < localStorage.length; li++) { var lk = localStorage.key(li); if (lk === "SELE_AFVIS") continue; r.ls[lk] = localStorage.getItem(lk); } } catch (e) {}   /* HELE lageret følger med (køen af ikke-sendte gem bor her) */
  console.log("@@" + JSON.stringify(r) + "@@");
})();
