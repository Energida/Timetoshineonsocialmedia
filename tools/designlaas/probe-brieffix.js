/* BRIEFENS RENE FEJL LÅST I PORTEN (review 25/11, R1–R24; Ida 25/11: »Kan du ikke godt se at det hele er fejl fordi det ikke er blevet bygget kritisk og grundigt?«).
   Hvert fund fra gennemgangen er en måling her, så det ikke kan komme igen. koer.sh kører proben tre gange: 390×844, 1440×940 og 390×500 (tastaturet er åbent: synlig højde 500).
   FIX_TAST = true → kun tastatur-prøverne (R23) og træk-ned (R24). Ellers briefens prøver på den bredde, selen har:
   (1) KNAP I RAMMEN (R4, R5): hver tilføj-knap (»+ …«-chips i scenerne og hookets ramme, »+ Tilføj« under Fakta) står inde i den afsnitsramme, den tilføjer til.
   (2) CHIP FOR NOGET, DER FINDES (R2): står feltet »Tekst på skærmen« / »Hvad siger du?« i klippet (hookets klip eller scenens sidste klip), står chippen for det ikke.
       En chiprække, der er bredere end rammen, ruller sidelæns (overflow-x auto/scroll) — »+ Scene« er aldrig klippet uden at kunne nås.
   (3) CIRKEL UNDER SKRIVNING (R3, R14): skriverækken i hver forslagsliste har ingen cirkel og flytter sig 0 px, når der står tekst i den; den har en pladsholder.
   (4) FELTER I EN RAMME (Idas c, R15): enkeltfelterne i Idéens ramme og forslagslisterne er lige brede (±1) og flugter; et tomt felt, hvis pladsholder står på én linje, er 48 høj; dropdownen 44.
   (5) TEKST TO GANGE PÅ SLIDE 1 (R1): en karrusel, hvor slide 1 har sin egen tekst, får et andet hook valgt — slide 1's tekst er uændret, og intet lag gentager en anden lags tekst.
   (6) TITLEN (R7): er titlen bredere end pladsen på computeren, slutter den med »…« (text-overflow: ellipsis på en blok, ikke en flex-række).
   (7) TASTATURET (R23): i »Gem i« (ny mappe) og i sendefelt-arket (Ny mappe) står det fokuserede felt, dets knap og »Færdig« helt over tastaturet, når den synlige højde falder til 500 efter fokus; feltet har autocomplete="off".
   (9) KORT REEL (N1) · (10) OPTAG/POST PÅ COMPUTEREN (N2) · (11) ÅBNE OG BLADRE SKRIVER INTET (N9) — gennemgang 2, 25/11. (12) COVERET ER DET VALGTE FORSLAG (F1) — gennemgang 3, 26/11.
   (8) TRÆK NED (R24): siden og rullefladen gummibånder ikke (overscroll-behavior-y: none på html, body og .content), og coveret står øverst ved rulning 0. */
var TAST = (typeof FIX_TAST === "boolean") ? FIX_TAST : false;
var V = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
var FUND = [], N = 0, TRIN = "start";
function synlig(e) { if (!e || !e.getClientRects().length) return false; var r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; for (var x = e; x && x.nodeType === 1; x = x.parentElement) { var cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false; } return true; }
function alle(sel, rod) { return [].filter.call((rod || document).querySelectorAll(sel), synlig); }
function q(e) { return e.getBoundingClientRect(); }
function tekst(e) { return ((e && e.innerText) || "").replace(/\s+/g, " ").trim(); }
function fund(regel, hvad) { N++; FUND.push(regel + ": " + hvad + " (" + TRIN + ", " + innerWidth + "×" + innerHeight + ")"); }
function tjek(ok, regel, hvad) { N++; if (!ok) FUND.push(regel + ": " + hvad + " (" + TRIN + ", " + innerWidth + "×" + innerHeight + ")"); }
function ryd() { ["appLoader", "turOverlay", "dagensKort", "nyVersion"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); }); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {} }
var RAMME = ".kk-scene, .fb-boks, .kv-flise, #briefWrap > .sk-q, .basis-kort.b3-ide, #briefKlip1Vaert, .klip-kort.kk-cta, .cap-q, #kvRod.kv-rod";
function iRamme(e) { var r = e.matches(".fb-pil-tilfoej") ? e.closest(".fb-boks") : e.closest("#briefKlipHolder, #briefKlip") ? e.closest(".kk-scene") : e.closest(RAMME); if (!r) return false; var a = q(r), b = q(e); return b.left >= a.left - 0.5 && b.right <= a.right + 0.5 && b.top >= a.top - 0.5 && b.bottom <= a.bottom + 0.5; }
function rulBar(row) { var o = getComputedStyle(row).overflowX; return row.scrollWidth <= row.clientWidth + 1 || o === "auto" || o === "scroll"; }

