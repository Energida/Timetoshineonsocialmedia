/* v____ · CONTENT STUDIO I BACKSTAGE + KUNDENS TO FANER I IDÉBANKEN (Ida 24/11: »Ja, byg det«).
   Kunden (390 og 1440): chips (computer: to under titlen, 32 høje, 12,5 px, trykfelt 44 · telefon: én række, den aktive scrolles ind) · fanen Energidas idébank (sektioner, fliser lige brede, skygger, ingen streg ved versalerne, kun de syv farver, intet fedt, intet afskåret, ingen vandret rulning) ·
   kun udgivne idéer (aldrig en kladde, appen spørger selv .eq(udgivet, true), kunden skriver aldrig i energida_idebank) · en indholdssøjle, en mappe og Tilbage ét skridt · en idé med fri indholdssøjle forsvinder ikke · arket: forvalgt Gem i, Gem skriver en række i kundens egen content_ideer med brief.fraEnergida, Gemt med rødt flueben, en afvist gemning rulles tilbage og siges ·
   tom tilstand og en tabel, der svarer med fejl. Backstage (390 og 1440): menuen (Content Studio efter Mails, Optagestudie) · siden med fire fliser og Energidas eget · tomme skaller · Energidas idébank: ny idé som kladde, mappe som én valgt eller ny tekst, arket med kontakten Udgivet (gemmer med det samme), Slet med spørgsmål først, Tilbage ét skridt ·
   alle låse (kanter, lige brede rækker, skygger, farver, streger, intet fedt). Selen og den huskende base; intet rigtigt gemmes, og der er 0 testdata tilbage. Køres af koer.sh med CS_FLADE = kunde eller dash. */
