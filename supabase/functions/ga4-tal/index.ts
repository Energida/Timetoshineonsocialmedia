// GA4-TAL · Edge Function "ga4-tal"
//
// Ida 19/10: »jeg drømmer jo virkelig om at kunne følge med i … hvor mange besøger hjemmesiden«. Live-overblikket i Backstage
// spørger her: besøg i dag · i går · 7 dage · 30 dage, lige nu, og de mest besøgte sider (så salgssiderne kan skilles ud).
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
async function rapport(tok: string, sti: string, krop: unknown) {
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
    const M = [{ name: "sessions" }, { name: "activeUsers" }];
    const [samlet, nu, sider] = await Promise.all([
      rapport(tok, "runReport", { dateRanges: [{ startDate: "today", endDate: "today", name: "idag" }, { startDate: "yesterday", endDate: "yesterday", name: "igaar" }, { startDate: "6daysAgo", endDate: "today", name: "uge" }, { startDate: "29daysAgo", endDate: "today", name: "maaned" }], metrics: M }),
      rapport(tok, "runRealtimeReport", { metrics: [{ name: "activeUsers" }] }),
      rapport(tok, "runReport", { dateRanges: [{ startDate: "29daysAgo", endDate: "today" }], dimensions: [{ name: "pagePath" }], metrics: [{ name: "sessions" }], orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 15 }),
    ]);
    const periode: Record<string, { besoeg: number; personer: number }> = {};
    (samlet.rows || []).forEach((r: any) => { const n = r.dimensionValues?.[0]?.value || ""; periode[n] = { besoeg: Number(r.metricValues[0].value), personer: Number(r.metricValues[1].value) }; });
    return svar({ ok: true, periode, lige_nu: tal(nu), sider: (sider.rows || []).map((r: any) => ({ sti: r.dimensionValues[0].value, besoeg: Number(r.metricValues[0].value) })) }, 200);
  } catch (e) {
    return svar({ fejl: String((e as Error).message || e).slice(0, 300) }, 502);
  }
});
