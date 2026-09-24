#!/usr/bin/env python3
# POPUPS UDEN OM LAASEN (Ida 24/9: »Ret idéen« byggede sin egen popup — mikrofon uden for feltet, titel til venstre, skjult dropdown, »Ingen« i stedet for »Vælg«).
# Porten aabner kun kundeappens doere paa 390 og saa derfor aldrig en admin-popup. Denne kilde-maaling fanger ALLE: en funktion, der skriver sin egen
# popup i #modalBody i stedet for at kalde arkAabn(), er en FEJL — medmindre den staar paa listen herunder (store visninger og doed kode, maalt 24/9).
# En ny popup SKAL bruge arkAabn(). Listen maa kun blive kortere.
import re, sys, os
ROD = os.path.join(os.path.dirname(__file__), "..", "..")
KENDTE = {
    # store visninger, der er sider i en boks (ikke popups): lektionens manus-editor og kontaktkortet i Salg
    "klipBriefRender", "openModal", "closeModal",
    # doed kode (ingen synlig vej ind, maalt 24/9) og de gamle former bag de nye ark
    "aftaleAabnRet", "aftaleNyTegn", "brollAaben", "dashFangStep", "haengModal", "haengNy", "haengRetTegn", "haengVaelgSfaere",
    "hjemIdagValgAabn", "kundeStudioTegn", "kundeStudioVaelger", "nyhedsbrevListe", "oevoRender", "opslagNyDatoTegn",
    "studieFindIde", "tomOversigt", "ttsDndSpoergGammel", "visAlleLektioner",
}
linjer = open(os.path.join(ROD, "index.html"), encoding="utf-8").read().split("\n")
fn = None; brugere = {}
for i, l in enumerate(linjer, 1):
    m = re.match(r'^(async )?function ([A-Za-z0-9_]+)\(', l)
    if m: fn = m.group(2)
    if 'getElementById("modalBody")' in l:
        brugere.setdefault(fn or "?", i)
nye = {k: v for k, v in brugere.items() if k not in KENDTE}
if nye:
    for k, v in nye.items():
        print("SELE POPUP-KILDE FEJL: %s (linje %d) bygger sin egen popup i #modalBody — brug arkAabn()" % (k, v))
    sys.exit(1)
print("SELE POPUP-KILDE OK: ingen nye popups uden om arkAabn (%d gamle paa listen)" % len([k for k in brugere if k in KENDTE]))
