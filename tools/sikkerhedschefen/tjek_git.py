import subprocess
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET

def tjek_git(repo):
    try:
        st = subprocess.run(["git", "status", "--short"], cwd=repo, capture_output=True, text=True, timeout=30).stdout.strip()
        foran = subprocess.run(["git", "log", "--oneline", "origin/dashboard-og-database..HEAD"], cwd=repo, capture_output=True, text=True, timeout=30).stdout.strip()
    except Exception as e:
        return Resultat(14, "Git rent og pushet", IKKE_TESTET, str(e))
    if not st and not foran:
        return Resultat(14, "Git rent og pushet", BESTAAET)
    return Resultat(14, "Git rent og pushet", FEJLET, (f"ændret: {len(st.splitlines())} fil(er)" if st else "") + (f" · ikke pushet: {len(foran.splitlines())} commit(s)" if foran else ""))
