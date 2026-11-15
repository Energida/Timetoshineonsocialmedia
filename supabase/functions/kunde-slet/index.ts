// @ts-nocheck
// KUNDE-SLET · Edge Function "kunde-slet"
//
// Ida 15/11: »hvis jeg sletter en kunde i crm … så skal denne kundes data fjernes alle steder fra!« + »du tager det, slet alt også
// sikkerhedskopier og teamet« (bud MN4jHE5dTYAWkp6T2Vg4aj godkendt). CRM › kundekortet › »Slet kunden og alle data«.
// { kode, handling: "taelling" } tæller uden at slette. { kode, handling: "slet" } sletter først kundens filer i storage og
// derefter ALT i databasen i én transaktion (databasefunktionen kunde_data, kaldt SOM kalderen).
//
// Deploy: npx supabase@latest functions deploy kunde-slet --project-ref eikcvvppuphnananxcvp --use-api   (Verify JWT TIL)
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: TIL.
//   2. Hvem må kalde den: kun administratorer.
//   3. Egen authorization: ja — kalderens token → getUser + er_admin() som kalderen, ellers 403. Databasefunktionen kunde_data
//      tjekker er_admin() igen, nægter Idas egne koder (ENERGIDA, IDAENERGIDA, IDA2026) og enhver kode med et administrator-login.
//   4. Service-role: JA, men KUN til at slette de filer i storage, som kunde_data (kaldt som kalderen) har listet for netop denne kode.
//      Alt i databasen slettes af kunde_data som kalderen.
//   5. Når: storage (brief-filer, lektion-filer, hc-billeder: mapper pr. login på koden · inspiration: mappen med koden) og via
//      kunde_data: alle public-tabeller med kolonnen kode, virksomhed_id (kun hvis ingen anden kode bruger virksomheden) og teamets
//      mailadresser i contacts, mail_log og tilmeldinger; kunden på Idas lister kunde_koder og kunde_pins; logins i auth.users.
//      mail_afmeldt røres ikke (stoplisten).
//   6. Direkte omkostning: nej.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } }); }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);
  const jwt = String(req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: "Bearer " + jwt } } });
  const { data: bruger, error: bf } = await db.auth.getUser(jwt);
  if (bf || !bruger?.user) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const { data: erAdmin, error: af } = await db.rpc("er_admin");
  if (af) return svar({ fejl: "Kunne ikke slå din adgang op." }, 401);
  if (erAdmin !== true) return svar({ fejl: "Kun administratorer kan slette kunder." }, 403);

  let krop: { kode?: string; handling?: string } = {};
  try { krop = await req.json(); } catch (_e) { return svar({ fejl: "Kaldet manglede." }, 400); }
  const kode = String(krop.kode || "").trim().toUpperCase();
  if (!/^[A-Z0-9_-]{4,40}$/.test(kode)) return svar({ fejl: "Ugyldig kode." }, 400);
  if (krop.handling !== "taelling" && krop.handling !== "slet") return svar({ fejl: "Ukendt handling." }, 400);

  /* tælling (og listen over filer) — altid som kalderen */
  const { data: t, error: tf } = await db.rpc("kunde_data", { p_kode: kode, p_slet: false });
  if (tf) return svar({ fejl: String(tf.message || "Kunne ikke tælle.") }, 400);
  if (krop.handling === "taelling") return svar({ ok: true, ...t, filliste: undefined }, 200);

  /* 1) filerne først — stopper her, hvis noget går galt, så intet i databasen er slettet */
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const filer: { b: string; n: string }[] = Array.isArray(t?.filliste) ? t.filliste : [];
  const pr: Record<string, string[]> = {};
  for (const f of filer) { if (f && f.b && f.n) (pr[f.b] = pr[f.b] || []).push(f.n); }
  let filerSlettet = 0;
  for (const b of Object.keys(pr)) {
    for (let i = 0; i < pr[b].length; i += 100) {
      const del = pr[b].slice(i, i + 100);
      const { data, error } = await admin.storage.from(b).remove(del);
      if (error) return svar({ fejl: "Filerne kunne ikke slettes (" + b + "): " + error.message + ". Intet i databasen er slettet." }, 500);
      filerSlettet += (data || []).length;
    }
  }

  /* 2) alt i databasen i én transaktion — som kalderen */
  const { data: s, error: sf } = await db.rpc("kunde_data", { p_kode: kode, p_slet: true });
  if (sf) return svar({ fejl: "Databasen kunne ikke slettes: " + String(sf.message || "") + (filerSlettet ? " (" + filerSlettet + " filer er allerede slettet)" : "") }, 500);
  return svar({ ok: true, kode, antal: { ...(s?.antal || {}), filer: filerSlettet } }, 200);
});
