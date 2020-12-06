import { checkIfExistingProduct } from "./firestore/check-if-existing-product";
import { createProduct } from "./firestore/create";
import { updateProduct } from "./firestore/update";
import { ProductExtracted } from "./products";

export const processExtractedProducts = async (
  extractedProducts: ProductExtracted[]
) => extractedProducts.forEach(processExtractedProduct);

export const processExtractedProduct = async (
  productExtracted: ProductExtracted
) => {
  const isExistingProduct = await checkIfExistingProduct(productExtracted);

  if (isExistingProduct) {
    return updateProduct({ ...productExtracted, active: true });
  } else {
    return createProduct(productExtracted);
  }
};
