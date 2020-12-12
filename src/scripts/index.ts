
import { Product } from "../../functions/src/products/products";
import { initializeFirebase } from "./firebase";
import { getActiveProducts } from "./firestore";

(async () => {
  await initializeFirebase();
  const activeProducts: Product[] = await getActiveProducts();

  console.log("activeProducts", activeProducts);
})();

// axios("/messagingToken", {
//   method: "DELETE",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ id: "test-id" }),
// });
// axios.delete("/messagingToken").then(console.log, console.error);

// axios({
//   method: "delete",
//   url: "/api/messagingToken",
//   data: {
//     id: "test-id",
//   },
// });
// app.axios.delete("/api/messagingToken", {
//   data: {
//     id: "test-id",
//   },
// });
