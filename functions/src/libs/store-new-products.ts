import * as admin from "firebase-admin";

export const storeNewProducts = (productLinks: any) => {
  return productLinks.forEach(async (productUrl: string) => {
    const id = productUrl.split("/").pop();
    const product = {
      id,
      url: productUrl,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      new: true,
    };

    if (id) {
      try {
        await admin
          .firestore()
          .collection("products")
          .doc(id)
          .set({ ...product }, { merge: true });
      } catch {
        throw new Error("Storing of new products failed");
      }
    }

    return;
  });
};
