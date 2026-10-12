"""SIKKERHEDSCHEFEN · LØFTE 47 · INGEN HEMMELIGHEDER I GIT (fejlkataloget nr. 152).
To dele: (1) hele historikken (alle grene) søges efter nøgler, der aldrig må stå i en fil: Stripe live-nøgler, Supabase-adgangsnøgler (sbp_),
webhook-hemmeligheder (whsec_) og private nøgler. (2) Hver JWT i de filer, der ligger i git nu, afkodes: en nøgle med rollen service_role
er en hemmelighed; anon-nøglen er offentlig med vilje. Kun læsning — intet ændres."""
import os, re, sys, json, base64, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET
from sikkerhedschefen.lag2 import REPO
MOENSTER = r"sk_live_[0-9A-Za-z]{10}|rk_live_[0-9A-Za-z]{10}|sbp_[0-9a-f]{20}|whsec_[0-9A-Za-z]{10}|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY"
JWT = re.compile(r"eyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]{10,}")

def historik(repo=REPO):
    r = subprocess.run(["git", "log", "--all", "--format=%h %s", "-G", MOENSTER], cwd=repo, capture_output=True, text=True, timeout=600)
    return [l for l in r.stdout.splitlines() if l.strip()]

def roller(repo=REPO):
    filer = subprocess.run(["git", "ls-files"], cwd=repo, capture_output=True, text=True).stdout.split()
    fund = []
    for f in filer:
        p = os.path.join(repo, f)
        try:
            if os.path.getsize(p) > 20_000_000: continue
            txt = open(p, encoding="utf-8", errors="ignore").read()
        except Exception: continue
        for m in JWT.finditer(txt):
            try:
                b = m.group(1); b += "=" * (-len(b) % 4)
                rolle = json.loads(base64.urlsafe_b64decode(b)).get("role")
            except Exception: continue
            if rolle and rolle not in ("anon", "authenticated"): fund.append(f"{f}: rolle {rolle}")
    return sorted(set(fund))

def koer(repo=REPO):
    h = historik(repo); r = roller(repo)
    return [Resultat(47, "Ingen live-nøgler eller private nøgler i git-historikken", FEJLET if h else BESTAAET, "; ".join(h[:5])),
            Resultat(47, "Ingen service_role-nøgle i filerne (kun den offentlige anon-nøgle)", FEJLET if r else BESTAAET, "; ".join(r[:5]))]

if __name__ == "__main__":
    for x in koer(): print(f"{x.tilstand:<11} · {x.loefte:>2} · {x.navn}" + (f" · {x.detalje}" if x.detalje else ""))
