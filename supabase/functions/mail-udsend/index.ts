// MAIL-UDSEND · Edge Function "mail-udsend"
//
// Ida 23/10: »Kan vi lave sådan at når jeg sender mails ud fra mail at de lander på kunderne? uanset om det er lead eller andet?«
// Klik: »Sendes + står på kortet« — mailen sendes rigtigt til de valgte (med afmeldingslink), og den står på hver
// modtagers kort i CRM. Leads uden ja får den ikke.
//
// Deploy: Claude via Supabase Management API med tokenet i ~/.supabase/access-token (aldrig CLI — nøgleringen, 19/10).
//         Verify JWT: TIL.
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: TIL.
//   2. Hvem må kalde den: kun administratorer (er_admin() spurgt SOM kalderen, §4 — mønsteret fra kunde-admin).
//   3. Egen authorization: ja — kalderens token → getUser + er_admin() skal svare true, ellers 403. Modtagerne vælges
//      ALDRIG som frie adresser: kalderen sender kontakt-id'er, og adresserne slås op i contacts SOM kalderen.
//   4. Service-role: NEJ til data. Nøglen bruges KUN som hemmelighed til at underskrive afmeldingslinket (HMAC),
//      så mail-afmeld kan bevise, at linket kom fra os. Den forlader aldrig funktionen.
//   5. Når (som kalderen, under RLS): contacts (læse id, email, status, kilde, navne, mail_ok), mail_afmeldt (læse),
//      mail_log (læse + skrive én række pr. modtager).
//   6. Direkte omkostning: nej — Brevo Free (300 mails/dag delt). Loft: 250 modtagere pr. kald og 280 sendte pr. døgn
//      målt i mail_log. Samme mail sendes aldrig to gange til samme adresse (unikt indeks + tjek her).
//
// Prøvekørsel: { proev: true } sender intet og svarer med, hvor mange der får mailen, og hvorfor resten springes over.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } }); }

/* Leads = Notions »Opgave«-gruppe (samme ord som CRM'ets status). De får kun mailen med mail_ok = true.
   UNDTAGELSE: kilden »Gamle kunder« — de har købt før og står som Lead i salgsturnéen; de får mailen (og kan altid afmelde). */
const LEAD_STATUS = ["lead", "ikke sendt", "kontaktet", "ikke igang"];
const AFMELD_SIDE = "https://b2b.energida.dk/afmeld.html";
const MAKS_KALD = 250, MAKS_DOEGN = 280;

function b64url(s: string) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
async function underskrift(email: string) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode("afmeld:" + email)));
  return Array.from(s).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}
