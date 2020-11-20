import { getProductsCollection, Product } from "./products";

export const storeNewProducts = (productLinks: any) => {
  return productLinks.forEach(async (productUrl: string) => {
    const id = productUrl.split("/").pop();

    if (id) {
      const product: Product = new Product(id, productUrl);

      try {
        await getProductsCollection()
          .doc(id)
          .set({ ...product }, { merge: true });
      } catch {
        throw new Error("Storing of new products failed");
      }
    } else {
      throw new Error("Creation of product id failed");
    }

    return;
  });
};
