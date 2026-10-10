import os, re
from .resultat import Resultat, BESTAAET, FEJLET
PAT = re.compile(r'sb\.from\(\s*"([a-z_]+)"\s*\)\s*\.(insert|update|upsert|delete)\(')

def skrivninger_uden_kvittering(html):
    ud = []
    for m in PAT.finditer(html):
        stmt = html[m.start():m.start() + 700].split(";")[0]
        linje = html[html.rfind("\n", 0, m.start()) + 1:html.find("\n", m.start())]
        if ".select(" not in stmt and "0-RAEKKER-OK" not in linje:   # 0-RAEKKER-OK = gennemgået: 0 rækker er rigtigt her (grunden står i kommentaren)
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
    maales = set(re.findall(r'"([a-z_]+)"', (re.search(r'var BS_MAALES = \[([^\]]*)\]', html) or re.search(r'()', '')).group(1)))
    # En oprettelse, basen afviser, giver ALTID en fejl (RLS: 42501), og døren viser bjælken ved enhver fejl. Det tavse hul er kun
    # rettelser (0 rækker uden fejl): de er dækket for LAESER_TILBAGE og for BS_MAALES (døren måler selv, om tabellen kan læses).
    u = [x for x in skrivninger_uden_kvittering(html) if x[0] not in daekket and x[1] not in ("delete", "insert") and not (x[1] == "update" and x[0] in maales)]
    if not u:
        return Resultat(2, "Hver gemmevej har kvittering", BESTAAET)
    liste = ", ".join(f"{t}.{v} l.{l}" for t, v, l in u[:15])
    return Resultat(2, "Hver gemmevej har kvittering", FEJLET, f"{len(u)} gemmeveje uden kvittering uden for den fælles vagt (mangel; vagten dækker {len(daekket)} tabeller): {liste}{' …' if len(u) > 15 else ''}")

# Tabeller, kunden selv skriver til i b2b (MAALT 10/10 ud fra kaldestederne). Alt andet er Backstage (Idas egne flows).
KUNDE_TABELLER = {"content_ideer", "skema_svar", "kunde_maal", "kunde_opgaver", "kunde_aftaler", "kunde_strategi", "ig_maalinger", "inspiration", "kunde_kommentarer"}

def tjek_skriv_delt(repo):
    """Løfte 2 (kritisk) = kundens gemmeveje. Backstages gemmeveje uden kvittering er en mangel under løfte 16 (ikke kritisk for kunderne)."""
    html = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    daekket = daekket_af_doeren(html)
    maales = set(re.findall(r'"([a-z_]+)"', (re.search(r'var BS_MAALES = \[([^\]]*)\]', html) or re.search(r'()', '')).group(1)))
    # En oprettelse, basen afviser, giver ALTID en fejl (RLS: 42501), og døren viser bjælken ved enhver fejl. Det tavse hul er kun
    # rettelser (0 rækker uden fejl): de er dækket for LAESER_TILBAGE og for BS_MAALES (døren måler selv, om tabellen kan læses).
    u = [x for x in skrivninger_uden_kvittering(html) if x[0] not in daekket and x[1] not in ("delete", "insert") and not (x[1] == "update" and x[0] in maales)]
    kunde = [x for x in u if x[0] in KUNDE_TABELLER]; bs = [x for x in u if x[0] not in KUNDE_TABELLER]
    liste = lambda xs: ", ".join(f"{t}.{v} l.{l}" for t, v, l in xs[:12]) + (" …" if len(xs) > 12 else "")
    r1 = Resultat(2, "Kundens gemmeveje har kvittering", BESTAAET if not kunde else FEJLET, f"den fælles vagt dækker {len(daekket)} tabeller; resten læses tilbage" if not kunde else f"{len(kunde)} uden kvittering: {liste(kunde)}")
    r2 = Resultat(16, "Backstages gemmeveje har kvittering", BESTAAET if not bs else FEJLET, "" if not bs else f"{len(bs)} uden kvittering (dine egne flows): {liste(bs)}")
    return [r1, r2]
