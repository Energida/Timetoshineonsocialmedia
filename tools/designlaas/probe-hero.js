/* HEROENS PLADS ER LAAST (HAARD, Ida 26/9: »låse hero i coverbilledet fast … uanset hvilke ændringer der kommer; må dette ikke påvirkes, røres«).
   Maaler paa hver side: titlens bund staar 40 px over coverets bund, og titlen staar 20 px (under 900) / 48 px (900+) fra coverets venstre kant.
   Koeres i kundeappen (vis=kunde) og i Backstage paa 390 og 1440. Skriver SELE HERO OK / SELE HERO FEJL <side> <maal>. */
(async function () {
  var v = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var kunde = typeof window.showTab === "function" && !document.body.classList.contains("dash-mode");
  for (var i = 0; i < 60 && kunde && !document.body.classList.contains("app-klar"); i++) await v(150);
  ["appLoader", "turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); }); try { dagensKortLuk(); } catch (e) {}
  var SIDER = kunde ? [
    ["hjem", function () { showTab(3); }], ["idebanken", function () { showTab(2); }], ["content", function () { showTab(8); }],
    ["performance", function () { openMaal(); }], ["indbakken", function () { indbakkenAaben(); }], ["gsd", function () { haengSideAabn(); }],
    ["vaerktoej", function () { vaerktoejAaben(); }], ["forloeb", function () { openForloeb(); }], ["profil", function () { minProfilAaben(); }],
    ["lektion", function () { showTab(12); visLektion(KURSUS_LEKTIONER[0].id); }]
  ] : ["overblik", "indbakke", "crm", "gsd", "energida", "klip", "opgbib", "vaner", "maskinrum"].map(function (s) { return [s, function () { visDashSide(s); }]; });
  var smal = window.innerWidth < 900, vForv = smal ? 20 : 48, fejl = [], n = 0;
  for (var s of SIDER) {
    try { s[1](); } catch (e) { continue; }
    await v(900); window.scrollTo(0, 0);
    var t = Array.prototype.find.call(document.querySelectorAll(".mb-navn,.hf-hero-tekst"), function (e) { var r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden" && (e.textContent || "").trim(); });
    if (!t) continue;
    var bd = t.closest(".mb-baand,.hf-hero") || t.parentElement; var br = bd.getBoundingClientRect(), tr = t.getBoundingClientRect();
    var bund = Math.round(br.bottom - tr.bottom), venstre = Math.round(tr.left - br.left); n++;
    if (Math.abs(bund - 40) > 1 || Math.abs(venstre - vForv) > 1) fejl.push(s[0] + " bund=" + bund + " venstre=" + venstre + " (skal 40/" + vForv + ")");
  }
  console.log(fejl.length ? "SELE HERO FEJL " + fejl.join(" · ") : (n ? "SELE HERO OK: " + n + " sider, titlen 40 px over coverets bund og " + vForv + " px fra venstre" : "SELE HERO FEJL: ingen hero fundet"));
})();
