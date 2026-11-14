/* REGEL-PORTEN (Ida 14/11): de tre låste regler måles, så de ikke glider igen.
   1) en valgt chip er rød med hvid tekst og uden flueben · 2) en dropdown har Content kalenderens form · 3) en knap med tekst er 56 høj.
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
var RED="rgb(252,36,4)", SORT="rgb(26,26,26)", G2="rgb(111,107,102)", KANT="rgb(222,218,212)";
function maalLaas1411(){
  document.querySelectorAll(".ark-chip.on, .ss-chip.on, .cm-chip.on, .chip-btn.on, .ark-vchip.on, .kk-chip.on, .lek-favchip.valgt").forEach(function(e){
    if(!synlig(e)||/dbtn|sa-lang|kk-ini|sa-ved-ik|bs3-drop|cv-plus|bdrop|fb-hc/.test(e.className)) return; var cs=getComputedStyle(e), af=getComputedStyle(e,"::after");
    er("VALGT CHIP", e, rgb(cs.backgroundColor)===RED&&rgb(cs.color)==="rgb(255,255,255)", "flade "+cs.backgroundColor+" tekst "+cs.color+" (skal rød #FC2404 med hvid tekst)");
    er("VALGT CHIP flueben", e, af.content==="none"||af.display==="none", "har et mærke efter teksten (valgt vises kun med rød flade)");
  });
  document.querySelectorAll(".bs3-drop, .bdrop-knap, select:not([multiple]):not([size])").forEach(function(e){   /* ALLE dropdowns (v3271), ikke kun briefens status */
    if(!synlig(e)||e.closest(".ark-hvid, .ark-bue")) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect(), sp=e.matches(".bs3-drop:not([data-etiket])")?e.querySelector("span"):null, sv=e.matches(".bs3-drop")?e.querySelector("svg"):null;
    er("DROPDOWN form", e, Math.round(r.height)===44&&px(cs.borderTopLeftRadius)===14&&px(cs.borderTopWidth)===1&&rgb(cs.borderTopColor)===KANT&&rgb(cs.backgroundColor)==="rgb(255,255,255)"&&px(cs.paddingLeft)===14, "h"+Math.round(r.height)+" r"+cs.borderTopLeftRadius+" kant "+cs.borderTopColor+" flade "+cs.backgroundColor+" luft "+cs.paddingLeft+" (skal 44 · r14 · 1 px #DEDAD4 · hvid · luft 14)");
    if(sp){ var ss=getComputedStyle(sp), rg=document.createRange(); rg.selectNodeContents(sp); var tr=rg.getBoundingClientRect(); er("DROPDOWN tekst", e, rgb(ss.color)===SORT&&Math.abs(tr.left-r.left-15)<=2, "tekst "+ss.color+", "+Math.round(tr.left-r.left)+" px fra venstre kant (skal sort #1A1A1A, 15 fra kanten)"); }
    if(sv){ var vr=sv.getBoundingClientRect(); er("DROPDOWN pil", e, Math.abs(r.right-vr.right-15)<=2&&rgb(getComputedStyle(sv).color)===G2, "pilen står "+Math.round(r.right-vr.right)+" px fra højre kant i "+getComputedStyle(sv).color+" (skal 15, grå #6F6B66)"); }
  });
  document.querySelectorAll(".cover-tilbage, .navsti .navsti-tilbage, .mb-baand .navsti-tilbage, .mb-baand button.mb-tilbage, #briefRedigerKnap, .dbtn:not(.ark-chip):not(.chip-btn):not(.ss-chip):not(.kk-chip):not(.vt-pille):not(.lku-tilb), .db-knap, .bsam-mobknap:not(.cf-ny), .bsam-knap, .lk-note-alle, .hu-graa, .row-btn, .tom-knap, .prof-gem").forEach(function(e){ if(!synlig(e)||e.closest("#virkMenu, #dashMenu, .burger, #burgerMenu")||!(e.innerText||"").trim()) return; var r=e.getBoundingClientRect(); er("KNAP 56", e, Math.round(r.height)===56, "h"+Math.round(r.height)+" (skal 56)"); });
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
