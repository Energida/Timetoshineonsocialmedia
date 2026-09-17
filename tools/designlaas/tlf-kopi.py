# -*- coding: utf-8 -*-
"""TELEFONENS BRIEF = COMPUTERENS BRIEF (Idas klik 17/9 kl. 12.20).
Genererer den maskinskrevne kopi af computerens brief-regler (blokkene @media (min-width:900px)) som
body.mb-brief-tlf-regler under 900 px. Koer den, naar en brief-regel paa computeren er rettet:
    python3 tools/designlaas/tlf-kopi.py
Computerens regler roeres ikke. Telefonens egne maal (haandskrevne) staar efter den genererede del og bevares."""
import io, re, sys, os
p = os.path.join(os.path.dirname(__file__), "..", "..", "index.html")
s = io.open(p, encoding="utf-8").read()
START = "/* ===== TELEFONENS BRIEF = COMPUTERENS BRIEF I EEN SPALTE"
SLUT = "  /* telefonens egne maal:"
a = s.index(START); b = s.index(SLUT)
BRIEF = re.compile(r"#brief|#bsFlytMenu|#basisTrinBar|#forslag_|#koHookUd|#koCaptionUd|\.pf-|\.bss-|\.bsd-|\.mb-bund|\.brief-|\.klip|\.fb-|\.fs-rk|\.fs-laast|\.sk-q|\.sk-input|\.sk-label|\.sk-forkl|\.cm-chip|\.kort-plus|\.bf-plads|\.bf-dato|\.datofelt|\.mq-tap|\.rk-|\.rkh-|\.dbg-|\.dbh-|\.ark-|\.bdrop|\.mg-|\.ks-|\.basis-kort|\.hashtag|\.hb-|\.a2-|\.bt-|\.mb-skjul|\.rt-|\.bsam|\.brief|input\[type=\"date\"\]|\.gv-")
NEJ = re.compile(r"#ideBank|\.kfs-|\.ibh|\.opg-|\.aft-|\.cf-|\.vt-|\.uge-|\.hf-|#kunde|\.lek-|\.db-|\.bs-|\.mrForside|\.mr-")
# computerens blokke: alle @media (min-width:900px)/(min-width: 900px) FOER den genererede blok, der indeholder brief-regler
foer = s[:a]
out = []; n = 0
def omskriv(sel):
    sel = sel.strip()
    return ("body.mb-brief-tlf" + sel[4:]) if sel.startswith("body") else ("body.mb-brief-tlf " + sel)
for m in re.finditer(r"@media \(min-width: ?900px\)\s*\{", foer):
    i = m.end(); dyb = 1; j = i
    while j < len(foer) and dyb: 
        if foer[j] == "{": dyb += 1
        elif foer[j] == "}": dyb -= 1
        j += 1
    txt = re.sub(r"/\*.*?\*/", "", foer[i:j-1], flags=re.S)
    for r in re.finditer(r"([^{}]+)\{([^{}]*)\}", txt):
        sel = r.group(1).strip(); dec = r.group(2).strip()
        if not sel or not dec: continue
        parts = [x.strip() for x in sel.split(",") if x.strip()]
        if not all(BRIEF.search(x) and not NEJ.search(x) for x in parts): continue
        out.append("  " + ", ".join(omskriv(x) for x in parts) + " { " + dec + " }"); n += 1
blok = (START + " (Idas klik 17/9 kl. 12.20: »Samme brief som computeren, i én spalte«) =====\n"
        "   Maskinskrevet kopi af computerens brief-regler (blokkene @media (min-width:900px) ovenfor), scoped til body.mb-brief-tlf under 900 px.\n"
        "   Computerens regler er UROERTE. Rettes en brief-regel paa computeren, koeres tools/designlaas/tlf-kopi.py igen (eller rettes begge). */\n"
        "@media (max-width:899px) {\n" + "\n".join(out) + "\n")
s = s[:a] + blok + s[b:]
io.open(p, "w", encoding="utf-8").write(s)
print("tlf-kopi: %d regler" % n)
