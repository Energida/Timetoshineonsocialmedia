// @ts-nocheck
// MAIL-UR · Edge Function "mail-ur"
//
// Ida 15/11 (klik »Ja, også uret nu«, artifact 8UVw3Hg73NHmyER7PnJEUS): egne mails kan planlægges til en dag og et klokkeslæt.
// Backstage lægger mailen i tabellen mail_planlagt (kun admin, RLS). Databasens ur (pg_cron) kalder denne funktion hvert 5. minut,
// men KUN når der ligger en planlagt mail, hvis tid er nået. Funktionen sender den præcis som mail-udsend: samme regler for
// afmeldte, leads uden ja og »samme mail aldrig to gange«, samme døgnloft og samme afmeldingslink.
//
// Deploy: npx supabase@latest functions deploy mail-ur --project-ref eikcvvppuphnananxcvp --use-api   (Verify JWT TIL — aldrig --no-verify-jwt)
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: TIL.
//   2. Hvem må kalde den: kun databasens ur (pg_cron via pg_net). Kaldet bærer service-role-nøglen fra Supabase Vault
//      (hemmeligheden »mail_ur_noegle«, som Ida selv lægger ind). Ingen bruger, kunde eller admin kan kalde den med sit eget login.
//   3. Egen authorization: ja — Authorization-headeren skal være præcis funktionens egen SUPABASE_SERVICE_ROLE_KEY
//      (sammenlignet i konstant tid), ellers 401. Kaldet tager INTET input: indholdet og modtagerne kommer kun fra mail_planlagt,
//      som kun en admin kan skrive i (RLS: er_admin()).
//   4. Service-role: JA — nødvendig, fordi der ikke er en indlogget kalder. Snæver adgangskontrol foran (linje 3), og nøglen
//      forlader aldrig funktionen. Bruges også som HMAC-hemmelighed til afmeldingslinket, som i mail-udsend.
//   5. Når: mail_planlagt (læse rækker, hvis tid er nået · skrive status/resultat), contacts (læse id, email, status, source,
//      kontaktperson, kunde, mail_ok for de planlagte id'er), mail_afmeldt (læse), mail_log (læse + skrive én række pr. modtager).
//   6. Direkte omkostning: nej — Brevo Free (300 mails/dag delt). Samme lofter som mail-udsend: 250 modtagere pr. mail og
//      280 sendte pr. døgn målt i mail_log. Højst 5 planlagte mails pr. kald.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { "Content-Type": "application/json" } }); }
const LEAD_STATUS = ["lead", "ikke sendt", "kontaktet", "ikke igang"];
const AFMELD_SIDE = "https://b2b.energida.dk/afmeld.html";
const MAKS_KALD = 250, MAKS_DOEGN = 280, MAKS_PR_KALD = 5;

