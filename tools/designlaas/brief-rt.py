"""BRIEFEN I RIGTIG TID (v3430): kører probe-brief-rt.js i headless Chrome UDEN virtuel tid på 1280 og 1440 (realtid.mjs, som hakjægeren).
Brug: python3 tools/designlaas/brief-rt.py [repo]   ·   skriver SELE BRIEFRT OK/FEJL pr. bredde."""
import os, sys, json, time, socket, shutil, subprocess, tempfile, urllib.parse, datetime
MIG = os.path.dirname(os.path.abspath(__file__))
repo = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(MIG))
HER = os.path.join(repo, "tools", "sikkerhedschefen")
c = os.environ.get("CHROME") or "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
KODE = "SPOEGELSE2026"
DEF = {"virksomhed": "Opdigtet butik", "type": "contentplanner", "funktioner": ["indbakke", "content", "strategi", "resultat"]}
brief = {"format": "Reel", "beskrivelse": "Vis de tre gryder, kunderne spørger mest efter.", "hook": "Tre gryder til hele december", "hookTekst": "Tre gryder til hele december", "caption": "Julemaden begynder i gryden.", "cta": "Kom forbi butikken i denne uge", "hashtags": "#isenkram", "tid": "17:00",
         "klip": [{"ser": "Tre gryder på disken", "scene": 1}, {"ser": "Den store gryde løftes op", "scene": 2}, {"ser": "Kunden bærer gryden ud", "scene": 3, "tekst": "Kom forbi i denne uge"}]}
for bred in (1280, 1440):
    sele = tempfile.mkdtemp(prefix="sc-briefrt-")
    subprocess.run(["python3", os.path.join(MIG, "byg-sele.py"), sele], capture_output=True)
    shutil.copy(os.path.join(HER, "lag2", "husk-stub.js"), os.path.join(sele, "sb-stub.js"))
    db = {"skema_svar": [{"id": "kd1", "kode": KODE, "navn": "config", "skema": "kunde_def", "svar": DEF}],
          "content_ideer": [{"id": "rt-1", "kode": KODE, "titel": "Tre gryder til december", "status": "Brief i gang", "dato": datetime.date.today().isoformat(), "type": "Reel", "format": "Reel", "soejle": "1A", "brief": brief}]}
    open(os.path.join(sele, "sele-db.json"), "w").write(json.dumps({"ls": {"SELE_DB": json.dumps(db), "SELE_LATENS": "50"}}))
    sk = socket.socket(); sk.bind(("127.0.0.1", 0)); port = sk.getsockname()[1]; sk.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    kode = urllib.parse.quote(open(os.path.join(MIG, "probe-brief-rt.js"), encoding="utf-8").read())
    fil = urllib.parse.quote("index-sele.html?selekode=" + KODE, safe="")
    url = f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}&bred={bred}&hoej=900&kode={kode}"
    try:
        p = subprocess.run(["node", os.path.join(HER, "lag2", "realtid.mjs"), c, url, str(bred), "900", "60"], capture_output=True, text=True, timeout=140)
        t = p.stdout
    except Exception as e:
        t = "FEJL " + str(e)
    finally:
        srv.kill(); srv.wait(); shutil.rmtree(sele, ignore_errors=True)
    i = t.find("@@"); j = t.rfind("@@")
    print(t[i + 2:j] if i > -1 and j > i else "SELE BRIEFRT FEJL %d: ingen måling fra browseren (%s)" % (bred, t.strip()[-120:]))
