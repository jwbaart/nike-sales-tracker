import * as functions from "firebase-functions";
import { createIconOfPublicImage } from "../libs/create-icon";
import { Product } from "../libs/products";
import { sentNotification } from "../libs/sent-notification";

export default async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const product: Product = change.after.data() as Product;
  const icon = await createIconOfPublicImage(product.imageUrl);

  // Prevent infinite loop by the onchange of icon attribute
  if (!product.hasOwnProperty("icon")) {
    try {
      await change.after.ref.set(
        {
          icon,
        },
        { merge: true }
      );
    } catch {
      throw new Error("Product on create - adding icon failed");
    }
  }

  await sentNotification({
    title: product.title,
    body: product.url,
    url: product.url,
    icon,
  }).catch((error) => console.error("sendNotifications", error));
  return;
};
