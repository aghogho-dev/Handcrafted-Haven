import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import { compare } from "bcryptjs";

const clientPromise = MongoClient.connect(process.env.MONGODB_URI!);

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const usersCollection = client.db("haven").collection("users");

                const user = await usersCollection.findOne({ email: credentials!.email });

                if (!user) {
                    throw new Error("No user found with the provided email.");
                }

                const isValidPassword = await compare(credentials!.password, user.password);
                if (!isValidPassword) {
                    throw new Error("Invalid password.");
                }

                return { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
            }
        })
    ],

    pages: {
        signIn: "/login",
        error: "/auth/error"
    },
    session: {
        strategy: "jwt" as SessionStrategy,
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    callbacks: {
        async jwt({ token, user}: { token: any, user?: any }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.role = token.role;
            }
            return session;
        }
    }
};

export default NextAuth(authOptions);