import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

type Data = {
    message: string;
    userInfo?: {
        name: string;
        email: string;
        role: string;
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== "POST") {
        return res.status(405).json({message: "Method not allowed"});
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({message: "All fields are required"});
    }

    if (!["user", "artisan"].includes(role)) {
        return res.status(400).json({message: "Invalid role"});
    }

    try {
        const client = await clientPromise;
        const db = client.db("haven");
        const users = db.collection("users");

        const existing = await users.findOne({ email });
        if (existing) {
            return res.status(409).json({message: "Email already registered"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await users.insertOne({
            name,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date(),
        });

        return res.status(201).json({
            message: "Register successfully",
            userInfo: { name, email, role},
        });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({message: "Internal server error"});
    }
}