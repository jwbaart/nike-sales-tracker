import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export interface Notification {
  title: string;
  body: string;
  url: string;
  imageUrl: string;
}

export const sentNotification = async ({
  title = "",
  body = "",
  url = "",
  imageUrl = "",
}: Notification) => {
  // const mobileToken: string = functions.config().cmtoken.chromemobile;
  const prodToken: string = functions.config().cmtoken.chromedesktop;

  const tokens: string[] = [prodToken];

  const message = {
    notification: {
      title,
      body,
      imageUrl,
    },
    data: {
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
