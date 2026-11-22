"""SIKKERHEDSCHEFEN · LØFTE 57 · MELLEMTILSTANDE (Ida 22/11: »GRUNDIGT gennemgår at alle klik på siden går naturligt og der ikke kommer alle de
forstyrrende elementer når man navigerer rundt«). REGLEN: et klik giver ÉT skift. Fra det første nye billede efter klikket må intet synligt ændre
plads, størrelse, farve eller synlighed mere end 40 ms senere. Tre slags brud navngives hver for sig: FORSKYDNING · BLINK · UFÆRDIGT INDHOLD.
Måles i RIGTIG tid (lag2/realtid.mjs) med lag2/mt-driver.js på 390 og 1440: kundens menu, Forsiden, hver popup, briefen, mødesiden, lektionen og Backstage.
Et fund tæller først, når det ses i TO kørsler (belastning giver falske fund). Fund, der står i mt-grundlinje.json, er KENDTE: de vises, men vælter ikke porten;
et NYT fund vælter den. En scene, der ikke kunne køres, er IKKE TESTET, aldrig bestået.
Kør:  python3 tools/sikkerhedschefen/tjek_mellemtilstande.py [repo] [--bredde 390] [--gruppe kunde1] [--json ud.json] [--skriv-grundlinje] [--en-gang] [--driver sti]"""
import os, sys, re, json, time, socket, shutil, subprocess, tempfile, urllib.parse, datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, REPO
HER = os.path.dirname(os.path.abspath(__file__))
LOEFTE = 57
GRUNDLINJE = os.path.join(HER, "mt-grundlinje.json")
GRUPPER = ("kunde1", "kunde2", "kursus", "backstage")
ART = {"forskydning": "FORSKYDNING", "blink": "BLINK", "ufaerdigt": "UFÆRDIGT INDHOLD"}
KODE = "SPOEGELSE2026"

def _db(gruppe):
    idag = datetime.date.today()
    def onsdag(n): return (idag + datetime.timedelta(days=(2 - idag.weekday()) % 7 or 7) + datetime.timedelta(days=7 * n)).isoformat()
    if gruppe == "kursus":
        DEF = {"virksomhed": "Opdigtet kursus", "type": "kursus", "pakke": "detaildrift", "forloeb": "YOU GOT THIS — DETAIL", "ental": False, "skema": False, "login_klar": True,
               "oprettet": "2026-01-05", "forretningstype": "butik", "strategi": {"temaer": [], "analyse": ""}, "maal": {"tekst": "Opdigtet mål", "opslag_uge": 3}}
        MOD = {"0": "Modul 0 · Introduktion", "1": "Modul 1 · Energi · Strategi · Resultat"}
        ids = ["0-1", "0-2", "1-1", "1-2"]
        lek = [{"id": i, "modul": MOD[i.split("-")[0]], "titel": "Opdigtet lektion " + i, "sortering": n, "video_link": "https://vimeo.com/000000" + str(n)} for n, i in enumerate(ids)]
        return {"skema_svar": [{"id": "kd1", "kode": KODE, "navn": "config", "skema": "kunde_def", "svar": DEF},
                               {"id": "pub1", "kode": "ENERGIDA", "navn": "config", "skema": "publicering", "svar": {"lektioner": ids, "produkter": ["yougotthis"]}}], "lektioner": lek}
    DEF = {"virksomhed": "Opdigtet butik", "type": "contentstudio", "funktioner": ["indbakke", "content", "strategi", "resultat"]}
    brief = {"format": "Reel", "beskrivelse": "Vis de tre gryder, kunderne spørger mest efter.", "hook": "Tre gryder til hele december", "hookTekst": "Tre gryder til hele december", "caption": "Julemaden begynder i gryden.",
             "cta": "Kom forbi butikken i denne uge", "hashtags": "#isenkram", "tid": "17:00", "klip": [{"ser": "Tre gryder på disken", "scene": 1}, {"ser": "Den store gryde løftes op", "scene": 2}]}
    moeder = [{"id": "m1", "kode": KODE, "titel": "Ugentlig contentplanlægning", "dato": onsdag(0), "tid": "10:00", "tid_slut": "11:00", "link": "https://meet.google.com/abc-defg-hij", "sted": "online", "deltagere": "Annette, Ida"},
              {"id": "m2", "kode": KODE, "titel": "Ugentlig contentplanlægning", "dato": onsdag(1), "tid": "10:00", "tid_slut": "11:00", "link": "https://meet.google.com/abc-defg-hij", "sted": "online", "deltagere": "Annette, Ida"}]
    def opslag(i, titel, dage, status):
        return {"id": "mt-" + str(i), "kode": KODE, "titel": titel, "status": status, "dato": (idag + datetime.timedelta(days=dage)).isoformat(), "type": "Reel", "format": "Reel", "soejle": "1A", "brief": dict(brief, beskrivelse=titel)}
    return {"skema_svar": [{"id": "kd1", "kode": KODE, "navn": "config", "skema": "kunde_def", "svar": DEF},
                           {"id": "ma1", "kode": KODE, "navn": "config", "skema": "maalsaetninger", "svar": {"rytme": {"uge": {"d": 3, "t": "10:00"}}}}],
            "kunde_aftaler": moeder,
            "content_ideer": [opslag(1, "Tre gryder til december", 0, "Brief i gang"), opslag(2, "Sådan sliber du kniven", 1, "Planlagt"), opslag(3, "Bag om disken en travl morgen", -3, "Postet"),
                              {"id": "mt-9", "kode": KODE, "titel": "En idé uden dato", "status": "Idé", "soejle": "2A", "brief": {}}]}

