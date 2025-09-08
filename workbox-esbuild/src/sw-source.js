import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

self.__WB_MANIFEST;

// API calls
registerRoute(
  ({ url }) => url.origin === "https://my-json-server.typicode.com",
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Push event (receive and show notification)
self.addEventListener("push", (event) => {
  const notification = event.data.json().notification;
  console.log("event : ", event);
  console.log("notification : ", notification);

  const options = {
    title: notification.title,
    icon: notification.icon,
    badge: notification.badge,
    actions: notification.actions,
    requireInteraction: true,
    body: notification.body,
    data: { url: notification.data.url || "/" }, // From payload for click redirection
  };
  event.waitUntil(
    self.registration.showNotification(
      notification.title || "To-Do Update",
      options
    )
  );
});

// Click event (redirect on 'view')
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "view") {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientsArr) => {
          const windowToFocus = clientsArr.find(
            (windowClient) => windowClient.focused
          );
          if (windowToFocus) {
            windowToFocus.focus();
            windowToFocus.navigate(event.notification.data.url); // Navigate to home or route
          } else {
            clients.openWindow(event.notification.data.url); // Open new tab
          }
        })
    );
  }
});

self.addEventListener("sync", (event) => {
  console.log("In the sync event", event);

  if (event.tag === "sync-todos") {
    event.waitUntil(syncPendingTodos());
  }
});

async function syncPendingTodos() {
  console.log("Syncing to-dos");
}
