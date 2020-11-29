import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

class MessagingToken {
  constructor(readonly id: string) {}
}

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

export default async (
  request: functions.https.Request,
  response: functions.Response
): Promise<void> => {
  const { id } = request.body as MessagingToken;

  if (id && id.length) {
    try {
      if (request.method === "PUT") {
        await addTokenInDatabase({ id });
      } else if (request.method === "DELETE") {
        await deleteTokenInDatabase({ id });
      }
    } catch {
      console.error("Handling of messaging token failed");
    }
  }
  response.status(200).send();
};

const addTokenInDatabase = async ({ id }: MessagingToken) => {
  const messagingTokensCollection = await getMessagingTokensCollection();

  return messagingTokensCollection.doc(id).set({
    id,
  });
};

const deleteTokenInDatabase = async ({ id }: MessagingToken) => {
  const messagingTokensCollection = await getMessagingTokensCollection();

  return messagingTokensCollection.doc(id).delete();
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
