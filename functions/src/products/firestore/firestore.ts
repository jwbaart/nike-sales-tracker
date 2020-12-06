import { firestore } from "firebase-admin";

export const productsCollection = (): firestore.CollectionReference<firestore.DocumentData> =>
  firestore().collection("products");
