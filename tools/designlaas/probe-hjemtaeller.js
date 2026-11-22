/* v3439 · HVEM TÆLLER PÅ BACKSTAGES HJEM, OG HVEM HAR EN KUNDESIDE (Ida 22/11: »men INGEN you got this kunder skal kunne have sæt contentmøde på deres crm« · »og hvorfor synkroniseres køb ikke?!?!«).
   1) En YOU GOT THIS-kunde åbnet som kundeside har 0 forekomster af »contentmøde«. 2) En kode uden opsætning åbner aldrig kundesiden. 3) En slettet kode og et testkøb tæller ikke i hjemTaeller() og står ikke i dtYgtKoder(). Køres af koer.sh i Backstage-selen. */
setTimeout(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [];
  try {
    VIRKSOMHEDSKODER["PROEVEYGT1"] = { virksomhed: "Prøvebutikken", forloeb: "YOU GOT THIS — DETAIL", type: "kursus", aktiv: true };
    VIRKSOMHEDSKODER["PROEVETEST1"] = { virksomhed: "Prøvetesten", forloeb: "YOU GOT THIS — DETAIL", type: "kursus", aktiv: true };
    LIVE_TESTKODER["PROEVETEST1"] = 1;
    if (hjemTaeller("PROEVEYGT1") !== true) fejl.push("en rigtig YOU GOT THIS-kunde tæller ikke");
    if (hjemTaeller("SLETTETKODE9") !== false) fejl.push("en kode, der ikke findes, tæller");
    if (hjemTaeller("PROEVETEST1") !== false) fejl.push("en kode fra et testkøb tæller");
    var koder = dtYgtKoder(); if (koder.indexOf("PROEVEYGT1") < 0) fejl.push("kunden mangler i Hjems kundeliste"); if (koder.indexOf("PROEVETEST1") > -1 || koder.indexOf("SLETTETKODE9") > -1) fejl.push("testkøb eller slettet kode står i Hjems kundeliste");
    /* v3444 · »Klik i dine mails« er kun mails til kunder: en testkode, en slettet kode og en prøvemail tæller ikke */
    var nuT = new Date().toISOString(), tal = mailKlikTael([{ kode: "PROEVEYGT1", svar: { klik: [{ k: "velkomst", t: nuT }, { k: "Prøve · velkomst", t: nuT }] } }, { kode: "PROEVETEST1", svar: { klik: [{ k: "velkomst", t: nuT }] } }, { kode: "SLETTETKODE9", svar: { klik: [{ k: "velkomst", t: nuT }] } }]);
    if (tal.velkomst !== 1) fejl.push("klik i appen fra mails: velkomst tæller " + tal.velkomst + " (skal 1: kun kunden)"); if (Object.keys(tal).length !== 1) fejl.push("en prøvemail står blandt klik i appen: " + Object.keys(tal).join(", "));
    var fl = liveOverblikHtml({ koeb: [], akt: [], lek: [], m0: {}, mangler: [], appKlik: tal, bv: { mails: [{ navn: "Prøve · Nyhedsbrev", klik: 3, sendt: 4 }, { navn: "Nyhedsbrev uge 47", klik: 2, sendt: 9 }] }, ga: { mails: [{ kampagne: "Test af velkomst", besoeg: 5 }] } });
    var tmp = document.createElement("div"); tmp.innerHTML = fl; var mt = [].map.call(tmp.querySelectorAll(".lv-mails .lv-mail-n"), function (e) { return e.textContent; });
    if (mt.indexOf("Nyhedsbrev uge 47") < 0 || mt.indexOf("velkomst") < 0) fejl.push("flisen »Klik i dine mails« mangler kundemailen: " + mt.join(" | ")); if (mt.some(function (x) { return /prøve|test/i.test(x); })) fejl.push("en prøve- eller testmail står i »Klik i dine mails«: " + mt.join(" | "));
    kundeSideVis("PROEVEYGT1"); await V(2500);
    var el = document.getElementById("bsKundeside"), tx = el ? (el.innerText || "") : ""; var n = (tx.match(/contentmøde/gi) || []).length;
    if (!el || !tx.trim()) fejl.push("kundesiden for YOU GOT THIS-kunden blev ikke tegnet"); if (n) fejl.push("YOU GOT THIS-kundens side har " + n + " × »contentmøde«");
    if (/Sæt contentmødet|Ny aftale/.test(tx)) fejl.push("YOU GOT THIS-kundens side har »Sæt contentmødet« eller »Ny aftale«");
    visDashSide("overblik"); await V(800); var foer = window.BS_KUNDE;
    kundeSideVis("SLETTETKODE9"); await V(1500);
    if (window.BS_KUNDE === "SLETTETKODE9" || (typeof BS_KUNDE !== "undefined" && BS_KUNDE === "SLETTETKODE9")) fejl.push("en kode uden opsætning åbnede kundesiden");
    var t2 = (document.getElementById("bsKundeside") || {}).innerText || ""; if (/SLETTETKODE9/.test(t2)) fejl.push("den rå kode står som kundeside");
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE HJEMTAELLER FEJL: " + f); });
  console.log(fejl.length ? "SELE HJEMTAELLER FEJL: " + fejl.length + " fund" : "SELE HJEMTAELLER OK: YOU GOT THIS-kundens side har intet contentmøde, en ukendt kode har ingen kundeside, slettede koder og testkøb tæller ikke paa Hjem, og »Klik i dine mails« har kun mails til kunder");
}, 2500);
