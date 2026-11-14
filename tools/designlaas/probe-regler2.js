/* REGEL-PORTEN, DEL 2 (Ida 14/11: »få porten til at måle ark og backstage også«).
   Samme tre regler som probe-regler.js — valgt chip rød · dropdown i kalenderens form · knap med tekst 56 —
   målt (a) på Backstages sider og (b) inde i ark og popups, som åbnes én for én, i kundeappen og i Backstage.
   koer.sh sætter REGLER_FLADE = "kunde" eller "dash" foran koden. Én afvigelse = linje med »FEJL«, og porten stopper.
   Listen over ark er dem, der åbner uden bestemte data i testudgaven. Åbner færre end MINDST, fejler porten — så ser den ikke længere det, den skal. */
var FLADE=(typeof REGLER_FLADE==="string")?REGLER_FLADE:"kunde";
var ARK_KUNDE=["ahTilfoejArk", "aiSparringVis", "appOenskeAabn", "appOenskeSvarAabn", "arkSpoerg", "basisFordelingVis", "bf3AftaleArk", "bf3BeskedArk", "bf3CsNyArk", "bf3CsProdNyArk", "bf3HjemTilfoejArk", "bf3KontaktNyArk", "bf3NytProduktArk", "bf3NytRumArk", "bf3SortAabn", "bf3TodoNyArk", "bf3ToemArk", "bf3ToemTrin1", "bf3ValgArk", "bibAfsnitNavnArk", "bibBrugArk", "briefBaandMereArk", "briefDone", "briefGodkArkVis", "briefKomArk", "briefLinkArk", "briefMaalgruppeArk", "briefMaalgruppeVis", "briefManglerVis", "briefMaterialeRet", "briefSpringVis", "briefTilfoejLinkArk", "byggRet", "csIdeFang", "drejebogTomVis", "fejlArkAaben", "fejlFraKunderneVis", "foodIngArk", "hjemPlusArk", "hjemRingListe", "hjemTilfoejArk", "htbNyArk", "huRingAabn", "ibIdeOmdoebVis", "igAfbrydArk", "inspNavnArk", "kbuSpmArk", "kbuTekstArk", "klipNyArk", "klipSletSpoerg", "kollegaArk", "kundeArkAabn", "kundeBeskedArk", "lekSkemaLaasArk", "mailsNyArk", "manusIdeFang", "miTegn", "modulNyArk", "moedeForbArk", "moedeHvemArk", "mrModulRet", "nyIdeAabn", "nytLeadArk", "opslagRefleksionVis", "perfMaalRet", "perfUdsatAaben", "planMoedeTidArk", "plejGuideAaben", "selvtestKoer", "temaNyArk", "tilpasArk", "toemHovedetTrin1", "toemHovedetTrin1Chips", "togglePwPanel", "ttsDndSpoerg", "vaelgPlanDagModal", "valgFliseArk", "ygtLaasArk"];
var ARK_DASH=["ahTilfoejArk", "aiSparringVis", "appOenskeAabn", "appOenskeSvarAabn", "arkSpoerg", "basisFordelingVis", "bf3AftaleArk", "bf3BeskedArk", "bf3CsNyArk", "bf3CsProdNyArk", "bf3KontaktNyArk", "bf3NytProduktArk", "bf3NytRumArk", "bf3SortAabn", "bf3TodoNyArk", "bf3ToemArk", "bf3ToemTrin1", "bf3ValgArk", "briefBaandMereArk", "briefDone", "briefGodkArkVis", "briefKomArk", "briefMaalgruppeArk", "briefMaalgruppeVis", "briefManglerVis", "briefMaterialeRet", "briefTilfoejLinkArk", "byggRet", "drejebogTomVis", "fejlFraKunderneVis", "foodIngArk", "hjemPlusArk", "hjemRingListe", "hjemTilfoejArk", "htbNyArk", "huRingAabn", "inspNavnArk", "kbuSpmArk", "kbuTekstArk", "klipNyArk", "klipSletSpoerg", "kollegaArk", "kundeArkAabn", "kundeBeskedArk", "lekSkemaLaasArk", "miTegn", "modulNyArk", "moedeForbArk", "moedeHvemArk", "mrModulRet", "nyIdeAabn", "nytLeadArk", "perfMaalRet", "plejGuideAaben", "selvtestKoer", "temaNyArk", "tilpasArk", "toemHovedetTrin1", "toemHovedetTrin1Chips", "togglePwPanel", "ttsDndSpoerg", "vaelgPlanDagModal", "valgFliseArk"];
var SKABELON=[["arkSpoerg",function(){arkSpoerg({titel:"Slet filen?",tekst:"Den forsvinder.",jaTekst:"Slet",nejTekst:"Annuller",ja:function(){}})}],["bf3ValgArk",function(){bf3ValgArk("Mappen",[["Omdøb","void 0"],["Flyt","void 0"]])}],["valgFliseArk",function(){valgFliseArk("Tilføj",[["Klip","void 0","klip"],["Ny scene","void 0","scene"]])}]];
var DASH_SIDER=[["hjem",function(){visDashSide("overblik")}],["crm",function(){visDashSide("crm")}],["salg",function(){mrGaaTil("salg")}],["mails",function(){mrGaaTil("mails")}],["mailen",function(){mrGaaTil("mails");setTimeout(function(){mailsAabn("adgangskode")},300)}],["ret mailen",function(){mrGaaTil("mails");setTimeout(function(){mailsAabn("adgangskode").then(function(){mailsRetVis("adgangskode")})},300)}],["content studio",function(){mrGaaTil("contentstudio")}],["energida studio",function(){visDashSide("klip")}],["workout",function(){mrGaaTil("oevelser")}],["mine rum",function(){visDashSide("energida")}],["indbakken",function(){visDashSide("indbakke")}],["get shit done",function(){visDashSide("gsd")}],["økonomi",function(){visDashSide("budget")}],["health coach",function(){visDashSide("healthcoach")}],["opgavebiblioteket",function(){visDashSide("opgbib")}]];
function px(v){ return Math.round(parseFloat(v)*10)/10||0; }
function rgb(c){ return (c||"").replace(/\s/g,""); }
function synlig(e){ var r=e.getBoundingClientRect(); if(r.width<2||r.height<2) return false; var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||cs.opacity==="0") return false; return !e.closest("[hidden]"); }
function txt(e){ return (e.innerText||e.getAttribute("aria-label")||e.placeholder||"").replace(/\s+/g," ").trim().slice(0,26); }
function kl(e){ return (e.className&&e.className.toString().split(" ").filter(Boolean).slice(0,2).join("."))||e.tagName.toLowerCase(); }
var FUND=[], N=0, TRIN="start", SET={};
function er(navn, e, ok, hvad){ N++; if(ok) return; var f=navn+" ["+kl(e)+"] "+hvad; if(SET[f]){ SET[f].n++; return; } SET[f]={n:1,hvor:TRIN,eks:txt(e)}; FUND.push(f); }
var RED="rgb(252,36,4)", KANT="rgb(222,218,212)";
var CHIPS=".ark-chip.on, .ss-chip.on, .cm-chip.on, .chip-btn.on, .ark-vchip.on, .kk-chip.on, .lek-favchip.valgt, .crm2-fane.on";
var KNAPPER=".dbtn:not(.ark-chip):not(.chip-btn):not(.ss-chip):not(.kk-chip):not(.vt-pille):not(.lku-tilb), .db-knap, .bsam-mobknap:not(.cf-ny), .bsam-knap, .lk-note-alle, .hu-graa, .crm2-ny, .tom-knap, .pb-knap, .prof-gem, .ark-knap, .ark-send-pille, .sw-knap";
function maal(ROD, iArk){
  ROD.querySelectorAll(CHIPS).forEach(function(e){ if(!synlig(e)||/dbtn|sa-lang|kk-ini|sa-ved-ik|bs3-drop|cv-plus|bdrop|fb-hc/.test(e.className)) return; var cs=getComputedStyle(e), af=getComputedStyle(e,"::after");
    er("VALGT CHIP", e, rgb(cs.backgroundColor)===RED&&rgb(cs.color)==="rgb(255,255,255)", "flade "+cs.backgroundColor+" tekst "+cs.color+" (skal rød med hvid tekst)");
    er("VALGT CHIP flueben", e, af.content==="none"||af.display==="none", "har et mærke efter teksten"); });
  ROD.querySelectorAll(".bs3-drop, .bdrop-knap, .fv-knap, select:not([multiple]):not([size])").forEach(function(e){ if(!synlig(e)) return; var cs=getComputedStyle(e), r=e.getBoundingClientRect(), iHvid=!!e.closest(".ark-hvid, .ark-bue");
    er("DROPDOWN højde og hjørner", e, Math.round(r.height)===44&&px(cs.borderTopLeftRadius)===14, "h"+Math.round(r.height)+" r"+cs.borderTopLeftRadius+" (skal 44 · r14)");
    if(!iHvid&&!e.matches(".fv-knap")) er("DROPDOWN kant og flade", e, px(cs.borderTopWidth)===1&&rgb(cs.borderTopColor)===KANT&&rgb(cs.backgroundColor)==="rgb(255,255,255)", "kant "+cs.borderTopWidth+" "+cs.borderTopColor+" flade "+cs.backgroundColor+" (skal 1 px #DEDAD4 på hvid)"); });
  ROD.querySelectorAll(KNAPPER).forEach(function(e){ if(!synlig(e)||e.closest("#virkMenu, #dashMenu, .burger, #burgerMenu")||(e.innerText||"").trim().length<2) return; var r=e.getBoundingClientRect(); if(Math.abs(r.width-r.height)<=8) return; er("KNAP 56", e, Math.round(r.height)===56, "h"+Math.round(r.height)+" (skal 56)"); });
}
function lag(){ var u=[]; [].forEach.call(document.querySelectorAll("#bsFlytMenu, #arkSlor, .ark-slor, .modal-back, [class*='-back'], [class*='slor'], [class*='overlay'], [class*='popup'], [class*='-pop']"),function(e){ var c=getComputedStyle(e); if(c.display==="none"||c.visibility==="hidden"||parseFloat(c.opacity)===0) return; var r=e.getBoundingClientRect(); if(r.width<200||r.height<100) return; if(c.position!=="fixed"&&c.position!=="absolute") return; if(!(e.innerText||"").trim()) return; u.push(e); }); return u; }
function lukAlt(){ try{bsFlytLuk()}catch(e){} try{arkLuk(true)}catch(e){} try{closeModal()}catch(e){} [].forEach.call(document.querySelectorAll(".modal-back.open,.modal-back.show,.modal-back.vis"),function(e){e.classList.remove("open","show","vis")}); lag().forEach(function(e){ if(e.id==="bsFlytMenu"){e.style.display="none";e.innerHTML="";} else if(/ark-slor/.test(e.className)||e.id==="arkSlor") e.remove(); else e.style.display="none"; }); }
var vent=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
var AABNET=0, LUKKET=[];
async function proev(navn,kald){ var foer=lag(); try{ kald(); }catch(e){} await vent(450); var nu=lag().filter(function(e){return foer.indexOf(e)<0}); if(!nu.length) return false; AABNET++; TRIN="arket "+navn; nu.forEach(function(r){ maal(r,true); }); lukAlt(); await vent(450); return true; }
var VAGT=setTimeout(function(){ console.log("SELE REGLER2 FEJL: proben nåede ikke i mål — sidste trin: "+TRIN); },280000);
setTimeout(async function(){ try {
  for(var v=0;v<40&&!document.body.classList.contains("app-klar");v++) await vent(150);
  ["appLoader","turOverlay","dagensKort","nyVersion"].forEach(function(id){var e=document.getElementById(id); if(e) e.remove();}); try{ dagensKortLuk(); }catch(e){}
  var ARG1="adgangskode", LISTE=ARK_DASH;
  if(FLADE==="kunde"){ ARG1="rg1"; LISTE=ARK_KUNDE;
    IDEER.push({id:"rg1",titel:"To om ét indkøb",soejle:"Menneskene bag",type:"Reel",status:"Brief i gang",dato:"2026-11-10",brief:{format:"Reel",platform:["Instagram"],beskrivelse:"Vi viser, hvordan vi to vælger forskelligt.",hookTekst:"Vi er aldrig enige om farver",hookTekstListe:["Vi er aldrig enige om farver","Min kollega vælger altid det modsatte"],hookTekstValgt:0,klip:[{ser:"Vi står med hver vores favorit",tekst:"Hvem har ret?",siger:"Vi er aldrig enige"}],ctaVideo:"Skriv i kommentarerne",caption:"Vi køber ind sammen.",cta:"Kommentér opslaget",hashtags:"#butiksliv"}});
    TRIN="briefoversigt"; openBriefSide("rg1"); await vent(1500);
  } else {
    for(var d=0; d<DASH_SIDER.length; d++){ TRIN="Backstage: "+DASH_SIDER[d][0]; try{ DASH_SIDER[d][1](); }catch(e){ N++; FUND.push("døren »"+DASH_SIDER[d][0]+"« åbnede ikke: "+(e&&e.message)); } await vent(1100); lukAlt(); var dm=document.getElementById("dashMain")||document.body; maal(dm,false); }
    TRIN="Backstage: hjem"; try{ visDashSide("overblik"); }catch(e){} await vent(700);
  }
  try{ document.querySelectorAll("#turOverlay,.tur-slor,#turKort,#nyVersion,#dagensKort").forEach(function(e){e.remove()}); }catch(e){} lukAlt();
  lukAlt(); await vent(600);
  for(var i=0;i<SKABELON.length;i++){ if(!(await proev(SKABELON[i][0],SKABELON[i][1]))) LUKKET.push(SKABELON[i][0]); }
  for(var j=0;j<LISTE.length;j++){ var n=LISTE[j], fn=window[n]; if(typeof fn!=="function"){ LUKKET.push(n); continue; } TRIN="arket "+n;
    var ok=await proev(n,function(){fn()}); if(!ok) ok=await proev(n,function(){fn(ARG1)}); if(!ok) ok=await proev(n,function(){fn(0)}); if(!ok) LUKKET.push(n); }
  /* anden runde: et ark, der ikke nåede at åbne, mens det forrige lukkede, får et forsøg til */
  var igen=LUKKET.slice(); LUKKET=[]; lukAlt(); await vent(600);
  for(var q=0;q<igen.length;q++){ var n2=igen[q], f2=window[n2], sk=SKABELON.filter(function(x){return x[0]===n2})[0]; var ok2=false; if(sk) ok2=await proev(n2,sk[1]); else if(typeof f2==="function"){ ok2=await proev(n2,function(){f2()}); if(!ok2) ok2=await proev(n2,function(){f2(ARG1)}); if(!ok2) ok2=await proev(n2,function(){f2(0)}); } if(!ok2) LUKKET.push(n2); }
  var MINDST=Math.floor((LISTE.length+SKABELON.length)*0.7);
  N++; if(AABNET<MINDST) FUND.push("ARK: kun "+AABNET+" ark åbnede (skal mindst "+MINDST+") — åbnede ikke: "+LUKKET.join(", "));
  clearTimeout(VAGT);
  if(FUND.length){ FUND.forEach(function(f){ var s=SET[f]; console.log("SELE REGLER2 FEJL: "+f+(s?" — første gang i "+s.hvor+" »"+s.eks+"«, "+s.n+" steder":"")); }); console.log("SELE REGLER2 IKKE OK ("+FLADE+"): "+FUND.length+" afvigelser af "+N+" målinger paa "+innerWidth); }
  else console.log("SELE REGLER2 OK ("+FLADE+"): "+N+" målinger i "+AABNET+" ark paa "+innerWidth+", 0 afvigelser");
} catch(e){ console.log("SELE REGLER2 FEJL probe: "+(e&&e.message)+" — "+TRIN); }
}, 400);
