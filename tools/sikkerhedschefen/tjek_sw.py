"""SIKKERHEDSCHEFEN · LØFTE 24 · En genindlæsning giver den nyeste version (Ida 11/10: admin stod på 2744, mens serveren var 2748).
Kører ~/Energida-testvaerktoej/sw-genindlaes.js (Playwright uden for repoet) mod appens rigtige sw.js: v100 → serveren får v101 → én genindlæsning skal vise v101."""
import os, sys, json, subprocess, socket
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import REPO
VAERKTOEJ = os.path.expanduser("~/Energida-testvaerktoej")

def koer(repo=REPO):
    navn = "En genindlæsning giver den nyeste version"
    js = os.path.join(VAERKTOEJ, "sw-genindlaes.js")
    if not os.path.exists(js): return [Resultat(24, navn, IKKE_TESTET, "testværktøjet findes ikke (~/Energida-testvaerktoej)")]
    s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
    try:
        p = subprocess.run(["node", js, repo, str(port)], cwd=VAERKTOEJ, capture_output=True, text=True, timeout=120)
        d = json.loads(p.stdout.strip().splitlines()[-1])
    except Exception as e:
        return [Resultat(24, navn, IKKE_TESTET, "kunne ikke køres: " + str(e)[:120])]
    ok = d.get("foer", {}).get("kontrol") and d.get("efterEnGenindlaesning") == "101"
    return [Resultat(24, navn, BESTAAET if ok else FEJLET, "" if ok else json.dumps(d))]

if __name__ == "__main__":
    for r in koer(sys.argv[1] if len(sys.argv) > 1 else REPO): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
