# /sikkerhedschefen · Lag 1 (koden) + »hurtig« — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Et terminalscript, der på ~2 minutter giver BESTÅET / FEJLET / IKKE TESTET for lag 1-løfterne (2, 14, 16 + syntaks/design) og en skill `/sikkerhedschefen hurtig`, der kører det.

**Architecture:** Én Python-pakke `tools/sikkerhedschefen/` med ét modul pr. tjek; hvert tjek returnerer en `Resultat(loefte, navn, tilstand, detalje)`. `lag1.py` kører dem alle og skriver en rapport (tekst + JSON). Eksisterende værktøjer (`tools/tryghed/skriv-tjek.py`, `tools/designlaas/koer.sh`) kaldes, ikke skrives om. Tests med `unittest` (stdlib; pytest findes ikke på maskinen).

**Tech Stack:** Python 3 (stdlib: `re`, `json`, `subprocess`, `urllib.request`, `unittest`), Node (`node` til syntaks), git.

## Global Constraints

- Repo: `/Users/idajessen/Energida-soejler-kladde`, app-fil `index.html`, version i `const APP_VERSION = "NNNN"` og `version.txt`.
- Live: `https://b2b.energida.dk/version.txt` og `https://b2b.energida.dk/index.html` (kun GET, ingen login).
- Tre tilstande, ordret: `BESTÅET`, `FEJLET`, `IKKE TESTET`. Et tjek, der ikke kan køres (fx intet net), er `IKKE TESTET`, aldrig `BESTÅET`.
- Skriv-tjek: hver gemmevej uden `.select()` er en konkret mangel (FEJLET med liste), intet loft.
- Rapporten siger aldrig »det virker« om noget, der ikke blev kørt.
- Al tekst til Ida på dansk. `--no-verify` aldrig. Commits med `ENERGIDA_SECURITY_DEPLOY=1` (ét git-kald ad gangen).
- Claude logger aldrig ind på live og rører aldrig kundedata.

---

## File Structure

| Fil | Ansvar |
|---|---|
| `tools/sikkerhedschefen/__init__.py` | tom pakke-markør |
| `tools/sikkerhedschefen/resultat.py` | `Resultat`-type + de tre tilstande + `samlet()` |
| `tools/sikkerhedschefen/tjek_git.py` | løfte 14a: git rent og pushet |
| `tools/sikkerhedschefen/tjek_version.py` | løfte 14b: version.txt = APP_VERSION = live version.txt = live APP_VERSION |
| `tools/sikkerhedschefen/tjek_syntaks.py` | alle `<script>` gennem `node --check` |
| `tools/sikkerhedschefen/tjek_skriv.py` | løfte 2: gemmeveje uden kvittering (mangel-liste) |
| `tools/sikkerhedschefen/tjek_motorer.py` | løfte 16: døde onclick-referencer |
| `tools/sikkerhedschefen/tjek_design.py` | designporten (`koer.sh`), springes over med `--uden-design` |
| `tools/sikkerhedschefen/lag1.py` | kører alt, skriver rapport + `rapport-lag1.json` |
| `tools/sikkerhedschefen/test_lag1.py` | unittest for alle moduler |
| `/Users/idajessen/Desktop/SoMe App/.claude/skills/sikkerhedschefen/SKILL.md` | kommandoen (`hurtig` = lag 1) |

---

### Task 1: Resultat-typen

**Files:**
- Create: `tools/sikkerhedschefen/__init__.py`, `tools/sikkerhedschefen/resultat.py`
- Test: `tools/sikkerhedschefen/test_lag1.py`

**Interfaces:**
- Produces: `Resultat(loefte: int, navn: str, tilstand: str, detalje: str = "")`, konstanterne `BESTAAET = "BESTÅET"`, `FEJLET = "FEJLET"`, `IKKE_TESTET = "IKKE TESTET"`, og `samlet(resultater: list[Resultat]) -> str` der returnerer `FEJLET` hvis et er FEJLET, ellers `IKKE TESTET` hvis et er IKKE TESTET, ellers `BESTÅET`.

