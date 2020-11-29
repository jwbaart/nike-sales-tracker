import { getProductsCollection } from "./firestore";

export const setAllProductsToInactive = async () => {
  return await getProductsCollection()
    .get()
    .then(
      async (querySnapshot) =>
        await Promise.all(
          querySnapshot.docs.map(async (product) =>
            product.ref.update({ active: false })
          )
        )
    );
};
