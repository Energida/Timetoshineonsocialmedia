// STATUS-MAIL · Edge Function "status-mail"
//
// Ida 20/11: »Pisse god ide med mail til mig hver morgen! Statusmail!« · klik »Ja til statusmailen« · »Ja, byg Mail 1, A + C«
// (bud claude.ai/artifact/GePcSymrSwf4XFCawKCcpi). Uret (pg_cron) kalder funktionen hver time. Hver dag fra kl. 07.00
// dansk tid sender den ÉN mail til Ida med Dagens tjek: nye køb · skal have et skub · fejl og feedback · godt nyt.
// Tallene følger samme regler som Dagens tjek på Backstage › Hjem (dtRaekke i index.html).
//
// Deploy: Claude via Supabase Management API med tokenet i ~/.supabase/access-token (aldrig CLI — nøgleringen, 19/10).
//         Verify JWT: FRA (se linje 1).
//
// SIKKERHEDSKONTRAKTENS SEKS LINJER (§3):
//   1. Verify JWT: FRA. Begrundelse: kaldes af databasens ur (pg_cron + pg_net), som ikke har et brugerlogin. Mønster: modul-mail.
//   2. Hvem må kalde den: kun den, der kender hemmeligheden MODUL_MAIL_NOEGLE (sendt i headeren x-ur-noegle) — samme nøgle
//      som modul-mail, som Ida selv satte 15/11 i Secrets og i databasens Vault. Claude sætter og ser den aldrig.
//   3. Egen authorization: JA — hemmeligheden tjekkes som det ALLERFØRSTE (konstant-tids-sammenligning). Mangler den på
//      serveren → 503, forkert/ingen → 401. Kalderen kan intet vælge: modtageren er fast (Kontakt@energida.dk), ingen tekst
//      og ingen adresser i kaldet — kun { proev: true } (sender intet, svarer med tal) og { nu: true } (sender dagens mail
//      med det samme, stadig kun til Ida, og højst én gang pr. minut).
//   4. Service-role: JA, men først EFTER verificeret hemmelighed (§4: der er ingen bruger at spørge som).
//   5. Når (kun LÆSE): virksomhedskoder · skema_svar (kunde_def, adgangskode_valgt, login, app_brug, lektion_set_*,
//      lektion_feedback_*, app_fejl, ENERGIDA/config/publicering, ENERGIDA/Ida/dagens_tjek) · contacts (YOU GOT THIS-køb) ·
//      auth.users (sidste login pr. kode via listUsers). SKRIVER kun: mail_log (én række pr. sendt statusmail).
//      Kundernes svar på øvelser læses aldrig.
//   6. Direkte omkostning: nej — Brevo Free (300 mails/dag delt). Højst én statusmail pr. dag (unikt indeks i mail_log).
// 24/11 RAPPORTER (Ida: »Ja, byg det«): læser også lektion_oevelser »ida:rapporter« (til/fra; slukket = ingen mail) og SKRIVER
//   skema_svar ENERGIDA/Ida/rapport_sidst_status (emne, tid, mailens html) efter en sendt mail, så »Se den« i Backstage › Mails › Rapporter kan vise den.
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const TIL = "Kontakt@energida.dk";

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
const SKUB_DAGE = 5;   /* samme som DT_SKUB_DAGE i index.html */
const EGNE = ["ENERGIDA", "IDAENERGIDA"];
const TESTMAILS = ["info.energida@gmail.com"];

