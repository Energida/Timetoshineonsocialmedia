/* SIKKERHEDSCHEFEN · LØFTE 29 · CRM'ET VIRKER FOR IDA (Ida 11/10: »Hvilken kommando kan jeg sætte igang for at gennemtjekke ALT i mit crm virker optimalt for mig?« ·
   »kan vi ikke få den under sikkerhedstjek?«). Åbner hver slags kunde i Backstage og tjekker: Tilbage · fanen Adgang · fluebenene · Slet (kunder fra CRM'et) ·
   ingen testmarkører/ringe · et flueben gemmes på kundens egen række (den kunden læser) · Slet kalder kunde-admin FØR koden lukkes. Kun opdigtede kunder. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 29, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 220) }); }
  function doer(n) { return [].find.call(document.querySelectorAll("#bsKundeside .bs3-doer, #bsKundeside [role=button]"), function (b) { return (b.innerText || "").trim() === n && b.getClientRects().length; }); }
  async function tilDoer(n) { var b = doer(n); if (b) { b.click(); await V(1500); } return !!b; }
  var L = function () { console.log("@@" + JSON.stringify(r) + "@@"); }; var slut = setTimeout(L, 60000);
  try {
    await V(3000);
    var TYPER = { CRMYGT2026: { virksomhed: "Opdigtet YGT", type: "kursus", pakke: "detaildrift" }, CRMIGY2026: { virksomhed: "Opdigtet forløb", type: "forloeb", pakke: "igotyou" }, CRMCS2026: { virksomhed: "Opdigtet Content Studio", type: "contentplanner", pakke: "contentstudio" } };
    Object.keys(TYPER).forEach(function (k) { DYN_KODER[k] = Object.assign({}, TYPER[k]); VIRKSOMHEDSKODER[k] = Object.assign({}, TYPER[k]); });
    var kald = []; window.fetch = function (u, o) { kald.push(String(u).split("/functions/v1/")[1] + " " + (o && o.body || "")); return Promise.resolve({ ok: true, status: 200, json: function () { return Promise.resolve({ ok: true, slettet: 1 }); } }); };
    for (var k of Object.keys(TYPER)) {
      var navn = TYPER[k].virksomhed;
      await kundeSideVis(k); await V(1500);
      var tb = [].some.call(document.querySelectorAll(".cover-tilbage"), function (b) { return b.getClientRects().length; });
      tjek(navn + ": Tilbage findes", tb, "ingen synlig Tilbage i knaprækken");
      var side = document.getElementById("dashMain") || document.body; var txt = side.innerText || "";
      tjek(navn + ": ingen testmarkører eller status-ringe", !/AB-MARKØR|postet i ugen/.test(txt), (txt.match(/AB-MARKØR[^\n]*|postet i ugen/) || [""])[0]);
      tjek(navn + ": døren Indstillinger findes på kundesiden", await tilDoer("Indstillinger"), "ingen synlig dør »Indstillinger«");   /* bud 1 (19/10): kundekortet ligger bag dørene */
      var fane = [].find.call(document.querySelectorAll("button"), function (b) { return /^\s*Adgang\s*$/.test(b.innerText || "") && b.getClientRects().length; });
      tjek(navn + ": fanen Adgang findes", !!fane, "ingen synlig Adgang-fane");
      if (fane) { fane.click(); await V(700); }
      var boks = document.querySelectorAll('#kkFunkValg input[type="checkbox"]').length;
      tjek(navn + ": fluebenene under Adgang findes", boks >= 5, boks + " flueben");
      var slet = [].some.call(document.querySelectorAll("button"), function (b) { return /Slet kunden og koden/.test(b.innerText || "") && b.getClientRects().length; });
      tjek(navn + ": »Slet kunden og koden« findes", slet, "ingen synlig slet-knap");
      var pn = document.getElementById("ki_postnr"), by = document.getElementById("ki_by");
      if (pn && by) { by.value = ""; by.dataset.auto = ""; pn.value = "6950"; pn.dispatchEvent(new Event("input", { bubbles: true })); }
      tjek(navn + ": postnummer giver byen af sig selv", by && by.value === "Ringkøbing", by ? "by: " + by.value : "intet byfelt");
      var mail = document.getElementById("ki_mail");
      tjek(navn + ": mailfeltet spørger om login-mailen", mail && /kkLoginMailSpoerg/.test(mail.getAttribute("onchange") || ""), mail ? "onchange mangler" : "intet mailfelt");
    }
    /* et flueben klikket af → gemt på kundens egen række (den, kunden læser — v2748) */
    await kundeSideVis("CRMIGY2026"); await V(1200); await tilDoer("Indstillinger");
    var f2 = [].find.call(document.querySelectorAll("button"), function (b) { return /^\s*Adgang\s*$/.test(b.innerText || "") && b.getClientRects().length; }); if (f2) { f2.click(); await V(600); }
    var cb = document.querySelector('#kkFunkValg input[value="energi"]');
    if (cb) { cb.checked = false; await kkFunkGem(); await V(800); }
    var db = JSON.parse(localStorage.getItem("SELE_DB") || "{}");
    var row = (db.skema_svar || []).find(function (x) { return x.kode === "CRMIGY2026" && x.skema === "kunde_def"; });
    tjek("Et flueben klikket af gemmes på kundens egen række", row && Array.isArray(row.svar.funktioner) && row.svar.funktioner.indexOf("energi") < 0, row ? JSON.stringify(row.svar.funktioner) : "ingen kunde_def-række");
    /* KUNDESIDEN (Ida 19/10: »jeg fatter ikke en skid af alt det lort der står på mine kundesider i mit crm« + »alt det du finder skal tilføjes til sikkerhedskontrollen«).
       Fundet 19/10 ved kortlægningen: chips, der peger på id'er, der ikke findes · Næste aftale forlader kundesiden på telefonen · aftaleboksen ses ikke fra en anden fane ·
       Tilbage mangler mellem 761 og 899 px · contentmødet kan ikke sættes fra kundesiden. */
    var bred = window.innerWidth;
    var kc = "CRMCS2026", dag = new Date(Date.now() + 3 * 864e5), dIso = dag.getFullYear() + "-" + String(dag.getMonth() + 1).padStart(2, "0") + "-" + String(dag.getDate()).padStart(2, "0");
    try { CRM_AFTALER = (CRM_AFTALER || []).filter(function (a) { return a.kode !== kc; }).concat([{ id: "crm-test-aft", kode: kc, titel: "Opdigtet aftale", dato: dIso, tid: "10:00" }]); } catch (e) {}
    await kundeSideVis(kc); await V(1500);
    var doeChips = [].filter.call(document.querySelectorAll("#bsKundeside .ark-chip"), function (b) { var m = (b.getAttribute("onclick") || "").match(/bf3KkRul\('([^']+)'\)/); return m && !document.getElementById(m[1]); });
    tjek(bred + " px · kundesidens chips fører et sted hen", !doeChips.length, doeChips.map(function (b) { return (b.innerText || "").trim() + " → " + (b.getAttribute("onclick") || ""); }).join(" | "));
    var seK = [].find.call(document.querySelectorAll("#bsKundeside button"), function (b) { return /Se kundens version/.test(b.innerText || "") && b.getClientRects().length && /aabnKundensSide/.test(b.getAttribute("onclick") || ""); });
    tjek(bred + " px · »Se kundens version« står på kundesiden", !!seK, "ingen synlig knap til kundens studio (Ida 20/10)");
    var tbAlle = [].some.call(document.querySelectorAll(".cover-tilbage, .bs-tilbage"), function (b) { return b.getClientRects().length && /Tilbage/.test(b.innerText || b.getAttribute("aria-label") || ""); });
    tjek(bred + " px · kundesiden har en synlig Tilbage", tbAlle, "ingen synlig Tilbage på kundesiden");
    /* CONTENTMØDET HELE VEJEN (K5, Ida 19/10: »når det bygges skal der være en kæmpe kontrol for at det virker«): tryk »Sæt contentmødet« → arket → vælg dag → Gem → rækken ligger i kunde_aftaler på KUNDENS kode → mødet står på siden */
    var mk = [].find.call(document.querySelectorAll("#bsKundeside .ks-moede-knap"), function (b) { return b.getClientRects().length; });
    tjek(bred + " px · »Sæt contentmødet« står på kundesiden", !!mk, "ingen synlig knap");
    if (mk) {
      mk.click(); await V(900);
      var arkT = (document.querySelector(".ark .ark-t") || {}).innerText || "";
      tjek(bred + " px · contentmødets ark åbner", /contentmøde/i.test(arkT), "arkets titel: " + arkT);
      var dag2 = new Date(Date.now() + 5 * 864e5), d2 = dag2.getFullYear() + "-" + String(dag2.getMonth() + 1).padStart(2, "0") + "-" + String(dag2.getDate()).padStart(2, "0");
      var pd = document.getElementById("pmDato"); if (pd) pd.value = d2;
      var gem = [].find.call(document.querySelectorAll(".ark .ark-send-pille"), function (b) { return b.getClientRects().length; });
      if (gem) { gem.click(); await V(2500); }
      var dbm = JSON.parse(localStorage.getItem("SELE_DB") || "{}");
      var mr = (dbm.kunde_aftaler || []).find(function (x) { return x.kode === kc && /contentplanl/i.test(x.titel || "") && String(x.dato).slice(0, 10) === d2; });
      tjek(bred + " px · contentmødet gemmes på kundens kode", !!mr, "ingen række i kunde_aftaler for " + kc + " d. " + d2 + (gem ? "" : " (ingen Gem-knap)"));
      try { arkLuk(true); } catch (e) {}
      await V(600);
      var mf = document.querySelector("#bsKundeside .ks-moede");
      tjek(bred + " px · mødet står på kundesiden bagefter", !!(mf && !/Intet møde sat/.test(mf.innerText || "")), mf ? (mf.innerText || "").replace(/\s+/g, " ").slice(0, 80) : "ingen mødeflise");
    }
    if (bred >= 900 && await tilDoer("Indstillinger")) {   /* står man på en anden fane, skal Aftaler stadig vise aftalen — tilbage til forsiden via Tilbage, som Ida gør */
      var tbk = [].find.call(document.querySelectorAll("#bsKundeside .bs-tilbage"), function (b) { return true; }); if (tbk) { tbk.click(); await V(1200); }
    }
    var aftRk = doer("Aftaler") || [].find.call(document.querySelectorAll("#bsKundeside [onclick*='kundeAftalerAabn']"), function (b) { return b.getClientRects().length; });
    if (aftRk) {
      try { CRM_AFTALER = (CRM_AFTALER || []).filter(function (a) { return a.id !== "crm-test-aft"; }).concat([{ id: "crm-test-aft", kode: kc, titel: "Opdigtet aftale", dato: dIso, tid: "10:00" }]); } catch (e) {}   /* contentmødet ovenfor hentede aftalerne forfra fra selen */
      aftRk.click(); await V(1500);
      var ks = document.getElementById("bsKundeside"), aboks = document.getElementById("kkAftaleBoks");
      tjek(bred + " px · Aftaler bliver på kundesiden", !!(ks && ks.getClientRects().length), "kundesiden forsvandt — man landede et andet sted");
      tjek(bred + " px · Aftaler viser aftalen", !!(aboks && aboks.getClientRects().length && /Opdigtet aftale|contentplanl/i.test(aboks.innerText || "")), aboks ? (aboks.getClientRects().length ? "aftaleboksen står uden aftalen: " + (aboks.innerText || "").replace(/\s+/g, " ").slice(0, 90) : "aftaleboksen er skjult") : "ingen aftaleboks");
      /* INGEN RØDE RAMMER I KUNDEKORTET (Ida 20/10, billede af den røde ramme om rettelsen af en aftale · DESIGNLÅS: ingen røde rammer) — rettes aftalen, og står en aftale i dag, er kanten grå */
      try {
        var iDagI = new Date(); var iDagS = iDagI.getFullYear() + "-" + String(iDagI.getMonth() + 1).padStart(2, "0") + "-" + String(iDagI.getDate()).padStart(2, "0");
        CRM_AFTALER = (CRM_AFTALER || []).filter(function (a) { return a.kode !== kc; }).concat([{ id: "crm-test-idag", kode: kc, titel: "Opdigtet aftale i dag", dato: iDagS, tid: "23:58" }, { id: "crm-test-aft", kode: kc, titel: "Opdigtet aftale", dato: dIso, tid: "10:00" }]);
        CRM_AFT_RET = "crm-test-aft"; var bxR = document.getElementById("kkAftaleBoks"); if (bxR) bxR.innerHTML = kkAftaleSektion(kc);
        var roede = bxR ? [].filter.call(bxR.querySelectorAll("div"), function (e) { var st = getComputedStyle(e); return parseFloat(st.borderTopWidth) > 0 && /^rgb\((2[2-5]\d), ?(\d{1,2}), ?(\d{1,2})\)/.test(st.borderTopColor) && parseFloat(st.borderRadius) < 50; }).length : -1;
        tjek(bred + " px · ingen røde rammer om aftalerne (ret + i dag)", roede === 0, roede < 0 ? "ingen aftaleboks" : roede + " røde rammer");
        CRM_AFT_RET = null;
      } catch (e) { tjek(bred + " px · røde rammer kunne måles", false, e.message); }
    } else tjek(bred + " px · Aftaler findes på kundesiden", false, "ingen synlig dør eller række til aftalerne (aftale lagt " + dIso + ")");
    /* slet: kunde-admin (slet logins) kaldes, og kunden er væk */
    window.arkOk = function () { return true; };
    await kkSletKunde("CRMCS2026"); await V(600);
    tjek("Slet kunden sletter også logins (kunde-admin kaldt)", kald.some(function (x) { return /kunde-admin/.test(x) && /slet_logins/.test(x) && /CRMCS2026/.test(x); }), kald.join(" | "));
    tjek("Slet kunden fjerner kunden fra CRM'et", !VIRKSOMHEDSKODER.CRMCS2026 && !DYN_KODER.CRMCS2026, "");
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
