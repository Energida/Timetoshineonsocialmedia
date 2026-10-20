// MAIL-SEND · Edge Function "mail-send"
//
// Ida 19/10: »ville det nemmeste ikke være at vi selv kunne sende mails fra eget system?« — klik »Byg den som buddet«
// (Artifact GXP8g2nQ6D3hTqeugCoYvX). Backstage › Mails sender en PRØVE af en velkomstmail gennem Brevo.
// Prøven går KUN til kalderens egen login-mail — modtageren kan ikke vælges af den, der kalder.
// Automatisk udsendelse til kunder er IKKE bygget her: den kommer først, når mailens ord er Idas egne (Idas ja).
//
// Deploy: npx supabase@latest functions deploy mail-send --project-ref eikcvvppuphnananxcvp --use-api   (Verify JWT TIL — aldrig --no-verify-jwt)
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: TIL.
//   2. Hvem må kalde den: kun administratorer (er_admin() spurgt SOM kalderen, §4).
//   3. Egen authorization: ja — kalderens token → getUser (mailadressen) + er_admin() skal svare true, ellers 403.
//   4. Service-role: NEJ. Funktionen rører ingen tabel; den kalder kun auth.getUser og er_admin() som kalderen.
//   5. Når: ingen data i Supabase. Sender én mail via Brevo-API'et (BREVO_API_KEY, Idas nøgle »Energida mails«) til kalderens egen adresse.
//   6. Direkte omkostning: nej — Brevo Free (300 mails/dag delt). Én mail pr. tryk; loft på 20 prøver pr. kald-instans pr. time.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } }); }

/* Links til egne sider får mærket, så live-overblikket kan tælle klik fra mailen (utm_medium=email, utm_campaign = mailens navn) */
function maerk(html: string, kampagne: string) {
  return html.replace(/href="(https:\/\/(?:[a-z0-9-]+\.)*energida\.dk[^"]*)"/gi, function (_m, url: string) {
    if (/[?&]utm_medium=/.test(url)) return 'href="' + url + '"';
    const [uden, hash] = url.split("#");
    const ny = uden + (uden.indexOf("?") >= 0 ? "&" : "?") + "utm_source=brevo&utm_medium=email&utm_campaign=" + encodeURIComponent(kampagne);
    return 'href="' + ny + (hash != null ? "#" + hash : "") + '"';
  });
}

const sendt: number[] = [];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);
  const jwt = String(req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const somKalder = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: "Bearer " + jwt } } });
  const { data: bruger, error: brugerFejl } = await somKalder.auth.getUser(jwt);
  const mail = bruger?.user?.email;
  if (brugerFejl || !mail) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const { data: erAdmin, error: adminFejl } = await somKalder.rpc("er_admin");
  if (adminFejl) return svar({ fejl: "Kunne ikke slå din adgang op." }, 401);
  if (erAdmin !== true) return svar({ fejl: "Kun administratorer kan sende prøver." }, 403);

  let krop: { emne?: string; html?: string; navn?: string; fra?: string } = {};
  try { krop = await req.json(); } catch (_e) { return svar({ fejl: "Mailen manglede." }, 400); }
  const emne = String(krop.emne || "").trim().slice(0, 200);
  const html = String(krop.html || "");
  const navn = String(krop.navn || "velkomstmail").trim().slice(0, 80);
  /* Afsenderens NAVN kan Ida rette (19/10 »jeg skal kunne redigere i ALT«); adressen er altid Kontakt@energida.dk (Brevo-godkendt) */
  const fraNavn = String(krop.fra || "Energida").replace(/[\r\n<>"]/g, "").trim().slice(0, 60) || "Energida";
  if (!emne || !html || html.length > 200000) return svar({ fejl: "Mailen manglede emne eller tekst." }, 400);

  const nu = Date.now(); while (sendt.length && nu - sendt[0] > 3600e3) sendt.shift();
  if (sendt.length >= 20) return svar({ fejl: "Der er sendt 20 prøver den sidste time. Vent lidt." }, 429);

  const noegle = Deno.env.get("BREVO_API_KEY"); if (!noegle) return svar({ fejl: "ikke-klar" }, 503);
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": noegle, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: fraNavn, email: "Kontakt@energida.dk" },
      replyTo: { email: "Kontakt@energida.dk", name: "Energida" },
      to: [{ email: mail }],
      subject: "Prøve · " + emne,
      htmlContent: maerk(html, navn),
      tags: ["proeve", navn.slice(0, 50)],
    }),
  });
  let j: any = null; try { j = await r.json(); } catch (_e) { j = null; }
  if (!r.ok) return svar({ fejl: "Brevo svarede " + r.status + (j && j.message ? ": " + String(j.message).slice(0, 200) : "") }, 502);
  sendt.push(nu);
  return svar({ ok: true, til: mail, id: j && j.messageId }, 200);
});
