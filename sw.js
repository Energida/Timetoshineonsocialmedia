// Energida service worker — gør appen installérbar (og klar til push-notifikationer senere)
/* CACHE-NAVNET ER EN UDSMIDER. Ved "activate" slettes ALLE cachenavne, der ikke er
   dette — saa et bump tvinger enhver enhed til at smide sit gamle indhold vaek.
   BUMPET 4/9: Idas browser serverede v1602 fra cachen — den build, der vaeltede
   appen 3/9 — og hun saa prototypens gamle faner i stedet for Content Studio.
   Bump navnet, hver gang en braekket build kan naa at blive cachet.
   BUMPET 5/9 (v4): Idas telefon sad fast paa 1642 i et doegn, mens serveren leverede
   1690. Safari lod baggrundshentningen (waitUntil i fetch) doe, saa cachen blev aldrig
   fornyet og "ny-version" aldrig sendt. Bumpet tvinger den friske ind ved activate.
   BUMPET 14/9 (v5): Idas telefon viste igen en gammel build, mens serveren leverede en ny.
   Roden: enhver GET blev svaret fra cachen FOERST, ogsaa navigationer — saa en genindlaesning
   gav den gamle side igen. Baggrundshentningen af index.html (1,2 MB) doer paa Safari, saa
   cachen blev aldrig fornyet. Nu tjekkes friskheden paa version.txt (fire tegn), og den store
   fil hentes KUN, naar serveren er nyere. Bumpet tvinger alle enheder friske denne ene gang.
   BUMPET 14/9 (v6): Ida: »Men jeg kan jo ikke bede mine kunder nulstille paa den maade! Det skal jo virke?«
   Og det er rigtigt. Indtil nu svarede workeren ALTID med den gemte kopi og tjekkede friskheden bagefter:
   kunden fik altsaa den gamle app, og foerst derefter en genindlaesning. Doede baggrundshentningen (Safari
   dropper store hentninger i waitUntil), kom den nye aldrig, og der var ingen vej ud uden ?nulstil.
   NU tjekkes de fire tegn i version.txt FOER der svares. Er serveren ikke nyere, svares den gemte kopi med
   det samme som foer. Er den nyere, hentes den nye side og DEN svares — saa kunden faar den rigtige app
   FOERSTE gang, uden genindlaesning og uden at skulle goere noget. */
const CACHE = "energida-v6";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      /* De sider, der allerede staar aabne, blev tegnet fra den GAMLE cache. Sig til,
         saa de henter sig selv forfra (5/9) — ellers skal man selv genindlaese to gange. */
      .then(() => sigTilSiderne({ type: "ny-version" }))
  );
});

/* GEMT KOPI FOERST, NYT I BAGGRUNDEN (Idas klik-valg 4. september 2026).
   Hendes ord: appen var "sindssyg langsom", og der kom ingen venteskaerm frem.
   MAALT: index.html er 4 MB (1,2 MB pakket), og med netvaerk-foerst kunne INTET
   tegne sig, foer hele filen var hentet — hver eneste gang, ogsaa naar telefonen
   allerede havde en god kopi.

   NU: den gemte kopi svares med det samme, og en frisk hentes i baggrunden.
   Er den friske ANDERLEDES end den gemte, faar siden besked (BESKED: "ny-version"),
   og appen genindlaeser sig selv — Idas valg: hurtigst OG altid nyeste.

   HVORFOR DET ER SIKKERT EFTER 3/9: en braekket build kan ikke laase nogen fast,
   for cachenavnet er stadig en udsmider ved "activate", og "Hent appen forfra" i
   fejlfladen afmelder service-workeren og sletter ALLE caches.

   NAVIGATIONER OG index.html er de eneste, der sammenlignes — resten (billeder,
   ikoner) opdateres bare stille. */
function erAppFilen(req) {
  if (req.mode === "navigate") return true;
  const u = req.url.split("?")[0];
  return u.endsWith("/") || u.endsWith("/index.html");
}
/* Versionsfilen maa ALDRIG svares fra cachen — den ER maalestokken (samme regel som _headers).
   Foer blev hvert tjek (version.txt?vagt=<tid>) ogsaa GEMT, saa cachen voksede med en raekke
   hvert femte minut, uden at nogen laeste dem igen. */
function erVersionsFilen(req) { return req.url.split("?")[0].endsWith("/version.txt"); }

function versionIHtml(txt) { const m = txt.match(/const APP_VERSION = "(\d{1,6})"/); return m ? Number(m[1]) : null; }

/* Appfilen har EEN plads i cachen: basen uden parametre. Saa kan ?frisk= og ?nulstil= ikke
   efterlade hver sin kopi, og en frisk hentning erstatter altid den, den naeste plain visning
   faar. Foer laa /?frisk=123 som sin egen raekke, mens / stadig bar den gamle build. */
