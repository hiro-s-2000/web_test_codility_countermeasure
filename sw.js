/* Serves a GitHub-style preview for direct .md navigations on this site. */
self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  const request = event.request;
  if (request.mode !== "navigate") return;
  const url = new URL(request.url);
  if (!url.pathname.toLowerCase().endsWith(".md")) return;
  event.respondWith((async function () {
    const shellUrl = new URL("pages/md-preview.html", self.registration.scope);
    const shell = await fetch(shellUrl, { cache: "no-cache" });
    let html = await shell.text();
    html = html.split("__MD_URL__").join(url.href);
    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  })());
});
