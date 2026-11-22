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
var RED="rgb(252,36,4)", SORT="rgb(26,26,26)", G2="rgb(104,104,104)", G3="rgb(104,104,104)", KANT="rgb(222,222,222)";

function maalSide(){
  var rod=document.getElementById("briefWrap"); if(!rod) return;
  /* ===== DEN NYE BRIEF: SKRIV · OPTAG · POST (DESIGNLÅS 18/11 »DEN NYE BRIEF« + rettelserne 19/11) =====
     Fliser, overskrifter, feltnavne og felter måles her efter den nye låste form. Før (4/11): hvert spørgsmål sin egen flise · flisetitel 18/16 sort · felt 13 px, mindst 44. */
  N++; if(!document.body.classList.contains("b3-paa")) fejl("BRIEF: den nye brief (body.b3-paa) er ikke slået til på briefens side");
  var HVID="rgb(255,255,255)", SEG=".b3-idq, .b3-cap", FELTFLISE=".klip-kort.kk-cta, .sk-q[data-par=cover], .cap-q.b3-htg";
  var nav0=document.getElementById("briefSideNav"), navR=(nav0&&synlig(nav0))?nav0.getBoundingClientRect():null;
  /* v3423 (bud 9, computeren): »midten i ÉN ramme … felterne direkte i rammen under deres overskrift« · »I rammen står intet i en flise (aldrig flise i flise) … rammen er flisen« · »Knapperne står UNDER den grå flise, ikke i den, og er lige så brede som flisen«.
     På computeren er spalten derfor rammens indre kant = trin-vælgerens kanter (MÅLT 22/11 på 1440: 612–1180, knapperne 596–1196). Telefonen er uændret: spalten er knappernes kanter. */
  var PCR=!TLF&&document.body.classList.contains("b3-paa"), trE=document.getElementById("b3Trin"), kolR=(PCR&&trE&&synlig(trE))?trE.getBoundingClientRect():navR;
  var UDEN=function(c){ return /rgba\(0,0,0,0\)|transparent/.test(rgb(c.backgroundColor))&&px(c.borderTopWidth)===0&&px(c.borderLeftWidth)===0&&c.boxShadow==="none"; };
  if(PCR&&navR&&kolR!==navR){ N++; if(Math.abs(navR.left-(kolR.left-16))>1||Math.abs(navR.right-(kolR.right+16))>1) fejl("RAMMEN: knapperne står "+Math.round(navR.left)+"–"+Math.round(navR.right)+", felterne "+Math.round(kolR.left)+"–"+Math.round(kolR.right)+" (knapperne skal være lige så brede som rammen: 16 uden for felterne i hver side)"); }
  /* FLISE (»Udtryk«, 18/11: »fliser hvide med kant #DEDEDE og tydelig skygge«; MÅLKORT: radius 20 · luft 18/20 · 12 til næste flise) */
  rod.querySelectorAll(".sk-q, .klip-kort").forEach(function(e){
    if(!synlig(e)) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect();
    if(r.width<200) return;
    if(e.classList.contains("klip1-vaert")||e.querySelector(":scope > #briefKlipHolder, :scope > .kk-scener")) return;   /* holderen er ingen flise */
    if(e.matches(SEG)||e.matches(FELTFLISE)) return;   /* den samlede flise og »feltet er selv flisen« måles for sig nedenfor */
    if(e.parentElement.closest(".sk-q:not(:has(> #briefKlipHolder)):not(:has(> .kk-scener)):not(.klip1-vaert), .klip-kort")) return;   /* en flise i en flise er ikke en ny flise */
    if(PCR){ er("INTET I EN FLISE I RAMMEN", e, UDEN(cs), "flade "+cs.backgroundColor+" kant "+cs.borderTopWidth+" skygge "+(cs.boxShadow==="none"?"ingen":"ja")+" (på computeren er rammen flisen: ingen flade, kant eller skygge)"); er("I RAMMEN kanter", e, !kolR||(Math.abs(r.left-kolR.left)<=1&&Math.abs(r.right-kolR.right)<=1), Math.round(r.left)+"–"+Math.round(r.right)+" (skal følge spalten "+(kolR?Math.round(kolR.left)+"–"+Math.round(kolR.right):"?")+")"); return; }
    er("FLISE radius", e, px(cs.borderTopLeftRadius)===20&&px(cs.borderTopRightRadius)===20&&px(cs.borderBottomLeftRadius)===20&&px(cs.borderBottomRightRadius)===20, "radius "+cs.borderRadius+" (skal 20)");
    er("FLISE luft", e, px(cs.paddingTop)===18&&px(cs.paddingBottom)===18&&px(cs.paddingLeft)===20&&px(cs.paddingRight)===20, "luft "+cs.padding+" (skal 18 20)");
    er("FLISE afstand", e, px(cs.marginBottom)===12, "afstand under "+px(cs.marginBottom)+" (skal 12)");
    er("FLISE flade", e, rgb(cs.backgroundColor)===HVID||/story/.test(kl(e))||(e.parentElement&&e.parentElement.classList.contains("kk-laast")&&rgb(cs.backgroundColor)==="rgb(244,247,250)"), "flade "+cs.backgroundColor);
    er("FLISE kant og skygge", e, px(cs.borderTopWidth)===1&&px(cs.borderLeftWidth)===1&&rgb(cs.borderTopColor)===KANT&&rgb(cs.borderLeftColor)===KANT&&cs.boxShadow!=="none", "kant "+cs.borderTopWidth+" "+cs.borderTopColor+" skygge "+(cs.boxShadow==="none"?"ingen":"ja")+" (skal 1 px #DEDEDE og skygge)");
  });
  /* DEN SAMLEDE FLISE (19/11: »captionens fire spørgsmål står i ÉN flise under »Caption« (som Idéen i tegningen)«): spørgsmålene er dele af ÉN flise —
     første del har de runde hjørner øverst, sidste nederst, delene står helt sammen, og luften er flisens 18/20. Et spørgsmål, der står som sin egen flise, er en fejl. */
  rod.querySelectorAll(":scope > .cap-q").forEach(function(e){ if(!synlig(e)) return; N++; if(!e.matches(".b3-cap, .b3-htg")) fejl("CAPTION: »"+txt(e)+"« står som sin egen flise (skal være en del af den samlede flise under »Caption«)"); });
  [[".basis-kort.b3-ide .sk-q.b3-idq","Idéen"],[":scope > .cap-q.b3-cap","Caption"]].forEach(function(g){
    var sg=[].slice.call(rod.querySelectorAll(g[0])).filter(synlig); if(!sg.length) return;
    sg.forEach(function(e,i){ var cs=getComputedStyle(e), r=e.getBoundingClientRect(), f=i===0, l=i===sg.length-1;
      if(PCR){ er("INTET I EN FLISE I RAMMEN "+g[1], e, UDEN(cs), "flade "+cs.backgroundColor+" kant "+cs.borderWidth+" skygge "+(cs.boxShadow==="none"?"ingen":"ja")+" (på computeren er rammen flisen: ingen flade, kant eller skygge)"); if(kolR) er("I RAMMEN "+g[1]+" kanter", e, Math.abs(r.left-kolR.left)<=1&&Math.abs(r.right-kolR.right)<=1, Math.round(r.left)+"–"+Math.round(r.right)+" (skal følge spalten "+Math.round(kolR.left)+"–"+Math.round(kolR.right)+")"); return; }
      er("SAMLET FLISE "+g[1]+" hjørner", e, px(cs.borderTopLeftRadius)===(f?20:0)&&px(cs.borderTopRightRadius)===(f?20:0)&&px(cs.borderBottomLeftRadius)===(l?20:0)&&px(cs.borderBottomRightRadius)===(l?20:0), "hjørner "+cs.borderRadius+" (skal 20 øverst på første del og nederst på sidste, 0 imellem)");
      er("SAMLET FLISE "+g[1]+" luft", e, px(cs.paddingLeft)===20&&px(cs.paddingRight)===20&&(!f||px(cs.paddingTop)===18)&&(!l||px(cs.paddingBottom)===18), "luft "+cs.padding+" (skal 20 i siderne, 18 øverst på første del og nederst på sidste)");
      er("SAMLET FLISE "+g[1]+" flade", e, rgb(cs.backgroundColor)===HVID&&px(cs.borderLeftWidth)===1&&px(cs.borderRightWidth)===1&&rgb(cs.borderLeftColor)===KANT&&cs.boxShadow!=="none"&&px(cs.borderTopWidth)===(f?1:0)&&px(cs.borderBottomWidth)===(l?1:0)&&(!f||rgb(cs.borderTopColor)===KANT)&&(!l||rgb(cs.borderBottomColor)===KANT), "flade "+cs.backgroundColor+" kant "+cs.borderWidth+" skygge "+(cs.boxShadow==="none"?"ingen":"ja")+" (skal hvid · 1 px #DEDEDE rundt om hele flisen, ingen kant mellem delene · skygge)");
      if(i>0){ var d=r.top-sg[i-1].getBoundingClientRect().bottom; er("SAMLET FLISE "+g[1]+" samlet", e, Math.abs(d)<=0.5, "står "+Math.round(d*10)/10+" px fra delen over (skal 0: det er ÉN flise)"); }
      if(navR) er("SAMLET FLISE "+g[1]+" kanter", e, Math.abs(r.left-navR.left)<=1&&Math.abs(r.right-navR.right)<=1, Math.round(r.left)+"–"+Math.round(r.right)+" (skal følge spalten "+Math.round(navR.left)+"–"+Math.round(navR.right)+")");
    });
  });
  var ideK=rod.querySelector(".basis-kort.b3-ide"); if(ideK&&synlig(ideK)){ var ib=getComputedStyle(ideK,"::before"), f1=[].slice.call(ideK.querySelectorAll(".sk-q.b3-idq")).filter(synlig)[0];
    er("OVERSKRIFT skrift", ideK, /Idéen/.test(ib.content)&&px(ib.fontSize)===12&&ib.textTransform==="uppercase"&&px(ib.letterSpacing)===1.5&&ib.fontWeight==="400"&&rgb(ib.color)===G2, "»Idéen« "+ib.fontSize+" "+ib.color+" ls"+ib.letterSpacing+" (skal 12 versal · 1,5 · #686868)");
    if(f1){ var di=Math.round(f1.getBoundingClientRect().top-ideK.getBoundingClientRect().top); er("OVERSKRIFT→flise", ideK, Math.abs(di-24)<=1, "»Idéen« + luft fylder "+di+" (skal 16 + 8)"); } }
  /* FELTET ER SELV FLISEN (HÅRD 19/11 »Aldrig flise i flise«: »står der kun ÉT felt under en overskrift, er feltet selv flisen og går ud til spaltens kant« — »CTA i videoen«, »Tekst på coverbilledet«; og »Hashtagfeltet er selv flisen (ingen ydre flise)«) */
  rod.querySelectorAll(FELTFLISE).forEach(function(c){ if(!synlig(c)) return; var cs=getComputedStyle(c), r=c.getBoundingClientRect();
    er("FLISE I FLISE", c, /rgba\(0,0,0,0\)|transparent/.test(rgb(cs.backgroundColor))&&px(cs.borderTopWidth)===0&&px(cs.borderLeftWidth)===0&&cs.boxShadow==="none"&&px(cs.paddingLeft)===0&&px(cs.paddingRight)===0&&px(cs.paddingTop)===0, "flade "+cs.backgroundColor+" kant "+cs.borderTopWidth+" luft "+cs.padding+" skygge "+(cs.boxShadow==="none"?"ingen":"ja")+" (der må ingen ydre flise være om et enligt felt)");
    var fs=[].slice.call(c.querySelectorAll("textarea.sk-input, .htg-rk input[type=text]")).filter(synlig); N++; if(!fs.length) fejl("FLISE I FLISE: intet felt under »"+txt(c)+"«");
    fs.forEach(function(f){ var fr=f.getBoundingClientRect(), fc=getComputedStyle(f);
      er("FELTET ER FLISEN kanter", f, Math.abs(fr.left-r.left)<=1&&Math.abs(fr.right-r.right)<=1&&(!kolR||(Math.abs(fr.left-kolR.left)<=1&&Math.abs(fr.right-kolR.right)<=1)), Math.round(fr.left)+"–"+Math.round(fr.right)+" (skal gå ud til spaltens kant "+Math.round(kolR?kolR.left:r.left)+"–"+Math.round(kolR?kolR.right:r.right)+")");
      er("FELTET ER FLISEN flade", f, rgb(fc.backgroundColor)===HVID&&px(fc.borderTopWidth)===1&&rgb(fc.borderTopColor)===KANT&&fc.boxShadow!=="none", "flade "+fc.backgroundColor+" kant "+fc.borderTopWidth+" "+fc.borderTopColor+" skygge "+(fc.boxShadow==="none"?"ingen":"ja")+" (skal hvid · 1 px #DEDEDE · skygge)"); });
  });
  /* OVERSKRIFT OVER FLISEN (18/11 »Felterne = bud 3«: »overskriften over flisen i versaler«; MÅLKORT 12/11: 12 versal · 1,5 · #686868 · 8 ned til flisen · venstrekant = flisens ydre kant).
     Før: flisetitel inde i flisen, Poppins 18 (telefon 16) sort. */
  rod.querySelectorAll(".pf-sc, .cap-sek > span, .klip-kort.kk-cta .kk-et").forEach(function(t){   /* v3424: »Tekst på coverbilledet« og »Hashtags« er spørgsmål (16 halvfed) og måles som feltnavne nedenfor */
    if(!synlig(t)) return; var ts=getComputedStyle(t), r=t.getBoundingClientRect();
    er("OVERSKRIFT skrift", t, px(ts.fontSize)===12&&ts.textTransform==="uppercase"&&px(ts.letterSpacing)===1.5&&ts.fontWeight==="400"&&rgb(ts.color)===G2&&/Poppins/.test(ts.fontFamily), ts.fontSize+"/"+ts.fontWeight+" "+ts.color+" ls"+ts.letterSpacing+" "+ts.textTransform+" (skal 12/400 versal · 1,5 · #686868 Poppins)");
    var maalE=null;
    if(t.matches(".pf-sc")){ maalE=t.nextElementSibling; while(maalE&&!synlig(maalE)) maalE=maalE.nextElementSibling; }
    else if(t.closest(".cap-sek")) maalE=[].slice.call(rod.querySelectorAll(":scope > .cap-q.b3-cap")).filter(synlig)[0];
    else maalE=[].slice.call(t.closest(FELTFLISE).querySelectorAll("textarea.sk-input, .htg-rk input[type=text]")).filter(synlig)[0];
    N++; if(!maalE){ fejl("OVERSKRIFT »"+txt(t)+"«: der står ingen flise under den"); return; }
    var mr=maalE.getBoundingClientRect(), d=Math.round(mr.top-r.bottom); er("OVERSKRIFT→flise", t, Math.abs(d-8)<=1, "afstand "+d+" (skal 8)");
    er("OVERSKRIFT venstrekant", t, Math.abs(r.left-mr.left)<=1, "står "+Math.round(r.left-mr.left)+" px fra flisens venstre kant (skal 0)");
  });
  /* SCENEN: rækken »Klip 1« med streg er væk (19/11: »rækken »Klip 1« med streg er væk (skraldespanden står i flisens øverste højre hjørne på computeren)«) — hver scene har sin overskrift OVER flisen.
     Før: klip-etiket 13 grå inde i flisen med én streg under. */
  rod.querySelectorAll(".klip-kort:not(.kk-cta)").forEach(function(k){ if(!synlig(k)) return;
    var hd=k.querySelector(":scope > .klip-hoved"); if(hd&&synlig(hd)){ var t=hd.querySelector(".kk-titel"); N++; if(t&&synlig(t)&&(t.innerText||"").trim()) fejl("SCENE: rækken »"+txt(t)+"« står stadig inde i flisen (skal være væk)"); var hs=getComputedStyle(hd); er("SCENE hoved uden streg", hd, px(hs.borderBottomWidth)===0&&px(hs.borderTopWidth)===0, "streg "+hs.borderBottomWidth+" (skal ingen)"); }
    var fo=(k.parentElement.classList.contains("kk-laast")?k.parentElement:k).previousElementSibling; while(fo&&!synlig(fo)) fo=fo.previousElementSibling;
    N++; if(!fo||!fo.matches(".pf-sc, .klip-kort:not(.kk-cta), .kk-laast")) fejl("SCENE: flisen »"+txt(k)+"« har ingen overskrift over sig (»Scene N«)");   /* flere klip i samme scene deler scenens overskrift: kun scenens første flise har den lige over sig */
  });
  /* FELTETS NAVN (18/11: »lille symbol foran feltets navn (øje · taleboble · T)«; MÅLKORT »Felt-etiket«: Poppins 13 / 400 / #686868 · 8 til feltet). Idéens og Captions spørgsmål er feltnavne i den samlede flise.
     Før: spørgsmålene var flisetitler, Poppins 18 (telefon 16) sort. */
  /* v3424 (21/11): »spørgsmål 16 halvfed, tydeligt over svaret« — Idéens og Captions spørgsmål, »Tekst på coverbilledet« og »Hashtags« er 16/500 sort, 8 over feltet (VÆLTER 13/400 grå for spørgsmålene; MÅLT 22/11 på 390 og 1440).
     Scenens feltnavne med symbol (»Hvad ser man?« · »Hvad siger du?« · »Tekst på skærmen«) er stadig 13/400 grå. */
  rod.querySelectorAll(".klip-kort:not(.kk-cta) .kk-et, .b3-idq > .sk-label, .b3-cap > .sk-label, .sk-q[data-par=cover] > .sk-label, .cap-q.b3-htg > .sk-label").forEach(function(e){
    if(!synlig(e)) return; var t=e.matches(".sk-label")?(e.querySelector(".sk-spm, .sk-titel")||e):e; var cs=getComputedStyle(t), navn=(t.innerText||"").replace(/\s+/g," ").trim();
    if(e.matches(".sk-label")) er("SPØRGSMÅL", t, px(cs.fontSize)===16&&cs.fontWeight==="500"&&rgb(cs.color)===SORT&&cs.textTransform==="none"&&/Poppins/.test(cs.fontFamily), cs.fontSize+"/"+cs.fontWeight+" "+cs.color+" (skal 16/500 sort #1A1A1A)");
    else er("FELTNAVN", t, px(cs.fontSize)===13&&cs.fontWeight==="400"&&rgb(cs.color)===G2&&cs.textTransform==="none"&&/Poppins/.test(cs.fontFamily), cs.fontSize+"/"+cs.fontWeight+" "+cs.color+" (skal 13/400 #686868)");
    var nx=e.nextElementSibling; while(nx&&!synlig(nx)) nx=nx.nextElementSibling; if(nx){ var d=Math.round(nx.getBoundingClientRect().top-e.getBoundingClientRect().bottom); er("FELTNAVN afstand", e, Math.abs(d-8)<=1, "til feltet "+d+" (skal 8)"); }
    if(e.matches(".kk-et")&&/^(Hvad ser man\?|Manus|Hvad siger du\?|Tekst på skærmen)$/.test(navn)){ var sv=e.querySelector("svg"), sr=sv?sv.getBoundingClientRect():null, sp=e.querySelector("span"), pr=sp?sp.getBoundingClientRect():null;
      er("FELTNAVN symbol", e, !!sv&&Math.round(sr.width)===16&&Math.round(sr.height)===16&&!!pr&&sr.right<=pr.left+0.5&&rgb(getComputedStyle(sv).color)===G2, sv?("symbol "+Math.round(sr.width)+"x"+Math.round(sr.height)+" "+getComputedStyle(sv).color+" (skal 16 · gråt · foran navnet)"):"intet symbol foran navnet"); }
  });
  /* FELTER (19/11 »Felternes højde og fluebenet«: »Kun »Hvad ser man?« er højt (76); forslag og øvrige felter er 48 og vokser med teksten«; 18/11: »tekst 14«). Før: 13 px, mindst 44 høj. */
  rod.querySelectorAll("textarea.sk-input, input.sk-input, textarea.mb-felt, .htg-rk input[type=text]").forEach(function(e){
    if(!synlig(e)||e.closest(".sendfelt, .sendfelt-felt")) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect();
    er("FELT", e, px(cs.fontSize)===14&&cs.fontWeight==="400"&&px(cs.borderTopLeftRadius)===14&&px(cs.borderTopWidth)===1&&(rgb(cs.borderTopColor)===KANT||/2(38|45), 2/.test(cs.backgroundColor))&&cs.fontStyle==="normal", cs.fontSize+"/"+cs.fontWeight+" r"+cs.borderTopLeftRadius+" kant "+cs.borderTopWidth+" "+cs.borderTopColor+" "+cs.fontStyle+" (skal 14/400 r14 1px #DEDEDE, aldrig kursiv)");
    var mind=/(_ser|hookSer_f\d+)$/.test(e.id||"")?76:48, skal=Math.max(mind, e.tagName==="TEXTAREA"?e.scrollHeight+2:mind);
    er("FELT højde", e, Math.abs(r.height-skal)<=1, "h"+Math.round(r.height)+" (skal "+skal+": "+mind+" og derfra med teksten)");
  });
  /* SYMBOLFELTER (HÅRD 19/11 »SYMBOLFELTER ER LYSEBLÅ ALLE STEDER«: »rundt, lyseblåt #F4F7FA, MED grå ramme 1 px #DEDEDE, med symbolet tegnet i grå #686868« · »44 i faktaboksen … Symbolet er 20 i et felt på 44«).
     Måles i den nye briefs faktaboks, hvor reglen er bygget (resten af appen: når det er bygget). */
  document.querySelectorAll("#screen7 #briefRail .fb-rk > .fb-ik").forEach(function(e){ if(!synlig(e)) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect(), sv=e.querySelector("svg"), sr=sv?sv.getBoundingClientRect():null, ss=sv?getComputedStyle(sv):null;
    var rund=/%$/.test(cs.borderTopLeftRadius)?parseFloat(cs.borderTopLeftRadius)>=50:px(cs.borderTopLeftRadius)>=r.width/2-0.5;
    er("SYMBOLFELT", e, Math.round(r.width)===44&&Math.round(r.height)===44&&rund&&rgb(cs.backgroundColor)==="rgb(244,247,250)"&&px(cs.borderTopWidth)===1&&px(cs.borderLeftWidth)===1&&rgb(cs.borderTopColor)===KANT&&!!sv&&Math.round(sr.width)===20&&Math.round(sr.height)===20&&rgb(ss.stroke)===G2,
      Math.round(r.width)+"x"+Math.round(r.height)+" r"+cs.borderTopLeftRadius+" "+cs.backgroundColor+" kant "+cs.borderTopWidth+" "+cs.borderTopColor+" symbol "+(sv?Math.round(sr.width)+" "+ss.stroke:"mangler")+" (skal 44 rund · #F4F7FA · 1 px #DEDEDE · symbol 20 i #686868)"); });
  /* TILVALGS-CHIPS TIL HØJRE (HÅRD 19/11: »Briefens tilvalgs-chips står til højre under flisen eller feltet over dem … »+ Tekst«, »+ Manus«, »+ Klip«, »+ Scene« og »Vælg fra hashtagbanken«. Aldrig til venstre«) */
  [].slice.call(rod.querySelectorAll(".ark-chip")).filter(synlig).forEach(function(c){ var t=(c.innerText||"").replace(/\s+/g," ").trim(); if(!/^\+?\s?(Tekst|Tekst på skærmen|Manus|Hvad siger du\?|Klip|Scene)$|^Vælg fra hashtagbanken$/.test(t)) return;
    var r=c.getBoundingClientRect(), rk=[].slice.call(c.parentElement.children).filter(synlig).filter(function(x){ return Math.abs(x.getBoundingClientRect().top-r.top)<4; });
    var hoejre=Math.max.apply(null,rk.map(function(x){return x.getBoundingClientRect().right})), venstre=Math.min.apply(null,rk.map(function(x){return x.getBoundingClientRect().left}));
    var fl=c.closest(".klip-kort:not(.kk-cta)"), k0, k1; if(fl){ var fc=getComputedStyle(fl), fr=fl.getBoundingClientRect(); k0=fr.left+px(fc.borderLeftWidth)+px(fc.paddingLeft); k1=fr.right-px(fc.borderRightWidth)-px(fc.paddingRight); } else if(kolR){ k0=kolR.left; k1=kolR.right; } else return;
    er("TILVALGS-CHIP til højre", c, Math.abs(hoejre-k1)<=1.5&&venstre-k0>=20, "rækken står "+Math.round(venstre-k0)+" fra venstre kant og "+Math.round(k1-hoejre)+" fra højre (skal 0 fra højre kant, aldrig til venstre)");
    if(fl){ var bund=Math.max.apply(null,[0].concat([].slice.call(fl.querySelectorAll("textarea.sk-input")).filter(synlig).map(function(x){return x.getBoundingClientRect().bottom}))); er("TILVALGS-CHIP under felterne", c, r.top>=bund-1, "chippen står over et felt i flisen (skal stå under)"); }
  });
  /* KNAPPERNE NEDERST STÅR I SIDEN (HÅRD 19/11: »på alle trin i den nye brief, også Fakta på telefonen, står »Næste« (kun ordet, aldrig »Næste: …«) og »Gem ændringer« i selve siden under indholdet«) */
  N++; if(!navR) fejl("BUNDKNAPPER: knapperne nederst (#briefSideNav) står ikke på trinnet");
  else { for(var a=nav0;a&&a.id!=="screen7"&&a!==document.body;a=a.parentElement){ var ps=getComputedStyle(a).position; N++; if(ps==="fixed"||ps==="sticky") fejl("BUNDKNAPPER: står fast på skærmen (["+kl(a)+"] er "+ps+")"); }
    var kn=[].slice.call(nav0.querySelectorAll("button")).filter(synlig); kn.forEach(function(b){ var ps=getComputedStyle(b).position, t=(b.innerText||"").replace(/\s+/g," ").trim(); N++; if(ps==="fixed"||ps==="sticky") fejl("BUNDKNAPPER: »"+t+"« står fast på skærmen ("+ps+")"); N++; if(/^Næste/.test(t)&&t!=="Næste") fejl("BUNDKNAPPER: knappen hedder »"+t+"« (skal kun »Næste«)"); });
    N++; if(!kn.some(function(b){ return (b.innerText||"").replace(/\s+/g," ").trim()==="Gem ændringer"; })) fejl("BUNDKNAPPER: »Gem ændringer« mangler på trinnet");
    var ind=[].slice.call(document.querySelectorAll("#briefWrap .klip-kort, #briefWrap .sk-q, #briefWrap textarea.sk-input, #briefWrap .htg-rk, #briefWrap #briefRail .fb-rk")).filter(synlig), ib=ind.length?Math.max.apply(null,ind.map(function(x){return x.getBoundingClientRect().bottom})):0;
    N++; if(ind.length&&navR.top<ib-1) fejl("BUNDKNAPPER: står ikke under indholdet (knapper y"+Math.round(navR.top)+", indhold slutter y"+Math.round(ib)+")");
    /* rulles siden, følger knapperne indholdet — en fast bjælke ville blive stående */
    if(ind.length){ var ref=ind[0], sc=[document.scrollingElement].concat([].slice.call(document.querySelectorAll(".content"))).filter(Boolean), gl=sc.map(function(x){return x.scrollTop}), y0=ref.getBoundingClientRect().top, n0=nav0.getBoundingClientRect().top;
      sc.forEach(function(x){ x.scrollTop=x.scrollTop+90; }); var dy=ref.getBoundingClientRect().top-y0, dn=nav0.getBoundingClientRect().top-n0; sc.forEach(function(x,i){ x.scrollTop=gl[i]; });
      N++; if(Math.abs(dy-dn)>1) fejl("BUNDKNAPPER: følger ikke siden, når der rulles (indholdet flyttede "+Math.round(dy)+", knapperne "+Math.round(dn)+")"); } }
  /* FLISETITEL (MÅLKORT 4/11, uændret): en titel, der stadig står INDE i en flise uden for den nye briefs samlede fliser, måles som før — Poppins 18 (telefon 16) / 400 / #1A1A1A; 8 til første indhold */
  rod.querySelectorAll(".sk-q:not([data-par=cover]):not(.b3-idq):not(.b3-cap):not(.b3-htg) > .sk-label, .kk-hook-spm").forEach(function(e){
    if(!synlig(e)) return; var t=e.querySelector(".sk-spm, .sk-titel")||e; var ts=getComputedStyle(t);
    er("FLISETITEL skrift", t, px(ts.fontSize)===(TLF?16:18)&&ts.fontWeight==="400"&&/Poppins/.test(ts.fontFamily)&&rgb(ts.color)===SORT, ts.fontSize+"/"+ts.fontWeight+" "+ts.color+" (skal "+(TLF?16:18)+"/400 #1A1A1A Poppins)");
    var nxt=e.nextElementSibling; while(nxt&&getComputedStyle(nxt).display==="none") nxt=nxt.nextElementSibling;
    if(nxt&&nxt.getBoundingClientRect().height>0){ var d=Math.round(nxt.getBoundingClientRect().top-e.getBoundingClientRect().bottom); er("FLISETITEL afstand", e, Math.abs(d-8)<=1, "til indholdet "+d+" (skal 8)"); }
  });
  /* FELTFLUGT: alle hook-/forslagsfelter i samme flise starter og slutter ens */
  rod.querySelectorAll(".sk-q, .klip-kort").forEach(function(f){
    var ls=[].slice.call(f.querySelectorAll(".fs-ta-vaert")).filter(synlig).map(function(e){ var r=e.getBoundingClientRect(); return [Math.round(r.left),Math.round(r.right)]; });
    if(ls.length>1){ N++; var l0=ls[0][0], r0=ls[0][1]; if(ls.some(function(x){ return Math.abs(x[0]-l0)>1||Math.abs(x[1]-r0)>1; })) fejl("FELTFLUGT i "+kl(f)+": felterne står ikke ens ("+ls.map(function(x){return x.join("-")}).join(" · ")+")"); }
  });
  /* CHIPS: 32 · 12,5/400 · #686868 (Ida 9/11, bud 2 — afløser 40 · 15 fra 7/11) · radius 999 · luft 14 · plus 14 grå, 6 til teksten */
  rod.querySelectorAll(".ark-chip:not(.kk-ini):not(.on)").forEach(function(e){
    if(!synlig(e)) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect();
    if(e.closest("#briefSideNav")) return;
    er("CHIP", e, Math.round(r.height)===32&&px(cs.fontSize)===12.5&&cs.fontWeight==="400"&&rgb(cs.color)===G2&&px(cs.borderTopLeftRadius)>=14&&px(cs.paddingLeft)===14&&px(cs.paddingRight)===14&&/Poppins/.test(cs.fontFamily), "h"+Math.round(r.height)+" "+cs.fontSize+"/"+cs.fontWeight+" "+cs.color+" luft "+cs.paddingLeft+"/"+cs.paddingRight+" (skal 32 · 12,5/400 · #686868 · luft 14)");
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
  /* KNAPPER i bunden: 44 (Ida 7/11). Navigationsknapper er låst til 56 fra 12/11, men briefens piller flyttes samlet i et eget trin — ret tallet her, når det sker */
  rod.querySelectorAll("#briefSideNav .dbtn").forEach(function(e){ if(!synlig(e)) return; var r=e.getBoundingClientRect(); er("KNAP højde", e, Math.round(r.height)===(innerWidth>=900?44:56), "h"+Math.round(r.height)+" (skal "+(innerWidth>=900?44:56)+")"); });   /* navigationsknapper = 56 (låst 12/11; briefen 13/11) */
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
  if(!TLF){ var lose=[].slice.call(document.querySelectorAll("#screen7 .bt-ik-baand > *, #screen7 .ss-top > .ss-cirk:not(.ss-mere), #screen7 .brief-titel-over > .bt-blyant")   /* blyanten er væk på computeren (Ida 14/11): kun de tre prikker; »Ret titlen« ligger under dem */).filter(synlig).filter(function(e){ return !e.classList.contains("bt-mere-tlf") && !e.classList.contains("bt-status-baand"); });   /* status står foran ⋯ (Ida 9/11) */
    N++; if(lose.length) fejl("IKONRÆKKE: løse ikoner uden for ⋯: "+lose.map(function(e){return e.title||kl(e)}).join(", ")); }
}
function maalForsideTlf(){
  /* TELEFONENS BRIEFOVERSIGT (Ida 4/11): ingen Fortsaet/Start brief, ingen chips i coveret, coveret 228, oplysnings-chips som EN linje under statuslinjen (36 høje, kun visning, ingen +), titlen overlapper aldrig Tilbage */
  if(!TLF) return;
  N++; if(document.querySelector("#briefForside .pf-start-knap, .pf-start-kort")) fejl("FORSIDE tlf: Fortsæt/Start brief står stadig i den røde flise");
  N++; if(document.querySelector(".hc-chip")) fejl("FORSIDE tlf: oplysnings-chips står stadig i coveret");
  var h=document.querySelector("#screen7 .mb-baand"); if(h){ N++; var fo=h.querySelector(".mb-foto"); if(fo&&fo.getBoundingClientRect().height>1) fejl("FORSIDE tlf: briefen har et coverbillede (skal være uden, Ida 16/11)"); }
  var cs=[].slice.call(document.querySelectorAll(".fb-hc-rk .fb-hc")).filter(synlig);
  cs.forEach(function(c){ var r=c.getBoundingClientRect(), s=getComputedStyle(c); er("OPLYSNINGS-CHIP", c, Math.round(r.height)===32&&px(s.fontSize)===12.5&&s.fontWeight==="400"&&rgb(s.color)===G2&&(TLF||Math.round(r.top)===Math.round(cs[0].getBoundingClientRect().top)), "h"+Math.round(r.height)+" "+s.fontSize+" "+s.color+" (skal 32 · 12,5/400)"); if(c.querySelector(".plus,svg:not(.fb-hc-ik)")) fejl("OPLYSNINGS-CHIP: har plus/ikon"); });
  var ti=document.querySelector("#screen7 .mb-baand .mb-navn"), tb=[].slice.call(document.querySelectorAll("#screen7 .mb-baand button, #screen7 .mb-baand a")).filter(function(e){return /tilbage/i.test(e.innerText||e.getAttribute("aria-label")||"")&&synlig(e)})[0];
  if(ti&&tb){ N++; var a=ti.getBoundingClientRect(), b=tb.getBoundingClientRect(); if(!(a.bottom<=b.top||a.top>=b.bottom||a.right<=b.left||a.left>=b.right)) fejl("FORSIDE tlf: titlen overlapper Tilbage"); }
}
function maalStory(){
  /* STORY-SIDEN (Ida 4/11): [status] [dato] i samme højde 36 og på samme linje, storytype-chips 36 på én linje, ingen pil på nogen flise, upload-placeholderen er lys (aldrig mørk) */
  /* STATUS ER HELT VÆK FRA STORY (Ida 12/11): rækken har kun datoen (32 høj) — en status i rækken er en fejl */
  var st=document.querySelector("#storySerie .ss-top .ss-stat"), da=document.querySelector("#storySerie .ss-top > .ss-dato");
  N++; if(st) fejl("STORY-RÆKKE: status står stadig på story-siden (skal være helt væk)");
  if(da){ var b=da.getBoundingClientRect(); er("STORY-RÆKKE", da, Math.round(b.height)===32, "dato h"+Math.round(b.height)+" (skal 32)"); }
  else fejl("STORY-RÆKKE: datoen mangler i rækken");
  var cs=[].slice.call(document.querySelectorAll("#storySerie .ss-typrk .ss-chip")).filter(synlig);
  N++; if(cs.length!==2) fejl("STORYTYPE: forventer to valgchips, fandt "+cs.length);
  cs.forEach(function(c){ var r=c.getBoundingClientRect(); er("STORYTYPE-CHIP", c, Math.round(r.height)===32&&Math.abs(r.top-cs[0].getBoundingClientRect().top)<1, "h"+Math.round(r.height)+" (skal 32, én linje)"); });
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
  /* HJEM (Ida valgte bud 4B, 4/11): computer = to paneler #F8F8F8 (radius 28, luft 12) med hvide fliser 80 høje, radius 20, ramme 1 px #DEDEDE, ingen skygge, 10 imellem, overskrift→flise 16, panel→overskrift 24, rød datobjælke 44, ingen Dag/Uge; ingen rød flise på hverken computer eller telefon */
  try{ window.__kundeAftaler=[{id:1,titel:"Contentgennemgang",dato:huIso(new Date()),tid:"10:00",tid_slut:"11:00"},{id:2,titel:"Fotografering",dato:huIso(new Date(Date.now()+86400000)),tid:"09:00",tid_slut:"11:00"}]; OPGAVER.push({id:"mko1",titel:"Bestil nye poser",deadline:"2026-10-30",done:false,aktiv:true},{id:"mko2",titel:"Ring til leverandøren",deadline:"2026-11-05",done:false,aktiv:true}); }catch(e){}
  showTab(3); try{ hjemUgeTegn(); }catch(e){} await vent(1500);
  var rod=document.getElementById("hjemUge"); if(!rod){ fejl("HJEM: #hjemUge findes ikke"); return; }
  N++; if([].slice.call(document.querySelectorAll("#screen3 .idag-roed, #hjemUge .hu-naeste .idag-roed")).some(synlig)) fejl("HJEM: den røde flise (Næste skridt / I dag) står stadig");
  N++; if(document.querySelector("#hjemUge .hu-visning")) fejl("HJEM: Dag/Uge-chips står stadig");
  if(TLF){ N++; if(document.querySelector("#screen3 .mb-bjaelke")&&synlig(document.querySelector("#screen3 .mb-bjaelke"))) fejl("HJEM tlf: datobjælken må kun stå på computer"); return; }
  var bj=document.querySelector("#screen3 .mb-bjaelke"); N++; if(bj) fejl("HJEM: den røde datobjælke skal være væk (Ida 11/11)"); var dt=document.querySelector("#screen3 .mb-baand .mb-navn .mb-dato"); N++; if(!dt||!synlig(dt)) fejl("HJEM: datoen mangler under hilsnen i heroen (Ida 11/11)");
  var ps=[].slice.call(rod.querySelectorAll(".hh-panel")); N++; if(ps.length!==2) fejl("HJEM: forventer to paneler, fandt "+ps.length);
  ps.forEach(function(pn,i){ var s=getComputedStyle(pn);
    /* v3433 · FORSIDEN I AFSNIT (Ida 22/11: »rammer omkring det der hører sammen«): står panelet i et afsnit (.hu-afsnit), er RAMMEN flisen — 1 px kant · hjørner 28 · polstring 24 (telefon 20/16) — og panelet selv har ingen flade. Uden afsnit gælder den gamle form (hvid · 28 · 12). */
    var af=pn.closest(".hu-afsnit"), sa=af?getComputedStyle(af):null;
    if(sa){ er("HJEM afsnit", af, px(sa.borderTopWidth)===1&&px(sa.borderTopLeftRadius)===28&&(px(sa.paddingTop)===24||px(sa.paddingTop)===20), "kant "+sa.borderTopWidth+" r"+sa.borderTopLeftRadius+" luft "+sa.padding+" (skal 1 px · 28 · 24, telefon 20/16)"); }
    else er("HJEM panel", pn, rgb(s.backgroundColor)==="rgb(255,255,255)"&&px(s.borderTopLeftRadius)===28&&px(s.paddingTop)===12&&px(s.paddingLeft)===12, s.backgroundColor+" r"+s.borderTopLeftRadius+" luft "+s.padding+" (skal hvid · 28 · 12)");
    var fl=[].slice.call(pn.children); fl.forEach(function(f,k){ var fs=getComputedStyle(f), fr=f.getBoundingClientRect(); er("HJEM flise i panel", f, Math.round(fr.height)===80&&px(fs.borderTopLeftRadius)===20&&px(fs.borderTopWidth)===1&&rgb(fs.borderTopColor)==="rgb(222,222,222)"&&fs.boxShadow!=="none"/* v3428 (HÅRD, Ida 22/11): hvide fliser på hvid baggrund har altid en synlig skygge — VÆLTER »ingen skygge« fra 15/11 */, "h"+Math.round(fr.height)+" r"+fs.borderTopLeftRadius+" kant "+fs.borderTopWidth+" "+fs.borderTopColor+" skygge "+(fs.boxShadow==="none"?"nej":"JA")+" (skal 80 · 20 · 1 px #DEDEDE · synlig skygge)"); if(k>0){ var g=Math.round(fr.top-fl[k-1].getBoundingClientRect().bottom); er("HJEM flise-afstand", f, Math.abs(g-10)<=1, "afstand "+g+" (skal 10)"); } });
    var sek=pn.previousElementSibling; if(sek){ var d=Math.round(pn.getBoundingClientRect().top-sek.getBoundingClientRect().bottom); er("HJEM overskrift→panel", pn, Math.abs(d-16)<=1, "afstand "+d+" (skal 16)"); }
    var nx=pn.nextElementSibling; if(nx&&nx.classList.contains("hu-sek")){ var d2=Math.round(nx.getBoundingClientRect().top-pn.getBoundingClientRect().bottom); er("HJEM panel→næste overskrift", nx, Math.abs(d2-24)<=1, "afstand "+d2+" (skal 24)"); } });
  var sb0=rod.querySelector(".hpt-h > .hu-sek"), st=rod.querySelector(".hu-strib-rk .hu-strib"); if(sb0&&st){ N++; var dd=Math.abs(sb0.getBoundingClientRect().top-st.getBoundingClientRect().top); if(dd>1) fejl("HJEM: højre kolonnes første overskrift flugter ikke med datofliserne ("+Math.round(dd)+" px forskel)"); }
  var pl=[].slice.call(rod.querySelectorAll(".hu-strib-rk > .hu-pil")); N++; if(pl.length!==2||pl.some(function(b){var r=b.getBoundingClientRect();return Math.round(r.width)!==32||Math.round(r.height)!==32})) fejl("HJEM: pilene skal være to runde 32 px knapper ved datofliserne");
}
async function maalForloeb(vent){
  /* TELEFONEN HAR SIN EGEN FORM FRA 12/11 (måles i TLF-grenen nedenfor); bud 1 gælder computeren. */
  /* FORLØBSSIDEN = BUD 1 (Ida 4/11 »implementer bud 1«): én stor flise for det åbne modul (sort titel 18/telefon 16, antal 12, rød knap 44), SENERE-rækker 64 (dæmpede, 1 px #DEDEDE, ingen skygge), FÆRDIGE-rækker, sektionsetiket 10 versal, 32 under heroen, 24 mellem sektioner, 10 mellem fliser; ingen rød titel/kant/stribe; NÆSTE SKRIDT/Lektioner set/Opgaver er væk */
  var idag=datoDK(); var L=function(m,n,v){var a=[];for(var i=1;i<=n;i++)a.push({id:m+"-"+i,titel:"Lektion "+m+"."+i,video:v===false?"":"x.mp4"});return a;};
  CURRENT_DEF=Object.assign({},CURRENT_DEF||{},{type:"kursus",forloeb:"YOU GOT THIS"});
  var scen=[["åben",[["Modul 0 · Introduktion til forløbet",L(1,5)],["Modul 1 · Mennesket",L(2,6,false)],["Modul 2 · Energibanken",L(3,4,false)],["Modul 3 · Hvorfor er du, som du er",L(4,4)]],{"1":0,"2":0,"3":6,"4":14},[]],
            ["flere",[["Modul 0 · Introduktion til forløbet",L(1,5)],["Modul 1 · Mennesket",L(2,6)],["Modul 2 · Energibanken",L(3,4)],["Modul 3 · Hvorfor er du, som du er",L(4,4)]],{"1":0,"2":0,"3":0,"4":5},["1-1","1-2","1-3","1-4","1-5"]]];
  for(var si=0;si<scen.length;si++){
    TRIN="forløb "+scen[si][0];
    KURSUS_MODULER.splice.apply(KURSUS_MODULER,[0,KURSUS_MODULER.length].concat(scen[si][1].map(function(m){return {titel:m[0],lektioner:m[1]};})));
    window.pubErPubliceret=function(){return true;}; YGT_START=idag; Object.assign(YGT_DAG,scen[si][2]); KURSUS_SET={}; scen[si][3].forEach(function(i){KURSUS_SET[i]=true;}); OB_SKEMA=true;
    showTab(12); try{renderKursusHjem();}catch(e){} await vent(900);
    var rod=document.getElementById("forloebTidslinje"); if(!rod||!rod.querySelector(".ftl2")){ fejl("FORLØB: bud 1-listen (.ftl2) findes ikke"); return; }
    var skr=document.getElementById("screen12").innerText;
    N++; if(/Næste skridt|NÆSTE SKRIDT|Opgaver\s*\d|OPGAVER\s*\d/.test(skr) || /^\s*(Lektioner set|LEKTIONER SET)\s*$/m.test(skr)) fejl("FORLØB: Næste skridt / Lektioner set / Opgaver står stadig på siden");
    if(TLF){
      /* FORLØBET PÅ TELEFONEN (Idas ja 12/11, Artifact Y6aQibKkUGRDRQFiAZTPuh): overskrift over fliser 12 versal · 1,5 · #686868, 8 ned til flisen og 32 fra forrige · modulet = hvid flise (20 · skygge · ingen kant), titel 17 sort ·
         hver lektion sin egen flise som søskende, 14 px inde, 10 imellem · rækker (færdige og låste) = hvide fliser ≥64 med 10 imellem. Computeren måles som før (bud 1, 4/11). */
      var h1=document.querySelector("#forloebTidslinje .ftl2-hoved"); if(h1&&!rod.querySelector(".ftl2-stor .lks-lek")){ h1.click(); await vent(300); rod=document.getElementById("forloebTidslinje"); }
      [].slice.call(rod.querySelectorAll(".ftl2-sek")).filter(synlig).forEach(function(e,i){ var t=e.querySelector("span"), ts=getComputedStyle(t), r=e.getBoundingClientRect();
        er("FORLØB tlf overskrift", t, px(ts.fontSize)===12&&ts.textTransform==="uppercase"&&rgb(ts.color)===G2&&ts.fontWeight==="400"&&px(ts.letterSpacing)===1.5, ts.fontSize+" "+ts.color+" ls"+ts.letterSpacing+" (skal 12 versal · #686868 · 1,5)");
        var nx=e.nextElementSibling; if(nx){ var d=Math.round(nx.getBoundingClientRect().top-r.bottom); er("FORLØB tlf overskrift→flise", e, Math.abs(d-8)<=1, "afstand "+d+" (skal 8)"); }
        var pv=e.previousElementSibling; if(pv&&synlig(pv)&&(pv.classList.contains("ftl2-rk")||pv.classList.contains("ftl2-stor"))){ var d2=Math.round(r.top-pv.getBoundingClientRect().bottom); er("FORLØB tlf flise→overskrift", e, Math.abs(d2-32)<=1, "afstand "+d2+" (skal 32)"); } });
      var kt=rod.querySelector(".ftl2-stor .ftl2-kort"); N++; if(!kt) fejl("FORLØB tlf: det åbne modul har ingen flise (.ftl2-kort)");
      if(kt){ var kc=getComputedStyle(kt), kr=kt.getBoundingClientRect(); er("FORLØB tlf modulflise", kt, px(kc.borderTopLeftRadius)===20&&rgb(kc.backgroundColor)==="rgb(255,255,255)"&&px(kc.borderTopWidth)===0&&kc.boxShadow!=="none", "r"+kc.borderTopLeftRadius+" "+kc.backgroundColor+" kant "+kc.borderTopWidth+" (skal 20 · hvid · skygge · ingen kant)");
        var tn=kt.querySelector(".ftl2-n"), tns=getComputedStyle(tn); er("FORLØB tlf modultitel", tn, px(tns.fontSize)===17&&tns.fontWeight==="400"&&rgb(tns.color)===SORT, tns.fontSize+"/"+tns.fontWeight+" "+tns.color+" (skal 17/400 sort)");
        var lf=[].slice.call(rod.querySelectorAll(".ftl2-stor .ftl2-lek .lks-lek")).filter(synlig); N++; if(lf.length) fejl("FORLØB tlf: det åbne modul folder lektionerne ud (Ida 20/11: klik fører til modulsiden, ingen fold-ud)");
        lf.forEach(function(e,i){ var c=getComputedStyle(e), r=e.getBoundingClientRect();
          er("FORLØB tlf lektionsflise", e, px(c.borderTopLeftRadius)===20&&rgb(c.backgroundColor)==="rgb(255,255,255)"&&c.boxShadow!=="none"&&Math.round(r.height)>=64&&Math.abs(Math.round(r.left-kr.left)-14)<=1, "r"+c.borderTopLeftRadius+" h"+Math.round(r.height)+" ind "+Math.round(r.left-kr.left)+" (skal 20 · hvid · skygge · ≥64 · 14 inde)");
          var f0=i===0?kt:lf[i-1], d=Math.round(r.top-f0.getBoundingClientRect().bottom); er("FORLØB tlf flise→lektion", e, Math.abs(d-12)<=1, "afstand "+d+" (skal 12 — afstandsskalaen 14/11)"); });
        N++; if(kt.querySelector(".lks-lek")) fejl("FORLØB tlf: en lektion ligger inde i modulets flise (hver lektion skal være sin egen flise)"); }
      [].slice.call(rod.querySelectorAll(".ftl2 > .ftl2-rk")).filter(synlig).forEach(function(e){ var c=getComputedStyle(e), r=e.getBoundingClientRect();
        er("FORLØB tlf række", e, Math.round(r.height)>=64&&px(c.borderTopLeftRadius)===20&&(e.matches(".laast")?(rgb(c.backgroundColor)==="rgb(255,255,255)"&&px(c.borderTopWidth)===1&&px(c.borderLeftWidth)===1&&rgb(c.borderTopColor)==="rgb(222,222,222)"&&rgb(c.borderLeftColor)==="rgb(222,222,222)"):(rgb(c.backgroundColor)==="rgb(255,255,255)"&&c.boxShadow!=="none"&&px(c.borderTopWidth)===0)), "h"+Math.round(r.height)+" r"+c.borderTopLeftRadius+" "+c.backgroundColor+" kant "+c.borderTopWidth+" "+c.borderTopColor+" (skal ≥64·20 · hvid række: skygge uden kant · låst række: hvid med ramme 1 px #DEDEDE på alle sider — v3395)");
        var nx=e.nextElementSibling; if(nx&&nx.classList.contains("ftl2-rk")){ var d=Math.round(nx.getBoundingClientRect().top-r.bottom); er("FORLØB tlf række→række", nx, Math.abs(d-12)<=1, "afstand "+d+" (skal 12 — afstandsskalaen 14/11)"); } });
      [].slice.call(rod.querySelectorAll("*")).filter(synlig).forEach(function(e){ if(e.closest(".ftl2-pil, .lks-fort, .lks-fb, .lks-num, svg, .lek-favchips")||e.tagName==="svg") return; var cs=getComputedStyle(e); var tekst=[].some.call(e.childNodes,function(n){return n.nodeType===3&&n.textContent.trim();}); N++; if(tekst&&rgb(cs.color)===RED) fejl("FORLØB tlf: rød tekst »"+txt(e)+"« ["+kl(e)+"] — rød er aldrig titel"); });
      var h2=document.querySelector("#forloebTidslinje .ftl2-hoved"); if(h2&&document.querySelector("#forloebTidslinje .ftl2-stor .lks-lek")){ h2.click(); await vent(250); }
      continue;
    }
    /* sektionsetiketter */
    var seks=[].slice.call(rod.querySelectorAll(".ftl2-sek")).filter(synlig);
    seks.forEach(function(e,i){ var cs=getComputedStyle(e), t=e.querySelector("span"), ts=getComputedStyle(t), r=e.getBoundingClientRect();
      er("FORLØB sektionsetiket", t, Math.round(r.height)===16&&px(ts.fontSize)===12&&ts.textTransform==="uppercase"&&rgb(ts.color)==="rgb(104,104,104)"&&ts.fontWeight==="400"&&px(ts.letterSpacing)===1.5, "h"+Math.round(r.height)+" "+ts.fontSize+" "+ts.color+" ls"+ts.letterSpacing+" (skal 16 · 12 versal · #686868 · 1,5 — overskrift over fliser, LÅST 12/11)");
      var nx=e.nextElementSibling; if(nx){ var d=Math.round(nx.getBoundingClientRect().top-r.bottom); er("FORLØB etiket→flise", e, Math.abs(d-8)<=1, "afstand "+d+" (skal 8 — afstandsskalaen 14/11)"); }
      if(i>0){ var pv=e.previousElementSibling, d2=Math.round(r.top-pv.getBoundingClientRect().bottom); er("FORLØB sektion→sektion", e, Math.abs(d2-32)<=1, "afstand "+d2+" (skal 32 — afstandsskalaen 14/11)"); } });
    /* 32 under heroen */
    var hero=document.querySelector("#screen12 .mb-baand"), foerst=[].slice.call(document.getElementById("screen12").querySelectorAll("#forloebBento > *, #forloebTidslinje > .ftl2 > *")).filter(synlig)[0];
    if(hero&&foerst){ var dh=Math.round(foerst.getBoundingClientRect().top-hero.getBoundingClientRect().bottom)+28; /* arket ligger 28 px over båndet */ er("FORLØB luft under heroen", foerst, Math.abs(dh-32)<=1, "afstand "+dh+" (skal 32)"); }
    /* den store flise */
    var st=rod.querySelector(".ftl2-stor"); N++; if(!st) fejl("FORLØB: den åbne modul er ikke en stor flise");
    if(st){ var cs=getComputedStyle(st), r=st.getBoundingClientRect(), hv=st.querySelector(".ftl2-hoved"), hs=getComputedStyle(hv);
      er("FORLØB stor flise", st, px(cs.borderTopLeftRadius)===20&&rgb(cs.backgroundColor)==="rgb(255,255,255)"&&px(cs.borderTopWidth)===0&&cs.boxShadow!=="none"&&px(hs.paddingTop)===18&&px(hs.paddingLeft)===20&&px(hs.paddingRight)===20, "r"+cs.borderTopLeftRadius+" luft "+hs.padding+" kant "+cs.borderTopWidth+" skygge "+(cs.boxShadow==="none"?"ingen":"ja")+" (skal 20 · 18/20 · hvid · skygge · ingen kant)");
      N++; if(st.querySelector(".ftl2-tag")) fejl("FORLØB: ÅBEN-etiketten skal være væk (Ida 6/11)"); N++; if(rod.querySelector(".ftl2-sek") && /dit forløb/i.test(rod.querySelector(".ftl2-sek").textContent)) fejl("FORLØB: overskriften DIT FORLØB under coveret skal være væk (Ida 6/11)");
      var ti=st.querySelector(".ftl2-n"), tis=getComputedStyle(ti); er("FORLØB modultitel", ti, px(tis.fontSize)===(TLF?16:18)&&tis.fontWeight==="400"&&rgb(tis.color)===SORT&&/Poppins/.test(tis.fontFamily), tis.fontSize+"/"+tis.fontWeight+" "+tis.color+" (skal "+(TLF?16:18)+"/400 #1A1A1A — aldrig rød)");
      var an=st.querySelector(".ftl2-a"), ans=getComputedStyle(an); er("FORLØB antal lektioner", an, px(ans.fontSize)===12&&rgb(ans.color)===G3&&/lektion|^\d+ videoe?r? og 1 spørgeskema/.test(String(an.textContent||"").trim()), ans.fontSize+" "+ans.color+" »"+String(an.textContent||"").trim()+"« (skal 12 · #686868 · »N lektioner« eller, i modulet med spørgeskemaet, »N videoer og 1 spørgeskema« — v3439, kunderejsen punkt 3)");
      var pl=st.querySelector(".ftl2-pil"); N++; if(pl||st.querySelector(".ftl2-knap")) fejl("FORLØB: modulflisen må hverken have pil eller knap (Ida 20/11: »denne skal så fjernes fra modulfliserne fordi man nu klikker ind« — vælter 6/11)"); N++; if(!st.querySelector(".ftl2-hoved > .ftl2-ck")) fejl("FORLØB: modulflisen mangler cirklen til venstre (Ida 20/11)");
      if (pl) { var pr=pl.getBoundingClientRect(), pv=pl.querySelector("svg"), pcs=pv?getComputedStyle(pv):null, hr=hv.getBoundingClientRect();
        er("FORLØB rød pil", pl, Math.round(pr.width)===44&&Math.round(pr.height)===44&&!!pcs&&rgb(pcs.color)===RED&&!/\S/.test(pl.textContent), "b"+Math.round(pr.width)+" h"+Math.round(pr.height)+" "+(pcs?pcs.color:"ingen pil")+" (skal 44×44 · rød pil uden tekst)");
        var pdy=Math.abs((pr.top+pr.height/2)-(hr.top+hr.height/2)); N++; if(pdy>1) fejl("FORLØB pil: ikke lodret midt i flisens øverste del ("+Math.round(pdy*10)/10+" px)");
        var pdx=Math.round(r.right-pr.right); N++; if(Math.abs(pdx-20)>1) fejl("FORLØB pil: står "+pdx+" fra højre kant (skal 20)"); } }
    /* rækker: SENERE (låst) og FÆRDIGE */
    [].slice.call(rod.querySelectorAll(".ftl2-rk")).filter(synlig).forEach(function(e){ var cs=getComputedStyle(e), r=e.getBoundingClientRect();
      er("FORLØB række", e, Math.round(r.height)>=64&&Math.round(r.height)<=100&&px(cs.borderTopLeftRadius)===20&&rgb(cs.backgroundColor)==="rgb(255,255,255)"&&px(cs.borderTopWidth)===1&&rgb(cs.borderTopColor)==="rgb(222,222,222)"&&cs.boxShadow==="none", "h"+Math.round(r.height)+" r"+cs.borderTopLeftRadius+" "+cs.backgroundColor+" kant "+cs.borderTopWidth+" "+cs.borderTopColor+" skygge "+cs.boxShadow.slice(0,20)+" (skal ≥64·20·1px #DEDEDE)");
      if(e.classList.contains("laast")&&!e.querySelector(".ftl2-a")){ N++; var H=innerWidth>899?80:64;if(Math.round(r.height)!==H)fejl("FORLØB låst "+Math.round(r.height)+"/"+H); }
      var FK=e.classList.contains("laast")?SORT:G2, n=e.querySelector(".ftl2-n"), ns=getComputedStyle(n); var F=innerWidth>899?18:15;er("FORLØB række-titel",n,px(ns.fontSize)===F&&ns.fontWeight==="400"&&rgb(ns.color)===FK,ns.fontSize+" "+ns.color+" (skal "+F+")");
      var a=e.querySelector(".ftl2-a"); if(a){ var as=getComputedStyle(a); er("FORLØB række-antal", a, px(as.fontSize)===12&&rgb(as.color)===FK, as.fontSize+" "+as.color+" (skal 12 · sort paa blaa)"); }
      var h=e.querySelector(".ftl2-h > span"), hs2=getComputedStyle(h); er("FORLØB række-højre", h, px(hs2.fontSize)===12&&rgb(hs2.color)===FK, hs2.fontSize+" "+hs2.color+" (skal 12 · sort)");
      var rr=h.parentElement.getBoundingClientRect(); N++; if(Math.abs((r.right-rr.right)-21)>2) fejl("FORLØB række: højre indhold står "+Math.round(r.right-rr.right)+" fra kanten (skal ~21)");
      var yy=Math.abs((r.top+r.height/2)-(h.getBoundingClientRect().top+h.getBoundingClientRect().height/2)); N++; if(yy>1.5) fejl("FORLØB række: højre tekst er ikke lodret midt ("+Math.round(yy*10)/10+")");
    });
    var rk=[].slice.call(rod.querySelectorAll(".ftl2 > .ftl2-rk")).filter(synlig); rk.forEach(function(e,i){ var nx=e.nextElementSibling; if(nx&&nx.classList.contains("ftl2-rk")){ var d=Math.round(nx.getBoundingClientRect().top-e.getBoundingClientRect().bottom); er("FORLØB række→række", nx, Math.abs(d-12)<=1, "afstand "+d+" (skal 12 — afstandsskalaen 14/11)"); } });
    /* ALDRIG RØD TITEL, KANT ELLER STRIBE på siden (undtagen knappen og markørerne) */
    [].slice.call(rod.querySelectorAll("*")).filter(synlig).forEach(function(e){ if(e.closest(".ftl2-pil, .ftl2-knap, .lks-fb, .lks-num, svg")||e.tagName==="svg") return; var cs=getComputedStyle(e); var tekst=[].some.call(e.childNodes,function(n){return n.nodeType===3&&n.textContent.trim();});
      N++; if(tekst&&rgb(cs.color)===RED) fejl("FORLØB: rød tekst »"+txt(e)+"« ["+kl(e)+"] — rød er aldrig titel");
      ["Top","Right","Bottom","Left"].forEach(function(k){ if(px(cs["border"+k+"Width"])>0&&cs["border"+k+"Style"]!=="none"&&rgb(cs["border"+k+"Color"])===RED&&!e.classList.contains("lks-tom")) fejl("FORLØB: rød kant ("+k+") på ["+kl(e)+"]"); }); });
    N++; if(rod.querySelector(".ftl2-stor")&&/rgb\(252, ?36, ?4\)/.test(getComputedStyle(rod.querySelector(".ftl2-stor")).boxShadow)) fejl("FORLØB: den store flise har rød skygge/kant");
  }
  /* FOLD: trykket på den store flise åbner lektionslisten, og knappen går ind i den første ikke-sete lektion */
  /* INGEN FOLD-UD PÅ ÅBNE MODULER (Ida 20/11: »vi dropper drop down muligheden ved modulerne - men at man ved klik på modul flisen kommer ind på modulsiden«): trykket åbner modulets næste lektion */
  TRIN="forløb klik"; var h0=document.querySelector("#forloebTidslinje .ftl2-hoved"); if(h0){ N++; if(!/visLektion\(/.test(h0.getAttribute("onclick")||"")) fejl("FORLØB: den store flise fører ikke til modulsiden (onclick: "+h0.getAttribute("onclick")+")"); h0.click(); await vent(400); N++; if(document.querySelector("#forloebTidslinje .ftl2-stor .lks-lek")) fejl("FORLØB: tryk på den store flise folder lektionslisten ud (skal føre til modulsiden)"); N++; if(!LEK_AABEN) fejl("FORLØB: tryk på den store flise åbner ikke modulsiden"); try{ lukLektion(); }catch(e){} await vent(200); }
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
  /* SIDESKIFTET (Ida 19/11 — afløser 4/11: »den skal blive på siden indtil den nye er loadet«): fra kalenderen ind i briefen står den GAMLE side stille (frosset), til den nye er klar —
     intet tredje, ingen halvbygget ny side, intet tomt. Loaderen (#skDaek, markbilledet) må først komme efter 900 ms (kun rigtig langsomt net). Hakjægeren (SELE HAK) måler blinket i rigtig tid. */
  TRIN="dækflade"; showTab(8); await vent(900);
  var uden=[], prøver=0, holdt=false, tidligLoader=null, t0=performance.now();
  var pt=function(){ var ref=document.querySelector(".content"); var r=ref?ref.getBoundingClientRect():{left:0,width:innerWidth}; return [Math.round(r.left+r.width/2), Math.round(innerHeight/2)]; };
  var tikker=true; (function frame(){ if(!tikker) return; if(document.body.classList.contains("sk-holder")){ holdt=true; prøver++; var p=pt(), el=document.elementFromPoint(p[0],p[1]), ms=Math.round(performance.now()-t0);
    if(el&&el.closest("#skDaek")){ if(ms<850&&!tidligLoader) tidligLoader=ms; }
    else if(!el||!el.closest("#screen8")) uden.push((el&&kl(el))||"intet"); } requestAnimationFrame(frame); })();
  openBriefSide("mk1"); await vent(2600); tikker=false;
  N++; if(holdt&&uden.length) fejl("SIDESKIFT: under skiftet sås andet end den gamle side ("+uden.length+" af "+prøver+" billeder, fx "+uden[0]+")");
  N++; if(tidligLoader!==null) fejl("SIDESKIFT: loaderen kom allerede efter "+tidligLoader+" ms — den må først komme efter 900 ms");
  N++; if(document.getElementById("skDaek")&&getComputedStyle(document.getElementById("skDaek")).display!=="none") fejl("SIDESKIFT: loaderen står stadig, efter briefen er klar");
  try{ document.querySelectorAll("#turOverlay,.tur-slor,#turKort,#nyVersion,#dagensKort").forEach(function(e){e.remove()}); }catch(e){}
  if(!document.body.classList.contains("mb")){ console.log("SELE MAAL FEJL: body.mb er ikke aktiv paa "+innerWidth); return; }
  TRIN="forside"; await vent(400); maalSide(); maalHero(); maalForsideTlf(); TRIN="upload"; try{ await maalUpload(vent); }catch(e){ fejl("upload-trin: "+(e&&e.message)); } TRIN="forside";
  for(var side=0; side<4; side++){ BRIEF_SIDE_AKTIV=side; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); await vent(250); TRIN="side"+side; document.querySelectorAll("#briefWrap textarea").forEach(function(x){x.classList.add("mb-felt")}); maalSide(); maalHero();
    /* TELEFONEN: første side har to trin (Fakta · Overblikket, 19/11 »Fakta som trin: KUN på telefonen«) — begge måles */
    if(side===0&&BRIEF_TRIN_INFO&&BRIEF_TRIN_INFO.n>1){ for(var tt=1; tt<BRIEF_TRIN_INFO.n; tt++){ BRIEF_SIDE_AKTIV=0; BRIEF_TRIN_AKTIV=tt; briefMbVis("skriv"); await vent(250); TRIN="side0 trin"+(tt+1); document.querySelectorAll("#briefWrap textarea").forEach(function(x){x.classList.add("mb-felt")}); maalSide(); maalHero(); } } }
  TRIN="hjem"; try{ await maalHjem(vent); }catch(e){ fejl("hjem-trin: "+(e&&e.message)); }
  TRIN="story"; try{ IDEER.push({id:"mk2",titel:"Story uden type",soejle:"Story",type:"Story",status:"Planlagt",dato:"2026-11-12",brief:{format:"Story",storyserie:[{t:"",q:"",s:["",""],m:""}]}}); openBriefSide("mk2"); await vent(1500); maalStory(); showTab(8); await vent(900); maalStory.kalender&&0; N++; if(document.querySelector(".ss-stknap")) fejl("kalender: story-flisen har stadig statuspil"); }catch(e){ fejl("story-trin: "+(e&&e.message)); }
  TRIN="forløb"; try{ await maalForloeb(vent); }catch(e){ fejl("forløb-trin: "+(e&&e.message)); }
  clearTimeout(VAGT);
  if(FUND.length){ FUND.forEach(function(f){ console.log("SELE MAAL FEJL: "+f); }); console.log("SELE MAAL IKKE OK: "+FUND.length+" afvigelser af "+N+" målinger paa "+innerWidth); }
  else console.log("SELE MAAL OK: "+N+" målinger paa "+innerWidth+", 0 afvigelser");
} catch(e){ console.log("SELE MAAL FEJL probe: "+(e&&e.message)+" — "+TRIN+" — "+String(e&&e.stack||"").split("\n").slice(0,3).join(" | ")); }
}, 2500);
