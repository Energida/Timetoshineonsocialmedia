import os, re, urllib.request
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
LIVE = "https://b2b.energida.dk/"

def urlhent(url):
    req = urllib.request.Request(url + ("&" if "?" in url else "?") + "sc=1", headers={"Cache-Control": "no-cache", "User-Agent": "Mozilla/5.0 (Energida sikkerhedschefen)"})
    with urllib.request.urlopen(req, timeout=10) as r:
        return r.read().decode("utf-8", "replace")

def app_version(html):
    m = re.search(r'const APP_VERSION = "(\d+)"', html)
    return m.group(1) if m else None

def tjek_version(repo, hent=urlhent):
    lokal_html = app_version(open(os.path.join(repo, "index.html"), encoding="utf-8").read())
    lokal_txt = open(os.path.join(repo, "version.txt")).read().strip()
    try:
        live_txt = hent(LIVE + "version.txt").strip()
        live_html = app_version(hent(LIVE))   # roden; /index.html omdirigeres (308)
    except Exception as e:
        return Resultat(14, "Versionskæden", IKKE_TESTET, f"live kunne ikke hentes: {e}")
    tal = {"index.html": lokal_html, "version.txt": lokal_txt, "live version.txt": live_txt, "live index.html": live_html}
    if len(set(tal.values())) == 1:
        return Resultat(14, "Versionskæden", BESTAAET, f"alle fire = {lokal_txt}")
    return Resultat(14, "Versionskæden", FEJLET, " · ".join(f"{k} {v}" for k, v in tal.items()))
