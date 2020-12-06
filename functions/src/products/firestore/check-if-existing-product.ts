import { Product, ProductExtracted } from "../products";
import { productsCollection } from "./firestore";

export const checkIfExistingProduct = async (
  product: Product | ProductExtracted
): Promise<boolean> => {
  try {
    const productRef = await productsCollection().doc(product.id);
    const productSnapshot = await productRef.get();
    return productSnapshot.exists;
  } catch {
    console.error("isExistingProduct failed");
  }
  return false;
};
