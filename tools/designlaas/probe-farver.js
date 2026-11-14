/* FARVE-PORTEN (LÅST 14/11, Idas klik »variation 1 + 7«, DESIGNLÅS › Markeringsfarver): den sandfarvede markering er død i kundeappen.
   Siden er hvid · fliser hvide m. kant #DCE8F0 · venter/låst = #F0F5F8 · valgt menupunkt/ikke valgt = #EEEEEE · rød = det aktive.
   Proben åbner kundeappens sider én for én (Hjem · Forløbet m. låst modul · en lektion · Værktøjskassen · Dine noter · Profil ·
   briefen: forsiden, Idéen og Fang dem på en karrusel · log ind) og FEJLER, hvis et synligt element har en af de fem sandfarver
   som flade, eller hvis siden (body og den aktive skærm) ikke er hvid. Kører på den bredde, vinduet har (390 og 1440).
   Uden for: CRM, Health Coach, mails, print og Backstage (andre tråde). window.FARVE_ALLE=1 lister alle flader til fejlsøgning. */
var FORBUDT={"rgb(250,249,245)":"#FAF9F5","rgb(241,239,234)":"#F1EFEA","rgb(243,240,234)":"#F3F0EA","rgb(244,242,238)":"#F4F2EE","rgb(242,240,237)":"#F2F0ED"};
var UDENFOR="#dashMain, #dashboard, #hcHost, .hc-host, [class^='crm'], [class*=' crm'], #woGate, #printcss";
function rgb(c){ return (c||"").replace(/\s/g,""); }
function synlig(e){ var r=e.getBoundingClientRect(); if(r.width<2||r.height<2) return false; var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||parseFloat(cs.opacity)===0) return false; return !e.closest("[hidden]"); }
function txt(e){ return (e.innerText||e.getAttribute("aria-label")||e.placeholder||"").replace(/\s+/g," ").trim().slice(0,28); }
function kl(e){ var c=(e.className&&e.className.toString().split(" ").filter(Boolean).slice(0,2).join("."))||""; return (e.id?"#"+e.id:"")+(c?"."+c:"")||e.tagName.toLowerCase(); }
var FUND=[], SET={}, N=0, TRIN="start", ALLE={};
function fejl(s, e){ var k=s+(e?" ["+kl(e)+"]":""); N++; if(SET[k]){ SET[k].n++; return; } SET[k]={n:1}; FUND.push(TRIN+" · "+k+(e?" »"+txt(e)+"«":"")); }
function scan(){
  document.querySelectorAll("body *").forEach(function(e){
    if(e.closest(UDENFOR)||/^(SCRIPT|STYLE|LINK|META|svg|path|circle|line|rect|polyline|polygon|g)$/i.test(e.tagName)) return;
    if(!synlig(e)) return;
    var cs=getComputedStyle(e), bg=rgb(cs.backgroundColor); N++;
    if(FORBUDT[bg]) fejl("SANDFLADE "+FORBUDT[bg], e);
    ["::before","::after"].forEach(function(p){ var ps=getComputedStyle(e,p); if(ps.content&&ps.content!=="none"&&FORBUDT[rgb(ps.backgroundColor)]&&parseFloat(ps.width)>2&&parseFloat(ps.height)>2) fejl("SANDFLADE "+FORBUDT[rgb(ps.backgroundColor)]+" i "+p, e); });
    if(window.FARVE_ALLE&&bg!=="rgba(0,0,0,0)"&&bg!=="rgb(255,255,255)"){ var k=bg+" "+kl(e); ALLE[k]=(ALLE[k]||0)+1; }
    if(window.FARVE_ALLE&&bg==="rgb(255,255,255)"&&parseFloat(cs.borderTopLeftRadius)>=14&&cs.boxShadow!=="none"&&cs.boxShadow.indexOf("220, 232, 240")<0&&!(parseFloat(cs.borderTopWidth)>0&&/220,232,240/.test(rgb(cs.borderTopColor)))){ var r0=e.getBoundingClientRect(); if(r0.height>=40&&r0.width>=120&&!e.matches("button, a, input, textarea")){ var k3="UDEN KANT "+kl(e)+" | "+cs.boxShadow.slice(0,60); ALLE[k3]=(ALLE[k3]||0)+1; } }
    if(window.FARVE_ALLE&&parseFloat(cs.borderTopWidth)>0&&/rgb\((227,226,222|222,218,212)\)/.test(rgb(cs.borderTopColor))&&!/BUTTON|A/.test(e.tagName)){ var k2="KANT "+rgb(cs.borderTopColor)+" "+kl(e); ALLE[k2]=(ALLE[k2]||0)+1; }
  });
}
function hvidSide(){
  var b=rgb(getComputedStyle(document.body).backgroundColor); N++; if(b!=="rgb(255,255,255)") fejl("SIDEN ER IKKE HVID: body "+b);
  var bi=getComputedStyle(document.body).backgroundImage; N++; if(bi&&bi!=="none") fejl("SIDEN HAR ET BAGGRUNDSBILLEDE: "+bi.slice(0,40));
  [].slice.call(document.querySelectorAll(".screen.active, .content, .phone, #app, html")).filter(function(e){ return e===document.documentElement||synlig(e); }).forEach(function(e){ var c=rgb(getComputedStyle(e).backgroundColor); N++; if(c!=="rgba(0,0,0,0)"&&c!=="rgb(255,255,255)") fejl("SIDEFLADEN ER IKKE HVID: "+c, e); });
}
function alt(){ scan(); hvidSide(); }
var VAGT=setTimeout(function(){ console.log("SELE FARVER FEJL: proben nåede ikke i mål på 80 s — sidste trin: "+TRIN); },80000);
setTimeout(async function(){ try {
  var vent=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
  for(var v=0;v<40&&!document.body.classList.contains("app-klar");v++) await vent(150);
  var ryd=function(){ ["appLoader","turOverlay","dagensKort","nyVersion","privCover","energidaLoader"].forEach(function(id){var e=document.getElementById(id); if(e) e.remove();}); try{ dagensKortLuk(); }catch(e){} document.querySelectorAll(".tur-slor,#turKort").forEach(function(e){e.remove()}); };
  ryd();
  var side=async function(navn, fn, ms){ TRIN=navn; try{ await fn(); }catch(e){ fejl("døren åbnede ikke: "+(e&&e.message)); } await vent(ms||1000); ryd(); alt(); if(window.FARVE_ALLE){ var a=[].slice.call(document.querySelectorAll(".screen.active, #briefWrap, .ark")).filter(synlig).map(kl).join(" "); console.log("SELE FARVER TRIN "+navn+": "+a+" · "+(document.body.className||"").slice(0,80)); } };
  await side("hjem", function(){ showTab(3); });
  await side("værktøjskassen", function(){ vaerktoejAaben(); });
  await side("dine noter", function(){ vkNoterAabn(); });
  await side("profil", function(){ return minProfilAaben(); }, 1200);
  /* BRIEFEN: en karrusel med to hook-forslag (det ene valgt) — forsiden, Idéen og Fang dem */
  await side("briefens forside", function(){
    var H1="Vi er aldrig enige om farver";
    IDEER.push({id:"farve1",titel:"To om ét indkøb",soejle:"Menneskene bag",type:"Karrusel",status:"Brief i gang",dato:"2026-11-20",brief:{format:"Karrusel",platform:["Instagram"],beskrivelse:"Vi viser, hvordan vi to vælger forskelligt.",maal:"Flere kommentarer",hookTekst:H1,hookTekstListe:[H1,"Min kollega vælger altid det modsatte"],hookTekstValgt:0,slides:[H1,"Slide to"]}});
    window.ygtBriefLaast=function(){return false;}; openBriefSide("farve1");
  }, 1500);
  for(var s=0;s<2;s++){ await side("briefen side "+s+(s?" (Fang dem)":" (Idéen)"), function(){ BRIEF_SIDE_AKTIV=s; BRIEF_TRIN_AKTIV=0; briefMbVis("skriv"); }, 900);
    var n=(window.BRIEF_TRIN_INFO||{n:1}).n; for(var t=1;t<n;t++){ await side("briefen side "+s+"/"+t, function(){ BRIEF_TRIN_AKTIV=t; briefMbVis("skriv"); }, 500); } }
  /* FORLØBET med et låst modul (samme testforløb som probe-fliser.js) */
  try{ arkLuk(true); }catch(e){}
  await side("forløbet", function(){
    var idag=datoDK(); var Lk=function(m,n){var a=[];for(var i=1;i<=n;i++)a.push({id:m+"-"+i,titel:"Lektion "+m+"."+i,video:"x.mp4"});return a;};
    CURRENT_DEF=Object.assign({},CURRENT_DEF||{},{type:"kursus",forloeb:"YOU GOT THIS"});
    KURSUS_MODULER.splice.apply(KURSUS_MODULER,[0,KURSUS_MODULER.length].concat([["Modul 0 · Introduktion til forløbet",Lk(1,5)],["Modul 1 · Mennesket",Lk(2,6)],["Modul 2 · Energibanken",Lk(3,4)],["Modul 3 · Hvorfor er du, som du er",Lk(4,4)]].map(function(m){return {titel:m[0],lektioner:m[1]};})));
    window.pubErPubliceret=function(){return true;}; YGT_START=idag; Object.assign(YGT_DAG,{"1":0,"2":0,"3":6,"4":14}); KURSUS_SET={}; OB_SKEMA=true;
    showTab(12); try{renderKursusHjem();}catch(e){}
  }, 1200);
  N++; if(![].slice.call(document.querySelectorAll("#forloebTidslinje .ftl2-rk.laast")).some(synlig)) fejl("FORLØBET: intet låst modul at måle (testen ser ikke det, den skal)");
  await side("forløbet, låst modul udfoldet", function(){ var h=document.querySelector("#forloebTidslinje .ftl2-rk.laast.fold .ftl2-rh"); if(h) h.click(); }, 600);
  await side("lektion", function(){ OB_SKEMA=true; showTab(12); visLektion(KURSUS_LEKTIONER[0].id); }, 1200);
  try{ lukLektion(); }catch(e){}
  await side("hjem igen (menuen)", function(){ showTab(3); }, 800);
  /* LOG IND: porten vises over appen */
  await side("log ind", function(){ var g=document.getElementById("authGate"); if(g){ g.style.setProperty("display","flex","important"); g.classList.add("nyt"); } }, 500);
  clearTimeout(VAGT);
  if(window.FARVE_ALLE) Object.keys(ALLE).sort().forEach(function(k){ console.log("SELE FARVER ALLE "+ALLE[k]+"× "+k); });
  if(FUND.length){ FUND.forEach(function(f){ console.log("SELE FARVER FEJL: "+f); }); console.log("SELE FARVER IKKE OK: "+FUND.length+" fund af "+N+" målinger paa "+innerWidth); }
  else console.log("SELE FARVER OK: "+N+" målinger paa "+innerWidth+", ingen sandflade, siden er hvid");
} catch(e){ console.log("SELE FARVER FEJL probe: "+(e&&e.message)+" — "+TRIN); }
}, 400);
