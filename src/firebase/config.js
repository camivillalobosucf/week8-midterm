import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REMOVED",
  authDomain: "babytrack-223fb.firebaseapp.com",
  projectId: "babytrack-223fb",
  storageBucket: "babytrack-223fb.firebasestorage.app",
  messagingSenderId: "593639473123",
  appId: "1:593639473123:web:74dd8fe35f0eb0413aead6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