def _koer_en(repo, bred, gruppe, driver=None, sek=150):
    """Én kørsel af én gruppe på én bredde. Svarer browserens måling (dict) eller None."""
    c = chromium()
    if not c: return None, "Chromium findes ikke"
    sele = tempfile.mkdtemp(prefix="sc-mt-")
    try:
        subprocess.run(["python3", os.path.join(repo, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
        shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))
        if gruppe != "backstage":
            open(os.path.join(sele, "sele-db.json"), "w").write(json.dumps({"ls": {"SELE_DB": json.dumps(_db(gruppe)), "SELE_LATENS": "200"}}))
        kode = "window.__MT_GRUPPE=%s;\n" % json.dumps(gruppe) + open(driver or os.path.join(HER, "lag2", "mt-driver.js"), encoding="utf-8").read()
        open(os.path.join(sele, "mt-probe.js"), "w", encoding="utf-8").write(kode)
        sk = socket.socket(); sk.bind(("127.0.0.1", 0)); port = sk.getsockname()[1]; sk.close()
        # egen server som sin egen kommando (ikke »-m http.server«), så en anden tråds oprydning ikke rammer den
        SRV = "import http.server,sys\nclass H(http.server.SimpleHTTPRequestHandler):\n    def log_message(self,*a): pass\nhttp.server.ThreadingHTTPServer(('127.0.0.1',int(sys.argv[1])),H).serve_forever()"
        srv = subprocess.Popen(["python3", "-c", SRV, str(port)], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(1.2)
        if gruppe == "backstage": url = f"http://127.0.0.1:{port}/sele.html?vis=dash&side=overblik&fil=index-sele.html&bred={bred}&hoej=900&kodefil=mt-probe.js"
        else:
            fil = urllib.parse.quote("index-sele.html?selekode=" + KODE, safe="")
            url = f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}&bred={bred}&hoej=900&kodefil=mt-probe.js"
        try:
            p = subprocess.run(["node", os.path.join(HER, "lag2", "realtid.mjs"), c, url, str(bred), "900", str(sek)], capture_output=True, text=True, timeout=sek + 60)
            t = p.stdout; i = t.find("@@"); j = t.rfind("@@")
            if i > -1 and j > i: return json.loads(t[i + 2:j]), ""
            return None, "ingen måling fra browseren (" + " ¦ ".join(t.strip().splitlines()[-4:])[-300:] + ")"
        except Exception as e:
            return None, "kørslen fejlede: " + str(e)[:140]
        finally:
            srv.kill(); srv.wait()
    finally:
        shutil.rmtree(sele, ignore_errors=True)

def _noegle(bred, gruppe, scene, f):
    """Det, et fund kendes på fra kørsel til kørsel: bredde, scene, slags og element — uden tal, der svinger (ms, pladser)."""
    el = re.sub(r"\d+", "#", f.get("el", ""))
    # »ufærdigt indhold« kendes på scenen alene: hvilket element der er størst, når basen svarer, skifter fra kørsel til kørsel (målt 22/11: samme scene, to forskellige elementer)
    if f["art"] == "ufaerdigt": el = "*"
    return "%s|%s|%s|%s|%s" % (bred, gruppe, scene, f["art"], el)

def maal(repo=REPO, bred=390, gruppe="kunde1", to_gange=True, driver=None):
    """Kører gruppen (to gange, hvis første kørsel har fund) og svarer {scene: {tilstand, info, fund:[...]}} + fejltekst."""
    d1, fejl = _koer_en(repo, bred, gruppe, driver)
    if not d1: return None, fejl
    har_fund = any(t.get("fund") for t in d1.get("tjek", []))
    d2 = None
    if har_fund and to_gange:
        d2, _ = _koer_en(repo, bred, gruppe, driver)
    scener = []
    for t in d1.get("tjek", []):
        fund = t.get("fund", [])
        if d2 is not None:
            t2 = next((x for x in d2.get("tjek", []) if x["navn"] == t["navn"]), None)
            igen = {_noegle(bred, gruppe, t["navn"], f) for f in (t2 or {}).get("fund", [])}
            for f in fund: f["set_to_gange"] = _noegle(bred, gruppe, t["navn"], f) in igen
        elif to_gange is False:
            for f in fund: f["set_to_gange"] = None
        scener.append({"navn": t["navn"], "tilstand": t["tilstand"], "info": t.get("info", ""), "fund": fund})
    if d2 is None and har_fund and to_gange: fejl = "anden kørsel gav ingen måling: fundene er kun set én gang"
    return {"gruppe": gruppe, "bredde": bred, "scener": scener, "scriptfejl": d1.get("fejl", "")}, fejl

def grundlinje():
    try: return set(json.load(open(GRUNDLINJE, encoding="utf-8")).get("kendte", []))
    except Exception: return set()

def koer(repo=REPO, bredder=(390, 1440), grupper=GRUPPER, driver=None, raa=None):
    """Sikkerhedschefens indgang: én Resultat pr. scene. NYT fund = FEJLET · kendt fund = BESTÅET med note · ikke kørt = IKKE TESTET."""
    kendte, ud = grundlinje(), []
    if not chromium(): return [Resultat(LOEFTE, "mellemtilstande", IKKE_TESTET, "Chromium findes ikke")]
    for bred in bredder:
        for g in grupper:
            m, fejl = maal(repo, bred, g, True, driver)
            if raa is not None: raa.append(m or {"gruppe": g, "bredde": bred, "scener": [], "scriptfejl": fejl})
            if not m: ud.append(Resultat(LOEFTE, f"{bred} px · {g}", IKKE_TESTET, fejl)); continue
            if m["scriptfejl"]: ud.append(Resultat(LOEFTE, f"{bred} px · {g}", IKKE_TESTET, "scriptfejl: " + m["scriptfejl"]))
            if not m["scener"]: ud.append(Resultat(LOEFTE, f"{bred} px · {g}", IKKE_TESTET, "ingen scener kørt")); continue
            for s in m["scener"]:
                navn = f"{bred} px · {s['navn']}"
                if s["tilstand"] == "ikke": ud.append(Resultat(LOEFTE, navn, IKKE_TESTET, s["info"])); continue
                sikre = [f for f in s["fund"] if f.get("set_to_gange")]
                nye = [f for f in sikre if _noegle(bred, g, s["navn"], f) not in kendte]
                for f in s["fund"]: f["kendt"] = _noegle(bred, g, s["navn"], f) in kendte
                if nye: ud.append(Resultat(LOEFTE, navn, FEJLET, " ¦ ".join(tekst(f) for f in nye)[:900]))
                else: ud.append(Resultat(LOEFTE, navn, BESTAAET, ("kendte fund: %d" % len(sikre)) if sikre else ""))
    return ud

def tekst(f):
    return "%s: %s%s — %s — %d ms efter første billede" % (ART.get(f["art"], f["art"]), f["el"], (" (+%d andre)" % f["flere"]) if f.get("flere") else "", f["hvad"], f["ms"])

if __name__ == "__main__":
    a = sys.argv[1:]
    def valg(n, std=None): return a[a.index(n) + 1] if n in a else std
    repo = next((x for i, x in enumerate(a) if not x.startswith("--") and (i == 0 or not a[i - 1] in ("--bredde", "--gruppe", "--json", "--driver"))), REPO)
    bredder = (int(valg("--bredde")),) if valg("--bredde") else (390, 1440)
    grupper = (valg("--gruppe"),) if valg("--gruppe") else GRUPPER
    raa = []
    if "--en-gang" in a:
        for b in bredder:
            for g in grupper:
                m, fejl = maal(repo, b, g, False, valg("--driver")); raa.append(m or {"gruppe": g, "bredde": b, "scener": [], "scriptfejl": fejl})
                for s in (m or {}).get("scener", []):
                    print(f"{b} px · {g} · {s['navn']} · {s['tilstand']} · {s['info']}")
                    for f in s["fund"]: print("      " + tekst(f))
                if fejl: print(f"{b} px · {g} · {fejl}")
    else:
        res = koer(repo, bredder, grupper, valg("--driver"), raa)
        for r in res: print(f"{r.tilstand:<11} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
    if valg("--json"): json.dump(raa, open(valg("--json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    if "--skriv-grundlinje" in a:
        k = sorted({_noegle(m["bredde"], m["gruppe"], s["navn"], f) for m in raa for s in m.get("scener", []) for f in s["fund"] if f.get("set_to_gange")})
        json.dump({"forklaring": "Kendte mellemtilstande, målt og vist til Ida. De vælter ikke porten; et NYT fund gør. Fjern en linje, når fundet er rettet (så vogter porten det).", "skrevet": datetime.date.today().isoformat(), "kendte": k}, open(GRUNDLINJE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print("grundlinjen skrevet: %d kendte fund" % len(k))
