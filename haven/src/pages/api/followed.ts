import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userEmail } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db("haven");

    const follows = await db.collection("follows").find({ followerEmail: userEmail }).toArray();
    const followedEmails = follows.map(f => f.followingEmail);

    const products = await db.collection("products").find({
      createdBy: { $in: followedEmails }
    }).toArray();

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load followed products" });
  }
}
