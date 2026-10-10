"""SIKKERHEDSCHEFEN · COMPUTEREN STÅR STILLE (Ida 10/10: »hver gang jeg klikker … så rykker tingene sig« — desktop admin og b2b).
Skifter side frem og tilbage på 1440 og måler, at menuen, sidens ark og heroens titel står på samme sted; at pladsen til rullepanelet
er fast (scrollbar-gutter) og at ingen knap krymper ved tryk med mus (:active-scale). Løfte 15. Kør: python3 tools/sikkerhedschefen/tjek_stille.py"""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO

JS = r"""(async function(){ var V=function(ms){return new Promise(function(r){setTimeout(r,ms)})}; await V(6000); var r={maal:[],fejl:[]};
 try{ try{dagensKortLuk()}catch(e){} try{turLuk()}catch(e){} var t=document.getElementById("turOverlay"); if(t) t.remove();
  var BS=__BS__;
  var pos=function(e){ if(!e) return null; var b=e.getBoundingClientRect(); return [Math.round(b.left),Math.round(b.top),Math.round(b.width)]; };
  var titel=function(){ return [].slice.call(document.querySelectorAll(".mb-navn, .mb-navn-rk")).filter(function(e){ var b=e.getBoundingClientRect(); return b.width>0 && b.top<450 && !e.closest(".mb-navn-rk .mb-navn"); })[0]||null; };
  var maal=function(navn){ var m={side:navn, menu:pos(document.querySelector(".dash-sidebar, #sideNav")), ark:pos(BS?document.getElementById("dashMain"):document.querySelector(".content")), titel:pos(titel())}; r.maal.push(m); return m; };
  var sider = BS ? [["overblik"],["crm"],["indbakke"],["energida"],["overblik"],["crm"]] : [[3],[8],[2],[31],[3],[8]];
  for (var i=0;i<sider.length;i++){ try{ if(BS) visDashSide(sider[i][0]); else showTab(sider[i][0]); }catch(e){} await V(1200); maal(String(sider[i][0])); }
  var f=r.maal[0]; r.maal.forEach(function(m){ ["menu","ark"].forEach(function(k){ if(f[k] && m[k] && (f[k][0]!==m[k][0] || f[k][2]!==m[k][2])) r.fejl.push(m.side+": "+k+" "+JSON.stringify(f[k])+"→"+JSON.stringify(m[k])); });
    if(f.titel && m.titel && (f.titel[0]!==m.titel[0] || Math.abs(f.titel[1]-m.titel[1])>2)) r.fejl.push(m.side+": titel "+JSON.stringify(f.titel)+"→"+JSON.stringify(m.titel)); });
  r.gutter = getComputedStyle(document.documentElement).scrollbarGutter;
  var laas=0, ude=[]; [].slice.call(document.styleSheets).forEach(function(ss){ try{ [].slice.call(ss.cssRules).forEach(function walk(ru){ if(ru.cssRules && ru.media){ if(window.matchMedia(ru.media.mediaText).matches) [].slice.call(ru.cssRules).forEach(walk); return; } if(ru.selectorText && /:active/.test(ru.selectorText)){ if(/none/.test(ru.style.transform||"") && ru.style.getPropertyPriority("transform")==="important") laas+=ru.selectorText.split(",").length; } }); }catch(e){} });
  r.laas=laas;
 }catch(e){r.fejl.push("script: "+e.message)} console.log("@@"+JSON.stringify(r)+"@@"); })();"""

def koer_en(bs):
    c = chromium()
    if not c: return None
    sele = tempfile.mkdtemp(prefix="sc-stille-")
    subprocess.run(["python3", os.path.join(REPO, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    try:
        kode = urllib.parse.quote(JS.replace("__BS__", "true" if bs else "false"))
        fil = "index-sele.html" if bs else urllib.parse.quote("index-sele.html?selekode=HINGES2026", safe="")
        url = f"http://127.0.0.1:{port}/sele.html?" + ("side=overblik" if bs else "vis=kunde") + f"&fil={fil}&bred=1440&hoej=900&kode={kode}"
        p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1440,900", "--virtual-time-budget=45000",
                            "--enable-logging=stderr", "--v=0", "--screenshot=" + os.path.join(sele, "s.png"), url], capture_output=True, text=True, timeout=200)
        return fortolk(p.stderr)
    except subprocess.TimeoutExpired:
        return None
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)

def koer():
    ud = []
    for bs, navn in ((True, "Backstage"), (False, "kundeappen")):
        d = koer_en(bs)
        if not d: ud.append(Resultat(15, f"Computeren står stille ved sideskift ({navn})", IKKE_TESTET, "ingen måling")); continue
        maalt = [m for m in d["maal"] if m.get("ark") and m.get("titel")]
        if len(maalt) < len(d["maal"]): ud.append(Resultat(15, f"Computeren står stille ved sideskift ({navn})", IKKE_TESTET, "ikke fundet: " + ", ".join(m["side"] + ("" if m.get("ark") else " ark") + ("" if m.get("titel") else " titel") for m in d["maal"] if not (m.get("ark") and m.get("titel"))))) 
        else: ud.append(Resultat(15, f"Computeren står stille ved sideskift ({navn}, {len(d['maal'])} skift)", FEJLET if d["fejl"] else BESTAAET, " · ".join(d["fejl"])[:600]))
        ud.append(Resultat(15, f"Fast plads til rullepanelet ({navn})", BESTAAET if d.get("gutter") == "stable" else FEJLET, "" if d.get("gutter") == "stable" else f"scrollbar-gutter = {d.get('gutter')}"))
        ud.append(Resultat(15, f"Knapper krymper ikke ved klik med mus ({navn})", BESTAAET if d.get("laas", 0) >= 30 else FEJLET, "" if d.get("laas", 0) >= 30 else f"låsen dækker {d.get('laas', 0)} :active-regler"))
    return ud

if __name__ == "__main__":
    for r in koer(): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
