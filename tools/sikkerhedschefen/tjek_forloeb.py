"""SIKKERHEDSCHEFEN · LØFTE 52 + 53 · KURSUSKUNDENS FORLØB (Ida 22/10: »et grundigt sikkerhedstjek hver dag for at det kunderne skriver ind at det bliver gemt …
når de laver opgaver og at statistikkerne på forsiden også opdaterer sig i takt med at kunderne ser lektionerne«).
En opdigtet kursuskunde (samme opsætning som TESTKUNDEA2026) udfylder ALLE lektioners opgaver og ser en lektion; siden genindlæses, og alt skal stå — i basen, i opgaven og i forsidens ring.
Kør: python3 tools/sikkerhedschefen/tjek_forloeb.py [repo]"""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
KODE = "FORLOEBTEST2026"
DEF = {"virksomhed": "Opdigtet kursus", "type": "kursus", "pakke": "detaildrift", "forloeb": "YOU GOT THIS — DETAIL", "ental": False, "skema": False, "login_klar": True,
       "oprettet": "2026-01-05", "forretningstype": "butik", "strategi": {"temaer": [], "analyse": ""}, "maal": {"tekst": "Opdigtet mål", "opslag_uge": 3}}

def koer(repo=REPO, bred=390, afvis=""):   # afvis="fejl" = modprøven: alle skrivninger afvises — tjekket SKAL fejle
    navn = f"{bred} px · kursuskundens forløb"
    c = chromium()
    if not c: return [Resultat(52, navn, IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-forl-")
    subprocess.run(["python3", os.path.join(repo, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))
    # som live: lektionerne kommer fra basen, er publiceret og har video (ellers er ingen lektion »aktiv«, og forsidens ring findes ikke)
    MOD = {"0": "Modul 0 · Introduktion", "1": "Modul 1 · Energi · Strategi · Resultat", "2": "Modul 2 · Mennesket", "4": "Modul 4 · Aflæs din konto", "5": "Modul 5 · Fyld din konto"}
    ids = ["0-1", "0-2", "1-1", "1-2", "2-1", "2-2", "2-3", "2-4", "4-3", "4-5", "4-6", "4-7", "4-8", "5-6"]
    lek = [{"id": i, "modul": MOD[i.split("-")[0]], "titel": "Opdigtet lektion " + i, "sortering": n, "video_link": "https://vimeo.com/000000" + str(n)} for n, i in enumerate(ids)]
    db = {"skema_svar": [{"id": "kd1", "kode": KODE, "navn": "config", "skema": "kunde_def", "svar": DEF},
                         {"id": "pub1", "kode": "ENERGIDA", "navn": "config", "skema": "publicering", "svar": {"lektioner": ids, "produkter": ["yougotthis"]}}],
          "lektioner": lek}
    ls = {"SELE_DB": json.dumps(db)}
    if afvis: ls["SELE_AFVIS"] = afvis
    open(os.path.join(sele, "sele-db.json"), "w").write(json.dumps({"ls": ls}))
    sk = socket.socket(); sk.bind(("127.0.0.1", 0)); port = sk.getsockname()[1]; sk.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    open(os.path.join(sele, "ft-driver.js"), "w", encoding="utf-8").write(open(os.path.join(HER, "lag2", "forloeb-driver.js"), encoding="utf-8").read())
    kode = urllib.parse.quote('var __x=new XMLHttpRequest();__x.open("GET","/ft-driver.js?"+Date.now(),false);__x.send();(0,eval)(__x.responseText);')
    fil = urllib.parse.quote("index-sele.html?selekode=" + KODE, safe="")
    url = f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}&bred={bred}&hoej=900&kode={kode}"
    try:
        p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},900", "--virtual-time-budget=150000", "--hide-scrollbars",
                            "--enable-logging=stderr", "--v=0", "--screenshot=" + os.path.join(sele, "x.png"), url], capture_output=True, text=True, timeout=300)
        d = fortolk(p.stderr)
    except subprocess.TimeoutExpired:
        d = None
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    if not d: return [Resultat(52, navn, IKKE_TESTET, "ingen måling fra browseren")]
    ud = [Resultat(t["loefte"], f"{bred} px · " + t["navn"], BESTAAET if t["ok"] else FEJLET, "" if t["ok"] else t["detalje"]) for t in d.get("tjek", [])]
    if d.get("fejl"): ud.append(Resultat(52, navn, FEJLET, "scriptfejl: " + d["fejl"]))
    return ud or [Resultat(52, navn, IKKE_TESTET, "intet målt")]

if __name__ == "__main__":
    repo = sys.argv[1] if len(sys.argv) > 1 else REPO
    for r in [x for b in (390, 1440) for x in koer(repo, b)]: print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
