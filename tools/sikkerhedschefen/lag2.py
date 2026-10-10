"""SIKKERHEDSCHEFEN · LAG 2 · testversionen med huske-basen. Bygger selen uden for repoet, bytter stubben ud med
husk-stub.js og koerer scenarierne i faser i samme browser-profil og paa samme port, saa localStorage (basen) overlever
genindlaesningen. Kun opdigtede data. Koer: python3 tools/sikkerhedschefen/lag2.py [--bred 390|1440]"""
import os, sys, re, json, glob, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
HER = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HER, "..", ".."))
FASER = ["nulstil", "skriv", "laes1", "laes2", "link", "kode"]
EKSTRA = {"link": "&brief=sc-ide-2&kunde=HINGES2026"}   # delelinket, Ida sender til kunden

def chromium():
    c = glob.glob(os.path.expanduser("~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium"))
    return c[0] if c else None

def fortolk(stderr):
    for linje in stderr.splitlines():
        i = linje.find('"@@{')
        if i < 0: continue
        j = linje.rfind('}@@"')
        raa = linje[i + 3:j + 1]
        for kandidat in (raa, raa.replace('\\"', '"')):
            try: return json.loads(kandidat)
            except Exception: pass
    return None

def koer(bred=1440):
    c = chromium()
    if not c: return [Resultat(1, "Lag 2", IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-sele-"); profil = tempfile.mkdtemp(prefix="sc-profil-")
    subprocess.run(["python3", os.path.join(REPO, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    scen = open(os.path.join(HER, "lag2", "scenarier.js"), encoding="utf-8").read()
    ud = []
    try:
        for fase in FASER:
            kode = urllib.parse.quote("window.__FASE=" + json.dumps(fase) + ";" + scen)
            fil = urllib.parse.quote("index-sele.html?selekode=HINGES2026" + EKSTRA.get(fase, ""), safe="")
            if fase == "nulstil" and os.path.exists(os.path.join(sele, "sele-db.json")): os.remove(os.path.join(sele, "sele-db.json"))
            url = f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}&bred={bred}&hoej=900&kode={kode}"
            try:
                p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},900",
                                    "--virtual-time-budget=45000", "--hide-scrollbars", "--enable-logging=stderr", "--v=0", "--screenshot=" + os.path.join(profil, "..", "sc-" + fase + ".png"), url], capture_output=True, text=True, timeout=180)
                d = fortolk(p.stderr)
            except subprocess.TimeoutExpired:
                d = None
            if d and "ls" in d: open(os.path.join(sele, "sele-db.json"), "w", encoding="utf-8").write(json.dumps({"ls": d["ls"]}))
            if not d:
                ud.append(Resultat(1, f"Fase {fase} ({bred})", IKKE_TESTET, "ingen måling fra browseren")); break
            if d.get("fejl"): ud.append(Resultat(1, f"Fase {fase} ({bred})", FEJLET, "scriptfejl: " + d["fejl"]))
            for t in d.get("tjek", []):
                if t["loefte"] == 0: continue
                ud.append(Resultat(t["loefte"], f"{t['navn']} ({bred})", BESTAAET if t["ok"] else FEJLET, "" if t["ok"] else t["detalje"]))
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True); shutil.rmtree(profil, ignore_errors=True)
    return ud

if __name__ == "__main__":
    bred = int(sys.argv[sys.argv.index("--bred") + 1]) if "--bred" in sys.argv else 1440
    for r in koer(bred): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
