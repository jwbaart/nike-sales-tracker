import { getProductsCollection } from "./products";

export const setAllProductsToInactive = () => {
  return getProductsCollection()
    .get()
    .then(
      async (querySnapshot) =>
        await Promise.all(
          querySnapshot.docs.map(async (product) => {
            console.log("A1");
            return await product.ref.update({ active: false });
          })
        )
    );
};
