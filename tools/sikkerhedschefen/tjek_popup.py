"""SIKKERHEDSCHEFEN · LØFTE 30 · POPUP-RUNDEN (fejlkataloget D, Ida 12/10). Trykker hver knap på kundeappens og Backstages sider i selen (390 og 1440).
Åbner den en popup: højst ét lag · krydset lukker · samme knap åbner igen · intet usynligt lag over knappen bagefter. Farlige knapper trykkes aldrig.
Kør: python3 tools/sikkerhedschefen/tjek_popup.py [--bred 390|1440] [sider …]"""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
KUNDE = "hjem kalender idebank indbakke planlaegning performance vaerktoej profil brief".split()
BACKSTAGE = "bs_overblik bs_indbakke bs_crm bs_energida bs_studio bs_gsd".split()

def koer(bred=1440, sider=None):
    c = chromium()
    if not c: return [Resultat(30, f"Popup-runden ({bred})", IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-pop-")
    subprocess.run(["python3", os.path.join(REPO, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    drv = open(os.path.join(HER, "lag2", "popup-driver.js"), encoding="utf-8").read()
    html = open(os.path.join(sele, "index-sele.html"), encoding="utf-8").read()
    i = html.rfind("</body>"); open(os.path.join(sele, "index-pop.html"), "w", encoding="utf-8").write(html[:i] + drv + html[i:])
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    hoej = 844 if bred < 900 else 900
    fund = {"toLag": [], "lukkerIkke": [], "aabnerIkkeIgen": [], "overlag": [], "blivende": [], "udenKryds": []}
    ikke, antal = [], 0
    try:
        for sd in (sider or KUNDE + BACKSTAGE):
            bs = sd.startswith("bs_")
            fil = urllib.parse.quote(f"index-pop.html?uxf={sd}" + ("" if bs else "&selekode=HINGES2026"), safe="")
            url = f"http://127.0.0.1:{port}/sele.html?" + (f"side={sd[3:]}" if bs else "vis=kunde") + f"&fil={fil}&bred={bred}&hoej={hoej}"
            try:
                p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},{hoej}", "--virtual-time-budget=300000",
                                    "--enable-logging=stderr", "--v=0", "--dump-dom", url], capture_output=True, text=True, timeout=900)
                d = fortolk(p.stderr)
            except subprocess.TimeoutExpired:
                d = None
            if not d: ikke.append(sd); continue
            antal += d.get("popups", 0)
            if d.get("fejl"): ikke.append(f"{sd} (scriptfejl: {d['fejl'][:80]})")
            for k in fund: fund[k] += [f"{sd}: {x}" for x in d.get(k, [])]
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    def r(navn, liste): return Resultat(30, f"{navn} ({bred})", FEJLET if liste else (IKKE_TESTET if not antal else BESTAAET), " · ".join(liste)[:700])
    ud = [r(f"Højst ét popup-lag ad gangen ({antal} popups)", fund["toLag"]), r("Krydset lukker popuppen", fund["lukkerIkke"]),
          r("Samme knap åbner popuppen igen efter krydset", fund["aabnerIkkeIgen"]), r("Intet usynligt lag over knapperne", fund["overlag"] + fund["blivende"]),
          r("Hver popup har et kryds", fund["udenKryds"])]
    if ikke: ud.append(Resultat(30, f"Popup-runden nåede alle sider ({bred})", IKKE_TESTET, "ingen måling: " + ", ".join(ikke)))
    return ud

if __name__ == "__main__":
    bred = int(sys.argv[sys.argv.index("--bred") + 1]) if "--bred" in sys.argv else 1440
    sider = [a for a in sys.argv[1:] if not a.startswith("--") and not a.isdigit()] or None
    for r in koer(bred, sider): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
