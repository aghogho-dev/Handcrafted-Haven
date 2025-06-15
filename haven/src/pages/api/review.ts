import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Not authenticated" });

    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        const client = await clientPromise;
        const db = client.db("haven");
        const products = db.collection("products");

        const review = {
            userEmail: session.user.email,
            rating: parseInt(rating),
            comment,
            createdAt: new Date()
        };

        await products.updateOne(
            { _id: new (require("mongodb").ObjectId)(productId) },
            { $push: { reviews: review } as any }
        );

        res.status(200).json({ message: "Review added" });

    } catch (error) {
        console.error("Review error:", error);
        res.status(500).json({ message: "Server error" });
    }

}