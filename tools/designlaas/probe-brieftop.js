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
  } catch (e) { fejl.push("proben fejlede: " + (e && e.message)); }
  fejl.forEach(function (f) { console.log("SELE BRIEFTOP FEJL " + innerWidth + ": " + f); });
  console.log(fejl.length ? "SELE BRIEFTOP FEJL " + innerWidth + ": " + fejl.length + " fund" : "SELE BRIEFTOP OK " + innerWidth + ": " + n + " knapper i briefens top rammes af et tryk i midten");
})();
