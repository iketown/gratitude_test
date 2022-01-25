import * as admin from "firebase-admin";

//
if (!admin.apps.length) {
  const GAC = process.env.GOOGLE_APPLICATION_CREDENTIALS!;
  const credential = JSON.parse(Buffer.from(GAC, "base64").toString());
  admin.initializeApp({
    credential: admin.credential.cert(credential),
    databaseURL: "https://sparks-33f0a.firebaseio.com",
  });
}
export const adminAuth = admin.auth();
export const adminDB = admin.firestore();
