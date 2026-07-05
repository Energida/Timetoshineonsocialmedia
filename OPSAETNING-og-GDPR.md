# Opsætning af database + GDPR-tjekliste

## Del 1 — Sådan kobler du databasen på (ca. 15 min)

1. **Opret konto** på [supabase.com](https://supabase.com) → "New project".
   - **Vælg region: EU (Frankfurt)** ← vigtigt for GDPR.
   - Vælg en database-adgangskode (gem den et sikkert sted).
2. **Opret tabellen**: gå til **SQL Editor → New query**, indsæt hele indholdet af
   [`supabase-setup.sql`](supabase-setup.sql) og tryk **Run**.
3. **Opret dit eget login**: **Authentication → Users → Add user** → skriv din
   e-mail + en adgangskode. Det er det login, du bruger til dashboardet.
4. **Hent dine nøgler**: **Project Settings → API**. Kopiér:
   - *Project URL* (fx `https://xxxx.supabase.co`)
   - *anon public* nøglen
5. **Sæt dem ind i appen**: åbn `index.html`, find de to linjer øverst og udfyld:
   ```js
   window.SUPABASE_URL = "https://xxxx.supabase.co";
   window.SUPABASE_ANON_KEY = "eyJhbGciOi...";
   ```
6. **Færdig.** Nu gemmes alle profiler i databasen. På `#admin` bliver du bedt om at
   logge ind, og kun du kan se kunderne — fra hvilken som helst enhed.

> Indtil felterne er udfyldt, kører appen videre på browserens localStorage (prototype),
> så du kan altid teste uden database.

### Godt at vide om sikkerhed
- `anon public`-nøglen **må** ligge i koden — den giver kun lov til at *oprette* en profil,
  ikke at læse andres. Læsning/redigering kræver dit login.
- Mulig fremtidig hærdning: spam-beskyttelse (fx Cloudflare Turnstile) på oprettelse,
  og at flytte AI-kaldet til en server-funktion så API-nøglen ikke tastes i browseren.

---

## Del 2 — GDPR-tjekliste

Koden er bygget **GDPR-klar** (EU-hosting, adgangsstyring, sletning, dataminimering).
Fuld compliance kræver også disse handlinger fra dig som **dataansvarlig**:

- [ ] **Databehandleraftale (DPA)** underskrevet med:
  - [ ] Supabase (findes under deres Legal/DPA — kan accepteres online)
  - [ ] Anthropic (AI-strategien sendes til deres API)
  - [ ] Crisp (chat-widgeten i appen)
- [ ] **Databehandling i EU**: bekræft at Supabase-projektet er oprettet i EU-region.
- [ ] **Privatlivspolitik** tilgængelig i appen (hvad gemmes, hvorfor, hvor længe, rettigheder).
- [ ] **Samtykke** før en profil indsendes (afkrydsningsfelt + link til privatlivspolitik).
- [ ] **Cookie-samtykke** for Crisp-chatten (den sætter cookies).
- [ ] **Oplys om AI**: fortæl brugeren at input sendes til en AI-tjeneste (Anthropic, USA) —
  overførsel til tredjeland kræver retligt grundlag (SCC / Data Privacy Framework).
- [ ] **Dataminimering**: undlad at bede om mere personinfo end nødvendigt. Bed brugere om
  *ikke* at skrive følsomme personoplysninger i fritekst-felterne.
- [ ] **Rettigheder**: du kan allerede slette en profil (Slet-knappen). Hav en proces for
  indsigts- og sletteanmodninger.
- [ ] **Opbevaringsperiode**: beslut hvor længe profiler gemmes, og slet ældre data.

> ⚠️ Dette er praktisk vejledning, ikke juridisk rådgivning. Ved tvivl — især om DPA'er og
> tredjelandsoverførsler — så få det tjekket af en med GDPR-forstand. Datatilsynet (datatilsynet.dk)
> har gode vejledninger.
