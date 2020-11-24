importScripts("/__/firebase/8.0.1/firebase-app.js");
importScripts("/__/firebase/8.0.1/firebase-messaging.js");
importScripts("/__/firebase/init.js");

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("onBackgroundMessage payload", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.data.icon,
    data: payload.data,
    requireInteraction: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  let url = event.notification.data.url;

  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
