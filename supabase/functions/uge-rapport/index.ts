// UGE-RAPPORT · Edge Function "uge-rapport"
//
// Ida 24/11: »kunne man lave en automatisk ugentlig rapport til mig - som indeholder en rapport fra google analytics? så man en gang om
// ugen får en rapport på hvordan folk bevæger sig derinde og hvordan man kan optimere?« → »ja byg den«.
// Hver mandag fra kl. 07.00 dansk tid sender den ÉN mail til Ida, »Ugen der gik«: hjemmesiden (Google Analytics, kun energida.dk og
// www.energida.dk) · appen (appens egne tal — Google Analytics er IKKE i appen, med vilje) · tre forslag til forbedringer, skrevet ud fra tallene.
// Perioden er de 7 dage, der sluttede i går (mandag = mandag–søndag), sammenlignet med de 7 dage før.
//
// Deploy: Claude via Supabase Management API med tokenet i ~/.supabase/access-token (aldrig CLI — nøgleringen, 19/11). Verify JWT: FRA (se linje 1).
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: FRA. Begrundelse: kaldes af databasens ur (pg_cron + pg_net), som ikke har et brugerlogin. Samme mønster som status-mail.
//   2. Hvem må kalde den: kun den, der kender hemmeligheden MODUL_MAIL_NOEGLE (headeren x-ur-noegle) — samme nøgle som modul-mail og
//      status-mail, som Ida selv satte i Secrets og i Vault. Claude sætter og ser den aldrig.
//   3. Egen authorization: JA — hemmeligheden tjekkes som det ALLERFØRSTE (konstant tid). Mangler den på serveren → 503, forkert/ingen → 401.
//      Kalderen kan intet vælge: modtageren er fast (Kontakt@energida.dk), ingen tekst eller adresser i kaldet — kun { proev: true }
//      (sender intet, svarer med tal) og { nu: true } (sender med det samme, stadig kun til Ida, højst én gang pr. minut).
//   4. Service-role: JA, men først EFTER verificeret hemmelighed (der er ingen bruger at spørge som).
//   5. Når (kun LÆSE): virksomhedskoder · skema_svar (kunde_def, app_brug, lektion_set_*, lektion_gjort_*, ENERGIDA/config/publicering) ·
//      contacts (YOU GOT THIS-køb) · auth.users (sidste login) · lektion_oevelser »ida:rapporter« (til/fra) · Google Analytics (Viewer,
//      ejendom 544320089, nøglen GA4_SA_JSON). SKRIVER kun: mail_log (én række pr. sendt rapport) og skema_svar ENERGIDA/Ida/rapport_sidst_uge.
//      Kundernes svar og noter læses aldrig. Til AI'en sendes KUN samlede tal (ingen navne, mails eller koder).
//   6. Direkte omkostning: JA, lille — ét kald til Anthropic (ANTHROPIC_API_KEY) pr. uge, højst ~10.000 tokens (under 1 kr.). Brevo Free og
//      GA4 Data API er gratis. Højst én rapport pr. uge (unikt indeks i mail_log på »uge-<år>-<uge>«).
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const TIL = "Kontakt@energida.dk";
const EJENDOM = "544320089";
const LIVE_VAERTER = ["energida.dk", "www.energida.dk"];
const EGNE = ["ENERGIDA", "IDAENERGIDA"];
const TESTMAILS = ["info.energida@gmail.com"];
const AI_MODEL = "claude-sonnet-5-5";
let AI_FEJL = "";

