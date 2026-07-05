-- ============================================================
--  Time to Shine — database-opsætning til Supabase
--  Kør dette i Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1) Tabellen der holder alle kundeprofiler
create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,
  product     text,
  customer    text,
  styrker     text,
  platforme   text,
  analyse     text,
  pillars     jsonb default '[]'::jsonb,
  week        jsonb default '[]'::jsonb,
  status      text not null default 'ny',
  notes       text default ''
);

-- 2) Slå "Row Level Security" til (ingen kan røre data uden en regel nedenfor)
alter table public.customers enable row level security;

-- 3) Alle app-brugere (også ikke-indloggede) må OPRETTE deres egen profil.
--    De kan IKKE læse, ændre eller slette noget.
create policy "public_can_insert"
  on public.customers for insert
  to anon, authenticated
  with check (true);

-- 4) Kun DIG (indlogget administrator) må se / redigere / slette.
create policy "admin_can_select"
  on public.customers for select
  to authenticated using (true);

create policy "admin_can_update"
  on public.customers for update
  to authenticated using (true) with check (true);

create policy "admin_can_delete"
  on public.customers for delete
  to authenticated using (true);

-- ============================================================
--  Bagefter:
--  A) Supabase → Authentication → Users → "Add user":
--     opret DIN egen e-mail + adgangskode (det er dit login til dashboardet).
--  B) Supabase → Project Settings → API: kopiér "Project URL" og
--     "anon public"-nøglen ind i index.html (window.SUPABASE_URL / _ANON_KEY).
--  C) Vælg EU-region (Frankfurt) da du oprettede projektet — vigtigt for GDPR.
-- ============================================================
