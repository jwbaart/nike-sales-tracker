import { Product, ProductExtracted } from "../products";
import { firestore } from "firebase-admin";
import { productsCollection } from "./firestore";

export const updateProduct = async (product: Product | ProductExtracted) => {
  try {
    await productsCollection()
      .doc(product.id)
      .set(
        {
          ...product,
          lastChanged: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  } catch {
    throw new Error("Updating of product failed");
  }
};
