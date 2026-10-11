"""SIKKERHEDSCHEFEN · LØFTE 9 · Næste skridt over folden. Åbner kundens skærme på telefonen (390 × 844) og måler, at den røde hovedhandling
(næste skridt) står helt inden for skærmen uden at rulle. En skærm uden rød handling tælles ikke som fejl. Kør: python3 tools/sikkerhedschefen/tjek_fold.py"""
import os, sys, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
SIDER = "hjem kalender idebank planlaegning performance forloeb brief".split()   # briefen åbner den opdigtede idé, selen startes med (11/10)

def koer(repo=REPO, bred=390, hoej=844):
    c = chromium()
    if not c: return [Resultat(9, "Næste skridt over folden", IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-fold-")
    subprocess.run(["python3", os.path.join(repo, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))   # huske-basen, så briefen har en idé at åbne
    import json as _j
    db = {"content_ideer": [{"id": "fold-ide-1", "kode": "HINGES2026", "titel": "Opdigtet idé til fold-tjekket", "status": "Idé", "soejle": "Produkt", "type": "Reel", "dato": None, "brief": {"beskrivelse": "Opdigtet"}, "created_at": "2026-10-01T10:00:00Z"}]}
    open(os.path.join(sele, "sele-db.json"), "w").write(_j.dumps({"ls": {"SELE_DB": _j.dumps(db)}}))
    drv = open(os.path.join(HER, "lag2", "fold-driver.js"), encoding="utf-8").read()
    html = open(os.path.join(sele, "index-sele.html"), encoding="utf-8").read(); i = html.rfind("</body>")
    open(os.path.join(sele, "index-fold.html"), "w", encoding="utf-8").write(html[:i] + drv + html[i:])
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1.2)
    ud, ikke = [], []
    try:
        for sd in SIDER:
            fil = urllib.parse.quote(f"index-fold.html?foldf={sd}&selekode=HINGES2026", safe="")
            try:
                p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},{hoej}", "--virtual-time-budget=40000", "--enable-logging=stderr", "--v=0", "--dump-dom",
                                    f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}&bred={bred}&hoej={hoej}"], capture_output=True, text=True, timeout=200)
                d = fortolk(p.stderr)
            except subprocess.TimeoutExpired:
                d = None
            if not d: ikke.append(sd); continue
            roed = d.get("roed") or []
            if not roed: continue
            f = roed[0]; vh = d.get("vh") or hoej
            ok = f["top"] >= 0 and f["top"] + min(f["h"], 44) <= vh
            ud.append(Resultat(9, f"Næste skridt over folden: {sd}", BESTAAET if ok else FEJLET, "" if ok else f"»{f['t']}« står {f['top']} px nede (skærmen er {vh} høj)"))
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    if ikke: ud.append(Resultat(9, "Fold-tjekket nåede alle skærme", IKKE_TESTET, "ingen måling: " + ", ".join(ikke)))
    return ud or [Resultat(9, "Næste skridt over folden", IKKE_TESTET, "ingen røde handlinger fundet")]

if __name__ == "__main__":
    for r in koer(sys.argv[1] if len(sys.argv) > 1 else REPO): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
