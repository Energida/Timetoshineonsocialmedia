/* v3470 · DIT FORLØB I FIRE RØDE FOLD-UD-BJÆLKER (Ida 24/11: »nej vi går med bud A« — bud A · Alle bjælker røde; opgaveflisen = bud 1, låst).
   Måler på kundens modulside (YOU GOT THIS med 11 moduler; Modul 0 gennemført, Modul 1 i gang, resten låst): fire røde bjælker (Introduktion · DEL 1 Energi · DEL 2 Strategi · DEL 3 Resultat) som knapper med aria-expanded, den del kunden er i åben fra start,
   en låst del kan foldes ud og ind, status er altid en cirkel på 28 px til VENSTRE i hver række (ingen lås i højre side), låste moduler er hvide med 1 px #DEDEDE uden skygge, kun det første låste modul viser datoen, og opgaveflisen er #F4F7FA med kant,
   uden skygge, rykket 24 ind, med versal »OPGAVE« og spørgsmålet på ÉN linje (aldrig »Lektion …«). Køres af koer.sh som kunde på 390 og 1440 med den huskende base og en opdigtet kursuskunde. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [], n = 0;
  var T = function (ok, d) { n++; if (!ok) fejl.push(d); };
  try {
    await V(4000); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    window.__TUR_SET = true; try { OB_SKEMA = true; } catch (e) {}
    var nrs = []; (KURSUS_MODULER || []).forEach(function (m) { var nr = modulNrFor(((m.lektioner || [])[0] || {}).id); if (nr != null && nrs.indexOf(nr) < 0) nrs.push(nr); });
    var fordel = ["", "energi", "energi", "energi", "energi", "strategi", "strategi", "strategi", "resultat", "resultat", "resultat"]; nrs.forEach(function (nr, i) { MODUL_INFO[String(nr)] = Object.assign({}, MODUL_INFO[String(nr)] || {}, { fase: fordel[i] || "" }); });
    T(nrs.length === 11, "prøvekunden har ikke 11 moduler (" + nrs.length + ")");
    try { var l1 = (KURSUS_LEKTIONER || []).find(function (x) { return x.id === "2-2"; }); if (l1) { l1.ovelse = [{ q: "x" }]; KURSUS_UDSAT["2-2"] = true; } } catch (e) {}
    showTab(12); await V(1500); try { window.__FTL3_AABEN = {}; document.getElementById("forloebTidslinje").innerHTML = forloebTidslinjeHtml(); } catch (e) { fejl.push("forløbet kunne ikke tegnes: " + e.message); } await V(800);
    var rod = document.getElementById("forloebTidslinje"), cs = function (e) { return getComputedStyle(e); };
    var bj = [].slice.call(rod.querySelectorAll(".ftl3-bj"));
    var navne = bj.map(function (b) { return (b.innerText || "").replace(/\s+/g, " ").trim().replace(/\d+ af \d+/, "").trim(); });
    T(navne.join("|").toLowerCase() === "introduktion|del 1 energi|del 2 strategi|del 3 resultat", "bjælkerne er ikke Introduktion · DEL 1 Energi · DEL 2 Strategi · DEL 3 Resultat: " + navne.join("|"));
    T(bj.every(function (b) { return b.tagName === "BUTTON" && b.hasAttribute("aria-expanded"); }), "en bjælke er ikke en knap med aria-expanded");
    T(bj.every(function (b) { var c = cs(b), q = b.getBoundingClientRect(); return c.backgroundColor === "rgb(252, 36, 4)" && c.color === "rgb(255, 255, 255)" && q.height >= 56 && parseFloat(c.borderTopLeftRadius) === 20 && c.fontSize === "20px" && c.boxShadow !== "none"; }), "bjælkerne er ikke røde (#FC2404) med hvid 20 px tekst, hjørner 20, skygge og mindst 56 høj");
    var aab = bj.map(function (b) { return b.getAttribute("aria-expanded") === "true"; });
    T(aab.join() === "false,true,false,false", "kun den del, kunden er i (Energi), er åben fra start: " + aab.join());
    var b3 = bj[2]; if (b3) { b3.click(); await V(300); var ind = document.getElementById(b3.getAttribute("aria-controls")); T(b3.getAttribute("aria-expanded") === "true" && ind && !ind.hidden && ind.querySelectorAll(".ftl2-rk.laast").length >= 1, "en låst del kan ikke foldes ud og vise sine låste moduler"); b3.click(); await V(200); T(b3.getAttribute("aria-expanded") === "false" && ind.hidden, "en udfoldet del kan ikke foldes ind igen"); }
    [].forEach.call(bj, function (b) { if (b.getAttribute("aria-expanded") !== "true") b.click(); }); await V(400);
    /* cirkler: 28 px, til venstre, i bjælker og rækker */
    var ck = [].slice.call(rod.querySelectorAll(".ftl3-ck, .ftl3-ind .ftl2-ck, .ftl3-opgck")).filter(function (e) { return e.getClientRects().length; });
    T(ck.length >= 12 && ck.every(function (e) { var q = e.getBoundingClientRect(); return Math.round(q.width) === 28 && Math.round(q.height) === 28; }), "statuscirklerne er ikke alle 28 px: " + ck.map(function (e) { var q = e.getBoundingClientRect(); return Math.round(q.width) + "x" + Math.round(q.height); }).filter(function (x) { return x !== "28x28"; }).join(","));
    T(ck.every(function (e) { var r = e.closest(".ftl3-bj, .ftl2-hoved, .ftl2-rk, .ftl3-opg"); if (!r) return true; var tx = [].slice.call(r.querySelectorAll(".ftl3-tit, .ftl2-n, .ftl3-opgv")).filter(function (t) { return t.getClientRects().length; })[0]; if (!tx) return true; return e.getBoundingClientRect().right <= tx.getBoundingClientRect().left + 1; }), "en statuscirkel står ikke til venstre for teksten");
    T(!rod.querySelector(".ftl3-bj .ftl-laas") && !rod.querySelector(".ftl3-bj .ftl3-tal ~ .ftl3-ck, .ftl3-bj .ftl3-pil ~ .ftl3-ck"), "der står en lås eller cirkel i højre side af en bjælke");
    var farver = [].slice.call(rod.querySelectorAll(".ftl3-ind .lks-tom.ftl2-ck, .ftl3-opgck")).filter(function (e) { return e.getClientRects().length && !e.closest(".klar"); });
    T(farver.length >= 2 && farver.every(function (e) { var c = cs(e); return c.borderTopColor === "rgb(252, 36, 4)" && parseFloat(c.borderTopWidth) === 1 && c.backgroundColor === "rgb(255, 255, 255)"; }), "en cirkel i gang er ikke tom med 1 px rød kant");
    /* låste moduler */
    var laast = [].slice.call(rod.querySelectorAll(".ftl3-ind .ftl2-rk.laast")).filter(function (e) { return e.getClientRects().length; });
    T(laast.length >= 7 && laast.every(function (e) { var c = cs(e); return c.backgroundColor === "rgb(255, 255, 255)" && parseFloat(c.borderTopWidth) === 1 && c.borderTopColor === "rgb(222, 222, 222)" && c.boxShadow === "none"; }), "de låste moduler er ikke hvide med 1 px #DEDEDE og ingen skygge (" + laast.length + ")");
    var datoer = laast.filter(function (e) { return /Åbner/.test(e.innerText || ""); });
    T(datoer.length === 1, "kun det første låste modul skal vise datoen — " + datoer.length + " viser den");
    /* opgaveflisen */
    var op = rod.querySelector(".ftl3-opg"); T(!!op, "opgaveflisen mangler under modulet");
    if (op) { var c = cs(op), q = op.getBoundingClientRect(), mq = op.parentElement.previousElementSibling ? op.parentElement.previousElementSibling.getBoundingClientRect() : null, t = op.querySelector(".ftl3-opgt"), v = op.querySelector(".ftl3-opgv");
      T(c.backgroundColor === "rgb(244, 247, 250)" && parseFloat(c.borderTopWidth) === 1 && c.borderTopColor === "rgb(222, 222, 222)" && c.boxShadow === "none", "opgaveflisen er ikke #F4F7FA med 1 px #DEDEDE og ingen skygge");
      T(mq && Math.round(q.left - mq.left) === 24, "opgaveflisen er ikke rykket 24 px ind under modulet: " + (mq ? Math.round(q.left - mq.left) : "?"));
      T(/^opgave$/i.test((v.textContent || "").trim()) && cs(v).textTransform === "uppercase" && cs(v).color === "rgb(104, 104, 104)" && cs(v).fontSize === "12px", "»OPGAVE« er ikke grå versal på 12 px");
      T(!/opgave\s*·?\s*lektion\s*\d/i.test(op.innerText || "") && Math.round(q.height) <= 64 && cs(t).whiteSpace === "nowrap" && cs(t).textOverflow === "ellipsis", "spørgsmålet står ikke på én linje med afkortning, eller flisen siger »Lektion N«: " + (op.innerText || "").replace(/\s+/g, " ")); }
    T(document.documentElement.scrollWidth <= innerWidth, "vandret rulning: " + document.documentElement.scrollWidth + "/" + innerWidth);
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE MODULSIDE FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE MODULSIDE FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE MODULSIDE OK " + innerWidth + ": " + n + " målinger — fire røde bjælker, den rigtige del åben, statuscirkler på 28 px til venstre, låste moduler hvide, kun den første viser datoen, og opgaveflisen i bud 1");
})();
