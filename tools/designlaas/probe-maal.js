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
  TRIN="forside"; await vent(400); maalSide(); maalHero();
  for(var side=0; side<4; side++){ BRIEF_SIDE_AKTIV=side; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); await vent(250); TRIN="side"+side; document.querySelectorAll("#briefWrap textarea").forEach(function(x){x.classList.add("mb-felt")}); maalSide(); maalHero(); }
  clearTimeout(VAGT);
  if(FUND.length){ FUND.forEach(function(f){ console.log("SELE MAAL FEJL: "+f); }); console.log("SELE MAAL IKKE OK: "+FUND.length+" afvigelser af "+N+" målinger paa "+innerWidth); }
  else console.log("SELE MAAL OK: "+N+" målinger paa "+innerWidth+", 0 afvigelser");
} catch(e){ console.log("SELE MAAL FEJL probe: "+(e&&e.message)+" — "+TRIN+" — "+String(e&&e.stack||"").split("\n").slice(0,3).join(" | ")); }
}, 2500);
