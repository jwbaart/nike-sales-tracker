import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const defaultRegion = "europe-west1";

export const scheduledNikeShoesCheck = functions
  .runWith({ memory: "2GB" })
  .region(defaultRegion)
  .pubsub.schedule("0 7-21 * * *")
  .timeZone("Europe/Amsterdam")
  .onRun(async (context) => {
    await (
      await import("./products/check-for-new-nike-shoes.function")
    ).default(context);
  });

export const handleCreatedProduct = functions
  .region(defaultRegion)
  .firestore.document("products/{productId}")
  .onCreate(async (snapshot, context) => {
    await (
      await import("./products/firestore/on-create.sent-notification.function")
    ).default(snapshot, context);
  });

export const messagingToken = functions.https // .region("europe-west1") // Firebase rewrites only supports us-central1
  .onRequest(async (request, response) => {
    return (await import("./messagingToken/messagingToken.function")).default(
      request,
      response
    );
  });

export const testFunction = functions.https.onRequest(
  async (request, response) => {
    return (await import("./products/test.function")).default(
      request,
      response
    );
  }
);
