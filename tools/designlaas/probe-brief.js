/* ENS-PORTEN FOR BRIEFEN (17/9, Idas ord: »inden der bygges noget, kontrolleres systemet for, hvordan de andre funktioner omkring ser ud«).
   Aabner briefen paa computeren (1440) med en udfyldt testbrief, gaar forsiden og ALLE skrivetrin igennem og maaler, at ens ting ER ens:
   piller · chips · versaler · fliser · felter · streger — og at der ingen rosa er. Een afvigelse = FEJL, og deployen stopper (koer.sh). */
function px(v){ return Math.round(parseFloat(v)||0); }
function h2(v){ return Math.round(v/2)*2; }   /* hoejder maales i hele 2 px — skrifttyper afrunder forskelligt paa Mac og Linux (MAALT 17/9: 74 mod 75) */
function rgb(c){ return (c||"").replace(/\s/g,""); }
function synlig(e){ var r=e.getBoundingClientRect(); if(r.width<2||r.height<2) return false; var cs=getComputedStyle(e); return cs.display!=="none"&&cs.visibility!=="hidden"&&cs.opacity!=="0"; }
function txt(e){ return (e.innerText||e.getAttribute("aria-label")||e.getAttribute("title")||"").replace(/\s+/g," ").trim().slice(0,30); }
function rosa(c){ var m=/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/.exec(rgb(c)); if(m&&+m[1]===252&&+m[2]===36&&+m[3]===4&&+m[4]>0.03&&+m[4]<0.3) return true; return /#(FDE8E3|FEF3F0|F7C4BA|FFF1EE|FFF3F0)/i.test(c)||/rgb\((253,232,227|254,243,240|247,196,186|255,241,238|255,243,240)\)/.test(rgb(c)); }
var FUND=[], GRUPPER={};
function laeg(gruppe, noegle, e, trin){ (GRUPPER[gruppe]=GRUPPER[gruppe]||{}); var g=GRUPPER[gruppe]; (g[noegle]=g[noegle]||[]).push(trin+" · "+txt(e)+" ["+(e.className&&e.className.toString().split(" ").slice(0,2).join("."))+"]"); }
function maal(trin){
  var rod=document.getElementById("briefGrid")||document.body;
  rod.querySelectorAll("*").forEach(function(e){
    if(!synlig(e)) return; if(e.closest("#briefRail .fb-ud")) return;
    var cs=getComputedStyle(e), tag=e.tagName, cl=(e.className&&e.className.toString())||"", r=e.getBoundingClientRect();
    if(rosa(cs.backgroundColor)||rosa(cs.borderTopColor)) FUND.push("ROSA "+trin+" · "+txt(e)+" ["+cl.split(" ")[0]+"] "+cs.backgroundColor);
    /* DEN GRAA KNAP (LAAST 18/9 kl. 11.10): en knap med ord er roed (fyldt) eller graa — aldrig hvid m. roed ramme eller roed tekst. Valgt-tilstande (.on) og runde ikon-knapper er undtaget. */
    if((tag==="BUTTON"||/\b(bf-plads|bs-langknap|cm-chip|chip-knap|dbtn|row-btn|ark-luk|ark-knap)\b/.test(cl))&&(e.innerText||"").trim()&&!/\bon\b/.test(cl)&&!e.closest(".on,.cf-dato,.pf-godk,.pf-kort,.sendfelt,.hs-send,#briefSpmSkriv")&&Math.abs(px(r.width)-px(r.height))>8&&r.height>=20){
      var hvid=/rgb\(255, ?255, ?255\)/.test(cs.backgroundColor), roedKant=/rgb\(252, ?36, ?4\)/.test(cs.borderTopColor)&&parseFloat(cs.borderTopWidth)>0, roedTekst=/rgb\(252, ?36, ?4\)/.test(cs.color);
      if(hvid&&(roedKant||roedTekst)) FUND.push("ROED RAMME/TEKST I HVID KNAP "+trin+" · "+txt(e)+" ["+cl.split(" ")[0]+"]");
    }
    var rad=px(cs.borderTopLeftRadius), h=px(r.height);
    /* RUNDT ER RUNDT (HAARD, Ida 18/9 kl. 13.37: »det maa ALDRIG deployes uden at alle stoerrelser og formater er tjekket«): en cirkel (radius >= halv side, under 60 px,
       uden ord eller med hoejst to tegn) skal have samme bredde og hoejde. 28 x 44 er en oval — det var hook-cirklen paa telefonen. */
    if(rad>=Math.min(px(r.width),h)/2-1&&px(r.width)<60&&h<60&&px(r.width)>=12&&h>=12&&(tag==="BUTTON"||tag==="SPAN"||tag==="I"||tag==="DIV")){
      var ordL=(e.innerText||"").trim().length, usynligFlade=/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)&&(cs.borderTopStyle==="none"||parseFloat(cs.borderTopWidth)===0);
      /* en chip med ord er en pille (bredere end hoej) — kun hoejere end bred er en strakt cirkel; en usynlig flade (rent tegn uden kant/baggrund) har ingen form at maale */
      if(!usynligFlade&&(ordL===0?Math.abs(px(r.width)-h)>1.5:(ordL<=2&&h-px(r.width)>1.5))) FUND.push("OVAL "+trin+" · "+tag+"["+cl.split(" ")[0]+"] "+px(r.width)+"x"+h+" — en cirkel skal vaere rund");
    }
    if(tag==="BUTTON"&&!/\b(bdrop-knap|pf-ik|bt-blyant|kort-plus|fs-cirkel|fs-slet|fs-fjern|ko-plus|klip-flyt|klip-slet|bdrop-rk|chip-btn|ark-luk|ark-send|ark-rund|tale-knap|bsam-ret-link|klip-knap|bs-flyt-luk|fb-rk)\b/.test(cl)&&!e.closest(".bdrop-kort,.fb-rk,.ark,#bsFlytMenu,.sk-input")&&(e.innerText||"").trim()){   /* kun knapper med ORD — ikon-knapper (skraldespand, mikrofon, flueben) har hver sin laaste form */
      if(Math.abs(px(r.width)-h)<=8) return;   /* runde ikon-knapper (flueben, mikrofon, skraldespand, Del/Slet) har hver sin laaste stoerrelse og maales ikke som chips */
      if(rad>=99||rad>=h/2-1){ if(h>=40) laeg("pille","h"+h2(h)+" fs"+Math.round(parseFloat(cs.fontSize))+" rad999 bd"+px(cs.borderTopWidth),e,trin); else laeg("chip","h"+h2(h)+" fs"+Math.round(parseFloat(cs.fontSize))+" bd"+px(cs.borderTopWidth),e,trin); }
      else laeg("knap-uden-pille","rad"+rad+" h"+h,e,trin);
    }
    if(cs.textTransform==="uppercase"&&parseFloat(cs.fontSize)<=12.5&&tag!=="BUTTON"&&e.children.length<=2&&txt(e)&&!e.closest("button,.brief-raketkort,.brief-dbog-hoved,.bss-top,.pf-kort")&&!/mangler/i.test(txt(e))) laeg("versal","fs"+Math.round(parseFloat(cs.fontSize)*10)/10+" ls"+Math.round(parseFloat(cs.letterSpacing)*10)/10+" col"+rgb(cs.color),e,trin);
    if(/(^|\s)(sk-q|pf-flise|pf-kf|fb-boks|brief-dbog-flise|klip-kort)(\s|$)/.test(cl)&&!/\bpf-kort\b/.test(cl)&&r.width>300&&!e.parentElement.closest(".sk-q:not(:has(#briefKlipHolder))")&&!e.querySelector("#briefKlipHolder, #briefKlip1")) laeg("flise","rad"+rad+" bd"+px(cs.borderTopWidth)+" sk"+(cs.boxShadow==="none"?"0":"1")+" bg"+rgb(cs.backgroundColor),e,trin);
    if(tag==="TEXTAREA"&&synlig(e)&&!/display:\s*none/.test(e.getAttribute("style")||"")&&!e.classList.contains("sendfelt-felt")&&!e.closest(".kk-laast")) laeg("felt","rad"+rad+" bd"+px(cs.borderTopWidth)+"/"+rgb(cs.borderTopColor)+" fs"+Math.round(parseFloat(cs.fontSize)),e,trin);
    if(/\b(brief-raketkort|brief-dbog-hoved)\b/.test(cl)&&!/\bbrief-ide-hoved-titel\b/.test(cl)) laeg("bjaelke","rad"+rad+" h"+h2(h)+" bg"+rgb(cs.backgroundColor),e,trin);   /* Kort fortalt-flisen vokser med teksten (22/9) og er ikke en bjaelke */
  });
}
var SIDSTE="start";   /* vagten (18/9): naar proben aldrig naar i maal, skal loggen sige HVOR den stod — ikke bare »ingen maaling« */
setTimeout(function(){ console.log("SELE BRIEF FEJL: proben naaede ikke i maal paa 70 s — sidste trin: "+SIDSTE); },70000);
setTimeout(async function(){ try {
  var vent=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
  for(var v=0;v<40&&!document.body.classList.contains("app-klar");v++) await vent(150);
  ["appLoader","turOverlay","dagensKort","nyVersion"].forEach(function(id){var e=document.getElementById(id); if(e) e.remove();});
  try{ dagensKortLuk(); }catch(e){}
  try{ STRATEGI_TEMAER.push({navn:"Menneskene bag", formaal:"kunderne skal lære os at kende", foelelse:"Dem kan jeg lide", eksempler:[]}); }catch(e){}
  var H1="Vi er aldrig enige om farver — og det er derfor, butikken virker";
  IDEER.push({id:"ens1",titel:"To om ét indkøb",soejle:"Menneskene bag",type:"Reel",status:"Brief i gang",dato:"2026-09-17",brief:{format:"Reel",platform:["Instagram"],beskrivelse:"Vi viser, hvordan vi to vælger forskelligt.",maal:"Flere kommentarer",hookTekst:H1,hookTekstListe:[H1,"Min kollega vælger altid det modsatte af mig"],hookTekstValgt:0,thumb:"To mennesker.",thumbListe:["To mennesker."],thumbValgt:0,klip:[{ser:"Vi står med hver vores favorit",tekst:H1},{ser:"Klip mellem de to valg",tekst:"Hvem har ret?"}],ctaVideo:"Skriv i kommentarerne",caption:"Vi køber ind sammen — og vi er sjældent enige.\n\nDen ene går efter det rolige. Hvem er du mest enig med?",ctaCaption:"Kommentér opslaget",cta:"Kommentér opslaget",hashtags:"#menneskenebag #butiksliv",linkIndhold:"https://drive.google.com/x"}});
  SIDSTE="app-klar "+document.body.classList.contains("app-klar")+" · openBriefSide";
  openBriefSide("ens1"); await vent(1500); SIDSTE="brief aabnet, mb="+document.body.classList.contains("mb");
  try{ document.querySelectorAll("#turOverlay,.tur-slor,#turKort,#nyVersion,#dagensKort").forEach(function(e){e.remove()}); }catch(e){}
  if(!document.body.classList.contains("mb")){ console.log("SELE BRIEF FEJL: computeren (body.mb) er ikke aktiv paa "+innerWidth); return; }
  maal("forside"); SIDSTE="forside maalt";
  for(var side=0; side<4; side++){ BRIEF_SIDE_AKTIV=side; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); await vent(150); var n=(BRIEF_TRIN_INFO||{n:1}).n; for(var t=0;t<n;t++){ BRIEF_TRIN_AKTIV=t; briefMbVis("skriv"); await vent(120); document.querySelectorAll("#briefWrap textarea").forEach(function(x){x.classList.add("mb-felt")}); maal("side"+side+"/"+t); SIDSTE="side"+side+"/"+t+" maalt"; } }
  SIDSTE="alle sider maalt";
  /* SYNK-PORTEN (Ida 18/9 kl. 12.31: »den synkroniserer ikke automatisk naar jeg til/fravaelger eller aendrer i hooket??«): resultatet maales, ikke mekanikken —
     vaelg et andet hook paa Fang dem → forsiden viser det · fravaelg → forsiden siger »Mangler« (Ida 18/9 kl. 15.10), og klip 1 baerer ikke det gamle · ret ordlyden → forsiden foelger. */
  try {
    /* FORSIDEN ER EN PRODUKTIONSSEDDEL (22/9): feltet er afloest af linjen »ordet: vaerdien« — .pf-felt/.pf-ph findes ikke mere paa forsiden */
    var hookPaaForsiden=function(){ var f=document.querySelector("#briefForside .pf-kf .pf-v"); return f?(f.innerText||"").replace(/\s+/g," ").trim():"(ingen hook-flise)"; };
    BRIEF_SIDE_AKTIV=1; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); await vent(150);
    /* INDHOLDSOPBYGNING ER UDE AF BRIEFOVERSIGTEN (Ida 25/9): porten fejler, hvis den kommer igen */
    briefForslagVaelg("hookTekst",1); await vent(150); briefMbVis("forside"); await vent(200);
    if(document.querySelector("#briefForside .pf-samling")) FUND.push("BRIEFOVERSIGTEN: Indholdsopbygning er tilbage paa forsiden (ude 25/9)");
    if(document.querySelector("#briefForside .pf-kf")){ var h1=hookPaaForsiden(); if(h1.indexOf("Min kollega vælger altid det modsatte af mig")<0) FUND.push("SYNK: forsiden viser ikke det valgte hook — staar: "+h1.slice(0,60)); }   /* hooket staar ikke paa briefoversigten efter 25/9 (Indholdsopbygning er ude) — kun maalt, hvis flisen findes */
    BRIEF_SIDE_AKTIV=1; briefMbVis("skriv"); await vent(150); briefForslagVaelg("hookTekst",1); await vent(150); briefMbVis("forside"); await vent(200);
    if(document.querySelector("#briefForside .pf-kf")){ var h0=hookPaaForsiden(); var hPh=document.querySelector("#briefForside .pf-kf .pf-mangler"); if(h0.indexOf("Mangler")<0 && !hPh) FUND.push("SYNK: hooket er fravalgt, men forsiden viser stadig: "+h0.slice(0,60)); }   /* hooket staar ikke paa briefoversigten efter 25/9 (Indholdsopbygning er ude) — kun maalt, hvis flisen findes */
    if(document.querySelector("#briefForside .pf-kf")){ var k1=document.querySelectorAll("#briefForside .pf-kf")[1]; var k1t=k1?(k1.innerText||""):""; if(/modsatte af mig|farver — og det er derfor/.test(k1t)) FUND.push("SYNK: klip 1 baerer det fravalgte hook paa forsiden"); }   /* hooket staar ikke paa briefoversigten efter 25/9 (Indholdsopbygning er ude) — kun maalt, hvis flisen findes */
    BRIEF_SIDE_AKTIV=1; briefMbVis("skriv"); await vent(150); var f0=document.getElementById("bf_hookTekst_f0"); if(f0){ f0.value="Nyt hook skrevet i selen"; briefForslagLaes("hookTekst"); briefForslagVaelg("hookTekst",0); await vent(150); briefMbVis("forside"); await vent(200); var h2=hookPaaForsiden(); if(document.querySelector("#briefForside .pf-kf") && h2.indexOf("Nyt hook skrevet i selen")<0) FUND.push("SYNK: hooket blev rettet, men forsiden viser: "+h2.slice(0,60)); }
    SIDSTE="synk maalt";
    /* FORSIDEN PAA ANDRE BRIEF-FORMER (18/9 kl. 14.10: en brief UDEN caption vaeltede forsiden — »tom is not defined« — og den raa brief stod synlig):
       tre briefs, som kunderne faktisk har — uden caption · gammel indhold-streng · karrusel uden billed-liste — SKAL tegne forsiden. */
    var FORMER=[{id:"pf1",titel:"Uden caption",soejle:"Produkt",type:"Reel",status:"Idé",dato:null,brief:{format:"Reel",hookTekst:"H",hookTekstListe:["H"],hookTekstValgt:0,klip:[{ser:"Et klip"}],ctaVideo:"Gem opslaget"}},
      {id:"pf2",titel:"Gammel streng",soejle:"Produkt",type:"Reel",status:"Idé",dato:null,brief:{format:"Reel",indhold:"Gammel beskrivelse"}},
      {id:"pf3",titel:"Karrusel uden billeder",soejle:"Produkt",type:"Karrusel",status:"Idé",dato:null,brief:{format:"Karrusel",slides:["a","b"],hookTekst:"a",hookTekstListe:["a"],hookTekstValgt:0}}];
    for(var fi=0;fi<FORMER.length;fi++){ IDEER.push(FORMER[fi]); openBriefSide(FORMER[fi].id); await vent(700); var fsx=document.getElementById("briefForside"); var okx=fsx&&fsx.style.display!=="none"&&(fsx.innerText||"").length>20; if(!okx) FUND.push("FORSIDEN TEGNES IKKE paa briefen »"+FORMER[fi].titel+"« — den raa brief staar synlig"); if(okx&&/\bfalse\b/.test(fsx.innerText||"")) FUND.push("FORSIDEN viser ordet »false« paa »"+FORMER[fi].titel+"«"); }
    SIDSTE="brief-former maalt";
    /* VEJEN TILBAGE FRA EN SKRIVESIDE ER OEJET VED TITLEN (v2089; Ida 18/9 kl. 14.50 fjernede en uoensket pille): oejet skal vaere synligt paa skrivesiderne, og ingen »Tilbage til forsiden«-pille */
    try { BRIEF_SIDE_AKTIV=1; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); await vent(200);
      var oeje=document.querySelector(".bt-oeje"); if(!oeje||!synlig(oeje)) FUND.push("OEJET (Briefoversigten) mangler paa skrivesiden (i baandet 18/9, i titelraekken over den roede flise fra 22/9)");
      var pille=[].find.call(document.querySelectorAll("#briefWrap button"),function(b){return /tilbage til forsiden/i.test(b.innerText||"")&&synlig(b)}); if(pille) FUND.push("PILLE »Tilbage til forsiden« staar paa skrivesiden — den er fjernet (Ida 18/9 kl. 14.50)"); } catch(e){ FUND.push("OEJE-proben fejlede: "+(e&&e.message)); }
    SIDSTE="oeje maalt";
  } catch(e){ FUND.push("SYNK-proben fejlede: "+(e&&e.message)); }
  Object.keys(GRUPPER).forEach(function(g){ var keys=Object.keys(GRUPPER[g]); if(keys.length>1){ keys.sort(function(a,b){return GRUPPER[g][b].length-GRUPPER[g][a].length}); FUND.push("UENS "+g+": "+keys.map(function(k){return k+" ×"+GRUPPER[g][k].length+" (fx "+GRUPPER[g][k][0]+")"}).join(" || ")); } });
  if(FUND.length){ FUND.forEach(function(f){ console.log("SELE BRIEF FEJL: "+f); }); console.log("SELE BRIEF IKKE OK: "+FUND.length+" fund"); }
  else { var tal=Object.keys(GRUPPER).map(function(g){ var k=Object.keys(GRUPPER[g])[0]; return g+" "+GRUPPER[g][k].length+" ("+k+")"; }).join(" · "); var ialt=Object.keys(GRUPPER).reduce(function(a,g){ return a+Object.keys(GRUPPER[g]).reduce(function(b,k){return b+GRUPPER[g][k].length},0); },0); if(ialt<40) console.log("SELE BRIEF FEJL: kun "+ialt+" elementer maalt — briefen blev ikke tegnet"); else console.log("SELE BRIEF OK: "+ialt+" elementer ens paa forsiden og alle skrivetrin, ingen rosa — "+tal); }
} catch(e){ console.log("SELE BRIEF FEJL probe: "+(e&&e.message)+" — sidste trin: "+SIDSTE+" — "+String(e&&e.stack||"").split("\n").slice(0,3).join(" | ")); }
}, 2500);
