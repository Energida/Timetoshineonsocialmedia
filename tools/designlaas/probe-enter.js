/* ENTER-TEGNET PÅ COMPUTEREN, PILEN KUN PÅ TELEFONEN — LÅST I PORTEN (Ida 24/11 på live v3452: »nu er det pilen i skrivefeltet der er blevet som mobil og ikke den der
   altid skal være på computer?? vil du ikke tjekke hvordan det kan lade sig gøre? og låse computersymbolet alle steder«).
   Hvorfor det kunne ske: porten målte kun .sendfelt-knap, .htb-send-knap og .hs-send-knap (probe-backstage/probe-sider). Hookets forslag på en karrusel tegnede
   .fs-tlf-send (pil op) på alle bredder (14/11) og blev aldrig set. Denne probe ser på det, man SER, ikke på klassenavne:
   (1) PIL: ingen synlig pil op (tegnet M5 12l7-7 7 7 / M6 11l6-6 6 6, eller en kendt sendeknap) i eller lige ved et synligt skrivefelt på ≥900.
   (2) ↵:   hver synlig tilføj-række (et felt, der har en sendeknap til telefonen) viser Enter-tegnet ↵ inde i feltet på ≥900.
   (3) TEKST UNDER IKON: et ikon inde i et skrivefelt (mikrofon, ↵, skraldespand) står til højre for feltets tekst — teksten løber aldrig ind under ikonet.
   koer.sh sætter ENTER_FLADE = "kunde" eller "dash" foran koden og kører på 1440. Under 900 måles intet (telefonen har pilen). */
