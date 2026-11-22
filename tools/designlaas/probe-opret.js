/* KUNDEREJSEN PUNKT 1 (v3438, Idas testkøb 22/11): »Opret profil« på siden fra adgangsmailen skal åbne appen. Køres af koer.sh som kunde i selen; login er efterlignet (verifyOtp og getSession byttes ud i proben). */
(async function () {
  var r = { tjek: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function t(n, ok, d) { r.tjek.push({ loefte: 0, navn: n, ok: !!ok, detalje: String(d || "").slice(0, 260) }); }
  var g = function () { return document.getElementById("authGate"); }, k = function () { return document.getElementById("opKnap"); };
  var synlig = function () { return getComputedStyle(g()).display !== "none"; };
  var besked = function () { var e = document.getElementById("authMsg"); return e && getComputedStyle(e).display !== "none" ? e.textContent : ""; };
  try {
    await V(4000); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    var session = (await sb.auth.getSession()).data.session, aegteEnter = window.enterApp, kald = 0, enterKald = 0;
    var scene = function () { g().style.display = "flex"; authShow("opret"); window.__ENERGIDA_OPRET = { t: "proevetoken1234567890", m: "proeve@eksempel.dk" }; k().disabled = false; k().textContent = "Opret profil"; };
    sb.auth.verifyOtp = function () { kald++; return Promise.resolve({ data: { session: session }, error: null }); };
    /* 1) LYKKES: ikke logget ind → tryk »Opret profil« → appen skal åbne (login-siden væk) */
    sb.auth.getSession = function () { return Promise.resolve({ data: { session: null }, error: null }); };
    window.enterApp = function () { enterKald++; return aegteEnter.apply(this, arguments); };
    scene(); k().click(); await V(5000);
    t("1 · lykkes: login-siden er væk efter »Opret profil«", !synlig(), "login-siden " + (synlig() ? "står stadig, knappen siger »" + k().textContent + "«" : "væk") + " · verifyOtp kaldt " + kald + " · enterApp kaldt " + enterKald);
    /* 2) FEJLER: appen åbner ikke → efter 15 s står beskeden, og knappen kan trykkes igen */
    window.enterApp = function () { enterKald++; return Promise.resolve(); };
    scene(); k().click(); await V(1000);
    var midt = k().textContent + (k().disabled ? " (slået fra)" : "");
    await V(15500);
    t("2 · fejler: beskeden står, og knappen er klar igen", synlig() && /Vi kunne ikke åbne dit Studio/.test(besked()) && !k().disabled && k().textContent === "Opret profil", "undervejs »" + midt + "« · efter 15 s: besked »" + besked() + "« · knap »" + k().textContent + "«" + (k().disabled ? " (slået fra)" : ""));
    /* 3) NYT FORSØG: kunden ER logget ind → appen åbnes uden at bruge linket igen */
    var foer = kald; sb.auth.getSession = function () { return Promise.resolve({ data: { session: session }, error: null }); };
    window.enterApp = function () { enterKald++; return aegteEnter.apply(this, arguments); };
    k().click(); await V(5000);
    t("3 · nyt forsøg: appen åbner, linket bruges ikke igen", !synlig() && kald === foer && !/allerede brugt/.test(besked()), "login-siden " + (synlig() ? "står stadig" : "væk") + " · verifyOtp kaldt " + (kald - foer) + " gange mere · besked »" + besked() + "«");
    /* 4) SIKKERHED (v3438, kontraktens §8): browseren er logget ind som én mail, og der ligger et UBRUGT link til en ANDEN mail → linket SKAL bruges (verifyOtp), appen må ikke åbnes på den konto, der var logget ind */
    var foer4 = kald; var anden = JSON.parse(JSON.stringify(session || {})); anden.user = Object.assign({}, (session && session.user) || {}, { email: "en-anden@eksempel.dk" });
    sb.auth.getSession = function () { return Promise.resolve({ data: { session: anden }, error: null }); };
    scene(); k().click(); await V(3000);
    t("4 · ubrugt link til en anden mail bruges, selv om nogen er logget ind", kald === foer4 + 1, "verifyOtp kaldt " + (kald - foer4) + " gang(e) (skal 1)");
    /* 5) samme mail som linket og allerede logget ind → appen åbnes uden at bruge linket */
    var foer5 = kald; var samme = JSON.parse(JSON.stringify(session || {})); samme.user = Object.assign({}, (session && session.user) || {}, { email: "Proeve@eksempel.dk" });
    sb.auth.getSession = function () { return Promise.resolve({ data: { session: samme }, error: null }); };
    scene(); k().click(); await V(3000);
    t("5 · linkets egen mail er logget ind: linket bruges ikke igen", kald === foer5, "verifyOtp kaldt " + (kald - foer5) + " gang(e) (skal 0)");
  } catch (e) { r.fejl = String(e && e.message || e); }
  var fejl = r.tjek.filter(function (x) { return !x.ok; }); fejl.forEach(function (x) { console.log("SELE OPRET FEJL: " + x.navn + " · " + x.detalje); }); if (r.fejl) console.log("SELE OPRET FEJL: proben fejlede: " + r.fejl); console.log(!fejl.length && !r.fejl && r.tjek.length === 5 ? "SELE OPRET OK: »Opret profil« åbner appen, fejlen siges, og et ubrugt link til en anden mail bruges altid (5 prøver)" : "SELE OPRET FEJL: " + fejl.length + " af " + r.tjek.length + " prøver"); console.log("@@" + JSON.stringify(r) + "@@");
})();
