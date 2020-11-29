import * as admin from "firebase-admin";
import { getMessagingTokensId } from "../messagingToken/messagingToken";

export interface Notification {
  title: string;
  body: string;
  url: string;
  icon: string;
}

export const sentNotification = async ({
  title = "",
  body = "",
  url = "",
  icon = "",
}: Notification) => {
  const tokens: string[] = await getMessagingTokensId();

  const message = {
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

  return;
};
