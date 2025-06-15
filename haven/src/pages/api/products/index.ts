import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("haven");
    const collection = db.collection("products");

    if (req.method === "GET") {

        try {

            const { createdBy } = req.query;

        // if (!createdBy || typeof createdBy !== "string") {
        //     return res.status(400).json({ message: "Missing or invaled createdBy param" });
        // }

            const query = createdBy && typeof createdBy === "string" ? { createdBy } : {};

            const products = await collection.find(query).toArray();
            return res.status(200).json(products);

        } catch (error) {
            console.error("Failed to fetch products:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        
    }

    // res.setHeader("Allow", ["GET"]);
    // res.status(405).end(`Method ${req.method} Not Allowed`);
}