#!/usr/bin/env python3
"""TRYGHEDSTJEK 1 — gemmer appen ALTID med kvittering? (Ida 9/10: »jeg er så bange for, at deres data ikke gemmes«)
Tæller alle skrivninger til databasen (sb.from(...).insert/update/upsert/delete) og finder dem UDEN .select()-kvittering:
uden den kan en afvist skrivning (rettighed, 0 rækker) se ud som »gemt« på skærmen. Tallet må ALDRIG stige (skralde-regel).
Kør: python3 tools/tryghed/skriv-tjek.py [--liste] [--opdater-grundlinje]"""
import re,sys,json,os
rod=os.path.dirname(os.path.abspath(__file__)); fil=os.path.join(rod,"..","..","index.html"); grund=os.path.join(rod,"skriv-grundlinje.json")
s=open(fil).read()
pat=re.compile(r'sb\.from\(\s*"([a-z_]+)"\s*\)\s*\.(insert|update|upsert|delete)\(')
alle=[];uden=[]
for m in pat.finditer(s):
    stmt=s[m.start():m.start()+700].split(';')[0]
    linje=s.count('\n',0,m.start())+1
    alle.append((m.group(1),m.group(2),linje))
    if '.select(' not in stmt: uden.append((m.group(1),m.group(2),linje))
tabeller={}
for t,k,l in uden: tabeller[t]=tabeller.get(t,0)+1
if "--opdater-grundlinje" in sys.argv:
    json.dump({"uden_kvittering":len(uden),"tabeller":tabeller},open(grund,"w"),indent=1); print("Grundlinje sat:",len(uden)); sys.exit(0)
g=json.load(open(grund)) if os.path.exists(grund) else {"uden_kvittering":10**9,"tabeller":{}}
print(f"SKRIV-TJEK: {len(alle)} skrivninger, {len(uden)} uden kvittering (grundlinje {g['uden_kvittering']})")
if "--liste" in sys.argv:
    for t,k,l in uden: print(f"  {t} {k} linje {l}")
if len(uden)>g["uden_kvittering"]:
    print("SKRIV-TJEK FEJL: der er kommet NYE skrivninger uden kvittering — tilføj .select() og tjek rækkerne"); 
    for t in tabeller:
        if tabeller[t]>g["tabeller"].get(t,0): print("  ny i",t)
    sys.exit(1)
print("SKRIV-TJEK OK: ingen nye skrivninger uden kvittering")
