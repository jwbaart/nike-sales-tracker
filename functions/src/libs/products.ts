import { firestore } from "firebase-admin";

export class Product {
  constructor(
    public id: string,
    public url: string,
    public timestamp: firestore.FieldValue = firestore.FieldValue.serverTimestamp(),
    public active: boolean = true,
    public notificationSent: boolean = false
  ) {}
}

export const getProductsCollection = (): firestore.CollectionReference<
  firestore.DocumentData
> => firestore().collection("products");
