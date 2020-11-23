import { firestore } from "firebase-admin";
import { ProductExtracted } from "./extract-products";

export class Product extends ProductExtracted {
  constructor(
    public id: string,
    public url: string,
    public title: string,
    public imageUrl: string,
    public timestamp: firestore.FieldValue = firestore.FieldValue.serverTimestamp(),
    public active: boolean = true,
    public notificationSent: boolean = false
  ) {
    super(id, url, title, imageUrl);
  }
}

export const getProductsCollection = (): firestore.CollectionReference<
  firestore.DocumentData
> => firestore().collection("products");
