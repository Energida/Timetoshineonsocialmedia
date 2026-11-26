/* INGEN BLINDGYDE I BRIEFEN — ALLE FORMATER × ALLE TRIN, MED KLIK (review 25/11: et billede-opslag på 1440 åbnede med en TOM ramme »IDÉEN«, og »Fang dem« og »Næste« kom ikke videre — en stopklods for kunden).
   For hvert format (Reel, Kort reel, Karrusel, Billede, Story, Prøvereel og et helt tomt opslag) åbnes briefen, og proben klikker sig igennem med »Næste«, ét trin ad gangen:
   (1) TOMT TRIN: hvert trin viser noget at skrive i eller læse (felter, dropdowns, fliser; på telefonen tæller Fakta-trinnets rækker).
   (2) KAN IKKE FORLADES: et klik på »Næste« skifter trin (eller siden slutter, når der ikke er flere).
   (3) TRINVÆLGEREN: et klik på »Fang dem« lander på Fang dem med felter; et klik på »Idéen« tilbage.
   (4) OPTAG OG POST: et klik på fanen viser indhold.
   Klikket er et klik på det, der står ØVERST på knappens midte (elementFromPoint) med pointerdown · mousedown · pointerup · mouseup · click — står noget hen over knappen, er det en fejl. Funktionerne kaldes aldrig direkte.
   koer.sh kører den på 1440, 1000 og 390. */
