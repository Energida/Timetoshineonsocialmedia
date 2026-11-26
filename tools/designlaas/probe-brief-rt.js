/* BRIEFEN I RIGTIG TID (v3430, Idas fund 22/11): 1) med åben OG sammenklappet menu har Tilbage, bjælken og faktaboksen samme venstrekant, og »Tilføj« nederst i faktaboksen kan ses og flugter med dens fliser (25/11).
   2) Et trinskift (klik på trinnet, Næste, Skriv · Optag · Post) er ÉT skift: efter det første nye billede må intet ændre sig mere end 40 ms senere
      (før 3429: fire tilstande over 300 ms; før 3430: hjælpeflisen blev 4 px lavere efter ca. 300 ms). Køres af brief-rt.py gennem realtid.mjs. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var ud = [], fejl = 0;
  var F = function (t) { fejl++; ud.push("SELE BRIEFRT FEJL " + innerWidth + ": " + t); };
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    showTab(8); await V(2000);
    [].filter.call(document.querySelectorAll("#screen8 [onclick*='openBrief']"), function (e) { return e.getClientRects().length; })[0].click(); await V(3500);
    var syn = function (e) { return !!(e && e.getClientRects().length && getComputedStyle(e).visibility !== "hidden" && parseFloat(getComputedStyle(e).opacity) > 0.02); };
    var L = function (sel) { var e = [].filter.call(document.querySelectorAll(sel), syn)[0]; return e ? Math.round(e.getBoundingClientRect().left) : null; };
    for (var m = 0; m < 2; m++) {
      document.body.classList.toggle("nav-smal", m === 1); briefProcesGaa(0); await V(1500);
      var a = L(".mb-sti .navsti-tilbage"), b = L("#b3Kort"), c = L("#briefRail .fb-boks"), t = L("#briefRail .fb-pil-tilfoej"), navn = (m ? "sammenklappet" : "åben") + " menu";
      if (a === null || b === null || c === null) F(navn + ": Tilbage, bjælken eller faktaboksen ses ikke (" + a + " · " + b + " · " + c + ")");
      else if (Math.abs(a - b) > 1 || Math.abs(b - c) > 1) F(navn + ": venstrekanterne flugter ikke — Tilbage " + a + " · bjælken " + b + " · faktaboksen " + c);
      /* KNAPPER I RAMMEN (Ida 25/11, R5): »+ Tilføj« står nu nederst INDE i FAKTA-rammen og flugter med fliserne i den (før: under rammen, flugtende med rammens kant) */
      var r0 = L("#briefRail .fb-boks .fb-rk"), tk = [].filter.call(document.querySelectorAll("#briefRail .fb-pil-tilfoej"), syn)[0], ib = tk && tk.closest("#briefRail .fb-boks");
      if (t === null) F(navn + ": »Tilføj« i faktaboksen ses ikke"); else if (!ib) F(navn + ": »Tilføj« står uden for FAKTA-rammen"); else if (r0 === null || Math.abs(t - r0) > 1) F(navn + ": »Tilføj« " + t + " flugter ikke med fliserne i FAKTA-rammen " + r0);
      if (document.documentElement.scrollWidth > innerWidth + 1) F(navn + ": siden kan rulles sidelæns");
    }
    document.body.classList.remove("nav-smal"); briefProcesGaa(0); await V(1500);
    var snap = function () {
      var w = document.getElementById("briefWrap"), sider = {};
      [].forEach.call(w.querySelectorAll("[data-bside]"), function (e) { if (syn(e) && e.getBoundingClientRect().height > 20) sider[e.getAttribute("data-bside")] = 1; });
      var hj = document.querySelector("#briefHjaelp .soh-fl"), q = hj && syn(hj) ? hj.getBoundingClientRect() : null;
      var nu = (document.querySelector("#b3Trin .b3-tf.nu") || {}).innerText || "?", nav = document.getElementById("briefSideNav"), g = document.getElementById("briefGrid"), tip = document.getElementById("briefTipTlf");
      return "sider[" + Object.keys(sider).join(",") + "] trin»" + nu.trim() + "« hjælp[" + (q ? Math.round(q.left) + "," + Math.round(q.top) + "," + Math.round(q.height) + " " + getComputedStyle(hj).backgroundColor.replace(/\s/g, "") : "-") + "] tipIRammen" + (syn(tip) ? 1 : 0) + " knapper" + (nav && syn(nav) ? Math.round(nav.getBoundingClientRect().top) : "-") + " højde" + Math.round(g.getBoundingClientRect().height);
    };
    var film = async function (navn, fn) {
      var l = [], t0 = performance.now(), sidst = snap(), gaar = true;
      (function f() { if (!gaar) return; var s = snap(); if (s !== sidst) { l.push([Math.round(performance.now() - t0), s]); sidst = s; } requestAnimationFrame(f); })();
      fn(); await V(1500); gaar = false;
      if (!l.length) F(navn + ": intet skiftede");
      else if (l[l.length - 1][0] - l[0][0] > 40) F(navn + ": " + l.length + " skift i stedet for ét — " + l.map(function (x) { return x[0] + " ms " + x[1]; }).join(" ¦ "));
    };
    var trin = function (i) { return function () { document.querySelectorAll("#b3Trin .b3-tf")[i].click(); }; };
    await film("Idéen → Fang dem", trin(1));
    await film("Fang dem → Fasthold dem (Næste)", function () { [].filter.call(document.querySelectorAll("#briefSideNav button"), function (x) { return /Næste/.test(x.innerText); })[0].click(); });
    await film("Fasthold dem → Få dem til at handle", trin(3));
    await film("Få dem til at handle → Idéen", trin(0));
    await film("Skriv → Optag", function () { b3Vaelg("optag"); });
    await film("Optag → Post", function () { b3Vaelg("post"); });
    await film("Post → Skriv", function () { b3Vaelg("skriv"); });
  } catch (e) { F("proben fejlede: " + (e && e.message)); }
  ud.push(fejl ? "SELE BRIEFRT FEJL: " + fejl + " fund på " + innerWidth : "SELE BRIEFRT OK " + innerWidth + ": venstrekanterne flugter med åben og sammenklappet menu, og hvert trinskift er ét skift");
  console.log("@@" + ud.join("\n") + "@@");
})();
