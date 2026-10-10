"""SIKKERHEDSCHEFEN · EN PRØVET VEJ TILBAGE (løfte 25). Beviser hver gang, at den FORRIGE version kan tages frem igen og starter:
henter den forrige version af index.html fra git (kun læsning), bygger selen af den og ser, at kundeappen og Backstage starter og har tekst.
Selve tilbagerulningen står i docs/tilbagerulning.md og gøres kun på Idas ord. Data i basen rulles IKKE tilbage her (Supabase-backup) — IKKE TESTET.
Kør: python3 tools/sikkerhedschefen/tjek_tilbage.py"""
import os, sys, re, json, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, REPO

def forrige_version():
    log = subprocess.run(["git", "-C", REPO, "log", "--format=%h %s", "-n", "60", "--", "version.txt"], capture_output=True, text=True).stdout.splitlines()
    nu = open(os.path.join(REPO, "version.txt")).read().strip()
    for l in log:
        h = l.split()[0]
        v = subprocess.run(["git", "-C", REPO, "show", h + ":version.txt"], capture_output=True, text=True).stdout.strip()
        if v and v != nu: return h, v
    return None, None

def koer():
    h, v = forrige_version()
    if not h: return [Resultat(25, "Den forrige version kan tages frem", IKKE_TESTET, "ingen forrige version fundet i git")]
    c = chromium()
    rod = tempfile.mkdtemp(prefix="sc-tilbage-"); sele = tempfile.mkdtemp(prefix="sc-tilbage-sele-")
    try:
        a = subprocess.run(f'git -C "{REPO}" archive {h} | tar -x -C "{rod}"', shell=True, capture_output=True, text=True)
        if not os.path.exists(os.path.join(rod, "index.html")): return [Resultat(25, f"Den forrige version (v{v}) kan tages frem", FEJLET, "git archive gav ingen index.html: " + a.stderr[:200])]
        # selen bygges direkte af den udpakkede forrige version (byg-sele.py's byg(rod, maal))
        sys.path.insert(0, os.path.join(REPO, "tools/designlaas"))
        import importlib.util
        spec = importlib.util.spec_from_file_location("bygsele", os.path.join(REPO, "tools/designlaas/byg-sele.py")); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
        m.byg(rod, sele)
        if not c: return [Resultat(25, f"Den forrige version (v{v}) kan tages frem", IKKE_TESTET, "Chromium findes ikke")]
        s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
        srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1.2)
        ud = []
        try:
            for navn, q in (("kundeappen", "vis=kunde&fil=" + urllib.parse.quote("index-sele.html?selekode=HINGES2026", safe="")), ("Backstage", "side=overblik&fil=index-sele.html")):
                kode = urllib.parse.quote('setTimeout(function(){var v=(typeof APP_VERSION!=="undefined")?APP_VERSION:"?";var t=(document.querySelector(".screen.active")||document.getElementById("dashMain")||document.body).innerText.replace(/\\s+/g," ").length;console.log("@@"+JSON.stringify({v:v,t:t})+"@@")},6000);')
                p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=390,844", "--virtual-time-budget=30000", "--enable-logging=stderr", "--v=0", "--screenshot=" + os.path.join(sele, "t.png"), f"http://127.0.0.1:{port}/sele.html?{q}&bred=390&hoej=844&kode={kode}"], capture_output=True, text=True, timeout=200)
                mm = re.search(r'"@@(\{.*?\})@@"', p.stderr); d = json.loads(mm.group(1).replace('\\"', '"')) if mm else None
                ok = bool(d and str(d.get("v")) == v and d.get("t", 0) > 40)
                ud.append(Resultat(25, f"Den forrige version (v{v}) starter i {navn}", BESTAAET if ok else FEJLET, "" if ok else ("ingen måling" if not d else f"version {d.get('v')} · {d.get('t')} tegn")))
        finally:
            srv.terminate()
        ud.append(Resultat(25, "Data i basen kan gendannes (Supabase-backup)", IKKE_TESTET, "ikke afprøvet — kræver Supabase-dashboard"))
        return ud
    finally:
        shutil.rmtree(rod, ignore_errors=True); shutil.rmtree(sele, ignore_errors=True)

if __name__ == "__main__":
    for r in koer(): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
