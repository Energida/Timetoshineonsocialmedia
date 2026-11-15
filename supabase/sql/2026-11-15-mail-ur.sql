-- MAILENS UR (Ida 15/11, klik »Ja, også uret nu«): egne mails kan planlægges til en dag og et klokkeslæt.
-- Kan køres igen uden skade. Intet eksisterende slettes eller ændres.

-- 1) Tabellen med planlagte mails. Kun administratorer kan se og skrive (RLS, ingen adgang for anon eller kunder).
create table if not exists public.mail_planlagt (
  id          uuid primary key default gen_random_uuid(),
  mail_id     text not null check (char_length(mail_id) between 1 and 80),
  emne        text not null check (char_length(emne) between 1 and 200),
  html        text not null check (char_length(html) <= 200000),
  fra         text not null default 'Energida',
  kontakter   uuid[] not null default '{}',
  send_kl     timestamptz not null,
  status      text not null default 'venter' check (status in ('venter','sender','sendt','fejl','annulleret')),
  resultat    jsonb,
  oprettet_af uuid default auth.uid(),
  created_at  timestamptz not null default now(),
  sendt_kl    timestamptz
);
alter table public.mail_planlagt enable row level security;
revoke all on public.mail_planlagt from anon;
drop policy if exists mail_planlagt_admin on public.mail_planlagt;
create policy mail_planlagt_admin on public.mail_planlagt for all to authenticated using (public.er_admin()) with check (public.er_admin());
create index if not exists mail_planlagt_venter on public.mail_planlagt (send_kl) where status = 'venter';

-- 2) Databasens ur og webkald.
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 3) Hvert 5. minut: kald mail-ur, men KUN når en planlagt mail er klar. Nøglen hentes fra Vault (»mail_ur_noegle«, Ida lægger den selv ind).
select cron.unschedule('mail-ur') where exists (select 1 from cron.job where jobname = 'mail-ur');
select cron.schedule('mail-ur', '*/5 * * * *', $job$
  select net.http_post(
    url := 'https://eikcvvppuphnananxcvp.supabase.co/functions/v1/mail-ur',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'mail_ur_noegle' limit 1)),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  )
  where exists (select 1 from public.mail_planlagt where status = 'venter' and send_kl <= now())
    and exists (select 1 from vault.decrypted_secrets where name = 'mail_ur_noegle');
$job$);

-- Kontrol
select
  (select relrowsecurity from pg_class where oid = 'public.mail_planlagt'::regclass) as rls_til,
  (select count(*) from pg_policies where schemaname = 'public' and tablename = 'mail_planlagt') as politikker,
  (select count(*) from pg_policies where schemaname = 'public' and tablename = 'mail_planlagt' and ('anon' = any(roles) or 'public' = any(roles))) as aabne_politikker,
  (select count(*) from cron.job where jobname = 'mail-ur') as ur_job;
