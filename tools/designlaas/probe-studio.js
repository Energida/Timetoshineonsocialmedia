/* v3464 · OPTAGEDAGEN I ENERGIDA STUDIO (Ida 24/11: »Jeg skal til at optage flere moduler de kommende dage. Er der noget der kan optimeres for mig i Energida Studio?« · »1. Optaget · Næste lektion, 2. Status på modulsiden, 5–7. Ryddeligere prompter og video«).
   1) Teleprompteren: »Optaget · Næste lektion« sætter lektionens status Optaget og åbner den næste, der er klar til optagelse, direkte i prompteren; ingen næste → prompteren lukkes og knappen hedder »Optaget · Luk«.
   2) Modulsiden: hver lektion i venstre liste har sit statusord, og modulrækken siger »N klar til optagelse«.
   5) Én Luk-knap, og toppen glider væk, mens teksten ruller.  6) Videoen vises under linket; et link, der ikke ligner en video, siges.  7) 3-2-1 med lektionens nummer og navn, optagelse nr. og dato.
   Køres af koer.sh som Backstage på 390 og 1440 (den huskende base). */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [], n = 0;
  var T = function (ok, d) { n++; if (!ok) fejl.push(d); };
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} await V(600);
    var M = "YGT · Modul 1";
    await sb.from("video_opgaver").insert([
      { id: "st1", titel: "1.1 · Første lektion", modul: M, status: "Manus godkendt", manus_tekst: "Hej og velkommen.", sort_nr: 1 },
      { id: "st2", titel: "1.2 · Anden lektion", modul: M, status: "Manus ikke godkendt", manus_tekst: "", sort_nr: 2 },
      { id: "st3", titel: "1.3 · Tredje lektion", modul: M, status: "Manus godkendt", manus_tekst: "Tredje manus.", sort_nr: 3 },
      { id: "st4", titel: "1.4 · Fjerde lektion", modul: M, status: "Råfiler klar", manus_tekst: "Fjerde manus.", sort_nr: 4 }]);
    try { visDashSide("klip"); } catch (e) {} await V(1500);
    try { await klipHent(); } catch (e) {} await V(800);
    var o1 = (KLIP_OPGAVER || []).find(function (x) { return String(x.id) === "st1"; });
    T(!!o1, "Studiet fandt ikke prøvelektionerne (KLIP_OPGAVER har " + (KLIP_OPGAVER || []).length + ")");
    /* 2 · modulsidens statusord */
    var liste = (KLIP_OPGAVER || []).filter(function (x) { return String(x.modul) === M; }).sort(klipSortCmp);
    var html = ""; try { html = bf3Ms2VenstreHtml(liste, "1"); } catch (e) { html = "FEJL " + e.message; }
    var d = document.createElement("div"); d.innerHTML = html; var ord = [].map.call(d.querySelectorAll(".ms2-lek"), function (e) { return ((e.querySelector(".ms2-n") || {}).textContent || "").trim().slice(0, 6) + "=" + ((e.querySelector(".ms2-st") || {}).textContent || "–"); });
    T(ord.length === 4 && /=Klar til optagelse/.test(ord[0]) && /=Manus mangler/.test(ord[1]) && /=Klar til optagelse/.test(ord[2]) && /=Optaget/.test(ord[3]), "statusordene ved lektionerne er forkerte: " + ord.join(" | "));
    try { KLIP_ER_IDA = true; BF3_MODUL_AABEN = false; KLIP_MODUL_CHIP = null; BF3_MODUL_RET = false; klipVisningSaet("moduler"); } catch (e) {} await V(1200);
    var lekord = [].map.call(document.querySelectorAll(".bs3-lekord"), function (e) { return (e.textContent || "").trim(); });
    T(klipModStatus(liste) === "2 klar til optagelse", "modulrækkens status er ikke »2 klar til optagelse«: " + klipModStatus(liste));
    T(klipModStatus([liste[3]]) === "Optaget" && klipModStatus(liste.slice(1, 2)) === "Manus mangler", "en lektion alene skal sige sit eget skridt");
    T(!lekord.length || lekord.some(function (t) { return /^2 klar til optagelse$/.test(t); }), "modulrækken på siden siger ikke »2 klar til optagelse«: " + lekord.join(" | "));
    /* 1 · Optaget · Næste lektion */
    prompterAaben("st1"); await V(600);
    var knap = document.getElementById("prompterOptaget");
    T(!!knap && /Optaget · Næste lektion/.test(knap.textContent), "prompteren mangler »Optaget · Næste lektion«: " + (knap ? knap.textContent : "ingen knap"));
    var top = document.getElementById("prompterTop"); var luk = [].filter.call(top.querySelectorAll("button"), function (b) { return /^(Luk|Tilbage)/.test((b.textContent || "").trim()); });
    T(luk.length === 1 && /^Luk$/.test(luk[0].textContent.trim()), "toppen har ikke præcis én Luk-knap: " + luk.map(function (b) { return b.textContent.trim(); }).join(" | "));
    var kn = [].slice.call(top.querySelectorAll("button")); var br = kn.map(function (b) { var q = b.getBoundingClientRect(); return { h: Math.round(q.height), r: q.right, l: q.left }; });
    T(br.every(function (q) { return q.h >= 44 && q.r <= innerWidth + 1 && q.l >= -1; }), "knapperne i prompterens top er under 44 px eller rager ud: " + JSON.stringify(br.map(function (q) { return q.h; })));
    T(document.documentElement.scrollWidth <= innerWidth, "vandret rulning: " + document.documentElement.scrollWidth + "/" + innerWidth);
    /* 7 + 5 · nedtælling, så rullende tekst og top væk */
    prompterToggle(); await V(300);
    var ned = document.getElementById("prompterNed");
    T(!!ned && ned.classList.contains("on") && /1\.1/.test(ned.textContent) && /Første lektion/.test(ned.textContent) && /Optagelse 1/.test(ned.textContent) && /\d+\/\d+/.test(ned.textContent) && /^[123]$/.test((document.getElementById("pnTal") || {}).textContent || ""), "nedtællingen mangler nummer, navn, optagelse nr. eller dato: " + (ned ? ned.textContent : "ingen"));
    await V(3600);
    T(PR_KOERER === true && !document.getElementById("prompterNed").classList.contains("on"), "prompteren startede ikke efter nedtællingen");
    var bak = document.getElementById("prompterBack"); await V(500);
    T(bak.classList.contains("koerer") && parseFloat(getComputedStyle(top).opacity) < 0.1, "toppen glider ikke væk, mens teksten ruller");
    prompterToggle(); top.style.transition = "none"; await V(500);
    T(!bak.classList.contains("koerer") && parseFloat(getComputedStyle(top).opacity) > 0.9, "toppen kommer ikke frem ved pause (klasser: " + bak.className + ", opacity " + getComputedStyle(top).opacity + ", kører " + PR_KOERER + ")");
    /* 1 · videre til næste */
    prompterOptaget(); await V(1500);
    var s1 = (KLIP_OPGAVER || []).find(function (x) { return String(x.id) === "st1"; });
    T(s1 && s1.status === "Råfiler klar", "lektion 1.1 fik ikke status Optaget: " + (s1 && s1.status));
    var db = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); var r1 = (db.video_opgaver || []).filter(function (x) { return x.id === "st1"; });
    T(r1.length === 1 && r1[0].status === "Råfiler klar", "statussen er ikke skrevet i basen: " + JSON.stringify(r1.map(function (x) { return x.status; })));
    T(bak.classList.contains("on") && /Tredje lektion/.test((document.getElementById("prompterTitel") || {}).textContent || ""), "den næste lektion (1.3, ikke 1.2 uden manus) åbnede ikke i prompteren: " + ((document.getElementById("prompterTitel") || {}).textContent || "lukket"));
    T(/Optaget · Luk/.test((document.getElementById("prompterOptaget") || {}).textContent || ""), "på den sidste klar lektion hedder knappen ikke »Optaget · Luk«");
    prompterOptaget(); await V(1200);
    T(!bak.classList.contains("on"), "prompteren lukkede ikke, da der ikke var flere lektioner");
    var s3 = (KLIP_OPGAVER || []).find(function (x) { return String(x.id) === "st3"; }); T(s3 && s3.status === "Råfiler klar", "lektion 1.3 fik ikke status Optaget");
    /* 6 · videoen under linket */
    T(/player\.vimeo\.com\/video\/123456789\?h=abcdef12/.test(kbuVideoHtml("https://vimeo.com/123456789/abcdef12")) && /<iframe/.test(kbuVideoHtml("https://vimeo.com/123456789/abcdef12")), "et Vimeo-link vises ikke som afspiller");
    T(/Linket ligner ikke en video/.test(kbuVideoHtml("hej med dig")) && kbuVideoHtml("") === "", "et link, der ikke ligner en video, siges ikke");
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE STUDIO FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE STUDIO FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE STUDIO OK " + innerWidth + ": " + n + " målinger — Optaget · Næste lektion, statusord på modulsiden, én Luk, toppen væk under afspilning, nedtælling og video under linket");
})();
