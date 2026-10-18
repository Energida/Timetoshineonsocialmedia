// YGT-MAILCHIMP · Edge Function "ygt-mailchimp"
//
// Ida 30/9 (klik): modul-mailene til YOU GOT THIS sendes fra Mailchimp. Ida 17/10 (klik): »Byg forbindelsen«.
// Når en YOU GOT THIS-kunde har en startdato (skema_svar config·ygt_start), kalder appen denne funktion én gang
// (ygtMailchimpMeld i index.html). Funktionen melder kundens EGEN e-mail på Idas Mailchimp-liste og sætter mærket
// »YOU GOT THIS«, som starter Idas journey (en mail hver 7. dag). Har kontakten mærket i forvejen, sker der intet.
// En kontakt, der har frameldt sig, meldes ALDRIG på igen (status_if_new — status røres kun på nye kontakter).
//
// Hemmeligheder (sættes af Ida selv — Claude skriver aldrig nøgler):
//   MAILCHIMP_API_KEY  — fx abc123…-us21 (datacenteret læses af endelsen)
//   MAILCHIMP_LIST_ID  — listens »Audience ID«
// Mangler en af dem, svarer funktionen {ok:false, fejl:"ikke-klar"}, og appen prøver igen ved næste start.
//
// Deploy (Claude, efter Idas »npx supabase@latest login«):
//   npx supabase@latest functions deploy ygt-mailchimp --project-ref eikcvvppuphnananxcvp
//   Verify JWT: TIL (standard — der må IKKE stå --no-verify-jwt).
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: TIL.
//   2. Hvem må kalde den: en indlogget kunde — og kun om sig selv. E-mailen tages ALTID fra kalderens token, aldrig fra kaldet.
//   3. Egen authorization: ja — kalderens token slås op (getUser); kalderens kode (app_metadata.kode) skal have en
//      ygt_start-række, læst SOM kalderen (kundens egne RLS-regler). Uden den: 403, og Mailchimp kaldes ikke.
//   4. Service-role: NEJ. Funktionen bruger kun anon-nøglen + kalderens eget token.
//   5. Når: læser én række i skema_svar (kalderens egen kode, skema ygt_start). Skriver intet i databasen.
//      Uden for Supabase: Idas Mailchimp-liste — kun kalderens egen e-mail og fornavn.
//   Kun kunder med start 18/10-2026 eller senere meldes på (Idas klik 17/10).
//   6. Direkte omkostning: indirekte — hver ny kontakt tæller i Mailchimp-planens kontaktgrænse. Ét kald pr. kunde
//      (appen husker det pr. enhed, og funktionen springer over, hvis mærket findes).
//
// §6 (signup/invitation): dette er ikke en signup- eller invitationsfunktion og rører aldrig credentials.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";
import { crypto as stdCrypto } from "jsr:@std/crypto@1";   // MD5 til Mailchimps kontakt-id (WebCrypto har ikke MD5)

const MAERKE = "YOU GOT THIS";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
function svar(x: unknown, status: number) {
  return new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
async function md5(s: string) {
  const b = await stdCrypto.subtle.digest("MD5", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ ok: false, fejl: "Brug POST." }, 405);

  // 1–2 · hvem kalder? Kun kalderens eget token tæller.
  const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!jwt) return svar({ ok: false, fejl: "Ikke logget ind." }, 401);
  const url = Deno.env.get("SUPABASE_URL")!, anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const sb = createClient(url, anon, { global: { headers: { Authorization: "Bearer " + jwt } }, auth: { persistSession: false } });
  const { data: u, error: ue } = await sb.auth.getUser(jwt);
  const bruger = u && u.user;
  if (ue || !bruger || !bruger.email) return svar({ ok: false, fejl: "Ikke logget ind." }, 401);
  const kode = String((bruger.app_metadata && (bruger.app_metadata as Record<string, unknown>).kode) || "").toUpperCase();
  if (!kode) return svar({ ok: false, fejl: "Ingen kode på kontoen." }, 403);

  // 3 · er det en YOU GOT THIS-kunde, der er startet? Spurgt SOM kalderen (RLS).
  const { data: start, error: se } = await sb.from("skema_svar").select("svar").eq("kode", kode).eq("navn", "config").eq("skema", "ygt_start").limit(1);
  if (se) return svar({ ok: false, fejl: "Kunne ikke læse starten." }, 500);
  if (!start || !start.length) return svar({ ok: false, fejl: "Ingen YOU GOT THIS-start." }, 403);

  // KUN NYE KUNDER (Idas klik 17/10 aften: »Kun nye kunder fra i dag«): de tre, der startede 9/10, 11/10 og 17/10, skal ikke
  // have »uge 1« midt i forløbet. Start før 18/10 = meldes aldrig på; svaret er ok, så appen ikke prøver igen.
  const startDato = String(((start[0].svar || {}) as Record<string, unknown>).dato || "");
  if (startDato && startDato < "2026-10-18") return svar({ ok: true, maerke: "startet-foer-18-10" }, 200);

  // Mailchimp — først når 1–3 er bestået.
  const nogle = Deno.env.get("MAILCHIMP_API_KEY") || "", liste = Deno.env.get("MAILCHIMP_LIST_ID") || "";
  const dc = (nogle.split("-")[1] || "").trim();
  if (!nogle || !liste || !dc) return svar({ ok: false, fejl: "ikke-klar" }, 200);
  const mc = "https://" + dc + ".api.mailchimp.com/3.0/lists/" + encodeURIComponent(liste) + "/members/";
  const auth = { Authorization: "Basic " + btoa("energida:" + nogle), "Content-Type": "application/json" };
  const email = bruger.email.trim().toLowerCase();
  const hash = await md5(email);

  // Har kontakten mærket i forvejen? Så sker der intet.
  const f = await fetch(mc + hash, { headers: auth });
  if (f.ok) {
    const m = await f.json().catch(() => ({}));
    const tags = Array.isArray(m.tags) ? m.tags.map((t: { name?: string }) => String(t.name || "")) : [];
    if (tags.indexOf(MAERKE) > -1) return svar({ ok: true, maerke: MAERKE, allerede: true }, 200);
  }

  const md = (bruger.user_metadata || {}) as Record<string, unknown>;
  const fornavn = String(md.hilsen || md.navn || "").trim().split(/\s+/)[0] || "";
  const p = await fetch(mc + hash, {
    method: "PUT", headers: auth,
    body: JSON.stringify({ email_address: email, status_if_new: "subscribed", merge_fields: fornavn ? { FNAME: fornavn } : {} }),
  });
  if (!p.ok) { const t = await p.text().catch(() => ""); return svar({ ok: false, fejl: "Mailchimp sagde nej (" + p.status + ")", detalje: t.slice(0, 200) }, 502); }
  const t = await fetch(mc + hash + "/tags", { method: "POST", headers: auth, body: JSON.stringify({ tags: [{ name: MAERKE, status: "active" }] }) });
  if (!t.ok) return svar({ ok: false, fejl: "Mærket blev ikke sat (" + t.status + ")" }, 502);
  return svar({ ok: true, maerke: MAERKE }, 200);
});
