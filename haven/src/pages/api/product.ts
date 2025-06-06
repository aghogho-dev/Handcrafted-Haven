import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== "artisan") {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    if (req.method === "POST") {
        const { title, description, price, image, category, createdBy } = req.body;

        if (!title || !description || !price || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }

        try {
            const client = await clientPromise;
            const db = client.db("haven");
            const product = { title, description, price: parseFloat(price), category, createdBy, createdAt: new Date() };

            const result = await db.collection("products").insertOne(product);

            res.status(201).json({ message: "Product created", productId: result.insertedId });
           
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ error: "Failed to create product" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
