import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export interface Notification {
  title: string;
  body: string;
}

export const sentNotification = async ({
  title = "",
  body = "",
}: Notification) => {
  console.log("Sent notification", title, body);

  //   const mobileToken: string = functions.config().cmtoken.chromemobile;
  const prodToken: string = functions.config().cmtoken.chromedesktop;

  const tokens: string[] = [prodToken];
  const payload = {
    notification: {
      title,
      body,
    },
  };
  return admin.messaging().sendToDevice(tokens, payload).catch(console.error);
};
