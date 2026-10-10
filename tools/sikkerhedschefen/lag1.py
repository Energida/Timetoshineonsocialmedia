import os, sys, json, datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import samlet, BESTAAET
from sikkerhedschefen.tjek_git import tjek_git
from sikkerhedschefen.tjek_version import tjek_version, app_version
from sikkerhedschefen.tjek_syntaks import tjek_syntaks
from sikkerhedschefen.tjek_skriv import tjek_skriv
from sikkerhedschefen.tjek_motorer import tjek_motorer
from sikkerhedschefen.tjek_design import tjek_design
REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

def rapport_tekst(resultater, version, tid):
    linjer = [f"LAG 1 · {samlet(resultater)} · v{version} · {tid}", ""]
    for r in sorted(resultater, key=lambda x: x.loefte):
        linjer.append(f"{r.tilstand:<7} · {r.loefte} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
    linjer += ["", "Lag 1 alene siger aldrig »klar til nye kunder«."]
    return "\n".join(linjer)

def main():
    res = [tjek_git(REPO), tjek_version(REPO), tjek_syntaks(REPO), tjek_skriv(REPO), tjek_motorer(REPO)]
    if "--uden-design" not in sys.argv:
        res.append(tjek_design(REPO))
    version = app_version(open(os.path.join(REPO, "index.html"), encoding="utf-8").read()) or "?"
    tid = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    print(rapport_tekst(res, version, tid))
    json.dump({"version": version, "tid": tid, "samlet": samlet(res), "resultater": [r.__dict__ for r in res]},
              open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "rapport-lag1.json"), "w"), ensure_ascii=False, indent=1)
    sys.exit(0 if samlet(res) == BESTAAET else 1)

if __name__ == "__main__":
    main()