/* (1) + (2) */
function knapperOgChips(navn) {
  TRIN = navn;
  alle("#briefWrap .ark-chip, #briefWrap .fb-pil-tilfoej, #briefRail .fb-pil-tilfoej").forEach(function (c) {
    var t = tekst(c); if (!(/^\+/.test(t) || c.querySelector(".chip-plus") || c.matches(".fb-pil-tilfoej"))) return;
    var rk = c.parentElement; var klippet = (function () { var a = q(rk), b = q(c); return b.right > a.right + 0.5 || b.left < a.left - 0.5; })();
    if (klippet) { tjek(rulBar(rk), "CHIPRÆKKEN RULLER IKKE", "»" + t + "« er klippet af rækken, og rækken ruller ikke sidelæns (overflow-x " + getComputedStyle(rk).overflowX + ")"); return; }
    tjek(iRamme(c), "KNAP UDEN FOR RAMMEN", "»" + t + "« står ikke inde i den afsnitsramme, den tilføjer til");
  });
  /* hookets klip */
  var hk = document.getElementById("kkHookTilfoej");
  if (hk) ["tekst", "siger"].forEach(function (t) { var d = document.querySelector('.kk-hookdel[data-t="' + t + '"]'); var c = hk.querySelector('.ark-chip[data-t="' + t + '"]');
    if (d && synlig(d)) tjek(!(c && synlig(c)), "CHIP FOR NOGET, DER FINDES", "feltet »" + (t === "tekst" ? "Tekst på skærmen" : "Hvad siger du?") + "« står i hookets klip, men chippen for det står der også"); });
  /* scenernes sidste klip */
  alle("#briefKlip .kk-scene").forEach(function (sc) {
    var kort = alle(".klip-kort", sc); var sidst = kort[kort.length - 1]; if (!sidst) return;
    var chips = alle(".ark-chip", sidst).map(tekst);
    [["_tekst", "Tekst på skærmen"], ["_siger", "Hvad siger du?"]].forEach(function (p) {
      var f = [].filter.call(sidst.querySelectorAll('textarea[id$="' + p[0] + '"]'), synlig)[0];
      if (f) tjek(chips.indexOf("+ " + p[1]) < 0 && !chips.some(function (x) { return x.replace(/^\+\s*/, "") === p[1]; }), "CHIP FOR NOGET, DER FINDES", "klippet har feltet »" + p[1] + "«, men chippen »+ " + p[1] + "« står under det");
    });
  });
}
/* (3) */
async function skrivRaekker(navn) {
  TRIN = navn;
  var lister = alle('[id^="forslag_"]').filter(function (l) { return l.querySelector(".fs-rk"); });
  for (var i = 0; i < lister.length; i++) {
    var rks = alle(".fs-rk", lister[i]); var s = rks[rks.length - 1]; if (!s) continue; var ta = s.querySelector("textarea"); if (!ta || ta.value) continue;
    var cirkel = function () { return [].filter.call(s.querySelectorAll(":scope > button:not(.row-btn)"), synlig)[0]; };
    var f0 = q(ta), c0 = cirkel();
    tjek(!!String(ta.placeholder || "").trim(), "SKRIVERÆKKEN UDEN PLADSHOLDER", lister[i].id + ": den tomme række har ingen pladsholder");
    ta.value = "Ny tekst"; ta.dispatchEvent(new Event("input", { bubbles: true })); await V(120);
    var f1 = q(ta), c1 = cirkel();
    tjek(!c1, "CIRKEL UNDER SKRIVNING", lister[i].id + ": en cirkel dukker op i skriverækken ved første tegn");
    tjek(Math.abs(f1.left - f0.left) <= 0.5 && Math.abs(f1.top - f0.top) <= 0.5 && Math.abs(f1.height - f0.height) <= 0.5, "HOP UNDER SKRIVNING", lister[i].id + ": feltet flytter sig " + Math.round(f1.left - f0.left) + "/" + Math.round(f1.top - f0.top) + " px og " + Math.round(f1.height - f0.height) + " px i højden ved første tegn");
    ta.value = ""; ta.dispatchEvent(new Event("input", { bubbles: true })); await V(60);
    /* felterne i listen flugter: samme venstre- og højrekant (cirklen står inde i feltet) */
    var kant = rks.map(function (r) { var t = r.querySelector("textarea"); return t && synlig(t) ? [Math.round(q(t).left), Math.round(q(t).right)] : null; }).filter(Boolean);
    kant.forEach(function (k) { tjek(Math.abs(k[0] - kant[0][0]) <= 1 && Math.abs(k[1] - kant[0][1]) <= 1, "FELTERNE FLUGTER IKKE", lister[i].id + ": felterne står " + kant.map(function (x) { return x.join("–"); }).join(" · ")); });
  }
}
/* (4) */
function feltStr(navn) {
  TRIN = navn;
  alle("#briefWrap .basis-kort.b3-ide, #briefWrap .kv-flise:not(.kv-stor)").forEach(function (rm) {
    var f = alle("textarea.sk-input, textarea.mb-felt, .bdrop > .bdrop-knap", rm).filter(function (e) { return !e.closest(".fs-rk:not(:last-child)"); });
    if (f.length < 2) return; var L = Math.round(q(f[0]).left), R = Math.round(q(f[0]).right);
    f.forEach(function (e) { var a = q(e); tjek(Math.abs(a.left - L) <= 1 && Math.abs(a.right - R) <= 1, "FELTER I RAMMEN ER IKKE LIGE BREDE", (e.id || e.className) + " står " + Math.round(a.left) + "–" + Math.round(a.right) + ", det første " + L + "–" + R);
      if (e.matches(".bdrop-knap")) { tjek(Math.abs(a.height - 44) <= 1, "DROPDOWN IKKE 44", "dropdownen er " + Math.round(a.height) + " høj"); var cs0 = getComputedStyle(e); tjek(cs0.color === "rgb(26, 26, 26)", "DROPDOWNENS TEKST IKKE SORT", "»" + tekst(e) + "« står i " + cs0.color); return; }
      if (e.value || !rm.matches(".b3-ide") || !String(e.placeholder || "").trim()) return; var cs = getComputedStyle(e); var lh = parseFloat(cs.lineHeight) || 22;
      var maal = document.createElement("span"); maal.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font:" + cs.font; maal.textContent = e.placeholder || ""; document.body.appendChild(maal);
      var brede = maal.getBoundingClientRect().width; maal.remove();
      var plads = a.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (brede <= plads - 2) tjek(Math.abs(a.height - 48) <= 1, "ENKELTLINJEFELT IKKE 48", (e.id || "felt") + " med pladsholderen på én linje er " + Math.round(a.height) + " højt");
    });
  });
}
/* (5) */
async function slide1() {
  TRIN = "karrusel · Fang dem · slide 1";
  var B = BRIEF_STATE; var foer = String((B.slides || [])[0] || "");
  var liste = B.hookTekstListe || []; var andet = liste.findIndex(function (t, i) { return i !== B.hookTekstValgt && String(t || "").trim(); });
  if (andet < 0) { fund("DÆKNING", "karrusellen har intet andet hook at vælge"); return; }
  briefForslagVaelg("hookTekst", andet); await V(400);
  tjek(String((BRIEF_STATE.slides || [])[0] || "") === foer, "SLIDE 1'S TEKST OVERSKREVET", "slide 1 hed »" + foer.slice(0, 40) + "«, nu »" + String((BRIEF_STATE.slides || [])[0] || "").slice(0, 40) + "«");
  var d = cvDesign("0", false); var tt = (d.lag || []).map(function (l) { return String(cvTekst(l, "0") || "").replace(/\W/g, "").toLowerCase(); }).filter(Boolean);
  tjek(tt.length === new Set(tt).size, "TEKST TO GANGE PÅ SLIDE 1", "to lag på slide 1 viser samme tekst");
}
/* (12) COVERET ER DET VALGTE FORSLAG (gennemgang 3, F1, 26/11): kunden valgte forslag 2, rettede teksten i coverarket og valgte bagefter forslag 1 — det lille billede viste forslag 1, men det rigtige cover (det, der hentes og postes) beholdt den rettede tekst, også efter genindlæsning.
   Målt: efter rettelsen i arket står den rettede tekst som det valgte forslag; efter valget af forslag 1 viser coverets lag forslag 1; den rettede tekst står stadig i listen (intet tabt). */
