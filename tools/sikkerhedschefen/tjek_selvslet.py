"""SIKKERHEDSCHEFEN · LØFTE 32 · APPEN ÆNDRER ALDRIG DATA AF SIG SELV (fejlkataloget A4). Basen sås med idéer, en aftale og en opgave;
kunden går rundt og genindlæser uden at trykke — hver række skal være uændret. Kør: python3 tools/sikkerhedschefen/tjek_selvslet.py [repo]"""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
import datetime
def _d(n): return (datetime.date.today() + datetime.timedelta(days=n)).isoformat()
def SAA():
    K = "HINGES2026"; nu = datetime.datetime.now().isoformat()
    ide = lambda i, titel, status, dato, brief: {"id": f"ss{i}", "kode": K, "titel": titel, "status": status, "soejle": "Produkt", "type": "Reel", "dato": dato, "brief": brief, "created_at": nu}
    return {"content_ideer": [ide(1, "Planlagt i går", "Planlagt", _d(-1), {"hook": "Se her", "tid": "19:00"}), ide(2, "Brief i gang sidste uge", "Brief i gang", _d(-7), {"beskrivelse": "Kort"}),
                              ide(3, "Planlagt i morgen", "Planlagt", _d(1), {}), ide(4, "Idé uden dato", "Idé", None, {}), ide(5, "Postet i forgårs", "Postet", _d(-2), {})],
            "kunde_aftaler": [{"id": "sa1", "kode": K, "titel": "Planlægningsmøde", "dato": _d(-3), "tid": "10:00", "created_at": nu}],
            "kunde_opgaver": [{"id": "so1", "kode": K, "titel": "Ring til leverandør", "dato": _d(-2), "status": "aaben", "created_at": nu}]}

def koer(repo=REPO):
    c = chromium()
    if not c: return [Resultat(32, "Ingen selvsletning", IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-ss-")
    subprocess.run(["python3", os.path.join(repo, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))
    db = SAA()
    open(os.path.join(sele, "sele-db.json"), "w").write(json.dumps({"ls": {"SELE_DB": json.dumps(db)}}))
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    kode = urllib.parse.quote(open(os.path.join(HER, "lag2", "selvslet-driver.js"), encoding="utf-8").read())
    fil = urllib.parse.quote("index-sele.html?selekode=HINGES2026", safe="")
    url = f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}&bred=1440&hoej=900&kode={kode}"
    try:
        p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1440,900", "--virtual-time-budget=45000", "--hide-scrollbars",
                            "--enable-logging=stderr", "--v=0", "--screenshot=" + os.path.join(sele, "x.png"), url], capture_output=True, text=True, timeout=180)
        d = fortolk(p.stderr)
    except subprocess.TimeoutExpired:
        d = None
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    if not d: return [Resultat(32, "Ingen selvsletning", IKKE_TESTET, "ingen måling fra browseren")]
    ud = [Resultat(32, t["navn"], BESTAAET if t["ok"] else FEJLET, "" if t["ok"] else t["detalje"]) for t in d.get("tjek", [])]
    if d.get("fejl"): ud.append(Resultat(32, "Selvsletnings-scenariet", FEJLET, "scriptfejl: " + d["fejl"]))
    return ud or [Resultat(32, "Ingen selvsletning", IKKE_TESTET, "intet målt")]

if __name__ == "__main__":
    repo = sys.argv[1] if len(sys.argv) > 1 else REPO
    for r in koer(repo): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
