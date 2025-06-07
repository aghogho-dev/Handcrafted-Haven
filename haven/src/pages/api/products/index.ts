import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("haven");
    const collection = db.collection("products");

    if (req.method === "GET") {
        const { createdBy } = req.query;

        if (!createdBy || typeof createdBy !== "string") {
            return res.status(400).json({ message: "Missing or invaled createdBy param" });
        }

        const products = await collection.find({ createdBy }).toArray();
        return res.status(200).json(products);
    }

    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}