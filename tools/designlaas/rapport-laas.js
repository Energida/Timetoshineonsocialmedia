/* RAPPORT: LÅSENS FORMER PÅ HVER b2b-SIDE (fase 1, Ida 17/11 »Ja, start fase 1«).
   probe-laas.js (LAAS_KOER) blev aldrig kørt af koer.sh. Nu køres den på 390 og 1440 og skriver sine fund som
   »SELE RAPPORT LAAS …«. Det er en RAPPORT — den stopper ikke porten. Fundene gennemgås i planens fase 2, hvor de
   regler, der holder, bliver til en måling, der kan stoppe en udrulning. koer.sh lægger probe-laas.js foran denne fil. */
setTimeout(async function () {
  var vent = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  try {
    for (var v = 0; v < 40 && !document.body.classList.contains("app-klar"); v++) await vent(150);
    ["appLoader", "turOverlay", "dagensKort", "nyVersion"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    try { turLuk(); window.turStart = function () {}; } catch (e) {}
    var SIDER = [
      ["hjem", function () { showTab(3); }],
      ["idebanken", function () { showTab(2); }],
      ["kalenderen", function () { showTab(8); }],
      ["performance", function () { openMaal(); }],
      ["indbakken", function () { indbakkenAaben(); }],
      ["vaerktoejskassen", function () { vaerktoejAaben(); }],
      ["drejebogen", function () { drejebogAaben(); }],
      ["maalsaetninger", function () { tilpasAaben("maal"); }],
      ["forloebsoversigt", function () { openForloeb(); }],
      ["profil", function () { minProfilAaben(); }],
      ["moedesiden", function () { try { planRitLuk(); } catch (e) {} moedeSideAaben(); }],
      ["moedeforloebet", function () { planRitStart(); }]
    ];
    if (typeof window.LAAS_KOER !== "function") { console.log("SELE RAPPORT LAAS: probe-laas.js blev ikke indlæst"); return; }
    var UD = await window.LAAS_KOER(SIDER);
    var linjer = [];
    Object.keys(UD.sum).forEach(function (gr) { Object.keys(UD.sum[gr]).forEach(function (k) { var o = UD.sum[gr][k]; linjer.push({ gr: gr, k: k, n: o.n, sider: o.sider }); }); });
    linjer.sort(function (a, b) { return b.n - a.n; });
    Object.keys(UD.sider).forEach(function (s) { if (typeof UD.sider[s] === "string") console.log("SELE RAPPORT LAAS " + s + ": " + UD.sider[s]); });
    linjer.slice(0, 15).forEach(function (l) { console.log("SELE RAPPORT LAAS " + l.gr + " · " + String(l.k).slice(0, 90) + " · " + l.n + " steder · " + l.sider.join(", ")); });
    console.log("SELE RAPPORT LAAS SUM " + linjer.reduce(function (s, l) { return s + l.n; }, 0) + " afvigelser i " + linjer.length + " slags paa " + innerWidth);
  } catch (e) { console.log("SELE RAPPORT LAAS probe: " + (e && e.message)); }
}, 400);
