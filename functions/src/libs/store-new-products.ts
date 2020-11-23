import { ProductExtracted } from "./extract-products";
import { getProductsCollection, Product } from "./products";

export const storeNewProducts = async (
  productInformations: ProductExtracted[]
) =>
  productInformations.forEach(async ({ id, url, title, imageUrl }) => {
    const product: Product = new Product(id, url, title, imageUrl);

    try {
      await getProductsCollection()
        .doc(id)
        .set({ ...product }, { merge: true });
    } catch {
      throw new Error("Storing of new product failed");
    }

    return;
  });
