<script>/* SIKKERHEDSCHEFEN · LØFTE 30 · POPUP-RUNDEN (Ida 12/10: »der er simpelthen virkelig alt for mange fejl hele tiden« — fejlkataloget D).
   Hver knap, der åbner en popup: (1) trykket rammer knappen (intet usynligt lag ovenpå), (2) der står højst ÉT lag, (3) krydset lukker den,
   (4) samme knap åbner den IGEN (v2755: »Tast ugens tal« åbnede ikke efter krydset), (5) intet lag bliver liggende efter lukning.
   Farlige knapper trykkes aldrig. Kun opdigtede data i selen. */
(function(){
 var P=new URLSearchParams(location.search), SCR=P.get("uxf"); if(!SCR) return;
 var V=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
 window.open=function(){return null};
 function seed(){ if(SCR.indexOf("bs_")===0||typeof IDEER==="undefined"||typeof mapIdeRow!=="function") return; IDEER.length=0; for(var i=0;i<6;i++) IDEER.push(mapIdeRow({id:"r"+i,kode:"HINGES2026",titel:"Efterårets strik nr "+i,status:"Idé",soejle:"Produkt",type:"Reel",dato:null,brief:{beskrivelse:"Kort"},created_at:new Date(2026,8,1,0,i).toISOString()})); }
 var SK={hjem:function(){showTab(3);hjemUgeTegn()},kalender:function(){showTab(8);try{contentFacitTegn()}catch(e){}},idebank:function(){showTab(2);renderIdeas();try{ibMobilTegn()}catch(e){}},indbakke:function(){indbakkenAaben()},planlaegning:function(){showTab(31)},performance:function(){openMaal()},vaerktoej:function(){vaerktoejAaben()},profil:function(){minProfilAaben()},brief:function(){ideUpdate("r1",{soejle:"Produkt"});openBriefSide("r1")},bs_overblik:function(){visDashSide('overblik')},bs_indbakke:function(){visDashSide('indbakke')},bs_crm:function(){visDashSide('crm')},bs_energida:function(){visDashSide('energida')},bs_studio:function(){visDashSide('klip')},bs_gsd:function(){visDashSide('gsd')}};
 function vis(e){ if(!e||!e.getClientRects().length) return false; var s=getComputedStyle(e); return s.visibility!=="hidden"&&s.display!=="none"&&parseFloat(s.opacity||"1")>0.05; }
 /* ET LAG = en popup, kunden kan se: ark, lille ark, modal, ny adgangskode, rundvisning */
 function lag(){ return [].slice.call(document.querySelectorAll("#bsFlytMenu .bs-flyt-ark, .ark-slor .ark, .modal-back .modal, #nyKodeBoks .nyk-ark, #turOverlay")).filter(function(a){ if(!vis(a)) return false; var r=a.getBoundingClientRect(); return r.width>40&&r.height>40; }); }
 function clean(){ try{arkLuk(true)}catch(e){} try{bsFlytLuk()}catch(e){} try{toemFotoLuk()}catch(e){} try{closeModal()}catch(e){} try{var bm=document.getElementById("burgerMenu"); if(bm&&bm.classList.contains("open")) toggleBurger()}catch(e){} try{document.querySelectorAll(".modal-back.on").forEach(function(m){m.classList.remove("on")})}catch(e){} try{ if(typeof FB_AABEN!=="undefined"&&FB_AABEN){ FB_AABEN=null; briefFaktaUdPlacer(); } }catch(e){} try{dagensKortLuk()}catch(e){} try{document.querySelectorAll(".bdrop-kort").forEach(function(k){k.style.display="none"})}catch(e){} try{document.querySelectorAll("#turOverlay,#dagensKort,.spmpop,.dato-ark,#bfStatusBaandKort,.bs3-liste-flyd").forEach(function(e){e.remove()})}catch(e){} }
 function liste(){ return [].slice.call(document.body.querySelectorAll("button, [onclick], [role=button]")).filter(function(e){ if(!vis(e)) return false; var r=e.getBoundingClientRect(); if(r.width<4||r.height<4||r.bottom<0||r.top>innerHeight*3) return false; if(e.closest("#authGate,#appLoader,#arkSlor,.modal-back,#bsFlytMenu,#burgerMenu,.sidenav,#sideNav,nav")) return false; if(/toggleBurger|showTab\(|visDashSide|sideMenu/.test(e.getAttribute("onclick")||"")) return false; return !e.disabled; }); }
 function navn(e){ return (e.getAttribute("aria-label")||e.textContent||"").trim().replace(/\s+/g," ").slice(0,40)||(e.getAttribute("onclick")||"").slice(0,40); }
 function nogle(e){ return navn(e)+"|"+(e.getAttribute("onclick")||"").slice(0,60); }
 var FARLIG=/log ud|logout|slet|fjern|skraldespand|adgangskode|custLogout|annuller|arkiv|selvtest|send til|inviter|mail|deploy|nulstil|afbryd|forbind instagram|igForbindStart|betal|køb|stripe/i;
 function kryds(a){ var v=a.parentElement||a; var k=v.querySelector(".ark-kryds")||a.querySelector(".ark-kryds"); if(k&&vis(k)) return k; var x=a.querySelector(".modal-close"); return (x&&vis(x))?x:null; }
 function rammer(e){ e.scrollIntoView({block:"center"}); var r=e.getBoundingClientRect(); var t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2); if(t&&t.closest&&t.closest('[class*="bdrop"], .fb-ud')){ try{document.querySelectorAll('.bdrop-kort').forEach(function(k){k.style.display='none'})}catch(x){} t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2); } return !t||t===e||e.contains(t)||t.contains(e)||(t.closest&&t.closest('[class*="bdrop"], .fb-ud'))?null:(t.tagName+"#"+(t.id||"")+"."+String(t.className).slice(0,40)+" i "+[t.parentElement,t.parentElement&&t.parentElement.parentElement].map(function(p){return p?(p.id||String(p.className).slice(0,25)):""}).join("<")); }
 function realKlik(e){ var r=e.getBoundingClientRect(); var t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)||e; if(typeof t.click==="function") t.click(); else t.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,view:window})); }
 (async function(){
  for(var i=0;i<80&&!document.body.classList.contains("app-klar");i++) await V(150);
  ["appLoader","dagensKort"].forEach(function(id){var e=document.getElementById(id);if(e)e.remove()}); try{dagensKortLuk()}catch(e){} try{turLuk()}catch(e){}
  await V(400); seed();
  var res0=[];
  if(SCR==="hjem"){ try{ turStart(true); await V(800); visNyAdgangskode(true); await V(800); var n2=lag().length; if(n2>1) res0.push("Vælg din adgangskode + rundvisningen ("+n2+" lag)"); var nb=document.getElementById("nyKodeBoks"); if(nb) nb.remove(); turLuk(); }catch(x){} await V(300); }
  var res={s:SCR,w:innerWidth,popups:0,overlag:[],toLag:res0,lukkerIkke:[],aabnerIkkeIgen:[],blivende:[],udenKryds:[],sprunget:0};
  async function opsaet(){ clean(); try{await SK[SCR]()}catch(e){} await V(600); }
  await opsaet();
  var set={}, n=liste().length;
  try{
  for(var k=0;k<n&&k<70;k++){
    var els=liste(); var e=els[k]; if(!e) break; var key=nogle(e); if(set[key]) continue; set[key]=1;
    if(FARLIG.test(navn(e)+" "+(e.getAttribute("onclick")||""))){ res.sprunget++; continue; }
    if(lag().length){ clean(); await V(250); }
    var over=rammer(e); if(over){ res.overlag.push(navn(e)+" ← "+over); await opsaet(); continue; }
    realKlik(e); await V(600);
    var L=lag(); if(!L.length){ await opsaet(); continue; }
    res.popups++;
    if(L.length>1) res.toLag.push(navn(e)+" ("+L.length+" lag)");
    var top=L[L.length-1], x=kryds(top);
    if(!x){ res.udenKryds.push(navn(e)); await opsaet(); continue; }
    if(typeof x.click==="function") x.click(); else x.dispatchEvent(new MouseEvent("click",{bubbles:true})); await V(900);
    if(lag().length){ res.lukkerIkke.push(navn(e)); await opsaet(); continue; }
    /* ÅBN IGEN: samme knap (eller den, der står samme sted med samme navn) */
    var igen=liste().filter(function(z){return nogle(z)===key})[0];
    if(!igen){ await opsaet(); continue; }
    var over2=rammer(igen); if(over2){ res.blivende.push(navn(e)+" ← "+over2); await opsaet(); continue; }
    var r2=igen.getBoundingClientRect(), ramt=document.elementFromPoint(r2.left+r2.width/2,r2.top+r2.height/2);
    realKlik(igen); await V(900);
    if(!lag().length){ await V(900); if(!lag().length){ var igen2=liste().filter(function(z){return nogle(z)===key})[0]; if(igen2){ igen2.click(); await V(1200); } } if(!lag().length) res.aabnerIkkeIgen.push(navn(e)+" [ramte "+(ramt?ramt.tagName+"."+String(ramt.className).slice(0,30):"?")+"]"); }
    await opsaet();
  }
  }catch(x){ res.fejl=String(x&&x.message||x); }
  console.log("@@"+JSON.stringify(res)+"@@");
 })();
})();
</script>
