/* v3464 · EN NY KUNDE KOM IKKE VIDERE PÅ »VÆLG DIN ADGANGSKODE« (Mia, 24/11: »Linket er udløbet«, selv om linket var brugt få sekunder før).
   Profilguiden og arket »Vælg din adgangskode« skal (1) forny sessionen og prøve ÉN gang til, når gemningen fejler på sessionen, (2) aldrig sige »Linket er udløbet« om en session,
   (3) give en knap i SAMME boks, der sender et nyt link til kundens egen mail, (4) skrive den rå fejl (aldrig adgangskoden) til Idas fejlliste og (5) ikke forny/prøve igen ved andre fejl.
   Køres af koer.sh som kunde på 390 og 1440. updateUser, refreshSession og resetPasswordForEmail er byttet ud; intet rigtigt gemmes eller sendes. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [], n = 0;
  var T = function (ok, d) { n++; if (!ok) fejl.push(d); };
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {} await V(600);
    try { clearTimeout(window.__OPRET_VAGT); } catch (e) {}
    var kald = { upd: 0, ref: 0, reset: [], fejlLog: [] };
    sb.auth.refreshSession = function () { kald.ref++; return Promise.resolve({ data: {}, error: null }); };
    sb.auth.resetPasswordForEmail = function (m) { kald.reset.push(m); return Promise.resolve({ data: {}, error: null }); };
    window.fejlTilIda = function (slags, hvad) { kald.fejlLog.push(slags + "|" + hvad); };
    window.__NYKODE_MAIL = "Mia.Prove@Example.dk";
    var start = async function () {
      try { localStorage.removeItem(pfKladdeNoegle()); } catch (e) {}
      localStorage.setItem("energida_skal_ny_kode", "invitation"); PF = null; var gl = document.getElementById("pfFlow"); if (gl) gl.remove();
      await profilFlowStart(); await V(600);
      Object.assign(PF.f, { navn: "Mia", efternavn: "Prøve", dag: "12", mdr: "5", aar: "1980", ejer: "ja", rolle: "", pw: "hemmelig12" });
    };
    var koer = async function () {
      for (var i = 0; i < 8 && PF && PF.trin === 1; i++) { if (pfSkaerm() === "pw") PF.f.pw = "hemmelig12"; var fe0 = (document.getElementById("pfFejl") || {}).textContent; await pfNaeste(); await V(700); if (((document.getElementById("pfFejl") || {}).textContent || "") && ((document.getElementById("pfFejl") || {}).textContent !== fe0 || kald.upd)) break; if (kald.upd) break; }
    };
    /* A · første gang »Auth session missing«, anden gang lykkes */
    kald.upd = 0; kald.ref = 0; var seneste = null;
    sb.auth.updateUser = function (o) { if (!(o && o.password)) return Promise.resolve({ data: {}, error: null }); kald.upd++; seneste = o; return Promise.resolve(kald.upd === 1 ? { data: {}, error: { message: "Auth session missing!" } } : { data: {}, error: null }); };
    await start(); await koer(); await V(500);
    var feA = ((document.getElementById("pfFejl") || {}).textContent || "").trim();
    T(kald.upd === 2 && kald.ref >= 1 && !/udløbet|stået åben/.test(feA) && !document.getElementById("pfNytLink"), "A: sessionen fornyes og gemningen prøves én gang til (updateUser " + kald.upd + " gange, refresh " + kald.ref + ", fejl »" + feA + "«)");
    /* B · begge fejler: sessionen siges, knappen kommer, nyt link sendes */
    kald.upd = 0; kald.ref = 0; kald.fejlLog = []; kald.reset = [];
    sb.auth.updateUser = function (o) { if (!(o && o.password)) return Promise.resolve({ data: {}, error: null }); kald.upd++; seneste = o; return Promise.resolve({ data: {}, error: { message: "Auth session missing!" } }); };
    await start(); await koer(); await V(500);
    var feB = ((document.getElementById("pfFejl") || {}).textContent || "").trim(), kn = document.getElementById("pfNytLink"), nae = document.getElementById("pfNaeste");
    T(kald.upd === 2, "B: kun ét ekstra forsøg (updateUser " + kald.upd + " gange, skal 2)");
    T(/Vi kunne ikke gemme din adgangskode/.test(feB) && !/Linket er udløbet/.test(feB), "B: fejlen siger ikke, at adgangskoden ikke kunne gemmes: »" + feB + "«");
    T(!!kn && /Send et nyt link/.test(kn.textContent), "B: knappen »Send et nyt link« står ikke i samme boks");
    T(/session før \(sek\. tilbage\): /.test(kald.fejlLog[0] || "") && /lager: /.test(kald.fejlLog[0] || ""), "B: logfejlen mangler diagnosen (session før, lager): " + (kald.fejlLog[0] || ""));
    var gemt = null; try { gemt = JSON.parse(localStorage.getItem("energida_kode_fejl") || "null"); } catch (e) {}
    T(!!gemt && /updateUser: Auth session missing/.test(gemt.tekst || "") && !!gemt.tid, "B: fejlen huskes ikke på enheden (energida_kode_fejl), så den kan sendes, når der er en session igen");
    if (kn && nae) { var q1 = kn.getBoundingClientRect(), q2 = nae.getBoundingClientRect(); T(Math.round(q2.top - q1.bottom) === 12 && q1.height >= 44, "B: knappen står ikke 12 over Næste og mindst 44 høj (afstand " + Math.round(q2.top - q1.bottom) + ", højde " + Math.round(q1.height) + ")"); }
    T(kald.fejlLog.length === 1 && /^adgangskode\|updateUser: Auth session missing/.test(kald.fejlLog[0]) && !/hemmelig12/.test(kald.fejlLog[0]), "B: den rå fejl skrives ikke (uden adgangskoden) til Idas fejlliste: " + kald.fejlLog.join(" ¦ "));
    T(!/hemmelig12/.test(JSON.stringify(seneste || {}).replace(/"password":"hemmelig12"/, "")), "B: adgangskoden sendes kun som password-feltet");
    if (kn) { kn.click(); await V(900); }
    var feB2 = ((document.getElementById("pfFejl") || {}).textContent || "").trim();
    T(kald.reset.length === 1 && kald.reset[0] === "mia.prove@example.dk" && /Tjek din mail/.test(feB2) && !document.getElementById("pfNytLink"), "B: nyt link sendes til kundens egen mail (små bogstaver) og kvitteres: " + kald.reset.join(",") + " · »" + feB2 + "«");
    /* C · en anden fejl: ingen fornyelse, ingen knap */
    kald.upd = 0; kald.ref = 0; kald.fejlLog = [];
    sb.auth.updateUser = function (o) { if (!(o && o.password)) return Promise.resolve({ data: {}, error: null }); kald.upd++; return Promise.resolve({ data: {}, error: { message: "New password should be different from the old password." } }); };
    await start(); await koer(); await V(500);
    var feC = ((document.getElementById("pfFejl") || {}).textContent || "").trim();
    T(kald.upd === 1 && /anden adgangskode/.test(feC) && !document.getElementById("pfNytLink"), "C: en anden fejl prøves ikke igen og får ingen knap (updateUser " + kald.upd + " gange, fejl »" + feC + "«)");
    try { localStorage.removeItem("energida_skal_ny_kode"); localStorage.removeItem(pfKladdeNoegle()); } catch (e) {}
    var pf0 = document.getElementById("pfFlow"); if (pf0) pf0.remove(); PF = null;
    /* D · arket »Vælg din adgangskode« */
    kald.upd = 0; kald.ref = 0; kald.reset = []; kald.fejlLog = [];
    sb.auth.updateUser = function (o) { if (!(o && o.password)) return Promise.resolve({ data: {}, error: null }); kald.upd++; return Promise.resolve({ data: {}, error: { message: "Auth session missing!" } }); };
    visNyAdgangskode(true); await V(500); var fl = document.getElementById("nyKodeFelt"); if (fl) fl.value = "hemmelig12";
    await gemNyAdgangskodeInd(); await V(400);
    var kn2 = document.getElementById("nyKodeNytLink"), m2 = document.getElementById("nyKodeMsg");
    T(kald.upd === 2 && !!kn2 && /Vi kunne ikke gemme/.test((m2 || {}).textContent || ""), "D: arket fornyer, prøver igen og giver knappen »Send et nyt link« (updateUser " + kald.upd + " gange, knap " + !!kn2 + ")");
    if (kn2) { kn2.click(); await V(700); T(kald.reset.length === 1 && /Tjek din mail/.test((m2 || {}).textContent || ""), "D: arkets knap sender et nyt link og kvitterer"); }
    var b = document.getElementById("nyKodeBoks"); if (b) b.remove();
    /* E · linkets nøgle bruges højst ét sted ad gangen */
    var vo = 0; sb.auth.verifyOtp = function () { vo++; return new Promise(function (ok) { setTimeout(function () { ok({ data: { session: { user: { email: "andre@example.dk" }, access_token: "x", refresh_token: "y" } }, error: null }); }, 400); }); };
    window.__ENERGIDA_OPRET = { t: "nøgle", m: "andre@example.dk" }; try { window.__OPRET_LOEFTE = null; } catch (e) {}
    var p1 = opretMedLink(), p2 = opretMedLink(); T(p1 === p2, "E: et andet kald under et login får ikke det samme løfte tilbage"); await Promise.all([p1, p2]); await V(300);
    T(vo === 1, "E: linkets nøgle blev brugt " + vo + " gange (skal 1)");
    /* F · den huskede fejl sendes, første gang kunden er inde igen */
    if (localStorage.getItem("energida_kode_fejl")) { try { pulsStart(); } catch (e) {} await V(300); }   /* appen starter selv pulsen, når kunden kommer ind (E); ellers her */
    T(kald.fejlLog.some(function (x) { return /^adgangskode\|\(fra .*updateUser: Auth session missing/.test(x); }) && !localStorage.getItem("energida_kode_fejl"), "F: den huskede fejl sendes ikke, når kunden er inde igen: " + kald.fejlLog.join(" ¦ "));
    T(document.documentElement.scrollWidth <= innerWidth, "vandret rulning: " + document.documentElement.scrollWidth + "/" + innerWidth);
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE KODE FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE KODE FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE KODE OK " + innerWidth + ": " + n + " målinger — sessionen fornyes og prøves én gang til, fejlen siger ikke »linket er udløbet«, knappen sender et nyt link i samme boks, og den rå fejl logges");
})();
