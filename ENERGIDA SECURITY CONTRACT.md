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

Et brud stemples først som **LUKKET**, når lukningen er **MÅLT** — ikke når koden ser rigtig ud (regel 10).

---

## `mailchimp-webhook` — brød regel 3 og 4 · **LUKKET 21. august 2026**

| | |
|---|---|
| Verify JWT | **OFF** — uændret, og det er med vilje: funktionen kaldes af Mailchimp, ikke af en indlogget bruger |
| Egen request-verifikation | **JA** — `MAILCHIMP_WEBHOOK_TOKEN` tjekkes som det ALLERFØRSTE; databasen røres først bagefter |
| Service-role | ja — men først **efter** verificeret hemmelighed |
| Kan skrive til | `tilmeldinger` |
| Opstået | før kontrakten blev låst (deployet ca. 8. juli 2026) |
| **Status** | **LUKKET 21/8-2026** |

**MÅLT udefra med `curl` mod den live funktion 21/8** — ikke udledt af koden:

| Kald | Svar |
|---|---|
| `GET` uden hemmelighed | **401** |
| `POST` m. `type=subscribe` uden hemmelighed | **401** |
| `GET` **med** hemmelighed | **200** |
| `POST` **med** hemmelighed | **200** |

**Baseline MÅLT 20/8, før lukningen:** de samme to kald uden hemmelighed svarede begge **200** — enhver på internettet kunne skrive rækker i `tilmeldinger`.

Kontraktens krav *"skal løses før kundeonboarding"* er dermed indfriet.
Fuldt bevis: `../BEVIS - mailchimp-hullet lukket (21. august).md`.

---

## Maskinrummets seks borde — brød regel 1 · **LUKKET 24. august 2026**

`mr_rum` · `mr_byggekoe` · `mr_pins` · `mr_projekter` · `mr_projekt_ting` · `mr_rum_noter`

| | |
|---|---|
| Hvad der var galt | hvert bord havde **præcis én regel: `ALL for authenticated` uden betingelse** — enhver med et login, også en workout- eller forløbskunde, måtte læse, skrive og slette i Idas backstage-data |
| Bryder | **regel 1 (default deny)** — en regel uden betingelse for alle indloggede er samme fejltype som `using (true)` |
| Opstået | før kontrakten blev låst |
| Fundet | **MÅLT 22/8** i Idas egen SQL-udskrift |
| **Status** | **LUKKET 24/8-2026** |

**Hvad der blev gjort:** de gamle regler ryddet, **RLS slået til** på hvert bord — *en tabel uden RLS er åben, uanset hvor gode policies den har* — og præcis én regel oprettet pr. bord, alt i **én transaktion**. Ingen data blev rørt, kun hvem der må se dem:

```sql
create policy "kun administrator" on public.<bord>
  for all to authenticated
  using (er_admin()) with check (er_admin());
```

**MÅLT EFTER — strukturen (Idas SQL-udskrift 24/8):** alle seks borde har `rls_til = JA`, `antal_regler = 1`, `kun administrator: ALL for authenticated -> er_admin()`.

**MÅLT EFTER — rollerne (kontraktens regel 5 kræver fire — alle fire er nu målt):**

| Rolle | Status |
|---|---|
| **anonym** | ✅ **MÅLT** — `GET` gav 200 med nul rækker; `POST` gav `401 · 42501 "new row violates row-level security policy"` |
| **admin (Ida)** | ✅ **MÅLT** — så sine 27 rum efter stramningen |
| **kunde A** (`test@energida.dk`) | ✅ **MÅLT** — `select` på `mr_rum` gav **0 rum**, og konsollen viste 403 fra basen (afvisning, ikke tomt bord) |
| **kunde B — krydsadgang** | ✅ **MÅLT 24/8** — 0 rum, 0 noter, skrivning `AFVIST (42501)`. Kontrollinjen med admin-mærke gav **27 rum**, så måleren nåede beviseligt frem til bordene |

> **To fælder, der hver kostede en runde — og som er værd at huske:**
> `er_admin()` læser `app_metadata ->> 'rolle'` på **dansk**. Det første målekort spurgte efter engelsk `role` og svarede "(ingen)" hos alle tolv konti. Havde nogen troet på det, ville konklusionen have været, at ingen er administrator — og stramningen var aldrig blevet lavet.
> Den første skrivetest gav `400 invalid input syntax for type uuid`. Det er et **formatfejl**, ikke adgangskontrol, og beviste ingenting. **En fejlbesked er ikke bevis for, at noget blev afvist af den rigtige grund.**

Fuldt bevis: `../BEVIS - maskinrummet lukket (24. august).md`.

### Et fund, rolletesten gav i tilgift — ikke et databasehul

Testkontoen fik **0 rum fra databasen**, men skærmen viste stadig alle 27. Rummene stod i **appens egen hukommelse** fra den forrige session: `doLogout()` kaldte kun `signOut()` og ryddede intet.

**RLS holdt hele vejen** — men en kunde, der loggede ind på samme computer efter Ida, kunne se Idas rum, noter, kunder og idéer på skærmen. **Rettet i v1215** med `nulstilBrugerCache()`, kaldt ved logout, ved login (*før* den nye bruger slippes ind) og på `onAuthStateChange` som sidste net. **MÅLT:** femten lister fyldt, alle tomme efter kaldet.

**Lære til fremtidige lukninger:** rolletesten i regel 5 er ikke kun en kontrol af databasen. Den fandt her et hul, som ingen ledte efter, og som ingen SQL-udskrift ville have vist.

---

## Om stemplerne ovenfor

De to stempler er sat **24. august 2026 af app-tråden** — ikke af en sikkerhedstråd. Den rolle stammer fra deploylåsen 7. august og eksisterer ikke som en selvstændig samtale; kontrakten stod derfor med to brud markeret **ÅBEN**, som begge var lukket og bevist.

**MÅLT før ændringen:** filen er skrivbar (`-rw-r--r--`), og den står **ikke** på deploylåsens liste over spærrede filer (`index.html`, `version.txt`, `_headers`, `manifest.webmanifest`, `sw.js`, `.claude/launch.json`). Formuleringen *"skrivebeskyttet for app-tråden"* i de to bevisdokumenter var en antagelse, der blev skrevet videre fra overlevering til overlevering — ikke en målt spærring.

**Kontraktens ti regler er uændrede.** Kun dette afsnit er rørt.
