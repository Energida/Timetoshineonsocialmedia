<script>/* SIKKERHEDSCHEFEN · ORDENE (løfte 12): åbner én kundeskærm og sender al SYNLIG tekst tilbage */
(function(){
 var P=new URLSearchParams(location.search), SCR=P.get("ordf"); if(!SCR) return;
 var V=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
 var SK={hjem:function(){showTab(3)},kalender:function(){showTab(8)},idebank:function(){showTab(2);try{ibVis("ideer")}catch(e){}},inspiration:function(){showTab(2);try{ibVis("insp")}catch(e){}},indbakke:function(){indbakkenAaben()},planlaegning:function(){showTab(31)},performance:function(){showTab(9)},vaerktoej:function(){vaerktoejAaben()},profil:function(){minProfilAaben()},drejebog:function(){showTab(1)},forloeb:function(){showTab(12)},brief:function(){try{openBriefSide((IDEER[0]||{}).id)}catch(e){}},nyide:function(){kundeArkAabn("ide",false,"",false)},tomhovedet:function(){toemFotoAabn("plus")},menu:function(){toggleBurger()}};
 (async function(){
  for(var i=0;i<80&&!document.body.classList.contains("app-klar");i++) await V(150);
  ["turOverlay","dagensKort"].forEach(function(id){var e=document.getElementById(id);if(e)e.remove()}); try{dagensKortLuk()}catch(e){}
  try{ await SK[SCR](); }catch(e){} await V(1500);
  var t=[]; var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);
  while(w.nextNode()){ var n=w.currentNode, el=n.parentElement; if(!el||!n.textContent.trim()) continue; if(el.closest("script,style,noscript,[data-arkiv],#appLoader,#authGate,.sql-kort,pre,code,textarea")) continue; var cs=getComputedStyle(el); if(cs.display==="none"||cs.visibility==="hidden"||!el.getClientRects().length) continue; var r=el.getBoundingClientRect(); if(r.width<2||r.height<2) continue; t.push(n.textContent.replace(/\s+/g," ").trim()); }
  var ph=[].slice.call(document.querySelectorAll("input[placeholder],textarea[placeholder]")).filter(function(e){return e.getClientRects().length}).map(function(e){return "[ph] "+e.placeholder});
  console.log("@@"+JSON.stringify({s:SCR,t:t.concat(ph)})+"@@");
 })();
})();
</script>
