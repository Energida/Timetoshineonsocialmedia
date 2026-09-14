/* SIDEMAALINGEN (14/9). Koeres i selen paa 390 som probe-popups.js, men maaler HELE SIDER i kundeappen mod DESIGNLÅS.md:
   - taeppet letter af sig selv (body.app-klar)
   - ingen vandret sejlads: siden og .content er ikke bredere end skaermen
   - hvert trykfelt (button, a[onclick], [role=button], .row-btn, label.ark-knap) har mindst 44 px: enten selv, eller
     gennem sit ::before-trykfelt (maalt med elementFromPoint 21 px over og under midten, 4/9-reglen »trykfeltet
     stoerre end tegningen«)
   - intet synligt kryds (.modal-close) paa en side
   - ingen emoji i synlig tekst
   - ingen skillelinje inde i en flise (hr, eller en kant kun i top/bund, inde i en flise: LOVET Ida 12/9)
   Skriver SELE SIDER OK / SELE SIDER FEJL <side> <hvad>. Ny side i appen? Tilfoej dens doer i SIDER. Doerene er de
   RIGTIGE doere (burgermenu og bundnav), ikke showTab-numre: Performance tegnes fx kun rigtigt gennem openMaal(). */
const SIDER = [
  ["hjem", function () { showTab(3); }],
  ["idebanken", function () { showTab(2); }],
  ["inspiration", function () { showTab(2); ibVis("insp"); }],
  ["arkiv", function () { showTab(2); ibVis("arkiv"); }],
  ["content", function () { showTab(8); }],
  ["performance", function () { openMaal(); }],
  ["indbakken", function () { indbakkenAaben(); }],
  ["vaerktoej", function () { vaerktoejAaben(); }],
  ["drejebog", function () { drejebogAaben(); }],
  ["tema", function () { temaAaben(); }],
  ["maalsaetninger", function () { tilpasAaben("maal"); }],
  ["tilpas", function () { tilpasAaben("drejebog"); }],
  ["forloeb", function () { openForloeb(); }],
  ["profil", function () { minProfilAaben(); }],
  ["lektion", function () { showTab(12); visLektion(KURSUS_LEKTIONER[0].id); }]
];
const FLISER = ".ws-card,.kort,.card,.hf-kort,.bsam-flise,.idea-kort,.post-card,.bs-doer,.kv-flise,.ib-kol,.lek-kort,[class$=-flise],[class$=-kort]";
function siderRod() { var lv = document.getElementById("lekVis"); if (lv && lv.classList.contains("on")) return lv; return document.querySelector(".screen.active") || document.body; }
function siderStreger(r) {
  var ud = [];
  r.querySelectorAll("*").forEach(function (e) {
    if (/^(INPUT|TEXTAREA|BUTTON|SELECT|svg|path|line|circle)$/i.test(e.tagName)) return;
    var b = e.getBoundingClientRect(); if (b.width < 40) return;
    var cs = getComputedStyle(e); if (cs.display === "none") return;
    var synlig = function (c) { return !/rgba\(0, 0, 0, 0\)|transparent/.test(c); };
    var bt = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none" && synlig(cs.borderTopColor);
    var bb = parseFloat(cs.borderBottomWidth) > 0 && cs.borderBottomStyle !== "none" && synlig(cs.borderBottomColor);
    var bl = parseFloat(cs.borderLeftWidth) > 0 && cs.borderLeftStyle !== "none";
    var br = parseFloat(cs.borderRightWidth) > 0 && cs.borderRightStyle !== "none";
    /* en streg kan ogsaa vaere et 1-2 px hoejt element med baggrundsfarve (fx .obp-skille) */
    var tynd = b.height > 0 && b.height <= 2 && synlig(cs.backgroundColor) && cs.backgroundColor !== "rgb(255, 255, 255)";
    if (!(e.tagName === "HR" || tynd || ((bt || bb) && !bl && !br))) return;
    var fl = e.parentElement && e.parentElement.closest(FLISER); if (!fl) return;
    ud.push((fl.id || fl.className.toString().split(" ")[0]) + ">" + (e.id || e.className.toString().split(" ")[0] || e.tagName));
  });
  return ud;
}
setTimeout(async function () {
  try {
    var vent = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var fejl = 0;
    for (var v = 0; v < 40 && !document.body.classList.contains("app-klar"); v++) await vent(150);
    if (!document.body.classList.contains("app-klar")) { console.log("SELE SIDER FEJL taeppet: appLoader lettede ikke af sig selv paa 6 sek."); fejl++; }
    ["appLoader", "turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    for (var i = 0; i < SIDER.length; i++) {
      var navn = SIDER[i][0];
      try { SIDER[i][1](); } catch (e) { console.log("SELE SIDER FEJL " + navn + " kunne ikke aabnes: " + e.message); fejl++; continue; }
      await vent(600);
      try { var ct = document.querySelector(".content"); if (ct) ct.scrollTop = 0; window.scrollTo(0, 0); } catch (e) {}
      var r = siderRod(); var txt = (r.innerText || "").replace(/\s+/g, " ");
      if (txt.length < 20) { console.log("SELE SIDER FEJL " + navn + " er tom (" + (r.id || "?") + ")"); fejl++; }
      var c = document.querySelector(".content");
      if (document.documentElement.scrollWidth > innerWidth + 1 || (c && c.scrollWidth > c.clientWidth + 1)) { console.log("SELE SIDER FEJL " + navn + " vandret sejlads: siden er bredere end skaermen"); fejl++; }
      var kn = [].filter.call(r.querySelectorAll("button, a[onclick], [role=button], .row-btn, label.ark-knap"), function (b) { var q = b.getBoundingClientRect(); return q.height > 0 && q.width > 0; });
      kn.forEach(function (b) {
        var q = b.getBoundingClientRect(); if (q.height >= 44) return;
        /* elementFromPoint ser kun det, der er inde i vinduet: rul knappen ind i midten foerst */
        if (q.top < 30 || q.bottom > innerHeight - 30) { try { b.scrollIntoView({ block: "center" }); } catch (e) {} q = b.getBoundingClientRect(); }
        var cx = q.left + q.width / 2, cy = q.top + q.height / 2;
        var op = document.elementFromPoint(cx, cy - 21), ned = document.elementFromPoint(cx, cy + 21);
        if ((op && b.contains(op)) && (ned && b.contains(ned))) return;
        var ramt = function (e) { return e ? (e.id || String(e.className).split(" ")[0] || e.tagName) : "ingenting"; };
        console.log("SELE SIDER FEJL " + navn + " trykfelt under 44 px: " + (b.textContent.trim().slice(0, 24) || b.className.split(" ")[0] || b.tagName) + " (" + Math.round(q.width) + "x" + Math.round(q.height) + ", over: " + ramt(op) + ", under: " + ramt(ned) + ")"); fejl++;
      });
      var kryds = [].filter.call(r.querySelectorAll(".modal-close"), function (k) { return getComputedStyle(k).display !== "none" && k.getBoundingClientRect().height > 0; });
      if (kryds.length) { console.log("SELE SIDER FEJL " + navn + " synligt kryds paa siden"); fejl++; }
      var emoji = txt.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2728}]/gu);
      if (emoji) { console.log("SELE SIDER FEJL " + navn + " emoji i teksten: " + emoji.slice(0, 3).join(" ")); fejl++; }
      var st = siderStreger(r);
      if (st.length) { console.log("SELE SIDER FEJL " + navn + " streg inde i en flise: " + st.slice(0, 4).join(", ")); fejl++; }
      /* luk det, doeren maatte have aabnet, saa naeste side maales rent */
      try { if (typeof lukLektion === "function") lukLektion(); } catch (e) {}
      try { if (typeof arkLuk === "function") arkLuk(true); } catch (e) {}
      try { if (typeof closeModal === "function") closeModal(); } catch (e) {}
      try { if (typeof drejebogTomLuk === "function") drejebogTomLuk(); } catch (e) {}
      document.querySelectorAll(".modal-back").forEach(function (m) { if (m.style.display === "flex") m.style.display = "none"; });
      document.querySelectorAll(".modal-back.on").forEach(function (m) { m.classList.remove("on"); });
    }
    console.log(fejl ? "SELE SIDER FEJL i alt: " + fejl : "SELE SIDER OK: " + SIDER.length + " sider holder designlaasen");
  } catch (e) { console.log("SELE SIDER FEJL probe: " + e.message); }
}, 1200);
