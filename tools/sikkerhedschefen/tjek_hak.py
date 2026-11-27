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

# KALENDERENS VÆRKTØJSRÆKKE (Ida 25/11: »hvorfor finder hakjægeren ikke dette???«). Idas video: Chrome ca. 1280–1366 px, admin »som kunde« (rød bjælke),
# 14 dage — værktøjsrækken stod et billede nede i ugegitteret (»14 dage« over »LØR 28 NOV«). Jægeren ovenfor kører kun 390/1440, kun som kunde, kun briefen.
# Her: kalenderen i 14 dage på mellembredderne og 1440, som kunde OG med »som kunde«-bjælken. Et fund tæller først, når det ses i TO kørsler;
# fund i hak-grundlinje.json er kendte (vises, vælter ikke porten); en scene, der ikke kunne køres, er IKKE TESTET.
KAL_BREDDER = (1024, 1280, 1366, 1440)   # Idas Mac-Chrome (25/11) + 1440 som kontrol. Ikke 390: telefonen viser Content-forsiden (contentFacit), ikke ugegitteret med værktøjsrækken (målt 25/11: »kalenderen blev aldrig vist«)
HAK_GRUNDLINJE = os.path.join(HER, "hak-grundlinje.json")

def _kal_db():
    idag = datetime.date.today()
    def op(i, titel, dage, status): return {"id": "kh-%d" % i, "kode": KODE, "titel": titel, "status": status, "dato": (idag + datetime.timedelta(days=dage)).isoformat(), "type": "Reel", "format": "Reel", "soejle": "1A", "brief": {"format": "Reel", "beskrivelse": titel}}
    DEF2 = dict(DEF, type="contentstudio")
    return {"skema_svar": [{"id": "kd1", "kode": KODE, "navn": "config", "skema": "kunde_def", "svar": DEF2}],
            "content_ideer": [op(1, "Tre gryder til december", 0, "Brief i gang"), op(2, "Sådan sliber du kniven", 1, "Planlagt"), op(3, "Bag om disken", -2, "Postet")]
                             + [op(10 + n, "Opdigtet opslag nr. %d" % (n + 1), 2 + n, "Planlagt") for n in range(8)]}

