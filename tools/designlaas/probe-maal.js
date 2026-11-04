/* MÅLPORTEN (Ida 4/11: »kontrol af ALT, inden det bygges — højder, farver, fonte og størrelser på alt, også knapper«).
   Åbner en UDFYLDT opslags-brief (kalender → brief, som kunden gør), går briefoversigten + alle fire skrivesider igennem og måler mod MÅLKORT.md:
   flise · flisetitel · klip-etiket · felt-etiket · felt · chips (også plus-chips) · knapper (højde + tekst/ikon i midten) · ikonknapper · skillelinjer · feltflugt · ikonrækken · musen over heroen · dækfladen ved sideskift.
   Kører på den bredde, vinduet har (390 = telefon, 1440 = computer). Én afvigelse = linje med »FEJL«, og porten (koer.sh) stopper. */
function px(v){ return Math.round(parseFloat(v)*10)/10||0; }
function rgb(c){ return (c||"").replace(/\s/g,""); }
function synlig(e){ var r=e.getBoundingClientRect(); if(r.width<2||r.height<2) return false; var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||cs.opacity==="0") return false; return !e.closest("[hidden]"); }
function txt(e){ return (e.innerText||e.getAttribute("aria-label")||e.placeholder||"").replace(/\s+/g," ").trim().slice(0,26); }
function kl(e){ return (e.className&&e.className.toString().split(" ").filter(Boolean).slice(0,2).join("."))||e.tagName.toLowerCase(); }
var FUND=[], N=0, TRIN="start";
function fejl(s){ FUND.push(TRIN+" · "+s); }
function er(navn, e, ok, hvad){ N++; if(!ok) fejl(navn+" »"+txt(e)+"« ["+kl(e)+"] "+hvad); }
var TLF=innerWidth<900;
var RED="rgb(252,36,4)", SORT="rgb(26,26,26)", G2="rgb(111,107,102)", G3="rgb(154,149,144)", KANT="rgb(222,218,212)";

