/* v3467 · DE LANGE VALG I »NYT OPSLAG« STÅR 12 FRA HINANDEN (Ida 24/11: »Ja, 12 som knapperne« — undtagelsen fra 12-låsen er fjernet).
   Formatvalget i »Nyt opslag« (Reel · Kort reel · Karrusel …) er stablede valg, én under hinanden: afstanden er 12 px på computer og telefon. Køres af koer.sh som kunde på 390 og 1440. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [], n = 0;
  var T = function (ok, d) { n++; if (!ok) fejl.push(d); };
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {} await V(600);
    try { opretOpslag(); } catch (e) { fejl.push("opretOpslag fejlede: " + e.message); } await V(1500);
    var ch = [].filter.call(document.querySelectorAll("#bsFlytMenu .sa-chips .ark-chip.sa-lang"), function (e) { var q = e.getBoundingClientRect(); return q.width > 0 && q.height > 0; });
    T(ch.length >= 3, "fandt ikke de lange valg i »Nyt opslag« (" + ch.length + ")");
    for (var i = 1; i < ch.length; i++) { var a = ch[i - 1].getBoundingClientRect(), b = ch[i].getBoundingClientRect(); var g = Math.round((b.top - a.bottom) * 10) / 10; T(Math.abs(g - 12) <= 0.5, "»" + (ch[i - 1].innerText || "").trim().split("\n")[0].slice(0, 24) + "« → »" + (ch[i].innerText || "").trim().split("\n")[0].slice(0, 24) + "« står " + g + " px fra hinanden (skal 12)"); }
    T(document.documentElement.scrollWidth <= innerWidth, "vandret rulning: " + document.documentElement.scrollWidth + "/" + innerWidth);
    try { bsFlytLuk(); } catch (e) {}
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE CHIPS FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE CHIPS FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE CHIPS OK " + innerWidth + ": " + n + " målinger — de lange valg i »Nyt opslag« står 12 px fra hinanden");
})();