function ens(a: string, b: string) {   /* konstant tid */
  if (!a || !b || a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0;
}
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
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);
  const noegleSR = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const kaldt = String(req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!ens(kaldt, noegleSR)) return svar({ fejl: "Ingen adgang." }, 401);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, noegleSR);
  const { data: rk, error: rkFejl } = await db.from("mail_planlagt").select("id").eq("status", "venter").lte("send_kl", new Date().toISOString()).order("send_kl").limit(MAKS_PR_KALD);
  if (rkFejl) return svar({ fejl: "Kunne ikke læse de planlagte mails." }, 500);
  const brevo = Deno.env.get("BREVO_API_KEY");
  const funkUrl = Deno.env.get("SUPABASE_URL")! + "/functions/v1/mail-afmeld";
  const ud: any[] = [];

  for (const r0 of rk || []) {
    /* tag rækken: kun én kørsel kan flytte den fra »venter« til »sender« */
    const { data: taget } = await db.from("mail_planlagt").update({ status: "sender" }).eq("id", r0.id).eq("status", "venter").select("*");
    const p = taget && taget[0]; if (!p) continue;
    const slut = async (status: string, resultat: any) => { await db.from("mail_planlagt").update({ status, resultat, sendt_kl: new Date().toISOString() }).eq("id", p.id); ud.push({ id: p.id, status, ...resultat }); };
    if (!brevo) { await db.from("mail_planlagt").update({ status: "venter" }).eq("id", p.id); return svar({ fejl: "ikke-klar" }, 503); }
    const mailId = String(p.mail_id || "").slice(0, 80), emne = String(p.emne || "").slice(0, 200), html = String(p.html || "");
    const fraNavn = String(p.fra || "Energida").replace(/[\r\n<>"]/g, "").trim().slice(0, 60) || "Energida";
    const ids = Array.from(new Set((p.kontakter || []).map((x: any) => String(x)))).slice(0, MAKS_KALD);
    if (!mailId || !emne || !html || html.indexOf("{afmeld}") < 0) { await slut("fejl", { besked: "Mailen manglede emne, tekst eller afmeldingslink." }); continue; }
    if (!ids.length) { await slut("sendt", { sendt: 0, fejl: 0, sprunget: {} }); continue; }

    const { data: kontakter } = await db.from("contacts").select("id,email,status,source,kontaktperson,kunde,mail_ok").in("id", ids);
    const { data: afm } = await db.from("mail_afmeldt").select("email");
    const afmeldt = new Set((afm || []).map((x: any) => String(x.email).toLowerCase()));
    const { data: tidl } = await db.from("mail_log").select("email").eq("mail_id", mailId).eq("status", "sendt");
    const sendtFoer = new Set((tidl || []).map((x: any) => String(x.email).toLowerCase()));
    const modt: any[] = [], sprunget = { udenMail: 0, afmeldt: 0, ikkeJa: 0, alleredeSendt: 0 }, sete = new Set<string>();
    for (const k of (kontakter || []) as any[]) {
      const e = String(k.email || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { sprunget.udenMail++; continue; }
      if (sete.has(e)) continue; sete.add(e);
      if (afmeldt.has(e)) { sprunget.afmeldt++; continue; }
      const erLead = LEAD_STATUS.indexOf(String(k.status || "").trim().toLowerCase()) >= 0 && String(k.source || "").trim() !== "Gamle kunder";
      if (k.mail_ok === false || (erLead && k.mail_ok !== true)) { sprunget.ikkeJa++; continue; }
      if (sendtFoer.has(e)) { sprunget.alleredeSendt++; continue; }
      modt.push({ id: k.id, email: e, navn: String(k.kontaktperson || "").trim().split(/\s+/)[0] || String(k.kunde || "").trim() });
    }
    const doegn = new Date(Date.now() - 864e5).toISOString();
    const { count } = await db.from("mail_log").select("id", { count: "exact", head: true }).eq("status", "sendt").gte("created_at", doegn);
    if ((count || 0) + modt.length > MAKS_DOEGN) { await db.from("mail_planlagt").update({ status: "venter", send_kl: new Date(Date.now() + 3600e3).toISOString(), resultat: { besked: "Døgnloftet var nået — prøver igen om en time." } }).eq("id", p.id); continue; }

    let sendt = 0, fejl = 0;
    for (const m of modt) {
      const e64 = b64url(m.email), t = await underskrift(m.email);
      const side = AFMELD_SIDE + "?e=" + e64 + "&t=" + t;
      const personlig = maerk(html.replace(/\{navn\}/g, rens(m.navn)).replace(/\{afmeld\}/g, side), mailId);
      let status = "fejl", brevoId: string | null = null, besked: string | null = null;
      try {
        const r = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "api-key": brevo, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            sender: { name: fraNavn, email: "Kontakt@energida.dk" },
            replyTo: { email: "Kontakt@energida.dk", name: "Energida" },
            to: [{ email: m.email }],
            subject: emne,
            htmlContent: personlig,
            headers: { "List-Unsubscribe": "<" + funkUrl + "?e=" + e64 + "&t=" + t + ">", "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
            tags: ["planlagt", mailId.slice(0, 50)],
          }),
        });
        let j: any = null; try { j = await r.json(); } catch (_e) { j = null; }
        if (r.ok) { status = "sendt"; brevoId = j && j.messageId ? String(j.messageId) : null; sendt++; }
        else { besked = "Brevo " + r.status + (j && j.message ? ": " + String(j.message).slice(0, 200) : ""); fejl++; }
      } catch (x) { besked = String(x).slice(0, 200); fejl++; }
      await db.from("mail_log").insert({ contact_id: m.id, email: m.email, mail_id: mailId, emne, status, brevo_id: brevoId, fejl: besked });
    }
    await slut(fejl && !sendt ? "fejl" : "sendt", { sendt, fejl, sprunget });
  }
  return svar({ ok: true, behandlet: ud.length }, 200);
});
