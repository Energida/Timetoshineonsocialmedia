# CRM bud 1 — kortlægning (11/11, trin 1, v3206 ikke deployet)

## Hvor feltet bor
| Felt | Kontakter (contacts) | Kunder med kode |
|---|---|---|
| Status | contacts.status | ingen gemt; vises som »Aktiv« (skrivebeskyttet) |
| Produkt | contacts.produkt | udledt af kundens def (CRM_OMRAADER / bsKundeProdukt) — skrivebeskyttet |
| Næste aktivitet | contacts.naeste_aktivitet | næste planlagte opslag — skrivebeskyttet |
| Kommentar | contacts.kommentar | ingen |
| Kontaktperson | contacts.kontaktperson | skema_svar › kunde_info.kontakt |
| Postnummer / By | INGEN kolonne → vane-række `crm_adresse` [{id,postnr,by}] | skema_svar › kunde_info.postnr/by |
| Pin | vane-række `kunde_pins` (nøgle `c:<id>` for kontakter, koden for kunder) | samme |
| Visning | vane-række `crm_visning` (v:2) | |

## Én kilde i hukommelsen
CUSTOMERS · KUNDE_INFO · CRM_ADR · KUNDE_PINS. Efter hver skrivning: `crmSynk()` tegner tabel, Salg, Hjem, åbent kontaktkort og (ikke fra kortet) kundesiden om. Kontaktkortet skriver via kontaktFlush (nu med .select() og rækketælling + tilbagerulning). Fane får fokus → frisk hentning (kontakter), så en rettelse i basen ses.

## Ingen DB-ændringer
Ingen nye tabeller/kolonner/policies/Edge Functions. Kun eksisterende skema_svar-vanerækker (Idas egen række).