function maalSide(){
  var rod=document.getElementById("briefWrap"); if(!rod) return;
  /* FLISER: radius 20 · luft 18/20 · afstand 10 · hvid */
  rod.querySelectorAll(".sk-q, .klip-kort").forEach(function(e){
    if(!synlig(e)) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect();
    if(r.width<200) return;
    if(e.classList.contains("klip1-vaert")||e.querySelector(":scope > #briefKlipHolder, :scope > .kk-scener")) return;   /* holderen er ingen flise */
    if(e.parentElement.closest(".sk-q:not(:has(> #briefKlipHolder)):not(:has(> .kk-scener)), .klip-kort")) return;   /* en flise i en flise er ikke en ny flise */
    er("FLISE radius", e, px(cs.borderTopLeftRadius)===20, "radius "+px(cs.borderTopLeftRadius)+" (skal 20)");
    er("FLISE luft", e, px(cs.paddingTop)===18&&px(cs.paddingBottom)===18&&px(cs.paddingLeft)===20&&px(cs.paddingRight)===20, "luft "+cs.padding+" (skal 18 20)");
    er("FLISE afstand", e, px(cs.marginBottom)===10, "afstand under "+px(cs.marginBottom)+" (skal 10)");
    er("FLISE flade", e, rgb(cs.backgroundColor)==="rgb(255,255,255)"||/story|cap-q/.test(kl(e)), "flade "+cs.backgroundColor);
  });
  /* FLISETITEL: Poppins 18 (telefon 16) / 400 / #1A1A1A; 16 til første indhold */
  rod.querySelectorAll(".sk-q > .sk-label, .kk-hook-spm").forEach(function(e){
    if(!synlig(e)) return; var cs=getComputedStyle(e);
    var t=e.querySelector(".sk-spm, .sk-titel")||e; var ts=getComputedStyle(t);
    er("FLISETITEL skrift", t, px(ts.fontSize)===(TLF?16:18)&&ts.fontWeight==="400"&&/Poppins/.test(ts.fontFamily)&&rgb(ts.color)===SORT, ts.fontSize+"/"+ts.fontWeight+" "+ts.color+" (skal "+(TLF?16:18)+"/400 #1A1A1A Poppins)");
    var nxt=e.nextElementSibling; while(nxt&&getComputedStyle(nxt).display==="none") nxt=nxt.nextElementSibling;
    if(nxt&&nxt.getBoundingClientRect().height>0){ var d=Math.round(nxt.getBoundingClientRect().top-e.getBoundingClientRect().bottom); er("FLISETITEL afstand", e, Math.abs(d-16)<=1, "til indholdet "+d+" (skal 16)"); }
  });
  /* KLIP-ETIKET: 10 versal #9A9590 + ÉN streg under */
  rod.querySelectorAll(".klip-hoved .kk-titel").forEach(function(e){
    if(!synlig(e)) return; var cs=getComputedStyle(e);
    er("KLIP-ETIKET", e, px(cs.fontSize)===10&&cs.textTransform==="uppercase"&&rgb(cs.color)===G3&&cs.fontWeight==="400", cs.fontSize+"/"+cs.fontWeight+" "+cs.color+" "+cs.textTransform+" (skal 10 versal #9A9590)");
    var hd=e.closest(".klip-hoved"), hs=getComputedStyle(hd); er("KLIP-ETIKET streg", hd, px(hs.borderBottomWidth)===1&&rgb(hs.borderBottomColor)==="rgb(227,226,222)", "streg "+hs.borderBottomWidth+" "+hs.borderBottomColor);
  });
  /* FELT-ETIKET: 13/400 #6F6B66, 8 til feltet */
  rod.querySelectorAll(".klip-kort .kk-et").forEach(function(e){
    if(!synlig(e)) return; var cs=getComputedStyle(e);
    er("FELT-ETIKET", e, px(cs.fontSize)===13&&cs.fontWeight==="400"&&rgb(cs.color)===G2&&cs.textTransform==="none", cs.fontSize+"/"+cs.fontWeight+" "+cs.color+" (skal 13/400 #6F6B66)");
    var nx=e.nextElementSibling; if(nx&&nx.getBoundingClientRect().height>0){ var d=Math.round(nx.getBoundingClientRect().top-e.getBoundingClientRect().bottom); er("FELT-ETIKET afstand", e, Math.abs(d-8)<=1, "til feltet "+d+" (skal 8)"); }
  });
  /* FELTER: 13/400 · radius 14 · 1 px #DEDAD4 · mindst 44 høj */
  rod.querySelectorAll("textarea.sk-input, input.sk-input, textarea.mb-felt").forEach(function(e){
    if(!synlig(e)||e.closest(".sendfelt, .sendfelt-felt")) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect();
    er("FELT", e, px(cs.fontSize)===13&&cs.fontWeight==="400"&&px(cs.borderTopLeftRadius)===14&&px(cs.borderTopWidth)===1&&rgb(cs.borderTopColor)===KANT&&r.height>=43.5&&cs.fontStyle==="normal", cs.fontSize+"/"+cs.fontWeight+" r"+cs.borderTopLeftRadius+" kant "+cs.borderTopWidth+" "+cs.borderTopColor+" h"+Math.round(r.height)+" "+cs.fontStyle+" (skal 13/400 r14 1px #DEDAD4 h>=44)");
  });
  /* FELTFLUGT: alle hook-/forslagsfelter i samme flise starter og slutter ens */
  rod.querySelectorAll(".sk-q, .klip-kort").forEach(function(f){
    var ls=[].slice.call(f.querySelectorAll(".fs-ta-vaert")).filter(synlig).map(function(e){ var r=e.getBoundingClientRect(); return [Math.round(r.left),Math.round(r.right)]; });
    if(ls.length>1){ N++; var l0=ls[0][0], r0=ls[0][1]; if(ls.some(function(x){ return Math.abs(x[0]-l0)>1||Math.abs(x[1]-r0)>1; })) fejl("FELTFLUGT i "+kl(f)+": felterne står ikke ens ("+ls.map(function(x){return x.join("-")}).join(" · ")+")"); }
  });
  /* CHIPS: 36 · 13/400 · #6F6B66 · radius 999 · luft 16 · plus 14 grå, 6 til teksten */
  rod.querySelectorAll(".ark-chip:not(.kk-ini):not(.on)").forEach(function(e){
    if(!synlig(e)) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect();
    if(e.closest("#briefSideNav")) return;
    er("CHIP", e, Math.round(r.height)===36&&px(cs.fontSize)===13&&cs.fontWeight==="400"&&rgb(cs.color)===G2&&px(cs.borderTopLeftRadius)>=18&&px(cs.paddingLeft)===16&&px(cs.paddingRight)===16&&/Poppins/.test(cs.fontFamily), "h"+Math.round(r.height)+" "+cs.fontSize+"/"+cs.fontWeight+" "+cs.color+" luft "+cs.paddingLeft+"/"+cs.paddingRight+" (skal 36 · 13/400 · #6F6B66 · luft 16)");
    var pl=e.querySelector("svg.chip-plus"); if(pl&&(e.innerText||"").trim()){
      var sr=pl.getBoundingClientRect(); var rg=document.createRange(), tn=[].find.call(e.childNodes,function(n){return n.nodeType===3&&n.textContent.trim();}); if(tn){ rg.selectNodeContents(tn); var tr=rg.getBoundingClientRect(); var gap=Math.round(tr.left-sr.right);
        er("PLUS-CHIP mellemrum", e, Math.abs(gap-6)<=1&&Math.round(sr.width)===14, "plus→tekst "+gap+" px, plus "+Math.round(sr.width)+" (skal 6 og 14)");
        var venstre=Math.round(sr.left-r.left), hoejre=Math.round(r.right-tr.right); er("PLUS-CHIP luft", e, Math.abs(venstre-17)<=2&&Math.abs(hoejre-17)<=2, "luft til kanterne "+venstre+"/"+hoejre+" (skal 16 hver side)"); }
    }
  });
  /* IKONKNAPPER: 36 rund */
  rod.querySelectorAll(".bt-mere-tlf, .kk-ini, .kk-plus, .kk-slet, .fs-rk > button.row-btn, .brief-mik").forEach(function(e){
    if(!synlig(e)) return; var r=e.getBoundingClientRect(); er("IKONKNAP", e, Math.round(r.width)===36&&Math.round(r.height)===36, Math.round(r.width)+"x"+Math.round(r.height)+" (skal 36x36)");
  });
  /* KNAPPER i bunden: 40 */
  rod.querySelectorAll("#briefSideNav .dbtn").forEach(function(e){ if(!synlig(e)) return; var r=e.getBoundingClientRect(); er("KNAP højde", e, Math.round(r.height)===40, "h"+Math.round(r.height)+" (skal 40)"); });
  /* KNAPPERS TEKST I MIDTEN: lodret ≤ 1 px (pille/ikon/chip med én linje); ikon og tekst flugter */
  rod.querySelectorAll("button, .dbtn, .ark-chip").forEach(function(e){
    if(!synlig(e)) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect(); var rad=px(cs.borderTopLeftRadius);
    if(!(rad>=12&&r.height<=64&&r.width<700)||/fb-pil|bdrop-knap|bs3-drop|fb-rk|kk-ini/.test(kl(e))) return;
    var w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT), tn, rs=[]; while(tn=w.nextNode()){ if(!tn.textContent.trim()||getComputedStyle(tn.parentElement).display==="none") continue; var rg=document.createRange(); rg.selectNodeContents(tn); var b=rg.getBoundingClientRect(); if(b.width>0) rs.push(b); }
    if(!rs.length) return; if(Math.max.apply(null,rs.map(function(b){return b.height}))>=px(cs.fontSize)*2.2) return;
    var tt=Math.min.apply(null,rs.map(function(b){return b.top})), tb=Math.max.apply(null,rs.map(function(b){return b.bottom}));
    var dy=(tt+tb)/2-(r.top+r.height/2); er("KNAP tekst lodret", e, Math.abs(dy)<=1, "teksten står "+Math.round(dy*10)/10+" px fra midten (skal ≤ 1)");
    var sv=e.querySelector("svg"); if(sv&&synlig(sv)){ var sr=sv.getBoundingClientRect(); var dsv=(sr.top+sr.bottom)/2-(tt+tb)/2; er("KNAP ikon/tekst", e, Math.abs(dsv)<=1.5, "ikon og tekst flugter ikke lodret ("+Math.round(dsv*10)/10+" px)"); }
    if(!e.querySelector("svg")&&!/justify-content:\s*(flex-start|space)/.test(e.getAttribute("style")||"")){ var l=Math.min.apply(null,rs.map(function(b){return b.left})), rr=Math.max.apply(null,rs.map(function(b){return b.right})); var dx=(l+rr)/2-(r.left+r.width/2); er("KNAP tekst vandret", e, Math.abs(dx)<=1.5, "teksten står "+Math.round(dx*10)/10+" px fra midten vandret"); }
  });
  /* SKILLELINJER i fliser: aldrig to i træk (under 24 px) */
  rod.querySelectorAll(".sk-q, .klip-kort").forEach(function(f){
    if(!synlig(f)||f.querySelector(":scope > #briefKlipHolder, :scope > .kk-scener")) return; var ys=[];
    f.querySelectorAll("*").forEach(function(e){ if(!synlig(e)||/^(TEXTAREA|INPUT|BUTTON|SELECT|svg|path)$/.test(e.tagName)||e.closest("button,textarea,.fb-rk")) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect(); if(px(cs.borderTopWidth)>=1&&cs.borderTopStyle!=="none") ys.push(Math.round(r.top)); if(px(cs.borderBottomWidth)>=1&&cs.borderBottomStyle!=="none") ys.push(Math.round(r.bottom)); });
    ys.sort(function(a,b){return a-b}); for(var i=1;i<ys.length;i++){ N++; if(ys[i]-ys[i-1]<24) fejl("SKILLELINJE: to streger med "+(ys[i]-ys[i-1])+" px imellem i "+kl(f)); }
  });
  /* IKONRÆKKEN PÅ COMPUTER: kun ⋯ */
  if(!TLF){ var lose=[].slice.call(document.querySelectorAll("#screen7 .bt-ik-baand > *, #briefWrap .brief-titel-over > .bt-blyant, #screen7 .ss-top > .ss-cirk:not(.ss-mere)")).filter(synlig).filter(function(e){ return !e.classList.contains("bt-mere-tlf"); });
    N++; if(lose.length) fejl("IKONRÆKKE: løse ikoner uden for ⋯: "+lose.map(function(e){return e.title||kl(e)}).join(", ")); }
}
function maalForsideTlf(){
  /* TELEFONENS BRIEFOVERSIGT (Ida 4/11): ingen Fortsaet/Start brief, ingen chips i coveret, coveret 228, oplysnings-chips som EN linje under statuslinjen (36 høje, kun visning, ingen +), titlen overlapper aldrig Tilbage */
  if(!TLF) return;
  N++; if(document.querySelector("#briefForside .pf-start-knap, .pf-start-kort")) fejl("FORSIDE tlf: Fortsæt/Start brief står stadig i den røde flise");
  N++; if(document.querySelector(".hc-chip")) fejl("FORSIDE tlf: oplysnings-chips står stadig i coveret");
  var h=document.querySelector("#screen7 .mb-baand"); if(h){ N++; var hh=Math.round(h.getBoundingClientRect().height); if(hh!==228) fejl("FORSIDE tlf: coveret er "+hh+" høj (skal 228)"); }
  var cs=[].slice.call(document.querySelectorAll(".fb-hc-rk .fb-hc")).filter(synlig);
  cs.forEach(function(c){ var r=c.getBoundingClientRect(), s=getComputedStyle(c); er("OPLYSNINGS-CHIP", c, Math.round(r.height)===36&&px(s.fontSize)===13&&s.fontWeight==="400"&&rgb(s.color)===G2&&Math.round(r.top)===Math.round(cs[0].getBoundingClientRect().top), "h"+Math.round(r.height)+" "+s.fontSize+" "+s.color+" (skal 36 · 13/400 · #6F6B66, alle på én linje)"); if(c.querySelector(".plus,svg")) fejl("OPLYSNINGS-CHIP: har plus/ikon"); });
  var ti=document.querySelector("#screen7 .mb-baand .mb-navn"), tb=[].slice.call(document.querySelectorAll("#screen7 .mb-baand button, #screen7 .mb-baand a")).filter(function(e){return /tilbage/i.test(e.innerText||e.getAttribute("aria-label")||"")&&synlig(e)})[0];
  if(ti&&tb){ N++; var a=ti.getBoundingClientRect(), b=tb.getBoundingClientRect(); if(!(a.bottom<=b.top||a.top>=b.bottom||a.right<=b.left||a.left>=b.right)) fejl("FORSIDE tlf: titlen overlapper Tilbage"); }
}
function maalStory(){
  /* STORY-SIDEN (Ida 4/11): [status] [dato] i samme højde 36 og på samme linje, storytype-chips 36 på én linje, ingen pil på nogen flise, upload-placeholderen er lys (aldrig mørk) */
  var st=document.querySelector("#storySerie .ss-top > .ss-stat"), da=document.querySelector("#storySerie .ss-top > .ss-dato");
  if(st&&da){ var a=st.getBoundingClientRect(), b=da.getBoundingClientRect(); er("STORY-RÆKKE", st, Math.round(a.height)===36&&Math.round(b.height)===36&&Math.abs(a.top-b.top)<1&&Math.abs((b.left-a.right)-8)<=1&&a.left<b.left, "status h"+Math.round(a.height)+" dato h"+Math.round(b.height)+" afstand "+Math.round(b.left-a.right)+" (skal 36/36, 8 imellem, status til venstre for dato)"); }
  else fejl("STORY-RÆKKE: status og dato mangler i rækken");
  var cs=[].slice.call(document.querySelectorAll("#storySerie .ss-typrk .ss-chip")).filter(synlig);
  N++; if(cs.length!==2) fejl("STORYTYPE: forventer to valgchips, fandt "+cs.length);
  cs.forEach(function(c){ var r=c.getBoundingClientRect(); er("STORYTYPE-CHIP", c, Math.round(r.height)===36&&Math.abs(r.top-cs[0].getBoundingClientRect().top)<1, "h"+Math.round(r.height)+" (skal 36, én linje)"); });
  var pv=document.querySelector("#storySerie .ss-pv.tom, #storySerie .ss-up"); if(pv){ var s=getComputedStyle(pv); er("STORY-PLACEHOLDER", pv, rgb(s.backgroundColor)==="rgb(255,255,255)"&&s.borderTopStyle==="dashed"&&px(s.borderTopLeftRadius)===14, "flade "+s.backgroundColor+" kant "+s.borderTopStyle+" r"+s.borderTopLeftRadius+" (skal hvid, stiplet, radius 14)"); }
  var pil=document.querySelector(".ss-stknap"); N++; if(pil) fejl("STORY-FLISE: statuspilen (.ss-stknap) står stadig på en flise");
}
async function maalUpload(vent){
  /* UPLOAD-PLADSHOLDEREN (Ida 4/11): »Den færdige video« har coverets egen upload-flise (samme mål), procesringen står i den under upload, og hver fejlårsag har sin egen besked + Prøv igen */
  var fl=document.getElementById("opVideoFl"); if(!fl){ return; }
  var up=fl.querySelector(".cv-upload"), cv=document.querySelector(".pf-cv .cv-upload");
  if(up){ var s=getComputedStyle(up), r=up.getBoundingClientRect(); er("UPLOAD-FLISE", up, rgb(s.backgroundColor)==="rgb(255,255,255)"&&s.borderTopStyle==="dashed"&&px(s.borderTopLeftRadius)===14&&Math.abs(r.width/r.height-9/16)<0.02, "flade "+s.backgroundColor+" kant "+s.borderTopStyle+" r"+s.borderTopLeftRadius+" "+Math.round(r.width)+"x"+Math.round(r.height)+" (skal hvid, stiplet, radius 14, 9:16)");
    if(cv){ var r2=cv.getBoundingClientRect(); N++; if(Math.abs(r2.width-r.width)>1||Math.abs(r2.height-r.height)>1) fejl("UPLOAD-FLISE: videoens flise er "+Math.round(r.width)+"x"+Math.round(r.height)+", coverets "+Math.round(r2.width)+"x"+Math.round(r2.height)); } }
  var gl={sb:sb.storage.from, vid:bsVirksomhedId}; var bar=null;
  try{ bsVirksomhedId=async function(){return "v1";};
    var F=function(){ return new File([new Uint8Array(1024)],"film.mov",{type:"video/quicktime"}); };
    var fors=[["for stor",{message:"The object exceeded the maximum allowed size",statusCode:"413"},/for stor/],["filtype",{message:"mime type not supported",statusCode:"415"},/Filtypen/],["forbindelse",{message:"Failed to fetch"},/Forbindelsen/],["adgang",{message:"row-level security policy",statusCode:"403"},/kan ikke gemmes lige nu/]];
    for(var i=0;i<fors.length;i++){
      sb.storage.from=function(){ return {upload:function(){ return new Promise(function(r){ setTimeout(function(){ r({data:null,error:fors[i][1]}); },400); }); }}; };
      var p=opVideoVaelg({files:[F()],value:""}); await vent(120);
      N++; if(!document.querySelector("#opVideoFl .up-ring")) fejl("UPLOAD: procesringen vises ikke, mens der uploades ("+fors[i][0]+")");
      await p; await vent(80); var tx=(document.getElementById("opVideoFl")||{innerText:""}).innerText;
      N++; if(!fors[i][2].test(tx)||!/Prøv igen/.test(tx)) fejl("UPLOAD-FEJL »"+fors[i][0]+"«: forkert/manglende besked: "+tx.replace(/\s+/g," ").slice(0,80));
    }
  } finally { sb.storage.from=gl.sb; bsVirksomhedId=gl.vid; UP.op={akt:false,pct:null,fejl:""}; try{opVideoRerend();}catch(e){} }
}
async function maalHjem(vent){
  /* HJEM (Ida valgte bud 4B, 4/11): computer = to paneler #F6F4F1 (radius 28, luft 12) med hvide fliser 80 høje, radius 20, ramme 1 px #E3E2DE, ingen skygge, 10 imellem, overskrift→flise 16, panel→overskrift 24, rød datobjælke 44, ingen Dag/Uge; ingen rød flise på hverken computer eller telefon */
  try{ window.__kundeAftaler=[{id:1,titel:"Contentgennemgang",dato:huIso(new Date()),tid:"10:00",tid_slut:"11:00"},{id:2,titel:"Fotografering",dato:huIso(new Date(Date.now()+86400000)),tid:"09:00",tid_slut:"11:00"}]; OPGAVER.push({id:"mko1",titel:"Bestil nye poser",deadline:"2026-10-30",done:false,aktiv:true},{id:"mko2",titel:"Ring til leverandøren",deadline:"2026-11-05",done:false,aktiv:true}); }catch(e){}
  showTab(3); try{ hjemUgeTegn(); }catch(e){} await vent(1500);
  var rod=document.getElementById("hjemUge"); if(!rod){ fejl("HJEM: #hjemUge findes ikke"); return; }
  N++; if([].slice.call(document.querySelectorAll("#screen3 .idag-roed, #hjemUge .hu-naeste .idag-roed")).some(synlig)) fejl("HJEM: den røde flise (Næste skridt / I dag) står stadig");
  N++; if(document.querySelector("#hjemUge .hu-visning")) fejl("HJEM: Dag/Uge-chips står stadig");
  if(TLF){ N++; if(document.querySelector("#screen3 .mb-bjaelke")&&synlig(document.querySelector("#screen3 .mb-bjaelke"))) fejl("HJEM tlf: datobjælken må kun stå på computer"); return; }
  var bj=document.querySelector("#screen3 .mb-bjaelke"); N++; if(!bj) fejl("HJEM: den røde datobjælke mangler"); else { var bs=getComputedStyle(bj), br=bj.getBoundingClientRect(); er("HJEM bjælke", bj, Math.round(br.height)===44&&rgb(bs.backgroundColor)==="rgb(252,36,4)"&&rgb(bs.color)==="rgb(255,255,255)"&&px(bs.fontSize)===13&&bs.fontWeight==="400"&&px(bs.borderTopLeftRadius)===0, "h"+Math.round(br.height)+" "+bs.backgroundColor+" "+bs.fontSize+"/"+bs.fontWeight+" (skal 44 · #FC2404 · hvid 13/400 · lige kanter)"); N++; if(!/^[a-zæøå]{3,4}\.? \d+\. [a-zæøå]+ · Uge \d+$/i.test((bj.innerText||"").trim())) fejl("HJEM bjælke: teksten er »"+(bj.innerText||"").trim()+"« (skal være dato · Uge nr)"); }
  var ps=[].slice.call(rod.querySelectorAll(".hh-panel")); N++; if(ps.length!==2) fejl("HJEM: forventer to paneler, fandt "+ps.length);
  ps.forEach(function(pn,i){ var s=getComputedStyle(pn); er("HJEM panel", pn, rgb(s.backgroundColor)==="rgb(246,244,241)"&&px(s.borderTopLeftRadius)===28&&px(s.paddingTop)===12&&px(s.paddingLeft)===12, s.backgroundColor+" r"+s.borderTopLeftRadius+" luft "+s.padding+" (skal #F6F4F1 · 28 · 12)");
    var fl=[].slice.call(pn.children); fl.forEach(function(f,k){ var fs=getComputedStyle(f), fr=f.getBoundingClientRect(); er("HJEM flise i panel", f, Math.round(fr.height)===80&&px(fs.borderTopLeftRadius)===20&&px(fs.borderTopWidth)===1&&rgb(fs.borderTopColor)==="rgb(227,226,222)"&&fs.boxShadow==="none", "h"+Math.round(fr.height)+" r"+fs.borderTopLeftRadius+" kant "+fs.borderTopWidth+" "+fs.borderTopColor+" skygge "+(fs.boxShadow==="none"?"nej":"JA")+" (skal 80 · 20 · 1 px #E3E2DE · ingen skygge)"); if(k>0){ var g=Math.round(fr.top-fl[k-1].getBoundingClientRect().bottom); er("HJEM flise-afstand", f, Math.abs(g-10)<=1, "afstand "+g+" (skal 10)"); } });
    var sek=pn.previousElementSibling; if(sek){ var d=Math.round(pn.getBoundingClientRect().top-sek.getBoundingClientRect().bottom); er("HJEM overskrift→panel", pn, Math.abs(d-16)<=1, "afstand "+d+" (skal 16)"); }
    var nx=pn.nextElementSibling; if(nx&&nx.classList.contains("hu-sek")){ var d2=Math.round(nx.getBoundingClientRect().top-pn.getBoundingClientRect().bottom); er("HJEM panel→næste overskrift", nx, Math.abs(d2-24)<=1, "afstand "+d2+" (skal 24)"); } });
  var sb0=rod.querySelector(".hpt-h > .hu-sek"), st=rod.querySelector(".hu-strib-rk .hu-strib"); if(sb0&&st){ N++; var dd=Math.abs(sb0.getBoundingClientRect().top-st.getBoundingClientRect().top); if(dd>1) fejl("HJEM: højre kolonnes første overskrift flugter ikke med datofliserne ("+Math.round(dd)+" px forskel)"); }
  var pl=[].slice.call(rod.querySelectorAll(".hu-strib-rk > .hu-pil")); N++; if(pl.length!==2||pl.some(function(b){var r=b.getBoundingClientRect();return Math.round(r.width)!==32||Math.round(r.height)!==32})) fejl("HJEM: pilene skal være to runde 32 px knapper ved datofliserne");
}
function maalHero(){
  if(TLF) return; var mn=document.querySelector("#screen7 .mb-baand .mb-navn"); if(!mn) return;
  [mn, mn.querySelector(".mb-titel-ord")].forEach(function(e){ if(!e) return; N++; var c=getComputedStyle(e).cursor; if(c!=="default"&&c!=="auto") fejl("HERO-MUS: musen over heroens titel er »"+c+"« (skal pilen)"); });
}
var VAGT=setTimeout(function(){ console.log("SELE MAAL FEJL: proben nåede ikke i mål på 80 s — sidste trin: "+TRIN); },80000);
setTimeout(async function(){ try {
  var vent=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
  for(var v=0;v<40&&!document.body.classList.contains("app-klar");v++) await vent(150);
  ["appLoader","turOverlay","dagensKort","nyVersion"].forEach(function(id){var e=document.getElementById(id); if(e) e.remove();});
  try{ dagensKortLuk(); }catch(e){}
  try{ STRATEGI_TEMAER.push({navn:"Menneskene bag", formaal:"kunderne skal lære os at kende", foelelse:"Dem kan jeg lide", eksempler:[]}); }catch(e){}
  var H1="Vi er aldrig enige om farver — og det er derfor, butikken virker";
  IDEER.push({id:"mk1",titel:"To om ét indkøb",soejle:"Menneskene bag",type:"Reel",status:"Brief i gang",dato:"2026-11-10",brief:{format:"Reel",platform:["Instagram"],beskrivelse:"Vi viser, hvordan vi to vælger forskelligt.",maal:"Flere kommentarer",hookTekst:H1,hookTekstListe:[H1,"Min kollega vælger altid det modsatte af mig"],hookTekstValgt:0,thumb:"To mennesker.",thumbListe:["To mennesker."],thumbValgt:0,klip:[{ser:"Vi står med hver vores favorit",tekst:H1,siger:"Vi er aldrig enige"},{ser:"Klip mellem de to valg",tekst:"Hvem har ret?",siger:"Hvem har ret?"},{ser:"Vi griner",tekst:"Skriv i kommentarerne",siger:"Hvad ville du vælge?"}],ctaVideo:"Skriv i kommentarerne",caption:"Vi køber ind sammen — og vi er sjældent enige.\n\nHvem er du mest enig med?",ctaCaption:"Kommentér opslaget",cta:"Kommentér opslaget",hashtags:"#menneskenebag #butiksliv",linkIndhold:"https://drive.google.com/x"}});
  /* DÆKFLADEN VED SIDESKIFT (Ida 4/11: »jeg vil ikke se den gamle side, hop eller ændringer efter et klik«): fra kalenderen ind i briefen — så længe sideskiftet holdes, må det, fingeren rammer midt i indholdsfladen, være dækfladen; aldrig den gamle side */
  TRIN="dækflade"; showTab(8); await vent(900);
  var uden=[], prøver=0, holdt=false;
  var pt=function(){ var ref=document.querySelector(".content"); var r=ref?ref.getBoundingClientRect():{left:0,width:innerWidth}; return [Math.round(r.left+r.width/2), Math.round(innerHeight/2)]; };
  var tikker=true; (function frame(){ if(!tikker) return; if(document.body.classList.contains("sk-holder")){ holdt=true; prøver++; var p=pt(), el=document.elementFromPoint(p[0],p[1]); if(!el||!el.closest("#skDaek")) uden.push((el&&kl(el))||"intet"); } requestAnimationFrame(frame); })();
  openBriefSide("mk1"); await vent(2600); tikker=false;
  N++; if(holdt&&uden.length) fejl("DÆKFLADE: den gamle side var synlig under sideskiftet ("+uden.length+" af "+prøver+" billeder, fx "+uden[0]+")");
  N++; if(document.getElementById("skDaek")&&getComputedStyle(document.getElementById("skDaek")).display!=="none") fejl("DÆKFLADE: dækfladen står stadig, efter briefen er klar");
  try{ document.querySelectorAll("#turOverlay,.tur-slor,#turKort,#nyVersion,#dagensKort").forEach(function(e){e.remove()}); }catch(e){}
  if(!document.body.classList.contains("mb")){ console.log("SELE MAAL FEJL: body.mb er ikke aktiv paa "+innerWidth); return; }
  TRIN="forside"; await vent(400); maalSide(); maalHero(); maalForsideTlf(); TRIN="upload"; try{ await maalUpload(vent); }catch(e){ fejl("upload-trin: "+(e&&e.message)); } TRIN="forside";
  for(var side=0; side<4; side++){ BRIEF_SIDE_AKTIV=side; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); await vent(250); TRIN="side"+side; document.querySelectorAll("#briefWrap textarea").forEach(function(x){x.classList.add("mb-felt")}); maalSide(); maalHero(); }
  TRIN="hjem"; try{ await maalHjem(vent); }catch(e){ fejl("hjem-trin: "+(e&&e.message)); }
  TRIN="story"; try{ IDEER.push({id:"mk2",titel:"Story uden type",soejle:"Story",type:"Story",status:"Planlagt",dato:"2026-11-12",brief:{format:"Story",storyserie:[{t:"",q:"",s:["",""],m:""}]}}); openBriefSide("mk2"); await vent(1500); maalStory(); showTab(8); await vent(900); maalStory.kalender&&0; N++; if(document.querySelector(".ss-stknap")) fejl("kalender: story-flisen har stadig statuspil"); }catch(e){ fejl("story-trin: "+(e&&e.message)); }
  clearTimeout(VAGT);
  if(FUND.length){ FUND.forEach(function(f){ console.log("SELE MAAL FEJL: "+f); }); console.log("SELE MAAL IKKE OK: "+FUND.length+" afvigelser af "+N+" målinger paa "+innerWidth); }
  else console.log("SELE MAAL OK: "+N+" målinger paa "+innerWidth+", 0 afvigelser");
} catch(e){ console.log("SELE MAAL FEJL probe: "+(e&&e.message)+" — "+TRIN+" — "+String(e&&e.stack||"").split("\n").slice(0,3).join(" | ")); }
}, 2500);
