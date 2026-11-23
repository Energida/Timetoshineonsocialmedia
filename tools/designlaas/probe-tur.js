/* v3450 · RUNDVISNINGEN HAR ÉN FLISE, ÉN STØRRELSE OG EN VEJ UD (Ida 23/11: »man kan på ingen måde afslutte rundvisningen!« · »så bliver den røde flise større??? og når man klikker mellem rundvisningen, ser man den mørkerøde boks under???? alt det her hak skal væk!!!«).
   1) Flisens boks (plads, bredde, højde) er den samme på velkomsten og alle trin. 2) Der er aldrig mere end én synlig flise, og intet trin er klippet. 3) Fra trin 1 afslutter ét klik på »Spring over« rundvisningen: laget er væk, flisen er væk, og mærket er sat.
   4) Knappen »Spring over« rammes af et tryk. Køres af koer.sh som kunde på 390 og 1440; kunden gøres til YOU GOT THIS-kunde i proben (ygtHold), ingen data ændres (mærket nulstilles bagefter). */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [], n = 0;
  var synlige = function () { return [].filter.call(document.querySelectorAll(".tfl"), function (e) { var q = e.getBoundingClientRect(), c = getComputedStyle(e); return q.height > 0 && c.visibility !== "hidden" && c.display !== "none"; }); };
  var boks = function (e) { var q = e.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top + scrollY), Math.round(q.width), Math.round(q.height)].join(","); };
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    var glYgt = window.ygtHold, glSet = window.__TUR_SET, glLs = null; try { glLs = localStorage.getItem(nsKey("tur_set")); } catch (e) {}
    var glUpd = sb.auth.updateUser; sb.auth.updateUser = function () { return Promise.resolve({ data: {}, error: null }); };
    window.ygtHold = function () { return true; }; window.__TUR_SET = false; try { localStorage.removeItem(nsKey("tur_set")); } catch (e) {}
    TUR_FL_FORCE = true; TUR_FL_I = 0; window.__TUR_FL_BOKS = null; showTab(3); await V(900); turStartKortTegn(); await V(500);
    var v = synlige(); if (v.length !== 1) fejl.push("velkomsten: " + v.length + " synlige fliser (skal 1)"); else {
      var b0 = boks(v[0]), S = turFlStops();
      for (var i = 1; i < S.length; i++) { turFl(i); await V(120); var l = synlige(); n++;
        if (l.length !== 1) { fejl.push("trin " + i + ": " + l.length + " synlige fliser straks efter klikket (skal 1)"); continue; }
        var e = l[0]; if (boks(e) !== b0) fejl.push("trin " + i + " »" + (S[i].t || "") + "«: boks " + boks(e) + " (velkomsten " + b0 + ")");
        if (e.scrollHeight > e.clientHeight + 1) fejl.push("trin " + i + " »" + (S[i].t || "") + "« er klippet (" + e.scrollHeight + " > " + e.clientHeight + ")");
        await V(500); if (synlige().length !== 1) fejl.push("trin " + i + ": " + synlige().length + " synlige fliser efter 0,6 s"); }
      turFl(1); await V(700); var sp = [].filter.call(document.querySelectorAll(".tfl-spring"), function (x) { var c = getComputedStyle(x); return x.getBoundingClientRect().height > 0 && c.visibility !== "hidden" && !x.closest("[style*='visibility: hidden']") && (x.closest("#turFlOverlay") || !document.getElementById("turFlOverlay")); })[0];
      if (!sp) fejl.push("trin 1 har ingen »Spring over«"); else { var q = sp.getBoundingClientRect(), p = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); if (p !== sp) fejl.push("»Spring over« er dækket af " + (p ? p.tagName.toLowerCase() + "." + String(p.className).slice(0, 30) : "intet"));
        sp.click(); await V(500); n++;
        if (document.getElementById("turFlOverlay")) fejl.push("det mørke lag står stadig efter »Spring over«"); if (synlige().length) fejl.push("rundvisningens flise står stadig efter »Spring over«"); if (!turSet()) fejl.push("rundvisningen er ikke mærket som set efter »Spring over«"); if (document.body.classList.contains("tur-lag")) fejl.push("klassen tur-lag hænger efter »Spring over«"); }
    }
    window.ygtHold = glYgt; window.__TUR_SET = glSet; try { if (glLs == null) localStorage.removeItem(nsKey("tur_set")); else localStorage.setItem(nsKey("tur_set"), glLs); } catch (e) {} sb.auth.updateUser = glUpd; TUR_FL_FORCE = false; try { turStartKortTegn(); } catch (e) {}
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE TUR FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE TUR FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE TUR OK " + innerWidth + ": rundvisningens flise har samme boks på velkomsten og " + (n - 1) + " trin, højst én flise ses, og »Spring over« afslutter med ét klik");
})();
