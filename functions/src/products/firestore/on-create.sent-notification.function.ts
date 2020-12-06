import * as functions from "firebase-functions";
import { sentNotification } from "../../libs/sent-notification";
import { Product } from "../products";

export default async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const product: Product = snapshot.data() as Product;

  await sentNotification({
    title: product.title,
    body: `${product.price} to ${product.reducedPrice}`,
    url: product.url,
    icon: product.icon,
  }).catch((error: Error) =>
    console.error("sendNotifications sent error", error)
  );
  return;
};