var V = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
var FUND = [], N = 0, TRIN = "start", SET = 0;
function synlig(e) { if (!e || !e.getClientRects().length) return false; for (var x = e; x && x.nodeType === 1; x = x.parentElement) { var c = getComputedStyle(x); if (c.display === "none" || c.visibility === "hidden") return false; } var r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; }
function tekst(e) { return ((e && e.innerText) || "").replace(/\s+/g, " ").trim(); }
function fejl(regel, hvad) { FUND.push(regel + ": " + hvad + " (" + TRIN + ")"); }
function ryd() { ["appLoader", "turOverlay", "dagensKort", "nyVersion"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); }); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {} }
function indhold() {
  var sel = "#briefWrap textarea, #briefWrap input:not([type=hidden]):not([type=file]), #briefWrap .bdrop-knap, #briefWrap canvas, #briefWrap .b3-afs, #briefWrap .pf-flise, #storySerie textarea, #storySerie input:not([type=file]), #storySerie .ss-flise, #storySerie button, #briefForside .pf-flise, #briefForside .b3-afs, #briefWrap .ark-chip, #briefForside button";   /* en chip (»+ Scene«) eller en knap (»Skriv« på et tomt Optag) er en vej videre */
  var n = [].filter.call(document.querySelectorAll(sel), synlig).length;
  if (innerWidth < 900) n += [].filter.call(document.querySelectorAll("#briefRail .fb-rk"), synlig).length;
  var fs = document.getElementById("briefForside"); var t = fs && synlig(fs) ? tekst(fs).length : 0;
  return { n: n, t: t };
}
function tilstand() { var nu = document.querySelector("#b3Trin .nu"); return String(BRIEF_SIDE_AKTIV) + "." + String(BRIEF_TRIN_AKTIV) + "." + (typeof B3_VIS !== "undefined" ? B3_VIS : "") + "." + (nu ? tekst(nu) : ""); }
function knap(navn, rod) { var b = [].filter.call((rod || document).querySelectorAll(rod ? "button, [onclick]" : "#screen7 button, #storySerie button"), function (x) { return synlig(x) && tekst(x) === navn; }); return b[b.length - 1] || null; }
async function klik(k, navn) {
  k.scrollIntoView({ block: "center" }); await V(150);
  var r = k.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, e = document.elementFromPoint(x, y);
  N++; if (!e || !(e === k || k.contains(e))) { fejl("KNAPPEN ER DÆKKET", "»" + navn + "« dækkes af " + (e ? e.tagName.toLowerCase() + "." + String(e.className).split(" ")[0] : "intet")); return false; }
  var o = { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 };
  try { e.dispatchEvent(new PointerEvent("pointerdown", o)); } catch (x1) {} e.dispatchEvent(new MouseEvent("mousedown", o));
  try { e.dispatchEvent(new PointerEvent("pointerup", o)); } catch (x1) {} e.dispatchEvent(new MouseEvent("mouseup", o)); e.dispatchEvent(new MouseEvent("click", o));
  return true;
}
async function format(id, navn) {
  TRIN = navn + " · åbnet"; try { closeBrief(); } catch (e) {} await V(500);
  /* SOM EN FRISK START: fejlen 25/11 viste sig kun, når briefen var den første, der blev åbnet (trinnet stod på 0 fra starten). Hvert opslag åbnes derfor fra samme udgangspunkt som efter en genindlæsning. */
  try { BRIEF_SIDE_AKTIV = 0; BRIEF_TRIN_AKTIV = 0; BRIEF_MB_VIS = "forside"; } catch (e) {}
  openBriefSide(id); await V(1800); ryd();
  var sete = 0;
  for (var n = 0; n < 9; n++) {
    var i = indhold(); N++; SET++; sete++;
    TRIN = navn + " · " + tilstand();
    if (!i.n && !i.t) fejl("TOMT TRIN", "intet at skrive i eller læse");
    var k = knap("Næste"); if (!k) break;
    var foer = tilstand(); if (!(await klik(k, "Næste"))) break; await V(1100);
    N++; if (tilstand() === foer) { fejl("KAN IKKE FORLADES", "»Næste« skifter ikke trin"); break; }
    /* N8 (gennemgang 2): efter Næste står titlen og Skriv/Optag/Post synligt øverst — de rulles aldrig ud over toppen */
    var tk = document.getElementById("b3Kort") || document.querySelector("#screen7 .mb-baand"); if (tk && synlig(tk)) { N++; if (tk.getBoundingClientRect().top < -1) fejl("TITLEN RULLET VÆK", "efter »Næste« står titlen " + Math.round(tk.getBoundingClientRect().top) + " px over toppen"); }
  }
  if (sete < 2 && !/Story/.test(navn)) { N++; fejl("KAN IKKE FORLADES", "kun " + sete + " trin nået med »Næste«"); }
  var tr = document.getElementById("b3Trin");
  if (tr && synlig(tr)) {
    var fd = knap("Fang dem", tr); if (fd) { TRIN = navn + " · trinvælgeren »Fang dem«"; if (await klik(fd, "Fang dem")) { await V(1100); N++; if (String(BRIEF_SIDE_AKTIV) !== "1") fejl("KAN IKKE FORLADES", "klik på »Fang dem« landede på side " + BRIEF_SIDE_AKTIV); var i2 = indhold(); N++; if (!i2.n) fejl("TOMT TRIN", "Fang dem efter klik"); } }
    var ie = knap("Idéen", tr); if (ie) { TRIN = navn + " · trinvælgeren »Idéen«"; if (await klik(ie, "Idéen")) { await V(1100); var i3 = indhold(); N++; if (!i3.n) fejl("TOMT TRIN", "Idéen efter klik"); } }
  }
  var vg = document.getElementById("b3Vaelger");
  if (vg && synlig(vg)) for (var f = 0; f < 3; f++) { var fn = ["Optag", "Post", "Skriv"][f]; var kf = knap(fn, vg); if (!kf) continue; TRIN = navn + " · fanen " + fn; if (!(await klik(kf, fn))) continue; await V(1300); var i4 = indhold(); N++; if (!i4.n && i4.t < 20) fejl("TOMT TRIN", "fanen " + fn + " viser intet");
    /* F5 (gennemgang 3, 26/11): Optag og Post kunne rulles ca. 7.700 px ned i tom hvid flade på computeren (FAKTA-spalten spændte 200 tomme gitterrækker med 40 px imellem). Siden kan kun rulles, så langt indholdet når */
    if (innerWidth >= 900 && fn !== "Skriv") { var cR = document.querySelector(".content"); if (cR) { var bund = 0; [].forEach.call(document.querySelectorAll("#screen7 *"), function (e) { if (!synlig(e) || (e.children.length && !/^(BUTTON|INPUT|TEXTAREA|IMG|CANVAS|VIDEO|SELECT)$/.test(e.tagName))) return;   /* kun det, man ser: tekst, knapper, felter, billeder — ikke gitteret selv */ var q = e.getBoundingClientRect(); bund = Math.max(bund, q.bottom + cR.scrollTop - cR.getBoundingClientRect().top); }); N++; if (cR.scrollHeight - Math.max(bund, cR.clientHeight) > 120) fejl("TOM RULLEFLADE", "fanen " + fn + " kan rulles " + Math.round(cR.scrollHeight - bund) + " px under indholdet (rullehøjde " + cR.scrollHeight + ", indholdet slutter ved " + Math.round(bund) + ")"); } } }
  /* F4 (gennemgang 3, 26/11): efter Optag → Post → Skriv stod trinvælgeren rullet 88 px på 1440, og »Idéen« var klippet til »en«. Det valgte trin står helt inde i rækken, og på computeren rulles rækken ikke, når der er plads til den. */
  var tr2 = document.getElementById("b3Trin");
  if (tr2 && synlig(tr2)) { TRIN = navn + " · trinvælgeren efter Optag → Post → Skriv"; var nu2 = tr2.querySelector(".nu"), rr = tr2.getBoundingClientRect();
    if (nu2) { var rn = nu2.getBoundingClientRect(); N++; if (rn.left < rr.left - 1 || rn.right > rr.right + 1) fejl("TRIN KLIPPET", "»" + tekst(nu2) + "« står " + Math.round(rn.left) + "–" + Math.round(rn.right) + " i en række " + Math.round(rr.left) + "–" + Math.round(rr.right)); }
    if (innerWidth >= 1200) { N++; if (tr2.scrollLeft > 0) fejl("TRIN RULLET", "trinvælgeren står rullet " + Math.round(tr2.scrollLeft) + " px, selv om der er plads"); } }
}
var VAGT = setTimeout(function () { console.log("SELE TRIN FEJL: proben nåede ikke i mål — sidste trin: " + TRIN); }, 260000);
setTimeout(async function () { try {
  for (var v = 0; v < 40 && !document.body.classList.contains("app-klar"); v++) await V(150);
  ryd(); await V(300);
  var L = "3 spørgsmål der hjælper dig med at få den bedste julefrokost, også når hele teamet er samlet";
  var F = [["Billede", { format: "Billede" }], ["Reel", { format: "Reel", beskrivelse: "Vi viser tre spørgsmål.", hookTekstListe: [L, "Hvad skal du have på?"], hookTekstValgt: 1, hookTekst: "Hvad skal du have på?" }],
    ["Kort-reel", { format: "Kort-reel" }], ["Karrusel", { format: "Karrusel", slides: ["5 måder", "Den hvide dug"] }],
    ["Story", { format: "Story" }], ["Kort-reel", { format: "Kort-reel", hookTekstListe: ["Lyset kl. 16"], hookTekstValgt: 0, hookTekst: "Lyset kl. 16" }], ["Prøvereel", { format: "Prøvereel" }], ["Reel", {}]];
  F.forEach(function (x, i) { IDEER.push({ id: "tr" + i, titel: (i === F.length - 1 ? "Helt tomt opslag" : "Julefrokost " + x[0]), soejle: "Menneskene bag", type: x[0], status: "Brief i gang", dato: "2026-11-27", brief: x[1] }); });
  for (var i = 0; i < F.length; i++) await format("tr" + i, i === F.length - 1 ? "tomt opslag" : F[i][0]);
  try { closeBrief(); } catch (e) {}
  clearTimeout(VAGT);
  if (SET < 20) fejl("DÆKNING", "kun " + SET + " trin set");
  if (FUND.length) FUND.forEach(function (f) { console.log("SELE TRIN FEJL (" + innerWidth + "): " + f); });
  else console.log("SELE TRIN OK (" + innerWidth + "): " + SET + " trin i " + F.length + " opslag klikket igennem, " + N + " målinger, ingen tomme trin og ingen blindgyder");
} catch (e) { console.log("SELE TRIN FEJL probe: " + (e && e.message) + " — " + TRIN); } }, 400);
