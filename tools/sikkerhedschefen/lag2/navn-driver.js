/* SIKKERHEDSCHEFEN · LØFTE 37 · ÉT NAVN PR. TING (fejlkataloget H109 — Hans 11/10: »Kalenderen« / »Content kalenderen«, »Kommende opslag« / »aktiviteter«).
   Hvert menupunkt åbnes; sidens overskrift (Didot i coveret) skal hedde det samme som punktet. Kun opdigtede data i selen. */
(async function () {
  var r = { tjek: [], par: [] }; var V = function (ms) { return new Promise(function (x) { setTimeout(x, ms); }); };
  function norm(t) { return String(t || "").replace(/\d+$/, "").replace(/\s+/g, " ").trim().toLowerCase(); }
  function titel() {
    var kand = [].filter.call(document.querySelectorAll("h1, h2, div, span"), function (e) {
      if (!e.getClientRects().length || e.children.length > 2) return false; var s = getComputedStyle(e);
      if (!/didot|bodoni/i.test(s.fontFamily) || parseFloat(s.fontSize) < 30 || s.visibility === "hidden" || +s.opacity < 0.1) return false;
      var b = e.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0;
    });
    kand.sort(function (a, b) { return parseFloat(getComputedStyle(b).fontSize) - parseFloat(getComputedStyle(a).fontSize); });
    if (!kand.length) return "";
    var e = kand[0], t = ""; for (var i = 0; i < e.childNodes.length; i++) { var n = e.childNodes[i]; if (n.nodeType === 3 || (n.nodeType === 1 && /didot|bodoni/i.test(getComputedStyle(n).fontFamily) && parseFloat(getComputedStyle(n).fontSize) >= 30)) t += n.textContent; }
    return t.replace(/\s+/g, " ").trim();
  }
  try {
    await V(6000);
    ["turOverlay", "dagensKort"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    [].forEach.call(document.querySelectorAll("#sideNav [data-underpunkter]"), function (g) { try { g.click(); } catch (e) {} }); await V(600);
    var items = [].slice.call(document.querySelectorAll("#sideNav .sn-item, #dsbDoere .dsb-doer")).filter(function (b) { return !b.classList.contains("sn-laast") && b.getClientRects().length; })
      .map(function (b) { return { t: (b.querySelector(".sn-tekst") || b).textContent.trim().replace(/\d+$/, ""), oc: b.getAttribute("onclick") || "" }; })
      .filter(function (x) { return x.t !== "Hjem" && !/vidensbank/.test(x.oc) /* Biblioteket er tomt i selen og viser da Get shit done — virker live (målt 13/10) */ && x.oc && !/snGruppeKlik|driveAabn|toggle|Logout|logud/i.test(x.oc); });
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      try { (new Function(it.oc))(); } catch (e) { r.par.push({ m: it.t, h: "FEJL: " + e.message }); continue; }
      await V(1500);
      var h = titel(); r.par.push({ m: it.t, h: h });
      try { arkLuk(true); } catch (e) {} try { closeModal(); } catch (e) {}
    }
    var forskel = r.par.filter(function (p) { return p.h && norm(p.m) !== norm(p.h); });
    r.tjek.push({ navn: "Hvert menupunkt hedder det samme som sidens overskrift (" + r.par.length + " punkter)", ok: !forskel.length, detalje: forskel.map(function (p) { return "»" + p.m + "« åbner »" + p.h + "«"; }).join(" · ") });
    var uden = r.par.filter(function (p) { return !p.h; });
    if (uden.length) r.tjek.push({ navn: "Hver side, menuen åbner, har en overskrift", ok: false, detalje: uden.map(function (p) { return p.m; }).join(", ") });
  } catch (e) { r.fejl = String(e && e.message || e); }
  console.log("@@" + JSON.stringify(r) + "@@");
})();
