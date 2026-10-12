"""SIKKERHEDSCHEFEN · SAMLET RAPPORT. Kører lag 1 + lag 2 (390 og 1440) og skriver ét ark med alle løfter (NAVNE):
BESTÅET / FEJLET / IKKE TESTET. Et kritisk løfte, der ikke er BESTÅET, giver IKKE KLAR. Lag 3 (Selvtest-knappen) trykkes af Ida.
Kør: python3 tools/sikkerhedschefen/samlet.py [--uden-design]"""
import os, sys, json, datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen import lag1, lag2, tjek_plus, tjek_knapper, tjek_stille, tjek_tilbage, tjek_ord
from sikkerhedschefen.tjek_lister import tjek_lister
from sikkerhedschefen import tjek_spor, tjek_adgang, tjek_crm, tjek_sw, tjek_fold, tjek_backup, tjek_popup, tjek_pakker, tjek_selvslet, tjek_gammel, tjek_dbregler, tjek_live, tjek_usynlig, tjek_navne, tjek_hjemtal
from sikkerhedschefen.tjek_version import app_version
KRITISKE = {1, 2, 3, 4, 5, 6, 14, 15, 17, 18, 19, 22, 23, 24, 32, 33, 34}
NAVNE = {1: "Intet skrevet går tabt", 2: "Hver gemmevej har kvittering", 3: "Status frem og tilbage", 4: "Idéer flytter sig ikke", 5: "Møder opret/ret/slet, ingen dubletter",
         6: "Kalenderen: ét opslag, ét sted", 7: "Opgaver og Ja/Nej læses tilbage", 8: "Hver knap virker", 9: "Næste skridt over folden", 10: "Kvittering efter hvert Gem",
         11: "Tilbage findes, ingen blindgyder", 12: "Fagord forklares, ét navn pr. ting", 13: "Tomt Gem siger hvad der mangler", 14: "Intet uncommitted, versionen ens",
         15: "Konsollen tom, tæppet løftes rigtigt", 16: "Samme gem-vej admin/b2b, ingen døde referencer", 17: "Kundernes data er adskilt", 18: "Edge Functions efter funktion",
         19: "XSS kører aldrig", 20: "Log ud rydder enheden", 21: "Headers, DPA, EU, privatliv", 22: "Hele vejen ind som ny kunde", 23: "Net væk og to faner",
         24: "Gammel version opdateres uden tab", 25: "En prøvet vej tilbage", 26: "Fejl når frem til Ida", 27: "Lektionerne kan følges (set · stjerner · kommentar)", 28: "Idas flueben under Adgang når kunden", 29: "CRM'et virker for Ida (Tilbage · Adgang · flueben · slet · login-mail)",
         30: "Popups: ét lag, krydset lukker, åbner igen (fejlkataloget D)",
         31: "Hvert flueben under Adgang findes i kundens menu, pr. pakke (fejlkataloget C)",
         32: "Appen ændrer aldrig kundens data af sig selv (fejlkataloget A4)",
         33: "En gammel, åben udgave gemmer aldrig oven i en nyere (fejlkataloget A3)",
         34: "Databasens regler: RLS, ingen nye åbninger for alle (fejlkataloget L)",
         35: "Live-opsætningen: mails, links, nøgler, testlogins (fejlkataloget J/L/I/C)",
         36: "Al tekst kan ses: kontrast og intet låg (fejlkataloget B37)",
         37: "Ét navn pr. ting: menupunkt = sidens overskrift (fejlkataloget H109)",
         38: "Tallene på Hjem passer med det planlagte (fejlkataloget B36)"}

def main():
    repo = lag1.REPO
    res = [lag1.tjek_git(repo), lag1.tjek_version(repo), lag1.tjek_syntaks(repo)] + lag1.tjek_skriv_delt(repo) + [lag1.tjek_motorer(repo), lag1.tjek_dobbelte(repo),
           lag1.tjek_anon(repo), lag1.tjek_headers(), lag1.tjek_funktioner(repo), lag1.tjek_funktioner_findes(repo), tjek_lister(repo)]
    if "--uden-design" not in sys.argv: res.append(lag1.tjek_design(repo))
    for b in (390, 1440): res += lag2.koer(b) + tjek_plus.koer(b) + tjek_knapper.koer(b) + tjek_ord.koer(b)
    res += tjek_stille.koer() + tjek_tilbage.koer() + tjek_spor.koer() + tjek_adgang.koer() + tjek_crm.koer() + tjek_sw.koer() + tjek_fold.koer() + tjek_backup.koer() + tjek_popup.koer(390) + tjek_popup.koer(1440) + tjek_pakker.koer() + tjek_selvslet.koer() + tjek_gammel.koer() + tjek_dbregler.koer() + tjek_live.koer() + tjek_usynlig.koer(390) + tjek_usynlig.koer(1440) + tjek_navne.koer() + tjek_hjemtal.koer()
    from sikkerhedschefen.resultat import Resultat
    # LAG 3 = Idas kørsler på live, skrevet ind i lag3-resultater.json (Claude kan ikke selv logge ind som testkunderne)
    try: l3 = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "lag3-resultater.json"), encoding="utf-8"))
    except Exception: l3 = {}
    r17 = l3.get("17")
    res.append(Resultat(17, "Kunde A ser ikke kunde B" + (f" (Ida {r17['tid']}, v{r17['version']})" if r17 else ""), {"BESTÅET": BESTAAET, "FEJLET": FEJLET}.get((r17 or {}).get("tilstand"), IKKE_TESTET),
                        (r17 or {}).get("detalje", "køres som testkunden i b2b: ?selvtest=ab (A · B · A) — resultatet er Idas skærmbillede")))
    res.append(Resultat(22, "Hele købsrejsen (betaling → mail → login → første side)", IKKE_TESTET, "kræver Idas testkøb med rabatkode; kun dele af vejen (delelinket, ny adgangskode) er testet"))
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
    for n in sorted(NAVNE):
        t = tilstand(n); detaljer = [r.detalje for r in pr.get(n, []) if r.tilstand != BESTAAET and r.detalje]
        ud.append(f"{t:<11} · {n:>2}{'*' if n in KRITISKE else ' '} · {NAVNE[n]}" + (f" · {detaljer[0][:180]}" if detaljer else ""))
    ikke_krit = [n for n in sorted(KRITISKE) if tilstand(n) == IKKE_TESTET]
    ud += ["", "* = kritisk. " + (f"Kritiske, der ikke er testet: {', '.join(map(str, ikke_krit))}." if ikke_krit else "Alle kritiske er testet."),
           "Lag 3 (Selvtest i Backstage · Teknik) trykkes af Ida og er ikke med her."]
    print("\n".join(ud))
    json.dump({"version": version, "tid": tid, "klar": klar, "loefter": {n: tilstand(n) for n in sorted(NAVNE)}, "tjek": [r.__dict__ for r in res]},
              open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "rapport-samlet.json"), "w"), ensure_ascii=False, indent=1)
    sys.exit(0 if klar else 1)

if __name__ == "__main__":
    main()
