import * as functions from "firebase-functions";
import { extractProductLinks } from "../libs/extract-products";
import { storeNewProducts } from "../libs/store-new-products";
import { setAllProductsToInactive } from "../libs/set-all-products-to-inactive";

export default async (context: functions.EventContext) => {
  const url =
    "https://www.nike.com/nl/w/heren-sale-nike-air-max-lifestyle-13jrmz1m67gz3yaepz7yfbz98pddznik1";

  const productLinkSelector = ".product-card__link-overlay";
  const productTitleSelector = ".product-card__title";
  const productImageSelector = ".product-card__hero-image img";
  const searchTitle = "Nike Air Max 90";

  const productLinksResult = await extractProductLinks(
    url,
    productLinkSelector,
    productTitleSelector,
    searchTitle,
    productImageSelector
  );

  await setAllProductsToInactive();
  await storeNewProducts(productLinksResult);

  return null;
};
