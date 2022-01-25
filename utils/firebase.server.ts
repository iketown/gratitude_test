import type { ParsedUrlQuery } from "querystring";
import { startOfWeek, endOfWeek, add, format } from "date-fns";
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import nookies from "nookies";
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

export const getUserTagSet = async (user_id: string) => {
  if (!user_id) throw new Error("no user id supplied to getUserTagSet");
  const myTagsetRef = adminDB
    .collection("users")
    .doc(user_id)
    .collection("tags")
    .doc("my_tagset");
  const myTagSet = await myTagsetRef
    .get()
    .then((doc) => doc.exists && doc.data());
  return myTagSet;
};
