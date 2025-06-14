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

    if (req.method === "PUT") {
        try {
            const { _id, ...update } = req.body;
            const result = await db.collection("products").updateOne(
                { _id: new ObjectId(id as string) },
                { $set: update }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "Product not found" });
            }

            return res.status(200).json({ message: "Product updated successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to update product" });
        }
    } else {
        res.setHeader("Allow", ["PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}