function svar(x: unknown, status: number) { return new Response(JSON.stringify(x), { status, headers: { "Content-Type": "application/json" } }); }
function ens(a: string, b: string) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
function esc(s: unknown) { return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" } as Record<string, string>)[c]); }
function dkDele(d: Date) {
  const dele = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Copenhagen", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false }).formatToParts(d);
  const v = (t: string) => (dele.find((x) => x.type === t) || { value: "" }).value;
  return { dato: v("year") + "-" + v("month") + "-" + v("day"), tid: (v("hour") === "24" ? "00" : v("hour")) + ":" + v("minute"), ugedag: v("weekday") };
}
function dkDato(iso: string) { return iso ? dkDele(new Date(iso)).dato : ""; }
function dageMellem(fra: string, til: string) { if (!fra || !til) return null; return Math.round((Date.parse(til + "T12:00:00Z") - Date.parse(fra + "T12:00:00Z")) / 864e5); }
function navnStort(s: string) { return String(s || "").trim().split(/\s+/).map((d) => d ? d.charAt(0).toUpperCase() + d.slice(1) : d).join(" "); }
const UGEDAGE: Record<string, string> = { Mon: "Mandag", Tue: "Tirsdag", Wed: "Onsdag", Thu: "Torsdag", Fri: "Fredag", Sat: "Lørdag", Sun: "Søndag" };
const MAANEDER = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
function datoOrd(iso: string) { const p = iso.split("-").map(Number); return p[2] + ". " + MAANEDER[p[1] - 1]; }
function sidenOrd(n: number | null) { return n == null ? "" : n <= 0 ? "i dag" : n === 1 ? "i går" : "for " + n + " dage siden"; }

/* Alle rækker, ikke kun de første 1.000 (samme fælde som liveAlle i index.html) */
// deno-lint-ignore no-explicit-any
async function alle(byg: () => any) { let ud: any[] = [], fra = 0; for (let n = 0; n < 50; n++) { const r = await byg().range(fra, fra + 999); if (r.error) throw new Error("hent"); const d = r.data || []; ud = ud.concat(d); if (d.length < 1000) break; fra += 1000; } return ud; }

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
    /* ALLE DAGE, OGSÅ WEEKENDER (Ida 20/11: »alle dage skal statusmailen komme også weekender«) */
    if (nu.tid < "07:00") return svar({ ok: true, sendt: 0, grund: "for-tidligt" }, 200);
    if (nu.tid >= "12:00") return svar({ ok: true, sendt: 0, grund: "for-sent" }, 200);   /* missede uret morgenen, sendes der ikke en »morgenmail« om eftermiddagen */
  }

  /* ===== 2 · Først nu: service-role ===== */
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  if (!proev && !straks && !(await rapportTaendt(db, "status"))) return svar({ ok: true, sendt: 0, grund: "slukket" }, 200);
  const mailId = straks ? "status-proeve-" + nu.dato + "-" + nu.tid : "status-" + nu.dato;
  if (!proev) {
    const { data: foer } = await db.from("mail_log").select("id").eq("mail_id", mailId).eq("status", "sendt").limit(1);
    if (foer && foer.length) return svar({ ok: true, sendt: 0, grund: "allerede-sendt" }, 200);
  }

  try {
    /* Koderne på YOU GOT THIS — rigtige kunder kun (ingen test, egne eller lukkede koder) */
    const { data: koder, error: kFejl } = await db.from("virksomhedskoder").select("kode,forloeb,aktiv");
    if (kFejl) return svar({ fejl: "Kunne ikke læse koderne." }, 500);
    const ygtAlle = (koder || []).filter((k: any) => k.aktiv !== false && /^YOU GOT THIS/i.test(String(k.forloeb || ""))).map((k: any) => String(k.kode || "").toUpperCase()).filter((k: string) => k && EGNE.indexOf(k) < 0);
    const def: Record<string, any> = {};
    if (ygtAlle.length) { const rk = await alle(() => db.from("skema_svar").select("kode,svar").eq("navn", "config").eq("skema", "kunde_def").in("kode", ygtAlle).order("kode")); for (const r of rk) def[String(r.kode || "").toUpperCase()] = r.svar || {}; }
    const ygt = ygtAlle.filter((k: string) => { const d = def[k] || {}; return d.type === "kursus" && !d.test && !d.egen && !d.lukket; });

    /* Købene (contacts med kilden YOU GOT THIS …) */
    const kon = await alle(() => db.from("contacts").select("kunde,kontaktperson,email,source,kommentar,created_at").like("source", "YOU GOT THIS%").order("created_at"));
    const koeb: Record<string, any> = {};
    for (const c of kon) {
      const km = String(c.kommentar || ""); const kode = ((km.match(/Kode:\s*([A-Z0-9ÆØÅ_-]+)/i) || [])[1] || "").toUpperCase();
      const rabat = ((km.match(/Rabatkode:\s*([A-Z0-9ÆØÅ_-]+)/i) || [])[1] || "").toUpperCase();
      const mail = String(c.email || (km.split("·").map((x: string) => x.trim()).filter((x: string) => /@/.test(x))[0] || "")).toLowerCase();
      if (!kode || /test/i.test(String(c.source || "")) || /test/i.test(rabat) || /@energida\.dk$/i.test(mail) || TESTMAILS.indexOf(mail) > -1) continue;
      const bm = km.match(/Beløb:\s*(\d+)/);
      koeb[kode] = { dato: dkDato(c.created_at), firma: String(c.kunde || "").trim(), navn: String(c.kontaktperson || "").trim(), rabat, kr: bm ? Number(bm[1]) : 0 };
    }

    /* Aktivitet: adgangskode, login, app-brug og sete lektioner — kun at og hvornår, aldrig indhold */
    const akt = ygt.length ? await alle(() => db.from("skema_svar").select("kode,skema,svar,created_at").in("kode", ygt).in("skema", ["adgangskode_valgt", "login", "app_brug"]).order("created_at")) : [];
    const sete = ygt.length ? await alle(() => db.from("skema_svar").select("kode,skema,created_at").in("kode", ygt).like("skema", "lektion_set_%").order("created_at")) : [];
    const K: Record<string, { login: boolean; sidst: string; set: Record<string, string> }> = {};
    for (const k of ygt) K[k] = { login: false, sidst: "", set: {} };
    for (const r of akt) {
      const o = K[String(r.kode || "").toUpperCase()]; if (!o) continue; o.login = true;
      if (r.skema === "app_brug" && r.svar && typeof r.svar === "object") { for (const d of Object.keys(r.svar)) if (/^\d{4}-\d{2}-\d{2}$/.test(d) && d > o.sidst) o.sidst = d; }
    }
    for (const r of sete) {
      const o = K[String(r.kode || "").toUpperCase()]; if (!o) continue; const id = String(r.skema || "").slice(12); const t = String(r.created_at || "");
      if (!o.set[id] || t < o.set[id]) o.set[id] = t; const dg = dkDato(t); if (dg > o.sidst) o.sidst = dg;
    }
    for (let side = 1; side <= 50; side++) {
      const { data, error } = await db.auth.admin.listUsers({ page: side, perPage: 200 }); if (error) break;
      const brugere = (data && data.users) || [];
      for (const u of brugere as any[]) { const o = K[String((u.app_metadata || {}).kode || "").toUpperCase()]; if (!o || !u.last_sign_in_at) continue; o.login = true; const dg = dkDato(u.last_sign_in_at); if (dg > o.sidst) o.sidst = dg; }
      if (brugere.length < 200) break;
    }

    /* Idas egne mærker (Skubbet / Set) fra Dagens tjek */
    const { data: lg } = await db.from("skema_svar").select("svar").eq("kode", "ENERGIDA").eq("navn", "Ida").eq("skema", "dagens_tjek").limit(1);
    const log: any = (lg && lg.length && lg[0].svar && typeof lg[0].svar === "object") ? lg[0].svar : {};
    const skubLog: Record<string, string> = log.skub || {}, setLog: Record<string, string> = log.set || {};

    /* Publicerede lektioner (til »Godt nyt«: et modul gjort færdigt i går eller i dag) */
    const { data: pb } = await db.from("skema_svar").select("svar").eq("kode", "ENERGIDA").eq("navn", "config").eq("skema", "publicering").limit(1);
    const publ: string[] = (pb && pb.length && pb[0].svar && Array.isArray((pb[0].svar as any).lektioner)) ? (pb[0].svar as any).lektioner.map(String) : [];
    const prModul: Record<string, string[]> = {}; for (const id of publ) { const m = id.match(/^(\d+)-/); if (m) (prModul[m[1]] = prModul[m[1]] || []).push(id); }

    const firmaFor = (k: string) => { const d = def[k] || {}; return String(d.virksomhed || d.studioNavn || d.navn || (koeb[k] || {}).firma || k); };   /* virksomhedens navn, aldrig koden */
    const personFor = (k: string) => navnStort((koeb[k] || {}).navn || "") || firmaFor(k);
    const skub: { tekst: string; under: string; dage: number }[] = [], nyeKoeb: { tekst: string; under: string }[] = [], godt: string[] = [];
    let paaSporet = 0;
    for (const k of ygt) {
      const o = K[k], kb = koeb[k]; const koebt = (kb && kb.dato) || String((def[k] || {}).oprettet || "").slice(0, 10);
      const harSet = Object.keys(o.set).length > 0;
      const kd = dageMellem(koebt, nu.dato), sd = dageMellem(o.sidst || koebt, nu.dato);
      const staa = !o.login ? (kd || 0) >= 2 : (sd || 0) >= (harSet ? 7 : 3);
      if (!staa && o.login) paaSporet++;
      if (staa) {
        const s = skubLog[k] ? dageMellem(dkDato(skubLog[k]), nu.dato) : null;
        if (s == null || s >= SKUB_DAGE) skub.push({ tekst: personFor(k) + (!o.login ? " har ikke logget ind" : (!harSet ? " har ikke gjort en lektion færdig" : " har ikke været inde")), under: firmaFor(k) + (!o.login ? " · købte " + sidenOrd(kd) : " · sidst inde " + (o.sidst ? sidenOrd(sd) : "aldrig")), dage: (!o.login ? kd : sd) || 0 });
      }
      if (kb && kd != null && kd <= 1) nyeKoeb.push({ tekst: personFor(k) + " · " + firmaFor(k), under: (kb.rabat || "ingen rabatkode") + " · " + (o.login ? "har adgangskode" : "mangler adgangskode") });
      for (const nr of Object.keys(prModul)) {
        const l = prModul[nr]; if (!l.every((id) => o.set[id])) continue;
        let sidst = ""; for (const id of l) if (o.set[id] > sidst) sidst = o.set[id];
        const n = dageMellem(dkDato(sidst), nu.dato); if (n != null && n <= 1) godt.push(personFor(k) + " er færdig med modul " + (Number(nr) - 1));   /* modul 1 i basen = »Modul 0« for kunden (modulVisNr) */
      }
    }
    skub.sort((a, b) => b.dage - a.dage);
    const sumKr = ygt.reduce((a, k) => { const kb = koeb[k]; const kd = kb ? dageMellem(kb.dato, nu.dato) : null; return a + (kb && kd != null && kd <= 1 ? kb.kr : 0); }, 0);

    /* Fejl og skrevet feedback de sidste 14 dage, som Ida ikke har trykket »Set« på */
    const graense = new Date(Date.now() - 14 * 864e5).toISOString();
    const obs: { tekst: string; under: string }[] = [];
    const { data: fr } = await db.from("skema_svar").select("kode,skema,svar,created_at").eq("navn", "app_fejl").like("skema", "kunde_fejl_%").gte("created_at", graense).order("created_at", { ascending: false }).limit(50);
    for (const f of (fr || []) as any[]) { const k = String(f.kode || "").toUpperCase(); if (ygt.indexOf(k) < 0 || setLog["fejl:" + f.skema]) continue; const v = f.svar || {}; obs.push({ tekst: firmaFor(k) + ": »" + String(v.hvad || v.tekst || "fejl").slice(0, 120) + "«", under: "Fejlmelding · " + sidenOrd(dageMellem(dkDato(f.created_at), nu.dato)) }); }
    const { data: fb } = await db.from("skema_svar").select("kode,navn,skema,svar,created_at").like("skema", "lektion_feedback_%").gte("created_at", graense).order("created_at", { ascending: false }).limit(200);
    for (const f of (fb || []) as any[]) {
      const k = String(f.kode || "").toUpperCase(); const v = f.svar || {}; const kom = String(v.kommentar || "").trim();
      if (ygt.indexOf(k) < 0 || !kom || setLog["fb:" + f.kode + ":" + f.skema + ":" + f.navn]) continue;
      const m = String(f.skema).slice(17).match(/^(\d+)-(\d+)/); const lek = m ? (Number(m[1]) - 1) + "." + m[2] : "";
      obs.push({ tekst: firmaFor(k) + (lek ? " om " + lek : "") + ": »" + kom.slice(0, 120) + "«", under: "Feedback" + (v.stjerner ? " · " + v.stjerner + " af 5 stjerner" : "") });
    }

    const tal = { kunder: ygt.length, paaSporet, nyeKoeb: nyeKoeb.length, skub: skub.length, obs: obs.length, godt: godt.length };
    if (proev) return svar({ ok: true, proev: true, dato: nu.dato, tal }, 200);

    /* ===== 3 · MAILEN (Mail 1: fire tal og navnene) — kun farvemanualens farver, hvid tekst på rød ===== */
    const intet = !skub.length && !obs.length;
    /* KORT OG ROLIGT (Ida 24/11: »Ja, også den« — samme regel som ugerapporten): kun navnet i emnet, én rolig linje i forhåndsvisningen */
    const emne = "Dagens tjek";
    const forhaand = intet ? "Du er færdig for i dag" : "Godmorgen, Ida";
    const F = "font-family:Arial,Helvetica,sans-serif;";
    const tile = (n: number, ord: string, roed: boolean) => '<td width="25%" style="padding:0 5px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ' + (roed ? "#FC2404" : "#DEDEDE") + ';border-radius:14px;background:' + (roed ? "#FC2404" : "#FFFFFF") + ';"><tr><td style="padding:14px 12px;' + F + '"><div style="font-size:28px;line-height:1;color:' + (roed ? "#FFFFFF" : "#1A1A1A") + ';">' + n + '</div><div style="font-size:12px;line-height:1.3;padding-top:6px;color:' + (roed ? "#FFFFFF" : "#686868") + ';">' + esc(ord) + '</div></td></tr></table></td>';
    const liste = (titel: string, rk: { tekst: string; under?: string }[], maerke: boolean) => !rk.length ? "" :
      '<tr><td style="padding:22px 0 8px;' + F + 'font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#686868;">' + esc(titel) + '</td></tr><tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #DEDEDE;border-radius:14px;background:#FFFFFF;">'
      + rk.slice(0, 8).map((r, i) => '<tr><td style="padding:12px 14px;' + (i ? "border-top:1px solid #DEDEDE;" : "") + F + 'font-size:14px;line-height:1.45;color:#1A1A1A;">' + (maerke ? '<span style="display:inline-block;width:20px;height:20px;line-height:20px;border-radius:10px;background:#FC2404;color:#FFFFFF;font-size:13px;text-align:center;margin-right:8px;">!</span>' : "") + esc(r.tekst) + (r.under ? '<div style="font-size:12.5px;color:#686868;padding-top:2px;">' + esc(r.under) + '</div>' : "") + '</td></tr>').join("")
      + (rk.length > 8 ? '<tr><td style="padding:10px 14px;border-top:1px solid #DEDEDE;' + F + 'font-size:12.5px;color:#686868;">og ' + (rk.length - 8) + ' mere i Backstage</td></tr>' : "") + '</table></td></tr>';
    const html = '<!doctype html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(emne) + '</title></head><body style="margin:0;background:#F8F8F8;">' + '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F8F8F8;font-size:1px;line-height:1px;">' + esc(forhaand) + '&#8203;&zwnj;&nbsp;'.repeat(60) + '</div>'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F8F8;"><tr><td align="center" style="padding:24px 12px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FFFFFF;border:1px solid #DEDEDE;border-radius:20px;"><tr><td style="padding:28px 24px 30px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
      + '<tr><td style="font-family:Georgia,\'Times New Roman\',serif;font-size:30px;line-height:1.15;color:#1A1A1A;">' + (intet ? "Du er færdig for i dag" : "Godmorgen, Ida") + '</td></tr>'
      + '<tr><td style="padding:4px 0 20px;' + F + 'font-size:13px;color:#686868;">' + esc(UGEDAGE[nu.ugedag] + " " + datoOrd(nu.dato)) + ' · ' + tal.kunder + ' kunder i You got this · ' + paaSporet + ' på sporet</td></tr>'
      + '<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 -5px;"><tr>' + tile(nyeKoeb.length, nyeKoeb.length === 1 ? "Nyt køb" : "Nye køb", false) + tile(skub.length, "Skal have et skub", skub.length > 0) + tile(obs.length, "Fejl eller feedback", false) + tile(godt.length, "Godt nyt", false) + '</tr></table></td></tr>'
      + (intet ? '<tr><td style="padding:20px 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #DEDEDE;border-radius:14px;background:#F4F7FA;"><tr><td style="padding:16px;' + F + 'font-size:14px;line-height:1.5;color:#1A1A1A;">Alle kunder er på sporet eller skubbet, og der er ingen nye fejl.</td></tr></table></td></tr>' : "")
      + liste("Skal have et skub", skub, false)
      + liste("Nye køb" + (sumKr ? " · " + sumKr.toLocaleString("da-DK") + " kr." : ""), nyeKoeb, false)
      + liste("Fejl og feedback", obs, true)
      + liste("Godt nyt", godt.map((t) => ({ tekst: t })), false)
      + '<tr><td style="padding:24px 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#FC2404" style="border-radius:26px;"><a href="https://admin.energida.dk/" style="display:block;padding:16px 20px;' + F + 'font-size:15px;color:#FFFFFF;text-decoration:none;">Åbn Dagens tjek</a></td></tr></table></td></tr>'
      + '<tr><td style="padding:18px 0 0;' + F + 'font-size:12px;line-height:1.5;color:#686868;">Tallene er de samme som øverst på Backstage › Hjem. Testkunder tæller ikke med.</td></tr>'
      + '</table></td></tr></table></td></tr></table></body></html>';

    /* Krav på pladsen FØRST: det unikke indeks afviser række nr. 2, så to samtidige kørsler aldrig sender to gange */
    const krav = await db.from("mail_log").insert({ email: TIL.toLowerCase(), mail_id: mailId, emne, status: "sendt" }).select("id");
    if (krav.error || !krav.data || !krav.data.length) return svar({ ok: true, sendt: 0, grund: "allerede-sendt" }, 200);
    const rid = krav.data[0].id;
    const noegle = Deno.env.get("BREVO_API_KEY"); if (!noegle) { await db.from("mail_log").update({ status: "fejl", fejl: "ingen Brevo-nøgle" }).eq("id", rid); return svar({ fejl: "ikke-klar" }, 503); }
    let ok = false, besked: string | null = null, brevoId: string | null = null;
    try {
      const r = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: { "api-key": noegle, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ sender: { name: "Energida Backstage", email: "Kontakt@energida.dk" }, to: [{ email: TIL }], subject: emne, htmlContent: html, tags: ["status"] }) });
      let j: any = null; try { j = await r.json(); } catch (_e) { j = null; }
      ok = r.ok; brevoId = j && j.messageId ? String(j.messageId) : null;
      if (!r.ok) besked = "Brevo " + r.status + (j && j.message ? ": " + String(j.message).slice(0, 200) : "");
    } catch (e) { besked = String(e).slice(0, 200); }
    if (ok) { await db.from("mail_log").update({ brevo_id: brevoId }).eq("id", rid); await rapportGem(db, "status", emne, html); }
    else await db.from("mail_log").update({ status: "fejl", fejl: besked }).eq("id", rid);
    return svar({ ok, sendt: ok ? 1 : 0, tal, fejl: ok ? undefined : besked }, ok ? 200 : 502);
  } catch (_e) {
    return svar({ fejl: "Statusmailen kunne ikke samles." }, 500);
  }
});
