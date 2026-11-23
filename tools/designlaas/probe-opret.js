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
    /* v3446 · DIREKTE IND FRA MAILEN (Ida 23/11) — 6) uden et tegn på et menneske bruges nøglen ALDRIG (mailprogrammers forhåndstjek); 7) efter 4 s står siden med knappen som reserve;
       8) ved første tegn bruges nøglen én gang, og forsiden ses ikke i et eneste øjeblik, før profilguiden eller kodearket står (tæppet venter fra trykket — proben har kørt længe, så den gamle 12-sekunders grænse fra sidens hentning er for længst overskredet) */
    try { clearTimeout(window.__OPRET_VAGT); } catch (e) {} await V(500);
    var foer6 = kald; sb.auth.verifyOtp = function () { kald++; try { localStorage.setItem("energida_skal_ny_kode", "invitation"); } catch (e) {} return Promise.resolve({ data: { session: session }, error: null }); };
    sb.auth.getSession = function () { return Promise.resolve({ data: { session: null }, error: null }); };
    window.enterApp = function () { enterKald++; return aegteEnter.apply(this, arguments); };
    g().style.display = "flex"; window.__ENERGIDA_OPRET = { t: "proevetoken1234567890", m: "proeve@eksempel.dk" }; window.__OPRET_AUTO_KOERT = false; window.__OPRET_AUTO_PROEVE = false; k().disabled = false; k().textContent = "Opret profil";   /* knappen som på en frisk side (prøve 4 og 5 efterlod den midt i et tryk) */
    opretVedIndgang(); await V(3000);
    window.dispatchEvent(new Event("pointermove")); await V(300);   /* en hændelse, der IKKE kommer fra et menneske (isTrusted er falsk), må heller ikke bruge nøglen */
    t("6 · uden et menneske bruges nøglen ikke", kald === foer6, "verifyOtp kaldt " + (kald - foer6) + " gang(e) på 3,3 s uden rigtige hændelser (skal 0)");
    await V(1200);
    t("7 · efter 4 s står siden med knappen", synlig() && document.body.classList.contains("app-klar") && k().textContent === "Opret profil" && !k().disabled, "login-siden " + (synlig() ? "står" : "væk") + " · tæppet " + (document.body.classList.contains("app-klar") ? "af" : "på") + " · knap »" + k().textContent + "«");
    var glimt = 0, nn = 0; var iv8 = setInterval(function () { nn++; if (document.body.classList.contains("app-klar") && !synlig() && !document.getElementById("pfFlow") && !document.getElementById("nyKodeBoks")) glimt++; }, 40);
    window.__OPRET_AUTO_PROEVE = true; window.dispatchEvent(new Event("pointermove")); await V(400); window.dispatchEvent(new Event("pointermove")); await V(8000); clearInterval(iv8); window.__OPRET_AUTO_PROEVE = false;
    t("8 · første tegn bruger nøglen én gang, og forsiden ses ikke før profilen", kald === foer6 + 1 && !synlig() && glimt === 0 && nn > 100, "verifyOtp kaldt " + (kald - foer6) + " gang(e) (skal 1) · login-siden " + (synlig() ? "står" : "væk") + " · forsiden set i " + glimt + " af " + nn + " prøver (skal 0)");
    try { localStorage.removeItem("energida_skal_ny_kode"); } catch (e) {}
    /* v3446 · PROFILGUIDEN (Ida 23/11): 9) nævneren i »x af y« skifter aldrig undervejs, heller ikke når adgangskoden er gemt, og et Tilbage fra virksomheden lander på rollen med samme nævner;
       »Næste« og »Tilbage« står 10 fra hinanden. Adgangskoden gemmes ikke rigtigt (updateUser er byttet ud). */
    try { clearTimeout(window.__OPRET_VAGT); } catch (e) {}
    sb.auth.updateUser = function () { return Promise.resolve({ data: {}, error: null }); };
    try { localStorage.removeItem(pfKladdeNoegle()); } catch (e) {}
    localStorage.setItem("energida_skal_ny_kode", "invitation"); PF = null; var glPf = document.getElementById("pfFlow"); if (glPf) glPf.remove();
    await profilFlowStart(); await V(600);
    var pfTal = function () { var b = document.querySelector("#pfFlow .pf-bar1 b"); return (b ? b.textContent : "?") + " [" + pfSkaerm() + "]"; };
    Object.assign(PF.f, { navn: "Lene", efternavn: "Prøve", dag: "12", mdr: "5", aar: "1980", ejer: "ja", rolle: "", pw: "hemmelig12" });
    var sti = [pfTal()], afst = null;
    for (var i9 = 0; i9 < 8 && PF && PF.trin === 1; i9++) { if (pfSkaerm() === "pw") { PF.f.pw = "hemmelig12"; var n9 = document.getElementById("pfNaeste"), t9 = document.querySelector("#pfFlow .pf-knap-tb"); if (n9 && t9) afst = Math.round(t9.getBoundingClientRect().top - n9.getBoundingClientRect().bottom); } await pfNaeste(); await V(700); if (PF) sti.push(pfTal()); }
    await pfTilbage(); await V(400); sti.push("Tilbage: " + pfTal()); var paaRolle = pfSkaerm() === "rolle";
    var naevn = sti.map(function (x) { return (x.match(/af (\d+)/) || [])[1]; });
    t("9 · profilguiden: nævneren skifter ikke, Tilbage lander på rollen, knapperne står 10 fra hinanden", sti.length >= 5 && naevn.every(function (x) { return x && x === naevn[0]; }) && paaRolle && afst === 10, sti.join(" → ") + " · knapafstand " + afst + " (skal 10)");
    try { localStorage.removeItem("energida_skal_ny_kode"); localStorage.removeItem(pfKladdeNoegle()); } catch (e) {}
  } catch (e) { r.fejl = String(e && e.message || e); }
  var fejl = r.tjek.filter(function (x) { return !x.ok; }); fejl.forEach(function (x) { console.log("SELE OPRET FEJL: " + x.navn + " · " + x.detalje); }); if (r.fejl) console.log("SELE OPRET FEJL: proben fejlede: " + r.fejl); console.log(!fejl.length && !r.fejl && r.tjek.length === 9 ? "SELE OPRET OK: »Opret profil« åbner appen, fejlen siges, et ubrugt link til en anden mail bruges altid, nøglen bruges ikke uden et menneske, forsiden ses ikke før profilen, og profilguidens tal skifter ikke (9 prøver)" : "SELE OPRET FEJL: " + fejl.length + " af " + r.tjek.length + " prøver"); console.log("@@" + JSON.stringify(r) + "@@");
})();