- [ ] **Step 1: Write the failing test**

```python
# tools/sikkerhedschefen/test_lag1.py
import unittest, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET, samlet

class TestResultat(unittest.TestCase):
    def test_samlet(self):
        self.assertEqual(samlet([Resultat(1, "a", BESTAAET)]), BESTAAET)
        self.assertEqual(samlet([Resultat(1, "a", BESTAAET), Resultat(2, "b", IKKE_TESTET)]), IKKE_TESTET)
        self.assertEqual(samlet([Resultat(1, "a", IKKE_TESTET), Resultat(2, "b", FEJLET)]), FEJLET)

if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/idajessen/Energida-soejler-kladde/tools && python3 -m unittest sikkerhedschefen.test_lag1 -v`
Expected: FAIL / ModuleNotFoundError `sikkerhedschefen.resultat`

- [ ] **Step 3: Write minimal implementation**

```python
# tools/sikkerhedschefen/__init__.py
```

```python
# tools/sikkerhedschefen/resultat.py
from dataclasses import dataclass
BESTAAET, FEJLET, IKKE_TESTET = "BESTÅET", "FEJLET", "IKKE TESTET"

@dataclass
class Resultat:
    loefte: int
    navn: str
    tilstand: str
    detalje: str = ""

def samlet(resultater):
    t = [r.tilstand for r in resultater]
    if FEJLET in t: return FEJLET
    if IKKE_TESTET in t: return IKKE_TESTET
    return BESTAAET
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/idajessen/Energida-soejler-kladde/tools && python3 -m unittest sikkerhedschefen.test_lag1 -v`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
cd /Users/idajessen/Energida-soejler-kladde && git add tools/sikkerhedschefen
ENERGIDA_SECURITY_DEPLOY=1 git commit -m "sikkerhedschefen: Resultat-typen"
```

---

### Task 2: Git og versionskæden (løfte 14)

**Files:**
- Create: `tools/sikkerhedschefen/tjek_git.py`, `tools/sikkerhedschefen/tjek_version.py`
- Test: `tools/sikkerhedschefen/test_lag1.py` (tilføj)

**Interfaces:**
- Consumes: `Resultat`, konstanterne fra Task 1.
- Produces: `tjek_git(repo: str) -> Resultat` (løfte 14); `app_version(html: str) -> str | None`; `tjek_version(repo: str, hent=urlhent) -> Resultat` (løfte 14), hvor `hent(url) -> str` kan erstattes i test; `urlhent(url: str) -> str` (timeout 10 s, `Cache-Control: no-cache`).

- [ ] **Step 1: Write the failing test**

```python
# tilføj i test_lag1.py
from sikkerhedschefen.tjek_version import app_version, tjek_version

class TestVersion(unittest.TestCase):
    def test_app_version(self):
        self.assertEqual(app_version('x const APP_VERSION = "2713"; y'), "2713")
        self.assertIsNone(app_version("ingen"))
    def test_tjek_version_ens(self):
        import tempfile
        d = tempfile.mkdtemp()
        open(os.path.join(d, "index.html"), "w").write('const APP_VERSION = "2713";')
        open(os.path.join(d, "version.txt"), "w").write("2713\n")
        hent = lambda url: "2713\n" if url.endswith("version.txt") else 'const APP_VERSION = "2713";'
        self.assertEqual(tjek_version(d, hent).tilstand, BESTAAET)
    def test_tjek_version_afviger(self):
        import tempfile
        d = tempfile.mkdtemp()
        open(os.path.join(d, "index.html"), "w").write('const APP_VERSION = "2713";')
        open(os.path.join(d, "version.txt"), "w").write("2713\n")
        hent = lambda url: "2712\n" if url.endswith("version.txt") else 'const APP_VERSION = "2712";'
        r = tjek_version(d, hent)
        self.assertEqual(r.tilstand, FEJLET); self.assertIn("2712", r.detalje)
    def test_tjek_version_intet_net(self):
        import tempfile
        d = tempfile.mkdtemp()
        open(os.path.join(d, "index.html"), "w").write('const APP_VERSION = "2713";')
        open(os.path.join(d, "version.txt"), "w").write("2713\n")
        def hent(url): raise OSError("net")
        self.assertEqual(tjek_version(d, hent).tilstand, IKKE_TESTET)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/idajessen/Energida-soejler-kladde/tools && python3 -m unittest sikkerhedschefen.test_lag1 -v`
Expected: FAIL / ImportError `tjek_version`

- [ ] **Step 3: Write minimal implementation**

```python
# tools/sikkerhedschefen/tjek_version.py
import os, re, urllib.request
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET
LIVE = "https://b2b.energida.dk/"

