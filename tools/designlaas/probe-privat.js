/* v3466 · PRIVATPERSON (Ida 24/11, Mia skrev »Ingen« i virksomhedsfeltet: »burde vi have en - jeg er her som privatperson« → »Ja, alle fire dele«).
   Profilguiden: (A) står privat allerede fra købet, er valget forvalgt, skærmen »Virksomhedens navn« springes over, og branche, afdelinger og ansatte er væk;
   (B) vælges »Jeg er her som privatperson« i skærmen »Virksomhedens navn«, bliver navnet personens eget, nævneren i »x af y« skifter ikke, og branche, afdelinger og ansatte springes over;
   (C) fortrydes valget, kommer skærmene og navnet tilbage; (D) gemmet skriver privat: true i kundens oplysninger (kun den ene nøgle) og kvitterer med præcis én række.
   Køres af koer.sh som kunde på 390 og 1440 med den huskende base. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [], n = 0;
  var T = function (ok, d) { n++; if (!ok) fejl.push(d); };
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {} await V(600);
    try { clearTimeout(window.__OPRET_VAGT); } catch (e) {}
    var tal = function () { var b = document.querySelector("#pfFlow .pf-bar1 b"); return b ? b.textContent.trim() : "?"; };
    var nev = function () { var m = (tal().match(/af (\d+)/) || [])[1]; return m || "?"; };
    var start = async function (privatFraKoeb) {
      try { localStorage.removeItem(pfKladdeNoegle()); } catch (e) {}
      localStorage.setItem("energida_skal_ny_kode", "invitation"); PF = null; var gl = document.getElementById("pfFlow"); if (gl) gl.remove();
      CURRENT_DEF = Object.assign({}, CURRENT_DEF || {}, privatFraKoeb ? { privat: true, virksomhed: "Mia Kirk Nørgaard" } : { privat: undefined, virksomhed: "" });
      await profilFlowStart(); await V(500);
      Object.assign(PF.f, { navn: "Mia", efternavn: "Kirk Nørgaard", dag: "12", mdr: "5", aar: "1990", ejer: "ja", rolle: "", pw: "hemmelig12" });
      if (!privatFraKoeb) { PF.f.butik_navn = ""; PF.butikKendt = false; }
      PF.pw = false; PF.pwGemt = false; PF.trin = 2; PF.sp = 0; pfTegn(); await V(400);
    };
    var skaerme = function () { return pfSkaerme(2).join(","); };
    /* A · privat fra købet */
    await start(true);
    T(PF.f.privat === true && skaerme() === "koeb", "A: privat fra købet er ikke forvalgt, eller skærmene er forkerte: " + skaerme() + " (privat " + PF.f.privat + ")");
    var nevA = nev();
    /* B · valget midt i guiden */
    await start(false);
    T(skaerme() === "butik,branche,koeb,afd,ansatte" && pfSkaerm() === "butik", "B: udgangspunktet er ikke den normale række: " + skaerme());
    var foerNev = nev(), chip = document.querySelector("#pfFlow .pf-privat .pf-chip");
    T(!!chip && /Jeg er her som privatperson/.test(chip.textContent) && !/on/.test(chip.className.replace(/pf-chip|mq-tap|\s/g, "")), "B: valget »Jeg er her som privatperson« står ikke under feltet");
    if (chip) { var q = chip.getBoundingClientRect(); var andre = document.querySelector("#pfFlow .pf-chip:not(.on)"); T(Math.round(q.height) >= 32 && Math.round(q.width) >= 120, "B: chippen er for lille: " + Math.round(q.width) + "x" + Math.round(q.height)); }
    chip.click(); await V(400);
    var felt = document.getElementById("pf_butik_navn") || document.querySelector('#pfFlow input[type="text"]');
    T(PF.f.privat === true && PF.f.butik_navn === "Mia Kirk Nørgaard" && /Dit navn/.test(document.querySelector("#pfFlow .pf-t").textContent), "B: navnet bliver ikke personens eget: »" + PF.f.butik_navn + "«");
    T(nev() === foerNev, "B: nævneren skifter ved valget: " + foerNev + " → " + nev());
    T(skaerme() === "butik,koeb", "B: branche, afdelinger og ansatte springes ikke over: " + skaerme());
    var sti = [tal()]; for (var i = 0; i < 4 && PF.trin === 2; i++) { if (pfSkaerm() === "koeb") PF.f.forretningstype = PF.f.forretningstype || "begge"; var u = pfSkaerm(); try { if (u === "butik") { PF.sp++; pfTegn(); } else break; } catch (e) { break; } await V(300); sti.push(tal() + " [" + pfSkaerm() + "]"); }
    T(pfSkaerm() === "koeb" && !/branche/.test(skaerme()), "B: efter navnet kommer »hvordan handler kunderne«, ikke branchen: " + pfSkaerm());
    /* C · fortryd */
    PF.sp = 0; pfTegn(); await V(300); document.querySelector("#pfFlow .pf-privat .pf-chip").click(); await V(400);
    T(PF.f.privat === false && PF.f.butik_navn === "" && skaerme() === "butik,branche,koeb,afd,ansatte", "C: fortrydelsen bringer ikke navnet og skærmene tilbage: privat " + PF.f.privat + " · navn »" + PF.f.butik_navn + "« · " + skaerme());
    T(!/^\s*$/.test(String(document.querySelector("#pfFlow .pf-t").textContent)) && /Virksomhedens navn/.test(document.querySelector("#pfFlow .pf-t").textContent), "C: overskriften hedder ikke »Virksomhedens navn« igen");
    T(document.documentElement.scrollWidth <= innerWidth, "vandret rulning: " + document.documentElement.scrollWidth + "/" + innerWidth);
    /* D · gemt */
    var kode = String(currentKode || "").toUpperCase() || "SPOEGELSE2026";
    var db0 = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); var fandtes = (db0.skema_svar || []).some(function (x) { return x.kode === kode && x.navn === "config" && x.skema === "kunde_def"; });
    if (!fandtes) await sb.from("skema_svar").insert({ kode: kode, navn: "config", skema: "kunde_def", svar: { virksomhed: "Mia Kirk Nørgaard", type: "kursus" } });
    var foerDef = JSON.stringify((JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar || []).filter(function (x) { return x.kode === kode && x.skema === "kunde_def"; }).map(function (x) { return x.svar; })[0] || {});
    await start(false); PF.f.privat = true; PF.f.butik_navn = "Mia Kirk Nørgaard"; PF.f.forretningstype = "begge";
    try { await pfButikGem(); } catch (e) { fejl.push("D: pfButikGem fejlede: " + e.message); }
    await V(300);
    var db = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); var rk = (db.skema_svar || []).filter(function (x) { return x.kode === kode && x.skema === "kunde_def"; });
    var efterDef = rk.length ? Object.assign({}, rk[0].svar) : {}; delete efterDef.privat;
    T(rk.length === 1 && rk[0].svar.privat === true && JSON.stringify(efterDef) === foerDef, "D: kundens oplysninger har ikke fået privat: true (og intet andet ændret): før " + foerDef + " · efter " + JSON.stringify(rk.map(function (x) { return x.svar; })));
    T(CURRENT_DEF && CURRENT_DEF.privat === true, "D: appen ved ikke, at kunden er privatperson efter gemmet");
    try { localStorage.removeItem("energida_skal_ny_kode"); localStorage.removeItem(pfKladdeNoegle()); } catch (e) {}
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE PRIVAT FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE PRIVAT FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE PRIVAT OK " + innerWidth + ": " + n + " målinger — privat forvalgt fra købet, valget midt i guiden gør navnet til personens og springer branche, afdelinger og ansatte over uden at nævneren skifter, fortryd virker, og privat: true gemmes i kundens oplysninger");
})();
