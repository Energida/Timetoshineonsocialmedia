// Energida service worker — gør appen installérbar (og klar til push-notifikationer senere)
/* CACHE-NAVNET ER EN UDSMIDER. Ved "activate" slettes ALLE cachenavne, der ikke er
   dette — saa et bump tvinger enhver enhed til at smide sit gamle indhold vaek.
   BUMPET 4/9: Idas browser serverede v1602 fra cachen — den build, der vaeltede
   appen 3/9 — og hun saa prototypens gamle faner i stedet for Content Studio.
   Bump navnet, hver gang en braekket build kan naa at blive cachet. */
const CACHE = "energida-v2";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Netværk først, cache som nødplan — så appen altid er friskest muligt,
// men stadig kan åbne uden forbindelse.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && e.request.url.indexOf(self.location.origin) === 0) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
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
