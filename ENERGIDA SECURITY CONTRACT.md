# ENERGIDA SECURITY CONTRACT

**Bindende. Vedtaget af Ida 9. august 2026 efter RLS-migreringen.**

**LÆS DENNE FØR** du rører: RLS eller policies · nye tabeller eller kolonner med ejerdata · `auth` eller `app_metadata` · Edge Functions · service-role-nøglen · storage · signup eller invitation · noget der kan koste penge pr. kald.

Reglerne er ikke råd. En ændring, der bryder én af dem, må ikke deployes.

---

## 1 · Default deny

Ingen ny tabel og ingen ny policy må åbnes bredt for `public` eller `anon` — heller ikke midlertidigt, heller ikke „indtil vi får tid".

Forbudt: `using (true)` · `with check (true)` · `to public` · `to anon` på noget, der bærer ejerdata.

**Ny tabel = RLS til + en scoped policy i SAMME sætning.** En tabel uden policy er lukket; en tabel med en bred policy er åben for hele internettet.

**Bevis:** sweepet i bilaget viser **0** skrivende policies for `anon`/`public` og **0** tabeller uden RLS.

## 2 · Permanent ejeridentitet

| Data | Ejer |
|---|---|
| Virksomhedsdata | **`virksomhed_id`** (uuid) |
| Personlige data | **`auth.uid()`** |

**`kode` er invitation og adgangsmekanisme — aldrig permanent dataejer.** Den skal kunne skiftes, spærres og genudstedes uden at flytte én række.

Er det uklart, om noget er virksomheds- eller personejet, svares fire spørgsmål **først**: Hvem ejer det semantisk? Følger det personen ved jobskifte? Tilhører det arbejdsgiveren? Skal flere kunne dele det? **Ingen antagelser.**

## 3 · Edge Functions

Hver funktion skal have disse seks linjer dokumenteret, i funktionens hoved og i hændelsesloggen:

1. **Verify JWT** — til eller fra
2. **Hvem må kalde den**
3. **Egen authorization-logik** — eller udtrykkeligt „ingen"
4. **Bruger den service-role?**
5. **Hvilke tabeller og data kan den nå?**
6. **Kan den skabe direkte omkostning?**

**Verify JWT OFF er en eksplicit, dokumenteret undtagelse** med en begrundelse — ikke en standard.

**Og husk:** Verify JWT med anon-nøglen er ikke adgangskontrol. Supabase skriver det selv: *„The `anon` key satisfies this."* Den nøgle ligger i klartekst i sidens kildekode.

## 4 · Service role

**Aldrig i klientkode.** Ikke i `index.html`, ikke i en variabel, ikke i en kommentar.

En Edge Function med service-role skal have **snæver server-side adgangskontrol foran sig** — identiteten slås op på kalderens eget token, og rettigheden tjekkes som kalderen.

Mønsteret findes allerede og virker: `opret-workout-bruger` henter `getUser(jwt)` og spørger `er_admin()` **som kalderen**. Kopiér den, ikke `signup-med-kode`.

## 5 · Faste rolletests

Enhver ændring i adgang eller RLS eftertestes med **fire roller**: anonym · kunde A · kunde B (krydsadgang) · admin.

Der skal bevises:

- kunden ser **kun** egne data
- kunden kan **kun** skrive legitimt — også når hun selv redigerer sit `user_metadata`
- admin beholder den nødvendige adgang
- **unik testmarkør** på alt, der skrives
- **fuld oprydning, 0 testdata tilbage** — målt, ikke antaget

En appbesked som „gemt" er ikke et bevis. Postgres kaster ikke ved en afvist skrivning: den rammer nul rækker og svarer `error = null`. **Brug `.select()` og tæl rækkerne.**

## 6 · Signup og invitation

**Ingen signup- eller invitationsfunktion må kunne ændre credentials på en eksisterende bruger.** Findes e-mailen i forvejen: stop.

Adgangskodeskift hører til et særskilt, autentificeret recovery-flow. Aldrig i den funktion, der opretter.

*Anledningen: `signup-med-kode-` kaldte `updateUserById` med en ny adgangskode på en kendt e-mail. Kode + mail = kontoovertagelse. Slettet 7. august.*

## 7 · Storage

Nye buckets og storage-policies følger **samme ejer- og rolletænkning som databasen**.

**Ingen kundestorage må være offentlig ved default.** En bucket oprettes lukket og åbnes kun for en dokumenteret grund.

## 8 · Pre-deploy security gate

Før hver deploy: rører ændringen noget af dette?

☐ nye tabeller eller kolonner med ejerdata ☐ RLS eller policies ☐ `auth` eller `app_metadata` ☐ Edge Functions ☐ service-role ☐ storage ☐ signup eller invitation ☐ API- eller AI-forbrug

**Ét kryds = den relevante sikkerhedstest skal være defineret FØR deploy.** Ikke bagefter, ikke „vi tjekker det i morgen".

## 9 · Regressionstest

### STATUS: IKKE IMPLEMENTERET ENDNU

**Der findes ikke noget automatisk regressionstestsæt. Intet i repoet beskytter mod fejltyperne nedenfor af sig selv.** Læser du denne kontrakt og tror, at tests fanger dem — det gør de ikke.

Et fast testsæt **skal** kunne fange dagens fejltyper igen: anonym adgang til kundedata · kunde A → kunde B · ikke-admin → admin-data · åbne policies · usikre Edge Functions · storage-adgang.