function maerk(html: string, kampagne: string) {
  return html.replace(/href="(https:\/\/(?:[a-z0-9-]+\.)*energida\.dk[^"]*)"/gi, function (_m, url: string) {
    if (/[?&]utm_medium=/.test(url) || url.indexOf(AFMELD_SIDE) === 0) return 'href="' + url + '"';
    const [uden, hash] = url.split("#");
    const ny = uden + (uden.indexOf("?") >= 0 ? "&" : "?") + "utm_source=brevo&utm_medium=email&utm_campaign=" + encodeURIComponent(kampagne);
    return 'href="' + ny + (hash != null ? "#" + hash : "") + '"';
  });
}
function rens(t: string) { return String(t || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string)); }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);
  const jwt = String(req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: "Bearer " + jwt } } });
  const { data: bruger, error: brugerFejl } = await db.auth.getUser(jwt);
  if (brugerFejl || !bruger?.user) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const { data: erAdmin, error: adminFejl } = await db.rpc("er_admin");
  if (adminFejl) return svar({ fejl: "Kunne ikke slå din adgang op." }, 401);
  if (erAdmin !== true) return svar({ fejl: "Kun administratorer kan sende mails." }, 403);

  let krop: { mail_id?: string; emne?: string; html?: string; fra?: string; kontakter?: string[]; proev?: boolean } = {};
  try { krop = await req.json(); } catch (_e) { return svar({ fejl: "Mailen manglede." }, 400); }
  const mailId = String(krop.mail_id || "").trim().slice(0, 80);
  const emne = String(krop.emne || "").trim().slice(0, 200);
  const html = String(krop.html || "");
  const fraNavn = String(krop.fra || "Energida").replace(/[\r\n<>"]/g, "").trim().slice(0, 60) || "Energida";
  const ids = Array.from(new Set((Array.isArray(krop.kontakter) ? krop.kontakter : []).map((x) => String(x)).filter((x) => /^[0-9a-f-]{36}$/i.test(x))));
  if (!mailId || !emne || !html || html.length > 200000) return svar({ fejl: "Mailen manglede emne eller tekst." }, 400);
  if (!ids.length) return svar({ fejl: "Ingen modtagere." }, 400);
  if (ids.length > MAKS_KALD) return svar({ fejl: "Højst " + MAKS_KALD + " modtagere ad gangen." }, 400);
  if (html.indexOf("{afmeld}") < 0) return svar({ fejl: "Mailen mangler afmeldingslinket." }, 400);

  /* Modtagerne slås op SOM kalderen — aldrig frie adresser fra kaldet */
  const { data: kontakter, error: kFejl } = await db.from("contacts").select("id,email,status,source,kontaktperson,kunde,mail_ok").in("id", ids);
  if (kFejl) return svar({ fejl: "Kunne ikke læse kontakterne." }, 500);
  const { data: afm } = await db.from("mail_afmeldt").select("email");
  const afmeldt = new Set((afm || []).map((x: any) => String(x.email).toLowerCase()));
  const { data: tidl } = await db.from("mail_log").select("email").eq("mail_id", mailId).eq("status", "sendt");
  const sendtFoer = new Set((tidl || []).map((x: any) => String(x.email).toLowerCase()));

  const ud: any[] = [], sprunget = { udenMail: 0, afmeldt: 0, ikkeJa: 0, alleredeSendt: 0 };
  const sete = new Set<string>();
  for (const k of (kontakter || []) as any[]) {
    const e = String(k.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { sprunget.udenMail++; continue; }
    if (sete.has(e)) continue; sete.add(e);
    if (afmeldt.has(e)) { sprunget.afmeldt++; continue; }
    const erLead = LEAD_STATUS.indexOf(String(k.status || "").trim().toLowerCase()) >= 0 && String(k.source || "").trim() !== "Gamle kunder";
    if (k.mail_ok === false || (erLead && k.mail_ok !== true)) { sprunget.ikkeJa++; continue; }
    if (sendtFoer.has(e)) { sprunget.alleredeSendt++; continue; }
    ud.push({ id: k.id, email: e, navn: String(k.kontaktperson || "").trim().split(/\s+/)[0] || String(k.kunde || "").trim() });
  }
  if (krop.proev) return svar({ ok: true, proev: true, faar: ud.length, sprunget }, 200);
  if (!ud.length) return svar({ ok: true, sendt: 0, sprunget, fejl: 0 }, 200);

  const doegn = new Date(Date.now() - 864e5).toISOString();
  const { count } = await db.from("mail_log").select("id", { count: "exact", head: true }).eq("status", "sendt").gte("created_at", doegn);
  if ((count || 0) + ud.length > MAKS_DOEGN) return svar({ fejl: "Det sidste døgn er der sendt " + (count || 0) + " mails. Brevo tillader 300 om dagen — send resten i morgen." }, 429);

  const noegle = Deno.env.get("BREVO_API_KEY"); if (!noegle) return svar({ fejl: "ikke-klar" }, 503);
  const funkUrl = Deno.env.get("SUPABASE_URL")! + "/functions/v1/mail-afmeld";
  let sendt = 0, fejl = 0;
  for (const m of ud) {
    const e64 = b64url(m.email), t = await underskrift(m.email);
    const side = AFMELD_SIDE + "?e=" + e64 + "&t=" + t;
    const personlig = maerk(html.replace(/\{navn\}/g, rens(m.navn)).replace(/\{afmeld\}/g, side), mailId);
    let status = "fejl", brevoId: string | null = null, besked: string | null = null;
    try {
      const r = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": noegle, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          sender: { name: fraNavn, email: "Kontakt@energida.dk" },
          replyTo: { email: "Kontakt@energida.dk", name: "Energida" },
          to: [{ email: m.email }],
          subject: emne,
          htmlContent: personlig,
          headers: { "List-Unsubscribe": "<" + funkUrl + "?e=" + e64 + "&t=" + t + ">", "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
          tags: ["udsendelse", mailId.slice(0, 50)],
        }),
      });
      let j: any = null; try { j = await r.json(); } catch (_e) { j = null; }
      if (r.ok) { status = "sendt"; brevoId = j && j.messageId ? String(j.messageId) : null; sendt++; }
      else { besked = "Brevo " + r.status + (j && j.message ? ": " + String(j.message).slice(0, 200) : ""); fejl++; }
    } catch (x) { besked = String(x).slice(0, 200); fejl++; }
    await db.from("mail_log").insert({ contact_id: m.id, email: m.email, mail_id: mailId, emne, status, brevo_id: brevoId, fejl: besked });
  }
  return svar({ ok: true, sendt, fejl, sprunget }, 200);
});
