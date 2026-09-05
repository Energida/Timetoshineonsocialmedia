// Energida service worker — gør appen installérbar (og klar til push-notifikationer senere)
/* CACHE-NAVNET ER EN UDSMIDER. Ved "activate" slettes ALLE cachenavne, der ikke er
   dette — saa et bump tvinger enhver enhed til at smide sit gamle indhold vaek.
   BUMPET 4/9: Idas browser serverede v1602 fra cachen — den build, der vaeltede
   appen 3/9 — og hun saa prototypens gamle faner i stedet for Content Studio.
   Bump navnet, hver gang en braekket build kan naa at blive cachet.
   BUMPET 5/9 (v4): Idas telefon sad fast paa 1642 i et doegn, mens serveren leverede
   1690. Safari lod baggrundshentningen (waitUntil i fetch) doe, saa cachen blev aldrig
   fornyet og "ny-version" aldrig sendt. Bumpet tvinger den friske ind ved activate. */
const CACHE = "energida-v4";

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

async function sigTilSiderne(besked) {
  const liste = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  liste.forEach((c) => { try { c.postMessage(besked); } catch (err) {} });
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (e.request.url.indexOf(self.location.origin) !== 0) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const gemt = await cache.match(e.request);

    /* Den friske hentes ALTID — forskellen er kun, om vi venter paa den. */
    const frisk = fetch(e.request).then(async (res) => {
      if (!res || !res.ok) return res;
      const nyTekst = erAppFilen(e.request) ? await res.clone().text() : null;
      /* GEM FOERST, SIG TIL BAGEFTER (5/9). Foer blev beskeden sendt FOER cache.put —
         saa kunne siden naa at genindlaese og faa den gamle kopi EN gang til. */
      await cache.put(e.request, res.clone());
      if (nyTekst !== null && gemt) {
        const gammelTekst = await gemt.clone().text();
        if (gammelTekst !== nyTekst) sigTilSiderne({ type: "ny-version" });
      }
      return res;
    }).catch(() => null);

    if (gemt) { e.waitUntil(frisk); return gemt; }      /* har vi en kopi: svar NU */
    const res = await frisk;                            /* foerste gang: vent */
    return res || new Response("", { status: 504 });
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
