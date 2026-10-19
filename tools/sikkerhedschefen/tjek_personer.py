"""SIKKERHEDSCHEFEN · LØFTE 50 · EN PERSON ER ET NAVN (Ida 19/10: mødets Hvem viste »622a4038-… · Annette · e9ac62e5-… · Ida« — »hvorfor havde sikkerhedstjek ikke fanget dette?«).
Inspirationens rækker gemmes under login-id'et, og personlisterne (Hvem laver, Send til, godkendelse, mødet) læser navnene i skema_svar.
(1) appens egen erPersonNavn afviser id, e-mail og tekniske navne. (2) Den RIGTIGE base (kun læsning): intet navn, appen ville vise som person, ligner et id.
Kør: python3 tools/sikkerhedschefen/tjek_personer.py"""
import os, re, sys, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import REPO
NODE = r'''
const src=require("fs").readFileSync(process.argv[1],"utf8");
const a=src.indexOf("function erPersonNavn("); if(a<0){console.log("null");process.exit(0);}
const b=src.indexOf("\n",a); eval(src.slice(a,b)); 
const navne=JSON.parse(process.argv[2]||"[]");
const ikke=["622a4038-1987-40c3-b7a7-eebf4526fc67","app_fejl","app_puls","kunde@butik.dk","config","delt",""], ja=["Annette","Ida","Per Hansen"];
const fejl=[]; ikke.forEach(n=>{ if(erPersonNavn(n)) fejl.push("godtog "+JSON.stringify(n)); }); ja.forEach(n=>{ if(!erPersonNavn(n)) fejl.push("afviste "+n); });
const mistaenkt=navne.filter(n=>erPersonNavn(n) && (/[0-9a-f]{8}-/i.test(n) || /^\S{25,}$/.test(n) || /\d{4,}/.test(n)));
console.log(JSON.stringify({fejl, mistaenkt}));
'''
def koer(repo=REPO):
    fil = os.path.join(repo, "index.html"); navne = []; ud = []
    try:
        from sikkerhedschefen.tjek_dbregler import sql
        navne = [r["navn"] for r in (sql("select distinct navn from skema_svar where navn is not null") or []) if r.get("navn")]
    except Exception as e:
        ud.append(Resultat(50, "Navnene i den rigtige base kunne læses", IKKE_TESTET, str(e)[:160])); navne = None
    try:
        p = subprocess.run(["node", "-e", NODE, fil, json.dumps(navne or [])], capture_output=True, text=True, timeout=60)
        r = json.loads(p.stdout.strip() or "null")
        if r is None: raise ValueError("erPersonNavn findes ikke · " + p.stderr[-160:])
        ud.append(Resultat(50, "erPersonNavn afviser id, e-mail og tekniske navne", FEJLET if r["fejl"] else BESTAAET, " · ".join(r["fejl"])))
        if navne is not None:
            ud.append(Resultat(50, "Ingen navne i basen, som appen ville vise som en person, ligner et id (kun læsning)", FEJLET if r["mistaenkt"] else BESTAAET, (str(len(navne)) + " navne læst") + ((" · " + ", ".join(r["mistaenkt"][:5])) if r["mistaenkt"] else "")))
    except Exception as e:
        ud.append(Resultat(50, "Personnavnene", IKKE_TESTET, str(e)[:200]))
    return ud

if __name__ == "__main__":
    for r in koer(): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
