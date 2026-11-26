// @ts-nocheck
// ============================================================================
// STRIPE-KOEB · Edge Function "stripe-koeb"
//
// Doeren ind for en kunde, der koeber sig selv ind. Stripe kvitterer for
// betalingen, og DENNE funktion opretter kunden. Ida roerer ingenting.
//
// Deploy: Supabase -> Edge Functions -> New function, navn: stripe-koeb
//         Secret: STRIPE_WEBHOOK_SECRET (fra Stripes webhook-opsaetning)
//         "Verify JWT" skal staa FRA. Se de seks linjer nedenfor.
//
// ---------------------------------------------------------------------------
// DE SEKS LINJER · sikkerhedskontraktens §3
//
// 1. VERIFY JWT: FRA. Dokumenteret undtagelse. Stripe kan ikke sende et JWT;
//    de underskriver i stedet hver leverance med en delt hemmelighed.
// 2. HVEM MAA KALDE DEN: kun Stripes webhook. Bevist ved underskriften,
//    ikke ved at nogen paastaar det.
// 3. EGEN AUTHORIZATION: JA — underskriften verificeres som det ALLERFOERSTE.
//    Fejler den, roeres databasen aldrig. Der findes ikke een sti gennem denne
//    fil, hvor en uverificeret leverance naar noget som helst.
// 4. SERVICE-ROLE: JA, men foerst EFTER verificeret underskrift.
// 5. RAEKKEVIDDE: virksomhedskoder · skema_svar (kunde_def + kunde_koder) ·
//    contacts · auth (kun invitation, ALDRIG et kodeord).
//    6/11 TILFOEJET: Stripes API (kun LAESNING af den ene session, med en noegle
//    der kun maa laese: STRIPE_LAES_NOEGLE, valgfri) og Brevo (BREVO_API_KEY).
// 11/11 LOGIN-MAILEN FRA BACKSTAGE › MAILS (Ida: »Mailen der kommer er forkert!! Vil du ikke ændre det?«): invitationen
//    laves nu med generateLink (Supabase sender INTET selv), og login-mailen bygges af Idas egen tekst i
//    skema_svar (ENERGIDA/Ida/mail_tekster.login) med samme kode som Mails' forhåndsvisning og sendes via Brevo.
//    Knappen er kundens eget invitationslink. Fejler Brevo, sendes Supabase' egen »vælg adgangskode«-mail som
//    reserve (resetPasswordForEmail), så kunden aldrig står uden mail.
// 24/11 RAPPORTER (Ida: »Ja, byg det«): købsmailen til Ida kan slås fra (lektion_oevelser »ida:rapporter«.koeb = false), skrives i
//    mail_log (mail_id »koeb:<session>«) og gemmes som senest sendte i skema_svar ENERGIDA/Ida/rapport_sidst_koeb (kun admin kan læse).
// 6. OMKOSTNING: ingen direkte. Ingen AI-kald. Der sendes én invitationsmail
//    pr. koeb via Supabase, og 6/11 én koebsmail til Ida via Brevo (Free, delt
//    300 mails/dag). Modtageren er FAST (Kontakt@energida.dk) — kalderen kan ikke
//    vaelge den. Mailen er best-effort: fejler den, roeres koebet ikke.
// 23/11 MAIL TIL EN KUNDE, DER ALLEREDE HAR EN PROFIL (Ida: »Ja, byg den«): Stripes takkeside lover »Din adgang er
//    på vej til din indbakke«, men §6 stopper ved en kendt e-mail, og kunden fik ingenting. Nu faar hun EN mail:
//    »Du har allerede en profil — log ind«. Mailen baerer INGEN noegle, intet link med token og ingen kode; knappen
//    peger paa forsiden. §6 er uaendret: der oprettes intet, og ingen credentials roeres. Hoejst en mail pr. koeb
//    (mail_log, mail_id »har-adgang:<session>«, unikt indeks), og ingen mail, naar leverancen er en GENTAGELSE af
//    det koeb, der selv oprettede brugeren (mail_log »login:<session>« eller en bruger under 10 minutter gammel).
// 23/11 MAILLOG (Ida: »jeg vil også gerne kunne se på kunden hvilke mails de har fået«): login-mailen og mailen
//    ovenfor skrives i mail_log (email · mail_id · emne · status · brevo_id · fejl). RAEKKEVIDDE udvidet med:
//    mail_log (kun INSERT/UPDATE af egne raekker + opslag paa mail_id). Omkostning: hoejst en ekstra mail pr. koeb.
//
// ---------------------------------------------------------------------------
// §6 · SIGNUP OG INVITATION — DEN VIGTIGSTE REGEL I FILEN
//
// Findes e-mailen i forvejen: funktionen STOPPER og opretter INTET. Den roerer
// under ingen omstaendigheder en eksisterende brugers adgangskode. Kunden
// saetter selv sit kodeord via invitationsmailen; Ida faar det aldrig at se.
//
// Det var praecis den vej, der gjorde signup-med-kode til en kontoovertagelse
// (fundet 6. august, funktionen slukket 7. august). Moenstret her er kopieret
// fra opret-workout-bruger — aldrig fra signup-med-kode.
//
// IDEMPOTENS: Stripe leverer den samme haendelse igen, hvis den ikke faar
// 200 tilbage. §6-reglen ER spaerren: anden leverance finder e-mailen og
// stopper. Derfor svarer vi ALTID 200 paa en verificeret leverance, ogsaa naar
// vi ikke opretter noget — ellers ville Stripe proeve i dagevis.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "stripe-signature, content-type",
};

