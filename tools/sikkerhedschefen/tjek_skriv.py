import os, re
from .resultat import Resultat, BESTAAET, FEJLET
PAT = re.compile(r'sb\.from\(\s*"([a-z_]+)"\s*\)\s*\.(insert|update|upsert|delete)\(')

def skrivninger_uden_kvittering(html):
    ud = []
    for m in PAT.finditer(html):
        stmt = html[m.start():m.start() + 700].split(";")[0]
        if ".select(" not in stmt:
            ud.append((m.group(1), m.group(2), html.count("\n", 0, m.start()) + 1))
    return ud

def tjek_skriv(repo):
    u = skrivninger_uden_kvittering(open(os.path.join(repo, "index.html"), encoding="utf-8").read())
    if not u:
        return Resultat(2, "Hver gemmevej har kvittering", BESTAAET)
    liste = ", ".join(f"{t}.{v} l.{l}" for t, v, l in u[:15])
    return Resultat(2, "Hver gemmevej har kvittering", FEJLET, f"{len(u)} gemmeveje uden kvittering (mangel): {liste}{' …' if len(u) > 15 else ''}")
