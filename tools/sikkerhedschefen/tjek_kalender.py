"""SIKKERHEDSCHEFEN · LØFTE 6 · Kalenderen viser hvert opslag på begge flader (lovet Ida 18/10). Kør: python3 tools/sikkerhedschefen/tjek_kalender.py [repo]"""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse, datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
KODE = "KALENDER2026"
DEF = {"virksomhed": "Opdigtet butik", "type": "contentplanner", "funktioner": ["indbakke", "content", "strategi", "resultat"]}
STATUS = ["Planlagt", "Brief i gang", "Klar til godkendelse", "Godkendt", "Klar til post", "Planlagt"]

def koer(repo=REPO, bred=390):
    navn = f"{bred} px · kalenderen viser alle opslag"
    c = chromium()
    if not c: return [Resultat(6, navn, IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-kal-")
    subprocess.run(["python3", os.path.join(repo, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))
    i0 = datetime.date.today()
    ops = [{"id": f"kal-{i}", "kode": KODE, "titel": f"Opdigtet opslag {i + 1}", "status": STATUS[i], "dato": (i0 + datetime.timedelta(days=i)).isoformat(), "format": "Reel", "soejle": "1A", "brief": {}} for i in range(6)]
    db = {"skema_svar": [{"id": "kd1", "kode": KODE, "navn": "config", "skema": "kunde_def", "svar": DEF}], "content_ideer": ops}
    open(os.path.join(sele, "sele-db.json"), "w").write(json.dumps({"ls": {"SELE_DB": json.dumps(db)}}))
    sk = socket.socket(); sk.bind(("127.0.0.1", 0)); port = sk.getsockname()[1]; sk.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    kode = urllib.parse.quote(open(os.path.join(HER, "lag2", "kalender-driver.js"), encoding="utf-8").read())
    fil = urllib.parse.quote("index-sele.html?selekode=" + KODE, safe="")
    url = f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}&bred={bred}&hoej=1600&kode={kode}"
    try:
        p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},1600", "--virtual-time-budget=45000", "--hide-scrollbars",
                            "--enable-logging=stderr", "--v=0", "--screenshot=" + os.path.join(sele, "x.png"), url], capture_output=True, text=True, timeout=180)
        d = fortolk(p.stderr)
    except subprocess.TimeoutExpired:
        d = None
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    if not d: return [Resultat(6, navn, IKKE_TESTET, "ingen måling fra browseren")]
    ud = [Resultat(6, t["navn"], BESTAAET if t["ok"] else FEJLET, "" if t["ok"] else t["detalje"]) for t in d.get("tjek", [])]
    if d.get("fejl"): ud.append(Resultat(6, navn, FEJLET, "scriptfejl: " + d["fejl"]))
    return ud or [Resultat(6, navn, IKKE_TESTET, "intet målt")]

if __name__ == "__main__":
    repo = sys.argv[1] if len(sys.argv) > 1 else REPO
    for r in [x for b in (390, 1440) for x in koer(repo, b)]: print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
