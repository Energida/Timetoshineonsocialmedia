"""SIKKERHEDSCHEFEN · HVER KNAP VIRKER (løfte 8). Trykker hver synlig knap på kundeappens og Backstages sider i selen, på 390 og 1440:
en knap, der peger på en funktion, som ikke findes (død), eller som giver en JS-fejl, er FEJLET. Knapper uden synlig virkning listes som mangel.
Farlige knapper (slet, log ud, send, inviter …) trykkes aldrig. Kun opdigtede data.
Kør: python3 tools/sikkerhedschefen/tjek_knapper.py [--bred 390|1440] [sider …]"""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
KUNDE = "hjem kalender idebank indbakke planlaegning performance vaerktoej profil aarshjul maal byggesten brief menu tomhovedet plus nyide".split()
BACKSTAGE = "bs_overblik bs_indbakke bs_crm bs_energida bs_studio bs_maskinrum bs_gsd".split()

def koer(bred=1440, sider=None):
    c = chromium()
    if not c: return [Resultat(8, f"Hver knap virker ({bred})", IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-knap-")
    subprocess.run(["python3", os.path.join(REPO, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    drv = open(os.path.join(HER, "lag2", "knap-driver.js"), encoding="utf-8").read()
    html = open(os.path.join(sele, "index-sele.html"), encoding="utf-8").read()
    i = html.rfind("</body>"); open(os.path.join(sele, "index-knap.html"), "w", encoding="utf-8").write(html[:i] + drv + html[i:])
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    hoej = 844 if bred < 900 else 900
    doed, fejl, uden, ikke, antal = [], [], [], [], 0
    try:
        for sd in (sider or KUNDE + BACKSTAGE):
            bs = sd.startswith("bs_")
            fil = urllib.parse.quote(f"index-knap.html?uxf={sd}" + ("" if bs else "&selekode=HINGES2026"), safe="")
            url = f"http://127.0.0.1:{port}/sele.html?" + (f"side={sd[3:]}" if bs else "vis=kunde") + f"&fil={fil}&bred={bred}&hoej={hoej}"
            try:
                p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},{hoej}", "--virtual-time-budget=240000",
                                    "--enable-logging=stderr", "--v=0", "--dump-dom", url], capture_output=True, text=True, timeout=400)
                d = fortolk(p.stderr)
            except subprocess.TimeoutExpired:
                d = None
            if not d: ikke.append(sd); continue
            antal += d.get("antal", 0)
            doed += [f"{sd}: »{x['t']}« → {', '.join(x['udef'])}" for x in d.get("dod", [])]
            fejl += [f"{sd}: »{x['t']}« → {x['fejl'][0][:90]}" for x in d.get("fejl", [])]
            uden += [f"{sd}: »{x['t']}« ({x.get('oc','')[:60]})" for x in d.get("ingenEffekt", [])]
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    ud = [Resultat(8, f"Ingen døde knapper og ingen fejl ved tryk ({antal} knapper, {bred})", FEJLET if (doed or fejl) else (IKKE_TESTET if not antal else BESTAAET), " · ".join(doed + fejl)[:900])]
    if ikke: ud.append(Resultat(8, f"Knaptjekket nåede alle sider ({bred})", IKKE_TESTET, "ingen måling: " + ", ".join(ikke)))
    ud.append(Resultat(8, f"Knapper uden synlig virkning ({bred})", BESTAAET if not uden else FEJLET, f"{len(uden)}: " + " · ".join(uden)[:900] if uden else ""))
    return ud

if __name__ == "__main__":
    bred = int(sys.argv[sys.argv.index("--bred") + 1]) if "--bred" in sys.argv else 1440
    sider = [a for a in sys.argv[1:] if not a.startswith("--") and not a.isdigit()] or None
    for r in koer(bred, sider): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
