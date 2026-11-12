/* UX-POLITIET · DESIGNLÅSEN PÅ HVER SIDE (Ida 12/11: »ALT skal synkroniseres i appen efter designlåsen og være ens … Kør ux politiet«).
   Måler de låste elementer på hver side og samler afvigelserne pr. klasse, så de kan rettes ét sted:
   · NAVIGATIONSKNAP: knap med tekst (pille) skal være 56 høj (låst 12/11).
   · CHIP: 32 høj · 12,5/400 · luft 14 · hvid, når den ikke er valgt (låst 9/11 + 12/11).
   · OVERSKRIFT (versal-etiket): én størrelse og én grå.
   · FLISE: hvid flise med skygge har radius 20.
   · SKRIFT: aldrig fed Poppins; grå tekst kun #6F6B66 eller #9A9590.
   Rapport, ikke port: window.LAAS_KOER(sider) returnerer { sider: {...}, sum: {...} }. Kør i selen på 390 og 1440. */
window.LAAS_KOER = async function (SIDER) {
  var vent = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var synlig = function (e) { var q = e.getBoundingClientRect(); if (q.width < 2 || q.height < 2) return false; var c = getComputedStyle(e); return c.display !== "none" && c.visibility !== "hidden" && parseFloat(c.opacity) > 0 && q.bottom > 0 && q.top < 6000; };
  var kl = function (e) { var c = (e.className && e.className.baseVal != null) ? e.className.baseVal : String(e.className || ""); c = c.split(/\s+/).filter(function (x) { return x && x !== "mq-tap" && x !== "on"; }); return (c.slice(0, 2).join(".") || e.tagName.toLowerCase()); };
  var px = function (v) { return Math.round(parseFloat(v) * 10) / 10; };
  var rgb = function (v) { return String(v).replace(/\s/g, ""); };
  var egenTekst = function (e) { return [].filter.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }).map(function (n) { return n.textContent.trim(); }).join(" "); };
  var GRAA_OK = { "rgb(111,107,102)": 1, "rgb(154,149,144)": 1 };
  var UD = { sider: {}, sum: { knap: {}, chip: {}, overskrift: {}, flise: {}, fed: {}, graa: {} } };
  var tael = function (gr, noegle, side) { var o = UD.sum[gr][noegle] = UD.sum[gr][noegle] || { n: 0, sider: [] }; o.n++; if (o.sider.indexOf(side) < 0 && o.sider.length < 8) o.sider.push(side); };
  for (var i = 0; i < SIDER.length; i++) {
    var navn = SIDER[i][0], f = { knap: 0, chip: 0, overskrift: 0, flise: 0, fed: 0, graa: 0 };
    try { SIDER[i][1](); } catch (e) { UD.sider[navn] = "kunne ikke åbnes: " + e.message; continue; }
    await vent(900);
    var dm = document.querySelector("#dashMain"), dmSes = dm && dm.getBoundingClientRect().height > 50 && getComputedStyle(dm).display !== "none" && dm.offsetParent !== null;
    var rod = document.querySelector("#planRit.on") || document.querySelector("#lekVis.on") || (dmSes ? dm : null) || document.querySelector(".screen.active") || document.body;
    [].forEach.call(rod.querySelectorAll("*"), function (e) {
      if (!synlig(e)) return;
      if (e.closest("#sideNav, #burgerMenu, .bottom-nav, #versionsFod, .mb-baand, .dash-sidebar, #dashSidebar, svg")) return;
      var cs = getComputedStyle(e), r = e.getBoundingClientRect(), k = kl(e), ck = String(e.className && e.className.baseVal != null ? e.className.baseVal : e.className || "");
      var erChip = /(^|[\s-])chip(\b|-)|ark-chip|pf-chip|md-chip/.test(ck) && !/chips\b/.test(ck.split(/\s+/)[0] || "");
      var rad = parseFloat(cs.borderTopLeftRadius) || 0;
      var erKnapTag = e.tagName === "BUTTON" || e.getAttribute("role") === "button" || /\bdbtn\b|-knap\b|\bknap\b/.test(ck);
      var tekst = (e.textContent || "").trim();
      /* CHIP */
      if (erChip && tekst && r.height < 70) {
        var valgt = /\bon\b|\bvalgt\b/.test(ck) || e.getAttribute("aria-pressed") === "true" || e.getAttribute("aria-selected") === "true";
        var fejl = [];
        if (Math.round(r.height) !== 32) fejl.push("h" + Math.round(r.height));
        if (px(cs.fontSize) !== 12.5) fejl.push("skrift " + px(cs.fontSize));
        if (px(cs.paddingLeft) !== 14 || px(cs.paddingRight) !== 14) fejl.push("luft " + px(cs.paddingLeft) + "/" + px(cs.paddingRight));
        if (!valgt && !/^rgba?\(255,255,255(,1)?\)$|^rgba\(0,0,0,0\)$/.test(rgb(cs.backgroundColor))) fejl.push("baggrund " + rgb(cs.backgroundColor));
        if (fejl.length) { f.chip++; tael("chip", k + " → " + fejl.join(" · "), navn); }
        return;
      }
      /* NAVIGATIONSKNAP: pille med tekst, bred nok til at være en tekstknap, ikke en ikonknap */
      if (erKnapTag && tekst && rad >= 14 && r.width >= 88 && r.height >= 26 && r.height <= 80 && !e.querySelector("button") && !/drop|select|felt|input|kontakt|sw\b|fane|tab|flise|fl\b|raekke|rk\b/.test(ck) && tekst.length <= 34) {
        if (Math.round(r.height) !== 56) { f.knap++; tael("knap", k + " → h" + Math.round(r.height), navn); }
        return;
      }
      var t = egenTekst(e); if (!t) {
        /* FLISE: hvid med skygge */
        if (cs.boxShadow && cs.boxShadow !== "none" && /^rgba?\(255,255,255/.test(rgb(cs.backgroundColor)) && r.width > 200 && r.height > 48 && rad > 0 && rad !== 20 && rad < 100) { f.flise++; tael("flise", k + " → radius " + rad, navn); }
        return;
      }
      /* OVERSKRIFT som versal-etiket */
      if (cs.textTransform === "uppercase" && t.length <= 40 && r.height < 40) {
        var o = px(cs.fontSize) + " · " + rgb(cs.color) + " · afstand " + px(cs.letterSpacing);
        if (!(px(cs.fontSize) === 10 && rgb(cs.color) === "rgb(154,149,144)" && px(cs.letterSpacing) === 1.5)) { f.overskrift++; tael("overskrift", k + " → " + o, navn); }
      }
      if (/Poppins/i.test(cs.fontFamily) && parseInt(cs.fontWeight, 10) >= 600) { f.fed++; tael("fed", k + " → " + cs.fontWeight, navn); }
      var c = rgb(cs.color), m = c.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
      if (m) { var a = +m[1], b = +m[2], d = +m[3]; var graa = Math.abs(a - b) < 14 && Math.abs(b - d) < 14 && a > 60 && a < 215; if (graa && !GRAA_OK[c]) { f.graa++; tael("graa", k + " → " + c, navn); } }
    });
    UD.sider[navn] = f;
  }
  return UD;
};
