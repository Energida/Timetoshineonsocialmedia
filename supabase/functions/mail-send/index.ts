// @ts-nocheck
// MAIL-SEND · Edge Function "mail-send"
//
// Ida 19/10: »ville det nemmeste ikke være at vi selv kunne sende mails fra eget system?« — klik »Byg den som buddet«
// (Artifact GXP8g2nQ6D3hTqeugCoYvX). Backstage › Mails sender en PRØVE af en velkomstmail gennem Brevo.
// Prøven går KUN til kalderens egen login-mail — modtageren kan ikke vælges af den, der kalder.
// Automatisk udsendelse til kunder er IKKE bygget her: den kommer først, når mailens ord er Idas egne (Idas ja).
//
// Deploy: npx supabase@latest functions deploy mail-send --project-ref eikcvvppuphnananxcvp --use-api   (Verify JWT TIL — aldrig --no-verify-jwt)
//
// 11/11 VELKOMSTMAILEN (Ida: »Vil du ikke ændre det?!!!«): tilstanden {art:"velkomst"} kaldes af kundens app, når profilen er
// oprettet. Kalderen bestemmer INTET: modtager = kalderens egen login-mail, indhold = Idas tekst i mail_tekster.velkomst
// (eller standarden herunder), {navn} = user_metadata.hilsen, {kollegakode} = app_metadata.kode. Sendes kun, når Ida har
// tændt mailen (aktiv === true) og kun én gang pr. adresse (mail_log, mail_id "velkomst"). Service-role bruges KUN i denne
// tilstand og kun til at læse mail_tekster og læse/skrive mail_log.
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

