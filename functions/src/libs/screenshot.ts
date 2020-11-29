import puppeteer from "puppeteer";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const generateScreenShot = async (
  page: puppeteer.Page
): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // Take the screenshot
      const imageBuffer: string = await page.screenshot();

      resolve(imageBuffer);
    } catch (err) {
      reject(err);
    }
  });
};

export const saveScreenShot = async (
  imageBuffer: string,
  name: string
): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    if (!imageBuffer || imageBuffer === "") {
      reject("No screenshot");
      return;
    }

    try {
      // We get the instance of our default bucket
      const bucket = admin
        .storage()
        .bucket(functions.config().bucket.defaultname);

      // Create a file object
      const file = bucket.file(`/screenshots/${name}.png`);

      // Save the image
      await file.save(imageBuffer);

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
