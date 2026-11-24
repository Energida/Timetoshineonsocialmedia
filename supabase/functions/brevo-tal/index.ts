// BREVO-TAL · Edge Function "brevo-tal"
//
// Ida 19/11 (»denne synkronisere ikke! der er jo ligesom ikke kun 1 der har klikket i min mail med alle dem der har været inde og se!!!« ·
// »de andre vil jeg kunne se hvor tallene kommer fra - altså hvilke kunder det drejer sig om«): Hjems flise »Klik i dine mails« talte kun
// Google Analytics (kun energida.dk, ikke appen) og appens egne klik (kun når kunden loggede ind bagefter). Mailene sendes gennem Brevo
// (mail-udsend), og Brevo tæller selv hvert klik. Denne funktion LÆSER Brevos hændelser for de sidste 30 dage: hvem der fik mailen, og hvem der klikkede.
//
// Deploy: npx supabase@latest functions deploy brevo-tal --project-ref eikcvvppuphnananxcvp --use-api   (Verify JWT TIL)
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: TIL.
//   2. Hvem må kalde den: kun administratorer (er_admin() spurgt SOM kalderen, §4 — samme mønster som mailchimp-tal).
//   3. Egen authorization: ja — kalderens token, er_admin() skal svare true, ellers 403. Uden token 401.
//   4. Service-role: NEJ.
//   5. Når: ingen tabeller i Supabase. Læser kun Brevos hændelseslog (GET /v3/smtp/statistics/events: requests + clicks, 30 dage) med BREVO_API_KEY
//      (sat af Ida til mail-udsend; Claude har aldrig set den). Sender, ændrer og sletter intet i Brevo. Svarer med e-mailadresser på dem, der fik og
//      klikkede på mailen — kun til admin.
//   6. Direkte omkostning: nej (læsning er gratis i Brevo Free; højst 6 kald pr. åbning af Hjem).
//   ÆNDRING 22/11 (Ida: »det her må KUN være mails til kunder som jeg ser på«): mails til Idas egne adresser og prøver tælles ikke. De seks linjer er uændrede:
//   samme adgang (kun administratorer), samme kald til Brevo, ingen tabel, ingen ny hemmelighed.
//   ÆNDRING 24/11 (Ida: »Ja, ret det hele«): info.energida+…@gmail.com og @coastmail.dk (testprofiler) tælles heller ikke. De seks linjer er uændrede.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } }); }

async function haendelser(noegle: string, event: string) {
  const ud: any[] = [];
  for (let side = 0; side < 3; side++) {   // højst 3 x 2500 hændelser pr. slags
    const r = await fetch("https://api.brevo.com/v3/smtp/statistics/events?limit=2500&offset=" + side * 2500 + "&days=30&sort=desc&event=" + event, { headers: { "api-key": noegle, Accept: "application/json" } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error("Brevo svarede " + r.status + ": " + String((j && (j.message || j.code)) || "").slice(0, 200));
    const ev = (j && j.events) || []; ud.push(...ev);
    if (ev.length < 2500) break;
  }
  return ud;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);
  const jwt = String(req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const somKalder = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: "Bearer " + jwt } } });
  const { data: erAdmin, error: adminFejl } = await somKalder.rpc("er_admin");
  if (adminFejl) return svar({ fejl: "Kunne ikke slå din adgang op." }, 401);
  if (erAdmin !== true) return svar({ fejl: "Kun administratorer kan se mailtallene." }, 403);

  const noegle = Deno.env.get("BREVO_API_KEY") || "";
  if (!noegle) return svar({ fejl: "ikke-klar" }, 503);
  try {
    const [sendt, klik] = await Promise.all([haendelser(noegle, "requests"), haendelser(noegle, "clicks")]);
    // én mail = ét emne (mail-udsend sender samme emne til alle modtagere af en udsendelse)
    const pr: Record<string, { navn: string; sendt: Set<string>; klikkere: Record<string, { klik: number; sidst: string; links: string[] }>; tid: string }> = {};
    const hent = (emne: string) => (pr[emne] = pr[emne] || { navn: emne || "Uden emne", sendt: new Set(), klikkere: {}, tid: "" });
    /* KUN MAILS TIL KUNDER (Ida 22/11: »det her må KUN være mails til kunder som jeg ser på«): prøver, statusmails, »Nyt køb« og alt andet, der går til Ida selv,
       tælles ikke — hverken som sendt eller som klik. En mail, der kun er gået til Idas egne adresser, forsvinder dermed helt fra listen.
       Egne adresser: alt på energida.dk, husets testadresser, og adresser med »test« før @ (testprofilerne, fx navn+test@…). */
    const EGNE = ["info.energida@gmail.com"];
    const erEgen = (mail: string) => { const m = String(mail || "").trim().toLowerCase(); if (!m) return true; const [navn, dom] = m.split("@"); return dom === "energida.dk" || EGNE.indexOf(m) > -1 || /test/.test(navn || "") || /^idatjessen(\+|$)/.test(navn || "") || /^info\.energida(\+|$)/.test(navn || "") && dom === "gmail.com" || dom === "coastmail.dk"; };   /* 24/11: også info.energida+…@gmail.com og coastmail-testprofilerne (ole+…), fundet ved gennemgangen af Hjem */
    const internt = (emne: string) => /^\s*Prøve\s*·/i.test(emne);   /* en prøve er altid til Ida selv, også hvis den sendes til en anden af hendes adresser */
    for (const e of sendt) { if (erEgen(e.email) || internt(String(e.subject || ""))) continue; const m = hent(String(e.subject || "")); if (e.email) m.sendt.add(String(e.email).toLowerCase()); if (!m.tid || String(e.date) > m.tid) m.tid = String(e.date || ""); }
    for (const e of klik) {
      if (erEgen(e.email) || internt(String(e.subject || ""))) continue;
      const m = hent(String(e.subject || "")); const em = String(e.email || "").toLowerCase(); if (!em) continue;
      if (String(e.link || "").indexOf("mail-afmeld") > -1) continue;   // et klik på »Afmeld« er ikke et klik på indholdet
      const k = (m.klikkere[em] = m.klikkere[em] || { klik: 0, sidst: "", links: [] }); k.klik++;
      if (String(e.date) > k.sidst) k.sidst = String(e.date || "");
      const l = String(e.link || "").split("?")[0]; if (l && k.links.indexOf(l) < 0 && k.links.length < 5) k.links.push(l);
    }
    const mails = Object.values(pr).map((m) => {
      const kl = Object.entries(m.klikkere).map(([email, x]) => ({ email, klik: x.klik, sidst: x.sidst, links: x.links })).sort((a, b) => b.sidst.localeCompare(a.sidst));
      const n = Math.max(m.sendt.size, kl.length);
      return { navn: m.navn, sendt: n, klik: kl.length, klikrate: n ? kl.length / n : 0, tid: m.tid, klikkere: kl };
    }).filter((m) => m.sendt > 0 || m.klik > 0).sort((a, b) => b.tid.localeCompare(a.tid)).slice(0, 12);
    return svar({ ok: true, mails }, 200);
  } catch (e) {
    return svar({ fejl: String((e as Error).message || e).slice(0, 300) }, 502);
  }
});
