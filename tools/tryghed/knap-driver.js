<script>
(function(){
 var P=new URLSearchParams(location.search), SCR=P.get("uxf"); if(!SCR) return;
 var V=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
 var errs=[]; window.addEventListener("error",function(e){errs.push(e.message)}); window.addEventListener("unhandledrejection",function(e){errs.push("REJ "+(e.reason&&e.reason.message||e.reason))});
 var mut=0; new MutationObserver(function(l){mut+=l.length}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,characterData:true});
 function seed(){ var N=[["Produkt",5],["People follow people",3],["Målgruppens udfordring eller behov lige nu",4],["",8],[null,2],["Mennesker",2],["Bag om forretningen",1]]; IDEER.length=0; var i=0; N.forEach(function(a){for(var k=0;k<a[1];k++){ IDEER.push(mapIdeRow({id:"r"+(i++),kode:"HINGES2026",titel:"Efterårets strik nr "+i,status:i%3?"Idé":"Brief i gang",soejle:a[0],type:"Reel",dato:null,brief:{beskrivelse:"Kort beskrivelse"},created_at:new Date(2026,8,1,0,i).toISOString()})); }}); var iso=huIso(new Date()),y=new Date(); y.setDate(y.getDate()-1); IDEER.push(mapIdeRow({id:"p1",kode:"HINGES2026",titel:"Sommerkjole",status:"Planlagt",soejle:"Produkt",type:"Reel",dato:iso,brief:{tid:"19:00",hook:"Se her"},created_at:new Date().toISOString()}),mapIdeRow({id:"p2",kode:"HINGES2026",titel:"Strikvest i går",status:"Planlagt",soejle:"Produkt",type:"Reel",dato:huIso(y),brief:{},created_at:new Date().toISOString()})); }
 var SK={hjem:function(){showTab(3);hjemUgeTegn()},kalender:function(){showTab(8);try{contentFacitTegn()}catch(e){}},idebank:function(){showTab(2);renderIdeas();try{ibMobilTegn()}catch(e){}},indbakke:function(){indbakkenAaben()},planlaegning:function(){showTab(31)},performance:function(){openMaal()},vaerktoej:function(){vaerktoejAaben()},profil:function(){minProfilAaben()},aarshjul:function(){aarshjulAabn()},maal:function(){tilpasAaben('maal')},byggesten:function(){tilpasAaben('drejebog')},brief:function(){ideUpdate("r1",{soejle:"Produkt"});openBriefSide("r1")},menu:function(){toggleBurger()},tomhovedet:function(){toemFotoAabn("swipe")},plus:function(){toemFotoAabn("plus")},nyide:function(){kundeArkAabn("ide",false,"",false)}};
 function clean(){ try{arkLuk()}catch(e){} try{bsFlytLuk()}catch(e){} try{toemFotoLuk()}catch(e){} try{var m=document.getElementById("burgerMenu"); if(m&&m.classList.contains("open")) toggleBurger()}catch(e){} try{document.querySelectorAll(".spmpop,.dato-ark,#turOverlay,.tur-kort").forEach(function(e){e.remove()})}catch(e){} }
 function vis(e){return e.getClientRects().length>0 && getComputedStyle(e).visibility!=="hidden"}
 function liste(){ var rod=document.body; var els=[].slice.call(rod.querySelectorAll("button, [onclick], [role=button], a[href]")).filter(function(e){ if(!vis(e)) return false; var r=e.getBoundingClientRect(); if(r.width<4||r.height<4) return false; if(e.closest("#authGate,#appLoader")) return false; return true; }); var set=[]; els.forEach(function(e){ if(!set.some(function(x){return x===e||x.contains(e)&&x.getAttribute("onclick")&&!e.getAttribute("onclick")})) set.push(e); }); return set; }
 function navnTil(e){ var oc=e.getAttribute("onclick")||""; var m=[],rx=/(^|[^.\w$\]])([A-Za-z_$][\w$]*)\s*\(/g,q; while((q=rx.exec(oc))) m.push(q[2]); return m.filter(function(n){return ["event","if","function","return","setTimeout","catch","try","stopPropagation","this","JSON","String","Number","document","window","esc","toggle","remove","add","closest","querySelector","getElementById","focus","click","stopImmediatePropagation","preventDefault","open"].indexOf(n)<0}); }
 var FARLIG=/log ud|logout|slet|fjern|skraldespand|skift adgangskode|custLogout|Slet/i;
 (async function(){
  for(var i=0;i<80&&!document.body.classList.contains("app-klar");i++) await V(150);
  ["appLoader","turOverlay","dagensKort"].forEach(function(id){var e=document.getElementById(id);if(e)e.remove()}); try{dagensKortLuk()}catch(e){} try{turLuk()}catch(e){}
  await V(400); seed(); var res={s:SCR,w:innerWidth,dod:[],fejl:[],ingenEffekt:[],antal:0,sprunget:[]};
  async function opsaet(){ clean(); try{await SK[SCR]()}catch(e){} await V(700); }
  await opsaet();
  var n=liste().length; res.antal=n;
  for(var k=0;k<n;k++){
    var els=liste(); var e=els[k]; if(!e){ break; }
    var txt=(e.getAttribute("aria-label")||e.textContent||"").trim().replace(/\s+/g," ").slice(0,40), oc=(e.getAttribute("onclick")||"").slice(0,90);
    var navne=navnTil(e); var udef=navne.filter(function(nm){ try{return typeof window[nm]!=="function" && typeof eval("typeof "+nm)!=="undefined" && eval("typeof "+nm)!=="function"}catch(x){return false} });
    if(udef.length){ res.dod.push({t:txt,oc:oc,udef:udef}); }
    if(FARLIG.test(txt+" "+oc)){ res.sprunget.push(txt||oc); continue; }
    var e0=errs.length, m0=mut, tab0=(typeof current!=="undefined"?current:null), url0=location.href;
    try{ e.click(); }catch(x){ errs.push("KLIK "+x.message); }
    await V(550);
    var nye=errs.slice(e0); if(nye.length) res.fejl.push({t:txt,oc:oc,fejl:nye.slice(0,2)});
    else if(mut===m0 && tab0===(typeof current!=="undefined"?current:null) && location.href===url0) res.ingenEffekt.push({t:txt,oc:oc});
    await opsaet();
  }
  console.log("@@"+JSON.stringify(res)+"@@");
 })();
})();
</script>
