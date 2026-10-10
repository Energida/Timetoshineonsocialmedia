"""SIKKERHEDSCHEFEN · PLUSSET ÅBNER DET RIGTIGE (Ida 10/10: plusset i CRM viste ti »Tilføj rum« i stedet for Ny kunde —
»hvordan kunne jeg finde den fejl efter alt vi lige har været igennem?«). Går rundt mellem Backstages sider i selen, frem og
tilbage, trykker plusset hver gang og læser, hvilket ark der kom frem. Løfte 8 (hver knap virker).
Kør: python3 tools/sikkerhedschefen/tjek_plus.py [--bred 390|1440]"""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO

# side -> ord, der skal stå i det ark, plusset åbner. Rækkefølgen går frem og tilbage, så et plus fra én side kan ikke hænge ved på den næste.
RUNDE = [("energida", "Nyt rum"), ("overblik", "Tøm hovedet"), ("crm", "Opret ny kunde"), ("energida", "Nyt rum"), ("crm", "Opret ny kunde"),
         ("indbakke", "To-do"), ("crm", "Opret ny kunde"), ("overblik", "Tøm hovedet")]

JS = r"""(async function(){ var V=function(ms){return new Promise(function(r){setTimeout(r,ms)})}; await V(2500); var r={tjek:[]};
 var RUNDE=__RUNDE__;
 var luk=function(){ try{bsFlytLuk()}catch(e){} try{arkLuk(true)}catch(e){} try{nyKundeLuk()}catch(e){} };
 var overlag=function(){ return [].slice.call(document.querySelectorAll("body *")).filter(function(e){ var s=getComputedStyle(e); if(s.position!=="fixed") return false; var b=e.getBoundingClientRect(); return b.width>200&&b.height>100&&s.display!=="none"&&s.visibility!=="hidden"&&+s.opacity>0.1; }).map(function(e){return e.innerText.replace(/\s+/g," ")}).join(" | "); };
 try{ for (var i=0;i<RUNDE.length;i++){ var side=RUNDE[i][0], ord=RUNDE[i][1]; luk(); await V(300);
   visDashSide(side); await V(1500); var k=document.getElementById("bf3RumKnap"); var b=k&&k.querySelector("button");
   if(!b){ r.tjek.push({ok:false,side:side,d:"intet plus på siden"}); continue; }
   var foer=overlag(); b.click(); await V(800); var efter=overlag(); var nyt=efter.replace(foer,"");
   var ok=nyt.indexOf(ord)>=0; r.tjek.push({ok:ok,side:side,d:ok?"":("plus »"+b.title+"« åbnede: "+(nyt.trim().slice(0,120)||"ingenting")+" (ventede »"+ord+"«)")}); }
 }catch(e){r.fejl=e.message} luk(); console.log("@@"+JSON.stringify(r)+"@@"); })();"""

def koer(bred=1440):
    c = chromium()
    if not c: return [Resultat(8, f"Plusset åbner det rigtige ({bred})", IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-plus-")
    subprocess.run(["python3", os.path.join(REPO, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    try:
        kode = urllib.parse.quote(JS.replace("__RUNDE__", json.dumps(RUNDE)))
        url = f"http://127.0.0.1:{port}/sele.html?side=overblik&fil=index-sele.html&bred={bred}&hoej=900&kode={kode}"
        try:
            p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},900", "--virtual-time-budget=60000",
                                "--hide-scrollbars", "--enable-logging=stderr", "--v=0", "--screenshot=" + os.path.join(sele, "plus.png"), url], capture_output=True, text=True, timeout=200)
            d = fortolk(p.stderr)
        except subprocess.TimeoutExpired:
            d = None
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    if not d: return [Resultat(8, f"Plusset åbner det rigtige ({bred})", IKKE_TESTET, "ingen måling fra browseren")]
    if d.get("fejl"): return [Resultat(8, f"Plusset åbner det rigtige ({bred})", FEJLET, "scriptfejl: " + d["fejl"])]
    fejl = [t["side"] + ": " + t["d"] for t in d.get("tjek", []) if not t["ok"]]
    if not d.get("tjek"): return [Resultat(8, f"Plusset åbner det rigtige ({bred})", IKKE_TESTET, "ingen sider målt")]
    return [Resultat(8, f"Plusset åbner det rigtige på {len(d['tjek'])} sidebesøg ({bred})", FEJLET if fejl else BESTAAET, " · ".join(fejl))]

if __name__ == "__main__":
    bred = int(sys.argv[sys.argv.index("--bred") + 1]) if "--bred" in sys.argv else 1440
    for r in koer(bred): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