function appFilNoegle(req) {
  try { const u = new URL(req.url); u.search = ""; u.hash = ""; return new Request(u.toString(), { credentials: "same-origin" }); }
  catch (e) { return req; }
}
/* ?frisk= og ?nulstil= betyder "spring cachen over" — det er vejen ud af en gammel build. */
function friskKraevet(req) { return /[?&](frisk|nulstil)(=|&|$)/.test(req.url); }
/* De fire tegn, med et loft paa ventetiden: svarer nettet ikke hurtigt, svarer vi den gemte kopi
   i stedet for at lade kunden se paa en hvid skaerm. Timeouten afbryder ikke hentningen. */
async function udeVersion(ms) {
  try {
    const r = await Promise.race([
      fetch("version.txt?sw=" + Date.now(), { cache: "no-store" }),
      new Promise((res) => setTimeout(() => res(null), ms))
    ]);
    if (!r || !r.ok) return null;
    const t = (await r.text()).trim();
    return /^[0-9]{1,6}$/.test(t) ? Number(t) : null;
  } catch (err) { return null; }
}

/* friskNaarNyere er UDE (14/9): den tjekkede friskheden EFTER at den gamle kopi var svaret, og det
   var netop det, der lod en kunde staa paa en gammel build. Tjekket ligger nu FOER svaret i
   fetch-handleren. Een mekanik, ingen tvillinger. */
async function sigTilSiderne(besked) {
  const liste = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  liste.forEach((c) => { try { c.postMessage(besked); } catch (err) {} });
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (e.request.url.indexOf(self.location.origin) !== 0) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);

    /* version.txt: altid fra nettet, aldrig gemt. Kun uden net falder vi tilbage paa en kopi. */
    if (erVersionsFilen(e.request)) {
      try { const r = await fetch(e.request, { cache: "no-store" }); if (r) return r; } catch (err) {}
      const k = await cache.match(e.request);
      return k || new Response("", { status: 504 });
    }

    /* ===== APPFILEN: TJEK FOERST, SVAR DEREFTER (14/9) =====
       1) ?frisk=/?nulstil= i adressen: hent fra nettet, gem paa basens plads, svar.
       2) ingen gemt kopi: hent, gem, svar.
       3) gemt kopi + serveren er IKKE nyere: svar kopien med det samme (som foer, lige saa hurtigt).
       4) gemt kopi + serveren ER nyere: hent den nye og svar MED den. Tager den for lang tid,
          svares den gamle, mens hentningen koerer videre og lander i cachen — saa er naeste
          visning frisk, uden at nogen skal goere noget. */
    if (erAppFilen(e.request)) {
      const noegle = appFilNoegle(e.request);
      const gemtApp = friskKraevet(e.request) ? null : await cache.match(noegle);
      const hentNy = async () => {
        const res = await fetch(e.request, { cache: "reload" });
        if (res && res.ok) { try { await cache.put(noegle, res.clone()); } catch (err) {} }
        return res;
      };
      if (!gemtApp) {
        try { const res = await hentNy(); if (res) return res; } catch (err) {}
        const n = await cache.match(noegle);
        return n || new Response("", { status: 504 });
      }
      const gammel = versionIHtml(await gemtApp.clone().text());
      const ude = await udeVersion(1800);
      if (gammel == null || ude == null || ude <= gammel) return gemtApp;
      /* Serveren er nyere. Hentningen holdes i live med waitUntil, ogsaa hvis vi loeber toer for taalmodighed. */
      const stor = hentNy();
      e.waitUntil(stor.then(() => sigTilSiderne({ type: "ny-version" })).catch(() => null));
      const svar = await Promise.race([stor.catch(() => null), new Promise((res) => setTimeout(() => res(null), 6000))]);
      if (svar && svar.ok) return svar;
      return gemtApp;
    }

    const gemt = await cache.match(e.request);

    if (gemt) {
      e.waitUntil(fetch(e.request).then(async (res) => { if (res && res.ok) await cache.put(e.request, res.clone()); }).catch(() => null));
      return gemt;
    }

    /* ingen kopi: hent, gem, svar */
    try {
      const res = await fetch(e.request);
      if (res && res.ok) await cache.put(e.request, res.clone());
      return res || new Response("", { status: 504 });
    } catch (err) { return new Response("", { status: 504 }); }
  })());
});

// Klar til fremtiden: push-notifikationer lander her (Trin 2)
self.addEventListener("push", (e) => {
  const data = (() => { try { return e.data.json(); } catch(err) { return { title: "Energida", body: e.data ? e.data.text() : "" }; } })();
  e.waitUntil(
    self.registration.showNotification(data.title || "Energida", {
      body: data.body || "",
      icon: "icon-192.png",
      badge: "icon-192.png"
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow("./"));
});
