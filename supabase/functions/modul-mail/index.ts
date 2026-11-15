// MODUL-MAIL · Edge Function "modul-mail"
//
// Ida 14/11: »mail, når ugens modul åbner — denne skal vi have styr på« · »byg uret«.
// Uret (pg_cron i databasen) kalder funktionen hver time. Funktionen finder de logins på YOU GOT THIS-koder
// (og Gratis kursusadgang), hvis modul åbner i dag, og sender Idas mail »Når ugens modul åbner« fra Backstage › Mails.
// INTET sendes, før Ida har skrevet teksten OG tændt mailen (mail_tekster.modul.aktiv === true).
//
// Deploy: Claude via Supabase Management API med tokenet i ~/.supabase/access-token (aldrig CLI — nøgleringen, 19/10)
//         ELLER Ida via dashboardets editor. Verify JWT: FRA (se linje 1).
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: FRA. Begrundelse: kaldes af databasens ur (pg_cron + pg_net), som ikke har et brugerlogin.
//      Mønster: mailchimp-webhook (lukket 21/8).
//   2. Hvem må kalde den: kun den, der kender hemmeligheden MODUL_MAIL_NOEGLE (sendt i headeren x-ur-noegle).
//      Ida sætter den selv — i Supabase › Edge Functions › Secrets og i databasens Vault. Claude sætter den aldrig.
//   3. Egen authorization: JA — hemmeligheden tjekkes som det ALLERFØRSTE. Mangler den på serveren → 503,
//      forkert/ingen → 401. Databasen røres først bagefter. Kalderen kan intet vælge: ingen modtagere, ingen tekst,
//      ingen datoer i kaldet — kun { proev: true }, som sender intet og svarer med tal.
//   4. Service-role: JA, men først EFTER verificeret hemmelighed (§4: der er ingen bruger at spørge som).
//   5. Når: virksomhedskoder (læse kode, forloeb, aktiv) · lektion_oevelser (læse »ygt:dage«) · skema_svar (læse kunde_def + ygt_start pr. kode og
//      ENERGIDA/Ida/mail_tekster) · auth.users (læse e-mail, navn og kode via listUsers) · mail_afmeldt (læse) ·
//      mail_log (læse + skrive én række pr. sendt mail). Skriver intet andet.
//   6. Direkte omkostning: nej — Brevo Free (300 mails/dag delt). Loft: 200 pr. kald og 280 sendte pr. døgn
//      målt i mail_log. Samme modul sendes aldrig to gange til samme adresse (unikt indeks mail_log_en_gang).
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { "Content-Type": "application/json" } }); }

/* Samme tal som YGT_DAG i index.html (modul 1 og 2 på dag 0, derefter et modul hver 7. dag). Modul 3 = »Modul 2« for kunden (modulVisNr). */
const YGT_DAG: Record<string, number> = { "1": 0, "2": 0, "3": 7, "4": 14, "5": 21, "6": 28, "7": 35, "8": 42, "9": 49, "10": 56, "11": 63 };
const MAKS_KALD = 200, MAKS_DOEGN = 280;

function plusDage(iso: string, n: number) { const p = iso.split("-").map(Number); const d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + n)); return d.toISOString().slice(0, 10); }
function nuDK() {
  const dele = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Copenhagen", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const v = (t: string) => (dele.find((x) => x.type === t) || { value: "" }).value;
  return { dato: v("year") + "-" + v("month") + "-" + v("day"), tid: (v("hour") === "24" ? "00" : v("hour")) + ":" + v("minute") };
}
function ens(a: string, b: string) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }

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

