"""LØFTE 18 — Edge Functions efter funktion. Hver funktion spørges med GET uden login og uden indhold (gør intet).
En funktion for indloggede skal svare 401/403. En åben funktion (kalender-feed, betalings-webhook) må ikke svare 2xx
med data uden gyldig nøgle/signatur. Kun GET, ingen login, intet skrives."""
import os, re, urllib.request, urllib.error
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
# Funktioner, der bevidst ikke kræver login, og hvad de skal gøre uden gyldig nøgle/signatur:
AABNE = {"app-kalender-feed": "uden gyldigt feed-token: ingen kalender", "stripe-koeb": "uden Stripe-signatur: afvist"}

def funktioner(repo):
    s = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    return sorted(set(re.findall(r'functions/v1/([a-z0-9-]+)', s)) | {"stripe-koeb"})

def hent(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Energida sikkerhedschefen"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r: return r.status, r.read(400).decode("utf-8", "replace")
    except urllib.error.HTTPError as e: return e.code, e.read(400).decode("utf-8", "replace")

def tjek_funktioner(repo, hent=hent):
    s = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    m = re.search(r'SUPABASE_URL *= *"([^"]+)"', s)
    if not m: return Resultat(18, "Edge Functions uden login", IKKE_TESTET, "SUPABASE_URL ikke fundet")
    svar, aabne_fejl, ikke = [], [], []
    for f in funktioner(repo):
        try: st, body = hent(f"{m.group(1)}/functions/v1/{f}")
        except Exception as e: ikke.append(f); continue
        svar.append(f"{f} {st}")
        if 200 <= st < 300 and (f not in AABNE or len(body.strip()) > 40):
            aabne_fejl.append(f"{f} svarede {st} uden login")
    if aabne_fejl: return Resultat(18, "Edge Functions uden login", FEJLET, " · ".join(aabne_fejl))
    if ikke: return Resultat(18, "Edge Functions uden login", IKKE_TESTET, "kunne ikke nås: " + ", ".join(ikke))
    return Resultat(18, "Edge Functions uden login", BESTAAET, " · ".join(svar))

def tjek_funktioner_findes(repo, hent=hent):
    """De Edge Functions, appen kalder, skal findes på serveren (404 = funktionen er ikke udrullet, og funktionen i appen virker ikke)."""
    s = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    m = re.search(r'SUPABASE_URL *= *"([^"]+)"', s)
    if not m: return Resultat(8, "Funktionerne appen kalder findes", IKKE_TESTET, "SUPABASE_URL ikke fundet")
    mangler = []
    for f in funktioner(repo):
        try: st, _ = hent(f"{m.group(1)}/functions/v1/{f}")
        except Exception: return Resultat(8, "Funktionerne appen kalder findes", IKKE_TESTET, "serveren kunne ikke nås")
        if st == 404: mangler.append(f)
    if mangler: return Resultat(8, "Funktionerne appen kalder findes", FEJLET, "svarer 404 (ikke udrullet?): " + ", ".join(mangler))
    return Resultat(8, "Funktionerne appen kalder findes", BESTAAET)
