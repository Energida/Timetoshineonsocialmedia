"""Lager en opdigtet kursuskunde (YOU GOT THIS) med 11 moduler à 2 lektioner til prøven SELE MODULSIDE (v3470): Modul 0 er gennemført, Modul 1 er i gang, resten er låst.
Brug: python3 modul-db.py <ud.json>. Ingen rigtige data."""
import json, sys, datetime
KODE = "FORLOEBTEST2026"; idag = datetime.date.today().isoformat()
DEF = {"virksomhed": "Opdigtet kursus", "type": "kursus", "pakke": "detaildrift", "forloeb": "YOU GOT THIS — DETAIL", "ental": False, "skema": False, "login_klar": True,
       "oprettet": idag, "ygt_start": idag, "forretningstype": "butik", "strategi": {"temaer": [], "analyse": ""}, "maal": {"tekst": "Opdigtet mål", "opslag_uge": 3}}
NAVNE = ["Introduktion til forløbet", "Mennesket", "Energibanken", "Aflæs din konto", "Modul 4", "Modul 5", "Modul 6", "Contentmodellen", "Gør sociale medier til din bedste sælger", "Modul 9", "Værktøjskassen"]
MOD = {str(k + 1): "Modul %d · %s" % (k, NAVNE[k]) for k in range(11)}
ids = [("%d-%d" % (k + 1, j + 1)) for k in range(11) for j in range(2)]
lek = [{"id": i, "modul": MOD[i.split("-")[0]], "titel": "Opdigtet lektion " + i, "sortering": n, "video_link": "https://vimeo.com/000000" + str(n)} for n, i in enumerate(ids)]
sets = [{"id": "set%d" % n, "kode": KODE, "navn": "Test", "skema": "lektion_set_" + i, "svar": {"set": True}, "created_at": idag + "T08:00:00Z"} for n, i in enumerate(["1-1", "1-2", "2-1"])]
db = {"skema_svar": sets + [{"id": "kd1", "kode": KODE, "navn": "config", "skema": "kunde_def", "svar": DEF},
                            {"id": "pub1", "kode": "ENERGIDA", "navn": "config", "skema": "publicering", "svar": {"lektioner": ids, "produkter": ["yougotthis"]}}], "lektioner": lek}
open(sys.argv[1], "w").write(json.dumps({"ls": {"SELE_DB": json.dumps(db), "SELE_LATENS": "50"}}))
