/* SIKKERHEDSCHEFEN · LØFTE 32 · APPEN ÆNDRER ALDRIG KUNDENS DATA AF SIG SELV (fejlkataloget A4 — 7/10: datoer forsvandt hos Acorns og Hinges ved hver indlæsning).
   Basen sås med idéer (dato i går, sidste uge, i morgen, uden dato), en aftale og en opgave. Kunden åbner appen, går rundt på alle sider og
   genindlæser idéerne tre gange — UDEN at trykke på noget. Hver række skal være præcis som før. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ navn: n, ok: !!ok, detalje: String(d || "").slice(0, 300) }); }
  try {
    var foer = JSON.parse((await (await fetch("sele-db.json?t=" + Date.now())).json()).ls.SELE_DB);
    await V(7000);
    var sider = [function () { showTab(3); }, function () { showTab(8); }, function () { showTab(2); }, function () { showTab(31); }, function () { openMaal(); }, function () { indbakkenAaben(); }, function () { vaerktoejAaben(); }, function () { showTab(3); }];
    for (var i = 0; i < sider.length; i++) { try { sider[i](); } catch (e) {} await V(1500); }
    for (var j = 0; j < 3; j++) { try { await refreshIdeer(); } catch (e) {} await V(1500); }
    var efter = JSON.parse(localStorage.getItem("SELE_DB") || "{}");
    ["content_ideer", "kunde_aftaler", "kunde_opgaver"].forEach(function (t) {
      var a = foer[t] || [], b = efter[t] || [], aendret = [];
      a.forEach(function (x) {
        var y = b.filter(function (z) { return String(z.id) === String(x.id); })[0];
        if (!y) { aendret.push(x.id + " er SLETTET"); return; }
        Object.keys(x).forEach(function (k) { if (k === "updated_at") return; if (JSON.stringify(x[k]) !== JSON.stringify(y[k])) aendret.push(x.id + "." + k + ": " + JSON.stringify(x[k]) + " → " + JSON.stringify(y[k])); });
      });
      tjek(t + ": intet ændret eller slettet uden et tryk (" + a.length + " rækker)", !aendret.length, aendret.join(" · "));
    });
    var skriv = (window.__SELE_SKRIV || []).filter(function (s) { return /content_ideer|kunde_aftaler|kunde_opgaver/.test(s) && !/^insert|^select/.test(s); });
    tjek("Ingen skrivninger til kundens idéer, aftaler og opgaver uden et tryk", !skriv.length, skriv.join(", "));
  } catch (e) { r.fejl = String(e && e.message || e); }
  console.log("@@" + JSON.stringify(r) + "@@");
})();
