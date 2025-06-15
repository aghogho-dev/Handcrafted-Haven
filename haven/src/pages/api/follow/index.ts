import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { followerEmail, followingEmail } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("haven");

    await db.collection("follows").updateOne(
      { followerEmail, followingEmail },
      { $set: { followerEmail, followingEmail } },
      { upsert: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Database error" });
  }
}
