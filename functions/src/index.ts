import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { extractProductLinks } from "./libs/extract-products";
import { storeNewProducts } from "./libs/store-new-products";
import { setAllProductsToInactive } from "./libs/set-all-products-to-inactive";

admin.initializeApp({ credential: admin.credential.applicationDefault() });

export const checkProducts = functions
  .runWith({
    memory: "2GB",
  })
  .region("europe-west1")
  .https.onRequest(async (request, response) => {
    const url =
      "https://www.nike.com/nl/w/heren-sale-nike-air-max-lifestyle-13jrmz1m67gz3yaepz7yfbz98pddznik1";

    const productLinkSelector = ".product-card__link-overlay";
    const productTitleSelector = ".product-card__title";
    const searchTitle = "Nike Air Max 90";

    const productLinksResult = await extractProductLinks(
      url,
      productLinkSelector,
      productTitleSelector,
      searchTitle
    );

    await setAllProductsToInactive();
    await storeNewProducts(productLinksResult);

    response.send(productLinksResult);
  });

export const sendNotifications = functions
  .region("europe-west1")
  .firestore.document("products/{productId}")
  .onCreate(async (snapshot, context) => {
    await (await import("./product/on-create")).default(snapshot, context);
  });

export const sendNotificationsOnChange = functions
  .region("europe-west1")
  .firestore.document("products/{productId}")
  .onUpdate(async (snapshot, context) => {
    await (await import("./product/on-change")).default(snapshot, context);
  });
