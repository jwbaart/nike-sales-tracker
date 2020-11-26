import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

type MessagingToken = {
  id: string;
};

export const getMessagingTokensCollection = (): firestore.CollectionReference<
  firestore.DocumentData
> => firestore().collection("messagingTokens");

export default async (
  request: functions.https.Request,
  response: functions.Response
): Promise<void> => {
  const { id } = request.body as MessagingToken;

  if (id && id.length) {
    if (request.method === "PUT") {
      await addTokenInDatabase({ id });
    } else if (request.method === "DELETE") {
      await deleteTokenInDatabase({ id });
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