def urlhent(url):
    req = urllib.request.Request(url + ("&" if "?" in url else "?") + "sc=1", headers={"Cache-Control": "no-cache"})
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
        live_html = app_version(hent(LIVE + "index.html"))
    except Exception as e:
        return Resultat(14, "Versionskæden", IKKE_TESTET, f"live kunne ikke hentes: {e}")
    tal = {"index.html": lokal_html, "version.txt": lokal_txt, "live version.txt": live_txt, "live index.html": live_html}
    if len(set(tal.values())) == 1:
        return Resultat(14, "Versionskæden", BESTAAET, f"alle fire = {lokal_txt}")
    return Resultat(14, "Versionskæden", FEJLET, " · ".join(f"{k} {v}" for k, v in tal.items()))
```

```python
# tools/sikkerhedschefen/tjek_git.py
import subprocess
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET

def tjek_git(repo):
    try:
        st = subprocess.run(["git", "status", "--short"], cwd=repo, capture_output=True, text=True, timeout=30).stdout.strip()
        foran = subprocess.run(["git", "log", "--oneline", "origin/dashboard-og-database..HEAD"], cwd=repo, capture_output=True, text=True, timeout=30).stdout.strip()
    except Exception as e:
        return Resultat(14, "Git rent og pushet", IKKE_TESTET, str(e))
    if not st and not foran:
        return Resultat(14, "Git rent og pushet", BESTAAET)
    return Resultat(14, "Git rent og pushet", FEJLET, (f"ændret: {len(st.splitlines())} fil(er)" if st else "") + (f" · ikke pushet: {len(foran.splitlines())} commit(s)" if foran else ""))
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/idajessen/Energida-soejler-kladde/tools && python3 -m unittest sikkerhedschefen.test_lag1 -v`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
cd /Users/idajessen/Energida-soejler-kladde && git add tools/sikkerhedschefen
ENERGIDA_SECURITY_DEPLOY=1 git commit -m "sikkerhedschefen: git og versionskæden"
```

---

### Task 3: Syntaks og skriv-tjek (løfte 2)

**Files:**
- Create: `tools/sikkerhedschefen/tjek_syntaks.py`, `tools/sikkerhedschefen/tjek_skriv.py`
- Test: `tools/sikkerhedschefen/test_lag1.py` (tilføj)

**Interfaces:**
- Consumes: `Resultat` + konstanter.
- Produces: `tjek_syntaks(repo: str) -> Resultat` (løfte 15, navn »Koden kører«); `skrivninger_uden_kvittering(html: str) -> list[tuple[str, str, int]]` (tabel, verbum, linje); `tjek_skriv(repo: str) -> Resultat` (løfte 2) — FEJLET med antal og de første 15 linjer i detaljen, BESTÅET kun ved 0.

- [ ] **Step 1: Write the failing test**

```python
# tilføj i test_lag1.py
from sikkerhedschefen.tjek_skriv import skrivninger_uden_kvittering

class TestSkriv(unittest.TestCase):
    def test_finder_uden_select(self):
        html = 'a; sb.from("kunde_aftaler").delete().eq("id", 1);\nb; sb.from("kunde_aftaler").update({}).eq("id", 2).select();'
        u = skrivninger_uden_kvittering(html)
        self.assertEqual([(t, v) for t, v, l in u], [("kunde_aftaler", "delete")])
        self.assertEqual(u[0][2], 1)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/idajessen/Energida-soejler-kladde/tools && python3 -m unittest sikkerhedschefen.test_lag1 -v`
