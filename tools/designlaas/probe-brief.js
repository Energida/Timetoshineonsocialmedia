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
    if(tag==="BUTTON"&&!/\b(b3-tf|bp2-trin|bs3-drop|bdrop-knap|pf-ik|bt-blyant|kort-plus|fs-cirkel|fs-slet|fs-fjern|ko-plus|klip-flyt|klip-slet|bdrop-rk|chip-btn|ark-luk|ark-send|ark-rund|tale-knap|bsam-ret-link|kk-hook-andre|klip-knap|bs-flyt-luk|fb-rk|bp-trin)\b/.test(cl)&&!e.closest(".bdrop-kort,.fb-rk,.ark,#bsFlytMenu,.sk-input")&&(e.innerText||"").trim()){   /* kun knapper med ORD — ikon-knapper (skraldespand, mikrofon, flueben) har hver sin laaste form */
      if(Math.abs(px(r.width)-h)<=8) return;   /* runde ikon-knapper (flueben, mikrofon, skraldespand, Del/Slet) har hver sin laaste stoerrelse og maales ikke som chips */
      if(rad>=99||rad>=h/2-1){ if(e.closest("#briefSideNav")) laeg("navknap","h"+h2(h)+" fs"+Math.round(parseFloat(cs.fontSize))+" rad999",e,trin);   /* navigationsknapper = 56, deres egen form (låst 12/11) */ else if(h>=44) laeg("pille","h"+h2(h)+" fs"+Math.round(parseFloat(cs.fontSize))+" rad999 bd"+px(cs.borderTopWidth),e,trin); else laeg("chip","h"+h2(h)+" fs"+Math.round(parseFloat(cs.fontSize))+" bd"+px(cs.borderTopWidth),e,trin); }
      else laeg("knap-uden-pille","rad"+rad+" h"+h,e,trin);
    }
    if(cs.textTransform==="uppercase"&&parseFloat(cs.fontSize)<=12.5&&tag!=="BUTTON"&&e.children.length<=2&&txt(e)&&!e.closest("button,.brief-raketkort,.brief-dbog-hoved,.bss-top,.pf-kort")&&!/mangler/i.test(txt(e))) laeg("versal","fs"+Math.round(parseFloat(cs.fontSize)*10)/10+" ls"+Math.round(parseFloat(cs.letterSpacing)*10)/10+" col"+rgb(cs.color),e,trin);
    var faktaSide=document.body.getAttribute("data-bfakta")==="ja"&&document.body.hasAttribute("data-bto")&&!document.body.hasAttribute("data-bforside");   /* Fakta-siden: hvert felt er sin egen flise (Ida 12/11) — boksen er kun beholder */
    if(faktaSide&&/(^|\s)fb-rk(\s|$)/.test(cl)&&e.closest("#briefRail")) laeg("flise","rad"+rad+" bd"+px(cs.borderTopWidth)+" sk"+(cs.boxShadow==="none"?"0":"1")+" bg"+rgb(cs.backgroundColor),e,trin);
    /* DEN NYE BRIEFS FLISER (DESIGNLÅS 18/11 + 19/11). To ting måles anderledes end før — alt andet er uændret:
       1) DEN SAMLEDE FLISE (19/11: »captionens fire spørgsmål står i ÉN flise under »Caption« (som Idéen i tegningen)«): delene (.b3-idq / .b3-cap) tælles som ÉN flise, målt på hele flisen
          (hjørner øverst på første del og nederst på sidste · hvid · ramme · skygge · delene står helt sammen). Den skal være ens med briefens andre fliser; er den i stykker, står den som sin egen afvigelse.
       2) FELTET ER SELV FLISEN (HÅRD 19/11 »Aldrig flise i flise«; »Hashtagfeltet er selv flisen (ingen ydre flise)«): beholderen om »CTA i videoen«, »Tekst på coverbilledet« og hashtagfeltet er ingen flise.
          Har den alligevel flade, kant eller skygge, tælles den med som flise — og falder som uens. */
    if(!(faktaSide&&/(^|\s)fb-boks(\s|$)/.test(cl))&&/(^|\s)(sk-q|pf-flise|pf-kf|fb-boks|brief-dbog-flise|klip-kort)(\s|$)/.test(cl)&&!/\bpf-kort\b/.test(cl)&&r.width>300&&!e.parentElement.closest(".sk-q:not(:has(#briefKlipHolder))")&&!(e.parentElement&&e.parentElement.classList.contains("kk-laast"))   /* den laaste scene 1 er sand med vilje (Ida 7/11) */&&!e.querySelector("#briefKlipHolder, #briefKlip1")){
      var b3Seg=e.matches(".b3-idq, .b3-cap"), b3Felt=e.matches(".klip-kort.kk-cta, .sk-q[data-par=cover], .cap-q.b3-htg");
      if(b3Seg){ var gs=[].slice.call(e.matches(".b3-cap")?e.parentElement.querySelectorAll(":scope > .cap-q.b3-cap"):e.closest(".basis-kort").querySelectorAll(".sk-q.b3-idq")).filter(synlig);
        if(gs[0]===e){ var cN=getComputedStyle(gs[gs.length-1]); var hel=gs.every(function(g,i){ var c=getComputedStyle(g); return px(c.borderLeftWidth)===1&&px(c.borderRightWidth)===1&&(i===0||Math.abs(g.getBoundingClientRect().top-gs[i-1].getBoundingClientRect().bottom)<=0.5)&&(i===0?px(c.borderTopWidth)===1:(px(c.borderTopLeftRadius)===0&&px(c.borderTopWidth)===0))&&(i===gs.length-1?px(c.borderBottomWidth)===1:(px(c.borderBottomLeftRadius)===0&&px(c.borderBottomWidth)===0))&&c.boxShadow!=="none"&&rgb(c.backgroundColor)===rgb(cs.backgroundColor); });
          laeg("flise", hel?("rad"+Math.min(rad,px(cN.borderBottomLeftRadius))+" bd"+px(cs.borderTopWidth)+" sk1 bg"+rgb(cs.backgroundColor)):("samlet flise i stykker ("+gs.length+" dele)"), e, trin); } }
      else if(b3Felt&&/rgba\(0,0,0,0\)|transparent/.test(rgb(cs.backgroundColor))&&px(cs.borderTopWidth)===0&&cs.boxShadow==="none"){ /* ingen flise: feltet er selv flisen */ }
      else laeg("flise","rad"+rad+" bd"+px(cs.borderTopWidth)+" sk"+(cs.boxShadow==="none"?"0":"1")+" bg"+rgb(cs.backgroundColor),e,trin);
    }
    if(tag==="TEXTAREA"&&synlig(e)&&rgb(cs.backgroundColor)!=="rgb(248,248,248)"&&rgb(cs.backgroundColor)!=="rgb(245,245,245)"/* et forslag, der ikke er valgt, er gråt uden kant (markeringsfarver 1+7, LÅST 14/11) — ikke et felt */&&!/display:\s*none/.test(e.getAttribute("style")||"")&&!e.classList.contains("sendfelt-felt")&&!e.closest(".kk-laast")) laeg("felt","rad"+rad+" bd"+px(cs.borderTopWidth)+"/"+rgb(cs.borderTopColor)+" fs"+Math.round(parseFloat(cs.fontSize)),e,trin);
    if(/\b(brief-raketkort|brief-dbog-hoved)\b/.test(cl)&&!/\bbrief-ide-hoved-titel\b/.test(cl)) laeg("bjaelke","rad"+rad+" h"+h2(h)+" bg"+rgb(cs.backgroundColor),e,trin);   /* Kort fortalt-flisen vokser med teksten (22/9) og er ikke en bjaelke */
  });
}
/* BRIEFENS TRIN PÅ COMPUTEREN (LÅST 18/11 »BRIEFENS TRIN: COMPUTER = FIRE FLISER (OVERBLIKKET BREDEST, RAKETTEN OVER NAVNET)«: »Porten skal måle højde, bredde og rød markering, når det bygges«).
   Før talte trin-fliserne med som »knap uden pille« og skulle være helt ens; låsen siger: »alle fire fliser har samme højde, 76. Hjørner 16 (Overblikket 20 på computer), 8 imellem« ·
   »Overblikket er den brede flise (ca. 1,25 gange …; kun navnet, intet symbol, større skrift: 19 på computer« · »De tre andre har rakettens symbol OVER navnet (… 20 px på computer …), navnet under (14 på computer …; mindst 10 luft til flisens kant)« ·
   »Raketten peger skråt op mod højre hjørne« · »Den røde flise viser, hvor man er (#FC2404, hvid tekst og hvidt symbol). De andre er hvide med kant #DEDEDE og blød skygge; Overblikkets tekst er sort, de tre andres grå #686868« ·
   »Ingen »Trin N af 4«, ingen streger, ingen overskrift over rækken, ordet »Succesraketten« står ikke«. */
