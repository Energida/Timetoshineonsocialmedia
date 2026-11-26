"""SIKKERHEDSCHEFEN · LØFTE 15 · HAKJÆGEREN (Ida 19/11: »jeg oplever en masse hak i b2b siden når man vil navigere frem og tilbage -
spøgelsessider mm. - specielt ved coveret i briefen«). Filmer kalender → brief → Tilbage, brief → brief, browserens Tilbage/Frem
og menuskift på 390 og 1440 — inde i siden: den forrige brief som spøgelse, coveret der blinker eller springer, indhold der hopper.
Kør: python3 tools/sikkerhedschefen/tjek_hak.py [repo]"""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse, datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
KODE = "SPOEGELSE2026"
DEF = {"virksomhed": "Opdigtet butik", "type": "contentplanner", "funktioner": ["indbakke", "content", "strategi", "resultat"]}

def jaeger(repo=REPO, bred=390):
    navn = f"{bred} px · hakjægeren"
    c = chromium()
    if not c: return [Resultat(15, navn, IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-hak-")
    subprocess.run(["python3", os.path.join(repo, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))
    idag = datetime.date.today().isoformat()
    cover = {"format": "Reel", "beskrivelse": "En kunde viser sin yndlingsvare frem.", "captionFoerste": "Kender du den?", "medier": {"cover": [{"sti": "hak/cover.jpg", "navn": "cover.jpg"}]}}
    db = {"skema_svar": [{"id": "kd1", "kode": KODE, "navn": "config", "skema": "kunde_def", "svar": DEF}],
          "content_ideer": [{"id": "hak-a", "kode": KODE, "titel": "Hak A med cover", "status": "Brief i gang", "dato": idag, "format": "Reel", "soejle": "1A", "brief": cover},
                            {"id": "hak-b", "kode": KODE, "titel": "Hak B uden cover", "status": "Brief i gang", "dato": idag, "format": "Reel", "soejle": "2A", "brief": {"format": "Reel", "beskrivelse": "Bag om disken en travl morgen."}}]}
    open(os.path.join(sele, "sele-db.json"), "w").write(json.dumps({"ls": {"SELE_DB": json.dumps(db), "SELE_LATENS": "400"}}))
    sk = socket.socket(); sk.bind(("127.0.0.1", 0)); port = sk.getsockname()[1]; sk.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    kode = urllib.parse.quote(open(os.path.join(HER, "lag2", "hak-driver.js"), encoding="utf-8").read())
    fil = urllib.parse.quote("index-sele.html?selekode=" + KODE, safe="")
    url = f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}&bred={bred}&hoej=900&kode={kode}"
    # RIGTIG TID (19/11): med --virtual-time-budget saas hakket aldrig — et frys i appen var ikke et frys i maalingen. realtid.mjs koerer Chrome i rigtig tid.
    url = url.replace("&kode=", "&kode=" + urllib.parse.quote("window.__HAK_REALTID=1;"), 1)
    try:
        p = subprocess.run(["node", os.path.join(HER, "lag2", "realtid.mjs"), c, url, str(bred), "900", "120"], capture_output=True, text=True, timeout=200)
        t = p.stdout; i = t.find("@@"); j = t.rfind("@@")
        d = json.loads(t[i + 2:j]) if i > -1 and j > i else None
    except Exception:
        d = None
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    if not d: return [Resultat(15, navn, IKKE_TESTET, "ingen måling fra browseren")]
    ud = [Resultat(15, f"{bred} px · " + t["navn"], BESTAAET if t["ok"] else FEJLET, "" if t["ok"] else t["detalje"]) for t in d.get("tjek", [])]
    if d.get("fejl"): ud.append(Resultat(15, navn, FEJLET, "scriptfejl: " + d["fejl"]))
    return ud or [Resultat(15, navn, IKKE_TESTET, "intet målt")]

if __name__ == "__main__":
    repo = sys.argv[1] if len(sys.argv) > 1 else REPO
    for r in [x for b in (390, 1440) for x in jaeger(repo, b)]: print(f"{r.tilstand:<11} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