Expected: FAIL / ImportError `tjek_skriv`

- [ ] **Step 3: Write minimal implementation**

```python
# tools/sikkerhedschefen/tjek_skriv.py
import os, re
from .resultat import Resultat, BESTAAET, FEJLET
PAT = re.compile(r'sb\.from\(\s*"([a-z_]+)"\s*\)\s*\.(insert|update|upsert|delete)\(')

def skrivninger_uden_kvittering(html):
    ud = []
    for m in PAT.finditer(html):
        stmt = html[m.start():m.start() + 700].split(";")[0]
        if ".select(" not in stmt:
            ud.append((m.group(1), m.group(2), html.count("\n", 0, m.start()) + 1))
    return ud

def tjek_skriv(repo):
    u = skrivninger_uden_kvittering(open(os.path.join(repo, "index.html"), encoding="utf-8").read())
    if not u:
        return Resultat(2, "Hver gemmevej har kvittering", BESTAAET)
    liste = ", ".join(f"{t}.{v} l.{l}" for t, v, l in u[:15])
    return Resultat(2, "Hver gemmevej har kvittering", FEJLET, f"{len(u)} gemmeveje uden kvittering (mangel): {liste}{' …' if len(u) > 15 else ''}")
```

```python
# tools/sikkerhedschefen/tjek_syntaks.py
import os, re, subprocess, tempfile
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET

def tjek_syntaks(repo):
    s = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    scripts = re.findall(r"<script(?![^>]*src)[^>]*>([\s\S]*?)</script>", s)
    fejl = []
    for i, kode in enumerate(scripts):
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
            f.write(kode); sti = f.name
        try:
            r = subprocess.run(["node", "--check", sti], capture_output=True, text=True, timeout=60)
        except FileNotFoundError:
            return Resultat(15, "Koden kører", IKKE_TESTET, "node findes ikke")
        if r.returncode != 0:
            fejl.append(f"script {i}: {r.stderr.strip().splitlines()[-1] if r.stderr.strip() else 'fejl'}")
    if fejl:
        return Resultat(15, "Koden kører", FEJLET, " · ".join(fejl[:5]))
    return Resultat(15, "Koden kører", BESTAAET, f"{len(scripts)} scripts uden syntaksfejl")
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/idajessen/Energida-soejler-kladde/tools && python3 -m unittest sikkerhedschefen.test_lag1 -v`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
cd /Users/idajessen/Energida-soejler-kladde && git add tools/sikkerhedschefen
ENERGIDA_SECURITY_DEPLOY=1 git commit -m "sikkerhedschefen: syntaks og skriv-tjek"
```

---

### Task 4: Døde referencer (løfte 16) og designporten

**Files:**
- Create: `tools/sikkerhedschefen/tjek_motorer.py`, `tools/sikkerhedschefen/tjek_design.py`
- Test: `tools/sikkerhedschefen/test_lag1.py` (tilføj)

**Interfaces:**
- Consumes: `Resultat` + konstanter.
- Produces: `doede_onclick(html: str) -> list[str]` (funktionsnavne kaldt fra `onclick="navn(` uden `function navn`, `navn = function`, `window.navn =` eller `async function navn`); `tjek_motorer(repo: str) -> Resultat` (løfte 16); `tjek_design(repo: str) -> Resultat` (løfte 9 under Hans: designport — `koer.sh` med 600 s timeout; BESTÅET ved 16 » OK« og ingen »FEJL«, timeout → IKKE TESTET).

- [ ] **Step 1: Write the failing test**