function svar(x: unknown, status: number) {
  return new Response(JSON.stringify(x), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

// --- Stripes underskrift, verificeret i haanden ---------------------------
// Vi importerer ikke Stripes SDK. Underskriften er en HMAC-SHA256 over
// "<timestamp>.<raa body>", og den kan Web Crypto klare. Faerre afhaengigheder
// betyder faerre ting, der kan aendre sig under os.
async function underskriftOk(raa: string, header: string, hemmelighed: string) {
  if (!header || !hemmelighed) return false;
  const dele: Record<string, string[]> = {};
  header.split(",").forEach((p) => {
    const i = p.indexOf("=");
    if (i < 0) return;
    const k = p.slice(0, i).trim();
    const v = p.slice(i + 1).trim();
    (dele[k] = dele[k] || []).push(v);
  });
  const t = (dele["t"] || [])[0];
  const v1 = dele["v1"] || [];
  if (!t || !v1.length) return false;

  // Genbrugsangreb: en gammel, aegte leverance maa ikke kunne afspilles igen.
  // Stripe anbefaler fem minutters tolerance.
  const alder = Math.abs(Math.floor(Date.now() / 1000) - Number(t));
  if (!Number.isFinite(alder) || alder > 300) return false;

  const noegle = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(hemmelighed),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", noegle, new TextEncoder().encode(t + "." + raa));
  const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");

  // Sammenlign i konstant tid. En almindelig === laekker, hvor langt man kom.
  return v1.some((kandidat) => {
    if (kandidat.length !== hex.length) return false;
    let ulighed = 0;
    for (let i = 0; i < hex.length; i++) ulighed |= hex.charCodeAt(i) ^ kandidat.charCodeAt(i);
    return ulighed === 0;
  });
}

// --- Virksomhedskoden -----------------------------------------------------
// Kunden ser den aldrig; den er appens noegle. Bogstaver fra firmanavnet, saa
// Ida kan genkende den paa et skaermbillede, plus fire tegn der goer den unik.
// AEEE og lignende er ude: kun A-Z og 0-9, aldrig aeoeaa.
function kodeAf(navn: string) {
  const rent = String(navn || "")
    .toUpperCase()
    .replace(/[ÆÄ]/g, "AE").replace(/[ØÖ]/g, "OE").replace(/Å/g, "AA")
    .replace(/[^A-Z0-9]/g, "");
  const stamme = (rent || "KUNDE").slice(0, 8);
  const tegn = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";   // uden I, O, 0, 1 — de forveksles
  let hale = "";
  const tal = new Uint8Array(4);
  crypto.getRandomValues(tal);
  for (let i = 0; i < 4; i++) hale += tegn[tal[i] % tegn.length];
  return stamme + hale;
}

// --- KOEBSMAILEN TIL IDA (6/11) ------------------------------------------
// Ida: »en e-mail hver gang der er en, der gennemfoerer et koeb« — ogsaa ved 0 kr.
// med rabatkode (dem sender Stripe ingen kvittering for). Mailen er BEST-EFFORT:
// alt her staar i try/catch, og et svar paa Stripes leverance afhaenger aldrig af den.
// Modtageren er fast. Tegningen: Artifact Fcfyg1eTLf1gDpCKAhp6KV.
function esk(x: unknown) {
  return String(x ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function dkTid(unix: number) {
  const d = new Date((Number.isFinite(unix) && unix > 0 ? unix : Date.now() / 1000) * 1000);
  const dato = new Intl.DateTimeFormat("da-DK", { timeZone: "Europe/Copenhagen", weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(d);
  const tid = new Intl.DateTimeFormat("da-DK", { timeZone: "Europe/Copenhagen", hour: "2-digit", minute: "2-digit", hour12: false }).format(d).replace(":", ".");
  return (dato.charAt(0).toUpperCase() + dato.slice(1)).replace(" den ", " ") + " · kl. " + tid;
}

// Rabatkoden staar IKKE i checkout.session.completed — den skal hentes. Kraever en noegle,
// der KUN maa laese (STRIPE_LAES_NOEGLE). Mangler den, eller svarer Stripe ikke som
// forventet, udelades linjen. IKKE MAALT paa et rigtigt koeb.
async function hentRabatkode(sessionId: string) {
  const nk = Deno.env.get("STRIPE_LAES_NOEGLE");
  if (!nk || !sessionId) return { hentet: false, kode: "" };
  try {
    const r = await fetch(
      "https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId) + "?expand[]=discounts.promotion_code",
      { headers: { Authorization: "Bearer " + nk } },
    );
    if (!r.ok) return { hentet: false, kode: "" };
    const j = await r.json();
    const liste = Array.isArray(j?.discounts) ? j.discounts : [];
    for (const x of liste) {
      const k = x?.promotion_code?.code;
      if (k) return { hentet: true, kode: String(k) };
    }
    return { hentet: true, kode: "" };
  } catch { return { hentet: false, kode: "" }; }
}

// Beloebet i hele kroner (Stripes amount_total er i oere), dansk formatering: »7.995 kr.«
function koebBelob(s: Record<string, any>) {
  const kr = Math.round(Number(s?.amount_total ?? 0) / 100);
  return (Number.isFinite(kr) ? kr : 0).toLocaleString("da-DK") + " kr.";
}

/* RAPPORTER (Ida 24/11: »jeg vil gerne have ændret de mails jeg får - kan du lave et felt under mails vi kalder rapporter så jeg kan se hvilke mails jeg får?« → »Ja, byg det«).
   Til/fra står i lektion_oevelser (lektion_id »ida:rapporter«, spm = { status, koeb, fejl }): kun admin skriver, alle må læse (samme regler som ygt:dage).
   Mangler rækken eller nøglen, er mailen TÆNDT, som før. */
async function rapportTaendt(db: any, k: string) {
  try { const { data } = await db.from("lektion_oevelser").select("spm").eq("lektion_id", "ida:rapporter").maybeSingle(); const v = data && data.spm && typeof data.spm === "object" ? data.spm[k] : undefined; return v !== false; } catch (_e) { return true; }
}
/* »SE DEN« (24/11): den senest sendte udgave gemmes i Idas egen række (skema_svar ENERGIDA/Ida/rapport_sidst_<k>), som kun admin kan læse. Best-effort. */
async function rapportGem(db: any, k: string, emne: string, html: string) {
  try {
    const svar = { emne: String(emne || "").slice(0, 200), tid: new Date().toISOString(), html: String(html || "").slice(0, 200000) };
    const u = await db.from("skema_svar").update({ svar }).eq("kode", "ENERGIDA").eq("navn", "Ida").eq("skema", "rapport_sidst_" + k).select("id");
    if (!u.error && !(u.data && u.data.length)) await db.from("skema_svar").insert({ kode: "ENERGIDA", navn: "Ida", skema: "rapport_sidst_" + k, svar });
  } catch (_e) { /* må aldrig vælte mailen */ }
}

/* HVEM FØRST (Ida 24/11: »det er træls at når jeg får en mail med nyt køb - you got this - 0 kr at de 2 linjer i preview ikke fortæller hvem virksomheden er og hvilken person det er«):
   emnet siger virksomhed og person, og den skjulte forhåndstekst (de to linjer under emnet i mailprogrammet) siger produkt, beløb, rabatkode og mail. */
function koebEmne(o: any) {
  const virk = String(o.virksomhed || "").trim(), navn = String(o.navn || "").trim();
  const hvem = o.privat ? [navn || String(o.email || ""), "Privatperson"].join(" · ")
    : ([virk, navn && navn.toLowerCase() !== virk.toLowerCase() ? navn : ""].filter(Boolean).join(" · ") || String(o.email || ""));
  return (o.test ? "Testkøb · " : "Nyt køb · ") + hvem;
}
function koebForhaand(o: any) {
  const t = [o.produkt, o.belob, o.rabat && o.rabat.hentet && o.rabat.kode ? "rabatkode " + o.rabat.kode : "", o.email].filter(Boolean).join(" · ");
  return '<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;font-size:1px;line-height:1px;">' + esk(t) + "&#847;&zwnj;&nbsp;".repeat(60) + "</div>";
}

async function sendKoebsmail(o: {
  produkt: string; belob: string; tidspunkt: string; rabat: { hentet: boolean; kode: string };
  navn: string; virksomhed: string; email: string; telefon: string; kode: string; test: boolean; eksisterende: boolean; privat?: boolean;
}, db?: any, sid?: string) {
  try {
    if (db && !(await rapportTaendt(db, "koeb"))) return false;   /* Ida har slået købsmailen fra (Rapporter, 24/11) */
    const noegle = Deno.env.get("BREVO_API_KEY");
    if (!noegle) return false;
    const flise = (etiket: string, indhold: string) =>
      '<div style="background:#FFFFFF;border-radius:20px;padding:20px;margin:0 0 10px 0;box-shadow:0 0 4px rgba(46,44,41,.10),0 0 24px rgba(46,44,41,.12);">'
      + '<div style="font-size:10px;letter-spacing:1.5px;color:#686868;text-transform:uppercase;">' + esk(etiket) + '</div>'
      + '<div style="border-top:1px solid #DEDEDE;margin:10px 0 12px 0;"></div>' + indhold + '</div>';
    const raekke = (k: string, v: string) =>
      '<table role="presentation" width="100%" style="font-size:13px;margin:0 0 8px 0;"><tr><td style="color:#686868;">' + esk(k)
      + '</td><td style="text-align:right;color:#1A1A1A;">' + esk(v || "—") + '</td></tr></table>';
    const html = koebForhaand(o) +
      '<div style="background:#F8F8F8;padding:24px 16px;font-family:Poppins,Arial,sans-serif;color:#1A1A1A;">'
      + '<div style="max-width:520px;margin:0 auto;">'
      + flise(o.test ? "Nyt køb · testkøb" : "Nyt køb",
          '<div style="font-size:18px;margin:0 0 6px 0;">' + esk(o.produkt) + '</div>'
          + '<div style="font-size:13px;color:#686868;margin:0 0 4px 0;">' + esk(o.belob) + '</div>'
          + '<div style="font-size:13px;color:#686868;margin:0 0 4px 0;">' + esk(o.tidspunkt) + '</div>'
          + (o.rabat.hentet ? '<div style="font-size:13px;color:#686868;">Rabatkode: ' + esk(o.rabat.kode || "Ingen") + '</div>' : ''))
      + flise("Kunden",
          raekke("Navn", o.navn) + raekke("Virksomhed", o.privat ? "Privatperson" : o.virksomhed) + raekke("E-mail", o.email) + raekke("Telefon", o.telefon))
      + flise("Adgang",
          (o.eksisterende
            ? '<div style="font-size:13px;color:#686868;margin:0 0 4px 0;">E-mailen findes allerede som kunde. Der er ikke oprettet noget nyt og ikke sendt en ny invitation.</div>'
            : raekke("Kundens kode", o.kode) + '<div style="font-size:13px;color:#686868;margin:8px 0 0 0;">Invitationen er sendt til kunden.</div>')
          + '<div style="margin:16px 0 0 0;"><a href="https://admin.energida.dk" style="display:inline-block;background:#FC2404;color:#FFFFFF;text-decoration:none;font-size:13px;line-height:44px;height:44px;padding:0 24px;border-radius:999px;">Åbn Energida</a></div>')
      + '</div></div>';
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": noegle, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Energida", email: "Kontakt@energida.dk" },
        to: [{ email: "Kontakt@energida.dk" }],
        subject: koebEmne(o),
        htmlContent: html,
        tags: ["koebsmail"],
      }),
    });
    /* RAPPORTER (24/11): købsmailen står i mailloggen og som senest sendte, så Ida kan se den under Mails › Rapporter */
    if (db) {
      const emneK = koebEmne(o);
      let bid = ""; try { const j = await r.clone().json(); bid = String((j && j.messageId) || ""); } catch (_e) { bid = ""; }
      try { await db.from("mail_log").insert({ email: "kontakt@energida.dk", mail_id: "koeb:" + String(sid || Date.now()), emne: emneK, status: r.ok ? "sendt" : "fejl", brevo_id: bid || null, fejl: r.ok ? null : "Brevo svarede " + r.status }); } catch (_e) { /* loggen må aldrig vælte et køb */ }
      if (r.ok) await rapportGem(db, "koeb", emneK, html);
    }
    return r.ok;
  } catch { return false; }
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
    const l = p.split("\n"); if (l.every(function (x) { return /^\s*[-•]\s+/.test(x); })) return '<ul style="margin:0 0 12px;padding-left:22px;font-size:15px;line-height:1.6;color:#1A1A1A;text-align:left;' + ekstra + '">' + l.map(function (x) { return '<li style="margin:0 0 4px;">' + fmt(x.replace(/^\s*[-•]\s+/, "")) + '</li>'; }).join("") + '</ul>';
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
    + '<body style="margin:0;padding:0;background:#F8F8F8;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F8F8;"><tr><td align="center" style="padding:16px 0 32px;">'
    + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">'
    + (m.foto === "ingen" || harHero ? '' : heroRk(true))   /* »Fjern« (Idas klik 15/11): foto = "ingen"; ligger fotoet i listen, står det dér */
    + fl + tom
    + '<tr><td align="center" style="padding:28px 16px 0;font-family:Poppins,Arial,sans-serif;">' + ((typeof m.fod === "string" ? m.fod.trim() : "Er der noget, der driller? Så svar på denne mail.") ? '<p style="margin:0 0 24px;font-size:14px;color:#1A1A1A;">' + esc(typeof m.fod === "string" ? m.fod.trim() : "Er der noget, der driller? Så svar på denne mail.") + '</p>' : '')
    + '<img src="https://b2b.energida.dk/mail/logo.png" width="60" alt="Energida" style="display:block;margin:0 auto 14px;width:60px;height:auto;border:0;">'
    + '<p class="firma" style="margin:0;font-size:10.5px;line-height:1.7;color:#686868;white-space:nowrap;"><span style="white-space:nowrap;">Kontakt@energida.dk · +45 28 60 30 36</span><span class="fsep"> · </span><span style="white-space:nowrap;">Holstebrovej 80, 6950 Ringkøbing · CVR: 45114651</span></p></td></tr>'
    + (o.afmeld ? '<tr><td align="center" style="padding:14px 16px 0;font-family:Poppins,Arial,sans-serif;"><p style="margin:0;font-size:11px;line-height:1.6;color:#686868;">Vil du ikke have flere mails fra Energida? <a href="' + (o.afmeld === true ? '{afmeld}' : '#') + '" style="color:#686868;text-decoration:underline;">Afmeld her</a></p></td></tr>' : '')   /* AFMELDING (23/10): kun i mails, der sendes til kunder/leads — mail-udsend skriver det personlige link ind i {afmeld} */
    + '</table></td></tr></table></body></html>';
}
const MAIL_STD: Record<string, { emne: string; fliser: any[] }> = {"findes":{"emne":"Du har allerede en profil hos Energida","fliser":[{"et":"Du har allerede en profil","tekst":"Hej {navn}\n\nTak for dit køb. Din e-mail har allerede en profil hos Energida, så du skal ikke oprette en ny.\n\nLog ind med din e-mail og den adgangskode, du selv har valgt. Har du glemt den, så tryk på »Glemt adgangskode?« på loginsiden.","knap":"Log ind"}]},"login":{"emne":"Klar til at shine? Dit Content Studio venter","fliser":[{"et":"Dit login","midt":true,"tekst":"Du vælger en adgangskode, og så er du inde.\nKlik her for at komme i gang 👇🏻","knap":"Let’s go","lille":"Linket virker i 24 timer og kun én gang. Har du ikke tilmeldt dig, kan du se bort fra mailen."}]},"velkomst":{"emne":"Her er din adgang og kollegakoden – gem denne mail","fliser":[{"et":"Din profil er klar","tekst":"Hej {navn}\n\nNu kan du gå i gang. Her er linket og det, du skal bruge. Gem gerne denne mail, så har du det hele samlet.\n\nb2b.energida.dk\nLog ind med din e-mail og den adgangskode, du valgte, da du oprettede din profil."},{"t":"knap","tekst":"Åbn dit forløb","link":"https://b2b.energida.dk/"},{"et":"Hent appen til din telefon","tekst":"Så ligger den sammen med dine andre apps og kan åbnes med ét tryk."},{"et":"iPhone","tekst":"1. Åbn b2b.energida.dk i Safari."},{"et":"","tekst":"2. Tryk på Del, eventuelt via menuen."},{"et":"","tekst":"3. Vælg “Føj til hjemmeskærm”."},{"et":"","tekst":"4. Slå “Åbn som webapp” til, hvis muligheden vises, og tryk på “Tilføj”."},{"et":"Android","tekst":"1. Åbn b2b.energida.dk i Chrome."},{"et":"","tekst":"2. Tryk på de tre prikker."},{"et":"","tekst":"3. Vælg “Installer og opret genvej” eller “Føj til startskærm”, og følg vejledningen."},{"et":"Tag op til to kolleger med","tekst":"Du kan give op til to kolleger i din virksomhed adgang til forløbet. Jeres kollegakode er:","kode":"{kollegakode}","harKode":true},{"et":"","tekst":"Dine kolleger går til b2b.energida.dk, vælger “Jeg har en kode” og bruger koden til at oprette deres eget login. I får altså hver jeres login og adgangskode.","lille":"Markér koden og kopiér den, eller svar på denne mail, hvis du vil have den sendt igen."},{"t":"billede","src":"https://b2b.energida.dk/mail/login-crop.jpg"},{"et":"Koden er til jer","tekst":"Ligesom du passer på din forretning, passer jeg på min. Derfor er adgangen til dig og op til to kolleger i din virksomhed, og jeg er glad, hvis koden og undervisningen bliver hos jer."},{"et":"Jeg vil gerne høre fra dig","tekst":"Jeg bliver rigtig glad for feedback, både det gode og det, der ikke fungerer, så jeg kan blive bedre. Svar bare på denne mail.\n\nKærlig hilsen\nIda"}]}};
/* ===== SLUT PÅ MAILENS HTML ===== */

/* LOGIN-MAILEN (11/11): Idas tekst fra Mails, knappen = invitationslinket. true = sendt via Brevo. */
async function sendLoginmail(admin: any, o: { email: string; navn: string; kode: string; link: string }) {
  try {
    const noegle = Deno.env.get("BREVO_API_KEY");
    if (!noegle || !o.link) return false;
    let g: any = null;
    try {
      const { data } = await admin.from("skema_svar").select("svar").eq("kode", "ENERGIDA").eq("navn", "Ida").eq("skema", "mail_tekster").limit(1);
      g = data && data.length && data[0].svar && typeof data[0].svar === "object" ? data[0].svar.login : null;
    } catch (_e) { g = null; }
    const std = MAIL_STD.login;
    const m: any = { emne: (g && String(g.emne || "").trim()) || std.emne, foto: (g && g.foto) || "", fliser: (g && Array.isArray(g.fliser) && g.fliser.length) ? g.fliser : std.fliser, fod: (g && typeof g.fod === "string") ? g.fod : undefined };
    if (!mailsHarIndhold(m)) m.fliser = std.fliser;
    /* en knap-blok uden eget link (eller med appens forside) peger på kundens eget invitationslink */
    m.fliser = m.fliser.map((f: any) => (f && f.t === "knap" && (!String(f.link || "").trim() || /^https:\/\/b2b\.energida\.dk\/?$/i.test(String(f.link).trim()))) ? Object.assign({}, f, { link: o.link }) : f);
    const fornavn = String(o.navn || "").trim().split(/\s+/)[0] || "";
    const html = mailsHtml(m, { navn: fornavn, kollegakode: o.kode, knapUrl: o.link }).replace(/Hej \s*\n/g, "Hej\n");
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": noegle, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: String((g && g.fra) || "Energida").replace(/[\r\n<>"]/g, "").slice(0, 60) || "Energida", email: "Kontakt@energida.dk" },
        replyTo: { email: "Kontakt@energida.dk", name: "Energida" },
        to: [{ email: o.email }],
        subject: m.emne,
        htmlContent: html,
        tags: ["login"],
      }),
    });
    if (!r.ok) return false;
    let bid = ""; try { const j = await r.json(); bid = String((j && j.messageId) || ""); } catch (_e) { bid = ""; }
    return { emne: String(m.emne || ""), brevoId: bid };
  } catch (_e) { return false; }
}

