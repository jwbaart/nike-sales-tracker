import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const defaultRegion = "europe-west1";

export const scheduledNikeShoes = functions
  .runWith({ memory: "2GB" })
  .region(defaultRegion)
  .pubsub.schedule("* 7-21 * * *")
  .timeZone("Europe/Amsterdam")
  .onRun(async (context) => {
    await (await import("./product/check-for-new-nike-shoes")).default(context);
  });

export const sendNotifications = functions
  .region(defaultRegion)
  .firestore.document("products/{productId}")
  .onCreate(async (snapshot, context) => {
    await (await import("./product/on-create")).default(snapshot, context);
  });

// export const sendNotificationsOnChange = functions
//   .region(defaultRegion)
//   .firestore.document("products/{productId}")
//   .onUpdate(async (snapshot, context) => {
//     await (await import("./product/on-change")).default(snapshot, context);
//   });