```python
# tilføj i test_lag1.py
from sikkerhedschefen.tjek_motorer import doede_onclick

class TestMotorer(unittest.TestCase):
    def test_doede(self):
        html = '<b onclick="findes()"></b><b onclick="mangler(1)"></b><b onclick="w()"></b><script>function findes(){} window.w = function(){};</script>'
        self.assertEqual(doede_onclick(html), ["mangler"])
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/idajessen/Energida-soejler-kladde/tools && python3 -m unittest sikkerhedschefen.test_lag1 -v`
Expected: FAIL / ImportError `tjek_motorer`

- [ ] **Step 3: Write minimal implementation**

```python
# tools/sikkerhedschefen/tjek_motorer.py
import os, re
from .resultat import Resultat, BESTAAET, FEJLET
INDBYGGET = {"if", "try", "event", "this", "document", "window", "location", "history", "setTimeout", "alert", "confirm", "return", "Array", "JSON", "String", "Number", "Math", "parseInt", "encodeURIComponent"}

def doede_onclick(html):
    kaldt = set(re.findall(r'onclick="\s*(?:event\.stopPropagation\(\);\s*)?([A-Za-z_$][\w$]*)\(', html))
    defineret = set(re.findall(r'(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(', html))
    defineret |= set(re.findall(r'(?:window\.)?([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\b', html))
    defineret |= set(re.findall(r'(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(', html))
    return sorted(n for n in kaldt if n not in defineret and n not in INDBYGGET)

def tjek_motorer(repo):
    d = doede_onclick(open(os.path.join(repo, "index.html"), encoding="utf-8").read())
    if not d:
        return Resultat(16, "Ingen døde knapper i koden", BESTAAET)
    return Resultat(16, "Ingen døde knapper i koden", FEJLET, "kaldes, men findes ikke: " + ", ".join(d[:20]))
```

```python
# tools/sikkerhedschefen/tjek_design.py
import os, subprocess
from .resultat import Resultat, BESTAAET, FEJLET, IKKE_TESTET

def tjek_design(repo):
    try:
        r = subprocess.run(["bash", "tools/designlaas/koer.sh"], cwd=repo, capture_output=True, text=True, timeout=600)
    except subprocess.TimeoutExpired:
        return Resultat(9, "Designporten", IKKE_TESTET, "porten nåede ikke færdig på 10 min.")
    ud = r.stdout + r.stderr
    ok = sum(1 for l in ud.splitlines() if " OK" in l)
    fejl = [l for l in ud.splitlines() if "FEJL" in l]
    if fejl:
        return Resultat(9, "Designporten", FEJLET, " · ".join(fejl[:3]))
    if ok >= 16:
        return Resultat(9, "Designporten", BESTAAET, f"{ok} OK")
    return Resultat(9, "Designporten", IKKE_TESTET, f"kun {ok} OK — porten blev ikke kørt færdig")
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/idajessen/Energida-soejler-kladde/tools && python3 -m unittest sikkerhedschefen.test_lag1 -v`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
cd /Users/idajessen/Energida-soejler-kladde && git add tools/sikkerhedschefen
ENERGIDA_SECURITY_DEPLOY=1 git commit -m "sikkerhedschefen: døde referencer og designporten"
```

---

### Task 5: `lag1.py` — kør alt og skriv rapporten

**Files:**
- Create: `tools/sikkerhedschefen/lag1.py`
- Test: `tools/sikkerhedschefen/test_lag1.py` (tilføj)

**Interfaces:**
- Consumes: `tjek_git`, `tjek_version`, `tjek_syntaks`, `tjek_skriv`, `tjek_motorer`, `tjek_design`, `samlet`.
- Produces: `rapport_tekst(resultater, version: str, tid: str) -> str`; CLI `python3 tools/sikkerhedschefen/lag1.py [--uden-design]` der printer rapporten, skriver `tools/sikkerhedschefen/rapport-lag1.json` (`{"version","tid","samlet","resultater":[…]}`) og afslutter med kode 0 kun ved samlet BESTÅET.

- [ ] **Step 1: Write the failing test**

```python
# tilføj i test_lag1.py
from sikkerhedschefen.lag1 import rapport_tekst

