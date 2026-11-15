-- SLET KUNDEN OG ALLE DATA (Ida 15/11: »hvis jeg sletter en kunde i crm … så skal denne kundes data fjernes alle steder fra!«
--   + »du tager det, slet alt også sikkerhedskopier og teamet«; bud MN4jHE5dTYAWkp6T2Vg4aj godkendt).
-- Én databasefunktion, der enten TÆLLER (p_slet = false) eller SLETTER (p_slet = true) alt om én kundekode i én transaktion.
-- Kun administratorer (er_admin() som kalderen). Kan aldrig ramme Idas egne koder eller en kode, hvor et login er administrator.
-- Afmeldinger (mail_afmeldt) bliver stående — kun mailadressen på stoplisten (anbefalet; Idas eget valg kan ændre det).
-- Filer i storage slettes IKKE her: funktionen returnerer listen, og Edge Function kunde-slet sletter dem via storage-API'et FØR p_slet = true.
-- Kan køres igen uden skade.

create or replace function public.kunde_data(p_kode text, p_slet boolean default false)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  k text := upper(trim(coalesce(p_kode, '')));
  vid uuid;
  uids uuid[];
  mails text[];
  r record;
  n bigint;
  ud jsonb := '{}'::jsonb;
  filer jsonb;
begin
  if not public.er_admin() then raise exception 'Kun administratorer.' using errcode = '42501'; end if;
  if length(k) < 4 then raise exception 'Ugyldig kode.'; end if;
  if k in ('ENERGIDA', 'IDAENERGIDA', 'IDA2026') then raise exception 'Idas egne koder kan ikke slettes.'; end if;
  if exists (select 1 from auth.users u where upper(u.raw_app_meta_data->>'kode') = k and u.raw_app_meta_data->>'rolle' = 'admin') then
    raise exception 'Koden har et administrator-login og kan ikke slettes.';
  end if;

  select v.virksomhed_id into vid from public.virksomhedskoder v where upper(v.kode) = k limit 1;
  select coalesce(array_agg(u.id), '{}'), coalesce(array_agg(lower(u.email)) filter (where u.email is not null), '{}')
    into uids, mails from auth.users u where upper(u.raw_app_meta_data->>'kode') = k;

  -- 1) alle tabeller med kolonnen kode (også sikkerhedskopierne kopi_* og backup_*)
  for r in select c.table_name from information_schema.columns c join information_schema.tables t on t.table_schema = c.table_schema and t.table_name = c.table_name
           where c.table_schema = 'public' and c.column_name = 'kode' and t.table_type = 'BASE TABLE' order by c.table_name loop
    if p_slet then execute format('delete from public.%I where upper(kode) = $1', r.table_name) using k; get diagnostics n = row_count;
    else execute format('select count(*) from public.%I where upper(kode) = $1', r.table_name) into n using k; end if;
    if n > 0 then ud := ud || jsonb_build_object(r.table_name, n); end if;
  end loop;

  -- 2) alle tabeller med virksomhed_id (kun hvis ingen anden kode bruger virksomheden)
  if vid is not null and not exists (select 1 from public.virksomhedskoder v where v.virksomhed_id = vid and upper(v.kode) <> k) then
    for r in select c.table_name from information_schema.columns c join information_schema.tables t on t.table_schema = c.table_schema and t.table_name = c.table_name
             where c.table_schema = 'public' and c.column_name = 'virksomhed_id' and t.table_type = 'BASE TABLE' and c.table_name <> 'virksomhedskoder' loop
      if p_slet then execute format('delete from public.%I where virksomhed_id = $1', r.table_name) using vid; get diagnostics n = row_count;
      else execute format('select count(*) from public.%I where virksomhed_id = $1', r.table_name) into n using vid; end if;
      if n > 0 then ud := ud || jsonb_build_object(r.table_name || ' (virksomhed)', n); end if;
    end loop;
    if p_slet then delete from public.virksomheder where id = vid; get diagnostics n = row_count;
    else select count(*) into n from public.virksomheder where id = vid; end if;
    if n > 0 then ud := ud || jsonb_build_object('virksomheder', n); end if;
  end if;

  -- 3) det, der er gemt under teamets mailadresser (kontaktkort, mail-log, tilmeldinger). mail_afmeldt bliver stående.
  if array_length(mails, 1) > 0 then
    if p_slet then delete from public.contacts where lower(email) = any(mails); get diagnostics n = row_count; else select count(*) into n from public.contacts where lower(email) = any(mails); end if;
    if n > 0 then ud := ud || jsonb_build_object('contacts', n); end if;
    if p_slet then delete from public.mail_log where lower(email) = any(mails); get diagnostics n = row_count; else select count(*) into n from public.mail_log where lower(email) = any(mails); end if;
    if n > 0 then ud := ud || jsonb_build_object('mail_log', n); end if;
    if p_slet then delete from public.tilmeldinger where lower(email) = any(mails); get diagnostics n = row_count; else select count(*) into n from public.tilmeldinger where lower(email) = any(mails); end if;
    if n > 0 then ud := ud || jsonb_build_object('tilmeldinger', n); end if;
  end if;

  -- 4) kunden på Idas egne lister: kundelisten (kunde_koder) og nålene (kunde_pins)
  select count(*) into n from public.skema_svar s where s.kode = 'ENERGIDA' and ((s.skema = 'kunde_koder' and s.svar ? k) or (s.skema = 'kunde_pins' and s.svar @> to_jsonb(array[k])));
  if n > 0 then
    ud := ud || jsonb_build_object('idas lister', n);
    if p_slet then
      update public.skema_svar set svar = svar - k where kode = 'ENERGIDA' and skema = 'kunde_koder' and svar ? k;
      update public.skema_svar set svar = (select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(svar) e where e <> to_jsonb(k)) where kode = 'ENERGIDA' and skema = 'kunde_pins' and svar @> to_jsonb(array[k]);
    end if;
  end if;

  -- 5) filer (slettes af Edge Function kunde-slet før dette kald med p_slet = true; her kun listen)
  select coalesce(jsonb_agg(jsonb_build_object('b', o.bucket_id, 'n', o.name)), '[]'::jsonb) into filer from storage.objects o
   where (o.bucket_id in ('brief-filer', 'lektion-filer', 'hc-billeder') and split_part(o.name, '/', 1) = any(select x::text from unnest(uids) x))
      or (o.bucket_id = 'inspiration' and upper(split_part(o.name, '/', 1)) = k);
  ud := ud || jsonb_build_object('filer', jsonb_array_length(filer));

  -- 6) logins til sidst (workout_data følger med af sig selv, ON DELETE CASCADE)
  if array_length(uids, 1) > 0 then
    select count(*) into n from public.workout_data w where w.bruger = any(uids);
    if n > 0 then ud := ud || jsonb_build_object('workout_data', n); end if;
    if p_slet then delete from auth.users where id = any(uids); get diagnostics n = row_count; else n := array_length(uids, 1); end if;
    ud := ud || jsonb_build_object('logins', n);
  end if;

  return jsonb_build_object('kode', k, 'slettet', p_slet, 'antal', ud, 'team', (select coalesce(jsonb_agg(jsonb_build_object('email', u.email, 'navn', coalesce(u.raw_user_meta_data->>'navn', u.raw_user_meta_data->>'hilsen', ''))), '[]'::jsonb) from auth.users u where u.id = any(uids)), 'filliste', filer);
end;
$$;

revoke all on function public.kunde_data(text, boolean) from public, anon;
grant execute on function public.kunde_data(text, boolean) to authenticated;
