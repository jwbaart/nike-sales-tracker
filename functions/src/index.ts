import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { extractProductLinks } from "./libs/extract-products";
import { storeNewProducts } from "./libs/store-new-products";

admin.initializeApp();

export const checkProducts = functions
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

    await storeNewProducts(productLinksResult);

    response.send(productLinksResult);
  });
