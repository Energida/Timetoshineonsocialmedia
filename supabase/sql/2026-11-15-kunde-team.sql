-- KUNDENS TEAM FRA DE RIGTIGE LOGINS (Ida 15/11: »lav et sindssygt tjek på at alt synkroniseres«).
-- Målt: kundens side byggede teamet af navne i appens aktivitetslog (skema_svar), så Hinges Hus stod med 4 personer
-- (»Rene« og »René« talt som to) selv om koden har 3 logins. Denne funktion giver kun administratorer listen over
-- logins på én kode: navn, mail, sidst logget ind og oprettet. Ingen adgangskoder, ingen tokens, intet andet.
-- Kan køres igen uden skade.
create or replace function public.kunde_team(p_kode text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare k text := upper(trim(coalesce(p_kode, '')));
begin
  if not public.er_admin() then raise exception 'Kun administratorer.' using errcode = '42501'; end if;
  if length(k) < 2 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'email', u.email,
      'navn', coalesce(nullif(trim(u.raw_user_meta_data->>'navn'), ''), nullif(trim(u.raw_user_meta_data->>'hilsen'), ''), ''),
      'sidst', u.last_sign_in_at,
      'oprettet', u.created_at) order by u.created_at)
    from auth.users u where upper(u.raw_app_meta_data->>'kode') = k), '[]'::jsonb);
end;
$$;
revoke all on function public.kunde_team(text) from public, anon;
grant execute on function public.kunde_team(text) to authenticated;
