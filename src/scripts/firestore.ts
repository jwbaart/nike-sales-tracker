import firebase from "firebase/app";
import "firebase/firestore";
import { Product } from "../../functions/src/products/products";

const db = () => firebase.firestore();

export const getActiveProducts = async () => {
  const activeProductsRef = await db()
    .collection("products")
    .where("active", "==", true)
    .get();

  let activeProducts: Product[] = [];
  activeProductsRef.forEach((doc) =>
    activeProducts.push(doc.data() as Product)
  );

  return activeProducts;
};
