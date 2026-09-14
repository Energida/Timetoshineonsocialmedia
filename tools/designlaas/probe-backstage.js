/* BACKSTAGE-MAALINGEN (natten 14/9-15/9). probe-sider.js maaler KUNDEAPPEN; denne maaler IDAS side gennem de rigtige doere
   (bsSideGaa + Teknik + Soeg + To-do + Indbakken) mod DESIGNLÅS.md og designmanualen:
   - siden har tekst (ikke tom) · ingen vandret sejlads · trykfelter mindst 44 px (paa telefon) · intet synligt kryds ·
     ingen emoji · ingen streg inde i en flise · kun lange knapper paa telefonen (samme undtagelser som kundeappen)
   - ADMIN: heroen er 52 px (Ida 11/9) · 32 px luft under heroen (12/9) · ingen billeder i Backstage (11/9) ·
     ingen fast topbar/fod paa telefonen (8/9) — bundmenuen og flyt-menuen er navigation og undtaget
   Koeres i selen: sele.html?vis=dash&side=overblik&fil=index-sele.html&bred=390&kode=<denne fil>. Skriver
   SELE BACKSTAGE OK / SELE BACKSTAGE FEJL <side> <hvad>. Ny side i Backstage? Tilfoej dens doer i SIDER. */
const SIDER = [
  ["hjem", function () { visDashSide("overblik"); }],
  ["kunder", function () { visDashSide("crm"); }],
  ["salg", function () { mrGaaTil("salg"); }],
  ["pipeline", function () { bsSalgAabnListe("pipeline"); }],
  ["contentstudio", function () { mrGaaTil("contentstudio"); }],
  ["energidastudio", function () { visDashSide("klip"); }],
  ["workout", function () { mrGaaTil("oevelser"); }],
  ["food", function () { mrGaaTil("food"); }],
  ["mindful", function () { mrGaaTil("mindful"); }],
  ["minerum", function () { visDashSide("energida"); }],
  ["teknik", function () { bsTeknikAabn(); }],
  ["soeg", function () { visDashSide("soeg"); }],
  ["todo", function () { visDashSide("gsd"); }],
  ["indbakken", function () { visDashSide("indbakke"); }]
];
const FLISER = ".ws-card,.kort,.card,.hf-kort,.bsam-flise,.idea-kort,.post-card,.bs-doer,.kv-flise,.ib-kol,.lek-kort,.mr-flise,.bs-kf,.bs-rk,.brik,[class$=-flise],[class$=-kort]";
function bsRod() {
  var omr = [].filter.call(document.querySelectorAll(".mr-omr"), function (e) { return e.offsetParent && getComputedStyle(e).display !== "none"; })[0];
  if (omr) return omr;
  var ds = [].filter.call(document.querySelectorAll("[id^=dside-]"), function (e) { return e.offsetParent && getComputedStyle(e).display !== "none"; })[0];
  return ds || document.getElementById("dashMain") || document.body;
}
function bsStreger(r) {
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
    var tynd = b.height > 0 && b.height <= 2 && synlig(cs.backgroundColor) && cs.backgroundColor !== "rgb(255, 255, 255)";
    if (!(e.tagName === "HR" || tynd || ((bt || bb) && !bl && !br))) return;
    var fl = e.parentElement && e.parentElement.closest(FLISER); if (!fl) return;
    if (fl.classList.contains("ws-card") && fl.querySelector(".ws-head") === e) return;   /* kort-hovedets streg er manualens egen (19/7) — gammel form, ikke en flise */
    ud.push((fl.id || fl.className.toString().split(" ")[0]) + ">" + (e.id || e.className.toString().split(" ")[0] || e.tagName));
  });
  return ud;
}
setTimeout(async function () {
  try {
    var vent = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var fejl = 0, telefon = innerWidth <= 760;
    ["appLoader", "turOverlay", "dagensKort", "somkundeLoader"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    try { if (typeof studieVaelgerLuk === "function") studieVaelgerLuk(); } catch (e) {}
    for (var i = 0; i < SIDER.length; i++) {
      var navn = SIDER[i][0];
      try { SIDER[i][1](); } catch (e) { console.log("SELE BACKSTAGE FEJL " + navn + " kunne ikke aabnes: " + e.message); fejl++; continue; }
      await vent(900);
      /* taeppet: i selen har siderne ingen moebler, saa sideKlarNaar loefter det aldrig — det er selens vilkaar, ikke sidens. Maal bag det. */
      try { var al = document.getElementById("appLoader"); if (al) al.remove(); } catch (e) {}
      try { if (typeof studieVaelgerLuk === "function") studieVaelgerLuk(); } catch (e) {}
      try { if (typeof bsFlytLuk === "function") bsFlytLuk(); } catch (e) {}
      try { window.scrollTo(0, 0); var dm = document.getElementById("dashMain"); if (dm) dm.scrollTop = 0; } catch (e) {}
      var r = bsRod(); var txt = (r.innerText || "").replace(/\s+/g, " ");
      var felter = r.querySelectorAll("input,textarea,select").length;   /* en side med kun et soegefelt har ingen innerText */
      if (txt.length < 20 && !felter) { console.log("SELE BACKSTAGE FEJL " + navn + " er tom (" + (r.id || r.className || "?") + ")"); fejl++; }
      if (document.documentElement.scrollWidth > innerWidth + 1) { console.log("SELE BACKSTAGE FEJL " + navn + " vandret sejlads: siden er bredere end skaermen"); fejl++; }
      /* heroen: EEN hero paa 52 px (Ida 11/9) */
      var heroer = [].filter.call(r.querySelectorAll(".bs-hero, .ch-titel, .ov-h1, .ws-welcome h2"), function (h) { var q = h.getBoundingClientRect(); return q.height > 0 && q.width > 0 && getComputedStyle(h).visibility !== "hidden"; });
      var hero = heroer[0];
      if (!hero) { console.log("SELE BACKSTAGE FEJL " + navn + " ingen hero fundet"); fejl++; }
      else {
        var fs = Math.round(parseFloat(getComputedStyle(hero).fontSize));
        if (fs !== 52) { console.log("SELE BACKSTAGE FEJL " + navn + " heroen er " + fs + " px, ikke 52 (" + (hero.className.toString().split(" ")[0]) + ")"); fejl++; }
        /* 32 px luft under heroen (12/9): naermeste synlige blok under heroen */
        var hr = hero.getBoundingClientRect(); var naermest = null, nEl = null;
        [].forEach.call(r.querySelectorAll("div,section,button,ul,table,p,input,form"), function (e) {
          if (e === hero || hero.contains(e) || e.contains(hero)) return;
          var q = e.getBoundingClientRect(); if (!(q.height > 6 && q.width > 60)) return;
          if (getComputedStyle(e).visibility === "hidden") return;
          if (q.top >= hr.bottom - 1 && (naermest === null || q.top < naermest)) { naermest = q.top; nEl = e; }
        });
        if (naermest !== null) {
          var luft = Math.round(naermest - hr.bottom);
          var erEtiket = nEl.classList && (nEl.classList.contains("bs-eye") || nEl.classList.contains("ch-label") || nEl.classList.contains("bs-hero-streg"));
          if (!erEtiket && luft < 28) { console.log("SELE BACKSTAGE FEJL " + navn + " luft under heroen er " + luft + " px, ikke 32 (" + (nEl.id || nEl.className.toString().split(" ")[0] || nEl.tagName) + ")"); fejl++; }
        }
      }
      /* ingen billeder i Backstage (Ida 11/9) — vandmaerket og ikoner er ikke billeder */
      var billeder = [].filter.call(r.querySelectorAll("img"), function (im) { var q = im.getBoundingClientRect(); return q.width > 40 && q.height > 40 && !/logo-hjerte/.test(im.src) && !im.closest(".hjerte-pynt"); });
      if (billeder.length) { console.log("SELE BACKSTAGE FEJL " + navn + " billede i Backstage: " + billeder.slice(0, 3).map(function (im) { return im.src.split("/").pop().slice(0, 30); }).join(", ")); fejl++; }
      if (telefon) {
        /* ingen topbar/fod paa telefonen (8/9): faste elementer, der ikke er bundmenu, menu, ark eller flyt-menu */
        var faste = [].filter.call(document.querySelectorAll("body *"), function (e) {
          var cs = getComputedStyle(e); if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;   /* en toast, der ikke vises, er ikke en bjaelke */
          var q = e.getBoundingClientRect(); if (!(q.height > 8 && q.width > 100)) return false;
          if (e.closest("#dashBundnav,#bsFlytMenu,#arkSlor,.ark-slor,#dashMenu,.burger-menu,#modalBack,.modal-back,#appLoader,#nyVersion,#syncFejl,.hjerte-pynt,#versionsFod,#somkundeBanner")) return false;
          if (e.id === "dashBundnav" || e.id === "bsFlytMenu" || e.id === "versionsFod") return false;
          return true;
        });
        if (faste.length) { console.log("SELE BACKSTAGE FEJL " + navn + " fast bjaelke paa telefonen: " + faste.slice(0, 3).map(function (e) { return e.id || e.className.toString().split(" ")[0] || e.tagName; }).join(", ")); fejl++; }
        var kn = [].filter.call(r.querySelectorAll("button, a[onclick], [role=button], .row-btn"), function (b) { var q = b.getBoundingClientRect(); return q.height > 0 && q.width > 0; });
        var smaa = [];
        kn.forEach(function (b) {
          var q = b.getBoundingClientRect(); if (q.height >= 44) return;
          if (q.top < 30 || q.bottom > innerHeight - 30) { try { b.scrollIntoView({ block: "center" }); } catch (e) {} q = b.getBoundingClientRect(); }
          var cx = q.left + q.width / 2, cy = q.top + q.height / 2;
          var op = document.elementFromPoint(cx, cy - 21), ned = document.elementFromPoint(cx, cy + 21);
          if ((op && b.contains(op)) && (ned && b.contains(ned))) return;
          smaa.push((b.textContent.trim().slice(0, 20) || b.className.toString().split(" ")[0] || b.tagName) + "(" + Math.round(q.width) + "x" + Math.round(q.height) + ")");
        });
        if (smaa.length) { console.log("SELE BACKSTAGE FEJL " + navn + " trykfelt under 44 px (" + smaa.length + "): " + smaa.slice(0, 6).join(", ")); fejl++; }
        var UNDT = ".chip-btn,.chip,.ark-chip,.bs-chip,.cf-chip,.bs-rumpil,.mq-tap.ark-chip,#dashBundnav,.bs-doer,.bs-kf,.mr-flise,.bs-rk,.kv-flise,.sendfelt,.ark-send,.ark-rund,.bs-tjek,.bs-naal,.vt-knap,.modal-close,.bdrop-knap,.dsb-item,.dsb-under,table,.kv-menuknap,.bs-pin,.crm-fane,.ark-chips";
        var lange = [].filter.call(r.querySelectorAll("button, label.dbtn, a.dbtn"), function (b) {
          var q = b.getBoundingClientRect(); if (!(q.height > 0 && q.width > 0)) return false;
          if (b.closest(UNDT)) return false;
          var t = (b.textContent || "").replace(/\s+/g, " ").trim(); if (t.length < 3) return false;
          return q.width < innerWidth * 0.6;
        }).map(function (b) { var q = b.getBoundingClientRect(); return (b.textContent || "").replace(/\s+/g, " ").trim().slice(0, 22) + "(" + Math.round(q.width) + "x" + Math.round(q.height) + " " + (b.className.toString().split(" ")[0] || b.tagName) + ")"; });
        if (lange.length) { console.log("SELE BACKSTAGE FEJL " + navn + " smaa knapper (" + lange.length + "): " + lange.slice(0, 6).join(", ")); fejl++; }
      }
      var kryds = [].filter.call(r.querySelectorAll(".modal-close"), function (k) { return getComputedStyle(k).display !== "none" && k.getBoundingClientRect().height > 0; });
      if (kryds.length) { console.log("SELE BACKSTAGE FEJL " + navn + " synligt kryds paa siden"); fejl++; }
      var emoji = txt.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2728}]/gu);
      if (emoji) { console.log("SELE BACKSTAGE FEJL " + navn + " emoji i teksten: " + emoji.slice(0, 3).join(" ")); fejl++; }
      var st = bsStreger(r);
      if (st.length) { console.log("SELE BACKSTAGE FEJL " + navn + " streg inde i en flise: " + st.slice(0, 4).join(", ")); fejl++; }
      try { if (typeof arkLuk === "function") arkLuk(true); } catch (e) {}
      try { if (typeof closeModal === "function") closeModal(); } catch (e) {}
      document.querySelectorAll(".modal-back.on").forEach(function (m) { m.classList.remove("on"); });
    }
    console.log(fejl ? "SELE BACKSTAGE FEJL i alt: " + fejl : "SELE BACKSTAGE OK: " + SIDER.length + " sider holder designlaasen");
  } catch (e) { console.log("SELE BACKSTAGE FEJL probe: " + e.message); }
}, 1500);
