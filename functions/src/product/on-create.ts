import * as functions from "firebase-functions";
import { createIconOfPublicImage } from "../libs/create-icon";
import { Product } from "../libs/products";
import { sentNotification } from "../libs/sent-notification";

export default async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const product: Product = snapshot.data() as Product;
  const icon = await createIconOfPublicImage(product.imageUrl);

  try {
    await snapshot.ref.set(
      {
        icon,
      },
      { merge: true }
    );
  } catch {
    throw new Error("Product on create - adding icon failed");
  }

  await sentNotification({
    title: product.title,
    body: `${product.price} to ${product.reducedPrice}`,
    url: product.url,
    icon,
  }).catch((error) => console.error("sendNotifications sent error", error));
  return;
};
