"""SIKKERHEDSCHEFEN · LØFTE 48 · TELEFONENS BRIEF-KOPI ER MASKINENS (fejlkataloget nr. 98 — 19/9: en regel skrevet med hånden inde i den
maskinkopierede blok forsvandt ved næste kørsel af tlf-kopi.py). Kører tlf-kopi.py på en KOPI af index.html i en midlertidig mappe og
sammenligner. 12/10 målt: 43 linjer afviger (computer-regler lagt til efter sidste kørsel + håndrettelser som kk-ini, der ville gå tabt ved
en blind kørsel). Derfor en grundlinje som løfte 41: tallet må aldrig stige. Sænkes med --opdater, når kopien er gennemgået."""
import os, sys, json, shutil, tempfile, subprocess, difflib
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET
from sikkerhedschefen.lag2 import REPO
GL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tlfkopi-grundlinje.json")

def maal(repo=REPO):
    with tempfile.TemporaryDirectory() as d:
        os.makedirs(os.path.join(d, "tools", "designlaas"))
        shutil.copy(os.path.join(repo, "index.html"), os.path.join(d, "index.html"))
        shutil.copy(os.path.join(repo, "tools", "designlaas", "tlf-kopi.py"), os.path.join(d, "tools", "designlaas", "tlf-kopi.py"))
        r = subprocess.run([sys.executable, os.path.join(d, "tools", "designlaas", "tlf-kopi.py")], capture_output=True, text=True, timeout=120)
        if r.returncode: return [Resultat(48, "Telefonens brief-kopi kan genskabes", FEJLET, (r.stderr or r.stdout)[-200:])], []
        a = open(os.path.join(repo, "index.html"), encoding="utf-8").read().splitlines()
        b = open(os.path.join(d, "index.html"), encoding="utf-8").read().splitlines()
    diff = [l for l in difflib.unified_diff(a, b, lineterm="", n=0) if l[:1] in "+-" and not l.startswith(("+++", "---"))]
    try: g = json.load(open(GL))["antal"]
    except Exception: g = 0
    return [Resultat(48, f"Telefonens brief-kopi glider ikke længere fra computerens ({len(diff)} afvigende linjer, grundlinje {g})",
                     FEJLET if len(diff) > g else BESTAAET, (" | ".join(x[:90] for x in diff[:4])) if len(diff) > g else "")], diff

def koer(repo=REPO): return maal(repo)[0]

if __name__ == "__main__":
    if "--opdater" in sys.argv:
        n = len(maal()[1]); json.dump({"antal": n, "dato": __import__("datetime").date.today().isoformat()}, open(GL, "w")); print("grundlinje:", n)
    for x in koer(): print(f"{x.tilstand:<11} · {x.loefte:>2} · {x.navn}" + (f" · {x.detalje}" if x.detalje else ""))