async function coverForslag() {
  TRIN = "Reel · coverarket ↔ forslagene";
  briefForslagVaelg("thumb", 1); await V(500);
  b3Vaelg("post"); await V(1200);
  var kb = alle("#screen7 .pf-cv-b")[0]; if (!kb) { fund("DÆKNING", "ingen knap til coverarket på Post"); return; }
  kb.click(); await V(1500);
  var ta = document.getElementById("cvTekst"); if (!ta || !synlig(ta)) { fund("DÆKNING", "coverarkets tekstfelt åbnede ikke"); return; }
  var ny = String(ta.value || "") + " (egen tekst)"; ta.focus(); ta.value = ny; ta.dispatchEvent(new Event("input", { bubbles: true })); await V(400);
  var luk = document.querySelector("#cvEd .cv-luk"); if (luk) luk.click(); await V(1200);
  var L = function () { return (BRIEF_STATE.thumbListe || []).map(function (t) { return String(t || "").trim(); }); };
  var lagT = function () { var d = cvDesign("cover", false); var l = (d.lag || []).filter(function (x) { return x && (x.kilde === "thumb" || x.kilde === "hook"); })[0]; return l ? String(cvTekst(l, "cover") || "").trim() : null; };
  tjek(L()[BRIEF_STATE.thumbValgt] === ny.trim(), "COVERET OG FORSLAGET ER TO TEKSTER", "efter rettelsen i coverarket er det valgte forslag »" + (L()[BRIEF_STATE.thumbValgt] || "") + "«, coveret »" + ny.trim() + "«");
  b3Vaelg("skriv"); await V(900); briefProcesGaa(1); await V(1100);
  briefForslagVaelg("thumb", 0); await V(600);
  tjek(lagT() === L()[0], "COVERET FØLGER IKKE DET VALGTE FORSLAG", "forslag 1 »" + L()[0] + "« er valgt, men coveret viser »" + lagT() + "«");
  tjek(L().indexOf(ny.trim()) > -1, "RETTET TEKST TABT", "»" + ny.trim() + "« står ikke længere i forslagslisten");
}
/* (6) */
function titel() {
  TRIN = "titlen"; if (innerWidth < 900) return;
  var mn = alle("#screen7 .mb-navn")[0]; if (!mn) { fund("DÆKNING", "ingen titel fundet"); return; }
  var t = mn.querySelector(".mb-titel-ord") || mn;
  if (t.scrollWidth > t.clientWidth + 1) { var cs = getComputedStyle(t); tjek(cs.textOverflow === "ellipsis" && !/flex|grid/.test(cs.display), "TITLEN KLIPPES UDEN »…«", "titlen er " + t.scrollWidth + " bred i " + t.clientWidth + " (text-overflow " + cs.textOverflow + ", display " + cs.display + ")"); }
  else fund("DÆKNING", "titlen var ikke lang nok til at prøve »…«");
}
/* (7) — tastaturet kommer EFTER fokus (som på en telefon): selens ramme går fra 844 til 500 i højden, mens feltet har fokus */
var FULD = 0;
async function tastaturOp() { try { if (window.frameElement) { window.frameElement.style.height = "500px"; } } catch (e) {} await V(200); try { void document.body.offsetHeight; window.dispatchEvent(new Event("resize")); if (window.visualViewport) window.visualViewport.dispatchEvent(new Event("resize")); } catch (e) {} await V(600); }   /* i selens virtuelle tid kommer telefonens resize-hændelse ikke af sig selv — den sendes, som telefonen sender den, når tastaturet er oppe */
function tastaturNed() { try { if (window.frameElement && FULD) window.frameElement.style.height = FULD + "px"; } catch (e) {} }
async function tastatur() {
  try { FULD = window.frameElement ? window.frameElement.getBoundingClientRect().height : 0; } catch (e) {}
  var over = function (navn, felt, knap, fod) {
    TRIN = navn; if (!felt) { fund("DÆKNING", navn + ": feltet blev ikke fundet"); return; }
    var h = window.visualViewport ? visualViewport.height : innerHeight;
    [[felt, "feltet"], [knap, "knappen"], [fod, "»Færdig«"]].forEach(function (p) { if (!p[0]) return; var r = q(p[0]); tjek(r.top >= -0.5 && r.bottom <= h + 0.5, "FELT UNDER TASTATURET", navn + ": " + p[1] + " står " + Math.round(r.top) + "–" + Math.round(r.bottom) + ", synlig højde " + Math.round(h)); });
    tjek(felt.getAttribute("autocomplete") === "off", "AUTOUDFYLD KONTAKT", navn + ": feltet har ikke autocomplete=\"off\"");
  };
  try { showTab(2); } catch (e) {} await V(900); ryd();
  try { ibnArkAabn("Vis den nye lampe i vinduet"); } catch (e) {} await V(700);
  var g = alle(".ibn-gemi")[0]; if (g) g.click(); await V(600);
  var ny = alle(".ibn-lavt .ibn-rk-ny")[0]; if (ny) ny.click(); await V(500);
  var ind = document.querySelector(".ibn-nyfelt-ind"); if (ind) { ind.focus(); await V(300); await tastaturOp(); }
  over("Gem i · ny mappe", ind, document.querySelector(".ibn-nyfelt .ibn-tilfoej"), document.querySelector(".ibn-lavt .ibn-faerdig"));
  try { ibnGemILuk(); } catch (e) {} try { ibnArkLuk(); } catch (e) {} await V(400);
  try { inspNavnArk("Ny mappe", "Navn på mappen", "", "1"); } catch (e) {} await V(700);
  var f2 = document.getElementById("inspNavnFelt"); if (f2) { tastaturNed(); await V(400); f2.focus(); await V(300); await tastaturOp(); }
  over("Ny mappe (inspiration)", f2, f2 && f2.parentElement.querySelector(".sendfelt-knap"), null);
  try { bsFlytLuk(); } catch (e) {} await V(300);
}
/* (8) */
async function traekNed() {
  TRIN = "træk ned";
  [["html", document.documentElement], ["body", document.body], [".content", document.querySelector(".content")]].forEach(function (p) { if (!p[1]) return; tjek(getComputedStyle(p[1]).overscrollBehaviorY === "none", "HVIDT HUL VED TRÆK NED", p[0] + " har overscroll-behavior-y " + getComputedStyle(p[1]).overscrollBehaviorY + " (skal none, så siden aldrig gummibånder over coveret)"); });
  for (var s = 0; s < 2; s++) { try { showTab([8, 2][s]); } catch (e) {} await V(900); ryd(); var c = document.querySelector(".content"); if (c) c.scrollTop = 0; await V(200);
    var b = alle(".mb-baand")[0]; if (b) tjek(q(b).top <= 1, "HVIDT HUL OVER COVERET", "coveret står " + Math.round(q(b).top) + " px nede ved rulning 0 (" + ["kalenderen", "idébanken"][s] + ")"); }
}
/* (9) KORT REEL MED APPENS VÆRDI (N1, gennemgang 2): »Kort-reel« får den nye brief — hookkortet »Scene 1 · Hooket« i sin ramme, ingen »+ Manus«, intet løst »+ CTA i videoen« */
function kortReel(navn) {
  TRIN = navn;
  var hk = document.querySelector("#briefKlip1Vaert .kk-hookdel"); tjek(!!hk && synlig(document.getElementById("briefKlip1Vaert")), "KORT REEL I DEN GAMLE BRIEF", "hookkortet (Scene 1 · Hooket) står ikke under Fang dem");
  var gl = alle("#briefWrap .ark-chip, #briefWrap button").filter(function (b) { return /Manus|CTA i videoen/.test(tekst(b)); }); tjek(!gl.length, "KORT REEL I DEN GAMLE BRIEF", "den gamle brief står: " + gl.map(tekst).join(", "));
}
/* (10) OPTAG OG POST PÅ COMPUTEREN (N2): upload-knapperne står i deres ramme i midten, aldrig løst i venstre spalte; et tomt Optag er en ramme, ikke et skyggekort */
function optagPost(navn) {
  TRIN = navn; if (innerWidth < 900) return;
  tjek(!alle("#briefRail .b3-upl-kn, #b3Upl").length, "UPLOAD UDEN FOR RAMMEN", "»Upload …« står løst i venstre spalte");
  alle("#briefForside .b3-upl-kn, #briefForside .cv-upload").forEach(function (k) { var r = k.closest("#briefForside > .pf-flise"); tjek(!!r && r.contains(k), "UPLOAD UDEN FOR RAMMEN", "»" + tekst(k) + "« står ikke i en ramme"); });
  alle("#briefForside .b3-tomt").forEach(function (k) { tjek(getComputedStyle(k).boxShadow === "none" && k.classList.contains("b3-afs"), "TOMT OPTAG SOM SKYGGEKORT", "Optag på et tomt opslag er et kort med skygge, ikke en ramme"); });
}
var LANG = "3 spørgsmål der hjælper dig med at få den bedste julefrokost, også når hele teamet er samlet";
var VAGT = setTimeout(function () { console.log("SELE BRIEFFIX FEJL: proben nåede ikke i mål — sidste trin: " + TRIN); }, 200000);
setTimeout(async function () { try {
  for (var v = 0; v < 40 && !document.body.classList.contains("app-klar"); v++) await V(150);
  ryd(); await V(300);
  if (TAST) { await tastatur(); await traekNed(); }
  else {
    IDEER.push({ id: "fx-reel", titel: "3 spørgsmål inden du vælger dit julefrokosttøj til hele teamet i butikken", soejle: "Menneskene bag", type: "Reel", status: "Brief i gang", dato: "2026-11-27", brief: { format: "Reel", beskrivelse: "Vi viser tre spørgsmål.", hookTekstListe: [LANG, "Hvad skal du have på til julefrokosten?"], hookTekstValgt: 1, hookTekst: "Hvad skal du have på til julefrokosten?", hashtags: "#julefrokost", thumbListe: ["Tre spørgsmål før julefrokosten", "Hvad skal du have på?"], thumbValgt: 0, thumb: "Tre spørgsmål før julefrokosten" } });
    IDEER.push({ id: "fx-tom", titel: "Ny idé", soejle: "", type: "Reel", status: "Forslag", dato: "2026-11-29", brief: {} });
    IDEER.push({ id: "fx-kr", titel: "Kort reel med appens værdi", soejle: "Menneskene bag", type: "Kort-reel", status: "Brief i gang", dato: "2026-11-30", brief: { format: "Kort-reel", hookTekstListe: ["Lyset i butikken kl. 16"], hookTekstValgt: 0, hookTekst: "Lyset i butikken kl. 16" } });
    IDEER.push({ id: "fx-karr2", titel: "Karrusel, der kun åbnes", soejle: "Menneskene bag", type: "Karrusel", status: "Brief i gang", dato: "2026-11-28", brief: { format: "Karrusel", slides: ["Slide et", "Slide to"], hookTekstListe: ["Slide et"], hookTekstValgt: 0, hookTekst: "Slide et" } });
    IDEER.push({ id: "fx-karr", titel: "5 måder at dække julebordet på", soejle: "Menneskene bag", type: "Karrusel", status: "Brief i gang", dato: "2026-11-28", brief: { format: "Karrusel", slides: ["5 måder at dække julebordet på, så gæsterne taler om det bagefter", "Den hvide dug", "Messing og lys"], hookTekstListe: ["5 måder at dække julebordet på", LANG], hookTekstValgt: 0, hookTekst: "5 måder at dække julebordet på" } });
    TRIN = "åbn reel"; openBriefSide("fx-reel"); await V(1800); ryd();
    titel();
    briefProcesTrin(0); await V(900); knapperOgChips("Reel · Fakta");
    briefProcesTrin(1); await V(900); feltStr("Reel · Idéen");
    briefProcesGaa(1); await V(1100); knapperOgChips("Reel · Fang dem"); await skrivRaekker("Reel · Fang dem");
    /* tilføj »Hvad siger du?« med chippen — så må chippen ikke stå */
    var cs = document.querySelector('#kkHookTilfoej .ark-chip[data-t="siger"]'); if (cs && synlig(cs)) { cs.click(); await V(500); knapperOgChips("Reel · Fang dem efter »+ Hvad siger du?«"); }
    briefProcesGaa(2); await V(1100); try { briefSceneNy(); } catch (e) {} await V(900);
    knapperOgChips("Reel · Fasthold dem · scene 2");
    var ct = alle("#briefKlip .ark-chip").filter(function (c) { return /Tekst på skærmen/.test(tekst(c)); }).pop(); if (ct) { ct.click(); await V(700); knapperOgChips("Reel · Fasthold dem · efter »+ Tekst på skærmen«"); }
    briefProcesGaa(1); await V(600); b3Vaelg("post"); await V(1200); optagPost("Reel · Post");
    briefProcesGaa(1); await V(900); await coverForslag();
    try { closeBrief(); } catch (e) {} await V(600);
    TRIN = "åbn tomt opslag"; openBriefSide("fx-tom"); await V(1800); ryd(); b3Vaelg("optag"); await V(1200); optagPost("tomt opslag · Optag"); b3Vaelg("post"); await V(1200); optagPost("tomt opslag · Post");
    try { closeBrief(); } catch (e) {} await V(600);
    TRIN = "åbn Kort-reel"; openBriefSide("fx-kr"); await V(1800); ryd(); briefProcesGaa(1); await V(1100); kortReel("Kort-reel · Fang dem"); knapperOgChips("Kort-reel · Fang dem");
    try { closeBrief(); } catch (e) {} await V(600);
    /* (11) ÅBNE OG BLADRE SKRIVER INTET (N9): at åbne en karrusel og trykke Næste to gange må ikke gemme noget (ingen tom streng i forslagslisterne, intet startdesign med to lag) */
    TRIN = "karrusel · åbn og Næste"; var GEM = []; var oU = window.ideUpdate; window.ideUpdate = function (id, p) { if (String(id) === "fx-karr2") GEM.push(JSON.stringify(p && p.brief || {})); return oU.apply(this, arguments); };
    openBriefSide("fx-karr2"); await V(1800); ryd(); try { briefTrinGaa(1); } catch (e) {} await V(600); try { briefTrinGaa(1); } catch (e) {} await V(900);
    window.ideUpdate = oU;
    tjek(!GEM.some(function (g) { return /"hookTekstListe":\[[^\]]*""\]/.test(g) || /"slideDesign":\{"0"/.test(g); }), "DATA SKREVET UDEN HANDLING", "åbne + Næste gemte " + GEM.length + " gang(e): " + (GEM[0] || "").slice(0, 160));
    try { closeBrief(); } catch (e) {} await V(400);
    TRIN = "åbn karrusel"; openBriefSide("fx-karr"); await V(1800); ryd();
    briefProcesGaa(1); await V(1300); await skrivRaekker("Karrusel · Fang dem"); feltStr("Karrusel · Fang dem");
    await slide1();
    try { closeBrief(); } catch (e) {} await V(400);
  }
  clearTimeout(VAGT);
  if (N < (TAST ? 8 : 30)) fund("DÆKNING", "kun " + N + " målinger");
  if (FUND.length) FUND.forEach(function (f) { console.log("SELE BRIEFFIX FEJL (" + innerWidth + "×" + innerHeight + "): " + f); });
  else console.log("SELE BRIEFFIX OK (" + innerWidth + "×" + innerHeight + "): " + N + " målinger, ingen afvigelser");
} catch (e) { console.log("SELE BRIEFFIX FEJL probe: " + (e && e.message) + " — " + TRIN); } }, 400);
