import * as functions from "firebase-functions";
import { extractProductsFromPage } from "./extract-products-from-page";
import { setAllProductsToInactive } from "./firestore/set-all-products-to-inactive";
import { processExtractedProducts } from "./process-extracted-products";
import { ProductExtracted } from "./products";

export default async (context: functions.EventContext) => {
  const url =
    "https://www.nike.com/nl/w/heren-sale-nike-air-max-lifestyle-13jrmz1m67gz3yaepz7yfbz98pddznik1";

  const productLinkSelector = ".product-card__link-overlay";
  const productTitleSelector = ".product-card__title";
  const productImageSelector = ".product-card__hero-image img";
  const priceSelector = "[data-test='product-price']";
  const reducedPriceSelector = "[data-test='product-price-reduced']";
  const searchTitle = "Nike Air Max 90";

  const productLinksResult: ProductExtracted[] = await extractProductsFromPage(
    url,
    productLinkSelector,
    productTitleSelector,
    searchTitle,
    productImageSelector,
    priceSelector,
    reducedPriceSelector
  );

  await setAllProductsToInactive();
  await processExtractedProducts(productLinksResult);
  console.log(productLinksResult);

  return null;
};
