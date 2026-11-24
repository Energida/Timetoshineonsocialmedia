/* v3462 · »STARTET«, IKKE BARE »0« (Ida 24/11 med Avantis kort: »jeg bliver alvorlig bekymret når min ven her siger at han er igang med modul 0 men jeg ikke kan se han har set nogle lektionern«).
   En kunde, der har ÅBNET en lektion (lektion_visdage / lektion_sidst_vist) men ikke trykket »Markér som færdig« (ingen lektion_set_), skal stå som »0 af 5 færdige · 1 startet« med rækken
   »Sidst: Startede på lektion 0.1 · i dag kl. …« — ikke som »0 set«. En færdig lektion står som »færdig med«. Backstage siger aldrig »set« om det, der er »færdigt«.
   Køres af koer.sh som Backstage på 390 og 1440 (kundens kort). */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [], n = 0;
  var T = function (ok, d) { n++; if (!ok) fejl.push(d); };
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} await V(600);
    var K = "STARTETPROEVE1"; VIRKSOMHEDSKODER[K] = { virksomhed: "Prøvebutikken", forloeb: "YOU GOT THIS — DETAIL", type: "kursus", aktiv: true };
    var nu = Date.now(), d = function (t) { return new Date(nu - t * 3600e3).toISOString(); }, idag = new Date().toLocaleDateString("sv-SE");
    var ids = ["1-1", "1-2", "1-3", "1-4", "1-5", "2-1", "2-2"];
    await sb.from("lektioner").insert(ids.map(function (id) { return { id: id, titel: "Lektion " + id, video_link: "https://vimeo.com/1" }; }));
    var db = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); db.skema_svar = (db.skema_svar || []).filter(function (x) { return !(x.kode === "ENERGIDA" && x.skema === "publicering"); }); localStorage.setItem("SELE_DB", JSON.stringify(db));
    await sb.from("skema_svar").insert([{ kode: "ENERGIDA", navn: "config", skema: "publicering", svar: { lektioner: ids } },
      { kode: K, navn: "config", skema: "kunde_info", svar: { mail: "jakob@proeve.dk", kontakt: "Jakob Prøve" } },
      { kode: K, navn: "Jakob", skema: "login", svar: { navn: "Jakob", email: "jakob@proeve.dk" }, created_at: d(30) },
      { kode: K, navn: "Jakob", skema: "app_brug", svar: (function () { var o = {}; o[idag] = 1; return o; })(), created_at: d(30) },
      { kode: K, navn: "Jakob", skema: "lektion_visdage", svar: { "1-1": [idag] } },
      { kode: K, navn: "Jakob", skema: "lektion_sidst_vist", svar: { "1-1": d(1) } }]);
    kundeSideVis(K); await V(4000);
    var blok = function (navn) { var b = [].filter.call(document.querySelectorAll(".ks2-blok"), function (e) { return new RegExp("^" + navn).test(((e.querySelector(".ks2-e") || {}).textContent || "").trim()); })[0]; return b ? (b.innerText || "").replace(/\s+/g, " ").trim() : ""; };
    var akt = blok("Aktivitet"), lek = blok("Lektionerne"), tx = (document.body.innerText || "").replace(/\s+/g, " ");
    T(/Modul 0 0 af 5 færdige · 1 startet/.test(akt), "åbnet men ikke færdig står ikke som »0 af 5 færdige · 1 startet«: " + akt.slice(0, 160));
    T(/Modul 1 0 af 2 færdige(?! ·)/.test(akt), "et modul uden åbnede lektioner skal ikke sige »startet«: " + akt.slice(0, 160));
    T(/Sidst Startede på lektion 0\.1 · i dag kl\. \d\d\.\d\d/.test(akt), "rækken »Sidst« mangler »Startede på lektion 0.1 · i dag kl. …«: " + akt.slice(0, 200));
    T(/0 af 7 færdige · 1 startet/.test(lek), "fremdriften siger ikke »færdige · startet«: " + lek.slice(0, 120));
    T(/Sidst aktiv i dag · startede på lektion 0\.1/.test(tx), "»Kunden er på sporet«-linjen siger ikke, hvad kunden startede på");
    T(!/ set\b/i.test(akt + " " + lek), "kortet siger stadig »set« om lektioner");
    T(document.documentElement.scrollWidth <= innerWidth, "vandret rulning: " + document.documentElement.scrollWidth + "/" + innerWidth);
    var sr = [].filter.call(document.querySelectorAll(".ks2-blok .ks2-rk"), function (e) { return /^Sidst/.test((e.innerText || "").trim()) && /lektion/.test(e.innerText || ""); })[0];
    if (sr) { var v = sr.querySelector(".ks2-v"), q = v.getBoundingClientRect(); T(!/i\s*$/.test(((v.innerText || "").split("\n")[0] || "").trim()), "»i dag kl.« knækker midt i en dag: »" + (v.innerText || "").replace(/\n/g, "⏎") + "«"); T(q.right <= innerWidth, "»Sidst« rager ud over skærmen"); }
    kundeSideVis(K); await V(300);
    T(dtGrundOrd({ login: true, set: 0 }) === "har ikke gjort en lektion færdig", "Dagens tjek siger ikke »har ikke gjort en lektion færdig«");
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE STARTET FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE STARTET FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE STARTET OK " + innerWidth + ": " + n + " målinger — åbnet men ikke færdig står som »startet«, sidste lektion står i rækken »Sidst«, og Backstage siger ikke »set« om færdige");
})();
