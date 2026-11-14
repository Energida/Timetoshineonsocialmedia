/* FLISE-PORTEN (Ida 14/11, UX-politiet): to låste regler måles på kundeappens sider, så de ikke glider igen.
   1) OVERSKRIFT OVER FLISEN (LÅST 12/11): en versal-etiket står ALDRIG inde i en hvid flise med en streg under — den står over flisen, uden streg.
   2) AFSTANDSSKALAEN (LÅST 14/11): to fliser lige over hinanden i samme kolonne står 12 fra hinanden. Overskrift → flisen under 8. Chips-række → indholdet under 20.
   Kører på den bredde, vinduet har (390 og 1440). Én afvigelse = linje med »FEJL«, og porten (koer.sh) stopper.
   Sider: Profil · Forløbet (med modulflise + beskrivelse) · Værktøjskassen · Dine noter. */
function synlig(e){ var r=e.getBoundingClientRect(); if(r.width<2||r.height<2) return false; var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||cs.opacity==="0") return false; return !e.closest("[hidden]"); }
function txt(e){ return (e.innerText||"").replace(/\s+/g," ").trim().slice(0,30); }
function kl(e){ return (e.className&&e.className.toString().split(" ").filter(Boolean).slice(0,2).join("."))||e.tagName.toLowerCase(); }
var FUND=[], N=0, TRIN="start";
function fejl(s){ FUND.push(TRIN+" · "+s); }
function hvid(e){ var cs=getComputedStyle(e); return cs.backgroundColor.replace(/\s/g,"")==="rgb(255,255,255)"&&parseFloat(cs.borderTopLeftRadius)>=14; }
function erFlise(e){ if(!synlig(e)||!hvid(e)||e.matches("button, a, input, textarea, select, .dbtn")) return false; var r=e.getBoundingClientRect(); if(r.height<40||r.width<120) return false; var cs=getComputedStyle(e); return cs.boxShadow!=="none"||parseFloat(cs.borderTopWidth)>0; }
function rodNu(){ var a=[].slice.call(document.querySelectorAll(".screen.active")).filter(synlig); return a.length?a:[document.getElementById("app")||document.body]; }
function streg(e){
  var cs=getComputedStyle(e); if(parseFloat(cs.borderBottomWidth)>=1&&cs.borderBottomStyle!=="none") return "border-bottom";
  var af=getComputedStyle(e,"::after"); if(af.content&&af.content!=="none"&&parseFloat(af.height)<=2&&parseFloat(af.height)>0) return "::after";
  var i=[].slice.call(e.children).filter(function(c){ var r=c.getBoundingClientRect(); return synlig(c)&&r.height<=2&&r.width>20; }); if(i.length) return "hårlinje i etiketten";
  var nx=e.nextElementSibling; if(nx&&synlig(nx)){ var nr=nx.getBoundingClientRect(), ns=getComputedStyle(nx); if(nr.height<=2&&nr.width>40) return "streg-element under"; if(parseFloat(ns.borderTopWidth)>=1&&ns.borderTopStyle!=="none"&&nr.top-e.getBoundingClientRect().bottom<24) return "border-top på næste"; }
  return "";
}
function maalEtiketter(){
  rodNu().forEach(function(rod){ rod.querySelectorAll("div, span, p, h2, h3, h4, label").forEach(function(e){
    if(!synlig(e)) return; var cs=getComputedStyle(e); if(cs.textTransform!=="uppercase") return;
    var t=txt(e); if(!t||t.length>40||e.querySelector("input, textarea, button")) return;
    if(e.parentElement&&getComputedStyle(e.parentElement).textTransform==="uppercase"&&e.parentElement!==rod) return;   /* kun den yderste versal */
    var fl=e.parentElement; while(fl&&fl!==rod&&!erFlise(fl)) fl=fl.parentElement;
    if(!fl||fl===rod) return;
    N++; var s=streg(e); if(s) fejl("ETIKET I FLISE m. streg »"+t+"« ["+kl(e)+"] i flisen ["+kl(fl)+"] ("+s+") — skal stå over flisen uden streg");
  }); });
}
function maalAfstande(){
  rodNu().forEach(function(rod){
    var fl=[].slice.call(rod.querySelectorAll("*")).filter(erFlise).filter(function(e){ var p=e.parentElement; while(p&&p!==rod){ if(erFlise(p)) return false; p=p.parentElement; } return true; });
    fl.forEach(function(a){ var ra=a.getBoundingClientRect(); var under=null, bedst=1e9;
      fl.forEach(function(b){ if(b===a) return; var rb=b.getBoundingClientRect(); if(Math.abs(rb.left-ra.left)>1||Math.abs(rb.width-ra.width)>1) return; var d=rb.top-ra.bottom; if(d>=0&&d<bedst){ bedst=d; under=b; } });
      if(!under||bedst>=28) return;   /* 28 og derover er en overskrift eller sektion imellem — måles herunder */
      var rb=under.getBoundingClientRect();
      var mellem=[].slice.call(rod.querySelectorAll("*")).some(function(x){ if(x===a||x===under||a.contains(x)||under.contains(x)||x.contains(a)||x.contains(under)||!synlig(x)) return false; var r=x.getBoundingClientRect(); return r.top>=ra.bottom-1&&r.bottom<=rb.top+1&&r.height>4&&(x.innerText||"").trim(); });
      if(mellem) return;
      N++; if(Math.abs(bedst-12)>1) fejl("FLISE → FLISE "+Math.round(bedst)+" px mellem »"+txt(a)+"« og »"+txt(under)+"« [" +kl(under)+"] (skal 12)");
    });
  });
}
function afstand(a,b){ return Math.round(b.getBoundingClientRect().top-a.getBoundingClientRect().bottom); }
function maalForloeb(){
  var rod=document.getElementById("forloebTidslinje"); if(!rod) return;
  var ch=rod.querySelector(".lek-favchips"); if(ch&&synlig(ch)){ var nx=ch.nextElementSibling; while(nx&&!synlig(nx)) nx=nx.nextElementSibling;
    if(nx){ var tgt=nx.matches(".ftl2-sek")?nx.querySelector("span")||nx:nx; N++; var d=afstand(ch,tgt); if(Math.abs(d-20)>1) fejl("CHIPS → INDHOLD "+d+" px (skal 20) under »Alle lektioner · Favoritter«"); } }
  rod.querySelectorAll(".ftl2-stor, .ftl2-rk").forEach(function(s){ var n=s.querySelector(".ftl2-n"), b=s.querySelector(".ftl2-bes"), op=s.classList.contains("op");
    if(b&&synlig(b)&&!op){ N++; fejl("MODUL »"+txt(n)+"« er lukket, men viser beskrivelsen (kun i et udfoldet modul, Ida 14/11)"); return; }
    if(n&&b&&synlig(n)&&synlig(b)){ var t=s.querySelector(".ftl2-t"); var sidste=[].slice.call(t.children).filter(synlig).pop()||n; N++; var d=afstand(sidste,b); if(Math.abs(d-4)>1) fejl("MODUL titel → beskrivelse "+d+" px under »"+txt(n)+"« (skal 4)"); } });
  rod.querySelectorAll(".ftl2-sek").forEach(function(s){ if(!synlig(s)) return; var nx=s.nextElementSibling; while(nx&&!synlig(nx)) nx=nx.nextElementSibling; if(!nx) return; N++; var d=afstand(s,nx.querySelector(".ftl2-kort")&&synlig(nx.querySelector(".ftl2-kort"))?nx.querySelector(".ftl2-kort"):nx); if(Math.abs(d-8)>1) fejl("OVERSKRIFT → FLISE "+d+" px under »"+txt(s)+"« (skal 8)"); });
}
function maalOverskrifter(){   /* .prof-blok og .vks-blok: overskrift → flise 8 */
  rodNu().forEach(function(rod){ rod.querySelectorAll(".prof-blok > .prof-e, .vks-blok > .vks-eti").forEach(function(e){ if(!synlig(e)) return; var f=e.nextElementSibling; if(!f||!synlig(f)) return; N++; var d=afstand(e,f); if(Math.abs(d-8)>1) fejl("OVERSKRIFT → FLISE "+d+" px under »"+txt(e)+"« (skal 8)");
    var cs=getComputedStyle(e); N++; if(Math.round(parseFloat(cs.fontSize))!==12||cs.color.replace(/\s/g,"")!=="rgb(111,107,102)"||Math.abs(parseFloat(cs.letterSpacing)-1.5)>0.05||cs.textTransform!=="uppercase") fejl("OVERSKRIFT »"+txt(e)+"« "+cs.fontSize+" "+cs.color+" ls "+cs.letterSpacing+" (skal 12 · #6F6B66 · 1,5 · versal)"); }); });
}
function alt(){ maalEtiketter(); maalAfstande(); maalOverskrifter(); maalForloeb(); }

