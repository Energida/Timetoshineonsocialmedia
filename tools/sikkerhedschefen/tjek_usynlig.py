"""SIKKERHEDSCHEFEN · LØFTE 36 · TEKST, DER IKKE KAN SES (fejlkataloget B37). Hver synlig tekst på kundeappens og Backstages sider (390 og 1440):
kontrast mindst 1,6:1 mod baggrunden, og intet lag ovenpå. Kør: python3 tools/sikkerhedschefen/tjek_usynlig.py [--bred 390|1440] [sider …]"""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
KUNDE = "hjem kalender idebank indbakke planlaegning performance vaerktoej profil brief".split()
BACKSTAGE = "bs_overblik bs_indbakke bs_crm bs_energida bs_studio bs_gsd".split()

def koer(bred=1440, sider=None):
    c = chromium()
    if not c: return [Resultat(36, f"Usynlig tekst ({bred})", IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-usy-")
    subprocess.run(["python3", os.path.join(REPO, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    drv = open(os.path.join(HER, "lag2", "usynlig-driver.js"), encoding="utf-8").read()
    html = open(os.path.join(sele, "index-sele.html"), encoding="utf-8").read()
    i = html.rfind("</body>"); open(os.path.join(sele, "index-usy.html"), "w", encoding="utf-8").write(html[:i] + drv + html[i:])
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    hoej = 844 if bred < 900 else 900
    usynlig, laag, ikke, maalt = [], [], [], 0
    try:
        for sd in (sider or KUNDE + BACKSTAGE):
            bs = sd.startswith("bs_")
            fil = urllib.parse.quote(f"index-usy.html?uxf={sd}" + ("" if bs else "&selekode=HINGES2026"), safe="")
            url = f"http://127.0.0.1:{port}/sele.html?" + (f"side={sd[3:]}" if bs else "vis=kunde") + f"&fil={fil}&bred={bred}&hoej={hoej}"
            try:
                p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},{hoej}", "--virtual-time-budget=60000",
                                    "--enable-logging=stderr", "--v=0", "--dump-dom", url], capture_output=True, text=True, timeout=300)
                d = fortolk(p.stderr)
            except subprocess.TimeoutExpired:
                d = None
            if not d: ikke.append(sd); continue
            if d.get("fejl"): ikke.append(f"{sd} (scriptfejl: {d['fejl'][:80]})")
            maalt += d.get("maalt", 0)
            usynlig += [f"{sd}: {x}" for x in d.get("usynlig", [])]; laag += [f"{sd}: {x}" for x in d.get("laag", [])]
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    ud = [Resultat(36, f"Al tekst kan ses mod sin baggrund ({maalt} tekster, {bred})", FEJLET if usynlig else (IKKE_TESTET if not maalt else BESTAAET), " · ".join(usynlig)[:800]),
          Resultat(36, f"Intet lag ligger oven på teksten ({bred})", FEJLET if laag else (IKKE_TESTET if not maalt else BESTAAET), " · ".join(laag)[:800])]
    if ikke: ud.append(Resultat(36, f"Usynlig-tjekket nåede alle sider ({bred})", IKKE_TESTET, "ingen måling: " + ", ".join(ikke)))
    return ud

if __name__ == "__main__":
    bred = int(sys.argv[sys.argv.index("--bred") + 1]) if "--bred" in sys.argv else 1440
    sider = [a for a in sys.argv[1:] if not a.startswith("--") and not a.isdigit()] or None
    for r in koer(bred, sider): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
