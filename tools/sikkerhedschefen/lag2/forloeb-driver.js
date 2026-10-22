/* SIKKERHEDSCHEFEN · LØFTE 52 + 53 · KURSUSKUNDENS FORLØB (Ida 22/10: »et grundigt sikkerhedstjek hver dag for at det kunderne skriver ind at det bliver gemt … når de laver opgaver
   og at statistikkerne på forsiden også opdaterer sig i takt med at kunderne ser lektionerne«). Opdigtet kursuskunde (som TESTKUNDEA2026). To omgange i samme browser:
   SKRIV: alle lektioner med opgave udfyldes som kunden gør det (feltet → Næste → Færdig) + en lektion ses → GENINDLÆS → LÆS: alt står, og forsidens ring viser det samme tal. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  var r = { tjek: [] }; function tjek(l, n, ok, d) { r.tjek.push({ loefte: l, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 260) }); }
  var L = function () { console.log("@@" + JSON.stringify(r) + "@@"); };
  var fase = localStorage.getItem("FT_FASE") || "skriv";
  var dbRaekker = function (skema) { return ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar) || []).filter(function (x) { return x.skema === skema; }); };
  /* forsidens ring »Lektioner set« (huRinge) læses PÅ SKÆRMEN — »10 af 14« — og Forløbet-sidens tal (obFremdriftHtml) ved siden af */
  var ringTal = async function () { try { showTab(3); } catch (e) {} await V(900); var ring = [].filter.call(document.querySelectorAll("#screen3 .hu-ring"), function (e) { return e.getClientRects().length && /Lektioner set/i.test(e.innerText || ""); })[0]; var m = ring ? String(ring.innerText).replace(/\s+/g, " ").match(/(\d+)\s*af\s*(\d+)/) : null; var f = String(obFremdriftHtml(CURRENT_DEF) || "").match(/(\d+)\/(\d+)/); return { skaerm: m ? m[1] + "/" + m[2] : "", funktion: f ? f[1] + "/" + f[2] : "" }; };
  try {
    await V(7000); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    if (fase === "skriv") {
      var ovL = (KURSUS_LEKTIONER || []).filter(function (l) { return l.ovelse && l.ovelse.length; }), forv = {}, mangler = [], nSvar = 0;
      for (var oi = 0; oi < ovL.length; oi++) {
        var lk = ovL[oi]; try { closeIdeaWizard(); } catch (e) {}
        startOvelse(lk.id); await V(150); forv[lk.id] = {};
        for (var qi = 0; qi < lk.ovelse.length; qi++) {
          var q = lk.ovelse[qi], nk = ovNoegle(lk, qi);
          if (q && typeof q === "object" && q.type === "dage") { var db0 = document.querySelector("#ovelseDage [onclick*='ovelseDagToggle']"); if (db0) db0.click(); await V(50); forv[lk.id][nk] = OVELSE.svar[nk]; }
          else { var ta0 = document.getElementById("ovelseSvar"); if (!ta0) { mangler.push(lk.id + " spm " + (qi + 1) + ": intet felt"); break; } ta0.value = "FT svar " + lk.id + " nr " + (qi + 1); ovelseKladdeInput(ta0); forv[lk.id][nk] = ta0.value; }
          nSvar++; await ovelseNaeste(); await V(120);
        }
        await V(300);
        var rk0 = dbRaekker("lektion_svar_" + lk.id).pop();
        Object.keys(forv[lk.id]).forEach(function (k) { if (!rk0 || JSON.stringify((rk0.svar || {})[k]) !== JSON.stringify(forv[lk.id][k])) mangler.push(lk.id + " · " + k); });
      }
      try { closeIdeaWizard(); } catch (e) {}
      localStorage.setItem("FT_OV", JSON.stringify(forv));
      tjek(52, "Alle " + ovL.length + " opgaver (" + nSvar + " svar) er gemt i basen", ovL.length > 0 && !mangler.length, mangler.length ? "mangler: " + mangler.slice(0, 6).join(", ") : (ovL.length ? "" : "ingen lektioner med opgaver fundet"));
      var akt = (kursusLektionerAktive() || []), lSet = akt.filter(function (l) { return !KURSUS_SET[l.id] && !l.ovelse; })[0];
      var foer = await ringTal();
      if (lSet) { await lektionSet(lSet.id); await V(500); }
      var efter = await ringTal();
      var n0 = parseInt(foer.skaerm, 10), n1 = parseInt(efter.skaerm, 10), f0 = parseInt(foer.funktion, 10), f1 = parseInt(efter.funktion, 10);
      tjek(53, "Set lektion tæller op på forsiden med det samme", !!(lSet && efter.skaerm && n1 === n0 + 1 && f1 === f0 + 1), lSet ? "funktion " + foer.funktion + " → " + efter.funktion + " · skærm " + foer.skaerm + " → " + efter.skaerm : "ingen u-set lektion (" + akt.length + " aktive)");
      tjek(53, "Set lektion er gemt i basen", !!(lSet && dbRaekker("lektion_set_" + lSet.id).length), lSet ? "lektion_set_" + lSet.id : "");
      localStorage.setItem("FT_SET", JSON.stringify({ id: lSet && lSet.id, tal: efter.skaerm, f: efter.funktion }));
      /* SOM EN ANDEN ENHED: telefonens egne kopier (forløbet, kladder, usendte svar) slettes før genindlæsningen — så kan svarene og tallet KUN komme fra basen */
      Object.keys(localStorage).forEach(function (k) { if (/^kursus_|ovelse|^modul_set/i.test(k)) localStorage.removeItem(k); });
      localStorage.setItem("FT_R", JSON.stringify(r)); localStorage.setItem("FT_FASE", "laes");
      await V(800); top.location.reload(); return;
    }
    r = JSON.parse(localStorage.getItem("FT_R") || '{"tjek":[]}');
    var forv1 = JSON.parse(localStorage.getItem("FT_OV") || "{}"), mangl1 = [];
    Object.keys(forv1).forEach(function (lid) { Object.keys(forv1[lid]).forEach(function (k) { if (JSON.stringify((KURSUS_SVAR[lid] || {})[k]) !== JSON.stringify(forv1[lid][k])) mangl1.push(lid + " · " + k); }); });
    tjek(52, "Opgavesvarene står efter genindlæsning", Object.keys(forv1).length > 0 && !mangl1.length, mangl1.length ? "mangler: " + mangl1.slice(0, 6).join(", ") : "");
    var l1 = Object.keys(forv1)[0], lk1 = l1 && (KURSUS_LEKTIONER || []).find(function (x) { return x.id === l1; }), vist = "";
    if (lk1) { startOvelse(l1); await V(250); var ta1 = document.getElementById("ovelseSvar"); vist = ta1 ? ta1.value : "(intet felt)"; try { closeIdeaWizard(); } catch (e) {} }
    tjek(52, "Kunden ser sit svar, når opgaven åbnes igen", !!(lk1 && vist === forv1[l1][ovNoegle(lk1, 0)]), "viser »" + vist + "«");
    var s1 = JSON.parse(localStorage.getItem("FT_SET") || "{}"), nu1 = await ringTal();
    tjek(53, "Forsidens tal er det samme efter genindlæsning", !!(s1.tal && nu1.skaerm === s1.tal && nu1.funktion === s1.f && KURSUS_SET[s1.id]), "før skærm " + (s1.tal || "?") + " · nu skærm " + nu1.skaerm + " (Forløbet " + (s1.f || "?") + " → " + nu1.funktion + ")");
  } catch (e) { r.fejl = String(e && e.message || e); }
  L();
})();
