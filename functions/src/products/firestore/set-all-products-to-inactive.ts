import { productsCollection } from "./firestore";

export const setAllProductsToInactive = async () => {
  return await productsCollection()
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
