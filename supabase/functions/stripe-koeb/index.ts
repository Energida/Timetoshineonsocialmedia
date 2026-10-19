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
// 6. OMKOSTNING: ingen direkte. Ingen AI-kald. Der sendes én invitationsmail
//    pr. koeb via Supabase.
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
  const navn = String(s.customer_details?.name ?? "").trim();
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
  const virkFundet = virkKilder.find((x) => x[1]);
  const virksomhed = virkFundet ? virkFundet[1] : "Ny kunde";
  const virkKilde = virkFundet ? virkFundet[0] : "ingen";
  // --- HVILKET PRODUKT? (27/9, lanceringen af YOU GOT THIS 1/10) -----------
  // Betalingslinket i Stripe bærer mærket (metadata) produkt=yougotthis, og Stripe
  // kopierer et Payment Links metadata over på hver checkout-session. Uden mærket er
  // det et Content Studio-køb som før. forening + pakke kommer fra samme mærke.
  const md: Record<string, string> = (s.metadata && typeof s.metadata === "object") ? s.metadata : {};
  const erYGT = String(md.produkt ?? "").toLowerCase() === "yougotthis";
  const forening = String(md.forening ?? "").trim();
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
    if (brugere.some((u) => String(u.email ?? "").toLowerCase() === email)) {
      return svar({ ok: true, allerede: email, oprettet: false }, 200);
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
  try {
    const { data, error } = await admin.from("contacts").insert({
      kunde: virksomhed,
      status: "Kunde",
      source: erTest ? "Testlink" : (erYGT ? ("YOU GOT THIS" + (forening ? " · " + forening : "")) : "Stripe"),
      kommentar: [navn, email, telefon, "Kode: " + kode, (s.amount_total != null ? "Beløb: " + Math.round(Number(s.amount_total) / 100) + " kr." : "")].filter(Boolean).join(" · "),   // BELØBET TIL LIVE-OVERBLIKKET (Idas klik 19/10 »Kroner pr. køb«): Stripes amount_total i øre → hele kroner
    }).select("id");
    if (error || !data || !data.length) kontaktOk = false;
  } catch { kontaktOk = false; }

  // --- 5) INVITATIONEN — ALDRIG ET KODEORD --------------------------------
  // Hun faar et link, hvor hun saetter sin egen adgangskode. redirectTo er ikke
  // pynt: uden den lander hun paa projektets Site URL. Adressen skal ogsaa staa
  // under Authentication -> URL Configuration -> Redirect URLs.
  const { data: nyBruger, error: invFejl } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { navn: navn || virksomhed, kode },
    redirectTo: "https://b2b.energida.dk",
  });
  if (invFejl) {
    return svar({ fejl: "Kunden er oprettet, men invitationen blev ikke sendt: " + invFejl.message, kode }, 500);
  }

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

  // virk_kilde er ikke pynt: den er beviset for, HVOR virksomhedsnavnet kom fra.
  // Staar der "customer_details.name (noedspor)", fandt vi aldrig firmanavnet, og
  // kunden hedder nu det samme som personen. Det skal ses, ikke opdages senere.
  return svar({ ok: true, oprettet: true, kartotek: kartotekOk, kode, produkt: erYGT ? "yougotthis" : "contentstudio", virksomhed_id: virksomhedId, laast: !!nyId, test: !!erTest, kontakt: kontaktOk, virk_kilde: virkKilde }, 200);
});