"""SIKKERHEDSCHEFEN · LØFTE 41 · FEJLBESKEDER TIL KUNDEN ER PÅ DANSK (fejlkataloget H112 — 7/10 skift adgangskode, 10/10 admin-login).
Kodesøgning i index.html: steder, hvor Supabases/browserens rå fejltekst (e.message / error.message) sættes ind i en besked, kunden ser
(husBesked, husKvit, textContent, inspMsg, besked = …). Tallet må aldrig stige (grundlinjen står i fejltekst-grundlinje.json).
Hver gang et sted får en dansk oversættelse, sænkes grundlinjen: python3 tools/sikkerhedschefen/tjek_fejltekst.py --opdater"""
import os, re, sys, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET
from sikkerhedschefen.lag2 import REPO
HER = os.path.dirname(os.path.abspath(__file__)); GL = os.path.join(HER, "fejltekst-grundlinje.json")
RAA = re.compile(r"(error|err|e|up\.error|r\.error)\s*&&\s*(error|err|e)?\.?message|\b(error|err|e)\.message|r\.error\.message|up\.error\.message")
VIST = re.compile(r"husBesked\(|husKvit\(|textContent\s*=|innerHTML\s*=|inspMsg\(|besked\s*=|MQ_BESKED\s*=")

def steder(repo=REPO):
    ud = []
    for i, l in enumerate(open(os.path.join(repo, "index.html"), encoding="utf-8"), 1):
        if "console." in l or l.strip().startswith(("//", "/*", "*")): continue
        if RAA.search(l) and VIST.search(l): ud.append(i)
    return ud

def koer(repo=REPO):
    s = steder(repo)
    try: g = json.load(open(GL))["antal"]
    except Exception: g = None
    if g is None: return [Resultat(41, "Rå fejltekst til kunden (grundlinje mangler)", FEJLET, f"{len(s)} steder — kør med --opdater")]
    return [Resultat(41, f"Ingen nye steder med rå engelsk fejltekst til kunden ({len(s)} kendte, grundlinje {g})", FEJLET if len(s) > g else BESTAAET,
                     f"linjer: {', '.join(map(str, s[:20]))}" if len(s) > g else "")]

if __name__ == "__main__":
    if "--opdater" in sys.argv:
        json.dump({"antal": len(steder()), "dato": __import__("datetime").date.today().isoformat()}, open(GL, "w")); print("grundlinje:", len(steder()))
    for r in koer(): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
    if "--liste" in sys.argv: print(steder())
