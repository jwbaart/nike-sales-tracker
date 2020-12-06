import * as admin from "firebase-admin";
import { getMessagingTokensId } from "../messagingToken/firestore/firestore";

export interface Notification {
  title: string;
  body?: string;
  icon?: string;
  url?: string;
}

export const sentNotification = async ({
  title = "",
  body = "",
  icon = "",
  url = "",
}: Notification) => {
  const tokens: string[] = await getMessagingTokensId();

  if (tokens.length) {
    const message: admin.messaging.MulticastMessage = {
      // This will directly send a notification to the user without fiddling in the service worker
      // notification: {
      //   title,
      //   body,
      // },
      data: {
        title,
        body,
        icon,
        url,
      },
      tokens,
    };

    const sendMulticastResult = await admin.messaging().sendMulticast(message);

    if (sendMulticastResult.failureCount) {
      sendMulticastResult.responses.forEach((response) =>
        console.error("sentNotification sending error", response.error)
      );
    }
  }

  return;
};