def _kal_koer_en(repo, bred, somkunde, film=None, sek=100, driver=None):
    c = chromium()
    if not c: return None, "Chromium findes ikke"
    sele = tempfile.mkdtemp(prefix="sc-kalhak-")
    try:
        subprocess.run(["python3", os.path.join(repo, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
        shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))
        open(os.path.join(sele, "sele-db.json"), "w").write(json.dumps({"ls": {"SELE_DB": json.dumps(_kal_db()), "SELE_LATENS": "200", "cal_visning": "fjorten"}}))
        kode = ("window.__KH_SOMKUNDE=1;\n" if somkunde else "") + open(driver or os.path.join(HER, "lag2", "kalhak-driver.js"), encoding="utf-8").read()
        open(os.path.join(sele, "kh-probe.js"), "w", encoding="utf-8").write(kode)
        sk = socket.socket(); sk.bind(("127.0.0.1", 0)); port = sk.getsockname()[1]; sk.close()
        SRV = "import http.server,sys\nclass H(http.server.SimpleHTTPRequestHandler):\n    def log_message(self,*a): pass\nhttp.server.ThreadingHTTPServer(('127.0.0.1',int(sys.argv[1])),H).serve_forever()"
        srv = subprocess.Popen(["python3", "-c", SRV, str(port)], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(1.2)
        fil = urllib.parse.quote("index-sele.html?selekode=" + KODE, safe="")
        # »som kunde« = Idas vej fra CRM'et: #somkunde=<kode>&fane=8 (bjælken »… det du skriver her, gemmes hos kunden.« øverst). Selens bruger har kunden som sin egen kode, så appen beholder SOM_KUNDE.
        hsh = "&hash=" + urllib.parse.quote(urllib.parse.quote("#somkunde=" + KODE + "&fane=8", safe=""), safe="") if somkunde else ""
        url = f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}{hsh}&bred={bred}&hoej=900&kodefil=kh-probe.js"
        try:
            p = subprocess.run(["node", os.path.join(HER, "lag2", "realtid.mjs"), c, url, str(bred), "900", str(sek)] + ([film] if film else []), capture_output=True, text=True, timeout=sek + 60)
            t = p.stdout; i = t.find("@@"); j = t.rfind("@@")
            if i > -1 and j > i: return json.loads(t[i + 2:j]), ""
            return None, "ingen måling fra browseren (" + " ¦ ".join(t.strip().splitlines()[-4:])[-300:] + ")"
        except Exception as e:
            return None, "kørslen fejlede: " + str(e)[:140]
        finally:
            srv.kill(); srv.wait()
    finally:
        shutil.rmtree(sele, ignore_errors=True)

def _kal_noegle(bred, somkunde, scene, f):
    return "%s|%s|%s|%s" % (bred, "somkunde" if somkunde else "kunde", scene, f["art"])

def kalender(repo=REPO, bred=1280, somkunde=False, film=None):
    """Kalenderens værktøjsrække i 14 dage. To kørsler, hvis den første har fund. NYT fund (set to gange) = FEJLET · kendt = BESTÅET med note · ikke kørt = IKKE TESTET."""
    hvem = "som kunde (admin, rød bjælke)" if somkunde else "kunde"
    navn = f"{bred} px · kalenderen 14 dage · {hvem}"
    d1, fejl = _kal_koer_en(repo, bred, somkunde, film)
    if not d1: return [Resultat(15, navn, IKKE_TESTET, fejl)]
    if somkunde and not any("bjælke ja" in s.get("info", "") for s in d1.get("tjek", [])): return [Resultat(15, navn, IKKE_TESTET, "»som kunde«-bjælken kom aldrig frem")]
    d2 = None
    if any(s.get("fund") for s in d1.get("tjek", [])): d2, _ = _kal_koer_en(repo, bred, somkunde)
    try: kendte = set(json.load(open(HAK_GRUNDLINJE, encoding="utf-8")).get("kendte", []))
    except Exception: kendte = set()
    ud = []
    if d1.get("fejl"): ud.append(Resultat(15, navn, IKKE_TESTET, "scriptfejl: " + d1["fejl"]))
    for s in d1.get("tjek", []):
        sn = f"{navn} · {s['navn']}"
        if s["tilstand"] == "ikke": ud.append(Resultat(15, sn, IKKE_TESTET, s.get("info", ""))); continue
        if not s["fund"]: ud.append(Resultat(15, sn, BESTAAET, "")); continue
        if d2 is None: ud.append(Resultat(15, sn, IKKE_TESTET, "fund set én gang, anden kørsel gav ingen måling: " + s["fund"][0]["hvad"])); continue
        s2 = next((x for x in d2.get("tjek", []) if x["navn"] == s["navn"]), {"fund": []})
        igen = {_kal_noegle(bred, somkunde, s["navn"], f) for f in s2.get("fund", [])}
        sikre = [f for f in s["fund"] if _kal_noegle(bred, somkunde, s["navn"], f) in igen]
        nye = [f for f in sikre if _kal_noegle(bred, somkunde, s["navn"], f) not in kendte]
        tekst = lambda f: "%s: %s — %s — %d ms efter første billede" % ({"i_gitteret": "I GITTERET", "hopper": "HOPPER"}.get(f["art"], f["art"]), f["el"], f["hvad"], f["ms"])
        if nye: ud.append(Resultat(15, sn, FEJLET, " ¦ ".join(tekst(f) for f in nye)[:900]))
        else: ud.append(Resultat(15, sn, BESTAAET, ("kendte fund: %d" % len(sikre)) if sikre else "fund set kun én gang (belastning)"))
    return ud or [Resultat(15, navn, IKKE_TESTET, "intet målt")]

if __name__ == "__main__":
    a = sys.argv[1:]
    repo = next((x for x in a if not x.startswith("--")), REPO)
    if "--kalender" in a:
        # python3 tools/sikkerhedschefen/tjek_hak.py --kalender [--bredde 1280] [--somkunde|--kunde] [--film mappe] [--en-gang]
        bb = (int(a[a.index("--bredde") + 1]),) if "--bredde" in a else KAL_BREDDER
        hv = (True,) if "--somkunde" in a else ((False,) if "--kunde" in a else (False, True))
        fm = a[a.index("--film") + 1] if "--film" in a else None
        repo = next((x for i, x in enumerate(a) if not x.startswith("--") and (i == 0 or a[i - 1] not in ("--bredde", "--film", "--driver"))), REPO)
        for b in bb:
            for s in hv:
                if "--en-gang" in a:
                    d, f = _kal_koer_en(repo, b, s, fm, driver=(a[a.index("--driver") + 1] if "--driver" in a else None))
                    print(b, "somkunde" if s else "kunde", json.dumps(d, ensure_ascii=False, indent=1) if d else f)
                else:
                    for r in kalender(repo, b, s, fm): print(f"{r.tilstand:<11} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
        sys.exit(0)
    for r in [x for b in (390, 1440) for x in jaeger(repo, b)]: print(f"{r.tilstand:<11} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
