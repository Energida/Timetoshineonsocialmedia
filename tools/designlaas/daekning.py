#!/usr/bin/env python3
"""DÆKNINGSPORTEN (fase 1, Ida 17/11 »Ja, start fase 1« på planen »UX-politiet skal fange alle reglerne«).

Hver HÅRD regel i DESIGNLÅS.md skal have en linje i regler.json, der siger, HVORDAN den håndhæves:
  type "design"  → maaling = den probe og måling, der stopper porten   ELLER   plan = hvornår målingen bygges (fx "fase 2")
  type "data"    → håndhæves af sikkerhedschefen (tools/sikkerhedschefen), angiv punktet i "maaling"
  type "proces"  → en arbejdsregel for tråden (fx »djævlens advokat«), kan ikke måles på en skærm
  type "ny"      → lige fundet af --opret; skal udfyldes, før porten er grøn

  python3 tools/designlaas/daekning.py            tjekker (exit 1 ved en HÅRD regel uden linje, eller en linje med type "ny")
  python3 tools/designlaas/daekning.py --opret    lægger nye HÅRDE regler ind som type "ny" (rører aldrig eksisterende linjer)

Reglen genkendes på sit ANKER: de første 60 tegn af linjen uden markdown. Rettes en regels første ord i DESIGNLÅS.md,
siger porten det — så bliver registret aldrig stille ude af trit med låsen.
"""
import json, os, re, sys

ROD = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LAAS = os.path.join(ROD, "DESIGNLÅS.md")
REG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "regler.json")


def anker(linje):
    s = re.sub(r"[*_`#>]", "", linje)
    s = re.sub(r"^\s*-\s*", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s[:60]


def haarde():
    ud = []
    with open(LAAS, encoding="utf-8") as f:
        for nr, l in enumerate(f, 1):
            if re.search(r"HÅRD|HAARD", l):
                a = anker(l)
                if a and a not in [x[1] for x in ud]:
                    ud.append((nr, a, l.strip()))
    return ud


def laes_reg():
    if not os.path.exists(REG):
        return {"forklaring": __doc__.strip().split("\n")[0], "regler": []}
    with open(REG, encoding="utf-8") as f:
        return json.load(f)


def main():
    opret = "--opret" in sys.argv
    reg = laes_reg()
    kendte = {r["anker"]: r for r in reg["regler"]}
    h = haarde()
    nye = []
    for nr, a, l in h:
        if a not in kendte:
            nye.append({"anker": a, "linje_ved_oprettelse": nr, "type": "ny", "maaling": "", "plan": ""})
    if opret and nye:
        reg["regler"].extend(nye)
        with open(REG, "w", encoding="utf-8") as f:
            json.dump(reg, f, ensure_ascii=False, indent=1)
        print("SELE DAEKNING: %d nye HÅRDE regler lagt i regler.json som type »ny« — udfyld dem" % len(nye))
        kendte = {r["anker"]: r for r in reg["regler"]}
        nye = []
    fejl = []
    for n in nye:
        fejl.append("HÅRD regel uden linje i regler.json (DESIGNLÅS linje %d): %s" % (n["linje_ved_oprettelse"], n["anker"]))
    aktive = set(a for _, a, _ in h)
    tael = {"design_maalt": 0, "design_delvis": 0, "design_plan": 0, "data": 0, "proces": 0}
    for r in reg["regler"]:
        if r["anker"] not in aktive:
            continue   # reglen er rettet eller fjernet i låsen — linjen bliver stående som historik
        t = r.get("type")
        if t == "ny":
            fejl.append("regel med type »ny« skal udfyldes: %s" % r["anker"])
        elif t == "design":
            if r.get("maaling") and r.get("delvis"):
                tael["design_delvis"] += 1
            elif r.get("maaling"):
                tael["design_maalt"] += 1
            elif r.get("plan"):
                tael["design_plan"] += 1
            else:
                fejl.append("designregel uden måling og uden plan: %s" % r["anker"])
        elif t in ("data", "proces"):
            tael[t] += 1
        else:
            fejl.append("ukendt type »%s«: %s" % (t, r["anker"]))
    for f in fejl[:25]:
        print("SELE DAEKNING FEJL: " + f)
    print("SELE DAEKNING %s: %d HÅRDE regler · design målt %d · delvist målt %d · planlagt %d · data (sikkerhedschefen) %d · proces %d"
          % ("FEJL" if fejl else "OK", len(h), tael["design_maalt"], tael["design_delvis"], tael["design_plan"], tael["data"], tael["proces"]))
    sys.exit(1 if fejl else 0)


if __name__ == "__main__":
    main()