**Bilaget nedenfor er startspecifikationen — et testfrø, ikke et aktivt testsæt.** Det dækker de fire første og skal køres i hånden, indtil noget kører det automatisk.

## 10 · Ingen påstand uden bevis

Hvert sikkerhedsudsagn mærkes:

| | |
|---|---|
| **MÅLT** | kørt og aflæst |
| **INFERERET** | logisk sluttet, ikke målt |
| **IKKE MÅLT** | ikke undersøgt |

**Ingen ændring kaldes færdig, fordi koden ser rigtig ud.** En fejlbesked er heller ikke bevis for, at intet skete — den 8. august sagde Supabase „Failed to fetch", og migreringen var kørt alligevel. **Mål databasen.**

Og et instrument, der tier, beviser ingenting, før det selv er bevist virksomt.

---

# Bilag · sweepet

**Denne kører efter hver adgangsændring.** Den tæller policies i hele skemaet — ikke rækker, og ikke en liste, nogen har skrevet i hånden. Det var netop det, der lod tomme tabeller og oversete tabeller slippe igennem tre gange den 8.–9. august.

```sql
select maal, antal, hvor from (
select 1 as s, 'skrivende policies for anon eller public'::text as maal,
       (select count(*)::text from pg_policies where schemaname='public'
         and cmd in ('ALL','INSERT','UPDATE','DELETE')
         and ('anon' = any (roles) or 'public' = any (roles))) as antal,
       coalesce((select string_agg(distinct tablename || ' - ' || policyname, '  |  ')
                   from pg_policies where schemaname='public'
                    and cmd in ('ALL','INSERT','UPDATE','DELETE')
                    and ('anon' = any (roles) or 'public' = any (roles))), '(ingen)') as hvor
union all
select 2, 'skrivende policies med using/with_check = true',
       (select count(*)::text from pg_policies where schemaname='public'
         and cmd in ('ALL','INSERT','UPDATE','DELETE')
         and lower(regexp_replace(coalesce(qual, with_check, ''), '\s+','','g')) = 'true'),
       coalesce((select string_agg(distinct tablename || ' - ' || policyname, '  |  ')
                   from pg_policies where schemaname='public'
                    and cmd in ('ALL','INSERT','UPDATE','DELETE')
                    and lower(regexp_replace(coalesce(qual, with_check, ''), '\s+','','g')) = 'true'), '(ingen)')
union all
select 3, 'tabeller UDEN RLS',
       (select count(*)::text from pg_class c join pg_namespace n on n.oid=c.relnamespace
         where n.nspname='public' and c.relkind='r' and not c.relrowsecurity),
       coalesce((select string_agg(c.relname, ', ') from pg_class c join pg_namespace n on n.oid=c.relnamespace
                  where n.nspname='public' and c.relkind='r' and not c.relrowsecurity), '(ingen)')
union all
select 4, 'tabeller med RLS men NUL policies',
       (select count(*)::text from pg_class c join pg_namespace n on n.oid=c.relnamespace
         where n.nspname='public' and c.relkind='r' and c.relrowsecurity
           and not exists (select 1 from pg_policies p where p.schemaname='public' and p.tablename=c.relname)),
       coalesce((select string_agg(c.relname, ', ') from pg_class c join pg_namespace n on n.oid=c.relnamespace
                  where n.nspname='public' and c.relkind='r' and c.relrowsecurity
                    and not exists (select 1 from pg_policies p where p.schemaname='public' and p.tablename=c.relname)), '(ingen)')
union all
select 5, 'laesende policies for anon eller public',
       (select count(*)::text from pg_policies where schemaname='public'
         and cmd in ('ALL','SELECT') and ('anon' = any (roles) or 'public' = any (roles))),
       coalesce((select string_agg(distinct tablename, ', ') from pg_policies where schemaname='public'
                  and cmd in ('ALL','SELECT') and ('anon' = any (roles) or 'public' = any (roles))), '(ingen)')
) x order by x.s;
```

**Forventet:** linje 1–4 skal være **0**. Linje 5 er **6 tabeller** — kursusstrukturen.

> **Denne baseline er en bevidst nuværende undtagelse og skal ændres, hvis kursusstrukturens adgangsbeslutning ændres.** De seks er `lektioner`, `moduler`, `produkter`, `produkt_lektioner`, `lektion_oevelser`, `lektion_register`, åbne for læsning efter Idas beslutning 9. august 2026.

**Enhver anden tabel på linje 5 er et fund.**

---

# KENDTE EKSISTERENDE KONTRAKTBRUD

Kontrakten beskriver den **ønskede standard**. Afvigelser, der fandtes, før den blev låst, registreres her og skal arbejdes væk. **De svækker ikke reglerne, og de må aldrig bruges som præcedens.**

## `mailchimp-webhook` — bryder regel 3 og 4

| | |
|---|---|
| Verify JWT | **OFF** |
| Egen request-verifikation eller adgangskontrol | **ingen** |
| Service-role | **ja** |
| Kan skrive til | `tilmeldinger` |
| Opstået | **før kontrakten blev låst** (deployet ca. 8. juli 2026) |
| **Status** | **ÅBEN** |
| Skal løses | **før kundeonboarding** |
| Præcedens | **må IKKE bruges som forbillede for nye funktioner** |

Afgrænsningen er målt: ét `insert` i én tabel med tre felter, ingen læseadgang, og visningen i appen escaper indholdet. Konsekvensen er uvedkommende data i workspacet, ikke et datalæk. **Det gør den ikke acceptabel — kun afgrænset.**
