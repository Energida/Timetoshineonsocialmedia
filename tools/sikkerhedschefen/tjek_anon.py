"""LØFTE 17 (del) — den offentlige nøgle udefra: kan en fremmed uden login læse kundedata?
Henter tabellisten fra /rest/v1/ (OpenAPI) med anon-nøglen, som appen selv udleverer, og spørger hver tabel om én række.
Kun GET, kun læsning, ingen login. En tabel, der svarer med rækker, er FEJLET."""
import os, re, json, urllib.request, urllib.error
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
# BEVIDST ÅBNE (sikkerhedskontrakten: kursusindhold er offentligt katalog, ingen kundedata). Alt andet, der svarer med rækker, er FEJLET.
TILLADT_AABNE = {"lektion_oevelser", "lektioner", "moduler", "produkt_lektioner", "produkter", "produkt_moduler"}

def noegle(repo):
    s = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    u = re.search(r'SUPABASE_URL *= *"([^"]+)"', s); k = re.search(r'SUPABASE_ANON_KEY *= *"([^"]+)"', s)
    return (u.group(1), k.group(1)) if u and k else (None, None)

def hent(url, key):
    req = urllib.request.Request(url, headers={"apikey": key, "Authorization": "Bearer " + key, "User-Agent": "Energida sikkerhedschefen"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r: return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e: return e.code, e.read().decode("utf-8", "replace")

def tabeller(spec):
    return sorted(p.strip("/") for p in (spec.get("paths") or {}) if p.count("/") == 1 and p != "/" and not p.startswith("/rpc"))

def tjek_anon(repo, hent=hent):
    url, key = noegle(repo)
    if not url: return Resultat(17, "Offentlig nøgle læser ingen kundedata", IKKE_TESTET, "nøglen blev ikke fundet i index.html")
    try:
        st, body = hent(url + "/rest/v1/", key)
    except Exception as e:
        return Resultat(17, "Offentlig nøgle læser ingen kundedata", IKKE_TESTET, f"basen kunne ikke nås: {e}")
    navne = []
    try:
        if st == 200: navne = tabeller(json.loads(body))
    except Exception: pass
    kode = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    navne = sorted(set(navne) | set(re.findall(r'sb\.from\(\s*"([a-z_0-9]+)"', kode)))   # tabellisten kan være lukket — appens egne tabeller spørges altid
    if not navne: return Resultat(17, "Offentlig nøgle læser ingen kundedata", IKKE_TESTET, "ingen tabeller at spørge")
    aabne = []
    for t in navne:
        try: s2, b2 = hent(f"{url}/rest/v1/{t}?select=*&limit=1", key)
        except Exception: continue
        if s2 == 200:
            try:
                if json.loads(b2): aabne.append(t)
            except Exception: pass
    tilladt = [t for t in aabne if t in TILLADT_AABNE]; aabne = [t for t in aabne if t not in TILLADT_AABNE]
    if not aabne: return Resultat(17, "Offentlig nøgle læser ingen kundedata", BESTAAET, f"{len(navne)} tabeller spurgt; kun kursusindholdet er åbent ({', '.join(tilladt) or 'ingen'})")
    return Resultat(17, "Offentlig nøgle læser ingen kundedata", FEJLET, f"{len(aabne)} af {len(navne)} tabeller svarer med rækker uden login: " + ", ".join(aabne))
