/* SIKKERHEDSCHEFEN · LØFTE 54 + 55 · SPØRGESKEMAET OG RUNDVISNINGEN (Ida 22/10: »har vi 100% styr på rundvisnignen også? og at svarene fra spørgeskemaet lander korrekt??«).
   SKRIV: hvert skema udfyldes med de rigtige knapper (tekst · valg · flervalg · skala) og sendes; ét sendes med en base, der afviser (skal ligge på enheden og sendes
   af sig selv bagefter); rundvisningen gås igennem trin for trin → GENINDLÆS SOM ANDEN ENHED → LÆS: alt står i basen, skemaet står som udfyldt, rundvisningen kommer ikke
   igen, og »Se rundvisningen igen« starter den. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  var r = { tjek: [] }; function tjek(l, n, ok, d) { r.tjek.push({ loefte: l, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 260) }); }
  var L = function () { console.log("@@" + JSON.stringify(r) + "@@"); };
  var fase = localStorage.getItem("ST_FASE") || "skriv";
  var raekker = function (skema) { return ((JSON.parse(localStorage.getItem("SELE_DB") || "{}").skema_svar) || []).filter(function (x) { return x.skema === skema && x.kode === currentKode; }); };
  var svarAlle = async function (key) {
    openSkema(key); await V(250); var def = SKEMAER[key], mangler = [];
    for (var i = 0; i < def.sp.length; i++) {
      var krop = document.getElementById("swKrop") || document;
      var v = krop.querySelector("[onclick*='skemaWizVaelg']"), m = krop.querySelector("[onclick*='skemaWizMulti']"), sk = krop.querySelector("#swSkala button, #swSkala [role=button], #swSkala .scale-btn"), f = krop.querySelector("#swFelt");
      if (v) v.click(); else if (m) m.click(); else if (sk) sk.click(); else if (f) { f.value = "ST svar " + key + " " + (i + 1); f.dispatchEvent(new Event("input", { bubbles: true })); }
      else mangler.push("spm " + (i + 1) + ": ingen knap/felt");
      await V(80);
      var n = Array.prototype.find.call(document.querySelectorAll("#skemaBack button"), function (b) { return /skemaWizGaa\(1\)/.test(b.getAttribute("onclick") || "") && b.getClientRects().length; });
      if (!n) { mangler.push("spm " + (i + 1) + ": ingen Næste/Send"); break; }
      n.click(); await V(i === def.sp.length - 1 ? 1800 : 120);   /* efter Send lukker skemaet sig selv efter 1,2 s — næste skema åbnes først bagefter */
    }
    return { mangler: mangler, n: def.sp.length };
  };
  try {
    await V(7000); try { dagensKortLuk(); } catch (e) {}
    if (fase === "skriv") {
      var autoTur = !!document.getElementById("turOverlay");   /* rundvisningen starter selv ved første login — og gås igennem PRÆCIS dér (på Hjem, ved første login) */
      tjek(55, "Rundvisningen starter af sig selv ved første login", autoTur, "");
      if (!autoTur) { turStart(true); await V(300); }
      /* RUNDVISNINGEN trin for trin */
      await V(100); var stops = (TUR_STOPS || []).length, udenMaal = [], tomme = [];
      for (var t = 0; t < stops; t++) {
        turVis(t); await V(200);
        var ov = document.getElementById("turOverlay"), h = ov ? ov.innerHTML : "", st = TUR_STOPS[t] || {};
        if (!ov || !String(ov.innerText || "").trim()) tomme.push("trin " + (t + 1));
        var peger = !!(st.s || st.k || st.m);
        if (peger && h.indexOf("tur-hul") < 0) udenMaal.push((t + 1) + (st.s ? " " + st.s + " [" + Array.prototype.map.call(document.querySelectorAll(st.s), function (e) { var b = e.getBoundingClientRect(); return (e.offsetParent ? "synlig " : "skjult ") + Math.round(b.top) + "/" + Math.round(b.height) + " i " + ((e.closest("[id]") || {}).id || "?") + (e.parentElement && e.parentElement.closest("[id]") ? "<" + e.parentElement.closest("[id]").parentElement.closest("[id]").id : ""); }).join(", ") + "]" : st.k ? " menu:" + st.k : ""));
      }
      tjek(55, "Rundvisningen har " + stops + " trin, hver med tekst", stops > 0 && !tomme.length, tomme.join(", ") || (stops ? "" : "ingen trin"));
      tjek(55, "Hvert trin peger på noget, der findes på skærmen", !udenMaal.length, udenMaal.length ? "uden mål: " + udenMaal.slice(0, 6).join(" · ") : "");
      turLuk(); await V(400);
      tjek(55, "Rundvisningen er markeret som set (telefon og konto)", turSet() && JSON.parse(localStorage.getItem("SELE_USER_META") || "{}").tur_set === true, "");

      var keys = Object.keys(SKEMAER), fejl54 = [], nAlle = 0;
      for (var ki = 0; ki < keys.length; ki++) {
        var key = keys[ki]; var u = await svarAlle(key); nAlle += u.n;
        var rk = raekker(key).pop(); var mangelSvar = [];
        for (var q = 1; q <= u.n; q++) { var sv = rk && rk.svar ? rk.svar["q" + q] : undefined; if ((sv === undefined || sv === "") && !(SKEMAER[key].sp[q - 1] || {}).frivillig) mangelSvar.push("q" + q); }
        if (u.mangler.length) fejl54.push(key + ": " + u.mangler.join(", "));
        else if (!rk) fejl54.push(key + ": ingen række i basen");
        else if (mangelSvar.length) fejl54.push(key + ": mangler " + mangelSvar.join(","));
        try { skemaWizLuk(); } catch (e) {}
      }
      tjek(54, "Alle " + keys.length + " spørgeskemaer (" + nAlle + " spørgsmål) lander i basen med hvert svar", !fejl54.length, fejl54.join(" · "));
      /* basen afviser: svarene skal ligge på enheden — og sendes af sig selv, når basen svarer igen */
      localStorage.setItem("SELE_AFVIS", "fejl");
      var foerAfv = raekker("inden_start").length; var u2 = await svarAlle("inden_start"); await V(300);
      var lokal = !!localStorage.getItem("skema_inden_start_" + currentKode);
      localStorage.removeItem("SELE_AFVIS"); try { skemaWizLuk(); } catch (e) {}
      await skemaGensend(); await V(300);
      var efterGen = raekker("inden_start").length;
      tjek(54, "Afvist Send ligger på enheden og sendes af sig selv bagefter", lokal && efterGen === foerAfv + 1 && !localStorage.getItem("skema_inden_start_" + currentKode), "på enheden: " + lokal + " · rækker " + foerAfv + " → " + efterGen);
      localStorage.setItem("ST_R", JSON.stringify(r)); localStorage.setItem("ST_FASE", "laes");
      Object.keys(localStorage).forEach(function (k) { if (/^skema_|tur_set|kladde|kursus_/i.test(k)) localStorage.removeItem(k); });   /* som en anden enhed: kun basen og kontoen følger med */
      await V(500); top.location.reload(); return;
    }
    r = JSON.parse(localStorage.getItem("ST_R") || '{"tjek":[]}');
    try { await refreshSkemaStatus(); } catch (e) {} await V(400);
    var stt = (document.getElementById("skemaStatus") || {}).textContent || "";
    tjek(54, "Skemaet står som udfyldt på en anden enhed", /Udfyldt/i.test(stt), "»" + stt + "«");
    var ovNu = !!document.getElementById("turOverlay");
    tjek(55, "Rundvisningen kommer ikke igen på en anden enhed", turSet() && !ovNu, "turSet " + turSet() + " · vises " + ovNu);
    turStart(true); await V(300);
    tjek(55, "»Se rundvisningen igen« starter den forfra", !!document.getElementById("turOverlay"), "");
    try { turLuk(); } catch (e) {}
  } catch (e) { r.fejl = String(e && e.message || e); }
  L();
})();
