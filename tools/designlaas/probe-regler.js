/* REGEL-PORTEN (Ida 14/11): de tre låste regler måles, så de ikke glider igen.
   1) en valgt chip er rød med hvid tekst og uden flueben · 2) en dropdown har Content kalenderens form · 3) en knap med tekst er 56 høj på telefonen og 44 på computeren (Idas klik 14/11).
   Dertil køen fra 14/11: kalenderens røde knap hedder »+ Ny«, Drive-mappen står ikke i værktøjslinjen, og briefen på computeren har ingen blyant ved status.
   Kører på den bredde, vinduet har (390 og 1440). Én afvigelse = linje med »FEJL«, og porten (koer.sh) stopper. */
function px(v){ return Math.round(parseFloat(v)*10)/10||0; }
function rgb(c){ return (c||"").replace(/\s/g,""); }
function synlig(e){ var r=e.getBoundingClientRect(); if(r.width<2||r.height<2) return false; var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||cs.opacity==="0") return false; return !e.closest("[hidden]"); }
function txt(e){ return (e.innerText||e.getAttribute("aria-label")||e.placeholder||"").replace(/\s+/g," ").trim().slice(0,26); }
function kl(e){ return (e.className&&e.className.toString().split(" ").filter(Boolean).slice(0,2).join("."))||e.tagName.toLowerCase(); }
var FUND=[], N=0, TRIN="start";
function fejl(s){ FUND.push(TRIN+" · "+s); }
function er(navn, e, ok, hvad){ N++; if(!ok) fejl(navn+" »"+txt(e)+"« ["+kl(e)+"] "+hvad); }
var TLF=innerWidth<900;
var RED="rgb(252,36,4)", SORT="rgb(26,26,26)", G2="rgb(104,104,104)", KANT="rgb(222,222,222)";   /* kundeappens kanter er husets grå #DEDEDE (Ida 15/11: den blå #DCE8F0 fra 14/11 er væltet) */
function maalLaas1411(){
  document.querySelectorAll(".ark-chip.on, .ss-chip.on, .cm-chip.on, .chip-btn.on, .ark-vchip.on, .kk-chip.on, .lek-favchip.valgt").forEach(function(e){
    if(!synlig(e)||/dbtn|sa-lang|kk-ini|sa-ved-ik|bs3-drop|cv-plus|bdrop|fb-hc/.test(e.className)) return; var cs=getComputedStyle(e), af=getComputedStyle(e,"::after");
    er("VALGT CHIP", e, rgb(cs.backgroundColor)===RED&&rgb(cs.color)==="rgb(255,255,255)", "flade "+cs.backgroundColor+" tekst "+cs.color+" (skal rød #FC2404 med hvid tekst)");
    er("VALGT CHIP flueben", e, af.content==="none"||af.display==="none", "har et mærke efter teksten (valgt vises kun med rød flade)");
  });
  /* IKKE VALGT CHIP = HVID · GRAA KANT · GRAA TEKST (Ida 15/11: »neutral baggrund og grå streg og grå tekst«) */
  document.querySelectorAll(".ark-chip, .ss-chip, .cm-chip, .mb-chip, .chip-btn:not(.bdrop-rk), .ark-vchip, .kk-chip, .lek-favchip, .ibb-chip, .kop-chip, .pr-chip, .fb-chip").forEach(function(e){
    if(!synlig(e)||/dbtn|sa-lang|kk-ini|sa-ved-ik|bs3-drop|cv-plus|bdrop|fb-hc|kv-vaelg|dl-plus|mb-roed|roed/.test(e.className)||e.matches(".on, .valgt, [aria-pressed='true'], [aria-checked='true']")||e.closest(".hero, .mb-baand, .cover")||e.closest("#b3Trin.b3-trin-pc")/* v3423 (bud 9): computerens trin er en vælger, ikke chips — måles af probe-brief.js »TRIN« */) return; var cs=getComputedStyle(e);
    /* BRIEFENS TILVALGS-CHIPS ER UDEN BAGGRUND (DESIGNLÅS 18/11 »Felterne = bud 3«: »tilvalgs-chips til højre uden baggrund«; chipsene er nævnt i 19/11: »+ Tekst«, »+ Manus«, »+ Klip«, »+ Scene« og »Vælg fra hashtagbanken«).
       Før: hver chip skulle selv være hvid. Nu: en tilvalgs-chip i briefen må stå uden egen flade, men KUN når fladen lige bag den er hvid — så den stadig ses som hvid med grå kant. Kant og tekst måles som før. Alle andre chips: uændret. */
    var tilvalg=!!e.closest("#briefWrap")&&/^\+?\s?(Tekst|Manus|Klip|Scene)$|^Vælg fra hashtagbanken$/.test((e.innerText||"").replace(/\s+/g," ").trim()), bag="";
    if(tilvalg&&/rgba\(0,0,0,0\)|transparent/.test(rgb(cs.backgroundColor))){ for(var an=e.parentElement; an; an=an.parentElement){ var ab=rgb(getComputedStyle(an).backgroundColor); if(!/rgba\(0,0,0,0\)|transparent/.test(ab)){ bag=ab; break; } } }
    er("IKKE VALGT CHIP", e, (rgb(cs.backgroundColor)==="rgb(255,255,255)"||bag==="rgb(255,255,255)")&&px(cs.borderTopWidth)>=1&&rgb(cs.borderTopColor)===KANT&&rgb(cs.color)===G2, "flade "+cs.backgroundColor+" kant "+cs.borderTopWidth+" "+cs.borderTopColor+" tekst "+cs.color+" (skal hvid · 1 px #DEDEDE · grå #686868)");
  });
  document.querySelectorAll(".bs3-drop, .bdrop-knap, select:not([multiple]):not([size])").forEach(function(e){   /* ALLE dropdowns (v3271), ikke kun briefens status */
    if(!synlig(e)||e.closest(".ark-hvid, .ark-bue")) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect(), sp=e.matches(".bs3-drop:not([data-etiket])")?e.querySelector("span"):null, sv=e.matches(".bs3-drop")?e.querySelector("svg"):null;
    er("DROPDOWN form", e, Math.round(r.height)===44&&px(cs.borderTopLeftRadius)===14&&px(cs.borderTopWidth)===1&&rgb(cs.borderTopColor)===KANT&&rgb(cs.backgroundColor)==="rgb(255,255,255)"&&px(cs.paddingLeft)===14, "h"+Math.round(r.height)+" r"+cs.borderTopLeftRadius+" kant "+cs.borderTopColor+" flade "+cs.backgroundColor+" luft "+cs.paddingLeft+" (skal 44 · r14 · 1 px #DEDEDE · hvid · luft 14)");
    if(sp){ var ss=getComputedStyle(sp), rg=document.createRange(); rg.selectNodeContents(sp); var tr=rg.getBoundingClientRect(); er("DROPDOWN tekst", e, rgb(ss.color)===SORT&&Math.abs(tr.left-r.left-15)<=2, "tekst "+ss.color+", "+Math.round(tr.left-r.left)+" px fra venstre kant (skal sort #1A1A1A, 15 fra kanten)"); }
    if(sv){ var vr=sv.getBoundingClientRect(); er("DROPDOWN pil", e, Math.abs(r.right-vr.right-15)<=2&&rgb(getComputedStyle(sv).color)===G2, "pilen står "+Math.round(r.right-vr.right)+" px fra højre kant i "+getComputedStyle(sv).color+" (skal 15, grå #686868)"); }
  });
  /* TILBAGE PÅ TELEFONEN = PIL OG ORD, INGEN KASSE (18/11, bygget 19/11): mindst 44 trykfelt, ingen flade, ingen kant */
  if (innerWidth < 900) document.querySelectorAll(".cover-tilbage, .mb-sti .mb-tilbage").forEach(function(e){ if(!synlig(e)||!(e.innerText||"").trim()) return; var r=e.getBoundingClientRect(), cs=getComputedStyle(e); var flad=(cs.backgroundColor==="transparent"||/rgba\(0, 0, 0, 0\)/.test(cs.backgroundColor)) && parseFloat(cs.borderTopWidth||0)===0; er("TILBAGE TLF", e, Math.round(r.height)>=44 && flad, "h"+Math.round(r.height)+" bg "+cs.backgroundColor+" kant "+cs.borderTopWidth+" (skal ≥44, ingen flade/kant)"); });
  document.querySelectorAll((innerWidth>=900?".cover-tilbage, ":"")+".navsti .navsti-tilbage, .mb-baand .navsti-tilbage, "+(innerWidth>=900?".mb-baand button.mb-tilbage, ":"")+"#briefRedigerKnap, .dbtn:not(.ark-chip):not(.chip-btn):not(.ss-chip):not(.kk-chip):not(.vt-pille):not(.lku-tilb), .db-knap, .bsam-mobknap:not(.cf-ny), .bsam-knap, .lk-note-alle, .hu-graa, .row-btn, .tom-knap, .prof-gem").forEach(function(e){ if(!synlig(e)||e.closest("#virkMenu, #dashMenu, .burger, #burgerMenu")||!(e.innerText||"").trim()) return; var r=e.getBoundingClientRect(); er("KNAP 56", e, Math.round(r.height)===(innerWidth>=900?44:56), "h"+Math.round(r.height)+" (skal "+(innerWidth>=900?44:56)+")"); });
}
function maalKalender1411(){
  var ny=document.querySelector("#kalBlok .cal-header .vt-primaer"); if(ny&&synlig(ny)) er("KALENDER knap", ny, (ny.innerText||"").trim()==="+ Ny", "hedder »"+(ny.innerText||"").trim()+"« (skal »+ Ny«)");
  N++; if(document.getElementById("kalVtDrive")) fejl("KALENDER: Drive-mappen står stadig i værktøjslinjen");
}

