/* FOLD-UD-POLITIET (Ida 25/11, billede fra telefonen, briefens faktaboks på live v3472: »Når jeg klikker ned for at vælge musik kommer kommentar frem og alt mulig andre fejl i briefen! …
   Hvordan kan vi få det ind i sikkerhedslåsen??«). Lyd-listen åbnede som et løst kort, smallere end Lyd-flisen og rykket ind; »Kommentar eller beskrivelse« dukkede op som endnu et løst kort,
   mens listen var åben; bundmenuen og det røde plus dækkede kommentarfeltet. Portens andre målinger åbner ikke listerne som en kunde og så det ikke.

   Her åbnes HVER dropdown og fold-ud i briefen (faktaboksen + alle skrivesider + Optag + Post + båndet) som en kunde — et tryk på feltet — og der måles:
     (a) listen er lige så bred som feltet og flugter venstre og højre (±2 px). En liste på hele skærmen (telefonens bs3-fuld) er sin egen flade og måles ikke for bredde;
     (b) intet NYT synligt element dukker op uden for listen, mens den er åben (synlige elementer før og efter; listens egne dele, dens beholdere og feltet selv tælles ikke);
     (c) ingen listerække, intet felt og intet nyt skrivefelt dækkes af noget fast (bundmenu, plus, toppen) — browseren spørges, hvad der ligger i midten (elementFromPoint);
     (d) listen ligger helt inden for skærmen, når den er rullet ind;
     (e) ingen tekst i en række er klippet (scrollWidth > clientWidth med skjult overløb eller »…«);
   og så lukkes den igen med et tryk på feltet, og siden skal være som før (de samme synlige elementer).
   Feltet findes generisk: .bdrop-knap, .bs3-drop, faktaboksens .fb-rk[data-key], [aria-haspopup], [aria-expanded] og <select>. Åbner et tryk et ark/popup, tælles det ikke her (probe-popups/regler2).
   Køres af koer.sh som kunde på 390 og 1440. Hver fejl: »FOLDUD FEJL <bredde> <side> <felt>: <hvad>«. Slutter med »SELE FOLDUD OK <bredde>: N felter« — ellers »SELE FOLDUD FEJL <bredde>: N fund«. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  var B = innerWidth, FEJL = [], testet = 0, sprunget = [], SIDSTE = "start";
  var vagt = setTimeout(function () { console.log("SELE FOLDUD FEJL " + B + ": proben nåede ikke i mål — sidste trin: " + SIDSTE); }, 150000);
  function fejl(side, felt, hvad) { FEJL.push(B + " " + side + " " + felt + ": " + hvad); }
  function synlig(e) {
    if (!e || !e.getClientRects || !e.getClientRects().length) return false;
    var r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false;
    var cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.05) return false;
    for (var a = e; a && a !== document.body; a = a.parentElement) { if (parseFloat(getComputedStyle(a).opacity) < 0.05) return false; }
    return true;
  }
  function navn(e) {
    if (!e) return "intet";
    var t = (e.getAttribute && (e.getAttribute("aria-label") || "")) || "";
    var lab = "";
    try { var q = e.closest(".sk-q"); var l = q && q.querySelector(":scope > .sk-label"); if (l) lab = (l.childNodes[0] && l.childNodes[0].textContent || l.innerText || "").trim(); } catch (x) {}
    try { if (e.matches(".fb-rk")) { var n = e.querySelector(".fb-n"); if (n) lab = (n.innerText || "").trim(); } } catch (x) {}
    var s = lab || t || (e.innerText || "").replace(/\s+/g, " ").trim();
    return "»" + (s || (e.id ? "#" + e.id : e.tagName.toLowerCase() + "." + String(e.className).split(" ")[0])).slice(0, 34) + "«";
  }
  function kort(e) { if (!e) return "intet"; return e.id ? "#" + e.id : e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : ""); }
  function fastForfar(e) { for (var a = e; a && a !== document.documentElement; a = a.parentElement) { var p = getComputedStyle(a).position; if (p === "fixed" || p === "sticky") return a; } return null; }
  function beskriv(e) { var f = fastForfar(e); var tekst = ((e && (e.getAttribute("aria-label") || e.innerText)) || "").replace(/\s+/g, " ").trim().slice(0, 24); return (f ? "fast " + kort(f) + (f !== e ? " (" + kort(e) + ")" : "") : kort(e)) + (tekst ? " »" + tekst + "«" : ""); }
  /* alle synlige elementer — til før/efter-sammenligningen */
  function snap() { var s = new Set(); var alle = document.body.getElementsByTagName("*"); for (var i = 0; i < alle.length; i++) { var e = alle[i]; if (/^(SCRIPT|STYLE|svg|path|circle|line|polyline|rect|g|use|B|I|BR)$/i.test(e.tagName)) continue; if (synlig(e)) s.add(e); } return s; }
  function flade(e) { var c = getComputedStyle(e); var bg = c.backgroundColor; return (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) || (parseFloat(c.borderTopWidth) > 0 && c.borderTopStyle !== "none") || c.boxShadow !== "none"; }
  /* et ark/popup, der ikke stod der før trykket */
  function erArk(foer) { return [].filter.call(document.querySelectorAll("#bsFlytMenu, .ark, .ark-slor, .bs-flyt-ark, [role=dialog], [aria-modal=true]"), function (e) { return synlig(e) && !foer.has(e); })[0] || null; }
  async function lukArk(a) { try { bsFlytLuk(); } catch (e) {} await V(400); if (a && a.isConnected && synlig(a)) { var x = [].filter.call(a.querySelectorAll(".ark-luk, [aria-label=Luk], .bs-flyt-luk"), synlig)[0]; if (x) { x.click(); await V(400); } } if (a && a.isConnected && synlig(a)) { try { a.style.display = "none"; } catch (e) {} } }
  /* et tryk som en kunde: rul feltet ind, se om noget dækker midten, og tryk */
  async function tryk(el) {
    try { el.scrollIntoView({ block: "center" }); } catch (e) {} await V(250);
    var r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, p = document.elementFromPoint(x, y);
    var daekket = p && !(p === el || el.contains(p)) ? p : null;
    try { el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: x, clientY: y })); el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: x, clientY: y })); el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: x, clientY: y })); el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, clientX: x, clientY: y })); } catch (e) {}
    el.click();
    return daekket;
  }
  /* hvilket element er LISTEN, når feltet er trykket? */
  function findListe(el, nye) {
    var kand = [];
    try { if (el.matches(".fb-rk[data-key]")) { var u = document.querySelector('.fb-ud[data-for="' + el.getAttribute("data-key") + '"]'); if (u && synlig(u)) { var k = [].filter.call(u.querySelectorAll(".bdrop-kort, .bs3-liste"), synlig)[0]; return { liste: k || u, hold: u }; } } } catch (e) {}
    try { var d = el.closest(".bdrop"); if (d) { var k2 = d.querySelector(".bdrop-kort"); if (k2 && synlig(k2)) return { liste: k2, hold: d }; } } catch (e) {}
    try { var w = el.closest(".bs3-drop-w"); if (w) { var l = w.querySelector(".bs3-liste"); if (l && synlig(l)) return { liste: l, hold: w }; } } catch (e) {}
    var fl = document.getElementById("bfStatusBaandKort"); if (fl && synlig(fl) && nye.has(fl)) return { liste: fl, hold: fl };
    kand = [].filter.call(document.querySelectorAll(".bdrop-kort, .bs3-liste, [role=listbox], [role=menu]"), function (e) { return synlig(e) && nye.has(e); });
    if (kand.length) return { liste: kand[0], hold: kand[0] };
    /* generisk: det største nye element, der ikke er feltets eget */
    var st = null, sa = 0; nye.forEach(function (e) { if (el.contains(e)) return; var r = e.getBoundingClientRect(); if (r.width * r.height > sa) { sa = r.width * r.height; st = e; } });
    return st ? { liste: st, hold: st } : null;
  }
  /* feltets flise: feltet selv, eller den nærmeste beholder med flade, hvis feltet ikke har sin egen */
  function feltFlise(el) {
    if (flade(el)) return el;
    for (var a = el.parentElement, i = 0; a && i < 3; a = a.parentElement, i++) { if (flade(a) && Math.abs(a.getBoundingClientRect().height - el.getBoundingClientRect().height) < 24) return a; }
    return el;
  }
  async function maalFelt(el, side) {
    var fn = navn(el); SIDSTE = side + " " + fn;
    try { el.scrollIntoView({ block: "center" }); } catch (e) {} await V(300);
    var foer = snap(), sy0 = scrollY;
    var daekket = await tryk(el); await V(700);
    var ark = erArk(foer); if (ark) { sprunget.push(fn + " (ark " + kort(ark) + ")"); await lukArk(ark); try { window.scrollTo(0, sy0); } catch (e) {} return; }
    var efter = snap(); var nye = new Set(); efter.forEach(function (e) { if (!foer.has(e)) nye.add(e); });
    var fund = findListe(el, nye);
    if (!fund || !synlig(fund.liste)) { if (!nye.size) { sprunget.push(fn + " (åbner intet)"); return; } fejl(side, fn, "der åbnede noget, men ingen liste kunne findes (" + nye.size + " nye elementer)"); }
    else {
      testet++;
      var L = fund.liste, LR = L.getBoundingClientRect(), F = feltFlise(el), FR = F.getBoundingClientRect();
      var helSkaerm = L.classList.contains("bs3-fuld") || (LR.width >= innerWidth - 2 && LR.height >= innerHeight * 0.9);
      if (daekket) fejl(side, fn, "feltet er dækket af " + beskriv(daekket) + " — et tryk rammer ikke feltet");
      /* (a) lige så bred som feltet, flugter ±2 */
      if (!helSkaerm) {
        var dv = Math.round(LR.left - FR.left), dh = Math.round(LR.right - FR.right);
        if (Math.abs(dv) > 2 || Math.abs(dh) > 2) fejl(side, fn, "listen er " + Math.round(LR.width) + " bred mod feltets " + Math.round(FR.width) + " (venstre " + (dv > 0 ? "+" : "") + dv + ", højre " + (dh > 0 ? "+" : "") + dh + " px) — skal flugte ±2");
      }
      /* (b) intet nyt uden for listen */
      var udenfor = []; nye.forEach(function (e) {
        if (L.contains(e) || e.contains(L) || el.contains(e) || e === el) return;
        if (e.parentElement && nye.has(e.parentElement) && !e.parentElement.contains(L)) return;   /* kun det øverste nye element tælles */
        var r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return;
        udenfor.push(e);
      });
      udenfor.forEach(function (e) { fejl(side, fn, "nyt element dukker op uden for listen, mens den er åben: " + kort(e) + " »" + (e.innerText || "").replace(/\s+/g, " ").trim().slice(0, 40) + "« (" + Math.round(e.getBoundingClientRect().width) + "×" + Math.round(e.getBoundingClientRect().height) + ")"); });
      /* (d) listen inden for skærmen (efter den er rullet ind) */
      await V(400); LR = L.getBoundingClientRect();
      if (LR.top < -1 || LR.left < -1 || LR.right > innerWidth + 1 || LR.bottom > innerHeight + 1) fejl(side, fn, "listen går uden for skærmen (top " + Math.round(LR.top) + ", bund " + Math.round(LR.bottom) + " af " + innerHeight + ", venstre " + Math.round(LR.left) + ", højre " + Math.round(LR.right) + " af " + innerWidth + ")");
      /* (c) intet dækker rækkerne, feltet eller de nye skrivefelter */
      var rk = [].filter.call(L.querySelectorAll(".bdrop-rk, .bs3-liste > button, [role=option], [role=menuitem], button, label, input, textarea"), function (e) { return synlig(e) && !e.closest(".bs3-fuld-luk") && e.getBoundingClientRect().height >= 16; });
      if (!rk.length && L.children.length) rk = [].filter.call(L.children, synlig);
      var lr = L.getBoundingClientRect(), daek = {}, nd = 0, klip = [];
      rk.forEach(function (e) {
        var r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
        if (y < Math.max(0, lr.top) || y > Math.min(innerHeight, lr.bottom) || y < 0 || y > innerHeight) return;   /* rækker, man skal rulle til inde i listen, måles i (d) */
        var p = document.elementFromPoint(x, y);
        if (p && !(p === e || e.contains(p) || L.contains(p))) { nd++; var k = beskriv(p); daek[k] = (daek[k] || 0) + 1; }
        /* (e) klippet tekst */
        [e].concat([].slice.call(e.querySelectorAll("*"))).forEach(function (t) { if (!synlig(t) || !(t.innerText || "").trim()) return; var c = getComputedStyle(t); if (t.scrollWidth > t.clientWidth + 1 && (c.overflowX !== "visible" || c.textOverflow === "ellipsis")) klip.push((t.innerText || "").trim().slice(0, 30)); });
      });
      Object.keys(daek).forEach(function (k) { fejl(side, fn, daek[k] + " af listens rækker er dækket af " + k); });
      if (klip.length) fejl(side, fn, klip.length + " række(r) har klippet tekst: »" + klip.slice(0, 3).join("« · »") + "«");
      [el].concat(udenfor.reduce(function (a, u) { return a.concat([].filter.call(u.querySelectorAll("textarea, input:not([type=hidden]), button"), synlig)); }, [])).forEach(function (e) {
        try { e.scrollIntoView({ block: "nearest" }); } catch (x) {}
        var r = e.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; var x = r.left + r.width / 2, y = r.top + r.height / 2, p = document.elementFromPoint(x, y);
        if (p && !(p === e || e.contains(p) || L.contains(p)) && fastForfar(p) && !fastForfar(e)) fejl(side, fn, (e === el ? "feltet" : e.tagName === "TEXTAREA" ? "det nye skrivefelt" : e.tagName === "BUTTON" ? "den nye knap " + kort(e) : "det nye felt " + kort(e)) + " er dækket af " + beskriv(p) + ", mens listen er åben");
      });
    }
    /* luk igen med et tryk på feltet; siden skal være som før */
    if (synlig(el)) await tryk(el); await V(700);
    var aaben = fund && fund.liste && fund.liste.isConnected && synlig(fund.liste);
    if (aaben) { try { document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); } catch (e) {} await V(300); if (synlig(fund.liste)) { fejl(side, fn, "listen lukker ikke ved et nyt tryk på feltet"); try { FB_AABEN = null; briefFaktaUdPlacer(); } catch (e) {} document.querySelectorAll(".bdrop-kort").forEach(function (k) { k.style.display = "none"; }); var fk = document.getElementById("bfStatusBaandKort"); if (fk) fk.remove(); await V(300); } }
    var bag = snap(), mangler = 0, ekstra = [];
    foer.forEach(function (e) { if (e.isConnected && !bag.has(e)) mangler++; });
    bag.forEach(function (e) { if (!foer.has(e) && !(e.parentElement && !foer.has(e.parentElement) && bag.has(e.parentElement))) ekstra.push(e); });
    ekstra = ekstra.filter(function (e) { var r = e.getBoundingClientRect(); return r.width >= 4 && r.height >= 4; });
    if (ekstra.length) fejl(side, fn, "efter lukning står " + ekstra.length + " element(er) tilbage, der ikke var der før: " + ekstra.slice(0, 3).map(kort).join(" · "));
    if (mangler > 3) fejl(side, fn, "efter lukning mangler " + mangler + " elementer, der var synlige før");
    try { window.scrollTo(0, sy0); } catch (e) {}
  }
  function sideNavn() {
    try {
      if (typeof B3_VIS !== "undefined" && B3_VIS && B3_VIS !== "skriv") return B3_VIS === "optag" ? "Optag" : B3_VIS === "post" ? "Post" : B3_VIS;
      var h = document.querySelector("#b3Trin .b3-ts-navn") || document.querySelector("#b3Trin .b3-tf.nu span");
      var t = h ? (h.innerText || "").trim() : ""; var info = BRIEF_TRIN_INFO || { t: 0, n: 1 };
      return t ? t : "side" + BRIEF_SIDE_AKTIV + (info.n > 1 ? " trin " + (info.t + 1) : "");
    } catch (e) { return "?"; }
  }
  var SET = {}, PRSIDE = [];   /* et felt, der står på flere sider (faktaboksen på computeren), måles første gang */
  function noegle(el) {
    if (el.matches(".fb-rk[data-key]")) return "fb:" + el.getAttribute("data-key");
    var d = el.closest(".bdrop, .bs3-drop-w"); if (d && d.id) return "id:" + d.id;
    if (el.closest(".bt-status-baand")) return "status-baand";
    return "x:" + (el.id || "") + navn(el) + String(el.className).split(" ")[0];
  }
  function felter() {
    var rod = [document.getElementById("screen7"), document.getElementById("briefRail")].filter(Boolean);
    var s = []; rod.forEach(function (r) { [].forEach.call(r.querySelectorAll(".bdrop-knap, .bs3-drop, .fb-rk[data-key], [aria-haspopup]:not([aria-haspopup=false]), [aria-expanded], select"), function (e) { if (s.indexOf(e) < 0 && synlig(e) && !e.matches(".b3-prik, .fb-fold-linje")) s.push(e); }); });
    return s;
  }
  async function maalSide() {
    var side = sideNavn(), fs = felter(), i = 0, navne = [];
    for (var k = 0; k < fs.length; k++) {
      var el = fs[k]; if (!el.isConnected || !synlig(el)) continue; var n = noegle(el); if (SET[n]) continue; SET[n] = 1; i++; navne.push(navn(el));
      try { await maalFelt(el, side); } catch (e) { fejl(side, navn(el), "målingen fejlede: " + (e && e.message)); }
      if (!document.body.classList.contains("brief-aaben")) { fejl(side, navn(el), "briefen lukkede, da feltet blev trykket"); return false; }
      /* gentegnet? så findes felterne igen */
      if (!el.isConnected) { fs = felter(); k = -1; }
    }
    PRSIDE.push(side + ": " + (navne.length ? navne.join(" ") : "ingen nye"));
    return true;
  }
  try {
    for (var v = 0; v < 40 && !document.body.classList.contains("app-klar"); v++) await V(150);
    await V(800);
    ["appLoader", "turOverlay", "dagensKort", "nyVersion"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    try { STRATEGI_TEMAER.push({ navn: "Menneskene bag", formaal: "kunderne skal lære os at kende", foelelse: "Dem kan jeg lide", eksempler: [] }); } catch (e) {}
    /* TESTBRIEFEN: som Idas — en Reel med Musik valgt (så »Kommentar eller beskrivelse« findes), platform, ansvarlig og undertekster */
    IDEER.push({ id: "fu1", titel: "To om ét indkøb", soejle: "Menneskene bag", type: "Reel", status: "Brief i gang", dato: "2026-11-27", brief: { format: "Reel", platform: ["Instagram"], lyd: ["Musik"], musik: "", undertekster: "Ja", beskrivelse: "Vi viser, hvordan vi to vælger forskelligt.", hookTekst: "Vi er aldrig enige om farver", klip: [{ ser: "Vi står med hver vores favorit", tekst: "Hvem har ret?", siger: "Vi er aldrig enige" }], caption: "Vi køber ind sammen.", cta: "Kommentér opslaget", ctaCaption: "Kommentér opslaget", hashtags: "#butiksliv" } });
    window.ideUpdate = function () { return Promise.resolve(true); };
    openBriefSide("fu1"); await V(2500); SIDSTE = "brief åbnet";
    try { document.querySelectorAll("#turOverlay,.tur-slor,#turKort,#nyVersion,#dagensKort").forEach(function (e) { e.remove(); }); } catch (e) {}
    if (!document.body.classList.contains("brief-aaben")) { fejl("brief", "»briefen«", "briefen åbnede ikke"); }
    else {
      /* telefonen: faktaboksen er foldet inde i briefen — den foldes ud, så hver række kan trykkes */
      var SIDER = [];
      for (var s = 0; s < 4; s++) SIDER.push({ s: s });
      SIDER.push({ v: "optag" }, { v: "post" });
      for (var si = 0; si < SIDER.length; si++) {
        var P = SIDER[si];
        if (P.v) { try { b3Vaelg(P.v); } catch (e) {} await V(900); if (!(await maalSide())) break; try { b3Vaelg("skriv"); } catch (e) {} await V(500); continue; }
        try { if (P.s === 2 && b3UdenFasthold()) continue; } catch (e) {}
        BRIEF_SIDE_AKTIV = P.s; BRIEF_TRIN_AKTIV = 0; try { briefMbVis("skriv"); } catch (e) {} await V(700);
        var n = (BRIEF_TRIN_INFO || { n: 1 }).n || 1;
        for (var t = 0; t < n; t++) {
          BRIEF_SIDE_AKTIV = P.s; BRIEF_TRIN_AKTIV = t; try { briefMbVis("skriv"); } catch (e) {} await V(700);
          try { if (!window.__FB_FOLD_AABEN && document.querySelector(".fb-fold-linje") && synlig(document.querySelector(".fb-fold-linje"))) { fbFoldSkift(); await V(300); } } catch (e) {}
          SIDSTE = "side " + P.s + "/" + t;
          if (!(await maalSide())) { si = SIDER.length; break; }
        }
      }
    }
  } catch (e) { fejl("probe", "»proben«", "fejlede: " + (e && e.message)); }
  clearTimeout(vagt);
  if (testet < 3) FEJL.push(B + " brief »alle«: kun " + testet + " felter blev åbnet — briefen blev ikke tegnet, eller felterne blev ikke fundet");
  FEJL.forEach(function (f) { console.log("FOLDUD FEJL " + f); });
  console.log("SELE FOLDUD INFO " + B + " sider: " + PRSIDE.join(" · "));
  console.log("SELE FOLDUD INFO " + B + ": " + testet + " felter målt · ikke en liste (ark eller intet): " + (sprunget.join(" · ").slice(0, 600) || "ingen"));
  console.log(FEJL.length ? "SELE FOLDUD FEJL " + B + ": " + FEJL.length + " fund" : "SELE FOLDUD OK " + B + ": " + testet + " felter åbner i deres egen flise, lige så brede som feltet, intet andet dukker op, intet dækket");
})();
