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
   fil hentes KUN, naar serveren er nyere. Bumpet tvinger alle enheder friske denne ene gang. */
const CACHE = "energida-v5";

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

/* DEN BILLIGE FRISKHEDSTJEK (14/9). Foer hentede vi 1,2 MB i baggrunden ved hver sidevisning og
   haabede, at Safari lod den koere faerdig. Nu hentes fire tegn: er serveren IKKE nyere, sker der
   ingenting. Er den nyere (eller kan vi ikke laese tallet), hentes den store fil og siden faar besked. */
async function friskNaarNyere(cache, req, gemt) {
  try {
    const gammelTxt = await gemt.clone().text();
    const gammel = versionIHtml(gammelTxt);
    const r = await fetch("version.txt?sw=" + Date.now(), { cache: "no-store" });
    if (r && r.ok && gammel != null) {
      const ude = (await r.text()).trim();
      if (/^[0-9]{1,6}$/.test(ude) && Number(ude) <= gammel) return;   /* samme eller aeldre: rør ikke noget */
    }
    const res = await fetch(req);
    if (!res || !res.ok) return;
    const nyTxt = await res.clone().text();
    await cache.put(req, res.clone());
    if (nyTxt !== gammelTxt) await sigTilSiderne({ type: "ny-version" });
  } catch (err) {}
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

    /* version.txt: altid fra nettet, aldrig gemt. Kun uden net falder vi tilbage paa en kopi. */
    if (erVersionsFilen(e.request)) {
      try { const r = await fetch(e.request, { cache: "no-store" }); if (r) return r; } catch (err) {}
      const k = await cache.match(e.request);
      return k || new Response("", { status: 504 });
    }

    const gemt = await cache.match(e.request);

    if (gemt) {
      /* Appfilen: billig friskhedstjek (version.txt) og kun den store hentning, naar det er noedvendigt.
         Alt andet (billeder, ikoner) opdateres stille som foer. */
      if (erAppFilen(e.request)) e.waitUntil(friskNaarNyere(cache, e.request, gemt));
      else e.waitUntil(fetch(e.request).then(async (res) => { if (res && res.ok) await cache.put(e.request, res.clone()); }).catch(() => null));
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
