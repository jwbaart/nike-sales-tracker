import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import { extractProductLinks } from "./libs/extract-products";

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const defaultRegion = "europe-west1";

export const scheduledNikeShoesCheck = functions
  .runWith({ memory: "2GB" })
  .region(defaultRegion)
  .pubsub.schedule("0 7-21 * * *")
  .timeZone("Europe/Amsterdam")
  .onRun(async (context) => {
    await (await import("./product/check-for-new-nike-shoes")).default(context);
  });

export const handleCreatedProduct = functions
  .region(defaultRegion)
  .firestore.document("products/{productId}")
  .onCreate(async (snapshot, context) => {
    await (await import("./product/on-create")).default(snapshot, context);
  });

// export const handleChangedProduct = functions
//   .region(defaultRegion)
//   .firestore.document("products/{productId}")
//   .onUpdate(async (snapshot, context) => {
//     await (await import("./product/on-change")).default(snapshot, context);
//   });

// export const extractProduct = functions
//   .runWith({ memory: "2GB" })
//   .https.onRequest(async (request, response) => {
//     const url =
//       "https://www.nike.com/nl/w/heren-sale-nike-lifestyle-13jrmz1m67gz3yaepz7yfbznik1";

//     const productLinkSelector = ".product-card__link-overlay";
//     const productTitleSelector = ".product-card__title";
//     const productImageSelector = ".product-card__hero-image img";
//     const searchTitle = "Nike Air Max 90";

//     const productLinksResult = await extractProductLinks(
//       url,
//       productLinkSelector,
//       productTitleSelector,
//       searchTitle,
//       productImageSelector
//     );

//     response.send(productLinksResult);
//   });

export const messagingToken = functions.https // .region("europe-west1") // Firebase rewrites only supports us-central1
  .onRequest(async (request, response) => {
    return (await import("./messagingToken/messagingToken")).default(
      request,
      response
    );
  });
