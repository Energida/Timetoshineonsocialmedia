// MAIL-AFMELD · Edge Function "mail-afmeld"
//
// Afmeldingen fra mails sendt med mail-udsend (Ida 23/10: »Sendes + står på kortet«). Hver mail har et personligt link til
// b2b.energida.dk/afmeld.html?e=…&t=…; siden kalder denne funktion med POST. Mailprogrammernes »Afmeld«-knap
// (List-Unsubscribe-Post, ét klik) kalder den direkte.
//
// Deploy: Claude via Supabase Management API (aldrig CLI). Verify JWT: FRA — se linje 1.
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: FRA — dokumenteret undtagelse: den, der afmelder sig, har intet login (en lead, en gammel kunde).
//      I stedet bevises hvert kald med en underskrift (HMAC af e-mailen), som kun mail-udsend kan lave.
//   2. Hvem må kalde den: alle — men kun med en gyldig underskrift for præcis den e-mail.
//   3. Egen authorization: ja — underskriften tjekkes som det ALLERFØRSTE; databasen røres først bagefter (mønsteret
//      fra mailchimp-webhook). Forkert/manglende underskrift = 401, intet skrevet.
//   4. Service-role: ja, kun efter gyldig underskrift, kun til at skrive én række i mail_afmeldt.
//   5. Når: mail_afmeldt (indsætte e-mailen; findes den, sker intet). Intet andet.
//   6. Direkte omkostning: nej.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } }); }

function fraB64url(s: string) { try { return decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))); } catch (_e) { return ""; } }
async function underskrift(email: string) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode("afmeld:" + email)));
  return Array.from(s).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}
function ens(a: string, b: string) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);
  const url = new URL(req.url);
  let e64 = url.searchParams.get("e") || "", t = url.searchParams.get("t") || "";
  if (!e64 || !t) { try { const j = await req.json(); e64 = String(j.e || ""); t = String(j.t || ""); } catch (_e) { /* ét-klik-kaldet sender form-data; parametrene står i linket */ } }
  const email = fraB64url(e64).trim().toLowerCase();
  /* UNDERSKRIFTEN FØRST — databasen røres ikke uden den */
  if (!email || !/^[0-9a-f]{32}$/.test(t) || !ens(await underskrift(email), t)) return svar({ fejl: "Linket kunne ikke bekræftes." }, 401);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await db.from("mail_afmeldt").upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
  if (error) return svar({ fejl: "Afmeldingen kunne ikke gemmes. Prøv igen." }, 500);
  return svar({ ok: true }, 200);
});