/* MAILLOGGEN (23/11): én række pr. sendt mail, så Ida kan se på kunden, hvad hun har fået. Fejler skrivningen, røres købet ikke. */
async function logMail(admin: any, r: { email: string; mail_id: string; emne: string; status: string; brevo_id?: string; fejl?: string }) {
  try { await admin.from("mail_log").insert({ email: String(r.email || "").toLowerCase(), mail_id: r.mail_id, emne: r.emne, status: r.status, brevo_id: r.brevo_id || null, fejl: r.fejl || null }); } catch (_e) { /* loggen må aldrig vælte et køb */ }
}

/* »DU HAR ALLEREDE EN PROFIL« (23/11): til en kunde, der køber med en e-mail, der findes i forvejen. Ingen nøgle, ingen kode, intet token —
   kun teksten og en knap til forsiden. Idas egen tekst (mail_tekster.findes) vinder, ellers standarden. Pladsen i mail_log tages FØR afsendelsen
   (det unikke indeks på mail_id + e-mail), så Stripes gentagne leverance aldrig sender mailen to gange. */
async function sendFindesmail(admin: any, o: { email: string; navn: string; session: string }) {
  try {
    const noegle = Deno.env.get("BREVO_API_KEY");
    if (!noegle || !o.session) return "ikke-klar";
    const mailId = "har-adgang:" + o.session, til = o.email.toLowerCase();
    let g: any = null;
    try {
      const { data } = await admin.from("skema_svar").select("svar").eq("kode", "ENERGIDA").eq("navn", "Ida").eq("skema", "mail_tekster").limit(1);
      g = data && data.length && data[0].svar && typeof data[0].svar === "object" ? data[0].svar.findes : null;
    } catch (_e) { g = null; }
    const std = MAIL_STD.findes;
    const m: any = { emne: (g && String(g.emne || "").trim()) || std.emne, foto: (g && g.foto) || "", fliser: (g && Array.isArray(g.fliser) && g.fliser.length) ? g.fliser : std.fliser, fod: (g && typeof g.fod === "string") ? g.fod : undefined };
    if (!mailsHarIndhold(m)) m.fliser = std.fliser;
    const krav = await admin.from("mail_log").insert({ email: til, mail_id: mailId, emne: m.emne, status: "sendt" }).select("id");
    if (krav.error || !krav.data || !krav.data.length) return "allerede";
    const rid = krav.data[0].id;
    const fornavn = String(o.navn || "").trim().split(/\s+/)[0] || "";
    const html = mailsHtml(m, { navn: fornavn, knapUrl: "https://b2b.energida.dk/" }).replace(/Hej \s*\n/g, "Hej\n");
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": noegle, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Energida", email: "Kontakt@energida.dk" },
        replyTo: { email: "Kontakt@energida.dk", name: "Energida" },
        to: [{ email: o.email }],
        subject: m.emne,
        htmlContent: html,
        tags: ["har-adgang"],
      }),
    });
    if (!r.ok) { await admin.from("mail_log").update({ status: "fejl", fejl: "Brevo svarede " + r.status }).eq("id", rid); return "fejlede"; }
    let bid = ""; try { const j = await r.json(); bid = String((j && j.messageId) || ""); } catch (_e) { bid = ""; }
    if (bid) await admin.from("mail_log").update({ brevo_id: bid }).eq("id", rid);
    return "sendt";
  } catch (_e) { return "fejlede"; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return svar({ fejl: "Brug POST." }, 405);

  // --- 1) UNDERSKRIFTEN, FOER ALT ANDET ----------------------------------
  // Body laeses som RAA tekst. Parser man den foerst, aendres tegnene, og
  // underskriften passer aldrig igen.
  const raa = await req.text();
  const hemmelighed = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
  if (!hemmelighed) return svar({ fejl: "Serveren mangler sin hemmelighed." }, 500);

  const ok = await underskriftOk(raa, String(req.headers.get("stripe-signature") ?? ""), hemmelighed);
  if (!ok) return svar({ fejl: "Underskriften kunne ikke bekræftes." }, 401);

  // Herfra — og FOERST herfra — er service-noeglen i spil.
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let haendelse: Record<string, any>;
  try { haendelse = JSON.parse(raa); } catch { return svar({ fejl: "Ugyldig body." }, 400); }

  // Vi reagerer KUN paa en gennemfoert betaling. Alt andet kvitteres og ignoreres,
  // saa Stripe ikke proever igen i dagevis.
  if (haendelse?.type !== "checkout.session.completed") {
    return svar({ ok: true, sprunget_over: haendelse?.type ?? "ukendt" }, 200);
  }

  const s = haendelse?.data?.object ?? {};
  const felter: Record<string, string> = {};
  (s.custom_fields ?? []).forEach((f: any) => {
    const v = f?.text?.value ?? f?.dropdown?.value ?? f?.numeric?.value ?? "";
    if (f?.key) felter[String(f.key)] = String(v);
  });

  const email = String(s.customer_details?.email ?? "").trim().toLowerCase();
  // TESTKOEB 8/11: naar kunden koeber som virksomhed, er customer_details.name FIRMAETS navn — personens navn staar i individual_name.
  // Uden dette blev kontaktpersonen til firmanavnet (»Go' morgen, Hans' Testbutik«; koebsmailen: Navn = firma).
  const navn = String((s.customer_details as any)?.individual_name ?? s.customer_details?.name ?? "").trim();
  const telefon = String(s.customer_details?.phone ?? felter["telefon"] ?? "").trim();

  // --- VIRKSOMHEDSNAVNET KAN KOMME FLERE STEDER FRA ------------------------
  // MAALT 26/8: Stripes Payment Links har "Collect business names" INDBYGGET —
  // det er altsaa IKKE et custom field, som foerste udgave af denne fil antog.
  // HVOR i sessionen det praecis lander, er IKKE MAALT. Det kan kun afgoeres paa
  // en rigtig leverance, og et gaet ville betyde, at kundens firma kom til at
  // hedde hendes eget navn — uden at nogen opdagede det.
  //
  // Derfor laeses ALLE de steder, det kan staa, i prioriteret raekkefoelge, og
  // svaret siger HVILKEN kilde der bar navnet. Foerste testkoeb giver os det
  // endelige svar, og saa kan listen skaeres ned til den ene rigtige.
  const virkKilder: Array<[string, string]> = [
    ["customer_details.business_name", String(((s.customer_details ?? {}) as any).business_name ?? "").trim()],
    ["business_name", String((s as any).business_name ?? "").trim()],
    ["custom_fields", String(felter["virksomhedsnavn"] ?? felter["virksomhed"] ?? "").trim()],
    ["customer_details.name (noedspor)", navn],
  ];
  /* PRIVATPERSON (Ida 24/11, Mia skrev »Ingen«: »burde vi have en - jeg er her som privatperson« → »Ja, alle fire dele«): et tomt
     virksomhedsfelt eller et svar som »Ingen«, »privat«, »-«, »nej« betyder privatperson. Så hedder kontoen personens navn, og kortet får privat: true. */
  const erIntet = (t: string) => /^(ingen|intet|privat|privatperson|nej|-+|\.+|x|n\/?a|ikke relevant)$/i.test(String(t || "").trim());
  for (const kk of virkKilder) if (kk[0] !== "customer_details.name (noedspor)" && erIntet(kk[1])) kk[1] = "";
  const virkFundet = virkKilder.find((x) => x[1]);
  const virksomhed = virkFundet ? virkFundet[1] : "Ny kunde";
  const privat = !virkFundet || virkFundet[0].indexOf("noedspor") > -1;
  const virkKilde = virkFundet ? virkFundet[0] : "ingen";
  // --- HVILKET PRODUKT? (27/9, lanceringen af YOU GOT THIS 1/10) -----------
  // Betalingslinket i Stripe bærer mærket (metadata) produkt=yougotthis, og Stripe
  // kopierer et Payment Links metadata over på hver checkout-session. Uden mærket er
  // det et Content Studio-køb som før. forening + pakke kommer fra samme mærke.
  const md: Record<string, string> = (s.metadata && typeof s.metadata === "object") ? s.metadata : {};
  const erYGT = String(md.produkt ?? "").toLowerCase() === "yougotthis";
  // RABATKODEN VINDER OVER LINKET (Ida 15/11: »hende her brugte rabatkoden Ringkobing2026 og kommer ind som gamle kunder???« → »ja, begge dele«):
  // fem køb med RINGKOBING2026 kom ind via Gamle kunder-linket og blev mærket »Gamle kunder«. En kendt kode bestemmer nu foreningen;
  // en ukendt kode eller ingen kode lader linkets mærke stå som før. Rabatkoden hentes én gang og bruges alle steder nedenfor.
  const rabatInfo = await hentRabatkode(String(s.id ?? ""));
  const KODE_FORENING: Record<string, string> = { "RINGKOBING2026": "Ringkøbing Handelsforening", "JEGERVIGTIGFORIDA": "Gamle kunder" };
  const forening = (erYGT && KODE_FORENING[String(rabatInfo.kode || "").trim().toUpperCase()]) || String(md.forening ?? "").trim();
  const pakke = String(md.pakke ?? "detaildrift").trim() || "detaildrift";
  // 0 kr. = testadgang — MEN ikke for YOU GOT THIS: foreningens 140 butikker køber til
  // 0 kr. med deres kode og er rigtige kunder. Et YGT-testkøb mærkes med test=ja på linket.
  const erTest = String(md.test ?? "").toLowerCase() === "ja" || (!erYGT && String(s.amount_total ?? "0") === "0");

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return svar({ ok: true, fejl: "Koebet havde ingen brugbar e-mail." }, 200);
  }

  // --- 2) FINDES E-MAILEN? SAA STOPPER VI (§6) ---------------------------
  // Vi kobler ikke, vi opdaterer ikke, og vi roerer aldrig et kodeord.
  // Det er samtidig spaerren mod, at Stripes gentagne leverance opretter to gange.
  for (let side = 1; side <= 20; side++) {
    const { data, error } = await admin.auth.admin.listUsers({ page: side, perPage: 200 });
    if (error) return svar({ fejl: "Kunne ikke slå e-mailen op." }, 500);
    const brugere = data?.users ?? [];
    const kendt = brugere.find((u) => String(u.email ?? "").toLowerCase() === email);
    if (kendt) {
      /* 23/11: kunden faar besked om, at hun allerede har en profil — men ikke, naar dette er Stripes gentagelse af det koeb, der selv oprettede hende */
      let findesmail = "gentagelse";
      const alderMs = Date.now() - new Date(String(kendt.created_at || 0)).getTime();
      let sammeKoeb = false;
      try { const { data: lg } = await admin.from("mail_log").select("id").eq("mail_id", "login:" + String(s.id ?? "")).limit(1); sammeKoeb = !!(lg && lg.length); } catch (_e) { sammeKoeb = false; }
      if (!sammeKoeb && !(alderMs >= 0 && alderMs < 10 * 60 * 1000)) findesmail = await sendFindesmail(admin, { email, navn: navn || "", session: String(s.id ?? "") });
      // KOEBSMAIL (6/11): et gennemfoert koeb fra en kendt e-mail faar Ida stadig besked om.
      const mailSendt = await sendKoebsmail({
        produkt: erYGT ? "You Got This" : "Content Studio", belob: koebBelob(s), tidspunkt: dkTid(Number(s.created)),
        rabat: rabatInfo, navn, virksomhed, email, telefon, kode: "", test: erTest, eksisterende: true, privat,
      }, admin, String(s.id ?? ""));
      return svar({ ok: true, allerede: email, oprettet: false, koebsmail: mailSendt, findesmail }, 200);
    }
    if (brugere.length < 200) break;
  }

  // --- 3) EN LEDIG KODE ---------------------------------------------------
  let kode = "";
  for (let forsoeg = 0; forsoeg < 8; forsoeg++) {
    const k = kodeAf(virksomhed);
    const { data } = await admin.from("virksomhedskoder").select("kode").eq("kode", k).limit(1);
    if (!data || !data.length) { kode = k; break; }
  }
  if (!kode) return svar({ fejl: "Kunne ikke finde en ledig kode." }, 500);

  // --- 4) KUNDENS DEFINITION ---------------------------------------------
  // Samme form som appens egen opretKunde() skriver. Ental: hun er én person,
  // indtil hun selv siger andet — tiltaleformen gaettes aldrig i Drejebogen,
  // og "du" er det rigtige for en enkeltmandsforretning.
  const def: Record<string, unknown> = {
    virksomhed,
    oprettet: new Date().toISOString().slice(0, 10),
    forloeb: erYGT ? "YOU GOT THIS" : "Content Studio",
    type: erYGT ? "kursus" : "contentstudio",   // lektionerne vises KUN for type kursus
    pakke: erYGT ? pakke : undefined,           // YOU GOT THIS · DETAIL = lektioner + Drejebog + Værktøjskassen
    forening: forening || undefined,            // fx Ringkøbing Handelsforening
    ental: true,
    // 6/11 (Ida: kunden skal ikke udfylde mere end noedvendigt): profilen i appen forudfylder efternavn og
    // forretningens navn fra koebet. stripe_virksomhed_fundet er KUN sat, naar Stripe gav et rigtigt
    // virksomhedsnavn — ikke naar navnet er personens eget (noedspor) eller »Ny kunde«.
    stripe_navn: navn || undefined,
    privat: privat || undefined,                 // 24/11: købt uden virksomhed (tomt felt eller »Ingen« o.l.)
    stripe_virksomhed_fundet: (virkFundet && virkKilde.indexOf("noedspor") < 0) ? true : undefined,
    // skema: IKKE sat (28/9). »skema: false« betyder i appen »spoergeskemaet er SLAAET FRA
    // for kunden« (kundekortets flueben) — saa sprang rejsen startskemaet over, og
    // lektionslaasen virkede ikke for nogen, der koebte via Stripe.
    login_klar: true,
    test: erTest || undefined,          // 0 kr. = tester. Staar ikke i kundelisten (v1318).
    maal: { tekst: "Din målsætning lander her, når du har udfyldt Drejebogen.", opslag_uge: 3 },
    strategi: { analyse: "", temaer: [] },
  };

  // 4a · koden i tabellen — det er den, loginet slaar op i.
  // VIRKSOMHED_ID FRA FOERSTE SEKUND (§2): koden er invitation, aldrig permanent
  // dataejer. En kunde, der foedes uden virksomhed_id, skal migreres bagefter — og
  // Drejebogen kan slet ikke bygges uden (den siger det selv og stopper).
  //
  // MAALT 26/8: virksomhedskoder.virksomhed_id er en FREMMEDNOEGLE
  // (virksomhedskoder_virksomhed_id_fkey). Et opfundet uuid bliver afvist af basen —
  // og det er helt rigtigt: virksomheden ER ejeren, og en ejer skal findes, foer
  // noget kan pege paa den. Databasen haandhaever selv §2. Derfor oprettes
  // virksomheden FOERST, og vi bruger DENS id.
  let virksomhedId = "";
  {
    // KOLONNERNE ER LAEST UD AF TRIN 0's egen CREATE TABLE (8. august), ikke gaettet:
    //   navn  not null, maa ikke vaere tom
    //   type  not null, check (type in ('kunde','intern'))
    //   id, aktiv, oprettet har alle en standardvaerdi
    // "kunde" er den rigtige: en tester ER en kunde i produktet — det er kun Idas
    // egne koder, der er "intern".
    const { data, error } = await admin.from("virksomheder")
      .insert({ navn: virksomhed, type: "kunde" }).select("id").single();
    if (error || !data?.id) {
      return svar({ fejl: "Kunne ikke oprette virksomheden: " + (error?.message ?? "intet id tilbage") }, 500);
    }
    virksomhedId = String(data.id);
  }
  {
    const { error } = await admin.from("virksomhedskoder")
      .insert({ kode, virksomhed, forloeb: erYGT ? "YOU GOT THIS" : "Content Studio", aktiv: true, virksomhed_id: virksomhedId, login_klar: true }).select();   // login_klar (28/9): koeberen har et login — koden sender til »log ind«, ikke »opret dig«
    if (error) return svar({ fejl: "Kunne ikke oprette koden: " + error.message }, 500);
  }

  // 4b · kundens egen raekke — uden den kan hun ikke komme ind
  {
    const { data, error } = await admin.from("skema_svar")
      .insert({ kode, navn: "config", skema: "kunde_def", svar: def }).select();
    if (error || !data || !data.length) {
      return svar({ fejl: "Kunden blev ikke oprettet færdig — sig det til Ida." }, 500);
    }
  }

  // 4c · Idas kartotek. HELE listen ligger i EEN raekke, saa den skal laeses,
  // udvides og skrives tilbage — aldrig overskrives med noget, vi selv fandt paa.
  // Appen fletter fra sin side siden v1319, saa de to ikke kan slette hinanden.
  // TO KOEB I SAMME SEKUND (28/9, lanceringen): begge laeser listen, og den sidste
  // skrivning ville slette den foerste kunde af listen. Derfor laeses listen igen
  // bagefter, og mangler koden, proeves der igen (op til 4 gange, med lidt tilfaeldig pause).
  let kartotekOk = false;
  for (let forsoeg = 0; forsoeg < 4 && !kartotekOk; forsoeg++) {
    if (forsoeg) await new Promise((r) => setTimeout(r, 150 + Math.floor(Math.random() * 400)));
    const { data } = await admin.from("skema_svar").select("svar")
      .eq("kode", "ENERGIDA").eq("navn", "Ida").eq("skema", "kunde_koder").maybeSingle();
    const kartotek = (data?.svar && typeof data.svar === "object" && !Array.isArray(data.svar))
      ? data.svar as Record<string, unknown> : {};
    kartotek[kode] = def;
    const opd = await admin.from("skema_svar").update({ svar: kartotek })
      .eq("kode", "ENERGIDA").eq("navn", "Ida").eq("skema", "kunde_koder").select();
    if (!opd.data || !opd.data.length) {
      await admin.from("skema_svar")
        .insert({ kode: "ENERGIDA", navn: "Ida", skema: "kunde_koder", svar: kartotek }).select();
    }
    const tjek = await admin.from("skema_svar").select("svar")
      .eq("kode", "ENERGIDA").eq("navn", "Ida").eq("skema", "kunde_koder").maybeSingle();
    const efter = tjek.data?.svar as Record<string, unknown> | undefined;
    kartotekOk = !!(efter && typeof efter === "object" && efter[kode]);
  }

  // 4d · CRM-kontakten. Gaar den galt, staar kunden der stadig — derfor
  // stopper vi ikke paa den, men siger det i svaret.
  // KOLONNENAVNENE ER LAEST UD AF APPENS EGEN KODE, ikke gaettet. Foerste udgave
  // brugte "virksomhed" og "kilde" — de findes ikke, og indsaettelsen fejlede tavst
  // (MAALT 26/8: svaret sagde kontakt: false, og kunden stod ikke i CRM'et).
  // Her bruges KUN felter, appen selv skriver: kunde · status · source · kommentar.
  // Mail og telefon laegges i kommentaren, saa de er der, selv om jeg ikke kan se
  // om der findes egne kolonner til dem. Intet gaar tabt.
  //
  // DER FINDES INGEN navn-KOLONNE (MAALT 26/8, og dokumenteret i projektets eget
  // "FUNDET UNDERVEJS": databasen svarer 400 column contacts.navn does not exist).
  // Kontaktpersonens navn ligger derfor i kommentaren sammen med mail og telefon.
  let kontaktOk = true;
  // rabatInfo er hentet øverst (rabatkoden vinder over linket, 15/11) —: gemmes på kontakten (Live-overblikket: Køb pr. rabatkode) og står i købsmailen
  // 15/11 FELTERNE UDFYLDES (Ida: »en kunde der køber … oprettes sådan her i mit system!! WTF« — kortet stod tomt):
  // kontaktperson · email · telefon · produkt skrives nu i deres egne kolonner (de samme, CRM-kortet selv gemmer i
  // via contacts.update), og kommentaren står som før. Afviser basen de ekstra felter, indsættes kontakten
  // præcis som før (kunde · status · source · kommentar), så et køb aldrig mister sin kontakt.
  const kontaktGrund = {
      kunde: virksomhed,
      status: "Kunde",
      source: erTest ? "Testlink" : (erYGT ? ("YOU GOT THIS" + (forening ? " · " + forening : "")) : "Stripe"),
      kommentar: [navn, email, telefon, "Kode: " + kode, (s.amount_total != null ? "Beløb: " + Math.round(Number(s.amount_total) / 100) + " kr." : ""), (rabatInfo.kode ? "Rabatkode: " + rabatInfo.kode : "")].filter(Boolean).join(" · "),   // BELØBET TIL LIVE-OVERBLIKKET (Idas klik 19/10 »Kroner pr. køb«): Stripes amount_total i øre → hele kroner
  };
  try {
    let { data, error } = await admin.from("contacts").insert({ ...kontaktGrund, kontaktperson: navn || null, email: email || null, telefon: telefon || null, produkt: erYGT ? "YOU GOT THIS" : "Content Studio" }).select("id");
    if (error || !data || !data.length) ({ data, error } = await admin.from("contacts").insert(kontaktGrund).select("id"));
    if (error || !data || !data.length) kontaktOk = false;
  } catch { kontaktOk = false; }

  // --- 5) INVITATIONEN — ALDRIG ET KODEORD --------------------------------
  // Hun faar et link, hvor hun saetter sin egen adgangskode. redirectTo er ikke
  // pynt: uden den lander hun paa projektets Site URL. Adressen skal ogsaa staa
  // under Authentication -> URL Configuration -> Redirect URLs.
  /* 11/11: linket laves her, og login-mailen sendes af os selv med Idas tekst fra Mails (se sendLoginmail). Supabase sender intet. */
  const { data: lnk, error: invFejl } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: { data: { navn: navn || virksomhed, kode }, redirectTo: "https://b2b.energida.dk" },
  });
  if (invFejl) {
    return svar({ fejl: "Kunden er oprettet, men invitationen blev ikke lavet: " + invFejl.message, kode }, 500);
  }
  const nyBruger = { user: lnk?.user };
  /* LINKET KAN KLIKKES FLERE GANGE (Ida 15/11): mailen peger på vores egen side med engangsnøglen i #-delen. Nøglen bruges først,
     når kunden trykker »Opret profil« — mailprogrammers forhåndstjek kan ikke bruge den op, og #-delen når aldrig en server. */
  const th = String(lnk?.properties?.hashed_token || "");
  const opretLink = th ? "https://b2b.energida.dk/#opret=" + encodeURIComponent(th) + "&m=" + encodeURIComponent(email) : String(lnk?.properties?.action_link || "");
  const lm: any = await sendLoginmail(admin, { email, navn: navn || "", kode, link: opretLink });
  let loginmail = lm ? "mails" : "";
  if (!loginmail) {
    /* RESERVE: Supabase' egen mail med link til at vælge adgangskode — kunden står aldrig uden mail */
    try { const { error: rf } = await admin.auth.resetPasswordForEmail(email, { redirectTo: "https://b2b.energida.dk" }); loginmail = rf ? "fejlede" : "reserve"; } catch (_e) { loginmail = "fejlede"; }
  }
  /* 23/11: adgangsmailen står i mailloggen, mærket med købet (login:<session>), så Ida kan se den på kunden */
  await logMail(admin, { email, mail_id: "login:" + String(s.id ?? ""), emne: lm ? lm.emne : (loginmail === "reserve" ? "Vælg adgangskode (Supabases reservemail)" : "Adgangsmailen"), status: loginmail === "fejlede" ? "fejl" : "sendt", brevo_id: lm ? lm.brevoId : "", fejl: loginmail === "fejlede" ? "Hverken Brevo eller reservemailen kom afsted" : (loginmail === "reserve" ? "Brevo fejlede; reservemailen er sendt" : "") });

  // --- 6) KODEN LAASES FAST PAA SERVEREN ---------------------------------
  // MAALT 26/8 paa Idas egen test: uden dette trin fik kunden en kode, hun ikke
  // MAATTE bruge. Appen kunne godt LAESE koden af user_metadata — men databasen
  // naegtede hende hendes egen raekke, fordi RLS med vilje kun stoler paa
  // app_metadata. user_metadata kan brugeren SELV redigere; det var praecis dét,
  // der væltede et kort 7. august. Hun landede derfor paa "opsaetningen kunne ikke
  // hentes" umiddelbart efter at have valgt sit kodeord.
  //
  // OM updateUserById OG §6: kontrakten forbyder at aendre CREDENTIALS paa en
  // EKSISTERENDE bruger. Her er ingen af delene i spil — e-mailen er bevist ny
  // laengere oppe, brugeren er lige oprettet af os selv, og der roeres KUN
  // app_metadata. Der findes ikke een sti gennem denne fil, der saetter et kodeord.
  // Samme moenster som signup-med-kode bruger.
  const nyId = nyBruger?.user?.id;
  if (nyId) {
    const { error: laasFejl } = await admin.auth.admin.updateUserById(nyId, {
      app_metadata: { kode, virksomhed_id: virksomhedId },
    });
    if (laasFejl) {
      return svar({
        fejl: "Kunden er oprettet og invitationen sendt, men koden blev ikke laast fast: " + laasFejl.message
            + " — kunden kan ikke komme ind, foer det er rettet.",   /* aldrig koen paa nogen flade (HAARD 27/8) */
        kode,
      }, 500);
    }
  }

  // --- 7) KOEBSMAILEN TIL IDA (6/11) ---------------------------------------
  // Efter ALT det vigtige er gjort og laast: et oprettet koeb faar Ida besked om, ogsaa 0 kr.
  // Best-effort — svaret til Stripe aendres ikke af, om mailen kom frem (se koebsmail i svaret).
  const mailSendt = await sendKoebsmail({
    produkt: erYGT ? "You Got This" : "Content Studio", belob: koebBelob(s), tidspunkt: dkTid(Number(s.created)),
    rabat: rabatInfo, navn, virksomhed, email, telefon, kode, test: erTest, eksisterende: false, privat,
  }, admin, String(s.id ?? ""));

  // virk_kilde er ikke pynt: den er beviset for, HVOR virksomhedsnavnet kom fra.
  // Staar der "customer_details.name (noedspor)", fandt vi aldrig firmanavnet, og
  // kunden hedder nu det samme som personen. Det skal ses, ikke opdages senere.
  return svar({ ok: true, oprettet: true, kartotek: kartotekOk, kode, produkt: erYGT ? "yougotthis" : "contentstudio", virksomhed_id: virksomhedId, laast: !!nyId, test: !!erTest, kontakt: kontaktOk, virk_kilde: virkKilde, koebsmail: mailSendt, loginmail }, 200);
});