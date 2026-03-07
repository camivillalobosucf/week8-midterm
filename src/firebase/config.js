import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REPLACED_API_KEY",
  authDomain: "REPLACED_AUTH_DOMAIN",
  projectId: "REPLACED_PROJECT_ID",
  storageBucket: "REPLACED_STORAGE_BUCKET",
  messagingSenderId: "REPLACED_SENDER_ID",
  appId: "REPLACED_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
