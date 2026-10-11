<script>/* SIKKERHEDSCHEFEN · FOLDEN (løfte 9): åbner én kundeskærm og måler, hvor den røde hovedhandling står */
(function(){
 var P=new URLSearchParams(location.search), SCR=P.get("foldf"); if(!SCR) return;
 var V=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
 var SK={hjem:function(){showTab(3)},kalender:function(){showTab(8)},idebank:function(){showTab(2);try{ibVis("ideer")}catch(e){}},inspiration:function(){showTab(2);try{ibVis("insp")}catch(e){}},indbakke:function(){indbakkenAaben()},planlaegning:function(){showTab(31)},performance:function(){showTab(9)},vaerktoej:function(){vaerktoejAaben()},profil:function(){minProfilAaben()},drejebog:function(){showTab(1)},forloeb:function(){showTab(12)},brief:function(){try{openBriefSide((IDEER[0]||{}).id)}catch(e){}},nyide:function(){kundeArkAabn("ide",false,"",false)},tomhovedet:function(){toemFotoAabn("plus")},menu:function(){toggleBurger()}};
 (async function(){
  for(var i=0;i<80&&!document.body.classList.contains("app-klar");i++) await V(150);
  ["turOverlay","dagensKort"].forEach(function(id){var e=document.getElementById(id);if(e)e.remove()}); try{dagensKortLuk()}catch(e){}
  try{ await SK[SCR](); }catch(e){} await V(1500);
  var RED=(function(){var x=document.createElement("i");x.style.color="var(--red)";document.body.appendChild(x);var c=getComputedStyle(x).color;x.remove();return c;})();
  var kand=[].slice.call(document.querySelectorAll("button,a,[role=button],.bs3-fl,.roed-flise,[onclick]")).filter(function(e){ if(!e.getClientRects().length) return false; if(e.closest("#bottomNav,.bottom-nav,.ark-chips,.bs3-chips,nav,.cover-knap,.cover-tilbage,#sideNav,.side-nav")) return false; var cs=getComputedStyle(e); if(cs.visibility==="hidden"||cs.display==="none") return false; var bg=cs.backgroundColor; return (bg===RED||/rgb\(252, ?36, ?4\)/.test(bg)) && e.getBoundingClientRect().width>120; });
  var r=kand.map(function(e){var b=e.getBoundingClientRect();return {top:Math.round(b.top),h:Math.round(b.height),t:(e.innerText||"").replace(/\s+/g," ").trim().slice(0,50)}}).sort(function(a,b){return a.top-b.top});
  console.log("@@"+JSON.stringify({sd:SCR,vh:innerHeight,roed:r.slice(0,3)})+"@@");
 })();
})();
</script>
