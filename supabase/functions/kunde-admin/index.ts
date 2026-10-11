// KUNDE-ADMIN · Edge Function "kunde-admin"
//
// Ida 11/10: »det SKAL fungere sådan. jeg vil ikke have at jeg skal ind i supabase og arbejde. det samme gælder
// sletningen og andre ændringer af kunder - der vil jeg kunne gøre det fra mit crm«.
// Retter Ida kundens mail i CRM'et, skifter login-mailen med (efter ét spørgsmål). Sletter hun kunden, slettes
// kundens logins med. Hun kommer aldrig ind i Supabase.
//
// Deploy (Claude, efter Idas »npx supabase@latest login«):
//   npx supabase@latest functions deploy kunde-admin --project-ref eikcvvppuphnananxcvp
//   Verify JWT: TIL (standard — der må IKKE stå --no-verify-jwt).
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: TIL.
//   2. Hvem må kalde den: kun administratorer (er_admin() spurgt SOM kalderen, §4 — mønsteret fra opret-workout-bruger).
//   3. Egen authorization: ja — kalderens token slås op (getUser), er_admin() skal svare true; målet skal være et
//      KUNDE-login (app_metadata.kode = den kode, kaldet nævner), aldrig kalderen selv.
//   4. Service-role: ja, kun efter at 1–3 er bestået.
//   5. Når: auth.users (læse liste, skifte e-mail, slette login). Ingen tabeller i public.
//   6. Direkte omkostning: nej.
//
// §6 (signup/invitation må aldrig ændre credentials): dette er ikke en signup- eller invitationsfunktion. Den rører
// ALDRIG en adgangskode — der findes ingen sti gennem filen, der sender »password« til Supabase. E-mail skiftes kun
// af en administrator, kun på en kundes login, og kun hvis den nye e-mail ikke allerede har et login.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
function svar(x: unknown, status: number) {
  return new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
const MAIL_RX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // 1) HVEM RINGER?
  const jwt = String(req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const { data: kalder, error: kalderFejl } = await admin.auth.getUser(jwt);
  if (kalderFejl || !kalder?.user) return svar({ fejl: "Dit login kunne ikke bekræftes." }, 401);

  // 2) ER KALDEREN ADMINISTRATOR? — spurgt SOM kalderen (er_admin læser auth.uid()).
  const somKalder = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: "Bearer " + jwt } } });
  const { data: erAdmin, error: adminFejl } = await somKalder.rpc("er_admin");
  if (adminFejl) return svar({ fejl: "Kunne ikke slå din adgang op: " + adminFejl.message }, 500);
  if (erAdmin !== true) return svar({ fejl: "Kun administratorer kan ændre kunders logins." }, 403);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return svar({ fejl: "Ugyldigt kald." }, 400); }
  const handling = String(body.handling ?? "");
  const kode = String(body.kode ?? "").trim().toUpperCase();
  if (!kode) return svar({ fejl: "Kaldet mangler kundens kode." }, 400);

  // Alle logins (sidevis) — så vi kan finde kundens og tjekke, om en e-mail er brugt.
  const alle: Array<Record<string, any>> = [];
  for (let side = 1; side <= 50; side++) {
    const { data, error } = await admin.auth.admin.listUsers({ page: side, perPage: 200 });
    if (error) return svar({ fejl: "Kunne ikke hente logins — prøv igen." }, 500);
    const b = data?.users ?? [];
    alle.push(...(b as Array<Record<string, any>>));
    if (b.length < 200) break;
  }
  const kodeAf = (u: Record<string, any>) => String((u.app_metadata ?? {}).kode ?? "").toUpperCase();
  const kundens = alle.filter((u) => kodeAf(u) === kode && u.id !== kalder.user.id);
  const vis = (u: Record<string, any>) => ({ id: u.id, email: u.email ?? "", navn: (u.user_metadata ?? {}).navn ?? "", sidst_inde: u.last_sign_in_at ?? null });

  if (handling === "logins") return svar({ ok: true, logins: kundens.map(vis) }, 200);

  if (handling === "skift_mail") {
    const gammel = String(body.gammel ?? "").trim().toLowerCase();
    const ny = String(body.ny ?? "").trim().toLowerCase();
    if (!MAIL_RX.test(ny)) return svar({ fejl: "Skriv en gyldig e-mail." }, 400);
    const maal = kundens.find((u) => String(u.email ?? "").toLowerCase() === gammel);
    if (!maal) return svar({ ok: true, ingen: true, besked: "Ingen login på den gamle mail hos kunden — kun kontaktmailen er rettet." }, 200);
    if (alle.some((u) => String(u.email ?? "").toLowerCase() === ny)) return svar({ fejl: "Den nye mail har allerede et login. Login-mailen er ikke ændret." }, 409);
    // KUN e-mail. Aldrig password (§6).
    const { error } = await admin.auth.admin.updateUserById(maal.id, { email: ny, email_confirm: true });
    if (error) return svar({ fejl: "Login-mailen kunne ikke skiftes: " + error.message }, 500);
    return svar({ ok: true, skiftet: true, email: ny }, 200);
  }

  if (handling === "slet_logins") {
    let slettet = 0; const fejl: string[] = [];
    for (const u of kundens) {
      const { error } = await admin.auth.admin.deleteUser(u.id);
      if (error) fejl.push(String(u.email ?? u.id) + ": " + error.message); else slettet++;
    }
    if (fejl.length) return svar({ fejl: "Nogle logins kunne ikke slettes: " + fejl.join(" · "), slettet }, 500);
    return svar({ ok: true, slettet }, 200);
  }

  return svar({ fejl: "Ukendt handling." }, 400);
});
