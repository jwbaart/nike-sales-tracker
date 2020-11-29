import { firestore } from "firebase-admin";
import { MessagingToken } from "../messagingToken";

export const getMessagingTokensCollection = (): firestore.CollectionReference<
  firestore.DocumentData
> => firestore().collection("messagingTokens");

export const getMessagingTokensCollectionGroup = (): firestore.CollectionGroup<
  firestore.DocumentData
> => firestore().collectionGroup("messagingTokens");

export const getMessagingTokens = async (): Promise<MessagingToken[]> => {
  const messagingTokensCollectionGroup = await getMessagingTokensCollectionGroup();

  const querySnapshot = await messagingTokensCollectionGroup
    .withConverter(messagingTokenConverter)
    .get();

  return querySnapshot.docs.map((doc) => doc.data());
};

export const getMessagingTokensId = async (): Promise<string[]> => {
  const messagingTokensCollectionGroup = await getMessagingTokensCollectionGroup();

  const querySnapshot = await messagingTokensCollectionGroup
    .withConverter(messagingTokenConverter)
    .get();

  return querySnapshot.docs.map((doc) => doc.data().id);
};

const messagingTokenConverter = {
  toFirestore(messagingToken: MessagingToken): FirebaseFirestore.DocumentData {
    return { id: messagingToken.id };
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): MessagingToken {
    const data = snapshot.data();
    return new MessagingToken(data.id);
  },
};