(async function () {
  var FLADE = (typeof CS_FLADE === "string" && CS_FLADE) || "kunde";
  var r = { tjek: [], fejlliste: [] }, fejl = [], n = 0; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  window.addEventListener("error", function (e) { r.fejlliste.push(String(e.message).slice(0, 200)); });
  var _ce = console.error; console.error = function () { try { r.fejlliste.push("console.error: " + [].map.call(arguments, String).join(" ").slice(0, 200)); } catch (e) {} return _ce.apply(console, arguments); };
  var PC = innerWidth >= 900;
  function rod() { return document.querySelector((PC ? "#ideBank" : "#ibMobil") + " .ibn-rod"); }
  function Q(s, i) { var l = [].filter.call(document.querySelectorAll(s), function (e) { return e.getClientRects().length; }); return l[i || 0] || null; }
  function tekst(s, t) { return [].filter.call(document.querySelectorAll(s), function (e) { return e.getClientRects().length && (e.textContent || "").trim().indexOf(t) === 0; })[0] || null; }
  function klik(e) { if (!e) throw new Error("mangler element til klik"); e.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window })); }
  function skriv(e, v) { if (!e) throw new Error("mangler felt"); e.focus(); e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); }
  function tast(e, k) { e.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true })); }
  async function tag(ord) { var f = Q(".ibn-tagind"); skriv(f, ord); await V(60); tast(Q(".ibn-tagind"), "Enter"); await V(80); }
  function b(e) { if (!e) return "--"; var x = e.getBoundingClientRect(); return Math.round(x.left) + "-" + Math.round(x.right) + " t" + Math.round(x.top) + " h" + Math.round(x.height); }
  function ok(navn, betingelse, d) { n++; if (!betingelse) fejl.push(navn + " — " + String(d == null ? "" : d).slice(0, 240)); }
  function db() { try { return JSON.parse(localStorage.getItem("SELE_DB") || "{}"); } catch (e) { return {}; } }
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {} await V(600);
    window.ygtContentLaasVis = function () { return false; };
    var OKF = { "rgb(252, 36, 4)": 1, "rgb(244, 247, 250)": 1, "rgb(255, 255, 255)": 1, "rgb(248, 248, 248)": 1, "rgb(222, 222, 222)": 1, "rgb(104, 104, 104)": 1, "rgb(26, 26, 26)": 1, "rgba(0, 0, 0, 0)": 1 };
    function audit(rodEl, navn, ekstraSkip) {
      var fund = {}, n = 0;
      [].forEach.call(rodEl.querySelectorAll("*"), function (e) { if (!e.getClientRects().length) return; if (e.closest(".tom-kort, .ib-chips, .ib-soeg-tlf" + (ekstraSkip ? ", " + ekstraSkip : ""))) return; n++; var cs = getComputedStyle(e);
        var t = (e.className && e.className.baseVal != null ? e.className.baseVal : String(e.className || "")).split(" ")[0] || e.tagName;
        ["color", "backgroundColor", "borderTopColor", "borderBottomColor", "stroke", "fill"].forEach(function (k) { var v = cs[k]; if (!v || v === "none") return; if (k.indexOf("border") === 0 && parseFloat(cs[k.replace("Color", "Width")]) === 0) return; if ((k === "stroke" || k === "fill") && !(e instanceof SVGElement)) return; if (!OKF[v]) fund[t + "." + k + "=" + v] = 1; });
        if (parseInt(cs.fontWeight, 10) > 400 && (e.textContent || "").trim()) fund[t + ".fed=" + cs.fontWeight] = 1;
        if (!/Poppins/i.test(cs.fontFamily) && e.children.length === 0 && (e.textContent || "").trim()) fund[t + ".skrift=" + cs.fontFamily.slice(0, 20)] = 1;
        if (cs.textOverflow === "ellipsis") fund[t + ".ellipsis"] = 1;
        if (e.children.length === 0 && (e.textContent || "").trim() && e.scrollWidth > e.clientWidth + 1 && cs.overflow !== "visible" && !e.classList.contains("ibn-gemi-t")) fund[t + ".klippet"] = 1; });
      ok("farver og skrift: " + navn, Object.keys(fund).length === 0, n + " elementer ¦ " + Object.keys(fund).join(" ¦ "));
    }
    function rkEns(sel, rodEl, navn, tol) { var l = [].filter.call(rodEl.querySelectorAll(sel), function (e) { return e.getClientRects().length; }); var rows = {}; l.forEach(function (e) { var x = e.getBoundingClientRect(); var k = Math.round(x.top / 4); (rows[k] = rows[k] || []).push(x); });
      var bad = []; Object.keys(rows).forEach(function (k) { var w = rows[k].map(function (x) { return Math.round(x.width); }); if (Math.max.apply(null, w) - Math.min.apply(null, w) > (tol || 2)) bad.push(w.join("/")); }); ok("lige brede i hver række: " + navn, bad.length === 0 && l.length > 0, l.length + " ¦ " + bad.join(" ")); }
    function skyg(sel, rodEl, navn) { var uden = [].filter.call(rodEl.querySelectorAll(sel), function (e) { if (!e.getClientRects().length) return false; var cs = getComputedStyle(e); return cs.backgroundColor === "rgb(255, 255, 255)" && !/36px/.test(cs.boxShadow); }); ok("hvide fliser har skygge: " + navn, uden.length === 0, uden.length + " uden"); }
    function streg(sel, rodEl, navn) { var s = [].filter.call(rodEl.querySelectorAll(sel), function (e) { var a = getComputedStyle(e, "::after"), bf = getComputedStyle(e, "::before"), cs = getComputedStyle(e); return (a.content !== "none" && a.display !== "none") || (bf.content !== "none" && bf.display !== "none") || parseFloat(cs.borderBottomWidth) > 0 || parseFloat(cs.borderTopWidth) > 0; }); ok("ingen streg ved versalerne: " + navn, s.length === 0, rodEl.querySelectorAll(sel).length + " versaler"); }
    function vandret(navn) { ok("ingen vandret rulning: " + navn, document.documentElement.scrollWidth <= innerWidth + 1, document.documentElement.scrollWidth + " mod " + innerWidth); }
    function kanterL(sel, rodEl, navn, maks) { var v = {}, h = {}; [].forEach.call(rodEl.querySelectorAll(sel), function (e) { if (!e.getClientRects().length) return; var x = e.getBoundingClientRect(); v[Math.round(x.left)] = 1; h[Math.round(x.right)] = 1; }); var vl = Object.keys(v).length, hl = Object.keys(h).length; ok("kanter flugter: " + navn, vl <= maks && hl <= maks, "venstre " + Object.keys(v).join(",") + " ¦ højre " + Object.keys(h).join(",")); }


    var EIDE = [
      ["Vis det produkt, du selv ville købe først", "Optag femten sekunder, hvor du holder produktet og fortæller, hvorfor du valgte det. Slut med prisen.", "1A Produkt", "Jul", ["Produkt", "Reel"], true],
      ["Det spørgsmål, kunderne stiller hver uge", "Svar på det spørgsmål, du hører oftest, i ét roligt klip.", "1B Målgruppens situation", "Nyheder", ["Spørgsmål", "Kunder"], true],
      ["Præsentér én fra holdet med hendes yndlingsting", "Lad hende vise, hvad hun bruger mest, og hvorfor.", "2A Menneskene bag", "Nyheder", ["Hold"], true],
      ["En dag fra morgen til lukketid", "Følg én dag i butikken, fra du låser op, til du slukker.", "2B Bag om forretningen", "Tilbud", ["Dag"], true],
      ["Før og efter: tre sekunder, der taler for sig selv", "Vis et billede før og et efter.", "1A Produkt", "Jul", ["Før og efter"], true],
      ["Tre fejl, de fleste begår, når de vælger", "Peg på tre fejl, og giv et råd til hver.", "1B Målgruppens situation", "Vinter", ["Råd"], true],
      ["Din første medarbejder fortæller, hvorfor hun blev", "Lad hende fortælle med egne ord.", "2A Menneskene bag", "Vinter", ["Hold", "Historie"], true],
      ["Spørg dem, der følger dig: hvad vil I se mere af?", "Lav en afstemning i story.", "Story", "", ["Story"], true],
      ["Kladde: Sådan pakker vi en gave ind", "Kun Ida må se denne.", "1A Produkt", "Jul", ["Gave"], false],
      ["Kladde: En idé uden en af kundens indholdssøjler", "Fri tekst i søjlefeltet.", "Kundesucces", "", [], false],
      ["Udgivet med fri søjletekst", "Kundens navne passer ikke, men idéen må ikke forsvinde.", "Kundesucces", "Nyheder", ["Fri"], true]
    ];
    var rk0 = EIDE.map(function (x, i) { return { id: "eide-" + (i + 1 < 10 ? "0" : "") + (i + 1), titel: x[0], beskrivelse: x[1], soejle: x[2], mappe: x[3], tags: x[4], udgivet: x[5], raekkefoelge: i + 1, created_at: "2026-11-" + (i + 6 < 10 ? "0" : "") + (i + 6) + "T10:00:00Z" }; });
    var dbx = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); dbx.energida_idebank = rk0; localStorage.setItem("SELE_DB", JSON.stringify(dbx));
    if (FLADE !== "dash") {
    showTab(2); await V(2500);

    var kodeK = String(currentKode || "").toUpperCase() || "HINGES2026";
    var dbk = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); dbk.skema_svar = (dbk.skema_svar || []).filter(function (x) { return x.skema !== "ide_bank"; }); dbk.skema_svar.push({ id: "ib-cs", kode: kodeK, navn: "opsaetning", skema: "ide_bank", svar: { covers: {}, temaer: [{ id: "m-nyh", navn: "Nyheder", slags: "mappe" }, { id: "m-jul", navn: "Jul", slags: "tema" }] } }); localStorage.setItem("SELE_DB", JSON.stringify(dbk));
    IB_OPS_KODE = ""; try { await ibOpsHent(); } catch (e) {} window.__SELE_SKRIV = [];
    /* KUNDENS TO FANER · rejse (24/11) — kunde uden adgang til energida_idebank udover at læse udgivne */
        function egDb() { return db().energida_idebank || []; }
        function admin(fn) { localStorage.setItem("SELE_ROLLE", "admin"); try { return fn(); } finally { localStorage.removeItem("SELE_ROLLE"); } }
        function chipPc(f) { return Q(".ibn-faner .ibn-chip[data-v='" + f + "']"); }
        function fane(f) { klik(PC ? chipPc(f) : document.getElementById(f === "min" ? "ibFaneIdeer" : "ibFaneEnergida")); }
        function kortEg(t) { return [].filter.call(rod().querySelectorAll(".ibn-eg"), function (e) { return e.getClientRects().length && e.querySelector(".ibn-titel").textContent.trim().indexOf(t) === 0; })[0] || null; }
        function egTitler() { return [].map.call(rod().querySelectorAll(".ibn-eg .ibn-titel"), function (e) { return e.textContent.trim(); }); }
        function tilbage() { var s = navstiKundeSti(2); if (s && s.tilbage) s.tilbage(); }
        function sjTile(k) { return [].filter.call(rod().querySelectorAll(".ibn-sj"), function (e) { return e.getClientRects().length && e.querySelector(".ibn-et").textContent.trim() === k; })[0] || null; }
        function fl(t) { return [].filter.call(rod().querySelectorAll(".ibn-fast"), function (e) { return e.getClientRects().length && e.querySelector(".ibn-navn").textContent.trim() === t; })[0] || null; }
        /* 1 · to faner */
        var chipNavne = PC ? [].map.call(document.querySelectorAll(".ibn-faner .ibn-chip"), function (e) { return e.textContent.trim(); }) : [].map.call(document.querySelectorAll("#screen2 .ch-faner .chip-btn"), function (e) { return e.textContent.trim(); });
        ok("1 chips: Min idébank og Energidas idébank" + (PC ? " (computer)" : " (telefon: én række)"), PC ? chipNavne.join("|") === "Min idébank|Energidas idébank" : chipNavne.join("|") === "Content kalenderen|Min idébank|Energidas idébank|Inspiration|Arkiv", chipNavne.join("|"));
        if (!PC) ok("1 telefonen: kun én række chips", document.querySelectorAll("#screen2 .ch-faner").length === 1 && !document.querySelector(".ibn-faner:not([style*='none'])") , "rækker=" + document.querySelectorAll("#screen2 .ch-faner").length + " computerrække=" + (getComputedStyle(document.getElementById("ibnFaner")).display));
        ok("1 Min idébank er åben først", !!Q(".ibn-ny") && !Q(".ibn-eg"), "ny idé-flise=" + !!Q(".ibn-ny"));
        fane("energida"); await V(1500);
        ok("1 fanen Energidas idébank: ingen »Ny idé«-flise", !Q(".ibn-ny") && !!Q(".ibn-eg"), "kort=" + egTitler().length);
        var sek = [].map.call(rod().querySelectorAll(".ibn-sek"), function (e) { return e.textContent.trim(); });
        ok("1 sektionerne: Indholdssøjler · Mapper · Nyt fra Energida", sek.join("|") === "Indholdssøjler|Mapper|Nyt fra Energida", sek.join("|"));
        var aktiv = [].filter.call(document.querySelectorAll(PC ? ".ibn-faner .ibn-chip" : "#screen2 .ch-faner .chip-btn"), function (e) { return e.classList.contains("on"); }).map(function (e) { return e.textContent.trim(); });
        ok("1 den aktive chip er Energidas idébank", aktiv.join("|") === "Energidas idébank", aktiv.join("|"));
        if (!PC) { var ak = document.querySelector("#screen2 .ch-faner .chip-btn.on"), rr = ak.parentElement.getBoundingClientRect(), ar = ak.getBoundingClientRect(); ok("1 telefonen: den aktive chip er scrollet ind i billedet", ar.left >= rr.left - 1 && ar.right <= rr.right + 1, "chip " + Math.round(ar.left) + "-" + Math.round(ar.right) + " række " + Math.round(rr.left) + "-" + Math.round(rr.right)); }
        /* 2 · kun udgivne */
        var udg = egDb().filter(function (x) { return x.udgivet === true; }).map(function (x) { return x.titel; });
        var vist = egTitler();
        ok("2 kun udgivne ses (ingen kladder)", vist.length === udg.length && vist.every(function (t) { return udg.indexOf(t) > -1; }) && !vist.some(function (t) { return /^Kladde/.test(t); }), vist.length + " vist af " + udg.length + " udgivne (" + egDb().length + " i alt)");
        var spoerg = (window.__SELE_LOG || []).filter(function (l) { return /^select energida_idebank/.test(l); });
        ok("2 appen spørger selv .eq(udgivet, true)", !window.__SELE_LOG || spoerg.length > 0 && spoerg.every(function (l) { return /"udgivet",true/.test(l); }), spoerg.join(" ¦ "));
        ok("2 kunden skriver aldrig i energida_idebank (kun select)", (window.__SELE_LOG || []).filter(function (l) { return /^(insert|update|delete|upsert) energida_idebank/.test(l); }).length === 0 && (window.__SELE_SKRIV || []).filter(function (l) { return /energida_idebank/.test(l); }).length === 0, (window.__SELE_LOG || []).filter(function (l) { return /energida_idebank/.test(l); }).join(" ¦ "));
        var kildeTekst = ibEgHent.toString() + ibEgGem.toString() + ibnEgHtml.toString() + ibEgArkAabn.toString();
        ok("2 kundens kode rører aldrig energida_idebank med insert/update/delete/service-role", !/\.(insert|update|delete|upsert)\(/.test(ibEgHent.toString() + ibnEgHtml.toString() + ibEgArkAabn.toString()) && !/service.?role/i.test(kildeTekst) && /from\("energida_idebank"\)\.select\("\*"\)\.eq\("udgivet", true\)/.test(ibEgHent.toString()), "");
        /* en kladde, der lægges ind bagefter, ses ikke; udgives den, ses den ved næste hentning */
        admin(function () { var d = db(); d.energida_idebank.push({ id: "eide-99", titel: "Ny kladde fra Ida", beskrivelse: "", soejle: "1A Produkt", mappe: "Jul", tags: [], udgivet: false, created_at: "2026-11-24T12:00:00Z" }); localStorage.setItem("SELE_DB", JSON.stringify(d)); });
        fane("min"); await V(500); fane("energida"); await V(1500);
        ok("2 en ny kladde ses ikke", !kortEg("Ny kladde fra Ida"), egTitler().length + " kort");
        admin(function () { var d = db(); d.energida_idebank.filter(function (x) { return x.id === "eide-99"; })[0].udgivet = true; localStorage.setItem("SELE_DB", JSON.stringify(d)); });
        fane("min"); await V(500); fane("energida"); await V(1500);
        ok("2 udgives den, ses den", !!kortEg("Ny kladde fra Ida"), egTitler().length + " kort");
        admin(function () { var d = db(); d.energida_idebank = d.energida_idebank.filter(function (x) { return x.id !== "eide-99"; }); localStorage.setItem("SELE_DB", JSON.stringify(d)); });
        fane("min"); await V(500); fane("energida"); await V(1500);
        /* 3 · fri indholdssøjle forsvinder ikke */
        ok("3 en idé med fri indholdssøjle (»Kundesucces«) står under Nyt fra Energida", !!kortEg("Udgivet med fri søjletekst") && /Kundesucces/i.test(kortEg("Udgivet med fri søjletekst").querySelector(".ibn-et").textContent), kortEg("Udgivet med fri søjletekst") ? kortEg("Udgivet med fri søjletekst").querySelector(".ibn-et").textContent : "-");
        var k1 = kortEg("Vis det produkt"); ok("3 kortets etiket er kode og navn (1A Produkt)", !!k1 && /^1A\s*[·]?\s*Produkt$/i.test(k1.querySelector(".ibn-et").textContent.trim().replace(/\s+/g, " ")), k1 ? k1.querySelector(".ibn-et").textContent : "-");
        /* 4 · indholdssøjle → idéer med samme kode · Tilbage ét skridt */
        klik(sjTile("1A")); await V(500);
        var t1a = egTitler();
        ok("4 en indholdssøjle viser kun Energidas idéer med samme kode", t1a.length === 2 && t1a.indexOf("Vis det produkt, du selv ville købe først") > -1, t1a.join(" ¦ "));
        ok("4 titlen i marken er indholdssøjlens navn", /Produkt/.test((Q("#screen2 .mb-navn") || {}).textContent || ""), (Q("#screen2 .mb-navn") || {}).textContent);
        tilbage(); await V(500);
        ok("4 Tilbage = Energidas idébank (ét skridt)", !!sjTile("1A") && !!Q(".ibn-egsj") && (Q("#screen2 .mb-navn") || {}).textContent === "Idébanken", (Q("#screen2 .mb-navn") || {}).textContent);
        klik(fl("Jul")); await V(500);
        var tj = egTitler();
        ok("4 en mappe viser kortene i mappen", tj.length === 2 && (Q("#screen2 .mb-navn") || {}).textContent === "Jul", tj.join(" ¦ ") + " ¦ " + (Q("#screen2 .mb-navn") || {}).textContent);
        ok("4 stien viser Idébanken › Jul", JSON.stringify(navstiKundeSti(2).led.map(function (l) { return l.navn; })).indexOf("Jul") > -1, JSON.stringify(navstiKundeSti(2).led.map(function (l) { return l.navn; })));
        tilbage(); await V(500);
        ok("4 Tilbage fra mappen = overblikket i samme fane", !!fl("Jul") && !Q(".ibn-ny") && (Q("#screen2 .mb-navn") || {}).textContent === "Idébanken", "");
        tilbage(); await V(600);
        ok("4 ét skridt mere = forladt Idébanken (som i Min idébank)", !(document.getElementById("screen2").classList.contains("active")) || !fl("Jul"), "skærm=" + (document.querySelector(".screen.active") || {}).id);
        showTab(2); await V(1500);
        if (!rod() || !fl("Jul")) { fane("energida"); await V(1500); }
        /* 5 · åbn en idé, gem i egen idébank */
        var foer = (db().content_ideer || []).length;
        klik(kortEg("Vis det produkt")); await V(700);
        var ark = Q("#ibnNyArk");
        ok("5 arket viser etiket, titel, tekst og tags", !!ark && /1A\s*[·]?\s*Produkt/i.test(ark.querySelector(".ibn-eg-et").textContent) && ark.querySelector(".ibn-eg-titel").textContent.indexOf("Vis det produkt") === 0 && /femten sekunder/.test(ark.querySelector(".ibn-eg-tekst").textContent) && ark.querySelectorAll(".ibn-eg-tag").length === 2, ark ? ark.textContent.replace(/\s+/g, " ").slice(0, 160) : "intet ark");
        ok("5 Gem i er forvalgt til idéens indholdssøjle (1A Produkt)", /1A Produkt/.test(Q(".ibn-gemi").textContent), Q(".ibn-gemi").textContent);
        klik(Q(".ibn-gemi")); await V(300);
        klik(tekst(".ibn-rk", "Nyheder")); await V(150);
        if (PC) klik(Q(".ibn-spm, .ibn-ark-krop")); else klik(Q(".ibn-faerdig")); await V(250);
        klik(Q("#ibnNyArk .ibn-gem")); await V(300);
        ok("5 knappen siger Gemt", /Gemt/.test((Q("#ibnNyArk .ibn-gem") || {}).textContent || ""), ((Q("#ibnNyArk .ibn-gem") || {}).textContent || ""));
        await V(1700);
        var ny = (db().content_ideer || []).filter(function (x) { return x.brief && x.brief.fraEnergida === "eide-01"; })[0];
        ok("5 en ny række i kundens egen content_ideer med brief.fraEnergida", (db().content_ideer || []).length === foer + 1 && !!ny, "rækker " + foer + "→" + (db().content_ideer || []).length + " ¦ " + JSON.stringify(ny || {}).slice(0, 300));
        ok("5 rækken har titel, indholdssøjle (1A), tags og mappe", !!ny && ny.titel.indexOf("Vis det produkt") === 0 && soejleModel(ny.soejle).kode === "1A" && ny.brief.tags.length === 2 && (ny.brief.temaer || []).length === 1 && ny.brief.temaer[0] === "m-nyh" && ny.status === "Idé" && !ny.dato, JSON.stringify(ny || {}).slice(0, 300));
        ok("5 arket lukkede efter Gemt", !Q("#ibnNyArk"), "");
        ok("5 kortet viser nederst Gemt med rødt flueben", !!kortEg("Vis det produkt").querySelector(".ibn-stat-gemt svg") && /Gemt/.test(kortEg("Vis det produkt").textContent), kortEg("Vis det produkt").textContent.replace(/\s+/g, " "));
        ok("5 et kort, der ikke er gemt, viser intet Gemt", !/Gemt/.test(kortEg("Spørg dem").textContent), "");
        var stat = kortEg("Vis det produkt").querySelector(".ibn-stat-gemt"); var sc = getComputedStyle(stat.querySelector("svg"));
        ok("5 flueben er rødt", sc.stroke === "rgb(252, 36, 4)", sc.stroke);
        fane("min"); await V(700);
        klik(flise1A()); await V(500);
        function flise1A() { return [].filter.call(rod().querySelectorAll(".ibn-sj"), function (e) { return e.getClientRects().length && e.textContent.trim().indexOf("1A") === 0; })[0]; }
        var minTitler = [].map.call(rod().querySelectorAll(".ibn-ide .ibn-titel"), function (e) { return e.textContent.trim(); });
        ok("5 idéen ligger i Min idébank under 1A", minTitler.some(function (t) { return t.indexOf("Vis det produkt") === 0; }), minTitler.join(" ¦ "));
        tilbage(); await V(400);
        /* 6 · en gemning, der ikke gik igennem, ruller tilbage og siger det */
        fane("energida"); await V(1200);
        var foer6 = (db().content_ideer || []).length; localStorage.setItem("SELE_AFVIS", "fejl");
        klik(kortEg("Det spørgsmål")); await V(600); try { document.getElementById("husKvit").textContent = ""; } catch (e) {}
        klik(Q("#ibnNyArk .ibn-gem")); await V(1500);
        ok("6 afvist gemning: ingen ny række, ikke Gemt, og beskeden siges", (db().content_ideer || []).length === foer6 && !/Gemt/.test((Q("#ibnNyArk .ibn-gem") || {}).textContent || "") && /Det blev ikke gemt\. Prøv igen\./.test((document.getElementById("husKvit") || {}).textContent || ""), "rækker " + foer6 + "→" + (db().content_ideer || []).length + " ¦ " + ((document.getElementById("husKvit") || {}).textContent || "") + " ¦ knap=" + ((Q("#ibnNyArk .ibn-gem") || {}).textContent || ""));
        localStorage.removeItem("SELE_AFVIS"); try { var sf = document.getElementById("syncFejl") || document.querySelector(".sync-fejl"); if (sf) sf.remove(); } catch (e) {}
        try { ibnArkLuk(); } catch (e) {} await V(300);
        ok("6 ingen Gemt på det kort", !/Gemt/.test(kortEg("Det spørgsmål").textContent), "");
        /* 7 · en idé, der allerede er gemt, kan ikke gemmes to gange */
        klik(kortEg("Vis det produkt")); await V(600);
        ok("7 en allerede gemt idé viser Gemt i arket", /Gemt/.test((Q("#ibnNyArk .ibn-gem") || {}).textContent || ""), (Q("#ibnNyArk .ibn-gem") || {}).textContent);
        var foer7 = (db().content_ideer || []).length; klik(Q("#ibnNyArk .ibn-gem")); await V(800);
        ok("7 et tryk mere laver ingen dublet", (db().content_ideer || []).length === foer7, foer7 + "→" + (db().content_ideer || []).length);
        try { ibnArkLuk(); } catch (e) {} await V(300);
        /* 8 · resten af appen */
        var foerFejl = (r.fejlliste || []).length;
        showTab(3); await V(1500); ok("8 Forsiden åbner", document.getElementById("screen3").classList.contains("active"), "");
        showTab(8); await V(1800); ok("8 Content kalenderen åbner", document.getElementById("screen8").classList.contains("active"), "");
        showTab(2); await V(1200); fane("min"); await V(500); klik(sjTile("1A")); await V(500); klik(Q(".ibn-ide")); await V(2500);
        ok("8 en brief åbner", document.getElementById("screen7").classList.contains("active"), "skærm=" + (document.querySelector(".screen.active") || {}).id);
        try { briefTilbage(); } catch (e) {} await V(1800);
        var uventet = (r.fejlliste || []).filter(function (x) { return !/afvist \(sele\)|SYNC-FEJL/.test(x); });
        ok("8 ingen uventede fejl i konsollen", uventet.length === 0, JSON.stringify(uventet)); r.fejlliste = uventet;
    
        /* LÅS-MÅLING · kundens Energidas idébank */
        function fane(f) { klik(PC ? Q(".ibn-faner .ibn-chip[data-v='" + f + "']") : document.getElementById(f === "min" ? "ibFaneIdeer" : "ibFaneEnergida")); }
        fane("energida"); await V(1500);
        kanterL(".ibn-fl", rod(), "overblik", PC ? 4 : 2); rkEns(".ibn-sj", rod(), "indholdssøjlerne", 2); rkEns(".ibn-fast", rod(), "mapperne", 2); rkEns(".ibn-ide", rod(), "kortene", 2);
        skyg(".ibn-fl", rod(), "overblik"); streg(".ibn-sek", rod(), "overblik"); audit(rod(), "Energidas idébank (overblik)"); vandret("overblik");
        /* chips */
        var ch = [].filter.call(document.querySelectorAll(PC ? ".ibn-faner .ibn-chip" : "#screen2 .ch-faner .chip-btn"), function (e) { return e.getClientRects().length; });
        ok("chips er 32 høje" + (PC ? " og 12,5 px" : ""), ch.length >= 2 && ch.every(function (e) { var x = e.getBoundingClientRect(); return Math.round(x.height) === 32 && (!PC || parseFloat(getComputedStyle(e).fontSize) === 12.5); }), ch.map(function (e) { return Math.round(e.getBoundingClientRect().height) + "/" + getComputedStyle(e).fontSize; }).join(" "));
        var tf = ch.map(function (e) { var a = getComputedStyle(e, "::before"), h = parseFloat(a.height); var top = parseFloat(a.top), bot = parseFloat(a.bottom); return Math.round(e.getBoundingClientRect().height + (isNaN(top) ? 0 : -top) + (isNaN(bot) ? 0 : -bot)); });
        ok("chippens trykfelt er mindst 44", tf.every(function (x) { return x >= 44; }), tf.join(","));
        var ak = ch.filter(function (e) { return e.classList.contains("on"); })[0]; var ba = getComputedStyle(ak);
        ok("den aktive chip er rød med hvid tekst", ba.backgroundColor === "rgb(252, 36, 4)" && ba.color === "rgb(255, 255, 255)", ba.backgroundColor + " " + ba.color);
        /* en idé åbnet = arket */
        klik([].filter.call(rod().querySelectorAll(".ibn-eg"), function (e) { return e.getClientRects().length; })[0]); await V(700);
        var ark = Q("#ibnNyArk"); audit(ark, "arket til en Energida-idé", ".ibn-lavt-slor");
        skyg(".ibn-gem", ark, "arket"); 
        var gem = Q("#ibnNyArk .ibn-gem"); var gs = getComputedStyle(gem);
        ok("Gem er rød med hvid tekst og mindst 44 høj", gs.backgroundColor === "rgb(252, 36, 4)" && gs.color === "rgb(255, 255, 255)" && gem.getBoundingClientRect().height >= 44, gs.backgroundColor + " " + gs.color + " " + Math.round(gem.getBoundingClientRect().height));
        var gi = Q("#ibnNyArk .ibn-gemi"); ok("Gem i er lyseblå med grå kant", getComputedStyle(gi).backgroundColor === "rgb(244, 247, 250)" && getComputedStyle(gi).borderTopColor === "rgb(222, 222, 222)", getComputedStyle(gi).backgroundColor + " " + getComputedStyle(gi).borderTopColor);
        var mx = {}; [].forEach.call(ark.querySelectorAll(".ibn-eg-et, .ibn-eg-titel, .ibn-eg-tekst, .ibn-eg-tags"), function (e) { mx[Math.round(e.getBoundingClientRect().left)] = 1; });
        ok("arkets tekst flugter til venstre", Object.keys(mx).length === 1, Object.keys(mx).join(","));
        var gl = Q("#ibnNyArk .ibn-gemlinje"), gb = Q("#ibnNyArk .ibn-gemi").getBoundingClientRect(), gg = gem.getBoundingClientRect();
        ok("Gem i og Gem er 12 eller 8 fra hinanden og lige høje", Math.abs(gb.height - gg.height) <= 1 && (gg.left - gb.right === 8 || gg.left - gb.right === 12), Math.round(gg.left - gb.right) + " ¦ " + Math.round(gb.height) + "/" + Math.round(gg.height));
        ibnArkLuk(); await V(300);
    

    /* tom tilstand og en tabel, der svarer med fejl */
    var dbt = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); dbt.energida_idebank = []; localStorage.setItem("SELE_DB", JSON.stringify(dbt));
    function fane(f) { klik(PC ? Q(".ibn-faner .ibn-chip[data-v='" + f + "']") : document.getElementById(f === "min" ? "ibFaneIdeer" : "ibFaneEnergida")); }
    fane("min"); await V(500); fane("energida"); await V(1500);
    var tk = rod().querySelector(".tom-kort");
    ok("tom tilstand: husets egen form, ingen sektioner, ingen kort", !!tk && !rod().querySelector(".ibn-eg, .ibn-sj, .ibn-sek") && /^Ingen idéer fra Energida endnu\.$/.test(tk.textContent.trim()), tk ? tk.textContent.trim() : "-");
    ok("tom tilstand: ingen forklarende sætning (højst én sætning, ingen knap)", tk.textContent.trim().split(/[.!?]\s/).length === 1 && !tk.querySelector("button"), "");
    fane("min"); await V(600);
    ok("Min idébank virker stadig, når Energida ingen idéer har", !!Q(".ibn-ny") && !!Q(".ibn-sj"), "");
    ok("siden gik ikke i stykker", (r.fejlliste || []).filter(function (x) { return !/afvist|SYNC-FEJL/.test(x); }).length === 0, JSON.stringify(r.fejlliste || []));

    var fejlSvar = function () { return Promise.resolve({ data: null, error: { message: "fejl (prøve)" } }); };
    var fra0 = sb.from; sb.from = function (t) { if (t === "energida_idebank") { return { select: function () { return { eq: function () { return { order: fejlSvar }; } }; } }; } return fra0.apply(sb, arguments); };
    fane("min"); await V(500); fane("energida"); await V(1500);
    ok("en tabel, der svarer med fejl: siden går ikke i stykker (tom tilstand i husets form)", !!rod() && !!rod().querySelector(".tom-kort") && !rod().querySelector(".ibn-eg"), rod() ? rod().textContent.trim().slice(0, 80) : "ingen flade");
    sb.from = fra0;

    }
    if (FLADE === "dash") {
    /* BACKSTAGE · Content Studio · rejse (24/11) — kører i Backstage (skud-admin.py) */
        var CR = function () { return document.querySelector("#csIbHost .ibn-rod"); };
        function egDb() { return db().energida_idebank || []; }
        function rk(t) { return egDb().filter(function (x) { return String(x.titel || "").indexOf(t) === 0; })[0] || null; }
        function adm(t) { return [].filter.call((CR() || document).querySelectorAll(".ibn-ide"), function (e) { return e.getClientRects().length && e.querySelector(".ibn-titel").textContent.trim().indexOf(t) === 0; })[0] || null; }
        function stiNavne() { try { var l = [].map.call(document.querySelectorAll(".navsti .navsti-led, .navsti a, .navsti span"), function (e) { return e.textContent.trim(); }); return l; } catch (e) { return []; } }
        function tilb() { var e = [].filter.call(document.querySelectorAll(".navsti-tilbage, .cover-tilbage, .mb-baand .navsti-tilbage"), function (x) { return x.getClientRects().length; })[0]; if (!e) throw new Error("ingen Tilbage-knap"); klik(e); }
        function menuNavne() { return [].map.call(document.querySelectorAll("#dsbDoere .dsb-doer .dsb-doer-t"), function (e) { return e.textContent.trim(); }); }
        function synlig() { return [].filter.call(document.querySelectorAll(".mr-omr"), function (e) { return e.getClientRects().length; })[0] || null; }
        async function vent(id, ms) { for (var i = 0; i < (ms || 6000) / 150; i++) { var e = document.getElementById(id); if (e && e.getClientRects().length && !e.hasAttribute("data-bs-hold")) return true; await V(150); } return false; }
        function titel() { var o = synlig(), h = o ? o.querySelector(".ch-titel") : null; return h ? h.textContent.trim() : ""; }
        if (!PC) { /* telefonen: menuen ligger under Mere */ var mere = [].filter.call(document.querySelectorAll("#dashBundnav button"), function (e) { return /Mere/.test(e.textContent); })[0]; klik(mere); await V(700); }
        /* 1 · menuen */
        var mn = menuNavne(); var iCs = mn.indexOf("Content Studio");
        ok("1 menuen: Content Studio lige efter Mails" + (PC ? "" : " (under Mere)"), iCs > 0 && mn[iCs - 1] === "Mails", mn.join(" | "));
        ok("1 kursusoptagelsen hedder Optagestudie i menuen (og ikke Energida Studio)", mn.indexOf("Optagestudie") > -1 && mn.indexOf("Energida Studio") < 0, mn.join(" | "));
        klik([].filter.call(document.querySelectorAll("#dsbDoere .dsb-doer"), function (e) { return /Content Studio/.test(e.textContent); })[0]); await V(1800);
        if (!PC) { try { dsbPanelSkift(false); } catch (e) {} await V(300); }
        ok("1 siden hedder Content Studio", titel() === "Content Studio", titel());
        var sekt = [].map.call(document.querySelectorAll("#csStudioHost .cs-sek"), function (e) { return e.textContent.trim(); });
        ok("1 sektionerne: Til kunderne · Energidas eget", sekt.join("|") === "Til kunderne|Energidas eget", sekt.join("|"));
        var fl = [].map.call(document.querySelectorAll("#csStudioHost .cs-fl"), function (e) { return e.textContent.trim(); });
        ok("1 flisernes navne og rækkefølge", fl.join("|") === "Energidas idébank|Skabeloner|Tekster til indholdssøjlerne|Guider|Energidas Content Studio", fl.join("|"));
        var bx = [].map.call(document.querySelector("#csStudioHost .cs-gitter").querySelectorAll(".cs-fl"), function (e) { var x = e.getBoundingClientRect(); return Math.round(x.width) + "x" + Math.round(x.height) + "@" + Math.round(x.left) + "," + Math.round(x.top); });
        var ws = {}; [].forEach.call(document.querySelector("#csStudioHost .cs-gitter").querySelectorAll(".cs-fl"), function (e) { ws[Math.round(e.getBoundingClientRect().width)] = 1; });
        ok("1 de fire fliser er lige brede", Object.keys(ws).length === 1, bx.join(" "));
        var vink = [].filter.call(document.querySelectorAll("#csStudioHost .cs-fl"), function (e) { return !!e.querySelector(".cs-fl-v svg") && !e.querySelector(".cs-fl-t") ; }).length;
        ok("1 flisen er enkel: navn + rød vinkel (ingen etiket, ingen tæller)", vink === 5 && document.querySelectorAll("#csStudioHost .cs-fl > span").length === 10, "fliser=" + vink);
        /* 2 · Tilbage */
        tilb(); await V(900);
        ok("2 Tilbage fra Content Studio fører til Hjem", !!document.getElementById("dside-overblik") && getComputedStyle(document.getElementById("dside-overblik")).display !== "none", "");
        csStudioAabn(); await V(1500);
        /* 3 · tomme skaller */
        var tomme = { "Skabeloner": "Der er ingen skabeloner endnu.", "Tekster til indholdssøjlerne": "Der er ingen tekster endnu.", "Guider": "Der er ingen guider endnu." };
        for (var nv in tomme) {
          klik([].filter.call(document.querySelectorAll("#csStudioHost .cs-fl"), function (e) { return e.textContent.trim() === nv; })[0]); await V(1200);
          ok("3 " + nv + ": titlen og en tom tilstand i husets form", titel() === nv && !!synlig().querySelector(".tom-kort") && synlig().querySelector(".tom-spm").textContent.trim() === tomme[nv], titel() + " ¦ " + ((synlig().querySelector(".tom-spm") || {}).textContent || ""));
          tilb(); await V(900);
          ok("3 " + nv + ": Tilbage fører til Content Studio", titel() === "Content Studio", titel());
        }
        /* 4 · Energidas Content Studio = den gamle side, uændret */
        klik([].filter.call(document.querySelectorAll("#csStudioHost .cs-fl"), function (e) { return e.textContent.trim() === "Energidas Content Studio"; })[0]); await vent("mro_contentstudio"); await V(600);
        var tg = [].map.call(document.querySelectorAll("#mro_contentstudio .bs3-doer, #mro_contentstudio .bs-doer"), function (e) { return e.textContent.trim(); }).filter(Boolean).join("|");
        ok("4 Energidas Content Studio åbner den gamle side (Citater, Velkomsthilsner, Beskrivelser, Kundetyper)", /Citater/.test(tg) && /Velkomsthilsner/.test(tg) && /Beskrivelser/.test(tg) && /Kundetyper/.test(tg) && titel() === "Energidas Content Studio", titel() + " ¦ " + tg.slice(0, 160));
        tilb(); await vent("mro_csstudio"); await V(500);
        ok("4 Tilbage fra den gamle side fører til Content Studio", titel() === "Content Studio", titel());
        /* 5 · Energidas idébank */
        klik([].filter.call(document.querySelectorAll("#csStudioHost .cs-fl"), function (e) { return e.textContent.trim() === "Energidas idébank"; })[0]); await V(2000);
        ok("5 siden hedder Energidas idébank og viser Ny idé, fire indholdssøjler og Senest", titel() === "Energidas idébank" && !!Q("#csIbHost .ibn-ny") && document.querySelectorAll("#csIbHost .ibn-sj").length === 4 && /Senest/.test(CR().textContent), titel());
        var kt = [].map.call(CR().querySelectorAll(".ibn-ide"), function (e) { return e.querySelector(".ibn-et").textContent.trim() + "§" + e.querySelector(".ibn-stat").textContent.trim(); });
        ok("5 kortene viser kode+navn og Kladde/Udgivet", kt.length === egDb().length && kt.some(function (x) { return /^1A Produkt§Udgivet$/.test(x); }) && kt.some(function (x) { return /§Kladde$/.test(x); }) && !kt.some(function (x) { return /^1A§|^1A\s*$/.test(x); }), kt.join(" ¦ "));
        /* 6 · skriv en idé */
        if (!PC) { klik(Q("#csIbHost .ibn-idefelt-tlf")); await V(500); }
        var tf = PC ? Q("#csIbHost .ibn-tekst") : Q("#bsFlytMenu .ibn-tekst");
        ok("6 idéfeltet har ikke noget placeholder, og mikrofonen står i feltet", !!tf && !tf.getAttribute("placeholder") && !!(PC ? Q("#csIbHost .ibn-idefelt .ibn-mik") : Q("#bsFlytMenu .ibn-idefelt .ibn-mik")), tf ? "placeholder=" + tf.getAttribute("placeholder") : "-");
        skriv(tf, "Vis en kunde, der pakker gaven ind"); await V(80);
        await tag("gave"); skriv(Q(".ibn-tagind"), "jul "); await V(150);
        ok("6 to tags", document.querySelectorAll((PC ? "#csIbHost" : "#bsFlytMenu") + " .ibn-tag").length === 2, "");
        klik(Q(".ibn-gemi")); await V(300);
        var sj = [].map.call(document.querySelectorAll(".ibn-gr:first-child .ibn-rk"), function (e) { return e.textContent.trim(); });
        ok("6 Gem i: indholdssøjlerne (1A Produkt · 1B Målgruppens situation · 2A Menneskene bag · 2B Bag om forretningen · Story)", sj.join("|") === "1A Produkt|1B Målgruppens situation|2A Menneskene bag|2B Bag om forretningen|Story", sj.join("|"));
        var mpl = [].map.call(document.querySelectorAll(".ibn-gr:nth-child(2) .ibn-rk"), function (e) { return e.textContent.trim(); });
        ok("6 Gem i: de mapper, der findes, og »+ Ny mappe«", mpl.indexOf("Jul") > -1 && mpl.indexOf("Nyheder") > -1 && mpl[mpl.length - 1] === "+ Ny mappe" && mpl.indexOf("") < 0, mpl.join("|"));
        klik(tekst(".ibn-rk", "1A")); await V(120); klik(tekst(".ibn-rk", "1B")); await V(120);
        ok("6 én indholdssøjle kan vælges", document.querySelectorAll(".ibn-gr:first-child .ibn-rk.valgt").length === 1, [].map.call(document.querySelectorAll(".ibn-rk.valgt"), function (e) { return e.textContent.trim(); }).join(","));
        klik(tekst(".ibn-rk", "Jul")); await V(120); klik(tekst(".ibn-rk", "Nyheder")); await V(120);
        ok("6 mappen er ét valg (Nyheder, ikke begge)", document.querySelectorAll(".ibn-gr:nth-child(2) .ibn-rk.valgt").length === 1 && !!tekst(".ibn-rk.valgt", "Nyheder"), "");
        klik(tekst(".ibn-rk", "+ Ny mappe")); await V(250);
        var nf = Q(".ibn-nyfelt-ind"); ok("6 + Ny mappe giver et tekstfelt", !!nf, "");
        skriv(nf, "Gaveguide 2026"); tast(nf, "Enter"); await V(400);
        ok("6 den nye mappe er valgt (og kun den)", !!tekst(".ibn-gr:nth-child(2) .ibn-rk.valgt", "Gaveguide 2026") && document.querySelectorAll(".ibn-gr:nth-child(2) .ibn-rk.valgt").length === 1, [].map.call(document.querySelectorAll(".ibn-rk.valgt"), function (e) { return e.textContent.trim(); }).join(","));
        if (PC) klik(Q(".ibn-spm")); else klik(Q(".ibn-faerdig")); await V(250);
        ok("6 Gem i viser indholdssøjle og mappe", /1B Målgruppens situation/.test(Q(".ibn-gemi").textContent) && /Gaveguide 2026/.test(Q(".ibn-gemi").textContent), Q(".ibn-gemi").textContent.trim());
        klik(PC ? Q("#csIbHost .ibn-gem") : Q("#bsFlytMenu .ibn-gem")); await V(300);
        ok("6 knappen siger Gemt", /Gemt/.test((Q(".ibn-gem") || {}).textContent || ""), (Q(".ibn-gem") || {}).textContent);
        await V(1800);
        var d1 = rk("Vis en kunde, der pakker gaven ind");
        ok("6 gemt som kladde (udgivet = false) med søjle, mappe og tags", !!d1 && d1.udgivet === false && /^1B/.test(d1.soejle) && d1.mappe === "Gaveguide 2026" && d1.tags.length === 2 && d1.titel.indexOf("Vis en kunde") === 0, JSON.stringify(d1 || {}).slice(0, 260));
        ok("6 idéen står øverst blandt kortene som Kladde", !!adm("Vis en kunde") && /Kladde/.test(adm("Vis en kunde").textContent) && /^1B Målgruppens situation/.test(adm("Vis en kunde").querySelector(".ibn-et").textContent.trim()), adm("Vis en kunde") ? adm("Vis en kunde").textContent.replace(/\s+/g, " ") : "-");
        ok("6 flisen er tømt efter gem", (PC ? Q("#csIbHost .ibn-tekst").value === "" && /^Gem i$/.test(Q("#csIbHost .ibn-gemi").textContent.trim()) : !Q("#bsFlytMenu .ibn-skrivark")), "");
        /* 7 · åbn kortet: ark med felt, tags, Udgivet + kontakt, Gem i og Gem */
        klik(adm("Vis en kunde")); await V(800);
        var ark = Q("#ibnNyArk");
        ok("7 arket hedder Energidas idé og har idéfelt, tags, Udgivet + kontakt, Gem i og Gem", !!ark && /Energidas idé/.test(ark.textContent) && ark.querySelector(".ibn-tekst").value.indexOf("Vis en kunde") === 0 && ark.querySelectorAll(".ibn-tag").length === 2 && !!ark.querySelector(".ibn-kontakt") && !!ark.querySelector(".ibn-gemi") && !!ark.querySelector(".ibn-gem") && !!ark.querySelector(".ibn-mik"), ark ? ark.textContent.replace(/\s+/g, " ").slice(0, 140) : "-");
        ok("7 arket er et lille ark midt på skærmen (computer) / et lavt ark nedefra (telefon)", PC ? (function () { var x = ark.getBoundingClientRect(), cw = document.documentElement.clientWidth; return Math.abs((x.left + x.right) / 2 - cw / 2) < 2 && x.width < 700 && x.top > 40; })() : (function () { var x = ark.getBoundingClientRect(), cw = document.documentElement.clientWidth; return x.bottom >= innerHeight - 1 && x.top > innerHeight * 0.25 && Math.abs(x.width - cw) <= 1; })(), b(ark) + " ¦ bredde " + document.documentElement.clientWidth);
        var kt0 = ark.querySelector(".ibn-kontakt"); ok("7 kontakten er slukket (kladde)", kt0.getAttribute("aria-checked") === "false" && getComputedStyle(kt0).backgroundColor === "rgb(222, 222, 222)", getComputedStyle(kt0).backgroundColor);
        klik(kt0); await V(700);
        var d2 = rk("Vis en kunde, der pakker gaven ind");
        ok("7 kontakten gemmer med det samme (udgivet = true) og er rød", d2.udgivet === true && Q("#ibnNyArk .ibn-kontakt").getAttribute("aria-checked") === "true" && getComputedStyle(Q("#ibnNyArk .ibn-kontakt")).backgroundColor === "rgb(252, 36, 4)", "udgivet=" + d2.udgivet + " " + getComputedStyle(Q("#ibnNyArk .ibn-kontakt")).backgroundColor);
        ok("7 kortet bagved siger nu Udgivet", /Udgivet/.test(adm("Vis en kunde").textContent) && !!adm("Vis en kunde").querySelector(".ibn-ud"), adm("Vis en kunde").textContent.replace(/\s+/g, " "));
        /* ret teksten og gem */
        var ta = Q("#ibnNyArk .ibn-tekst"); skriv(ta, "Vis en kunde, der pakker gaven ind — og siger tak"); await V(120);
        klik(Q("#ibnNyArk .ibn-gem")); await V(300); await V(1500);
        var d3 = rk("Vis en kunde, der pakker gaven ind");
        ok("7 Gem skriver rettelsen, og udgivet består", /siger tak/.test(d3.titel + (d3.beskrivelse || "")) && d3.udgivet === true, JSON.stringify(d3).slice(0, 200));
        ok("7 arket lukkede efter Gemt", !Q("#ibnNyArk"), "");
        /* sluk igen */
        klik(adm("Vis en kunde")); await V(700); klik(Q("#ibnNyArk .ibn-kontakt")); await V(700);
        ok("7 kontakten kan slukkes igen (udgivet = false)", rk("Vis en kunde").udgivet === false, "");
        /* 8 · fejl: afvist gemning ruller kontakten tilbage */
        localStorage.setItem("SELE_AFVIS", "fejl"); try { document.getElementById("husKvit").textContent = ""; } catch (e) {}
        klik(Q("#ibnNyArk .ibn-kontakt")); await V(900);
        ok("8 afvist: kontakten ruller tilbage og siger det", rk("Vis en kunde").udgivet === false && Q("#ibnNyArk .ibn-kontakt").getAttribute("aria-checked") === "false" && /Det blev ikke gemt\. Prøv igen\./.test((document.getElementById("husKvit") || {}).textContent || ""), ((document.getElementById("husKvit") || {}).textContent || ""));
        localStorage.removeItem("SELE_AFVIS");
        /* 9 · Slet med spørgsmål først */
        klik(Q("#ibnNyArk .ibn-ide-slet")); await V(500);
        var sp = Q("#bsFlytMenu .bs-flyt-ark");
        ok("9 Slet spørger først (og intet er slettet)", !!sp && /Slet idéen\?/.test(sp.textContent) && !!rk("Vis en kunde"), sp ? sp.textContent.replace(/\s+/g, " ").slice(0, 80) : "-");
        klik(tekst("#bsFlytMenu button", "Nej")); await V(500);
        ok("9 Nej beholder idéen", !!rk("Vis en kunde") && !!adm("Vis en kunde"), "");
        klik(adm("Vis en kunde")); await V(700); klik(Q("#ibnNyArk .ibn-ide-slet")); await V(500);
        var foer = egDb().length; klik(tekst("#bsFlytMenu button", "Ja, slet")); await V(900);
        ok("9 Ja, slet fjerner rækken i basen og kortet", egDb().length === foer - 1 && !rk("Vis en kunde") && !adm("Vis en kunde"), foer + "→" + egDb().length);
        ok("9 ingen testdata er tilbage (0 rækker med testmarkøren)", egDb().filter(function (x) { return /pakker gaven|Gaveguide 2026/.test((x.titel || "") + (x.mappe || "")); }).length === 0, "");
        /* 10 · en indholdssøjle viser sine idéer · Tilbage ét skridt */
        klik([].filter.call(CR().querySelectorAll(".ibn-sj"), function (e) { return /^1A/.test(e.textContent.trim()); })[0]); await V(600);
        var l1a = [].map.call(CR().querySelectorAll(".ibn-ide .ibn-et"), function (e) { return e.textContent.trim(); });
        ok("10 indholdssøjlen 1A viser kun 1A-idéer (kladder med)", l1a.length === 3 && l1a.every(function (t) { return t === "1A Produkt"; }), l1a.join("|"));
        tilb(); await V(700);
        ok("10 Tilbage fra indholdssøjlen = Energidas idébank", titel() === "Energidas idébank" && !!Q("#csIbHost .ibn-ny"), titel());
        tilb(); await V(900);
        ok("10 Tilbage fra Energidas idébank = Content Studio", titel() === "Content Studio", titel());
        /* 11 · Optagestudie */
        klik([].filter.call(document.querySelectorAll("#dsbDoere .dsb-doer"), function (e) { return /Optagestudie/.test(e.textContent); })[0] || { dispatchEvent: function () {} }); await V(1500);
        if (!PC) { try { dsbPanelSkift(false); } catch (e) {} await V(300); }
        var h2 = document.querySelector("#dside-klip .klip-hoved .ch-titel");
        ok("11 Optagestudie åbner kursusoptagelsen med overskriften Optagestudie", !!h2 && h2.textContent.trim() === "Optagestudie" && getComputedStyle(document.getElementById("dside-klip")).display !== "none", h2 ? h2.textContent : "-");
        ok("11 intet sted i Backstage siger længere Energida Studio om den side", !/Energida Studio/.test(document.getElementById("dashboard").innerText) , (document.getElementById("dashboard").innerText.match(/.{30}Energida Studio.{20}/) || [""])[0]);
        ok("11 ingen uventede fejl i konsollen", (r.fejlliste || []).filter(function (x) { return !/afvist \(sele\)|SYNC-FEJL/.test(x); }).length === 0, JSON.stringify(r.fejlliste || []));
    
        /* LÅS-MÅLING · Backstage › Content Studio */
        if (!PC) { var mere = [].filter.call(document.querySelectorAll("#dashBundnav button"), function (e) { return /Mere/.test(e.textContent); })[0]; klik(mere); await V(600); }
        csStudioAabn(); await V(1800); if (!PC) { try { dsbPanelSkift(false); } catch (e) {} await V(300); }
        var S = document.getElementById("csStudioHost");
        kanterL(".cs-fl", S, "Content Studio", PC ? 4 : 2); rkEns(".cs-gitter:first-of-type .cs-fl, .cs-gitter .cs-fl", S, "fliserne på Content Studio", 2); skyg(".cs-fl", S, "Content Studio"); streg(".cs-sek", S, "Content Studio");
        audit(S, "Content Studio"); vandret("Content Studio");
        var vk = [].map.call(S.querySelectorAll(".cs-fl-v svg"), function (e) { return getComputedStyle(e).stroke; }); ok("vinklerne er røde", vk.length === 5 && vk.every(function (x) { return x === "rgb(252, 36, 4)"; }), vk.join(","));
        var hj = [].map.call(S.querySelectorAll(".cs-fl"), function (e) { return Math.round(e.getBoundingClientRect().height); }); ok("fliserne i første række er lige høje", (function () { var a = hj.slice(0, 4); return Math.max.apply(null, a) - Math.min.apply(null, a) <= 2; })(), hj.join(","));
        var hf = getComputedStyle(document.querySelector("#mro_csstudio .ch-titel")).fontFamily; ok("Didot kun i markbåndets titel", /Didot|Bodoni|Georgia|serif/i.test(hf) && ![].some.call(S.querySelectorAll("*"), function (e) { return /Didot|Bodoni/i.test(getComputedStyle(e).fontFamily); }), hf.slice(0, 40));
        /* tomme skaller */
        for (var id of ["csskabeloner", "cstekster", "csguider"]) { mrGaaTil(id); await V(1500); var o = document.getElementById("mro_" + id); var tk = o.querySelector(".tom-kort"); ok("tom skal: " + id, !!tk && !o.querySelector(".cs-fl") && tk.textContent.trim().length > 5 && !/\.\s+\S+\./.test(tk.textContent.trim()), tk ? tk.textContent.trim() : "-"); audit(o.querySelector(".cs-side"), "tom skal " + id); }
        /* Energidas idébank */
        csIbAabn(); await V(2200); var R = document.querySelector("#csIbHost .ibn-rod");
        kanterL(".ibn-fl", R, "Energidas idébank", PC ? 4 : 2); rkEns(".ibn-sj", R, "indholdssøjlerne", 2); rkEns(".ibn-ide", R, "kortene", 2); skyg(".ibn-fl", R, "Energidas idébank"); streg(".ibn-sek", R, "Energidas idébank"); audit(R, "Energidas idébank"); vandret("Energidas idébank");
        var st = [].map.call(R.querySelectorAll(".ibn-stat i"), function (e) { var c = getComputedStyle(e); return (e.classList.contains("ibn-ud") ? "ud:" + c.backgroundColor : "kl:" + c.borderTopColor + "/" + c.backgroundColor); });
        ok("Udgivet er en rød prik og Kladde en tom grå cirkel", st.some(function (x) { return x === "ud:rgb(252, 36, 4)"; }) && st.some(function (x) { return x === "kl:rgb(104, 104, 104)/rgba(0, 0, 0, 0)"; }), st.slice(0, 4).join(" "));
        var sb2 = [].map.call(R.querySelectorAll(".ibn-stat"), function (e) { return Math.round(e.getBoundingClientRect().left) - Math.round(e.closest(".ibn-ide").getBoundingClientRect().left); }); ok("Kladde/Udgivet står i kortets venstre kant (samme indrykning)", sb2.every(function (x) { return x === sb2[0]; }), sb2.slice(0, 5).join(","));
        var ny = R.querySelector(".ibn-ny"); var gi = ny.querySelector(".ibn-gemi"), gm = ny.querySelector(".ibn-gem");
        if (PC) { ok("Gem i er lyseblå med grå kant, Gem rød", getComputedStyle(gi).backgroundColor === "rgb(244, 247, 250)" && getComputedStyle(gi).borderTopColor === "rgb(222, 222, 222)" && getComputedStyle(gm).backgroundColor === "rgb(252, 36, 4)" && getComputedStyle(gm).color === "rgb(255, 255, 255)", getComputedStyle(gi).backgroundColor + " " + getComputedStyle(gm).backgroundColor); }
        else { var tl = ny.querySelector(".ibn-idefelt-tlf"); ok("telefonens flise har idéfelt med mikrofon", !!tl && !!tl.querySelector(".ibn-mik") && !ny.querySelector(".ibn-gem"), ""); }
        var mikrof = !!ny.querySelector(".ibn-mik") ; ok("mikrofonen står i idéfeltet", mikrof, "");
        var ta = ny.querySelector("textarea.ibn-tekst"); ok("idéfeltet har intet placeholder, tagsfeltet har »Tags«", (PC ? !ta.getAttribute("placeholder") && ny.querySelector(".ibn-tagind").getAttribute("placeholder") === "Tags" : true), "");
        /* arket til en idé */
        klik([].filter.call(R.querySelectorAll(".ibn-ide"), function (e) { return /Udgivet/.test(e.textContent); })[0]); await V(800);
        var ark = Q("#ibnNyArk"); audit(ark, "arket til en idé", ".ibn-lavt-slor");
        var kt = ark.querySelector(".ibn-kontakt"); var kk = kt.getBoundingClientRect(), kb = getComputedStyle(kt);
        ok("kontakten er rød, når den er tændt, og 44 i trykfelt", kb.backgroundColor === "rgb(252, 36, 4)" && (kk.height + 18) >= 44, kb.backgroundColor + " " + Math.round(kk.width) + "x" + Math.round(kk.height));
        var fed = [].some.call(ark.querySelectorAll("*"), function (e) { return parseInt(getComputedStyle(e).fontWeight, 10) > 400 && (e.textContent || "").trim(); }); ok("intet er fedt i arket", !fed, "");
        var sl = ark.querySelector(".ibn-ide-slet"); ok("Slet er et almindeligt rækkepunkt (rød tekst, ikke fed, mindst 44 høj)", !!sl && getComputedStyle(sl).color === "rgb(252, 36, 4)" && sl.getBoundingClientRect().height >= 44, sl ? getComputedStyle(sl).color + " " + Math.round(sl.getBoundingClientRect().height) : "-");
        var rj = [].map.call(ark.querySelectorAll(".ibn-tekst, .ibn-tagsfelt, .ibn-udgivet, .ibn-gemlinje"), function (e) { var x = e.closest(".ibn-idefelt, .ibn-tagsfelt, .ibn-udgivet, .ibn-gemlinje").getBoundingClientRect(); return Math.round(x.left) + "-" + Math.round(x.right); }).filter(function (x, i, l) { return l.indexOf(x) === i; });
        ok("felter og rækker i arket er lige brede (samme mål)", rj.length === 1, rj.join(" "));
        var gi2 = ark.querySelector(".ibn-gemi").getBoundingClientRect(), gm2 = ark.querySelector(".ibn-gem").getBoundingClientRect(); ok("Gem i og Gem lige høje, 8 eller 12 imellem", Math.abs(gi2.height - gm2.height) <= 1 && (Math.round(gm2.left - gi2.right) === 8 || Math.round(gm2.left - gi2.right) === 12), Math.round(gm2.left - gi2.right) + "/" + Math.round(gi2.height));
        ibnArkLuk(); await V(300);
    

    csStudioAabn(); await V(900); csIbAabn(); await V(1500);
    var dba = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); dba.energida_idebank = []; localStorage.setItem("SELE_DB", JSON.stringify(dba)); CS_IB.hentet = false; await csIbHent(true); await V(500);
    ok("admin uden idéer: tom tilstand i husets form og Ny idé-flisen står", !!document.querySelector("#csIbHost .tom-kort") && !!document.querySelector("#csIbHost .ibn-ny"), (document.querySelector("#csIbHost .tom-spm") || {}).textContent);
    var fejlSvar2 = function () { return Promise.resolve({ data: null, error: { message: "fejl (prøve)" } }); };
    var fra1 = sb.from; sb.from = function (t) { if (t === "energida_idebank") { return { select: function () { return { order: fejlSvar2 }; } }; } return fra1.apply(sb, arguments); };
    await csIbHent(true); await V(500);
    ok("admin med en tabel, der svarer med fejl: siden går ikke i stykker og siger det", !!document.querySelector("#csIbHost .ibn-ny") && /kunne ikke hentes/.test((document.querySelector("#csIbHost .tom-spm") || {}).textContent || ""), (document.querySelector("#csIbHost .tom-spm") || {}).textContent);
    sb.from = fra1;

    }

  } catch (e) { fejl.push("proben fejlede: " + (e && e.message) + " " + String(e && e.stack || "").split("\n")[1]); }
  var uventet = r.fejlliste.filter(function (x) { return !/afvist \(sele\)|SYNC-FEJL|fejl \(prøve\)/.test(x); });
  if (uventet.length) fejl.push("uventede fejl i konsollen: " + JSON.stringify(uventet).slice(0, 300));
  fejl.forEach(function (f) { console.log("SELE CONTENTSTUDIO FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE CONTENTSTUDIO FEJL " + innerWidth + ": " + fejl.length + " fund (" + FLADE + ")" : "SELE CONTENTSTUDIO OK " + innerWidth + ": " + n + " målinger (" + (FLADE === "dash" ? "Backstage: menuen, Content Studio med fire fliser og Energidas eget, tomme skaller, Energidas idébank med kladde, mappe, Udgivet-kontakt og Slet, låsene" : "kunden: to faner, kun udgivne idéer, Gem med brief.fraEnergida, Gemt, tom tilstand og fejl, låsene") + ")");
})();
