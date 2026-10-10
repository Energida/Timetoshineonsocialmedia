"""LØFTE 21 (del) — sikkerheds-headers på den levende adresse. Kun HEAD/GET af forsiden, ingen login."""
import urllib.request
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
KRAV = {"strict-transport-security": "HSTS", "content-security-policy": "CSP", "x-content-type-options": "nosniff", "referrer-policy": "Referrer-Policy"}

def hent_headers(url="https://b2b.energida.dk/"):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Energida sikkerhedschefen)"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return {k.lower(): v for k, v in r.headers.items()}

def tjek_headers(hent=hent_headers):
    try: h = hent()
    except Exception as e: return Resultat(21, "Sikkerheds-headers", IKKE_TESTET, f"forsiden kunne ikke hentes: {e}")
    mangler = [navn for k, navn in KRAV.items() if k not in h]
    ramme = "x-frame-options" in h or "frame-ancestors" in h.get("content-security-policy", "")
    if not ramme: mangler.append("frame-ancestors/X-Frame-Options")
    if mangler: return Resultat(21, "Sikkerheds-headers", FEJLET, "mangler: " + ", ".join(mangler))
    return Resultat(21, "Sikkerheds-headers", BESTAAET)
