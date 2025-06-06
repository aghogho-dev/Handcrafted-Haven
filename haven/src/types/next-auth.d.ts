import NextAuth from "next-auth";
import { UserRole } from "@/types/user";

declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            id?: string;
            role?: UserRole;
        };
    }

    interface User {
        id: string;
        email: string;
        name?: string | null;
        role?: UserRole;
    }
}