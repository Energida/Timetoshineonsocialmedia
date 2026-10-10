import unittest, os, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET, samlet
from sikkerhedschefen.tjek_version import app_version, tjek_version
from sikkerhedschefen.tjek_skriv import skrivninger_uden_kvittering
from sikkerhedschefen.tjek_motorer import doede_onclick, dobbelte_funktioner
from sikkerhedschefen.lag1 import rapport_tekst

def mappe(v_html="2713", v_txt="2713"):
    d = tempfile.mkdtemp()
    open(os.path.join(d, "index.html"), "w").write(f'const APP_VERSION = "{v_html}";')
    open(os.path.join(d, "version.txt"), "w").write(v_txt + "\n")
    return d

class TestResultat(unittest.TestCase):
    def test_samlet(self):
        self.assertEqual(samlet([Resultat(1, "a", BESTAAET)]), BESTAAET)
        self.assertEqual(samlet([Resultat(1, "a", BESTAAET), Resultat(2, "b", IKKE_TESTET)]), IKKE_TESTET)
        self.assertEqual(samlet([Resultat(1, "a", IKKE_TESTET), Resultat(2, "b", FEJLET)]), FEJLET)

class TestVersion(unittest.TestCase):
    def test_app_version(self):
        self.assertEqual(app_version('x const APP_VERSION = "2713"; y'), "2713")
        self.assertIsNone(app_version("ingen"))
    def test_ens(self):
        hent = lambda url: "2713\n" if url.endswith("version.txt") else 'const APP_VERSION = "2713";'
        self.assertEqual(tjek_version(mappe(), hent).tilstand, BESTAAET)
    def test_afviger(self):
        hent = lambda url: "2712\n" if url.endswith("version.txt") else 'const APP_VERSION = "2712";'
        r = tjek_version(mappe(), hent)
        self.assertEqual(r.tilstand, FEJLET); self.assertIn("2712", r.detalje)
    def test_intet_net(self):
        def hent(url): raise OSError("net")
        self.assertEqual(tjek_version(mappe(), hent).tilstand, IKKE_TESTET)

class TestSkriv(unittest.TestCase):
    def test_finder_uden_select(self):
        html = 'a; sb.from("kunde_aftaler").delete().eq("id", 1);\nb; sb.from("kunde_aftaler").update({}).eq("id", 2).select();'
        u = skrivninger_uden_kvittering(html)
        self.assertEqual([(t, v) for t, v, l in u], [("kunde_aftaler", "delete")])
        self.assertEqual(u[0][2], 1)

class TestMotorer(unittest.TestCase):
    def test_doede(self):
        html = '<b onclick="findes()"></b><b onclick="mangler(1)"></b><b onclick="w()"></b><script>function findes(){} window.w = function(){};</script>'
        self.assertEqual(doede_onclick(html), ["mangler"])

class TestDobbelte(unittest.TestCase):
    def test_dobbelte(self):
        self.assertEqual(dobbelte_funktioner("<script>\nfunction a() {}\nasync function b() {}\nfunction a(x) {}\n</script>"), ["a"])
        self.assertEqual(dobbelte_funktioner("<script>\nfunction a() {}\n</script><script>\nfunction a(x) {}\n</script>"), [])   # bevidst overskrivning i senere blok

class TestAnon(unittest.TestCase):
    def test_kun_kursus_aabent(self):
        from sikkerhedschefen.tjek_anon import tjek_anon
        d = tempfile.mkdtemp(); open(os.path.join(d, "index.html"), "w").write('SUPABASE_URL = "https://x.supabase.co"; SUPABASE_ANON_KEY = "k"; sb.from("lektioner"); sb.from("content_ideer");')
        def hent(url, key):
            if url.endswith("/rest/v1/"): return 401, ""
            return 200, ('[{"id":1}]' if "lektioner" in url else "[]")
        self.assertEqual(tjek_anon(d, hent).tilstand, BESTAAET)
        def hent2(url, key):
            if url.endswith("/rest/v1/"): return 401, ""
            return 200, '[{"id":1}]'
        r = tjek_anon(d, hent2); self.assertEqual(r.tilstand, FEJLET); self.assertIn("content_ideer", r.detalje)

class TestRapport(unittest.TestCase):
    def test_overskrift(self):
        r = [Resultat(14, "Versionskæden", BESTAAET, "2713"), Resultat(2, "Kvittering", FEJLET, "125")]
        t = rapport_tekst(r, "2713", "2026-10-10 12:00")
        self.assertIn("LAG 1 · FEJLET · v2713 · 2026-10-10 12:00", t)
        self.assertIn("FEJLET  · 2 · Kvittering · 125", t)
        self.assertIn("Lag 1 alene siger aldrig »klar til nye kunder«.", t)

if __name__ == "__main__":
    unittest.main()
