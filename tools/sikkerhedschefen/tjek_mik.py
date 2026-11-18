"""SIKKERHEDSCHEFEN · LØFTE 56 · MIKROFONEN VIRKER I HVERT FELT MED MIKROFON (Ida 17/11: »Mikrofonen virker ikke i pop ups! Tjek nu ALLE funktioner« → »Det skal med i sikkerhedschefen«).
Åbner hvert ark/popup (samme liste som designlåsens probe-regler2.js) og briefens skrivetrin i kundeappen og Backstage, og trykker på hver mikrofon:
talen skal lande i det rigtige felt, og på en iPhone uden svar skal beskeden om tastaturets mikrofon kunne ses efter 6 sek.
Kør: python3 tools/sikkerhedschefen/tjek_mik.py [--bred 390|1440]"""
import os, sys, re, time, socket, shutil, subprocess, tempfile, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import chromium, fortolk, REPO
HER = os.path.dirname(os.path.abspath(__file__))
MINDST = 5   # færre målte mikrofoner end dette = målingen så ikke nok (IKKE TESTET), aldrig et stille BESTÅET


def lister():
    """ARK_KUNDE, ARK_DASH og SKABELON fra designlåsens probe-regler2.js — én liste over ark, ikke to."""
    src = open(os.path.join(REPO, "tools/designlaas/probe-regler2.js"), encoding="utf-8").read()
    ud = []
    for navn in ("ARK_KUNDE", "ARK_DASH", "SKABELON"):
        m = re.search(r"^var " + navn + r"=.*$", src, re.M)
        if m: ud.append(m.group(0))
    return "\n".join(ud)


def koer(bred=1440):
    c = chromium()
    if not c: return [Resultat(56, f"Mikrofonen ({bred})", IKKE_TESTET, "Chromium findes ikke")]
    sele = tempfile.mkdtemp(prefix="sc-mik-")
    subprocess.run(["python3", os.path.join(REPO, "tools/designlaas/byg-sele.py"), sele], capture_output=True)
    drv = open(os.path.join(HER, "lag2", "mik-driver.js"), encoding="utf-8").read().replace("<script>", "<script>\n" + lister() + "\n", 1)
    html = open(os.path.join(sele, "index-sele.html"), encoding="utf-8").read()
    i = html.rfind("</body>"); open(os.path.join(sele, "index-mik.html"), "w", encoding="utf-8").write(html[:i] + drv + html[i:])
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen(["python3", "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=sele, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    hoej = 844 if bred < 900 else 900
    ud = []
    try:
        for flade in ("kunde", "dash"):
            fil = urllib.parse.quote(f"index-mik.html?mikf={flade}" + ("&selekode=HINGES2026" if flade == "kunde" else ""), safe="")
            url = f"http://127.0.0.1:{port}/sele.html?" + ("vis=kunde" if flade == "kunde" else "vis=dash&side=overblik") + f"&fil={fil}&bred={bred}&hoej={hoej}"
            try:
                p = subprocess.run([c, "--headless=new", "--disable-gpu", "--no-sandbox", f"--window-size={bred},{hoej}", "--virtual-time-budget=900000",
                                    "--enable-logging=stderr", "--v=0", "--dump-dom", url], capture_output=True, text=True, timeout=900)
                d = fortolk(p.stderr)
            except subprocess.TimeoutExpired:
                d = None
            navn = "kundeappen" if flade == "kunde" else "Backstage"
            if not d:
                ud.append(Resultat(56, f"Mikrofonen i {navn} ({bred})", IKKE_TESTET, "ingen måling fra browseren")); continue
            maalt, fejl = d.get("maalt", 0), d.get("fejl", [])
            if fejl: t = FEJLET
            elif maalt < MINDST: t = IKKE_TESTET
            else: t = BESTAAET
            det = " · ".join(fejl)[:900] if fejl else (f"kun {maalt} mikrofoner målt (skal mindst {MINDST})" if maalt < MINDST else "")
            ud.append(Resultat(56, f"Mikrofonen i {navn}: tale lander i feltet, iPhone-beskeden kan ses ({maalt} mikrofoner i {d.get('ark', 0)} ark, {bred})", t, det))
    finally:
        srv.terminate(); shutil.rmtree(sele, ignore_errors=True)
    return ud


if __name__ == "__main__":
    bred = int(sys.argv[sys.argv.index("--bred") + 1]) if "--bred" in sys.argv else 1440
    for r in koer(bred): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
