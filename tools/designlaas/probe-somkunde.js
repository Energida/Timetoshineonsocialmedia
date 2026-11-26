/* BACKSTAGE SOM KUNDE — NÆSTE RULLER IKKE SIDEN IND UNDER BÅNDET (gennemgang 3, F6, 26/11: med det røde bånd øverst gled hele siden 47 px op efter første »Næste«; »Tilbage« stod 40 i stedet for 87, og sidemenuen gik ind under båndet. Det var rammen .phone, der rullede).
   Åbnes med #somkunde=<kode> (som Ida åbner en kundes Content Studio). Proben åbner en brief og klikker »Næste« tre gange (klik på det, der står øverst på knappens midte) og måler efter hvert klik:
   (1) »Tilbage« står samme sted som før første klik (±2 px) og under båndet.
   (2) ingen ramme uden om siden står rullet (scrollTop > 0 på .content's forfædre).
   koer.sh kører den på 1440 og 390. */
var V = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
var FUND = [], N = 0;
function synlig(e) { if (!e || !e.getClientRects().length) return false; var c = getComputedStyle(e); return c.display !== "none" && c.visibility !== "hidden"; }
function tekst(e) { return ((e && e.innerText) || "").replace(/\s+/g, " ").trim(); }
function knap(navn) { var b = [].filter.call(document.querySelectorAll("#screen7 button"), function (x) { return synlig(x) && tekst(x) === navn; }); return b[b.length - 1] || null; }
function tilbage() { return [].filter.call(document.querySelectorAll("#screen7 button"), function (x) { return synlig(x) && /^Tilbage$/.test(tekst(x)); })[0] || null; }
function rullet() { var c = document.querySelector(".content"), ud = []; for (var e = c && c.parentElement; e; e = e.parentElement) if (e.scrollTop > 0) ud.push((e.id || e.tagName.toLowerCase()) + "." + String(e.className).split(" ")[0] + " " + Math.round(e.scrollTop)); return ud; }
async function klik(k) { k.scrollIntoView({ block: "center" }); await V(150); var r = k.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, e = document.elementFromPoint(x, y); if (!e || !(e === k || k.contains(e))) { FUND.push("»Næste« er dækket"); return false; } var o = { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 }; try { e.dispatchEvent(new PointerEvent("pointerdown", o)); } catch (x1) {} e.dispatchEvent(new MouseEvent("mousedown", o)); try { e.dispatchEvent(new PointerEvent("pointerup", o)); } catch (x1) {} e.dispatchEvent(new MouseEvent("mouseup", o)); e.dispatchEvent(new MouseEvent("click", o)); return true; }
var VAGT = setTimeout(function () { console.log("SELE SOMKUNDE FEJL (" + innerWidth + "): proben nåede ikke i mål"); }, 60000);
setTimeout(async function () { try {
  for (var v = 0; v < 60 && !document.body.classList.contains("app-klar"); v++) await V(150);
  ["appLoader", "turOverlay", "dagensKort", "nyVersion", "somkundeLoader"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); }); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
  N++; if (typeof SOM_KUNDE === "undefined" || !SOM_KUNDE) FUND.push("siden er ikke åbnet som kunde (#somkunde)");
  IDEER.push({ id: "sk1", titel: "Julefrokost som kunde", soejle: "Menneskene bag", type: "Reel", status: "Brief i gang", dato: "2026-11-27", brief: { format: "Reel", beskrivelse: "Vi viser tre spørgsmål." } });
  try { BRIEF_SIDE_AKTIV = 0; BRIEF_TRIN_AKTIV = 0; BRIEF_MB_VIS = "forside"; } catch (e) {}
  openBriefSide("sk1"); await V(2000);
  var t0 = tilbage(), y0 = t0 ? t0.getBoundingClientRect().top : null; N++; if (y0 == null) FUND.push("»Tilbage« findes ikke i briefen");
  var bar = document.getElementById("somKundeBar"), bb = bar && synlig(bar) ? bar.getBoundingClientRect().bottom : 0;
  for (var i = 1; i <= 3; i++) {
    var k = knap("Næste"); if (!k) break;
    if (!(await klik(k))) break; await V(1400);
    var t = tilbage(), y = t ? t.getBoundingClientRect().top : null, r = rullet();
    N++; if (y0 != null && (y == null || Math.abs(y - y0) > 2)) FUND.push("efter Næste nr. " + i + " står »Tilbage« på " + (y == null ? "–" : Math.round(y)) + " mod " + Math.round(y0) + " før");
    N++; if (y != null && bb && y < bb - 1) FUND.push("efter Næste nr. " + i + " står »Tilbage« under båndet (" + Math.round(y) + " < " + Math.round(bb) + ")");
    N++; if (r.length) FUND.push("efter Næste nr. " + i + " står rammen rullet: " + r.join(", "));
  }
  try { closeBrief(); } catch (e) {}
  clearTimeout(VAGT);
  if (FUND.length) FUND.forEach(function (f) { console.log("SELE SOMKUNDE FEJL (" + innerWidth + "): " + f); });
  else console.log("SELE SOMKUNDE OK (" + innerWidth + "): " + N + " målinger — som kunde står »Tilbage« samme sted ved hvert Næste, og ingen ramme ruller ind under båndet");
} catch (e) { console.log("SELE SOMKUNDE FEJL probe: " + (e && e.message)); } }, 400);
