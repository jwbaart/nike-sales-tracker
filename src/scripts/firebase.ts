import firebase from "firebase/app";
import axios from "axios";

let firebaseConfig: firebase.app.App;

export const initializeFirebase = async () => {
  if (firebase.apps.length === 0) {
    const firebaseConfigResponse = await axios.get("/__/firebase/init.json");
    const firebaseConfigFromServer = await firebaseConfigResponse.data;

    // AppId is missing on hosting environment
    // https://github.com/firebase/firebase-js-sdk/issues/2287#issuecomment-553860831
    const appId = "1:926644409140:web:de1896577fbaa28dbecb61";
    // const projectId = "nike-sales-tracker";
    const completedFirebaseConfig = {
      ...firebaseConfigFromServer,
      appId,
      // projectId,
    };

    firebaseConfig = firebase.initializeApp(completedFirebaseConfig);
  }

  return firebaseConfig;
};
