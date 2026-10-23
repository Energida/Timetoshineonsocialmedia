// FEJL-MELD · Edge Function "fejl-meld"
//
// Ida 23/10: »hvis der er det mindste fejl så skal de klikke på den her og så fikser jeg det hurtigst muligt … og så vil jeg have en mail på hver rapport«.
// Klik: »Bud 2 · Ved klokken« (Artifact XZhWFF485LpBSp3yrmg1h1). Kunden trykker på insektet, skriver, hvad der driller, og appen gemmer rapporten
// i skema_svar (navn »app_fejl«, skema »kunde_fejl_<tid>«). Bagefter kalder appen denne funktion med rækkens id, og Ida får én mail.
//
// Deploy: Claude via Supabase Management API med tokenet i ~/.supabase/access-token (aldrig CLI — nøgleringen, 19/10). Verify JWT: TIL.
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: TIL.
//   2. Hvem må kalde den: enhver indlogget bruger (kunden, der melder fejlen). Anonym (anon-nøglen) afvises af getUser → 401.
//   3. Egen authorization: ja — kalderens token → getUser. Rapporten slås op SOM kalderen (RLS): en kunde kan kun få mailet sin egen række.
//      Modtageren er ALTID Kontakt@energida.dk — kalderen kan ikke vælge, hvem mailen går til. Loft: 20 rapporter pr. kode pr. døgn.
//   4. Service-role: NEJ.
//   5. Når (som kalderen, under RLS): skema_svar — læse én app_fejl-række (id), tælle egne kunde_fejl-rækker det sidste døgn, læse kundens
//      kunde_def (virksomhedens navn). Intet skrives.
//   6. Direkte omkostning: nej — Brevo Free (300 mails/dag delt). Højst 20 mails pr. kunde pr. døgn.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } }); }
function rens(t: unknown) { return String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string)); }

const IDA = "Kontakt@energida.dk";
const MAKS_DOEGN = 20;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);
  const jwt = String(req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: "Bearer " + jwt } } });
  const { data: bruger, error: brugerFejl } = await db.auth.getUser(jwt);
  if (brugerFejl || !bruger?.user) return svar({ fejl: "Du er ikke logget ind." }, 401);

  let krop: { id?: string } = {};
  try { krop = await req.json(); } catch (_e) { return svar({ fejl: "Rapporten manglede." }, 400); }
  const id = String(krop.id || "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return svar({ fejl: "Rapporten manglede." }, 400);

  /* Rækken slås op SOM kalderen — findes den ikke for kalderen, sendes intet */
  const { data: r, error: rFejl } = await db.from("skema_svar").select("id,kode,skema,svar,created_at").eq("id", id).eq("navn", "app_fejl").maybeSingle();
  if (rFejl) return svar({ fejl: "Kunne ikke læse rapporten." }, 500);
  if (!r || !String(r.skema || "").startsWith("kunde_fejl_")) return svar({ fejl: "Rapporten findes ikke." }, 404);

  const doegn = new Date(Date.now() - 864e5).toISOString();
  const { count } = await db.from("skema_svar").select("id", { count: "exact", head: true }).eq("kode", r.kode).eq("navn", "app_fejl").like("skema", "kunde_fejl_%").gte("created_at", doegn);
  if ((count || 0) > MAKS_DOEGN) return svar({ fejl: "For mange rapporter i dag." }, 429);

  let virk = String(r.kode || "");
  try { const { data: d } = await db.from("skema_svar").select("svar").eq("kode", r.kode).eq("navn", "config").eq("skema", "kunde_def").maybeSingle(); if (d?.svar?.virksomhed) virk = String(d.svar.virksomhed); } catch (_e) { /* koden er nok */ }

  const v: any = r.svar || {};
  const email = String(bruger.user.email || "");
  const hvad = String(v.hvad || "").slice(0, 4000);
  const billeder = (Array.isArray(v.billeder) ? v.billeder : []).map(String).filter((u: string) => /^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\//i.test(u)).slice(0, 6);
  const tid = new Date(v.tid || r.created_at).toLocaleString("da-DK", { timeZone: "Europe/Copenhagen", dateStyle: "long", timeStyle: "short" });
  const linje = (et: string, vaerdi: string) => vaerdi ? '<tr><td style="padding:4px 12px 4px 0;color:#6F6B66;font-size:13px;white-space:nowrap;vertical-align:top;">' + et + '</td><td style="padding:4px 0;font-size:13px;color:#1A1A1A;">' + vaerdi + '</td></tr>' : '';
  const html = '<div style="font-family:Poppins,Arial,sans-serif;color:#1A1A1A;max-width:560px;">'
    + '<p style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#6F6B66;margin:0 0 6px;">Fejl fra en kunde</p>'
    + '<p style="font-size:18px;margin:0 0 16px;">' + rens(virk) + '</p>'
    + '<div style="background:#F4F2EE;border-radius:16px;padding:16px 18px;font-size:15px;line-height:1.6;white-space:pre-wrap;margin:0 0 16px;">' + (hvad ? rens(hvad) : '<span style="color:#6F6B66;">Kunden skrev ingen tekst.</span>') + '</div>'
    + (billeder.length ? '<p style="margin:0 0 16px;">' + billeder.map((u: string, i: number) => '<a href="' + rens(u) + '" style="color:#FC2404;">Skærmbillede' + (billeder.length > 1 ? " " + (i + 1) : "") + '</a>').join(" &nbsp; ") + '</p>' : '')
    + '<table style="border-collapse:collapse;">'
    + linje("Fra", rens((v.af ? v.af + " · " : "") + email))
    + linje("Kode", rens(r.kode))
    + linje("Side", rens(v.side || v.skaerm || ""))
    + linje("Enhed", rens(v.enhed || ""))
    + linje("Version", rens(v.v || ""))
    + linje("Tid", rens(tid))
    + '</table>'
    + '<p style="font-size:12px;color:#6F6B66;margin:18px 0 0;">Svar på mailen for at skrive direkte til kunden. Rapporten står også i Backstage · Teknik · Fejl fra kunderne.</p>'
    + '</div>';

  const noegle = Deno.env.get("BREVO_API_KEY"); if (!noegle) return svar({ fejl: "ikke-klar" }, 503);
  const emne = "Fejl fra " + virk + (hvad ? ": " + hvad.replace(/\s+/g, " ").slice(0, 60) : "");
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": noegle, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Energida-appen", email: IDA },
        to: [{ email: IDA, name: "Ida" }],
        ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { replyTo: { email } } : {}),
        subject: emne.slice(0, 150),
        htmlContent: html,
        tags: ["fejl-fra-kunde"],
      }),
    });
    if (!res.ok) return svar({ fejl: "Brevo " + res.status }, 502);
  } catch (_x) { return svar({ fejl: "Mailen kunne ikke sendes." }, 502); }
  return svar({ ok: true }, 200);
});
