import * as functions from "firebase-functions";
import axios from "axios";

export const createIconOfPublicImage = async (
  imageUrl: string,
  width: number = 50
): Promise<string> => {
  let iconUrl: string = "";

  if (process.env.FUNCTIONS_EMULATOR) {
    // Stub to prevent unnecessary API calls
    iconUrl = "https://cdn.filestackcontent.com/HfaoCN9aRPGARnqlSg3q";
  } else {
    try {
      const apiKey = functions.config().filestack.apikey;
      const apiUrl = `https://cdn.filestackcontent.com/${apiKey}/resize=width:${width}/${imageUrl}`;
      const imageStoreResult = await axios.post(apiUrl, { url: imageUrl });
      iconUrl = imageStoreResult.data.url;
      if (!iconUrl.length) {
        throw new Error('createIconOfPublicImage - Received empty icon url');
      }
    } catch {
      console.warn("createIconOfPublicImage - creation of icon failed");
    }
  }
  
  console.log('createIconOfPublicImage - iconUrl, iconUrl')
  return iconUrl;
};
