/* v3463 · EN AFTALE PÅ HJEM ÅBNER AFTALEN, IKKE KUNDENS CRM-SIDE (Ida 24/11: »når jeg klikker på personalebriefen for at skrive noter kommer jeg ikke til aftalen men ind på mit crm?«).
   Backstage › Hjem: et klik på en kommende aftale (og en aftale i »I dag«) åbner aftalens eget ark med feltet Referat — også en aftale uden tid (»Personale briefing«) — og et contentmøde åbner kundens side med markøren i »Noter til næste møde« (mødets noter).
   Luk fører tilbage til Hjem, aldrig til kundens CRM-side. Køres af koer.sh som Backstage på 390 og 1440. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [], n = 0;
  var T = function (ok, d) { n++; if (!ok) fejl.push(d); };
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} await V(600);
    VIRKSOMHEDSKODER.HINGES2026 = VIRKSOMHEDSKODER.HINGES2026 || { virksomhed: "Hinges Hus", type: "kursus", aktiv: true };
    VIRKSOMHEDSKODER.ACORNS2026 = VIRKSOMHEDSKODER.ACORNS2026 || { virksomhed: "ACORNS.dk", type: "contentplanner", aktiv: true };
    var dag = function (p) { var x = new Date(); x.setDate(x.getDate() + p); return x.toLocaleDateString("sv-SE"); };
    await sb.from("kunde_aftaler").insert([
      { id: "af-brief", kode: "HINGES2026", titel: "Personale briefing Social Media", dato: dag(3), tid: null, type: "aftale", note: "" },
      { id: "af-moede", kode: "ACORNS2026", titel: "Ugentlig contentplanlægning", dato: dag(1), tid: "10:00", tid_slut: "11:00", type: "moede" },
      { id: "af-idag", kode: "HINGES2026", titel: "Opfølgning i dag", dato: dag(0), tid: "23:00", tid_slut: "23:30", type: "aftale", note: "" }]);
    await refreshKundeAftaler(); try { renderHome(); } catch (e) {} try { await dashForsideTegn(); } catch (e) {} await V(1500);
    var rkP = function (tekst) { return [].filter.call(document.querySelectorAll("#bsForside .bs3-fl.bs3-klik"), function (e) { return (e.innerText || "").indexOf(tekst) > -1; })[0]; };
    var paaHjem = function () { return !!document.getElementById("bsForside") && !!document.querySelector("#bsForside .bs-hjem-c"); };
    var kundeSide = function () { return !!document.querySelector(".ks2, #bsKundeSide .ks2-blok"); };
    var luk = async function () { try { arkLuk(); } catch (e) {} try { aftalePopLuk(); } catch (e) {} try { document.querySelectorAll("#modalBack .ark-luk, .ark-luk").forEach(function (b) { b.click(); }); } catch (e) {} await V(700); };
    /* 1 · Personale briefing (uden tid) */
    var r = rkP("Personale briefing");
    T(!!r, "»Personale briefing« står ikke i Kommende aftaler på Hjem");
    if (r) {
      r.click(); await V(1500);
      var note = document.getElementById("ar_note");
      T(!!note, "et klik på »Personale briefing« åbner ikke aftalen med feltet Referat (kom: " + (kundeSide() ? "kundens CRM-side" : "intet ark") + ")");
      T(!kundeSide(), "et klik på aftalen åbnede kundens CRM-side");
      T(!!(document.getElementById("ar_titel") && /Personale briefing/.test(document.getElementById("ar_titel").value)), "arket viser ikke aftalens titel");
      await luk();
      T(!document.getElementById("ar_note"), "arket kunne ikke lukkes");
      T(paaHjem() && !kundeSide(), "Luk fører ikke tilbage til Hjem");
    }
    /* 2 · en aftale i »I dag« */
    var rd = rkP("Opfølgning i dag") || [].filter.call(document.querySelectorAll("#bsForside .bs3-roed"), function (e) { return /Opfølgning i dag/.test(e.innerText || ""); })[0];
    if (rd) { rd.click(); await V(1500); T(!!document.getElementById("ar_note") && !kundeSide(), "en aftale i »I dag« åbner ikke aftalen"); await luk(); T(paaHjem(), "Luk fører ikke tilbage til Hjem efter »I dag«"); }
    /* 3 · et contentmøde: kundens side med markøren i »Noter til næste møde« (mødets noter) — ikke tid-arket */
    var rm = rkP("Ugentlig contentplanlægning");
    T(!!rm, "contentmødet står ikke i Kommende aftaler");
    if (rm) { rm.click(); await V(3500); var nf = document.getElementById("ksNoter"); T(!!nf && document.activeElement === nf, "et klik på contentmødet stiller ikke markøren i »Noter til næste møde« (felt: " + (!!nf) + ", markør: " + (nf && document.activeElement === nf) + ")"); T(!document.getElementById("ar_note"), "contentmødet åbnede aftalearket i stedet for noterne"); }
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE AFTALE FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE AFTALE FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE AFTALE OK " + innerWidth + ": " + n + " målinger — en aftale på Hjem åbner aftalen med Referat (også uden tid), contentmødet noterne på kundens side, og Luk fører tilbage til Hjem");
})();