var VAGT=setTimeout(function(){ console.log("SELE FLISER FEJL: proben nåede ikke i mål på 60 s — sidste trin: "+TRIN); },60000);
setTimeout(async function(){ try {
  var vent=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
  for(var v=0;v<40&&!document.body.classList.contains("app-klar");v++) await vent(150);
  var ryd=function(){ ["appLoader","turOverlay","dagensKort","nyVersion","privCover"].forEach(function(id){var e=document.getElementById(id); if(e) e.remove();}); try{ dagensKortLuk(); }catch(e){} };
  ryd();
  var laast=[false]; if(window.SELE_BEGGE) laast=[false,true];
  for(var li=0; li<laast.length; li++){
    if(laast[li]) window.ygtBriefLaast=function(){return true;};
    var L=laast[li]?" (Content låst)":"";
    TRIN="profil"+L; try{ await minProfilAaben(); }catch(e){ fejl("døren åbnede ikke: "+(e&&e.message)); } await vent(1200); ryd(); alt();
    TRIN="værktøjskassen"+L; try{ vaerktoejAaben(); }catch(e){ fejl("døren åbnede ikke: "+(e&&e.message)); } await vent(1200); ryd(); alt();
  }
  TRIN="dine noter"; try{ vkNoterAabn(); }catch(e){ fejl("døren åbnede ikke: "+(e&&e.message)); } await vent(1000); ryd(); alt();
  TRIN="forløbet";
  try{
    var idag=datoDK(); var Lk=function(m,n){var a=[];for(var i=1;i<=n;i++)a.push({id:m+"-"+i,titel:"Lektion "+m+"."+i,video:"x.mp4"});return a;};
    CURRENT_DEF=Object.assign({},CURRENT_DEF||{},{type:"kursus",forloeb:"YOU GOT THIS"});
    KURSUS_MODULER.splice.apply(KURSUS_MODULER,[0,KURSUS_MODULER.length].concat([["Modul 0 · Introduktion til forløbet",Lk(1,5)],["Modul 1 · Mennesket",Lk(2,6)],["Modul 2 · Energibanken",Lk(3,4)],["Modul 3 · Hvorfor er du, som du er",Lk(4,4)]].map(function(m){return {titel:m[0],lektioner:m[1]};})));
    try{ var _mi=modulInfoFor; modulInfoFor=function(nr){ var r=Object.assign({}, _mi(nr)||{}); if(!r.beskrivelse) r.beskrivelse="Her lærer du, hvordan du bruger din energi, så du kan skabe content, der føles som dig."; return r; }; }catch(e){}
    window.pubErPubliceret=function(){return true;}; YGT_START=idag; Object.assign(YGT_DAG,{"1":0,"2":0,"3":6,"4":14}); KURSUS_SET={}; OB_SKEMA=true;
    showTab(12); try{renderKursusHjem();}catch(e){} await vent(1200); ryd(); alt();
    N++; if(!document.querySelector("#forloebTidslinje .lek-favchips")) fejl("FORLØB: chips-rækken findes ikke (testen ser ikke det, den skal)");
    /* udfold et åbent og et låst modul: beskrivelsen 4 under titlen, og chipsene står stille (Ida 14/11: »jeg HADER … de chips øverst bevæger sig«) */
    var chT=function(){ var c=document.querySelector("#forloebTidslinje .lek-favchips"); return c?c.getBoundingClientRect().top:null; };
    var hd=function(sel){ return document.querySelector("#forloebTidslinje "+sel); };
    var SCR=document.getElementById("forloebTidslinje"); while(SCR&&!/auto|scroll/.test(getComputedStyle(SCR).overflowY)) SCR=SCR.parentElement; SCR=SCR||document.scrollingElement;
    var foldTjek=async function(sel, navn, rul){ var h=hd(sel); if(!h){ N++; fejl("FORLØB: fandt intet "+navn+" at folde ud"); return; } if(rul) { SCR.scrollTop=SCR.scrollHeight; await vent(150); } var t0=chT(); h.click(); await vent(500); var t1=chT(); N++; if(t0===null||Math.abs(t1-t0)>0.5) fejl("CHIPS FLYTTER SIG: "+navn+" foldet "+(rul?"(rullet ned) ":"")+Math.round(t0)+" → "+Math.round(t1)+" (skal stå stille)"); };
    TRIN="forløbet, åbent modul udfoldet"; await foldTjek(".ftl2-stor .ftl2-hoved","åbent modul",false); alt();
    TRIN="forløbet, låst modul udfoldet"; await foldTjek(".ftl2-rk.laast.fold .ftl2-rh","låst modul",false); alt();
    TRIN="forløbet, lukket igen"; await foldTjek(".ftl2-rk.laast.fold.op .ftl2-rh","låst modul (luk)",true); await foldTjek(".ftl2-stor.op .ftl2-hoved","åbent modul (luk)",true); alt();
  }catch(e){ fejl("forløbet: "+(e&&e.message)); }
  clearTimeout(VAGT);
  if(FUND.length){ FUND.forEach(function(f){ console.log("SELE FLISER FEJL: "+f); }); console.log("SELE FLISER IKKE OK: "+FUND.length+" afvigelser af "+N+" målinger paa "+innerWidth); }
  else console.log("SELE FLISER OK: "+N+" målinger paa "+innerWidth+", 0 afvigelser");
} catch(e){ console.log("SELE FLISER FEJL probe: "+(e&&e.message)+" — "+TRIN); }
}, 400);