class TestRapport(unittest.TestCase):
    def test_overskrift_og_tilstande(self):
        r = [Resultat(14, "Versionskæden", BESTAAET, "2713"), Resultat(2, "Kvittering", FEJLET, "125")]
        t = rapport_tekst(r, "2713", "2026-10-10 12:00")
        self.assertIn("LAG 1 · FEJLET · v2713 · 2026-10-10 12:00", t)
        self.assertIn("FEJLET  · 2 · Kvittering · 125", t)
        self.assertIn("Lag 1 alene siger aldrig »klar til nye kunder«.", t)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/idajessen/Energida-soejler-kladde/tools && python3 -m unittest sikkerhedschefen.test_lag1 -v`
Expected: FAIL / ImportError `lag1`

- [ ] **Step 3: Write minimal implementation**

```python
# tools/sikkerhedschefen/lag1.py
import os, sys, json, datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sikkerhedschefen.resultat import samlet, BESTAAET
from sikkerhedschefen.tjek_git import tjek_git
from sikkerhedschefen.tjek_version import tjek_version, app_version
from sikkerhedschefen.tjek_syntaks import tjek_syntaks
from sikkerhedschefen.tjek_skriv import tjek_skriv
from sikkerhedschefen.tjek_motorer import tjek_motorer
from sikkerhedschefen.tjek_design import tjek_design
REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

def rapport_tekst(resultater, version, tid):
    linjer = [f"LAG 1 · {samlet(resultater)} · v{version} · {tid}", ""]
    for r in sorted(resultater, key=lambda x: x.loefte):
        linjer.append(f"{r.tilstand:<7} · {r.loefte} · {r.navn}" + (f" · {r.detalje}" if r.detalje else ""))
    linjer += ["", "Lag 1 alene siger aldrig »klar til nye kunder«."]
    return "\n".join(linjer)

def main():
    res = [tjek_git(REPO), tjek_version(REPO), tjek_syntaks(REPO), tjek_skriv(REPO), tjek_motorer(REPO)]
    if "--uden-design" not in sys.argv:
        res.append(tjek_design(REPO))
    version = app_version(open(os.path.join(REPO, "index.html"), encoding="utf-8").read()) or "?"
    tid = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    print(rapport_tekst(res, version, tid))
    json.dump({"version": version, "tid": tid, "samlet": samlet(res), "resultater": [r.__dict__ for r in res]},
              open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "rapport-lag1.json"), "w"), ensure_ascii=False, indent=1)
    sys.exit(0 if samlet(res) == BESTAAET else 1)

if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run test to verify it passes, then run it for real**

Run: `cd /Users/idajessen/Energida-soejler-kladde/tools && python3 -m unittest sikkerhedschefen.test_lag1 -v`
Expected: PASS (7 tests)

Run: `cd /Users/idajessen/Energida-soejler-kladde && python3 tools/sikkerhedschefen/lag1.py --uden-design`
Expected: rapport med `LAG 1 · FEJLET · v2713 …` (løfte 2 er FEJLET med 125 mangler — det er korrekt; det er en kendt mangel, ikke en testfejl). Se rapporten; hvert FEJLET skal have en detalje.

- [ ] **Step 5: Commit** (læg `rapport-lag1.json` i `.gitignore` først)

```bash
cd /Users/idajessen/Energida-soejler-kladde && printf "tools/sikkerhedschefen/rapport-lag1.json\n" >> .gitignore && git add .gitignore tools/sikkerhedschefen
ENERGIDA_SECURITY_DEPLOY=1 git commit -m "sikkerhedschefen: lag1.py samler rapporten"
```

---

### Task 6: Skill-filen `/sikkerhedschefen` (»hurtig« = lag 1)

**Files:**
- Create: `/Users/idajessen/Desktop/SoMe App/.claude/skills/sikkerhedschefen/SKILL.md`

**Interfaces:**
- Consumes: CLI fra Task 5.
- Produces: kommandoen `/sikkerhedschefen` og `/sikkerhedschefen hurtig`.

- [ ] **Step 1: Write the skill**

