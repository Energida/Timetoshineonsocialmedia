/* SIKKERHEDSCHEFEN · LØFTE 15 · SPØGELSESSIDEN (Ida 18–19/10: »kalenderen blinker, før briefen åbner« — Acorns via genvejen).
   Sættes ind ØVERST i index-sele.html af tjek_spoegelse.py og filmer hvert billede fra start: hvilken skærm står fremme, og dækker tæppet? */
(function () {
  window.__TL = [];
  function synlig(id) { var e = document.getElementById(id); if (!e) return false; var s = getComputedStyle(e); return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity || "1") > 0.05; }
  function skud() {
    try {
      var a = document.querySelector(".screen.active");
      var b7 = document.getElementById("screen7");
      window.__TL.push({ t: Math.round(performance.now()), skaerm: a ? a.id : "", taeppe: synlig("appLoader") || synlig("privCover") || synlig("somkundeLoader"), brief: !!(b7 && b7.classList.contains("active")) });
    } catch (e) {}
    if (window.__TL.length < 4000) requestAnimationFrame(skud);
  }
  requestAnimationFrame(skud);
})();
