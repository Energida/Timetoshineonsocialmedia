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
    /* FLISEN = ETIKET · ÉN SKILLELINJE · INDHOLD (Ida 15/9 kl. 08.27). En etiket (versaler, lille skrift) MAA have
       sin ene streg under sig — det er reglen, ikke fejlen. 12/9-forbuddet gjaldt dobbeltlinjer og doere. */
    /* 15/9: ringflisens etiket staar UNDER ringen med stregen OVER sig (FLISEN: »ringe under m. etiket 14 px under«) — den ene streg maa vende begge veje, men aldrig begge. */
    var erEtiket = cs.textTransform === "uppercase" && parseFloat(cs.fontSize) <= 11.5 && ((bb && !bt) || (bt && !bb));
    if (erEtiket) { var etiketter = fl.__etiketStreger = (fl.__etiketStreger || 0) + 1; if (etiketter === 1) return; }
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
        if (innerWidth > 760) {   /* computeren: 44 er telefonens maal. Husets egne computer-maal er 28-34 px (karrusel-pil 30, vaerktoejer 32-34, plus 33), og roede ord som knapper er tilladt dér (13/9). Kun det, der er mindre end 28 px OG ikke et rent ord, er en fejl. */
          var csb = getComputedStyle(b); var rentOrd = /rgba\(0, 0, 0, 0\)|transparent/.test(csb.backgroundColor) && (csb.borderStyle === "none" || parseFloat(csb.borderWidth) === 0);
          if (q.height >= 28 || rentOrd) return;
        }
        /* elementFromPoint ser kun det, der er inde i vinduet: rul knappen ind i midten foerst */
        if (q.top < 30 || q.bottom > innerHeight - 30) { try { b.scrollIntoView({ block: "center" }); } catch (e) {} q = b.getBoundingClientRect(); }
        var cx = q.left + q.width / 2, cy = q.top + q.height / 2;
        var op = document.elementFromPoint(cx, cy - 21), ned = document.elementFromPoint(cx, cy + 21);
        if ((op && b.contains(op)) && (ned && b.contains(ned))) return;
        var ramt = function (e) { return e ? (e.id || String(e.className).split(" ")[0] || e.tagName) : "ingenting"; };
        console.log("SELE SIDER FEJL " + navn + " trykfelt under 44 px: " + (b.textContent.trim().slice(0, 24) || b.className.split(" ")[0] || b.tagName) + " (" + Math.round(q.width) + "x" + Math.round(q.height) + ", over: " + ramt(op) + ", under: " + ramt(ned) + ")"); fejl++;
      });
      /* ===== UX-POLITIET: KUN LANGE KNAPPER PAA TELEFONEN (Ida 14/9 kl. 09.37) =====
         Hendes ord: »Der maa ikke vaere smaa knapper som denne? … Vil du sende ux politiet afsted paa
         hele b2b en og tjekke at der kun er de lange knapper og ikke disse?«
         Reglen er laasen fra 4., 5. og 13. september: en KNAP paa telefonen er fuld bredde og mindst
         48 px. Maalt som mindst 60 % af skaermens bredde — en lang knap er ~88 % af 390, en lille som
         »Kom i gang« var ~49 %, saa graensen skiller dem rent uden at vaere paastaaelig.
         DET, DER IKKE ER EN KNAP I DEN FORSTAND, staar paa undtagelseslisten og er ikke pynt:
         chips (egen laast form), ikon-knapper uden tekst (klokke, mappe, mikrofon, send, naal, kryds),
         bundnavet og fanerne, fliser der er trykfelter (en flise er ikke en knap), sendefeltets
         cirkler, dagbogstaver og alt inde i en tabel. Alt andet SKAL vaere langt. */
      var UNDT = ".chip-btn,.chip,.ark-chip,.bs-chip,.cf-chip,.mood-chip,.hilsen-pill,.pr-chip,.dept-btn,.scale-btn,.esr-pill,"
        + ".bottom-nav,#dashBundnav,#woNavHost,.mobile-tabs,.ch-faner,.bs-spor,.cf-prikker,.bs-prik,.ib-faner,"
        + ".bs-doer,.bsm-flise,.bsam-flise,.hf-kort,.bs-kf,.gv,.mr-prog-r,.idea-kort,.lek-kort,.kv-flise,.post-card,.uge-dag,.cal-dag,.mr-flise,.bs-rk,"
        + ".sendfelt,.ark-send,.ark-rund,.bs-tjek,.hf-done,.hf-klokke,.vt-knap,.modal-close,.bdrop-knap,.cal-periode,.dsb-item,.dsb-under,table,"
        /* .kal-fpill: filterpillerne paa Arkivet er chips (egen laast form), ikke knapper.
           .lek-top: lektionssidens titelbjaelke — Tilbage dér er bjaelkens egen vej ud, og
           bjaelken baerer modulets navn og fremdriften. Skal bjaelken vaek paa telefonen
           (navigationslaasen siger »ingen topbar«), er det en beslutning om hele
           lektionsfladen, og den er Idas — derfor staar den her som en NAVNGIVEN undtagelse
           og ikke som en stille tilladelse. */
        + ".kal-fpill,.lek-top,.kort-plus,.uge-opret,.bf-plads,.lk-note-fold,.lk-tekstknap,.lk-vaerktoej";   /* 15/9: tilfoej-knappen er 44 px i egen bredde paa telefonen (Idas klik). Lektionssiden (Idas klik 19.45, mockup v3): note-folden og »Alle noter« er tekstknapper i flisens hoved (44 px hoeje), vaerktoejslinjen er 44 px-cirkler. */
      var lange = [].filter.call(r.querySelectorAll("button, label.ark-knap, label.dbtn, a.dbtn"), function (b) {
        var q = b.getBoundingClientRect(); if (!(q.height > 0 && q.width > 0)) return false;
        if (b.closest(UNDT)) return false;
        var t = (b.textContent || "").replace(/\s+/g, " ").trim();
        if (t.length < 3) return false;                 /* ikon eller eet tegn: ikke en knap med et navn */
        return q.width < innerWidth * 0.6;
      }).map(function (b) {
        var q = b.getBoundingClientRect();
        return (b.textContent || "").replace(/\s+/g, " ").trim().slice(0, 22) + "(" + Math.round(q.width) + "x" + Math.round(q.height) + " " + (b.className.toString().split(" ")[0] || b.tagName) + ")";
      });
      if (lange.length && innerWidth <= 760) { console.log("SELE SIDER FEJL " + navn + " smaa knapper (" + lange.length + "): " + lange.slice(0, 6).join(", ")); fejl++; }   /* lange knapper er telefonens lov; computeren maa have ord til hoejre (laasen 13/9) */
      /* ===== ETIKETTEN HOERER TIL DET, DEN INDLEDER (Ida 14/9 kl. 09.40) =====
         »Datoen her staar stadig for taet paa hero og for langt fra fliserne.« Det er naerhedsreglen,
         og den kan maales: en sektions-etiket skal staa TAETTERE paa indholdet UNDER sig end paa det,
         der staar over. Sidens identitets-etiket lige under heroen er det modsatte: den hoerer til
         heroen. Staar en etiket lige langt fra begge (under 5 px forskel), svaever den, og saa ved
         oejet ikke, hvad den hoerer til.
         MAALT PAA GEOMETRIEN, IKKE PAA SOESKENDE (14/9): foerste udgave sammenlignede etikettens
         previousElementSibling og nextElementSibling — og paa Performance er etiketten FOERSTE barn i
         sin beholder, mens heroen staar uden for den. Reglen sprang derfor netop det, Ida pegede paa,
         over. Nu findes naermeste kant over og under paa fladen, som oejet ser den. */
      var SEKETIK = ".cf-sek,.pb-eye,.pb-sek,.bs-sek,.bsm-sek,.mr-sekhoved,.hf-sek,.bs-eye";
      var blokke = [].filter.call(r.querySelectorAll("div,section,ul,ol,table,button,h1,h2,h3,p,img"), function (e) {
        var q = e.getBoundingClientRect(); return q.height > 8 && q.width > 60 && getComputedStyle(e).visibility !== "hidden";
      });
      var svaever = [];
      [].forEach.call(r.querySelectorAll(SEKETIK), function (el) {
        var lr = el.getBoundingClientRect(); if (!(lr.height > 0 && lr.width > 40)) return;
        var over = null, under = null, overEl = null, underEl = null;
        blokke.forEach(function (e) {
          if (e === el || e.contains(el) || el.contains(e)) return;
          var q = e.getBoundingClientRect();
          if (q.bottom <= lr.top + 1 && (over === null || q.bottom > over)) { over = q.bottom; overEl = e; }
          if (q.top >= lr.bottom - 1 && (under === null || q.top < under)) { under = q.top; underEl = e; }
        });
        if (over === null || under === null) return;
        var gOver = Math.round(lr.top - over), gUnder = Math.round(under - lr.bottom);
        if (gOver < 0 || gUnder < 0 || gOver > 120 || gUnder > 120) return;   /* langt fra hinanden: ikke een rytme */
        /* HVAD etiketten ER afgoer, hvad den hoerer til — ikke hvad der tilfaeldigvis staar over den.
           Kun sidens IDENTITETS-etiket (.bs-eye lige under heroen, fx »ENERGIDA« under »Dine rum«)
           hoerer til heroen. En sektions-etiket hoerer til sit indhold, OGSAA naar den staar lige
           under heroen — det var praecis Idas fund paa Performance: »Seneste 7 dage« klistrede til
           overskriften og svaevede 32 px over ringene, den beskriver. */
        var erIdentitet = el.classList.contains("bs-eye") && !el.classList.contains("pb-eye") && !el.classList.contains("pb-sek")
          && overEl.classList && (overEl.classList.contains("bs-hero") || overEl.classList.contains("ch-titel"));
        var ok = erIdentitet ? (gOver + 4 < gUnder) : (gUnder + 4 < gOver);
        if (!ok) svaever.push((el.className.toString().split(" ")[0] || "etiket") + ' "' + (el.textContent || "").trim().slice(0, 16) + '" over=' + gOver + " (" + overEl.tagName + "." + (overEl.className.toString().split(" ")[0] || "") + ") under=" + gUnder + " (" + underEl.tagName + "." + (underEl.className.toString().split(" ")[0] || "") + ")");   /* 16/9: naboerne staar med, saa fundet kan findes */
      });
      if (svaever.length) { console.log("SELE SIDER FEJL " + navn + " etiket svaever (" + svaever.length + "): " + svaever.slice(0, 5).join(", ")); fejl++; }
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