````markdown
---
name: sikkerhedschefen
description: "SIKKERHEDSCHEFEN — siger »klar til nye kunder« kun når alle kritiske løfter er BESTÅET på den præcise liveversion. /sikkerhedschefen hurtig = lag 1 (koden, ~2 min.) ved hver deploy. Trigger: /sikkerhedschefen, »kan jeg give adgang til nye kunder«, »er appen klar til launch«."
---

# /sikkerhedschefen

Designet: `Energida-soejler-kladde/docs/superpowers/specs/2026-10-10-sikkerhedschefen-design.md` og Claude Doc'en »Sikkerhedschefen« (26 løfter).

## Tre tilstande — altid
BESTÅET · FEJLET · IKKE TESTET. Et tjek, der ikke kunne køres, er IKKE TESTET, aldrig BESTÅET. Et kritisk løfte (1, 2, 3, 4, 5, 6, 14, 15, 17, 18, 19, 22, 23, 24), der er FEJLET eller IKKE TESTET, gør svaret til **IKKE KLAR**. Resultatet gælder versionsnummer + tidspunkt; en ny deploy gør det ugyldigt.

## /sikkerhedschefen hurtig (lag 1)
```bash
cd /Users/idajessen/Energida-soejler-kladde && python3 tools/sikkerhedschefen/lag1.py
```
Rapportér til Ida i højst seks linjer: overskriften (`LAG 1 · … · vNNNN · tid`), hvert FEJLET med detalje, hvert IKKE TESTET med grund. Sig: »Lag 1 alene siger aldrig klar til nye kunder.«

## /sikkerhedschefen (fuld)
Lag 1 som ovenfor, derefter lag 2 (testversionen) og lag 3 (Idas Selvtest-knap + datavagt-SQL). Lag 2 og 3 er endnu ikke bygget — sig det højt og markér deres løfter IKKE TESTET. Svaret er derfor **IKKE KLAR**, til de er bygget og grønne.

## Aldrig
Logge ind på live med et kodeord · røre rigtige kunders data · slette noget af sig selv · sige »det virker« om noget, der ikke blev kørt.
````

- [ ] **Step 2: Verify the skill runs**

Run: `cd /Users/idajessen/Energida-soejler-kladde && python3 tools/sikkerhedschefen/lag1.py --uden-design; echo "exit $?"`
Expected: rapporten printes; `exit 1` (løfte 2 FEJLET med 125 mangler).

- [ ] **Step 3: Note it in memory and MEMORY.md**

Opret `/Users/idajessen/.claude/projects/-Users-idajessen-Desktop-SoMe-App/memory/sikkerhedschefen.md` (type: project) med: kommandoen, de tre tilstande, at lag 2/3 mangler, og linjen i MEMORY.md: `- [Sikkerhedschefen](sikkerhedschefen.md) — /sikkerhedschefen hurtig = lag 1 bygget 10/10; lag 2 (selen) og 3 (Selvtest) mangler; tre tilstande`.

- [ ] **Step 4: Commit** (skill-mappen ligger uden for repoet — kun repo-ændringer committes; der er ingen her, så intet commit)

---

## Self-Review

- **Spec coverage (lag 1):** git rent/pushet (T2), version.txt = APP_VERSION = live (T2), syntaks (T3), designport (T4), skriv-tjek som mangel-liste uden loft (T3), døde referencer (T4), rapport med tre tilstande + version + tid (T5), `hurtig` (T6). **Ikke i denne plan (egne planer):** service-worker-versionstjek (sw.js har et fast cachenavn `energida-v6`, ikke appversionen — løfte 24 testes i lag 2 med gammel cache), »én gem-motor pr. tabel« (kræver tabel-kortlægning — lag 2-planen), lag 2, Selvtest-knappen, samle-rapporten for alle tre lag.
- **Placeholders:** ingen.
- **Typer:** `Resultat(loefte, navn, tilstand, detalje)` bruges ens i alle tasks; `tjek_*(repo) -> Resultat` overalt; `tjek_version(repo, hent)` kun i T2 og T5.
