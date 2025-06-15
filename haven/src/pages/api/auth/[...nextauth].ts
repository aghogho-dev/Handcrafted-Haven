import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import { compare } from "bcryptjs";
import { UserRole } from "@/types/UserRole";

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
                console.log("---Authorize function started---")
                console.log("Received credentials:", credentials);

                if (!credentials || !credentials.email || !credentials.password) {
                    console.log("Authorize: Missing email or password in credentials.");
                    return null; 
                }
                const client = await clientPromise;
                const db = client.db("haven");

                const email = credentials.email;
                const password = credentials.password;

                let account = await db.collection("users").findOne({ email });
                let accountType = "user";
                
                
                if (!account) {
                    account = await db.collection("artisans").findOne({ email });
                    accountType = "artisan";
                }

                if (!account) {
                    throw new Error("No account found with the given email.");
                }

                const isValidPassword = await compare(credentials!.password, account.password);

                if (!isValidPassword) {
                    throw new Error("Invalid password.");
                }

                return { id: account._id.toString(), email: account.email, name: account.name, role: account.role };
                
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
                token.role = (user as any).role as UserRole;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.role = token.role as UserRole;
            }
            return session;
        }
    }
};

export default NextAuth(authOptions);