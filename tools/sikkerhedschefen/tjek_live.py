"""SIKKERHEDSCHEFEN · LØFTE 35 · LIVE-OPSÆTNINGEN (fejlkataloget J, L, I, C — Ida 12/10). Kun læsning: Supabase Management API (Idas CLI-login) og curl.
Login-mails (afsender, udløb, adresser, emner, billeder) · service-nøglen findes ikke i det, appen udleverer · ingen Stripe-testlinks live ·
efterladte testlogins. Kør: python3 tools/sikkerhedschefen/tjek_live.py"""
import os, re, sys, json, base64, urllib.request
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
from sikkerhedschefen.tjek_dbregler import sql, REF
# Kendte testlogins (Idas egne). Meta-testkontoen må ikke slettes, før Meta har svaret (12/10).
KENDTE_TEST = {"idatjessen+test3@hotmail.com": "Metas testkonto (App Review 12/10) — rør ikke", "idatjessen+test1@hotmail.com": "Idas test", "idatjessen+test2@hotmail.com": "Idas test",
               "test@energida.dk": "Idas test", "kontakt+test1@energida.dk": "Ringkøbing-testkøb 9/10", "kontakt+a@energida.dk": "Testkunde A", "kontakt+b@energida.dk": "Testkunde B", "kontakt+bb@energida.dk": "Gamle kunder-testkøb 11/10"}
ENGELSK = re.compile(r"^(Confirm|Your|Reset|Magic|Invite|You have been)", re.I)

def hent(url, binaer=False):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 sikkerhedschefen"})
    with urllib.request.urlopen(req, timeout=25) as r: return r.status, (r.read() if binaer else r.read().decode("utf-8", "replace"))

def auth():
    t = open(os.path.expanduser("~/.supabase/access-token")).read().strip()
    req = urllib.request.Request(f"https://api.supabase.com/v1/projects/{REF}/config/auth", headers={"Authorization": "Bearer " + t})
    return json.load(urllib.request.urlopen(req, timeout=25))

def jwt_rolle(tok):
    try:
        p = tok.split(".")[1]; p += "=" * (-len(p) % 4); return json.loads(base64.urlsafe_b64decode(p)).get("role")
    except Exception: return None

def koer():
    ud = []
    try: a = auth()
    except Exception as e: return [Resultat(35, "Live-opsætningen", IKKE_TESTET, f"kunne ikke læse Supabase: {e}"[:200])]
    tilladt = (a.get("uri_allow_list") or "")
    mangler = [h for h in ("https://b2b.energida.dk", "https://admin.energida.dk") if h not in tilladt]
    ud.append(Resultat(35, "Mail-links må sende til b2b og admin", FEJLET if mangler else BESTAAET, "mangler: " + ", ".join(mangler) if mangler else ""))
    ud.append(Resultat(35, "Login-linket i mailen holder 24 timer", BESTAAET if int(a.get("mailer_otp_exp") or 0) >= 86400 else FEJLET, f"udløb: {a.get('mailer_otp_exp')} s"))
    smtp_ok = bool(a.get("smtp_host")) and int(a.get("rate_limit_email_sent") or 0) >= 30
    ud.append(Resultat(35, "Mails sendes fra Idas egen afsender, mindst 30 i timen", BESTAAET if smtp_ok else FEJLET, f"{a.get('smtp_host')} · {a.get('rate_limit_email_sent')} i timen"))
    # Emner på de mails, der faktisk kan sendes: invitation og ny adgangskode altid; bekræftelse kun hvis selvoprettelse er åben
    brugte = ["invite", "recovery"] + ([] if a.get("disable_signup") else ["confirmation"])
    eng = [f"{k}: »{a.get('mailer_subjects_' + k)}«" for k in brugte if ENGELSK.search(str(a.get("mailer_subjects_" + k) or ""))]
    ud.append(Resultat(35, "Mails, kunderne får, har danske emner", FEJLET if eng else BESTAAET, " · ".join(eng)))
    billeder = sorted(set(re.findall(r'src="(https?://[^"]+)"', (a.get("mailer_templates_invite_content") or "") + (a.get("mailer_templates_recovery_content") or ""))))
    braek = []
    for b in billeder:
        try: s, _ = hent(b, True); braek += [] if s == 200 else [f"{b} ({s})"]
        except Exception as e: braek.append(f"{b} ({e})")
    ud.append(Resultat(35, f"Billederne i mailene virker ({len(billeder)})", FEJLET if braek else BESTAAET, ", ".join(braek)))
    # Service-nøglen må aldrig ligge i det, appen udleverer
    fund = []
    for side in ("https://b2b.energida.dk/", "https://admin.energida.dk/", "https://b2b.energida.dk/sw.js"):
        try:
            _, t = hent(side)
            if "service_role" in t: fund.append(side + " nævner service_role")
            for tok in re.findall(r"eyJ[\w-]+\.eyJ[\w-]+\.[\w-]+", t):
                if jwt_rolle(tok) == "service_role": fund.append(side + " har en service-nøgle")
        except Exception as e: fund.append(f"{side} kunne ikke hentes ({e})")
    ud.append(Resultat(35, "Service-nøglen findes ikke i det, appen udleverer", FEJLET if fund else BESTAAET, " · ".join(fund)))
    # Ingen Stripe-testlinks på hjemmesiden eller i appen
    test = []
    for side in ("https://energida.dk/", "https://energida.dk/succesfuld-detaildrift/", "https://b2b.energida.dk/", "https://admin.energida.dk/"):
        try:
            _, t = hent(side)
            if re.search(r"buy\.stripe\.com/test_|https://buy\.stripe\.com/[^\s\"'<]*[?&]prefilled[^\s\"'<]*test=ja|https://buy\.stripe\.com/[^\s\"'<]*[?&]test=ja|cs_test_", t): test.append(side)
        except Exception: pass
    ud.append(Resultat(35, "Ingen Stripe-testlinks live", FEJLET if test else BESTAAET, ", ".join(test)))
    try:
        rk = sql("select email from auth.users where email ilike '%test%' or email ilike '%zz%' or email ilike '%sele%' or email ilike 'kontakt+%'")
        nye = [r["email"] for r in rk if r["email"] not in KENDTE_TEST]
        ud.append(Resultat(35, f"Ingen ukendte testlogins på live ({len(rk)} kendte)", FEJLET if nye else BESTAAET, ", ".join(nye)))
    except Exception as e:
        ud.append(Resultat(35, "Testlogins på live", IKKE_TESTET, str(e)[:150]))
    return ud

if __name__ == "__main__":
    for r in koer(): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
