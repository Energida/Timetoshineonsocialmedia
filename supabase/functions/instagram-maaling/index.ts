// INSTAGRAM-MAALING · Edge Function "instagram-maaling"
//
// Henter de ni seneste opslag, summerer raekkevidde og interaktioner, regner
// raten og skriver EN raekke i ig_maalinger med naevner = 'raekkevidde'.
//
// Deploy: Supabase -> Edge Functions -> New function, navn: instagram-maaling
//         Ingen nye secrets. "Verify JWT" skal staa TIL.
//
// ---------------------------------------------------------------------------
// DE SEKS LINJER · sikkerhedskontraktens §3
//
// 1. VERIFY JWT: TIL.
// 2. HVEM MAA KALDE DEN: kunden selv, eller en planlagt koersel en gang om
//    maaneden.
// 3. EGEN AUTHORIZATION: JA. Identiteten slaas op paa KALDERENS eget token,
//    og virksomhed_id laeses af app_metadata — aldrig af body, aldrig af
//    user_metadata.
// 4. SERVICE-ROLE: JA, til at laese tokenet og skrive maalingen.
// 5. RAEKKEVIDDE: ig_forbindelser og ig_maalinger, kun kalderens egen virksomhed.
// 6. OMKOSTNING: nej i kroner, men JA i rate limits. Meta begraenser kald pr.
//    app pr. time, og der er ti kald pr. maaling. Derfor spaerren nedenfor:
//    hoejst EEN maaling pr. virksomhed pr. doegn.
//
// ---------------------------------------------------------------------------
// DATAKONTRAKTEN AF 28. JULI ER LAAST OG AENDRES IKKE HER
//
//   interaktionsraten = interaktioner i alt / raekkevidde i alt, i procent,
//   for de seneste 9 opslag.
//
// Foelgertallet gemmes KUN som kontekst. Maalinger mod foelgere (foer 28/7) maa
// aldrig sammenlignes med maalinger mod raekkevidde — derfor skrives naevner
// eksplicit som 'raekkevidde' paa hver eneste raekke.
//
// ET OPSLAG UDEN reach SPRINGES OVER OG TAELLES I SVARET. Det saettes ALDRIG
// til nul: et nul i taelleren traekker raten kunstigt ned og ville se ud som en
// daarlig maaned i stedet for som manglende data.
// IKKE MAALT: om Meta returnerer reach for alle formater. Reels og karruseller
// har historisk haft forskellige metriksaet. Derfor tallet "sprunget_over" i
// svaret — det er beviset for, hvor meget maalingen faktisk hviler paa.
//
// 5/10: vi bruger IKKE Metas total_interactions laengere, men summerer likes,
// comments, saved og shares som appens wizard. IKKE MAALT: at Metas fire tal
// er de samme, som kunden ser i Indblik. Skal efterproeves paa @energida med EN manuel maaling ved siden af,
// FOER integrationen slippes loes paa kunder. Afviger de, vinder datakontrakten.
// 24/11 TAL PR. OPSLAG (Ida: »Ja, gå i gang« med Meta-videoen; Metas krav 9/11: likes, comments, saves og shares
//   skal hver for sig kunne ses pr. opslag i appen): svaret har nu ogsaa »opslagListe« (de 9 seneste opslag med
//   billede, dato, de fire tal og raekkevidde). Ny tilstand { kunOpslag: true }: henter og viser tallene UDEN at skrive en
//   maaling og uden doegnspaerren (spaerren beskytter maalingerne, ikke visningen). De seks linjer er uaendrede, undtagen:
//   6. OMKOSTNING: kunOpslag koster ti kald pr. tryk mod kundens EGEN token (Instagrams loft er pr. bruger og app);
//      der skrives intet. Ingen ny tabel, ingen ny hemmelighed.
// ============================================================================
import { createClient } from "npm:@supabase/supabase-js@2";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
function svar(x, status) {
  return new Response(JSON.stringify(x), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json"
    }
  });
}
Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") return new Response("ok", {
    headers: cors
  });
  if (req.method !== "POST") return svar({
    fejl: "Brug POST."
  }, 405);
  let krop = {};
  try { krop = await req.json(); } catch { krop = {}; }
  const kunOpslag = !!(krop && krop.kunOpslag === true);
  const admin = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  // --- 1) HVEM RINGER? ----------------------------------------------------
  const jwt = String(req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return svar({
    fejl: "Du er ikke logget ind."
  }, 401);
  const { data: kalder, error: kalderFejl } = await admin.auth.getUser(jwt);
  if (kalderFejl || !kalder?.user) return svar({
    fejl: "Dit login kunne ikke bekræftes."
  }, 401);
  const am = kalder.user.app_metadata ?? {};
  const vid = String(am.virksomhed_id ?? "").trim();
  const kode = String(am.kode ?? "").trim().toUpperCase();
  if (!vid) return svar({
    fejl: "Din konto er ikke koblet til en virksomhed endnu."
  }, 403);
  if (!kode) {
    // ig_maalinger er i dag noeglet paa kode (og det er praecis dét, §2 kalder
    // forkert). Indtil migreringen har flyttet tabellen, skal vi bruge koden
    // for at kunne skrive maalingen dér, hvor appen laeser den.
    return svar({
      fejl: "Din konto mangler en kode — målingen kan ikke gemmes endnu."
    }, 403);
  }
  // --- 2) FORBINDELSEN ----------------------------------------------------
  const { data: forb, error: forbFejl } = await admin.from("ig_forbindelser").select("token, token_udloeber, brugernavn, sidst_hentet").eq("virksomhed_id", vid).maybeSingle();
  if (forbFejl) return svar({
    fejl: "Kunne ikke slå forbindelsen op."
  }, 500);
  if (!forb?.token) return svar({
    fejl: "Der er ingen Instagram-konto forbundet endnu.",
    forbundet: false
  }, 409);
  if (forb.token_udloeber && new Date(forb.token_udloeber).getTime() < Date.now()) {
    // Siges som en TILSTAND, ikke som en fejl. Kunden skal kunne se forskel paa
    // "aldrig forbundet", "udloebet" og "forbundet".
    return svar({
      fejl: "Forbindelsen til Instagram er udløbet. Forbind kontoen igen.",
      udloebet: true
    }, 409);
  }
  // --- 3) SPAERREN: HOEJST EEN MAALING PR. DOEGN --------------------------
  // Ti kald pr. maaling. En genindlaesningsknap uden spaerring kan ramme Metas
  // loft for hele appen — og saa gaar det ud over ALLE kunder, ikke kun den ene,
  // der trykkede.
  if (!kunOpslag && forb.sidst_hentet && Date.now() - new Date(forb.sidst_hentet).getTime() < 20 * 60 * 60 * 1000) {
    return svar({
      fejl: "Der er allerede hentet tal i dag. Prøv igen i morgen.",
      sidst_hentet: forb.sidst_hentet
    }, 429);
  }
  const token = String(forb.token);
  // --- 4) DE NI SENESTE OPSLAG -------------------------------------------
  const medieSvar = await fetch("https://graph.instagram.com/me/media?" + new URLSearchParams({
    fields: "id,timestamp,media_type,permalink,caption,media_url,thumbnail_url",
    limit: "9",
    access_token: token
  }));
  const medie = await medieSvar.json().catch(()=>null);
  if (!medieSvar.ok || !Array.isArray(medie?.data)) {
    return svar({
      fejl: "Kunne ikke hente opslagene: " + (medie?.error?.message ?? medieSvar.status)
    }, 502);
  }
  const opslag = medie.data.slice(0, 9);
  if (!opslag.length) return svar({
    fejl: "Der er ingen opslag at måle på endnu."
  }, 409);
  // --- 5) TALLENE PR. OPSLAG ---------------------------------------------
  // DE FIRE TAL HENTES HVER FOR SIG (5/10), praecis som appens egen wizard:
  // synes godt om · kommentarer · gemte · delte. Saa er interaktionerne
  // datakontraktens sum og ikke Metas total_interactions (som vi ikke har maalt).
  // MAALT 5/10: ig_maalinger har likes/kommentarer/gemte/sendte/profil, men
  // IKKE interaktioner eller kilde — derfor skrives de fire kolonner.
  let raekkevidde = 0;
  let likes = 0, kommentarer = 0, gemte = 0, sendte = 0;
  let talt = 0;
  const sprungetOver = [];
  const opslagListe = [];
  for (const o of opslag){
    const iSvar = await fetch("https://graph.instagram.com/" + encodeURIComponent(String(o.id)) + "/insights?" + new URLSearchParams({
      metric: "reach,likes,comments,saved,shares",
      access_token: token
    }));
    const i = await iSvar.json().catch(()=>null);
    if (!iSvar.ok || !Array.isArray(i?.data)) {
      sprungetOver.push(String(o.id));
      continue;
    }
    const tal = (navn)=>{
      const m = i.data.find((x)=>x?.name === navn);
      const v = m?.values?.[0]?.value;
      return typeof v === "number" ? v : null;
    };
    const r = tal("reach");
    // INGEN reach = INGEN maaling paa det opslag. Aldrig nul.
    if (r === null) {
      sprungetOver.push(String(o.id));
      continue;
    }
    opslagListe.push({
      id: String(o.id),
      dato: String(o.timestamp ?? ""),
      type: String(o.media_type ?? ""),
      link: String(o.permalink ?? ""),
      billede: String(o.thumbnail_url ?? o.media_url ?? ""),
      tekst: String(o.caption ?? "").slice(0, 120),
      raekkevidde: r,
      likes: tal("likes"),
      kommentarer: tal("comments"),
      gemte: tal("saved"),
      delinger: tal("shares")
    });
    raekkevidde += r;
    likes += tal("likes") ?? 0;
    kommentarer += tal("comments") ?? 0;
    gemte += tal("saved") ?? 0;
    sendte += tal("shares") ?? 0;
    talt++;
  }
  if (!talt || raekkevidde <= 0) {
    return svar({
      fejl: "Der kom ingen brugbar rækkevidde tilbage fra Instagram. Målingen er ikke gemt.",
      sprunget_over: sprungetOver.length
    }, 409);
  }
  // --- 6) FOELGERTALLET — KUN SOM KONTEKST -------------------------------
  let foelgere = null;
  try {
    const fSvar = await fetch("https://graph.instagram.com/me?" + new URLSearchParams({
      fields: "followers_count",
      access_token: token
    }));
    const f = await fSvar.json().catch(()=>null);
    if (fSvar.ok && typeof f?.followers_count === "number") foelgere = f.followers_count;
  } catch  {}
  // Raten regnes HER, ikke af Meta. EN decimal, som appens egen wizard (saveRateWizard).
  const interaktioner = likes + kommentarer + gemte + sendte;
  const rate = Math.round(interaktioner / raekkevidde * 1000) / 10;
  if (kunOpslag) {
    return svar({
      ok: true,
      kunOpslag: true,
      opslagListe,
      sprunget_over: sprungetOver.length,
      brugernavn: forb.brugernavn ?? ""
    }, 200);
  }
  // --- 7) SKRIV MAALINGEN -------------------------------------------------
  // naevner saettes af koden, hentes aldrig. Det er dét felt, der goer, at en
  // maaling mod raekkevidde aldrig kan forveksles med en gammel mod foelgere.
  const raekke = {
    kode,
    dato: new Date().toISOString().slice(0, 10),
    rate,
    raekkevidde,
    naevner: "raekkevidde",
    opslag: talt,
    foelgere,
    profil: forb.brugernavn ? "@" + forb.brugernavn : "",
    likes,
    kommentarer,
    gemte,
    sendte
  };
  const { data: skrevet, error: skrivFejl } = await admin.from("ig_maalinger").insert(raekke).select("id");
  if (skrivFejl || !skrevet || !skrevet.length) {
    return svar({
      fejl: "Målingen blev ikke gemt: " + (skrivFejl?.message ?? "nul rækker skrevet")
    }, 500);
  }
  // Spaerren staemples FOERST efter en gemt maaling. Fejler skrivningen, maa
  // kunden gerne proeve igen med det samme — ellers ville en fejl hos os koste
  // hende et doegn.
  await admin.from("ig_forbindelser").update({
    sidst_hentet: new Date().toISOString()
  }).eq("virksomhed_id", vid);
  return svar({
    ok: true,
    rate,
    raekkevidde,
    interaktioner,
    opslag: talt,
    sprunget_over: sprungetOver.length,
    foelgere,
    brugernavn: forb.brugernavn ?? "",
    opslagListe
  }, 200);
});
