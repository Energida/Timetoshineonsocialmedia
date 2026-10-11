"""SIKKERHEDSCHEFEN · LØFTE 27 · Ida kan følge lektionerne (set · stjerner · kommentar) hele vejen fra kunden til »Sådan går det«.
Kør: python3 tools/sikkerhedschefen/tjek_spor.py"""
import os, sys, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))

def koer(repo=REPO):
    c = chromium()
    if not c: return [Resultat(27, "Lektionerne kan følges", IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-spor-")
    subprocess.run(["python3", os.path.join(repo, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    kode = urllib.parse.quote(open(os.path.join(HER, "lag2", "spor-driver.js"), encoding="utf-8").read())
    url = f"http://127.0.0.1:{port}/sele.html?side=overblik&fil=index-sele.html&bred=1440&hoej=900&kode={kode}"
    try:
        p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1440,900", "--virtual-time-budget=45000", "--hide-scrollbars",
                            "--enable-logging=stderr", "--v=0", "--screenshot=" + os.path.join(sele, "x.png"), url], capture_output=True, text=True, timeout=180)
        d = fortolk(p.stderr)
    except subprocess.TimeoutExpired:
        d = None
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    if not d: return [Resultat(27, "Lektionerne kan følges", IKKE_TESTET, "ingen måling fra browseren")]
    ud = [Resultat(27, t["navn"], BESTAAET if t["ok"] else FEJLET, "" if t["ok"] else t["detalje"]) for t in d.get("tjek", [])]
    if d.get("fejl"): ud.append(Resultat(27, "Sporings-scenariet", FEJLET, "scriptfejl: " + d["fejl"]))
    return ud or [Resultat(27, "Lektionerne kan følges", IKKE_TESTET, "intet målt")]

if __name__ == "__main__":
    repo = sys.argv[1] if len(sys.argv) > 1 else REPO
    for r in koer(repo): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