/* ===== MAILENS HTML — samme kode som Backstage › Mails (mailsHtml i index.html), så det sendte er det, Ida ser i forhåndsvisningen ===== */
function esc(s: any) { return (s || "").toString().replace(/[&<>"]/g, (c: string) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" } as any)[c]); }
const MAILS_STD_FOTO = "https://b2b.energida.dk/mail/hero.jpg";
function mailsHarIndhold(m) { return (m.fliser || []).some(function (f) { return String(f.tekst || "").trim() || String(f.forslag || "").trim() || f.src || (f.t === "knap" && String(f.tekst || "").trim()); }); }
function mailsTekstHtml(t, midt) {
  const al = midt ? "center" : "left";
  return String(t || "").split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean).map(function (p) {
    return '<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#1A1A1A;text-align:' + al + ';">' + esc(p).replace(/\n/g, "<br>") + '</p>';
  }).join("");
}
function mailsHtml(m, o) {
  o = o || {};
  const navn = o.navn || "{navn}";
  /* {kollegakode}: forhaandsvisningen faar en eksempelkode. TRIN 2 (IKKE BYGGET): serveren (mail-udsend/den planlagte funktion) erstatter {kollegakode} med kundens egen kode fra virksomhedskoder/app_metadata.kode pr. modtager — foer da staar flettekoden ubehandlet i en rigtig mail. */
  const sub = function (t) { return String(t || "").replace(/\{navn\}/g, navn).replace(/\{kollegakode\}/g, o.kollegakode || "{kollegakode}"); };
  const fl = (m.fliser || []).map(function (f) {
    if (f.t === "billede") return f.src ? '<tr><td class="ind" style="padding:16px 16px 0;"><img src="' + esc(f.src) + '" width="568" alt="" style="display:block;width:100%;max-width:568px;height:auto;border:0;"></td></tr>' : '';
    if (f.t === "knap") return String(f.tekst || "").trim() ? '<tr><td class="ind" style="padding:16px 16px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#FC2404" style="border-radius:999px;"><a href="' + esc(String(f.link || "").trim() || "https://energida.dk/") + '" style="display:block;padding:15px 20px;font-family:Poppins,Arial,sans-serif;font-size:17px;color:#ffffff;text-decoration:none;border-radius:999px;">' + esc(f.tekst) + '</a></td></tr></table></td></tr>' : '';
    let ind = "";
    if (f.et) ind += '<div style="font-size:20px;font-weight:600;line-height:1.3;color:#1A1A1A;text-align:' + (f.midt ? "center" : "left") + ';margin:0 0 12px;">' + esc(f.et) + '</div>';   /* FED OVERSKRIFT (Ida 11/11): 20 px, 600, sort, ingen streg under */
    ind += mailsTekstHtml(sub(f.tekst), f.midt);
    if (String(f.forslag || "").trim()) {
      ind += o.marker
        ? '<div style="margin:2px 0 12px;padding-left:12px;border-left:2px solid #DEDAD4;"><div style="font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:#9A9590;margin-bottom:4px;">Ikke dine ord</div><div style="color:#6F6B66;">' + mailsTekstHtml(sub(f.forslag)).replace(/color:#1A1A1A/g, "color:#6F6B66") + '</div></div>'
        : mailsTekstHtml(sub(f.forslag), f.midt);
    }
    if (f.harKode) ind += '<div style="border:1px solid #DEDAD4;border-radius:14px;padding:12px 14px;margin:4px 0 0;"><div style="font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:#9A9590;">Din kode</div><div style="font-size:16px;letter-spacing:1px;color:#FC2404;margin-top:4px;">' + (String(f.kode || "").trim() ? esc(sub(f.kode)) : (o.marker ? "Koden mangler" : "")) + '</div></div>';
    if (f.knap) ind += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#FC2404" style="border-radius:999px;"><a href="' + esc(o.knapUrl || "https://b2b.energida.dk/") + '" style="display:block;padding:15px 20px;font-family:Poppins,Arial,sans-serif;font-size:17px;color:#ffffff;text-decoration:none;border-radius:999px;">' + esc(f.knap) + '</a></td></tr></table>';
    if (f.lille) ind += '<p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:#6F6B66;text-align:center;">' + esc(f.lille) + '</p>';
    { const k = ind.lastIndexOf("margin:0 0 12px;"); if (k >= 0 && ind.slice(k).indexOf("<div") < 0 && ind.slice(k).indexOf("<table") < 0) ind = ind.slice(0, k) + "margin:0;" + ind.slice(k + 16); }
    return '<tr><td class="ind" style="padding:16px 16px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #EDEAE5;border-radius:16px;"><tr><td style="padding:20px 22px;font-family:Poppins,Arial,sans-serif;">' + ind + '</td></tr></table></td></tr>';
  }).join("");
  const tom = !mailsHarIndhold(m) ? '<tr><td class="ind" style="padding:16px 16px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #EDEAE5;border-radius:16px;"><tr><td style="padding:20px 22px;font-family:Poppins,Arial,sans-serif;font-size:15px;color:#FC2404;">Dine ord mangler</td></tr></table></td></tr>' : "";
  return '<!doctype html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">'
    + '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap" rel="stylesheet">'
    + '<style>body{margin:0;padding:0;background:#F2F0ED} @media (max-width:520px){.ind{padding-left:12px!important;padding-right:12px!important} .firma{white-space:normal!important} .fsep{display:block;height:0;overflow:hidden;font-size:0} .hero{height:240px!important}}</style></head>'
    + '<body style="margin:0;padding:0;background:#F2F0ED;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F2F0ED;"><tr><td align="center" style="padding:16px 0 32px;">'
    + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">'
    + '<tr><td class="ind" style="padding:0 16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="hero" background="' + esc(m.foto || MAILS_STD_FOTO) + '" bgcolor="#3A3936" height="380" style="background:#3A3936 url(\'' + esc(m.foto || MAILS_STD_FOTO) + '\') center/cover no-repeat;height:380px;"></td></tr></table></td></tr>'
    + fl + tom
    + '<tr><td align="center" style="padding:28px 16px 0;font-family:Poppins,Arial,sans-serif;"><p style="margin:0 0 24px;font-size:14px;color:#1A1A1A;">Er der noget, der driller? Så svar på denne mail.</p>'
    + '<img src="https://b2b.energida.dk/mail/logo.png" width="60" alt="Energida" style="display:block;margin:0 auto 14px;width:60px;height:auto;border:0;">'
    + '<p class="firma" style="margin:0;font-size:10.5px;line-height:1.7;color:#6F6B66;white-space:nowrap;"><span style="white-space:nowrap;">Kontakt@energida.dk · +45 28 60 30 36</span><span class="fsep"> · </span><span style="white-space:nowrap;">Holstebrovej 80, 6950 Ringkøbing · CVR: 45114651</span></p></td></tr>'
    + (o.afmeld ? '<tr><td align="center" style="padding:14px 16px 0;font-family:Poppins,Arial,sans-serif;"><p style="margin:0;font-size:11px;line-height:1.6;color:#9A9590;">Vil du ikke have flere mails fra Energida? <a href="' + (o.afmeld === true ? '{afmeld}' : '#') + '" style="color:#9A9590;text-decoration:underline;">Afmeld her</a></p></td></tr>' : '')   /* AFMELDING (23/10): kun i mails, der sendes til kunder/leads — mail-udsend skriver det personlige link ind i {afmeld} */
    + '</table></td></tr></table></body></html>';
}
const MAIL_STD: Record<string, { emne: string; fliser: any[] }> = {"login":{"emne":"Klar til at shine? Dit Content Studio venter","fliser":[{"et":"Dit login","midt":true,"tekst":"Du vælger en adgangskode, og så er du inde.\nKlik her for at komme i gang 👇🏻","knap":"Let’s go","lille":"Linket virker i 24 timer og kun én gang. Har du ikke tilmeldt dig, kan du se bort fra mailen."}]},"velkomst":{"emne":"Her er din adgang og kollegakoden – gem denne mail","fliser":[{"et":"Din profil er klar","tekst":"Hej {navn}\n\nNu kan du gå i gang. Her er linket og det, du skal bruge. Gem gerne denne mail, så har du det hele samlet.\n\nb2b.energida.dk\nLog ind med din e-mail og den adgangskode, du valgte, da du oprettede din profil."},{"t":"knap","tekst":"Åbn dit forløb","link":"https://b2b.energida.dk/"},{"et":"Hent appen til din telefon","tekst":"Så ligger den sammen med dine andre apps og kan åbnes med ét tryk."},{"et":"iPhone","tekst":"1. Åbn b2b.energida.dk i Safari."},{"et":"","tekst":"2. Tryk på Del, eventuelt via menuen."},{"et":"","tekst":"3. Vælg “Føj til hjemmeskærm”."},{"et":"","tekst":"4. Slå “Åbn som webapp” til, hvis muligheden vises, og tryk på “Tilføj”."},{"et":"Android","tekst":"1. Åbn b2b.energida.dk i Chrome."},{"et":"","tekst":"2. Tryk på de tre prikker."},{"et":"","tekst":"3. Vælg “Installer og opret genvej” eller “Føj til startskærm”, og følg vejledningen."},{"et":"Tag op til to kolleger med","tekst":"Du kan give op til to kolleger i din virksomhed adgang til forløbet. Jeres kollegakode er:","kode":"{kollegakode}","harKode":true},{"et":"","tekst":"Dine kolleger går til b2b.energida.dk, vælger “Jeg har en kode” og bruger koden til at oprette deres eget login. I får altså hver jeres login og adgangskode.","lille":"Markér koden og kopiér den, eller svar på denne mail, hvis du vil have den sendt igen."},{"t":"billede","src":"https://b2b.energida.dk/mail/login-crop.jpg"},{"et":"Koden er til jer","tekst":"Ligesom du passer på din forretning, passer jeg på min. Derfor er adgangen til dig og op til to kolleger i din virksomhed, og jeg er glad, hvis koden og undervisningen bliver hos jer."},{"et":"Jeg vil gerne høre fra dig","tekst":"Jeg bliver rigtig glad for feedback, både det gode og det, der ikke fungerer, så jeg kan blive bedre. Svar bare på denne mail.\n\nKærlig hilsen\nIda"}]}};
/* ===== SLUT PÅ MAILENS HTML ===== */

const sendt: number[] = [];

/* VELKOMSTMAILEN (11/11) — se toppen. Svarer altid 200 med en grund, så kundens app aldrig viser en fejl. */
async function sendVelkomst(bruger: any) {
  const mail = String(bruger?.email || "").trim();
  if (!mail) return svar({ ok: false, grund: "ingen-mail" }, 200);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: rk } = await db.from("skema_svar").select("svar").eq("kode", "ENERGIDA").eq("navn", "Ida").eq("skema", "mail_tekster").limit(1);
  const g: any = rk && rk.length && rk[0].svar && typeof rk[0].svar === "object" ? rk[0].svar.velkomst : null;
  if (!g || g.aktiv !== true) return svar({ ok: false, grund: "slukket" }, 200);
  const { data: tidl } = await db.from("mail_log").select("id").eq("mail_id", "velkomst").eq("email", mail).eq("status", "sendt").limit(1);
  if (tidl && tidl.length) return svar({ ok: true, allerede: true }, 200);
  const std = MAIL_STD.velkomst;
  const m: any = { emne: String(g.emne || "").trim() || std.emne, foto: g.foto || "", fliser: Array.isArray(g.fliser) && g.fliser.length ? g.fliser : std.fliser };
  if (!mailsHarIndhold(m)) m.fliser = std.fliser;
  const md = bruger.user_metadata || {}, am = bruger.app_metadata || {};
  const fornavn = String(md.hilsen || md.navn || "").trim().split(/\s+/)[0] || "";
  const kode = String(am.kode || "").trim();
  if (!kode) m.fliser = m.fliser.filter((f: any) => !(f && f.harKode));   /* ingen kode at vise: kodekortet springes over, aldrig en rå flettekode */
  const html = maerk(mailsHtml(m, { navn: fornavn, kollegakode: kode, knapUrl: "https://b2b.energida.dk/" }), "velkomst");
  const noegle = Deno.env.get("BREVO_API_KEY"); if (!noegle) return svar({ ok: false, grund: "ikke-klar" }, 200);
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": noegle, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: String(g.fra || "Energida").replace(/[\r\n<>"]/g, "").slice(0, 60) || "Energida", email: "Kontakt@energida.dk" },
      replyTo: { email: "Kontakt@energida.dk", name: "Energida" },
      to: [{ email: mail }],
      subject: m.emne,
      htmlContent: html,
      tags: ["velkomst"],
    }),
  });
  let j: any = null; try { j = await r.json(); } catch (_e) { j = null; }
  const status = r.ok ? "sendt" : "fejl";
  try { await db.from("mail_log").insert({ email: mail, mail_id: "velkomst", emne: m.emne, status, brevo_id: j && j.messageId ? String(j.messageId) : null, fejl: r.ok ? null : ("Brevo " + r.status + (j && j.message ? ": " + String(j.message).slice(0, 200) : "")) }); } catch (_e) {}
  return svar({ ok: r.ok, grund: r.ok ? "sendt" : "brevo-fejl" }, 200);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);
  const jwt = String(req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return svar({ fejl: "Du er ikke logget ind." }, 401);
  const somKalder = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: "Bearer " + jwt } } });
  const { data: bruger, error: brugerFejl } = await somKalder.auth.getUser(jwt);
  const mail = bruger?.user?.email;
  if (brugerFejl || !mail) return svar({ fejl: "Du er ikke logget ind." }, 401);
  let krop: { art?: string; emne?: string; html?: string; navn?: string; fra?: string } = {};
  try { krop = await req.json(); } catch (_e) { krop = {}; }
  if (krop.art === "velkomst") return await sendVelkomst(bruger.user);   /* kundens egen velkomstmail — kalderen bestemmer intet */
  const { data: erAdmin, error: adminFejl } = await somKalder.rpc("er_admin");
  if (adminFejl) return svar({ fejl: "Kunne ikke slå din adgang op." }, 401);
  if (erAdmin !== true) return svar({ fejl: "Kun administratorer kan sende prøver." }, 403);

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