function maalTrin(trin){
  var tr=document.getElementById("b3Trin"); if(!tr||!synlig(tr)){ FUND.push("TRIN "+trin+": trin-rækken (#b3Trin) står ikke på skrivesiden"); return; }
  var f=[].slice.call(tr.querySelectorAll(".b3-tf")).filter(synlig), R="rgb(252,36,4)", HV="rgb(255,255,255)", K="rgb(222,222,222)";
  if(f.length!==4||f.map(function(b){return (b.innerText||"").replace(/\s+/g," ").trim()}).join("|")!=="Overblikket|Fang dem|Fasthold dem|Få dem til at handle"){ FUND.push("TRIN "+trin+": rækken skal have fire fliser Overblikket · Fang dem · Fasthold dem · Få dem til at handle — fandt: "+f.map(txt).join(" · ")); return; }
  if(/Trin\s+\d+\s+af|Succesraketten/i.test(tr.innerText||"")) FUND.push("TRIN "+trin+": »Trin N af …« eller »Succesraketten« står i rækken");
  var q=f.map(function(b){return b.getBoundingClientRect()}), c=f.map(function(b){return getComputedStyle(b)});
  f.forEach(function(b,i){ var nu=b.classList.contains("nu"), sp=b.querySelector("span"), ss=sp?getComputedStyle(sp):null, sr=sp?sp.getBoundingClientRect():null, sv=b.querySelector("svg"), afv=[];
    if(Math.round(q[i].height)!==76) afv.push("højde "+Math.round(q[i].height)+" (skal 76)");
    if(Math.abs(q[i].top-q[0].top)>0.5) afv.push("står ikke på samme linje");
    if(px(c[i].borderTopLeftRadius)!==(i===0?20:16)) afv.push("hjørner "+px(c[i].borderTopLeftRadius)+" (skal "+(i===0?20:16)+")");
    if(i>0&&Math.abs(q[i].left-q[i-1].right-8)>1) afv.push(Math.round(q[i].left-q[i-1].right)+" til flisen før (skal 8)");
    if(nu){ if(rgb(c[i].backgroundColor)!==R||!ss||rgb(ss.color)!==HV) afv.push("den valgte er "+c[i].backgroundColor+" med tekst "+(ss?ss.color:"?")+" (skal #FC2404 med hvid tekst)"); if(sv&&rgb(getComputedStyle(sv).color)!==HV) afv.push("symbolet på den røde er ikke hvidt"); }
    else { if(rgb(c[i].backgroundColor)!==HV||px(c[i].borderTopWidth)!==1||rgb(c[i].borderTopColor)!==K||c[i].boxShadow==="none") afv.push("flade "+c[i].backgroundColor+" kant "+c[i].borderTopWidth+" "+c[i].borderTopColor+" (skal hvid · 1 px #DEDEDE · skygge)"); if(!ss||rgb(ss.color)!==(i===0?"rgb(26,26,26)":"rgb(104,104,104)")) afv.push("tekst "+(ss?ss.color:"?")+" (skal "+(i===0?"sort #1A1A1A":"grå #686868")+")"); }
    if(ss&&Math.round(parseFloat(ss.fontSize))!==(i===0?19:14)) afv.push("skrift "+ss.fontSize+" (skal "+(i===0?19:14)+")");
    if(i===0){ if(sv&&synlig(sv)) afv.push("Overblikket har et symbol (skal kun navnet)"); }
    else { if(!sv||!synlig(sv)) afv.push("raketten mangler over navnet"); else { var vr=sv.getBoundingClientRect(), m=/matrix\(([-\d.]+), ([-\d.]+)/.exec(getComputedStyle(sv).transform||"");
        if(Math.round(parseFloat(getComputedStyle(sv).width))!==20) afv.push("raketten er "+getComputedStyle(sv).width+" (skal 20)");
        if(sr&&(vr.top+vr.bottom)/2>sr.top) afv.push("raketten står ikke over navnet");
        if(!m||Math.abs(+m[1]-0.7071)>0.01||Math.abs(+m[2]-0.7071)>0.01) afv.push("raketten peger ikke skråt op mod højre hjørne (drejning "+(getComputedStyle(sv).transform||"ingen")+")"); }
      if(sr&&(sr.left-q[i].left<10||q[i].right-sr.right<10)) afv.push("navnet står "+Math.round(Math.min(sr.left-q[i].left,q[i].right-sr.right))+" fra flisens kant (skal mindst 10)"); }
    if(afv.length) FUND.push("TRIN "+trin+" · »"+txt(b)+"«: "+afv.join(" · "));
  });
  if(Math.abs(q[1].width-q[2].width)>1||Math.abs(q[2].width-q[3].width)>1) FUND.push("TRIN "+trin+": de tre fliser med raket er ikke lige brede ("+q.slice(1).map(function(x){return Math.round(x.width)}).join(" · ")+")");
  var forhold=q[0].width/q[1].width; if(forhold<1.2||forhold>1.3) FUND.push("TRIN "+trin+": Overblikket er "+Math.round(forhold*100)/100+" gange de andres bredde (skal ca. 1,25)");
  var nuF=f.filter(function(b){return b.classList.contains("nu")}); if(nuF.length!==1||f.indexOf(nuF[0])!==BRIEF_SIDE_AKTIV) FUND.push("TRIN "+trin+": den røde flise viser ikke, hvor man er (side "+(BRIEF_SIDE_AKTIV+1)+", rød: "+nuF.map(txt).join(", ")+")");
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
  for(var side=0; side<4; side++){ BRIEF_SIDE_AKTIV=side; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); await vent(150); var n=(BRIEF_TRIN_INFO||{n:1}).n; for(var t=0;t<n;t++){ BRIEF_TRIN_AKTIV=t; briefMbVis("skriv"); await vent(120); document.querySelectorAll("#briefWrap textarea").forEach(function(x){x.classList.add("mb-felt")}); maal("side"+side+"/"+t); if(t===0) maalTrin("side"+side); SIDSTE="side"+side+"/"+t+" maalt"; } }
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
    /* DEN NYE BRIEF ÅBNER EFTER STATUS (18/11: »Briefen åbner selv efter status (klik »Følg status«): Skriv ved Idé, Planlagt, Brief i gang og Klar til godkendelse« · »Skriv = Overblikket (med Idéens spørgsmål) …«
       · »Optag = kun idéen og scenerne. Post = kun video, coverbillede, caption og »Sæt til Postet««). Før: hver af de tre briefs skulle lande på den gamle oversigt (#briefForside).
       Nu: hver af dem skal lande på Skriv › Overblikket med Idéens flise tegnet, og Optag og Post skal kunne tegnes med et tryk — uden fejl i koden og uden ordet »false«. De tre brief-former er de samme. */
    var JSFEJL=[]; window.addEventListener("error", function(ev){ JSFEJL.push(String(ev&&ev.message||ev)); });
    for(var fi=0;fi<FORMER.length;fi++){ IDEER.push(FORMER[fi]); var jf0=JSFEJL.length; openBriefSide(FORMER[fi].id); await vent(900); var FN="»"+FORMER[fi].titel+"«";
      var trN=document.querySelector("#b3Trin .b3-tf.nu"), ideF=[].slice.call(document.querySelectorAll("#briefWrap .sk-q.b3-idq")).filter(synlig), vlg=document.getElementById("b3Vaelger");
      var okS=B3_VIS==="skriv"&&BRIEF_MB_VIS==="skriv"&&!!trN&&/Overblikket/.test(trN.innerText||"")&&ideF.length>0&&!!vlg&&synlig(vlg)&&vlg.querySelectorAll(".b3-fane").length===3&&!!vlg.querySelector(".b3-fane.on")&&/Skriv/.test(vlg.querySelector(".b3-fane.on").innerText);
      if(!okS) FUND.push("BRIEFEN ÅBNER IKKE PÅ SKRIV › OVERBLIKKET paa briefen "+FN+" (status Idé) — visning "+B3_VIS+"/"+BRIEF_MB_VIS+", Idéens flise: "+ideF.length+" dele");
      if(okS&&/\bfalse\b|\bundefined\b/.test(ideF.map(function(x){return x.innerText}).join(" "))) FUND.push("OVERBLIKKET viser ordet »false« eller »undefined« paa "+FN);
      b3Vaelg("optag"); await vent(500); var op=document.getElementById("b3Optag"); var okO=B3_VIS==="optag"&&!!op&&synlig(op)&&op.children.length>0&&document.body.classList.contains("b3-optag");
      if(!okO) FUND.push("OPTAG TEGNES IKKE paa briefen "+FN); if(okO&&/\bfalse\b|\bundefined\b/.test(op.innerText||"")) FUND.push("OPTAG viser ordet »false« eller »undefined« paa "+FN);
      b3Vaelg("post"); await vent(500); var fsx=document.getElementById("briefForside"); /* v3419: paa computeren staar »Upload video« og »Upload coverbillede« under faktaboksen (DESIGNLÅS 18/11), saa en brief uden caption har kun »Sæt til Postet« i hoejre spalte — knapperne under faktaboksen taeller med */ var uplx=document.getElementById("b3Upl"); var okx=B3_VIS==="post"&&fsx&&fsx.style.display!=="none"&&synlig(fsx)&&((fsx.innerText||"")+(uplx&&synlig(uplx)?uplx.innerText||"":"")).length>20;
      if(!okx) FUND.push("POST TEGNES IKKE paa briefen "+FN+" — den raa brief staar synlig"); if(okx&&/\bfalse\b|\bundefined\b/.test(fsx.innerText||"")) FUND.push("POST viser ordet »false« eller »undefined« paa "+FN);
      if(JSFEJL.length>jf0) FUND.push("FEJL I KODEN, da briefen "+FN+" blev aabnet: "+JSFEJL.slice(jf0).join(" | ").slice(0,160));
      b3Vaelg("skriv"); await vent(300); }
    SIDSTE="brief-former maalt";
    /* VEJEN TILBAGE FRA EN SKRIVESIDE ER OEJET VED TITLEN (v2089; Ida 18/9 kl. 14.50 fjernede en uoensket pille): oejet skal vaere synligt paa skrivesiderne, og ingen »Tilbage til forsiden«-pille */
    try { BRIEF_SIDE_AKTIV=1; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); await vent(200);
      /* TOPPEN = ÉT HVIDT KORT (18/11: »Kortet har derfor kun én linje (titel + blyant · vælger · status · tre prikker), og trin-rækken står lige under«; »Man skifter altid med ét tryk«).
         Før: de tre prikker i båndet (.bt-mere-tlf) med »Briefoversigten« i menuen. Nu: de tre prikker står i kortet (.b3-prik), og vejen til det, oversigten viste, er vælgeren Skriv · Optag · Post — begge skal ses på skrivesiden. */
      var oeje=document.querySelector("#b3Kort .b3-prik"), vg=document.getElementById("b3Vaelger"), fn=vg?[].slice.call(vg.querySelectorAll(".b3-fane")).filter(synlig):[];
      if(!oeje||!synlig(oeje)) FUND.push("DE TRE PRIKKER mangler i kortet paa skrivesiden (»titel + blyant · vælger · status · tre prikker«, 18/11)");
      if(fn.map(function(x){return (x.innerText||"").trim()}).join("|")!=="Skriv|Optag|Post"||!fn[0].classList.contains("on")) FUND.push("VAELGEREN Skriv · Optag · Post mangler paa skrivesiden, eller Skriv er ikke den valgte — fandt: "+fn.map(txt).join(" · "));
      if(oeje&&vg&&synlig(oeje)&&synlig(vg)){ var kq=document.getElementById("b3Kort").getBoundingClientRect(), oq=oeje.getBoundingClientRect(), vq=vg.getBoundingClientRect(), tq=document.querySelector("#b3Kort .mb-navn"); tq=tq?tq.getBoundingClientRect():null;
        if(!tq||Math.abs((oq.top+oq.bottom)/2-(vq.top+vq.bottom)/2)>8||Math.abs((tq.top+tq.bottom)/2-(vq.top+vq.bottom)/2)>8||!(tq.left<vq.left&&vq.right<=oq.left)) FUND.push("KORTET: titel · vælger · tre prikker står ikke på én linje i den rækkefølge (titel y"+(tq?Math.round((tq.top+tq.bottom)/2):"?")+", vælger y"+Math.round((vq.top+vq.bottom)/2)+", prikker y"+Math.round((oq.top+oq.bottom)/2)+")"); }
      var pille=[].find.call(document.querySelectorAll("#briefWrap button"),function(b){return /tilbage til forsiden/i.test(b.innerText||"")&&synlig(b)}); if(pille) FUND.push("PILLE »Tilbage til forsiden« staar paa skrivesiden — den er fjernet (Ida 18/9 kl. 14.50)"); } catch(e){ FUND.push("OEJE-proben fejlede: "+(e&&e.message)); }
    SIDSTE="oeje maalt";
  } catch(e){ FUND.push("SYNK-proben fejlede: "+(e&&e.message)); }
  Object.keys(GRUPPER).forEach(function(g){ var keys=Object.keys(GRUPPER[g]); if(keys.length>1){ keys.sort(function(a,b){return GRUPPER[g][b].length-GRUPPER[g][a].length}); FUND.push("UENS "+g+": "+keys.map(function(k){return k+" ×"+GRUPPER[g][k].length+" (fx "+GRUPPER[g][k][0]+")"}).join(" || ")); } });
  if(FUND.length){ FUND.forEach(function(f){ console.log("SELE BRIEF FEJL: "+f); }); console.log("SELE BRIEF IKKE OK: "+FUND.length+" fund"); }
  else { var tal=Object.keys(GRUPPER).map(function(g){ var k=Object.keys(GRUPPER[g])[0]; return g+" "+GRUPPER[g][k].length+" ("+k+")"; }).join(" · "); var ialt=Object.keys(GRUPPER).reduce(function(a,g){ return a+Object.keys(GRUPPER[g]).reduce(function(b,k){return b+GRUPPER[g][k].length},0); },0); if(ialt<40) console.log("SELE BRIEF FEJL: kun "+ialt+" elementer maalt — briefen blev ikke tegnet"); else console.log("SELE BRIEF OK: "+ialt+" elementer ens paa forsiden og alle skrivetrin, ingen rosa — "+tal); }
} catch(e){ console.log("SELE BRIEF FEJL probe: "+(e&&e.message)+" — sidste trin: "+SIDSTE+" — "+String(e&&e.stack||"").split("\n").slice(0,3).join(" | ")); }
}, 2500);
