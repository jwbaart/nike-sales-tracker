import { firestore } from "firebase-admin";

export interface ProductExtracted {
  id: string;
  imageUrl: string;
  price: string;
  reducedPrice: string;
  title: string;
  url: string;
}

export interface Product extends ProductExtracted {
  active: boolean;
  icon: string;
  notificationSent: boolean;
  timestamp: firestore.FieldValue;
  lastChanged: firestore.FieldValue;
}
