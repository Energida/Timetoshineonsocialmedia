<script>/* SIKKERHEDSCHEFEN · LØFTE 44 · TO HÅRDE DESIGNREGLER (fejlkataloget G101–102): billeder har aldrig runde hjørner (Ida 8/10), og der står aldrig små versaler på rødt (Ida 5/10).
   (Bygget på usynlig-driveren.) SIKKERHEDSCHEFEN · LØFTE 36 · TEKST, DER FINDES, MEN IKKE KAN SES (fejlkataloget B37 — 21/9 »alle mine manusser er væk« (et CSS-låg over teksten),
   22/9 dagens opslag hvidt på hvidt). For hver side: hver synlig tekst skal have kontrast mod sin baggrund (mindst 1,6:1 — kun det helt usynlige fanges),
   og intet andet element må ligge oven på teksten. Billeder bag teksten springes over (de måles ikke). Kun opdigtede data i selen. */
(function(){
 var P=new URLSearchParams(location.search), SCR=P.get("uxf"); if(!SCR) return;
 var V=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
 function seed(){ if(SCR.indexOf("bs_")===0||typeof IDEER==="undefined"||typeof mapIdeRow!=="function") return; IDEER.length=0; var iso=huIso(new Date()); for(var i=0;i<6;i++) IDEER.push(mapIdeRow({id:"r"+i,kode:"HINGES2026",titel:"Efterårets strik nr "+i,status:i<2?"Planlagt":"Idé",soejle:"Produkt",type:"Reel",dato:i<2?iso:null,brief:{beskrivelse:"Kort beskrivelse",hookTekst:"Se her"},created_at:new Date(2026,8,1,0,i).toISOString()})); }
 var SK={hjem:function(){showTab(3);hjemUgeTegn()},kalender:function(){showTab(8);try{contentFacitTegn()}catch(e){}},idebank:function(){showTab(2);renderIdeas();try{ibMobilTegn()}catch(e){}},indbakke:function(){indbakkenAaben()},planlaegning:function(){showTab(31)},performance:function(){openMaal()},vaerktoej:function(){vaerktoejAaben()},profil:function(){minProfilAaben()},brief:function(){ideUpdate("r1",{soejle:"Produkt"});openBriefSide("r1")},bs_overblik:function(){visDashSide('overblik')},bs_indbakke:function(){visDashSide('indbakke')},bs_crm:function(){visDashSide('crm')},bs_energida:function(){visDashSide('energida')},bs_studio:function(){visDashSide('klip')},bs_gsd:function(){visDashSide('gsd')}};
 function rgb(s){ var m=String(s).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); return m?[+m[1],+m[2],+m[3],m[4]==null?1:+m[4]]:null; }
 function lum(c){ var a=c.slice(0,3).map(function(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)}); return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]; }
 function kontrast(a,b){ var x=lum(a),y=lum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); }
 function bagved(el){ /* første uigennemsigtige baggrund; billede/gradient = ukendt (null) */
   for(var e=el;e&&e.nodeType===1;e=e.parentElement){ var s=getComputedStyle(e); if(s.backgroundImage&&s.backgroundImage!=="none") return null; var c=rgb(s.backgroundColor); if(c&&c[3]>0.85) return c; if(e.tagName==="IMG"||e.tagName==="VIDEO") return null; }
   return [255,255,255,1]; }
 function egenTekst(e){ for(var i=0;i<e.childNodes.length;i++){ var n=e.childNodes[i]; if(n.nodeType===3&&n.textContent.trim().length>1) return n.textContent.trim(); } return ""; }
 (async function(){
  for(var i=0;i<80&&!document.body.classList.contains("app-klar");i++) await V(150);
  ["appLoader","dagensKort","turOverlay"].forEach(function(id){var e=document.getElementById(id);if(e)e.remove()}); try{dagensKortLuk()}catch(e){} try{turLuk()}catch(e){}
  await V(400); seed(); try{await SK[SCR]()}catch(e){} await V(1500);
  var res={s:SCR,w:innerWidth,maalt:0,runde:[],versaler:[]};
  try{
   function radius(e){ var s=getComputedStyle(e); return Math.max(parseFloat(s.borderTopLeftRadius)||0,parseFloat(s.borderTopRightRadius)||0,parseFloat(s.borderBottomLeftRadius)||0,parseFloat(s.borderBottomRightRadius)||0); }
   /* BILLEDER: <img> og flader med et foto som baggrund (ikke ikoner/svg, ikke under 40 px). Et billede, der ligger i en rundet ramme med overflow hidden, tæller også. */
   [].slice.call(document.querySelectorAll("img, [style*='background-image'], div, section, a, span")).forEach(function(e){
     if(!e.getClientRects().length) return; var r=e.getBoundingClientRect(); if(r.width<40||r.height<40) return;
     var s=getComputedStyle(e), erImg=e.tagName==="IMG"&&!/\.svg|data:image\/svg/.test(e.currentSrc||e.src||""), bg=s.backgroundImage&&/url\(/.test(s.backgroundImage)&&!/svg/.test(s.backgroundImage);
     if(!erImg&&!bg) return; if(e.closest("#authGate,#appLoader,svg")) return; res.maalt++;
     var rd=radius(e); if(!rd){ var p=e.parentElement; if(p&&getComputedStyle(p).overflow!=="visible"){ var pr=p.getBoundingClientRect(); if(Math.abs(pr.width-r.width)<4&&Math.abs(pr.height-r.height)<4) rd=radius(p); } }
     if(rd>1) res.runde.push((e.tagName==="IMG"?"billede":"fotoflade")+" ."+String(e.className).slice(0,30)+" ("+Math.round(rd)+" px)");
   });
   /* SMÅ VERSALER PÅ RØDT: tekst med text-transform uppercase (eller lutter store bogstaver) under 13 px på en rød baggrund */
   [].slice.call(document.body.querySelectorAll("*")).forEach(function(e){
     var t=egenTekst(e); if(!t||!e.getClientRects().length) return; var s=getComputedStyle(e); if(+s.opacity<0.05||s.visibility==="hidden") return;
     var bg=bagved(e); if(!bg) return; var rod=bg[0]>200&&bg[1]<80&&bg[2]<60; if(!rod) return;
     var versal=s.textTransform==="uppercase"||(t.length>3&&t===t.toUpperCase()&&/[A-ZÆØÅ]{3}/.test(t)); if(versal&&parseFloat(s.fontSize)<13) res.versaler.push("»"+t.slice(0,30)+"« ("+s.fontSize+")");
   });
  }catch(x){ res.fejl=String(x&&x.message||x); }
  console.log("@@"+JSON.stringify(res)+"@@");
 })();
})();
</script>
