import os, re, subprocess, tempfile
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET

def tjek_syntaks(repo):
    s = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    scripts = re.findall(r"<script(?![^>]*src)[^>]*>([\s\S]*?)</script>", s)
    fejl = []
    for i, kode in enumerate(scripts):
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
            f.write(kode); sti = f.name
        try:
            r = subprocess.run(["node", "--check", sti], capture_output=True, text=True, timeout=60)
        except FileNotFoundError:
            return Resultat(15, "Koden kører", IKKE_TESTET, "node findes ikke")
        if r.returncode != 0:
            fejl.append(f"script {i}: {r.stderr.strip().splitlines()[-1] if r.stderr.strip() else 'fejl'}")
    if fejl:
        return Resultat(15, "Koden kører", FEJLET, " · ".join(fejl[:5]))
    return Resultat(15, "Koden kører", BESTAAET, f"{len(scripts)} scripts uden syntaksfejl")
