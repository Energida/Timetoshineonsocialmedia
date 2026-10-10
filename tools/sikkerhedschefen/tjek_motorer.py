import os, re
from .resultat import Resultat, BESTAAET, FEJLET
INDBYGGET = {"if", "try", "event", "this", "document", "window", "location", "history", "setTimeout", "alert", "confirm", "return", "Array", "JSON", "String", "Number", "Math", "parseInt", "encodeURIComponent"}

def doede_onclick(html):
    kaldt = set(re.findall(r'onclick="\s*(?:event\.stopPropagation\(\);\s*)?([A-Za-z_$][\w$]*)\(', html))
    defineret = set(re.findall(r'(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(', html))
    defineret |= set(re.findall(r'(?:window\.)?([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\b', html))
    defineret |= set(re.findall(r'(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(', html))
    return sorted(n for n in kaldt if n not in defineret and n not in INDBYGGET)

def tjek_motorer(repo):
    d = doede_onclick(open(os.path.join(repo, "index.html"), encoding="utf-8").read())
    if not d:
        return Resultat(16, "Ingen døde knapper i koden", BESTAAET)
    return Resultat(16, "Ingen døde knapper i koden", FEJLET, "kaldes, men findes ikke: " + ", ".join(d[:20]))


def dobbelte_funktioner(html):
    """To `function navn(` med samme navn: kun den sidste lever — en rettelse i den første virker aldrig (MAALT 10/10, moedeSlet)."""
    navne = re.findall(r'^\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(', html, re.M)
    set_, dob = set(), set()
    for n in navne:
        (dob if n in set_ else set_).add(n)
    return sorted(dob)

def tjek_dobbelte(repo):
    d = dobbelte_funktioner(open(os.path.join(repo, "index.html"), encoding="utf-8").read())
    if not d:
        return Resultat(16, "Ingen funktion findes to gange", BESTAAET)
    return Resultat(16, "Ingen funktion findes to gange", FEJLET, f"{len(d)} navne findes to gange (kun den sidste virker): " + ", ".join(d[:25]))
