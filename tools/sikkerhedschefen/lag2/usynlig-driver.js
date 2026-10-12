<script>/* SIKKERHEDSCHEFEN · LØFTE 36 · TEKST, DER FINDES, MEN IKKE KAN SES (fejlkataloget B37 — 21/9 »alle mine manusser er væk« (et CSS-låg over teksten),
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
  var res={s:SCR,w:innerWidth,maalt:0,usynlig:[],laag:[]};
  try{
   var els=[].slice.call(document.body.querySelectorAll("*")).filter(function(e){ if(!egenTekst(e)) return false; if(e.closest("script,style,#authGate,#appLoader,svg,[aria-hidden=true],.sr-only,#versionsFod")) return false; if(!e.getClientRects().length) return false; var s=getComputedStyle(e); if(s.visibility==="hidden"||+s.opacity<0.05) return false; var r=e.getBoundingClientRect(); return r.width>2&&r.height>2; });
   for(var k=0;k<els.length&&k<500;k++){
    var e=els[k], t=egenTekst(e).slice(0,40), s=getComputedStyle(e); var r=e.getBoundingClientRect();
    if(r.bottom<0||r.top>document.documentElement.scrollHeight) continue;
    /* en forælder med opacity 0 skjuler teksten med vilje (fx lukket fold) */
    var skjult=false; for(var a=e;a&&a!==document.body;a=a.parentElement){ var sa=getComputedStyle(a); if(+sa.opacity<0.05||sa.visibility==="hidden"){skjult=true;break;} } if(skjult) continue;
    res.maalt++;
    var fg=rgb(s.color), bg=bagved(e);
    if(fg&&bg&&fg[3]>0.2){ var kr=kontrast(fg,bg); if(kr<1.6) res.usynlig.push(t+" ("+kr.toFixed(2)+":1)"); }
    if(fg&&fg[3]<=0.2) res.usynlig.push(t+" (tekstfarve næsten gennemsigtig)");
    /* LÅG: står der noget andet oven på tekstens midte? (kun det, der er på skærmen nu) */
    e.scrollIntoView({block:"center"}); var rr=e.getBoundingClientRect(); var px=rr.left+Math.min(rr.width/2,20), py=rr.top+rr.height/2;
    var stak=document.elementsFromPoint(px,py), idx=-1; for(var q=0;q<stak.length;q++){ if(stak[q]===e||e.contains(stak[q])){ idx=q; break; } }
    var over=idx<0?stak:stak.slice(0,idx);
    /* dækket af en HEL side (en anden side, startfotoet, coveret) = teksten hører til en side, der ikke vises nu — ikke et låg */
    if(over.some(function(o){ return /(^|\s)(screen|content|mb-foto|phone|hf-hero-foto|cover|mb-navn|hero)/.test(String(o.className)); })) continue;
    /* et LÅG er noget, man kan SE: en uigennemsigtig flade eller egen tekst */
    var laag=over.filter(function(o){ var os=getComputedStyle(o); if(+os.opacity<0.05) return false; var b=rgb(os.backgroundColor); return (b&&b[3]>0.5)||!!egenTekst(o)||o.tagName==="IMG"; })[0];
    /* en knap, der viser samme tekst som feltet under sig (fx en vælger), dækker ikke noget */
    if(laag && (laag.textContent||"").trim().indexOf(t.slice(0,15))>-1) laag=null;
    if(laag) res.laag.push(t+" ← "+laag.tagName+"."+String(laag.className).slice(0,30));
   }
  }catch(x){ res.fejl=String(x&&x.message||x); }
  console.log("@@"+JSON.stringify(res)+"@@");
 })();
})();
</script>
