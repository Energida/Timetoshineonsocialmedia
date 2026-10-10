"""SIKKERHEDSCHEFEN · ORDENE (løfte 12: fagord forklares, ét navn pr. ting). Åbner kundens skærme i selen på 390 og 1440, samler al SYNLIG tekst
og leder efter ord, Idas regler forbyder på kundens flader. Hvert fund er FEJLET med skærm og sætning. Kør: python3 tools/sikkerhedschefen/tjek_ord.py"""
import os, sys, re, json, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
SIDER = "hjem kalender idebank inspiration indbakke planlaegning performance vaerktoej profil drejebog forloeb brief nyide tomhovedet menu".split()
# (navn, mønster, regel) — kun ord, der ALDRIG må møde en kunde
REGLER = [
    ("kursus", r"\bkurs(us|et|er|erne|ets|uset)\w*", "ordet »kursus« er bandlyst (27/7) — YOU GOT THIS / forløbet / Succesfuld Detaildrift"),
    ("strategibygger", r"strategibygger", "»strategibygger« må aldrig møde en kunde (19/9)"),
    ("I/jer", r"\b(jer|jeres)\b|(?<![\wÆØÅæøå])I (skal|kan|har|er|får|vil|må)\b", "aldrig I/jer — vi/os/vores eller du (CLAUDE §2)"),
    ("moat", r"\bmoat\b", "»USP«, aldrig »moat«"),
    ("doven", r"\bdoven\b", "aldrig »doven« (5/10)"),
    ("Uden titel", r"\bUden titel\b", "en idé uden navn må ikke findes (10/10)"),
    ("Ingenting endnu", r"Ingenting endnu", "ordet »Ingenting endnu« findes ikke (CLAUDE §3)"),
    ("Done/Klaret", r"\bKlaret\b", "hedder »Done« (25/9)"),
    ("Contentmakker", r"content makker", "makkerens knapper er skjult (20/9)"),
    ("emoji", "[\U0001F300-\U0001FAFF☀-⛿✀-➿]", "ingen emoji (CLAUDE §4)"),
]
UNDTAGET = [r"Velkommen tilbage", r"✨"]   # ✨ efter hilsenen er tilladt (FINAL 29/7)

def koer(bred=390):
    c = chromium()
    if not c: return [Resultat(12, f"Ordene på kundens flader ({bred})", IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-ord-")
    subprocess.run(["python3", os.path.join(REPO, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    drv = open(os.path.join(HER, "lag2", "ord-driver.js"), encoding="utf-8").read()
    html = open(os.path.join(sele, "index-sele.html"), encoding="utf-8").read(); i = html.rfind("</body>")
    open(os.path.join(sele, "index-ord.html"), "w", encoding="utf-8").write(html[:i] + drv + html[i:])
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1.2)
    fund, ikke, n = {}, [], 0
    try:
        for sd in SIDER:
            fil = urllib.parse.quote(f"index-ord.html?ordf={sd}&selekode=HINGES2026", safe="")
            try:
                p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},900", "--virtual-time-budget=40000", "--enable-logging=stderr", "--v=0", "--dump-dom",
                                    f"http://127.0.0.1:{port}/sele.html?vis=kunde&fil={fil}&bred={bred}&hoej=900"], capture_output=True, text=True, timeout=200)
                d = fortolk(p.stderr)
            except subprocess.TimeoutExpired:
                d = None
            if not d: ikke.append(sd); continue
            for linje in d.get("t", []):
                n += 1
                if any(re.search(u, linje) for u in UNDTAGET) and not re.search(REGLER[-1][1], linje.replace("✨", "")): continue
                for navn, mo, regel in REGLER:
                    if re.search(mo, linje, re.I if navn not in ("I/jer", "emoji") else 0):
                        fund.setdefault(navn, {"regel": regel, "steder": set()})["steder"].add(f"{sd}: »{linje[:70]}«")
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    ud = []
    for navn, mo, regel in REGLER:
        f = fund.get(navn)
        ud.append(Resultat(12, f"Ordet {navn} findes ikke på kundens flader ({bred})", FEJLET if f else BESTAAET, (regel + " · " + " · ".join(sorted(f["steder"])[:6])) if f else ""))
    if ikke: ud.append(Resultat(12, f"Ord-tjekket nåede alle skærme ({bred})", IKKE_TESTET, "ingen måling: " + ", ".join(ikke)))
    if not n: ud.append(Resultat(12, f"Ord-tjekket læste tekst ({bred})", IKKE_TESTET, "ingen tekst"))
    return ud

if __name__ == "__main__":
    bred = int(sys.argv[sys.argv.index("--bred") + 1]) if "--bred" in sys.argv else 390
    for r in koer(bred): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
