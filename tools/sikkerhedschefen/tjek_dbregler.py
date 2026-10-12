"""SIKKERHEDSCHEFEN · LØFTE 34 · DATABASENS REGLER MÅLES DIREKTE (fejlkataloget L, Ida 12/10). Kun læsning via Supabase Management API (Idas CLI-login).
(1) Hver tabel i public har adgangsregler (RLS) slået til. (2) Ingen regel åbner for alle (anon/public med »true«), ud over de kendte, bevidste.
(3) Ingen databasefunktion med ejerens rettigheder kan kaldes uden login, ud over de kendte. (4) Ingen fil-mappe er offentlig, ud over de kendte.
En NY åbning er FEJLET, til den er vurderet og skrevet på listen nedenfor med en begrundelse.
Kør: python3 tools/sikkerhedschefen/tjek_dbregler.py"""
import os, sys, json, urllib.request
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
REF = "eikcvvppuphnananxcvp"
# BEVIDSTE ÅBNINGER (vurderet 13/10 nat). Hver linje: hvad · hvorfor det er i orden.
KENDTE_REGLER = {
    ("tilmeldinger", "INSERT"): "tilmeldingsformularen på hjemmesiden — man kan kun skrive, ikke læse",
    ("produkter", "SELECT"): "kursuskatalog, ingen kundedata", ("produkt_lektioner", "SELECT"): "kursuskatalog", ("moduler", "SELECT"): "kursuskatalog",
    ("lektion_register", "SELECT"): "kursuskatalog", ("lektioner", "SELECT"): "kursuskatalog", ("lektion_oevelser", "SELECT"): "kursuskatalog",
}
KENDTE_FUNKTIONER = {"tjek_kode": "koden tjekkes før login; svarer kun virksomhedsnavn, forløb og om login er klar for en aktiv kode"}
KENDTE_MAPPER = {"inspiration": "inspirationsbilleder vises via link; ingen må liste mappen, upload kun i egen mappe"}

def sql(q):
    t = open(os.path.expanduser("~/.supabase/access-token")).read().strip()
    req = urllib.request.Request(f"https://api.supabase.com/v1/projects/{REF}/database/query", data=json.dumps({"query": q}).encode(),
                                 headers={"Authorization": "Bearer " + t, "Content-Type": "application/json"}, method="POST")
    return json.load(urllib.request.urlopen(req, timeout=30))

def koer():
    try:
        uden_rls = sql("select relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and not c.relrowsecurity")
        aabne = sql("select tablename, cmd from pg_policies where schemaname='public' and (roles::text like '%anon%' or roles::text like '%public%') and (coalesce(qual,'')='true' or coalesce(with_check,'')='true')")
        funk = sql("select p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosecdef and has_function_privilege('anon', p.oid, 'execute')")
        mapper = sql("select id from storage.buckets where public")
    except Exception as e:
        return [Resultat(34, "Databasens regler", IKKE_TESTET, f"kunne ikke læse basen: {e}"[:200])]
    nye_regler = [f"{a['tablename']} ({a['cmd']})" for a in aabne if (a["tablename"], a["cmd"]) not in KENDTE_REGLER]
    nye_funk = [f["proname"] for f in funk if f["proname"] not in KENDTE_FUNKTIONER]
    nye_mapper = [m["id"] for m in mapper if m["id"] not in KENDTE_MAPPER]
    return [Resultat(34, "Hver tabel har adgangsregler slået til", FEJLET if uden_rls else BESTAAET, ", ".join(r["relname"] for r in uden_rls)),
            Resultat(34, f"Ingen nye regler åbner for alle ({len(aabne)} kendte og vurderede)", FEJLET if nye_regler else BESTAAET, "nye: " + ", ".join(nye_regler) if nye_regler else ""),
            Resultat(34, "Ingen nye funktioner kan kaldes uden login med ejerens rettigheder", FEJLET if nye_funk else BESTAAET, ", ".join(nye_funk)),
            Resultat(34, "Ingen nye offentlige fil-mapper", FEJLET if nye_mapper else BESTAAET, ", ".join(nye_mapper))]

if __name__ == "__main__":
    for r in koer(): print(f"{r.tilstand:<11} · {r.loefte:>2} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
