"""SIKKERHEDSCHEFEN · LØFTE 25 · Der findes sikkerhedskopier af databasen (MÅLT 11/10: 0 kopier, PITR fra).
Læser kun metadata via Supabase Management API med Idas CLI-login (~/.supabase/access-token). Rører aldrig data."""
import os, sys, json, urllib.request
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
REF = "eikcvvppuphnananxcvp"

def koer():
    navn = "Der findes sikkerhedskopier af databasen"
    tf = os.path.expanduser("~/.supabase/access-token")
    if not os.path.exists(tf): return [Resultat(25, navn, IKKE_TESTET, "intet Supabase-login på maskinen")]
    try:
        q = urllib.request.Request(f"https://api.supabase.com/v1/projects/{REF}/database/backups", headers={"Authorization": "Bearer " + open(tf).read().strip()})
        d = json.loads(urllib.request.urlopen(q, timeout=30).read())
    except Exception as e:
        return [Resultat(25, navn, IKKE_TESTET, "kunne ikke læses: " + str(e)[:100])]
    n = len(d.get("backups") or []); pitr = bool(d.get("pitr_enabled"))
    ok = n > 0 or pitr
    return [Resultat(25, navn, BESTAAET if ok else FEJLET, f"{n} kopier · PITR {'til' if pitr else 'fra'}" if ok else f"0 kopier og PITR fra — kundernes data kan ikke hentes tilbage (region {d.get('region','?')})")]

if __name__ == "__main__":
    for r in koer(): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
