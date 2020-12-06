import { createIconOfPublicImage } from "../../libs/create-icon";
import { Product, ProductExtracted } from "../products";
import { firestore } from "firebase-admin";
import { productsCollection } from "./firestore";

export const createProduct = async (productExtracted: ProductExtracted) => {
  try {
    const icon = await createIconOfPublicImage(productExtracted.imageUrl);

    const product: Product = {
      ...productExtracted,
      active: true,
      notificationSent: false,
      timestamp: firestore.FieldValue.serverTimestamp(),
      lastChanged: firestore.FieldValue.serverTimestamp(),
      icon,
    };

    await productsCollection().doc(product.id).set(product);
  } catch {
    throw new Error("Adding of new product failed");
  }
};
