/* SIKKERHEDSCHEFEN · LØFTE 29 · CRM'ET VIRKER FOR IDA (Ida 11/10: »Hvilken kommando kan jeg sætte igang for at gennemtjekke ALT i mit crm virker optimalt for mig?« ·
   »kan vi ikke få den under sikkerhedstjek?«). Åbner hver slags kunde i Backstage og tjekker: Tilbage · fanen Adgang · fluebenene · Slet (kunder fra CRM'et) ·
   ingen testmarkører/ringe · et flueben gemmes på kundens egen række (den kunden læser) · Slet kalder kunde-admin FØR koden lukkes. Kun opdigtede kunder. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 29, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 220) }); }
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
    await kundeSideVis("CRMIGY2026"); await V(1200);
    var f2 = [].find.call(document.querySelectorAll("button"), function (b) { return /^\s*Adgang\s*$/.test(b.innerText || "") && b.getClientRects().length; }); if (f2) { f2.click(); await V(600); }
    var cb = document.querySelector('#kkFunkValg input[value="energi"]');
    if (cb) { cb.checked = false; await kkFunkGem(); await V(800); }
    var db = JSON.parse(localStorage.getItem("SELE_DB") || "{}");
    var row = (db.skema_svar || []).find(function (x) { return x.kode === "CRMIGY2026" && x.skema === "kunde_def"; });
    tjek("Et flueben klikket af gemmes på kundens egen række", row && Array.isArray(row.svar.funktioner) && row.svar.funktioner.indexOf("energi") < 0, row ? JSON.stringify(row.svar.funktioner) : "ingen kunde_def-række");
    /* slet: kunde-admin (slet logins) kaldes, og kunden er væk */
    window.arkOk = function () { return true; };
    await kkSletKunde("CRMCS2026"); await V(600);
    tjek("Slet kunden sletter også logins (kunde-admin kaldt)", kald.some(function (x) { return /kunde-admin/.test(x) && /slet_logins/.test(x) && /CRMCS2026/.test(x); }), kald.join(" | "));
    tjek("Slet kunden fjerner kunden fra CRM'et", !VIRKSOMHEDSKODER.CRMCS2026 && !DYN_KODER.CRMCS2026, "");
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