Deno.serve(async (req) => {
  /* ===== 1 · HEMMELIGHEDEN — DET ALLERFØRSTE. Intet andet sker, før den holder. ===== */
  const rigtig = Deno.env.get("MODUL_MAIL_NOEGLE") || "";
  if (rigtig.length < 24) return svar({ fejl: "ikke-klar" }, 503);
  const givet = String(req.headers.get("x-ur-noegle") || "");
  if (!ens(givet, rigtig)) return svar({ fejl: "Ingen adgang." }, 401);
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);

  let krop: { proev?: boolean } = {};
  try { krop = await req.json(); } catch (_e) { krop = {}; }
  const proev = krop && krop.proev === true;

  /* ===== 2 · Først nu: service-role ===== */
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  /* Dage pr. modul fra Studio (lektion_oevelser »ygt:dage«, Ida 15/11) — samme tal, som kundens låse bruger */
  try {
    const { data: dg } = await db.from("lektion_oevelser").select("spm").eq("lektion_id", "ygt:dage").limit(1);
    const o: any = dg && dg.length ? dg[0].spm : null;
    if (o && typeof o === "object") for (const k of Object.keys(o)) { const n = parseInt(o[k], 10); if (YGT_DAG[k] > 0 && !isNaN(n) && n >= 0 && n <= 400) YGT_DAG[k] = n; }
  } catch (_e) { /* standarden gælder */ }

  /* Idas mail (Backstage › Mails). Slukket eller uden tekst = intet sendes. */
  const { data: rk } = await db.from("skema_svar").select("svar").eq("kode", "ENERGIDA").eq("navn", "Ida").eq("skema", "mail_tekster").limit(1);
  const g: any = rk && rk.length && rk[0].svar && typeof rk[0].svar === "object" ? (rk[0].svar as any).modul : null;
  const m: any = { emne: String((g && g.emne) || "").trim(), foto: (g && g.foto) || "", fliser: g && Array.isArray(g.fliser) ? g.fliser : [] };
  const klar = !!g && g.aktiv === true && !!m.emne && mailsHarIndhold(m);
  if (!proev && !klar) return svar({ ok: true, sendt: 0, grund: !g || g.aktiv !== true ? "slukket" : "ingen-tekst" }, 200);

  /* Tidspunktet fra Mails (dage efter modulet åbner + klokkeslæt, dansk tid). Standard: samme dag kl. 08.00. */
  const tid = (g && g.tid) || {};
  const dage = Math.max(0, Math.min(30, parseInt(tid.dage, 10) || 0));
  const klok = /^\d\d:\d\d$/.test(String(tid.time || "")) ? String(tid.time) : "08:00";
  const nu = nuDK();
  if (!proev && nu.tid < klok) return svar({ ok: true, sendt: 0, grund: "for-tidligt" }, 200);

  /* Koderne på forløbet — samme to forløb som ygtModulHold i index.html */
  const { data: koder, error: kFejl } = await db.from("virksomhedskoder").select("kode,forloeb,aktiv");
  if (kFejl) return svar({ fejl: "Kunne ikke læse koderne." }, 500);
  const ygt = (koder || []).filter((k: any) => k.aktiv !== false && /^(YOU GOT THIS|Gratis kursusadgang)/i.test(String(k.forloeb || ""))).map((k: any) => String(k.kode || "").toUpperCase()).filter(Boolean);
  if (!ygt.length) return svar({ ok: true, sendt: 0, grund: "ingen-koder" }, 200);

  /* Startdatoerne (config · ygt_start, tidligste dato pr. kode — som ygtStartHent) og kursus-typen (kunde_def) */
  const { data: cfg } = await db.from("skema_svar").select("kode,skema,svar").eq("navn", "config").in("skema", ["ygt_start", "kunde_def"]).in("kode", ygt);
  const start: Record<string, string> = {}, kursus: Record<string, boolean> = {};
  for (const r of (cfg || []) as any[]) {
    const k = String(r.kode || "").toUpperCase();
    if (r.skema === "kunde_def") { if (r.svar && r.svar.type === "kursus") kursus[k] = true; continue; }
    const d = String((r.svar && r.svar.dato) || "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(d) && (!start[k] || d < start[k])) start[k] = d;
  }

  /* Hvilket modul åbner (+ dage) i dag — eller i går, hvis uret missede en time (aldrig to gange: mail_log) */
  const igaar = plusDage(nu.dato, -1);
  const aabner: Record<string, string> = {};   /* kode → modulnr */
  for (const k of ygt) {
    if (!kursus[k] || !start[k]) continue;
    for (const nr of Object.keys(YGT_DAG)) {
      if (YGT_DAG[nr] === 0) continue;   /* modul 0 og 1 er åbne fra start — dem siger velkomstmailen */
      const dag = plusDage(start[k], YGT_DAG[nr] + dage);
      if (dag === nu.dato || dag === igaar) aabner[k] = nr;
    }
  }
  const koderIDag = Object.keys(aabner);
  if (!koderIDag.length) return svar({ ok: true, sendt: 0, grund: "intet-modul-i-dag", proev }, 200);

  /* Logins på de koder (app_metadata.kode). Administratorer og spærrede logins springes over. */
  const modtagere: { email: string; navn: string; kode: string; nr: string }[] = [];
  for (let side = 1; side <= 50; side++) {
    const { data, error } = await db.auth.admin.listUsers({ page: side, perPage: 200 });
    if (error) return svar({ fejl: "Kunne ikke læse logins." }, 500);
    const brugere = (data && data.users) || [];
    for (const u of brugere as any[]) {
      const am = u.app_metadata || {}, md = u.user_metadata || {};
      const k = String(am.kode || "").toUpperCase();
      if (!aabner[k] || String(am.rolle || "") === "admin") continue;
      if (u.banned_until && new Date(u.banned_until) > new Date()) continue;
      const e = String(u.email || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) continue;
      modtagere.push({ email: e, navn: String(md.hilsen || md.navn || "").trim().split(/\s+/)[0] || "", kode: k, nr: aabner[k] });
    }
    if (brugere.length < 200) break;
  }

  const { data: afm } = await db.from("mail_afmeldt").select("email");
  const afmeldt = new Set((afm || []).map((x: any) => String(x.email).toLowerCase()));
  const ids = Array.from(new Set(modtagere.map((x) => "modul-" + x.nr)));
  const { data: tidl } = await db.from("mail_log").select("email,mail_id").in("mail_id", ids).eq("status", "sendt");
  const sendtFoer = new Set((tidl || []).map((x: any) => x.mail_id + "|" + String(x.email).toLowerCase()));
  const ud = modtagere.filter((x) => !afmeldt.has(x.email) && !sendtFoer.has("modul-" + x.nr + "|" + x.email));
  const sprunget = { afmeldt: modtagere.filter((x) => afmeldt.has(x.email)).length, alleredeSendt: modtagere.length - ud.length - modtagere.filter((x) => afmeldt.has(x.email)).length };

  if (proev) return svar({ ok: true, proev: true, klar, koder: koderIDag.length, faar: ud.length, sprunget, dato: nu.dato }, 200);
  if (!ud.length) return svar({ ok: true, sendt: 0, sprunget }, 200);

  const doegn = new Date(Date.now() - 864e5).toISOString();
  const { count } = await db.from("mail_log").select("id", { count: "exact", head: true }).eq("status", "sendt").gte("created_at", doegn);
  const plads = Math.max(0, Math.min(MAKS_KALD, MAKS_DOEGN - (count || 0)));
  const noegle = Deno.env.get("BREVO_API_KEY"); if (!noegle) return svar({ fejl: "ikke-klar" }, 503);

  let sendt = 0, fejl = 0, venter = 0;
  for (const x of ud) {
    if (sendt + fejl >= plads) { venter++; continue; }   /* resten tages ved næste time, når døgnet giver plads */
    const mailId = "modul-" + x.nr;
    /* Krav på pladsen FØRST: det unikke indeks afviser række nr. 2, så to samtidige kørsler aldrig sender to gange */
    const krav = await db.from("mail_log").insert({ email: x.email, mail_id: mailId, emne: m.emne, status: "sendt" }).select("id");
    if (krav.error || !krav.data || !krav.data.length) continue;
    const rid = krav.data[0].id;
    const mx = { ...m, fliser: x.kode ? m.fliser : m.fliser.filter((f: any) => !(f && f.harKode)) };
    const html = maerk(mailsHtml(mx, { navn: x.navn, kollegakode: x.kode, knapUrl: "https://b2b.energida.dk/" }), mailId);
    let ok = false, besked: string | null = null, brevoId: string | null = null;
    try {
      const r = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": noegle, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          sender: { name: String((g && g.fra) || "Energida").replace(/[\r\n<>"]/g, "").slice(0, 60) || "Energida", email: "Kontakt@energida.dk" },
          replyTo: { email: "Kontakt@energida.dk", name: "Energida" },
          to: [{ email: x.email }],
          subject: m.emne,
          htmlContent: html,
          tags: ["modul", mailId],
        }),
      });
      let j: any = null; try { j = await r.json(); } catch (_e) { j = null; }
      ok = r.ok; brevoId = j && j.messageId ? String(j.messageId) : null;
      if (!r.ok) besked = "Brevo " + r.status + (j && j.message ? ": " + String(j.message).slice(0, 200) : "");
    } catch (e) { besked = String(e).slice(0, 200); }
    if (ok) { sendt++; await db.from("mail_log").update({ brevo_id: brevoId }).eq("id", rid); }
    else { fejl++; await db.from("mail_log").update({ status: "fejl", fejl: besked }).eq("id", rid); }
  }
  return svar({ ok: true, sendt, fejl, venter, sprunget }, 200);
});