function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { "Content-Type": "application/json" } }); }
function ens(a: string, b: string) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
function esc(s: unknown) { return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" } as Record<string, string>)[c]); }
function dkDele(d: Date) {
  const dele = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Copenhagen", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false }).formatToParts(d);
  const v = (t: string) => (dele.find((x) => x.type === t) || { value: "" }).value;
  return { dato: v("year") + "-" + v("month") + "-" + v("day"), tid: (v("hour") === "24" ? "00" : v("hour")) + ":" + v("minute"), ugedag: v("weekday") };
}
function dkDato(iso: string) { return iso ? dkDele(new Date(iso)).dato : ""; }
function plusDage(dato: string, n: number) { const d = new Date(dato + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function dageMellem(fra: string, til: string) { if (!fra || !til) return null; return Math.round((Date.parse(til + "T12:00:00Z") - Date.parse(fra + "T12:00:00Z")) / 864e5); }
function isoUge(dato: string) { const d = new Date(dato + "T12:00:00Z"); const dag = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - dag + 3); const aar = d.getUTCFullYear(); const f = new Date(Date.UTC(aar, 0, 4)); return { aar, uge: 1 + Math.round(((d.getTime() - f.getTime()) / 864e5 - 3 + ((f.getUTCDay() + 6) % 7)) / 7) }; }
const MAANEDER = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
function datoOrd(iso: string) { const p = iso.split("-").map(Number); return p[2] + ". " + MAANEDER[p[1] - 1]; }
function navnStort(s: string) { return String(s || "").trim().split(/\s+/).map((d) => d ? d.charAt(0).toUpperCase() + d.slice(1) : d).join(" "); }
function lekNavn(id: string) { const m = String(id).match(/^(\d+)-(\d+)/); return m ? (Number(m[1]) - 1) + "." + m[2] : id; }   /* modul 1 i basen = »Modul 0« for kunden */
function aendring(nu: number, foer: number) { if (!foer) return nu ? "ny" : ""; const p = Math.round((nu - foer) / foer * 100); return (p > 0 ? "+" : "") + p + " %"; }

async function rapportTaendt(db: any, k: string) {
  try { const { data } = await db.from("lektion_oevelser").select("spm").eq("lektion_id", "ida:rapporter").maybeSingle(); const v = data && data.spm && typeof data.spm === "object" ? data.spm[k] : undefined; return v !== false; } catch (_e) { return true; }
}
async function rapportGem(db: any, k: string, emne: string, html: string) {
  try {
    const s = { emne: String(emne || "").slice(0, 200), tid: new Date().toISOString(), html: String(html || "").slice(0, 200000) };
    const u = await db.from("skema_svar").update({ svar: s }).eq("kode", "ENERGIDA").eq("navn", "Ida").eq("skema", "rapport_sidst_" + k).select("id");
    if (!u.error && !(u.data && u.data.length)) await db.from("skema_svar").insert({ kode: "ENERGIDA", navn: "Ida", skema: "rapport_sidst_" + k, svar: s });
  } catch (_e) { /* må aldrig vælte mailen */ }
}
// deno-lint-ignore no-explicit-any
async function alle(byg: () => any) { let ud: any[] = [], fra = 0; for (let n = 0; n < 50; n++) { const r = await byg().range(fra, fra + 999); if (r.error) throw new Error("hent"); const d = r.data || []; ud = ud.concat(d); if (d.length < 1000) break; fra += 1000; } return ud; }

/* ===== Google Analytics (samme nøgle og samme »kun den live hjemmeside« som ga4-tal) ===== */
const b64u = (b: string | ArrayBuffer) => { const by = typeof b === "string" ? new TextEncoder().encode(b) : new Uint8Array(b); let s = ""; by.forEach((c) => s += String.fromCharCode(c)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
async function googleToken(sa: any) {
  const nu = Math.floor(Date.now() / 1000);
  const hoved = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const krop = b64u(JSON.stringify({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/analytics.readonly", aud: "https://oauth2.googleapis.com/token", iat: nu, exp: nu + 3600 }));
  const pem = sa.private_key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const noegle = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", noegle, new TextEncoder().encode(hoved + "." + krop));
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + hoved + "." + krop + "." + b64u(sig) });
  const j = await r.json(); if (!j.access_token) throw new Error("google-noegle"); return j.access_token;
}
async function gaRapport(tok: string, krop: any) {
  const vaert = { filter: { fieldName: "hostName", inListFilter: { values: LIVE_VAERTER, caseSensitive: false } } };
  krop = Object.assign({}, krop, { dimensionFilter: krop.dimensionFilter ? { andGroup: { expressions: [vaert, krop.dimensionFilter] } } : vaert });
  const r = await fetch("https://analyticsdata.googleapis.com/v1beta/properties/" + EJENDOM + ":runReport", { method: "POST", headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" }, body: JSON.stringify(krop) });
  const j = await r.json(); if (!r.ok) throw new Error("ga " + r.status); return j;
}
const gTal = (j: any, i = 0, m = 0) => Number(j?.rows?.[i]?.metricValues?.[m]?.value || 0);

async function hjemmesiden(fra: string, til: string, fFra: string, fTil: string) {
  const raa = Deno.env.get("GA4_SA_JSON"); if (!raa) return null;
  const tok = await googleToken(JSON.parse(raa));
  const to = [{ startDate: fra, endDate: til, name: "nu" }, { startDate: fFra, endDate: fTil, name: "foer" }];
  const M = [{ name: "engagedSessions" }, { name: "activeUsers" }, { name: "averageSessionDuration" }, { name: "bounceRate" }];
  const [samlet, kilder, sider, enheder] = await Promise.all([
    gaRapport(tok, { dateRanges: to, metrics: M }),
    gaRapport(tok, { dateRanges: to, dimensions: [{ name: "sessionSource" }], metrics: [{ name: "engagedSessions" }], orderBys: [{ metric: { metricName: "engagedSessions" }, desc: true }], limit: 20 }),
    gaRapport(tok, { dateRanges: [{ startDate: fra, endDate: til }], dimensions: [{ name: "pagePath" }], metrics: [{ name: "engagedSessions" }, { name: "averageSessionDuration" }], orderBys: [{ metric: { metricName: "engagedSessions" }, desc: true }], limit: 6 }),
    gaRapport(tok, { dateRanges: [{ startDate: fra, endDate: til }], dimensions: [{ name: "deviceCategory" }], metrics: [{ name: "engagedSessions" }], orderBys: [{ metric: { metricName: "engagedSessions" }, desc: true }], limit: 3 }),
  ]);
  /* To datoperioder: rækkerne har dateRange som sidste dimension (»nu«/»foer«) */
  const per = (j: any) => { const ud: Record<string, number[]> = {}; for (const r of (j.rows || [])) { const n = r.dimensionValues?.[r.dimensionValues.length - 1]?.value || "nu"; ud[n] = (r.metricValues || []).map((m: any) => Number(m.value || 0)); } return ud; };
  const s = per(samlet), nu = s.nu || [0, 0, 0, 0], foer = s.foer || [0, 0, 0, 0];
  const kNu: Record<string, number> = {}, kFoer: Record<string, number> = {};
  for (const r of (kilder.rows || [])) { const navn = r.dimensionValues?.[0]?.value || "(ukendt)"; const p = r.dimensionValues?.[1]?.value || "nu"; (p === "foer" ? kFoer : kNu)[navn] = Number(r.metricValues?.[0]?.value || 0); }
  /* Vores egne testservere og testudgaver er ikke besøgende (24/11: »127.0.0.1:8766« stod som kilde) */
  for (const k of Object.keys(kNu)) if (/^(localhost|127\.|0\.0\.0\.0)|\.pages\.dev$|energida\.dk$/i.test(k) || !kNu[k]) delete kNu[k];
  const kildeListe = Object.keys(kNu).sort((a, b) => kNu[b] - kNu[a]).slice(0, 5).map((k) => ({ kilde: k === "(direct)" ? "Direkte" : k, besoeg: kNu[k], foer: kFoer[k] || 0 }));
  const sideListe = (sider.rows || []).map((r: any) => ({ side: r.dimensionValues?.[0]?.value || "/", besoeg: Number(r.metricValues?.[0]?.value || 0), sek: Math.round(Number(r.metricValues?.[1]?.value || 0)) }));
  const enhedSum = (enheder.rows || []).reduce((a: number, r: any) => a + Number(r.metricValues?.[0]?.value || 0), 0) || 1;
  const telefon = Math.round(((enheder.rows || []).find((r: any) => r.dimensionValues?.[0]?.value === "mobile")?.metricValues?.[0]?.value || 0) / enhedSum * 100);
  return { besoeg: nu[0], besoegFoer: foer[0], personer: nu[1], sekunder: Math.round(nu[2]), afvist: Math.round(nu[3] * 100), kilder: kildeListe, sider: sideListe, telefonPct: telefon };
}

/* ===== Tre forslag (AI) — kun samlede tal sendes, aldrig navne ===== */
async function forslag(tal: unknown) {
  const noegle = Deno.env.get("ANTHROPIC_API_KEY"); if (!noegle) return [];
  const prompt = "Du er Idas skarpe rådgiver. Ida driver Energida. Hun sælger onlineforløbet YOU GOT THIS (moduler med videolektioner og opgaver om sociale medier) til små virksomheder, og hjemmesiden har også andre forløb, fx siden /succesfulddetaildrift/. Køb i tallene er KUN køb af YOU GOT THIS, så sæt dem ikke i forbindelse med en bestemt side, medmindre tallene viser det. "
    + "Her er ugens tal for hjemmesiden energida.dk (Google Analytics) og appen, hvor kunderne tager forløbet:\n" + JSON.stringify(tal) + "\n\n"
    + "Giv præcis TRE konkrete forslag til, hvad Ida skal gøre i denne uge for at få flere køb eller få kunderne videre i forløbet. Hvert forslag skal bygge på et bestemt tal ovenfor og nævne det. "
    + "Skriv på enkelt, varmt dansk uden fagord og uden forkortelser. Svar KUN med JSON: [{\"titel\":\"højst 8 ord, starter med et udsagnsord\",\"hvorfor\":\"én sætning, højst 30 ord\"}]";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": noegle, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: AI_MODEL, max_tokens: 8000, messages: [{ role: "user", content: prompt }] }) });
    if (!r.ok) { AI_FEJL = "ai " + r.status + " " + (await r.text()).slice(0, 160); return []; }
    const j = await r.json(); const t = (Array.isArray(j?.content) ? j.content : []).filter((b: any) => b && b.type === "text").map((b: any) => String(b.text || "")).join("\n"); const m = t.match(/\[[\s\S]*\]/); if (!m) { AI_FEJL = "ai-tekst " + JSON.stringify(j).slice(0, 200); return []; }
    const a = JSON.parse(m[0]); return Array.isArray(a) ? a.slice(0, 3).map((x: any) => ({ titel: String(x.titel || "").slice(0, 90), hvorfor: String(x.hvorfor || "").slice(0, 260) })).filter((x: any) => x.titel) : [];
  } catch (e) { AI_FEJL = "ai-undtagelse " + String(e).slice(0, 120); return []; }
}

Deno.serve(async (req) => {
  /* ===== 1 · HEMMELIGHEDEN — DET ALLERFØRSTE ===== */
  const rigtig = Deno.env.get("MODUL_MAIL_NOEGLE") || "";
  if (rigtig.length < 24) return svar({ fejl: "ikke-klar" }, 503);
  const givet = String(req.headers.get("x-ur-noegle") || "");
  if (!ens(givet, rigtig)) return svar({ fejl: "Ingen adgang." }, 401);
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);
  let krop: { proev?: boolean; nu?: boolean } = {};
  try { krop = await req.json(); } catch (_e) { krop = {}; }
  const proev = krop && krop.proev === true, straks = krop && krop.nu === true;

  const nu = dkDele(new Date());
  if (!proev && !straks) {
    if (nu.ugedag !== "Mon") return svar({ ok: true, sendt: 0, grund: "ikke-mandag" }, 200);
    if (nu.tid < "07:00") return svar({ ok: true, sendt: 0, grund: "for-tidligt" }, 200);
    if (nu.tid >= "12:00") return svar({ ok: true, sendt: 0, grund: "for-sent" }, 200);
  }

  /* ===== 2 · Først nu: service-role ===== */
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  if (!proev && !straks && !(await rapportTaendt(db, "uge"))) return svar({ ok: true, sendt: 0, grund: "slukket" }, 200);
  const til = plusDage(nu.dato, -1), fra = plusDage(til, -6), fTil = plusDage(fra, -1), fFra = plusDage(fTil, -6);
  const iu = isoUge(fra);
  const mailId = straks ? "uge-proeve-" + nu.dato + "-" + nu.tid : "uge-" + iu.aar + "-" + iu.uge;
  if (!proev) {
    const { data: foer } = await db.from("mail_log").select("id").eq("mail_id", mailId).eq("status", "sendt").limit(1);
    if (foer && foer.length) return svar({ ok: true, sendt: 0, grund: "allerede-sendt" }, 200);
  }

  try {
    /* --- Hjemmesiden --- */
    let web: any = null, webFejl = "";
    try { web = await hjemmesiden(fra, til, fFra, fTil); } catch (e) { webFejl = String(e).slice(0, 80); }

    /* --- Appen: rigtige YOU GOT THIS-kunder (samme regler som status-mail) --- */
    const { data: koder } = await db.from("virksomhedskoder").select("kode,forloeb,aktiv");
    const ygtAlle = (koder || []).filter((k: any) => k.aktiv !== false && /^YOU GOT THIS/i.test(String(k.forloeb || ""))).map((k: any) => String(k.kode || "").toUpperCase()).filter((k: string) => k && EGNE.indexOf(k) < 0);
    const def: Record<string, any> = {};
    if (ygtAlle.length) { const rk = await alle(() => db.from("skema_svar").select("kode,svar").eq("navn", "config").eq("skema", "kunde_def").in("kode", ygtAlle).order("kode")); for (const r of rk) def[String(r.kode || "").toUpperCase()] = r.svar || {}; }
    const ygt = ygtAlle.filter((k: string) => { const d = def[k] || {}; return d.type === "kursus" && !d.test && !d.egen && !d.lukket; });

    const kon = await alle(() => db.from("contacts").select("kunde,kontaktperson,email,source,kommentar,created_at").like("source", "YOU GOT THIS%").order("created_at"));
    const koeb: Record<string, any> = {}; let koebNu = 0, koebFoer = 0, krNu = 0;
    for (const c of kon) {
      const km = String(c.kommentar || ""); const kode = ((km.match(/Kode:\s*([A-Z0-9ÆØÅ_-]+)/i) || [])[1] || "").toUpperCase();
      const rabat = ((km.match(/Rabatkode:\s*([A-Z0-9ÆØÅ_-]+)/i) || [])[1] || "").toUpperCase();
      const mail = String(c.email || "").toLowerCase();
      if (!kode || /test/i.test(String(c.source || "")) || /test/i.test(rabat) || /@energida\.dk$/i.test(mail) || TESTMAILS.indexOf(mail) > -1) continue;
      const d = dkDato(c.created_at); const bm = km.match(/Beløb:\s*(\d+)/);
      koeb[kode] = { dato: d, navn: String(c.kontaktperson || "").trim(), firma: String(c.kunde || "").trim() };
      if (d >= fra && d <= til) { koebNu++; krNu += bm ? Number(bm[1]) : 0; } else if (d >= fFra && d <= fTil) koebFoer++;
    }

    const brug = ygt.length ? await alle(() => db.from("skema_svar").select("kode,svar").in("kode", ygt).eq("skema", "app_brug").order("kode")) : [];
    const sete = ygt.length ? await alle(() => db.from("skema_svar").select("kode,skema,created_at").in("kode", ygt).like("skema", "lektion_set_%").order("created_at")) : [];
    const gjort = ygt.length ? await alle(() => db.from("skema_svar").select("kode,created_at").in("kode", ygt).like("skema", "lektion_gjort_%").order("created_at")) : [];
    const { data: pb } = await db.from("skema_svar").select("svar").eq("kode", "ENERGIDA").eq("navn", "config").eq("skema", "publicering").limit(1);
    const publ: string[] = (pb && pb.length && pb[0].svar && Array.isArray((pb[0].svar as any).lektioner)) ? (pb[0].svar as any).lektioner.map(String) : [];
    publ.sort((a, b) => { const x = a.split("-").map(Number), y = b.split("-").map(Number); return x[0] - y[0] || x[1] - y[1]; });

    const K: Record<string, { sidst: string; dageAktiv: number; dageAktivFoer: number; set: Record<string, boolean> }> = {};
    for (const k of ygt) K[k] = { sidst: "", dageAktiv: 0, dageAktivFoer: 0, set: {} };
    for (const r of brug) { const o = K[String(r.kode || "").toUpperCase()]; if (!o || !r.svar) continue; for (const d of Object.keys(r.svar)) { if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) continue; if (d > o.sidst) o.sidst = d; if (d >= fra && d <= til) o.dageAktiv++; else if (d >= fFra && d <= fTil) o.dageAktivFoer++; } }
    let lekNu = 0, lekFoer = 0;
    for (const r of sete) { const o = K[String(r.kode || "").toUpperCase()]; if (!o) continue; o.set[String(r.skema).slice(12)] = true; const d = dkDato(r.created_at); if (d > o.sidst) o.sidst = d; if (d >= fra && d <= til) lekNu++; else if (d >= fFra && d <= fTil) lekFoer++; }
    let opgNu = 0; for (const r of gjort) { const d = dkDato(r.created_at); if (d >= fra && d <= til) opgNu++; }
    for (let side = 1; side <= 50; side++) {
      const { data, error } = await db.auth.admin.listUsers({ page: side, perPage: 200 }); if (error) break;
      const brugere = (data && data.users) || [];
      for (const u of brugere as any[]) { const o = K[String((u.app_metadata || {}).kode || "").toUpperCase()]; if (!o || !u.last_sign_in_at) continue; const d = dkDato(u.last_sign_in_at); if (d > o.sidst) o.sidst = d; if (d >= fra && d <= til && !o.dageAktiv) o.dageAktiv = 1; }
      if (brugere.length < 200) break;
    }
    const aktiveNu = ygt.filter((k) => K[k].dageAktiv > 0).length, aktiveFoer = ygt.filter((k) => K[k].dageAktivFoer > 0).length;
    /* Hvor står de: næste lektion, de mangler (i publiceringsrækkefølge) — kun kunder, der ikke har været inde i 7 dage */
    const stop: Record<string, number> = {}; const iStaa: { navn: string; under: string; dage: number }[] = [];
    for (const k of ygt) {
      const o = K[k]; const d = dageMellem(o.sidst || (koeb[k] || {}).dato || "", nu.dato);
      const naeste = publ.find((id) => !o.set[id]) || "";
      if (d == null || d < 7) continue;
      if (naeste) stop[naeste] = (stop[naeste] || 0) + 1;
      iStaa.push({ navn: navnStort((koeb[k] || {}).navn || "") || String((def[k] || {}).virksomhed || k), under: (o.sidst ? "Sidst inde for " + d + " dage siden" : "Har ikke logget ind") + (naeste ? " · venter på " + lekNavn(naeste) : ""), dage: d });
    }
    iStaa.sort((a, b) => b.dage - a.dage);
    const stopListe = Object.keys(stop).sort((a, b) => stop[b] - stop[a]).slice(0, 3).map((id) => ({ lektion: lekNavn(id), kunder: stop[id] }));

    const app = { kunder: ygt.length, aktive: aktiveNu, aktiveFoer, lektionerSet: lekNu, lektionerSetFoer: lekFoer, opgaverLavet: opgNu, iStaa: iStaa.length, stopperVed: stopListe, nyeKoeb: koebNu, nyeKoebFoer: koebFoer };
    const tal = { periode: fra + " til " + til, hjemmesiden: web ? { rigtigeBesoeg: web.besoeg, ugenFoer: web.besoegFoer, personer: web.personer, sekunderPrBesoeg: web.sekunder, gikIgenMedDetSammeProcent: web.afvist, fraTelefonProcent: web.telefonPct, kilder: web.kilder, mestSeteSider: web.sider } : "ingen tal", koebPrRigtigtBesoegProcent: web && web.besoeg ? Math.round(koebNu / web.besoeg * 1000) / 10 : null, appen: app };
    if (proev) return svar({ ok: true, proev: true, tal, webFejl: webFejl || undefined }, 200);

    const forsl = await forslag(tal);

    /* ===== 3 · MAILEN — samme husstil som statusmailen ===== */
    /* KORT OG ROLIGT (Ida 24/11: »det her er alt for rodet for mig med emnefeltet - husk nu jeg har giga adhd«): kun navnet i emnet, én rolig linje i forhåndsvisningen */
    const emne = "Ugen der gik";
    const forhaand = "Tre ting til denne uge";
    const F = "font-family:Arial,Helvetica,sans-serif;";
    const tile = (n: string | number, ord: string, under: string) => '<td width="25%" style="padding:0 5px;vertical-align:top;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #DEDEDE;border-radius:14px;background:#FFFFFF;"><tr><td style="padding:14px 12px;' + F + '"><div style="font-size:26px;line-height:1;color:#1A1A1A;">' + esc(n) + '</div><div style="font-size:12px;line-height:1.3;padding-top:6px;color:#686868;">' + esc(ord) + '</div>' + (under ? '<div style="font-size:12px;line-height:1.3;padding-top:3px;color:' + (/^\+/.test(under) || under === "ny" ? "#1F7A3A" : /^-/.test(under) ? "#FC2404" : "#686868") + ';">' + esc(under) + '</div>' : "") + '</td></tr></table></td>';
    const fliser = (a: string[]) => '<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 -5px;"><tr>' + a.join("") + '</tr></table></td></tr>';
    const afsnit = (t: string) => '<tr><td style="padding:26px 0 10px;' + F + 'font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#686868;">' + esc(t) + '</td></tr>';
    const liste = (titel: string, rk: { tekst: string; under?: string }[]) => !rk.length ? "" :
      '<tr><td style="padding:16px 0 6px;' + F + 'font-size:14px;color:#1A1A1A;">' + esc(titel) + '</td></tr><tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #DEDEDE;border-radius:14px;background:#FFFFFF;">'
      + rk.map((r, i) => '<tr><td style="padding:11px 14px;' + (i ? "border-top:1px solid #DEDEDE;" : "") + F + 'font-size:14px;line-height:1.45;color:#1A1A1A;">' + esc(r.tekst) + (r.under ? '<div style="font-size:12.5px;color:#686868;padding-top:2px;">' + esc(r.under) + '</div>' : "") + '</td></tr>').join("") + '</table></td></tr>';
    const fUge = (n: number, f: number) => f || n ? "Ugen før: " + f : "";

    let krop2 = "";
    if (forsl.length) {
      krop2 += afsnit("Tre ting til denne uge");
      krop2 += '<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #FC2404;border-radius:14px;background:#FFFFFF;">'
        + forsl.map((f: any, i: number) => '<tr><td style="padding:14px 16px;' + (i ? "border-top:1px solid #DEDEDE;" : "") + F + 'font-size:15px;line-height:1.45;color:#1A1A1A;"><span style="display:inline-block;width:22px;height:22px;line-height:22px;border-radius:11px;background:#FC2404;color:#FFFFFF;font-size:13px;text-align:center;margin-right:8px;">' + (i + 1) + '</span>' + esc(f.titel) + '<div style="font-size:13px;color:#686868;padding:4px 0 0 30px;">' + esc(f.hvorfor) + '</div></td></tr>').join("") + '</table></td></tr>';
    }
    krop2 += afsnit("Hjemmesiden");
    if (web) {
      krop2 += fliser([tile(web.besoeg, "Rigtige besøg", aendring(web.besoeg, web.besoegFoer)), tile(koebNu, koebNu === 1 ? "Køb" : "Køb", aendring(koebNu, koebFoer)), tile(web.besoeg ? (Math.round(koebNu / web.besoeg * 1000) / 10).toLocaleString("da-DK") + " %" : "–", "Besøg der blev til køb", ""), tile(web.telefonPct + " %", "Kom fra telefon", "")]);
      krop2 += liste("Hvor de kom fra", web.kilder.map((k: any) => ({ tekst: k.kilde + " · " + k.besoeg + " besøg", under: aendring(k.besoeg, k.foer) ? "Ugen før: " + k.foer : "" })));
      krop2 += liste("Mest sete sider", web.sider.map((s: any) => ({ tekst: s.side, under: s.besoeg + " besøg · " + s.sek + " sek. i snit" })));
    } else {
      krop2 += '<tr><td style="' + F + 'font-size:14px;color:#686868;">Google Analytics svarede ikke i denne uge.</td></tr>';
    }
    krop2 += afsnit("Appen");
    krop2 += fliser([tile(aktiveNu + " af " + ygt.length, "Aktive kunder", fUge(aktiveNu, aktiveFoer)), tile(lekNu, "Lektioner set", aendring(lekNu, lekFoer)), tile(opgNu, "Opgaver lavet", ""), tile(iStaa.length, "Gået i stå", "")]);
    krop2 += liste("Her stopper de", stopListe.map((s) => ({ tekst: "Lektion " + s.lektion, under: s.kunder + (s.kunder === 1 ? " kunde venter" : " kunder venter") + " her" })));
    krop2 += liste("Gået i stå (7 dage eller mere)", iStaa.slice(0, 8).map((s) => ({ tekst: s.navn, under: s.under })));
    if (krNu) krop2 += '<tr><td style="padding:14px 0 0;' + F + 'font-size:13px;color:#686868;">Salg i perioden: ' + krNu.toLocaleString("da-DK") + ' kr.</td></tr>';

    const html = '<!doctype html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(emne) + '</title></head><body style="margin:0;background:#F8F8F8;">' + '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F8F8F8;font-size:1px;line-height:1px;">' + esc(forhaand) + '&#8203;&zwnj;&nbsp;'.repeat(60) + '</div>'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F8F8;"><tr><td align="center" style="padding:24px 12px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FFFFFF;border:1px solid #DEDEDE;border-radius:20px;"><tr><td style="padding:28px 24px 30px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
      + '<tr><td style="font-family:Georgia,\'Times New Roman\',serif;font-size:30px;line-height:1.15;color:#1A1A1A;">Ugen der gik</td></tr>'
      + '<tr><td style="padding:4px 0 6px;' + F + 'font-size:13px;color:#686868;">Uge ' + iu.uge + ' · ' + esc(datoOrd(fra)) + ' til ' + esc(datoOrd(til)) + '</td></tr>'
      + krop2
      + '<tr><td style="padding:26px 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#FC2404" style="border-radius:26px;"><a href="https://admin.energida.dk/" style="display:block;padding:16px 20px;' + F + 'font-size:15px;color:#FFFFFF;text-decoration:none;">Åbn Backstage</a></td></tr></table></td></tr>'
      + '</table></td></tr></table></td></tr></table></body></html>';

    const krav = await db.from("mail_log").insert({ email: TIL.toLowerCase(), mail_id: mailId, emne, status: "sendt" }).select("id");
    if (krav.error || !krav.data || !krav.data.length) return svar({ ok: true, sendt: 0, grund: "allerede-sendt" }, 200);
    const rid = krav.data[0].id;
    const noegle = Deno.env.get("BREVO_API_KEY"); if (!noegle) { await db.from("mail_log").update({ status: "fejl", fejl: "ingen Brevo-nøgle" }).eq("id", rid); return svar({ fejl: "ikke-klar" }, 503); }
    let ok = false, besked: string | null = null, brevoId: string | null = null;
    try {
      const r = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: { "api-key": noegle, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ sender: { name: "Energida Backstage", email: "Kontakt@energida.dk" }, to: [{ email: TIL }], subject: emne, htmlContent: html, tags: ["uge"] }) });
      let j: any = null; try { j = await r.json(); } catch (_e) { j = null; }
      ok = r.ok; brevoId = j && j.messageId ? String(j.messageId) : null;
      if (!r.ok) besked = "Brevo " + r.status + (j && j.message ? ": " + String(j.message).slice(0, 200) : "");
    } catch (e) { besked = String(e).slice(0, 200); }
    if (ok) { await db.from("mail_log").update({ brevo_id: brevoId }).eq("id", rid); await rapportGem(db, "uge", emne, html); }
    else await db.from("mail_log").update({ status: "fejl", fejl: besked }).eq("id", rid);
    return svar({ ok, sendt: ok ? 1 : 0, forslag: forsl.length, aiFejl: AI_FEJL || undefined, web: !!web, fejl: ok ? undefined : besked }, ok ? 200 : 502);
  } catch (_e) {
    return svar({ fejl: "Ugerapporten kunne ikke samles." }, 500);
  }
});
