<script>/* SIKKERHEDSCHEFEN · LØFTE 56 · MIKROFONEN VIRKER I HVERT FELT MED MIKROFON (Ida 17/11: »Mikrofonen virker ikke i pop ups! Tjek nu ALLE funktioner« → »Det skal med i sikkerhedschefen«).
   For hvert ark/popup (samme liste som porten åbner, probe-regler2.js) og hvert af briefens skrivetrin: hver mikrofon trykkes to gange med en opdigtet talegenkendelse —
   (1) TALE: der »siges« »prøve tale punktum«, og »Prøve tale.« skal lande i netop det felt, mikrofonen hører til;
   (2) IPHONE UDEN SVAR: genkendelsen siger intet (som på hjemmeskærmen), og efter 6 sekunder skal beskeden om tastaturets mikrofon KUNNE SES (ikke ligge skjult inde i feltet).
   Kun opdigtede data i selen. ARK_KUNDE / ARK_DASH / SKABELON lægges foran af tjek_mik.py fra probe-regler2.js — én liste over ark. */
(function(){
 var P=new URLSearchParams(location.search), FLADE=P.get("mikf"); if(!FLADE) return;
 var V=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
 var res={flade:FLADE,w:innerWidth,maalt:0,ark:0,fejl:[],sprunget:[]};
 window.__MIK_MODE="tal";
 function FakeSR(){ this.lang=""; this.continuous=false; this.interimResults=false; }
 FakeSR.prototype.start=function(){ var s=this; if(window.__MIK_MODE==="tal"){ setTimeout(function(){ var r=[[{transcript:"prøve tale punktum"}]]; try{ s.onresult&&s.onresult({results:r}); }catch(e){} },120); } };
 FakeSR.prototype.stop=function(){ var s=this; setTimeout(function(){ try{ s.onend&&s.onend(); }catch(e){} },20); };
 FakeSR.prototype.abort=FakeSR.prototype.stop;
 window.SpeechRecognition=FakeSR; window.webkitSpeechRecognition=FakeSR;
 var ios=false; var orgIos=window.taleErIos;
 function synlig(e){ if(!e) return false; var q=e.getBoundingClientRect(); if(q.width<2||q.height<2) return false; var c=getComputedStyle(e); if(c.display==="none"||c.visibility==="hidden"||+c.opacity===0) return false; return true; }
 function seesAf(e){ if(!synlig(e)) return false; try{ e.scrollIntoView({block:"center"}); }catch(x){} var q=e.getBoundingClientRect(); var x=Math.min(innerWidth-2,Math.max(1,q.left+Math.min(20,q.width/2))), y=Math.min(innerHeight-2,Math.max(1,q.top+q.height/2)); var p=document.elementFromPoint(x,y); return !!p&&(p===e||e.contains(p)); }   /* rulles frem som telefonen gør med det felt, man er i */
 function lag(){ var u=[]; ["arkSlor","bsFlytMenu"].forEach(function(id){ var e=document.getElementById(id); if(e&&synlig(e)) u.push(e); }); [].forEach.call(document.querySelectorAll(".modal-back"),function(m){ if(synlig(m)) u.push(m); }); return u; }
 function lukAlt(){ try{ if(TALE_REC) TALE_REC.stop(); }catch(e){} try{bsFlytLuk()}catch(e){} try{arkLuk(true)}catch(e){} try{closeModal()}catch(e){} [].forEach.call(document.querySelectorAll(".modal-back"),function(m){ m.classList.remove("open","show","vis","on"); if(m.style.display==="flex") m.style.display="none"; }); var b=document.getElementById("bsFlytMenu"); if(b){ b.style.display="none"; } }
 async function testMik(k, hvor){
  var id=(k.id||"").replace(/^taleKnap_/,""); var f=id&&document.getElementById(id); if(!f){ res.fejl.push(hvor+": mikrofonen peger på et felt, der ikke findes ("+(k.id||"uden id")+")"); return; }
  res.maalt++;
  /* 1 · tale lander i feltet */
  var foer=f.value; f.value=""; window.__MIK_MODE="tal"; window.taleErIos=function(){return false}; k.click(); await V(450);
  var ok=/Prøve tale\./.test(f.value||""); try{ if(TALE_REC) TALE_REC.stop(); }catch(e){} await V(80);
  if(!ok) res.fejl.push(hvor+": talen landede ikke i feltet ("+id+" = »"+String(f.value||"").slice(0,30)+"«)");
  f.value=foer; try{ f.dispatchEvent(new Event("input",{bubbles:true})); }catch(e){}
  /* 2 · iPhone uden svar: beskeden om tastaturets mikrofon skal kunne ses */
  window.__MIK_MODE="stille"; window.taleErIos=function(){return true};
  var o=window.setTimeout; window.setTimeout=function(fn,ms){ if(ms===9000) return 0; return o.apply(window,arguments); };   /* beskeden skal blive stående, mens den måles */
  k.click(); await V(6400);
  window.setTimeout=o;
  var h=document.getElementById("taleTast_"+id);
  if(!h) res.fejl.push(hvor+": ingen besked om tastaturets mikrofon efter 6 sek. ("+id+")");
  else if(!seesAf(h)) res.fejl.push(hvor+": beskeden om tastaturets mikrofon kan ikke ses ("+id+")");
  try{ if(h) h.remove(); }catch(e){} try{ f.blur(); }catch(e){}
  window.taleErIos=orgIos||function(){return false}; window.__MIK_MODE="tal";
 }
 async function testLag(hvor){ var l=lag(); var mik=[]; l.forEach(function(x){ [].forEach.call(x.querySelectorAll(".ark-mik, .brief-mik, .tale-knap, .food-mik"),function(m){ if(synlig(m)&&mik.indexOf(m)<0) mik.push(m); }); }); for(var i=0;i<mik.length;i++) await testMik(mik[i],hvor); return mik.length; }
 async function proev(navn,kald,maks){ var foer=lag(); try{ kald(); }catch(e){} var nu=[]; for(var t=0;t<(maks||2000);t+=100){ await V(100); nu=lag().filter(function(e){return foer.indexOf(e)<0}); if(nu.length) break; } if(!nu.length) return false; await V(300); res.ark++; await testLag(navn); lukAlt(); for(var u=0;u<1500;u+=100){ await V(100); if(!lag().length) break; } return true; }
 (async function(){
  try{
   for(var i=0;i<80&&!document.body.classList.contains("app-klar");i++) await V(150);
   ["appLoader","dagensKort","turOverlay","nyVersion"].forEach(function(id){var e=document.getElementById(id);if(e)e.remove()}); try{dagensKortLuk()}catch(e){} try{turLuk(); window.turStart=function(){};}catch(e){}
   await V(500);
   var LISTE=(FLADE==="dash"?(typeof ARK_DASH!=="undefined"?ARK_DASH:[]):(typeof ARK_KUNDE!=="undefined"?ARK_KUNDE:[])), ARG1=FLADE==="dash"?"adgangskode":"mk1";
   if(FLADE==="kunde"){
    try{ IDEER.push({id:"mk1",titel:"Prøveopslag",soejle:"",type:"Reel",status:"Brief i gang",dato:"2026-11-20",brief:{format:"Reel",platform:["Instagram"]}}); }catch(e){}
    /* briefens skrivetrin: hver mikrofon på hvert trin */
    try{ openBriefSide("mk1"); await V(1500); for(var s=0;s<9;s++){ await testLag("brief trin "+(s+1)); var bw=document.getElementById("briefWrap")||document.body; var mm=[].filter.call(bw.querySelectorAll(".brief-mik, .tale-knap, .ark-mik"),synlig); for(var m=0;m<mm.length;m++) await testMik(mm[m],"brief trin "+(s+1)); briefTrinGaa(1); await V(900); } }catch(e){ res.sprunget.push("briefen: "+(e&&e.message)); }
    try{ showTab(3); }catch(e){} lukAlt(); await V(600);
   } else { try{ visDashSide("overblik"); }catch(e){} await V(800); }
   if(typeof SKABELON!=="undefined") for(var j=0;j<SKABELON.length;j++) await proev(SKABELON[j][0],SKABELON[j][1]);
   for(var n=0;n<LISTE.length;n++){ var nv=LISTE[n], fn=window[nv]; if(typeof fn!=="function") continue; var ok=await proev(nv,function(){fn()}); if(!ok) ok=await proev(nv,function(){fn(ARG1)},700); if(!ok) ok=await proev(nv,function(){fn(0)},700); }
  }catch(x){ res.fejl.push("scriptfejl: "+String(x&&x.message||x)); }
  console.log("@@"+JSON.stringify(res)+"@@");
 })();
})();
</script>
