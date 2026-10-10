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

def daekket_af_doeren(html):
    """Appens fælles vagt (»ÉN DØR UD TIL DATABASEN«) sætter .select() på og tjekker rækkerne for tabellerne i LAESER_TILBAGE,
    og en sletning, der rammer 0 rækker, er ikke en fejl. Det, vagten dækker, er ikke en mangel."""
    m = re.search(r'var LAESER_TILBAGE = \[([^\]]*)\]', html)
    return set(re.findall(r'"([a-z_]+)"', m.group(1))) if m else set()

def tjek_skriv(repo):
    html = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    daekket = daekket_af_doeren(html)
    u = [x for x in skrivninger_uden_kvittering(html) if x[0] not in daekket and x[1] != "delete"]
    if not u:
        return Resultat(2, "Hver gemmevej har kvittering", BESTAAET)
    liste = ", ".join(f"{t}.{v} l.{l}" for t, v, l in u[:15])
    return Resultat(2, "Hver gemmevej har kvittering", FEJLET, f"{len(u)} gemmeveje uden kvittering uden for den fælles vagt (mangel; vagten dækker {len(daekket)} tabeller): {liste}{' …' if len(u) > 15 else ''}")
