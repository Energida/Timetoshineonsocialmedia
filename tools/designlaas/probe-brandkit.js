/* v3469 · BRANDKIT UNDER PROFIL (Ida 24/11: »Det er, at vi under profil laver et Brandkit … uploade sit logo … forvælge sine favorit skrifttyper … skabeloner med baggrunde … vælge farver, hvor man skal have mulighed for at skrive heksfarver ind« · »Ja, byg det nu«).
   Måler: flisen »Brandkit« på Profil (ikke »Dine skrifter«) · siden med fem fliser og den røde »Lav et billede« · farver (hex, loft) · favoritskrifter flyttes og gemmes · upload af logo og baggrund (lukket lager, stier med virksomhedens id) · editoren »Lav et billede« (format, Skabelon/Baggrund/Logo i rækkefølge,
   baggrunden tegnes, »Gem som skabelon«, knapperne 44 høje med 12 imellem) · det frie billede lægger intet på en brief · en konto uden virksomhed kan intet. Lageret og virksomhedens id er byttet ud; intet rigtigt gemmes. Køres af koer.sh som kunde på 390 og 1440 med den huskende base. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [], n = 0;
  var T = function (ok, d) { n++; if (!ok) fejl.push(d); };
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {} await V(600);
    window.ygtBriefLaast = function () { return false; };
    var lager = {}; sb.storage = { from: function () { return { upload: async function (sti, blob) { lager[sti] = blob; return { data: { path: sti }, error: null }; }, download: async function (sti) { return lager[sti] ? { data: lager[sti], error: null } : { data: null, error: { message: "findes ikke" } }; }, remove: async function (arr) { arr.forEach(function (s) { delete lager[s]; }); return { data: [], error: null }; } }; } };
    window.bsVirksomhedId = async function () { return "virk-1"; };
    var dbRk = function () { var db = JSON.parse(localStorage.getItem("SELE_DB") || "{}"); return (db.brandkit || []).filter(function (x) { return x.virksomhed_id === "virk-1"; }); };
    /* gamle favoritter fra skema_svar skal flyttes */
    var kode = String(currentKode || "").toUpperCase() || "SPOEGELSE2026";
    await sb.from("skema_svar").insert({ kode: kode, navn: "config", skema: "skrifter", svar: { fav: ["Modern", "Poster"] } });
    /* 1 · Profil */
    await minProfilAaben(); await V(1500);
    var et = [].map.call(document.querySelectorAll("#tilpasSideIndhold .prof-e"), function (e) { return e.textContent.trim(); });
    T(et.indexOf("Brandkit") > -1 && et.indexOf("Dine skrifter") < 0, "Profil: flisen »Brandkit« står ikke, eller »Dine skrifter« står stadig: " + et.join(" | "));
    var pr = document.getElementById("bkProfil"); if (pr) pr.click(); await V(1800);
    var lav = document.querySelector("#bkSide .bk-lav"); var lab = [].map.call(document.querySelectorAll("#bkSide .bk-e"), function (e) { return e.textContent.trim(); });
    T(!!lav && /Lav et billede/.test(lav.textContent) && lab.join(",") === "Logo,Farver,Skrifter,Baggrunde,Skabeloner", "siden: »Lav et billede« og fem fliser i rækkefølgen Logo · Farver · Skrifter · Baggrunde · Skabeloner mangler: " + (lav ? lav.textContent : "ingen knap") + " · " + lab.join(","));
    var skr = dbRk()[0];
    T(!!skr && JSON.stringify(skr.skrifter) === JSON.stringify(["Modern", "Poster"]), "de gamle favoritskrifter blev ikke flyttet til Brandkittet: " + JSON.stringify(skr && skr.skrifter));
    var qB = document.querySelector("#bkSide .bk-blok.bk-halv"), qB2 = document.querySelectorAll("#bkSide .bk-blok.bk-halv")[1];
    if (innerWidth >= 900 && qB && qB2) { var a = qB.getBoundingClientRect(), b = qB2.getBoundingClientRect(); T(Math.abs(a.width - b.width) < 1 && Math.abs(a.top - b.top) < 1, "Logo og Farver står ikke side om side, lige brede: " + Math.round(a.width) + " / " + Math.round(b.width)); }
    var pl = document.querySelector("#bkSide .bk-plus"); if (pl) { var q = pl.getBoundingClientRect(); T(Math.round(q.width) === 36 && Math.round(q.height) === 36, "husets røde plus er ikke 36 px: " + Math.round(q.width) + "×" + Math.round(q.height)); }
    /* 2 · farver */
    var hx = document.getElementById("bkHex"); hx.value = "fc2404"; bkHexInd(hx); await bkFarveTilfoej(); await V(400);
    T(dbRk()[0].farver.join() === "#FC2404", "en farve skrevet som fc2404 gemmes ikke som #FC2404: " + dbRk()[0].farver.join());
    hx = document.getElementById("bkHex"); hx.value = "zzz"; await bkFarveTilfoej(); await V(300);
    T(dbRk()[0].farver.length === 1, "en ugyldig farvekode blev gemt");
    var kul = ["#FFFFFF", "#C9DBE7", "#F2F0ED", "#E9EFF4", "#1A1A1A", "#F2D7A7", "#A32D2D", "#2F9E5B", "#686868"]; for (var i = 0; i < kul.length; i++) { hx = document.getElementById("bkHex"); if (!hx) break; hx.value = kul[i]; await bkFarveTilfoej(); }
    await V(300); T(dbRk()[0].farver.length === 10 && !document.getElementById("bkHex"), "loftet på 10 farver holder ikke (felt står stadig, eller antal er " + dbRk()[0].farver.length + ")");
    /* 3 · favoritskrift */
    await bkSkriftSkift("Elegant"); await V(300);
    T(dbRk()[0].skrifter.indexOf("Elegant") > -1 && /Elegant/.test((document.querySelector("#bkSide .bk-chips .ark-chip.on:nth-of-type(3)") || document.querySelector("#bkSide .bk-chips") || {}).textContent || ""), "en favoritskrift gemmes ikke: " + JSON.stringify(dbRk()[0].skrifter));
    /* 4 · upload */
    var lavFil = function (b, h, farve, type) { return new Promise(function (ok) { var c = document.createElement("canvas"); c.width = b; c.height = h; var x = c.getContext("2d"); x.fillStyle = farve; x.fillRect(0, 0, b, h); if (type === "image/png") { x.fillStyle = "rgba(0,0,0,0)"; } c.toBlob(function (bl) { ok(new File([bl], type === "image/png" ? "logo.png" : "bg.jpg", { type: type })); }, type); }); };
    await bkFilValgt("logo", { files: [await lavFil(300, 120, "#1A1A1A", "image/png")] }); await V(600);
    var lg = dbRk()[0].logoer; T(lg.length === 1 && /^virk-1\/logo\/[a-z0-9]+\.png$/.test(lg[0].sti) && !!lager[lg[0].sti], "logoet er ikke lagt i lageret under virksomhedens id: " + JSON.stringify(lg));
    await bkFilValgt("logo", { files: [new File(["x"], "logo.svg", { type: "image/svg+xml" })] }); await V(200);
    T(dbRk()[0].logoer.length === 1, "en SVG blev taget imod som logo");
    await bkFilValgt("baggrund", { files: [await lavFil(900, 1400, "#C9DBE7", "image/jpeg")] }); await V(600);
    var bg = dbRk()[0].baggrunde; T(bg.length === 1 && /^virk-1\/baggrund\/[a-z0-9]+\.jpg$/.test(bg[0].sti) && !!lager[bg[0].sti], "baggrunden er ikke lagt i lageret under virksomhedens id: " + JSON.stringify(bg));
    T(!!document.querySelector("#bkSide .bk-logo img") && !!document.querySelector("#bkSide .bk-bg img"), "logoet og baggrunden vises ikke på siden");
    T(document.documentElement.scrollWidth <= innerWidth, "vandret rulning: " + document.documentElement.scrollWidth + "/" + innerWidth);
    /* 5 · editoren */
    var saveBriefKald = 0, glSave = window.saveBrief; window.saveBrief = function () { saveBriefKald++; return glSave && glSave.apply(this, arguments); };
    var briefFoer = BRIEF_STATE, idFoer = BRIEF_ID;
    bkLav(); await V(1500);
    var ed = document.getElementById("cvEd"), tit = ed && ed.querySelector(".cv-titel");
    T(!!ed && ed.classList.contains("on") && tit && /Lav et billede/.test(tit.textContent), "editoren »Lav et billede« åbner ikke");
    var fm = [].map.call(document.querySelectorAll("#cvFaner .ark-chip"), function (e) { return e.textContent.trim(); });
    T(fm.join(",") === "Karrusel,Coverbillede,Story", "formatvalget står ikke øverst: " + fm.join(","));
    var sek = [].map.call(document.querySelectorAll("#cvPanel .cv-sek"), function (e) { return e.textContent.trim(); });
    T(sek.join(",") === "Baggrund,Logo,Tekster,Skrift,Effekt,Farve", "panelets rækkefølge er forkert: " + sek.join(","));
    bkBgSaet("farve", "#C9DBE7"); await V(400);
    var cv = document.getElementById("cvC"), px = cv.getContext("2d").getImageData(4, 4, 1, 1).data;
    T(Math.abs(px[0] - 201) < 8 && Math.abs(px[1] - 219) < 8 && Math.abs(px[2] - 231) < 8, "baggrunden tegnes ikke på billedet: " + px[0] + "," + px[1] + "," + px[2]);
    var onBg = document.querySelector("#cvPanel .cv-bg.on i"); T(!!onBg && Math.round(onBg.getBoundingClientRect().width) === 28, "den valgte baggrund har ikke husets flueben på 28 px");
    bkLogoSaet("nederst"); await V(500); T(cvD().logo === "nederst", "logoet kunne ikke sættes nederst");
    var mik = document.querySelector("#cvPanel .cv-felt .brief-mik, #cvPanel .cv-felt [id^=taleKnap]"); T(!!mik || !(window.SpeechRecognition || window.webkitSpeechRecognition), "tekstfeltet har ikke den grå mikrofon");
    var kn = [].slice.call(document.querySelectorAll("#cvPanel .cv-knapper .dbtn")); var knT = kn.map(function (e) { return e.textContent.trim(); });
    T(knT.join(",") === "Gem billedet,Gem som skabelon,Annuller", "knapperne er ikke Gem billedet · Gem som skabelon · Annuller: " + knT.join(","));
    var gaps = []; for (var j = 1; j < kn.length; j++) { gaps.push(Math.round((kn[j].getBoundingClientRect().top - kn[j - 1].getBoundingClientRect().bottom) * 10) / 10); }
    T(kn.every(function (e) { return Math.round(e.getBoundingClientRect().height) === 44; }) && gaps.every(function (g) { return Math.abs(g - 12) <= 0.5; }), "knapperne er ikke 44 høje med 12 imellem: " + kn.map(function (e) { return Math.round(e.getBoundingClientRect().height); }).join("/") + " · " + gaps.join("/"));
    /* skabelon */
    var cap = null, glArk = window.arkAabn; window.arkAabn = function (o) { cap = o; }; bkSkabNy(); window.arkAabn = glArk;
    T(!!cap && /Navn på skabelonen/.test(cap.titel), "»Gem som skabelon« spørger ikke om et navn");
    if (cap) { var svar = await cap.gem("Tip-slide"); await V(300); var sk = dbRk()[0].skabeloner; T(svar === "Gemt." && sk.length === 1 && sk[0].navn === "Tip-slide" && sk[0].bg && sk[0].bg.f === "#C9DBE7" && sk[0].logo === "nederst", "skabelonen gemmes ikke med baggrund og logo: " + JSON.stringify(sk)); }
    bkBgSaet("", ""); await V(300); T(!cvD().bg, "baggrunden kunne ikke sættes tilbage til Foto");
    var sc = [].map.call(document.querySelectorAll("#cvPanel .cv-sek"), function (e) { return e.textContent.trim(); }); T(sc[0] === "Skabelon", "Skabelon står ikke først i panelet, når der findes skabeloner: " + sc.join(","));
    bkBrugSkab(dbRk()[0].skabeloner[0].id); await V(400); T(cvD().bg && cvD().bg.f === "#C9DBE7" && cvD().logo === "nederst", "en skabelon lægger ikke baggrund og logo på billedet");
    bkFormat("cover"); await V(300); T(CV.noegle === "cover" && cvEl("cvC").style.aspectRatio.indexOf("9") === 0, "formatet Coverbillede skifter ikke til 9:16");
    cvLuk(); await V(400);
    T(BRIEF_STATE === briefFoer && BRIEF_ID === idFoer && saveBriefKald === 0, "det frie billede rørte en brief (gemt " + saveBriefKald + " gange) eller satte ikke briefen tilbage");
    window.saveBrief = glSave;
    /* 6 · konto uden virksomhed */
    window.bsVirksomhedId = async function () { return ""; }; BK.hentet = false; BK.utenVirk = false; BK.d = { farver: [], skrifter: [], logoer: [], baggrunde: [], skabeloner: [] };
    await bkSide(); await V(800);
    T(BK.utenVirk === true && !document.querySelector("#bkSide .bk-plus") && !!document.querySelector("#bkSide .bk-lav[disabled]") && /kan ikke åbnes/.test(document.getElementById("bkSide").textContent), "en konto uden virksomhed kan stadig røre ved Brandkittet");
    var foerEd = !!document.getElementById("cvEd") && document.getElementById("cvEd").classList.contains("on"); bkLav(); await V(300);
    T(!(document.getElementById("cvEd") && document.getElementById("cvEd").classList.contains("on")), "editoren åbner for en konto uden virksomhed");
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message) + " " + String(e && e.stack || "").split("\n")[1]); }
  fejl.forEach(function (f) { console.log("SELE BRANDKIT FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE BRANDKIT FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE BRANDKIT OK " + innerWidth + ": " + n + " målinger — flisen på Profil, siden med fem fliser, farver og favoritskrifter, upload i det lukkede lager, editoren »Lav et billede« med baggrund, logo og skabelon, og en konto uden virksomhed kan intet");
})();
