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
