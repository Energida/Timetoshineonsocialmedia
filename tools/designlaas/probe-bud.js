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
    var tegn = async function () { try { document.body.classList.remove("hjem-facit"); } catch (e) {} showTab(3); renderHome(); try { renderAftaler(); } catch (e) {} try { renderKundeOpgaver(); } catch (e) {} try { hjemFacitTegn(); } catch (e) {} try { hjemUgeTegn(); } catch (e) {} await vent(1500); };
    /* HJEM = UGESTRIMLEN OG DAGEN (Idas valg 25/9, bud 5 + djaevlens advokat STbDzj4hKY7tMKaZaJgWbJ) — de gamle loefter (I dag-listen, Kommende aktiviteter, Denne uge) er afloest i SAMME commit */
    var maal = function (tilstand) {
      var r = tlf ? document.getElementById("hjemUgeTlf") : document.getElementById("hjemUge");
      if (!r || !synlig(r)) { F(tilstand + ": Hjem (ugestrimlen) ikke fundet"); return; }
      var tekst = (r.innerText || "").replace(/\s+/g, " ");
      /* 1) HEROEN: hilsnen; telefonen UDEN dato (Ida 25/9), computeren m. datoen i baandet */
      if (tlf) {
        var hh = document.querySelector(".hf-hero-hilsen"), hd = document.querySelector(".hf-hero-dato");
        if (!synlig(hh) || !/aften|morgen|dag|formiddag|eftermiddag|Go'|God/i.test(hh.textContent)) F(tilstand + ": telefonens hero mangler hilsnen");
        if (synlig(hd)) F(tilstand + ": datoen staar stadig i telefonens hero");
      } else {
        var mn = document.querySelector("#screen3 .mb-navn");
        if (!mn || !/aften|morgen|dag|Go'|God/i.test(mn.textContent)) F(tilstand + ": computerens baand mangler hilsnen");
      }
      /* 2) LINJEN »I dag« m. to pile + syv datofliser, i dag fyldt roed */
      var linje = r.querySelector(".hu-linje");
      if (!synlig(linje) || !/^I dag/i.test((linje.innerText || "").trim())) F(tilstand + ": linjen »I dag« mangler");
      var pile = [].filter.call(r.querySelectorAll(".hu-linje .hu-pil"), synlig); if (pile.length !== 2) F(tilstand + ": pilene ved »I dag« er " + pile.length + ", ikke 2");
      var dage = [].filter.call(r.querySelectorAll(".hu-strib .hu-dag"), synlig); if (dage.length !== 7) F(tilstand + ": ugestrimlen har " + dage.length + " datofliser, ikke 7");
      var idag = r.querySelector(".hu-dag.idag"); if (!idag || getComputedStyle(idag).backgroundColor !== "rgb(252, 36, 4)") F(tilstand + ": i dag er ikke fyldt roed");
      dage.forEach(function (d) { var q = d.getBoundingClientRect(); if (q.width < 44 || q.height < 44) F(tilstand + ": en datoflise er under 44 px (" + Math.round(q.width) + "x" + Math.round(q.height) + ")"); });
      /* 3) DAGEN: kort med symbol, hoejst to linjer tekst, hoejst fem; tom = spoergsmaal + graa knap */
      var kort = [].filter.call(r.querySelectorAll(".hu-dagen .hu-kort"), synlig);
      if (tilstand === "fuld") {
        if (!kort.length) F("fuld: dagen viser ingen kort");
        if (kort.length > 5) F("fuld: dagen viser " + kort.length + " kort, hoejst fem");
        kort.forEach(function (k) { if (!synlig(k.querySelector(".hu-sym"))) F("fuld: et kort mangler symbolet"); var t = k.querySelector(".hu-titel"); if (t && t.getBoundingClientRect().height > 30) F("fuld: en titel fylder mere end een linje"); });
      } else {
        var tq = r.querySelector(".hu-dagen .hu-tom"); if (!synlig(tq) || !/\?/.test(tq.innerText) || !synlig(tq.querySelector(".hu-graa"))) F("tom: den tomme dag mangler spoergsmaalet eller den graa knap");
      }
      /* 4) TRE RING-FLISER; ugens fokus aldrig paa telefonen */
      var ringe = [].filter.call(r.querySelectorAll(".hu-ring"), synlig); if (ringe.length !== 3) F(tilstand + ": ringene er " + ringe.length + ", ikke 3");
      if (tlf && synlig(r.querySelector(".hu-fokus"))) F(tilstand + ": ugens fokus staar paa telefonen (ude 25/9)");
      /* 5) TO-DO: hoejst fem + »Gå til Get shit done«; tom = spoergsmaal + graa knap */
      var td = [].filter.call(r.querySelectorAll(".hu-td"), synlig);
      if (td.length > 5) F(tilstand + ": to-do viser " + td.length + ", hoejst fem");
      if (tilstand === "fuld") { if (!td.length) F("fuld: to-do'en staar ikke som flise"); if (!/Gå til Get shit done/.test(tekst)) F("fuld: knappen »Gå til Get shit done« mangler"); }
      else if (!/Er der noget, du skal huske\?/.test(tekst)) F("tom: to-do mangler spoergsmaalet");
      /* 6) RAEKKEFOELGE/SPALTER */
      var top = function (sel) { var e = r.querySelector(sel); return synlig(e) ? e.getBoundingClientRect() : null; };
      var L = top(".hu-linje"), S = top(".hu-strib"), D = top(".hu-dagen"), R = top(".hu-ringe"), T = top(".hu-td, .hu-hoejre .hu-tom, .hu-tlf > .hu-tom");
      if (tlf) { if (L && S && D && R && T && !(L.top < S.top && S.top < D.top && D.top < R.top && R.top < T.top)) F(tilstand + ": telefonens raekkefoelge er ikke linjen · strimlen · dagen · ringene · to-do"); }
      else if (L && T) {
        if (innerWidth >= 1360) { if (!(T.left > L.right)) F(tilstand + ": to-do staar ikke i hoejre spalte"); var TL = top(".hu-hoejre .hu-sek"); if (TL && Math.abs(TL.top - L.top) > 6) F(tilstand + ": to-do-linjen flugter ikke med »I dag« (" + Math.round(TL.top - L.top) + " px)"); }
        else if (!(T.top > D.bottom)) F(tilstand + ": under 1360 px staar to-do ikke under dagen");
        if (R && !(R.bottom <= L.top)) F(tilstand + ": ringene staar ikke over dagen");
      }
      /* 7) UX-POLITIET: ingen lange streger, aldrig fed, fliserne uden kant (skyggeflisen) */
      if (/—/.test(tekst)) F(tilstand + ": en lang streg (—) staar i Hjems tekst");
      [].forEach.call(r.querySelectorAll("*"), function (e) { if (e.children.length || !synlig(e)) return; var fw = parseInt(getComputedStyle(e).fontWeight, 10); if (fw >= 600) F(tilstand + ": fed Poppins i " + (e.textContent || "").trim().slice(0, 30)); });
      [].forEach.call(r.querySelectorAll(".hu-ring, .hu-dag, .hu-fokus, .hu-td"), function (e) { var c = getComputedStyle(e); if (synlig(e) && parseFloat(c.borderTopWidth) > 0 && c.borderTopStyle !== "none") F(tilstand + ": en flise har kant i stedet for skygge"); });
      /* 8) 32 PX FRA BUEN til det foerste under heroen (buen = 28 px af baandet) */
      var heroEl = tlf ? document.querySelector(".hf-hero") : document.querySelector("#screen3 .mb-baand");
      var foerste = tlf ? L : R;
      if (heroEl && foerste) { var luft = Math.round(foerste.top - (heroEl.getBoundingClientRect().bottom - 28)); if (Math.abs(luft - 32) > 4) F(tilstand + ": luften fra buen til Hjems foerste flise er " + luft + " px, ikke 32"); }
      /* 9) INTET KLIPPET I VENSTRE KANT */
      [].forEach.call(r.querySelectorAll(".hu-kort, .hu-dag, .hu-ring, .hu-td"), function (e) { if (synlig(e) && e.getBoundingClientRect().left < 0) F(tilstand + ": klippet i venstre kant"); });
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
