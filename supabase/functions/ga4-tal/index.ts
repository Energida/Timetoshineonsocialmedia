// GA4-TAL · Edge Function "ga4-tal"
//
// Ida 19/10: »jeg drømmer jo virkelig om at kunne følge med i … hvor mange besøger hjemmesiden«. Live-overblikket i Backstage
// (19/11: kun energida.dk og www.energida.dk tæller) spørger her: besøg i dag · i går · 7 dage · 30 dage, lige nu, de mest besøgte sider og besøg pr. mail (utm_medium=email).
// Ida gav selv adgang 19/10: servicekontoen energida-overblik@ninth-bonito-460108-f1 er Viewer på GA4-ejendommen 544320089;
// nøglen ligger kun i hemmeligheden GA4_SA_JSON (Claude har aldrig set den).
//
// Deploy: npx supabase@latest functions deploy ga4-tal --project-ref eikcvvppuphnananxcvp --use-api   (Verify JWT TIL — aldrig --no-verify-jwt)
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: TIL.
//   2. Hvem må kalde den: kun administratorer (er_admin() spurgt SOM kalderen, §4).
//   3. Egen authorization: ja — kalderens token, er_admin() skal svare true, ellers 403.
//   4. Service-role: NEJ. Funktionen rører ingen tabel; den kalder kun er_admin() som kalderen og Google.
//   5. Når: ingen data i Supabase. Læser kun GA4-rapporter (Viewer-rolle, kan ikke ændre noget i Analytics).
//   6. Direkte omkostning: nej (GA4 Data API er gratis inden for Googles kvote; ét kald pr. åbning af overblikket).
//   ÆNDRING 22/11 (ikke lagt op af den tråd, der skrev den): tallet »rigtige« (engagedSessions) og listen »kilder« er kommet til. De seks linjer er uændrede:
//   samme adgang, samme kald, ingen ny tabel, ingen ny hemmelighed; ét rapportkald mere til Google pr. åbning.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const EJENDOM = "544320089";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } }); }
const b64u = (b: ArrayBuffer | Uint8Array | string) => {
  const by = typeof b === "string" ? new TextEncoder().encode(b) : new Uint8Array(b as ArrayBuffer);
  let s = ""; by.forEach((c) => (s += String.fromCharCode(c)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

async function googleToken(sa: { client_email: string; private_key: string }) {
  const nu = Math.floor(Date.now() / 1000);
  const hoved = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const krop = b64u(JSON.stringify({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/analytics.readonly", aud: "https://oauth2.googleapis.com/token", iat: nu, exp: nu + 3600 }));
  const pem = sa.private_key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const noegle = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", noegle, new TextEncoder().encode(hoved + "." + krop));
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + hoved + "." + krop + "." + b64u(sig) });
  const j = await r.json(); if (!j.access_token) throw new Error("Google afviste nøglen: " + (j.error_description || j.error || r.status));
  return j.access_token as string;
}
/* KUN DEN LIVE HJEMMESIDE (Ida 19/11: »sikre at det kun er min live hjemmeside jeg får tal fra!!!«): hver rapport tæller kun besøg på energida.dk og www.energida.dk —
   testudgaver (pages.dev, localhost) og andre adresser tælles ikke. Realtime-rapporten kan ikke filtreres på adresse og står uændret. Google sorterer selv kendte robotter fra. */
const LIVE_VAERTER = ["energida.dk", "www.energida.dk"];
function kunLive(krop: any) {
  const vaert = { filter: { fieldName: "hostName", inListFilter: { values: LIVE_VAERTER, caseSensitive: false } } };
  const k = Object.assign({}, krop);
  k.dimensionFilter = krop && krop.dimensionFilter ? { andGroup: { expressions: [vaert, krop.dimensionFilter] } } : vaert;
  return k;
}
async function rapport(tok: string, sti: string, krop: unknown) {
  if (sti === "runReport") krop = kunLive(krop);
  const r = await fetch("https://analyticsdata.googleapis.com/v1beta/properties/" + EJENDOM + ":" + sti, { method: "POST", headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" }, body: JSON.stringify(krop) });
  const j = await r.json(); if (!r.ok) throw new Error("Analytics svarede " + r.status + ": " + (j.error?.message || ""));
  return j;
}
const tal = (j: any, i = 0, m = 0) => Number(j?.rows?.[i]?.metricValues?.[m]?.value || 0);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);
  const jwt = String(req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const somKalder = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: "Bearer " + jwt } } });
  const { data: erAdmin, error: adminFejl } = await somKalder.rpc("er_admin");
  if (adminFejl) return svar({ fejl: "Kunne ikke slå din adgang op." }, 401);
  if (erAdmin !== true) return svar({ fejl: "Kun administratorer kan se besøgstallene." }, 403);

  const raa = Deno.env.get("GA4_SA_JSON"); if (!raa) return svar({ fejl: "ikke-klar" }, 503);
  try {
    const tok = await googleToken(JSON.parse(raa));
    /* KUN RIGTIGE MENNESKER (Ida 22/11: »Jeg vil kun kunne se rigtige mennesker og ikke ai besøg«): engagedSessions = besøg med reel aktivitet
       (mindst 10 sekunder, to sidevisninger eller en handling). Robotter og AI-crawlere, der henter én side og går, falder fra. Det er ikke et bevis for et menneske:
       Analytics kan ikke skelne en AI, der opfører sig som et menneske. »besoeg« (alle besøg) sendes stadig med, så appen kan vise begge. */
    const M = [{ name: "sessions" }, { name: "activeUsers" }, { name: "engagedSessions" }];
    const M2 = [{ name: "sessions" }, { name: "engagedSessions" }];
    const [samlet, nu, sider, mails, kilder] = await Promise.all([
      rapport(tok, "runReport", { dateRanges: [{ startDate: "today", endDate: "today", name: "idag" }, { startDate: "yesterday", endDate: "yesterday", name: "igaar" }, { startDate: "6daysAgo", endDate: "today", name: "uge" }, { startDate: "29daysAgo", endDate: "today", name: "maaned" }], metrics: M }),
      rapport(tok, "runRealtimeReport", { metrics: [{ name: "activeUsers" }] }),
      rapport(tok, "runReport", { dateRanges: [{ startDate: "29daysAgo", endDate: "today" }], dimensions: [{ name: "pagePath" }], metrics: M2, orderBys: [{ metric: { metricName: "engagedSessions" }, desc: true }], limit: 15 }),
      /* KLIK FRA MAILS (Idas klik 19/10 »Ja, begge veje«): Mailchimps »Google Analytics link tracking« mærker linkene (utm_medium=email, utm_campaign=mailens navn) — også i journeys */
      rapport(tok, "runReport", { dateRanges: [{ startDate: "29daysAgo", endDate: "today" }], dimensions: [{ name: "sessionCampaignName" }], metrics: [{ name: "sessions" }], dimensionFilter: { filter: { fieldName: "sessionMedium", stringFilter: { value: "email", matchType: "EXACT", caseSensitive: false } } }, orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 20 }),
      /* HVOR KOMMER DE FRA (22/11): kilde pr. besøg, så Ida selv kan se fx chatgpt.com eller perplexity.ai i listen */
      rapport(tok, "runReport", { dateRanges: [{ startDate: "29daysAgo", endDate: "today" }], dimensions: [{ name: "sessionSource" }], metrics: M2, orderBys: [{ metric: { metricName: "engagedSessions" }, desc: true }], limit: 12 }),
    ]);
    const periode: Record<string, { besoeg: number; personer: number; rigtige: number }> = {};
    (samlet.rows || []).forEach((r: any) => { const n = r.dimensionValues?.[0]?.value || ""; periode[n] = { besoeg: Number(r.metricValues[0].value), personer: Number(r.metricValues[1].value), rigtige: Number(r.metricValues[2]?.value || 0) }; });
    return svar({ ok: true, periode, lige_nu: tal(nu), sider: (sider.rows || []).map((r: any) => ({ sti: r.dimensionValues[0].value, besoeg: Number(r.metricValues[0].value), rigtige: Number(r.metricValues[1]?.value || 0) })),
      kilder: (kilder.rows || []).map((r: any) => ({ kilde: r.dimensionValues[0].value, besoeg: Number(r.metricValues[0].value), rigtige: Number(r.metricValues[1]?.value || 0) })).filter((x: any) => x.kilde && x.kilde !== "(not set)"), mails: (mails.rows || []).map((r: any) => ({ kampagne: r.dimensionValues[0].value, besoeg: Number(r.metricValues[0].value) })).filter((x: any) => x.kampagne && x.kampagne !== "(not set)") }, 200);
  } catch (e) {
    return svar({ fejl: String((e as Error).message || e).slice(0, 300) }, 502);
  }
});
