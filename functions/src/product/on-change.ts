import * as functions from "firebase-functions";
import { Product } from "../libs/products";
import { sentNotification } from "../libs/sent-notification";

export default async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const product: Product = change.after.data() as Product;
  await sentNotification({
    title: product.title,
    body: product.url,
    url: product.url,
    imageUrl: product.imageUrl,
  }).catch((error) => console.error("sendNotifications", error));
  return;
};
