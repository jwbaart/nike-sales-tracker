import { MessagingToken } from "../messagingToken";
import { getMessagingTokensCollection } from "./firestore";

export const deleteMessagingToken = async ({ id }: MessagingToken) => {
  const messagingTokensCollection = await getMessagingTokensCollection();

  return messagingTokensCollection.doc(id).delete();
};
