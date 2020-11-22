import * as functions from "firebase-functions";
import { Product } from "../libs/products";
import { sentNotification } from "../libs/sent-notifiation";

export default async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const product: Product = snapshot.data() as Product;
  console.log("sendNotifications product", product);
  await sentNotification({
    title: product.title,
    body: product.url,
  }).catch((error) => console.log("sendNotifications", error));
  return;
};
