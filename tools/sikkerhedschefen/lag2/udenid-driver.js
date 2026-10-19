/* SIKKERHEDSCHEFEN · LØFTE 1 · ET OPSLAG UDEN ID GEMMES ALDRIG (19/10, Acorns' telefon: 14 × rød bjælke »content_ideer.update: invalid input syntax for type uuid: "null"« 12/10–19/10).
   Køen på telefonen bærer en ændring under "null" (som hos Acorns) → den sendes ikke, lægges til side (intet slettes), og der kaldes aldrig basen med id "null". */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function tjek(n, ok, d) { r.tjek.push({ loefte: 1, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 220) }); }
  var L = function () { console.log("@@" + JSON.stringify(r) + "@@"); }; var slut = setTimeout(L, 40000);
  try {
    await V(3500);
    var kald = []; var f0 = sb.from.bind(sb);
    sb.from = function (t) { var b = f0(t); var eq0 = b.eq; if (typeof eq0 === "function") b.eq = function (k, v) { if (t === "content_ideer" && k === "id") kald.push(String(v)); return eq0.apply(this, arguments); }; return b; };
    localStorage.setItem(nsKey("ide_koe"), JSON.stringify({ "null": { brief: { hookTekst: "Kundens tekst, der ikke må gå tabt" }, __t: Date.now() } }));
    try { await ideKoeSend(); } catch (e) {}
    var k = JSON.parse(localStorage.getItem(nsKey("ide_koe")) || "{}");
    var side = JSON.parse(localStorage.getItem(nsKey("ide_koe_uden_id")) || "[]");
    tjek("En ændring uden id sendes ikke til basen", kald.indexOf("null") < 0, "basen blev kaldt med id: " + kald.join(","));
    tjek("Ændringen uden id forlader køen", !k["null"], "står stadig i køen");
    tjek("Kundens tekst er lagt til side, ikke slettet", side.some(function (x) { return /ikke må gå tabt/.test(JSON.stringify(x.patch)); }), JSON.stringify(side).slice(0, 120));
    var foer = typeof BRIEF_ID !== "undefined" ? BRIEF_ID : null;
    try { openBriefSide("null"); } catch (e) {} await V(300);
    tjek("En brief åbner aldrig med id \"null\"", (typeof BRIEF_ID === "undefined" ? null : BRIEF_ID) === foer, "BRIEF_ID blev " + String(BRIEF_ID));
    var u = await ideUpdate("null", { status: "Planlagt" });
    tjek("ideUpdate med id \"null\" kalder ikke basen", u === false && kald.indexOf("null") < 0, "svar " + u + " · kald " + kald.join(","));
    try { ideKoeLaeg("null", { titel: "x" }); } catch (e) {}
    var k2 = JSON.parse(localStorage.getItem(nsKey("ide_koe")) || "{}");
    tjek("Køen tager ikke imod en ændring uden id", !k2["null"], "»null« blev lagt i køen");
    sb.from = f0;
  } catch (e) { r.fejl = String(e && e.message || e); }
  clearTimeout(slut); L();
})();