var FLADE = (typeof ENTER_FLADE === "string") ? ENTER_FLADE : "kunde";
var V = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
var FUND = [], SET = {}, N = 0, TRIN = "start", RAEKKER = 0, SIDER = 0;
var SEND_KL = ".fs-tlf-send, .sendfelt-knap, .htb-send-knap, .hs-send-knap, .htg-send, .ark-tag-send, #briefSpmSkrivSend";
var VAERT_KL = ".fs-rk, .sendfelt, .htb-send, .hs-send, .htg-rk, .ark-tags-valgte, #briefSpmSkriv";
var FELT_KL = "textarea, input[type='text'], input:not([type]), input[type='search'], [contenteditable='true']";
function synlig(e) { if (!e || !e.getClientRects().length) return false; var r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; for (var x = e; x && x.nodeType === 1; x = x.parentElement) { var cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false; } return r.bottom > -2000 && r.right > 0 && r.left < innerWidth; }
function navn(e) { return e.id ? "#" + e.id : (e.tagName.toLowerCase() + (e.className && e.className.toString ? "." + e.className.toString().trim().split(/\s+/).slice(0, 2).join(".") : "")); }
function ord(f) { return ((f && (f.placeholder || f.getAttribute("aria-label") || f.value || f.textContent)) || "").replace(/\s+/g, " ").trim().slice(0, 28); }
function fund(regel, e, hvad) { var k = regel + " " + hvad; if (SET[k]) { SET[k].n++; return; } SET[k] = { n: 1, hvor: TRIN }; FUND.push(k); }
function erPil(el) { var p = el.matches("svg") ? el : el.querySelector("svg"); if (!p) return false; return [].some.call(p.querySelectorAll("path"), function (q) { return /l7-7 7 7|l6-6 6 6/.test(q.getAttribute("d") || "") && !/M6 18l6-6/.test(q.getAttribute("d") || ""); }); }
function erEnter(el) { return el.matches(".fs-enter") || [].some.call(el.querySelectorAll("path"), function (q) { return /M19 6v5/.test(q.getAttribute("d") || ""); }); }
function afterEnter(e) { for (var x = e, i = 0; x && i < 4; x = x.parentElement, i++) { var a = getComputedStyle(x, "::after"); if (a.content !== "none" && /M19 6v5/.test(a.backgroundImage || "")) return true; } return false; }
function skan(rod) {
  if (innerWidth < 900) return; SIDER++;
  var felter = [].filter.call(rod.querySelectorAll(FELT_KL), synlig);
  /* (1) PIL VED ET FELT */
  var pile = [].filter.call(rod.querySelectorAll("button, [role='button'], span, a"), function (b) { if (!synlig(b)) return false; var bq = b.getBoundingClientRect(); return (b.matches(SEND_KL) && !b.closest(".bs3-soeg")) /* søgefeltets lup er ikke en sendepil */ || (bq.width <= 60 && bq.height <= 60 && erPil(b) && !b.querySelector("button")); });
  pile.forEach(function (b) { var q = b.getBoundingClientRect(), cx = q.left + q.width / 2, cy = q.top + q.height / 2;
    felter.forEach(function (f) { var r = f.getBoundingClientRect(); N++; if (cx >= r.left - 8 && cx <= r.right + 56 && cy >= r.top - 4 && cy <= r.bottom + 4) fund("PIL PÅ COMPUTEREN", b, navn(b) + " ved feltet »" + ord(f) + "« (" + navn(f) + ") — på computeren står ↵, pilen kun under 900"); }); });
  /* (2) ↵ I HVER TILFØJ-RÆKKE */
  var vaerter = []; [].forEach.call(rod.querySelectorAll(SEND_KL), function (s) { var v = s.closest(VAERT_KL); if (v && vaerter.indexOf(v) < 0 && !v.matches(".bs3-soeg") && !(v.matches(".htg-rk, .fs-rk") && v.nextElementSibling && v.nextElementSibling.matches(".htg-rk, .fs-rk"))) vaerter.push(v); /* i en liste er kun den nederste række tilføj-rækken */ });
  vaerter.forEach(function (v) { var f = [].filter.call(v.querySelectorAll(FELT_KL), synlig)[0]; if (!f) return; RAEKKER++; N++; var r = f.getBoundingClientRect();
    var tegn = [].filter.call(v.querySelectorAll(".fs-enter, svg"), function (e) { return synlig(e) && erEnter(e); })[0];
    var ok = afterEnter(f) || (tegn && (function () { var q = tegn.getBoundingClientRect(); return q.left >= r.left - 1 && q.right <= r.right + 1 && q.top >= r.top - 1 && q.bottom <= r.bottom + 1; })());
    if (!ok) fund("↵ MANGLER", f, "tilføj-rækken »" + ord(f) + "« (" + navn(v) + ") har intet Enter-tegn inde i feltet på computeren" + (tegn ? " (tegnet står uden for feltet)" : "")); });
  /* (3) TEKST UNDER IKON — kun skrivefelter med ikoner inde i rammen */
  felter.forEach(function (f) { if (f.matches("[contenteditable='true']")) return; var r = f.getBoundingClientRect(), cs = getComputedStyle(f), tekstH = r.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth);
    var vaert = f.closest(".fs-rk, .fs-ta-vaert, .sendfelt, .htb-send, .hs-send, .htg-rk") || f.parentElement; if (!vaert) return;
    [].forEach.call(vaert.querySelectorAll("button, .fs-enter, .brief-mik"), function (ik) { if (!synlig(ik) || ik.contains(f)) return; var q = ik.getBoundingClientRect(), cy = q.top + q.height / 2; var g = ik.querySelector("svg") || ik, gq = g.getBoundingClientRect();
      if (q.left + q.width / 2 < r.left || q.left + q.width / 2 > r.right || cy < r.top || cy > r.bottom) return; N++;
      if (gq.left < tekstH - 1) fund("TEKST UNDER IKON", f, "feltet »" + ord(f) + "« (" + navn(f) + "): teksten går til " + Math.round(tekstH - r.left) + " px, men " + navn(ik) + " begynder ved " + Math.round(gq.left - r.left) + " px"); }); });
}
function rod() { var ark = [].filter.call(document.querySelectorAll("#bsFlytMenu, .ark-slor, #arkSlor, .modal-back.open, .modal-back.show, .modal-back.vis"), synlig); return ark.length ? ark[ark.length - 1] : document.body; }
function lukAlt() { try { bsFlytLuk(); } catch (e) {} try { arkLuk(true); } catch (e) {} try { closeModal(); } catch (e) {} [].forEach.call(document.querySelectorAll(".modal-back.open,.modal-back.show,.modal-back.vis"), function (e) { e.classList.remove("open", "show", "vis"); }); [].forEach.call(document.querySelectorAll(".ark-slor, #arkSlor"), function (e) { e.remove(); }); var m = document.getElementById("bsFlytMenu"); if (m) { m.style.display = "none"; m.innerHTML = ""; } }
function ryd() { ["appLoader", "turOverlay", "dagensKort", "nyVersion"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); }); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {} }
async function side(navnet, fn, ms) { TRIN = navnet; try { fn(); } catch (e) { N++; fund("SIDE", null, "»" + navnet + "« åbnede ikke: " + (e && e.message)); return; } await V(ms || 1100); ryd(); skan(rod()); }
async function ark(navnet) { var fn = window[navnet]; if (typeof fn !== "function") return; TRIN = "arket " + navnet; lukAlt(); await V(200); try { fn(); } catch (e) { try { fn(0); } catch (e2) {} } await V(900); var r = rod(); if (r !== document.body) skan(r); lukAlt(); await V(300); }
var LANG = "3 spørgsmål der hjælper dig med at få den bedste julefrokost, også når hele teamet er samlet";
var FORMATER = ["Reel", "Kort-reel", "Karrusel", "Billede", "Story"];
var ARK_FELTER = ["nyIdeAabn", "hjemTilfoejArk", "bf3HjemTilfoejArk", "bf3TodoNyArk", "bf3NytRumArk", "bf3ToemArk", "bf3ToemTrin1", "toemHovedetTrin1", "htbNyArk", "briefKomArk", "briefLinkArk", "briefTilfoejLinkArk", "kundeArkAabn", "kundeBeskedArk", "temaNyArk", "klipNyArk", "modulNyArk", "nytLeadArk", "ahTilfoejArk", "kollegaArk", "mailsNyArk", "inspNavnArk", "bf3KontaktNyArk", "bf3NytProduktArk", "bf3CsNyArk", "foodIngArk"];
var DASH_SIDER = [["hjem", function () { visDashSide("overblik"); }], ["crm", function () { visDashSide("crm"); }], ["salg", function () { mrGaaTil("salg"); }], ["mails", function () { mrGaaTil("mails"); }], ["content studio", function () { csStudioAabn(); }], ["energidas idébank (Backstage)", function () { csIbAabn(); }], ["skabeloner", function () { mrGaaTil("csskabeloner"); }], ["tekster til indholdssøjlerne", function () { mrGaaTil("cstekster"); }], ["guider", function () { mrGaaTil("csguider"); }], ["energidas content studio", function () { mrGaaTil("contentstudio"); }], ["optagestudie", function () { visDashSide("klip"); }], ["workout", function () { mrGaaTil("oevelser"); }], ["mine rum", function () { visDashSide("energida"); }], ["indbakken", function () { visDashSide("indbakke"); }], ["get shit done", function () { visDashSide("gsd"); }], ["økonomi", function () { visDashSide("budget"); }], ["health coach", function () { visDashSide("healthcoach"); }], ["opgavebiblioteket", function () { visDashSide("opgbib"); }]];
var KUNDE_SIDER = [["hjem", function () { showTab(3); }], ["idébanken", function () { showTab(2); ibnFaneVis("min"); }], ["energidas idébank", function () { showTab(2); ibnFaneVis("energida"); }], ["inspiration", function () { showTab(2); ibVis("insp"); }], ["arkiv", function () { showTab(2); ibVis("arkiv"); }], ["content", function () { showTab(8); }], ["performance", function () { openMaal(); }], ["indbakken", function () { indbakkenAaben(); }], ["værktøjskassen", function () { vaerktoejAaben(); }], ["drejebogen", function () { drejebogAaben(); }], ["tema", function () { temaAaben(); }], ["målsætninger", function () { tilpasAaben("maal"); }], ["forløbet", function () { openForloeb(); }], ["profil", function () { minProfilAaben(); }], ["lektion", function () { OB_SKEMA = true; showTab(12); visLektion(KURSUS_LEKTIONER[0].id); }]];
var VAGT = setTimeout(function () { console.log("SELE ENTER FEJL: proben nåede ikke i mål — sidste trin: " + TRIN); }, 230000);
setTimeout(async function () { try {
  for (var v = 0; v < 40 && !document.body.classList.contains("app-klar"); v++) await V(150);
  ryd(); await V(300);
  if (FLADE === "kunde") {
    FORMATER.forEach(function (f, i) { IDEER.push({ id: "en" + i, titel: "Julefrokost i butikken " + f, soejle: "Menneskene bag", type: f, status: "Brief i gang", dato: "2026-11-24", brief: { format: f, platform: ["Instagram"], beskrivelse: "Vi viser, hvordan vi gør klar til julefrokost.", hookTekst: LANG, hookTekstListe: [LANG, "Det her skal vi have på til julefrokost!"], hookTekstValgt: 0, klip: [{ ser: "Vi dækker bord", tekst: "Hvem har ret?", siger: "Vi er aldrig enige" }], ctaVideo: "Skriv i kommentarerne", caption: "Vi gør klar.", cta: "Kommentér opslaget", hashtags: "#butiksliv #julefrokost" } }); });
    for (var s = 0; s < KUNDE_SIDER.length; s++) await side(KUNDE_SIDER[s][0], KUNDE_SIDER[s][1]);
    for (var i = 0; i < FORMATER.length; i++) { var f = FORMATER[i]; lukAlt();
      await side("brief " + f + " · forside", function () { openBriefSide("en" + i); }, 1800);
      for (var t = 0; t < 4; t++) await side("brief " + f + " · trin " + t, function () { briefProcesGaa(t); }, 1000);
      if (typeof b3Aktiv === "function" && b3Aktiv()) { await side("brief " + f + " · Optag", function () { b3Vaelg("optag"); }, 1000); await side("brief " + f + " · Post", function () { b3Vaelg("post"); }, 1000); await side("brief " + f + " · Skriv", function () { b3Vaelg("skriv"); }, 1000); }
      try { closeBrief(); } catch (e) {} await V(600); }
  } else {
    for (var d = 0; d < DASH_SIDER.length; d++) { lukAlt(); await side("Backstage: " + DASH_SIDER[d][0], DASH_SIDER[d][1]); }
    await side("Backstage: hjem", function () { visDashSide("overblik"); }, 800);
  }
  for (var a = 0; a < ARK_FELTER.length; a++) await ark(ARK_FELTER[a]);
  clearTimeout(VAGT);
  var MIN = FLADE === "kunde" ? 30 : 12; N++; if (SIDER < MIN) fund("DÆKNING", null, "kun " + SIDER + " sider/ark målt (skal mindst " + MIN + ")");
  if (FLADE === "kunde") { N++; if (RAEKKER < 10) fund("DÆKNING", null, "kun " + RAEKKER + " tilføj-rækker fundet i kundeappen (skal mindst 10) — proben ser ikke længere briefens felter"); }
  if (FUND.length) { FUND.forEach(function (k) { console.log("SELE ENTER FEJL (" + FLADE + "): " + k + " — første gang i " + (SET[k] || {}).hvor + ((SET[k] || {}).n > 1 ? ", " + SET[k].n + " steder" : "")); }); console.log("SELE ENTER IKKE OK (" + FLADE + "): " + FUND.length + " afvigelser af " + N + " målinger paa " + innerWidth); }
  else console.log("SELE ENTER OK (" + FLADE + "): " + N + " målinger på " + SIDER + " sider og ark, " + RAEKKER + " tilføj-rækker med ↵, ingen pil ved et felt, ingen tekst under et ikon paa " + innerWidth);
} catch (e) { console.log("SELE ENTER FEJL probe: " + (e && e.message) + " — " + TRIN); } }, 400);
