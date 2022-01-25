// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { adminAuth } from "~/utils/firebase.server";

type Data = {
  name: string;
  credential: any;
  cooks: any;
  decodedToken: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const GAC = process.env.GOOGLE_APPLICATION_CREDENTIALS!;
  const credential = JSON.parse(Buffer.from(GAC, "base64").toString());
  const cooks = nookies.get({ req });
  let decodedToken;
  if (cooks.token) {
    decodedToken = await adminAuth.verifyIdToken(cooks.token);
  }
  res.status(200).json({ name: "John Doe", credential, cooks, decodedToken });
}
