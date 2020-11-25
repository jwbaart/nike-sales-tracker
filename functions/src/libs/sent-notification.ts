import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

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
  const chromeMobileToken: string = functions.config().cmtoken.chromemobile;
  const chromeDesktopToken: string = functions.config().cmtoken.chromedesktop;
  // const chromeLocalhostToken: string = functions.config().cmtoken
  //   .chromelocalhost;

  const tokens: string[] = [chromeDesktopToken, chromeMobileToken];

  const message = {
    notification: {
      title,
      body,
    },
    data: {
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
