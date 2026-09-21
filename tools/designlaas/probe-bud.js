/* BUD-LAASEN (LOVET Ida 20/9 kl. 21.50 efter v2149: »lav en gate som skal kontrolleres saa dette aldrig sker igen«).
   Et klikket bud er en liste af LOEFTER. Her staar de som maalinger, saa porten fejler, hvis eet mangler — paa 390 og 1440,
   med FULD forside (opslag, aftale, to-dos, Naeste skridt) og TOM forside. Koeres af koer.sh; skriver SELE BUD OK / SELE BUD FEJL.
   Buddet: Hjem = dagen, samme paa begge flader (RU7WwK18PTd2rkm4Y3Xp2b, Idas klik 20/9 kl. ~19.55). Nyt bud paa Hjem → ret loefterne her i SAMME commit. */
setTimeout(async function () {
  var vent = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var fejl = 0, F = function (t) { console.log("SELE BUD FEJL " + t); fejl++; };
  try {
    for (var v = 0; v < 40 && !document.body.classList.contains("app-klar"); v++) await vent(150);
    ["appLoader", "turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    try { turLuk(); } catch (e) {}
    var tlf = innerWidth < 900;
    var iso = function (n) { var d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
    var synlig = function (e) { if (!e) return false; var q = e.getBoundingClientRect(); var c = getComputedStyle(e); return q.width > 0 && q.height > 0 && c.display !== "none" && c.visibility !== "hidden"; };
    var rod = function () { return tlf ? document.getElementById("hjemFacit") || document.querySelector(".hf-ark") : document.getElementById("screen3"); };
    var tegn = async function () { try { document.body.classList.remove("hjem-facit"); } catch (e) {} showTab(3); renderHome(); try { renderAftaler(); } catch (e) {} try { renderKundeOpgaver(); } catch (e) {} await vent(1500); };
    var maal = function (tilstand) {
      var r = rod(); if (!r) { F(tilstand + ": Hjem ikke fundet"); return; }
      var tekst = (r.innerText || "").replace(/\s+/g, " ");
      /* 1) HEROEN ER HILSNEN + DATOEN, INTET CITAT — begge flader */
      if (tlf) {
        var hh = document.querySelector(".hf-hero-hilsen"), hd = document.querySelector(".hf-hero-dato");
        if (!synlig(hh) || !/aften|morgen|dag|formiddag|eftermiddag|Go'|God/i.test(hh.textContent)) F(tilstand + ": telefonens hero mangler hilsnen");
        if (!synlig(hd) || !/\d/.test(hd.textContent)) F(tilstand + ": telefonens hero mangler datoen");
        if (document.querySelector(".hf-hero-citat")) F(tilstand + ": citatet staar stadig i telefonens hero");
      } else {
        var mn = document.querySelector("#screen3 .mb-navn");
        if (!mn || !/aften|morgen|dag|Go'|God/i.test(mn.textContent)) F(tilstand + ": computerens baand mangler hilsnen");
        var mc = document.querySelector("#screen3 .mb-navn .mb-citat");
        if (!mc || !/\d/.test(mc.textContent)) F(tilstand + ": computerens baand mangler datoen under hilsnen");
        if (/»/.test((mn && mn.textContent) || "")) F(tilstand + ": citatet staar stadig i computerens baand");
      }
      /* 2) SEKTIONERNE I SAMME RAEKKEFOELGE PAA BEGGE FLADER */
      var y = function (sel) { var e = r.querySelector(sel); return synlig(e) ? e.getBoundingClientRect().top : null; };
      var yDag = y(".hjem-dag"), yAft = y("#aftaleListHome"), yOpg = y("#kundeOpgaverKort"), yUge = y(tlf ? ".hf-fliser" : "#ugeKortFinal");
      if (yDag === null) F(tilstand + ": I dag mangler");
      if (yAft === null) F(tilstand + ": Kommende aktiviteter mangler");
      if (yOpg === null) F(tilstand + ": To-do mangler");
      if (yUge === null) F(tilstand + ": Denne uge mangler");
      if (yDag !== null && yAft !== null && yOpg !== null && yUge !== null) {
        if (tlf) { if (!(yDag < yAft && yAft < yUge && yUge < yOpg)) F(tilstand + ": telefonens raekkefoelge er ikke I dag · Kommende aktiviteter · Denne uge · To-do"); }   /* To-do sidst (Ida 21/9 kl. 21.42) */
        else {
          var xV = document.getElementById("hjemVenstre").getBoundingClientRect(), xH = document.getElementById("hjemHoejre").getBoundingClientRect();
          if (!(xH.left > xV.right - 1)) F(tilstand + ": Kommende aktiviteter og To-do staar ikke i hoejre spalte ved siden af dagen");
          if (Math.abs(xH.top - xV.top) > 60) F(tilstand + ": hoejre spalte starter ikke oppe ved dagen (" + Math.round(xH.top - xV.top) + " px)");
          if (!(yAft < yOpg)) F(tilstand + ": To-do staar over Kommende aktiviteter");
          var xT = document.getElementById("hjemTop").getBoundingClientRect(); if (xH.width < xT.width * 0.29) F(tilstand + ": hoejre spalte er for smal (" + Math.round(xH.width) + " af " + Math.round(xT.width) + " px, skal vaere knap en tredjedel)");
          var strip = document.getElementById("ugenKortStrip"); if (synlig(strip) && strip.getBoundingClientRect().top < yUge) F(tilstand + ": Ugens indhold staar foer Denne uge");
        }
      }
      /* 3) ORDET »SKRIV« FINDES IKKE, OG SENDFELTERNE HEDDER TILFOEJ */
      [].forEach.call(r.querySelectorAll("input, textarea"), function (i) { var ph = i.placeholder || ""; if (/skriv/i.test(ph)) F(tilstand + ": pladsholder med ordet skriv: " + ph); });
      if (!r.querySelector('input[placeholder^="Tilføj ny aktivitet"]')) F(tilstand + ": sendfeltet »Tilføj ny aktivitet…« mangler");
      if (!r.querySelector('input[placeholder^="Tilføj to-do"]')) F(tilstand + ": sendfeltet »Tilføj to-do…« mangler");
      if (!/Gå til to-do/.test(tekst)) F(tilstand + ": knappen »Gå til to-do« mangler");
      /* 4) DAGEN: syv prikker, hele dagen, den roede flise oeverst naar der er noget */
      /* PILENE I OVERSKRIFTEN (Idas klik 21/9 kl. 13.55, bud 2): ingen prikker — to pile ved dagens navn */
      var pil2 = [].filter.call(r.querySelectorAll(".hjem-dag-hoved .hjem-pil"), function (e) { return e.getClientRects().length; }); var vilPile = innerWidth >= 900 ? 2 : 0;   /* telefonen swiper (Ida 21/9 kl. 17.40) */
      if (pil2.length !== vilPile) F(tilstand + ": pilene i I dag-overskriften er " + pil2.length + ", ikke " + vilPile);
      if (r.querySelector(".hjem-prik-rk")) F(tilstand + ": prikkerne under listen skulle vaere vaek (bud 2, 21/9)");
      var fliser = [].filter.call(r.querySelectorAll(".hjem-dag .idag-flise"), synlig);
      var pkt = ((window.__HJEM_FOKUS || {}).pkt || []).filter(function (x) { return !/^snart-/.test(String(x.dagsId || "")) && !x.haeng; });
      if (tilstand === "fuld") {
        if (!fliser.length || !fliser[0].classList.contains("idag-roed")) F("fuld: den foerste flise i I dag er ikke roed");
        if (fliser.length < 2) F("fuld: dagen viser ikke hele listen (" + fliser.length + " fliser)");
        var tomFlise = r.querySelector(".hjem-dag .idag-flise.tom"); if (synlig(tomFlise)) F("fuld: dagen siger »ingenting«, selv om der er punkter");
        if (!synlig(r.querySelector("#aftaleListHome .aft-rk"))) F("fuld: aftalen staar ikke som flise");
        if (!synlig(r.querySelector("#kundeOpgaverKort .opg-rk"))) F("fuld: to-do'en staar ikke som flise");
      } else {
        if (!synlig(r.querySelector("#aftaleListHome .aft-tom"))) F("tom: »Ingen kommende aktiviteter.« mangler som flise");
        if (!/Ingen to-dos/.test(tekst) && !synlig(r.querySelector("#kundeOpgaverKort .opg-rk"))) F("tom: To-do siger hverken »Ingen to-dos.« eller viser en raekke");
      }
      /* 4b) SAMME BREDDE: aftale-fliser, to-do-fliser og sendfelter i samme spalte er lige brede (16/9-reglen; Idas kommentar 20/9 kl. 21.55) */
      var bredder = [].map.call(r.querySelectorAll("#aftaleListHome .aft-rk, #aftaleListHome .aft-tom, #aftaleListHome .sendfelt, #kundeOpgaverKort .opg-rk, #kundeOpgaverKort .opg-tom, #kundeOpgaverKort .sendfelt, #kundeOpgaverKort .hf-gaa"), function (e) { return synlig(e) ? Math.round(e.getBoundingClientRect().width) : null; }).filter(function (x) { return x !== null; });
      if (bredder.length && Math.max.apply(null, bredder) - Math.min.apply(null, bredder) > 2) F(tilstand + ": fliserne i Kommende aktiviteter og To-do er ikke lige brede (" + Math.min.apply(null, bredder) + "–" + Math.max.apply(null, bredder) + " px)");
      /* 4d) UX-POLITIET: ingen lange streger i kundens linjer, Poppins aldrig fed, ingen kant paa fliser (15/9) */
      if (/\u2014/.test(tekst)) F(tilstand + ": en lang streg (\u2014) staar i Hjems tekst");
      [].forEach.call(r.querySelectorAll(".idag-titel, .idag-roed-titel, .cf-sek, .idag-sub"), function (e) { var fw = parseInt(getComputedStyle(e).fontWeight, 10); if (synlig(e) && fw >= 600) F(tilstand + ": fed Poppins i " + (e.className || e.tagName)); });
      [].forEach.call(r.querySelectorAll(".idag-flise, #aftaleListHome .aft-rk, #kundeOpgaverKort .opg-rk, #ugeKortFinal"), function (e) { var c = getComputedStyle(e); if (synlig(e) && parseFloat(c.borderTopWidth) > 0 && c.borderTopStyle !== "none") F(tilstand + ": flise med kant: " + (e.id || e.className.split(" ")[0])); });
      /* 5) UNDERLINJERNE I DEN MOERKE GRAA (v2150), VERSALERNE I DEN LYSE */
      var sub = r.querySelector(".hjem-dag .idag-flise:not(.idag-roed):not(.idag-roed-dag) .idag-sub");
      if (sub && getComputedStyle(sub).color !== "rgb(111, 107, 102)") F(tilstand + ": underlinjen er ikke den moerke graa (" + getComputedStyle(sub).color + ")");
      /* 5b) 32 PX UNDER HEROEN paa begge flader (afstandsreglen; Idas kommentar 20/9 kl. 21.55) */
      var heroEl = tlf ? document.querySelector(".hf-hero") : document.querySelector("#screen3 .mb-baand"), linjeEl = r.querySelector(".hjem-dag-linje");
      /* LUFTEN MAALES FRA BUEN (Ida 21/9 kl. 10.20 + 14.10): baandets hvide bue (28 px) er allerede luft — 32 fra buen = 4 under baandet (paa telefonen ligger arket selv 28 op i fotoet) */
      if (heroEl && linjeEl) { var bue = (heroEl.classList.contains("mb-baand") || heroEl.classList.contains("hf-hero")) ? 28 : 0;   /* telefonens hero: arket ligger 28 op i fotoet */ var luft = Math.round(linjeEl.getBoundingClientRect().top - (heroEl.getBoundingClientRect().bottom - bue)); if (Math.abs(luft - 32) > 4) F(tilstand + ": luften fra buen til I dag er " + luft + " px, ikke 32"); }
      /* 6) INTET KLIPPET I VENSTRE KANT (skinnen maales i SELE SMAL; her: fast menu) */
      [].forEach.call(r.querySelectorAll(".cf-sek, .idag-flise, .aft-rk, .opg-rk"), function (e) { if (synlig(e) && e.getBoundingClientRect().left < 0) F(tilstand + ": klippet i venstre kant: " + (e.innerText || "").trim().slice(0, 20)); });
    };
    /* FULD FORSIDE */
    var d0 = iso(0);
    IDEER.push({ id: "bud1", titel: "Gryderne er kommet", status: "Planlagt", dato: d0, soejle: "1A", format: "reel", brief: { tid: "10:00", hook: "x", caption: "y" }, hvem: [] });
    IDEER.push({ id: "bud2", titel: "Efterårets varme tæpper", status: "Planlagt", dato: iso(2), soejle: "2A", brief: {}, hvem: [] });
    window.__AFT_KLADDER = [{ dato: iso(4), tid: "09:00", titel: "Fotograf i butikken" }];
    OPGAVER.push({ id: "bo1", titel: "Ring til leverandøren", done: false, aktiv: true }, { id: "bo2", titel: "Skift prisskilte", done: false, aktiv: true });
    await tegn(); maal("fuld");
    /* TOM FORSIDE */
    IDEER.splice(0, IDEER.length); window.__AFT_KLADDER = []; OPGAVER.splice(0, OPGAVER.length); window.__OPG_AFLEDTE = [];
    await tegn(); maal("tom");
    console.log(fejl ? "SELE BUD FEJL i alt: " + fejl : "SELE BUD OK: Hjem holder buddets loefter paa " + innerWidth + " (fuld + tom forside)");
  } catch (e) { console.log("SELE BUD FEJL probe: " + e.message); }
}, 1200);
