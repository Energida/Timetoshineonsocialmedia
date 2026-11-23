/* v3447 · ET TRYK RAMMER DEN KNAP, MAN TRYKKER PÅ (Ida 23/11, fundet i gennemtjekket af kundens profil: på telefon reagerede briefens top ikke — »Tilbage«s usynlige trykfelt lå hen over
   Skriv/Optag/Post, statusvælgeren, de tre prikker og blyanten). Portens andre målinger klikker med .click() og ser ikke en dækket knap. Her spørges browseren, hvad der ligger i knappens midte
   (elementFromPoint): det skal være knappen selv eller noget inde i den. Køres af koer.sh som kunde på 390 og 1440 i en åben brief. */
(async function () {
  var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); }; var fejl = [], n = 0;
  try {
    await V(3500); try { dagensKortLuk(); } catch (e) {} try { turLuk(); } catch (e) {}
    IDEER.push({ id: "bt1", titel: "To om ét indkøb", soejle: "Menneskene bag", type: "Reel", status: "Brief i gang", dato: "2026-11-24", brief: { format: "Reel", platform: ["Instagram"], beskrivelse: "Vi viser, hvordan vi to vælger forskelligt.", hookTekst: "Vi er aldrig enige om farver", klip: [{ ser: "Vi står med hver vores favorit", tekst: "Hvem har ret?", siger: "Vi er aldrig enige" }], caption: "Vi køber ind sammen.", cta: "Kommentér opslaget" } });
    openBriefSide("bt1"); await V(2500);
    if (!document.body.classList.contains("brief-aaben")) fejl.push("briefen åbnede ikke"); else {
      var baand = document.querySelector("#screen7 > .mb-baand"); window.scrollTo(0, 0); await V(200);
      [].forEach.call(document.querySelectorAll("#screen7 > .mb-baand button, #screen7 > .mb-baand select, #screen7 #b3Trin button"), function (e) {
        if (!e.getClientRects().length || e.disabled) return; var q = e.getBoundingClientRect(); if (q.width < 2 || q.height < 2 || q.bottom < 0 || q.top > innerHeight) return;
        var p = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); n++;
        if (!(p && (p === e || e.contains(p)))) fejl.push("»" + ((e.innerText || e.getAttribute("aria-label") || e.className) + "").trim().slice(0, 24) + "« er dækket af " + (p ? (p.id ? "#" + p.id : p.tagName.toLowerCase() + "." + String(p.className).slice(0, 40)) : "intet"));
      });
      if (n < 5) fejl.push("kun " + n + " knapper fundet i briefens top (skal mindst 5)");
    }
    /* v3449 · ARKET FRA IDAS BILLEDE (23/11): i »Nyt opslag« står »Tilbage« under »Næste«/»Gem« med 12 imellem (var 0 på computeren). Arkene i probe-regler2.js måles kun på deres første trin, så dette trin måles her. */
    if (innerWidth >= 900) { try { closeBrief(); } catch (e) {} try { showTab(3); } catch (e) {} await V(900); plusArk(); await V(800); var po = document.querySelector('.plus-ark [data-k="opslag"]'); if (!po) fejl.push("plusset har intet »Opslag«"); else { po.click(); await V(1200);
      var reel = [].filter.call(document.querySelectorAll("#bsFlytMenu button"), function (b) { return /^Reel$/.test((b.innerText || "").trim()); })[0]; if (reel) { reel.click(); await V(600); }
      var set = false; for (var i2 = 0; i2 < 6 && !set; i2++) { var kn = [].filter.call(document.querySelectorAll("#bsFlytMenu .ark-knap"), function (b) { return b.getClientRects().length; }); var tb = kn.filter(function (b) { return /^Tilbage$/.test((b.innerText || "").trim()); })[0], over = tb && tb.previousElementSibling;
        if (tb && over && over.matches(".ark-knap")) { set = true; n++; var g = Math.round((tb.getBoundingClientRect().top - over.getBoundingClientRect().bottom) * 10) / 10; if (Math.abs(g - 12) > 0.5) fejl.push("»Nyt opslag«: »" + (over.innerText || "").trim() + "« → »Tilbage« " + g + " px (skal 12)"); break; }
        /* 23/11: trinene står nu Indholdssøjle → Format → Navn, så første trin har ingen »Reel«: står intet valgt på trinnet, vælges det første valg (en indholdssøjle eller et format), før »Næste« trykkes */
        var ch = [].filter.call(document.querySelectorAll("#bsFlytMenu .ark-chip"), function (b) { return b.getClientRects().length; }); if (ch.length && !ch.some(function (b) { return b.classList.contains("on"); })) { ch[0].click(); await V(600); continue; }
        var nx = kn.filter(function (b) { return /^Næste$/.test((b.innerText || "").trim()); })[0]; if (!nx) break; nx.click(); await V(1200); }
      if (!set) fejl.push("»Nyt opslag«: fandt ikke trinnet med »Tilbage« under den røde knap"); try { bsFlytLuk(); } catch (e) {} } }
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE BRIEFTOP FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE BRIEFTOP FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE BRIEFTOP OK " + innerWidth + ": " + n + " knapper i briefens top rammes af et tryk i midten" + (innerWidth >= 900 ? ", og »Tilbage« står 12 under den røde knap i »Nyt opslag«" : ""));
})();
