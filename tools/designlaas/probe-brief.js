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
    if(tag==="BUTTON"&&!/\b(bdrop-knap|pf-ik|bt-blyant|kort-plus|fs-cirkel|fs-slet|fs-fjern|ko-plus|klip-flyt|klip-slet|bdrop-rk|chip-btn|ark-luk|ark-send|ark-rund|tale-knap|bsam-ret-link|klip-knap|bs-flyt-luk|fb-rk)\b/.test(cl)&&!e.closest(".bdrop-kort,.fb-rk,.ark,#bsFlytMenu,.sk-input")&&(e.innerText||"").trim()){   /* kun knapper med ORD — ikon-knapper (skraldespand, mikrofon, flueben) har hver sin laaste form */
      if(Math.abs(px(r.width)-h)<=8) return;   /* runde ikon-knapper (flueben, mikrofon, skraldespand, Del/Slet) har hver sin laaste stoerrelse og maales ikke som chips */
      if(rad>=99||rad>=h/2-1){ if(h>40) laeg("pille","h"+h2(h)+" fs"+Math.round(parseFloat(cs.fontSize))+" rad999 bd"+px(cs.borderTopWidth),e,trin); else laeg("chip","h"+h2(h)+" fs"+Math.round(parseFloat(cs.fontSize))+" bd"+px(cs.borderTopWidth),e,trin); }
      else laeg("knap-uden-pille","rad"+rad+" h"+h,e,trin);
    }
    if(cs.textTransform==="uppercase"&&parseFloat(cs.fontSize)<=12.5&&tag!=="BUTTON"&&e.children.length<=2&&txt(e)&&!e.closest("button,.brief-raketkort,.brief-dbog-hoved,.bss-top,.pf-kort")) laeg("versal","fs"+Math.round(parseFloat(cs.fontSize)*10)/10+" ls"+Math.round(parseFloat(cs.letterSpacing)*10)/10+" col"+rgb(cs.color),e,trin);
    if(/(^|\s)(sk-q|pf-flise|pf-kf|fb-boks|brief-dbog-flise|klip-kort)(\s|$)/.test(cl)&&!/\bpf-kort\b/.test(cl)&&r.width>300&&!e.parentElement.closest(".sk-q:not(:has(#briefKlipHolder))")&&!e.querySelector("#briefKlipHolder, #briefKlip1")) laeg("flise","rad"+rad+" bd"+px(cs.borderTopWidth)+" sk"+(cs.boxShadow==="none"?"0":"1")+" bg"+rgb(cs.backgroundColor),e,trin);
    if(tag==="TEXTAREA"&&synlig(e)&&!/display:\s*none/.test(e.getAttribute("style")||"")&&!e.classList.contains("sendfelt-felt")) laeg("felt","rad"+rad+" bd"+px(cs.borderTopWidth)+"/"+rgb(cs.borderTopColor)+" fs"+Math.round(parseFloat(cs.fontSize)),e,trin);
    if(/\b(brief-raketkort|brief-dbog-hoved)\b/.test(cl)) laeg("bjaelke","rad"+rad+" h"+h2(h)+" bg"+rgb(cs.backgroundColor),e,trin);
  });
}
setTimeout(async function(){
  var vent=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
  for(var v=0;v<40&&!document.body.classList.contains("app-klar");v++) await vent(150);
  ["appLoader","turOverlay","dagensKort","nyVersion"].forEach(function(id){var e=document.getElementById(id); if(e) e.remove();});
  try{ dagensKortLuk(); }catch(e){}
  try{ STRATEGI_TEMAER.push({navn:"Menneskene bag", formaal:"kunderne skal lære os at kende", foelelse:"Dem kan jeg lide", eksempler:[]}); }catch(e){}
  var H1="Vi er aldrig enige om farver — og det er derfor, butikken virker";
  IDEER.push({id:"ens1",titel:"To om ét indkøb",soejle:"Menneskene bag",type:"Reel",status:"Brief i gang",dato:"2026-09-17",brief:{format:"Reel",platform:["Instagram"],beskrivelse:"Vi viser, hvordan vi to vælger forskelligt.",maal:"Flere kommentarer",hookTekst:H1,hookTekstListe:[H1,"Min kollega vælger altid det modsatte af mig"],hookTekstValgt:0,thumb:"To mennesker.",thumbListe:["To mennesker."],thumbValgt:0,klip:[{ser:"Vi står med hver vores favorit",tekst:H1},{ser:"Klip mellem de to valg",tekst:"Hvem har ret?"}],ctaVideo:"Skriv i kommentarerne",caption:"Vi køber ind sammen — og vi er sjældent enige.\n\nDen ene går efter det rolige. Hvem er du mest enig med?",ctaCaption:"Kommentér opslaget",cta:"Kommentér opslaget",hashtags:"#menneskenebag #butiksliv",linkIndhold:"https://drive.google.com/x"}});
  openBriefSide("ens1"); await vent(1500);
  try{ document.querySelectorAll("#turOverlay,.tur-slor,#turKort,#nyVersion,#dagensKort").forEach(function(e){e.remove()}); }catch(e){}
  if(!document.body.classList.contains("mb")){ console.log("SELE BRIEF FEJL: computeren (body.mb) er ikke aktiv paa "+innerWidth); return; }
  maal("forside");
  for(var side=0; side<4; side++){ BRIEF_SIDE_AKTIV=side; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); await vent(150); var n=(BRIEF_TRIN_INFO||{n:1}).n; for(var t=0;t<n;t++){ BRIEF_TRIN_AKTIV=t; briefMbVis("skriv"); await vent(120); document.querySelectorAll("#briefWrap textarea").forEach(function(x){x.classList.add("mb-felt")}); maal("side"+side+"/"+t); } }
  Object.keys(GRUPPER).forEach(function(g){ var keys=Object.keys(GRUPPER[g]); if(keys.length>1){ keys.sort(function(a,b){return GRUPPER[g][b].length-GRUPPER[g][a].length}); FUND.push("UENS "+g+": "+keys.map(function(k){return k+" ×"+GRUPPER[g][k].length+" (fx "+GRUPPER[g][k][0]+")"}).join(" || ")); } });
  if(FUND.length){ FUND.forEach(function(f){ console.log("SELE BRIEF FEJL: "+f); }); console.log("SELE BRIEF IKKE OK: "+FUND.length+" fund"); }
  else { var tal=Object.keys(GRUPPER).map(function(g){ var k=Object.keys(GRUPPER[g])[0]; return g+" "+GRUPPER[g][k].length+" ("+k+")"; }).join(" · "); var ialt=Object.keys(GRUPPER).reduce(function(a,g){ return a+Object.keys(GRUPPER[g]).reduce(function(b,k){return b+GRUPPER[g][k].length},0); },0); if(ialt<40) console.log("SELE BRIEF FEJL: kun "+ialt+" elementer maalt — briefen blev ikke tegnet"); else console.log("SELE BRIEF OK: "+ialt+" elementer ens paa forsiden og alle skrivetrin, ingen rosa — "+tal); }
}, 2500);
