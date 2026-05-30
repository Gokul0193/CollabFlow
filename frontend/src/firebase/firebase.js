import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCm-1UIjk_vnHYFF_KptdYa3qRSi4bO_XA",
  authDomain: "collabflow-816fc.firebaseapp.com",
  projectId: "collabflow-816fc",
  storageBucket: "collabflow-816fc.firebasestorage.app",
  messagingSenderId: "166926184540",
  appId: "1:166926184540:web:98b6044af835e7ab0c3699",
  measurementId: "G-SQ2GFXEJHK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export default app;