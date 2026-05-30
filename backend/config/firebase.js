import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve("serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    "\n\n❌ Required file 'serviceAccountKey.json' was not found in the backend root directory.\n" +
    "👉 Please download a service account private key from Firebase Console -> Project Settings -> Service Accounts, rename it to 'serviceAccountKey.json', and save it in backend/.\n\n"
  );
}

let db = null;

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  
  initializeApp({
    credential: cert(serviceAccount)
  });
  
  db = getFirestore();
  console.log("🔥 Firebase Admin SDK initialized. Connected to Firestore successfully.");
} catch (error) {
  console.error("❌ Failed to parse or initialize serviceAccountKey.json:", error.message);
  throw error;
}

export { db };
