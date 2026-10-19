// MAILCHIMP-TAL · Edge Function "mailchimp-tal"
//
// Ida 19/10 (»hvor mange klikker på min mail«, klik »Klik pr. mail«): live-overblikket viser klik pr. mail fra Mailchimp — klik, ikke åbninger
// (åbninger er upålidelige efter Apple Mail Privacy). Nøglen ligger kun i MAILCHIMP_API_KEY (sat af Ida 19/10; Claude har aldrig set den).
//
// Deploy: npx supabase@latest functions deploy mailchimp-tal --project-ref eikcvvppuphnananxcvp --use-api   (Verify JWT TIL)
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: TIL.
//   2. Hvem må kalde den: kun administratorer (er_admin() spurgt SOM kalderen, §4).
//   3. Egen authorization: ja — kalderens token, er_admin() skal svare true, ellers 403.
//   4. Service-role: NEJ.
//   5. Når: ingen data i Supabase. Læser kun Mailchimps rapporter (GET /reports og GET /automations) — sender, ændrer og sletter intet i Mailchimp.
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
  const somKalder = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: "Bearer " + jwt } } });
  const { data: erAdmin, error: adminFejl } = await somKalder.rpc("er_admin");
  if (adminFejl) return svar({ fejl: "Kunne ikke slå din adgang op." }, 401);
  if (erAdmin !== true) return svar({ fejl: "Kun administratorer kan se mailtallene." }, 403);

  const noegle = Deno.env.get("MAILCHIMP_API_KEY") || ""; const dc = noegle.split("-")[1];
  if (!noegle || !dc) return svar({ fejl: "ikke-klar" }, 503);
  try {
    const r = await fetch("https://" + dc + ".api.mailchimp.com/3.0/reports?count=30&fields=reports.id,reports.campaign_title,reports.subject_line,reports.type,reports.emails_sent,reports.send_time,reports.clicks.unique_subscriber_clicks,reports.clicks.click_rate", { headers: { Authorization: "Basic " + btoa("energida:" + noegle) } });
    const j = await r.json();
    if (!r.ok) return svar({ fejl: "Mailchimp svarede " + r.status + ": " + String(j.detail || j.title || "").slice(0, 200) }, 502);
    /* KLASSISKE AUTOMATISERINGER: deres mails har egne rapporter (report_summary) — journeys fra Mailchimps nye editor kan ikke læses via API'et */
    let auto: any[] = [];
    try {
      const ra = await fetch("https://" + dc + ".api.mailchimp.com/3.0/automations?count=20&fields=automations.id,automations.settings.title,automations.status,automations.emails_sent,automations.report_summary", { headers: { Authorization: "Basic " + btoa("energida:" + noegle) } });
      const ja = await ra.json(); if (ra.ok) auto = (ja.automations || []).map((x: any) => ({ id: x.id, navn: x.settings?.title || "Automatisering", type: "automation", status: x.status, sendt: x.emails_sent || 0, klik: x.report_summary?.subscriber_clicks || 0, klikrate: x.report_summary?.click_rate || 0 }));
    } catch (_) { /* automatiseringerne er en bonus — kampagnerne står uanset */ }
    const mails = (j.reports || []).map((x: any) => ({ id: x.id, navn: x.campaign_title || x.subject_line || "Uden navn", emne: x.subject_line || "", type: x.type, sendt: x.emails_sent || 0, klik: x.clicks?.unique_subscriber_clicks || 0, klikrate: x.clicks?.click_rate || 0, tid: x.send_time || "" }));
    return svar({ ok: true, mails, automatiseringer: auto }, 200);
  } catch (e) {
    return svar({ fejl: String((e as Error).message || e).slice(0, 300) }, 502);
  }
});
