import { firestore } from "firebase-admin";

export const getProductsCollection = (): firestore.CollectionReference<
  firestore.DocumentData
> => firestore().collection("products");