var VAGT=setTimeout(function(){ console.log("SELE REGLER FEJL: proben nåede ikke i mål på 60 s — sidste trin: "+TRIN); },60000);
setTimeout(async function(){ try {
  var vent=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
  for(var v=0;v<40&&!document.body.classList.contains("app-klar");v++) await vent(150);
  ["appLoader","turOverlay","dagensKort","nyVersion"].forEach(function(id){var e=document.getElementById(id); if(e) e.remove();});
  try{ dagensKortLuk(); }catch(e){}
  try{ STRATEGI_TEMAER.push({navn:"Menneskene bag", formaal:"kunderne skal lære os at kende", foelelse:"Dem kan jeg lide", eksempler:[]}); }catch(e){}
  var H1="Vi er aldrig enige om farver";
  IDEER.push({id:"rg1",titel:"To om ét indkøb",soejle:"Menneskene bag",type:"Reel",status:"Brief i gang",dato:"2026-11-10",brief:{format:"Reel",platform:["Instagram"],beskrivelse:"Vi viser, hvordan vi to vælger forskelligt.",hookTekst:H1,hookTekstListe:[H1,"Min kollega vælger altid det modsatte"],hookTekstValgt:0,klip:[{ser:"Vi står med hver vores favorit",tekst:H1,siger:"Vi er aldrig enige"},{ser:"Klip mellem de to valg",tekst:"Hvem har ret?",siger:"Hvem har ret?"}],ctaVideo:"Skriv i kommentarerne",caption:"Vi køber ind sammen.",cta:"Kommentér opslaget",hashtags:"#butiksliv"}});
  IDEER.push({id:"rg2",titel:"Story",soejle:"Story",type:"Story",status:"Planlagt",dato:"2026-11-12",brief:{format:"Story",storytype:"Opbygning til deling",storyserie:[{t:"Tekst",q:"",s:["",""],m:""}]}});
  TRIN="kalender"; showTab(8); await vent(1200); maalKalender1411(); maalLaas1411();
  TRIN="briefoversigt"; openBriefSide("rg1"); await vent(2600);
  try{ document.querySelectorAll("#turOverlay,.tur-slor,#turKort,#nyVersion,#dagensKort").forEach(function(e){e.remove()}); }catch(e){}
  maalLaas1411();
  for(var side=0; side<4; side++){ BRIEF_SIDE_AKTIV=side; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); await vent(300); TRIN="briefens side "+(side+1); maalLaas1411();
    /* KORTET OG DE TO SPALTER (DESIGNLÅS 18/11 »SKRIV · OPTAG · POST PÅ COMPUTEREN«: »vælgeren Skriv · Optag · Post står på titlens linje i det hvide kort, til højre lige før status-vælgeren og de tre prikker« ·
       »Form: én samlet pille, 44 høj, ca. 330 bred, HVID baggrund med kant #DEDEDE; tre lige store felter; det valgte er rødt #FC2404 med hvid tekst; skrift 14. Ingen symboler« · »Kortet har derfor kun én linje …, og trin-rækken står lige under« ·
       19/11 »Computeren har TO spalter«: »faktaboksen (340) til venstre, 32 imellem, og trin-rækken · hjælpeflisen · scenerne · knapperne i ÉN spalte til højre med samme venstre- og højrekant. Hjælpeflisen står over felterne, ikke i en tredje spalte (vælter for den nye brief »tips i højre spalte« fra 15/11)«).
       Før (15/11): status på procesbarens linje til højre for den, og tips i en højre spalte under status. */
    if(innerWidth>=1200){ N++; var q=function(x){return x.getBoundingClientRect()}, mid=function(x){var z=q(x);return (z.top+z.bottom)/2};
      var kort=document.getElementById("b3Kort"), vg=document.getElementById("b3Vaelger"), st=document.querySelector("#b3Hoejre .bs3-drop"), pk=document.querySelector("#b3Hoejre .b3-prik"), ti=kort&&kort.querySelector(".mb-navn"), tr=document.getElementById("b3Trin"), hj=document.getElementById("briefHjaelp"), rl=document.getElementById("briefRail"), nv=document.getElementById("briefSideNav");
      if(kort&&vg&&st&&pk&&ti&&tr&&[kort,vg,st,pk,ti,tr].every(synlig)){
        if(!(Math.abs(mid(vg)-mid(st))<=8&&Math.abs(mid(pk)-mid(st))<=8&&Math.abs(mid(ti)-mid(st))<=8&&q(ti).left<q(vg).left&&q(vg).right<=q(st).left&&q(st).right<=q(pk).left)) fejl("KORTET: titel · vælger · status · tre prikker står ikke på én linje i den rækkefølge (titel y"+Math.round(mid(ti))+", vælger y"+Math.round(mid(vg))+" x"+Math.round(q(vg).left)+"–"+Math.round(q(vg).right)+", status y"+Math.round(mid(st))+" x"+Math.round(q(st).left)+", prikker x"+Math.round(q(pk).left)+")");
        var vc=getComputedStyle(vg), fa=[].slice.call(vg.querySelectorAll(".b3-fane")).filter(synlig), on=vg.querySelector(".b3-fane.on"), oc=on?getComputedStyle(on):null;
        er("VÆLGER form", vg, Math.round(q(vg).height)===44&&Math.abs(q(vg).width-270)<=10/* MÅLT 22/11 på 1440: 270, efter at status fik sin egen flise (v3426); før ca. 330 */&&rgb(vc.backgroundColor)==="rgb(255,255,255)"&&px(vc.borderTopWidth)===1&&rgb(vc.borderTopColor)===KANT&&px(vc.borderTopLeftRadius)>=22&&!vg.querySelector("svg, img"), "h"+Math.round(q(vg).height)+" b"+Math.round(q(vg).width)+" flade "+vc.backgroundColor+" kant "+vc.borderTopWidth+" "+vc.borderTopColor+" (skal én pille · 44 høj · ca. 270 bred · hvid · 1 px #DEDEDE · ingen symboler)");
        er("VÆLGER felter", vg, fa.length===3&&fa.map(function(x){return (x.innerText||"").trim()}).join("|")==="Skriv|Optag|Post"&&Math.abs(q(fa[0]).width-q(fa[1]).width)<=1&&Math.abs(q(fa[1]).width-q(fa[2]).width)<=1&&fa.every(function(x){return px(getComputedStyle(x).fontSize)===14})&&!!oc&&rgb(oc.backgroundColor)===RED&&rgb(oc.color)==="rgb(255,255,255)", "felter "+fa.map(function(x){return (x.innerText||"").trim()+" "+Math.round(q(x).width)+"/"+getComputedStyle(x).fontSize}).join(" · ")+" valgt "+(oc?oc.backgroundColor+" "+oc.color:"ingen")+" (skal Skriv · Optag · Post, lige store, skrift 14, det valgte rødt #FC2404 med hvid tekst)");
        N++; if(q(tr).top<q(kort).bottom-1) fejl("TRIN-RÆKKEN står ikke under kortet (række y"+Math.round(q(tr).top)+", kortets bund y"+Math.round(q(kort).bottom)+")");
        /* v3423 (bud 9) + v3426 + v3427 — VÆLTER »faktaboksen (340), 32 imellem, hjælpeflisen over felterne« fra 19/11:
           »fakta til venstre (312) · midten i ÉN ramme … med trinene som vælger · Tilbage · Gem ændringer · Næste nederst i tre lige brede knapper · tippet som sin egen flise til højre (196)« ·
           »Knapperne står UNDER den grå flise, ikke i den, og er lige så brede som flisen«. MÅLT 22/11 på 1440: fakta 268–580 · knapperne (= rammen) 596–1196 · trinene 612–1180 · flisen til højre 1212–1408. */
        var bk=rl?[].slice.call(rl.querySelectorAll(".fb-boks")).filter(synlig)[0]:null, fl=hj?[].slice.call(hj.querySelectorAll(".soh-fl")).filter(synlig)[0]:null;
        N++; if(!bk) fejl("TRE SPALTER: faktaboksen står ikke til venstre på briefens side");
        else if(!nv||!synlig(nv)) fejl("TRE SPALTER: knapperne nederst står ikke på briefens side");
        else { if(!(Math.abs(q(bk).width-312)<=1&&Math.abs(q(nv).left-q(bk).right-16)<=1&&q(bk).left<q(nv).left)) fejl("TRE SPALTER: faktaboksen er "+Math.round(q(bk).width)+" bred med "+Math.round(q(nv).left-q(bk).right)+" til midten (skal 312 til venstre og 16 imellem)");
          N++; if(Math.abs(q(nv).left-(q(tr).left-16))>1||Math.abs(q(nv).right-(q(tr).right+16))>1) fejl("MIDTEN: knapperne står "+Math.round(q(nv).left)+"–"+Math.round(q(nv).right)+", trin-vælgeren "+Math.round(q(tr).left)+"–"+Math.round(q(tr).right)+" (knapperne skal være lige så brede som rammen: 16 uden for trinene i hver side)");
          N++; if(q(nv).top<q(tr).bottom) fejl("MIDTEN: knapperne står ikke under trinene og felterne");
          var kn=[].slice.call(nv.children).filter(synlig); N++; if(kn.length<2||kn.some(function(x){return Math.abs(q(x).width-q(kn[0]).width)>1})) fejl("KNAPPERNE NEDERST er ikke lige brede: "+kn.map(function(x){return Math.round(q(x).width)}).join(" · "));
          if(fl&&innerWidth>=1400){ N++; if(!(Math.abs(q(fl).width-196)<=1&&Math.abs(q(fl).left-q(nv).right-16)<=1)) fejl("FLISEN TIL HØJRE står "+Math.round(q(fl).left)+"–"+Math.round(q(fl).right)+" (skal 196 bred, 16 efter midten, der slutter "+Math.round(q(nv).right)+")");
            var fc=getComputedStyle(fl); N++; if(rgb(fc.backgroundColor)!==RED) fejl("FLISEN TIL HØJRE er "+fc.backgroundColor+" (skal helt rød #FC2404, HÅRD 21/11)"); } }
      } else fejl("KORTET (titel · vælger · status · tre prikker) eller trin-rækken findes ikke på briefens side"); }
    if(!TLF){ var lose=[].slice.call(document.querySelectorAll("#screen7 .brief-titel-over > .bt-blyant, #screen7 .bt-ik-baand > *")).filter(synlig).filter(function(e){ return !e.classList.contains("bt-mere-tlf")&&!e.classList.contains("bt-status-baand"); }); N++; if(lose.length) fejl("IKONRÆKKE: løse ikoner ved status: "+lose.map(function(e){return e.title||kl(e)}).join(", ")); } }
  var EKSTRA=[["forsiden",function(){showTab(3)}],["idébanken",function(){showTab(2)}],["performance",function(){openMaal()}],["målsætninger",function(){tilpasAaben("maal")}],["værktøjskassen",function(){vaerktoejAaben()}],["min profil",function(){minProfilAaben()}],["lektionen",function(){OB_SKEMA=true;showTab(12);visLektion(KURSUS_LEKTIONER[0].id)}]];
  for(var x=0;x<EKSTRA.length;x++){ TRIN=EKSTRA[x][0]; try{ EKSTRA[x][1](); }catch(e){ fejl("døren åbnede ikke: "+(e&&e.message)); } await vent(1100); maalLaas1411(); }
  TRIN="story"; openBriefSide("rg2"); await vent(1800); maalLaas1411();
  N++; if(!document.querySelector("#storySerie .ss-chip.on")) fejl("STORY: ingen valgt chip at måle (testen ser ikke det, den skal)");
  clearTimeout(VAGT);
  if(FUND.length){ FUND.forEach(function(f){ console.log("SELE REGLER FEJL: "+f); }); console.log("SELE REGLER IKKE OK: "+FUND.length+" afvigelser af "+N+" målinger paa "+innerWidth); }
  else console.log("SELE REGLER OK: "+N+" målinger paa "+innerWidth+", 0 afvigelser");
} catch(e){ console.log("SELE REGLER FEJL probe: "+(e&&e.message)+" — "+TRIN); }
}, 400);
