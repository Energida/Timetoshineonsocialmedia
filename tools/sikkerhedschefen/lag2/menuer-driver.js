/* SIKKERHEDSCHEFEN · LØFTE 40 · TELEFON OG COMPUTER HAR SAMME MENU (fejlkataloget C46 — 1/10: telefonen viste låste døre, computeren ikke).
   Computerens sidemenu og telefonens menu (burgeren) sammenlignes på HVOR punkterne fører hen: samme sted skal findes begge steder og hedde det samme.
   Undermenuerne på computeren (Planlægning, Værktøjskassen) når telefonen via selve siden — de tæller som deres overpunkt.
   Profil og Log ud står kun i telefonens menu (computeren har dem i bunden). Kun opdigtede data i selen. */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ navn: n, ok: !!ok, detalje: String(d || "").slice(0, 400) }); }
  function vis(e) { return e.getClientRects().length && getComputedStyle(e).visibility !== "hidden"; }
  function maal(oc) { oc = String(oc || "").replace(/toggleBurger\(\);?\s*/g, "").trim(); var m = oc.match(/snGruppeKlik\((\d+)/); if (m) return "showTab(" + m[1] + ")"; m = oc.match(/^([A-Za-z_$][\w$]*\([^)]*\))/); return m ? m[1] : oc; }
  try {
    await V(6000);
    ["turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    var under = {}; [].forEach.call(document.querySelectorAll("#sideNav [id^='sn'][id$='Under'] .sn-item"), function (b) { under[maal(b.getAttribute("onclick"))] = 1; });
    var pc = {}; [].forEach.call(document.querySelectorAll("#sideNav .sn-item"), function (b) { var m = maal(b.getAttribute("onclick")); if (!m || under[m]) return; pc[m] = { t: (b.querySelector(".sn-tekst") || b).textContent.trim().replace(/\d+$/, ""), laast: b.classList.contains("sn-laast") }; });
    try { toggleBurger(); } catch (e) {} await V(800);
    var tlf = {}; [].filter.call(document.querySelectorAll("#burgerMenu button, #burgerMenu [onclick]"), vis).forEach(function (b) { var m = maal(b.getAttribute("onclick")); if (!m || /^(toggleBurger|custLogout|minProfilAaben)/.test(m)) return; tlf[m] = { t: b.textContent.trim().replace(/\s+/g, " ").replace(/\s*\d+$/, ""), laast: /laast|lock/.test(b.className) }; });
    /* bundmenuen på telefonen tæller med for navnene (Hans 11/10: »Kalenderen« / »Content kalenderen«) */
    try { toggleBurger(); } catch (e) {}
    var kunPc = Object.keys(pc).filter(function (m) { return !tlf[m]; }).map(function (m) { return pc[m].t; });
    var kunTlf = Object.keys(tlf).filter(function (m) { return !pc[m]; }).map(function (m) { return tlf[m].t; });
    var navne = [];
    function bundMaal(b) { var oc = b.getAttribute("onclick") || "", m = oc.match(/NAV_ITEMS\[(\d+)\]/); if (!m || typeof NAV_ITEMS === "undefined" || !NAV_ITEMS[+m[1]]) return maal(oc); var f = String(NAV_ITEMS[+m[1]].f); var k = f.match(/showTab\(\d+\)|[A-Za-z_$][\w$]*Aaben\(\)|openMaal\(\)/); return k ? k[0] : ""; }
    [].filter.call(document.querySelectorAll(".bottom-nav button, #bottomNav button"), vis).forEach(function (b) { var m = bundMaal(b), t = b.textContent.trim(); if (pc[m] && t && pc[m].t.toLowerCase() !== t.toLowerCase()) navne.push("computer »" + pc[m].t + "« / bundmenu »" + t + "«"); });
    navne = navne.concat(Object.keys(pc).filter(function (m) { return tlf[m] && pc[m].t.toLowerCase() !== tlf[m].t.toLowerCase(); }).map(function (m) { return "computer »" + pc[m].t + "« / telefon »" + tlf[m].t + "«"; }));
    var laase = Object.keys(pc).filter(function (m) { return tlf[m] && pc[m].laast !== tlf[m].laast; }).map(function (m) { return pc[m].t; });
    tjek("Samme steder i menuen på telefon og computer", !kunPc.length && !kunTlf.length, (kunPc.length ? "kun på computeren: " + kunPc.join(", ") : "") + (kunTlf.length ? (kunPc.length ? " · " : "") + "kun på telefonen: " + kunTlf.join(", ") : ""));
    tjek("Samme navn på telefon og computer", !navne.length, navne.join(" · "));
    tjek("Samme låse på telefon og computer", !laase.length, laase.join(", "));
  } catch (e) { r.fejl = String(e && e.message || e); }
  console.log("@@" + JSON.stringify(r) + "@@");
})();
