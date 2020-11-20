import * as functions from "firebase-functions";
import { extractProductLinks } from "./extract-products";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions
  .runWith({
    timeoutSeconds: 120,
    memory: "2GB",
  })
  .https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
  });

export const productLinks = functions.https.onRequest(
  async (request, response) => {
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

    response.send(productLinksResult);
  }
);
