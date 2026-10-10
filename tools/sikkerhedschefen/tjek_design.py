import os, subprocess
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET

def tjek_design(repo):
    try:
        r = subprocess.run(["bash", "tools/designlaas/koer.sh"], cwd=repo, capture_output=True, text=True, timeout=600)
    except subprocess.TimeoutExpired:
        return Resultat(9, "Designporten", IKKE_TESTET, "porten nåede ikke færdig på 10 min.")
    ud = r.stdout + r.stderr
    ok = sum(1 for l in ud.splitlines() if " OK" in l)
    fejl = [l for l in ud.splitlines() if "FEJL" in l]
    if fejl:
        return Resultat(9, "Designporten", FEJLET, " · ".join(fejl[:3]))
    if ok >= 16:
        return Resultat(9, "Designporten", BESTAAET, f"{ok} OK")
    return Resultat(9, "Designporten", IKKE_TESTET, f"kun {ok} OK — porten blev ikke kørt færdig")
