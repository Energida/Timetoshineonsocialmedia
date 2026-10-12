"""SIKKERHEDSCHEFEN · LØFTE 42 · DATOER FØLGER DANSK TID (fejlkataloget B42). Mellem midnat og kl. 2 gav new Date().toISOString().slice(0,10)
GÅRSDAGENS dato (UTC) — 28 steder rettet 13/10 til datoDK(). (1) Kodesøgning: ingen nye UTC-datoer i appen. (2) datoDK, ugenummer og ugens mandag
regnes i node med dansk tidszone ved midnat, sommertidsskiftet (25/10 2026) og nytår. Kør: python3 tools/sikkerhedschefen/tjek_datoer.py"""
import os, re, sys, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.lag2 import REPO
TILLADT = ('    oprettet: new Date().toISOString().slice(0, 10),',   # Edge Function-kildekode vist som tekst i Maskinrummet (Deno), kører ikke i appen
           '(typeof datoDK === "function") ? datoDK() : new Date().toISOString().slice(0, 10)', 'gav "new Date().toISOString().slice(0,10)"')
NODE = r'''
const src=require("fs").readFileSync(process.argv[1],"utf8");
function hent(navn){ const a=src.indexOf("function "+navn+"("); if(a<0) throw new Error(navn+" findes ikke"); let i=src.indexOf("{",a),d=0; for(;i<src.length;i++){ if(src[i]=="{")d++; else if(src[i]=="}"){d--; if(!d) break;} } return src.slice(a,i+1); }
eval(hent("datoDK")+";"+hent("energidaUgeMandag")+";"+hent("energidaUgeNr")+";global.datoDK=datoDK;global.energidaUgeMandag=energidaUgeMandag;global.energidaUgeNr=energidaUgeNr;");
const ud=[];
const t=[["2026-10-12T22:30:00Z","2026-10-13"],["2026-10-24T22:30:00Z","2026-10-25"],["2026-10-25T23:30:00Z","2026-10-26"],["2026-10-25T22:59:00Z","2026-10-25"],["2026-12-31T23:30:00Z","2027-01-01"]];
t.forEach(([u,f])=>{ const v=datoDK(new Date(u)); if(v!==f) ud.push("datoDK("+u+") = "+v+", forventet "+f); });
const m=energidaUgeMandag(new Date("2026-10-25T21:30:00Z")); const mi=datoDK(m); if(mi!=="2026-10-19") ud.push("ugens mandag søndag 25/10 23.30 = "+mi+", forventet 2026-10-19");
const m2=datoDK(energidaUgeMandag(new Date("2026-10-25T23:30:00Z"))); if(m2!=="2026-10-26") ud.push("ugens mandag mandag 26/10 00.30 = "+m2+", forventet 2026-10-26");
[["2026-10-25T21:00:00Z",43],["2026-10-25T23:30:00Z",44],["2026-12-31T23:30:00Z",53]].forEach(([u,f])=>{ const v=energidaUgeNr(new Date(u)); if(v!==f) ud.push("ugenummer "+u+" = "+v+", forventet "+f); });
console.log(JSON.stringify(ud));
'''
def koer(repo=REPO):
    fil = os.path.join(repo, "index.html"); utc = []
    for i, l in enumerate(open(fil, encoding="utf-8"), 1):
        if re.search(r"toISOString\(\)\.slice\(0, ?10\)", l) and not any(t in l for t in TILLADT): utc.append(i)
    ud = [Resultat(42, "Ingen datoer i UTC i appen (kun datoDK)", FEJLET if utc else BESTAAET, "linjer: " + ", ".join(map(str, utc[:20])) if utc else "")]
    try:
        p = subprocess.run(["node", "-e", NODE, fil], capture_output=True, text=True, timeout=60, env=dict(os.environ, TZ="Europe/Copenhagen"))
        fejl = json.loads(p.stdout.strip() or "null")
        if fejl is None: raise ValueError(p.stderr[-200:])
        ud.append(Resultat(42, "Dato, ugenummer og ugens mandag er rigtige ved midnat, sommertidsskiftet og nytår", FEJLET if fejl else BESTAAET, " · ".join(fejl)))
    except Exception as e:
        ud.append(Resultat(42, "Datoberegningen", IKKE_TESTET, str(e)[:200]))
    return ud

if __name__ == "__main__":
    for r in koer(): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
