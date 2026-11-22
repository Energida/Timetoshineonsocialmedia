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
//   2. Hvem må kalde den: prøver kun administratorer (er_admin() spurgt SOM kalderen, §4); velkomst enhver indlogget, men kun til sig selv.
//   3. Egen authorization: ja — kalderens token → getUser (mailadressen) + er_admin() skal svare true, ellers 403.
//   4. Service-role: KUN i tilstanden {art:"velkomst"}, efter at kalderens eget token er slået op. Prøve-tilstanden bruger den ikke.
//   5. Når: velkomst læser skema_svar (mail_tekster), læser/skriver mail_log og LÆSER login-listen (auth.admin.listUsers, 20/11) for at se,
//      om kalderen er kollega (et ældre login på samme kode). Intet om andre logins sendes tilbage. Sender én mail via Brevo til kalderens egen adresse.
//   6. Direkte omkostning: nej — Brevo Free (300 mails/dag delt). Én mail pr. tryk; loft på 20 prøver pr. kald-instans pr. time.
//   ÆNDRING 22/11 (forhåndsteksten under emnet, Idas »Ja, byg den« og »kør på makker«): mailens felt »forhaandstekst« lægges som en skjult linje først i mailen.
//   De seks linjer er uændrede: samme adgang, samme tabeller, ingen ny hemmelighed, ingen ny omkostning.
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
function mailsTekstHtml(t, midt, ekstra) {
  /* PLACERING (Idas klik 15/11, artifact K41jEYGPbRSJY2fYPys9dx): true/"center" = midt, "right" = højre, ellers venstre. ekstra = afsnittets egen stil (skrift, størrelse, fed, kursiv, farve) */
  const al = (midt === true || midt === "center") ? "center" : midt === "right" ? "right" : "left";
  ekstra = ekstra || "";
  /* KURSIV · LINK · PUNKTER (Idas klik 15/11): *ord* = kursiv, [ord](https://…) = link (kun https), en blok, hvor hver linje starter med »- « = punkter. Alt andet er tekst. */
  const fmt = function (x) { return esc(x).replace(/\[([^\]\n]+)\]\((https:\/\/[^\s)<>"]+)\)/g, '<a href="$2" style="color:#FC2404;text-decoration:underline;">$1</a>').replace(/\*\*([^*\n]+)\*\*/g, '<b style="font-weight:600;">$1</b>').replace(/(^|[\s(>])\*([^*\n]+)\*(?=[\s.,;:!?)<]|$)/g, '$1<em>$2</em>'); };
  return String(t || "").split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean).map(function (p) {
    const l = p.split("\n"); if (l.every(function (x) { return /^\s*[-•]\s+/.test(x); })) return '<ul style=""margin:0 0 12px;padding-left:22px;font-size:15px;line-height:1.6;color:#1A1A1A;text-align:left;' + ekstra + '">' + l.map(function (x) { return '<li style="margin:0 0 4px;">' + fmt(x.replace(/^\s*[-•]\s+/, "")) + '</li>'; }).join("") + '</ul>';
    return '<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#1A1A1A;text-align:' + al + ';' + ekstra + '">' + fmt(p).replace(/\n/g, "<br>") + '</p>';
  }).join("");
}
/* STIL PR. AFSNIT (Idas klik 15/11): f.s = { font: "serif", str: S|M|L|XL, fed: true|false, kursiv, farve: sort|graa|roed, just: ""|center|right,
   og på knapper og skillestreger kf (farve), lg (kort|halv|hel), form (""|kant|streg), tk (tykkelse) }. Kun skrifter, der findes i alle mailprogrammer. */
const MAILS_FARVER = { sort: "#1A1A1A", graa: "#686868", roed: "#FC2404", lys: "#DEDEDE" };
/* OVERSKRIFTER I MAILS ER DIDOT (Ida 20/11: »sørg for at alle mails bruger mine fonte«); Georgia, hvor mailprogrammet ikke har Didot */
const MAILS_OVF = "font-family:Didot,'Bodoni 72','Bodoni MT',Georgia,serif;";
const MAILS_TRIN_IK = { net: 1, del: 1, plus: 1, prikker: 1 };
function mailsStilCss(s, art) {
  s = s || {}; const c = [];
  if (s.font === "serif") c.push("font-family:Georgia,'Times New Roman',serif");
  const str = ({ tekst: { S: 13, M: 15, L: 18, XL: 22 }, ov: { S: 16, M: 20, L: 26, XL: 32 }, knap: { S: 14, M: 17, L: 20, XL: 24 } }[art] || {})[s.str || ""];
  if (str) c.push("font-size:" + str + "px");
  if (s.fed === true) c.push("font-weight:600"); else if (s.fed === false) c.push("font-weight:400");
  if (s.kursiv) c.push("font-style:italic");
  if (art !== "knap" && MAILS_FARVER[s.farve] && s.farve !== "lys") c.push("color:" + MAILS_FARVER[s.farve]);
  return c.length ? c.join(";") + ";" : "";
}
function mailsPlacering(f) { const j = f && f.s && f.s.just; return j === "center" || j === "right" ? j : (f && f.midt ? "center" : "left"); }
/* FORHÅNDSTEKSTEN UNDER EMNET I INDBAKKEN (Ida 22/11: »Tilføj en særskilt previewtekst til velkomstmailen … uden at blive et synligt afsnit i mailen«).
   Mailens felt »forhaandstekst« (Idas egen tekst i mail_tekster) lægges som en skjult linje først i mailen. Indbakken viser den under emnet; i den åbnede mail ses den ikke.
   Fyldet efter teksten holder mailens første synlige ord ude af indbakkens linje. Uden tekst skrives intet. Samme funktion i appens forhåndsvisning (index.html). */
function mailsForhaandstekst(m) {
  const t = String((m && m.forhaandstekst) || "").replace(/\s+/g, " ").trim().slice(0, 200);
  if (!t) return "";
  const sikker = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return '<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;font-size:1px;line-height:1px;">' + sikker + "&#847;&zwnj;&nbsp;".repeat(60) + "</div>";
}
function mailsHtml(m, o) {
  o = o || {};
  const navn = o.navn || "{navn}";
  /* {kollegakode}: forhaandsvisningen faar en eksempelkode; serveren skriver kundens egen kode ind pr. modtager. */
  const sub = function (t) { return String(t || "").replace(/\{navn\}/g, navn).replace(/\{kollegakode\}/g, o.kollegakode || "{kollegakode}"); };
  const heroRk = function (foerst) { const u = esc(m.foto && m.foto !== "ingen" ? m.foto : MAILS_STD_FOTO); return '<tr><td class="ind" style="padding:' + (foerst ? '0 16px' : '16px 16px 0') + ';"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="hero" background="' + u + '" bgcolor="#1A1A1A" height="380" style="background:#1A1A1A url(\'' + u + '\') center/cover no-repeat;height:380px;"></td></tr></table></td></tr>'; };
  const harHero = (m.fliser || []).some(function (f) { return f && f.t === "hero"; });
  const knapHtml = function (tekst, link, s, al) {
    /* KNAPPEN (Idas klik 15/11): farve, længde (kort = efter teksten · halv · hele bredden), form (rund · firkantet · kun kant), skrift og placering */
    s = s || {}; const farve = MAILS_FARVER[s.kf] || "#FC2404", kant = s.form === "streg", rad = s.form === "kant" ? "8px" : "999px";
    const tfarve = kant ? farve : (s.kf === "lys" ? "#1A1A1A" : "#ffffff");
    const bred = s.lg === "kort" ? "" : s.lg === "halv" ? "50%" : "100%";
    return '<table role="presentation"' + (bred ? ' width="' + bred + '"' : '') + ' align="' + al + '" cellpadding="0" cellspacing="0" border="0"' + (bred ? ' style="width:' + bred + ';"' : '') + '><tr><td align="center" bgcolor="' + (kant ? "#ffffff" : farve) + '" style="border-radius:' + rad + ';' + (kant ? 'border:2px solid ' + farve + ';' : '') + '"><a href="' + esc(link) + '" style="display:block;padding:15px ' + (bred ? '20px' : '32px') + ';font-family:Poppins,Arial,sans-serif;font-size:17px;color:' + tfarve + ';text-decoration:none;border-radius:' + rad + ';' + mailsStilCss(s, "knap") + '">' + esc(tekst) + '</a></td></tr></table>';
  };
  const fl = (m.fliser || []).map(function (f, fi) {
    if (f.t === "hero") return m.foto === "ingen" ? '' : heroRk(fi === 0);   /* det store foto står, hvor Ida har flyttet det (15/11) */
    if (f.t === "streg") { const s = f.s || {}, al = mailsPlacering(f), b = s.lg === "kort" ? "30%" : s.lg === "halv" ? "50%" : "100%", tk = Math.max(1, Math.min(6, parseInt(s.tk, 10) || 1)), fv = MAILS_FARVER[s.kf] || "#DEDEDE";
      return '<tr><td class="ind" align="' + al + '" style="padding:20px 16px 4px;"><table role="presentation" width="' + b + '" align="' + al + '" cellpadding="0" cellspacing="0" border="0" style="width:' + b + ';"><tr><td height="' + tk + '" bgcolor="' + fv + '" style="height:' + tk + 'px;line-height:' + tk + 'px;font-size:0;background:' + fv + ';">&nbsp;</td></tr></table></td></tr>'; }   /* SKILLESTREG (Idas klik 15/11) */
    if (f.t === "overskrift") return String(f.tekst || "").trim() ? '<tr><td class="ind" style="padding:16px 16px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #DEDEDE;border-radius:16px;"><tr><td class="fl" style="padding:32px;font-family:Poppins,Arial,sans-serif;"><div style="' + MAILS_OVF + 'font-size:26px;font-weight:400;line-height:1.2;color:#1A1A1A;text-align:' + mailsPlacering(f) + ';' + mailsStilCss(f.s, "ov") + '">' + esc(sub(f.tekst)) + '</div></td></tr></table></td></tr>' : '';
    if (f.t === "billede") { if (!f.src) return ''; const halv = f.bredde === "halv", lk = String(f.link || "").trim();   /* bredde og link (Idas klik 15/11) */
      const img = '<img src="' + esc(f.src) + '" width="' + (halv ? 284 : 568) + '" alt="" style="display:block;' + (halv ? 'margin:0 auto;width:50%;max-width:284px;' : 'width:100%;max-width:568px;') + 'height:auto;border:0;">';
      return '<tr><td class="ind"' + (halv ? ' align="center"' : '') + ' style="padding:16px 16px 0;">' + (/^https:\/\/[^\s"<>]+$/.test(lk) ? '<a href="' + esc(lk) + '" style="display:block;">' + img + '</a>' : img) + '</td></tr>'; }
    if (f.t === "knap") return String(f.tekst || "").trim() ? '<tr><td class="ind" align="' + mailsPlacering(f) + '" style="padding:16px 16px 0;">' + knapHtml(f.tekst, String(f.link || "").trim() || "https://energida.dk/", f.s, mailsPlacering(f)) + '</td></tr>' : '';
    const al = mailsPlacering(f), st = mailsStilCss(f.s, "tekst");
    let ind = "";
    if (f.et) ind += '<div style="' + MAILS_OVF + 'font-size:26px;font-weight:400;line-height:1.2;color:#1A1A1A;text-align:' + al + ';margin:0 0 12px;">' + esc(f.et) + '</div>';   /* OVERSKRIFT I FLISEN (Ida 20/11): Didot 26, ingen streg under */
    ind += mailsTekstHtml(sub(f.tekst), al, st);
    if (f.t === "trin") {
      /* TRIN (Idas klik 20/11, artifact Q4Ga5KLR6YgVJmCNVmFiUk): iPhone og Android side om side, lyseblå symbolfelter, ingen tal og ingen skillestreger; på telefonen står de under hinanden */
      const kol = (f.kol || []).filter(function (k) { return k && (String(k.navn || "").trim() || (k.trin || []).some(function (x) { return x && String(x.tekst || "").trim(); })); });
      ind += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' + kol.map(function (k, ki) {
        const tr = (k.trin || []).filter(function (x) { return x && String(x.tekst || "").trim(); });
        return '<td class="kol' + (ki ? ' kol2' : '') + '" width="' + Math.floor(100 / kol.length) + '%" valign="top" style="padding:12px ' + (ki < kol.length - 1 ? '16px' : '0') + ' 0 ' + (ki ? '16px' : '0') + ';">'
          + '<div style="font-size:16px;font-weight:600;line-height:1.3;color:#1A1A1A;margin:0 0 16px;">' + esc(k.navn || "") + '</div>'
          + '<table role="presentation" cellpadding="0" cellspacing="0" border="0">' + tr.map(function (x, xi) {
            return (xi ? '<tr><td width="40" align="center" style="width:40px;font-size:0;line-height:0;"><div style="width:1px;height:16px;background:#DEDEDE;margin:0 auto;font-size:0;line-height:0;">&nbsp;</div></td><td style="font-size:0;line-height:0;">&nbsp;</td></tr>' : '')
              + '<tr><td width="40" valign="middle" style="width:40px;"><img src="https://b2b.energida.dk/mail/ik-' + (MAILS_TRIN_IK[x.ik] ? x.ik : "plus") + '.png" width="40" height="40" alt="" style="display:block;width:40px;height:40px;border:0;"></td><td valign="middle" style="padding-left:12px;font-size:15px;line-height:1.35;color:#1A1A1A;">' + esc(sub(x.tekst)) + '</td></tr>'; }).join("")
          + '</table></td>'; }).join("") + '</tr></table>';
    }
    if (String(f.forslag || "").trim()) {
      ind += o.marker
        ? '<div style="margin:2px 0 12px;padding-left:12px;border-left:2px solid #DEDEDE;"><div style="font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:#686868;margin-bottom:4px;">Ikke dine ord</div><div style="color:#686868;">' + mailsTekstHtml(sub(f.forslag)).replace(/color:#1A1A1A/g, "color:#686868") + '</div></div>'
        : mailsTekstHtml(sub(f.forslag), al, st);
    }
    /* KODEN (Ida 20/11: »kollegakoden skal centreres«): midt i et lyseblåt felt med etiket over; teksten bagefter (f.efter) står under feltet */
    const efter = String(f.efter || "").trim(), harK = String(f.kode || "").trim();
    if (f.harKode) ind += '<div style="background:#F4F7FA;border:1px solid #DEDEDE;border-radius:12px;padding:16px 24px;margin:12px 0 ' + (efter ? '24px' : '0') + ';text-align:center;"><div style="font-size:13px;line-height:1.3;color:#686868;">' + (/kollegakode/.test(String(f.kode || "")) ? "Din kollegakode" : "Din kode") + '</div><div style="font-size:24px;line-height:1.2;letter-spacing:3px;font-weight:600;color:' + (harK ? '#1A1A1A' : '#FC2404') + ';margin-top:4px;">' + (harK ? esc(sub(f.kode)) : (o.marker ? "Koden mangler" : "")) + '</div></div>';
    if (efter) ind += mailsTekstHtml(sub(f.efter), al, st);
    /* KNAPPEN I FLISEN (Ida 20/11: knappen skal kunne stå i tekstfeltet): eget link (f.knapLink), ellers mailens */
    if (f.knap) { const kl = String(f.knapLink || "").trim(); ind += '<div style="padding-top:8px;">' + knapHtml(f.knap, /^https:\/\/[^\s"<>]+$/.test(kl) ? kl : (o.knapUrl || "https://b2b.energida.dk/"), f.ks, (f.ks && f.ks.lg === "kort") ? al : "center") + '</div>'; }
    if (f.lille) ind += '<p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:#686868;text-align:center;">' + esc(f.lille) + '</p>';
    { const k = ind.lastIndexOf("margin:0 0 12px;"); if (k >= 0 && ind.slice(k).indexOf("<div") < 0 && ind.slice(k).indexOf("<table") < 0) ind = ind.slice(0, k) + "margin:0;" + ind.slice(k + 16); }
    return '<tr><td class="ind" style="padding:16px 16px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #DEDEDE;border-radius:16px;"><tr><td class="fl" style="padding:32px;font-family:Poppins,Arial,sans-serif;">' + ind + '</td></tr></table></td></tr>';
  }).join("");

  const tom = !mailsHarIndhold(m) ? '<tr><td class="ind" style="padding:16px 16px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #DEDEDE;border-radius:16px;"><tr><td class="fl" style="padding:32px;font-family:Poppins,Arial,sans-serif;font-size:15px;color:#FC2404;">Dine ord mangler</td></tr></table></td></tr>' : "";
  return '<!doctype html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">'
    + '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">'
    + '<style>body{margin:0;padding:0;background:#F8F8F8} @media (max-width:520px){.ind{padding-left:12px!important;padding-right:12px!important} .firma{white-space:normal!important} .fsep{display:block;height:0;overflow:hidden;font-size:0} .hero{height:240px!important} .fl{padding:24px!important} .kol{display:block!important;width:100%!important;padding-left:0!important;padding-right:0!important} .kol2{padding-top:24px!important}}</style></head>'
    + '<body style="margin:0;padding:0;background:#F8F8F8;">' + mailsForhaandstekst(m) + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F8F8;"><tr><td align="center" style="padding:16px 0 32px;">'
    + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">'
    + (m.foto === "ingen" || harHero ? '' : heroRk(true))   /* »Fjern« (Idas klik 15/11): foto = "ingen"; ligger fotoet i listen, står det dér */
    + fl + tom
    + '<tr><td align="center" style="padding:28px 16px 0;font-family:Poppins,Arial,sans-serif;">' + ((typeof m.fod === "string" ? m.fod.trim() : "Er der noget, der driller? Så svar på denne mail.") ? '<p style="margin:0 0 24px;font-size:14px;color:#1A1A1A;">' + esc(typeof m.fod === "string" ? m.fod.trim() : "Er der noget, der driller? Så svar på denne mail.") + '</p>' : '')
    + '<img src="https://b2b.energida.dk/mail/logo.png" width="60" alt="Energida" style="display:block;margin:0 auto 14px;width:60px;height:auto;border:0;">'
    + '<p class="firma" style="margin:0;font-size:10.5px;line-height:1.7;color:#686868;white-space:nowrap;"><span style="white-space:nowrap;">Kontakt@energida.dk · +45 28 60 30 36</span><span class="fsep"> · </span><span style="white-space:nowrap;">Holstebrovej 80, 6950 Ringkøbing · CVR: 45114651</span></p></td></tr>'
    + (o.afmeld ? '<tr><td align="center" style="padding:14px 16px 0;font-family:Poppins,Arial,sans-serif;"><p style="margin:0;font-size:11px;line-height:1.6;color:#686868;">Vil du ikke have flere mails fra Energida? <a href="' + (o.afmeld === true ? '{afmeld}' : '#') + '" style="color:#686868;text-decoration:underline;">Afmeld her</a></p></td></tr>' : '')   /* AFMELDING (23/10): kun i mails, der sendes til kunder/leads — mail-udsend skriver det personlige link ind i {afmeld} */
    + '</table></td></tr></table></body></html>';
}
const MAIL_STD: Record<string, { emne: string; fliser: any[] }> = {"login":{"emne":"Klar til at shine? Dit Content Studio venter","fliser":[{"et":"Dit login","midt":true,"tekst":"Du vælger en adgangskode, og så er du inde.\nKlik her for at komme i gang 👇🏻","knap":"Let’s go","lille":"Linket virker i 24 timer og kun én gang. Har du ikke tilmeldt dig, kan du se bort fra mailen."}]},"velkomst":{"emne":"Her er din adgang og kollegakoden – gem denne mail","fliser":[{"et":"Din profil er klar","tekst":"Hej {navn}\n\nNu kan du gå i gang. Her er linket og det, du skal bruge. Gem gerne denne mail, så har du det hele samlet.\n\nb2b.energida.dk\nLog ind med din e-mail og den adgangskode, du valgte, da du oprettede din profil."},{"t":"knap","tekst":"Åbn dit forløb","link":"https://b2b.energida.dk/"},{"et":"Hent appen til din telefon","tekst":"Så ligger den sammen med dine andre apps og kan åbnes med ét tryk."},{"et":"iPhone","tekst":"1. Åbn b2b.energida.dk i Safari."},{"et":"","tekst":"2. Tryk på Del, eventuelt via menuen."},{"et":"","tekst":"3. Vælg “Føj til hjemmeskærm”."},{"et":"","tekst":"4. Slå “Åbn som webapp” til, hvis muligheden vises, og tryk på “Tilføj”."},{"et":"Android","tekst":"1. Åbn b2b.energida.dk i Chrome."},{"et":"","tekst":"2. Tryk på de tre prikker."},{"et":"","tekst":"3. Vælg “Installer og opret genvej” eller “Føj til startskærm”, og følg vejledningen."},{"et":"Tag op til to kolleger med","tekst":"Du kan give op til to kolleger i din virksomhed adgang til forløbet. Jeres kollegakode er:","kode":"{kollegakode}","harKode":true},{"et":"","tekst":"Dine kolleger går til b2b.energida.dk, vælger “Jeg har en kode” og bruger koden til at oprette deres eget login. I får altså hver jeres login og adgangskode.","lille":"Markér koden og kopiér den, eller svar på denne mail, hvis du vil have den sendt igen."},{"t":"billede","src":"https://b2b.energida.dk/mail/login-crop.jpg"},{"et":"Koden er til jer","tekst":"Ligesom du passer på din forretning, passer jeg på min. Derfor er adgangen til dig og op til to kolleger i din virksomhed, og jeg er glad, hvis koden og undervisningen bliver hos jer."},{"et":"Jeg vil gerne høre fra dig","tekst":"Jeg bliver rigtig glad for feedback, både det gode og det, der ikke fungerer, så jeg kan blive bedre. Svar bare på denne mail.\n\nKærlig hilsen\nIda"}]}};
/* ===== SLUT PÅ MAILENS HTML ===== */

const sendt: number[] = [];

/* Er der et ÆLDRE login på samme kode? Så er modtageren en kollega. Læser kun (auth.admin.listUsers); skriver intet. */
async function erKollega(db: any, bruger: any, kode: string) {
  try {
    const mig = Date.parse(String(bruger?.created_at || "")); const k = String(kode || "").trim().toUpperCase();
    if (!k || !mig) return false;
    for (let side = 1; side <= 20; side++) {
      const { data, error } = await db.auth.admin.listUsers({ page: side, perPage: 200 });
      if (error) return false;
      const b = (data && data.users) || [];
      if (b.some((u: any) => u.id !== bruger.id && String((u.app_metadata || {}).kode || "").trim().toUpperCase() === k && Date.parse(String(u.created_at || "")) < mig)) return true;
      if (b.length < 200) break;
    }
  } catch (_e) { return false; }
  return false;
}

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
  const m: any = { emne: String(g.emne || "").trim() || std.emne, foto: g.foto || "", fliser: Array.isArray(g.fliser) && g.fliser.length ? g.fliser : std.fliser, fod: (g && typeof g.fod === "string") ? g.fod : undefined, forhaandstekst: typeof g.forhaandstekst === "string" ? g.forhaandstekst : "" };
  if (!mailsHarIndhold(m)) m.fliser = std.fliser;
  const md = bruger.user_metadata || {}, am = bruger.app_metadata || {};
  const fornavn = String(md.hilsen || md.navn || "").trim().split(/\s+/)[0] || "";
  const kode = String(am.kode || "").trim();
  /* KOLLEGAEN FÅR IKKE KOLLEGAKODEN (Idas klik 20/11 »Ja, uden koden« + »Ja, gør dem aktive«): flisen med koden (»Dine 3 adgange«) er til køberen.
     En kollega er den, der har oprettet sig på en kode, som et ældre login allerede står på. Kan det ikke slås op, regnes modtageren som køber. */
  const kollega = kode ? await erKollega(db, bruger, kode) : false;
  if (!kode || kollega) m.fliser = m.fliser.filter((f: any) => !(f && f.harKode));   /* ingen kode at vise: kodekortet springes over, aldrig en rå flettekode */
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
