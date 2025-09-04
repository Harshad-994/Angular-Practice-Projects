importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/7.3.0/workbox-sw.js"
);

workbox.precatching.precacheAndRoute([
  { url: "/favicon.ico" },
  { url: "/index.csr.html" },
  { url: "/index.html" },
  { url: "/manifest.webmanifest" },
  { url: "/*.js" },
  { url: "/*.css" },
]);
