"""SIKKERHEDSCHEFEN · SAMLET RAPPORT. Kører lag 1 + lag 2 (390 og 1440) og skriver ét ark med de 26 løfter:
BESTÅET / FEJLET / IKKE TESTET. Et kritisk løfte, der ikke er BESTÅET, giver IKKE KLAR. Lag 3 (Selvtest-knappen) trykkes af Ida.
Kør: python3 tools/sikkerhedschefen/samlet.py [--uden-design]"""
import os, sys, json, datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen import lag1, lag2, tjek_plus
from sikkerhedschefen.tjek_version import app_version
KRITISKE = {1, 2, 3, 4, 5, 6, 14, 15, 17, 18, 19, 22, 23, 24}
NAVNE = {1: "Intet skrevet går tabt", 2: "Hver gemmevej har kvittering", 3: "Status frem og tilbage", 4: "Idéer flytter sig ikke", 5: "Møder opret/ret/slet, ingen dubletter",
         6: "Kalenderen: ét opslag, ét sted", 7: "Opgaver og Ja/Nej læses tilbage", 8: "Hver knap virker", 9: "Næste skridt over folden", 10: "Kvittering efter hvert Gem",
         11: "Tilbage findes, ingen blindgyder", 12: "Fagord forklares, ét navn pr. ting", 13: "Tomt Gem siger hvad der mangler", 14: "Intet uncommitted, versionen ens",
         15: "Konsollen tom, tæppet løftes rigtigt", 16: "Samme gem-vej admin/b2b, ingen døde referencer", 17: "Kundernes data er adskilt", 18: "Edge Functions efter funktion",
         19: "XSS kører aldrig", 20: "Log ud rydder enheden", 21: "Headers, DPA, EU, privatliv", 22: "Hele vejen ind som ny kunde", 23: "Net væk og to faner",
         24: "Gammel version opdateres uden tab", 25: "En prøvet vej tilbage", 26: "Fejl når frem til Ida"}

def main():
    repo = lag1.REPO
    res = [lag1.tjek_git(repo), lag1.tjek_version(repo), lag1.tjek_syntaks(repo)] + lag1.tjek_skriv_delt(repo) + [lag1.tjek_motorer(repo), lag1.tjek_dobbelte(repo),
           lag1.tjek_anon(repo), lag1.tjek_headers(), lag1.tjek_funktioner(repo), lag1.tjek_funktioner_findes(repo)]
    if "--uden-design" not in sys.argv: res.append(lag1.tjek_design(repo))
    for b in (390, 1440): res += lag2.koer(b) + tjek_plus.koer(b)
    from sikkerhedschefen.resultat import Resultat
    res.append(Resultat(17, "Kunde A ser ikke kunde B", IKKE_TESTET, "kræver TESTKUNDE-A og TESTKUNDE-B (Ida opretter dem); Selvtesten tester det, når de findes"))
    pr = {}
    for r in res:
        pr.setdefault(r.loefte, []).append(r)
    def tilstand(n):
        rr = pr.get(n, [])
        if not rr: return IKKE_TESTET
        t = [r.tilstand for r in rr]
        return FEJLET if FEJLET in t else (IKKE_TESTET if IKKE_TESTET in t else BESTAAET)
    klar = all(tilstand(n) == BESTAAET for n in KRITISKE)
    version = app_version(open(os.path.join(repo, "index.html"), encoding="utf-8").read()) or "?"
    tid = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    ud = [f"{'KLAR TIL NYE KUNDER' if klar else 'IKKE KLAR'} · v{version} · {tid}", ""]
    for n in range(1, 27):
        t = tilstand(n); detaljer = [r.detalje for r in pr.get(n, []) if r.tilstand != BESTAAET and r.detalje]
        ud.append(f"{t:<11} · {n:>2}{'*' if n in KRITISKE else ' '} · {NAVNE[n]}" + (f" · {detaljer[0][:180]}" if detaljer else ""))
    ikke_krit = [n for n in sorted(KRITISKE) if tilstand(n) == IKKE_TESTET]
    ud += ["", "* = kritisk. " + (f"Kritiske, der ikke er testet: {', '.join(map(str, ikke_krit))}." if ikke_krit else "Alle kritiske er testet."),
           "Lag 3 (Selvtest i Backstage · Teknik) trykkes af Ida og er ikke med her."]
    print("\n".join(ud))
    json.dump({"version": version, "tid": tid, "klar": klar, "loefter": {n: tilstand(n) for n in range(1, 27)}, "tjek": [r.__dict__ for r in res]},
              open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "rapport-samlet.json"), "w"), ensure_ascii=False, indent=1)
    sys.exit(0 if klar else 1)

if __name__ == "__main__":
    main()
