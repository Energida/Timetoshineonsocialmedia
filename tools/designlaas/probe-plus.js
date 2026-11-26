/* ÉT PLUS (Ida 18/11: »Se lige det røde plus? … ALT nærmest bliver bygget forskelligt« → klik »Ja, gør det«).
   Finder hvert synligt rundt plus (Tilføj) på alle sider og måler det, man SER: flade, kant, plusfarve og størrelse.
   Reglen i DESIGNLÅS.md »ÉT PLUS (18/11)«: rød cirkel #FC2404 · ingen kant · hvidt plus TEGNET i midten (svg) · 44 px. Alt andet er FEJL og stopper porten.
   En plus/minus-tæller (aria-label Flere/Færre) er ikke et Tilføj og måles ikke.
   PLUS_FLADE = "kunde" eller "dash" sættes foran koden af koer.sh. */
setTimeout(async function () {
  var vent = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var FLADE = (typeof PLUS_FLADE === "string") ? PLUS_FLADE : "kunde";
  var MENU = "#sideNav, #burgerMenu, .bottom-nav, #versionsFod, .dash-sidebar, #dashSidebar, #virkMenu, #dashMenu, #bundNav, .bund-nav";
  var FORM = {}, FEJL = 0, ALLE = 0;
  var rgb = function (s) { var m = String(s).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); return m ? [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]] : null; };
  var hex = function (s) { var c = rgb(s); if (!c) return s; if (c[3] < 0.05) return "ingen"; return "#" + c.slice(0, 3).map(function (x) { return ("0" + Math.round(x).toString(16)).slice(-2); }).join("").toUpperCase(); };
  var synlig = function (e) { var q = e.getBoundingClientRect(); if (q.width < 2 || q.height < 2) return false; var c = getComputedStyle(e); if (c.display === "none" || c.visibility === "hidden" || parseFloat(c.opacity) < 0.05) return false; return q.bottom > 0 && q.top < innerHeight * 3 && q.right > 0 && q.left < innerWidth; };
  var erPlus = function (e) {
    if (e.matches("#hjemTilfoejBaand .kv-menuknap, #bf3RumKnap .kv-menuknap, #ibPlusSide .vt-primaer, .insp-plus, .hus-plus-rk")) return !document.body.classList.contains("mails-forside") || !e.closest("#bf3RumKnap");   /* husets plus-pladser: et plus der, er et plus — også hvis det er tegnet forkert */
    var tegnetPlus = [].some.call(e.querySelectorAll("svg path, svg line"), function (x) { var d = (x.getAttribute("d") || "").replace(/\s+/g, ""); return /M12\d?[\d.]*[vV]1[0-9]|M5[\d.]*12[hH]1[0-9]/.test(d) || x.tagName.toLowerCase() === "line"; });
    if (/^(tilføj|ny |nyt |\+)/i.test((e.getAttribute("aria-label") || e.title || "").trim()) && tegnetPlus && !(e.innerText || "").trim()) return true;   /* et rundt ikon uden ord, der hedder Tilføj/Ny … OG viser et plus (send-pilen i et felt er ikke et plus) */
    var t = parseFloat(getComputedStyle(e).fontSize) < 1 ? "" : (e.innerText || "").trim(), f = (getComputedStyle(e, "::before").content || "").replace(/"/g, "");
    var svgPlus = !t && !!e.querySelector("svg path[d*='M12 5v14'], svg path[d*='M12 5V19'], svg path[d*='M5 12h14'], svg line");
    if (/M12 5v14/.test(getComputedStyle(e).backgroundImage)) return true;   /* husets tegnede plus */
    return t === "+" || f === "+" || (svgPlus && /tilf|ny|plus|add/i.test((e.getAttribute("aria-label") || "") + (e.title || "")));
  };
  var maal = function (side) {
    [].forEach.call(document.querySelectorAll("button, a, [role=button]"), function (e) {
      if (!synlig(e) || e.closest(MENU) || !erPlus(e)) return;
      if (/^(flere|færre)$/i.test(e.getAttribute("aria-label") || "")) return;
      var q = e.getBoundingClientRect(), c = getComputedStyle(e);
      if (Math.abs(q.width - q.height) > 3 || parseFloat(c.borderTopLeftRadius) < q.height / 2 - 1) return;   /* kun de runde */
      var fc = getComputedStyle(e, "::before").content.replace(/"/g, "") === "+" ? getComputedStyle(e, "::before").color : c.color;
      var sig = "flade " + hex(c.backgroundColor) + " · kant " + parseFloat(c.borderTopWidth) + " " + hex(c.borderTopColor) + " · plus " + (/svg/.test(c.backgroundImage) ? "tegnet" : "skrifttegn " + hex(fc)) + " · " + Math.round(q.width) + " px";
      var tegnet = /svg/.test(c.backgroundImage);
      var ok = hex(c.backgroundColor) === "#FC2404" && parseFloat(c.borderTopWidth) === 0 && tegnet && Math.round(q.width) === 44 && Math.round(q.height) === 44;
      ALLE++; if (!ok) FEJL++;
      var k = (ok ? "OK " : "FEJL ") + sig; FORM[k] = FORM[k] || {}; FORM[k][side + " " + (e.id ? "#" + e.id : (e.parentElement && e.parentElement.id ? "#" + e.parentElement.id : "." + String(e.className).split(" ")[0]))] = 1;
    });
  };
  try {
    for (var v = 0; v < 50 && FLADE === "kunde" && !document.body.classList.contains("app-klar"); v++) await vent(150);
    ["appLoader", "turOverlay", "dagensKort", "nyVersion"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    try { turLuk(); window.turStart = function () {}; } catch (e) {} try { dagensKortLuk(); } catch (e) {}
    var SIDER = FLADE === "kunde" ? [
      ["hjem", function () { showTab(3); }], ["idebanken", function () { showTab(2); }], ["inspiration", function () { showTab(2); ibVis("insp"); }],
      ["kalenderen", function () { showTab(8); }], ["performance", function () { openMaal(); }], ["indbakken", function () { indbakkenAaben(); }],
      ["vaerktoejskassen", function () { vaerktoejAaben(); }], ["hashtagbanken", function () { htbAabn(); }], ["drejebogen", function () { drejebogAaben(); }],
      ["maalsaetninger", function () { tilpasAaben("maal"); }], ["tema", function () { tilpasAaben("tema"); }], ["forloebsoversigt", function () { openForloeb(); }],
      ["to-do", function () { haengSideAabn(); }], ["profil", function () { minProfilAaben(); }],
      ["moedesiden", function () { try { planRitLuk(); } catch (e) {} moedeSideAaben(); }]
    ] : ["overblik", "indbakke", "crm", "gsd", "energida", "klip", "opgbib", "vaner", "maskinrum", "budget", "kunde"].map(function (s) { return [s, function () { try { planRitLuk(); } catch (e) {} visDashSide(s); }]; });
    for (var i = 0; i < SIDER.length; i++) {
      try { SIDER[i][1](); } catch (e) { continue; }
      await vent(1000); try { window.scrollTo(0, 0); var ct = document.querySelector(".content"); if (ct) ct.scrollTop = 0; } catch (e) {}
      try { maal(SIDER[i][0]); } catch (e) { console.log("SELE PLUS FEJL maalingen: " + (e && e.message)); FEJL++; }
    }
    Object.keys(FORM).sort().forEach(function (k) { console.log("SELE PLUS " + k + " · " + Object.keys(FORM[k]).join(", ")); });
    console.log(FEJL ? "SELE PLUS FEJL: " + FEJL + " af " + ALLE + " plusser har en anden form end ÉT PLUS (" + FLADE + " " + innerWidth + ")" : "SELE PLUS OK: " + ALLE + " plusser har samme form (" + FLADE + " " + innerWidth + ")");
  } catch (e) { console.log("SELE PLUS FEJL probe: " + (e && e.message)); }
}, 600);
