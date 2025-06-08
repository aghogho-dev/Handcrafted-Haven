import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, bio, contact, email } = req.body;

    if (!name || !bio || !contact || !email) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const client = await clientPromise;

        const result = await client.db("haven").collection('profiles').updateOne(
            { email },
            { $set: { name, bio, contact } },
            { upsert: true }
        );

        return res.status(200).json({ message: "Profile saved successfully", result });
    } catch (error) {
        console.error("Error saving profile:", error);
        return res.status(500).json({ error: "Failed to save profile" });
    }
}