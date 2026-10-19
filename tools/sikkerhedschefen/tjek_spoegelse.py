"""SIKKERHEDSCHEFEN · LØFTE 15 · Spøgelsessiden (Ida 18–19/10: »kalenderen blinker, før briefen åbner« i Acorns via genvejen).
Kunden åbner et dybt link til en brief (#fane=8&brief=ID). Hvert billede filmes fra start: Hjem eller kalenderen må ikke stå uden tæppe, før briefen står.
Kør: python3 tools/sikkerhedschefen/tjek_spoegelse.py [repo]"""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
KODE = "SPOEGELSE2026"
DEF = {"virksomhed": "Opdigtet butik", "type": "contentplanner", "funktioner": ["indbakke", "content", "strategi", "resultat"]}

def koer(repo=REPO, bred=1440):
    navn = f"{bred} px · spøgelsessiden"
    c = chromium()
    if not c: return [Resultat(15, navn, IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-spg-")
    subprocess.run(["python3", os.path.join(repo, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))
    ix = os.path.join(sele, "index-sele.html"); s = open(ix, encoding="utf-8").read()
    sampler = open(os.path.join(HER, "lag2", "spoegelse-sampler.js"), encoding="utf-8").read()
    s = s.replace("<head>", "<head><script>" + sampler + "</script>", 1); open(ix, "w", encoding="utf-8").write(s)
    d0 = time.strftime("%Y-%m-%d", time.localtime(time.time() + 3 * 86400))
    db = {"skema_svar": [{"id": "kd1", "kode": KODE, "navn": "config", "skema": "kunde_def", "svar": DEF}],
          "content_ideer": [{"id": "spg-brief-1", "kode": KODE, "titel": "Opdigtet opslag", "status": "Brief i gang", "dato": d0, "format": "Reel", "soejle": "1A", "brief": {}}]}
    # som live: hvert kald til basen tager tid (uden ventetid ses blinket aldrig i selen)
    open(os.path.join(sele, "sele-db.json"), "w").write(json.dumps({"ls": {"SELE_DB": json.dumps(db), "SELE_LATENS": "700"}}))
    sk = socket.socket(); sk.bind(("127.0.0.1", 0)); port = sk.getsockname()[1]; sk.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    kode = urllib.parse.quote(open(os.path.join(HER, "lag2", "spoegelse-driver.js"), encoding="utf-8").read())
    fil = urllib.parse.quote("index-sele.html?selekode=" + KODE, safe="")
    hsh = urllib.parse.quote("#fane=8&brief=spg-brief-1", safe="")
    url = f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}&hash={hsh}&bred={bred}&hoej=900&kode={kode}"
    try:
        p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},900", "--virtual-time-budget=90000", "--hide-scrollbars",
                            "--enable-logging=stderr", "--v=0", "--screenshot=" + os.path.join(sele, "x.png"), url], capture_output=True, text=True, timeout=180)
        d = fortolk(p.stderr)
    except subprocess.TimeoutExpired:
        d = None
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    if not d: return [Resultat(15, navn, IKKE_TESTET, "ingen måling fra browseren")]
    ud = [Resultat(15, f"{bred} px · " + t["navn"], BESTAAET if t["ok"] else FEJLET, "" if t["ok"] else t["detalje"]) for t in d.get("tjek", [])]
    if d.get("fejl"): ud.append(Resultat(15, navn, FEJLET, "scriptfejl: " + d["fejl"]))
    return ud or [Resultat(15, navn, IKKE_TESTET, "intet målt")]

if __name__ == "__main__":
    repo = sys.argv[1] if len(sys.argv) > 1 else REPO
    for r in [x for b in (1440, 390) for x in koer(repo, b)]: print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
