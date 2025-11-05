self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", () => clients.claim());
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  event.respondWith((async () => {
    try { return await fetch(request); }
    catch {
      if (request.destination === "document") {
        return new Response("<!doctype html><body><h3>Offline</h3></body>", { headers: { "Content-Type":"text/html" } });
      }
      throw e;
    }
  })());
});
