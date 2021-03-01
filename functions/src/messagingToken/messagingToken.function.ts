import * as functions from "firebase-functions";
import { addMessagingToken } from "./firestore/add";
import { deleteMessagingToken } from "./firestore/delete";
import { MessagingToken } from "./messagingToken";

export default async (
  request: functions.https.Request,
  response: functions.Response
): Promise<void> => {
  const { id } = request.body.data as MessagingToken;

  if (id && id.length) {
    try {
      if (request.method === "PUT") {
        await addMessagingToken({ id });
      } else if (request.method === "DELETE") {
        await deleteMessagingToken({ id });
      }
    } catch {
      console.error("Handling of messaging token failed");
      response.status(500).send();
    }
  }
  response.status(200).send();
};
