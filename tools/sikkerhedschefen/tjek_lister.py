"""LØFTE 16 · EN LISTE SKRIVES ALDRIG OVER MED EN, DER ALDRIG BLEV HENTET (fundet 11/10).
Lister i skema_svar hentes med »vaneRow(...) || vaneLocal(...)«: svigter hentningen, står listen tom eller med browserens gamle kopi,
og det næste »tilføj« skrev hele listen over i basen — mens basen svarede »gemt«, så kvitterings-tjekket (løfte 2) så intet.
Tjekket kræver: (1) vaneGemRow har vagten (henter og fletter, før en ikke-læst liste skrives), og (2) hver liste med lokal reserve
er omfattet af vagten (vaneBeskyttet)."""
import os, re
from .resultat import Resultat, BESTAAET, FEJLET

NAVN = "En liste skrives aldrig over med en, der ikke blev hentet"

def lister_med_reserve(html):
    ud = set()
    for m in re.finditer(r'vaneLocal\(\s*"([a-z_]+)"\s*(\+)?', html):
        ud.add(m.group(1) + ("*" if m.group(2) else ""))
    return ud

def tjek_lister(repo):
    html = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    i = html.find("async function vaneGemRow(")
    krop = html[i:i + 1500] if i > -1 else ""
    if "vaneBeskyttet(skema)" not in krop:
        return Resultat(16, NAVN, FEJLET, "vaneGemRow skriver en liste uden at vide, om den er hentet: " + ", ".join(sorted(lister_med_reserve(html))[:20]))
    m = re.search(r'function vaneBeskyttet\(skema\) \{ return /(.+?)/\.test', html)
    if not m:
        return Resultat(16, NAVN, FEJLET, "vaneBeskyttet findes ikke")
    rx = re.compile(m.group(1))
    mangler = [s for s in sorted(lister_med_reserve(html)) if not rx.search(s.rstrip("*") + ("x" if s.endswith("*") else ""))]
    if mangler:
        return Resultat(16, NAVN, FEJLET, f"{len(mangler)} lister med lokal reserve er ikke omfattet af vagten: " + ", ".join(mangler[:20]))
    return Resultat(16, NAVN, BESTAAET)
