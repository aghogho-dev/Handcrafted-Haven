import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("haven");

    const { id } = req.query;

    if (req.method === "DELETE") {
        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        try {
            const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Product not found" });
            }

            return res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            console.error("Error deleting product:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}