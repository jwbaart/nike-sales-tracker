import { MessagingToken } from "../messagingToken";
import { getMessagingTokensCollection } from "./firestore";

export const addMessagingToken = async ({ id }: MessagingToken) => {
  const messagingTokensCollection = await getMessagingTokensCollection();

  return messagingTokensCollection.doc(id).set({
    id,
  });
};
