/* UX-POLITIET 15/9: maaler formen paa knapper, chips, fliser, felter, overskrifter og versaler paa hver side. */
const SIDER = [
  ["hjem", function(){ window.onboardingAktiv=function(){return false}; showTab(3); }],
  ["hjem-ny", function(){ showTab(3); }],
  ["content", function(){ showTab(8); }],
  ["idebanken", function(){ showTab(2); }],
  ["inspiration", function(){ showTab(2); ibVis("insp"); }],
  ["arkiv", function(){ showTab(2); ibVis("arkiv"); }],
  ["performance", function(){ openMaal(); }],
  ["indbakken", function(){ indbakkenAaben(); }],
  ["vaerktoej", function(){ vaerktoejAaben(); }],
  ["drejebog", function(){ drejebogAaben(); }],
  ["maalsaetninger", function(){ tilpasAaben("maal"); }],
  ["forloeb", function(){ openForloeb(); }],
  ["profil", function(){ minProfilAaben(); }],
  ["todo", function(){ showTab(25); }],
  ["brief", function(){ IDEER.push({id:"x1",titel:"Nederdelen",soejle:"1A",type:"Reel",status:"Brief i gang",dato:"2026-09-17",brief:{format:"Reel",platform:["Instagram"],hookTekst:"Derfor."}}); openBriefSide("x1"); }],
  ["brief-spm", function(){ try{ briefSektionAabn(1); }catch(e){ briefSeRet("fakta"); } }],
  ["planlaeg", function(){ try{ planRitStart(); }catch(e){} }]
];
function rod(){ var lv=document.getElementById("lekVis"); if(lv&&lv.classList.contains("on")) return lv; return document.querySelector(".screen.active")||document.body; }
function synlig(e){ var r=e.getBoundingClientRect(); if(r.width<2||r.height<2) return false; var cs=getComputedStyle(e); return cs.display!=="none"&&cs.visibility!=="hidden"&&cs.opacity!=="0"; }
function px(v){ return Math.round(parseFloat(v)||0); }
function rgb(c){ return (c||"").replace(/\s/g,""); }
function sig(e){
  var cs=getComputedStyle(e), r=e.getBoundingClientRect();
  return { h:px(r.height), w:px(r.width), rad:px(cs.borderTopLeftRadius), bg:rgb(cs.backgroundColor), col:rgb(cs.color), bd:px(cs.borderTopWidth)+"/"+rgb(cs.borderTopColor), fs:Math.round(parseFloat(cs.fontSize)*10)/10, ff:(cs.fontFamily.split(",")[0]||"").replace(/"/g,""), fw:cs.fontWeight, ls:Math.round(parseFloat(cs.letterSpacing)*10)/10||0, tt:cs.textTransform, pad:px(cs.paddingTop)+"/"+px(cs.paddingLeft), st:cs.fontStyle };
}
function txt(e){ return (e.innerText||e.getAttribute("aria-label")||e.getAttribute("title")||"").replace(/\s+/g," ").trim().slice(0,40); }
function saml(navn){
  var r=rod(), ud=[];
  var alle=r.querySelectorAll("*");
  alle.forEach(function(e){
    if(!synlig(e)) return;
    var cs=getComputedStyle(e), tag=e.tagName, cl=(e.className&&e.className.toString())||"";
    var slags=null;
    if(tag==="BUTTON"||e.getAttribute("role")==="button"||/\b(dbtn|row-btn|bs-doer|bs-kf|hf-kort|fb-pil|kort-plus|bf-plads|chip-knap|ark-chip|chip|bs-rumpil|nav-pil|cf-cta|bsam-mobknap|bs-langknap|bs-tilbage|mob-tilbage)\b/.test(cl)){
      var t=txt(e); var rad=px(cs.borderTopLeftRadius); var h=px(e.getBoundingClientRect().height);
      if(/\b(bs-doer|bs-kf|hf-kort|kv-flise|bs-raekkeflise)\b/.test(cl)) slags="flise-knap";
      else if(rad>=99||rad>=h/2-1) slags=(h<=40?"chip":"pille");
      else if(!t) slags="ikon-knap"; else slags="knap";
    }
    else if(/\b(ch-titel|screen-title|bs-hero|hjem-hilsen|mb-navn|rk-titel|bt-titel|hf-citat)\b/.test(cl)||/^H[1-2]$/.test(tag)) slags="hero";
    else if(cs.textTransform==="uppercase"&&parseFloat(cs.fontSize)<=12.5&&tag!=="BUTTON"&&e.children.length<=2&&txt(e)) slags="versal";
    else if(/\b(sk-q|ws-card|hf-kort|cf-kort|bsm-flise|bsam-flise|post-card|idea-kort|lek-kort|bs-kf|kort|card|fb-boks|pb-rg|pb-maal|db-kort)\b/.test(cl)&&e.getBoundingClientRect().width>120) slags="flise";
    else if(tag==="TEXTAREA"||(tag==="INPUT"&&/text|date|time|url|email|search|number/.test(e.type))) slags="felt";
    else if(tag==="SELECT"||/\bbdrop-knap\b/.test(cl)||/\bbs-filter\b/.test(cl)) slags="vaelger";
    if(!slags) return;
    var s=sig(e); s.slags=slags; s.t=txt(e); s.cl=cl.split(" ").filter(Boolean).slice(0,3).join("."); s.tag=tag; s.side=navn;
    ud.push(s);
  });
  return ud;
}
setTimeout(async function(){
  var vent=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
  for(var v=0;v<40&&!document.body.classList.contains("app-klar");v++) await vent(150);
  ["appLoader","turOverlay","dagensKort","nyVersion"].forEach(function(id){var e=document.getElementById(id); if(e) e.remove();});
  try{ dagensKortLuk(); }catch(e){}
  var alt=[];
  for(var i=0;i<SIDER.length;i++){
    var navn=SIDER[i][0];
    try{ SIDER[i][1](); }catch(e){ console.log("UX FEJL "+navn+": "+e.message); continue; }
    await vent(900);
    try{ document.querySelectorAll("#turOverlay,.tur-slor,#turKort,#nyVersion,#dagensKort").forEach(function(e){e.remove()}); }catch(e){}
    try{ var ct=document.querySelector(".content"); if(ct) ct.scrollTop=0; }catch(e){}
    try{ alt=alt.concat(saml(navn)); }catch(e){ console.log("UX FEJL "+navn+" maaling: "+e.message); }
    var r=rod(); var c=document.querySelector(".content");
    if(document.documentElement.scrollWidth>innerWidth+1||(c&&c.scrollWidth>c.clientWidth+1)) console.log("UX SEJLADS "+navn);
    var bg=getComputedStyle(document.body).backgroundColor; var band=r.querySelector(".mb-baand,.hf-hero");
    console.log("UX SIDE "+navn+" bg="+bg+" baand="+(band?(band.className.split(" ")[0]+" h="+Math.round(band.getBoundingClientRect().height)):"INGEN")+" hero="+(r.querySelector(".mb-navn,.hf-citat")?txt(r.querySelector(".mb-navn,.hf-citat")):"-"));
  }
  var s=JSON.stringify(alt); for(var k=0;k<s.length;k+=6000) console.log("UX DATA "+s.slice(k,k+6000));
  console.log("UX SLUT "+alt.length);
}, 2500);
